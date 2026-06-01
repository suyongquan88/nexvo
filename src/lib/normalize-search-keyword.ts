/**
 * Cleans noisy AI recommendation text into marketplace-safe search keywords.
 */

const CATEGORY_LABEL =
  /^(?:#?\d+[\.\):\-]?\s*)?(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|also\s+consider|top\s+pick|alternative|recommended)(?:\s+pick)?\s*:?\s*/i;

const CATEGORY_LABEL_GLOBAL =
  /(?:#?\d+[\.\):\-]?\s*)?(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|also\s+consider|top\s+pick|alternative|recommended)(?:\s+pick)?/gi;

const PRICE_PATTERN =
  /(?:~|approx\.?|from)?\s*(?:SGD|USD|S\$|US\$|\$)\s*[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?\s*(?:SGD|USD)/gi;

const DIMENSION_IN_PARENS =
  /\(\s*\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)?\s*["'′]?\s*[x×]\s*\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)?\s*["'′]?(?:\s*[x×]\s*\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)?\s*["'′]?)?\s*\)/gi;

const DIMENSION_PATTERN =
  /\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)?\s*["'′]?\s*[x×]\s*\d+(?:\.\d+)?\s*(?:inch|in|cm|mm)?\s*["'′]?/gi;

const TRAILING_NOISE = /\b(recommended|suggested|pick|choice|option)\b/gi;

export function normalizeSearchKeyword(input: string): string {
  let text = input.trim();
  if (!text) return "";

  text = text.replace(/#{1,6}/g, " ");
  text = text.replace(/\*\*/g, "");
  text = text.replace(/[*_`]/g, "");
  text = text.replace(/\|/g, " ");

  text = stripRankings(text);
  text = stripCategoryLabels(text);

  text = text.replace(PRICE_PATTERN, " ");
  text = text.replace(/~\s*[\d,]+(?:\.\d{2})?/g, " ");

  text = text.replace(DIMENSION_IN_PARENS, " ");
  text = text.replace(DIMENSION_PATTERN, " ");

  text = text.replace(TRAILING_NOISE, " ");
  text = text.replace(/[:\-–—,;]+/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export type DeriveProductFieldsInput = {
  /** Raw product line from AI (may include labels, price, dimensions). */
  rawProductText: string;
  /** Section title e.g. "Best Overall" or "Best Overall Standing Desk". */
  title?: string;
  /** Explicit Search Keyword field from AI when present. */
  explicitSearchKeyword?: string;
};

export type DerivedProductFields = {
  productName: string;
  searchKeyword: string;
};

/**
 * Splits a noisy line into display name vs marketplace search keyword.
 */
export function deriveProductNameAndSearchKeyword(
  input: DeriveProductFieldsInput
): DerivedProductFields {
  const { category, productPart } = splitCategoryPrefix(input.rawProductText);

  const title = input.title?.trim() || category;
  const normalizedExplicit = input.explicitSearchKeyword
    ? normalizeSearchKeyword(input.explicitSearchKeyword)
    : "";

  let productName = normalizeSearchKeyword(productPart);
  productName = trimProductName(productName);

  if (!productName) {
    productName = normalizeSearchKeyword(input.rawProductText);
    productName = trimProductName(productName);
  }

  const categorySuffix = categorySuffixFromTitle(title);

  let searchKeyword: string;

  if (normalizedExplicit) {
    searchKeyword = normalizedExplicit;
    if (
      categorySuffix &&
      !searchKeyword.toLowerCase().includes(categorySuffix.toLowerCase())
    ) {
      searchKeyword = `${searchKeyword} ${categorySuffix}`.trim();
    }
  } else if (
    categorySuffix &&
    !productName.toLowerCase().includes(categorySuffix.toLowerCase())
  ) {
    searchKeyword = `${productName} ${categorySuffix}`.trim();
  } else {
    searchKeyword = productName;
  }

  searchKeyword = normalizeSearchKeyword(searchKeyword) || productName;

  return { productName, searchKeyword };
}

function splitCategoryPrefix(text: string): {
  category?: string;
  productPart: string;
} {
  const trimmed = text.trim();
  const colon = trimmed.match(/^([^:]{2,50}):\s*(.+)$/);

  if (colon && isCategoryLabel(colon[1]!)) {
    return {
      category: cleanLabel(colon[1]!),
      productPart: colon[2]!.trim(),
    };
  }

  return { productPart: trimmed };
}

function isCategoryLabel(value: string): boolean {
  return CATEGORY_LABEL.test(value.trim());
}

function cleanLabel(value: string): string {
  return value.replace(/\*\*/g, "").replace(/^#{1,6}\s*/, "").trim();
}

function stripRankings(text: string): string {
  return text
    .replace(/^#?\d+[\.\):\-]?\s*/g, "")
    .replace(/\s#?\d+[\.\):\-]?\s*/g, " ")
    .trim();
}

function stripCategoryLabels(text: string): string {
  let out = text;
  let prev = "";

  while (out !== prev) {
    prev = out;
    out = out.replace(CATEGORY_LABEL, "").trim();
    out = out.replace(CATEGORY_LABEL_GLOBAL, " ").trim();
    out = stripRankings(out);
  }

  return out;
}

function categorySuffixFromTitle(title?: string): string {
  if (!title) return "";

  let suffix = normalizeSearchKeyword(title);
  suffix = suffix
    .replace(
      /^(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|top\s+pick|alternative|recommended)(?:\s+pick)?\s*/i,
      ""
    )
    .trim();

  return suffix.length >= 3 ? suffix : "";
}

/** Keeps a concise brand + model style name (typically 2–6 tokens). */
function trimProductName(name: string): string {
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length <= 6) return name;

  return tokens.slice(0, 6).join(" ");
}
