import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingChecklist } from "./OnboardingChecklist";

const meta: Meta<typeof OnboardingChecklist> = {
  title: "Molecules/OnboardingChecklist",
  component: OnboardingChecklist,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <div className="max-w-sm p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingChecklist>;

export const Default: Story = {};
