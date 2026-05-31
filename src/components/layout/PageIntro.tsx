import { ReactNode } from "react";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type PageIntroProps = {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  size?: "sm" | "lg";
  children?: ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  size = "lg",
  children,
}: PageIntroProps) {
  const isLarge = size === "lg";

  return (
    <header className={isLarge ? "mb-8 max-w-3xl" : "mb-6"}>
      {eyebrow ? (
        <p className={isLarge ? textStyles.eyebrowLg : textStyles.eyebrow}>
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "mt-1 font-bold tracking-tight text-foreground",
          isLarge ? textStyles.h1 : "text-2xl leading-tight"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-2 leading-relaxed text-nexvo-muted",
          isLarge ? "max-w-2xl text-sm sm:text-base" : textStyles.caption
        )}
      >
        {description}
      </p>
      {children}
    </header>
  );
}
