import type { Locale } from "@prisma/client";
import { readSessionTokenFromHeader } from "@/lib/session/cookie";
import { getSessionFromCookies } from "@/lib/session/get-session";
import {
  createVisitorSession,
  findSessionByToken,
  touchVisitorSession,
  type VisitorSessionWithCounts,
} from "@/lib/session/repository";

export type EnsureSessionResult = {
  session: VisitorSessionWithCounts;
  token: string;
  isNew: boolean;
};

/**
 * Resolves the visitor session from a Request Cookie header.
 * Creates a new session when the cookie is missing or invalid.
 */
export async function ensureSessionFromRequest(
  request: Request,
  options?: { locale?: Locale }
): Promise<EnsureSessionResult> {
  const token = readSessionTokenFromHeader(request.headers.get("cookie"));

  if (token) {
    const existing = await findSessionByToken(token);
    if (existing) {
      const session = await touchVisitorSession(existing.id);
      return { session, token, isNew: false };
    }
  }

  const session = await createVisitorSession(options?.locale ?? "en");
  return { session, token: session.token, isNew: true };
}

/**
 * Resolves the visitor session from Next.js cookies() (Server Components / Route Handlers).
 */
export async function ensureSessionFromCookies(
  options?: { locale?: Locale }
): Promise<EnsureSessionResult> {
  const existing = await getSessionFromCookies();

  if (existing) {
    const session = await touchVisitorSession(existing.id);
    return { session, token: session.token, isNew: false };
  }

  const session = await createVisitorSession(options?.locale ?? "en");
  return { session, token: session.token, isNew: true };
}
