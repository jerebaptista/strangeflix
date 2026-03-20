/**
 * Vercel Postgres / Neon às vezes expõem `POSTGRES_URL` ou `POSTGRES_PRISMA_URL`
 * em vez de `DATABASE_URL`. Ordem: explícito da app → integrações comuns.
 */
const URL_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function resolvePostgresUrl(): string | undefined {
  for (const key of URL_ENV_KEYS) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return undefined;
}

/** `true` se houver URL de Postgres configurada (local ou Vercel). */
export function hasPostgresEnv(): boolean {
  return Boolean(resolvePostgresUrl());
}

export function postgresUrlEnvHint(): string {
  return URL_ENV_KEYS.join(", ");
}
