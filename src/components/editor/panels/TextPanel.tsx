import { useEditor, newText } from "@/store/editor";

const PRESETS = [
  { label: "Add a heading", fontSize: 120, fontWeight: 900, fontFamily: "Archivo Black", text: "HEADING" },
  { label: "Add a subheading", fontSize: 64, fontWeight: 700, fontFamily: "Inter", text: "Subheading" },
  { label: "Add body text", fontSize: 32, fontWeight: 500, fontFamily: "Inter", text: "Body text goes here" },
];

const QUICK = [
  { text: "BOLD\nMOVE", fontSize: 180, color: "#0a0f1f" },
  { text: "make it\nLOUD", fontSize: 140, color: "#1f3fb8" },
  { text: "NEW DROP", fontSize: 120, color: "#0a0f1f" },
  { text: "OFFLINE\nSALE", fontSize: 160, color: "#0a0f1f" },
];

export function TextPanel() {
  const { add } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Text" />
      <div className="space-y-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => add(newText({ text: p.text, fontSize: p.fontSize, fontWeight: p.fontWeight, fontFamily: p.fontFamily, height: p.fontSize * 1.4 }))}
            className="brutal-border-2 brutal-press w-full bg-white px-3 py-3 text-left"
          >
            <span style={{ fontFamily: p.fontFamily, fontWeight: p.fontWeight, fontSize: 18 }}>
              {p.label}
            </span>
          </button>
        ))}
      </div>
      <div>
        <div className="mb-2 font-display text-[10px] uppercase tracking-widest">Style packs</div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK.map((q, i) => (
            <button
              key={i}
              onClick={() => add(newText({ text: q.text, fontSize: 72, color: q.color, height: 200, width: 480 }))}
              className="brutal-border-2 brutal-press flex h-24 items-center justify-center bg-yellow p-2 text-center"
            >
              <span
                style={{
                  fontFamily: "Archivo Black",
                  fontSize: 14,
                  color: q.color,
                  whiteSpace: "pre-line",
                  lineHeight: 1,
                }}
              >
                {q.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PanelHeader({ title }: { title: string }) {
  return (
    <div className="brutal-border-2 bg-ink px-3 py-2 font-display text-sm uppercase tracking-wider text-yellow">
      {title}
    </div>
  );
}
