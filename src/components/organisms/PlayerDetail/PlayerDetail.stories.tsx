import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerDetail } from "./PlayerDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof PlayerDetail> = {
  title: "Organisms/PlayerDetail",
  component: PlayerDetail,
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
          <div className="max-w-sm">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PlayerDetail>;

export const Default: Story = {
  args: {
    playerId: "player-001",
  },
};

export const AsPlayer: Story = {
  args: {
    playerId: "player-001",
  },
  decorators: [
    (Story) => {
      useAuthStore.setState({ isCoach: false });
      return <Story />;
    },
  ],
};
