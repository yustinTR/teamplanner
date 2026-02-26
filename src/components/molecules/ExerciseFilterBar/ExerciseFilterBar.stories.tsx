import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseFilterBar } from "./ExerciseFilterBar";

const meta: Meta<typeof ExerciseFilterBar> = {
  title: "Molecules/ExerciseFilterBar",
  component: ExerciseFilterBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ExerciseFilterBar>;

export const NoFilters: Story = {
  args: {
    filters: {},
    onFiltersChange: (f) => console.log("Filters:", f),
  },
};

export const WithCategory: Story = {
  args: {
    filters: { category: "passing" },
    onFiltersChange: (f) => console.log("Filters:", f),
  },
};

export const WithAdvancedFilters: Story = {
  args: {
    filters: { category: "warming_up", difficulty: "basis", maxDuration: 10 },
    onFiltersChange: (f) => console.log("Filters:", f),
  },
};
