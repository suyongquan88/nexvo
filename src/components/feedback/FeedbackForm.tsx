"use client";

import { FormEvent, useState } from "react";
import {
  FEEDBACK_TYPES,
  type FeedbackSubmission,
  type FeedbackType,
} from "@/lib/feedback-types";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { SuccessCard } from "@/components/layout/SuccessCard";
import { Button } from "@/design-system/Button";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

const MAX_MESSAGE = 1000;
const STORAGE_KEY = "nexvo.feedback";

const MESSAGE_LABEL: Record<FeedbackType, string> = {
  suggestion: "Your suggestion",
  issue: "Describe the issue",
  challenge: "Why do you disagree?",
};

const MESSAGE_PLACEHOLDER: Record<FeedbackType, string> = {
  suggestion: "What feature or improvement would you like to see?",
  issue: "What went wrong? Be as specific as you can…",
  challenge:
    "Which recommendation do you disagree with, and why? Be as specific as you can…",
};

type Props = {
  initialType?: FeedbackType;
};

export function FeedbackForm({ initialType = "suggestion" }: Props) {
  const [type, setType] = useState<FeedbackType>(initialType);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeMeta = FEEDBACK_TYPES.find((item) => item.value === type)!;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Please enter at least 10 characters.");
      return;
    }

    const payload: FeedbackSubmission = {
      type,
      message: trimmed,
      email: email.trim() || undefined,
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
      <fieldset className="space-y-3">
        <legend className={textStyles.label}>Type</legend>
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

      <fieldset className="space-y-2">
        <label htmlFor="message" className={textStyles.label}>
          Message
        </label>
        <p className={textStyles.caption}>{MESSAGE_LABEL[type]}</p>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
          rows={5}
          placeholder={MESSAGE_PLACEHOLDER[type]}
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
        {activeMeta.label}
      </Button>
    </form>
  );
}
