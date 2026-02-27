import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaqSection } from "./FaqSection";

const meta: Meta<typeof FaqSection> = {
  title: "Molecules/FaqSection",
  component: FaqSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="-m-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FaqSection>;

export const Default: Story = {
  args: {
    items: [
      {
        question: "Is MyTeamPlanner echt gratis?",
        answer:
          "Ja, MyTeamPlanner is volledig gratis. Geen creditcard nodig, geen verborgen kosten. Alle functies zijn beschikbaar voor iedereen.",
      },
      {
        question: "Hoe werkt de beschikbaarheid?",
        answer:
          "Spelers geven met een tik aan of ze beschikbaar, afwezig of misschien kunnen. De coach ziet een realtime overzicht van het hele team.",
      },
      {
        question: "Kan ik opstellingen maken met drag & drop?",
        answer:
          "Ja, kies een formatie en sleep spelers naar hun positie op het veld. Je kunt ook een wisselschema maken met automatische speeltijdverdeling.",
      },
    ],
  },
};
