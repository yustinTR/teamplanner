"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUpdateTeam } from "@/hooks/use-team";
import { Button } from "@/components/atoms/Button";
import { TeamForm } from "@/components/molecules/TeamForm";
import { InviteLink } from "@/components/molecules/InviteLink";
import { markInviteVisited } from "@/lib/onboarding";

export default function TeamSettingsPage() {
  const router = useRouter();
  const { currentTeam, isCoach } = useAuthStore();
  const updateTeam = useUpdateTeam();

  useEffect(() => {
    if (isCoach) {
      markInviteVisited();
    }
  }, [isCoach]);

  if (!currentTeam) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Geen team gevonden.</p>
      </div>
    );
  }

  if (!isCoach) {
    return (
      <div>
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
          <h1 className="text-2xl font-bold text-white">Teaminstellingen</h1>
        </div>
        <div className="-mt-2 px-4 pb-4">
          <div className="rounded-xl bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-medium">Uitnodigingslink</h2>
            <InviteLink inviteCode={currentTeam.invite_code} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 px-4 pb-6 pt-5">
        <h1 className="text-2xl font-bold text-white">Teaminstellingen</h1>
      </div>

      <div className="-mt-2 px-4 pb-4">
        <div className="mx-auto max-w-sm space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-md">
            <TeamForm
              defaultValues={{
                name: currentTeam.name,
                club_name: currentTeam.club_name ?? "",
                team_type: currentTeam.team_type,
                default_gathering_minutes: currentTeam.default_gathering_minutes,
                home_address: currentTeam.home_address,
              }}
              onSubmit={async (data) => {
                await updateTeam.mutateAsync({ id: currentTeam.id, ...data });
                router.refresh();
              }}
            />
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-medium">Uitnodigingslink</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Deel deze link zodat spelers je team kunnen joinen.
            </p>
            <InviteLink inviteCode={currentTeam.invite_code} />
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">
            <h2 className="mb-2 text-lg font-medium">Data importeren</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Importeer wedstrijden en spelers vanuit je clubwebsite.
            </p>
            <Button variant="outline" className="w-full gap-2" asChild>
              <Link href="/team/settings/import">
                <Download className="size-4" />
                Import van clubwebsite
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
