import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseCard } from "./ExerciseCard";

const meta: Meta<typeof ExerciseCard> = {
  title: "Molecules/ExerciseCard",
  component: ExerciseCard,
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
type Story = StoryObj<typeof ExerciseCard>;

export const Default: Story = {
  args: {
    id: "ex-001",
    title: "Rondo 4 tegen 2",
    category: "warming_up",
    duration: 10,
    minPlayers: 6,
    maxPlayers: 12,
    difficulty: "basis",
  },
};

export const Advanced: Story = {
  args: {
    id: "ex-002",
    title: "Positiespel met doelmannen",
    category: "positiespel",
    duration: 15,
    minPlayers: 10,
    maxPlayers: 16,
    difficulty: "gevorderd",
  },
};

export const NoPlayerCount: Story = {
  args: {
    id: "ex-003",
    title: "Dynamische stretching loopvormen",
    category: "warming_up",
    duration: 8,
    difficulty: "basis",
  },
};
