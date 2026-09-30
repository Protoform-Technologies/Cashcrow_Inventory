-- =============================================================================
-- 03_projects.sql  —  Projects & per-part project allocations
--
-- Relational model (chosen over JSON) so project analytics are simple SQL:
--   * spend/qty per project        → sum(qty) group by project_id
--   * all parts used in a project  → join on project_id
--   * rename a project once        → propagates everywhere (no data rewrite)
--
-- A part bought in some quantity is split across projects, e.g. buy 10 →
-- Project A: 5, Project B: 3, Project C: 2. Each split is one row in
-- part_project_allocations.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- projects — first-class entities (unique by name; users can create on the fly)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
    id         uuid        not null default gen_random_uuid(),
    name       text        not null,
    created_at timestamptz null default now(),
    constraint projects_pkey primary key (id),
    constraint projects_name_key unique (name)
);

create index if not exists idx_projects_name on public.projects (name);

-- -----------------------------------------------------------------------------
-- part_project_allocations — how much of a part goes to each project
-- -----------------------------------------------------------------------------
create table if not exists public.part_project_allocations (
    id         uuid        not null default gen_random_uuid(),
    product_id uuid        not null,
    project_id uuid        not null,
    qty        integer     not null,
    created_at timestamptz null default now(),
    constraint part_project_allocations_pkey primary key (id),
    constraint part_project_allocations_qty_check check (qty > 0),
    constraint part_project_allocations_product_fkey
        foreign key (product_id) references public.products (id) on delete cascade,
    constraint part_project_allocations_project_fkey
        foreign key (project_id) references public.projects (id) on delete restrict,
    -- one allocation row per (part, project); update qty instead of duplicating
    constraint part_project_allocations_unique unique (product_id, project_id)
);

create index if not exists idx_ppa_project_id on public.part_project_allocations (project_id);
create index if not exists idx_ppa_product_id on public.part_project_allocations (product_id);

-- -----------------------------------------------------------------------------
-- Row Level Security
--   Same convention as suppliers: authenticated users have full access; app
--   writes go through the service-role client (which bypasses RLS) anyway.
-- -----------------------------------------------------------------------------
alter table public.projects enable row level security;
drop policy if exists "Allow all authenticated users" on public.projects;
create policy "Allow all authenticated users"
on public.projects for all to authenticated using (true) with check (true);

alter table public.part_project_allocations enable row level security;
drop policy if exists "Allow all authenticated users" on public.part_project_allocations;
create policy "Allow all authenticated users"
on public.part_project_allocations for all to authenticated using (true) with check (true);

-- -----------------------------------------------------------------------------
-- OPTIONAL HARDENING (not applied): reads for authenticated, writes via service
-- role only — replace each policy above with a select-only policy:
--   create policy "<table>_select_authenticated"
--       on public.<table> for select to authenticated using (true);
-- (server actions using the service-role client keep working, as they bypass RLS)
--
-- ANALYTICS EXAMPLES:
--   -- total qty allocated per project
--   select p.name, sum(a.qty) as total_qty
--   from part_project_allocations a
--   join projects p on p.id = a.project_id
--   group by p.name order by total_qty desc;
--
--   -- estimated spend per project (qty * product MRP)
--   select p.name, sum(a.qty * pr.mrp) as est_spend
--   from part_project_allocations a
--   join projects p  on p.id = a.project_id
--   join products pr on pr.id = a.product_id
--   group by p.name;
-- -----------------------------------------------------------------------------
