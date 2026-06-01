import { cn } from "@/design-system/cn";

type Props = {
  score: number;
  className?: string;
};

export function TrustScoreBadge({ score, className }: Props) {
  const tone =
    score >= 80
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : score >= 65
        ? "border-nexvo-purple-200 bg-nexvo-purple-50 text-nexvo-purple-900"
        : "border-nexvo-border bg-background text-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums",
        tone,
        className
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
        Trust
      </span>
      {score}
      <span className="font-normal opacity-60">/100</span>
    </span>
  );
}
