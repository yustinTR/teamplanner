-- KNVB youth match formats: JO8-JO10 play 6 v 6, JO11-JO12 play 8 v 8,
-- JO13 and older play 11 v 11. The app modelled JO9-JO15 as 7 v 7.
-- jo11_jo9 stays as a legacy value so existing 7 v 7 lineups keep working.
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo12_jo11';
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo10';
ALTER TYPE public.team_type ADD VALUE IF NOT EXISTS 'jo9_jo8';

-- Exercises tagged for the old JO11-JO9 group suit all three new youth types.
UPDATE public.exercises
SET team_types = team_types || ARRAY['jo12_jo11', 'jo10', 'jo9_jo8']
WHERE 'jo11_jo9' = ANY (team_types)
  AND NOT ('jo12_jo11' = ANY (team_types));
