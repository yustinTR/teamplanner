import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthRedirect } from "./AuthRedirect";

const meta: Meta<typeof AuthRedirect> = {
  title: "Molecules/AuthRedirect",
  component: AuthRedirect,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        push: () => {},
        replace: () => {},
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthRedirect>;

export const Default: Story = {};
