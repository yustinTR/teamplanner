import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseCategoryChip } from "./ExerciseCategoryChip";

const meta: Meta<typeof ExerciseCategoryChip> = {
  title: "Molecules/ExerciseCategoryChip",
  component: ExerciseCategoryChip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExerciseCategoryChip>;

export const Default: Story = {
  args: {
    category: "passing",
    label: "Passing",
    selected: false,
    onClick: () => {},
  },
};

export const Selected: Story = {
  args: {
    category: "passing",
    label: "Passing",
    selected: true,
    onClick: () => {},
  },
};

export const AllCategories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ExerciseCategoryChip category="warming_up" label="Warming-up" selected={false} onClick={() => {}} />
      <ExerciseCategoryChip category="passing" label="Passing" selected={true} onClick={() => {}} />
      <ExerciseCategoryChip category="positiespel" label="Positiespel" selected={false} onClick={() => {}} />
      <ExerciseCategoryChip category="verdedigen" label="Verdedigen" selected={false} onClick={() => {}} />
      <ExerciseCategoryChip category="aanvallen" label="Aanvallen" selected={false} onClick={() => {}} />
      <ExerciseCategoryChip category="conditie" label="Conditie" selected={false} onClick={() => {}} />
      <ExerciseCategoryChip category="afwerken" label="Afwerken" selected={false} onClick={() => {}} />
    </div>
  ),
};
