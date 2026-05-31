/**
 * Nexvo design system — color palette
 * Brand: Warm Purple · Coral · Soft White
 */

export const colors = {
  purple: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
  },
  coral: {
    50: "#fff5f2",
    100: "#ffe8e1",
    400: "#ff8e72",
    500: "#ff6b6b",
    600: "#f97316",
  },
  white: {
    soft: "#faf9fc",
    DEFAULT: "#ffffff",
  },
  ink: {
    DEFAULT: "#1e1b2e",
    muted: "#6b6680",
    subtle: "#9490a8",
  },
  border: {
    DEFAULT: "#e8e4f0",
    strong: "#d4cfe0",
  },
  semantic: {
    success: {
      bg: "#f5f3ff",
      border: "#ddd6fe",
      text: "#6d28d9",
    },
    error: {
      bg: "rgba(255, 107, 107, 0.1)",
      border: "rgba(255, 107, 107, 0.3)",
      text: "#1e1b2e",
    },
    info: {
      bg: "#f5f3ff",
      border: "#ede9fe",
      text: "#6d28d9",
    },
  },
} as const;

/** CSS custom property names (match globals.css) */
export const colorVars = {
  background: colors.white.soft,
  foreground: colors.ink.DEFAULT,
  card: colors.white.DEFAULT,
  muted: colors.ink.muted,
  border: colors.border.DEFAULT,
  purple: colors.purple,
  coral: colors.coral,
} as const;

export const gradients = {
  brand: `linear-gradient(135deg, ${colors.purple[600]} 0%, ${colors.coral[500]} 100%)`,
  heroGlow: `
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.18), transparent),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(255, 107, 107, 0.12), transparent),
    radial-gradient(ellipse 50% 30% at 0% 10%, rgba(139, 92, 246, 0.1), transparent)
  `,
} as const;
