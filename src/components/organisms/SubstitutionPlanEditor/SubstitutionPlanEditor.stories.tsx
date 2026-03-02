import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubstitutionPlanEditor } from "./SubstitutionPlanEditor";
import { createMockPlayer } from "@/lib/test/mock-data";
import type { SubstitutionPlan, LineupPosition, Player } from "@/types";

const fieldPositions: LineupPosition[] = [
  { player_id: "p1", x: 50, y: 90, position_label: "K" },
  { player_id: "p2", x: 20, y: 70, position_label: "LB" },
  { player_id: "p3", x: 40, y: 70, position_label: "CB" },
  { player_id: "p4", x: 60, y: 70, position_label: "CB" },
  { player_id: "p5", x: 80, y: 70, position_label: "RB" },
  { player_id: "p6", x: 30, y: 45, position_label: "CM" },
  { player_id: "p7", x: 50, y: 45, position_label: "CM" },
  { player_id: "p8", x: 70, y: 45, position_label: "CM" },
  { player_id: "p9", x: 20, y: 20, position_label: "LW" },
  { player_id: "p10", x: 50, y: 20, position_label: "ST" },
  { player_id: "p11", x: 80, y: 20, position_label: "RW" },
];

const benchPlayers = [
  createMockPlayer({ id: "p12", name: "Tom Mulder", primary_position: "CM" }),
  createMockPlayer({ id: "p13", name: "Bas Smit", primary_position: "CB" }),
  createMockPlayer({ id: "p14", name: "Rick de Jong", primary_position: "ST" }),
];

const existingPlan: SubstitutionPlan = {
  teamType: "Senioren",
  totalMinutes: 90,
  substitutionMoments: [
    {
      minute: 25,
      out: [{ player_id: "p6", name: "Jan de Vries", position_label: "CM" }],
      in: [{ player_id: "p12", name: "Tom Mulder", position_label: "CM" }],
    },
    {
      minute: 50,
      out: [{ player_id: "p3", name: "Pieter Bakker", position_label: "CB" }],
      in: [{ player_id: "p13", name: "Bas Smit", position_label: "CB" }],
    },
  ],
  playerMinutes: [
    { player_id: "p12", name: "Tom Mulder", totalMinutes: 65, percentage: 72, periods: [{ start: 25, end: 90 }] },
    { player_id: "p6", name: "Jan de Vries", totalMinutes: 25, percentage: 28, periods: [{ start: 0, end: 25 }] },
    { player_id: "p13", name: "Bas Smit", totalMinutes: 40, percentage: 44, periods: [{ start: 50, end: 90 }] },
    { player_id: "p3", name: "Pieter Bakker", totalMinutes: 50, percentage: 56, periods: [{ start: 0, end: 50 }] },
  ],
};

// All players (field + bench) for the playerMap
const allPlayers: Player[] = [
  createMockPlayer({ id: "p1", name: "Keeper Jansen", primary_position: "K" }),
  createMockPlayer({ id: "p2", name: "Lars Bos", primary_position: "LB" }),
  createMockPlayer({ id: "p3", name: "Pieter Bakker", primary_position: "CB" }),
  createMockPlayer({ id: "p4", name: "Sander Vos", primary_position: "CB" }),
  createMockPlayer({ id: "p5", name: "Dirk Smit", primary_position: "RB" }),
  createMockPlayer({ id: "p6", name: "Jan de Vries", primary_position: "CM" }),
  createMockPlayer({ id: "p7", name: "Klaas Mulder", primary_position: "CM" }),
  createMockPlayer({ id: "p8", name: "Wim Peters", primary_position: "CM" }),
  createMockPlayer({ id: "p9", name: "Mark Visser", primary_position: "LW" }),
  createMockPlayer({ id: "p10", name: "Stefan Groot", primary_position: "ST" }),
  createMockPlayer({ id: "p11", name: "Erik de Wit", primary_position: "RW" }),
  ...benchPlayers,
];

const mockPlayerMap = new Map<string, Player>(allPlayers.map((p) => [p.id, p]));

// Render helper that tracks state
function StatefulEditor(props: React.ComponentProps<typeof SubstitutionPlanEditor>) {
  const [plan, setPlan] = useState(props.substitutionPlan);
  return (
    <SubstitutionPlanEditor
      {...props}
      substitutionPlan={plan}
      onChange={(newPlan) => {
        setPlan(newPlan);
        props.onChange(newPlan);
      }}
    />
  );
}

const meta: Meta<typeof SubstitutionPlanEditor> = {
  title: "Organisms/SubstitutionPlanEditor",
  component: SubstitutionPlanEditor,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SubstitutionPlanEditor>;

export const Empty: Story = {
  render: (args) => <StatefulEditor {...args} />,
  args: {
    substitutionPlan: null,
    positions: fieldPositions,
    benchPlayers,
    playerMap: mockPlayerMap,
    teamType: "senioren",
    onChange: (plan) => console.log("Changed:", plan),
  },
};

export const WithExistingPlan: Story = {
  render: (args) => <StatefulEditor {...args} />,
  args: {
    substitutionPlan: existingPlan,
    positions: fieldPositions,
    benchPlayers,
    playerMap: mockPlayerMap,
    teamType: "senioren",
    onChange: (plan) => console.log("Changed:", plan),
  },
};
