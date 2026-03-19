import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Placeholder quando `DATABASE_URL` falta: permite `prisma generate` e o carregamento do config.
 * Na Vercel, `migrate deploy` só corre depois (via scripts/prisma-migrate-deploy.cjs), com validação explícita.
 */
const databaseUrl =
  process.env.DATABASE_URL?.trim() ??
  "postgresql://127.0.0.1:5432/strangeflix_placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
