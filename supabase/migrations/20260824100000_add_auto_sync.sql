-- Automatic season sync: teams with a linked import source are refreshed
-- daily by a cron job (matches, time changes, results).

-- Sync settings on teams
ALTER TABLE public.teams
  ADD COLUMN auto_sync_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN last_synced_at timestamptz;

-- ============================================================
-- sync_log: record of sync runs that changed something.
-- Written only by the cron job (service role, bypasses RLS).
-- The changes column feeds future push notifications.
-- ============================================================
CREATE TABLE public.sync_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  run_at timestamptz NOT NULL DEFAULT now(),
  matches_created integer NOT NULL DEFAULT 0,
  matches_updated integer NOT NULL DEFAULT 0,
  results_updated integer NOT NULL DEFAULT 0,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX idx_sync_log_team_id ON public.sync_log(team_id);

ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

-- Team admins can read the log; no client-side writes (service role only)
CREATE POLICY "Team admins can view sync log"
  ON public.sync_log FOR SELECT
  USING (public.is_team_admin(team_id));
