"use client";

import { FormEvent } from "react";
import { Button } from "@/design-system/Button";
import { Card } from "@/design-system/Card";
import { textStyles } from "@/design-system/typography";

type SearchBoxProps = {
  question: string;
  onQuestionChange: (question: string) => void;
  onSearch: (question: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function SearchBox({
  question,
  onQuestionChange,
  onSearch,
  isLoading = false,
  disabled = false,
}: SearchBoxProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isLoading || disabled) return;
    onSearch(trimmed);
  };

  return (
    <Card
      as="section"
      variant="elevated"
      padding="sm"
      className="w-full shadow-nexvo-purple-500/5 sm:p-5"
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="nexvo-question" className="sr-only">
          Your question
        </label>
        <textarea
          id="nexvo-question"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="What would you like help choosing today?"
          rows={3}
          disabled={isLoading || disabled}
          className="nexvo-textarea"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={textStyles.caption}>
            Evidence before opinion · No sponsored rankings
          </p>

          <Button
            type="submit"
            disabled={isLoading || disabled || !question.trim()}
            className="shrink-0 sm:text-base"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Thinking…
              </>
            ) : (
              "Ask Nexvo"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
