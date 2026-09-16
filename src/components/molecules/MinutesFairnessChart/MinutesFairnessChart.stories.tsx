import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MinutesFairnessChart } from "./MinutesFairnessChart";
import type { PlayerSeasonStats } from "@/types";

const stat = (
  name: string,
  totalMinutes: number,
  overrides: Partial<PlayerSeasonStats> = {}
): PlayerSeasonStats => ({
  playerId: name.toLowerCase(),
  playerName: name,
  matchesPlayed: Math.max(1, Math.round(totalMinutes / 60)),
  totalMinutes,
  averageMinutes: totalMinutes > 0 ? 55 : 0,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  ...overrides,
});

const meta: Meta<typeof MinutesFairnessChart> = {
  title: "Molecules/MinutesFairnessChart",
  component: MinutesFairnessChart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MinutesFairnessChart>;

export const Default: Story = {
  args: {
    stats: [
      stat("Daan", 540),
      stat("Sem", 480),
      stat("Milan", 465),
      stat("Levi", 390),
      stat("Finn", 350),
      stat("Noah", 220),
      stat("Luuk", 180),
      stat("Jesse", 90),
    ],
  },
};

export const UnevenMinutes: Story = {
  args: {
    stats: [
      stat("Daan", 630),
      stat("Sem", 610),
      stat("Milan", 120),
      stat("Levi", 45),
      stat("Finn", 0),
    ],
  },
};

export const SinglePlayer: Story = {
  args: {
    stats: [stat("Daan", 240)],
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};
