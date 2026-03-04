import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroDemo } from "./HeroDemo";

const meta: Meta<typeof HeroDemo> = {
  title: "Molecules/HeroDemo",
  component: HeroDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[500px] items-center justify-center bg-primary-900 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroDemo>;

export const Default: Story = {};
