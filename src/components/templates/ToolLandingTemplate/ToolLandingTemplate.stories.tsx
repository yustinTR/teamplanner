import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToolLandingTemplate } from "./ToolLandingTemplate";

const meta: Meta<typeof ToolLandingTemplate> = {
  title: "Templates/ToolLandingTemplate",
  component: ToolLandingTemplate,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ToolLandingTemplate>;

export const Default: Story = {
  args: {
    breadcrumb: "Wisselschema 8 tegen 8",
    title: "Wisselschema 8 tegen 8 maken",
    intro: "Eerlijke speeltijd voor je JO11- of JO12-team, in één minuut.",
    facts: ["Een keeper en zeven veldspelers per team.", "Speeltijd 2x 30 minuten."],
    children: <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">Tool</div>,
    sections: [{ heading: "Voorbeeld", paragraphs: ["Met tien spelers zitten er steeds twee op de bank."] }],
    faq: [{ question: "Hoe lang duurt 8 tegen 8?", answer: "2x 30 minuten." }],
    related: [
      { href: "/tools/wisselschema/6-tegen-6", label: "Wisselschema 6 tegen 6" },
      { href: "/tools/opstelling/8-tegen-8", label: "Opstelling 8 tegen 8" },
    ],
  },
};
