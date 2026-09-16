import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopScorersList } from "./TopScorersList";
import type { PlayerSeasonStats } from "@/types";

const stat = (
  name: string,
  goals: number,
  assists: number
): PlayerSeasonStats => ({
  playerId: name.toLowerCase(),
  playerName: name,
  matchesPlayed: 8,
  totalMinutes: 400,
  averageMinutes: 50,
  goals,
  assists,
  yellowCards: 0,
  redCards: 0,
});

const STATS = [
  stat("Daan", 9, 3),
  stat("Sem", 6, 7),
  stat("Milan", 4, 1),
  stat("Levi", 2, 5),
  stat("Finn", 1, 0),
  stat("Noah", 0, 2),
  stat("Luuk", 0, 0),
];

const meta: Meta<typeof TopScorersList> = {
  title: "Molecules/TopScorersList",
  component: TopScorersList,
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
type Story = StoryObj<typeof TopScorersList>;

export const Goals: Story = {
  args: {
    stats: STATS,
    statKey: "goals",
  },
};

export const Assists: Story = {
  args: {
    stats: STATS,
    statKey: "assists",
  },
};

export const LimitedToThree: Story = {
  args: {
    stats: STATS,
    statKey: "goals",
    limit: 3,
  },
};

export const Empty: Story = {
  args: {
    stats: [stat("Daan", 0, 0)],
    statKey: "goals",
  },
};
