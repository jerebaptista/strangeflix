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
2. In Vercel → Project → **Settings → Environment Variables**, set `DATABASE_URL` for Production (and Preview if you want previews to hit a DB).
3. **Build** runs `prisma generate`, `prisma migrate deploy`, then `next build` — migrations apply automatically.
4. **Seed once** (data is not created by migrate):

   ```bash
   vercel env pull .env.production.local
   npx prisma db seed
   ```

   Or run seed from any machine with `DATABASE_URL` pointing at production.

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
