import OpenAI from "openai";

/** Local demo responses when OpenAI quota is unavailable (development / NEXVO_DEMO_MODE). */
export function generateDemoAnswer(question: string): string {
  return `Nexvo demo recommendations (live AI unavailable):

**Your question:** ${question}

## Quick Buying Tips
- Prioritize return policy and warranty before chasing the lowest price.
- Compare total cost including shipping and platform vouchers.
- Check recent verified buyer reviews, not sponsored listicles.

### 1. Best Overall
**Anker Soundcore Space Q45**
Search Keyword: Anker Soundcore Space Q45 headphones
Price: SGD 149
Summary: Strong noise cancellation and battery for daily commutes.
Best for: Commuters and frequent flyers
Warranty: 18 months manufacturer warranty
Key Specs:
- Hybrid ANC
- 50-hour battery
- Multipoint Bluetooth
Pros:
- Excellent value for ANC
- Comfortable ear cushions
Cons:
- App EQ takes tweaking
- No wired aux in box

### 2. Best Value
**Sony WH-CH720N**
Search Keyword: Sony WH-CH720N wireless headphones
Price: SGD 99
Summary: Lighter fit with balanced sound at a lower price point.
Best for: All-day office use
Warranty: 1 year Sony warranty
Pros:
- Lightweight design
- Clear mic for calls
Cons:
- Weaker ANC than premium picks

### 3. Best for iPhone
**Apple AirPods Pro (2nd gen)**
Search Keyword: Apple AirPods Pro 2nd generation
Price: SGD 349
Summary: Best ecosystem integration and spatial audio for Apple users.
Best for: iPhone and Mac users
Warranty: 1 year Apple limited warranty
Pros:
- Seamless Apple device switching
- Strong transparency mode
Cons:
- Premium price
- Average Android experience

### 4. Runner-up
**Bose QuietComfort Ultra**
Search Keyword: Bose QuietComfort Ultra headphones
Price: SGD 499
Summary: Premium comfort and call quality for frequent travelers.
Best for: Long-haul travel
Warranty: 1 year Bose warranty
Pros:
- Class-leading comfort
- Strong call clarity
Cons:
- Highest price in list

### 5. Budget Pick
**Soundcore by Anker Q20i**
Search Keyword: Soundcore Q20i headphones
Price: SGD 79
Summary: Affordable ANC with solid basics for occasional use.
Best for: Budget-conscious buyers
Warranty: 12 months
Pros:
- Lowest price with ANC
Cons:
- Plastic build feel

**Why:** Nexvo verifies choices for people—not merchant-sponsored rankings.`;
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
