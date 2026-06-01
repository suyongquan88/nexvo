"use client";

import { PurchaseVerificationForm } from "@/components/verify/PurchaseVerificationForm";
import { FormCard } from "@/components/layout/FormCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import { useRecommendationSession } from "@/hooks/useRecommendationSession";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";

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
            . We only use this to improve trust scores.
          </>
        }
      />

      <FormCard>
        <PurchaseVerificationForm />
      </FormCard>

      <p
        className={cn(
          "mt-6 rounded-xl border border-nexvo-purple-100 bg-nexvo-purple-50/60 px-4 py-3 text-center",
          textStyles.caption,
          "font-medium text-nexvo-purple-700"
        )}
      >
        Nexvo never sells user data.
      </p>
    </PageShell>
  );
}
