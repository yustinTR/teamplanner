import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialProof } from "./SocialProof";

const DEMO_QUOTES = [
  {
    quote:
      "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen. Het bespaart me enorm veel WhatsApp-berichten.",
    name: "Yustin Troost",
    team: "Trainer G2 Be Fair",
  },
];

const meta: Meta<typeof SocialProof> = {
  title: "Molecules/SocialProof",
  component: SocialProof,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="-m-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SocialProof>;

export const WithTeamCount: Story = {
  args: {
    teamCount: 23,
    quotes: DEMO_QUOTES,
  },
};

export const FewTeams: Story = {
  args: {
    teamCount: 3,
    quotes: DEMO_QUOTES,
  },
};
