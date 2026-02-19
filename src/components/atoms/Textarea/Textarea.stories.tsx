import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Typ hier...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Dit is een voorbeeld van een notitie bij een speler.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Uitgeschakeld",
    disabled: true,
  },
};

export const WithRows: Story = {
  args: {
    placeholder: "Notities...",
    rows: 4,
  },
};
