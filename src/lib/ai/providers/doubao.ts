import OpenAI from "openai";
import type { ChatResponse, ChatRequest, ChatProvider } from "../types";

function createClient(): { client: OpenAI; model: string } {
  const apiKey = process.env.DOUBAO_API_KEY;
  const baseURL = process.env.DOUBAO_BASE_URL;
  const model = process.env.DOUBAO_MODEL;

  if (!apiKey) {
    throw new Error("DOUBAO_API_KEY is not configured");
  }
  if (!baseURL) {
    throw new Error("DOUBAO_BASE_URL is not configured");
  }
  if (!model) {
    throw new Error("DOUBAO_MODEL is not configured");
  }

  return {
    client: new OpenAI({ apiKey, baseURL }),
    model,
  };
}

export const doubaoProvider: ChatProvider = {
  async chat(req: ChatRequest): Promise<ChatResponse> {
    const { client, model } = createClient();
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: req.prompt }],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("empty_completion");
    }

    return {
      content,
      model,
      provider: "doubao",
    };
  },
};

