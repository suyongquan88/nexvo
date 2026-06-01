import type { TrustMetrics } from "@/components/TrustScoreCard";
import {
  parseProductRecommendations,
  type ProductRecommendation,
} from "@/lib/parse-product-recommendations";

const STORAGE_KEY = "nexvo.recommendation";

export type { ProductRecommendation };

export type RecommendationSession = {
  question: string;
  answer: string;
  demo?: boolean;
  products: ProductRecommendation[];
  buyingTips: string;
  productName: string;
  summary: string;
  whyWeRecommend: string[];
  trust: TrustMetrics;
};

function toTrustMetrics(trustScore: number): TrustMetrics {
  return {
    score: trustScore,
    confidence: Math.min(0.95, 0.55 + trustScore / 200),
    evidenceCount: 0,
  };
}

export function buildRecommendationSession(
  question: string,
  answer: string,
  demo = false
): RecommendationSession {
  const { products, buyingTips } = parseProductRecommendations(answer);
  const top = products[0]!;

  return {
    question,
    answer,
    demo,
    products,
    buyingTips,
    productName: top.productName,
    summary: products.map((p) => `${p.rank}. ${p.productName}`).join(" · "),
    whyWeRecommend: products.map((p) => p.summary).slice(0, 5),
    trust: toTrustMetrics(top.trustScore),
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
    const data = JSON.parse(raw) as RecommendationSession;
    const first = data.products?.[0];
    const needsReparse =
      !Array.isArray(data.products) ||
      data.products.length === 0 ||
      !first?.searchKeyword ||
      !first?.productName ||
      !first?.detail ||
      "highlights" in (first as object) ||
      "name" in (first as object) ||
      data.buyingTips === undefined;

    if (needsReparse) {
      return buildRecommendationSession(
        data.question,
        data.answer,
        data.demo
      );
    }

    return data;
  } catch {
    return null;
  }
}
