const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** Vertical offsets (mm) at which an image of `imageHeightMm` is drawn per A4 page. */
export function pageOffsets(imageHeightMm: number, pageHeightMm = A4_HEIGHT_MM): number[] {
  const pages = Math.max(1, Math.ceil(imageHeightMm / pageHeightMm - 0.01));
  return Array.from({ length: pages }, (_, i) => (i === 0 ? 0 : -i * pageHeightMm));
}

/** Image height in mm when the image is scaled to the A4 width. */
export function fittedHeightMm(widthPx: number, heightPx: number): number {
  return (heightPx / widthPx) * A4_WIDTH_MM;
}

export { A4_WIDTH_MM, A4_HEIGHT_MM };
