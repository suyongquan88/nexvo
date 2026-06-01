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
    id: "ai-analysis",
    order: 1,
    name: "AI Analysis",
    tagline: "Understand the question first",
    description:
      "Nexvo interprets your question, constraints, and priorities—then generates a recommendation with clear reasoning, not a generic ranked list.",
    features: [
      "Parses intent, budget, and use-case context",
      "Produces structured recommendations with reasons",
      "Flags uncertainty when evidence is thin",
      "Never influenced by merchant payments",
    ],
    icon: "✦",
    accent: "purple",
  },
  {
    id: "evidence-validation",
    order: 2,
    name: "Evidence Validation",
    tagline: "Evidence before opinion",
    description:
      "Independent reviews, product data, and verifiable signals are weighed before a Trust Score is shown—marketing copy alone never drives the result.",
    features: [
      "Cross-checks third-party and community sources",
      "Surfaces evidence count on every recommendation",
      "Down-weights unverified or conflicting claims",
      "Auditable inputs for transparency pages",
    ],
    icon: "◎",
    accent: "coral",
  },
  {
    id: "community-feedback",
    order: 3,
    name: "Community Feedback",
    tagline: "People verify for people",
    description:
      "Helpful votes, suggestions, and issue reports refine what works. Community signals reward recommendations that genuinely help real buyers.",
    features: [
      "Helpful / not helpful feedback loops",
      "Issue reports flag misleading guidance",
      "Aggregated sentiment without sponsored bias",
      "Continuous improvement of Trust Engine weights",
    ],
    icon: "◉",
    accent: "violet",
  },
  {
    id: "verified-purchases",
    order: 4,
    name: "Verified Purchases",
    tagline: "Proof you can trust",
    description:
      "Users upload purchase screenshots and platform details. Verified proofs strengthen evidence weight only after review—linking real outcomes to recommendations.",
    features: [
      "Screenshot and platform validation",
      "Links proof to specific recommendations",
      "Privacy-first upload and redaction guidance",
      "Increases Trust Score evidence over time",
    ],
    icon: "✓",
    accent: "slate",
  },
];
