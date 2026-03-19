/**
 * `prisma generate` não precisa de DB real, mas carrega prisma.config.ts.
 * Não podemos lançar erro aí — só validamos DATABASE_URL antes de `migrate deploy`.
 */
const { spawnSync } = require("node:child_process");

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  if (process.env.VERCEL) {
    console.error(
      "\n[build] DATABASE_URL is not set.\n" +
        "→ Vercel: Project → Settings → Environment Variables\n" +
        "→ Add DATABASE_URL (PostgreSQL connection string from Neon, Supabase, etc.)\n" +
        "→ Enable it for Production (and Preview if you deploy previews).\n" +
        "→ Redeploy after saving.\n",
    );
    process.exit(1);
  }
  console.warn(
    "[build] DATABASE_URL not set — skipping prisma migrate deploy (local generate-only build).",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status === null ? 1 : result.status);
