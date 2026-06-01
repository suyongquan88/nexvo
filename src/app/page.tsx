"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NexvoFooter } from "@/components/layout/NexvoFooter";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/HeroSection";
import { FOOTERS } from "@/lib/site-copy";
import {
  buildRecommendationSession,
  saveRecommendationSession,
} from "@/lib/recommendation-session";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value }),
      });

      const data = (await response.json()) as {
        answer?: string;
        error?: string;
        demo?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (!data.answer) {
        setError("No answer was returned. Please try again.");
        return;
      }

      saveRecommendationSession(
        buildRecommendationSession(value, data.answer, Boolean(data.demo))
      );
      router.push("/recommendation");
    } catch {
      setError("Unable to reach Nexvo. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell width="home" showHeader={false}>
      <HeroSection
        onSearch={handleSearch}
        isLoading={isLoading}
        error={error}
      />

      <NexvoFooter bordered={false}>{FOOTERS.default}</NexvoFooter>
    </PageShell>
  );
}
