"use client";

import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { cn } from "@/lib/utils";

const DEFAULT_GLARE_COLOR = "rgba(201, 238, 68, 0.85)";
export const COVER_RADIUS_PX = 4;

/**
 * `false` — capa estática (sem tilt/glare), útil para testar se a animação afeta o layout.
 * `true` — comportamento normal com react-parallax-tilt.
 */
const BOOK_COVER_TILT_ENABLED = false;

type Props = {
  title: string;
  coverImageUrl: string;
  glareColor?: string | null;
  priority?: boolean;
  /** Largura em px no modo fixo; com `fillParent`, só define a proporção com `height`. */
  width?: number;
  height?: number;
  /** Ocupa 100% da largura do pai; altura = largura × (height/width). */
  fillParent?: boolean;
  className?: string;
};

/** Capa com tilt/glare — reutilizada na grade da home e no overlay. */
export function TiltedBookCover({
  title,
  coverImageUrl,
  glareColor,
  priority,
  width = 280,
  height = 420,
  fillParent = false,
  className,
}: Props) {
  const r = `${COVER_RADIUS_PX}px`;
  const glare = glareColor?.trim() || DEFAULT_GLARE_COLOR;
  const aspectRatio = `${width} / ${height}`;
  const sizes = fillParent
    ? "(max-width: 640px) 50vw, (max-width: 768px) 34vw, (max-width: 1024px) 26vw, (max-width: 1280px) 20vw, 18vw"
    : `(max-width: 768px) 90vw, ${width}px`;

  const coverInner = (
    <div
      className="relative w-full overflow-visible shadow-xl"
      style={{ aspectRatio }}
    >
      <Image
        src={coverImageUrl}
        alt={title}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ borderRadius: r }}
        priority={priority}
        draggable={false}
        unoptimized={process.env.NODE_ENV === "development"}
      />
    </div>
  );

  /* Modo fixo: wrapper com largura em px. Modo fillParent: largura 100% do contentor. */
  return (
    <div
      className={cn(
        "mx-auto max-w-full",
        fillParent ? "w-full min-w-0" : null,
        className,
      )}
      style={fillParent ? undefined : { width, maxWidth: "100%" }}
    >
      {BOOK_COVER_TILT_ENABLED ? (
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
          className="block w-full [transform-style:preserve-3d]"
        >
          {coverInner}
        </Tilt>
      ) : (
        <div className="block w-full">{coverInner}</div>
      )}
    </div>
  );
}
