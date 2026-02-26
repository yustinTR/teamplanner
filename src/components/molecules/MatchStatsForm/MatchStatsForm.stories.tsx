import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStatsForm } from "./MatchStatsForm";

const MOCK_PLAYERS = [
  { id: "p1", name: "Jan de Vries" },
  { id: "p2", name: "Pieter Bakker" },
  { id: "p3", name: "Klaas Jansen" },
  { id: "p4", name: "Willem Visser" },
  { id: "p5", name: "Henk Smit" },
];

const meta: Meta<typeof MatchStatsForm> = {
  title: "Molecules/MatchStatsForm",
  component: MatchStatsForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onSubmit: async () => {},
  },
};

export default meta;
type Story = StoryObj<typeof MatchStatsForm>;

export const Empty: Story = {
  args: {
    players: MOCK_PLAYERS,
  },
};

export const WithInitialStats: Story = {
  args: {
    players: MOCK_PLAYERS,
    initialStats: [
      {
        playerId: "p1",
        playerName: "Jan de Vries",
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
      {
        playerId: "p4",
        playerName: "Willem Visser",
        goals: 2,
        assists: 0,
        yellowCards: 1,
        redCards: 0,
      },
      {
        playerId: "p5",
        playerName: "Henk Smit",
        goals: 1,
        assists: 2,
        yellowCards: 0,
        redCards: 0,
      },
    ],
  },
};

export const NoPlayers: Story = {
  args: {
    players: [],
  },
};
