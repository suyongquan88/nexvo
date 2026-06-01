/**
 * Recommendation normalizer — converts noisy AI product text into structured fields.
 */

export interface ProductRecommendation {
  name: string;
  searchKeyword: string;
  price?: string;
  summary: string;
}

const LEADING_RANK = /^#?\d+[\.\):\-]?\s*/;
const INLINE_HASH_RANK = /\s+#\d+\b/g;

const CATEGORY_LABEL =
  /^(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|also\s+consider|top\s+pick|alternative|recommended)(?:\s+pick)?\s*:?\s*/i;

const CATEGORY_LABEL_GLOBAL =
  /(?:^|\s)(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|also\s+consider|top\s+pick|alternative|recommended)(?:\s+pick)?(?=\s|:|$)/gi;

const COMPLETE_PARENS = /\([^)]*\)/g;
const INCOMPLETE_PARENS = /\(.*/g;

/** Price suffixes only — avoids stripping model tokens like E5 or WH-1000XM5. */
const KEYWORD_PRICE =
  /(?:^|\s)(?:[-–—]\s*)?(?:~?\$\d[\d,]*(?:\.\d{2})?|~\s*[\d,]+(?:\.\d{2})?|(?:SGD|USD|S\$|US\$)\s*[\d,]+(?:\.\d{2})?)/gi;

const PRICE_PATTERN =
  /(?:~|approx\.?|from)?\s*(?:SGD|USD|S\$|US\$|\$)\s*[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?\s*(?:SGD|USD)/gi;

const RECOMMENDED_WORD = /\b(recommended|suggested|editor'?s?\s+choice)\b/gi;

const NON_PRODUCT_SECTION =
  /^(?:quick\s+)?buying\s+tips|^(?:why|next\s+step|your\s+question)\b/i;

const GENERIC_PRODUCT_WORDS =
  /^(electric|standing|desk|wireless|headphones|headphone|earbuds|speaker|monitor|chair|table|with|and|the|for|pro|max|ultra|plus|gen|series|edition)$/i;

/**
 * Strips markdown, labels, brackets, and price noise from a product line or keyword.
 */
export function cleanProductKeyword(input: string): string {
  return (
    input
      // markdown
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/[*_`]/g, "")

      // 排名
      .replace(/^\d+[\.\)]\s*/g, "")
      .replace(/^Top\s*\d+\s*[:\-]?\s*/i, "")
      .replace(LEADING_RANK, "")
      .replace(INLINE_HASH_RANK, " ")

      // Best Overall:
      .replace(/^(Best|Top|Recommended|Runner-Up|Budget|Premium).*?:\s*/i, "")

      // category labels (also consider, runner-up pick, etc.)
      .replace(CATEGORY_LABEL, "")
      .replace(CATEGORY_LABEL_GLOBAL, " ")

      // 完整括号
      .replace(COMPLETE_PARENS, " ")

      // 不完整左括号
      .replace(INCOMPLETE_PARENS, "")

      // 价格 (currency / ~ / trailing dash — not bare model digits)
      .replace(KEYWORD_PRICE, " ")
      .replace(/\s*[–—\-]+\s*$/g, "")

      // Recommended
      .replace(/\bRecommended\b/gi, "")
      .replace(RECOMMENDED_WORD, " ")

      // stray brackets
      .replace(/[)\]]/g, " ")

      // 多余空格
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Cleans a raw AI product line into a display title (no dimensions, prices, or labels).
 */
export function cleanProductTitle(raw: string): string {
  const colonSplit = splitCategoryPrefix(raw.trim());
  return trimProductName(cleanProductKeyword(colonSplit.productPart));
}

/**
 * Short marketplace search keyword (typically brand + model code).
 */
export function deriveSearchKeyword(title: string): string {
  const cleaned = cleanProductKeyword(title);
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) return "";
  if (tokens.length === 1) return tokens[0]!;

  const brand = tokens[0]!;

  const modelToken = tokens.find(
    (token, index) =>
      index > 0 &&
      (/\d/.test(token) || /^[A-Z]{1,4}\d+[A-Za-z0-9-]*$/i.test(token)) &&
      !GENERIC_PRODUCT_WORDS.test(token)
  );

  if (modelToken) {
    return `${brand} ${modelToken}`;
  }

  const second = tokens[1];
  if (second && !GENERIC_PRODUCT_WORDS.test(second) && second.length <= 10) {
    return `${brand} ${second}`;
  }

  return brand;
}

/**
 * Strips labels, dimensions, and prices; returns display title + search keyword.
 */
export function normalizeProductTitle(raw: string): {
  name: string;
  searchKeyword: string;
  price?: string;
} {
  const price = extractPrice(raw);
  const name = cleanProductTitle(raw);
  const searchKeyword = deriveSearchKeyword(name);

  return {
    name,
    searchKeyword: searchKeyword || name,
    price,
  };
}

/**
 * Builds a full ProductRecommendation from a raw title line and optional fields.
 */
export function normalizeProduct(input: {
  raw: string;
  summary?: string;
  price?: string;
}): ProductRecommendation | null {
  const { name, searchKeyword, price } = normalizeProductTitle(input.raw);

  if (!name) {
    return null;
  }

  return {
    name,
    searchKeyword,
    price: input.price ?? price,
    summary: input.summary?.trim() || defaultSummary(),
  };
}

/**
 * Parses an AI answer into normalized product recommendations (max 5).
 */
export function normalizeRecommendations(answer: string): ProductRecommendation[] {
  const blocks = splitProductBlocks(answer);
  const products: ProductRecommendation[] = [];

  for (const block of blocks) {
    if (isNonProductBlock(block)) continue;

    const parsed = parseProductBlock(block);
    if (!parsed) continue;

    const normalized = normalizeProduct({
      raw: parsed.rawTitle,
      summary: parsed.summary,
      price: parsed.price,
    });

    if (normalized) {
      products.push(normalized);
    }
  }

  return dedupeByName(products).slice(0, 5);
}

function splitProductBlocks(answer: string): string[] {
  const withoutTips = answer.replace(
    /(?:^|\n)#{0,3}\s*quick\s+buying\s+tips[\s\S]*?(?=\n#{1,3}\s*\d|\n\d+[\.\)]\s|$)/gi,
    "\n"
  );

  const parts = withoutTips
    .split(/(?=^#{1,3}\s|^\d+[\.\)]\s)/m)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);

  if (parts.length > 1) {
    return parts;
  }

  return withoutTips
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);
}

function parseProductBlock(block: string): {
  rawTitle: string;
  summary: string;
  price?: string;
} | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  let rawTitle = "";
  let summary = "";
  let price: string | undefined;

  const first = lines[0]!;
  const heading = first.match(/^#{1,3}\s*(?:\d+[\.\):\-]\s*)?(.+)$/);
  if (heading) {
    const body = heading[1]!.replace(/\*\*/g, "").trim();
    const bold = body.match(/\*\*([^*]+)\*\*/);
    if (bold) {
      rawTitle = bold[1]!.trim();
    } else if (/:/.test(body)) {
      const [, right] = body.split(/:\s*/, 2);
      rawTitle = right?.trim() ?? body;
    } else if (!isCategoryOnly(body)) {
      rawTitle = body;
    }
  }

  for (const line of lines) {
    const summaryMatch = line.match(/^summary\s*:\s*(.+)$/i);
    if (summaryMatch) {
      summary = stripInlineMarkdown(summaryMatch[1]!);
      continue;
    }

    const priceMatch = line.match(/^price\s*:\s*(.+)$/i);
    if (priceMatch) {
      price = stripInlineMarkdown(priceMatch[1]!);
      continue;
    }

    const bold = line.match(/\*\*([^*]+)\*\*/);
    if (bold && !rawTitle) {
      rawTitle = bold[1]!.trim();
      const rest = line.replace(/\*\*[^*]+\*\*/, "").replace(/^[\s:–—\-]+/, "");
      if (rest && !summary) summary = stripInlineMarkdown(rest);
      continue;
    }

    if (!rawTitle && !line.match(/^#{1,3}/) && !/^summary\b/i.test(line)) {
      const numbered = line.match(/^\d+[\.\)]\s+(.+)$/);
      if (numbered) {
        rawTitle = numbered[1]!;
      }
    }
  }

  if (!rawTitle) {
    return null;
  }

  if (!summary) {
    summary = defaultSummary();
  }

  return {
    rawTitle,
    summary,
    price: price ?? extractPrice(block),
  };
}

function splitCategoryPrefix(text: string): { productPart: string } {
  const colon = text.match(/^([^:]{2,50}):\s*(.+)$/);
  if (colon && isCategoryOnly(colon[1]!)) {
    return { productPart: colon[2]!.trim() };
  }
  return { productPart: text };
}

function isCategoryOnly(value: string): boolean {
  const v = value.trim().replace(/\*\*/g, "");
  return CATEGORY_LABEL.test(`${v} `) || CATEGORY_LABEL.test(v);
}

function extractPrice(text: string): string | undefined {
  const labeled = text.match(/price\s*:\s*([^\n]+)/i)?.[1]?.trim();
  if (labeled) return stripInlineMarkdown(labeled);

  const match =
    text.match(/(?:~|approx\.?)?\s*(?:SGD|S\$|US\$|\$)\s*[\d,]+(?:\.\d{2})?/i)?.[0] ??
    text.match(/[\d,]+(?:\.\d{2})?\s*(?:SGD|USD)/i)?.[0];

  return match ? match.replace(/\s+/g, " ").trim() : undefined;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*•]\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimProductName(name: string): string {
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length <= 10) return name;
  return tokens.slice(0, 10).join(" ");
}

function isNonProductBlock(block: string): boolean {
  const first = block.split("\n").find((l) => l.trim())?.trim() ?? "";
  return NON_PRODUCT_SECTION.test(first);
}

function dedupeByName(products: ProductRecommendation[]): ProductRecommendation[] {
  const seen = new Set<string>();
  const out: ProductRecommendation[] = [];

  for (const p of products) {
    const key = p.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }

  return out;
}

function defaultSummary(): string {
  return "Strong fit based on verified signals and your stated priorities.";
}
