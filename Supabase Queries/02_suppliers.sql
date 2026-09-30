-- =============================================================================
-- 02_suppliers.sql  —  Suppliers (inventory source partners)
--
-- Reconciled with the live DB (2026-09-07). RLS is enabled with a single
-- permissive policy: "Allow all authenticated users" (ALL, to `authenticated`).
--
-- App access pattern:
--   * WRITES (add/update/delete) go through the service-role client
--     (getSupabaseAdmin) which bypasses RLS.
--   * READS (getSuppliers / getSupplierById / getSupplierProducts) use the
--     authenticated server client, so they need a SELECT policy.
-- The current policy grants authenticated users full access; see the hardening
-- note at the bottom if you want to lock writes to the service role only.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.suppliers (
    id            uuid        not null default gen_random_uuid(),
    company_name  text        not null,
    website       text        null,
    contact_name  text        null,
    email         text        null,
    phone         text        null,
    lead_time     integer     null default 7,
    payment_terms text        not null,
    category      text        not null,
    created_at    timestamptz null default current_timestamp,
    updated_at    timestamptz null default current_timestamp,
    gst_no        text        null,
    bank_account  text        null,
    ifsc          text        null,
    branch        text        null,
    payment_id    text        null,
    constraint suppliers_pkey primary key (id)
);

-- -----------------------------------------------------------------------------
-- Indexes (list is sorted/filtered by company name, category, and recency)
-- -----------------------------------------------------------------------------
create index if not exists idx_suppliers_company_name on public.suppliers (company_name);
create index if not exists idx_suppliers_category     on public.suppliers (category);
create index if not exists idx_suppliers_created_at   on public.suppliers (created_at desc);

-- -----------------------------------------------------------------------------
-- Row Level Security (matches the live "Allow all authenticated users" policy)
-- -----------------------------------------------------------------------------
alter table public.suppliers enable row level security;

drop policy if exists "Allow all authenticated users" on public.suppliers;
create policy "Allow all authenticated users"
on public.suppliers
for all
to authenticated
using (true)
with check (true);

-- -----------------------------------------------------------------------------
-- OPTIONAL HARDENING (not applied — matches the app's service-role write model)
-- If you want reads for everyone signed in but writes only via the service role
-- (consistent with the profiles table), replace the policy above with:
--
--   drop policy if exists "Allow all authenticated users" on public.suppliers;
--   create policy "suppliers_select_authenticated"
--       on public.suppliers for select to authenticated using (true);
--   -- no INSERT/UPDATE/DELETE policy → those are blocked for anon/authenticated;
--   -- the service-role client (server actions) bypasses RLS and keeps working.
-- -----------------------------------------------------------------------------
