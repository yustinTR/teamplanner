import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AndroidTesterSteps } from "./AndroidTesterSteps";

const meta: Meta<typeof AndroidTesterSteps> = {
  title: "Molecules/AndroidTesterSteps",
  component: AndroidTesterSteps,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AndroidTesterSteps>;

export const Default: Story = {};

export const TracksStepClick: Story = {
  play: async ({ canvasElement }) => {
    const pushed: Record<string, unknown>[] = [];
    window.dataLayer = { push: fn((e: Record<string, unknown>) => pushed.push(e)) } as unknown as Record<string, unknown>[];
    const link = within(canvasElement).getByRole("link", { name: /naar de testpagina/i });
    link.addEventListener("click", (e) => e.preventDefault(), { once: true });
    await userEvent.click(link);
    await expect(pushed[0]).toEqual({ event: "android_tester_step", step: "opt_in" });
  },
};
