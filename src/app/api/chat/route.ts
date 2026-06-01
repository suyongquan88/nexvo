import OpenAI from "openai";
import { chat } from "@/lib/ai";
import { generateDemoAnswer, shouldFallbackToDemo } from "@/lib/demo-answer";
import { mapOpenAiError } from "@/lib/openai-errors";

const MAX_QUESTION_LENGTH = 4000;

type ChatSuccessBody = {
  answer: string;
  model: string;
  provider: string;
  demo?: boolean;
};
type ChatErrorBody = { error: string; code?: string };

function jsonResponse<T extends ChatSuccessBody | ChatErrorBody>(
  body: T,
  status: number
): Response {
  return Response.json(body, { status });
}

function logApiError(context: string, error: unknown): void {
  if (error instanceof OpenAI.APIError) {
    console.error(`[NEXVO API] ${context}`, {
      status: error.status,
      message: error.message,
      code: error.code,
      type: error.type,
      requestId: error.requestID,
    });
    return;
  }

  console.error(`[NEXVO API] ${context}`, error);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    logApiError("Invalid JSON body", error);
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ error: "Request body must be a JSON object." }, 400);
  }

  const question = (body as { question?: unknown }).question;

  if (typeof question !== "string") {
    return jsonResponse({ error: "Question is required." }, 400);
  }

  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return jsonResponse({ error: "Question cannot be empty." }, 400);
  }

  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return jsonResponse(
      { error: `Question must be at most ${MAX_QUESTION_LENGTH} characters.` },
      400
    );
  }

  try {
    const result = await chat(trimmed);
    return jsonResponse(
      { answer: result.content, model: result.model, provider: result.provider },
      200
    );
  } catch (error) {
    logApiError("AI request failed", error);

    if (shouldFallbackToDemo(error)) {
      console.warn(
        "[NEXVO API] Using demo fallback (quota unavailable or NEXVO_DEMO_MODE=true)"
      );
      return jsonResponse(
        {
          answer: generateDemoAnswer(trimmed),
          model: "demo",
          provider: "demo",
          demo: true,
        },
        200
      );
    }

    if (error instanceof Error && error.message === "empty_completion") {
      return jsonResponse(
        { error: "No answer was generated. Please try again." },
        502
      );
    }

    if (error instanceof OpenAI.APIError) {
      const { status, body: errorBody } = mapOpenAiError(error);
      return jsonResponse(errorBody, status);
    }

    return jsonResponse(
      { error: "An unexpected error occurred. Please try again." },
      500
    );
  }
}
