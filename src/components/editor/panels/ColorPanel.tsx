import { useEditor } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const BG_COLORS = [
  "#0a0f1f", "#101a2e", "#1a2742", "#0f3460",
  "#7df9ff", "#00d9ff", "#0ea5e9", "#4d7cff",
  "#1f3fb8", "#000000", "#ffffff", "#ff0080",
];

export function ColorPanel() {
  const { bgColor, setBg } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Background" />
      <div className="grid grid-cols-4 gap-2">
        {BG_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setBg(c)}
            className={`brutal-border-2 h-14 transition-all ${
              bgColor === c ? "border-teal scale-105 glow-teal" : "hover:border-teal"
            }`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div>
        <label className="mb-1.5 block font-display text-[10px] uppercase tracking-[0.2em] text-teal/80">
          ▸ Custom
        </label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBg(e.target.value)}
          className="brutal-border-2 h-12 w-full bg-surface"
        />
      </div>
    </div>
  );
}
