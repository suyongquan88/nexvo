import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/session/constants";
import { createVisitorSession } from "@/lib/session/repository";
import { ensureSessionFromRequest } from "@/lib/session/ensure-session";

async function clearSessionData() {
  await prisma.favorite.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.recommendationSnapshot.deleteMany();
  await prisma.visitorSession.deleteMany();
}

function requestWithCookie(token?: string) {
  const headers = new Headers();
  if (token) {
    headers.set("cookie", `${SESSION_COOKIE_NAME}=${token}`);
  }
  return new Request("http://localhost/api/session", { headers });
}

describe("ensureSessionFromRequest", () => {
  beforeEach(async () => {
    await clearSessionData();
  });

  it("creates a session when no cookie is present", async () => {
    const result = await ensureSessionFromRequest(requestWithCookie());

    expect(result.isNew).toBe(true);
    expect(result.token).toBe(result.session.token);
  });

  it("reuses the same session when a valid cookie is present", async () => {
    const existing = await createVisitorSession("zh");
    const result = await ensureSessionFromRequest(
      requestWithCookie(existing.token)
    );

    expect(result.isNew).toBe(false);
    expect(result.session.id).toBe(existing.id);
    expect(result.session.locale).toBe("zh");
  });

  it("creates a new session when the cookie token is unknown", async () => {
    const result = await ensureSessionFromRequest(
      requestWithCookie("invalid-token-value")
    );

    expect(result.isNew).toBe(true);
    expect(result.session.token).not.toBe("invalid-token-value");
  });
});
