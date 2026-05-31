import type { RecommendationSession } from "@/lib/recommendation-session";
import { SectionCard } from "@/components/layout/SectionCard";

type Props = {
  data: RecommendationSession;
};

export function RecommendationSummarySection({ data }: Props) {
  return (
    <SectionCard
      title="Recommendation Summary"
      description="A concise overview of our guidance"
    >
      <p className="text-sm leading-relaxed text-foreground sm:text-base">
        {data.summary}
      </p>
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-nexvo-purple-700 hover:text-nexvo-purple-600">
          View full response
        </summary>
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-nexvo-purple-50/80 p-4 text-sm leading-relaxed text-foreground">
          {data.answer}
        </p>
      </details>
    </SectionCard>
  );
}
