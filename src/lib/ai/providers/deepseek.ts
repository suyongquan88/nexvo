import OpenAI from "openai";
import type { ChatResponse, ChatRequest, ChatProvider } from "../types";

const MODEL = "deepseek-chat";

function createClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

export const deepseekProvider: ChatProvider = {
  async chat(req: ChatRequest): Promise<ChatResponse> {
    const client = createClient();
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: req.prompt }],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("empty_completion");
    }

    return {
      content,
      model: MODEL,
      provider: "deepseek",
    };
  },
};

