import { TRUST_PRINCIPLES } from "@/lib/trust-breakdown";
import { SectionCard } from "@/components/layout/SectionCard";

type TransparencyPrinciplesProps = {
  title?: string;
  subtitle?: string;
  layout?: "grid" | "list";
  showActions?: boolean;
};

export function TransparencyPrinciples({
  title = "Our transparency commitment",
  subtitle = "We don't rank products for merchants. We verify choices for people.",
  layout = "grid",
}: TransparencyPrinciplesProps) {
  if (layout === "list") {
    return (
      <SectionCard title={title} description={subtitle}>
        <ul className="space-y-4">
          {TRUST_PRINCIPLES.map((principle) => (
            <li
              key={principle.title}
              className="border-l-2 border-nexvo-purple-500 pl-4"
            >
              <p className="font-medium text-foreground">{principle.title}</p>
              <p className="mt-0.5 text-sm text-nexvo-muted">{principle.body}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={title} description={subtitle}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {TRUST_PRINCIPLES.map((principle) => (
          <li
            key={principle.title}
            className="rounded-xl border border-nexvo-purple-100 bg-nexvo-purple-50/50 p-4"
          >
            <h3 className="font-medium text-nexvo-purple-700">
              {principle.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-nexvo-muted">
              {principle.body}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
