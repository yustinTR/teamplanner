import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamSwitcher } from "./TeamSwitcher";
import { useAuthStore } from "@/stores/auth-store";
import { createMockTeam } from "@/lib/test/mock-data";
import type { TeamMembership } from "@/types";

const coachTeam = createMockTeam({
  id: "team-coach",
  name: "FC Testteam G2",
  team_type: "jo11_jo9",
  created_by: "user-coach-001",
});

const playerTeam = createMockTeam({
  id: "team-player",
  name: "VV Oranje 5",
  team_type: "senioren",
  created_by: "someone-else",
});

const meta: Meta<typeof TeamSwitcher> = {
  title: "Molecules/TeamSwitcher",
  component: TeamSwitcher,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-20 w-80 rounded-lg bg-gradient-to-r from-primary-800 to-primary-600">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TeamSwitcher>;

export const MultipleTeams: Story = {
  decorators: [
    (Story) => {
      const memberships: TeamMembership[] = [
        { team: coachTeam, role: "coach", playerId: null },
        { team: playerTeam, role: "player", playerId: "p1" },
      ];
      useAuthStore.setState({
        currentTeam: coachTeam,
        myTeams: memberships,
        isCoach: true,
      });
      return <Story />;
    },
  ],
};

export const SingleTeam: Story = {
  name: "Single Team (hidden)",
  decorators: [
    (Story) => {
      const memberships: TeamMembership[] = [
        { team: coachTeam, role: "coach", playerId: null },
      ];
      useAuthStore.setState({
        currentTeam: coachTeam,
        myTeams: memberships,
        isCoach: true,
      });
      return <Story />;
    },
  ],
};

export const NoTeam: Story = {
  name: "No Teams (hidden)",
  decorators: [
    (Story) => {
      useAuthStore.setState({
        currentTeam: null,
        myTeams: [],
        isCoach: false,
      });
      return <Story />;
    },
  ],
};
