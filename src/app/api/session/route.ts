import { NextResponse } from "next/server";
import type { Locale } from "@prisma/client";
import { ensureSessionFromCookies } from "@/lib/session/ensure-session";
import { getSessionFromCookies } from "@/lib/session/get-session";
import { jsonSessionResponse } from "@/lib/session/response";
import {
  createVisitorSession,
  touchVisitorSession,
  updateVisitorSessionLocale,
} from "@/lib/session/repository";
import { isLocale } from "@/lib/session/serialize";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const { session, token, isNew } = await ensureSessionFromCookies();
    return jsonSessionResponse(session, {
      setCookie: isNew,
      token,
    });
  } catch (error) {
    console.error("[NEXVO API] GET /api/session", error);
    return errorResponse("Unable to load session.", 500);
  }
}

export async function POST(req: Request) {
  try {
    const existing = await getSessionFromCookies();

    if (existing) {
      const refreshed = await touchVisitorSession(existing.id);
      return jsonSessionResponse(refreshed);
    }

    let locale: Locale | undefined;

    try {
      const body = await req.json();
      if (body && typeof body === "object" && !Array.isArray(body)) {
        const raw = (body as { locale?: unknown }).locale;
        if (isLocale(raw)) {
          locale = raw;
        }
      }
    } catch {
      // empty body is fine
    }

    const session = await createVisitorSession(locale);
    return jsonSessionResponse(session, {
      setCookie: true,
      token: session.token,
    });
  } catch (error) {
    console.error("[NEXVO API] POST /api/session", error);
    return errorResponse("Unable to create session.", 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionFromCookies();

    if (!session) {
      return errorResponse("No active session.", 401);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body.", 400);
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("Request body must be a JSON object.", 400);
    }

    const locale = (body as { locale?: unknown }).locale;
    if (!isLocale(locale)) {
      return errorResponse('locale must be "en" or "zh".', 400);
    }

    const updated = await updateVisitorSessionLocale(session.id, locale);
    return jsonSessionResponse(updated);
  } catch (error) {
    console.error("[NEXVO API] PATCH /api/session", error);
    return errorResponse("Unable to update session.", 500);
  }
}
