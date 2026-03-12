-- Add is_admin flag to players table
-- Allows coaches to grant admin/coach rights to players (e.g. captains, assistants)
-- Players with is_admin = true get the same permissions as the team creator

ALTER TABLE public.players
  ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- ============================================================
-- Helper function: check if current user is coach or admin for a team
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_team_admin(check_team_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teams WHERE id = check_team_id AND created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.players
    WHERE team_id = check_team_id
      AND user_id = auth.uid()
      AND is_admin = true
      AND is_active = true
  )
$$;

-- ============================================================
-- Drop and recreate all "Coach can manage..." policies
-- to include admin players
-- ============================================================

-- PLAYERS
DROP POLICY IF EXISTS "Coach can manage team players" ON public.players;
CREATE POLICY "Coach can manage team players"
  ON public.players FOR ALL
  USING (public.is_team_admin(team_id))
  WITH CHECK (public.is_team_admin(team_id));

-- MATCHES
DROP POLICY IF EXISTS "Coach can manage team matches" ON public.matches;
CREATE POLICY "Coach can manage team matches"
  ON public.matches FOR ALL
  USING (public.is_team_admin(team_id))
  WITH CHECK (public.is_team_admin(team_id));

-- AVAILABILITY
DROP POLICY IF EXISTS "Coach can manage team availability" ON public.availability;
CREATE POLICY "Coach can manage team availability"
  ON public.availability FOR ALL
  USING (
    player_id IN (
      SELECT p.id FROM public.players p
      WHERE public.is_team_admin(p.team_id)
    )
  )
  WITH CHECK (
    player_id IN (
      SELECT p.id FROM public.players p
      WHERE public.is_team_admin(p.team_id)
    )
  );

-- LINEUPS
DROP POLICY IF EXISTS "Coach can manage team lineups" ON public.lineups;
CREATE POLICY "Coach can manage team lineups"
  ON public.lineups FOR ALL
  USING (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE public.is_team_admin(m.team_id)
    )
  )
  WITH CHECK (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE public.is_team_admin(m.team_id)
    )
  );

-- MATCH PLAYERS
DROP POLICY IF EXISTS "Coach can manage match players" ON public.match_players;
CREATE POLICY "Coach can manage match players"
  ON public.match_players FOR ALL
  USING (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE public.is_team_admin(m.team_id)
    )
  )
  WITH CHECK (
    match_id IN (
      SELECT m.id FROM public.matches m
      WHERE public.is_team_admin(m.team_id)
    )
  );

-- EVENTS
DROP POLICY IF EXISTS "Coach can manage events" ON public.events;
CREATE POLICY "Coach can manage events"
  ON public.events FOR ALL
  USING (public.is_team_admin(team_id))
  WITH CHECK (public.is_team_admin(team_id));

-- EVENT ATTENDANCE
DROP POLICY IF EXISTS "Coach can manage event attendance" ON public.event_attendance;
CREATE POLICY "Coach can manage event attendance"
  ON public.event_attendance FOR ALL
  USING (
    event_id IN (
      SELECT e.id FROM public.events e
      WHERE public.is_team_admin(e.team_id)
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT e.id FROM public.events e
      WHERE public.is_team_admin(e.team_id)
    )
  );

-- EVENT TASKS
DROP POLICY IF EXISTS "Coach can manage event tasks" ON public.event_tasks;
CREATE POLICY "Coach can manage event tasks"
  ON public.event_tasks FOR ALL
  USING (
    event_id IN (
      SELECT e.id FROM public.events e
      WHERE public.is_team_admin(e.team_id)
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT e.id FROM public.events e
      WHERE public.is_team_admin(e.team_id)
    )
  );

-- TRAINING PLANS
DROP POLICY IF EXISTS "Coach can manage training plans" ON public.training_plans;
CREATE POLICY "Coach can manage training plans"
  ON public.training_plans FOR ALL
  USING (public.is_team_admin(team_id))
  WITH CHECK (public.is_team_admin(team_id));

-- TRAINING PLAN EXERCISES
DROP POLICY IF EXISTS "Coach can manage training plan exercises" ON public.training_plan_exercises;
CREATE POLICY "Coach can manage training plan exercises"
  ON public.training_plan_exercises FOR ALL
  USING (
    plan_id IN (
      SELECT tp.id FROM public.training_plans tp
      WHERE public.is_team_admin(tp.team_id)
    )
  )
  WITH CHECK (
    plan_id IN (
      SELECT tp.id FROM public.training_plans tp
      WHERE public.is_team_admin(tp.team_id)
    )
  );

-- MATCH STATS
DROP POLICY IF EXISTS "Coach can manage match stats" ON public.match_stats;
CREATE POLICY "Coach can manage match stats"
  ON public.match_stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_stats.match_id
      AND public.is_team_admin(m.team_id)
    )
  );
