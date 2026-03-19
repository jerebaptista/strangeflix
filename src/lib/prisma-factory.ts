import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../generated/prisma/client";

/** Cliente Prisma com Postgres (`pg` + adapter oficial). Usado na app e no seed. */
export function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add a PostgreSQL URL to .env (local Docker, Neon, Supabase, etc.).",
    );
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}
