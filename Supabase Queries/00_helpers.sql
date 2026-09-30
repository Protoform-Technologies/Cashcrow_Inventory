-- =============================================================================
-- 00_helpers.sql  —  Shared functions used by RLS policies across tables
-- Run this BEFORE the table files.
-- =============================================================================

-- is_admin(): true when the current authenticated user is an ADMIN.
--
-- Reads the source-of-truth role from public.profiles (NOT the app_metadata JWT
-- cache, which can be stale until the user's token refreshes).
--
-- SECURITY DEFINER runs the function as its owner, which bypasses RLS. This is
-- what lets policies ON profiles call is_admin() without infinite recursion:
-- the inner SELECT below is not re-filtered by the profiles policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'ADMIN'
    );
$$;

-- Callable by logged-in users (and anon, harmlessly returns false).
grant execute on function public.is_admin() to authenticated, anon;
