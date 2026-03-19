"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-footer-bar mt-auto flex min-h-[5.25rem] items-center justify-center border-t border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
        <span className="text-muted-foreground">
          © {year} Strangeflix 💀
        </span>
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          className={cn(
            "h-auto min-h-0 p-0 text-muted-foreground",
          )}
          render={(props) => (
            <Link href="/privacy" {...props} className={cn(props.className)} />
          )}
        >
          Privacy Policy
        </Button>
      </div>
    </footer>
  );
}
