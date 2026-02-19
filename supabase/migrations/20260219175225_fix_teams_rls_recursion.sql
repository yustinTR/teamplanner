-- Fix: teams policies also cause recursion because they reference players,
-- and players policies reference teams, creating a circular dependency.
--
-- Solution: Use a security definer function to break the cycle.

-- Helper function that bypasses RLS to get team_ids for a user
CREATE OR REPLACE FUNCTION public.get_my_team_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT team_id FROM public.players WHERE user_id = auth.uid()
$$;

-- Drop ALL existing policies to start clean
DROP POLICY IF EXISTS "Coach can manage own teams" ON public.teams;
DROP POLICY IF EXISTS "Players can view their team" ON public.teams;
DROP POLICY IF EXISTS "Coach can manage team players" ON public.players;
DROP POLICY IF EXISTS "Players can view team members" ON public.players;
DROP POLICY IF EXISTS "Coach can manage team matches" ON public.matches;
DROP POLICY IF EXISTS "Players can view team matches" ON public.matches;
DROP POLICY IF EXISTS "Coach can manage team availability" ON public.availability;
DROP POLICY IF EXISTS "Players can update own availability" ON public.availability;
DROP POLICY IF EXISTS "Players can view team availability" ON public.availability;
DROP POLICY IF EXISTS "Coach can manage team lineups" ON public.lineups;
DROP POLICY IF EXISTS "Players can view team lineups" ON public.lineups;

-- ============================================================
-- TEAMS
-- ============================================================
CREATE POLICY "Coach can manage own teams"
  ON public.teams FOR ALL
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Players can view their team"
  ON public.teams FOR SELECT
  USING (id IN (SELECT public.get_my_team_ids()));

-- ============================================================
-- PLAYERS
-- ============================================================
CREATE POLICY "Coach can manage team players"
  ON public.players FOR ALL
  USING (team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid()))
  WITH CHECK (team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid()));

CREATE POLICY "Players can view team members"
  ON public.players FOR SELECT
  USING (team_id IN (SELECT public.get_my_team_ids()));

-- ============================================================
-- MATCHES
-- ============================================================
CREATE POLICY "Coach can manage team matches"
  ON public.matches FOR ALL
  USING (team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid()))
  WITH CHECK (team_id IN (SELECT id FROM public.teams WHERE created_by = auth.uid()));

CREATE POLICY "Players can view team matches"
  ON public.matches FOR SELECT
  USING (team_id IN (SELECT public.get_my_team_ids()));

-- ============================================================
-- AVAILABILITY
-- ============================================================
CREATE POLICY "Coach can manage team availability"
  ON public.availability FOR ALL
  USING (
    player_id IN (
      SELECT p.id FROM public.players p
      JOIN public.teams t ON t.id = p.team_id
      WHERE t.created_by = auth.uid()
    )
  )
  WITH CHECK (
    player_id IN (
      SELECT p.id FROM public.players p
      JOIN public.teams t ON t.id = p.team_id
      WHERE t.created_by = auth.uid()
    )
  );

CREATE POLICY "Players can update own availability"
  ON public.availability FOR ALL
  USING (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()))
  WITH CHECK (player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid()));

CREATE POLICY "Players can view team availability"
  ON public.availability FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM public.matches WHERE team_id IN (SELECT public.get_my_team_ids())
    )
  );

-- ============================================================
-- LINEUPS
-- ============================================================
CREATE POLICY "Coach can manage team lineups"
  ON public.lineups FOR ALL
  USING (
    match_id IN (
      SELECT m.id FROM public.matches m
      JOIN public.teams t ON t.id = m.team_id
      WHERE t.created_by = auth.uid()
    )
  )
  WITH CHECK (
    match_id IN (
      SELECT m.id FROM public.matches m
      JOIN public.teams t ON t.id = m.team_id
      WHERE t.created_by = auth.uid()
    )
  );

CREATE POLICY "Players can view team lineups"
  ON public.lineups FOR SELECT
  USING (
    match_id IN (
      SELECT id FROM public.matches WHERE team_id IN (SELECT public.get_my_team_ids())
    )
  );
