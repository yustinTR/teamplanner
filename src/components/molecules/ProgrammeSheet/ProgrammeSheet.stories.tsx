import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgrammeSheet } from "./ProgrammeSheet";
import { createMockMatch } from "@/lib/test/mock-data";

const meta: Meta<typeof ProgrammeSheet> = {
  title: "Molecules/ProgrammeSheet",
  component: ProgrammeSheet,
  decorators: [
    (Story) => (
      <div className="overflow-auto bg-neutral-200 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgrammeSheet>;

export const Default: Story = {
  args: {
    teamName: "FC Testteam JO13-2",
    defaultGatheringMinutes: 60,
    matches: [
      createMockMatch({ id: "m1", opponent: "FC Vooruit", match_date: "2026-11-07T13:30:00", location: "Sportpark De Toekomst", home_away: "home" }),
      createMockMatch({ id: "m2", opponent: "SV De Adelaar", match_date: "2026-11-14T11:00:00", location: "Sportpark Het Zuiden", home_away: "away", travel_time_minutes: 35 }),
      createMockMatch({ id: "m3", opponent: "VV Noord", match_date: "2026-11-21T14:30:00", location: null, home_away: "home", gathering_time: "2026-11-21T13:15:00" }),
      createMockMatch({ id: "m4", opponent: "RKSV Zuid", match_date: "2026-12-05T12:00:00", location: "Sportpark Zuid", home_away: "away" }),
    ],
  },
};

export const Empty: Story = {
  args: {
    teamName: "FC Testteam",
    defaultGatheringMinutes: 60,
    matches: [],
  },
};
