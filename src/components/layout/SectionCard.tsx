import { ReactNode } from "react";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "tinted" | "glow" | "interactive";
};

export function SectionCard({
  title,
  description,
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  return (
    <Card as="section" variant={variant} padding="md" className={className}>
      <header>
        <h2 className={textStyles.h2}>{title}</h2>
        {description ? (
          <p className={cn(textStyles.muted, "mt-1")}>{description}</p>
        ) : null}
      </header>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
