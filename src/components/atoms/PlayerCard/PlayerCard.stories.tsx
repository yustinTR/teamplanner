import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerCard } from "./PlayerCard";

const meta: Meta<typeof PlayerCard> = {
  title: "Atoms/PlayerCard",
  component: PlayerCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

const defaultStats = { pac: 85, sho: 90, pas: 78, dri: 88, def: 40, phy: 75 };

export const GoldLarge: Story = {
  args: {
    name: "Jan de Vries",
    teamName: "FC Testteam",
    position: "ST",
    overall: 88,
    tier: "gold",
    stats: defaultStats,
    size: "lg",
  },
};

export const SilverLarge: Story = {
  args: {
    name: "Pieter Bakker",
    teamName: "FC Testteam",
    position: "CB",
    overall: 76,
    tier: "silver",
    stats: { pac: 65, sho: 45, pas: 68, dri: 55, def: 82, phy: 80 },
    size: "lg",
  },
};

export const BronzeLarge: Story = {
  args: {
    name: "Klaas Jansen",
    teamName: "FC Testteam",
    position: "CM",
    overall: 62,
    tier: "bronze",
    stats: { pac: 55, sho: 50, pas: 65, dri: 60, def: 55, phy: 65 },
    size: "lg",
  },
};

export const Medium: Story = {
  args: {
    name: "Willem Visser",
    position: "LW",
    overall: 81,
    tier: "silver",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    name: "Henk Smit",
    position: "RW",
    overall: 74,
    tier: "silver",
    size: "sm",
  },
};

export const NoPhoto: Story = {
  args: {
    name: "Gerard Mulder",
    teamName: "FC Testteam",
    position: "CDM",
    overall: 71,
    tier: "silver",
    stats: { pac: 60, sho: 55, pas: 72, dri: 65, def: 78, phy: 74 },
    size: "lg",
  },
};

export const LongName: Story = {
  args: {
    name: "Jean-Pierre van der Linden",
    teamName: "Sportclub Heerenveen",
    position: "CAM",
    overall: 85,
    tier: "gold",
    stats: { pac: 78, sho: 82, pas: 88, dri: 86, def: 50, phy: 70 },
    size: "lg",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <PlayerCard
        name="Jan de Vries"
        position="ST"
        overall={88}
        tier="gold"
        size="sm"
      />
      <PlayerCard
        name="Jan de Vries"
        position="ST"
        overall={88}
        tier="gold"
        size="md"
      />
      <PlayerCard
        name="Jan de Vries"
        teamName="FC Testteam"
        position="ST"
        overall={88}
        tier="gold"
        stats={defaultStats}
        size="lg"
      />
    </div>
  ),
};

export const AllTiers: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <PlayerCard
        name="Goud Speler"
        teamName="FC Testteam"
        position="ST"
        overall={88}
        tier="gold"
        stats={defaultStats}
        size="lg"
      />
      <PlayerCard
        name="Zilver Speler"
        teamName="FC Testteam"
        position="CB"
        overall={76}
        tier="silver"
        stats={{ pac: 65, sho: 45, pas: 68, dri: 55, def: 82, phy: 80 }}
        size="lg"
      />
      <PlayerCard
        name="Brons Speler"
        teamName="FC Testteam"
        position="CM"
        overall={55}
        tier="bronze"
        stats={{ pac: 50, sho: 45, pas: 55, dri: 52, def: 50, phy: 55 }}
        size="lg"
      />
    </div>
  ),
};
