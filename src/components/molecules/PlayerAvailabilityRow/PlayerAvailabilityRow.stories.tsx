import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerAvailabilityRow } from "./PlayerAvailabilityRow";

const meta: Meta<typeof PlayerAvailabilityRow> = {
  title: "Molecules/PlayerAvailabilityRow",
  component: PlayerAvailabilityRow,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlayerAvailabilityRow>;

export const Available: Story = {
  args: { name: "Jan de Vries", status: "available" },
};

export const Unavailable: Story = {
  args: { name: "Pieter Bakker", status: "unavailable" },
};

export const Maybe: Story = {
  args: { name: "Klaas Jansen", status: "maybe" },
};

export const NoResponse: Story = {
  args: { name: "Marco van Dijk", status: null },
};
