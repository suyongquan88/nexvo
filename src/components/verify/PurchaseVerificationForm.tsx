"use client";

import { FormEvent, useRef, useState } from "react";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { SuccessCard } from "@/components/layout/SuccessCard";
import { Button } from "@/design-system/Button";
import { cardClasses } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";
import {
  VERIFY_PLATFORMS,
  type VerifyPlatform,
} from "@/lib/verify-platforms";

export type VerificationDraft = {
  platform: VerifyPlatform;
  rating: number;
  comment: string;
  screenshotName: string;
  submittedAt: string;
};

const MAX_COMMENT = 500;
const MAX_FILE_MB = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

type Props = {
  onSuccess?: (draft: VerificationDraft) => void;
};

export function PurchaseVerificationForm({ onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState<VerifyPlatform | "">("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setScreenshot(null);
      setPreviewUrl(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP screenshot.");
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_MB} MB.`);
      return;
    }

    setError(null);
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!screenshot) {
      setError("Please upload a purchase screenshot.");
      return;
    }

    if (!platform) {
      setError("Please select a platform.");
      return;
    }

    if (rating < 1) {
      setError("Please rate your purchase experience.");
      return;
    }

    const draft: VerificationDraft = {
      platform,
      rating,
      comment: comment.trim(),
      screenshotName: screenshot.name,
      submittedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("nexvo.verification", JSON.stringify(draft));
    setSubmitted(true);
    onSuccess?.(draft);
  };

  if (submitted) {
    return (
      <SuccessCard
        title="Proof received"
        message="Thank you. Your screenshot is queued for review. Verified proof increases evidence count and strengthens the Trust Engine."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error ? <AlertBanner>{error}</AlertBanner> : null}

      {/* Upload Screenshot */}
      <fieldset className="space-y-2">
        <legend className={textStyles.label}>Upload screenshot</legend>
        <p className={textStyles.caption}>
          Order confirmation or receipt (max {MAX_FILE_MB} MB)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          capture="environment"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-nexvo-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Purchase screenshot preview"
              className="max-h-56 w-full object-cover object-top"
            />
            <button
              type="button"
              onClick={() => {
                handleFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute right-3 top-3 rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-white"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              cardClasses("dashed", "lg"),
              "flex min-h-[140px] w-full flex-col items-center justify-center gap-2 active:bg-nexvo-purple-50"
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-nexvo-purple-100 text-2xl">
              📷
            </span>
            <span className={cn(textStyles.label, "text-nexvo-purple-700")}>
              Tap to upload
            </span>
            <span className={textStyles.caption}>
              or take a photo
            </span>
          </button>
        )}
      </fieldset>

      {/* Platform Select */}
      <fieldset className="space-y-2">
        <label
          htmlFor="platform"
          className={textStyles.label}
        >
          Platform
        </label>
        <div className="relative">
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as VerifyPlatform | "")}
            className="nexvo-input appearance-none pr-10"
          >
            <option value="">Select where you purchased</option>
            {VERIFY_PLATFORMS.map((item) => (
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

      {/* Rating */}
      <fieldset className="space-y-3">
        <legend className={textStyles.label}>Rating</legend>
        <p className={textStyles.caption}>
          How was your purchase experience?
        </p>
        <div
          className="flex justify-between gap-1"
          role="radiogroup"
          aria-label="Purchase rating"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              className={`flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-xl border text-xl transition active:scale-95 ${
                rating >= value
                  ? "border-nexvo-purple-500 bg-nexvo-purple-50"
                  : "border-nexvo-border bg-nexvo-card"
              }`}
            >
              <span className={rating >= value ? "opacity-100" : "opacity-35"}>
                ★
              </span>
            </button>
          ))}
        </div>
        {rating > 0 ? (
          <p className="text-center text-xs font-medium text-nexvo-purple-700">
            {rating} of 5
          </p>
        ) : null}
      </fieldset>

      {/* Comment */}
      <fieldset className="space-y-2">
        <label
          htmlFor="comment"
          className={textStyles.label}
        >
          Comment
          <span className="ml-1 font-normal text-nexvo-muted">(optional)</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          rows={4}
          placeholder="Anything else we should know about this purchase?"
          className="nexvo-input resize-none"
        />
        <p className="text-right text-xs text-nexvo-muted">
          {comment.length}/{MAX_COMMENT}
        </p>
      </fieldset>

      <Button type="submit" size="lg" fullWidth>
        Submit verification
      </Button>
    </form>
  );
}
