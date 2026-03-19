import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      className="fixed left-0 right-0 top-0 z-30 flex h-12 shrink-0 items-center border-b border-zinc-800 px-4 font-sans backdrop-blur-md"
      style={{
        backgroundColor: "#0a0a0ae6",
        color: "#fafafa",
      }}
    >
      <Link
        href="/"
        className="font-semibold tracking-tight text-white/90 hover:text-white"
      >
        Strangeflix
      </Link>
    </header>
  );
}
