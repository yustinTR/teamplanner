import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchForm } from "./MatchForm";

const meta: Meta<typeof MatchForm> = {
  title: "Molecules/MatchForm",
  component: MatchForm,
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
type Story = StoryObj<typeof MatchForm>;

export const Create: Story = {
  args: {
    submitLabel: "Wedstrijd aanmaken",
    defaultGatheringMinutes: 60,
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const Edit: Story = {
  args: {
    defaultValues: {
      opponent: "FC Vooruit",
      match_date: "2026-03-15T14:00",
      location: "Sportpark De Toekomst",
      home_away: "home",
      notes: "Veld 2",
    },
    defaultGatheringMinutes: 60,
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const AwayMatch: Story = {
  args: {
    defaultValues: {
      opponent: "SV De Adelaar",
      match_date: "2026-03-22T14:30",
      location: "Sportpark Het Zuiden, Rotterdam",
      home_away: "away",
      notes: null,
    },
    defaultGatheringMinutes: 60,
    homeAddress: "Sportpark De Toekomst, Amsterdam",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const AwayWithTravelTime: Story = {
  args: {
    defaultValues: {
      opponent: "SV De Adelaar",
      match_date: "2026-03-22T14:30",
      location: "Sportpark Het Zuiden, Rotterdam",
      home_away: "away",
      notes: null,
      travel_time_minutes: 35,
    },
    defaultGatheringMinutes: 60,
    homeAddress: "Sportpark De Toekomst, Amsterdam",
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};

export const WithGatheringOverride: Story = {
  args: {
    defaultValues: {
      opponent: "FC Vooruit",
      match_date: "2026-03-15T14:00",
      location: "Sportpark De Toekomst",
      home_away: "home",
      notes: null,
      gathering_time: "2026-03-15T12:30:00Z",
    },
    defaultGatheringMinutes: 60,
    onSubmit: async (data) => {
      console.log("Submit:", data);
    },
  },
};
