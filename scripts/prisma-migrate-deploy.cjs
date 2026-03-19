/**
 * `prisma generate` não precisa de DB; o migrate corre aqui com URL resolvida.
 * Injeta `DATABASE_URL` no filho para o prisma.config.ts ver a mesma string.
 *
 * Na Vercel sem nenhuma URL: não falhamos o build (muitos projetos ligam a BD depois).
 * O aviso lembra de adicionar env + redeploy para correr migrações.
 */
const { spawnSync } = require("node:child_process");
const { resolvePostgresUrl, URL_ENV_KEYS } = require("./resolve-postgres-env.cjs");

const url = resolvePostgresUrl();

if (!url) {
  if (process.env.VERCEL) {
    console.warn(
      "\n[build] ⚠ Skipping prisma migrate deploy: no Postgres URL in this environment.\n" +
        "→ Add one of: " +
        URL_ENV_KEYS.join(", ") +
        "\n" +
        "  (Vercel: Settings → Environment Variables; marca Production/Preview; Storage → Postgres ou Neon.)\n" +
        "→ Guarda e faz **Redeploy** — nessa build o migrate corre e cria as tabelas.\n" +
        "→ Depois: `npx prisma db seed` com a mesma URL (ou `vercel env pull`).\n" +
        "→ Até lá, páginas que usam Prisma podem falhar ou mostrar catálogo vazio.\n",
    );
    process.exit(0);
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
