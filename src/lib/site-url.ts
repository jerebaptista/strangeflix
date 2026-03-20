/**
 * Base URL absoluta para Open Graph, canonical e sitemap.
 *
 * Ordem: `NEXT_PUBLIC_SITE_URL` (definida por ti) → `VERCEL_URL` (injetada pela Vercel em deploy)
 * → localhost em dev.
 *
 * Na Vercel **não precisas** de Environment Variables para isto: `VERCEL_URL` já vem preenchida
 * (ex. `projeto.vercel.app`). Usa `NEXT_PUBLIC_SITE_URL` só com **domínio próprio**.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
