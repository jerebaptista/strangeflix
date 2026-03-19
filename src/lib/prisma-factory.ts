import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { postgresUrlEnvHint, resolvePostgresUrl } from "./database-url";

/**
 * Cliente Prisma com Postgres via `@prisma/adapter-pg`.
 * Usa `PoolConfig` (`connectionString`) em vez de `new pg.Pool()` para evitar conflito de
 * tipos entre `@types/pg` do projeto e o aninhado em `adapter-pg` (falha no `next build`).
 */
export function createPrismaClient() {
  const connectionString = resolvePostgresUrl();
  if (!connectionString) {
    throw new Error(
      `No PostgreSQL URL. Set one of: ${postgresUrlEnvHint()} (e.g. in .env or Vercel env vars).`,
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
