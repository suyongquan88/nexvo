import type { TrustFactor } from "@/lib/trust-breakdown";

const STATUS_STYLES = {
  strong: {
    label: "Strong",
    className: "bg-nexvo-purple-100 text-nexvo-purple-700",
  },
  moderate: {
    label: "Moderate",
    className: "bg-nexvo-coral-500/15 text-nexvo-coral-600",
  },
  limited: {
    label: "Limited",
    className: "bg-nexvo-border text-nexvo-muted",
  },
} as const;

type Props = {
  factors: TrustFactor[];
};

export function TrustFactorsList({ factors }: Props) {
  return (
    <ul className="space-y-4">
      {factors.map((factor) => {
        const status = STATUS_STYLES[factor.status];
        const percent =
          factor.maxPoints > 0
            ? Math.round((factor.points / factor.maxPoints) * 100)
            : 0;

        return (
          <li
            key={factor.id}
            className="rounded-2xl border border-nexvo-border bg-nexvo-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">{factor.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-nexvo-muted">
                  {factor.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums text-nexvo-purple-700">
                  {factor.points}
                  <span className="text-base font-normal text-nexvo-muted">
                    /{factor.maxPoints}
                  </span>
                </p>
                <p className="text-xs text-nexvo-muted">
                  Weight {factor.weightPercent}%
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-nexvo-muted">
                <span>Factor contribution</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-nexvo-purple-100">
                <div
                  className="nexvo-gradient-bg h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
