import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventCard } from "./EventCard";

const meta: Meta<typeof EventCard> = {
  title: "Organisms/EventCard",
  component: EventCard,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {
    id: "event-001",
    title: "Kersttoernooi",
    eventDate: "2026-12-20T10:00:00Z",
    location: "Sportpark De Toekomst",
    comingCount: 12,
  },
};

export const NoLocation: Story = {
  args: {
    id: "event-002",
    title: "Teamfeest",
    eventDate: "2026-06-15T20:00:00Z",
  },
};
