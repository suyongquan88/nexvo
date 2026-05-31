import OpenAI from "openai";

/** Local demo responses when OpenAI quota is unavailable (development / NEXVO_DEMO_MODE). */
export function generateDemoAnswer(question: string): string {
  return `Here is a Nexvo-style recommendation while live AI is unavailable:

**Your question:** ${question}

**Recommendation:** Start with 2–3 options that match your stated budget and priorities. Compare total cost of ownership (not just sticker price), return policy, and recent verified buyer feedback—not sponsored “best of” lists.

**Why:** Nexvo is built to verify choices for people, not rank products for merchants. Without live model access, this is structured guidance you can use immediately; connect a funded OpenAI API key for personalized, model-generated advice.

**Next step:** Shortlist one option, check independent reviews, and confirm it meets your must-haves before purchasing.`;
}

export function isDemoModeEnabled(): boolean {
  return process.env.NEXVO_DEMO_MODE === "true";
}

export function shouldFallbackToDemo(error: unknown): boolean {
  if (isDemoModeEnabled()) {
    return true;
  }

  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  return (
    error instanceof OpenAI.APIError &&
    error.code === "insufficient_quota"
  );
}
