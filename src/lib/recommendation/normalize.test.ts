import { describe, expect, it } from "vitest";
import {
  cleanProductKeyword,
  cleanProductTitle,
  deriveSearchKeyword,
  normalizeProduct,
  normalizeProductTitle,
  normalizeRecommendations,
} from "./normalize";

describe("cleanProductKeyword", () => {
  it("acceptance: full noisy line", () => {
    const input =
      'Best Overall: Flexispot E5 Electric Standing Desk (48"W x 24"D) – ~$399 Recommended';

    expect(cleanProductKeyword(input)).toBe("Flexispot E5 Electric Standing Desk");
  });

  it("removes incomplete trailing open bracket", () => {
    expect(cleanProductKeyword("Flexispot E5 Electric Standing Desk (")).toBe(
      "Flexispot E5 Electric Standing Desk"
    );
  });

  it("preserves model numbers with hyphens", () => {
    expect(cleanProductKeyword("### 1. Best Overall: Sony WH-1000XM5 ~$399")).toBe(
      "Sony WH-1000XM5"
    );
  });
});

describe("cleanProductTitle", () => {
  it("removes complete dimension brackets", () => {
    expect(cleanProductTitle('Flexispot E5 Electric Standing Desk (48"W x 24"D)')).toBe(
      "Flexispot E5 Electric Standing Desk"
    );
  });

  it("removes incomplete trailing open bracket", () => {
    expect(cleanProductTitle("Flexispot E5 Electric Standing Desk (")).toBe(
      "Flexispot E5 Electric Standing Desk"
    );
  });

  it("acceptance: full noisy line", () => {
    const input =
      'Best Overall: Flexispot E5 Electric Standing Desk (48"W x 24"D) – ~$399 Recommended';

    expect(cleanProductTitle(input)).toBe("Flexispot E5 Electric Standing Desk");
  });

  it("strips markdown and rank prefixes", () => {
    expect(cleanProductTitle("### 1. Best Overall: Sony WH-1000XM5 ~$399")).toBe(
      "Sony WH-1000XM5"
    );
  });
});

describe("deriveSearchKeyword", () => {
  it("returns brand + model code", () => {
    expect(deriveSearchKeyword("Flexispot E5 Electric Standing Desk")).toBe(
      "Flexispot E5"
    );
  });

  it("acceptance keyword from full title", () => {
    const title = cleanProductTitle(
      'Best Overall: Flexispot E5 Electric Standing Desk (48"W x 24"D) – ~$399 Recommended'
    );
    expect(deriveSearchKeyword(title)).toBe("Flexispot E5");
  });
});

describe("normalizeProductTitle", () => {
  it("acceptance: title, keyword, and price", () => {
    const input =
      'Best Overall: Flexispot E5 Electric Standing Desk (48"W x 24"D) – ~$399 Recommended';

    expect(normalizeProductTitle(input)).toEqual({
      name: "Flexispot E5 Electric Standing Desk",
      searchKeyword: "Flexispot E5",
      price: "~$399",
    });
  });

  it("does not leave parentheses in name or keyword", () => {
    const result = normalizeProductTitle(
      "Flexispot E5 Electric Standing Desk ("
    );

    expect(result.name).not.toMatch(/[()]/);
    expect(result.searchKeyword).not.toMatch(/[()]/);
    expect(result.name).not.toMatch(/best overall|recommended|\$|###/i);
  });
});

describe("normalizeProduct", () => {
  it("returns structured ProductRecommendation", () => {
    const result = normalizeProduct({
      raw: "Best Overall: Flexispot E7 (48 x 30) ~$399",
      summary: "Stable desk for home office.",
    });

    expect(result).toMatchObject({
      name: "Flexispot E7",
      searchKeyword: "Flexispot E7",
      price: "~$399",
      summary: "Stable desk for home office.",
    });
  });

  it("returns null when name cannot be derived", () => {
    expect(normalizeProduct({ raw: "Recommended" })).toBeNull();
  });
});

describe("normalizeRecommendations", () => {
  it("parses multiple product blocks and skips buying tips", () => {
    const answer = `
## Quick Buying Tips
- Check return policy first.

### 1. Best Overall
**Flexispot EC1 Standing Desk**
Price: SGD 349
Summary: Best balance of stability and value.

### 2. Runner-up
**Fully Jarvis Standing Desk**
Summary: Premium build quality.
`;

    const products = normalizeRecommendations(answer);

    expect(products).toHaveLength(2);
    expect(products[0]!.name).toBe("Flexispot EC1 Standing Desk");
    expect(products[0]!.searchKeyword).toBe("Flexispot EC1");
    expect(products[0]!.name).not.toMatch(/[()]/);
    expect(products[0]!.price).toBe("SGD 349");
    expect(products[1]!.name).toBe("Fully Jarvis Standing Desk");
    expect(products.some((p) => /buying tips/i.test(p.name))).toBe(false);
  });
});
