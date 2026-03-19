"use client";

import Link from "next/link";

const navLinkClass =
  "inline-flex h-9 w-max min-h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none data-active:bg-white/15 data-active:text-white sm:px-5";

const items = [
  { href: "/", label: "Home" },
  { href: "/lovecraft", label: "Lovecraft" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header
      className="site-header-bar fixed left-0 right-0 top-0 z-30 flex min-h-[4.5rem] shrink-0 items-center justify-between gap-4 bg-background/80 border-b border px-8 font-sans backdrop-blur-lg"
    >
      <Link
        href="/"
        className="shrink-0 font-semibold text-xl tracking-tight text-white/90 hover:text-white"
      >
        Strangeflix
      </Link>
      <nav aria-label="Main navigation" className="flex-none">
        <ul className="m-0 flex list-none flex-wrap justify-end gap-1 p-0 sm:gap-2">
          {items.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={navLinkClass}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
