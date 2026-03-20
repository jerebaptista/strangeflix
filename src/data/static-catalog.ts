/**
 * Metadados espelhando `prisma/seed.ts` — usados quando não há Postgres (ex.: deploy Vercel só com ficheiros no repo).
 * O texto completo lê-se em `loadSiteBookBySlug` (`src/lib/books-data.ts`) via `textStorageKey`.
 */
import type { HomeBook } from "@/components/home-books-client";

export type StaticBookRecord = {
  slug: string;
  title: string;
  authorName: string;
  language: string;
  description: string | null;
  coverImageUrl: string;
  coverGlareColor: string | null;
  publishedYear: number | null;
  publishedMonth: number | null;
  publishedDay: number | null;
  sourceUrl: string | null;
  textStorageKey: string;
};

/** Ordem alinhada com inserts do seed (createdAt asc). */
const STATIC_BOOKS: StaticBookRecord[] = [
  {
    slug: "the-call-of-cthulhu",
    title: "The Call of Cthulhu",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, February 1928. " +
      "Full text aligned with the Wikisource transcription of that issue. " +
      "HTML edition: hplovecraft.com.",
    coverImageUrl: "/covers/the-call-of-cthulhu.png",
    coverGlareColor: "rgba(201, 238, 68, 0.85)",
    publishedYear: 1928,
    publishedMonth: 2,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cc.aspx",
    textStorageKey: "content/books/the-call-of-cthulhu.txt",
  },
  {
    slug: "the-dunwich-horror",
    title: "The Dunwich Horror",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, April 1929. " +
      "Full text from the Wikisource transcription (Weird Tales Vol. 13 No. 4). " +
      "HTML edition: hplovecraft.com.",
    coverImageUrl: "/covers/the-dunwich-horror.png",
    coverGlareColor: "rgba(196, 181, 255, 0.88)",
    publishedYear: 1929,
    publishedMonth: 4,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/dh.aspx",
    textStorageKey: "content/books/the-dunwich-horror.txt",
  },
  {
    slug: "at-the-mountains-of-madness",
    title: "At the Mountains of Madness",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Novella first published in Astounding Stories, February–April 1936. " +
      "The Miskatonic expedition to Antarctica uncovers pre-human ruins and unspeakable truths beyond the mountains of madness.",
    coverImageUrl: "/covers/at-the-mountains-of-madness.png",
    coverGlareColor: "rgba(180, 200, 255, 0.85)",
    publishedYear: 1936,
    publishedMonth: 2,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/mm.aspx",
    textStorageKey: "content/books/at-the-mountains-of-madness.txt",
  },
  {
    slug: "the-case-of-charles-dexter-ward",
    title: "The Case of Charles Dexter Ward",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Novella first published in Weird Tales, May and July 1941. " +
      "Charles Dexter Ward's obsession with his ancestor Joseph Curwen leads to necromancy, essential salts, and a horror from beyond the grave in Providence.",
    coverImageUrl: "/covers/the-case-of-charles-dexter-ward.png",
    coverGlareColor: "rgba(180, 220, 140, 0.85)",
    publishedYear: 1941,
    publishedMonth: 5,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cdw.aspx",
    textStorageKey: "content/books/the-case-of-charles-dexter-ward.txt",
  },
  {
    slug: "the-shadow-over-innsmouth",
    title: "The Shadow over Innsmouth",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Novella first published in book form, April 1936. " +
      "A traveller discovers the Esoteric Order of Dagon, Devil Reef, and the fish-frog legacy of Innsmouth.",
    coverImageUrl: "/covers/the-shadow-over-innsmouth.png",
    coverGlareColor: "rgba(255, 170, 90, 0.82)",
    publishedYear: 1936,
    publishedMonth: 4,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/soi.aspx",
    textStorageKey: "content/books/the-shadow-over-innsmouth.txt",
  },
  {
    slug: "the-whisperer-in-darkness",
    title: "The Whisperer in Darkness",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, August 1931. " +
      "Henry Akeley's Vermont farmhouse, the Mi-Go, Yuggoth, and the horror of the brain-cylinders.",
    coverImageUrl: "/covers/the-whisperer-in-darkness.png",
    coverGlareColor: "rgba(255, 220, 120, 0.82)",
    publishedYear: 1931,
    publishedMonth: 8,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/wid.aspx",
    textStorageKey: "content/books/the-whisperer-in-darkness.txt",
  },
  {
    slug: "the-shadow-out-of-time",
    title: "The Shadow out of Time",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Astounding Stories, June 1936. " +
      "Nathaniel Wingate Peaslee, the Great Race of Yith, mind-exchange across aeons, and the buried archives beneath the Australian desert.",
    coverImageUrl: "/covers/the-shadow-out-of-time.png",
    coverGlareColor: "rgba(180, 220, 160, 0.82)",
    publishedYear: 1936,
    publishedMonth: 6,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/sot.aspx",
    textStorageKey: "content/books/the-shadow-out-of-time.txt",
  },
  {
    slug: "the-colour-out-of-space",
    title: "The Colour out of Space",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Amazing Stories, September 1927. " +
      "A meteorite poisons the Gardner farm west of Arkham; a colour out of space drains the land and all who dwell there.",
    coverImageUrl: "/covers/the-colour-out-of-space.png",
    coverGlareColor: "rgba(220, 180, 255, 0.85)",
    publishedYear: 1927,
    publishedMonth: 9,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cs.aspx",
    textStorageKey: "content/books/the-colour-out-of-space.txt",
  },
  {
    slug: "pickmans-model",
    title: "Pickman's Model",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Short story. Richard Upton Pickman's art and the horrors hidden beneath Boston.",
    coverImageUrl: "/covers/pickmans-model.png",
    coverGlareColor: "rgba(255, 180, 100, 0.82)",
    publishedYear: 1927,
    publishedMonth: 7,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/pm.aspx",
    textStorageKey: "content/books/pickmans-model.txt",
  },
  {
    slug: "herbert-west-reanimator",
    title: "Herbert West–Reanimator",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Serial tale of Herbert West and his reanimating serum. First published in Home Brew, 1922.",
    coverImageUrl: "/covers/herbert-west-reanimator.png",
    coverGlareColor: "rgba(150, 255, 150, 0.75)",
    publishedYear: 1922,
    publishedMonth: 2,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/hwr.aspx",
    textStorageKey: "content/books/herbert-west-reanimator.txt",
  },
  {
    slug: "the-rats-in-the-walls",
    title: "The Rats in the Walls",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, March 1924. Exham Priory and the horrors beneath.",
    coverImageUrl: "/covers/the-rats-in-the-walls.png",
    coverGlareColor: "rgba(255, 160, 80, 0.82)",
    publishedYear: 1924,
    publishedMonth: 3,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/rw.aspx",
    textStorageKey: "content/books/the-rats-in-the-walls.txt",
  },
  {
    slug: "the-music-of-erich-zann",
    title: "The Music of Erich Zann",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in The National Amateur, March 1922. A violinist and the sounds from beyond the window.",
    coverImageUrl: "/covers/the-music-of-erich-zann.png",
    coverGlareColor: "rgba(120, 180, 255, 0.82)",
    publishedYear: 1922,
    publishedMonth: 3,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/mez.aspx",
    textStorageKey: "content/books/the-music-of-erich-zann.txt",
  },
  {
    slug: "the-thing-on-the-doorstep",
    title: "The Thing on the Doorstep",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, January 1937. Daniel Upton, Edward Derby, and the horror at the doorstep.",
    coverImageUrl: "/covers/the-thing-on-the-doorstep.png",
    coverGlareColor: "rgba(220, 200, 120, 0.82)",
    publishedYear: 1937,
    publishedMonth: 1,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/td.aspx",
    textStorageKey: "content/books/the-thing-on-the-doorstep.txt",
  },
  {
    slug: "the-dreams-in-the-witch-house",
    title: "The Dreams in the Witch House",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "First published in Weird Tales, July 1933. Walter Gilman, the witch Keziah, and the geometry of nightmare.",
    coverImageUrl: "/covers/the-dreams-in-the-witch-house.png",
    coverGlareColor: "rgba(140, 180, 255, 0.82)",
    publishedYear: 1933,
    publishedMonth: 7,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/dw.aspx",
    textStorageKey: "content/books/the-dreams-in-the-witch-house.txt",
  },
  {
    slug: "dagon",
    title: "Dagon",
    authorName: "H. P. Lovecraft",
    language: "en",
    description:
      "Short story first published in The Vagrant, November 1919. A castaway, a monolith, and the thing from the deep.",
    coverImageUrl: "/covers/dagon.png",
    coverGlareColor: "rgba(200, 190, 100, 0.82)",
    publishedYear: 1919,
    publishedMonth: 11,
    publishedDay: null,
    sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/d.aspx",
    textStorageKey: "content/books/dagon.txt",
  },
];

export function getStaticHomeBooks(): HomeBook[] {
  return STATIC_BOOKS.map((b) => ({
    slug: b.slug,
    title: b.title,
    coverImageUrl: b.coverImageUrl,
    coverGlareColor: b.coverGlareColor,
    authorName: b.authorName,
    publishedYear: b.publishedYear,
    publishedMonth: b.publishedMonth,
    publishedDay: b.publishedDay,
    description: b.description,
  }));
}

export function findStaticBookMeta(slug: string): StaticBookRecord | undefined {
  return STATIC_BOOKS.find((b) => b.slug === slug);
}

export function getStaticBookSlugs(): string[] {
  return STATIC_BOOKS.map((b) => b.slug);
}
