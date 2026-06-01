import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import { TRUST_ENGINE_LAYERS } from "@/lib/trust-engine-layers";

export function TrustEngineFlow() {
  return (
    <Card variant="default" padding="md" className="sm:p-8">
      <h2 className={textStyles.h2}>Trust Engine flow</h2>
      <p className={cn(textStyles.muted, "mt-1")}>
        Your question moves through four layers before a Trust Score is shown.
      </p>

      <ol className="relative mt-8 space-y-0">
        {TRUST_ENGINE_LAYERS.map((layer, index) => (
          <li key={layer.id} className="relative flex gap-4 pb-8 last:pb-0">
            {index < TRUST_ENGINE_LAYERS.length - 1 ? (
              <span
                className="absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-nexvo-purple-300 to-nexvo-coral-400/50"
                aria-hidden
              />
            ) : null}
            <span className="nexvo-gradient-bg relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md">
              {layer.order}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={textStyles.label}>{layer.name}</p>
              <p className={textStyles.muted}>{layer.tagline}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl nexvo-gradient-bg p-4 text-center text-sm font-semibold text-white shadow-md">
        Trust Score → shown on every recommendation
      </div>
    </Card>
  );
}
