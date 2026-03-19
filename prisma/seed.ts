import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

function readBookText(relativePath: string): string {
  const textPath = path.join(__dirname, "..", relativePath);
  if (!fs.existsSync(textPath)) {
    throw new Error(`Missing ${textPath}`);
  }
  return fs.readFileSync(textPath, "utf8");
}

async function main() {
  const author = await prisma.author.upsert({
    where: { slug: "h-p-lovecraft" },
    create: {
      name: "H. P. Lovecraft",
      slug: "h-p-lovecraft",
      bio: "American author of weird fiction and horror (1890–1937).",
    },
    update: {
      name: "H. P. Lovecraft",
    },
  });

  const cthulhuText = readBookText("content/books/the-call-of-cthulhu.txt");
  const cthulhuDescription =
    "First published in Weird Tales, February 1928. " +
    "Full text aligned with the Wikisource transcription of that issue. " +
    "HTML edition: hplovecraft.com.";

  await prisma.book.upsert({
    where: { slug: "the-call-of-cthulhu" },
    create: {
      title: "The Call of Cthulhu",
      slug: "the-call-of-cthulhu",
      description: cthulhuDescription,
      language: "en",
      coverImageUrl: "/covers/the-call-of-cthulhu.png",
      coverGlareColor: "rgba(201, 238, 68, 0.85)",
      publishedYear: 1928,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cc.aspx",
      textStorageKey: "content/books/the-call-of-cthulhu.txt",
      fullText: cthulhuText,
      authorId: author.id,
    },
    update: {
      description: cthulhuDescription,
      coverImageUrl: "/covers/the-call-of-cthulhu.png",
      coverGlareColor: "rgba(201, 238, 68, 0.85)",
      publishedYear: 1928,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cc.aspx",
      textStorageKey: "content/books/the-call-of-cthulhu.txt",
      fullText: cthulhuText,
    },
  });

  const dunwichText = readBookText("content/books/the-dunwich-horror.txt");
  const dunwichDescription =
    "First published in Weird Tales, April 1929. " +
    "Full text from the Wikisource transcription (Weird Tales Vol. 13 No. 4). " +
    "HTML edition: hplovecraft.com.";

  await prisma.book.upsert({
    where: { slug: "the-dunwich-horror" },
    create: {
      title: "The Dunwich Horror",
      slug: "the-dunwich-horror",
      description: dunwichDescription,
      language: "en",
      coverImageUrl: "/covers/the-dunwich-horror.png",
      coverGlareColor: "rgba(196, 181, 255, 0.88)",
      publishedYear: 1929,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/dh.aspx",
      textStorageKey: "content/books/the-dunwich-horror.txt",
      fullText: dunwichText,
      authorId: author.id,
    },
    update: {
      description: dunwichDescription,
      coverImageUrl: "/covers/the-dunwich-horror.png",
      coverGlareColor: "rgba(196, 181, 255, 0.88)",
      publishedYear: 1929,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/dh.aspx",
      textStorageKey: "content/books/the-dunwich-horror.txt",
      fullText: dunwichText,
    },
  });

  const mountainsText = readBookText("content/books/at-the-mountains-of-madness.txt");
  const mountainsDescription =
    "Novella first published in Astounding Stories, February–April 1936. " +
    "The Miskatonic expedition to Antarctica uncovers pre-human ruins and unspeakable truths beyond the mountains of madness.";

  await prisma.book.upsert({
    where: { slug: "at-the-mountains-of-madness" },
    create: {
      title: "At the Mountains of Madness",
      slug: "at-the-mountains-of-madness",
      description: mountainsDescription,
      language: "en",
      coverImageUrl: "/covers/at-the-mountains-of-madness.png",
      coverGlareColor: "rgba(180, 200, 255, 0.85)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/mm.aspx",
      textStorageKey: "content/books/at-the-mountains-of-madness.txt",
      fullText: mountainsText,
      authorId: author.id,
    },
    update: {
      description: mountainsDescription,
      coverImageUrl: "/covers/at-the-mountains-of-madness.png",
      coverGlareColor: "rgba(180, 200, 255, 0.85)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/mm.aspx",
      textStorageKey: "content/books/at-the-mountains-of-madness.txt",
      fullText: mountainsText,
    },
  });

  const wardText = readBookText("content/books/the-case-of-charles-dexter-ward.txt");
  const wardDescription =
    "Novella first published in Weird Tales, May and July 1941. " +
    "Charles Dexter Ward's obsession with his ancestor Joseph Curwen leads to necromancy, essential salts, and a horror from beyond the grave in Providence.";

  await prisma.book.upsert({
    where: { slug: "the-case-of-charles-dexter-ward" },
    create: {
      title: "The Case of Charles Dexter Ward",
      slug: "the-case-of-charles-dexter-ward",
      description: wardDescription,
      language: "en",
      coverImageUrl: "/covers/the-case-of-charles-dexter-ward.png",
      coverGlareColor: "rgba(180, 220, 140, 0.85)",
      publishedYear: 1941,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cdw.aspx",
      textStorageKey: "content/books/the-case-of-charles-dexter-ward.txt",
      fullText: wardText,
      authorId: author.id,
    },
    update: {
      description: wardDescription,
      coverImageUrl: "/covers/the-case-of-charles-dexter-ward.png",
      coverGlareColor: "rgba(180, 220, 140, 0.85)",
      publishedYear: 1941,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cdw.aspx",
      textStorageKey: "content/books/the-case-of-charles-dexter-ward.txt",
      fullText: wardText,
    },
  });

  const innsmouthText = readBookText("content/books/the-shadow-over-innsmouth.txt");
  const innsmouthDescription =
    "Novella first published in book form, April 1936. " +
    "A traveller discovers the Esoteric Order of Dagon, Devil Reef, and the fish-frog legacy of Innsmouth.";

  await prisma.book.upsert({
    where: { slug: "the-shadow-over-innsmouth" },
    create: {
      title: "The Shadow over Innsmouth",
      slug: "the-shadow-over-innsmouth",
      description: innsmouthDescription,
      language: "en",
      coverImageUrl: "/covers/the-shadow-over-innsmouth.png",
      coverGlareColor: "rgba(255, 170, 90, 0.82)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/soi.aspx",
      textStorageKey: "content/books/the-shadow-over-innsmouth.txt",
      fullText: innsmouthText,
      authorId: author.id,
    },
    update: {
      description: innsmouthDescription,
      coverImageUrl: "/covers/the-shadow-over-innsmouth.png",
      coverGlareColor: "rgba(255, 170, 90, 0.82)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/soi.aspx",
      textStorageKey: "content/books/the-shadow-over-innsmouth.txt",
      fullText: innsmouthText,
    },
  });

  const whispererText = readBookText("content/books/the-whisperer-in-darkness.txt");
  const whispererDescription =
    "First published in Weird Tales, August 1931. " +
    "Henry Akeley's Vermont farmhouse, the Mi-Go, Yuggoth, and the horror of the brain-cylinders.";

  await prisma.book.upsert({
    where: { slug: "the-whisperer-in-darkness" },
    create: {
      title: "The Whisperer in Darkness",
      slug: "the-whisperer-in-darkness",
      description: whispererDescription,
      language: "en",
      coverImageUrl: "/covers/the-whisperer-in-darkness.png",
      coverGlareColor: "rgba(255, 220, 120, 0.82)",
      publishedYear: 1931,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/wid.aspx",
      textStorageKey: "content/books/the-whisperer-in-darkness.txt",
      fullText: whispererText,
      authorId: author.id,
    },
    update: {
      description: whispererDescription,
      coverImageUrl: "/covers/the-whisperer-in-darkness.png",
      coverGlareColor: "rgba(255, 220, 120, 0.82)",
      publishedYear: 1931,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/wid.aspx",
      textStorageKey: "content/books/the-whisperer-in-darkness.txt",
      fullText: whispererText,
    },
  });

  const shadowOutText = readBookText("content/books/the-shadow-out-of-time.txt");
  const shadowOutDescription =
    "First published in Astounding Stories, June 1936. " +
    "Nathaniel Wingate Peaslee, the Great Race of Yith, mind-exchange across aeons, and the buried archives beneath the Australian desert.";

  await prisma.book.upsert({
    where: { slug: "the-shadow-out-of-time" },
    create: {
      title: "The Shadow out of Time",
      slug: "the-shadow-out-of-time",
      description: shadowOutDescription,
      language: "en",
      coverImageUrl: "/covers/the-shadow-out-of-time.png",
      coverGlareColor: "rgba(180, 220, 160, 0.82)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/sot.aspx",
      textStorageKey: "content/books/the-shadow-out-of-time.txt",
      fullText: shadowOutText,
      authorId: author.id,
    },
    update: {
      description: shadowOutDescription,
      coverImageUrl: "/covers/the-shadow-out-of-time.png",
      coverGlareColor: "rgba(180, 220, 160, 0.82)",
      publishedYear: 1936,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/sot.aspx",
      textStorageKey: "content/books/the-shadow-out-of-time.txt",
      fullText: shadowOutText,
    },
  });

  const colourText = readBookText("content/books/the-colour-out-of-space.txt");
  const colourDescription =
    "First published in Amazing Stories, September 1927. " +
    "A meteorite poisons the Gardner farm west of Arkham; a colour out of space drains the land and all who dwell there.";

  await prisma.book.upsert({
    where: { slug: "the-colour-out-of-space" },
    create: {
      title: "The Colour out of Space",
      slug: "the-colour-out-of-space",
      description: colourDescription,
      language: "en",
      coverImageUrl: "/covers/the-colour-out-of-space.png",
      coverGlareColor: "rgba(220, 180, 255, 0.85)",
      publishedYear: 1927,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cs.aspx",
      textStorageKey: "content/books/the-colour-out-of-space.txt",
      fullText: colourText,
      authorId: author.id,
    },
    update: {
      description: colourDescription,
      coverImageUrl: "/covers/the-colour-out-of-space.png",
      coverGlareColor: "rgba(220, 180, 255, 0.85)",
      publishedYear: 1927,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/cs.aspx",
      textStorageKey: "content/books/the-colour-out-of-space.txt",
      fullText: colourText,
    },
  });

  const pickmansText = readBookText("content/books/pickmans-model.txt");
  await prisma.book.upsert({
    where: { slug: "pickmans-model" },
    create: {
      title: "Pickman's Model",
      slug: "pickmans-model",
      description: "Short story. Richard Upton Pickman's art and the horrors hidden beneath Boston.",
      language: "en",
      coverImageUrl: "/covers/pickmans-model.png",
      coverGlareColor: "rgba(255, 180, 100, 0.82)",
      publishedYear: 1927,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/pm.aspx",
      textStorageKey: "content/books/pickmans-model.txt",
      fullText: pickmansText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/pickmans-model.png",
      textStorageKey: "content/books/pickmans-model.txt",
      fullText: pickmansText,
    },
  });

  const herbertWestText = readBookText("content/books/herbert-west-reanimator.txt");
  await prisma.book.upsert({
    where: { slug: "herbert-west-reanimator" },
    create: {
      title: "Herbert West–Reanimator",
      slug: "herbert-west-reanimator",
      description: "Serial tale of Herbert West and his reanimating serum. First published in Home Brew, 1922.",
      language: "en",
      coverImageUrl: "/covers/herbert-west-reanimator.png",
      coverGlareColor: "rgba(150, 255, 150, 0.75)",
      publishedYear: 1922,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/hwr.aspx",
      textStorageKey: "content/books/herbert-west-reanimator.txt",
      fullText: herbertWestText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/herbert-west-reanimator.png",
      textStorageKey: "content/books/herbert-west-reanimator.txt",
      fullText: herbertWestText,
    },
  });

  const ratsText = readBookText("content/books/the-rats-in-the-walls.txt");
  await prisma.book.upsert({
    where: { slug: "the-rats-in-the-walls" },
    create: {
      title: "The Rats in the Walls",
      slug: "the-rats-in-the-walls",
      description: "First published in Weird Tales, March 1924. Exham Priory and the horrors beneath.",
      language: "en",
      coverImageUrl: "/covers/the-rats-in-the-walls.png",
      coverGlareColor: "rgba(255, 160, 80, 0.82)",
      publishedYear: 1924,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/rw.aspx",
      textStorageKey: "content/books/the-rats-in-the-walls.txt",
      fullText: ratsText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/the-rats-in-the-walls.png",
      textStorageKey: "content/books/the-rats-in-the-walls.txt",
      fullText: ratsText,
    },
  });

  const erichZannText = readBookText("content/books/the-music-of-erich-zann.txt");
  await prisma.book.upsert({
    where: { slug: "the-music-of-erich-zann" },
    create: {
      title: "The Music of Erich Zann",
      slug: "the-music-of-erich-zann",
      description: "First published in The National Amateur, March 1922. A violinist and the sounds from beyond the window.",
      language: "en",
      coverImageUrl: "/covers/the-music-of-erich-zann.png",
      coverGlareColor: "rgba(120, 180, 255, 0.82)",
      publishedYear: 1922,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/mez.aspx",
      textStorageKey: "content/books/the-music-of-erich-zann.txt",
      fullText: erichZannText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/the-music-of-erich-zann.png",
      textStorageKey: "content/books/the-music-of-erich-zann.txt",
      fullText: erichZannText,
    },
  });

  const doorstepText = readBookText("content/books/the-thing-on-the-doorstep.txt");
  await prisma.book.upsert({
    where: { slug: "the-thing-on-the-doorstep" },
    create: {
      title: "The Thing on the Doorstep",
      slug: "the-thing-on-the-doorstep",
      description: "First published in Weird Tales, January 1937. Daniel Upton, Edward Derby, and the horror at the doorstep.",
      language: "en",
      coverImageUrl: "/covers/the-thing-on-the-doorstep.png",
      coverGlareColor: "rgba(220, 200, 120, 0.82)",
      publishedYear: 1937,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/td.aspx",
      textStorageKey: "content/books/the-thing-on-the-doorstep.txt",
      fullText: doorstepText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/the-thing-on-the-doorstep.png",
      textStorageKey: "content/books/the-thing-on-the-doorstep.txt",
      fullText: doorstepText,
    },
  });

  const witchHouseText = readBookText("content/books/the-dreams-in-the-witch-house.txt");
  await prisma.book.upsert({
    where: { slug: "the-dreams-in-the-witch-house" },
    create: {
      title: "The Dreams in the Witch House",
      slug: "the-dreams-in-the-witch-house",
      description: "First published in Weird Tales, July 1933. Walter Gilman, the witch Keziah, and the geometry of nightmare.",
      language: "en",
      coverImageUrl: "/covers/the-dreams-in-the-witch-house.png",
      coverGlareColor: "rgba(140, 180, 255, 0.82)",
      publishedYear: 1933,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/dw.aspx",
      textStorageKey: "content/books/the-dreams-in-the-witch-house.txt",
      fullText: witchHouseText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/the-dreams-in-the-witch-house.png",
      textStorageKey: "content/books/the-dreams-in-the-witch-house.txt",
      fullText: witchHouseText,
    },
  });

  const dagonText = readBookText("content/books/dagon.txt");
  await prisma.book.upsert({
    where: { slug: "dagon" },
    create: {
      title: "Dagon",
      slug: "dagon",
      description: "Short story first published in The Vagrant, November 1919. A castaway, a monolith, and the thing from the deep.",
      language: "en",
      coverImageUrl: "/covers/dagon.png",
      coverGlareColor: "rgba(200, 190, 100, 0.82)",
      publishedYear: 1919,
      sourceUrl: "https://www.hplovecraft.com/writings/texts/fiction/d.aspx",
      textStorageKey: "content/books/dagon.txt",
      fullText: dagonText,
      authorId: author.id,
    },
    update: {
      coverImageUrl: "/covers/dagon.png",
      textStorageKey: "content/books/dagon.txt",
      fullText: dagonText,
    },
  });

  console.log("Seeded: H. P. Lovecraft + 16 titles (incl. Pickman's Model, Herbert West–Reanimator, The Rats in the Walls, The Music of Erich Zann, The Thing on the Doorstep, The Dreams in the Witch House, Dagon)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
