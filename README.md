# Strangeflix

Web app for browsing and reading **public-domain horror books** (starting with Lovecraft). UI in **English**.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **shadcn/ui** (Base UI + Radix-style primitives)
- **Prisma 7** + **SQLite** (local) + `@prisma/adapter-better-sqlite3`  
  → Swap to PostgreSQL + **Supabase** later by changing `provider`, URL in `prisma.config.ts`, and using `@prisma/adapter-pg` (or direct connection).

## Setup

```bash
npm install
cp .env.example .env   # optional; .env is created by Prisma init
npm run db:migrate     # applies migrations (creates prisma/dev.db)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Models: `Author`, `Book`, `BookChapter` (see `prisma/schema.prisma`).  
Use `npm run db:studio` to inspect data.

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate`  | Create/apply migrations  |
| `npm run db:studio`   | Prisma Studio            |
| `npm run db:seed`     | Seed authors & books     |
| `npm run content:dunwich` | Regenerate Dunwich text from Wikisource (optional; needs network or `WIKISOURCE_DUMP` path) |
