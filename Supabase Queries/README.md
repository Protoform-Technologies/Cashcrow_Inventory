# Supabase Queries — Cashcrow Inventory DB Setup

Canonical, version-controlled SQL for the Cashcrow Inventory database: table
definitions, indexes, and Row Level Security (RLS) policies. This is the source
of truth for the schema — the live Supabase project should match what's here.

## How to run

Paste a file's contents into the Supabase **SQL Editor** (Dashboard → SQL Editor)
and run it, or apply via the Supabase CLI. Files are numbered and meant to be run
**in order** (later tables reference earlier ones via foreign keys).

Each file is written to be **idempotent** where practical (`if not exists`,
`create or replace`, `drop policy if exists` before `create policy`) so it can be
re-run safely.

## Conventions

- **One concern per file**, numbered by dependency order (`01_`, `02_`, …).
- **Writes go through the service-role client** (`getSupabaseAdmin()` in the app),
  which **bypasses RLS by design**. So for most tables we do **not** add
  `INSERT/UPDATE/DELETE` policies — that deliberately blocks any direct
  anon/authenticated write while server actions (service role) keep working.
  This is the DB-level backstop against a member calling a mutation directly
  with the public anon key.
- **Reads** are governed by RLS: policies target the `authenticated` role and are
  scoped as tightly as the app actually needs. `anon` (logged-out) gets nothing
  unless a table is explicitly public.
- **Role checks** use the `public.is_admin()` helper (below), which reads the
  source-of-truth `profiles.role` via a `SECURITY DEFINER` function — never the
  (cacheable, potentially stale) `app_metadata.role` JWT claim.

## Shared helpers

`00_helpers.sql` defines `public.is_admin()` used by policies across tables.
Run it before the table files.

## Table status / roadmap

Built incrementally, page-by-page. Current progress:

| # | Table            | Status        | Notes |
|---|------------------|---------------|-------|
| 00 | (helpers)       | ✅ done       | `is_admin()` |
| 01 | `profiles`      | ✅ done       | Auth / roles. Source of truth for role. |
| 02 | `suppliers`     | ✅ done       | RLS = "Allow all authenticated users" (matches live). Hardening note inside. |
| 03 | `projects` + `part_project_allocations` | ✅ done | Relational project allocations for analytics. |
| 04 | `products`      | ✅ done       | Parts. Matches live (4 authenticated + `public read`). ⚠️ anon-read exposure — see hardening note inside. |
| 05 | `quotes`        | ✅ done       | Quotes registry (service + product). Clean drop+recreate of the empty ad-hoc table: registry columns (name, quote_type, vertical, generated_by, status) + `details` jsonb for type-specific payload. Admin-only SELECT; writes via service role. ⚠️ DESTRUCTIVE drop — safe only because the old table was empty. |
| —  | `users`         | ⚠️ deprecate  | Legacy, only read once, never written. Retire after confirming nothing depends on it. |
| —  | `day_logs`      | ⏳ todo        | |
| —  | `day_log_items` | ⏳ todo        | Has `prevent_edit_after_submit` trigger. |
| —  | `stock_transactions` | ⏳ todo   | Currently unreferenced in app code. |
| —  | `notifications` | ⏳ todo        | Role/user-targeted rows. |
| —  | `logs`          | ⏳ todo        | Read by browser anon client. Purpose unclear — may be legacy. |

## Known data-model issues to resolve (tracked as we go)

1. **Duplicate user tables** — `profiles` (used for auth) vs `users` (legacy).
   Standardizing on `profiles`; `users` to be retired.
2. **Role stored in two places** — `profiles.role` (truth) and `app_metadata.role`
   (cache written on login for speed). RLS uses the truth; app keeps the cache.
3. **`logs` vs `stock_transactions` vs `day_log_items`** — three overlapping
   movement/history tables. To be reconciled in the inventory slice.
