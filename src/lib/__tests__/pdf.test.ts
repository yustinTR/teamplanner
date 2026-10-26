import { describe, it, expect } from "vitest";
import { fittedHeightMm, pageOffsets } from "../pdf";

describe("fittedHeightMm", () => {
  it("scales height with the A4 width", () => {
    expect(fittedHeightMm(794, 794)).toBeCloseTo(210);
    expect(fittedHeightMm(794, 1123)).toBeCloseTo(297, 0);
  });
});

describe("pageOffsets", () => {
  it("is one page for content that fits", () => {
    expect(pageOffsets(200)).toEqual([0]);
    expect(pageOffsets(297)).toEqual([0]);
  });

  it("adds a page per 297 mm and offsets the image upwards", () => {
    expect(pageOffsets(300)).toEqual([0, -297]);
    expect(pageOffsets(700)).toEqual([0, -297, -594]);
  });
});
