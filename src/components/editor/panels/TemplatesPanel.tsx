import { useEditor, newText, newShape, type AnyElement } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const TEMPLATES: { name: string; bg: string; preview: React.ReactNode; build: () => AnyElement[] }[] = [
  {
    name: "Neural Drop",
    bg: "#0a0f1f",
    preview: (
      <div className="flex h-full w-full flex-col justify-between bg-[#0a0f1f] p-2 text-[8px]">
        <span className="font-display text-[#7df9ff]">NEW</span>
        <span className="font-display text-2xl leading-none text-[#7df9ff]">DROP</span>
        <span className="text-[7px] text-[#4d7cff]">05/26</span>
      </div>
    ),
    build: () => [
      newText({ text: "// NEW", fontSize: 96, x: 80, y: 80, width: 500, height: 110, color: "#4d7cff", fontFamily: "JetBrains Mono", fontWeight: 700 }),
      newText({ text: "DROP", fontSize: 360, x: 60, y: 360, width: 980, height: 380, color: "#7df9ff", fontFamily: "Orbitron" }),
      newShape("rect", { x: 80, y: 880, width: 240, height: 80, fill: "#4d7cff", stroke: "#7df9ff", strokeWidth: 4 }),
      newText({ text: "05/26", fontSize: 48, x: 110, y: 900, width: 200, height: 50, color: "#0a0f1f", fontFamily: "JetBrains Mono", fontWeight: 700 }),
    ],
  },
  {
    name: "System OK",
    bg: "#101a2e",
    preview: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#101a2e] p-2">
        <span className="font-display text-2xl text-[#7df9ff]">OK</span>
        <span className="text-[8px] text-[#4d7cff]">200</span>
      </div>
    ),
    build: () => [
      newShape("circle", { x: 240, y: 240, width: 600, height: 600, fill: "#0a0f1f", stroke: "#7df9ff", strokeWidth: 8 }),
      newText({ text: "OK", fontSize: 320, x: 90, y: 360, width: 900, height: 320, color: "#7df9ff", align: "center", fontFamily: "Orbitron" }),
      newText({ text: "STATUS_200", fontSize: 80, x: 90, y: 700, width: 900, height: 100, color: "#4d7cff", align: "center", fontFamily: "JetBrains Mono", fontWeight: 700 }),
    ],
  },
  {
    name: "Manifesto",
    bg: "#0a0f1f",
    preview: (
      <div className="flex h-full w-full flex-col justify-center bg-[#0a0f1f] p-2">
        <span className="font-display text-[10px] leading-tight text-[#7df9ff]">JACK<br/>IN_</span>
      </div>
    ),
    build: () => [
      newShape("rect", { x: 0, y: 0, width: 1080, height: 200, fill: "#4d7cff", stroke: "#4d7cff", strokeWidth: 0 }),
      newText({ text: "MANIFESTO_01", fontSize: 60, x: 60, y: 70, width: 900, height: 80, color: "#0a0f1f", fontFamily: "JetBrains Mono", fontWeight: 700 }),
      newText({ text: "JACK\nIN_", fontSize: 320, x: 60, y: 320, width: 1000, height: 720, color: "#7df9ff", fontFamily: "Orbitron" }),
    ],
  },
  {
    name: "After Hours",
    bg: "#101a2e",
    preview: (
      <div className="flex h-full w-full flex-col justify-end bg-[#101a2e] p-2">
        <span className="font-display text-[10px] text-[#4d7cff]">FRI</span>
        <span className="font-display text-lg leading-none text-[#7df9ff]">RAVE</span>
      </div>
    ),
    build: () => [
      newText({ text: "FRI 26.05", fontSize: 70, x: 80, y: 100, width: 800, height: 90, color: "#4d7cff", fontFamily: "JetBrains Mono", fontWeight: 700 }),
      newText({ text: "AFTER\nHOURS", fontSize: 280, x: 60, y: 280, width: 1000, height: 600, color: "#7df9ff", fontFamily: "Orbitron" }),
      newShape("triangle", { x: 700, y: 800, width: 280, height: 220, fill: "#4d7cff", stroke: "#4d7cff", strokeWidth: 0 }),
    ],
  },
];

export function TemplatesPanel() {
  const { loadTemplate } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Templates" />
      <p className="font-mono text-[10px] text-teal/60">&gt; tap to load · replaces canvas</p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.name}
            onClick={() => loadTemplate(t.build(), t.bg)}
            className="brutal-border-2 brutal-press overflow-hidden bg-surface text-left hover:border-teal"
          >
            <div className="aspect-square w-full overflow-hidden border-b border-teal/30">
              {t.preview}
            </div>
            <div className="bg-ink px-2 py-1 font-display text-[10px] uppercase tracking-[0.15em] text-teal">
              {t.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
