"use client";

import { useState } from "react";
import { SectionCard } from "@/components/layout/SectionCard";
import { Button } from "@/design-system/Button";
import { Card, cardClasses } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type FeedbackValue = "helpful" | "not_helpful" | null;

export function UserFeedbackSection() {
  const [feedback, setFeedback] = useState<FeedbackValue>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (value: FeedbackValue) => {
    setFeedback(value);
    setSubmitted(true);
  };

  return (
    <SectionCard
      title="User Feedback"
      description="Help Nexvo improve — was this recommendation useful?"
    >
      {submitted && feedback ? (
        <Card variant="tinted" padding="sm" className={textStyles.body}>
          <p className="text-nexvo-purple-700">
            Thank you — your feedback helps the Trust Engine learn.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSelect("helpful")}
          className={cn(
            cardClasses("interactive", "sm", "w-full text-left"),
            feedback === "helpful" &&
              "border-nexvo-purple-500 bg-nexvo-purple-50 ring-2 ring-nexvo-purple-200"
          )}
        >
          <span className="text-lg" aria-hidden>
            ✓
          </span>
          <p className={cn(textStyles.label, "mt-2")}>Helpful</p>
          <p className={cn(textStyles.muted, "mt-1")}>
            This matched what I needed
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSelect("not_helpful")}
          className={cn(
            cardClasses("interactive", "sm", "w-full text-left"),
            feedback === "not_helpful" &&
              "border-nexvo-coral-500 bg-nexvo-coral-500/10 ring-2 ring-nexvo-coral-500/30"
          )}
        >
          <span className="text-lg" aria-hidden>
            ✗
          </span>
          <p className={cn(textStyles.label, "mt-2")}>Not helpful</p>
          <p className={cn(textStyles.muted, "mt-1")}>
            I need a different suggestion
          </p>
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-nexvo-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className={textStyles.muted}>Need to share more detail?</p>
        <div className="flex flex-wrap gap-2">
          <Button
            href="/feedback?type=suggestion"
            variant="outline"
            size="sm"
          >
            Suggestion
          </Button>
          <Button href="/feedback?type=issue" variant="outline" size="sm">
            Report issue
          </Button>
          <Button
            href="/feedback?type=challenge"
            variant="outline"
            size="sm"
          >
            Challenge
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
