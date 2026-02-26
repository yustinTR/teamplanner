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
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Empty: Story = {
  args: {
    skills: {},
    onSave: (skills) => {
      console.log("Saved skills:", skills);
    },
  },
};

export const Saving: Story = {
  args: {
    skills: {
      speed: 7,
      technique: 8,
    },
    onSave: () => new Promise(() => {}),
    isSaving: true,
  },
};
