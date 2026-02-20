-- Add substitution plan JSONB column to lineups
alter table public.lineups add column substitution_plan jsonb;
