import { ReactNode, Suspense } from "react";
import { PageLoading } from "./PageLoading";

type SuspensePageLoadingProps = {
  children: ReactNode;
};

export function SuspensePageLoading({ children }: SuspensePageLoadingProps) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
}
