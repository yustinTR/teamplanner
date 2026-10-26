/** Shape returned by the `get_public_team_view` RPC (parent/carer "volglink"). */
export interface PublicLineupPosition {
  x: number;
  y: number;
  position_label: string;
  name: string;
}

export interface PublicMatch {
  id: string;
  opponent: string;
  match_date: string;
  home_away: "home" | "away";
  location: string | null;
  gathering_time: string | null;
  travel_time_minutes: number | null;
  status: "upcoming" | "completed" | "cancelled";
  score_home: number | null;
  score_away: number | null;
  lineup: { formation: string; positions: PublicLineupPosition[] } | null;
}

export interface PublicTeamView {
  found: boolean;
  team_name?: string;
  club_name?: string | null;
  team_type?: string;
  default_gathering_minutes?: number;
  matches?: PublicMatch[];
}
