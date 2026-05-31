/**
 * Nexvo typography — modern, trustworthy, friendly
 */

export const fontFamily = {
  sans: 'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: 'var(--font-geist-mono), ui-monospace, monospace',
} as const;

export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1.125rem" }] as const,
  sm: ["0.875rem", { lineHeight: "1.375rem" }] as const,
  base: ["1rem", { lineHeight: "1.625rem" }] as const,
  lg: ["1.125rem", { lineHeight: "1.75rem" }] as const,
  xl: ["1.25rem", { lineHeight: "1.875rem" }] as const,
  "2xl": ["1.5rem", { lineHeight: "2rem" }] as const,
  "3xl": ["1.875rem", { lineHeight: "2.375rem" }] as const,
  "4xl": ["2.25rem", { lineHeight: "2.75rem" }] as const,
  "5xl": ["3rem", { lineHeight: "1.1" }] as const,
  display: ["3.75rem", { lineHeight: "1.05" }] as const,
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/** Tailwind class presets for text styles */
export const textStyles = {
  display: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
  h1: "text-3xl font-bold tracking-tight sm:text-4xl",
  h2: "text-lg font-semibold sm:text-xl",
  h3: "text-base font-semibold",
  body: "text-sm leading-relaxed sm:text-base",
  bodyLg: "text-base leading-relaxed sm:text-lg",
  caption: "text-xs leading-relaxed sm:text-sm",
  eyebrow:
    "text-xs font-semibold uppercase tracking-wider text-nexvo-purple-700",
  eyebrowLg: "text-sm font-medium text-nexvo-purple-700",
  label: "text-sm font-semibold text-foreground",
  muted: "text-sm text-nexvo-muted",
} as const;
