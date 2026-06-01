"use client";

import { useSearchParams } from "next/navigation";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FormCard } from "@/components/layout/FormCard";
import { PageIntro } from "@/components/layout/PageIntro";
import { PageShell } from "@/components/layout/PageShell";
import { SuspensePageLoading } from "@/components/layout/SuspensePageLoading";
import type { FeedbackType } from "@/lib/feedback-types";
import { NAV } from "@/lib/navigation";
import { FOOTERS } from "@/lib/site-copy";

function parseInitialType(value: string | null): FeedbackType {
  if (value === "suggestion" || value === "issue" || value === "challenge") {
    return value;
  }
  return "suggestion";
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
        title="Feedback"
        description="Share a suggestion, report an issue, or challenge a recommendation. Your input strengthens the Trust Engine™."
      />

      <FormCard>
        <FeedbackForm initialType={initialType} />
      </FormCard>
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
