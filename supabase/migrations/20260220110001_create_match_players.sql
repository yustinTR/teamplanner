-- Match players (leen-spelers): temporary players for a single match
create table public.match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  name text not null,
  position text,
  created_at timestamptz not null default now()
);
create index idx_match_players_match_id on public.match_players(match_id);

alter table public.match_players enable row level security;

-- Coach can manage match players (via match → team → created_by)
create policy "Coach can manage match players" on public.match_players for all
  using (match_id in (
    select m.id from public.matches m
    join public.teams t on t.id = m.team_id where t.created_by = auth.uid()
  ))
  with check (match_id in (
    select m.id from public.matches m
    join public.teams t on t.id = m.team_id where t.created_by = auth.uid()
  ));

-- Team members can view match players
create policy "Players can view match players" on public.match_players for select
  using (match_id in (
    select m.id from public.matches m
    where m.team_id in (select id from public.teams where created_by = auth.uid())
       or m.team_id in (select team_id from public.players where user_id = auth.uid())
  ));
