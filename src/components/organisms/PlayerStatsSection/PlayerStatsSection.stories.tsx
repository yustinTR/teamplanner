import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerStatsSection } from "./PlayerStatsSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof PlayerStatsSection> = {
  title: "Organisms/PlayerStatsSection",
  component: PlayerStatsSection,
  tags: ["autodocs"],
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
          <div className="max-w-sm p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PlayerStatsSection>;

export const Default: Story = {
  args: {
    playerId: "player-001",
    teamId: "team-001",
  },
};
