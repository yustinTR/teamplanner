import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Team, Player, TeamMembership } from "@/types";

interface AuthState {
  user: User | null;
  currentTeam: Team | null;
  currentPlayer: Player | null;
  isCoach: boolean;
  myTeams: TeamMembership[];
  setUser: (user: User | null) => void;
  setCurrentTeam: (team: Team | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setMyTeams: (teams: TeamMembership[]) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  currentTeam: null,
  currentPlayer: null,
  isCoach: false,
  myTeams: [],

  setUser: (user) => set({ user }),

  setCurrentTeam: (team) => {
    const state = get();
    set({
      currentTeam: team,
      isCoach: team
        ? team.created_by === state.user?.id || (state.currentPlayer?.is_admin ?? false)
        : false,
    });
  },

  setCurrentPlayer: (player) => {
    const state = get();
    set({
      currentPlayer: player,
      isCoach: state.currentTeam
        ? state.currentTeam.created_by === state.user?.id || (player?.is_admin ?? false)
        : false,
    });
  },

  setMyTeams: (teams) => set({ myTeams: teams }),

  reset: () =>
    set({
      user: null,
      currentTeam: null,
      currentPlayer: null,
      isCoach: false,
      myTeams: [],
    }),
}));
