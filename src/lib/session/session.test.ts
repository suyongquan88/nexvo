import { describe, expect, it } from "vitest";
import { readSessionTokenFromHeader } from "@/lib/session/cookie";
import { generateSessionToken } from "@/lib/session/token";
import { toSessionPayload } from "@/lib/session/serialize";

describe("session token", () => {
  it("generates unique opaque tokens", () => {
    const a = generateSessionToken();
    const b = generateSessionToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });
});

describe("readSessionTokenFromHeader", () => {
  it("reads nexvo_sid from cookie header", () => {
    const token = "abc123";
    const header = `foo=bar; nexvo_sid=${token}; other=baz`;
    expect(readSessionTokenFromHeader(header)).toBe(token);
  });

  it("returns undefined when cookie is missing", () => {
    expect(readSessionTokenFromHeader("foo=bar")).toBeUndefined();
    expect(readSessionTokenFromHeader(null)).toBeUndefined();
  });
});

describe("toSessionPayload", () => {
  it("maps prisma session to API payload", () => {
    expect(
      toSessionPayload({
        id: "c1",
        token: "secret",
        locale: "zh",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { searchHistory: 3, favorites: 1 },
      })
    ).toEqual({
      locale: "zh",
      stats: { historyCount: 3, favoriteCount: 1 },
    });
  });
});
