import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type Props = {
  tips: string;
};

export function QuickBuyingTipsSection({ tips }: Props) {
  if (!tips.trim()) return null;

  const lines = tips
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^quick\s+buying\s+tips/i.test(l));

  if (lines.length === 0) return null;

  return (
    <aside
      aria-label="Quick buying tips"
      className="rounded-2xl border border-dashed border-nexvo-purple-200 bg-nexvo-purple-50/40 px-5 py-4"
    >
      <h2 className={cn(textStyles.label, "text-nexvo-purple-800")}>
        Quick buying tips
      </h2>
      <ul className="mt-3 space-y-2">
        {lines.map((line) => (
          <li
            key={line}
            className="flex gap-2 text-sm leading-relaxed text-nexvo-muted"
          >
            <span className="shrink-0 text-nexvo-purple-600" aria-hidden>
              →
            </span>
            {line.replace(/^[-*•]\s+/, "")}
          </li>
        ))}
      </ul>
    </aside>
  );
}
