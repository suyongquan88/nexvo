"use client";

import Link from "next/link";
import { useMemo } from "react";
import { textStyles } from "@/design-system/typography";
import { ScoreBreakdownChart } from "@/components/why/ScoreBreakdownChart";
import { TransparencyPrinciples } from "@/components/why/TransparencyPrinciples";
import { TrustFactorsList } from "@/components/why/TrustFactorsList";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageShell } from "@/components/layout/PageShell";
import { SectionCard } from "@/components/layout/SectionCard";
import { TrustScoreCard } from "@/components/TrustScoreCard";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { computeTrustBreakdown } from "@/lib/trust-breakdown";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";
import { previewTrustMetrics } from "@/lib/trust";

const EXAMPLE_TRUST = previewTrustMetrics(640);

export default function WhyPage() {
  const { session, ready } = useRecommendationSession();

  const trust = session?.trust ?? EXAMPLE_TRUST;
  const breakdown = useMemo(
    () => computeTrustBreakdown(trust, session),
    [trust, session]
  );

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
            {session.demo ? (
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-nexvo-purple-700">
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
          <ScoreBreakdownChart breakdown={breakdown} />

            <section>
              <h2 className={`mb-4 ${textStyles.h2}`}>Trust factors</h2>
              <p className={`mb-6 ${textStyles.muted}`}>
              Five weighted dimensions power the Trust Engine™. Each is scored
              independently and summed to your total.
            </p>
            <TrustFactorsList factors={breakdown.factors} />
          </section>

          <TransparencyPrinciples />
        </div>

        <aside className="lg:col-span-1">
          <div className="flex flex-col gap-6 lg:sticky lg:top-8">
            <TrustScoreCard trust={trust} />

            <SectionCard title="Evidence today">
              <p className="text-3xl font-bold text-nexvo-purple-700">
                {breakdown.evidenceCount}
              </p>
              <p className="mt-1 text-sm text-nexvo-muted">
                verified sources linked to this recommendation
              </p>
              <Link
                href={session ? "/recommendation" : "/"}
                className="mt-4 inline-flex text-sm font-medium text-nexvo-purple-700 hover:text-nexvo-purple-600"
              >
                {session
                  ? "Back to recommendation →"
                  : "Get a recommendation →"}
              </Link>
            </SectionCard>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
