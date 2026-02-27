import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Users } from "lucide-react";
import { OnboardingHint } from "./OnboardingHint";

const meta: Meta<typeof OnboardingHint> = {
  title: "Molecules/OnboardingHint",
  component: OnboardingHint,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <div className="max-w-md p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingHint>;

export const Default: Story = {
  args: {
    hintKey: "storybook_default",
    title: "Tip",
    description:
      "Sleep spelers naar het veld om je opstelling te maken. Kies eerst een formatie rechtsboven.",
  },
};

export const WithCustomIcon: Story = {
  args: {
    hintKey: "storybook_custom_icon",
    title: "Beschikbaarheid",
    description:
      "Spelers kunnen hun beschikbaarheid doorgeven via de app. Deel de uitnodigingslink zodat ze zelf kunnen reageren.",
    icon: Users,
  },
};
