import type { TrustMetrics } from "@/components/TrustScoreCard";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/design-system/Button";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  trust: TrustMetrics;
};

const EVIDENCE_LABELS = [
  { key: "verified", label: "Verified purchases", weight: "High" },
  { key: "feedback", label: "Community feedback", weight: "Medium" },
  { key: "reviews", label: "Independent reviews", weight: "Medium" },
] as const;

export function EvidenceCountSection({ trust }: Props) {
  return (
    <SectionCard
      title="Evidence Count"
      description="Sources backing this recommendation"
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-4xl font-bold text-nexvo-purple-700">
            {trust.evidenceCount}
          </p>
          <p className={textStyles.muted}>total verified sources</p>
        </div>
        <div className="rounded-full bg-nexvo-purple-50 px-4 py-2 text-sm font-medium text-nexvo-purple-700">
          Confidence {Math.round(trust.confidence * 100)}%
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {EVIDENCE_LABELS.map((item) => (
          <Card
            key={item.key}
            variant="outline"
            padding="sm"
            className="flex items-center justify-between"
          >
            <div>
              <p className={textStyles.label}>{item.label}</p>
              <p className={textStyles.caption}>Weight: {item.weight}</p>
            </div>
            <span className="text-lg font-semibold tabular-nums text-nexvo-muted">
              0
            </span>
          </Card>
        ))}
      </ul>

      <Button href="/verify" fullWidth className="mt-4 sm:w-auto">
        Verify purchase
      </Button>
      <p className={cn(textStyles.caption, "mt-3 leading-relaxed")}>
        Upload purchase proof after buying to increase evidence count and improve
        the Trust Engine for everyone.
      </p>
    </SectionCard>
  );
}
