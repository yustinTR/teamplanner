import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarSubscribe } from "./CalendarSubscribe";

const meta: Meta<typeof CalendarSubscribe> = {
  title: "Molecules/CalendarSubscribe",
  component: CalendarSubscribe,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg bg-neutral-50 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CalendarSubscribe>;

export const Default: Story = {
  args: {
    feedUrl: "https://www.myteamplanner.nl/volg/05d337b6519848a5b4dcf9e1323f5a26/agenda.ics",
  },
};
