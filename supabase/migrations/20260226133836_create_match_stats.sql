-- Match performance statistics entered by coach after a match
create table public.match_stats (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  goals integer not null default 0,
  assists integer not null default 0,
  yellow_cards integer not null default 0,
  red_cards integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(match_id, player_id)
);

-- Indexes
create index idx_match_stats_match_id on public.match_stats(match_id);
create index idx_match_stats_player_id on public.match_stats(player_id);

-- Updated_at trigger
create trigger handle_match_stats_updated_at
  before update on public.match_stats
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.match_stats enable row level security;

-- Coach: full CRUD (via matches → teams → created_by)
create policy "Coach can manage match stats"
  on public.match_stats for all
  using (
    exists (
      select 1 from public.matches m
      join public.teams t on t.id = m.team_id
      where m.id = match_stats.match_id
      and t.created_by = auth.uid()
    )
  );

-- Player: read stats for their team's matches
create policy "Players can view match stats"
  on public.match_stats for select
  using (
    exists (
      select 1 from public.matches m
      join public.players p on p.team_id = m.team_id
      where m.id = match_stats.match_id
      and p.user_id = auth.uid()
    )
  );
