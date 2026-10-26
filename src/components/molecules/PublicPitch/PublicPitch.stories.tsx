import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PublicPitch } from "./PublicPitch";

const meta: Meta<typeof PublicPitch> = {
  title: "Molecules/PublicPitch",
  component: PublicPitch,
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
type Story = StoryObj<typeof PublicPitch>;

export const Default: Story = {
  args: {
    positions: [
      { name: "Jan de Vries", position_label: "K", x: 50, y: 92 },
      { name: "Pieter Bakker", position_label: "LB", x: 15, y: 75 },
      { name: "Klaas Jansen", position_label: "CB", x: 38, y: 78 },
      { name: "Willem Visser", position_label: "CB", x: 62, y: 78 },
      { name: "Henk Smit", position_label: "RB", x: 85, y: 75 },
      { name: "Tom Mulder", position_label: "CM", x: 25, y: 55 },
      { name: "Bas de Groot", position_label: "CM", x: 50, y: 50 },
      { name: "Sander Bos", position_label: "CM", x: 75, y: 55 },
      { name: "Marco Peters", position_label: "LW", x: 15, y: 25 },
      { name: "Ahmed El Amrani", position_label: "ST", x: 50, y: 20 },
      { name: "Dennis Kuijt", position_label: "RW", x: 85, y: 25 },
    ],
  },
};

export const SevenASide: Story = {
  args: {
    positions: [
      { name: "Keeper", position_label: "K", x: 50, y: 90 },
      { name: "Verdediger A", position_label: "LB", x: 25, y: 70 },
      { name: "Verdediger B", position_label: "RB", x: 75, y: 70 },
      { name: "Middenvelder A", position_label: "CM", x: 30, y: 45 },
      { name: "Middenvelder B", position_label: "CM", x: 70, y: 45 },
      { name: "Aanvaller A", position_label: "LW", x: 30, y: 20 },
      { name: "Aanvaller B", position_label: "RW", x: 70, y: 20 },
    ],
  },
};
