import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TeamStatsDashboard } from "./TeamStatsDashboard";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta: Meta<typeof TeamStatsDashboard> = {
  title: "Organisms/TeamStatsDashboard",
  component: TeamStatsDashboard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="max-w-md bg-neutral-50 p-4">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TeamStatsDashboard>;

export const Default: Story = {
  args: {
    teamId: "team-001",
  },
};
