import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Fallback só para `prisma generate` sem .env; migrações e runtime precisam de DATABASE_URL real. */
const databaseUrl =
  process.env.DATABASE_URL ??
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
