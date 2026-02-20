"use client";

import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/Card";
import type { SubstitutionMoment } from "@/types";

interface SubstitutionMomentCardProps {
  moment: SubstitutionMoment;
}

export function SubstitutionMomentCard({ moment }: SubstitutionMomentCardProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="mb-2 flex items-center gap-2">
          <ArrowRightLeft className="size-4 text-primary" />
          <span className="text-sm font-semibold">{moment.minute}&apos;</span>
        </div>
        <div className="space-y-1">
          {moment.out.map((outPlayer, i) => {
            const inPlayer = moment.in[i];
            return (
              <div key={outPlayer.player_id} className="flex items-center gap-2 text-sm">
                <span className="text-danger">&#x2193; {outPlayer.name}</span>
                <span className="text-muted-foreground">({outPlayer.position_label})</span>
                <span className="text-success">&#x2191; {inPlayer?.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
