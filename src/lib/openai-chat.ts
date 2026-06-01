import OpenAI from "openai";

const MODEL = "gpt-4o-mini";
const MAX_RETRIES = 3;
const INITIAL_RETRY_MS = 800;

export const NEXVO_SYSTEM_PROMPT = `You are Nexvo.

Mission:
Help people make better choices.

When recommending products, list exactly 5 options using this structure for each:

### 1. Best Overall
**Exact Product Name**
Search Keyword: brand model category keywords for marketplace search
Price: SGD amount or estimate
Summary: one sentence why it fits
Ideal for: who this is ideal for
Warranty: warranty period
Key Specs:
- spec one
- spec two
Pros:
- pro one
Cons:
- con one

After all 5 products, you may add a "## Quick Buying Tips" section (not a product).

Use real product names (never use the category title as the product name). No sponsored rankings.`;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableRateLimit(error: unknown): boolean {
  if (!(error instanceof OpenAI.APIError)) return false;
  if (error.code === "insufficient_quota") return false;
  return error.status === 429 || error.code === "rate_limit_exceeded";
}

export async function createNexvoCompletion(
  client: OpenAI,
  question: string
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: NEXVO_SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      });

      const answer = completion.choices[0]?.message?.content?.trim();
      if (!answer) {
        throw new Error("empty_completion");
      }

      return answer;
    } catch (error) {
      lastError = error;

      if (error instanceof Error && error.message === "empty_completion") {
        throw error;
      }

      if (!isRetryableRateLimit(error) || attempt === MAX_RETRIES - 1) {
        throw error;
      }

      const delay = INITIAL_RETRY_MS * 2 ** attempt;
      console.warn(
        `[NEXVO API] Rate limited, retry ${attempt + 1}/${MAX_RETRIES - 1} in ${delay}ms`
      );
      await sleep(delay);
    }
  }

  throw lastError;
}
