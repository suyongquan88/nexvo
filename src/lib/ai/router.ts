import type { ChatRequest, ChatResponse } from "./types";
import { deepseekProvider } from "./providers/deepseek";
import { doubaoProvider } from "./providers/doubao";

async function route(req: ChatRequest): Promise<ChatResponse> {
  if (req.prompt.length < 300) {
    return doubaoProvider.chat(req);
  }

  return deepseekProvider.chat(req);
}

export async function chat(prompt: string): Promise<ChatResponse> {
  return route({ prompt });
}

