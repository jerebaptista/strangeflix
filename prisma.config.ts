import "dotenv/config";
import { defineConfig } from "prisma/config";
import { resolvePostgresUrl } from "./src/lib/database-url";

/**
 * Placeholder quando nenhuma URL Postgres está definida: permite `prisma generate`.
 * O script `prisma-migrate-deploy.cjs` injeta `DATABASE_URL` no processo do migrate.
 */
const databaseUrl =
  resolvePostgresUrl() ??
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
