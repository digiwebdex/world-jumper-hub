# Plan: Convert World Jumper Hub to VPS Full‑Stack (Express + PostgreSQL + React SPA)

This is a hard cutover. The Lovable preview will stop showing real data after this change — it will only render the UI shell. All real testing happens on the VPS (or locally with `npm run dev:server` + Postgres).

---

## 1. Repository layout (new)

```
/                        repo root
├── server/              Express + Postgres backend (Node, runs on VPS port 3001)
│   ├── src/
│   │   ├── index.ts                # express bootstrap
│   │   ├── db.ts                   # pg Pool
│   │   ├── auth.ts                 # bcrypt + JWT + cookie middleware
│   │   ├── upload.ts               # multer config -> public/uploads
│   │   ├── routes/
│   │   │   ├── auth.ts             # /api/auth/login, logout, me
│   │   │   ├── site-settings.ts
│   │   │   ├── visa-countries.ts
│   │   │   ├── visa-requirements.ts
│   │   │   ├── packages.ts
│   │   │   ├── inquiries.ts
│   │   │   └── uploads.ts          # POST /api/admin/uploads (multipart)
│   │   ├── middleware/requireAdmin.ts
│   │   └── validation/             # zod schemas per resource
│   ├── migrations/
│   │   ├── 001_init.sql            # all 7 tables + indexes
│   │   └── 002_seed_settings.sql
│   ├── scripts/
│   │   ├── migrate.ts              # runs *.sql in order
│   │   └── seed-admin.ts           # creates info@worldjumperbd.com w/ bcrypt hash of Admin@54321#
│   ├── package.json                # express, pg, bcrypt, jsonwebtoken, multer, zod, cookie-parser, cors, helmet, express-rate-limit, dotenv, tsx
│   └── tsconfig.json
├── src/                 React SPA (Vite, builds to dist/)
├── public/uploads/      gitignored, served by Nginx in prod
├── deploy/
│   ├── nginx.conf.example
│   ├── ecosystem.config.cjs        # PM2
│   └── DEPLOY.md                   # full Ubuntu deploy guide
├── .env.example
├── package.json         frontend (vite, react, react-router-dom)
└── vite.config.ts       plain React + Vite (no tanstack, no cloudflare)
```

---

## 2. Database schema (`server/migrations/001_init.sql`)

PostgreSQL. Tables:
1. `admin_users` — id (uuid pk), email (unique citext), password_hash, is_active, created_at
2. `site_settings` — singleton row keyed by id=1, JSON `data` column (logo_url, contact info, banners, etc.)
3. `visa_countries` — id, country_name, slug (unique), flag_url, short_description, is_featured, is_active
4. `visa_requirements` — id, country_id (fk → visa_countries on delete cascade), visa_type, all the document text columns currently in Supabase, is_active
5. `packages` — id, title, slug (unique), package_type (enum: Tour/Umrah/Medical Tourism/Air Ticket Offer), destination, duration, price, descriptions, image_url, gallery_urls, brochure_url, is_featured, is_active
6. `inquiries` — id, name, email, phone, service_type, message, status (enum), created_at, updated_at
7. `uploaded_files` — id, original_name, stored_path, public_url, mime_type, size_bytes, uploaded_by (fk admin_users), created_at

Indexes on slugs, `is_active`, `is_featured`, `inquiries.status`, `inquiries.created_at desc`.

Migrations run via `node --import tsx server/scripts/migrate.ts` against `DATABASE_URL`.

---

## 3. Backend (Express)

- **Auth**: `POST /api/auth/login` → bcrypt compare → sign JWT (HS256, 7d) → set as `httpOnly`, `secure`, `sameSite=lax` cookie `wj_session`. `POST /api/auth/logout` clears it. `GET /api/auth/me` returns the admin or 401.
- **Middleware `requireAdmin`** verifies cookie, loads admin from DB, attaches `req.admin`.
- **Public APIs** (no auth): `GET /api/site-settings`, `GET /api/visa-countries[?featured=1]`, `GET /api/visa-countries/:slug`, `GET /api/visa-requirements?country_id=…`, `GET /api/packages[?type=&featured=]`, `GET /api/packages/:slug`, `POST /api/inquiries` (rate-limited 5/min/IP, zod-validated).
- **Admin APIs** (requireAdmin): full CRUD for visa-countries, visa-requirements, packages, site-settings; `GET/PATCH/DELETE /api/admin/inquiries`; `POST /api/admin/uploads` (multer, 10 MB cap, mime allowlist jpg/jpeg/png/webp/pdf, stores under `public/uploads/<category>/<uuid>.<ext>`, returns `{ url: 'https://worldjumperbd.com/uploads/...' }`).
- **Hardening**: helmet, cors restricted to `APP_URL`, express-rate-limit on `/api/auth/login` (5/min) and `/api/inquiries`, cookie-parser, JSON 1 MB body limit.

---

## 4. Frontend rewrite

- Uninstall `@tanstack/react-start`, `@tanstack/react-router`, `@lovable.dev/vite-tanstack-config`, `@cloudflare/vite-plugin`, `@supabase/supabase-js`, `wrangler`.
- Install `react-router-dom`, `@vitejs/plugin-react`, plain `tailwindcss` v4 setup is already there.
- New `vite.config.ts`: `@vitejs/plugin-react`, `@` alias, dev proxy `/api` and `/uploads` → `http://localhost:3001`.
- New `src/main.tsx` mounts `<BrowserRouter>` with `<Routes>` mirroring current pages:
  - Public: `/`, `/about`, `/services`, `/visa`, `/tours`, `/umrah`, `/medical-tourism`, `/air-ticketing`, `/contact`, `/faq`
  - Admin: `/admin/login`, and protected `/admin`, `/admin/visa-countries`, `/admin/visa-requirements`, `/admin/packages`, `/admin/inquiries`, `/admin/settings`
- Replace every Supabase call with a thin `src/lib/api.ts` (fetch with `credentials: 'include'`).
- Replace `useAdminAuth` with a hook that calls `GET /api/auth/me` and exposes `login/logout`.
- Convert each route file from `createFileRoute(...)` to a normal exported component; replace `<Link to="/x" />` (TanStack) with `react-router-dom`'s `<Link>` / `<NavLink>`.
- Delete: `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `wrangler.jsonc`, `public/.htaccess`, `supabase-migration.sql`, `src/lib/supabase.ts`.
- Update `SafeImage` to just pass through full URLs (no Hostinger rewrite logic).
- `SITE.logoUrl` → `https://worldjumperbd.com/uploads/logo/world-jumper-logo.jpeg`. Same base for all sample URLs in admin placeholders and seed data.

---

## 5. Environment (`.env.example`)

```
DATABASE_URL=postgres://wjuser:wjpass@localhost:5432/worldjumper
JWT_SECRET=change-me-to-a-long-random-string
SESSION_COOKIE_NAME=wj_session
NODE_ENV=production
PORT=3001
APP_URL=https://worldjumperbd.com
UPLOAD_DIR=./public/uploads
PUBLIC_UPLOAD_BASE=https://worldjumperbd.com/uploads
ADMIN_EMAIL=info@worldjumperbd.com
ADMIN_PASSWORD=Admin@54321#   # only read by seed-admin script, then can be removed
```

---

## 6. Deployment (`deploy/DEPLOY.md`)

Step-by-step bash for fresh Ubuntu 22.04:
1. `apt install` Node 20 LTS (NodeSource), PostgreSQL 16, nginx, certbot, build-essential
2. Create DB + user (`createuser`, `createdb`, `ALTER USER … WITH PASSWORD …`)
3. `git clone https://github.com/digiwebdex/world-jumper-hub.git /var/www/worldjumper && cd /var/www/worldjumper`
4. `cp .env.example .env` → edit secrets
5. `npm ci && (cd server && npm ci)`
6. `cd server && npm run migrate && npm run seed:admin`
7. `cd .. && npm run build` (Vite → `dist/`)
8. `mkdir -p public/uploads/{logo,banners,packages,visa-countries,umrah,medical-tourism,documents}`
9. PM2: `pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup`
10. Nginx site at `/etc/nginx/sites-available/worldjumperbd.com` (template provided), `ln -s` to `sites-enabled`, `nginx -t && systemctl reload nginx`
11. `certbot --nginx -d worldjumperbd.com -d www.worldjumperbd.com`
12. Cloudflare DNS A: `worldjumperbd.com` and `www` → `187.77.144.38` (proxy off until cert issued, then optional on)
13. Smoke test: `curl https://worldjumperbd.com/api/site-settings`, log in at `/admin/login`

Nginx config highlights: server_name both apex+www, `client_max_body_size 15M`, `location /uploads/ { alias /var/www/worldjumper/public/uploads/; expires 30d; }`, `location /api/ { proxy_pass http://127.0.0.1:3001; }`, `location / { root /var/www/worldjumper/dist; try_files $uri /index.html; }`.

PM2 ecosystem runs only the API process (`server/dist/index.js` after `tsc`, or `tsx server/src/index.ts`); Nginx serves the SPA + uploads directly.

---

## 7. Order of operations in this build session

1. Scaffold `server/` (package.json, tsconfig, db, auth, all routes, migrations, seed script).
2. Add `.env.example`, `deploy/nginx.conf.example`, `deploy/ecosystem.config.cjs`, `deploy/DEPLOY.md`.
3. Strip TanStack Start / Cloudflare / Supabase from root `package.json`, install React Router DOM + `@vitejs/plugin-react`.
4. New plain `vite.config.ts` + `index.html` + `src/main.tsx` + `src/App.tsx` (router).
5. Convert each page from `createFileRoute` to a plain component using React Router DOM.
6. New `src/lib/api.ts`, new `useAdminAuth`, rewrite all admin pages to use fetch.
7. Delete obsolete files (router/server/wrangler/supabase/.htaccess/routeTree.gen).
8. Verify: typecheck only — runtime preview will show empty data because the API isn't running in the sandbox. That's expected and acceptable per your choice.

---

## What will be broken in the Lovable preview after this PR

- Admin login won't work in preview (no Postgres in the sandbox).
- All public pages will render but show empty lists.
- This is by design — the app is now VPS-only. You'll test on `https://worldjumperbd.com` after deploy.

Approve and I'll execute steps 1–8 in order. Reply "go" (or with adjustments).
