import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ExerciseList } from "./ExerciseList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_TEAM, createMockUser } from "@/lib/test/mock-data";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof ExerciseList> = {
  title: "Organisms/ExerciseList",
  component: ExerciseList,
  tags: ["autodocs"],
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
type Story = StoryObj<typeof ExerciseList>;

export const Default: Story = {};
