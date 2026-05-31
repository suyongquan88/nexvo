import { Card } from "@/design-system/Card";
import { Button } from "@/design-system/Button";
import { textStyles } from "@/design-system/typography";

type EmptyStateCardProps = {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

export function EmptyStateCard({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateCardProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className="mx-auto max-w-lg text-center"
    >
      <h1 className={textStyles.h1}>{title}</h1>
      <p className={`mt-3 ${textStyles.muted}`}>{description}</p>
      <Button href={actionHref} className="mt-6">
        {actionLabel}
      </Button>
    </Card>
  );
}
