import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerForm } from "./PlayerForm";

const meta: Meta<typeof PlayerForm> = {
  title: "Molecules/PlayerForm",
  component: PlayerForm,
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
type Story = StoryObj<typeof PlayerForm>;

export const Create: Story = {
  args: {
    submitLabel: "Speler toevoegen",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const Edit: Story = {
  args: {
    defaultValues: {
      name: "Jan de Vries",
      position: "midfielder",
      jersey_number: 8,
      notes: "Linksbenig, sterk aan de bal",
    },
    submitLabel: "Opslaan",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
