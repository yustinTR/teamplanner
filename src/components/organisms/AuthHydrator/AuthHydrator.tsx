"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@supabase/supabase-js";
import type { Team, Player } from "@/types";

interface AuthHydratorProps {
  user: User;
  team: Team | null;
  player: Player | null;
  children: React.ReactNode;
}

export function AuthHydrator({ user, team, player, children }: AuthHydratorProps) {
  const { setUser, setCurrentTeam, setCurrentPlayer } = useAuthStore();

  useEffect(() => {
    setUser(user);
    setCurrentTeam(team);
    setCurrentPlayer(player);
  }, [user, team, player, setUser, setCurrentTeam, setCurrentPlayer]);

  return <>{children}</>;
}
