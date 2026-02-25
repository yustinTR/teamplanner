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

  const userName = user.user_metadata?.name ?? user.email ?? "Speler";

  // Use SECURITY DEFINER RPC to bypass RLS for team lookup + player creation
  const { data, error } = await supabase.rpc("join_team_by_invite_code", {
    invite_code_input: code,
    user_name: userName,
  });

  const result = data as { success?: boolean; error?: string } | null;

  if (error || !result?.success) {
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

  redirect("/dashboard");
}
