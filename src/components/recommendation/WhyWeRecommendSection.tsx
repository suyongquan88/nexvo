import type { RecommendationSession } from "@/lib/recommendation-session";
import { SectionCard } from "@/components/layout/SectionCard";

type Props = {
  data: RecommendationSession;
};

export function WhyWeRecommendSection({ data }: Props) {
  return (
    <SectionCard
      title="Why We Recommend"
      description="Evidence before opinion — no sponsored rankings"
    >
      <ul className="space-y-3">
        {data.whyWeRecommend.map((reason, index) => (
          <li
            key={reason}
            className="flex gap-3 rounded-xl bg-nexvo-purple-50/70 px-4 py-3 text-sm leading-relaxed text-foreground sm:text-base"
          >
            <span className="nexvo-gradient-bg flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
              {index + 1}
            </span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
