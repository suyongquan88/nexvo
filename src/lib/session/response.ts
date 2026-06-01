import { NextResponse } from "next/server";
import { buildSessionCookie } from "@/lib/session/cookie";
import { toSessionPayload } from "@/lib/session/serialize";
import type { SessionPayload } from "@/lib/session/types";
import type { findSessionByToken } from "@/lib/session/repository";

type SessionRecord = NonNullable<Awaited<ReturnType<typeof findSessionByToken>>>;

export function jsonSessionResponse(
  session: SessionRecord,
  options?: { setCookie?: boolean; token?: string }
) {
  const body: SessionPayload = toSessionPayload(session);
  const response = NextResponse.json(body);

  if (options?.setCookie && options.token) {
    response.cookies.set(buildSessionCookie(options.token));
  }

  return response;
}
