import { useEditor } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const BG_COLORS = [
  "#fafaf2", "#ffffff", "#0a0f1f", "#ffd84a", "#f5b800",
  "#5fd4d6", "#1aa3a6", "#4d7cff", "#1f3fb8", "#ffe9a8",
  "#c9efef", "#dde6ff",
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
            className={`brutal-border-2 h-14 ${bgColor === c ? "ring-2 ring-blue ring-offset-2" : ""}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div>
        <label className="mb-1.5 block font-display text-[10px] uppercase tracking-widest">
          Custom
        </label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBg(e.target.value)}
          className="brutal-border-2 h-12 w-full bg-white"
        />
      </div>
    </div>
  );
}
