import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventTaskForm } from "./EventTaskForm";
import { MOCK_PLAYERS } from "@/lib/test/mock-data";

const meta: Meta<typeof EventTaskForm> = {
  title: "Molecules/EventTaskForm",
  component: EventTaskForm,
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
type Story = StoryObj<typeof EventTaskForm>;

export const Default: Story = {
  args: {
    players: MOCK_PLAYERS,
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const NoPlayers: Story = {
  args: {
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
