import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillsEditor } from "./SkillsEditor";

const meta: Meta<typeof SkillsEditor> = {
  title: "Molecules/SkillsEditor",
  component: SkillsEditor,
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
type Story = StoryObj<typeof SkillsEditor>;

const eafcSkills = {
  acceleration: 80, sprint_speed: 78,
  att_positioning: 85, finishing: 88, shot_power: 82, volleys: 75, penalties: 72,
  vision: 70, crossing: 68, fk_accuracy: 60, short_passing: 75, long_passing: 65, curve: 70,
  agility: 82, balance: 78, reactions: 80, ball_control: 85, dribbling: 83, composure: 78,
  interceptions: 40, heading_accuracy: 65, def_awareness: 42, stand_tackle: 35, slide_tackle: 30,
  jumping: 72, strength: 70, stamina: 78, aggression: 65,
};

export const Default: Story = {
  args: {
    skills: eafcSkills,
    position: "ST",
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
    position: "CM",
    onSave: (skills) => {
      console.log("Saved skills:", skills);
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
    position: "ST",
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Saving: Story = {
  args: {
    skills: eafcSkills,
    position: "ST",
    onSave: () => new Promise(() => {}),
    isSaving: true,
  },
};
