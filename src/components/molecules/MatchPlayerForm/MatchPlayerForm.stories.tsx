import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchPlayerForm } from "./MatchPlayerForm";

const meta: Meta<typeof MatchPlayerForm> = {
  title: "Molecules/MatchPlayerForm",
  component: MatchPlayerForm,
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
type Story = StoryObj<typeof MatchPlayerForm>;

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
