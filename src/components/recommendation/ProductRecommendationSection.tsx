import type { RecommendationSession } from "@/lib/recommendation-session";
import { SectionCard } from "@/components/layout/SectionCard";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  data: RecommendationSession;
};

export function ProductRecommendationSection({ data }: Props) {
  return (
    <SectionCard
      title="Product Recommendation"
      description="Our top verified pick for your question"
      variant="glow"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="nexvo-gradient-bg flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-lg shadow-nexvo-purple-600/20 sm:h-28 sm:w-28">
          {data.productName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className={textStyles.eyebrow}>Top pick</p>
          <h3 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {data.productName}
          </h3>
          <p className={cn(textStyles.muted, "mt-3 sm:text-base")}>
            Based on: &ldquo;{data.question}&rdquo;
          </p>

          {data.demo ? (
            <span className="mt-4 inline-flex rounded-full border border-nexvo-purple-200 bg-nexvo-purple-50 px-3 py-1 text-xs font-medium text-nexvo-purple-700">
              Demo recommendation
            </span>
          ) : null}
        </div>
      </div>
    </SectionCard>
  );
}
