import Link from "next/link";
import { cn } from "@/design-system/cn";
import { textStyles } from "@/design-system/typography";

type TrustEngineBadgeProps = {
  href?: string;
  label?: string;
  linked?: boolean;
};

export function TrustEngineBadge({
  href = "/trust",
  label = "Trust Engine™",
  linked = true,
}: TrustEngineBadgeProps) {
  const className = cn(
    "inline-flex items-center gap-2 rounded-full border border-nexvo-purple-200 bg-nexvo-purple-50 px-4 py-1.5",
    textStyles.caption,
    "font-medium text-nexvo-purple-700",
    linked && "transition hover:border-nexvo-purple-300"
  );

  const content = (
    <>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexvo-coral-500 opacity-50" />
        <span className="relative h-2 w-2 rounded-full bg-nexvo-purple-500" />
      </span>
      {label}
    </>
  );

  if (linked) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <span className={className}>{content}</span>;
}
