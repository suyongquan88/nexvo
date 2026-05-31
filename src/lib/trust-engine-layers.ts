export type TrustLayerAccent = "purple" | "coral" | "violet" | "slate";

export type TrustEngineLayer = {
  id: string;
  order: number;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  icon: string;
  accent: TrustLayerAccent;
};

export const TRUST_ENGINE_LAYERS: TrustEngineLayer[] = [
  {
    id: "evidence",
    order: 1,
    name: "Evidence Layer",
    tagline: "Evidence before opinion",
    description:
      "Every recommendation is grounded in verifiable signals—independent reviews, structured product data, and transparent reasoning—not opaque model guesses alone.",
    features: [
      "Collects independent and third-party data sources",
      "Weights verifiable facts above marketing copy",
      "Surfaces evidence count on every recommendation",
      "Feeds the Trust Score with auditable inputs",
    ],
    icon: "📊",
    accent: "purple",
  },
  {
    id: "verification",
    order: 2,
    name: "Verification Layer",
    tagline: "Proof you can trust",
    description:
      "Users upload purchase screenshots and platform details. Nexvo reviews proofs before they increase evidence weight—strengthening scores only when proof checks out.",
    features: [
      "Screenshot and platform validation",
      "Human and automated review pipeline",
      "Links proof to specific recommendations",
      "Privacy-first storage and redaction guidance",
    ],
    icon: "✓",
    accent: "coral",
  },
  {
    id: "community",
    order: 3,
    name: "Community Layer",
    tagline: "People verify for people",
    description:
      "Helpful votes, detailed feedback, and suggestions refine what works. Community signals reward recommendations that genuinely help—not those paid to rank.",
    features: [
      "Helpful / not helpful feedback loops",
      "Suggestions and issue reports",
      "Aggregated sentiment without merchant bias",
      "Continuous improvement of Trust Engine weights",
    ],
    icon: "👥",
    accent: "violet",
  },
  {
    id: "anti-fraud",
    order: 4,
    name: "Anti Fraud Layer",
    tagline: "No pay-to-rank",
    description:
      "Detects sponsored manipulation, fake proofs, and coordinated abuse. Merchants cannot buy placement; fraudulent evidence is quarantined before it affects scores.",
    features: [
      "Blocks sponsored and paid ranking influence",
      "Flags suspicious verification patterns",
      "Rate limits and anomaly detection",
      "Transparent appeals via issue reporting",
    ],
    icon: "🛡️",
    accent: "slate",
  },
];
