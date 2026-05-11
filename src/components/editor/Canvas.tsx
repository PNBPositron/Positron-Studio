import { useEffect, useRef, useState } from "react";
import { useEditor, CANVAS_W, CANVAS_H } from "@/store/editor";
import { CanvasElement } from "./CanvasElement";

export function Canvas() {
  const { elements, bgColor, select, selectedId, remove } = useEditor();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const fit = () => {
      const el = wrapRef.current;
      if (!el) return;
      const padding = 80;
      const sx = (el.clientWidth - padding) / CANVAS_W;
      const sy = (el.clientHeight - padding) / CANVAS_H;
      setScale(Math.min(sx, sy, 1));
    };
    fit();
    const obs = new ResizeObserver(fit);
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        remove(selectedId);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) useEditor.getState().redo();
        else useEditor.getState().undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, remove]);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) select(null);
      }}
    >
      <div
        className="brutal-shadow-lg relative"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) select(null);
        }}
      >
        <div
          id="canvas-export"
          className="absolute inset-0 overflow-hidden border-[3px] border-ink"
          style={{ backgroundColor: bgColor }}
        >
          {elements.map((el) => (
            <CanvasElement key={el.id} element={el} scale={scale} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 brutal-border-2 brutal-shadow-sm bg-paper px-3 py-1.5 font-mono text-xs font-bold">
        {Math.round(scale * 100)}% · {CANVAS_W}×{CANVAS_H}
      </div>
    </div>
  );
}
