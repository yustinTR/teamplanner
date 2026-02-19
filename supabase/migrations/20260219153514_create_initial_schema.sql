-- TeamPlanner Initial Schema
-- Tables: teams, players, matches, availability, lineups

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type public.match_status as enum ('upcoming', 'completed', 'cancelled');
create type public.home_away as enum ('home', 'away');
create type public.availability_status as enum ('available', 'unavailable', 'maybe');

-- ============================================================
-- TABLES
-- ============================================================

-- TEAMS
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  club_name text,
  formation text default '4-3-3',
  invite_code text unique not null default substring(md5(random()::text) from 1 for 8),
  created_by uuid not null references auth.users(id) on delete cascade,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PLAYERS
create table public.players (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  position text,
  jersey_number integer,
  photo_url text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- MATCHES
create table public.matches (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  opponent text not null,
  match_date timestamptz not null,
  location text,
  home_away public.home_away not null default 'home',
  status public.match_status not null default 'upcoming',
  score_home integer,
  score_away integer,
  notes text,
  created_at timestamptz not null default now()
);

-- AVAILABILITY
create table public.availability (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references public.players(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  status public.availability_status not null,
  responded_at timestamptz not null default now(),
  unique (player_id, match_id)
);

-- LINEUPS
create table public.lineups (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade unique,
  formation text not null default '4-3-3',
  positions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- positions JSONB format: [{player_id, x, y, position_label}]

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.availability enable row level security;
alter table public.lineups enable row level security;

-- TEAMS policies
create policy "Coach can manage own teams"
  on public.teams for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Players can view their team"
  on public.teams for select
  using (
    id in (select team_id from public.players where user_id = auth.uid())
  );

-- PLAYERS policies
create policy "Coach can manage team players"
  on public.players for all
  using (
    team_id in (select id from public.teams where created_by = auth.uid())
  )
  with check (
    team_id in (select id from public.teams where created_by = auth.uid())
  );

create policy "Players can view team members"
  on public.players for select
  using (
    team_id in (select team_id from public.players where user_id = auth.uid())
  );

-- MATCHES policies
create policy "Coach can manage team matches"
  on public.matches for all
  using (
    team_id in (select id from public.teams where created_by = auth.uid())
  )
  with check (
    team_id in (select id from public.teams where created_by = auth.uid())
  );

create policy "Players can view team matches"
  on public.matches for select
  using (
    team_id in (select team_id from public.players where user_id = auth.uid())
  );

-- AVAILABILITY policies
create policy "Coach can manage team availability"
  on public.availability for all
  using (
    player_id in (
      select p.id from public.players p
      join public.teams t on t.id = p.team_id
      where t.created_by = auth.uid()
    )
  )
  with check (
    player_id in (
      select p.id from public.players p
      join public.teams t on t.id = p.team_id
      where t.created_by = auth.uid()
    )
  );

create policy "Players can update own availability"
  on public.availability for all
  using (
    player_id in (select id from public.players where user_id = auth.uid())
  )
  with check (
    player_id in (select id from public.players where user_id = auth.uid())
  );

create policy "Players can view team availability"
  on public.availability for select
  using (
    match_id in (
      select m.id from public.matches m
      join public.players p on p.team_id = m.team_id
      where p.user_id = auth.uid()
    )
  );

-- LINEUPS policies
create policy "Coach can manage team lineups"
  on public.lineups for all
  using (
    match_id in (
      select m.id from public.matches m
      join public.teams t on t.id = m.team_id
      where t.created_by = auth.uid()
    )
  )
  with check (
    match_id in (
      select m.id from public.matches m
      join public.teams t on t.id = m.team_id
      where t.created_by = auth.uid()
    )
  );

create policy "Players can view team lineups"
  on public.lineups for select
  using (
    match_id in (
      select m.id from public.matches m
      join public.players p on p.team_id = m.team_id
      where p.user_id = auth.uid()
    )
  );

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_teams_updated
  before update on public.teams
  for each row execute function public.handle_updated_at();

create trigger on_lineups_updated
  before update on public.lineups
  for each row execute function public.handle_updated_at();
