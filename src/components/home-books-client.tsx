"use client";

import { useState } from "react";
import type { BookPreviewData } from "@/components/book-detail-overlay";
import { BookDetailOverlay } from "@/components/book-detail-overlay";
import { BookCoverTilt } from "@/components/book-cover-tilt";

export type HomeBook = BookPreviewData;

type Props = {
  books: HomeBook[];
  /** `true` quando a query Prisma falhou por completo (ex.: BD indisponível na Vercel). */
  catalogLoadFailed?: boolean;
};

export function HomeBooksClient({
  books,
  catalogLoadFailed = false,
}: Props) {
  const [open, setOpen] = useState<BookPreviewData | null>(null);

  if (books.length === 0) {
    return (
      <>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center"
          role="status"
          aria-live="polite"
        >
          {catalogLoadFailed ? (
            <>
              <p className="max-w-md text-lg font-medium text-zinc-200">
                Couldn&apos;t load the catalog
              </p>
              <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                The database didn&apos;t respond. On serverless hosts (e.g. Vercel), SQLite
                often isn&apos;t persistent — use a hosted database (Postgres), run{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                  prisma migrate deploy
                </code>{" "}
                and seed in production.
              </p>
            </>
          ) : (
            <>
              <p className="max-w-md text-lg font-medium text-zinc-200">
                No books to show yet
              </p>
              <p className="max-w-md text-sm text-zinc-400">
                There are no titles with covers in the database. Run{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                  npx prisma db seed
                </code>{" "}
                locally or in your deploy pipeline.
              </p>
            </>
          )}
        </div>
        <BookDetailOverlay book={open} onClose={() => setOpen(null)} />
      </>
    );
  }

  return (
    <>
      <div className="grid w-full flex-1 grid-cols-2 justify-items-stretch gap-x-8 gap-y-16 p-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.map((book, i) => (
          <BookCoverTilt
            key={book.slug}
            slug={book.slug}
            title={book.title}
            coverImageUrl={book.coverImageUrl}
            glareColor={book.coverGlareColor}
            priority={i === 0}
            fillCell
            onOpenPreview={() => setOpen(book)}
          />
        ))}
      </div>
      <BookDetailOverlay book={open} onClose={() => setOpen(null)} />
    </>
  );
}
