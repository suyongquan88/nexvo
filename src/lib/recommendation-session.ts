import type { TrustMetrics } from "@/components/TrustScoreCard";
import { previewTrustMetrics } from "@/lib/trust";

const STORAGE_KEY = "nexvo.recommendation";

export type RecommendationSession = {
  question: string;
  answer: string;
  demo?: boolean;
  trust: TrustMetrics;
  productName: string;
  summary: string;
  whyWeRecommend: string[];
};

export function buildRecommendationSession(
  question: string,
  answer: string,
  demo = false
): RecommendationSession {
  const parsed = parseRecommendationContent(answer);

  return {
    question,
    answer,
    demo,
    trust: previewTrustMetrics(answer.length),
    productName: parsed.productName,
    summary: parsed.summary,
    whyWeRecommend: parsed.whyWeRecommend,
  };
}

export function saveRecommendationSession(data: RecommendationSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadRecommendationSession(): RecommendationSession | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RecommendationSession;
  } catch {
    return null;
  }
}

function parseRecommendationContent(answer: string): {
  productName: string;
  summary: string;
  whyWeRecommend: string[];
} {
  const lines = answer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletLines = lines
    .filter((line) => /^[-*•]/.test(line) || /^\d+\./.test(line))
    .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, ""));

  const boldName = answer.match(/\*\*([^*]+)\*\*/)?.[1]?.trim();

  const recommendationLine = lines.find((line) =>
    /recommend/i.test(line)
  );

  let productName = boldName ?? "Your recommended choice";

  if (recommendationLine) {
    const afterColon = recommendationLine.split(":").slice(1).join(":").trim();
    if (afterColon.length > 0 && afterColon.length < 120) {
      productName = afterColon.replace(/\*\*/g, "");
    }
  }

  const summary =
    lines.find((line) => !line.startsWith("**") && !/^[-*•\d]/.test(line)) ??
    lines[0] ??
    answer.slice(0, 280);

  const whyWeRecommend =
    bulletLines.length > 0
      ? bulletLines.slice(0, 5)
      : [
          "Matches your stated priorities and constraints.",
          "Favors verified buyer signals over sponsored rankings.",
          "Transparent trade-offs—no merchant-paid placement.",
        ];

  return {
    productName,
    summary: summary.length > 320 ? `${summary.slice(0, 317)}…` : summary,
    whyWeRecommend,
  };
}
