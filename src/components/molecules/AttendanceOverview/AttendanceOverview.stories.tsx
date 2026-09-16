import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AttendanceOverview } from "./AttendanceOverview";
import type { PlayerAttendance } from "@/types";

const attendance = (
  name: string,
  availableRate: number,
  responseRate: number
): PlayerAttendance => ({
  playerId: name.toLowerCase(),
  playerName: name,
  respondedCount: Math.round(responseRate / 10),
  availableCount: Math.round(availableRate / 10),
  responseRate,
  availableRate,
});

const meta: Meta<typeof AttendanceOverview> = {
  title: "Molecules/AttendanceOverview",
  component: AttendanceOverview,
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
type Story = StoryObj<typeof AttendanceOverview>;

export const Default: Story = {
  args: {
    attendance: [
      attendance("Daan", 90, 100),
      attendance("Sem", 80, 90),
      attendance("Milan", 60, 80),
      attendance("Levi", 40, 50),
      attendance("Finn", 10, 20),
      attendance("Noah", 0, 0),
    ],
  },
};

export const AllResponded: Story = {
  args: {
    attendance: [
      attendance("Daan", 100, 100),
      attendance("Sem", 70, 100),
      attendance("Milan", 50, 100),
    ],
  },
};

export const Empty: Story = {
  args: {
    attendance: [],
  },
};
