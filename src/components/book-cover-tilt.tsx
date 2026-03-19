"use client";

import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

const DEFAULT_GLARE_COLOR = "rgba(201, 238, 68, 0.85)";

type Props = {
  slug: string;
  title: string;
  coverImageUrl: string;
  /** Per-cover tilt glare; any valid CSS color string. */
  glareColor?: string | null;
  priority?: boolean;
};

/** Shared corner radius: glare layer and cover clip must match (react-parallax-tilt uses px string). */
const COVER_RADIUS_PX = 4;

/** 3D tilt + glare on hover — same stack as legacy/pokemon-trainer pokedex cards. */
export function BookCoverTilt({
  slug,
  title,
  coverImageUrl,
  glareColor,
  priority,
}: Props) {
  const r = `${COVER_RADIUS_PX}px`;
  const glare = glareColor?.trim() || DEFAULT_GLARE_COLOR;
  return (
    <Link href={`/books/${slug}`} className="block outline-none">
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={900}
        glareEnable
        glareMaxOpacity={0.3}
        glareColor={glare}
        glarePosition="all"
        glareBorderRadius={r}
        scale={1.03}
        transitionSpeed={1200}
        className="[transform-style:preserve-3d]"
      >
        <div
          className="overflow-hidden shadow-xl"
          style={{ borderRadius: r }}
        >
          <Image
            src={coverImageUrl}
            alt={title}
            width={280}
            height={420}
            className="object-cover"
            priority={priority}
            draggable={false}
          />
        </div>
      </Tilt>
    </Link>
  );
}
