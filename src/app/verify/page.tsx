"use client";

import { PurchaseVerificationForm } from "@/components/verify/PurchaseVerificationForm";
import { BulletList } from "@/components/layout/BulletList";
import { FormCard } from "@/components/layout/FormCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";

const VERIFY_NOTES = [
  "Screenshots are reviewed before affecting trust scores.",
  "No merchant can pay to alter your verification.",
  "Redact payment details you don't want to share.",
];

export default function VerifyPage() {
  const { session } = useRecommendationSession();

  return (
    <PageShell
      width="narrow"
      nav={NAV.verify(!!session)}
      footer={FOOTERS.verify}
      footerBordered={false}
    >
      <PageIntro
        size="sm"
        eyebrow="Purchase verification"
        title="Verify your purchase"
        description={
          <>
            Upload proof to strengthen evidence for{" "}
            {session?.productName ? (
              <span className="font-medium text-foreground">
                {session.productName}
              </span>
            ) : (
              "your recommendation"
            )}
            . Privacy first — we only use this to improve trust scores.
          </>
        }
      />

      <FormCard>
        <PurchaseVerificationForm />
      </FormCard>

      <div className="mt-6">
        <BulletList items={VERIFY_NOTES} />
      </div>
    </PageShell>
  );
}
