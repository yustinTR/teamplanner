import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrainingPlanCard } from "./TrainingPlanCard";

const meta: Meta<typeof TrainingPlanCard> = {
  title: "Molecules/TrainingPlanCard",
  component: TrainingPlanCard,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TrainingPlanCard>;

export const Default: Story = {
  args: {
    id: "plan-001",
    title: "Passing & positiespel training",
    totalDuration: 75,
    exerciseCount: 5,
  },
};

export const SingleExercise: Story = {
  args: {
    id: "plan-002",
    title: "Warming-up sessie",
    totalDuration: 10,
    exerciseCount: 1,
  },
};

export const NoDuration: Story = {
  args: {
    id: "plan-003",
    title: "Nieuwe training",
    exerciseCount: 0,
  },
};
