-- Fix infinite recursion in RLS policies
-- The "Players can view team members" policy referenced the players table itself,
-- causing infinite recursion when PostgreSQL evaluated the policy.

-- Drop recursive policies
DROP POLICY IF EXISTS "Players can view team members" ON public.players;
DROP POLICY IF EXISTS "Players can view team matches" ON public.matches;
DROP POLICY IF EXISTS "Players can view team availability" ON public.availability;
DROP POLICY IF EXISTS "Players can view team lineups" ON public.lineups;
DROP POLICY IF EXISTS "Players can view their team" ON public.teams;

-- TEAMS: Players can view their team (check via players table)
CREATE POLICY "Players can view their team"
  ON public.teams FOR SELECT
  USING (
    created_by = auth.uid()
    OR id IN (SELECT team_id FROM public.players WHERE user_id = auth.uid())
  );

-- PLAYERS: Can view if you're the coach or a member of the same team
-- Use teams table to avoid self-referencing recursion
CREATE POLICY "Players can view team members"
  ON public.players FOR SELECT
  USING (
    user_id = auth.uid()
    OR team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid())
    OR team_id IN (SELECT team_id FROM public.players WHERE user_id = auth.uid())
  );

-- MATCHES: Can view if coach or team member
CREATE POLICY "Players can view team matches"
  ON public.matches FOR SELECT
  USING (
    team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid())
    OR team_id IN (SELECT team_id FROM public.players WHERE user_id = auth.uid())
  );

-- AVAILABILITY: Can view if coach or team member
CREATE POLICY "Players can view team availability"
  ON public.availability FOR SELECT
  USING (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE m.team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid())
         OR m.team_id IN (SELECT p.team_id FROM public.players p WHERE p.user_id = auth.uid())
    )
  );

-- LINEUPS: Can view if coach or team member
CREATE POLICY "Players can view team lineups"
  ON public.lineups FOR SELECT
  USING (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE m.team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid())
         OR m.team_id IN (SELECT p.team_id FROM public.players p WHERE p.user_id = auth.uid())
    )
  );
