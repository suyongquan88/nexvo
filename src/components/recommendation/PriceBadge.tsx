import { cn } from "@/design-system/cn";

type Props = {
  price: string;
  className?: string;
};

export function PriceBadge({ price, className }: Props) {
  if (!price || price === "—") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full border border-nexvo-border bg-background px-3 py-1 text-xs font-medium text-nexvo-muted",
          className
        )}
      >
        Price varies
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-nexvo-border bg-foreground px-3 py-1 text-xs font-semibold text-background",
        className
      )}
    >
      {price}
    </span>
  );
}
