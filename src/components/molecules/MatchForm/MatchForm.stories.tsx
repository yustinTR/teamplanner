import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchForm } from "./MatchForm";

const meta: Meta<typeof MatchForm> = {
  title: "Molecules/MatchForm",
  component: MatchForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MatchForm>;

export const Create: Story = {
  args: {
    submitLabel: "Wedstrijd aanmaken",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const Edit: Story = {
  args: {
    defaultValues: {
      opponent: "FC Vooruit",
      match_date: "2026-03-15T14:00",
      location: "Sportpark De Toekomst",
      home_away: "home",
      notes: "Veld 2",
    },
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
