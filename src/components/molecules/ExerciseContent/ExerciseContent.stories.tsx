import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseContent } from "./ExerciseContent";
import type { Exercise } from "@/types";

const exercise: Exercise = {
  id: "ex-001",
  title: "Rondo 4 tegen 2",
  category: "warming_up",
  difficulty: "basis",
  description:
    "Vier spelers houden de bal rond in een vierkant, twee spelers in het midden proberen hem te veroveren. Wie de bal verliest, gaat het midden in.",
  setup_instructions: "Vierkant van 10 bij 10 meter, één bal, hesjes voor de twee middenspelers.",
  variations: "Maximaal twee balcontacten, of het vierkant kleiner maken.",
  duration_minutes: 10,
  min_players: 6,
  max_players: 12,
  team_types: ["senioren", "jo12_jo11", "jo10", "jo11_jo9"],
  video_url: null,
  is_published: true,
  created_at: "2026-02-26T00:00:00Z",
  updated_at: "2026-02-26T00:00:00Z",
};

const meta: Meta<typeof ExerciseContent> = {
  title: "Molecules/ExerciseContent",
  component: ExerciseContent,
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
type Story = StoryObj<typeof ExerciseContent>;

/** Legacy 7 v 7 youth type (`jo11_jo9`) is tagged but not shown. */
export const Default: Story = {
  args: { exercise },
};

export const Minimal: Story = {
  args: {
    exercise: {
      ...exercise,
      title: "Dynamische stretching loopvormen",
      difficulty: "gevorderd",
      setup_instructions: null,
      variations: null,
      min_players: null,
      max_players: null,
      team_types: null,
    },
  },
};
