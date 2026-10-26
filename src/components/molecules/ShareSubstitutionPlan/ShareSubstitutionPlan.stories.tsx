import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareSubstitutionPlan } from "./ShareSubstitutionPlan";
import type { SubstitutionPlan } from "@/types";

const plan: SubstitutionPlan = {
  teamType: "Senioren",
  totalMinutes: 90,
  substitutionMoments: [
    {
      minute: 25,
      out: [{ player_id: "p1", name: "Jan de Vries", position_label: "CM" }],
      in: [{ player_id: "p6", name: "Tom Mulder", position_label: "CM" }],
    },
    {
      minute: 50,
      out: [
        { player_id: "p2", name: "Pieter Bakker", position_label: "LB" },
        { player_id: "p3", name: "Klaas Jansen", position_label: "CB" },
      ],
      in: [
        { player_id: "p1", name: "Jan de Vries", position_label: "LB" },
        { player_id: "p7", name: "Bas de Groot", position_label: "CB" },
      ],
    },
    {
      minute: 70,
      out: [{ player_id: "p6", name: "Tom Mulder", position_label: "CM" }],
      in: [{ player_id: "p2", name: "Pieter Bakker", position_label: "CM" }],
    },
  ],
  playerMinutes: [
    { player_id: "p3", name: "Klaas Jansen", totalMinutes: 50, percentage: 56, periods: [{ start: 0, end: 50 }] },
    { player_id: "p7", name: "Bas de Groot", totalMinutes: 40, percentage: 44, periods: [{ start: 50, end: 90 }] },
    { player_id: "p6", name: "Tom Mulder", totalMinutes: 45, percentage: 50, periods: [{ start: 25, end: 70 }] },
    { player_id: "p1", name: "Jan de Vries", totalMinutes: 65, percentage: 72, periods: [{ start: 0, end: 25 }, { start: 50, end: 90 }] },
    { player_id: "p2", name: "Pieter Bakker", totalMinutes: 70, percentage: 78, periods: [{ start: 0, end: 50 }, { start: 70, end: 90 }] },
    { player_id: "p4", name: "Willem Visser", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
  ],
};

const meta: Meta<typeof ShareSubstitutionPlan> = {
  title: "Molecules/ShareSubstitutionPlan",
  component: ShareSubstitutionPlan,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareSubstitutionPlan>;

export const Default: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    matchDate: "2026-03-15T14:30:00",
    plan,
  },
};

export const NoSubstitutions: Story = {
  args: {
    ...Default.args,
    plan: {
      ...plan,
      substitutionMoments: [],
      playerMinutes: plan.playerMinutes.map((pm) => ({
        ...pm,
        totalMinutes: 90,
        percentage: 100,
        periods: [{ start: 0, end: 90 }],
      })),
    },
  },
};
