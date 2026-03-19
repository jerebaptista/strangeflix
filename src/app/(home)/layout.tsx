import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark flex min-h-dvh flex-1 flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
