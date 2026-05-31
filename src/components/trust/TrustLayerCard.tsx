import type { TrustEngineLayer, TrustLayerAccent } from "@/lib/trust-engine-layers";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

const ACCENT_STYLES: Record<
  TrustLayerAccent,
  { border: string; bg: string; badge: string; dot: string }
> = {
  purple: {
    border: "border-nexvo-purple-200",
    bg: "bg-gradient-to-br from-nexvo-purple-50 to-nexvo-card",
    badge: "bg-nexvo-purple-100 text-nexvo-purple-700",
    dot: "bg-nexvo-purple-500",
  },
  coral: {
    border: "border-nexvo-coral-500/30",
    bg: "bg-gradient-to-br from-nexvo-coral-500/10 to-nexvo-card",
    badge: "bg-nexvo-coral-500/15 text-nexvo-coral-600",
    dot: "bg-nexvo-coral-500",
  },
  violet: {
    border: "border-nexvo-purple-200",
    bg: "bg-gradient-to-br from-nexvo-purple-50/80 via-nexvo-card to-nexvo-purple-50/40",
    badge: "bg-nexvo-purple-100 text-nexvo-purple-700",
    dot: "bg-nexvo-purple-600",
  },
  slate: {
    border: "border-nexvo-border",
    bg: "bg-gradient-to-br from-background to-nexvo-card",
    badge: "bg-foreground/5 text-foreground",
    dot: "bg-foreground/40",
  },
};

type Props = {
  layer: TrustEngineLayer;
};

export function TrustLayerCard({ layer }: Props) {
  const styles = ACCENT_STYLES[layer.accent];

  return (
    <Card
      as="article"
      variant="elevated"
      padding="md"
      className={cn(
        "group relative overflow-hidden transition hover:shadow-md hover:shadow-nexvo-purple-500/5",
        styles.border,
        styles.bg
      )}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl transition group-hover:bg-white/60" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-sm",
              styles.badge
            )}
            aria-hidden
          >
            {layer.icon}
          </span>
          <div>
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                styles.badge
              )}
            >
              Layer {layer.order}
            </span>
            <h2 className={cn(textStyles.h2, "mt-1")}>{layer.name}</h2>
          </div>
        </div>
        <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", styles.dot)} />
      </div>

      <p className={cn("relative mt-3 text-sm font-medium text-nexvo-purple-700")}>
        {layer.tagline}
      </p>
      <p className={cn("relative mt-2", textStyles.muted)}>{layer.description}</p>

      <ul className="relative mt-5 space-y-2">
        {layer.features.map((feature) => (
          <li
            key={feature}
            className={cn("flex gap-2", textStyles.caption, "text-foreground")}
          >
            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)} />
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
}
