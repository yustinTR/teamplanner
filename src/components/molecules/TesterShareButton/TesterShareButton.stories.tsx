import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { TesterShareButton } from "./TesterShareButton";

const meta: Meta<typeof TesterShareButton> = {
  title: "Molecules/TesterShareButton",
  component: TesterShareButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TesterShareButton>;

export const Default: Story = {
  args: { placement: "story" },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: /deel met je team/i });
    await expect(link.getAttribute("href")).toContain("https://wa.me/?text=");
    await expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain(
      "myteamplanner.nl/android"
    );
  },
};

export const CustomLabel: Story = {
  args: { placement: "story", label: "Stuur door via WhatsApp" },
};
