import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Opslaan",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Annuleren",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Verwijderen",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Bewerken",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Meer opties",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Bekijk details",
    variant: "link",
  },
};

export const Small: Story = {
  args: {
    children: "Klein",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Groot",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Uitgeschakeld",
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    children: "Primary",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  args: {
    children: "Klein",
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Klein</Button>
      <Button size="default">Standaard</Button>
      <Button size="lg">Groot</Button>
    </div>
  ),
};
