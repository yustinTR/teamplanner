import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventTaskItem } from "./EventTaskItem";

const meta: Meta<typeof EventTaskItem> = {
  title: "Molecules/EventTaskItem",
  component: EventTaskItem,
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
type Story = StoryObj<typeof EventTaskItem>;

export const Default: Story = {
  args: {
    title: "Bier regelen",
    description: "24 kratjes voor het team",
    isDone: false,
    onToggleDone: () => {},
  },
};

export const Assigned: Story = {
  args: {
    title: "Bier regelen",
    assignedTo: "Jan de Vries",
    deadline: "2026-04-01T18:00:00Z",
    isDone: false,
    onToggleDone: () => {},
  },
};

export const Done: Story = {
  args: {
    title: "Bier regelen",
    assignedTo: "Jan de Vries",
    isDone: true,
    onToggleDone: () => {},
  },
};

export const Claimable: Story = {
  args: {
    title: "Veld klaarzetten",
    isDone: false,
    canClaim: true,
    onClaim: () => console.log("Claimed!"),
    onToggleDone: () => {},
  },
};
