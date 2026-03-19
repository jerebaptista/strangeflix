"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getPlotTeaser } from "@/lib/book-plot-teasers";
import { formatPublicationDate } from "@/lib/format-publication";
import { cn } from "@/lib/utils";
import { TiltedBookCover } from "@/components/tilted-book-cover";

export type BookPreviewData = {
  slug: string;
  title: string;
  coverImageUrl: string;
  authorName: string;
  publishedYear: number | null;
  publishedMonth: number | null;
  publishedDay: number | null;
  description: string | null;
  coverGlareColor: string | null;
};

type Props = {
  book: BookPreviewData | null;
  onClose: () => void;
};

export function BookDetailOverlay({ book, onClose }: Props) {
  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [book, onClose]);

  useEffect(() => {
    if (book) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  if (!book) return null;

  const dateLine = formatPublicationDate({
    publishedDay: book.publishedDay,
    publishedMonth: book.publishedMonth,
    publishedYear: book.publishedYear,
  });

  const teaser = getPlotTeaser(book.slug, book.description);

  return (
    <div
      className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 z-0 bg-black/90 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* pointer-events-none: cliques nas margens passam para o backdrop; o diálogo reativa eventos */}
      <div className="pointer-events-none relative z-[1] flex min-h-[100dvh] w-full items-center justify-center p-4 py-10 sm:p-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-preview-title"
          className="pointer-events-auto relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-8 md:gap-10 lg:gap-12"
        >
        {/* Capa — sem wrapper extra que corte o tilt no hover */}
        <div className="flex w-full max-w-[min(320px,82vw)] shrink-0 justify-center px-2 sm:w-[min(300px,44%)] sm:max-w-[min(340px,44%)] md:w-[min(320px,40vw)] md:max-w-none lg:w-[min(360px,36vw)]">
          <div className="w-full min-w-0">
            <TiltedBookCover
              title={book.title}
              coverImageUrl={book.coverImageUrl}
              glareColor={book.coverGlareColor}
              width={320}
              height={480}
              fillParent
            />
          </div>
        </div>

        {/* Texto e ações — centrado verticalmente ao meio da capa (sm:items-center no pai) */}
        <div className="flex w-full min-w-0 max-w-sm flex-col sm:max-w-[18.5rem] sm:shrink-0 lg:max-w-[20rem]">
          <div className="space-y-4">
            <h2
              id="book-preview-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {book.title}
            </h2>
            <p className="text-sm sm:text-base">
              <span className="text-white">{book.authorName}</span>
              {dateLine != null && (
                <>
                  <span className="mx-1.5 text-zinc-500" aria-hidden>
                    ·
                  </span>
                  <span className="text-zinc-500">{dateLine}</span>
                </>
              )}
            </p>
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-[0.9375rem]">
              {teaser}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              size="lg"
              className="h-12 min-h-12 rounded-lg border-0 bg-emerald-500 px-8 text-base font-semibold text-zinc-950 hover:bg-emerald-400"
              render={(props) => (
                <Link
                  href={`/books/${book.slug}`}
                  {...props}
                  className={cn(props.className)}
                />
              )}
            >
              Read book
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 min-h-12 items-center rounded-lg px-4 text-base font-medium text-white transition-colors hover:bg-white/10 hover:text-zinc-100"
            >
              Close
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
