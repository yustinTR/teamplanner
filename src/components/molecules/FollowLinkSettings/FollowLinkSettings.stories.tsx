import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { FollowLinkSettings } from "./FollowLinkSettings";

const meta: Meta<typeof FollowLinkSettings> = {
  title: "Molecules/FollowLinkSettings",
  component: FollowLinkSettings,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: { onToggle: fn() },
};

export default meta;
type Story = StoryObj<typeof FollowLinkSettings>;

export const Off: Story = {
  args: { shareToken: null },
};

export const On: Story = {
  args: { shareToken: "3f1c9b2e8d7a4c5b9e0f1a2b3c4d5e6f" },
};

export const Disabled: Story = {
  args: { shareToken: null, disabled: true },
};
