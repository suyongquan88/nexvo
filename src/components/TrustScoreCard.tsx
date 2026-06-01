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
  score: number;
  confidence: number;
  evidenceCount: number;
  className?: string;
};

function formatConfidence(confidence: number): number {
  return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}

function evidenceLabel(count: number): string {
  return count === 1 ? "verified signal" : "verified signals";
}

export function TrustScoreCard({
  score,
  confidence,
  evidenceCount,
  className,
}: TrustScoreCardProps) {
  const confidencePercent = formatConfidence(confidence);

  return (
    <Card
      as="section"
      aria-label="Trust score"
      variant="default"
      padding="md"
      className={cn("flex flex-col", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn(textStyles.eyebrow, "normal-case tracking-normal")}>
          Trust Score
        </p>
        <Link
          href="/why"
          className="shrink-0 text-xs font-medium text-nexvo-purple-700 transition hover:text-nexvo-purple-600"
        >
          Why?
        </Link>
      </div>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-foreground sm:text-6xl">
          {score}
        </span>
        <span className="text-lg font-normal text-nexvo-muted sm:text-xl">
          / 100
        </span>
      </div>

      <dl className="mt-8 space-y-4 border-t border-nexvo-border pt-6">
        <div className="flex items-center justify-between gap-4">
          <dt className={textStyles.caption}>Confidence</dt>
          <dd className="text-base font-medium tabular-nums text-foreground">
            {confidencePercent}%
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className={textStyles.caption}>Evidence</dt>
          <dd className="text-right text-base font-medium tabular-nums text-foreground">
            {evidenceCount} {evidenceLabel(evidenceCount)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
