import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DndContext } from "@dnd-kit/core";
import { BenchPlayer } from "./BenchPlayer";

const meta: Meta<typeof BenchPlayer> = {
  title: "Molecules/BenchPlayer",
  component: BenchPlayer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DndContext>
        <div className="max-w-[200px] p-4">
          <Story />
        </div>
      </DndContext>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BenchPlayer>;

export const Default: Story = {
  args: {
    id: "p1",
    name: "Jan de Vries",
    jerseyNumber: 10,
  },
};

export const Draggable: Story = {
  args: {
    id: "p2",
    name: "Pieter Bakker",
    jerseyNumber: 8,
    draggable: true,
  },
};

export const WithoutNumber: Story = {
  args: {
    id: "p3",
    name: "Klaas Jansen",
  },
};
