"use client";

import {
  Bar,
  BarChart,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerSeasonStats } from "@/types";

interface MinutesFairnessChartProps {
  stats: PlayerSeasonStats[];
}

const BAR_ROW_HEIGHT = 36;

export function MinutesFairnessChart({ stats }: MinutesFairnessChartProps) {
  const sorted = [...stats].sort((a, b) => b.totalMinutes - a.totalMinutes);
  const withMinutes = sorted.filter((s) => s.totalMinutes > 0);

  if (withMinutes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nog geen speelminuten geregistreerd.
      </p>
    );
  }

  const average = Math.round(
    withMinutes.reduce((sum, s) => sum + s.totalMinutes, 0) /
      withMinutes.length
  );

  const data = sorted.map((s) => ({
    name: s.playerName,
    minutes: s.totalMinutes,
  }));

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={data.length * BAR_ROW_HEIGHT + 40}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 18, right: 44, bottom: 4, left: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-neutral-600)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--color-neutral-100)" }}
            formatter={(value) => [`${value} min`, "Speeltijd"]}
          />
          <ReferenceLine
            x={average}
            stroke="var(--color-neutral-400)"
            strokeDasharray="4 4"
            label={{
              value: `gem. ${average}`,
              position: "top",
              fill: "var(--color-neutral-500)",
              fontSize: 11,
            }}
          />
          <Bar
            dataKey="minutes"
            fill="var(--color-primary-600)"
            barSize={16}
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey="minutes"
              position="right"
              formatter={(value: React.ReactNode) =>
                Number(value) > 0 ? String(value) : ""
              }
              style={{ fill: "var(--color-neutral-500)", fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-muted-foreground">
        Totale speelminuten per speler; de stippellijn is het teamgemiddelde.
      </p>
    </div>
  );
}
