import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InviteLink } from "./InviteLink";

const meta: Meta<typeof InviteLink> = {
  title: "Molecules/InviteLink",
  component: InviteLink,
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
type Story = StoryObj<typeof InviteLink>;

export const Default: Story = {
  args: {
    inviteCode: "abc123def",
  },
};
