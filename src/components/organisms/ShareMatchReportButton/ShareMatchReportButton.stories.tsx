import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShareMatchReportButton } from "./ShareMatchReportButton";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";
import type { Match } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const match: Match = {
  id: "match-001",
  team_id: "t1",
  opponent: "FC Vooruit",
  match_date: "2026-03-15T14:00:00Z",
  location: "Sportpark De Toekomst",
  home_away: "home",
  status: "completed",
  score_home: 3,
  score_away: 1,
  notes: null,
  created_at: "2026-01-01T00:00:00Z",
  gathering_time: null,
  travel_time_minutes: null,
};

const meta: Meta<typeof ShareMatchReportButton> = {
  title: "Organisms/ShareMatchReportButton",
  component: ShareMatchReportButton,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      useAuthStore.setState({
        user: createMockUser(),
        currentTeam: MOCK_TEAM,
        currentPlayer: MOCK_PLAYERS[0],
        isCoach: true,
      });
      return (
        <QueryClientProvider client={queryClient}>
          <div className="p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  args: { match },
};

export default meta;
type Story = StoryObj<typeof ShareMatchReportButton>;

export const Default: Story = {};

export const Icon: Story = {
  args: { variant: "icon" },
};
