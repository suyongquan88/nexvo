"use client";

import { useState } from "react";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { TrustEngineBadge } from "@/components/layout/TrustEngineBadge";
import { SearchBox } from "@/components/SearchBox";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import { SITE_MISSION_LINES } from "@/lib/site-copy";

const EXAMPLE_QUESTIONS = [
  "Best laptop for software developers?",
  "Which air purifier is worth buying?",
  "Best standing desk under $500?",
] as const;

type HeroSectionProps = {
  onSearch: (question: string) => void;
  isLoading?: boolean;
  error?: string | null;
};

export function HeroSection({
  onSearch,
  isLoading = false,
  error = null,
}: HeroSectionProps) {
  const [question, setQuestion] = useState("");

  return (
    <header className="nexvo-hero-glow relative w-full">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <TrustEngineBadge label="Trust Engine™ — Early access" />

        <h1 className={`mt-6 sm:mt-8 ${textStyles.display}`}>
          <span className="nexvo-gradient-text">Nexvo</span>
        </h1>

        <p
          className={cn(
            "mx-auto mt-4 max-w-lg",
            textStyles.bodyLg,
            "font-medium leading-relaxed text-foreground"
          )}
        >
          {SITE_MISSION_LINES[0]}
          <br />
          {SITE_MISSION_LINES[1]}
        </p>

        <p
          className={cn(
            "mx-auto mt-3 max-w-md",
            textStyles.caption,
            "text-nexvo-muted sm:text-sm"
          )}
        >
          Ask anything you&apos;re deciding on — get a verified recommendation
          with a Trust Score, not a sponsored ranking.
        </p>

        <div className="mt-8 w-full sm:mt-10">
          <SearchBox
            question={question}
            onQuestionChange={setQuestion}
            onSearch={onSearch}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-5 w-full sm:mt-6">
          <p className={cn(textStyles.caption, "text-nexvo-muted")}>
            Try an example
          </p>
          <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {EXAMPLE_QUESTIONS.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setQuestion(example)}
                  className={cn(
                    "w-full rounded-full border border-nexvo-border bg-nexvo-card px-4 py-2.5",
                    textStyles.caption,
                    "text-left text-foreground transition sm:w-auto sm:text-center",
                    "hover:border-nexvo-purple-200 hover:bg-nexvo-purple-50/80",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {error ? (
          <div className="mt-4 w-full text-left">
            <AlertBanner>{error}</AlertBanner>
          </div>
        ) : null}
      </div>
    </header>
  );
}
