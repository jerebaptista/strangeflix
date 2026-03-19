"use client";

import Link from "next/link";
import { TiltedBookCover } from "@/components/tilted-book-cover";

type Props = {
  slug: string;
  title: string;
  coverImageUrl: string;
  glareColor?: string | null;
  priority?: boolean;
  onOpenPreview?: () => void;
  /** Grade da home: largura = célula do grid, altura proporcional (2:3). */
  fillCell?: boolean;
};

export function BookCoverTilt({
  slug,
  title,
  coverImageUrl,
  glareColor,
  priority,
  onOpenPreview,
  fillCell = false,
}: Props) {
  const tilt = (
    <TiltedBookCover
      title={title}
      coverImageUrl={coverImageUrl}
      glareColor={glareColor}
      priority={priority}
      width={220}
      height={330}
      fillParent={fillCell}
    />
  );

  const outerClass = fillCell
    ? "mx-auto block w-full min-w-0 max-w-full shrink-0"
    : "mx-auto block w-[220px] max-w-full shrink-0";

  if (onOpenPreview) {
    return (
      <button
        type="button"
        onClick={onOpenPreview}
        className={`${outerClass} cursor-pointer rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
      >
        {tilt}
      </button>
    );
  }

  return (
    <Link href={`/books/${slug}`} className={`${outerClass} outline-none`}>
      {tilt}
    </Link>
  );
}
