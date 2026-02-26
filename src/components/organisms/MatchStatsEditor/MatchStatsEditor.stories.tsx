import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStatsEditor } from "./MatchStatsEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof MatchStatsEditor> = {
  title: "Organisms/MatchStatsEditor",
  component: MatchStatsEditor,
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
          <div className="max-w-md p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof MatchStatsEditor>;

export const Default: Story = {
  args: {
    matchId: "match-002",
  },
};
