import { TrustEngineFlow } from "@/components/trust/TrustEngineFlow";
import { TrustLayerCard } from "@/components/trust/TrustLayerCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { TrustEngineBadge } from "@/components/layout/TrustEngineBadge";
import { TransparencyPrinciples } from "@/components/why/TransparencyPrinciples";
import { Button } from "@/design-system/Button";
import { TRUST_ENGINE_LAYERS } from "@/lib/trust-engine-layers";
import { NAV } from "@/lib/navigation";
import { FOOTERS, SITE_MISSION } from "@/lib/site-copy";

export default function TrustPage() {
  return (
    <PageShell nav={NAV.trust} footer={FOOTERS.trust}>
      <PageIntro
        title={
          <>
            How Nexvo builds{" "}
            <span className="nexvo-gradient-text">verifiable trust</span>
          </>
        }
        description={`${SITE_MISSION} The Trust Engine is Nexvo's core technology—a stack of four layers that turn AI guidance into recommendations you can inspect, challenge, and improve.`}
      >
        <div className="mt-4">
          <TrustEngineBadge linked={false} label="Trust Engine™" />
        </div>
      </PageIntro>

      <section aria-labelledby="layers-heading" className="mb-12">
        <h2 id="layers-heading" className="sr-only">
          Trust Engine layers
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TRUST_ENGINE_LAYERS.map((layer) => (
            <TrustLayerCard key={layer.id} layer={layer} />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <TrustEngineFlow />

        <div className="flex flex-col gap-6">
          <TransparencyPrinciples
            layout="list"
            title="Trust principles"
            subtitle="Non-negotiable rules every layer enforces"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/verify">Submit verification</Button>
            <Button href="/feedback" variant="outline">
              Send feedback
            </Button>
            <Button href="/why" variant="outline">
              View score breakdown
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
