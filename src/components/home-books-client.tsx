"use client";

import { useState } from "react";
import type { BookPreviewData } from "@/components/book-detail-overlay";
import { BookDetailOverlay } from "@/components/book-detail-overlay";
import { BookCoverTilt } from "@/components/book-cover-tilt";

export type HomeBook = BookPreviewData;

type Props = {
  books: HomeBook[];
};

export function HomeBooksClient({ books }: Props) {
  const [open, setOpen] = useState<BookPreviewData | null>(null);

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
