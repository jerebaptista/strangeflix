/** Manter chaves alinhadas com `src/lib/database-url.ts` */
const URL_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
];

function resolvePostgresUrl() {
  for (const key of URL_ENV_KEYS) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return "";
}

module.exports = { resolvePostgresUrl, URL_ENV_KEYS };
