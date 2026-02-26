import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlanExerciseItem } from "./PlanExerciseItem";

const meta: Meta<typeof PlanExerciseItem> = {
  title: "Molecules/PlanExerciseItem",
  component: PlanExerciseItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm space-y-2 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PlanExerciseItem>;

export const Default: Story = {
  args: {
    id: "tpe-001",
    title: "Rondo 4 tegen 2",
    category: "warming_up",
    duration: 10,
  },
};

export const CoachView: Story = {
  args: {
    id: "tpe-001",
    title: "Rondo 4 tegen 2",
    category: "warming_up",
    duration: 10,
    isCoach: true,
    onRemove: () => console.log("Remove"),
  },
};

export const List: Story = {
  render: () => (
    <div className="space-y-2">
      <PlanExerciseItem id="1" title="Dynamische stretching" category="warming_up" duration={8} isCoach onRemove={() => {}} />
      <PlanExerciseItem id="2" title="Passing in driehoek" category="passing" duration={10} isCoach onRemove={() => {}} />
      <PlanExerciseItem id="3" title="Positiespel 4v4+2" category="positiespel" duration={15} isCoach onRemove={() => {}} />
    </div>
  ),
};
