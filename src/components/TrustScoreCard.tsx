import Link from "next/link";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

export type TrustMetrics = {
  score: number;
  confidence: number;
  evidenceCount: number;
};

type TrustScoreCardProps = {
  trust: TrustMetrics | null;
  isLoading?: boolean;
};

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--nexvo-purple-100)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#trustGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <defs>
          <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--nexvo-purple-600)" />
            <stop offset="100%" stopColor="var(--nexvo-coral-500)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className={cn(textStyles.caption, "font-medium uppercase tracking-wide")}>
          Trust
        </span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="mx-auto h-32 w-32 rounded-full bg-nexvo-purple-100" />
      <div className="h-3 rounded-full bg-nexvo-purple-100" />
      <div className="h-3 w-2/3 rounded-full bg-nexvo-purple-100" />
    </div>
  );
}

export function TrustScoreCard({ trust, isLoading = false }: TrustScoreCardProps) {
  const confidencePercent = trust
    ? Math.round(trust.confidence * 100)
    : 0;

  return (
    <Card
      as="section"
      aria-label="Trust score"
      variant="default"
      padding="md"
      className="flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className={textStyles.h2}>Trust Score</h2>
          <p className={cn(textStyles.muted, "mt-1")}>
            How much you can rely on this recommendation
          </p>
        </div>
        <Link
          href="/why"
          className={cn(
            "shrink-0 rounded-full bg-nexvo-purple-50 px-2.5 py-1 text-xs font-medium text-nexvo-purple-700 transition hover:bg-nexvo-purple-100",
            textStyles.caption
          )}
        >
          Why? · v0.1
        </Link>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-center">
        {isLoading ? (
          <Skeleton />
        ) : trust ? (
          <>
            <ScoreRing score={trust.score} />

            <div className="mt-6 space-y-4">
              <div>
                <div className={cn("mb-1.5 flex justify-between", textStyles.caption)}>
                  <span className="text-nexvo-muted">Confidence</span>
                  <span className="font-medium text-foreground">
                    {confidencePercent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-nexvo-purple-100">
                  <div
                    className="nexvo-gradient-bg h-full rounded-full transition-all duration-700"
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
              </div>

              <Card variant="tinted" padding="sm" className="flex items-center justify-between">
                <span className={textStyles.caption}>Evidence</span>
                <span className="text-lg font-semibold text-nexvo-purple-700">
                  {trust.evidenceCount}{" "}
                  <span className={cn(textStyles.caption, "font-normal text-nexvo-muted")}>
                    {trust.evidenceCount === 1 ? "source" : "sources"}
                  </span>
                </span>
              </Card>
            </div>
          </>
        ) : (
          <Card variant="dashed" padding="md" className="py-10 text-center">
            <p className={cn(textStyles.label)}>No score yet</p>
            <p className={cn(textStyles.muted, "mt-2")}>
              Ask a question to see trust score, confidence, and evidence count.
            </p>
          </Card>
        )}
      </div>
    </Card>
  );
}
