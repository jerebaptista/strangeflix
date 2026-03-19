import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Na Vercel, `DATABASE_URL` tem de existir (env do projeto); senão `migrate deploy` usaria o
 * placeholder local e falhava com P1001 em 127.0.0.1 — confuso. Fora da Vercel, placeholder
 * permite `prisma generate` sem `.env`.
 */
function databaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL is not set. In Vercel: Project → Settings → Environment Variables → add DATABASE_URL (PostgreSQL URL from Neon, Supabase, etc.) for Production (and Preview if you use previews).",
    );
  }

  return "postgresql://127.0.0.1:5432/strangeflix_placeholder?schema=public";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl(),
  },
});
