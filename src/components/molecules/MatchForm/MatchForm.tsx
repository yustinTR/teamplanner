"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { FormField } from "@/components/molecules/FormField";
import { HOME_AWAY_LABELS } from "@/lib/constants";
import { toDatetimeLocal, calculateGatheringTime, formatTime } from "@/lib/utils";
import type { HomeAway } from "@/types";

interface MatchFormData {
  opponent: string;
  match_date: string;
  location: string | null;
  home_away: HomeAway;
  notes: string | null;
  gathering_time: string | null;
  travel_time_minutes: number | null;
}

interface MatchFormProps {
  defaultValues?: Partial<MatchFormData>;
  onSubmit: (data: MatchFormData) => Promise<void>;
  submitLabel?: string;
  defaultGatheringMinutes?: number;
  homeAddress?: string | null;
}

export function MatchForm({
  defaultValues,
  onSubmit,
  submitLabel = "Opslaan",
  defaultGatheringMinutes = 60,
  homeAddress,
}: MatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [homeAway, setHomeAway] = useState<HomeAway>(defaultValues?.home_away ?? "home");
  const [travelMinutes, setTravelMinutes] = useState<string>(
    defaultValues?.travel_time_minutes?.toString() ?? ""
  );
  const [calculatingTravel, setCalculatingTravel] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [gatheringOverride, setGatheringOverride] = useState<string>(
    defaultValues?.gathering_time ? toDatetimeLocal(defaultValues.gathering_time) : ""
  );
  const [showOverride, setShowOverride] = useState(!!defaultValues?.gathering_time);
  const [matchDateValue, setMatchDateValue] = useState<string>(
    defaultValues?.match_date ? toDatetimeLocal(defaultValues.match_date) : ""
  );
  const [locationValue, setLocationValue] = useState<string>(
    defaultValues?.location ?? ""
  );

  const isAway = homeAway === "away";
  const travelMinutesNum = travelMinutes ? parseInt(travelMinutes, 10) : null;

  const autoGatheringTime = useMemo(() => {
    if (!matchDateValue) return null;
    try {
      return calculateGatheringTime(
        new Date(matchDateValue).toISOString(),
        defaultGatheringMinutes,
        isAway ? travelMinutesNum : null,
      );
    } catch {
      return null;
    }
  }, [matchDateValue, defaultGatheringMinutes, isAway, travelMinutesNum]);

  const canCalculateTravel = isAway && !!homeAddress && !!locationValue;

  async function handleCalculateTravel() {
    if (!homeAddress || !locationValue) return;
    setCalculatingTravel(true);
    setTravelError(null);
    try {
      const response = await fetch("/api/travel-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: homeAddress, to: locationValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        setTravelError(data.error ?? "Kon reistijd niet berekenen.");
        return;
      }
      setTravelMinutes(data.travel_time_minutes.toString());
    } catch {
      setTravelError("Kon reistijd niet berekenen.");
    } finally {
      setCalculatingTravel(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit({
        opponent: formData.get("opponent") as string,
        match_date: new Date(formData.get("match_date") as string).toISOString(),
        location: (formData.get("location") as string) || null,
        home_away: homeAway,
        notes: (formData.get("notes") as string) || null,
        gathering_time: showOverride && gatheringOverride
          ? new Date(gatheringOverride).toISOString()
          : null,
        travel_time_minutes: isAway && travelMinutes
          ? parseInt(travelMinutes, 10)
          : null,
      });
    } finally {
      setLoading(false);
    }
  }

  const gatheringExplanation = isAway && travelMinutesNum
    ? `${defaultGatheringMinutes} min voor aftrap + ${travelMinutesNum} min reistijd`
    : `${defaultGatheringMinutes} min voor aftrap`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Tegenstander" htmlFor="opponent">
        <Input
          id="opponent"
          name="opponent"
          placeholder="bijv. FC Vooruit"
          defaultValue={defaultValues?.opponent}
          required
        />
      </FormField>

      <FormField label="Datum en tijd" htmlFor="match_date">
        <Input
          id="match_date"
          name="match_date"
          type="datetime-local"
          value={matchDateValue}
          onChange={(e) => setMatchDateValue(e.target.value)}
          required
        />
      </FormField>

      <FormField label="Locatie" htmlFor="location">
        <Input
          id="location"
          name="location"
          placeholder="bijv. Sportpark De Toekomst"
          value={locationValue}
          onChange={(e) => setLocationValue(e.target.value)}
        />
      </FormField>

      <FormField label="Thuis / Uit">
        <div className="flex gap-2">
          {(Object.entries(HOME_AWAY_LABELS) as [HomeAway, string][]).map(
            ([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={homeAway === value ? "default" : "outline"}
                className="flex-1"
                onClick={() => setHomeAway(value)}
              >
                {label}
              </Button>
            )
          )}
        </div>
      </FormField>

      {isAway && (
        <FormField label="Reistijd (minuten)" htmlFor="travel_time_minutes">
          <div className="flex gap-2">
            <Input
              id="travel_time_minutes"
              type="number"
              min={0}
              max={300}
              placeholder="bijv. 30"
              value={travelMinutes}
              onChange={(e) => {
                setTravelMinutes(e.target.value);
                setTravelError(null);
              }}
              className="flex-1"
            />
            {canCalculateTravel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCalculateTravel}
                disabled={calculatingTravel}
                className="shrink-0"
              >
                {calculatingTravel ? (
                  <Loader2 className="mr-1 size-4 animate-spin" />
                ) : null}
                {calculatingTravel ? "Berekenen..." : "Bereken"}
              </Button>
            )}
          </div>
          {travelError && (
            <p className="text-sm text-danger">{travelError}</p>
          )}
          {!homeAddress && isAway && (
            <p className="text-xs text-muted-foreground">
              Stel een thuislocatie in bij teaminstellingen om automatisch te berekenen.
            </p>
          )}
        </FormField>
      )}

      <FormField label="Notities" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Eventuele opmerkingen..."
          rows={2}
          defaultValue={defaultValues?.notes ?? undefined}
        />
      </FormField>

      {matchDateValue && (
        <div className="rounded-lg border border-primary-100 bg-primary-50 p-3">
          {showOverride ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-900">Verzameltijd (handmatig)</span>
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:underline"
                  onClick={() => {
                    setShowOverride(false);
                    setGatheringOverride("");
                  }}
                >
                  Automatisch berekenen
                </button>
              </div>
              <Input
                type="datetime-local"
                value={gatheringOverride}
                onChange={(e) => setGatheringOverride(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-900">
                  Verzamelen: {autoGatheringTime ? formatTime(autoGatheringTime) : "–"}
                </p>
                <p className="text-xs text-primary-600">{gatheringExplanation}</p>
              </div>
              <button
                type="button"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => setShowOverride(true)}
              >
                Aanpassen
              </button>
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Bezig..." : submitLabel}
      </Button>
    </form>
  );
}
