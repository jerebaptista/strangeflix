import type { ReactNode } from "react";
import { SiteConditionalLayout } from "@/components/site-conditional-layout";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteConditionalLayout>{children}</SiteConditionalLayout>;
}
