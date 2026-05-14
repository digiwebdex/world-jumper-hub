# CMS + Password Reset Plan

This is a large scope (4 CMS surfaces + auth flows). I'll split into 3 phases so each ships working before moving on. You approve, I build Phase 1, you test, then I do Phase 2, etc.

## Foundation (built once, used by all phases)

1. **Enable Lovable Cloud** — database, auth, email.
2. **Auth tables**
   - `profiles` (id → auth.users, email, full_name)
   - `user_roles` + `app_role` enum (`admin`, `editor`) + `has_role()` security-definer function
   - Trigger to auto-create profile on signup
   - Seed your account as `admin` (you'll sign up first; I'll mark it admin)
3. **Auth pages**
   - `/login` — email + password, "Forgot password?" link
   - `/signup` — email + password (only used for first admin; can disable later)
   - `/forgot-password` — sends reset email via Lovable Email
   - `/reset-password` — handles `type=recovery`, sets new password
   - `/admin/*` routes protected by `_authenticated` layout + admin role check
4. **Email domain setup** — required for password reset emails. I'll prompt this when needed.

## Phase 1 — Visa Services CMS

Replaces hardcoded `src/lib/visa-services.ts` with DB-driven content.

- Table `visa_services`: slug, title, summary, description, highlights[], process[], faqs[], icon, order, published
- Public `/visa/services` and `/visa/services/:slug` read from DB (server fn + `supabaseAdmin`)
- Admin pages:
  - `/admin/visa-services` — list, reorder, publish toggle, delete
  - `/admin/visa-services/new` and `/admin/visa-services/:id/edit` — full form (rich text for description, dynamic arrays for highlights/process/FAQs)
- Migration seeds existing 6 services so nothing disappears

## Phase 2 — Page Sections CMS (Homepage + Medical/Tour/Education)

Structured editing — NOT a free-form drag-drop builder (that's Phase 3).

- Table `page_sections`: page_key (`home`/`medical`/`tour`/`education`), section_type (`hero`/`features`/`cta`/`text`/`image_text`), order, data (jsonb), published
- Each section_type has a typed editor form
- Public pages render sections from DB in order
- Admin: `/admin/pages` → pick page → reorder/add/edit/delete sections
- Seeds existing copy so the site looks unchanged after migration

## Phase 3 — Generic Page Builder (optional / after Phase 2 is solid)

Only if you still want it after using Phase 2. This is the biggest piece.

- Table `pages` (slug, title, meta) + `page_blocks` (page_id, type, order, data jsonb)
- Block library: hero, heading, rich text, image, gallery, columns, cards, CTA, FAQ, embed
- Admin builder UI: drag-drop reorder, inline edit, preview, publish/draft
- Dynamic public route `/$slug` renders any custom page
- Image uploads via Lovable Cloud Storage

I recommend stopping after Phase 2 unless you have a real need for arbitrary new pages — Phases 1+2 already let you edit ~all visible content.

## Technical notes

- All CMS reads on public pages go through `createServerFn` + `supabaseAdmin` with `published=true` filter (no RLS leakage, fast SSR).
- All CMS writes go through `createServerFn` + `requireSupabaseAuth` + `has_role(uid,'admin')` check.
- RLS: public tables readable by `anon` only where `published=true`; writes admin-only.
- Forms use `react-hook-form` + `zod`.
- Rich text: `@tiptap/react` (lightweight, good DX).
- Reordering: `@dnd-kit/sortable`.

## What I'll do right after you approve

1. Enable Lovable Cloud
2. Build the **Foundation** (auth + roles + login/forgot/reset pages + admin shell)
3. Build **Phase 1** (Visa Services CMS) end-to-end
4. Stop and ask you to test + create your admin account before moving to Phase 2

Approve to start, or tell me which phases to drop / reorder.
