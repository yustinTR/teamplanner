import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShareLineupButton } from "./ShareLineupButton";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, MOCK_PLAYERS, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof ShareLineupButton> = {
  title: "Organisms/ShareLineupButton",
  component: ShareLineupButton,
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
  args: {
    matchId: "match-001",
    opponent: "FC Tegenstander",
    matchDate: "2026-03-07T14:30:00",
  },
};

export default meta;
type Story = StoryObj<typeof ShareLineupButton>;

export const Default: Story = {};

export const Icon: Story = {
  args: { variant: "icon" },
};
