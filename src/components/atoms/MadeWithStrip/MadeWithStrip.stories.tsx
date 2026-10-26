import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MadeWithStrip } from "./MadeWithStrip";

const meta: Meta<typeof MadeWithStrip> = {
  title: "Atoms/MadeWithStrip",
  component: MadeWithStrip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          width: 540,
          padding: 24,
          borderRadius: 16,
          overflow: "hidden",
          background: "#16213e",
          color: "#fff",
        }}
      >
        <p style={{ margin: 0 }}>Kaartinhoud</p>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MadeWithStrip>;

export const Default: Story = {};
