-- Concept ratings: one rating per user per concept
create table if not exists concept_ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_slug text not null,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, concept_slug)
);

-- Index for fast lookups
create index if not exists idx_ratings_slug on concept_ratings(concept_slug);
create index if not exists idx_ratings_user on concept_ratings(user_id);

-- RLS
alter table concept_ratings enable row level security;

create policy "Anyone can read ratings"
  on concept_ratings for select
  using (true);

create policy "Authenticated users can insert own rating"
  on concept_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own rating"
  on concept_ratings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Aggregate view for average + count
create or replace view concept_ratings_agg as
select
  concept_slug,
  round(avg(rating)::numeric, 1) as avg_rating,
  count(*) as rating_count
from concept_ratings
group by concept_slug;
