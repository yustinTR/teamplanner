"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas-pro";
import { trackEvent } from "@/lib/gtm";
import { A4_HEIGHT_MM, A4_WIDTH_MM, fittedHeightMm, pageOffsets } from "@/lib/pdf";

interface UseExportPdfReturn {
  /** Renders `element` to an A4 PDF, then shares it or downloads it. */
  exportPdf: (element: HTMLElement, filename: string, type: string) => Promise<void>;
  isExporting: boolean;
}

export function useExportPdf(): UseExportPdfReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(async (element: HTMLElement, filename: string, type: string) => {
    setIsExporting(true);
    try {
      const [{ jsPDF }, canvas] = await Promise.all([
        import("jspdf"),
        html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" }),
      ]);
      const image = canvas.toDataURL("image/png");
      const imageHeight = fittedHeightMm(canvas.width, canvas.height);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      pageOffsets(imageHeight, A4_HEIGHT_MM).forEach((offset, index) => {
        if (index > 0) pdf.addPage();
        pdf.addImage(image, "PNG", 0, offset, A4_WIDTH_MM, imageHeight);
      });

      const blob = pdf.output("blob");
      const file = new File([blob], `${filename}.pdf`, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        trackEvent("export_pdf", { type, method: "native" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        trackEvent("export_pdf", { type, method: "download" });
      }
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportPdf, isExporting };
}
