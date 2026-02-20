import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventForm } from "./EventForm";

const meta: Meta<typeof EventForm> = {
  title: "Molecules/EventForm",
  component: EventForm,
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
type Story = StoryObj<typeof EventForm>;

export const Create: Story = {
  args: {
    submitLabel: "Evenement aanmaken",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const Edit: Story = {
  args: {
    defaultValues: {
      title: "Kersttoernooi",
      description: "Jaarlijks kersttoernooi",
      event_date: "2026-12-20T10:00:00",
      location: "Sportpark De Toekomst",
    },
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
