import { prisma } from "@/lib/prisma";
import { BookCoverTilt } from "@/components/book-cover-tilt";

/** Evita pré-render estático no build (ex.: Vercel sem banco); a página é gerada sob demanda. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let books: { slug: string; title: string; coverImageUrl: string | null; coverGlareColor: string | null }[] = [];
  try {
    books = await prisma.book.findMany({
      where: { coverImageUrl: { not: null } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true, coverImageUrl: true, coverGlareColor: true },
    });
  } catch {
    books = [];
  }

  return (
    <main className="flex flex-1 flex-wrap items-center justify-center gap-10 p-8">
      {books.map((book, i) =>
        book.coverImageUrl ? (
          <BookCoverTilt
            key={book.slug}
            slug={book.slug}
            title={book.title}
            coverImageUrl={book.coverImageUrl}
            glareColor={book.coverGlareColor}
            priority={i === 0}
          />
        ) : null,
      )}
    </main>
  );
}
