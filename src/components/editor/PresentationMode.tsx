import { useEffect, useRef, useState } from "react";
import { useEditor } from "@/store/editor";
import { CanvasElement } from "./CanvasElement";
import { X } from "lucide-react";

export function PresentationMode() {
  const { presenting, setPresenting, elements, bgColor, canvasW, canvasH } = useEditor();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!presenting) return;
    const fit = () => {
      const el = wrapRef.current;
      if (!el) return;
      const sx = el.clientWidth / canvasW;
      const sy = el.clientHeight / canvasH;
      setScale(Math.min(sx, sy));
    };
    fit();
    const obs = new ResizeObserver(fit);
    if (wrapRef.current) obs.observe(wrapRef.current);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresenting(false);
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      obs.disconnect();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [presenting, canvasW, canvasH, setPresenting]);

  if (!presenting) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink">
      <div className="flex items-center justify-between border-b-[3px] border-yellow bg-ink px-5 py-3">
        <div className="font-display text-sm uppercase tracking-widest text-yellow">
          ▶ Presenting · {canvasW}×{canvasH}
        </div>
        <button
          onClick={() => setPresenting(false)}
          className="brutal-border-2 brutal-press flex items-center gap-2 bg-yellow px-3 py-1.5 font-display text-xs uppercase tracking-wider text-ink"
        >
          <X className="h-4 w-4" strokeWidth={3} />
          Exit · Esc
        </button>
      </div>
      <div ref={wrapRef} className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
        <div
          style={{ width: canvasW * scale, height: canvasH * scale }}
          className="brutal-shadow-lg relative shrink-0"
        >
          <div
            className="absolute left-0 top-0 overflow-hidden border-[3px] border-ink pointer-events-none"
            style={{
              width: canvasW,
              height: canvasH,
              backgroundColor: bgColor,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {elements.map((el) => (
              <CanvasElement key={el.id} element={el} scale={scale} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
