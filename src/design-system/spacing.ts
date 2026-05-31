/**
 * Nexvo spacing scale — 4px base unit
 */

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
} as const;

export const space = {
  /** Page horizontal padding */
  pageX: spacing[4],
  pageXSm: spacing[6],
  pageXLg: spacing[8],
  /** Section gaps */
  section: spacing[6],
  sectionLg: spacing[8],
  /** Card padding */
  cardSm: spacing[4],
  cardMd: spacing[6],
  cardLg: spacing[8],
  /** Stack gaps */
  stackSm: spacing[2],
  stackMd: spacing[4],
  stackLg: spacing[6],
} as const;

export const radius = {
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(30, 27, 46, 0.04)",
  md: "0 4px 12px rgba(30, 27, 46, 0.06)",
  lg: "0 8px 24px rgba(124, 58, 237, 0.12)",
  brand: "0 4px 14px rgba(124, 58, 237, 0.25)",
} as const;
