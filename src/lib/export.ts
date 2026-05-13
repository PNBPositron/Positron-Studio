import { toPng } from "html-to-image";
import { useEditor } from "@/store/editor";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function captureAllPages(): Promise<string[]> {
  const { pages, currentIndex, setCurrentPage, canvasW, canvasH, select } = useEditor.getState();
  select(null);
  const original = currentIndex;
  const shots: string[] = [];
  for (let i = 0; i < pages.length; i++) {
    setCurrentPage(i);
    // wait for React paint + scale fit
    await wait(120);
    const node = document.getElementById("canvas-export");
    if (!node) continue;
    const dataUrl = await toPng(node, {
      width: canvasW,
      height: canvasH,
      pixelRatio: 2,
      style: { transform: "none", left: "0", top: "0", margin: "0" },
    });
    shots.push(dataUrl);
  }
  setCurrentPage(original);
  return shots;
}

export async function exportPNG(name: string) {
  const { canvasW, canvasH } = useEditor.getState();
  useEditor.getState().select(null);
  await wait(50);
  const node = document.getElementById("canvas-export");
  if (!node) return;
  const dataUrl = await toPng(node, {
    width: canvasW,
    height: canvasH,
    pixelRatio: 2,
    style: { transform: "none", left: "0", top: "0", margin: "0" },
  });
  const link = document.createElement("a");
  link.download = `${name || "positron"}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportPDF(name: string) {
  const { canvasW, canvasH } = useEditor.getState();
  const shots = await captureAllPages();
  if (shots.length === 0) return;
  const { jsPDF } = await import("jspdf");
  const orientation = canvasW >= canvasH ? "landscape" : "portrait";
  const pdf = new jsPDF({ orientation, unit: "px", format: [canvasW, canvasH] });
  shots.forEach((src, i) => {
    if (i > 0) pdf.addPage([canvasW, canvasH], orientation);
    pdf.addImage(src, "PNG", 0, 0, canvasW, canvasH);
  });
  pdf.save(`${name || "positron"}-${Date.now()}.pdf`);
}

export async function exportPPTX(name: string) {
  const { canvasW, canvasH } = useEditor.getState();
  const shots = await captureAllPages();
  if (shots.length === 0) return;
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  // Slide size in inches at 96dpi
  const wIn = canvasW / 96;
  const hIn = canvasH / 96;
  pptx.defineLayout({ name: "POS", width: wIn, height: hIn });
  pptx.layout = "POS";
  shots.forEach((src) => {
    const slide = pptx.addSlide();
    slide.addImage({ data: src, x: 0, y: 0, w: wIn, h: hIn });
  });
  await pptx.writeFile({ fileName: `${name || "positron"}-${Date.now()}.pptx` });
}
