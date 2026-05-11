import { useEditor, newText, newShape, type AnyElement } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const TEMPLATES: { name: string; bg: string; preview: React.ReactNode; build: () => AnyElement[] }[] = [
  {
    name: "Big Drop",
    bg: "#ffd84a",
    preview: (
      <div className="flex h-full w-full flex-col justify-between bg-yellow p-2 text-[8px]">
        <span className="font-display text-ink">NEW</span>
        <span className="font-display text-2xl leading-none text-ink">DROP</span>
        <span className="text-[7px] text-ink">05/26</span>
      </div>
    ),
    build: () => [
      newText({ text: "NEW", fontSize: 96, x: 80, y: 80, width: 400, height: 110, color: "#0a0f1f" }),
      newText({ text: "DROP", fontSize: 360, x: 60, y: 360, width: 980, height: 380, color: "#0a0f1f" }),
      newShape("rect", { x: 80, y: 880, width: 200, height: 80, fill: "#1f3fb8", stroke: "#0a0f1f", strokeWidth: 6 }),
      newText({ text: "05/26", fontSize: 48, x: 110, y: 900, width: 200, height: 50, color: "#ffffff", fontFamily: "Inter", fontWeight: 800 }),
    ],
  },
  {
    name: "Sale",
    bg: "#5fd4d6",
    preview: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-teal p-2">
        <span className="font-display text-2xl text-ink">SALE</span>
        <span className="text-[8px] text-ink">-50%</span>
      </div>
    ),
    build: () => [
      newShape("circle", { x: 240, y: 240, width: 600, height: 600, fill: "#ffd84a", stroke: "#0a0f1f", strokeWidth: 10 }),
      newText({ text: "SALE", fontSize: 220, x: 90, y: 380, width: 900, height: 240, color: "#0a0f1f", align: "center" }),
      newText({ text: "-50%", fontSize: 100, x: 90, y: 620, width: 900, height: 120, color: "#1f3fb8", align: "center" }),
    ],
  },
  {
    name: "Quote",
    bg: "#fafaf2",
    preview: (
      <div className="flex h-full w-full flex-col justify-center bg-paper p-2">
        <span className="font-display text-[10px] leading-tight text-ink">"BUILD<br/>LOUD"</span>
      </div>
    ),
    build: () => [
      newShape("rect", { x: 0, y: 0, width: 1080, height: 200, fill: "#1f3fb8", stroke: "#1f3fb8", strokeWidth: 0 }),
      newText({ text: "MANIFESTO Nº 01", fontSize: 60, x: 60, y: 70, width: 900, height: 80, color: "#ffd84a", fontFamily: "Inter", fontWeight: 900 }),
      newText({ text: '"BUILD\nLOUD"', fontSize: 320, x: 60, y: 320, width: 1000, height: 720, color: "#0a0f1f" }),
    ],
  },
  {
    name: "Event",
    bg: "#1f3fb8",
    preview: (
      <div className="flex h-full w-full flex-col justify-end bg-blue-deep p-2">
        <span className="font-display text-[10px] text-yellow">FRI</span>
        <span className="font-display text-lg leading-none text-yellow">PARTY</span>
      </div>
    ),
    build: () => [
      newText({ text: "FRI 26.05", fontSize: 70, x: 80, y: 100, width: 800, height: 90, color: "#ffd84a", fontFamily: "Inter", fontWeight: 900 }),
      newText({ text: "AFTER\nHOURS", fontSize: 280, x: 60, y: 280, width: 1000, height: 600, color: "#5fd4d6" }),
      newShape("triangle", { x: 700, y: 800, width: 280, height: 220, fill: "#ffd84a", stroke: "#ffd84a", strokeWidth: 0 }),
    ],
  },
];

export function TemplatesPanel() {
  const { loadTemplate } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Templates" />
      <p className="text-xs text-muted-foreground">Tap to load. Replaces your canvas.</p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.name}
            onClick={() => loadTemplate(t.build(), t.bg)}
            className="brutal-border-2 brutal-press overflow-hidden bg-white text-left"
          >
            <div className="aspect-square w-full overflow-hidden border-b-[2px] border-ink">
              {t.preview}
            </div>
            <div className="bg-ink px-2 py-1 font-display text-[10px] uppercase tracking-wider text-yellow">
              {t.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
