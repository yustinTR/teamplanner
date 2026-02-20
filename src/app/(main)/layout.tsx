import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthHydrator } from "@/components/organisms/AuthHydrator";
import { NavigationBar } from "@/components/organisms/NavigationBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Find team where user is coach or player
  const { data: teamAsCoach } = await supabase
    .from("teams")
    .select("*")
    .eq("created_by", user.id)
    .limit(1)
    .single();

  let team = teamAsCoach;

  if (!team) {
    const { data: playerRecord } = await supabase
      .from("players")
      .select("team_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (playerRecord) {
      const { data: playerTeam } = await supabase
        .from("teams")
        .select("*")
        .eq("id", playerRecord.team_id)
        .single();
      team = playerTeam;
    }
  }

  // Find current player record
  const playerQuery = team
    ? await supabase
        .from("players")
        .select("*")
        .eq("team_id", team.id)
        .eq("user_id", user.id)
        .limit(1)
        .single()
    : { data: null };

  return (
    <AuthHydrator user={user} team={team} player={playerQuery.data}>
      <div className="flex min-h-screen flex-col bg-neutral-50 pb-16">
        <main className="flex-1">{children}</main>
        <NavigationBar />
      </div>
    </AuthHydrator>
  );
}
