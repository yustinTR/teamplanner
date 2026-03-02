import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubstitutionMomentForm } from "./SubstitutionMomentForm";

const fieldPlayers = [
  { id: "p1", name: "Jan de Vries", position_label: "CM" },
  { id: "p2", name: "Pieter Bakker", position_label: "LB" },
  { id: "p3", name: "Klaas Jansen", position_label: "RW" },
  { id: "p4", name: "Willem Visser", position_label: "ST" },
];

const benchPlayers = [
  { id: "p5", name: "Tom Mulder" },
  { id: "p6", name: "Henk Smit" },
  { id: "p7", name: "Gerard de Boer" },
];

const meta: Meta<typeof SubstitutionMomentForm> = {
  title: "Molecules/SubstitutionMomentForm",
  component: SubstitutionMomentForm,
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
type Story = StoryObj<typeof SubstitutionMomentForm>;

export const Default: Story = {
  args: {
    fieldPlayers,
    benchPlayers,
    totalMinutes: 90,
    onSubmit: (moment) => console.log("Submit:", moment),
    onCancel: () => console.log("Cancel"),
  },
};

export const EditExisting: Story = {
  args: {
    fieldPlayers,
    benchPlayers,
    totalMinutes: 90,
    defaultValues: {
      minute: 25,
      out: [{ player_id: "p1", name: "Jan de Vries", position_label: "CM" }],
      in: [{ player_id: "p5", name: "Tom Mulder", position_label: "CM" }],
    },
    onSubmit: (moment) => console.log("Submit:", moment),
    onCancel: () => console.log("Cancel"),
  },
};

export const ShortMatch: Story = {
  args: {
    fieldPlayers: fieldPlayers.slice(0, 3),
    benchPlayers: benchPlayers.slice(0, 1),
    totalMinutes: 50,
    onSubmit: (moment) => console.log("Submit:", moment),
    onCancel: () => console.log("Cancel"),
  },
};
