import { Card } from "@/design-system/Card";
import { textStyles } from "@/design-system/typography";

type SuccessCardProps = {
  title: string;
  message: string;
};

export function SuccessCard({ title, message }: SuccessCardProps) {
  return (
    <Card variant="success" padding="lg" className="text-center">
      <div className="nexvo-gradient-bg mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white">
        ✓
      </div>
      <h2 className={`mt-4 ${textStyles.h2}`}>{title}</h2>
      <p className={`mt-2 ${textStyles.muted}`}>{message}</p>
    </Card>
  );
}
