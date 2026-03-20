import type { MetadataRoute } from "next";
import { getStaticBookSlugs } from "@/data/static-catalog";
import { hasPostgresEnv } from "@/lib/database-url";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/lovecraft",
    "/privacy",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let bookRoutes: MetadataRoute.Sitemap = [];

  if (!hasPostgresEnv()) {
    const now = new Date();
    bookRoutes = getStaticBookSlugs().map((slug) => ({
      url: `${base}/books/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } else {
    try {
      const books = await prisma.book.findMany({
        where: { fullText: { not: null } },
        select: { slug: true, updatedAt: true },
      });
      bookRoutes = books.map((b) => ({
        url: `${base}/books/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
    } catch {
      /* sem banco no build */
    }
  }

  return [...staticRoutes, ...bookRoutes];
}
