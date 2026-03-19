/**
 * `prisma generate` não precisa de DB; o migrate corre aqui com URL resolvida.
 * Injeta `DATABASE_URL` no filho para o prisma.config.ts ver a mesma string.
 */
const { spawnSync } = require("node:child_process");
const { resolvePostgresUrl, URL_ENV_KEYS } = require("./resolve-postgres-env.cjs");

const url = resolvePostgresUrl();

if (!url) {
  if (process.env.VERCEL) {
    console.error(
      "\n[build] No PostgreSQL connection string in environment.\n" +
        "→ Vercel: Settings → Environment Variables\n" +
        "→ Add one of: " +
        URL_ENV_KEYS.join(", ") +
        "\n" +
        "  (Neon / Vercel Postgres often add POSTGRES_URL or POSTGRES_PRISMA_URL — we read those too.)\n" +
        "→ Enable for Production (and Preview if needed), then Redeploy.\n",
    );
    process.exit(1);
  }
  console.warn(
    "[build] No Postgres URL — skipping prisma migrate deploy (local generate-only build).",
  );
  process.exit(0);
}

const env = { ...process.env, DATABASE_URL: url };

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(result.status === null ? 1 : result.status);
