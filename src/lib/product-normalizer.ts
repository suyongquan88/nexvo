/**
 * Product name normalizer — strips marketplace-noise from AI text.
 * Removes: rankings (#1), labels (Best Overall), prices, dimensions, "Recommended".
 */

import { normalizeSearchKeyword } from "@/lib/normalize-search-keyword";

const HASH_RANK = /\b#?\d+\b/g;
const RECOMMENDED_WORD = /\b(recommended|suggested|editor'?s?\s+choice)\b/gi;

export function normalizeProductName(input: string): string {
  let text = normalizeSearchKeyword(input);

  text = text.replace(HASH_RANK, " ");
  text = text.replace(/^#+\s*/g, " ");
  text = text.replace(RECOMMENDED_WORD, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/** Marketplace search — always normalized, never raw AI text. */
export function normalizeProductSearchKeyword(input: string): string {
  return normalizeSearchKeyword(input);
}
