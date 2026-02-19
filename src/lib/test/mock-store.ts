import { useAuthStore } from "@/stores/auth-store";
import { createMockUser, createMockPlayer, MOCK_TEAM } from "./mock-data";
import type { Team, Player } from "@/types";
import type { User } from "@supabase/supabase-js";

interface MockAuthOptions {
  isCoach?: boolean;
  team?: Team | null;
  player?: Player | null;
  user?: User | null;
}

/**
 * Sets the auth store with mock data. Call in Storybook decorators or tests.
 */
export function mockAuthStore(options: MockAuthOptions = {}) {
  const {
    isCoach = true,
    team = MOCK_TEAM,
    player = createMockPlayer({ id: "player-001", user_id: "user-coach-001" }),
    user = createMockUser(),
  } = options;

  useAuthStore.setState({
    user,
    currentTeam: team,
    currentPlayer: player,
    isCoach,
  });
}
