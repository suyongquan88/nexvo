import { stripMarkdownPreserveLines } from "@/lib/strip-markdown";

const BUYING_TIPS_HEADER =
  /^(?:#{1,3}\s*)?(?:quick\s+)?buying\s+tips\b/i;

const NON_PRODUCT_HEADERS =
  /^(?:#{1,3}\s*)?(?:quick\s+)?buying\s+tips\b|^(?:#{1,3}\s*)?(?:why\b|next\s+step|summary|conclusion)\b/i;

/**
 * Splits AI answer into optional buying tips (excluded from product list) and product body.
 */
export function extractBuyingTips(answer: string): {
  buyingTips: string;
  productBody: string;
} {
  const lines = answer.split("\n");
  let tipsStart = -1;
  let tipsEnd = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (BUYING_TIPS_HEADER.test(line)) {
      tipsStart = i;
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j]!.trim();
        if (
          /^#{1,3}\s*\d/.test(next) ||
          /^\d+[\.\)]\s/.test(next) ||
          /^#{1,3}\s*(?:\d+[\.\):\-]\s*)?(?:best|runner|budget|top)\b/i.test(next)
        ) {
          tipsEnd = j;
          break;
        }
      }
      break;
    }
  }

  if (tipsStart < 0) {
    return { buyingTips: "", productBody: answer };
  }

  const tipsBlock = lines.slice(tipsStart, tipsEnd).join("\n");
  const productLines = [...lines.slice(0, tipsStart), ...lines.slice(tipsEnd)];

  return {
    buyingTips: stripMarkdownPreserveLines(tipsBlock),
    productBody: productLines.join("\n").trim(),
  };
}

export function isNonProductSection(block: string): boolean {
  const firstLine = block.split("\n").find((l) => l.trim())?.trim() ?? "";
  return NON_PRODUCT_HEADERS.test(firstLine);
}
