import { TrustEngineFlow } from "@/components/trust/TrustEngineFlow";
import { TrustLayerCard } from "@/components/trust/TrustLayerCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { TrustEngineBadge } from "@/components/layout/TrustEngineBadge";
import { Button } from "@/design-system/Button";
import { TRUST_ENGINE_LAYERS } from "@/lib/trust-engine-layers";
import { NAV } from "@/lib/navigation";
import { FOOTERS, SITE_MISSION } from "@/lib/site-copy";

export default function TrustPage() {
  return (
    <PageShell nav={NAV.trust} footer={FOOTERS.trust}>
      <PageIntro
        eyebrow="Trust Engine™"
        title={
          <>
            How Nexvo builds{" "}
            <span className="nexvo-gradient-text">verifiable trust</span>
          </>
        }
        description={`${SITE_MISSION} The Trust Engine is Nexvo's core technology—four layers that turn AI guidance into recommendations you can inspect, challenge, and improve.`}
      >
        <div className="mt-4">
          <TrustEngineBadge linked={false} label="Trust Engine™ v0.1" />
        </div>
      </PageIntro>

      <section aria-labelledby="trust-flow" className="mb-10 lg:mb-12">
        <h2 id="trust-flow" className="sr-only">
          Trust Engine flow
        </h2>
        <TrustEngineFlow />
      </section>

      <section aria-labelledby="layers-heading" className="mb-10">
        <h2 id="layers-heading" className="mb-6 text-lg font-semibold text-foreground sm:text-xl">
          Four layers of trust
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TRUST_ENGINE_LAYERS.map((layer) => (
            <TrustLayerCard key={layer.id} layer={layer} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-nexvo-border pt-8 sm:flex-row sm:flex-wrap">
        <Button href="/why" variant="outline">
          View score breakdown
        </Button>
        <Button href="/verify">Submit verification</Button>
        <Button href="/feedback" variant="outline">
          Send feedback
        </Button>
      </div>
    </PageShell>
  );
}
