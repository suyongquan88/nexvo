import { SITE_MISSION_LINES, SITE_TAGLINE } from "@/lib/site-copy";
import { TrustEngineBadge } from "@/components/layout/TrustEngineBadge";
import { textStyles } from "@/design-system/typography";

export function HeroSection() {
  return (
    <header className="nexvo-hero-glow relative text-center">
      <TrustEngineBadge label="Trust Engine™ — Early access" />

      <h1 className={`mt-8 ${textStyles.display}`}>
        <span className="nexvo-gradient-text">Nexvo</span>
      </h1>

      <p className={`mt-4 ${textStyles.bodyLg} font-medium text-foreground`}>
        {SITE_TAGLINE}
      </p>

      <p className={`mx-auto mt-6 max-w-xl ${textStyles.bodyLg} text-nexvo-muted`}>
        {SITE_MISSION_LINES[0]}
        <br className="hidden sm:block" />
        <span className="text-foreground"> {SITE_MISSION_LINES[1]}</span>
      </p>
    </header>
  );
}
