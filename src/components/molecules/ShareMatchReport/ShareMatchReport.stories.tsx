import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareMatchReport } from "./ShareMatchReport";

const meta: Meta<typeof ShareMatchReport> = {
  title: "Molecules/ShareMatchReport",
  component: ShareMatchReport,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareMatchReport>;

export const WithStats: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    homeAway: "home",
    matchDate: "2026-03-15T14:30:00",
    scoreHome: 3,
    scoreAway: 1,
    stats: [
      {
        playerName: "Jan de Vries",
        goals: 2,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
      },
      {
        playerName: "Pieter Bakker",
        goals: 1,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
      },
      {
        playerName: "Willem Visser",
        goals: 0,
        assists: 2,
        yellow_cards: 0,
        red_cards: 0,
      },
      {
        playerName: "Klaas Jansen",
        goals: 0,
        assists: 0,
        yellow_cards: 1,
        red_cards: 0,
      },
    ],
  },
};

export const NoStats: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "Ajax B2",
    homeAway: "away",
    matchDate: "2026-03-08T10:00:00",
    scoreHome: 0,
    scoreAway: 2,
    stats: [],
  },
};
