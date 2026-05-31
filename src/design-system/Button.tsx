import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export const buttonVariants = {
  primary:
    "nexvo-gradient-bg text-white shadow-md shadow-nexvo-purple-600/25 hover:opacity-95 active:opacity-90",
  secondary:
    "bg-nexvo-purple-50 text-nexvo-purple-700 border border-nexvo-purple-200 hover:bg-nexvo-purple-100",
  outline:
    "bg-nexvo-card text-foreground border border-nexvo-border hover:border-nexvo-purple-200 hover:bg-nexvo-purple-50/50",
  ghost:
    "bg-transparent text-nexvo-purple-700 hover:bg-nexvo-purple-50",
  danger:
    "bg-nexvo-coral-500/10 text-foreground border border-nexvo-coral-500/30 hover:bg-nexvo-coral-500/15",
  link: "bg-transparent text-nexvo-purple-700 hover:text-nexvo-purple-600 p-0 min-h-0",
} as const;

export const buttonSizes = {
  sm: "min-h-9 px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "min-h-11 px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "min-h-14 px-6 py-3 text-base rounded-2xl gap-2",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    buttonVariants[variant],
    variant !== "link" && buttonSizes[size],
    fullWidth && "w-full",
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
