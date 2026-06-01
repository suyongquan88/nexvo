import {
  stripMarkdownInline,
  stripMarkdownPreserveLines,
} from "@/lib/strip-markdown";

export type ProductDetail = {
  specs: string[];
  pros: string[];
  cons: string[];
  warranty: string;
  ideal_for: string;
  parseSuccess: boolean;
  fallbackText: string;
};

type SectionKey = "specs" | "pros" | "cons" | "warranty" | "ideal_for";

const SECTION_HEADERS: { pattern: RegExp; key: SectionKey }[] = [
  { pattern: /^(?:key\s*)?specs?\b/i, key: "specs" },
  { pattern: /^(?:features?|highlights?)\b/i, key: "specs" },
  { pattern: /^pros?\b/i, key: "pros" },
  { pattern: /^cons?\b/i, key: "cons" },
  { pattern: /^warranty\b/i, key: "warranty" },
  { pattern: /^(?:ideal\s*for|best\s*for)\b/i, key: "ideal_for" },
];

/**
 * Parses AI markdown product blocks into structured comparison fields.
 */
export function parseProductDetail(raw: string): ProductDetail {
  const fallbackText = stripMarkdownPreserveLines(raw);

  const empty: ProductDetail = {
    specs: [],
    pros: [],
    cons: [],
    warranty: "",
    ideal_for: "",
    parseSuccess: false,
    fallbackText,
  };

  if (!raw.trim()) {
    return empty;
  }

  const sections = extractSections(raw);
  const specs = sections.specs.map(stripMarkdownInline).filter(Boolean);
  const pros = sections.pros.map(stripMarkdownInline).filter(Boolean);
  const cons = sections.cons.map(stripMarkdownInline).filter(Boolean);
  const warranty = joinSectionText(sections.warranty);
  const ideal_for = joinSectionText(sections.ideal_for);

  const filledCount = [
    specs.length > 0,
    pros.length > 0,
    cons.length > 0,
    warranty,
    ideal_for,
  ].filter(Boolean).length;

  const parseSuccess = filledCount >= 2;

  if (!parseSuccess) {
    return {
      ...empty,
      fallbackText,
    };
  }

  return {
    specs,
    pros,
    cons,
    warranty: stripMarkdownInline(warranty),
    ideal_for: stripMarkdownInline(ideal_for),
    parseSuccess: true,
    fallbackText,
  };
}

function extractSections(raw: string): Record<SectionKey, string[]> {
  const buckets: Record<SectionKey, string[]> = {
    specs: [],
    pros: [],
    cons: [],
    warranty: [],
    ideal_for: [],
  };

  let current: SectionKey | null = null;

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const header = matchSectionHeader(line);
    if (header) {
      current = header;
      const inline = extractInlineSectionValue(line, header);
      if (inline) {
        buckets[header].push(inline);
      }
      continue;
    }

    const bullet = parseBulletLine(line);
    if (bullet) {
      if (current === "pros" || current === "cons" || current === "specs") {
        buckets[current].push(bullet);
      } else if (current) {
        buckets[current].push(bullet);
      }
      continue;
    }

    if (current) {
      buckets[current].push(stripLine(line));
    }
  }

  return buckets;
}

function matchSectionHeader(line: string): SectionKey | null {
  const cleaned = stripLine(line).replace(/[:：]\s*$/, "").trim();

  for (const { pattern, key } of SECTION_HEADERS) {
    if (pattern.test(cleaned)) {
      return key;
    }
  }

  return null;
}

function extractInlineSectionValue(
  line: string,
  key: SectionKey
): string | null {
  const cleaned = stripLine(line);
  const colon = cleaned.match(/^[^:]+:\s*(.+)$/);
  if (colon?.[1]?.trim()) {
    return colon[1].trim();
  }

  const headerPattern = SECTION_HEADERS.find((h) => h.key === key)?.pattern;
  if (!headerPattern) return null;

  const rest = cleaned.replace(headerPattern, "").trim();
  return rest.length > 0 ? rest : null;
}

function parseBulletLine(line: string): string | null {
  const match = line.match(/^(?:[-*•]|\d+[\.\)])\s+(.+)$/);
  if (!match) return null;
  return stripLine(match[1]!);
}

function stripLine(line: string): string {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^\d+[\.\)]\s+/, "")
    .replace(/^\s*[-*•]\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
}

function joinSectionText(lines: string[]): string {
  return lines.map(stripMarkdownInline).filter(Boolean).join(" ");
}
