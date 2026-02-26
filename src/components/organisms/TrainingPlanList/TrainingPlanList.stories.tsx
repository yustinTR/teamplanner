import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrainingPlanList } from "./TrainingPlanList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof TrainingPlanList> = {
  title: "Organisms/TrainingPlanList",
  component: TrainingPlanList,
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
type Story = StoryObj<typeof TrainingPlanList>;

export const Default: Story = {};

export const AsPlayer: Story = {
  decorators: [
    (Story) => {
      useAuthStore.setState({ isCoach: false });
      return <Story />;
    },
  ],
};
