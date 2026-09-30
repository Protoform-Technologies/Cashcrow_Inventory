-- =============================================================================
-- 01_profiles.sql  —  User profiles & roles (authentication concern)
--
-- Source of truth for a user's role. One row per auth.users row (1:1, shared PK).
-- Access pattern in the app:
--   * All WRITES go through the service-role client (bypasses RLS).
--   * READS: middleware reads the user's OWN row (server anon = authenticated);
--     admin dashboards read other users' rows via the service-role client.
-- So RLS only needs a SELECT policy: own row, or any row if you're an admin.
-- Writes are intentionally left with NO policy → blocked for anon/authenticated,
-- allowed only for the service role. A member therefore cannot change their own
-- role (or anyone else's) by calling Supabase directly with the anon key.
-- =============================================================================

-- Role enum (already exists in the project; guarded so this file is re-runnable).
do $$
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type public.user_role as enum ('ADMIN', 'MEMBER');
    end if;
end$$;

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
    id           uuid        not null,
    first_name   text        null,
    last_name    text        null,
    email        text        not null,
    role         public.user_role null default 'MEMBER'::user_role,
    created_at   timestamptz not null default timezone('utc'::text, now()),
    is_active    boolean     null default true,
    avatar_url   text        null,
    phone_number text        null,
    constraint profiles_pkey primary key (id),
    constraint profiles_email_key unique (email),
    constraint profiles_id_fkey foreign key (id)
        references auth.users (id) on delete cascade
);

-- -----------------------------------------------------------------------------
-- Indexes
--   PK (id) covers lookups by user id; the unique email constraint covers
--   lookups/joins by email. `role` is added because middleware & is_admin()
--   filter on it and admin screens list by role.
-- -----------------------------------------------------------------------------
create index if not exists idx_profiles_role on public.profiles (role);

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- Reconciled with the live DB (2026-09-05). The project already had two policies
-- whose names we KEEP so this file edits them in place rather than adding a
-- parallel set:
--   * "Users can view own profile"     (SELECT)
--   * "Admins can manage all profiles" (ALL)
--
-- Two repairs vs. what was live:
--   1. The old "Admins can manage all profiles" policy had a USING clause that
--      did `SELECT ... FROM profiles` — a policy on profiles querying profiles,
--      which causes Postgres error 42P17 "infinite recursion detected in policy
--      for relation profiles" whenever RLS is actually evaluated (i.e. any
--      non-service-role access, such as the middleware role fallback). We replace
--      that inline subquery with public.is_admin() (SECURITY DEFINER, bypasses
--      RLS → no recursion). See 00_helpers.sql.
--   2. Both policies applied to the `public` role (which includes logged-out
--      `anon`). We scope them to `authenticated`. Not exploitable before (the
--      expressions check auth.uid()), but cleaner and correct.
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- SELECT: a user can read their own profile row.
-- (Admins get read access via the "manage all" policy below, OR-combined.)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ( auth.uid() = id );

-- ALL: admins may read/insert/update/delete any profile.
-- Non-recursive: is_admin() is SECURITY DEFINER so its internal read of
-- profiles is not re-filtered by these policies.
drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
on public.profiles
for all
to authenticated
using ( public.is_admin() )
with check ( public.is_admin() );

-- Notes:
--   * Non-admin users have NO write policy → they cannot INSERT/UPDATE/DELETE
--     any profile directly (so a member cannot change their own role via the
--     anon key). The app performs member profile edits through service-role
--     server actions, which bypass RLS.
--   * If you later want members to self-edit safe fields (name/phone/avatar)
--     directly from the browser, add a scoped UPDATE policy:
--         for update to authenticated
--         using ( auth.uid() = id )
--         with check ( auth.uid() = id AND role = (select role from ...) )
--     and be sure it FORBIDS changing `role` and `is_active`.
