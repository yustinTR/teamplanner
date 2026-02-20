-- Add import source columns to teams for refresh functionality
ALTER TABLE public.teams
  ADD COLUMN import_club_abbrev text,
  ADD COLUMN import_team_name text,
  ADD COLUMN import_team_id integer,
  ADD COLUMN import_team_url text;
