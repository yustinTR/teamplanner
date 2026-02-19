import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/register?next=/join/${code}`);
  }

  // Look up team by invite code
  const { data: team } = await supabase
    .from("teams")
    .select("id, name")
    .eq("invite_code", code)
    .single();

  if (!team) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Ongeldige link</h1>
          <p className="mt-2 text-muted-foreground">
            Deze uitnodigingslink is niet geldig.
          </p>
        </div>
      </main>
    );
  }

  // Check if user already in team
  const { data: existingPlayer } = await supabase
    .from("players")
    .select("id")
    .eq("team_id", team.id)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!existingPlayer) {
    // Create player record for this user
    await supabase.from("players").insert({
      team_id: team.id,
      user_id: user.id,
      name: user.user_metadata?.name ?? user.email ?? "Speler",
    });
  }

  redirect("/");
}
