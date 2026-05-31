import { ReactNode } from "react";
import { Card } from "@/design-system/Card";
import { cn } from "@/design-system/cn";

type FormCardProps = {
  children: ReactNode;
  className?: string;
};

export function FormCard({ children, className }: FormCardProps) {
  return (
    <Card variant="default" padding="sm" className={cn("sm:p-5", className)}>
      {children}
    </Card>
  );
}
