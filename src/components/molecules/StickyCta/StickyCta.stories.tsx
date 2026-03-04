import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyCta } from "./StickyCta";

const meta: Meta<typeof StickyCta> = {
  title: "Molecules/StickyCta",
  component: StickyCta,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[200vh]">
        <div className="bg-primary-800 p-8">
          <button
            id="hero-cta-demo"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-primary-800"
          >
            Maak je team aan
          </button>
        </div>
        <div className="p-8">
          <p className="text-muted-foreground">
            Scroll naar beneden om de sticky CTA te zien verschijnen.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StickyCta>;

export const Default: Story = {
  args: {
    targetId: "hero-cta-demo",
  },
};
