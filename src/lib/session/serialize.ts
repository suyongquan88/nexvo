import type { Locale, VisitorSession } from "@prisma/client";
import type { SessionPayload } from "@/lib/session/types";

type SessionWithCounts = VisitorSession & {
  _count: {
    searchHistory: number;
    favorites: number;
  };
};

export function toSessionPayload(session: SessionWithCounts): SessionPayload {
  return {
    locale: session.locale,
    stats: {
      historyCount: session._count.searchHistory,
      favoriteCount: session._count.favorites,
    },
  };
}

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh";
}
