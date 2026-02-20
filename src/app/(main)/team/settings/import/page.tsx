"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { ImportPreview } from "@/components/organisms/ImportPreview";
import type {
  ParsedTeamData,
  ParsedMatch,
  ParsedPlayer,
} from "@/lib/voetbal-nl-parser";

type Step = "url" | "team" | "preview" | "done";

interface DiscoveredTeam {
  name: string;
  id: number;
}

export default function ImportVoetbalNlPage() {
  const router = useRouter();
  const { currentTeam, isCoach } = useAuthStore();

  const [step, setStep] = useState<Step>("url");
  const [teamUrl, setTeamUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discovery state
  const [clubAbbrev, setClubAbbrev] = useState("");
  const [teams, setTeams] = useState<DiscoveredTeam[]>([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<number>(0);

  // Player names (manual input)
  const [playerNamesText, setPlayerNamesText] = useState("");

  // Import state
  const [previewData, setPreviewData] = useState<ParsedTeamData | null>(null);
  const [importResult, setImportResult] = useState<{
    matchesCreated: number;
    matchesUpdated: number;
    playersCreated: number;
    errors: string[];
  } | null>(null);

  if (!currentTeam || !isCoach) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">
          Alleen coaches kunnen data importeren.
        </p>
      </div>
    );
  }

  async function handleDiscover(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/import-voetbal-nl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discover", teamUrl }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? "Er is een fout opgetreden.");
        return;
      }

      setClubAbbrev(json.clubAbbrev);
      setTeams(json.teams);
      if (json.teams.length > 0) {
        setSelectedTeamName(json.teams[0].name);
        setSelectedTeamId(json.teams[0].id);
      }
      setStep("team");
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setIsLoading(false);
    }
  }

  function parsePlayerNames(text: string): ParsedPlayer[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.toLowerCase() !== "anoniem")
      .map((name) => ({ name, position: null }));
  }

  async function handleImport() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/import-voetbal-nl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import",
          clubAbbrev,
          teamName: selectedTeamName,
          teamId: selectedTeamId,
          teamUrl,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? "Er is een fout opgetreden.");
        return;
      }

      // Merge manually entered player names into the data
      const players = parsePlayerNames(playerNamesText);
      setPreviewData({ ...json.data, players });
      setStep("preview");
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm(selected: {
    matches: ParsedMatch[];
    players: ParsedPlayer[];
  }) {
    setIsConfirming(true);
    setError(null);

    try {
      const response = await fetch("/api/import-voetbal-nl/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: currentTeam!.id,
          matches: selected.matches,
          players: selected.players,
          importSource: {
            clubAbbrev,
            teamName: selectedTeamName,
            teamId: selectedTeamId,
            teamUrl,
          },
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? "Er is een fout opgetreden.");
        return;
      }

      setImportResult(json.results);

      // Update the cached team in auth store with the new import source
      useAuthStore.getState().setCurrentTeam({
        ...currentTeam!,
        import_club_abbrev: clubAbbrev,
        import_team_name: selectedTeamName,
        import_team_id: selectedTeamId,
        import_team_url: teamUrl,
      });

      setStep("done");
    } catch {
      setError("Kan geen verbinding maken met de server.");
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-semibold">Import van clubwebsite</h1>

      <div className="mx-auto max-w-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Step 1: Enter club website URL */}
        {step === "url" && (
          <form onSubmit={handleDiscover} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Voer de URL in van je clubwebsite om wedstrijden te importeren.
              Dit werkt met VoetbalAssist clubwebsites.
            </p>

            <FormField label="Clubwebsite URL" htmlFor="vnl-url">
              <Input
                id="vnl-url"
                type="url"
                value={teamUrl}
                onChange={(e) => setTeamUrl(e.target.value)}
                placeholder="https://www.jouwclub.com"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Voer de URL van je clubwebsite in (bijv.
                https://www.cvvbefair.com)
              </p>
            </FormField>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Club zoeken..." : "Club zoeken"}
            </Button>
          </form>
        )}

        {/* Step 2: Select team */}
        {step === "team" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Club gevonden! Selecteer je team om wedstrijden op te halen.
            </p>

            <FormField label="Team" htmlFor="vnl-team">
              <select
                id="vnl-team"
                value={selectedTeamName}
                onChange={(e) => {
                  const team = teams.find((t) => t.name === e.target.value);
                  if (team) {
                    setSelectedTeamName(team.name);
                    setSelectedTeamId(team.id);
                  }
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Spelernamen (optioneel)"
              htmlFor="vnl-players"
            >
              <textarea
                id="vnl-players"
                value={playerNamesText}
                onChange={(e) => setPlayerNamesText(e.target.value)}
                placeholder={"Jan Jansen\nPiet Pietersen\nKlaas de Vries"}
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Plak spelernamen uit je clubwebsite, één naam per regel.
              </p>
            </FormField>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("url")}
              >
                Terug
              </Button>
              <Button
                className="flex-1"
                onClick={handleImport}
                disabled={isLoading || !selectedTeamName}
              >
                {isLoading ? "Ophalen..." : "Gegevens ophalen"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === "preview" && previewData && (
          <ImportPreview
            teamName={previewData.teamName}
            matches={previewData.matches}
            players={previewData.players}
            onConfirm={handleConfirm}
            onCancel={() => setStep("team")}
            isConfirming={isConfirming}
          />
        )}

        {/* Step 4: Done */}
        {step === "done" && importResult && (
          <div className="space-y-4">
            <div className="rounded-lg bg-success/10 p-4 text-sm">
              <p className="font-medium text-success">Import geslaagd!</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>{importResult.matchesCreated} wedstrijden aangemaakt</li>
                {importResult.matchesUpdated > 0 && (
                  <li>{importResult.matchesUpdated} wedstrijden bijgewerkt</li>
                )}
                <li>{importResult.playersCreated} spelers aangemaakt</li>
              </ul>
              {importResult.errors.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-danger">Waarschuwingen:</p>
                  <ul className="mt-1 space-y-1">
                    {importResult.errors.map((err, i) => (
                      <li key={i} className="text-xs text-danger">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => router.push("/team/settings")}
            >
              Terug naar instellingen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
