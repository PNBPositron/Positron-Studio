import { useState } from "react";
import { useEditor, CANVAS_PRESETS } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

export function SizePanel() {
  const { canvasW, canvasH, setCanvasSize } = useEditor();
  const [w, setW] = useState(canvasW);
  const [h, setH] = useState(canvasH);

  const apply = () => {
    const cw = Math.max(100, Math.min(8000, Math.round(w)));
    const ch = Math.max(100, Math.min(8000, Math.round(h)));
    setCanvasSize(cw, ch);
  };

  return (
    <div className="space-y-4">
      <PanelHeader title="Canvas Size" />

      <div>
        <div className="mb-2 font-display text-[10px] uppercase tracking-widest">Presets</div>
        <div className="grid grid-cols-2 gap-2">
          {CANVAS_PRESETS.map((p) => {
            const active = canvasW === p.w && canvasH === p.h;
            const max = 44;
            const ratio = p.w / p.h;
            const tw = ratio >= 1 ? max : max * ratio;
            const th = ratio >= 1 ? max / ratio : max;
            return (
              <button
                key={p.name}
                onClick={() => {
                  setCanvasSize(p.w, p.h);
                  setW(p.w);
                  setH(p.h);
                }}
                className={`brutal-border-2 brutal-press flex flex-col items-center gap-1 p-2 ${
                  active ? "bg-blue text-white" : "bg-white"
                }`}
              >
                <div className="grid h-12 w-full place-items-center">
                  <div
                    className="border-2 border-current"
                    style={{ width: tw, height: th }}
                  />
                </div>
                <span className="font-display text-[10px] uppercase">{p.name}</span>
                <span className="font-mono text-[9px] opacity-70">
                  {p.w}×{p.h}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-display text-[10px] uppercase tracking-widest">Custom</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase">Width</span>
            <input
              type="number"
              value={w}
              onChange={(e) => setW(+e.target.value)}
              className="brutal-border-2 w-full bg-white px-2 py-1.5 font-mono text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase">Height</span>
            <input
              type="number"
              value={h}
              onChange={(e) => setH(+e.target.value)}
              className="brutal-border-2 w-full bg-white px-2 py-1.5 font-mono text-sm"
            />
          </label>
        </div>
        <button
          onClick={apply}
          className="brutal-border-2 brutal-press w-full bg-yellow py-2 font-display text-xs uppercase tracking-wider"
        >
          Apply size
        </button>
      </div>
    </div>
  );
}
