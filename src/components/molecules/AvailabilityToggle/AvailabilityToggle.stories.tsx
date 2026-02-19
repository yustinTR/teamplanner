import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { AvailabilityToggle } from "./AvailabilityToggle";
import type { AvailabilityStatus } from "@/types";

const meta: Meta<typeof AvailabilityToggle> = {
  title: "Molecules/AvailabilityToggle",
  component: AvailabilityToggle,
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
type Story = StoryObj<typeof AvailabilityToggle>;

export const NoSelection: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
};

export const Available: Story = {
  args: {
    value: "available",
    onChange: () => {},
  },
};

export const Unavailable: Story = {
  args: {
    value: "unavailable",
    onChange: () => {},
  },
};

export const Maybe: Story = {
  args: {
    value: "maybe",
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<AvailabilityStatus | null>(null);
    return <AvailabilityToggle value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    value: "available",
    onChange: () => {},
    disabled: true,
  },
};
