import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStatusBadge } from "./MatchStatusBadge";

const meta: Meta<typeof MatchStatusBadge> = {
  title: "Molecules/MatchStatusBadge",
  component: MatchStatusBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatchStatusBadge>;

export const Upcoming: Story = {
  args: { status: "upcoming" },
};

export const Completed: Story = {
  args: { status: "completed" },
};

export const Cancelled: Story = {
  args: { status: "cancelled" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex gap-2">
      <MatchStatusBadge status="upcoming" />
      <MatchStatusBadge status="completed" />
      <MatchStatusBadge status="cancelled" />
    </div>
  ),
};
