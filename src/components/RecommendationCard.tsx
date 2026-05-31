type RecommendationCardProps = {
  question: string | null;
  answer: string | null;
  isLoading?: boolean;
  error?: string | null;
  isDemo?: boolean;
};

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-1/3 rounded-lg bg-nexvo-purple-100" />
      <div className="h-3 w-full rounded-lg bg-nexvo-purple-100" />
      <div className="h-3 w-full rounded-lg bg-nexvo-purple-100" />
      <div className="h-3 w-4/5 rounded-lg bg-nexvo-purple-100" />
    </div>
  );
}

export function RecommendationCard({
  question,
  answer,
  isLoading = false,
  error = null,
  isDemo = false,
}: RecommendationCardProps) {
  return (
    <section
      aria-label="Recommendation"
      aria-busy={isLoading}
      className="flex h-full min-h-[280px] flex-col rounded-2xl border border-nexvo-border bg-nexvo-card p-6 shadow-sm sm:min-h-[320px]"
    >
      <div className="flex items-start gap-3">
        <div className="nexvo-gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm">
          N
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Recommendation
          </h2>
          <p className="text-sm text-nexvo-muted">
            Personalized guidance with clear reasoning
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-nexvo-coral-500/30 bg-nexvo-coral-500/10 px-4 py-3 text-sm text-foreground"
          >
            {error}
          </div>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : answer && question ? (
          <div className="flex flex-1 flex-col gap-4">
            {isDemo && (
              <p
                role="status"
                className="rounded-xl border border-nexvo-purple-200 bg-nexvo-purple-50 px-4 py-2.5 text-sm text-nexvo-purple-700"
              >
                Demo mode — OpenAI quota unavailable. Add billing or set{" "}
                <code className="rounded bg-white/80 px-1 text-xs">
                  NEXVO_DEMO_MODE=true
                </code>{" "}
                for local previews.
              </p>
            )}
            <div className="rounded-xl bg-nexvo-purple-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-nexvo-purple-700">
                Your question
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground sm:text-base">
                {question}
              </p>
            </div>

            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-nexvo-muted">
                Our recommendation
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground sm:text-base">
                {answer}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-nexvo-border bg-background px-4 py-12 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-nexvo-muted">
              Tell us what you&apos;re deciding on — we&apos;ll recommend the
              best path forward and explain why.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
