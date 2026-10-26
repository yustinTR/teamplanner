-- Read-only "volglink" for parents and carers: a team-level token that opens a
-- public page with the programme and the published lineups. No account needed.
-- The token is null until the coach switches the link on; switching it off
-- clears the token, which invalidates the old link.

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS share_token text UNIQUE;

CREATE OR REPLACE FUNCTION public.get_public_team_view(share_token_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  team_record RECORD;
  matches_json jsonb;
BEGIN
  IF share_token_input IS NULL OR length(share_token_input) < 16 THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT id, name, club_name, team_type, default_gathering_minutes
  INTO team_record
  FROM public.teams
  WHERE share_token = share_token_input;

  IF team_record.id IS NULL THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'opponent', m.opponent,
      'match_date', m.match_date,
      'home_away', m.home_away,
      'location', m.location,
      'gathering_time', m.gathering_time,
      'travel_time_minutes', m.travel_time_minutes,
      'status', m.status,
      'score_home', m.score_home,
      'score_away', m.score_away,
      'lineup', (
        SELECT jsonb_build_object(
          'formation', l.formation,
          'positions', COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
              'x', (pos->>'x')::numeric,
              'y', (pos->>'y')::numeric,
              'position_label', pos->>'position_label',
              'name', COALESCE(p.name, mp.name, '?')
            ))
            FROM jsonb_array_elements(l.positions) AS pos
            LEFT JOIN public.players p ON p.id::text = pos->>'player_id'
            LEFT JOIN public.match_players mp ON mp.id::text = pos->>'player_id'
            WHERE COALESCE(pos->>'player_id', '') <> ''
          ), '[]'::jsonb)
        )
        FROM public.lineups l
        WHERE l.match_id = m.id
          AND jsonb_array_length(COALESCE(l.positions, '[]'::jsonb)) > 0
      )
    ) ORDER BY m.match_date
  ), '[]'::jsonb)
  INTO matches_json
  FROM public.matches m
  WHERE m.team_id = team_record.id
    AND m.status <> 'cancelled'
    AND m.match_date >= now() - interval '14 days';

  RETURN jsonb_build_object(
    'found', true,
    'team_name', team_record.name,
    'club_name', team_record.club_name,
    'team_type', team_record.team_type,
    'default_gathering_minutes', team_record.default_gathering_minutes,
    'matches', matches_json
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_team_view(text) TO anon, authenticated;
