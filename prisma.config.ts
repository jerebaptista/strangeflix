import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Fallback para build (ex.: Vercel) onde DATABASE_URL pode não estar definida; prisma generate não conecta ao banco. */
const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

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
