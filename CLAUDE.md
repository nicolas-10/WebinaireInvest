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
- `supabase` — anon key, safe for client-side (not currently used client-side due to RLS)
- `createAdminClient()` — service_role key, server-only

**All API routes use `createAdminClient()`**, including the public subscribe route. RLS policies are in place on the DB side but the service_role bypasses them. This is intentional and safe because these routes run server-side only.

### Database types (`lib/types.ts`)

Supabase JS v2 requires a `Relationships` field on every table definition in the `Database` type, otherwise query return types resolve to `never`. The `subscribers` table has a FK relationship entry; `webinars` has `Relationships: []`.

### Admin authentication (`lib/auth.ts`)

Cookie-based, no JWT library. HMAC-SHA256 of the literal string `'admin-authenticated-v1'` keyed with `ADMIN_PASSWORD`. The cookie value is deterministic — valid as long as the password doesn't change. Always call `.trim()` on `ADMIN_PASSWORD` (env var may have whitespace).

### Email (`lib/email-templates.ts`, `lib/resend.ts`)

Plain HTML string functions — no react-email. Two templates: `confirmationEmail` (sent on inscription) and `zoomLinkEmail` (blast sent manually from admin). Zoom link blast uses `resend.batch.send()` in batches of 100.

## Key constraints

- `ADMIN_PASSWORD` and `RESEND_FROM_EMAIL` env vars may have leading/trailing spaces → always `.trim()` before use.
- Supabase update routes must type the update payload as the generated `Update` type (e.g., `WebinarUpdate`), not `Record<string, unknown>`, due to `RejectExcessProperties` in the Supabase generic.
- CSV export includes a UTF-8 BOM (`'﻿'`) for Excel compatibility.
- Only one webinar can be active at a time; activating one auto-deactivates all others (handled in `toggle-active` route).
- Duplicate subscriber inserts return Postgres error code `23505` → mapped to HTTP 409.
