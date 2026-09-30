-- =============================================================================
-- 04_products.sql  —  Products (a.k.a. "Parts" — the core inventory table)
--
-- Reconciled with the live DB (2026-09-07). RLS is ENABLED with FIVE policies
-- (matching the live "Policies" screen exactly):
--
--   NAME                                  COMMAND   APPLIED TO
--   Enable delete for authenticated users DELETE    authenticated
--   Enable insert for authenticated users INSERT    authenticated
--   Enable read access for authenticated  SELECT    authenticated
--   Enable update for authenticated users UPDATE    authenticated
--   public read                           SELECT    public   <-- anon can read
--
-- App access pattern:
--   * WRITES (addProduct / updateProduct / deleteProduct) go through the
--     service-role client (getSupabaseAdmin) which BYPASSES RLS. The
--     authenticated INSERT/UPDATE/DELETE policies below therefore only matter
--     if something ever writes with the anon/authenticated key directly.
--   * READS: the admin/member pages read via the authenticated server client
--     (fetchInventoryData / fetchProductById), and a browser (anon) client also
--     reads products — which is why the "public read" SELECT policy exists.
--
-- ⚠️ SECURITY NOTE: "public read" exposes EVERY product row to logged-out
--    (anon) callers holding the public anon key. See the hardening note at the
--    bottom before treating this as final. Kept here only to MATCH LIVE.
--
-- NB: `delete` in the app is a SOFT delete (sets is_deleted = true via the
--     service role). The hard-DELETE policy above is the live config, not the
--     path the app actually uses.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
--   Columns reconstructed from app usage (src/lib/inventory.ts,
--   src/actions/products.ts). `create table if not exists` is a no-op against
--   the live table; it documents the shape and lets a fresh project bootstrap.
-- -----------------------------------------------------------------------------
create table if not exists public.products (
    id              uuid        not null default gen_random_uuid(),
    name            text        not null,
    sku             text        null,
    category        text        null,
    shelf_code      text        null,
    box_code        text        null,
    quantity        integer     null default 0,
    initial_quantity integer    null default 0,
    min_stock_level integer     null default 0,
    mrp             numeric     null,            -- unit price; used in project spend analytics
    notes           text        null,
    image_url       text        null,
    data_sheet_url  text        null,
    vendors         jsonb       null default '[]'::jsonb,  -- [{ name, price, ... }] supplier links
    is_active       boolean     null default true,
    is_deleted      boolean     null default false,        -- soft-delete flag
    created_at      timestamptz null default now(),
    updated_at      timestamptz null default now(),
    constraint products_pkey primary key (id)
);

-- -----------------------------------------------------------------------------
-- Indexes
--   List is filtered by is_deleted + is_active, searched by name/sku/category
--   (ilike), and ordered by created_at desc.
-- -----------------------------------------------------------------------------
create index if not exists idx_products_created_at on public.products (created_at desc);
create index if not exists idx_products_is_deleted on public.products (is_deleted);
create index if not exists idx_products_is_active  on public.products (is_active);
create index if not exists idx_products_category   on public.products (category);
create index if not exists idx_products_sku        on public.products (sku);

-- Trigram indexes make the name/sku ilike '%q%' search fast (optional).
-- Requires the pg_trgm extension (safe to enable; Supabase ships it).
create extension if not exists pg_trgm;
create index if not exists idx_products_name_trgm on public.products using gin (name gin_trgm_ops);
create index if not exists idx_products_sku_trgm  on public.products using gin (sku  gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Row Level Security — EXACT MATCH to the live policy list
-- -----------------------------------------------------------------------------
alter table public.products enable row level security;

-- SELECT for signed-in users
drop policy if exists "Enable read access for authenticated users" on public.products;
create policy "Enable read access for authenticated users"
on public.products for select to authenticated using (true);

-- INSERT for signed-in users
drop policy if exists "Enable insert for authenticated users" on public.products;
create policy "Enable insert for authenticated users"
on public.products for insert to authenticated with check (true);

-- UPDATE for signed-in users
drop policy if exists "Enable update for authenticated users" on public.products;
create policy "Enable update for authenticated users"
on public.products for update to authenticated using (true) with check (true);

-- DELETE for signed-in users
drop policy if exists "Enable delete for authenticated users" on public.products;
create policy "Enable delete for authenticated users"
on public.products for delete to authenticated using (true);

-- SELECT for the public (anon) role — matches live "public read"
drop policy if exists "public read" on public.products;
create policy "public read"
on public.products for select to public using (true);

-- -----------------------------------------------------------------------------
-- OPTIONAL HARDENING (NOT applied — would change behavior; review first)
--
-- 1) Drop anon exposure. The browser anon client is the only reason "public
--    read" exists. If reads move to the authenticated server client (they
--    mostly already have), remove it so logged-out callers can't dump the
--    catalog:
--       drop policy if exists "public read" on public.products;
--
-- 2) Lock writes to the service role (matches the app's actual write path).
--    The app never writes products with the authenticated key — all mutations
--    go through getSupabaseAdmin (service role, bypasses RLS). So the
--    authenticated INSERT/UPDATE/DELETE policies can be dropped to stop a
--    member from mutating the catalog directly with the public anon key:
--       drop policy if exists "Enable insert for authenticated users" on public.products;
--       drop policy if exists "Enable update for authenticated users" on public.products;
--       drop policy if exists "Enable delete for authenticated users" on public.products;
--    (server actions keep working; they bypass RLS)
--
--    End state after 1+2: authenticated SELECT only, everything else via the
--    service role. Consistent with the profiles-table model in 01_profiles.sql.
-- -----------------------------------------------------------------------------
