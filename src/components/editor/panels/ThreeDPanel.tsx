import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { useEditor, newModel3D, type Model3DKind, type AnyElement } from "@/store/editor";
import { PanelHeader } from "./TextPanel";
import { Model3DRender } from "../Model3DRender";
import { generate3DScene } from "@/lib/ai-templates.functions";

const SHAPES: Array<{ kind: Model3DKind; label: string; color: string }> = [
  { kind: "cube", label: "Cube", color: "#4d7cff" },
  { kind: "pyramid", label: "Pyramid", color: "#7df9ff" },
  { kind: "sphere", label: "Sphere", color: "#ff0080" },
  { kind: "torus", label: "Torus", color: "#00ff88" },
];

export function ThreeDPanel() {
  const { add, loadTemplate, canvasW, canvasH } = useEditor();
  const generate = useServerFn(generate3DScene);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generate({ data: { prompt, width: canvasW, height: canvasH } });
      const els: AnyElement[] = res.models.map((m) =>
        newModel3D(m.shape, {
          x: m.x, y: m.y, width: m.width, height: m.height,
          color: m.color,
          spinSpeed: m.spinSpeed ?? 8,
          tiltX: m.tiltX ?? -20,
          tiltY: m.tiltY ?? 25,
        }),
      );
      loadTemplate(els, res.bg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PanelHeader title="3D Library" />

      <div className="brutal-border-2 space-y-2 bg-surface p-3">
        <div className="flex items-center gap-2 font-display text-[11px] tracking-[0.2em] text-teal">
          <Sparkles className="h-3.5 w-3.5" /> AI_3D_SCENE
        </div>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="theme · e.g. floating crystals at sunset"
          className="w-full border border-teal/40 bg-ink px-2 py-1.5 font-mono text-[11px] text-teal placeholder:text-teal/30 focus:border-teal focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="brutal-border brutal-press flex w-full items-center justify-center gap-2 bg-blue px-3 py-1.5 font-display text-[11px] tracking-[0.2em] text-ink disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "GENERATING..." : "GENERATE SCENE"}
        </button>
        {error && <p className="font-mono text-[10px] text-[#ff0080]">! {error}</p>}
        <p className="font-mono text-[10px] text-teal/50">&gt; replaces canvas with a 3D composition</p>
      </div>

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
