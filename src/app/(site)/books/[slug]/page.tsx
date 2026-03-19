import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { getSiteUrl } from "@/lib/site-url";
import { prisma } from "@/lib/prisma";
import { formatPublicationDate } from "@/lib/format-publication";

type Props = { params: Promise<{ slug: string }> };

function extractPublishedIn(description: string | null, sourceUrl: string | null): string | null {
  if (description) {
    const m = description.match(
      /(?:First published in|Novella first published in|Short story first published in)\s+(.+?)(?:\.|$)/i,
    );
    if (m?.[1]) return m[1].trim();
  }

  if (!sourceUrl) return null;
  try {
    const host = new URL(sourceUrl).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return sourceUrl;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!book || !book.fullText) {
    return { title: "Not found" };
  }

  const base = getSiteUrl();
  const path = `/books/${book.slug}`;
  const url = `${base}${path}`;
  const description =
    book.description?.slice(0, 160) ??
    `Read "${book.title}" by ${book.author.name} — free public-domain weird fiction on Strangeflix.`;
  const title = `${book.title} — ${book.author.name}`;
  const ogImage =
    book.coverImageUrl && book.coverImageUrl.startsWith("/")
      ? `${base}${book.coverImageUrl}`
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      ...(ogImage && { images: [{ url: ogImage, alt: book.title }] }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: { index: true, follow: true },
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!book || !book.fullText) notFound();

  const base = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author.name,
    },
    inLanguage: book.language || "en",
    url: `${base}/books/${book.slug}`,
    ...(book.coverImageUrl?.startsWith("/") && {
      image: `${base}${book.coverImageUrl}`,
    }),
    ...(book.publishedYear && { datePublished: `${book.publishedYear}` }),
    ...(book.description && { description: book.description }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookReader
        title={book.title}
        authorName={book.author.name}
        publicationDate={formatPublicationDate({
          publishedDay: book.publishedDay,
          publishedMonth: book.publishedMonth,
          publishedYear: book.publishedYear,
        })}
        publishedIn={extractPublishedIn(book.description, book.sourceUrl)}
        fullText={book.fullText}
        bookSlug={book.slug}
      />
    </>
  );
}
