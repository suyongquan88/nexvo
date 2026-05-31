import type { TrustMetrics } from "@/components/TrustScoreCard";
import type { RecommendationSession } from "@/lib/recommendation-session";

export type TrustFactorStatus = "strong" | "moderate" | "limited";

export type TrustFactor = {
  id: string;
  name: string;
  description: string;
  points: number;
  maxPoints: number;
  weightPercent: number;
  status: TrustFactorStatus;
};

export type TrustBreakdown = {
  totalScore: number;
  confidence: number;
  evidenceCount: number;
  factors: TrustFactor[];
};

function statusFromRatio(ratio: number): TrustFactorStatus {
  if (ratio >= 0.75) return "strong";
  if (ratio >= 0.45) return "moderate";
  return "limited";
}

export function computeTrustBreakdown(
  trust: TrustMetrics,
  session?: Pick<RecommendationSession, "question" | "answer" | "demo"> | null
): TrustBreakdown {
  const answerLength = session?.answer.length ?? 0;
  const questionLength = session?.question.length ?? 0;

  const evidenceRatio = Math.min(trust.evidenceCount / 3, 1);
  const clarityRatio = Math.min(answerLength / 900, 1);
  const confidenceRatio = trust.confidence;
  const contextRatio = Math.min(questionLength / 80, 1);

  const factors: TrustFactor[] = [
    {
      id: "evidence",
      name: "Evidence integrity",
      description:
        "Verified purchases, independent reviews, and community signals—not sponsored placements.",
      maxPoints: 30,
      points: Math.round(evidenceRatio * 30),
      weightPercent: 30,
      status: statusFromRatio(evidenceRatio),
    },
    {
      id: "clarity",
      name: "Recommendation clarity",
      description:
        "How specific and actionable the guidance is for your stated question.",
      maxPoints: 25,
      points: Math.round(clarityRatio * 25),
      weightPercent: 25,
      status: statusFromRatio(clarityRatio),
    },
    {
      id: "confidence",
      name: "Confidence calibration",
      description:
        "Model certainty adjusted for gaps in evidence—we show lower confidence when proof is thin.",
      maxPoints: 20,
      points: Math.round(confidenceRatio * 20),
      weightPercent: 20,
      status: statusFromRatio(confidenceRatio),
    },
    {
      id: "independence",
      name: "Independence guarantee",
      description:
        "No ads, no merchant influence, no pay-to-rank. This factor reflects Nexvo policy, not payments.",
      maxPoints: 15,
      points: 15,
      weightPercent: 15,
      status: "strong",
    },
    {
      id: "context",
      name: "User context fit",
      description:
        "Alignment between your question constraints and the recommendation reasoning.",
      maxPoints: 10,
      points: Math.round(contextRatio * 10),
      weightPercent: 10,
      status: statusFromRatio(contextRatio),
    },
  ];

  const computedTotal = factors.reduce((sum, factor) => sum + factor.points, 0);

  return {
    totalScore: trust.score,
    confidence: trust.confidence,
    evidenceCount: trust.evidenceCount,
    factors: factors.map((factor) => {
      if (computedTotal === trust.score) return factor;

      const scale =
        computedTotal > 0 ? trust.score / computedTotal : 1;
      const scaledPoints = Math.round(factor.points * scale);

      return {
        ...factor,
        points: Math.min(scaledPoints, factor.maxPoints),
        status: statusFromRatio(
          factor.maxPoints > 0 ? scaledPoints / factor.maxPoints : 0
        ),
      };
    }),
  };
}

export const TRUST_PRINCIPLES = [
  {
    title: "No sponsored rankings",
    body: "Merchants cannot pay to appear in recommendations.",
  },
  {
    title: "Evidence before opinion",
    body: "Scores rise when verified proof backs the guidance.",
  },
  {
    title: "Transparency always",
    body: "You can inspect how each factor contributes to the score.",
  },
  {
    title: "Privacy first",
    body: "Your questions and proofs are handled with minimal retention.",
  },
] as const;
