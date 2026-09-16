import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SyncLogList } from "./SyncLogList";

const meta: Meta<typeof SyncLogList> = {
  title: "Molecules/SyncLogList",
  component: SyncLogList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SyncLogList>;

export const Default: Story = {
  args: {
    entries: [
      {
        id: "log-1",
        run_at: "2026-09-16T05:00:00Z",
        matches_created: 2,
        matches_updated: 1,
        results_updated: 1,
        changes: [
          {
            type: "created",
            opponent: "SEV G3",
            matchDate: "2026-10-03T08:30:00Z",
          },
          {
            type: "created",
            opponent: "RVC G1",
            matchDate: "2026-10-10T09:00:00Z",
          },
          {
            type: "updated",
            opponent: "Forum Sport G2",
            matchDate: "2026-09-26T09:45:00Z",
          },
          {
            type: "result",
            opponent: "Wassenaar G1",
            matchDate: "2026-09-12T08:30:00Z",
          },
        ],
      },
      {
        id: "log-2",
        run_at: "2026-09-10T05:00:00Z",
        matches_created: 0,
        matches_updated: 0,
        results_updated: 1,
        changes: [
          {
            type: "result",
            opponent: "Voorschoten G2",
            matchDate: "2026-09-05T09:00:00Z",
          },
        ],
      },
    ],
  },
};

export const ManyChanges: Story = {
  args: {
    entries: [
      {
        id: "log-1",
        run_at: "2026-09-16T05:00:00Z",
        matches_created: 8,
        matches_updated: 0,
        results_updated: 0,
        changes: Array.from({ length: 8 }, (_, i) => ({
          type: "created" as const,
          opponent: `Tegenstander ${i + 1}`,
          matchDate: "2026-10-03T08:30:00Z",
        })),
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
};
