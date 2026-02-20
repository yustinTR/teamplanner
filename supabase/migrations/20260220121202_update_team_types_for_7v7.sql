-- Add new team type enum values for better age group coverage
-- JO15 and below play 7v7, JO17+ play 11v11
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo19_jo17';
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo15_jo13';
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo11_jo9';

-- Migrate existing teams to new values
-- jo19_jo15 → jo19_jo17 (these were 11v11 teams)
UPDATE public.teams SET team_type = 'jo19_jo17' WHERE team_type = 'jo19_jo15';
-- jo13_jo11 → jo15_jo13 (these should be 7v7)
UPDATE public.teams SET team_type = 'jo15_jo13' WHERE team_type = 'jo13_jo11';
-- jo9_jo7 → jo11_jo9
UPDATE public.teams SET team_type = 'jo11_jo9' WHERE team_type = 'jo9_jo7';
