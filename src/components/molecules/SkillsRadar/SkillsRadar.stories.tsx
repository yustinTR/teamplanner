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

export const AllHigh: Story = {
  args: {
    skills: {
      speed: 9,
      strength: 9,
      technique: 10,
      passing: 8,
      dribbling: 9,
      heading: 8,
      defending: 9,
      positioning: 9,
      finishing: 10,
      stamina: 8,
    },
  },
};

export const Beginner: Story = {
  args: {
    skills: {
      speed: 3,
      strength: 2,
      technique: 2,
      passing: 3,
      dribbling: 1,
      heading: 1,
      defending: 2,
      positioning: 2,
      finishing: 1,
      stamina: 4,
    },
  },
};

export const PartiallyFilled: Story = {
  args: {
    skills: {
      speed: 7,
      technique: 6,
      passing: 8,
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
  },
};
