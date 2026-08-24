import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AutoSyncSettings } from "./AutoSyncSettings";

const meta: Meta<typeof AutoSyncSettings> = {
  title: "Molecules/AutoSyncSettings",
  component: AutoSyncSettings,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onToggle: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AutoSyncSettings>;

export const Enabled: Story = {
  args: {
    enabled: true,
    lastSyncedAt: "2026-08-24T05:00:00.000Z",
  },
};

export const Disabled: Story = {
  args: {
    enabled: false,
    lastSyncedAt: "2026-08-24T05:00:00.000Z",
  },
};

export const NeverSynced: Story = {
  args: {
    enabled: true,
    lastSyncedAt: null,
  },
};

export const Saving: Story = {
  args: {
    enabled: true,
    lastSyncedAt: "2026-08-24T05:00:00.000Z",
    disabled: true,
  },
};
