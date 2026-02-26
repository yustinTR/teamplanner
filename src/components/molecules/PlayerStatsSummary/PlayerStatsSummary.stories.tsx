import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerStatsSummary } from "./PlayerStatsSummary";

const meta: Meta<typeof PlayerStatsSummary> = {
  title: "Molecules/PlayerStatsSummary",
  component: PlayerStatsSummary,
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
type Story = StoryObj<typeof PlayerStatsSummary>;

export const Default: Story = {
  args: {
    matchesPlayed: 12,
    totalMinutes: 842,
    averageMinutes: 70,
    goals: 5,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
  },
};

export const NoStats: Story = {
  args: {
    matchesPlayed: 0,
    totalMinutes: 0,
    averageMinutes: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  },
};

export const HighStats: Story = {
  args: {
    matchesPlayed: 28,
    totalMinutes: 2340,
    averageMinutes: 84,
    goals: 22,
    assists: 14,
    yellowCards: 5,
    redCards: 1,
  },
};
