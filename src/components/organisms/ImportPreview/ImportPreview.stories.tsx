import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImportPreview } from "./ImportPreview";
import type { ParsedMatch, ParsedPlayer } from "@/lib/voetbal-nl-parser";

const MOCK_MATCHES: ParsedMatch[] = [
  {
    date: "15-03-2026",
    opponent: "FC Vooruit",
    homeAway: "home",
    location: "Sportpark De Toekomst",
  },
  {
    date: "22-03-2026",
    opponent: "SV De Adelaar",
    homeAway: "away",
    location: null,
  },
  {
    date: "29-03-2026",
    opponent: "VV Oranje",
    homeAway: "home",
    location: "Sportpark De Toekomst",
  },
];

const MOCK_PLAYERS: ParsedPlayer[] = [
  { name: "Jan de Vries", position: "goalkeeper" },
  { name: "Pieter Bakker", position: "defender" },
  { name: "Klaas Jansen", position: "midfielder" },
  { name: "Willem Visser", position: "forward" },
  { name: "Henk Smit", position: null },
];

const meta: Meta<typeof ImportPreview> = {
  title: "Organisms/ImportPreview",
  component: ImportPreview,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ImportPreview>;

export const Default: Story = {
  args: {
    teamName: "CVV Be Fair G2",
    matches: MOCK_MATCHES,
    players: MOCK_PLAYERS,
  },
};

export const MatchesOnly: Story = {
  args: {
    teamName: "CVV Be Fair G2",
    matches: MOCK_MATCHES,
    players: [],
  },
};

export const PlayersOnly: Story = {
  args: {
    teamName: "CVV Be Fair G2",
    matches: [],
    players: MOCK_PLAYERS,
  },
};

export const Empty: Story = {
  args: {
    teamName: null,
    matches: [],
    players: [],
  },
};

export const Confirming: Story = {
  args: {
    teamName: "CVV Be Fair G2",
    matches: MOCK_MATCHES,
    players: MOCK_PLAYERS,
    isConfirming: true,
  },
};
