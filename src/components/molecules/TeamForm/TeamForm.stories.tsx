import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamForm } from "./TeamForm";

const meta: Meta<typeof TeamForm> = {
  title: "Molecules/TeamForm",
  component: TeamForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TeamForm>;

export const CreateTeam: Story = {
  args: {
    submitLabel: "Team aanmaken",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const EditTeam: Story = {
  args: {
    defaultValues: {
      name: "Heren 1",
      club_name: "VV De Spartaan",
      team_type: "senioren",
      default_gathering_minutes: 60,
      home_address: "Sportpark De Toekomst, Amsterdam",
    },
    submitLabel: "Opslaan",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const EditTeamWithoutAddress: Story = {
  args: {
    defaultValues: {
      name: "Heren 2",
      club_name: "VV De Spartaan",
      team_type: "senioren",
      default_gathering_minutes: 45,
      home_address: null,
    },
    submitLabel: "Opslaan",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
