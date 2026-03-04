import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialProof } from "./SocialProof";

const DEMO_QUOTES = [
  {
    quote: "Eindelijk weet ik op donderdag al wie er zaterdag kan spelen.",
    name: "Coach Willem",
    team: "Be Fair 5",
  },
  {
    quote:
      "Mijn spelers vinden het geweldig dat ze de opstelling in de app kunnen zien.",
    name: "Trainer Karin",
    team: "VV Drieberg JO13",
  },
  {
    quote: "Het wisselschema bespaart me elke week minstens een kwartier.",
    name: "Coach Martijn",
    team: "DSVP G1",
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
