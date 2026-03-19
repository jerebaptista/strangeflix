import { prisma } from "@/lib/prisma";
import { BookCoverTilt } from "@/components/book-cover-tilt";

export default async function HomePage() {
  const books = await prisma.book.findMany({
    where: { coverImageUrl: { not: null } },
    orderBy: { createdAt: "asc" },
    select: { slug: true, title: true, coverImageUrl: true, coverGlareColor: true },
  });

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
