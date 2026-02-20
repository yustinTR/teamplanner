import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { AttendanceToggle } from "./AttendanceToggle";
import type { AttendanceStatus } from "@/types";

const meta: Meta<typeof AttendanceToggle> = {
  title: "Molecules/AttendanceToggle",
  component: AttendanceToggle,
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
type Story = StoryObj<typeof AttendanceToggle>;

export const NoSelection: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
};

export const Coming: Story = {
  args: {
    value: "coming",
    onChange: () => {},
  },
};

export const NotComing: Story = {
  args: {
    value: "not_coming",
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
    const [value, setValue] = useState<AttendanceStatus | null>(null);
    return <AttendanceToggle value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    value: "coming",
    onChange: () => {},
    disabled: true,
  },
};
