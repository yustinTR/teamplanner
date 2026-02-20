import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubstitutionPlan } from "./SubstitutionPlan";
import type { SubstitutionPlan as SubstitutionPlanType } from "@/types";

const mockPlan: SubstitutionPlanType = {
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
      out: [{ player_id: "p2", name: "Pieter Bakker", position_label: "LB" }],
      in: [{ player_id: "p1", name: "Jan de Vries", position_label: "LB" }],
    },
    {
      minute: 70,
      out: [{ player_id: "p6", name: "Tom Mulder", position_label: "CM" }],
      in: [{ player_id: "p2", name: "Pieter Bakker", position_label: "CM" }],
    },
  ],
  playerMinutes: [
    { player_id: "p6", name: "Tom Mulder", totalMinutes: 45, percentage: 50, periods: [{ start: 25, end: 70 }] },
    { player_id: "p1", name: "Jan de Vries", totalMinutes: 65, percentage: 72, periods: [{ start: 0, end: 25 }, { start: 50, end: 90 }] },
    { player_id: "p2", name: "Pieter Bakker", totalMinutes: 70, percentage: 78, periods: [{ start: 0, end: 50 }, { start: 70, end: 90 }] },
    { player_id: "p3", name: "Klaas Jansen", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
  ],
};

const meta: Meta<typeof SubstitutionPlan> = {
  title: "Organisms/SubstitutionPlan",
  component: SubstitutionPlan,
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
type Story = StoryObj<typeof SubstitutionPlan>;

export const Default: Story = {
  args: {
    plan: mockPlan,
  },
};
