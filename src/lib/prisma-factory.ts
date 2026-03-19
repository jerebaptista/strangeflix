import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { postgresUrlEnvHint, resolvePostgresUrl } from "./database-url";

/** Cliente Prisma com Postgres (`pg` + adapter oficial). Usado na app e no seed. */
export function createPrismaClient() {
  const connectionString = resolvePostgresUrl();
  if (!connectionString) {
    throw new Error(
      `No PostgreSQL URL. Set one of: ${postgresUrlEnvHint()} (e.g. in .env or Vercel env vars).`,
    );
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
