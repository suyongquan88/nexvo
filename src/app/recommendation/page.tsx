"use client";

import { TopProductRecommendations } from "@/components/recommendation/TopProductRecommendations";
import { RecommendationAnalysisSection } from "@/components/recommendation/RecommendationAnalysisSection";
import { EmptyStateCard } from "@/components/layout/EmptyStateCard";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/design-system/Button";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";

export default function RecommendationPage() {
  const { session, ready } = useRecommendationSession();

  if (!ready) return <PageLoading />;

  if (!session) {
    return (
      <PageShell width="narrow" showHeader={false} className="py-16">
        <EmptyStateCard
          title="No recommendation yet"
          description="Ask Nexvo a question on the homepage to see your personalized recommendation here."
          actionHref="/"
          actionLabel="Back to home"
        />
      </PageShell>
    );
  }

  return (
    <PageShell nav={NAV.recommendation} footer={FOOTERS.default}>
      <div className="flex flex-col gap-8">
        <TopProductRecommendations data={session} />

        <RecommendationAnalysisSection answer={session.answer} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/why" variant="outline" fullWidth className="sm:flex-1">
            Why this recommendation
          </Button>
          <Button href="/verify" fullWidth className="sm:flex-1">
            Verify purchase
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
