import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrainingPlanForm } from "./TrainingPlanForm";

const meta: Meta<typeof TrainingPlanForm> = {
  title: "Molecules/TrainingPlanForm",
  component: TrainingPlanForm,
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
type Story = StoryObj<typeof TrainingPlanForm>;

export const Create: Story = {
  args: {
    submitLabel: "Plan aanmaken",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const Edit: Story = {
  args: {
    defaultValues: {
      title: "Passing & positiespel",
      notes: "Focus op driehoekjes en snelle combinaties",
    },
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
