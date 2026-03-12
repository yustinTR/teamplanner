-- Add missing indexes on foreign key and frequently queried columns
CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_id ON public.matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_availability_match_id ON public.availability(match_id);
CREATE INDEX IF NOT EXISTS idx_availability_player_id ON public.availability(player_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON public.event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_training_plans_team_id ON public.training_plans(team_id);

-- Add check constraints for data integrity
ALTER TABLE public.players
  ADD CONSTRAINT chk_jersey_number
  CHECK (jersey_number IS NULL OR (jersey_number >= 1 AND jersey_number <= 99));

ALTER TABLE public.match_stats
  ADD CONSTRAINT chk_match_stats_non_negative
  CHECK (goals >= 0 AND assists >= 0 AND yellow_cards >= 0 AND red_cards >= 0);

ALTER TABLE public.matches
  ADD CONSTRAINT chk_scores_both_or_none
  CHECK (
    (score_home IS NULL AND score_away IS NULL)
    OR (score_home IS NOT NULL AND score_away IS NOT NULL)
  );
