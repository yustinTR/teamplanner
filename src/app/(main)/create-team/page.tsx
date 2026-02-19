"use client";

import { useRouter } from "next/navigation";
import { TeamForm } from "@/components/molecules/TeamForm";
import { useCreateTeam } from "@/hooks/use-team";

export default function CreateTeamPage() {
  const router = useRouter();
  const createTeam = useCreateTeam();

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Team aanmaken</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Maak je team aan om te beginnen
        </p>
      </div>

      <div className="mx-auto max-w-sm">
        <TeamForm
          submitLabel="Team aanmaken"
          onSubmit={async (data) => {
            await createTeam.mutateAsync(data);
            router.push("/");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
