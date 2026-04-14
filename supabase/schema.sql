-- ============================================================
-- SVITA Micro — schema v2
-- Run in Supabase SQL editor once.
-- ============================================================

-- ========== TABLE: profiles (role system) ==========
create table if not exists public.profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  email         text,
  display_name  text,
  role          text not null default 'user' check (role in ('user','creator','admin','superadmin')),
  created_at    timestamptz default now()
);

-- migration: widen role constraint if table pre-existed
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('user','creator','admin','superadmin'));
alter table public.profiles add column if not exists display_name text;

-- auto-insert profile row on user creation
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Helper: is current user admin or superadmin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('admin','superadmin')
  );
$$;

-- Helper: is current user superadmin?
create or replace function public.is_superadmin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'superadmin'
  );
$$;

-- Helper: is current user creator or higher?
create or replace function public.is_creator_or_up()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('creator','admin','superadmin')
  );
$$;

-- ========== PROFILES RLS: superadmin can read/update everyone ==========
drop policy if exists "profiles superadmin read all" on public.profiles;
create policy "profiles superadmin read all"
  on public.profiles for select
  using (public.is_superadmin());

drop policy if exists "profiles admin read all" on public.profiles;
create policy "profiles admin read all"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "profiles superadmin update all" on public.profiles;
create policy "profiles superadmin update all"
  on public.profiles for update
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- ========== TABLE: concepts_catalog ==========
create table if not exists public.concepts_catalog (
  slug          text primary key,
  name          text not null,
  category      text not null,
  country       text not null,
  size_m2       int,
  price_eur     int not null,
  budget_eur    int not null,
  weeks         int,
  hero_image    text not null,
  tagline       text,
  is_active     boolean default true,
  verified      boolean default false,
  verified_at   timestamptz,
  verified_by   uuid references auth.users(id),
  created_at    timestamptz default now()
);

-- migrate: add columns if table already existed
alter table public.concepts_catalog add column if not exists verified boolean default false;
alter table public.concepts_catalog add column if not exists verified_at timestamptz;
alter table public.concepts_catalog add column if not exists verified_by uuid references auth.users(id);
alter table public.concepts_catalog add column if not exists created_by uuid references auth.users(id);

alter table public.concepts_catalog enable row level security;

drop policy if exists "concepts_catalog read all" on public.concepts_catalog;
drop policy if exists "concepts_catalog public read verified" on public.concepts_catalog;
create policy "concepts_catalog public read verified"
  on public.concepts_catalog for select
  using (is_active = true and verified = true);

drop policy if exists "concepts_catalog admin read all" on public.concepts_catalog;
create policy "concepts_catalog admin read all"
  on public.concepts_catalog for select
  using (public.is_admin());

drop policy if exists "concepts_catalog admin write" on public.concepts_catalog;
create policy "concepts_catalog admin write"
  on public.concepts_catalog for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "concepts_catalog admin insert" on public.concepts_catalog;
create policy "concepts_catalog admin insert"
  on public.concepts_catalog for insert
  with check (public.is_admin());

-- creators can insert their own concepts (auto-unverified)
drop policy if exists "concepts_catalog creator insert own" on public.concepts_catalog;
create policy "concepts_catalog creator insert own"
  on public.concepts_catalog for insert
  with check (public.is_creator_or_up() and created_by = auth.uid());

-- creators can read + update their own concepts (even when unverified)
drop policy if exists "concepts_catalog creator read own" on public.concepts_catalog;
create policy "concepts_catalog creator read own"
  on public.concepts_catalog for select
  using (created_by = auth.uid());

drop policy if exists "concepts_catalog creator update own" on public.concepts_catalog;
create policy "concepts_catalog creator update own"
  on public.concepts_catalog for update
  using (created_by = auth.uid() and not verified)
  with check (created_by = auth.uid());

-- ========== TABLE: concepts_i18n (12 languages per concept) ==========
create table if not exists public.concepts_i18n (
  concept_slug  text not null references public.concepts_catalog(slug) on delete cascade,
  lang_code     text not null check (lang_code in ('be','de','en','es','fr','it','ja','ko','pl','pt','ru','uk')),
  name          text not null,
  tagline       text,
  description   text,
  body_html     text,
  updated_at    timestamptz default now(),
  primary key (concept_slug, lang_code)
);

alter table public.concepts_i18n enable row level security;

drop policy if exists "i18n public read verified" on public.concepts_i18n;
create policy "i18n public read verified"
  on public.concepts_i18n for select
  using (
    exists (
      select 1 from public.concepts_catalog c
      where c.slug = concept_slug and c.is_active = true and c.verified = true
    )
  );

drop policy if exists "i18n admin all" on public.concepts_i18n;
create policy "i18n admin all"
  on public.concepts_i18n for all
  using (public.is_admin())
  with check (public.is_admin());

-- ========== TABLE: purchases ==========
create table if not exists public.purchases (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  concept_slug  text not null references public.concepts_catalog(slug),
  price_paid    int not null,
  currency      text default 'EUR',
  provider      text,
  provider_ref  text,
  status        text default 'paid',
  created_at    timestamptz default now(),
  unique(user_id, concept_slug)
);

alter table public.purchases enable row level security;

drop policy if exists "purchases owner read" on public.purchases;
create policy "purchases owner read"
  on public.purchases for select
  using (auth.uid() = user_id);

drop policy if exists "purchases admin read" on public.purchases;
create policy "purchases admin read"
  on public.purchases for select
  using (public.is_admin());

-- ========== VIEW: my_concepts ==========
drop view if exists public.my_concepts;
create view public.my_concepts as
  select
    p.concept_slug,
    p.created_at as purchased_at,
    p.price_paid,
    c.name, c.category, c.country, c.size_m2,
    c.budget_eur, c.weeks, c.hero_image, c.tagline
  from public.purchases p
  join public.concepts_catalog c on c.slug = p.concept_slug
  where p.user_id = auth.uid() and p.status = 'paid';

grant select on public.my_concepts to authenticated;

-- ========== VIEW: admin_concepts (all, with i18n coverage) ==========
drop view if exists public.admin_concepts;
create view public.admin_concepts as
  select
    c.*,
    (select count(*) from public.concepts_i18n i where i.concept_slug = c.slug) as langs_filled
  from public.concepts_catalog c
  where public.is_admin();

grant select on public.admin_concepts to authenticated;

-- ========== PROFILES: superadmin delete policy ==========
drop policy if exists "profiles superadmin delete" on public.profiles;
create policy "profiles superadmin delete"
  on public.profiles for delete
  using (public.is_superadmin());

-- ========== RPC: change_user_password (admin/superadmin only) ==========
-- Lets admins reset any user's password. SECURITY DEFINER runs as postgres
-- so it can write to auth.users. Relies on pgcrypto for bcrypt hashing.
create extension if not exists pgcrypto;

create or replace function public.change_user_password(
  p_user_id uuid, p_new_password text
) returns jsonb
language plpgsql security definer
set search_path = public, auth
as $$
declare
  v_caller uuid := auth.uid();
  v_caller_role text;
begin
  if v_caller is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;
  select role into v_caller_role from public.profiles where user_id = v_caller;
  if v_caller_role not in ('admin','superadmin') then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;
  if length(coalesce(p_new_password,'')) < 8 then
    return jsonb_build_object('ok', false, 'error', 'password_too_short');
  end if;
  update auth.users
    set encrypted_password = crypt(p_new_password, gen_salt('bf')),
        updated_at = now()
    where id = p_user_id;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function public.change_user_password(uuid, text) to authenticated;

-- ========== RPC: delete_user_cascade (superadmin only) ==========
create or replace function public.delete_user_cascade(p_user_id uuid)
returns jsonb
language plpgsql security definer
set search_path = public, auth
as $$
declare
  v_caller uuid := auth.uid();
begin
  if v_caller is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;
  if not public.is_superadmin() then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;
  if p_user_id = v_caller then
    return jsonb_build_object('ok', false, 'error', 'cannot_delete_self');
  end if;
  delete from auth.users where id = p_user_id;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function public.delete_user_cascade(uuid) to authenticated;

-- ========== VIEW: admin_metrics (real numbers, no fakes) ==========
drop view if exists public.admin_metrics;
create view public.admin_metrics as
  select
    (select count(*) from public.profiles) as users_total,
    (select count(*) from public.profiles where role = 'user') as users_user,
    (select count(*) from public.profiles where role = 'creator') as users_creator,
    (select count(*) from public.profiles where role = 'admin') as users_admin,
    (select count(*) from public.profiles where role = 'superadmin') as users_superadmin,
    (select count(*) from public.profiles where created_at > now() - interval '7 days') as users_7d,
    (select count(*) from public.profiles where created_at > now() - interval '30 days') as users_30d,
    (select count(*) from public.concepts_catalog) as concepts_total,
    (select count(*) from public.concepts_catalog where verified = true) as concepts_verified,
    (select count(*) from public.concepts_catalog where verified = false) as concepts_pending,
    (select count(*) from public.purchases where status = 'paid') as purchases_total,
    (select coalesce(sum(price_paid),0) from public.purchases where status = 'paid') as revenue_eur,
    (select count(*) from public.purchases where status='paid' and created_at > now() - interval '7 days') as purchases_7d,
    (select coalesce(sum(price_paid),0) from public.purchases where status='paid' and created_at > now() - interval '30 days') as revenue_30d,
    (select count(*) from public.concepts_i18n) as i18n_rows
  where public.is_admin();

grant select on public.admin_metrics to authenticated;

-- ========== BOOTSTRAP: grant superadmin to scyraai@proton.me ==========
insert into public.profiles (user_id, email, role)
  select id, email, 'superadmin' from auth.users where email = 'scyraai@proton.me'
  on conflict (user_id) do update set role = 'superadmin';

-- ============================================================
-- ACCESS CONTROL — triple-state (gift / purchased / promo)
-- Source of truth: public.purchases (keeps audit + RLS + indexes).
-- A user has access to a concept IFF a purchases row exists with
-- status='paid' and access_state in ('gift','purchased','promo').
-- ============================================================

-- 1. access_state column on purchases
alter table public.purchases
  add column if not exists access_state text;

update public.purchases
  set access_state = case
    when provider = 'superadmin'                then 'gift'
    when provider in ('lemon_squeezy','stripe') then 'purchased'
    else 'purchased'
  end
  where access_state is null;

alter table public.purchases
  drop constraint if exists purchases_access_state_check;
alter table public.purchases
  add constraint purchases_access_state_check
  check (access_state in ('gift','purchased','promo'));

alter table public.purchases
  alter column access_state set default 'purchased';
alter table public.purchases
  alter column access_state set not null;

-- 2. VIEW: concept_access — three arrays per concept (spec mental model)
drop view if exists public.concept_access cascade;
create view public.concept_access
  with (security_invoker = on)
as
  select
    c.slug as concept_id,
    c.name,
    coalesce(array_agg(p.user_id) filter
      (where p.access_state = 'gift' and p.status = 'paid'), '{}'::uuid[]) as access_gift,
    coalesce(array_agg(p.user_id) filter
      (where p.access_state = 'purchased' and p.status = 'paid'), '{}'::uuid[]) as access_purchased,
    coalesce(array_agg(p.user_id) filter
      (where p.access_state = 'promo' and p.status = 'paid'), '{}'::uuid[]) as access_promo
  from public.concepts_catalog c
  left join public.purchases p on p.concept_slug = c.slug
  group by c.slug, c.name;

grant select on public.concept_access to authenticated;

-- 3. RPC: has_access — single triple-check query, callable from client/server
create or replace function public.has_access(p_user_id uuid, p_slug text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.purchases
    where user_id = p_user_id
      and concept_slug = p_slug
      and status = 'paid'
      and access_state in ('gift','purchased','promo')
  );
$$;

grant execute on function public.has_access(uuid, text) to authenticated;

-- Convenience: current-user check
create or replace function public.i_have_access(p_slug text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.has_access(auth.uid(), p_slug);
$$;

grant execute on function public.i_have_access(text) to authenticated;

-- 4. RPC: admin_grant_access — superadmin grants access in any state
create or replace function public.admin_grant_access(
  p_user_id uuid, p_slug text, p_state text
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_superadmin() then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;
  if p_state not in ('gift','purchased','promo') then
    return jsonb_build_object('ok', false, 'error', 'invalid_state');
  end if;
  if not exists (select 1 from public.concepts_catalog where slug = p_slug) then
    return jsonb_build_object('ok', false, 'error', 'concept_not_found');
  end if;
  insert into public.purchases(
    user_id, concept_slug, price_paid, currency, provider, access_state, status
  ) values (
    p_user_id, p_slug, 0, 'EUR', 'superadmin', p_state, 'paid'
  )
  on conflict (user_id, concept_slug) do update
    set access_state = excluded.access_state,
        status       = 'paid';
  return jsonb_build_object('ok', true, 'state', p_state);
end; $$;

grant execute on function public.admin_grant_access(uuid, text, text) to authenticated;

-- 5. RPC: admin_revoke_access — superadmin removes any access
create or replace function public.admin_revoke_access(
  p_user_id uuid, p_slug text
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_superadmin() then
    return jsonb_build_object('ok', false, 'error', 'not_authorized');
  end if;
  delete from public.purchases
    where user_id = p_user_id and concept_slug = p_slug;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function public.admin_revoke_access(uuid, text) to authenticated;

-- 6. RPC: admin_user_access_list — list all access rows for a user (with state)
create or replace function public.admin_user_access_list(p_user_id uuid)
returns table (
  concept_slug text,
  concept_name text,
  access_state text,
  provider     text,
  price_paid   int,
  created_at   timestamptz
)
language sql security definer
set search_path = public
as $$
  select p.concept_slug, c.name, p.access_state, p.provider, p.price_paid, p.created_at
  from public.purchases p
  join public.concepts_catalog c on c.slug = p.concept_slug
  where p.user_id = p_user_id
    and p.status = 'paid'
    and public.is_admin()
  order by p.created_at desc;
$$;

grant execute on function public.admin_user_access_list(uuid) to authenticated;

-- 7. RPC: admin_concept_access_list — list all users with access to a concept
create or replace function public.admin_concept_access_list(p_slug text)
returns table (
  user_id      uuid,
  email        text,
  display_name text,
  role         text,
  access_state text,
  provider     text,
  price_paid   int,
  currency     text,
  created_at   timestamptz
)
language sql security definer
set search_path = public
as $$
  select
    p.user_id,
    au.email::text,
    pr.display_name,
    pr.role,
    p.access_state,
    p.provider,
    p.price_paid,
    p.currency,
    p.created_at
  from public.purchases p
  left join auth.users au on au.id = p.user_id
  left join public.profiles pr on pr.user_id = p.user_id
  where p.concept_slug = p_slug
    and p.status = 'paid'
    and public.is_admin()
  order by
    case p.access_state when 'gift' then 0 when 'purchased' then 1 when 'promo' then 2 else 3 end,
    p.created_at desc;
$$;

grant execute on function public.admin_concept_access_list(text) to authenticated;

-- ============================================================
-- PROTECTED BRANDBOOKS (private HTML gated by has_access)
-- ============================================================
-- Brandbook files are no longer served from /data/concepts/<slug>/brandbook.html.
-- Instead, the self-contained HTML (images inlined as base64) lives here and is
-- returned only to users who own the concept. Admin UI uploads via upsert.

create table if not exists public.concept_brandbooks (
  concept_slug text primary key references public.concepts_catalog(slug) on delete cascade,
  html_content text not null,
  updated_at   timestamptz not null default now()
);

alter table public.concept_brandbooks enable row level security;

drop policy if exists "brandbook read by access" on public.concept_brandbooks;
create policy "brandbook read by access"
  on public.concept_brandbooks for select
  to authenticated
  using (
    public.is_superadmin()
    or public.has_access(auth.uid(), concept_slug)
  );

drop policy if exists "brandbook write by superadmin" on public.concept_brandbooks;
create policy "brandbook write by superadmin"
  on public.concept_brandbooks for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());
