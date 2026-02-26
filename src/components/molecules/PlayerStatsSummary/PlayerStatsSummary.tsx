"use client";

import { Trophy, Clock, Timer, Target, Handshake, Square } from "lucide-react";

interface PlayerStatsSummaryProps {
  matchesPlayed: number;
  totalMinutes: number;
  averageMinutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

const stats = (props: PlayerStatsSummaryProps) => [
  {
    icon: Trophy,
    label: "Wedstrijden",
    value: props.matchesPlayed,
    color: "text-primary-700 bg-primary-100",
  },
  {
    icon: Clock,
    label: "Totaal minuten",
    value: props.totalMinutes,
    color: "text-primary-700 bg-primary-100",
  },
  {
    icon: Timer,
    label: "Gem. minuten",
    value: props.averageMinutes,
    color: "text-primary-700 bg-primary-100",
  },
  {
    icon: Target,
    label: "Doelpunten",
    value: props.goals,
    color: "text-success-700 bg-success-100",
  },
  {
    icon: Handshake,
    label: "Assists",
    value: props.assists,
    color: "text-success-700 bg-success-100",
  },
  {
    icon: Square,
    label: "Gele kaarten",
    value: props.yellowCards,
    color: "text-warning-700 bg-warning-100",
  },
  {
    icon: Square,
    label: "Rode kaarten",
    value: props.redCards,
    color: "text-error-700 bg-error-100",
  },
];

export function PlayerStatsSummary(props: PlayerStatsSummaryProps) {
  const items = stats(props);

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3"
        >
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
          >
            <item.icon className="size-4" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
