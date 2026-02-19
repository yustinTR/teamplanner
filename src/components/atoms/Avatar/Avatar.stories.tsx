import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fallback: "Jan de Vries",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    fallback: "Pieter Bakker",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    fallback: "Klaas Jansen",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    fallback: "Willem Smit",
    size: "lg",
  },
};

export const SingleName: Story = {
  args: {
    fallback: "Coach",
    size: "md",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=3",
    fallback: "Jan de Vries",
    size: "md",
  },
};

export const AllSizes: Story = {
  args: {
    fallback: "Jan de Vries",
  },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="Jan de Vries" size="sm" />
      <Avatar fallback="Jan de Vries" size="md" />
      <Avatar fallback="Jan de Vries" size="lg" />
    </div>
  ),
};
