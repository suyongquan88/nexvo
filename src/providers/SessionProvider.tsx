"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@prisma/client";
import type { SessionPayload } from "@/lib/session/types";

type SessionContextValue = {
  ready: boolean;
  locale: Locale;
  stats: SessionPayload["stats"];
  session: SessionPayload;
  setLocale: (locale: Locale) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const defaultStats: SessionPayload["stats"] = {
  historyCount: 0,
  favoriteCount: 0,
};

async function fetchSessionPayload(): Promise<SessionPayload> {
  const response = await fetch("/api/session", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Unable to initialize session.");
  }

  return (await response.json()) as SessionPayload;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("en");
  const [stats, setStats] = useState(defaultStats);

  const applyPayload = useCallback((payload: SessionPayload) => {
    setLocaleState(payload.locale);
    setStats(payload.stats);
  }, []);

  const refreshSession = useCallback(async () => {
    const payload = await fetchSessionPayload();
    applyPayload(payload);
  }, [applyPayload]);

  const setLocale = useCallback(
    async (next: Locale) => {
      const previous = locale;
      setLocaleState(next);

      try {
        const response = await fetch("/api/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ locale: next }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Unable to update locale.");
        }

        applyPayload((await response.json()) as SessionPayload);
      } catch (error) {
        setLocaleState(previous);
        throw error;
      }
    },
    [applyPayload, locale]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const payload = await fetchSessionPayload();
        if (!cancelled) {
          applyPayload(payload);
        }
      } catch (error) {
        console.error("[SessionProvider]", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyPayload]);

  const session = useMemo<SessionPayload>(
    () => ({ locale, stats }),
    [locale, stats]
  );

  const value = useMemo(
    () => ({
      ready,
      locale,
      stats,
      session,
      setLocale,
      refreshSession,
    }),
    [ready, locale, stats, session, setLocale, refreshSession]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within SessionProvider");
  }
  return context;
}
