"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamForm } from "@/components/molecules/TeamForm";
import { ToolHandoffNotice } from "@/components/molecules/ToolHandoffNotice";
import { useCreateTeam } from "@/hooks/use-team";
import { trackEvent } from "@/lib/gtm";
import { useToolHandoff } from "@/hooks/use-tool-handoff";
import { clearToolHandoff, teamTypeForFormat } from "@/lib/tool-handoff";

export default function CreateTeamPage() {
  const router = useRouter();
  const createTeam = useCreateTeam();
  const handoff = useToolHandoff();
  const [addPlayers, setAddPlayers] = useState(true);

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Team aanmaken</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Maak je team aan om te beginnen
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-4">
        {handoff && handoff.names.length > 0 && (
          <ToolHandoffNotice
            tool={handoff.tool}
            names={handoff.names}
            checked={addPlayers}
            onCheckedChange={setAddPlayers}
          />
        )}
        <TeamForm
          key={handoff ? "handoff" : "empty"}
          defaultValues={
            handoff
              ? { name: handoff.teamName, team_type: teamTypeForFormat(handoff.formatKey) }
              : undefined
          }
          submitLabel="Team aanmaken"
          onSubmit={async (data) => {
            const playerNames = handoff && addPlayers ? handoff.names : [];
            await createTeam.mutateAsync({ ...data, playerNames });
            if (handoff) {
              trackEvent("tool_handoff_used", {
                tool: handoff.tool,
                players: String(playerNames.length),
              });
              clearToolHandoff();
            }
            router.push("/");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
