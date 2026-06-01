import type { Locale } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { generateSessionToken } from "@/lib/session/token";

const sessionInclude = {
  _count: {
    select: {
      searchHistory: true,
      favorites: true,
    },
  },
} as const;

export async function findSessionByToken(token: string) {
  return prisma.visitorSession.findUnique({
    where: { token },
    include: sessionInclude,
  });
}

export async function createVisitorSession(locale: Locale = "en") {
  return prisma.visitorSession.create({
    data: {
      token: generateSessionToken(),
      locale,
    },
    include: sessionInclude,
  });
}

export async function touchVisitorSession(sessionId: string) {
  return prisma.visitorSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
    include: sessionInclude,
  });
}

export async function updateVisitorSessionLocale(sessionId: string, locale: Locale) {
  return prisma.visitorSession.update({
    where: { id: sessionId },
    data: { locale },
    include: sessionInclude,
  });
}

export type VisitorSessionWithCounts = NonNullable<
  Awaited<ReturnType<typeof findSessionByToken>>
>;
