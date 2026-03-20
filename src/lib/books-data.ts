import fs from "fs";
import path from "path";
import type { HomeBook } from "@/components/home-books-client";
import {
  findStaticBookMeta,
  getStaticHomeBooks,
  type StaticBookRecord,
} from "@/data/static-catalog";
import {
  classifyCatalogLoadError,
  type CatalogLoadIssue,
} from "@/lib/catalog-error";
import { hasPostgresEnv } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";

function readStaticBookFullText(meta: StaticBookRecord): string {
  const abs = path.join(process.cwd(), meta.textStorageKey);
  return fs.readFileSync(abs, "utf8");
}

/** Formato usado pela página do leitor e por `generateMetadata`. */
export type SiteBookForReader = {
  title: string;
  slug: string;
  language: string;
  description: string | null;
  sourceUrl: string | null;
  coverImageUrl: string | null;
  publishedYear: number | null;
  publishedMonth: number | null;
  publishedDay: number | null;
  fullText: string;
  author: { name: string };
};

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

export async function loadHomeCatalog(): Promise<{
  books: HomeBook[];
  catalogLoadFailed: boolean;
  catalogIssue?: CatalogLoadIssue;
}> {
  if (!hasPostgresEnv()) {
    return { books: getStaticHomeBooks(), catalogLoadFailed: false };
  }

  let books: HomeBook[] = [];
  let catalogLoadFailed = false;
  let catalogIssue: CatalogLoadIssue = "unknown";

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
      catalogLoadFailed = true;
      catalogIssue = classifyCatalogLoadError(secondErr);
      books = [];
    }
  }

  return {
    books,
    catalogLoadFailed,
    ...(catalogLoadFailed ? { catalogIssue } : {}),
  };
}

export async function loadSiteBookBySlug(
  slug: string,
): Promise<SiteBookForReader | null> {
  if (!hasPostgresEnv()) {
    const meta = findStaticBookMeta(slug);
    if (!meta) return null;
    try {
      const fullText = readStaticBookFullText(meta);
      return {
        title: meta.title,
        slug: meta.slug,
        language: meta.language,
        description: meta.description,
        sourceUrl: meta.sourceUrl,
        coverImageUrl: meta.coverImageUrl,
        publishedYear: meta.publishedYear,
        publishedMonth: meta.publishedMonth,
        publishedDay: meta.publishedDay,
        fullText,
        author: { name: meta.authorName },
      };
    } catch (e) {
      console.error("[books] static fullText read failed:", slug, e);
      return null;
    }
  }

  const book = await prisma.book.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!book?.fullText) return null;

  return {
    title: book.title,
    slug: book.slug,
    language: book.language,
    description: book.description,
    sourceUrl: book.sourceUrl,
    coverImageUrl: book.coverImageUrl,
    publishedYear: book.publishedYear,
    publishedMonth: book.publishedMonth,
    publishedDay: book.publishedDay,
    fullText: book.fullText,
    author: { name: book.author.name },
  };
}
