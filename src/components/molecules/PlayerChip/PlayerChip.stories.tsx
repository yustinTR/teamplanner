import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerChip } from "./PlayerChip";

const meta: Meta<typeof PlayerChip> = {
  title: "Molecules/PlayerChip",
  component: PlayerChip,
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
type Story = StoryObj<typeof PlayerChip>;

export const Default: Story = {
  args: {
    name: "Jan de Vries",
  },
};

export const WithPosition: Story = {
  args: {
    name: "Pieter Bakker",
    position: "midfielder",
    jerseyNumber: 8,
  },
};

export const WithJerseyNumber: Story = {
  args: {
    name: "Klaas Jansen",
    jerseyNumber: 10,
  },
};

export const Clickable: Story = {
  args: {
    name: "Marco van Dijk",
    position: "forward",
    jerseyNumber: 9,
    onClick: () => console.log("clicked"),
  },
};
