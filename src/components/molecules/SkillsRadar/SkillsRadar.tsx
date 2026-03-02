"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { EAFC_ATTRIBUTE_CATEGORIES, type PlayerSkills } from "@/lib/constants";
import { ensureEafcFormat, calculateCategoryAverage } from "@/lib/player-rating";

interface SkillsRadarProps {
  skills: PlayerSkills;
}

export function SkillsRadar({ skills }: SkillsRadarProps) {
  const eafcSkills = ensureEafcFormat(skills);

  const data = EAFC_ATTRIBUTE_CATEGORIES.map((cat) => ({
    skill: cat.labelShort,
    value: calculateCategoryAverage(eafcSkills, cat),
    fullMark: 99,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="var(--color-neutral-200)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "var(--color-neutral-600)", fontSize: 12, fontWeight: 600 }}
        />
        <Radar
          name="Vaardigheden"
          dataKey="value"
          stroke="var(--color-primary-600)"
          fill="var(--color-primary-500)"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{
            r: 3,
            fill: "var(--color-primary-600)",
            strokeWidth: 0,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
