import Link from "next/link";

type NexvoLogoProps = {
  size?: "sm" | "md";
};

const SIZE_CLASS = {
  sm: "text-lg",
  md: "text-xl",
} as const;

export function NexvoLogo({ size = "md" }: NexvoLogoProps) {
  return (
    <Link
      href="/"
      className={`font-bold tracking-tight ${SIZE_CLASS[size]}`}
    >
      <span className="nexvo-gradient-text">Nexvo</span>
    </Link>
  );
}
