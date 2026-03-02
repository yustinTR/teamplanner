"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@supabase/supabase-js";
import type { Team, Player, TeamMembership } from "@/types";

interface AuthHydratorProps {
  user: User;
  team: Team | null;
  player: Player | null;
  myTeams: TeamMembership[];
  children: React.ReactNode;
}

export function AuthHydrator({ user, team, player, myTeams, children }: AuthHydratorProps) {
  const { setUser, setCurrentTeam, setCurrentPlayer, setMyTeams } = useAuthStore();

  useEffect(() => {
    setUser(user);
    setCurrentTeam(team);
    setCurrentPlayer(player);
    setMyTeams(myTeams);
  }, [user, team, player, myTeams, setUser, setCurrentTeam, setCurrentPlayer, setMyTeams]);

  return <>{children}</>;
}
