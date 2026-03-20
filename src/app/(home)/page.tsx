import type { Metadata } from "next";
import { HomeBooksClient } from "@/components/home-books-client";
import { loadHomeCatalog } from "@/lib/books-data";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: {
    absolute: "Strangeflix — public-domain horror & weird fiction",
  },
  description:
    "Read H. P. Lovecraft and more: free public-domain horror books with a calm reader, adjustable typography, and dark-friendly themes.",
  openGraph: {
    title: "Strangeflix",
    description:
      "Free public-domain horror and weird fiction — readable, distraction-free, in your browser.",
    type: "website",
    url: getSiteUrl(),
  },
};

/** Evita pré-render estático no build quando a lista vem da BD; com catálogo em ficheiro continua a funcionar. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { books, catalogLoadFailed, catalogIssue } = await loadHomeCatalog();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <HomeBooksClient
        books={books}
        catalogLoadFailed={catalogLoadFailed}
        catalogIssue={catalogLoadFailed ? catalogIssue : undefined}
      />
    </main>
  );
}
