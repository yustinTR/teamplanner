import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AuthHydrator } from "@/components/organisms/AuthHydrator";
import { NavigationBar } from "@/components/organisms/NavigationBar";
import { TeamSwitcher } from "@/components/molecules/TeamSwitcher";
import type { Team, TeamMembership } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch all teams where user is coach or player — run both lookups in parallel
  const [{ data: coachTeams }, { data: playerRecords }] = await Promise.all([
    supabase
      .from("teams")
      .select("*")
      .eq("created_by", user.id),
    supabase
      .from("players")
      .select("id, team_id")
      .eq("user_id", user.id)
      .eq("is_active", true),
  ]);

  // Build memberships: coach teams first
  const coachTeamIds = new Set((coachTeams ?? []).map((t) => t.id));
  const myTeams: TeamMembership[] = (coachTeams ?? []).map((team) => ({
    team,
    role: "coach" as const,
    playerId: playerRecords?.find((p) => p.team_id === team.id)?.id ?? null,
  }));

  // Player-only teams (not already a coach)
  const playerOnlyRecords = (playerRecords ?? []).filter(
    (p) => !coachTeamIds.has(p.team_id)
  );

  if (playerOnlyRecords.length > 0) {
    const playerTeamIds = playerOnlyRecords.map((p) => p.team_id);
    const { data: playerTeams } = await supabase
      .from("teams")
      .select("*")
      .in("id", playerTeamIds);

    for (const team of playerTeams ?? []) {
      const record = playerOnlyRecords.find((p) => p.team_id === team.id);
      myTeams.push({
        team,
        role: "player",
        playerId: record?.id ?? null,
      });
    }
  }

  // Determine selected team from cookie, fallback to first
  const cookieStore = await cookies();
  const lastTeamId = cookieStore.get("tp-last-team-id")?.value;
  let selectedTeam: Team | null = null;

  if (lastTeamId) {
    selectedTeam = myTeams.find((m) => m.team.id === lastTeamId)?.team ?? null;
  }
  if (!selectedTeam && myTeams.length > 0) {
    selectedTeam = myTeams[0].team;
  }

  // Find current player record for selected team
  const playerQuery = selectedTeam
    ? await supabase
        .from("players")
        .select("*")
        .eq("team_id", selectedTeam.id)
        .eq("user_id", user.id)
        .limit(1)
        .single()
    : { data: null };

  return (
    <AuthHydrator user={user} team={selectedTeam} player={playerQuery.data} myTeams={myTeams}>
      <div className="flex min-h-screen flex-col bg-neutral-50 pb-16">
        <TeamSwitcher />
        <main className="flex-1">{children}</main>
        <footer className="flex items-center justify-center gap-3 py-6 text-xs text-muted-foreground/50">
          <Link href="/voorwaarden" className="hover:text-muted-foreground">
            Voorwaarden
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-muted-foreground">
            Privacy
          </Link>
        </footer>
        <NavigationBar />
      </div>
    </AuthHydrator>
  );
}
