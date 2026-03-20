# Strangeflix

Web app for browsing and reading **public-domain horror books** (starting with Lovecraft). UI in **English**.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **shadcn/ui** (Base UI + Radix-style primitives)
- **Prisma 7** + **PostgreSQL** + `@prisma/adapter-pg` + `pg`  
  (SQLite was removed — for a **database-driven** catalog on Vercel you need hosted Postgres: Neon, Supabase, etc.)
- **No `DATABASE_URL` / `POSTGRES_*`:** the app uses a **static catalog** (`src/data/static-catalog.ts`) plus `content/books/*.txt` — Vercel deploy works from the repo alone (no DB).

## Setup

1. **PostgreSQL** running locally (Docker example):

   ```bash
   docker run --name strangeflix-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=strangeflix -p 5432:5432 -d postgres:16
   ```

2. **Env & DB**

   ```bash
   npm install
   cp .env.example .env
   # edit DATABASE_URL if needed
   npx prisma migrate dev
   npm run db:seed
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

### Files only (no database) — recommended if you skip Postgres

1. Connect the Git repo to Vercel and deploy. **Do not** add `DATABASE_URL` / `POSTGRES_*` — the catalog comes from `src/data/static-catalog.ts` and `content/books/*.txt`.
2. **Canonical URL (Open Graph, sitemap):** you usually need **no** Environment Variables. `getSiteUrl()` uses **`VERCEL_URL`**, which Vercel sets automatically → `https://<your-project>.vercel.app`.
3. **Optional:** if you use a **custom domain**, add **`NEXT_PUBLIC_SITE_URL`** = `https://your-domain.com` (Production + Preview if you want) so metadata and sitemap use that base instead of `*.vercel.app`.

**Build:** `prisma generate` → migrate script skips `migrate deploy` when no Postgres URL → `next build`.

### With PostgreSQL (hosted DB)

1. Create a **Neon** (or Supabase) database and copy the connection string (`sslmode=require` where required).
2. In Vercel → **Settings → Environment Variables**, add **one** Postgres URL for **Production** (and **Preview** if needed): `DATABASE_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, or `POSTGRES_URL_NON_POOLING` (first defined wins).
3. **Redeploy** so `prisma migrate deploy` runs on build, then **seed once**:

   ```bash
   vercel env pull .env.production.local
   npx prisma db seed
   ```

   Or run seed from any machine with `DATABASE_URL` pointing at production.
4. Same **canonical URL** rules as above (`VERCEL_URL` by default; `NEXT_PUBLIC_SITE_URL` for a custom domain).

## FAQ: local Postgres vs Vercel

- **Local** `DATABASE_URL` (e.g. `localhost`) only works on your machine when you run `npm run dev` (or a local `next start`). Strangeflix reads that from `.env`.
- **Vercel** runs your app on servers in the cloud. Those servers **cannot** open a connection to `localhost` on your laptop. So the live site needs a **hosted** PostgreSQL (Neon, Supabase, Vercel Postgres, etc.) and the same connection string copied into **Vercel → Environment Variables** (`DATABASE_URL` or often `POSTGRES_URL` / `POSTGRES_PRISMA_URL` from the provider).
- **Files-only (no Postgres on Vercel):** you don’t need `DATABASE_URL`; keep `static-catalog` and `content/books` in sync with `prisma/seed.ts` when adding titles.
- After the first deploy **with** that variable, migrations should run on build; then run **`prisma db seed`** once against the **hosted** database (not only your local DB), e.g. `vercel env pull` then `npx prisma db seed`.

## Database

Models: `Author`, `Book`, `BookChapter` (see `prisma/schema.prisma`).  
Use `npm run db:studio` to inspect data.

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build (includes migrate deploy) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate`  | Create/apply migrations (`migrate dev`) |
| `npm run db:studio`   | Prisma Studio            |
| `npm run db:seed`     | Seed authors & books     |
| `npm run content:dunwich` | Regenerate Dunwich text from Wikisource (optional; needs network or `WIKISOURCE_DUMP` path) |
