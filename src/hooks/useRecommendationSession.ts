"use client";

import { useEffect, useState } from "react";
import {
  loadRecommendationSession,
  type RecommendationSession,
} from "@/lib/recommendation-session";

export function useRecommendationSession() {
  const [session, setSession] = useState<RecommendationSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadRecommendationSession());
    setReady(true);
  }, []);

  return { session, ready };
}
