import { useEditor, newModel3D, type Model3DKind } from "@/store/editor";
import { PanelHeader } from "./TextPanel";
import { Model3DRender } from "../Model3DRender";

const SHAPES: Array<{ kind: Model3DKind; label: string; color: string }> = [
  { kind: "cube", label: "Cube", color: "#4d7cff" },
  { kind: "pyramid", label: "Pyramid", color: "#7df9ff" },
  { kind: "sphere", label: "Sphere", color: "#ff0080" },
  { kind: "torus", label: "Torus", color: "#00ff88" },
];

export function ThreeDPanel() {
  const { add } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="3D Library" />
      <div className="grid grid-cols-2 gap-2">
        {SHAPES.map((s) => (
          <button
            key={s.kind}
            onClick={() => add(newModel3D(s.kind, { color: s.color }))}
            className="brutal-border-2 brutal-press group flex h-32 flex-col items-center justify-center gap-2 bg-surface p-2 text-teal hover:border-teal hover:bg-surface-2"
          >
            <div className="h-16 w-16">
              <Model3DRender
                element={{
                  id: `prev-${s.kind}`,
                  type: "model3d",
                  x: 0,
                  y: 0,
                  width: 64,
                  height: 64,
                  rotation: 0,
                  shape: s.kind,
                  color: s.color,
                  spinSpeed: 6,
                  tiltX: -20,
                  tiltY: 25,
                }}
              />
            </div>
            <span className="font-display text-[10px] uppercase tracking-[0.2em]">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="font-mono text-[10px] text-teal/50">
        &gt; CSS-rendered 3D primitives. tweak spin & tilt in the right panel.
      </div>
    </div>
  );
}
