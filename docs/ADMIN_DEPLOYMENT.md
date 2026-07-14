# Deployment Guide — 4B HUB Admin CMS + Employee Portal (`admin/`)

This is a Node.js app (Next.js) with a PostgreSQL database — a fundamentally different deployment than the static `website/` folder (see `docs/DEPLOYMENT.md` for that one). Do not try to deploy `admin/` as static files.

## 1. Prerequisites

- Node.js 18.18+ and npm
- A PostgreSQL 14+ database (managed — e.g. Neon, Supabase, RDS, Railway — or self-hosted)
- A place to run a persistent Node.js process: Vercel, Railway, Render, Fly.io, or your own VPS with a process manager (pm2/systemd)

## 2. Before you deploy

1. **This codebase has never been run against a real database.** It was built without network/database access — see `admin/README.md`'s "Running this locally" section. Do this first, locally, before deploying anywhere:
   ```bash
   cd admin
   npm install
   npx prisma validate
   npx prisma migrate dev
   SEED_ADMIN_PASSWORD="temporary-strong-password" npm run db:seed
   npm run build
   npm run dev
   ```
   Fix anything that surfaces here before touching production.
2. Generate a real `SESSION_SECRET`: `openssl rand -base64 32`.
3. Change the seeded admin password immediately after first login (no "change password" UI exists yet for admin Users — see `docs/PROJECT_STATUS.md` → Remaining TODO; for now, update it directly via `prisma studio` or a short one-off script using `hashPassword()` from `src/lib/auth/password.ts`).
4. Decide where uploaded media will actually live in production — `UPLOADS_DIR`/`UPLOADS_PUBLIC_PATH` in `.env` currently point at the sibling `/uploads/media` folder, which works for a single-server deploy but not for serverless platforms with an ephemeral filesystem (see §4).

## 3. Database

1. Provision a Postgres database. Copy its connection string into `DATABASE_URL` in `.env`.
2. Run migrations against it:
   ```bash
   npx prisma migrate deploy
   ```
   (`migrate deploy`, not `migrate dev`, for anything beyond your own machine — it doesn't try to create new migrations, only applies existing ones.)
3. Seed it once: `SEED_ADMIN_PASSWORD="..." npm run db:seed`.
4. Take a backup before every future `prisma migrate deploy` in production — standard practice, doubly so here since the migrations in this repo were hand-authored rather than Prisma-generated against a live database (see each `migration.sql` header comment).

## 4. Hosting options

**Option A — Vercel + a managed Postgres (Neon/Supabase)**
Simplest path for a Next.js app. Set the environment variables in the Vercel dashboard. **Caveat:** Vercel's filesystem is ephemeral/read-only at runtime — the Media Library's file registry (`database/media.json`, `uploads/media/`) approach assumes a persistent filesystem. On Vercel, actual new file uploads need cloud object storage (S3-compatible) instead of writing into `/uploads/media` — this is real V1.1 work, not yet built (see PROJECT_STATUS.md).

**Option B — Railway / Render**
Both offer a Postgres add-on plus a persistent container for the Next.js app, which matches this app's current assumption of a writable local `uploads/` folder better than Vercel does. Point `UPLOADS_DIR` at a persistent volume if the platform offers one.

**Option C — Your own VPS**
```bash
cd admin
npm ci
npm run build
npx prisma migrate deploy
pm2 start npm --name "4b-hub-admin" -- start
```
Put Nginx in front for TLS termination and to proxy to the Next.js process (default port 3000).

## 5. Environment variables checklist

See `admin/.env.example` for the full list. At minimum for production:
- `DATABASE_URL` — real Postgres connection string
- `SESSION_SECRET` — real random value, not the placeholder
- `SESSION_MAX_AGE_DAYS` — review the default (7) against your actual security requirements
- `NODE_ENV=production`
- `UPLOADS_DIR` / `UPLOADS_PUBLIC_PATH` — confirm these make sense for your chosen host (see §4 caveat)

## 6. After going live

1. Log in as `admin`, confirm the dashboard loads and shows real zeros (no fake data) for every widget.
2. Change the admin password.
3. Confirm `public/robots.txt` (`Disallow: /`) is being served — this app must never appear in search results.
4. Set up real monitoring/alerting for the Node process (it's the only thing standing between "site is up" and "site is down" now, unlike the static website).
5. Decide on a backup schedule for the Postgres database — this now holds real business data (employees, attendance, quote requests) that the static website never did.

## 7. What's NOT ready for production traffic yet

Per `docs/PROJECT_STATUS.md`: most CMS modules (Employees, Sites, Services CMS, etc.) are stub pages, not working CRUD yet. Don't point real end-users (guards checking in, admins managing content) at this deployment until the modules they need are actually built — deploying now is appropriate for internal review/staging, not for the security guards' daily attendance yet.
