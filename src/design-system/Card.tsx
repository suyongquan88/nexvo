import { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export const cardVariants = {
  default: "border-nexvo-border bg-nexvo-card shadow-sm",
  elevated: "border-nexvo-border bg-nexvo-card shadow-md",
  outline: "border-nexvo-border bg-transparent shadow-none",
  dashed:
    "border-dashed border-nexvo-border bg-nexvo-purple-50/50 shadow-none",
  tinted: "border-nexvo-purple-100 bg-nexvo-purple-50/70 shadow-sm",
  glow: "nexvo-hero-glow border-nexvo-border bg-nexvo-card/80 shadow-sm overflow-hidden",
  success: "border-nexvo-purple-200 bg-nexvo-purple-50 shadow-sm",
  error: "border-nexvo-coral-500/30 bg-nexvo-coral-500/10 shadow-none",
  interactive:
    "border-nexvo-border bg-nexvo-card shadow-sm transition hover:border-nexvo-purple-200 hover:shadow-md hover:shadow-nexvo-purple-500/5",
} as const;

export const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

export type CardVariant = keyof typeof cardVariants;
export type CardPadding = keyof typeof cardPadding;

type CardProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export function cardClasses(
  variant: CardVariant = "default",
  padding: CardPadding = "md",
  className?: string
): string {
  return cn(
    "rounded-2xl border",
    cardVariants[variant],
    cardPadding[padding],
    className
  );
}

export function Card({
  variant = "default",
  padding = "md",
  children,
  className,
  as: Component = "div",
  ...props
}: CardProps) {
  return (
    <Component className={cardClasses(variant, padding, className)} {...props}>
      {children}
    </Component>
  );
}
