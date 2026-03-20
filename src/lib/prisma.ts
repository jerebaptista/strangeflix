import { createPrismaClient } from "@/lib/prisma-factory";
import type { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Uma instância por “invocação” em prod; em dev reutiliza via global (HMR). */
let prismaProduction: PrismaClient | undefined;

function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV !== "production") {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    const client = createPrismaClient();
    globalForPrisma.prisma = client;
    return client;
  }
  if (!prismaProduction) {
    prismaProduction = createPrismaClient();
  }
  return prismaProduction;
}

/**
 * Lazy: só liga ao Postgres na primeira utilização.
 * Assim `import { prisma }` não rebenta no `next build` da Vercel sem DATABASE_URL
 * (ex.: sitemap com try/catch só ajuda depois de o cliente existir).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
}) as PrismaClient;
