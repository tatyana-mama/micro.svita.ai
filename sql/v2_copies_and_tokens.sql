-- ============================================================================
-- micro.svita.ai v2: scarcity pricing, copy limits, tokenized brandbook access,
-- exclusive bundle, admin inline-edit.
-- Idempotent: safe to re-run.
-- ============================================================================

-- 1. Scarcity + copy limit on concepts_catalog
alter table concepts_catalog
  add column if not exists max_copies int not null default 5,
  add column if not exists copies_sold int not null default 0,
  add column if not exists base_price_eur numeric(10,2) not null default 49.00,
  add column if not exists archived boolean not null default false;

create index if not exists idx_concepts_archived on concepts_catalog(archived);

-- 2. Trigger: bump copies_sold on paid purchase; archive when sold out
create or replace function sync_copies_sold() returns trigger as $$
declare new_count int;
declare cap int;
begin
  if NEW.status = 'paid' and (TG_OP = 'INSERT' or OLD.status is distinct from 'paid') then
    update concepts_catalog
      set copies_sold = copies_sold + 1
      where slug = NEW.concept_slug
      returning copies_sold, max_copies into new_count, cap;
    if new_count >= cap then
      update concepts_catalog set archived = true where slug = NEW.concept_slug;
    end if;
  end if;
  return NEW;
end; $$ language plpgsql security definer;

drop trigger if exists trg_sync_copies on purchases;
create trigger trg_sync_copies
  after insert or update of status on purchases
  for each row execute function sync_copies_sold();

-- 3. Access tokens for brandbook URLs (one token per owner per concept, auto-rotated)
create table if not exists concept_access_tokens (
  token uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_slug text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  unique(user_id, concept_slug)
);

alter table concept_access_tokens enable row level security;

drop policy if exists "owner_reads_own_token" on concept_access_tokens;
create policy "owner_reads_own_token"
  on concept_access_tokens for select
  using (user_id = auth.uid());

-- 4. Scarcity pricing: last copy costs base×3, first costs base×1
create or replace function concept_current_price(p_slug text) returns numeric as $$
declare r record; factor numeric;
begin
  select * into r from concepts_catalog where slug = p_slug;
  if not found or r.archived then return null; end if;
  factor := 1 + (r.copies_sold::numeric / greatest(r.max_copies - 1, 1)) * 2;
  return round(r.base_price_eur * factor, 2);
end; $$ language plpgsql stable;

-- 5. Exclusive bundle: entire catalog in one purchase, only if 0 copies sold anywhere
create or replace function can_buy_exclusive() returns boolean as $$
begin
  return not exists (select 1 from concepts_catalog where copies_sold > 0);
end; $$ language plpgsql stable;

create or replace function exclusive_bundle_price() returns numeric as $$
begin
  -- 50% discount off sum(base) when locked in as exclusive buyer
  return (select round(sum(base_price_eur) * 0.5, 2) from concepts_catalog where not archived);
end; $$ language plpgsql stable;

-- 6. Issue/fetch brandbook token (buyer must own concept)
create or replace function my_brandbook_token(p_slug text) returns uuid as $$
declare tok uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if not exists (
    select 1 from purchases
      where user_id = auth.uid()
        and concept_slug = p_slug
        and status = 'paid'
  ) then raise exception 'Access denied: no paid purchase'; end if;

  insert into concept_access_tokens(user_id, concept_slug)
    values (auth.uid(), p_slug)
    on conflict (user_id, concept_slug) do update
      set last_used_at = now()
    returning token into tok;
  return tok;
end; $$ language plpgsql security definer;

-- 7. Read brandbook by token (public-callable, token-gated)
create or replace function get_brandbook_by_token(p_token uuid) returns text as $$
declare row_slug text;
begin
  select concept_slug into row_slug from concept_access_tokens where token = p_token;
  if not found then raise exception 'Invalid or revoked token'; end if;
  update concept_access_tokens set last_used_at = now() where token = p_token;
  return (select html_content from concept_brandbooks where concept_slug = row_slug);
end; $$ language plpgsql security definer;

-- 8. Admin inline edit: write i18n patch + catalog patch atomically
create or replace function admin_patch_concept(
  p_slug text,
  p_lang text default null,
  p_i18n jsonb default null,
  p_catalog jsonb default null
) returns void as $$
declare is_admin boolean;
begin
  select (role in ('admin','superadmin')) into is_admin
    from profiles where user_id = auth.uid();
  if not coalesce(is_admin, false) then
    raise exception 'Admin role required';
  end if;

  if p_i18n is not null and p_lang is not null then
    insert into concepts_i18n(concept_slug, lang, data)
      values (p_slug, p_lang, p_i18n)
      on conflict (concept_slug, lang) do update
        set data = excluded.data, updated_at = now();
  end if;

  if p_catalog is not null then
    update concepts_catalog
      set
        name = coalesce(p_catalog->>'name', name),
        category = coalesce(p_catalog->>'category', category),
        base_price_eur = coalesce((p_catalog->>'base_price_eur')::numeric, base_price_eur),
        max_copies = coalesce((p_catalog->>'max_copies')::int, max_copies),
        ls_url = coalesce(p_catalog->>'ls_url', ls_url)
      where slug = p_slug;
  end if;
end; $$ language plpgsql security definer;

-- 9. Public view for shop: exposes scarcity info without leaking prices table
create or replace view public_concepts_scarcity as
select
  slug,
  max_copies,
  copies_sold,
  greatest(max_copies - copies_sold, 0) as copies_left,
  archived,
  concept_current_price(slug) as current_price_eur
from concepts_catalog;

grant select on public_concepts_scarcity to anon, authenticated;
grant execute on function concept_current_price(text) to anon, authenticated;
grant execute on function can_buy_exclusive() to anon, authenticated;
grant execute on function exclusive_bundle_price() to anon, authenticated;
grant execute on function my_brandbook_token(text) to authenticated;
grant execute on function get_brandbook_by_token(uuid) to anon, authenticated;
grant execute on function admin_patch_concept(text,text,jsonb,jsonb) to authenticated;
