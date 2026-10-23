import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { PushNotificationSettings } from "./PushNotificationSettings";

const meta: Meta<typeof PushNotificationSettings> = {
  title: "Molecules/PushNotificationSettings",
  component: PushNotificationSettings,
  tags: ["autodocs"],
  args: {
    onEnable: fn(),
    onDisable: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-neutral-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PushNotificationSettings>;

export const Off: Story = {
  args: { status: "unsubscribed" },
};

export const On: Story = {
  args: { status: "subscribed" },
};

export const Loading: Story = {
  args: { status: "loading" },
};

export const Pending: Story = {
  args: { status: "unsubscribed", pending: true },
};

export const Denied: Story = {
  args: { status: "denied" },
};

export const Unsupported: Story = {
  args: { status: "unsupported" },
};

export const UnsupportedOnIphone: Story = {
  args: { status: "unsupported", showIosHint: true },
};
