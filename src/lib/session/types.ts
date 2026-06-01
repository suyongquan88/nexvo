import type { Locale } from "@prisma/client";

export type SessionStats = {
  historyCount: number;
  favoriteCount: number;
};

export type SessionPayload = {
  locale: Locale;
  stats: SessionStats;
};
