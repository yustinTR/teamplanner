import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Molecules/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const BlogPost: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Voetbal teamindeling maken" },
    ],
  },
};

export const FeaturePage: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/#features" },
      { label: "Beschikbaarheid" },
    ],
  },
};
