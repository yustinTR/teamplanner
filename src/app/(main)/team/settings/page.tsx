"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useUpdateTeam } from "@/hooks/use-team";
import { TeamForm } from "@/components/molecules/TeamForm";
import { InviteLink } from "@/components/molecules/InviteLink";
import { useRouter } from "next/navigation";

export default function TeamSettingsPage() {
  const router = useRouter();
  const { currentTeam, isCoach } = useAuthStore();
  const updateTeam = useUpdateTeam();

  if (!currentTeam) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Geen team gevonden.</p>
      </div>
    );
  }

  if (!isCoach) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Teaminstellingen</h1>
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-medium">Uitnodigingslink</h2>
          <InviteLink inviteCode={currentTeam.invite_code} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-semibold">Teaminstellingen</h1>

      <div className="mx-auto max-w-sm space-y-8">
        <TeamForm
          defaultValues={{
            name: currentTeam.name,
            club_name: currentTeam.club_name ?? "",
          }}
          onSubmit={async (data) => {
            await updateTeam.mutateAsync({ id: currentTeam.id, ...data });
            router.refresh();
          }}
        />

        <div>
          <h2 className="mb-2 text-lg font-medium">Uitnodigingslink</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Deel deze link zodat spelers je team kunnen joinen.
          </p>
          <InviteLink inviteCode={currentTeam.invite_code} />
        </div>
      </div>
    </div>
  );
}
