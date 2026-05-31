"use client";

import { useSearchParams } from "next/navigation";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { BulletList } from "@/components/layout/BulletList";
import { FormCard } from "@/components/layout/FormCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { SuspensePageLoading } from "@/components/layout/SuspensePageLoading";
import type { FeedbackType } from "@/lib/feedback-types";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";

const FEEDBACK_NOTES = [
  "Feedback shapes product priorities and trust scoring.",
  "Report issues to flag recommendations that seem wrong or unfair.",
  "We don't rank products for merchants — we verify for people.",
];

function parseInitialType(value: string | null): FeedbackType {
  if (value === "suggestion" || value === "issue" || value === "feedback") {
    return value;
  }
  return "feedback";
}

function FeedbackPageContent() {
  const searchParams = useSearchParams();
  const initialType = parseInitialType(searchParams.get("type"));

  return (
    <PageShell
      width="narrow"
      nav={NAV.feedback}
      footer={FOOTERS.feedback}
      footerBordered={false}
    >
      <PageIntro
        size="sm"
        eyebrow="Help us improve"
        title="Feedback & support"
        description="Better Choices. Better Living. Your input strengthens the Trust Engine™ — no ads, no sponsored rankings."
      />

      <FormCard>
        <FeedbackForm initialType={initialType} />
      </FormCard>

      <div className="mt-6">
        <BulletList items={FEEDBACK_NOTES} />
      </div>
    </PageShell>
  );
}

export default function FeedbackPage() {
  return (
    <SuspensePageLoading>
      <FeedbackPageContent />
    </SuspensePageLoading>
  );
}
