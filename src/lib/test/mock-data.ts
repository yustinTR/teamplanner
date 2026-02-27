import type { Team, Player, Match, Availability, AvailabilityWithPlayer, MatchPlayer, Event, EventAttendance, EventTask, Exercise, TrainingPlan, TrainingPlanExercise, MatchStats } from "@/types";
import type { LineupPosition } from "@/types/lineup";
import type { User } from "@supabase/supabase-js";

// --- Factory helpers ---

let counter = 0;
function uid(): string {
  counter += 1;
  return `mock-${counter.toString().padStart(4, "0")}`;
}

// --- Team ---

export function createMockTeam(overrides?: Partial<Team>): Team {
  const id = overrides?.id ?? uid();
  return {
    id,
    name: "FC Testteam",
    club_name: null,
    created_by: "user-coach-001",
    invite_code: "ABC123",
    formation: "4-3-3",
    team_type: "senioren",
    logo_url: null,
    default_gathering_minutes: 60,
    home_address: null,
    import_club_abbrev: null,
    import_team_id: null,
    import_team_name: null,
    import_team_url: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Player ---

export function createMockPlayer(overrides?: Partial<Player>): Player {
  const id = overrides?.id ?? uid();
  return {
    id,
    team_id: "team-001",
    user_id: null,
    name: "Test Speler",
    primary_position: "CM",
    secondary_positions: [],
    role: "player",
    jersey_number: 10,
    photo_url: null,
    notes: null,
    skills: {},
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Match ---

export function createMockMatch(overrides?: Partial<Match>): Match {
  const id = overrides?.id ?? uid();
  return {
    id,
    team_id: "team-001",
    opponent: "FC Tegenstander",
    match_date: "2026-03-15T14:00:00Z",
    location: "Sportpark De Toekomst",
    home_away: "home",
    status: "upcoming",
    score_home: null,
    score_away: null,
    notes: null,
    gathering_time: null,
    travel_time_minutes: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Availability ---

export function createMockAvailability(
  overrides?: Partial<Availability>
): Availability {
  const id = overrides?.id ?? uid();
  return {
    id,
    match_id: "match-001",
    player_id: "player-001",
    status: "available",
    responded_at: "2026-03-10T12:00:00Z",
    ...overrides,
  };
}

export function createMockAvailabilityWithPlayer(
  overrides?: Partial<AvailabilityWithPlayer>
): AvailabilityWithPlayer {
  const availability = createMockAvailability(overrides);
  return {
    ...availability,
    players: overrides?.players ?? createMockPlayer({ id: availability.player_id }),
  };
}

// --- Lineup ---

export function createMockLineup(overrides?: {
  id?: string;
  match_id?: string;
  formation?: string;
  positions?: LineupPosition[];
  created_at?: string;
  updated_at?: string;
}) {
  return {
    id: overrides?.id ?? uid(),
    match_id: overrides?.match_id ?? "match-001",
    formation: overrides?.formation ?? "4-3-3",
    positions: (overrides?.positions ?? []) as unknown as import("@/lib/supabase/types").Json,
    created_at: overrides?.created_at ?? "2026-01-01T00:00:00Z",
    updated_at: overrides?.updated_at ?? "2026-01-01T00:00:00Z",
  };
}

// --- User ---

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "user-coach-001",
    app_metadata: {},
    user_metadata: { name: "Coach Test" },
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  } as User;
}

// --- Match Player (leen-speler) ---

export function createMockMatchPlayer(overrides?: Partial<MatchPlayer>): MatchPlayer {
  const id = overrides?.id ?? uid();
  return {
    id,
    match_id: "match-001",
    name: "Leen Speler",
    primary_position: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Event ---

export function createMockEvent(overrides?: Partial<Event>): Event {
  const id = overrides?.id ?? uid();
  return {
    id,
    team_id: "team-001",
    title: "Teamuitje",
    description: null,
    event_date: "2026-04-01T18:00:00Z",
    end_date: null,
    location: null,
    notes: null,
    created_by: "user-coach-001",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Event Attendance ---

export function createMockEventAttendance(overrides?: Partial<EventAttendance>): EventAttendance {
  const id = overrides?.id ?? uid();
  return {
    id,
    event_id: "event-001",
    player_id: "player-001",
    status: "coming",
    responded_at: "2026-03-10T12:00:00Z",
    ...overrides,
  };
}

// --- Event Task ---

export function createMockEventTask(overrides?: Partial<EventTask>): EventTask {
  const id = overrides?.id ?? uid();
  return {
    id,
    event_id: "event-001",
    title: "Bier regelen",
    description: null,
    assigned_to: null,
    deadline: null,
    is_done: false,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Exercise ---

export function createMockExercise(overrides?: Partial<Exercise>): Exercise {
  const id = overrides?.id ?? uid();
  return {
    id,
    title: "Rondo 4 tegen 2",
    description: "Vier spelers spelen de bal rond terwijl twee verdedigers proberen te onderscheppen.",
    category: "warming_up",
    difficulty: "basis",
    team_types: ["senioren", "jo19_jo17"],
    min_players: 6,
    max_players: 12,
    duration_minutes: 10,
    setup_instructions: "Maak een cirkel van ca. 8x8 meter.",
    variations: "Verklein het veld voor meer druk.",
    video_url: null,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Training Plan ---

export function createMockTrainingPlan(overrides?: Partial<TrainingPlan>): TrainingPlan {
  const id = overrides?.id ?? uid();
  return {
    id,
    team_id: "team-001",
    event_id: null,
    title: "Passing & positiespel",
    notes: null,
    total_duration_minutes: 75,
    created_by: "user-coach-001",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Training Plan Exercise ---

export function createMockTrainingPlanExercise(overrides?: Partial<TrainingPlanExercise>): TrainingPlanExercise {
  const id = overrides?.id ?? uid();
  return {
    id,
    plan_id: "plan-001",
    exercise_id: "ex-001",
    sort_order: 0,
    ...overrides,
  };
}

// --- Match Stats ---

export function createMockMatchStats(overrides?: Partial<MatchStats>): MatchStats {
  const id = overrides?.id ?? uid();
  return {
    id,
    match_id: "match-001",
    player_id: "player-001",
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// --- Pre-built arrays ---

export const MOCK_TEAM = createMockTeam({ id: "team-001", created_by: "user-coach-001" });

export const MOCK_PLAYERS: Player[] = [
  createMockPlayer({ id: "player-001", name: "Jan de Vries", jersey_number: 1, primary_position: "K", team_id: "team-001", user_id: "user-coach-001" }),
  createMockPlayer({ id: "player-002", name: "Pieter Bakker", jersey_number: 4, primary_position: "CB", team_id: "team-001" }),
  createMockPlayer({ id: "player-003", name: "Klaas Jansen", jersey_number: 8, primary_position: "CM", team_id: "team-001" }),
  createMockPlayer({ id: "player-004", name: "Willem Visser", jersey_number: 9, primary_position: "ST", team_id: "team-001" }),
  createMockPlayer({ id: "player-005", name: "Henk Smit", jersey_number: 11, primary_position: "LW", team_id: "team-001" }),
  createMockPlayer({ id: "player-006", name: "Gerard Mulder", jersey_number: null, primary_position: null, secondary_positions: [], role: "staff", team_id: "team-001" }),
];

export const MOCK_MATCHES: Match[] = [
  createMockMatch({ id: "match-001", opponent: "FC Vooruit", match_date: "2026-03-15T14:00:00Z", status: "upcoming", team_id: "team-001" }),
  createMockMatch({ id: "match-002", opponent: "SV De Adelaar", match_date: "2026-03-08T14:00:00Z", status: "completed", score_home: 3, score_away: 1, team_id: "team-001" }),
  createMockMatch({ id: "match-003", opponent: "VV Oranje", match_date: "2026-04-05T14:00:00Z", status: "upcoming", home_away: "away", team_id: "team-001" }),
];

export const MOCK_EXERCISES: Exercise[] = [
  createMockExercise({ id: "ex-001", title: "Rondo 4 tegen 2", category: "warming_up", difficulty: "basis", duration_minutes: 10, min_players: 6, max_players: 12 }),
  createMockExercise({ id: "ex-002", title: "Passing in driehoek", category: "passing", difficulty: "basis", duration_minutes: 10, min_players: 3, max_players: 12 }),
  createMockExercise({ id: "ex-003", title: "Positiespel 4v4+2", category: "positiespel", difficulty: "gemiddeld", duration_minutes: 15, min_players: 10, max_players: 14 }),
  createMockExercise({ id: "ex-004", title: "1 tegen 1 verdedigen", category: "verdedigen", difficulty: "basis", duration_minutes: 10, min_players: 4, max_players: 12 }),
  createMockExercise({ id: "ex-005", title: "Afwerken uit de draai", category: "afwerken", difficulty: "gemiddeld", duration_minutes: 12, min_players: 4, max_players: 10 }),
];

export const MOCK_TRAINING_PLANS: TrainingPlan[] = [
  createMockTrainingPlan({ id: "plan-001", title: "Passing & positiespel", total_duration_minutes: 75 }),
  createMockTrainingPlan({ id: "plan-002", title: "Verdedigende training", total_duration_minutes: 60, notes: "Focus op 1v1 en schuiven" }),
];

export const MOCK_AVAILABILITY: AvailabilityWithPlayer[] = [
  createMockAvailabilityWithPlayer({ id: "av-001", match_id: "match-001", player_id: "player-001", status: "available", players: MOCK_PLAYERS[0] }),
  createMockAvailabilityWithPlayer({ id: "av-002", match_id: "match-001", player_id: "player-002", status: "available", players: MOCK_PLAYERS[1] }),
  createMockAvailabilityWithPlayer({ id: "av-003", match_id: "match-001", player_id: "player-003", status: "maybe", players: MOCK_PLAYERS[2] }),
  createMockAvailabilityWithPlayer({ id: "av-004", match_id: "match-001", player_id: "player-004", status: "unavailable", players: MOCK_PLAYERS[3] }),
];
