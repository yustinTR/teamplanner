import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchPlayerChip } from "./MatchPlayerChip";

const meta: Meta<typeof MatchPlayerChip> = {
  title: "Molecules/MatchPlayerChip",
  component: MatchPlayerChip,
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
type Story = StoryObj<typeof MatchPlayerChip>;

export const Default: Story = {
  args: {
    name: "Lars de Jong",
  },
};

export const WithPosition: Story = {
  args: {
    name: "Lars de Jong",
    position: "CM",
  },
};

export const WithDelete: Story = {
  args: {
    name: "Lars de Jong",
    position: "CB",
    onDelete: () => console.log("delete"),
  },
};
