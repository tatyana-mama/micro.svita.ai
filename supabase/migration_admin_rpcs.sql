-- ============================================================
-- SVITA Micro — Admin RPCs migration
-- Run in Supabase SQL editor. Creates 10 RPCs needed by admin.html.
-- All are SECURITY DEFINER with is_superadmin() guard.
-- ============================================================

-- ============================================================
-- 1. admin_dashboard_stats — overview stats card
-- ============================================================
create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_superadmin() then
    raise exception 'not_authorized';
  end if;
  select jsonb_build_object(
    'revenue_total', coalesce((select sum(price_paid) from purchases where status='paid'),0),
    'revenue_30d',   coalesce((select sum(price_paid) from purchases where status='paid' and created_at > now()-interval '30d'),0),
    'revenue_7d',    coalesce((select sum(price_paid) from purchases where status='paid' and created_at > now()-interval '7d'),0),
    'avg_order',     coalesce((select round(avg(price_paid)) from purchases where status='paid' and price_paid > 0),0),
    'purchases_total', (select count(*) from purchases where status='paid'),
    'purchases_30d',   (select count(*) from purchases where status='paid' and created_at > now()-interval '30d'),
    'purchases_7d',    (select count(*) from purchases where status='paid' and created_at > now()-interval '7d'),
    'users_total',   (select count(*) from profiles),
    'users_30d',     (select count(*) from profiles where created_at > now()-interval '30d'),
    'users_7d',      (select count(*) from profiles where created_at > now()-interval '7d'),
    'visits_30d',    coalesce((select count(*) from svita_events where event='page_view' and created_at > now()-interval '30d'),0),
    'visits_7d',     coalesce((select count(*) from svita_events where event='page_view' and created_at > now()-interval '7d'),0),
    'pageviews_30d', coalesce((select count(*) from svita_events where created_at > now()-interval '30d'),0),
    'pageviews_7d',  coalesce((select count(*) from svita_events where created_at > now()-interval '7d'),0),
    'gifts_total',   (select count(*) from purchases where status='paid' and provider='superadmin')
  ) into result;
  return result;
end; $$;

grant execute on function public.admin_dashboard_stats() to authenticated;

-- ============================================================
-- 2. admin_revenue_timeseries — daily revenue for bar chart
-- ============================================================
create or replace function public.admin_revenue_timeseries(p_days int default 30)
returns table (day date, revenue bigint, orders bigint)
language sql security definer
set search_path = public
as $$
  select
    d::date as day,
    coalesce(sum(p.price_paid),0)::bigint as revenue,
    count(p.id)::bigint as orders
  from generate_series(
    (current_date - (p_days||' days')::interval)::date,
    current_date,
    '1 day'
  ) d
  left join purchases p
    on p.created_at::date = d::date
    and p.status = 'paid'
  where public.is_superadmin()
  group by d
  order by d;
$$;

grant execute on function public.admin_revenue_timeseries(int) to authenticated;

-- ============================================================
-- 3. admin_recent_activity — latest signups + purchases
-- ============================================================
create or replace function public.admin_recent_activity(p_limit int default 20)
returns table (type text, who text, email text, concept_slug text, amount int, ts timestamptz)
language sql security definer
set search_path = public
as $$
  (
    select 'purchase'::text as type,
           coalesce(pr.display_name, au.email) as who,
           au.email,
           p.concept_slug,
           p.price_paid as amount,
           p.created_at as ts
    from purchases p
    join auth.users au on au.id = p.user_id
    left join profiles pr on pr.user_id = p.user_id
    where p.status = 'paid' and public.is_superadmin()
    order by p.created_at desc
    limit p_limit
  )
  union all
  (
    select 'signup'::text,
           coalesce(pr.display_name, pr.email),
           pr.email,
           null,
           null,
           pr.created_at
    from profiles pr
    where public.is_superadmin()
    order by pr.created_at desc
    limit p_limit
  )
  order by ts desc
  limit p_limit;
$$;

grant execute on function public.admin_recent_activity(int) to authenticated;

-- ============================================================
-- 4. admin_top_concepts — best-sellers by revenue
-- ============================================================
create or replace function public.admin_top_concepts(p_days int default 30, p_limit int default 20)
returns table (slug text, name text, category text, views bigint, orders bigint, revenue bigint, conv numeric)
language sql security definer
set search_path = public
as $$
  select
    c.slug,
    c.name,
    c.category,
    coalesce(v.cnt, 0)::bigint as views,
    coalesce(p.cnt, 0)::bigint as orders,
    coalesce(p.rev, 0)::bigint as revenue,
    case when coalesce(v.cnt,0) > 0
      then round(coalesce(p.cnt,0)::numeric / v.cnt * 100, 2)
      else 0 end as conv
  from concepts_catalog c
  left join (
    select (meta->>'slug')::text as slug, count(*) as cnt
    from svita_events
    where event = 'concept_view'
      and created_at > now() - (p_days||' days')::interval
    group by (meta->>'slug')
  ) v on v.slug = c.slug
  left join (
    select concept_slug, count(*) as cnt, sum(price_paid) as rev
    from purchases
    where status = 'paid'
      and created_at > now() - (p_days||' days')::interval
    group by concept_slug
  ) p on p.concept_slug = c.slug
  where public.is_superadmin()
  order by revenue desc, orders desc
  limit p_limit;
$$;

grant execute on function public.admin_top_concepts(int, int) to authenticated;

-- ============================================================
-- 5. admin_sales_list — filterable sales table
-- ============================================================
create or replace function public.admin_sales_list(
  p_days int default 30,
  p_provider text default 'all',
  p_limit int default 500
)
returns table (
  id uuid, user_id uuid, email text, concept_slug text,
  price_paid int, currency text, provider text, status text,
  access_state text, ts timestamptz
)
language sql security definer
set search_path = public
as $$
  select
    p.id, p.user_id, au.email, p.concept_slug,
    p.price_paid, p.currency, p.provider, p.status,
    p.access_state, p.created_at as ts
  from purchases p
  join auth.users au on au.id = p.user_id
  where public.is_superadmin()
    and (p_days = 0 or p.created_at > now() - (p_days||' days')::interval)
    and (p_provider = 'all' or p.provider = p_provider)
  order by p.created_at desc
  limit p_limit;
$$;

grant execute on function public.admin_sales_list(int, text, int) to authenticated;

-- ============================================================
-- 6. admin_funnel — conversion funnel counts
-- ============================================================
create or replace function public.admin_funnel(p_days int default 30)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare result jsonb;
begin
  if not public.is_superadmin() then raise exception 'not_authorized'; end if;
  select jsonb_build_object(
    'visits',    (select count(*) from svita_events where event='page_view' and created_at > now()-(p_days||'d')::interval),
    'viewers',   (select count(distinct visitor_id) from svita_events where event='concept_view' and created_at > now()-(p_days||'d')::interval),
    'carts',     (select count(*) from svita_events where event='add_to_cart' and created_at > now()-(p_days||'d')::interval),
    'checkouts', (select count(*) from svita_events where event='checkout_start' and created_at > now()-(p_days||'d')::interval),
    'paid',      (select count(*) from purchases where status='paid' and created_at > now()-(p_days||'d')::interval)
  ) into result;
  return result;
end; $$;

grant execute on function public.admin_funnel(int) to authenticated;

-- ============================================================
-- 7. admin_traffic_timeseries — daily visits for chart
-- ============================================================
create or replace function public.admin_traffic_timeseries(p_days int default 30)
returns table (day date, visits bigint)
language sql security definer
set search_path = public
as $$
  select
    d::date as day,
    count(e.id)::bigint as visits
  from generate_series(
    (current_date - (p_days||' days')::interval)::date,
    current_date,
    '1 day'
  ) d
  left join svita_events e
    on e.created_at::date = d::date
    and e.event = 'page_view'
  where public.is_superadmin()
  group by d
  order by d;
$$;

grant execute on function public.admin_traffic_timeseries(int) to authenticated;

-- ============================================================
-- 8. admin_cohorts — monthly signup cohort analysis
-- ============================================================
create or replace function public.admin_cohorts()
returns table (cohort_month date, signups bigint, buyers bigint, buyers_pct numeric, revenue bigint)
language sql security definer
set search_path = public
as $$
  select
    date_trunc('month', pr.created_at)::date as cohort_month,
    count(distinct pr.user_id)::bigint as signups,
    count(distinct p.user_id)::bigint as buyers,
    round(
      case when count(distinct pr.user_id) > 0
        then count(distinct p.user_id)::numeric / count(distinct pr.user_id) * 100
        else 0 end, 1
    ) as buyers_pct,
    coalesce(sum(p.price_paid), 0)::bigint as revenue
  from profiles pr
  left join purchases p
    on p.user_id = pr.user_id and p.status = 'paid'
  where public.is_superadmin()
  group by date_trunc('month', pr.created_at)
  order by cohort_month desc;
$$;

grant execute on function public.admin_cohorts() to authenticated;

-- ============================================================
-- 9. admin_user_detail — single user profile + stats
-- ============================================================
create or replace function public.admin_user_detail(p_user_id uuid)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  result jsonb;
  v_email text;
  v_name text;
  v_role text;
  v_created timestamptz;
  v_purchases int;
  v_revenue int;
  v_providers text[];
begin
  if not public.is_superadmin() then raise exception 'not_authorized'; end if;

  select au.email, pr.display_name, pr.role, pr.created_at
  into v_email, v_name, v_role, v_created
  from auth.users au
  left join profiles pr on pr.user_id = au.id
  where au.id = p_user_id;

  select count(*), coalesce(sum(price_paid),0)
  into v_purchases, v_revenue
  from purchases where user_id = p_user_id and status = 'paid';

  select array_agg(distinct i.provider)
  into v_providers
  from auth.identities i where i.user_id = p_user_id;

  select jsonb_build_object(
    'user_id', p_user_id,
    'email', v_email,
    'display_name', v_name,
    'role', v_role,
    'created_at', v_created,
    'purchases', v_purchases,
    'revenue', v_revenue,
    'providers', coalesce(v_providers, '{}'::text[])
  ) into result;

  return result;
end; $$;

grant execute on function public.admin_user_detail(uuid) to authenticated;

-- ============================================================
-- 10. admin_list_users_with_providers — user list + auth providers
-- ============================================================
create or replace function public.admin_list_users_with_providers()
returns table (user_id uuid, providers text[])
language sql security definer
set search_path = public
as $$
  select
    i.user_id,
    array_agg(distinct i.provider) as providers
  from auth.identities i
  where public.is_superadmin()
  group by i.user_id;
$$;

grant execute on function public.admin_list_users_with_providers() to authenticated;

-- ============================================================
-- 11. delete_my_account — self-service account deletion
-- ============================================================
create or replace function public.delete_my_account()
returns void
language plpgsql security definer
set search_path = public
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated'; end if;
  delete from public.purchases where user_id = uid;
  delete from public.profiles where user_id = uid;
  delete from auth.users where id = uid;
end; $$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;

-- ============================================================
-- Ensure svita_events table exists (used by analytics RPCs)
-- ============================================================
create table if not exists public.svita_events (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  uuid,
  session_id  uuid,
  user_id     uuid,
  event       text not null,
  page        text,
  referrer    text,
  lang        text,
  ua          text,
  screen_w    int,
  screen_h    int,
  meta        jsonb default '{}',
  created_at  timestamptz default now()
);

-- RLS: anon can insert events, admin can read all
alter table public.svita_events enable row level security;

drop policy if exists "events anon insert" on public.svita_events;
create policy "events anon insert" on public.svita_events
  for insert to anon, authenticated
  with check (true);

drop policy if exists "events admin read" on public.svita_events;
create policy "events admin read" on public.svita_events
  for select using (public.is_admin());
