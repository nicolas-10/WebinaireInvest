# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # TypeScript check without building
```

Deployment: `npx vercel --prod --yes` (direct deploy, no GitHub integration required).

## Architecture

Next.js 14 App Router. Public landing page is a Server Component (`app/page.tsx`, `revalidate = 0`). Admin dashboard is a Client Component (`app/admin/page.tsx`). Interactive pieces are Client Components under `components/`.

### Supabase — two clients

`lib/supabase.ts` exports two clients:
- `supabase` — anon key, used only in `app/page.tsx` (Server Component) to fetch the active webinar
- `createAdminClient()` — service_role key, used in all API routes

**All API routes use `createAdminClient()`**, including the public subscribe route. RLS policies are in place on the DB side but the service_role bypasses them. This is intentional and safe because these routes run server-side only.

### Database types (`lib/types.ts`)

Supabase JS v2 requires a `Relationships` field on every table definition in the `Database` type, otherwise query return types resolve to `never`. The `subscribers` table has a FK relationship entry; `webinars` has `Relationships: []`.

Two tables:
- `webinars` — `id, title, date, zoom_link, is_active, created_at`
- `subscribers` — `id, first_name, last_name, email, phone, description, webinar_id, is_interested, created_at`

### Admin authentication (`lib/auth.ts`)

Cookie-based, no JWT library. HMAC-SHA256 of the literal string `'admin-authenticated-v1'` keyed with `ADMIN_PASSWORD`. The cookie value is deterministic — valid as long as the password doesn't change. Always call `.trim()` on `ADMIN_PASSWORD` (env var may have whitespace).

### Email (`lib/mailer.ts`, `lib/email-templates.ts`)

Email is sent via **nodemailer + Gmail** (not Resend). `lib/mailer.ts` creates a nodemailer transporter using `GMAIL_USER` and `GMAIL_APP_PASSWORD` env vars. Two HTML string templates in `lib/email-templates.ts`: `confirmationEmail` (sent on inscription) and `zoomLinkEmail` (blast sent manually from admin). The Zoom link blast iterates subscribers one by one in a `for` loop — there is no batch API.

### Date handling

Supabase stores dates without timezone info. `app/page.tsx` appends `Z` if no offset is detected before parsing, to force UTC interpretation. All date display uses `timeZone: 'Europe/Paris'` via `toLocaleString('fr-FR', ...)`.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
GMAIL_USER
GMAIL_APP_PASSWORD
```

## Key constraints

- `ADMIN_PASSWORD` env var may have leading/trailing spaces → always `.trim()` before use.
- Supabase update routes must type the update payload as the generated `Update` type (e.g., `WebinarUpdate`), not `Record<string, unknown>`, due to `RejectExcessProperties` in the Supabase generic.
- CSV export includes a UTF-8 BOM (`'﻿'`) for Excel compatibility.
- Only one webinar can be active at a time; activating one auto-deactivates all others (handled in `toggle-active` route).
- Duplicate subscriber inserts return Postgres error code `23505` → mapped to HTTP 409.
- Email errors on inscription are non-blocking: the subscriber is saved even if the confirmation email fails.
