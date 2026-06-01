import { extractBuyingTips, isNonProductSection } from "@/lib/extract-buying-tips";
import { parseProductDetail, type ProductDetail } from "@/lib/parse-product-detail";
import { normalizeProductTitle } from "@/lib/recommendation/normalize";
import { stripMarkdownInline } from "@/lib/strip-markdown";
import { previewTrustMetrics } from "@/lib/trust";

export type { ProductDetail };

export type ProductRecommendation = {
  rank: number;
  title: string;
  productName: string;
  searchKeyword: string;
  trustScore: number;
  summary: string;
  price: string;
  detail: ProductDetail;
};

export type ParseProductsResult = {
  products: ProductRecommendation[];
  buyingTips: string;
};

const TOP_N = 5;

const CATEGORY_TITLE =
  /^(?:\d+[\.\):\-]\s*)?(?:#{1,6}\s*)?(?:\*\*)?(?:best\s+)?(?:overall|budget|value|premium|runner[\s-]?up|also\s+consider|top\s+pick|alternative|option\s*\d*|pick\s*#?\d*|for\s+most\s+people|editor'?s?\s+choice)(?:\*\*)?\.?$/i;

const SKIP_LINE =
  /^(your question|recommendation|why|next step|note|analysis|shop this)\b/i;

type SectionDraft = {
  title: string;
  productName: string;
  searchKeyword: string;
  summary: string;
  price: string;
  details: string;
};

export function parseProductRecommendations(answer: string): ParseProductsResult {
  const { buyingTips, productBody } = extractBuyingTips(answer);
  const baseTrust = previewTrustMetrics(productBody.length);
  const sections = splitIntoSections(productBody);
  const drafts: SectionDraft[] = [];

  for (const block of sections) {
    if (isNonProductSection(block)) continue;
    const draft = parseSection(block);
    if (draft?.productName) {
      drafts.push(draft);
    }
  }

  if (drafts.length === 0) {
    const fromList = parseNumberedListItems(productBody);
    drafts.push(...fromList);
  }

  const deduped = dedupeDrafts(drafts).slice(0, TOP_N);

  while (deduped.length < TOP_N) {
    const rank = deduped.length + 1;
    const anchor = deduped[0];
    deduped.push({
      title: `Option ${rank}`,
      productName: anchor
        ? `${anchor.productName} (alt ${rank})`
        : `Alternative ${rank}`,
      searchKeyword: anchor?.searchKeyword ?? `Alternative ${rank}`,
      summary:
        "Additional option identified from your recommendation analysis.",
      price: "—",
      details: "",
    });
  }

  const products = deduped.map((draft, index) =>
    finalizeProduct(draft, index + 1, baseTrust.score)
  );

  return { products, buyingTips };
}

function splitIntoSections(answer: string): string[] {
  const parts = answer
    .split(/(?=^#{1,3}\s|^\d+[\.\)]\s)/m)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return parts;
  }

  return answer
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);
}

function parseSection(block: string): SectionDraft | null {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  let title = "";
  let productName = "";
  let searchKeyword = "";
  let summary = "";
  let price = "";
  const detailLines: string[] = [];

  const first = lines[0]!;
  const heading = parseHeadingLine(first);
  if (heading) {
    title = heading.title;
    if (heading.inlineProduct) {
      productName = heading.inlineProduct;
    }
  }

  for (const line of lines) {
    if (line === first && heading) continue;

    const field = parseLabeledField(line);
    if (field) {
      switch (field.key) {
        case "title":
          title = field.value;
          break;
        case "productname":
          productName = field.value;
          break;
        case "searchkeyword":
          searchKeyword = field.value;
          break;
        case "summary":
          summary = field.value;
          break;
        case "price":
          price = field.value;
          break;
        case "details":
        case "detail":
        case "warranty":
        case "bestfor":
        case "idealfor":
        case "pros":
        case "cons":
        case "features":
        case "highlights":
        case "specs":
        case "keyspecs":
          detailLines.push(`${field.key}: ${field.value}`);
          break;
      }
      continue;
    }

    const fromList = parseNumberedProductLine(line);
    if (fromList) {
      if (!title && fromList.title) title = fromList.title;
      if (!productName && fromList.productName) productName = fromList.productName;
      if (!summary && fromList.summary) summary = fromList.summary;
      if (!price && fromList.price) price = fromList.price;
      detailLines.push(line);
      continue;
    }

    const bold = extractBoldProductName(line);
    if (bold && !productName) {
      productName = bold.name;
      if (!summary && bold.rest) summary = bold.rest;
      detailLines.push(line);
      continue;
    }

    if (!SKIP_LINE.test(line)) {
      detailLines.push(line);
    }
  }

  if (!productName) {
    return null;
  }

  if (isCategoryTitle(productName) || isMarkdownArtifact(productName)) {
    return null;
  }

  if (!title || isMarkdownArtifact(title)) {
    title = isCategoryTitle(title) ? "" : title;
  }

  if (!title) {
    title = `Pick`;
  }

  if (!summary) {
    summary = defaultSummary();
  }

  if (!price) {
    price = extractPriceFromText(block) ?? "—";
  }

  const derived = normalizeProductTitle(productName);

  return {
    title: cleanText(title),
    productName: derived.name,
    searchKeyword: derived.searchKeyword,
    summary: truncate(summary, 280),
    price: cleanText(price),
    details: detailLines.join("\n").trim() || block.trim(),
  };
}

function parseNumberedListItems(answer: string): SectionDraft[] {
  const drafts: SectionDraft[] = [];
  const lines = answer.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const parsed = parseNumberedProductLine(line);
    if (!parsed?.productName) continue;
    if (isCategoryTitle(parsed.productName) || isMarkdownArtifact(parsed.productName)) {
      continue;
    }

    const derived = normalizeProductTitle(parsed.productName);

    drafts.push({
      title: parsed.title || `Pick ${drafts.length + 1}`,
      productName: derived.name,
      searchKeyword: derived.searchKeyword,
      summary: parsed.summary || defaultSummary(),
      price: parsed.price || extractPriceFromText(line) || "—",
      details: line,
    });
  }

  return drafts;
}

function parseNumberedProductLine(line: string): Partial<SectionDraft> | null {
  const numbered = line.match(/^(\d+)[\.\)]\s+(.+)$/);
  if (!numbered) return null;

  const body = numbered[2]!.trim();
  const headingOnly = body.match(/^#{1,3}\s*(?:\d+[\.\):\-]\s*)?(.+)$/);
  if (headingOnly && isCategoryTitle(headingOnly[1]!)) {
    return { title: cleanText(headingOnly[1]!) };
  }

  const bold = extractBoldProductName(body);
  if (bold) {
    return {
      title: isCategoryTitle(bold.name) ? "" : undefined,
      productName: isCategoryTitle(bold.name) ? undefined : bold.name,
      summary: bold.rest,
    };
  }

  const dash = body.split(/\s+[–—\-]\s+/);
  if (dash.length >= 2) {
    const left = cleanText(dash[0]!.replace(/\*\*/g, ""));
    const right = dash.slice(1).join(" — ").trim();
    if (!isCategoryTitle(left) && isLikelyProductName(left)) {
      return { productName: left, summary: right };
    }
    if (isCategoryTitle(left)) {
      return { title: left, productName: cleanText(right.replace(/\*\*/g, "")), summary: right };
    }
  }

  return null;
}

function parseHeadingLine(line: string): {
  title: string;
  inlineProduct?: string;
} | null {
  const md = line.match(/^#{1,3}\s*(?:\d+[\.\):\-]\s*)?(.+)$/);
  if (!md) return null;

  const raw = cleanText(md[1]!.replace(/\*\*/g, ""));
  const bold = raw.match(/^(.+?)\s*[–—\-]\s*(.+)$/) ?? raw.match(/^(.+?):\s*(.+)$/);

  if (bold) {
    const left = bold[1]!.trim();
    const right = bold[2]!.trim();
    if (isCategoryTitle(left) && isLikelyProductName(right)) {
      return { title: left, inlineProduct: right };
    }
  }

  if (isCategoryTitle(raw)) {
    return { title: raw };
  }

  if (isLikelyProductName(raw)) {
    return { title: "Recommended", inlineProduct: raw };
  }

  return { title: raw };
}

function parseLabeledField(
  line: string
): { key: string; value: string } | null {
  const match = line.match(/^([a-z][a-z\s]*)\s*:\s*(.+)$/i);
  if (!match) return null;

  const key = match[1]!.toLowerCase().replace(/\s+/g, "");
  const value = cleanText(match[2]!.replace(/\*\*/g, ""));

  if (
    key === "title" ||
    key === "productname" ||
    key === "searchkeyword" ||
    key === "summary" ||
    key === "price" ||
    key === "details" ||
    key === "detail" ||
    key === "warranty" ||
    key === "bestfor" ||
    key === "idealfor" ||
    key === "pros" ||
    key === "cons" ||
    key === "features" ||
    key === "highlights" ||
    key === "specs" ||
    key === "keyspecs"
  ) {
    return { key, value };
  }

  return null;
}

function extractBoldProductName(line: string): {
  name: string;
  rest: string;
} | null {
  const match = line.match(/\*\*([^*]+)\*\*/);
  if (!match) return null;

  const name = cleanText(match[1]!);
  if (!isLikelyProductName(name)) return null;

  const rest = line
    .replace(/\*\*[^*]+\*\*/, "")
    .replace(/^[\s:–—\-]+/, "")
    .trim();

  return { name, rest };
}

function extractPriceFromText(text: string): string | null {
  const labeled = text.match(/price\s*:\s*([^\n]+)/i)?.[1]?.trim();
  if (labeled) return cleanText(labeled);

  const sgd = text.match(/(?:SGD|S\$)\s*[\d,]+(?:\.\d{2})?/i)?.[0];
  if (sgd) return sgd;

  const usd = text.match(/\$\s*[\d,]+(?:\.\d{2})?/)?.[0];
  if (usd) return usd;

  return null;
}

function finalizeProduct(
  draft: SectionDraft,
  rank: number,
  baseScore: number
): ProductRecommendation {
  const rankBoost = (TOP_N - rank) * 3;

  const { name, searchKeyword, price: parsedPrice } = normalizeProductTitle(
    draft.productName
  );

  const rawDetails = draft.details || draft.summary;
  const detail = parseProductDetail(rawDetails);

  return {
    rank,
    title: stripMarkdownInline(draft.title || `Pick ${rank}`),
    productName: name,
    searchKeyword,
    trustScore: Math.min(98, Math.max(42, baseScore + rankBoost)),
    summary: stripMarkdownInline(draft.summary),
    price: stripMarkdownInline(draft.price || parsedPrice || "—"),
    detail,
  };
}

function dedupeDrafts(drafts: SectionDraft[]): SectionDraft[] {
  const seen = new Set<string>();
  const out: SectionDraft[] = [];

  for (const d of drafts) {
    const key = d.productName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }

  return out;
}

function isCategoryTitle(value: string): boolean {
  const v = cleanText(value);
  return CATEGORY_TITLE.test(v) || /^\d+\.\s*best\b/i.test(v);
}

function isMarkdownArtifact(value: string): boolean {
  const v = value.trim();
  return (
    /^#{1,6}\s/.test(v) ||
    /^###/.test(v) ||
    /^\d+[\.\):\-]\s*(best|top)\b/i.test(v) ||
    v.includes("###")
  );
}

function isLikelyProductName(value: string): boolean {
  const v = cleanText(value);
  if (v.length < 2 || v.length > 120) return false;
  if (isCategoryTitle(v) || isMarkdownArtifact(v) || SKIP_LINE.test(v)) {
    return false;
  }
  if (!/[a-zA-Z]/.test(v)) return false;
  if (/^(the|a|an|your|our)\s/i.test(v)) return false;
  return true;
}

function cleanText(value: string): string {
  return value
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\d+[\.\):\-]\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function defaultSummary(): string {
  return "Strong fit for your priorities based on verified signals and transparent trade-offs.";
}
