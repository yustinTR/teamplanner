import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubstitutionMomentCard } from "./SubstitutionMomentCard";

const meta: Meta<typeof SubstitutionMomentCard> = {
  title: "Molecules/SubstitutionMomentCard",
  component: SubstitutionMomentCard,
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
type Story = StoryObj<typeof SubstitutionMomentCard>;

export const Default: Story = {
  args: {
    moment: {
      minute: 25,
      out: [
        { player_id: "p1", name: "Jan de Vries", position_label: "CM" },
      ],
      in: [
        { player_id: "p2", name: "Pieter Bakker", position_label: "CM" },
      ],
    },
  },
};

export const MultipleSwaps: Story = {
  args: {
    moment: {
      minute: 45,
      out: [
        { player_id: "p1", name: "Jan de Vries", position_label: "LB" },
        { player_id: "p3", name: "Klaas Jansen", position_label: "RW" },
      ],
      in: [
        { player_id: "p2", name: "Pieter Bakker", position_label: "LB" },
        { player_id: "p4", name: "Willem Visser", position_label: "RW" },
      ],
    },
  },
};
