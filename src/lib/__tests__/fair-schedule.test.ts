import { describe, expect, it } from "vitest";
import { buildFairSchedule, MATCH_FORMATS } from "@/lib/fair-schedule";

const format = (key: string) => MATCH_FORMATS.find((f) => f.key === key)!;
const names = (n: number) => Array.from({ length: n }, (_, i) => `Speler ${i + 1}`);

describe("buildFairSchedule", () => {
  it("fills every position for the whole match", () => {
    for (const f of MATCH_FORMATS) {
      for (let extra = 0; extra <= 5; extra++) {
        const { plan } = buildFairSchedule({ players: names(f.onPitch + extra), format: f });
        const total = plan.playerMinutes.reduce((sum, p) => sum + p.totalMinutes, 0);
        expect(total, `${f.key} +${extra}`).toBe(f.onPitch * f.totalMinutes);
      }
    }
  });

  it("keeps the keeper on for the whole match", () => {
    const { plan } = buildFairSchedule({ players: names(10), format: format("jo12_jo11") });
    expect(plan.playerMinutes[0].totalMinutes).toBe(60);
  });

  it("gives everyone equal minutes when the bench turns divide evenly", () => {
    // 7 v 7 with 9 players: 8 outfield, 6 slots, 2 on the bench, so 4 periods give
    // everyone one bench turn. Periods of 12.5 minutes round to 13/12, hence one minute.
    const { spread, plan } = buildFairSchedule({ players: names(9), format: format("7x7") });
    expect(spread).toBeLessThanOrEqual(1);
    expect(plan.substitutionMoments).toHaveLength(3);
  });

  it("keeps the spread to one period at most", () => {
    const { spread, plan } = buildFairSchedule({ players: names(10), format: format("jo12_jo11") });
    const periodLength = 60 / (plan.substitutionMoments.length + 1);
    expect(spread).toBeLessThanOrEqual(periodLength);
  });

  it("swaps as many players on as off, each into the vacated position", () => {
    const { plan } = buildFairSchedule({ players: names(14), format: format("senioren") });
    for (const moment of plan.substitutionMoments) {
      expect(moment.in).toHaveLength(moment.out.length);
      moment.in.forEach((p, i) => expect(p.position_label).toBe(moment.out[i].position_label));
    }
  });

  it("needs no substitutions without a bench", () => {
    const { plan, bench } = buildFairSchedule({ players: names(6), format: format("jo10") });
    expect(plan.substitutionMoments).toHaveLength(0);
    expect(bench).toHaveLength(0);
  });

  it("starts with one player per position", () => {
    const { starters } = buildFairSchedule({ players: names(12), format: format("jo13") });
    expect(starters).toHaveLength(11);
    expect(starters[0].positionLabel).toBe("K");
  });
});

describe("period choice", () => {
  it("uses four moments for a JO11 team of ten, as in the blog example", () => {
    const { plan, spread } = buildFairSchedule({ players: names(10), format: format("jo12_jo11") });
    expect(plan.substitutionMoments.map((m) => m.minute)).toEqual([12, 24, 36, 48]);
    expect(spread).toBe(12);
  });
});
