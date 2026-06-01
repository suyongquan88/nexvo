"use client";

import { useState } from "react";
import type { ProductRecommendation } from "@/lib/recommendation-session";
import { CommerceMarketplaceLinks } from "@/components/recommendation/CommerceMarketplaceLinks";
import { PriceBadge } from "@/components/recommendation/PriceBadge";
import { TrustScoreBadge } from "@/components/recommendation/TrustScoreBadge";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  product: ProductRecommendation;
  variant?: "default" | "compact";
};

function SpecPill({ children }: { children: string }) {
  return (
    <span className="rounded-lg border border-nexvo-border bg-background px-2.5 py-1 text-xs text-foreground">
      {children}
    </span>
  );
}

function ProConColumn({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "pro" | "con";
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className={cn(textStyles.label, "mb-2")}>{title}</h4>
      <ul className="space-y-1.5">
        {items.slice(0, 4).map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-snug text-foreground"
          >
            <span
              className={cn(
                "mt-0.5 shrink-0 text-xs font-bold",
                variant === "pro" ? "text-emerald-600" : "text-nexvo-coral-500"
              )}
              aria-hidden
            >
              {variant === "pro" ? "✓" : "✗"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductCompareCard({
  product,
  variant = "default",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { detail } = product;

  const pros = detail.pros.length > 0 ? detail.pros : [];
  const cons = detail.cons.length > 0 ? detail.cons : [];
  const specs = detail.specs.length > 0 ? detail.specs : [];

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-nexvo-border bg-nexvo-card",
        variant === "compact" && "shadow-sm"
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={textStyles.eyebrow}>{product.title}</p>
            <h3
              className={cn(
                "mt-1 font-semibold tracking-tight text-foreground",
                variant === "compact" ? "text-lg" : "text-xl sm:text-2xl"
              )}
            >
              {product.productName}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TrustScoreBadge score={product.trustScore} />
            <PriceBadge price={product.price} />
          </div>
        </div>

        <p className={cn(textStyles.body, "mt-4 text-nexvo-muted")}>
          {product.summary}
        </p>

        {detail.ideal_for ? (
          <p className="mt-3 text-sm text-foreground">
            <span className="font-semibold">Ideal for: </span>
            {detail.ideal_for}
          </p>
        ) : null}

        {(pros.length > 0 || cons.length > 0) && (
          <div className="mt-5 grid gap-5 border-t border-nexvo-border pt-5 sm:grid-cols-2">
            <ProConColumn title="Pros" items={pros} variant="pro" />
            <ProConColumn title="Cons" items={cons} variant="con" />
          </div>
        )}

        {specs.length > 0 ? (
          <div className="mt-5 border-t border-nexvo-border pt-5">
            <h4 className={cn(textStyles.label, "mb-2")}>Key specs</h4>
            <div className="flex flex-wrap gap-2">
              {specs.map((spec) => (
                <SpecPill key={spec}>{spec}</SpecPill>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 border-t border-nexvo-border pt-5">
          <CommerceMarketplaceLinks searchKeyword={product.searchKeyword} />
        </div>

        {(detail.parseSuccess && detail.warranty) || detail.fallbackText ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 text-sm font-medium text-nexvo-purple-700 hover:text-nexvo-purple-600"
            aria-expanded={expanded}
          >
            {expanded ? "Hide full analysis" : "View full analysis"}
          </button>
        ) : null}

        {expanded ? (
          <div className="mt-4 rounded-xl bg-background p-4 text-sm leading-relaxed text-nexvo-muted">
            {detail.warranty ? (
              <p className="mb-2 text-foreground">
                <span className="font-semibold">Warranty: </span>
                {detail.warranty}
              </p>
            ) : null}
            <p className="whitespace-pre-line">
              {detail.parseSuccess
                ? [detail.ideal_for, ...specs].filter(Boolean).join(" · ") ||
                  product.summary
                : detail.fallbackText}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
