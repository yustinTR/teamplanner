import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerCardDisplay } from "./PlayerCardDisplay";
import { createMockPlayer } from "@/lib/test/mock-data";

const meta: Meta<typeof PlayerCardDisplay> = {
  title: "Molecules/PlayerCardDisplay",
  component: PlayerCardDisplay,
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
type Story = StoryObj<typeof PlayerCardDisplay>;

// Full EAFC skills (high-rated player)
const goldSkills = {
  acceleration: 88, sprint_speed: 85,
  att_positioning: 90, finishing: 92, shot_power: 85, volleys: 82, penalties: 80,
  vision: 78, crossing: 75, fk_accuracy: 70, short_passing: 80, long_passing: 72, curve: 76,
  agility: 86, balance: 82, reactions: 88, ball_control: 90, dribbling: 88, composure: 85,
  interceptions: 35, heading_accuracy: 75, def_awareness: 38, stand_tackle: 30, slide_tackle: 28,
  jumping: 78, strength: 76, stamina: 82, aggression: 72,
};

// Mid-rated player
const silverSkills = {
  acceleration: 70, sprint_speed: 68,
  att_positioning: 45, finishing: 40, shot_power: 65, volleys: 45, penalties: 50,
  vision: 70, crossing: 68, fk_accuracy: 55, short_passing: 75, long_passing: 72, curve: 60,
  agility: 65, balance: 70, reactions: 72, ball_control: 68, dribbling: 62, composure: 70,
  interceptions: 78, heading_accuracy: 80, def_awareness: 82, stand_tackle: 80, slide_tackle: 76,
  jumping: 75, strength: 80, stamina: 78, aggression: 74,
};

// Old v1 skills (should auto-migrate)
const oldSkills = {
  speed: 7, strength: 5, technique: 8, passing: 6, dribbling: 7,
  heading: 4, defending: 3, positioning: 6, finishing: 8, stamina: 7,
};

export const GoldPlayer: Story = {
  args: {
    player: createMockPlayer({
      name: "Jan de Vries",
      primary_position: "ST",
      jersey_number: 9,
      skills: goldSkills,
      skills_version: 2,
    }),
    teamName: "FC Testteam",
    size: "lg",
  },
};

export const SilverPlayer: Story = {
  args: {
    player: createMockPlayer({
      name: "Pieter Bakker",
      primary_position: "CB",
      jersey_number: 4,
      skills: silverSkills,
      skills_version: 2,
    }),
    teamName: "FC Testteam",
    size: "lg",
  },
};

export const OldSkillsMigrated: Story = {
  args: {
    player: createMockPlayer({
      name: "Klaas Jansen",
      primary_position: "CM",
      jersey_number: 8,
      skills: oldSkills,
      skills_version: 1,
    }),
    teamName: "FC Testteam",
    size: "lg",
  },
};

export const NoSkills: Story = {
  args: {
    player: createMockPlayer({
      name: "Willem Visser",
      primary_position: "LW",
      jersey_number: 11,
      skills: {},
    }),
    teamName: "FC Testteam",
    size: "lg",
  },
};

export const SmallOnPitch: Story = {
  args: {
    player: createMockPlayer({
      name: "Jan de Vries",
      primary_position: "ST",
      jersey_number: 9,
      skills: goldSkills,
      skills_version: 2,
    }),
    size: "sm",
  },
};

export const MediumInList: Story = {
  args: {
    player: createMockPlayer({
      name: "Pieter Bakker",
      primary_position: "CB",
      jersey_number: 4,
      skills: silverSkills,
      skills_version: 2,
    }),
    size: "md",
  },
};
