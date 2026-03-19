"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export function SiteConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBookReader = /^\/books\/[^/]+$/.test(pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {!isBookReader && <SiteHeader />}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          !isBookReader && "pt-12",
        )}
      >
        {children}
      </div>
    </div>
  );
}
