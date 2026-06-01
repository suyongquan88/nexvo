import type { ProductRecommendation } from "@/lib/recommendation-session";
import { CommerceMarketplaceLinks } from "@/components/recommendation/CommerceMarketplaceLinks";
import { PriceBadge } from "@/components/recommendation/PriceBadge";
import { TrustScoreBadge } from "@/components/recommendation/TrustScoreBadge";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  product: ProductRecommendation;
  question: string;
};

export function HeroRecommendationSection({ product, question }: Props) {
  const topPros = product.detail.pros.slice(0, 3);
  const topSpecs = product.detail.specs.slice(0, 4);

  return (
    <section
      aria-label="Top recommendation"
      className="overflow-hidden rounded-3xl border border-nexvo-purple-200 bg-gradient-to-br from-nexvo-purple-50/80 via-nexvo-card to-nexvo-card shadow-sm"
    >
      <div className="border-b border-nexvo-purple-100/80 px-6 py-4 sm:px-8">
        <p className={textStyles.eyebrow}>Nexvo top pick</p>
        <p className={cn(textStyles.muted, "mt-1 max-w-2xl text-sm")}>
          Verified recommendation for &ldquo;{question}&rdquo;
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(0,280px)] lg:items-start">
        <div>
          <p className="text-sm font-medium text-nexvo-purple-700">
            {product.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.productName}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-nexvo-muted">
            {product.summary}
          </p>

          {product.detail.ideal_for ? (
            <p className="mt-4 text-sm text-foreground">
              <span className="font-semibold">Ideal for </span>
              {product.detail.ideal_for}
            </p>
          ) : null}

          {topPros.length > 0 ? (
            <ul className="mt-6 space-y-2">
              {topPros.map((pro) => (
                <li
                  key={pro}
                  className="flex gap-2 text-sm font-medium text-foreground"
                >
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {pro}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8">
            <CommerceMarketplaceLinks
              searchKeyword={product.searchKeyword}
              layout="row"
            />
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-nexvo-border bg-background/80 p-5 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2">
            <TrustScoreBadge score={product.trustScore} />
            <PriceBadge price={product.price} />
          </div>

          {topSpecs.length > 0 ? (
            <div>
              <h3 className={cn(textStyles.label, "mb-2")}>Key specs</h3>
              <ul className="space-y-2 text-sm text-foreground">
                {topSpecs.map((spec) => (
                  <li key={spec} className="flex gap-2">
                    <span className="text-nexvo-muted" aria-hidden>
                      •
                    </span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.detail.warranty ? (
            <p className="text-xs leading-relaxed text-nexvo-muted">
              <span className="font-semibold text-foreground">Warranty </span>
              {product.detail.warranty}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
