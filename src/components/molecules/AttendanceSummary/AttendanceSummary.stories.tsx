import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AttendanceSummary } from "./AttendanceSummary";

const meta: Meta<typeof AttendanceSummary> = {
  title: "Molecules/AttendanceSummary",
  component: AttendanceSummary,
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
type Story = StoryObj<typeof AttendanceSummary>;

export const Default: Story = {
  args: {
    coming: 8,
    notComing: 3,
    maybe: 2,
  },
};

export const Empty: Story = {
  args: {
    coming: 0,
    notComing: 0,
    maybe: 0,
  },
};
