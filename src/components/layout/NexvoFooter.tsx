import { textStyles } from "@/design-system/typography";
import { cn } from "@/design-system/cn";

type NexvoFooterProps = {
  children: string;
  bordered?: boolean;
};

export function NexvoFooter({ children, bordered = true }: NexvoFooterProps) {
  return (
    <footer
      className={cn(
        "text-center text-nexvo-muted",
        textStyles.caption,
        bordered ? "mt-12 border-t border-nexvo-border pt-8" : "mt-10 pt-4"
      )}
    >
      {children}
    </footer>
  );
}
