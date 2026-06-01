import Link from "next/link";
import type { NavLink } from "@/lib/navigation";
import { NexvoLogo } from "./NexvoLogo";
import { SessionHeaderExtras } from "./SessionHeaderExtras";

type NexvoHeaderProps = {
  nav?: readonly NavLink[];
  width?: "narrow" | "wide";
  logoSize?: "sm" | "md";
};

const WIDTH_CLASS = {
  narrow: "max-w-lg",
  wide: "max-w-6xl",
} as const;

export function NexvoHeader({
  nav = [],
  width = "wide",
  logoSize = "md",
}: NexvoHeaderProps) {
  return (
    <div className="nexvo-hero-glow border-b border-nexvo-border">
      <header
        className={`mx-auto flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8 ${WIDTH_CLASS[width]}`}
      >
        <NexvoLogo size={logoSize} />
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <SessionHeaderExtras />
          {nav.length > 0 ? (
            <nav className="flex flex-wrap items-center justify-end gap-3 text-sm font-medium sm:gap-4">
              {nav.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className={
                    link.primary
                      ? "text-nexvo-purple-700 hover:text-nexvo-purple-600"
                      : "text-nexvo-muted hover:text-nexvo-purple-700"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </header>
    </div>
  );
}
