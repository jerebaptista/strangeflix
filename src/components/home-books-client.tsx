"use client";

import { useState } from "react";
import type { BookPreviewData } from "@/components/book-detail-overlay";
import { BookDetailOverlay } from "@/components/book-detail-overlay";
import { BookCoverTilt } from "@/components/book-cover-tilt";
import type { CatalogLoadIssue } from "@/lib/catalog-error";

export type HomeBook = BookPreviewData;

export type { CatalogLoadIssue };

type Props = {
  books: HomeBook[];
  /** `true` quando as queries Prisma falharam por completo. */
  catalogLoadFailed?: boolean;
  /** Classificação do último erro (só relevante se `catalogLoadFailed`). */
  catalogIssue?: CatalogLoadIssue;
};

function CatalogFailureDetails({ issue }: { issue: CatalogLoadIssue }) {
  switch (issue) {
    case "missing_env":
      return (
        <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
          <strong className="text-zinc-300">Your computer&apos;s Postgres is not visible on Vercel.</strong> The
          URL in local <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">.env</code> only works on
          your machine. For the live site, create a{" "}
          <strong className="text-zinc-300">hosted</strong> database (Neon, Supabase, Vercel Postgres), then in
          Vercel → <strong className="text-zinc-300">Settings → Environment Variables</strong> add{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">DATABASE_URL</code> or{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">POSTGRES_URL</code> (or whatever the
          provider gives). <strong className="text-zinc-300">Redeploy</strong> so migrations run, then{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">npx prisma db seed</code> once
          against that database.
        </p>
      );
    case "missing_migrations":
      return (
        <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
          The app can reach Postgres, but <strong className="text-zinc-300">tables are missing</strong>. After
          env vars are set, trigger a <strong className="text-zinc-300">new deployment</strong> so{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">prisma migrate deploy</code> runs
          in the build. Then run{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">npx prisma db seed</code> against
          the same database.
        </p>
      );
    case "unreachable":
      return (
        <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
          <strong className="text-zinc-300">Cannot connect</strong> to the database (wrong URL, SSL, or network).
          For Neon and similar, the string usually needs{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">sslmode=require</code>. Check the
          provider&apos;s dashboard and Vercel env values.
        </p>
      );
    default:
      return (
        <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
          Check <strong className="text-zinc-300">Vercel → Deployment → Logs</strong> (Functions) for lines
          starting with <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">[home] prisma</code>.
          Typical fix: hosted Postgres + env vars + redeploy + seed.
        </p>
      );
  }
}

export function HomeBooksClient({
  books,
  catalogLoadFailed = false,
  catalogIssue = "unknown",
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
              <CatalogFailureDetails issue={catalogIssue} />
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
