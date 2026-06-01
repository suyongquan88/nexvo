"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ScoreBreakdownChart } from "@/components/why/ScoreBreakdownChart";
import { TransparencyPrinciples } from "@/components/why/TransparencyPrinciples";
import { TrustFactorsList } from "@/components/why/TrustFactorsList";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageShell } from "@/components/layout/PageShell";
import { SectionCard } from "@/components/layout/SectionCard";
import { TrustScoreCard } from "@/components/TrustScoreCard";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { computeTrustBreakdown } from "@/lib/trust-breakdown";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";
import { previewTrustMetrics } from "@/lib/trust";

const EXAMPLE_TRUST = previewTrustMetrics(640);

function formatConfidence(confidence: number): number {
  return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}

export default function WhyPage() {
  const { session, ready } = useRecommendationSession();

  const trust = session?.trust ?? EXAMPLE_TRUST;
  const breakdown = useMemo(
    () => computeTrustBreakdown(trust, session),
    [trust, session]
  );
  const confidencePercent = formatConfidence(breakdown.confidence);

  if (!ready) return <PageLoading />;

  return (
    <PageShell nav={NAV.why(!!session)} footer={FOOTERS.why}>
      <PageIntro
        eyebrow="Recommendation transparency"
        title="Why this score?"
        description="Every Nexvo recommendation includes a Trust Score you can inspect. Below is exactly what influenced your result—no hidden sponsored weights."
      >
        {session ? (
          <p className="mt-4 rounded-xl bg-nexvo-purple-50 px-4 py-3 text-sm text-foreground">
            Showing breakdown for:{" "}
            <span className="font-medium">&ldquo;{session.question}&rdquo;</span>
            {session.productName ? (
              <span className="mt-1 block text-nexvo-muted">
                Recommended: {session.productName}
              </span>
            ) : null}
            {session.demo ? (
              <span className="ml-2 inline-flex rounded-full bg-white px-2 py-0.5 text-xs font-medium text-nexvo-purple-700">
                Demo
              </span>
            ) : null}
          </p>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-nexvo-border px-4 py-3 text-sm text-nexvo-muted">
            Example breakdown below. Ask a question on the{" "}
            <Link href="/" className="font-medium text-nexvo-purple-700">
              homepage
            </Link>{" "}
            to see your personalized transparency report.
          </p>
        )}
      </PageIntro>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section aria-labelledby="trust-breakdown">
            <h2 id="trust-breakdown" className="sr-only">
              Trust Score Breakdown
            </h2>
            <ScoreBreakdownChart breakdown={breakdown} />
          </section>

          <SectionCard
            title="Evidence Count"
            description="Verified sources backing this recommendation"
          >
            <p className="text-4xl font-semibold tabular-nums text-foreground">
              {breakdown.evidenceCount}
            </p>
            <p className={cn(textStyles.muted, "mt-2")}>
              {breakdown.evidenceCount === 1
                ? "verified signal linked to this recommendation"
                : "verified signals linked to this recommendation"}
            </p>
            <p className={cn(textStyles.caption, "mt-4 text-nexvo-muted")}>
              Submit purchase proof on the verify page to increase evidence
              weight over time.
            </p>
          </SectionCard>

          <SectionCard
            title="Confidence Score"
            description="How certain Nexvo is given available evidence"
          >
            <div className="flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold tabular-nums text-foreground">
                {confidencePercent}%
              </p>
              <p className={textStyles.caption}>calibrated confidence</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-nexvo-purple-100">
              <div
                className="nexvo-gradient-bg h-full rounded-full transition-all duration-700"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <p className={cn(textStyles.caption, "mt-4 text-nexvo-muted")}>
              Lower confidence means thinner evidence—we surface that instead
              of overstating certainty.
            </p>
          </SectionCard>

          <section aria-labelledby="ranking-factors">
            <h2 id="ranking-factors" className={`mb-4 ${textStyles.h2}`}>
              Why this product ranked higher
            </h2>
            <p className={`mb-6 ${textStyles.muted}`}>
              Weighted factors that shaped this recommendation—no sponsored
              placements or merchant payments.
            </p>
            <TrustFactorsList factors={breakdown.factors} />
          </section>

          <TransparencyPrinciples title="Transparency Principles" />
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <TrustScoreCard
              score={trust.score}
              confidence={trust.confidence}
              evidenceCount={trust.evidenceCount}
            />
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
