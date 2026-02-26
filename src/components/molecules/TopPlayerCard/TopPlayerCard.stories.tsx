import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Clock, Target, Trophy } from "lucide-react";
import { TopPlayerCard } from "./TopPlayerCard";

const meta: Meta<typeof TopPlayerCard> = {
  title: "Molecules/TopPlayerCard",
  component: TopPlayerCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm space-y-3 bg-neutral-100 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopPlayerCard>;

export const MostMinutes: Story = {
  args: {
    title: "Meeste minuten",
    playerName: "Jan de Vries",
    value: "842 min",
    icon: Clock,
  },
};

export const TopScorer: Story = {
  args: {
    title: "Topscorer",
    playerName: "Willem Visser",
    value: "12 goals",
    icon: Target,
  },
};

export const MostMatches: Story = {
  args: {
    title: "Meeste wedstrijden",
    playerName: "Pieter Bakker",
    value: "18",
    icon: Trophy,
  },
};
