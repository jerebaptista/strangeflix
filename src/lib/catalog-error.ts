import { Prisma } from "@/generated/prisma/client";

/** Motivo aproximado da falha ao carregar o catálogo (para texto na UI). */
export type CatalogLoadIssue =
  | "missing_env"
  | "unreachable"
  | "missing_migrations"
  | "unknown";

export function classifyCatalogLoadError(err: unknown): CatalogLoadIssue {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("No PostgreSQL URL") || msg.includes("Set one of:")) {
    return "missing_env";
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P1001") return "unreachable";
    if (err.code === "P2021" || err.code === "P2010") return "missing_migrations";
  }

  const lower = msg.toLowerCase();
  if (
    lower.includes("relation") &&
    (lower.includes("does not exist") || lower.includes("não existe"))
  ) {
    return "missing_migrations";
  }

  return "unknown";
}
