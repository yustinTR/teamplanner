import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DndContext } from "@dnd-kit/core";
import { PitchPlayer } from "./PitchPlayer";

const meta: Meta<typeof PitchPlayer> = {
  title: "Molecules/PitchPlayer",
  component: PitchPlayer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DndContext>
        <div className="relative h-64 w-64 bg-green-600">
          <Story />
        </div>
      </DndContext>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PitchPlayer>;

export const Default: Story = {
  args: {
    id: "p1",
    name: "Jan",
    jerseyNumber: 10,
    positionLabel: "ST",
    x: 50,
    y: 50,
  },
};

export const WithoutNumber: Story = {
  args: {
    id: "p2",
    name: "Pieter",
    positionLabel: "CM",
    x: 30,
    y: 60,
  },
};

export const Draggable: Story = {
  args: {
    id: "p3",
    name: "Klaas",
    jerseyNumber: 8,
    positionLabel: "CM",
    x: 50,
    y: 50,
    draggable: true,
  },
};
