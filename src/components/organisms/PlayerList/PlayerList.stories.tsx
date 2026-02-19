import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerList } from "./PlayerList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof PlayerList> = {
  title: "Organisms/PlayerList",
  component: PlayerList,
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
          <div className="max-w-sm p-4">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PlayerList>;

export const Default: Story = {};

export const AsPlayer: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ isCoach: false });
      return <Story />;
    },
  ],
};
