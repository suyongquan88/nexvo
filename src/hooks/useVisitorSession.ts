import { useSessionContext } from "@/providers/SessionProvider";

export function useVisitorSession() {
  const { session, stats, ready, refreshSession } = useSessionContext();

  return {
    session,
    stats,
    loading: !ready,
    refresh: refreshSession,
  };
}

export { useSessionContext } from "@/providers/SessionProvider";
