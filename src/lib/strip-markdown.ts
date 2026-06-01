/**
 * Removes markdown syntax for product-comparison style UI (never show raw MD).
 */

export function stripMarkdown(text: string): string {
  return stripMarkdownPreserveLines(text).replace(/\n{3,}/g, "\n\n").trim();
}

export function stripMarkdownPreserveLines(text: string): string {
  return text
    .split("\n")
    .map((line) => stripMarkdownLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function stripMarkdownLine(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^\d+[\.\)]\s+/, "")
    .replace(/^\s*[-*•]\s+/, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/, "")
    .trim();
}

export function stripMarkdownInline(text: string): string {
  return stripMarkdownLine(text).replace(/\s+/g, " ").trim();
}
