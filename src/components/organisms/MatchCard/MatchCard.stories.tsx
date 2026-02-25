import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchCard } from "./MatchCard";
import type { Match } from "@/types";

const baseMatch: Match = {
  id: "1",
  team_id: "t1",
  opponent: "FC Vooruit",
  match_date: "2026-03-15T14:00:00Z",
  location: "Sportpark De Toekomst",
  home_away: "home",
  status: "upcoming",
  score_home: null,
  score_away: null,
  notes: null,
  created_at: "2026-01-01T00:00:00Z",
  gathering_time: null,
  travel_time_minutes: null,
};

const meta: Meta<typeof MatchCard> = {
  title: "Organisms/MatchCard",
  component: MatchCard,
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
type Story = StoryObj<typeof MatchCard>;

export const Upcoming: Story = {
  args: {
    match: baseMatch,
    defaultGatheringMinutes: 60,
    onClick: () => console.log("clicked"),
  },
};

export const Completed: Story = {
  args: {
    match: {
      ...baseMatch,
      status: "completed",
      score_home: 3,
      score_away: 1,
    },
  },
};

export const Cancelled: Story = {
  args: {
    match: {
      ...baseMatch,
      status: "cancelled",
    },
  },
};

export const Away: Story = {
  args: {
    match: {
      ...baseMatch,
      home_away: "away",
      opponent: "SV De Adelaar",
      location: "Sportpark Het Zuiden",
    },
    defaultGatheringMinutes: 60,
  },
};

export const AwayWithTravelTime: Story = {
  args: {
    match: {
      ...baseMatch,
      home_away: "away",
      opponent: "SV De Adelaar",
      location: "Sportpark Het Zuiden",
      travel_time_minutes: 35,
    },
    defaultGatheringMinutes: 60,
  },
};

export const WithGatheringOverride: Story = {
  args: {
    match: {
      ...baseMatch,
      gathering_time: "2026-03-15T12:30:00Z",
    },
    defaultGatheringMinutes: 60,
  },
};
