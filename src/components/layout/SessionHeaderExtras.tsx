"use client";

import { useVisitorSession } from "@/hooks/useVisitorSession";

export function SessionHeaderExtras() {
  const { loading, session } = useVisitorSession();

  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2 text-xs font-medium text-nexvo-muted sm:gap-3 sm:text-sm"
      aria-busy={loading}
    >
      <span title="Search history count">
        History{" "}
        <span className="tabular-nums text-nexvo-purple-700">
          {loading ? "—" : session.stats.historyCount}
        </span>
      </span>
      <span className="hidden text-nexvo-border sm:inline" aria-hidden>
        |
      </span>
      <span title="Favorites count">
        Favorites{" "}
        <span className="tabular-nums text-nexvo-purple-700">
          {loading ? "—" : session.stats.favoriteCount}
        </span>
      </span>
      <span className="hidden text-nexvo-border sm:inline" aria-hidden>
        |
      </span>
      <label className="inline-flex items-center gap-1.5">
        <span className="sr-only">Language (coming soon)</span>
        <select
          value={session.locale}
          disabled
          aria-disabled="true"
          title="Language selection will be available in a later update"
          className="cursor-not-allowed rounded-md border border-nexvo-border bg-white/80 px-2 py-1 text-nexvo-muted opacity-80"
        >
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
      </label>
    </div>
  );
}
