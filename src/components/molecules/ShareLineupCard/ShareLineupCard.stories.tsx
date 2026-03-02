import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareLineupCard } from "./ShareLineupCard";

const meta: Meta<typeof ShareLineupCard> = {
  title: "Molecules/ShareLineupCard",
  component: ShareLineupCard,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareLineupCard>;

export const Default: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    matchDate: "2026-03-15T14:30:00",
    formation: "4-3-3",
    players: [
      { name: "Jan de Vries", positionLabel: "K", x: 50, y: 90, overall: 75, cardTier: "silver" },
      { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 70, overall: 68, cardTier: "bronze" },
      { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 75, overall: 72, cardTier: "silver" },
      { name: "Willem Visser", positionLabel: "CB", x: 62, y: 75, overall: 78, cardTier: "silver" },
      { name: "Henk Smit", positionLabel: "RB", x: 85, y: 70, overall: 65, cardTier: "bronze" },
      { name: "Tom Mulder", positionLabel: "CM", x: 30, y: 50, overall: 80, cardTier: "silver" },
      { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 55, overall: 82, cardTier: "silver" },
      { name: "Sander Bos", positionLabel: "CM", x: 70, y: 50, overall: 77, cardTier: "silver" },
      { name: "Marco Peters", positionLabel: "LW", x: 20, y: 25, overall: 85, cardTier: "gold" },
      { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20, overall: 88, cardTier: "gold" },
      { name: "Dennis Kuijt", positionLabel: "RW", x: 80, y: 25, overall: 83, cardTier: "silver" },
    ],
    benchNames: ["Van Dijk", "De Jong", "Bergkamp"],
    substitutions: [
      {
        minute: 25,
        changes: [
          { outName: "Pieter Bakker", inName: "Van Dijk", position: "LB" },
          { outName: "Klaas Jansen", inName: "De Jong", position: "CB" },
        ],
      },
      {
        minute: 50,
        changes: [
          { outName: "Van Dijk", inName: "Pieter Bakker", position: "LB" },
          { outName: "De Jong", inName: "Klaas Jansen", position: "CB" },
        ],
      },
    ],
  },
};

export const WithSubstitutions: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "Ajax B2",
    matchDate: "2026-03-22T10:00:00",
    formation: "4-3-3",
    players: [
      { name: "Jan de Vries", positionLabel: "K", x: 50, y: 90 },
      { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 70 },
      { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 75 },
      { name: "Willem Visser", positionLabel: "CB", x: 62, y: 75 },
      { name: "Henk Smit", positionLabel: "RB", x: 85, y: 70 },
      { name: "Tom Mulder", positionLabel: "CM", x: 30, y: 50 },
      { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 55 },
      { name: "Sander Bos", positionLabel: "CM", x: 70, y: 50 },
      { name: "Marco Peters", positionLabel: "LW", x: 20, y: 25 },
      { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20 },
      { name: "Dennis Kuijt", positionLabel: "RW", x: 80, y: 25 },
    ],
    benchNames: ["Van Dijk", "De Jong", "Bergkamp"],
    substitutions: [
      {
        minute: 20,
        changes: [
          { outName: "Pieter Bakker", inName: "Van Dijk", position: "LB" },
        ],
      },
      {
        minute: 40,
        changes: [
          { outName: "Klaas Jansen", inName: "De Jong", position: "CB" },
          { outName: "Tom Mulder", inName: "Bergkamp", position: "CM" },
        ],
      },
      {
        minute: 60,
        changes: [
          { outName: "Van Dijk", inName: "Pieter Bakker", position: "LB" },
          { outName: "De Jong", inName: "Klaas Jansen", position: "CB" },
          { outName: "Bergkamp", inName: "Tom Mulder", position: "CM" },
        ],
      },
    ],
  },
};

export const WithoutRatings: Story = {
  args: {
    teamName: "FC Testteam",
    opponent: "Ajax B2",
    matchDate: "2026-03-22T10:00:00",
    formation: "4-3-3",
    players: [
      { name: "Jan de Vries", positionLabel: "K", x: 50, y: 90 },
      { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 70 },
      { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 75 },
      { name: "Willem Visser", positionLabel: "CB", x: 62, y: 75 },
      { name: "Henk Smit", positionLabel: "RB", x: 85, y: 70 },
      { name: "Tom Mulder", positionLabel: "CM", x: 30, y: 50 },
      { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 55 },
      { name: "Sander Bos", positionLabel: "CM", x: 70, y: 50 },
      { name: "Marco Peters", positionLabel: "LW", x: 20, y: 25 },
      { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20 },
      { name: "Dennis Kuijt", positionLabel: "RW", x: 80, y: 25 },
    ],
    benchNames: [],
  },
};
