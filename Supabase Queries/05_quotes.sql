-- =============================================================================
-- 05_quotes.sql  —  Quotes registry (service + product quotes for clients/suppliers)
--
-- Canonical, clean definition of the `quotes` table. An earlier ad-hoc version
-- of this table existed in the live project (never captured here). It held NO
-- data, so this file DROPS and recreates it to a single clean shape rather than
-- carrying its legacy duplicate columns (estimated_total / expected_delivery).
--
-- ⚠️ DESTRUCTIVE: the drop below removes the old table. Safe ONLY because it was
--    empty. Do not re-run against a table that has real rows.
--
-- Design (agreed): ONE table for both quote types, discriminated by `quote_type`.
--   * Registry columns (queried / sorted / filtered / displayed) are real
--     columns: name, quote_type, vertical, status, generated_by, created_at.
--   * Type-specific payload (service scope & deliverables vs product line items,
--     cost breakdown, recipient, terms — the RFQDetails shape) lives in the
--     `details` jsonb. This keeps the list fast and the variable parts flexible.
--
-- App access pattern:
--   * WRITES (createQuote / updateQuoteStatus) go through the service-role
--     client (getSupabaseAdmin) which BYPASSES RLS — see src/lib/quotes-db.ts.
--     So, per project convention, we add NO insert/update/delete policies.
--   * READS (dbGetQuotes / dbGetNextRequestId) use the authenticated server
--     client. Quotes is an ADMIN-ONLY feature (route under /admin, gated by the
--     admin layout + middleware), so SELECT is scoped to admins via is_admin().
-- =============================================================================

drop table if exists public.quotes cascade;

-- -----------------------------------------------------------------------------
-- Status enum (already exists in the live project; guarded so this file is
-- re-runnable and can bootstrap a fresh project). Values mirror QuoteStatus in
-- src/types/quote.ts.
-- -----------------------------------------------------------------------------
do $$
begin
    if not exists (select 1 from pg_type where typname = 'quote_status') then
        create type public.quote_status as enum ('Pending', 'Ordered', 'Approved', 'Denied');
    end if;
end$$;

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table public.quotes (
    id            uuid              not null default gen_random_uuid(),

    -- Registry columns (shown in / driven by the admin Quotes table)
    name          text              null,                       -- "Name of Quote"
    quote_type    text              not null default 'product', -- 'product' | 'service'
    vertical      text              not null default 'CC',      -- 'CC' (Cashcrow) | 'PF' (Protoform)
    status        public.quote_status not null default 'Pending',
    request_id    text              not null,                   -- serial trace, e.g. CC-2026-09-0001
    generated_by  uuid              null,                       -- author (profiles.id), stamped server-side

    -- Product-quote specifics (null for service quotes)
    product_id    uuid              null,
    supplier_id   uuid              null,
    quantity      integer           null,
    total_amount  numeric           null default 0,
    expected_date date              null,

    -- Flexible, type-specific payload (RFQDetails) + free-text notes
    details       jsonb             null default '{}'::jsonb,
    notes         text              null,

    created_at    timestamptz       not null default now(),
    updated_at    timestamptz       not null default now(),

    constraint quotes_pkey primary key (id),
    constraint quotes_request_id_key unique (request_id),

    -- FK constraint names are referenced explicitly by dbGetQuotes' select join
    -- syntax (profiles!quotes_generated_by_fkey, products!quotes_product_id_fkey).
    -- Keep these names in sync with src/lib/quotes-db.ts.
    constraint quotes_generated_by_fkey foreign key (generated_by)
        references public.profiles (id) on delete set null,
    constraint quotes_product_id_fkey foreign key (product_id)
        references public.products (id) on delete set null,
    constraint quotes_supplier_id_fkey foreign key (supplier_id)
        references public.suppliers (id) on delete set null,

    constraint quotes_quote_type_check check (quote_type in ('product', 'service')),
    constraint quotes_vertical_check   check (vertical in ('CC', 'PF'))
);

-- -----------------------------------------------------------------------------
-- Indexes
--   Registry lists newest-first, filters/joins by author, chip-filters status,
--   and searches by name (ilike '%q%'). details is GIN-indexed for jsonb lookups.
-- -----------------------------------------------------------------------------
create index if not exists idx_quotes_created_at   on public.quotes (created_at desc);
create index if not exists idx_quotes_generated_by on public.quotes (generated_by);
create index if not exists idx_quotes_status       on public.quotes (status);
create index if not exists idx_quotes_details      on public.quotes using gin (details);

-- Trigram index for fast name search. pg_trgm is already enabled by
-- 04_products.sql; guarded here so this file is runnable standalone.
create extension if not exists pg_trgm;
create index if not exists idx_quotes_name_trgm on public.quotes using gin (name gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Row Level Security
--   Admin-only read; writes via service role (no write policies) — matching the
--   profiles-table backstop model in 01_profiles.sql.
-- -----------------------------------------------------------------------------
alter table public.quotes enable row level security;

-- SELECT: admins only. is_admin() is SECURITY DEFINER (see 00_helpers.sql), so
-- its internal read of profiles is not re-filtered by RLS.
drop policy if exists "Admins can read quotes" on public.quotes;
create policy "Admins can read quotes"
on public.quotes for select to authenticated
using ( public.is_admin() );

-- No INSERT/UPDATE/DELETE policies: createQuote / updateQuoteStatus run through
-- the service-role client (getSupabaseAdmin), which bypasses RLS. This blocks
-- any direct write with the anon/authenticated key while server actions work.

-- -----------------------------------------------------------------------------
-- OPTIONAL (NOT applied — future data model, review first)
--
-- Recipient model: service/client quotes are "sent to the client", but there is
-- no clients table yet (only suppliers). When that lands (Phase 3), add a
-- recipient reference here — e.g. recipient_type text + recipient_id uuid, or a
-- dedicated `clients` table with quotes.client_id — rather than overloading
-- supplier_id. Left out deliberately until the clients model is designed.
-- -----------------------------------------------------------------------------
