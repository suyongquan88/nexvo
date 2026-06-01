import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  createVisitorSession,
  findSessionByToken,
  touchVisitorSession,
  updateVisitorSessionLocale,
} from "@/lib/session/repository";

async function clearSessionData() {
  await prisma.favorite.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.recommendationSnapshot.deleteMany();
  await prisma.visitorSession.deleteMany();
}

describe("session repository", () => {
  beforeEach(async () => {
    await clearSessionData();
  });

  it("creates a visitor session with a unique token", async () => {
    const session = await createVisitorSession("en");

    expect(session.token).toBeTruthy();
    expect(session.locale).toBe("en");
    expect(session._count.searchHistory).toBe(0);
    expect(session._count.favorites).toBe(0);
  });

  it("finds session by cookie token", async () => {
    const created = await createVisitorSession();
    const found = await findSessionByToken(created.token);

    expect(found?.id).toBe(created.id);
  });

  it("refreshes updatedAt on touch", async () => {
    const session = await createVisitorSession();
    const before = session.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 20));

    const touched = await touchVisitorSession(session.id);
    expect(touched.updatedAt.getTime()).toBeGreaterThan(before);
  });

  it("persists locale updates", async () => {
    const session = await createVisitorSession("en");
    const updated = await updateVisitorSessionLocale(session.id, "zh");

    expect(updated.locale).toBe("zh");

    const again = await findSessionByToken(session.token);
    expect(again?.locale).toBe("zh");
  });
});
