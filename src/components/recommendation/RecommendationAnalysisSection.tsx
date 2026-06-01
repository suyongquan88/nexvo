import { parseProductDetail } from "@/lib/parse-product-detail";
import { stripMarkdownPreserveLines } from "@/lib/strip-markdown";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  answer: string;
};

export function RecommendationAnalysisSection({ answer }: Props) {
  const cleaned = stripMarkdownPreserveLines(answer);
  const overview = parseProductDetail(cleaned);

  return (
    <details className="group rounded-2xl border border-nexvo-border bg-nexvo-card">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-semibold text-foreground",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span>Recommendation analysis</span>
        <span
          className="text-nexvo-muted transition group-open:rotate-180"
          aria-hidden
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-nexvo-border px-5 py-4">
        <p className={cn(textStyles.caption, "mb-3")}>
          Structured breakdown — no raw markdown
        </p>
        <div className="max-h-[min(24rem,50vh)] overflow-y-auto rounded-xl border border-nexvo-border bg-background px-4 py-3 text-sm">
          {overview.parseSuccess ? (
            <div className="space-y-4 leading-relaxed">
              {overview.ideal_for ? (
                <p>
                  <span className="font-semibold text-foreground">
                    Ideal for:{" "}
                  </span>
                  {overview.ideal_for}
                </p>
              ) : null}
              {overview.warranty ? (
                <p>
                  <span className="font-semibold text-foreground">
                    Warranty:{" "}
                  </span>
                  {overview.warranty}
                </p>
              ) : null}
              {overview.specs.length > 0 ? (
                <div>
                  <p className="font-semibold text-foreground">Specs</p>
                  <ul className="mt-1 list-inside list-disc text-nexvo-muted">
                    {overview.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {overview.pros.length > 0 ? (
                <div>
                  <p className="font-semibold text-foreground">Pros</p>
                  <ul className="mt-1 list-inside list-disc text-nexvo-muted">
                    {overview.pros.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {overview.cons.length > 0 ? (
                <div>
                  <p className="font-semibold text-foreground">Cons</p>
                  <ul className="mt-1 list-inside list-disc text-nexvo-muted">
                    {overview.cons.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="whitespace-pre-line text-nexvo-muted">
              {overview.fallbackText}
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
