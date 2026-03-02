import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth-store";
import { createMockUser, createMockTeam, createMockPlayer } from "@/lib/test/mock-data";

describe("auth-store", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.currentTeam).toBeNull();
    expect(state.currentPlayer).toBeNull();
    expect(state.isCoach).toBe(false);
    expect(state.myTeams).toEqual([]);
  });

  describe("setUser", () => {
    it("sets user", () => {
      const user = createMockUser({ id: "u1" });
      useAuthStore.getState().setUser(user);
      expect(useAuthStore.getState().user).toEqual(user);
    });

    it("clears user with null", () => {
      useAuthStore.getState().setUser(createMockUser());
      useAuthStore.getState().setUser(null);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe("setCurrentTeam", () => {
    it("sets isCoach to true when team.created_by matches user.id", () => {
      const user = createMockUser({ id: "coach-123" });
      const team = createMockTeam({ created_by: "coach-123" });

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setCurrentTeam(team);

      expect(useAuthStore.getState().currentTeam).toEqual(team);
      expect(useAuthStore.getState().isCoach).toBe(true);
    });

    it("sets isCoach to false when team.created_by does not match user.id", () => {
      const user = createMockUser({ id: "player-456" });
      const team = createMockTeam({ created_by: "coach-123" });

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setCurrentTeam(team);

      expect(useAuthStore.getState().isCoach).toBe(false);
    });

    it("sets isCoach to false when team is null", () => {
      const user = createMockUser({ id: "coach-123" });
      const team = createMockTeam({ created_by: "coach-123" });

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setCurrentTeam(team);
      expect(useAuthStore.getState().isCoach).toBe(true);

      useAuthStore.getState().setCurrentTeam(null);
      expect(useAuthStore.getState().isCoach).toBe(false);
    });
  });

  describe("setCurrentPlayer", () => {
    it("sets current player", () => {
      const player = createMockPlayer({ id: "p1" });
      useAuthStore.getState().setCurrentPlayer(player);
      expect(useAuthStore.getState().currentPlayer).toEqual(player);
    });
  });

  describe("setMyTeams", () => {
    it("sets my teams array", () => {
      const team1 = createMockTeam({ id: "t1", name: "Team A" });
      const team2 = createMockTeam({ id: "t2", name: "Team B" });
      const memberships = [
        { team: team1, role: "coach" as const, playerId: null },
        { team: team2, role: "player" as const, playerId: "p1" },
      ];

      useAuthStore.getState().setMyTeams(memberships);
      expect(useAuthStore.getState().myTeams).toEqual(memberships);
    });

    it("replaces existing teams", () => {
      const team1 = createMockTeam({ id: "t1" });
      useAuthStore.getState().setMyTeams([{ team: team1, role: "coach", playerId: null }]);

      const team2 = createMockTeam({ id: "t2" });
      useAuthStore.getState().setMyTeams([{ team: team2, role: "player", playerId: "p1" }]);

      expect(useAuthStore.getState().myTeams).toHaveLength(1);
      expect(useAuthStore.getState().myTeams[0].team.id).toBe("t2");
    });
  });

  describe("reset", () => {
    it("resets all state to initial values", () => {
      const team = createMockTeam();
      useAuthStore.getState().setUser(createMockUser());
      useAuthStore.getState().setCurrentTeam(team);
      useAuthStore.getState().setCurrentPlayer(createMockPlayer());
      useAuthStore.getState().setMyTeams([{ team, role: "coach", playerId: null }]);

      useAuthStore.getState().reset();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.currentTeam).toBeNull();
      expect(state.currentPlayer).toBeNull();
      expect(state.isCoach).toBe(false);
      expect(state.myTeams).toEqual([]);
    });
  });
});
