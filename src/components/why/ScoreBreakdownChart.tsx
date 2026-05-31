import type { TrustBreakdown } from "@/lib/trust-breakdown";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  breakdown: TrustBreakdown;
};

export function ScoreBreakdownChart({ breakdown }: Props) {
  const maxPoints = breakdown.factors.reduce(
    (sum, factor) => sum + factor.maxPoints,
    0
  );

  return (
    <Card variant="default" padding="md">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={textStyles.h2}>Score breakdown</h2>
          <p className={cn(textStyles.muted, "mt-1")}>
            How factors combine into your Trust Score
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-4xl font-bold tabular-nums text-foreground">
            {breakdown.totalScore}
            <span className="text-lg font-normal text-nexvo-muted">/100</span>
          </p>
          <p className={textStyles.muted}>
            Confidence {Math.round(breakdown.confidence * 100)}%
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-10 w-full overflow-hidden rounded-xl">
        {breakdown.factors.map((factor) => {
          const width =
            maxPoints > 0 ? (factor.points / maxPoints) * 100 : 0;
          if (width <= 0) return null;

          return (
            <div
              key={factor.id}
              title={`${factor.name}: ${factor.points} pts`}
              className="nexvo-gradient-bg first:rounded-l-xl last:rounded-r-xl opacity-90 transition-all"
              style={{
                width: `${width}%`,
                opacity: 0.55 + (factor.points / factor.maxPoints) * 0.45,
              }}
            />
          );
        })}
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {breakdown.factors.map((factor) => (
          <Card
            key={factor.id}
            variant="tinted"
            padding="sm"
            className="flex items-center justify-between"
          >
            <span className={textStyles.caption}>{factor.name}</span>
            <span className="font-semibold tabular-nums text-nexvo-purple-700">
              +{factor.points}
            </span>
          </Card>
        ))}
      </ul>

      <Card variant="dashed" padding="sm" className="mt-4 bg-background">
        <p className={textStyles.caption}>
          Trust Score v0.1 — preview methodology. Evidence weight increases when
          you submit verified purchase proof and community feedback.
        </p>
      </Card>
    </Card>
  );
}
