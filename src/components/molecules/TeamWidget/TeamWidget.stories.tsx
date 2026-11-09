import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { TeamWidget } from "./TeamWidget";
import type { PublicMatch } from "@/types/public-team";

const match = (id: string, overrides: Partial<PublicMatch>): PublicMatch => ({
  id,
  opponent: "VV Oost JO11-2",
  match_date: "2026-11-14T09:30:00+01:00",
  home_away: "home",
  location: null,
  gathering_time: null,
  travel_time_minutes: null,
  status: "upcoming",
  score_home: null,
  score_away: null,
  lineup: null,
  ...overrides,
});

const meta: Meta<typeof TeamWidget> = {
  title: "Molecules/TeamWidget",
  component: TeamWidget,
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
type Story = StoryObj<typeof TeamWidget>;

export const Default: Story = {
  args: {
    teamName: "JO11-1",
    clubName: "VV De Zwaluwen",
    now: "2026-11-10T12:00:00+01:00",
    matches: [
      match("1", {}),
      match("2", { opponent: "SV Noord JO11-1", home_away: "away", match_date: "2026-11-21T10:15:00+01:00" }),
      match("3", { opponent: "FC West JO11-3", status: "completed", score_home: 4, score_away: 2, match_date: "2026-11-07T09:30:00+01:00" }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/SV Noord JO11-1 – JO11-1/)).toBeInTheDocument();
    await expect(canvas.getByText("4 – 2")).toBeInTheDocument();
  },
};

export const NothingPlanned: Story = {
  args: { teamName: "Zaterdag 3", now: "2026-11-10T12:00:00+01:00", matches: [] },
};
