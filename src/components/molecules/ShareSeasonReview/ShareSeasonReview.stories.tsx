import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareSeasonReview } from "./ShareSeasonReview";

const meta: Meta<typeof ShareSeasonReview> = {
  title: "Molecules/ShareSeasonReview",
  component: ShareSeasonReview,
  decorators: [
    (Story) => (
      <div className="flex justify-center bg-neutral-100 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShareSeasonReview>;

const summary = { played: 9, wins: 5, draws: 2, losses: 2, goalsFor: 24, goalsAgainst: 13 };

export const WinterBreak: Story = {
  args: {
    teamName: "JO11-1",
    seasonLabel: "2026/27",
    subtitle: "tot de winterstop",
    review: {
      summary,
      topScorers: [
        { name: "Lucas", value: 8 },
        { name: "Finn", value: 5 },
        { name: "Noah", value: 3 },
      ],
      topAssists: [
        { name: "Milan", value: 6 },
        { name: "Finn", value: 4 },
      ],
      bestAttendance: [
        { name: "Daan", value: 100 },
        { name: "Sem", value: 89 },
        { name: "Luuk", value: 89 },
      ],
    },
  },
};

/** No goals or attendance recorded: only the record shows. */
export const RecordOnly: Story = {
  args: {
    teamName: "Zaterdag 3",
    seasonLabel: "2025/26",
    review: { summary, topScorers: [], topAssists: [], bestAttendance: [] },
  },
};
