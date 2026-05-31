import { APIError } from "openai";

export type ChatApiErrorBody = {
  error: string;
  code?: string;
};

export function mapOpenAiError(error: APIError): {
  status: number;
  body: ChatApiErrorBody;
} {
  if (error.code === "insufficient_quota") {
    return {
      status: 402,
      body: {
        code: "insufficient_quota",
        error:
          "OpenAI API quota is exhausted. Add billing at platform.openai.com/account/billing, or set NEXVO_DEMO_MODE=true in .env.local for demo responses.",
      },
    };
  }

  if (error.status === 429 || error.code === "rate_limit_exceeded") {
    return {
      status: 429,
      body: {
        code: "rate_limit_exceeded",
        error: "OpenAI rate limit reached. Please wait a moment and try again.",
      },
    };
  }

  if (error.status === 401 || error.status === 403) {
    return {
      status: 503,
      body: {
        code: "auth_error",
        error: "AI service authentication failed. Check OPENAI_API_KEY in .env.local.",
      },
    };
  }

  return {
    status: 502,
    body: {
      code: "upstream_error",
      error: "Unable to generate an answer. Please try again.",
    },
  };
}
