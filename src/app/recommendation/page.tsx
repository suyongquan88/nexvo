"use client";

import { EvidenceCountSection } from "@/components/recommendation/EvidenceCountSection";
import { ProductRecommendationSection } from "@/components/recommendation/ProductRecommendationSection";
import { RecommendationSummarySection } from "@/components/recommendation/RecommendationSummarySection";
import { UserFeedbackSection } from "@/components/recommendation/UserFeedbackSection";
import { WhyWeRecommendSection } from "@/components/recommendation/WhyWeRecommendSection";
import { EmptyStateCard } from "@/components/layout/EmptyStateCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageShell } from "@/components/layout/PageShell";
import { TrustScoreCard } from "@/components/TrustScoreCard";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { NAV } from "@/lib/navigation";
import { FOOTERS, SITE_TAGLINE } from "@/lib/site-copy";

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
      <PageIntro
        eyebrow="Your verified recommendation"
        title="Recommendation result"
        description={`${SITE_TAGLINE} — We verify choices for people, not rankings for merchants.`}
      />

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductRecommendationSection data={session} />
          <RecommendationSummarySection data={session} />
          <WhyWeRecommendSection data={session} />
          <EvidenceCountSection trust={session.trust} />
          <UserFeedbackSection />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <TrustScoreCard trust={session.trust} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
