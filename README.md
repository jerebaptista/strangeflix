# Strangeflix

Web app for browsing and reading **public-domain horror books** (starting with Lovecraft). UI in **English**.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **shadcn/ui** (Base UI + Radix-style primitives)
- **Prisma 7** + **PostgreSQL** + `@prisma/adapter-pg` + `pg`  
  (SQLite was removed — serverless hosts like Vercel need a hosted Postgres: Neon, Supabase, etc.)

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

1. Create a **Neon** (or Supabase) database and copy the connection string (`sslmode=require` where required).
2. In Vercel → Project → **Settings → Environment Variables**, add **one** Postgres URL for **Production** (and **Preview** if you use previews). Checked in order: `DATABASE_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`.
   - **First deploy without a URL:** the build still completes; migrations are **skipped** (see build logs). Add the variable and **Redeploy** so `prisma migrate deploy` runs.
   - Until a URL exists at **runtime**, pages that use Prisma will error or show an empty catalog.
3. **Build:** `prisma generate` → migrate script (runs `prisma migrate deploy` only when a URL is present) → `next build`.
4. **Seed once** (data is not created by migrate):

   ```bash
   vercel env pull .env.production.local
   npx prisma db seed
   ```

   Or run seed from any machine with `DATABASE_URL` pointing at production.

## FAQ: local Postgres vs Vercel

- **Local** `DATABASE_URL` (e.g. `localhost`) only works on your machine when you run `npm run dev` (or a local `next start`). Strangeflix reads that from `.env`.
- **Vercel** runs your app on servers in the cloud. Those servers **cannot** open a connection to `localhost` on your laptop. So the live site needs a **hosted** PostgreSQL (Neon, Supabase, Vercel Postgres, etc.) and the same connection string copied into **Vercel → Environment Variables** (`DATABASE_URL` or often `POSTGRES_URL` / `POSTGRES_PRISMA_URL` from the provider).
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
