"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  FEEDBACK_TYPES,
  ISSUE_CATEGORIES,
  type FeedbackSubmission,
  type FeedbackType,
  type IssueCategory,
} from "@/lib/feedback-types";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { SuccessCard } from "@/components/layout/SuccessCard";
import { Button } from "@/design-system/Button";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import { loadRecommendationSession } from "@/lib/recommendation-session";

const MAX_MESSAGE = 1000;
const STORAGE_KEY = "nexvo.feedback";

type Props = {
  initialType?: FeedbackType;
};

export function FeedbackForm({ initialType = "feedback" }: Props) {
  const [type, setType] = useState<FeedbackType>(initialType);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [issueCategory, setIssueCategory] = useState<IssueCategory | "">("");
  const [includeContext, setIncludeContext] = useState(true);
  const [recommendation, setRecommendation] = useState<{
    question: string;
    productName: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const session = loadRecommendationSession();
    if (session) {
      setRecommendation({
        question: session.question,
        productName: session.productName,
      });
      if (initialType === "issue") setIncludeContext(true);
    }
  }, [initialType]);

  const activeMeta = FEEDBACK_TYPES.find((item) => item.value === type)!;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Please enter at least 10 characters.");
      return;
    }

    if (type === "issue" && !issueCategory) {
      setError("Please select an issue category.");
      return;
    }

    const payload: FeedbackSubmission = {
      type,
      message: trimmed,
      email: email.trim() || undefined,
      issueCategory:
        type === "issue" ? (issueCategory as IssueCategory) : undefined,
      recommendationContext:
        type === "issue" && includeContext && recommendation
          ? recommendation
          : undefined,
      submittedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SuccessCard
        title="Thank you"
        message={`Your ${activeMeta.label.toLowerCase()} has been recorded. It helps us improve the Trust Engine and keep recommendations transparent.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Type selector */}
      <fieldset className="space-y-3">
        <legend className="sr-only">Feedback type</legend>
        <div className="grid gap-2">
          {FEEDBACK_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setType(item.value);
                setError(null);
              }}
              aria-pressed={type === item.value}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left transition active:scale-[0.99]",
                type === item.value
                  ? "border-nexvo-purple-500 bg-nexvo-purple-50 ring-2 ring-nexvo-purple-200"
                  : "border-nexvo-border bg-nexvo-card hover:border-nexvo-purple-200"
              )}
            >
              <span className="text-xl" aria-hidden>
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <span className="block text-xs text-nexvo-muted">
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {error ? <AlertBanner>{error}</AlertBanner> : null}

      {type === "issue" ? (
        <>
          <fieldset className="space-y-2">
            <label
              htmlFor="issue-category"
              className={textStyles.label}
            >
              Issue category
            </label>
            <div className="relative">
              <select
                id="issue-category"
                value={issueCategory}
                onChange={(e) =>
                  setIssueCategory(e.target.value as IssueCategory | "")
                }
                className="nexvo-input appearance-none pr-10"
              >
                <option value="">What went wrong?</option>
                {ISSUE_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-nexvo-muted">
                ▾
              </span>
            </div>
          </fieldset>

          {recommendation ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-nexvo-border bg-nexvo-purple-50/50 px-4 py-3">
              <input
                type="checkbox"
                checked={includeContext}
                onChange={(e) => setIncludeContext(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-nexvo-border text-nexvo-purple-600 focus:ring-nexvo-purple-500"
              />
              <span className="text-sm leading-relaxed">
                <span className="font-medium text-foreground">
                  Include recommendation context
                </span>
                <span className="mt-1 block text-nexvo-muted">
                  &ldquo;{recommendation.question}&rdquo; →{" "}
                  {recommendation.productName}
                </span>
              </span>
            </label>
          ) : null}
        </>
      ) : null}

      <fieldset className="space-y-2">
        <label htmlFor="message" className={textStyles.label}>
          {type === "feedback" && "Your feedback"}
          {type === "suggestion" && "Your suggestion"}
          {type === "issue" && "Describe the issue"}
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
          rows={5}
          placeholder={
            type === "feedback"
              ? "Tell us what worked well or what could be better…"
              : type === "suggestion"
                ? "What feature or improvement would you like to see?"
                : "What was wrong with the recommendation? Be as specific as you can…"
          }
          className="nexvo-input resize-none"
        />
        <p className="text-right text-xs text-nexvo-muted">
          {message.length}/{MAX_MESSAGE}
        </p>
      </fieldset>

      <fieldset className="space-y-2">
        <label htmlFor="email" className={textStyles.label}>
          Email
          <span className="ml-1 font-normal text-nexvo-muted">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="nexvo-input"
        />
        <p className="text-xs text-nexvo-muted">
          Only if you&apos;d like us to follow up. We never sell your data.
        </p>
      </fieldset>

      <Button type="submit" size="lg" fullWidth>
        Submit {activeMeta.label.toLowerCase()}
      </Button>
    </form>
  );
}
