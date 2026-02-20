import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerMinutesBar } from "./PlayerMinutesBar";

const meta: Meta<typeof PlayerMinutesBar> = {
  title: "Molecules/PlayerMinutesBar",
  component: PlayerMinutesBar,
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
type Story = StoryObj<typeof PlayerMinutesBar>;

export const FullMatch: Story = {
  args: {
    name: "Jan de Vries",
    totalMinutes: 90,
    percentage: 100,
    totalMatchMinutes: 90,
    periods: [{ start: 0, end: 90 }],
  },
};

export const PartialPlay: Story = {
  args: {
    name: "Pieter Bakker",
    totalMinutes: 60,
    percentage: 67,
    totalMatchMinutes: 90,
    periods: [{ start: 0, end: 30 }, { start: 60, end: 90 }],
  },
};

export const BenchStart: Story = {
  args: {
    name: "Klaas Jansen",
    totalMinutes: 45,
    percentage: 50,
    totalMatchMinutes: 90,
    periods: [{ start: 45, end: 90 }],
  },
};
