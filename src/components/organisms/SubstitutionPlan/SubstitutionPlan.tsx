"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SubstitutionMomentCard } from "@/components/molecules/SubstitutionMomentCard";
import { PlayerMinutesBar } from "@/components/molecules/PlayerMinutesBar";
import { OnboardingHint } from "@/components/molecules/OnboardingHint";
import type { SubstitutionPlan as SubstitutionPlanType } from "@/types";

interface SubstitutionPlanProps {
  plan: SubstitutionPlanType;
}

export function SubstitutionPlan({ plan }: SubstitutionPlanProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-4">
      <OnboardingHint
        hintKey="substitution_plan"
        title="Wisselschema"
        description="Plan wisselmomenten en zie automatisch hoeveel minuten elke speler speelt."
      />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Wisselschema ({plan.teamType} &middot; {plan.totalMinutes} min)
        </h3>
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer className="mr-1 size-4" />
          Print
        </Button>
      </div>

      {/* Substitution moments timeline */}
      <div className="space-y-2">
        {plan.substitutionMoments.map((moment, i) => (
          <SubstitutionMomentCard key={i} moment={moment} />
        ))}
      </div>

      {/* Player minutes overview */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          Speelminuten
        </h4>
        <div className="space-y-3">
          {plan.playerMinutes.map((pm) => (
            <PlayerMinutesBar
              key={pm.player_id}
              name={pm.name}
              totalMinutes={pm.totalMinutes}
              percentage={pm.percentage}
              totalMatchMinutes={plan.totalMinutes}
              periods={pm.periods}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
