-- Add detailed positions and role to players table
-- Replaces generic position (goalkeeper/defender/midfielder/forward) with specific positions (K, CB, LB, etc.)
-- Adds secondary_positions array and role (player/staff)

-- Step 1: Add new columns to players
alter table public.players
  add column primary_position text,
  add column secondary_positions text[] not null default '{}',
  add column role text not null default 'player';

-- Step 2: Migrate existing position data
update public.players set primary_position = case
  when position = 'goalkeeper' then 'K'
  when position = 'defender' then 'CB'
  when position = 'midfielder' then 'CM'
  when position = 'forward' then 'ST'
  else null
end;

-- Step 3: Drop old position column
alter table public.players drop column position;

-- Step 4: Add check constraint for role
alter table public.players
  add constraint players_role_check check (role in ('player', 'staff'));

-- Step 5: Add new column to match_players
alter table public.match_players
  add column primary_position text;

-- Step 6: Migrate match_players position data
update public.match_players set primary_position = case
  when position = 'goalkeeper' then 'K'
  when position = 'defender' then 'CB'
  when position = 'midfielder' then 'CM'
  when position = 'forward' then 'ST'
  else position
end;

-- Step 7: Drop old position column from match_players
alter table public.match_players drop column position;
