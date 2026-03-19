import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export default async function BookPage({ params }: Props) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!book || !book.fullText) notFound();

  return (
    <BookReader
      title={book.title}
      authorName={book.author.name}
      fullText={book.fullText}
    />
  );
}
