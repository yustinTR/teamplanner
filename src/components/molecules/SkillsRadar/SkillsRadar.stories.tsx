import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillsRadar } from "./SkillsRadar";

const meta: Meta<typeof SkillsRadar> = {
  title: "Molecules/SkillsRadar",
  component: SkillsRadar,
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
type Story = StoryObj<typeof SkillsRadar>;

export const Default: Story = {
  args: {
    skills: {
      acceleration: 80, sprint_speed: 78,
      att_positioning: 85, finishing: 88, shot_power: 82, volleys: 75, penalties: 72,
      vision: 70, crossing: 68, fk_accuracy: 60, short_passing: 75, long_passing: 65, curve: 70,
      agility: 82, balance: 78, reactions: 80, ball_control: 85, dribbling: 83, composure: 78,
      interceptions: 40, heading_accuracy: 65, def_awareness: 42, stand_tackle: 35, slide_tackle: 30,
      jumping: 72, strength: 70, stamina: 78, aggression: 65,
    },
  },
};

export const AllHigh: Story = {
  args: {
    skills: {
      acceleration: 92, sprint_speed: 90,
      att_positioning: 95, finishing: 94, shot_power: 90, volleys: 88, penalties: 85,
      vision: 88, crossing: 86, fk_accuracy: 82, short_passing: 90, long_passing: 85, curve: 84,
      agility: 92, balance: 88, reactions: 93, ball_control: 95, dribbling: 94, composure: 90,
      interceptions: 88, heading_accuracy: 85, def_awareness: 90, stand_tackle: 88, slide_tackle: 86,
      jumping: 85, strength: 88, stamina: 90, aggression: 82,
    },
  },
};

export const Beginner: Story = {
  args: {
    skills: {
      acceleration: 35, sprint_speed: 30,
      att_positioning: 25, finishing: 20, shot_power: 30, volleys: 15, penalties: 20,
      vision: 30, crossing: 25, fk_accuracy: 15, short_passing: 35, long_passing: 20, curve: 18,
      agility: 32, balance: 28, reactions: 30, ball_control: 25, dribbling: 20, composure: 22,
      interceptions: 25, heading_accuracy: 20, def_awareness: 28, stand_tackle: 22, slide_tackle: 18,
      jumping: 30, strength: 25, stamina: 35, aggression: 28,
    },
  },
};

export const OldFormat: Story = {
  args: {
    skills: {
      speed: 7,
      strength: 5,
      technique: 8,
      passing: 6,
      dribbling: 7,
      heading: 4,
      defending: 3,
      positioning: 6,
      finishing: 8,
      stamina: 7,
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
  },
};
