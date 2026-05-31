import type { TrustMetrics } from "@/components/TrustScoreCard";

/** Placeholder trust metrics for v0.02 UI until Trust Engine API ships. */
export function previewTrustMetrics(answerLength: number): TrustMetrics {
  const normalized = Math.min(answerLength / 1200, 1);
  const score = Math.round(58 + normalized * 22);

  return {
    score,
    confidence: Math.round((0.62 + normalized * 0.2) * 100) / 100,
    evidenceCount: 0,
  };
}
