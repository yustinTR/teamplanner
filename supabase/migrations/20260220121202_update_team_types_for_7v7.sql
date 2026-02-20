-- Recreate enum type with new values (ALTER TYPE ADD VALUE cannot run in a transaction)
-- Instead: create new type, convert column, drop old type, rename

-- Clean up potential leftover from failed previous attempt
DROP TYPE IF EXISTS public.team_type_v2;

-- Create new enum with all values (new + legacy)
CREATE TYPE public.team_type_v2 AS ENUM (
  'senioren', 'jo19_jo17', 'jo15_jo13', 'jo11_jo9', 'g_team',
  'jo19_jo15', 'jo13_jo11', 'jo9_jo7'
);

-- Drop default before type change
ALTER TABLE public.teams ALTER COLUMN team_type DROP DEFAULT;

-- Convert column to new type, migrating old values to new ones
ALTER TABLE public.teams
  ALTER COLUMN team_type TYPE public.team_type_v2
  USING (
    CASE team_type::text
      WHEN 'jo19_jo15' THEN 'jo19_jo17'::public.team_type_v2
      WHEN 'jo13_jo11' THEN 'jo15_jo13'::public.team_type_v2
      WHEN 'jo9_jo7' THEN 'jo11_jo9'::public.team_type_v2
      ELSE team_type::text::public.team_type_v2
    END
  );

-- Restore default
ALTER TABLE public.teams ALTER COLUMN team_type SET DEFAULT 'senioren'::public.team_type_v2;

-- Replace old type with new one
DROP TYPE public.team_type;
ALTER TYPE public.team_type_v2 RENAME TO team_type;
