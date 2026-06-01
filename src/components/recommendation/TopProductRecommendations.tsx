import type { RecommendationSession } from "@/lib/recommendation-session";
import { HeroRecommendationSection } from "@/components/recommendation/HeroRecommendationSection";
import { ProductCompareCard } from "@/components/recommendation/ProductCompareCard";
import { QuickBuyingTipsSection } from "@/components/recommendation/QuickBuyingTipsSection";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  data: RecommendationSession;
};

export function TopProductRecommendations({ data }: Props) {
  const [hero, ...rest] = data.products;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Compare your picks
          </h1>
          <p className={cn(textStyles.muted, "mt-1 max-w-2xl")}>
            Ranked by Nexvo Trust Score — no sponsored placements.
          </p>
        </div>
        {data.demo ? (
          <span className="inline-flex rounded-full border border-nexvo-purple-200 bg-nexvo-purple-50 px-3 py-1 text-xs font-medium text-nexvo-purple-700">
            Demo mode
          </span>
        ) : null}
      </div>

      {hero ? (
        <HeroRecommendationSection product={hero} question={data.question} />
      ) : null}

      <QuickBuyingTipsSection tips={data.buyingTips} />

      {rest.length > 0 ? (
        <section aria-label="More recommendations">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Also consider
          </h2>
          <ol className="flex list-none flex-col gap-4">
            {rest.map((product) => (
              <li key={product.rank}>
                <ProductCompareCard product={product} variant="compact" />
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
