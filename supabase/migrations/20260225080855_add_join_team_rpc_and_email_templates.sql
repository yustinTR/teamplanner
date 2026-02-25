-- Add SECURITY DEFINER function to handle team joining via invite code.
-- This bypasses RLS so any authenticated user can join a team,
-- even though they don't yet have access to the teams/players tables.

CREATE OR REPLACE FUNCTION public.join_team_by_invite_code(
  invite_code_input text,
  user_name text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  team_record RECORD;
  existing_player_id uuid;
  imported_player_id uuid;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'not_authenticated');
  END IF;

  -- Look up team by invite code
  SELECT id, name INTO team_record
  FROM public.teams
  WHERE public.teams.invite_code = invite_code_input;

  IF team_record.id IS NULL THEN
    RETURN jsonb_build_object('error', 'invalid_code');
  END IF;

  -- Check if user is already in team
  SELECT id INTO existing_player_id
  FROM public.players
  WHERE team_id = team_record.id AND user_id = current_user_id
  LIMIT 1;

  IF existing_player_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'team_name', team_record.name, 'already_member', true);
  END IF;

  -- Check for imported player with matching name
  SELECT id INTO imported_player_id
  FROM public.players
  WHERE team_id = team_record.id AND user_id IS NULL AND lower(name) = lower(user_name)
  LIMIT 1;

  IF imported_player_id IS NOT NULL THEN
    -- Claim imported player record
    UPDATE public.players
    SET user_id = current_user_id, name = user_name
    WHERE id = imported_player_id;
  ELSE
    -- Create new player record
    INSERT INTO public.players (team_id, user_id, name)
    VALUES (team_record.id, current_user_id, user_name);
  END IF;

  RETURN jsonb_build_object('success', true, 'team_name', team_record.name, 'already_member', false);
END;
$$;
