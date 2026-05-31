import { Card } from "@/design-system/Card";
import { textStyles } from "@/design-system/typography";

type AlertBannerProps = {
  children: string;
  variant?: "error" | "info";
};

export function AlertBanner({
  children,
  variant = "error",
}: AlertBannerProps) {
  return (
    <Card
      variant={variant === "error" ? "error" : "tinted"}
      padding="sm"
      className={textStyles.body}
      role="alert"
    >
      <p>{children}</p>
    </Card>
  );
}
