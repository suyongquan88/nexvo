export type NavLink = {
  href: string;
  label: string;
  primary?: boolean;
};

export const NAV = {
  recommendation: [
    { href: "/trust", label: "Trust Engine" },
    { href: "/feedback", label: "Feedback" },
    { href: "/why", label: "Why this score?" },
    { href: "/", label: "← New question", primary: true },
  ],
  trust: [
    { href: "/why", label: "Score breakdown" },
    { href: "/", label: "← Home", primary: true },
  ],
  why: (hasSession: boolean): NavLink[] => [
    {
      href: hasSession ? "/recommendation" : "/",
      label: hasSession ? "← Recommendation" : "← Home",
      primary: true,
    },
  ],
  verify: (hasRecommendation: boolean): NavLink[] => [
    {
      href: hasRecommendation ? "/recommendation" : "/",
      label: "← Back",
      primary: true,
    },
  ],
  feedback: [
    { href: "/recommendation", label: "← Back", primary: true },
  ],
} as const;
