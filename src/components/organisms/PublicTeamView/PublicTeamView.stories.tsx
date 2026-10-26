import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PublicTeamView } from "./PublicTeamView";
import type { PublicMatch } from "@/types/public-team";

const NOW = "2026-11-02T10:00:00.000Z";
const inDays = (days: number) => new Date(new Date(NOW).getTime() + days * 86400 * 1000).toISOString();

const positions = [
  { name: "Jan de Vries", position_label: "K", x: 50, y: 92 },
  { name: "Pieter Bakker", position_label: "LB", x: 15, y: 75 },
  { name: "Klaas Jansen", position_label: "CB", x: 38, y: 78 },
  { name: "Willem Visser", position_label: "CB", x: 62, y: 78 },
  { name: "Henk Smit", position_label: "RB", x: 85, y: 75 },
  { name: "Tom Mulder", position_label: "CM", x: 25, y: 55 },
  { name: "Bas de Groot", position_label: "CM", x: 50, y: 50 },
  { name: "Sander Bos", position_label: "CM", x: 75, y: 55 },
  { name: "Marco Peters", position_label: "LW", x: 15, y: 25 },
  { name: "Ahmed El Amrani", position_label: "ST", x: 50, y: 20 },
  { name: "Dennis Kuijt", position_label: "RW", x: 85, y: 25 },
];

const matches: PublicMatch[] = [
  {
    id: "m1", opponent: "FC Vooruit", match_date: inDays(3), home_away: "home", location: "Sportpark De Toekomst",
    gathering_time: null, travel_time_minutes: null, status: "upcoming", score_home: null, score_away: null,
    lineup: { formation: "4-3-3", positions },
  },
  {
    id: "m2", opponent: "SV De Adelaar", match_date: inDays(10), home_away: "away", location: "Sportpark Het Zuiden",
    gathering_time: null, travel_time_minutes: 35, status: "upcoming", score_home: null, score_away: null, lineup: null,
  },
  {
    id: "m0", opponent: "VV Noord", match_date: inDays(-4), home_away: "home", location: null,
    gathering_time: null, travel_time_minutes: null, status: "completed", score_home: 2, score_away: 2, lineup: null,
  },
];

const meta: Meta<typeof PublicTeamView> = {
  title: "Organisms/PublicTeamView",
  component: PublicTeamView,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    teamName: "FC Testteam JO13-2",
    clubName: "FC Testteam",
    teamType: "jo15_jo13",
    defaultGatheringMinutes: 60,
    matches,
    now: NOW,
  },
};

export default meta;
type Story = StoryObj<typeof PublicTeamView>;

export const Default: Story = {};

export const NoMatches: Story = {
  args: { matches: [] },
};
