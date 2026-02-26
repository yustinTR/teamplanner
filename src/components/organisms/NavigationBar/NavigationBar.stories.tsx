import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavigationBar } from "./NavigationBar";

const meta: Meta<typeof NavigationBar> = {
  title: "Organisms/NavigationBar",
  component: NavigationBar,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationBar>;

export const HomeActive: Story = {};

export const MatchesActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/matches",
      },
    },
  },
};

export const TrainingActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/trainingen",
      },
    },
  },
};

export const TeamActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/team",
      },
    },
  },
};

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/profile",
      },
    },
  },
};
