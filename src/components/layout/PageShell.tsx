import { ReactNode } from "react";
import type { NavLink } from "@/lib/navigation";
import { NexvoFooter } from "./NexvoFooter";
import { NexvoHeader } from "./NexvoHeader";

type PageWidth = "home" | "narrow" | "wide";

type PageShellProps = {
  children: ReactNode;
  width?: PageWidth;
  nav?: readonly NavLink[];
  footer?: string;
  showHeader?: boolean;
  headerWidth?: "narrow" | "wide";
  logoSize?: "sm" | "md";
  footerBordered?: boolean;
  className?: string;
};

const CONTENT_WIDTH: Record<PageWidth, string> = {
  home: "max-w-6xl",
  narrow: "max-w-lg",
  wide: "max-w-6xl",
};

export function PageShell({
  children,
  width = "wide",
  nav,
  footer,
  showHeader = true,
  headerWidth,
  logoSize,
  footerBordered = true,
  className = "",
}: PageShellProps) {
  const resolvedHeaderWidth =
    headerWidth ?? (width === "narrow" ? "narrow" : "wide");

  return (
    <main className={`min-h-screen ${width === "narrow" ? "pb-8" : ""}`}>
      {showHeader ? (
        <NexvoHeader
          nav={nav}
          width={resolvedHeaderWidth}
          logoSize={logoSize ?? (width === "narrow" ? "sm" : "md")}
        />
      ) : null}

      <div
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${CONTENT_WIDTH[width]} ${
          width === "home"
            ? "flex min-h-screen flex-col py-10 sm:py-14 lg:py-16"
            : "py-6 sm:py-8 lg:py-12"
        } ${className}`}
      >
        {children}
        {footer ? (
          <NexvoFooter bordered={footerBordered}>{footer}</NexvoFooter>
        ) : null}
      </div>
    </main>
  );
}
