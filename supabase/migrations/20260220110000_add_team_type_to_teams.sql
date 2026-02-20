-- Add team_type enum and column to teams
create type public.team_type as enum ('senioren','jo19_jo15','jo13_jo11','jo9_jo7','g_team');
alter table public.teams add column team_type public.team_type not null default 'senioren';
