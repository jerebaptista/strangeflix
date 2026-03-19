import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { HomeBook } from "@/components/home-books-client";
import { HomeBooksClient } from "@/components/home-books-client";
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

/** Evita pré-render estático no build (ex.: Vercel sem banco); a página é gerada sob demanda. */
export const dynamic = "force-dynamic";

function mapRowsToHomeBooks(
  rows: {
    slug: string;
    title: string;
    coverImageUrl: string | null;
    coverGlareColor: string | null;
    description: string | null;
    publishedYear: number | null;
    publishedMonth: number | null;
    publishedDay: number | null;
    author: { name: string };
  }[],
): HomeBook[] {
  return rows
    .filter((b): b is typeof b & { coverImageUrl: string } => b.coverImageUrl != null)
    .map((b) => ({
      slug: b.slug,
      title: b.title,
      coverImageUrl: b.coverImageUrl,
      coverGlareColor: b.coverGlareColor,
      authorName: b.author.name,
      publishedYear: b.publishedYear,
      publishedMonth: b.publishedMonth,
      publishedDay: b.publishedDay,
      description: b.description,
    }));
}

export default async function HomePage() {
  let books: HomeBook[] = [];
  try {
    const rows = await prisma.book.findMany({
      where: { coverImageUrl: { not: null } },
      orderBy: { createdAt: "asc" },
      select: {
        slug: true,
        title: true,
        coverImageUrl: true,
        coverGlareColor: true,
        description: true,
        publishedYear: true,
        publishedMonth: true,
        publishedDay: true,
        author: { select: { name: true } },
      },
    });
    books = mapRowsToHomeBooks(rows);
  } catch (firstErr) {
    console.error("[home] prisma findMany (full select) failed:", firstErr);
    /* BD sem migração publishedMonth/publishedDay — query compatível */
    try {
      const rows = await prisma.book.findMany({
        where: { coverImageUrl: { not: null } },
        orderBy: { createdAt: "asc" },
        select: {
          slug: true,
          title: true,
          coverImageUrl: true,
          coverGlareColor: true,
          description: true,
          publishedYear: true,
          author: { select: { name: true } },
        },
      });
      books = mapRowsToHomeBooks(
        rows.map((b) => ({
          ...b,
          publishedMonth: null,
          publishedDay: null,
        })),
      );
    } catch (secondErr) {
      console.error("[home] prisma findMany (fallback select) failed:", secondErr);
      books = [];
    }
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <HomeBooksClient books={books} />
    </main>
  );
}
