import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { LineupSheet } from "./LineupSheet";
import { A4_WIDTH_MM, fittedHeightMm, pageOffsets } from "@/lib/pdf";
import type { SubstitutionPlan } from "@/types";

const players = [
  { name: "Jan de Vries", positionLabel: "K", x: 50, y: 92 },
  { name: "Pieter Bakker", positionLabel: "LB", x: 15, y: 75 },
  { name: "Klaas Jansen", positionLabel: "CB", x: 38, y: 78 },
  { name: "Willem Visser", positionLabel: "CB", x: 62, y: 78 },
  { name: "Henk Smit", positionLabel: "RB", x: 85, y: 75 },
  { name: "Tom Mulder", positionLabel: "CM", x: 25, y: 55 },
  { name: "Bas de Groot", positionLabel: "CM", x: 50, y: 50 },
  { name: "Sander Bos", positionLabel: "CM", x: 75, y: 55 },
  { name: "Marco Peters", positionLabel: "LW", x: 15, y: 25 },
  { name: "Ahmed El Amrani", positionLabel: "ST", x: 50, y: 20 },
  { name: "Dennis Kuijt", positionLabel: "RW", x: 85, y: 25 },
].map((p) => ({ ...p, overall: null, cardTier: null }));

const plan: SubstitutionPlan = {
  teamType: "senioren",
  totalMinutes: 90,
  substitutionMoments: [
    {
      minute: 30,
      out: [{ player_id: "p6", name: "Tom Mulder", position_label: "CM" }],
      in: [{ player_id: "b1", name: "Van Dijk", position_label: "CM" }],
    },
    {
      minute: 60,
      out: [{ player_id: "b1", name: "Van Dijk", position_label: "CM" }],
      in: [{ player_id: "p6", name: "Tom Mulder", position_label: "CM" }],
    },
  ],
  playerMinutes: [
    { player_id: "p6", name: "Tom Mulder", totalMinutes: 60, percentage: 67, periods: [{ start: 0, end: 30 }, { start: 60, end: 90 }] },
    { player_id: "b1", name: "Van Dijk", totalMinutes: 30, percentage: 33, periods: [{ start: 30, end: 60 }] },
    { player_id: "p1", name: "Jan de Vries", totalMinutes: 90, percentage: 100, periods: [{ start: 0, end: 90 }] },
  ],
};

const meta: Meta<typeof LineupSheet> = {
  title: "Molecules/LineupSheet",
  component: LineupSheet,
  decorators: [
    (Story) => (
      <div className="overflow-auto bg-neutral-200 p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    teamName: "FC Testteam",
    opponent: "SC Heerenveen",
    matchDate: "2026-03-15T14:30:00",
    formation: "4-3-3",
    players,
    benchNames: ["Van Dijk", "De Jong", "Bergkamp"],
  },
};

export default meta;
type Story = StoryObj<typeof LineupSheet>;

export const Default: Story = {};

export const WithSubstitutionPlan: Story = {
  args: { plan },
};

/** Runs the real export pipeline (html2canvas → jsPDF) in the browser and checks that a PDF comes out. */
export const PdfPipeline: Story = {
  args: { plan },
  play: async ({ canvasElement }) => {
    const sheet = canvasElement.querySelector("div > div") as HTMLElement;
    const canvas = await html2canvas(sheet, { scale: 1, backgroundColor: "#ffffff" });
    const height = fittedHeightMm(canvas.width, canvas.height);
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    pageOffsets(height).forEach((offset, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, offset, A4_WIDTH_MM, height);
    });
    const blob = pdf.output("blob");
    const head = await blob.slice(0, 5).text();
    await expect(head).toBe("%PDF-");
    await expect(blob.size).toBeGreaterThan(10_000);
  },
};
