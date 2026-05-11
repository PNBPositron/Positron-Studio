import { useEditor } from "@/store/editor";
import { toPng } from "html-to-image";
import { Undo2, Redo2, Trash2, Download, Play, Zap } from "lucide-react";

export function Toolbar() {
  const { undo, redo, clear, setPresenting } = useEditor();

  const handleExport = async () => {
    const node = document.getElementById("canvas-export");
    if (!node) return;
    const { canvasW, canvasH } = useEditor.getState();
    useEditor.getState().select(null);
    await new Promise((r) => setTimeout(r, 50));
    const dataUrl = await toPng(node, {
      width: canvasW,
      height: canvasH,
      pixelRatio: 2,
      style: { transform: "none", left: "0", top: "0", margin: "0" },
    });
    const link = document.createElement("a");
    link.download = `bruto-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <header className="relative flex items-center justify-between gap-4 border-b border-teal/40 bg-ink px-5 py-3">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal to-transparent opacity-80" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center bg-blue-deep brutal-border glow-blue">
            <Zap className="h-5 w-5 text-teal" strokeWidth={2.5} fill="currentColor" />
          </div>
          <div className="font-display text-xl tracking-[0.18em] text-teal text-glow">
            BRUTO<span className="text-blue text-glow-blue">//</span>STUDIO
          </div>
          <span className="hidden md:inline-block bg-teal/15 px-2 py-0.5 font-mono text-[10px] tracking-widest text-teal border border-teal/40">
            v2.0_NEO
          </span>
        </div>
        <div className="ml-4 hidden items-center gap-2 md:flex">
          <input
            defaultValue="untitled.design"
            className="brutal-border-2 bg-surface px-3 py-1.5 font-mono text-xs text-teal focus:outline-none focus:border-teal focus:bg-surface-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconBtn onClick={undo} title="Undo">
          <Undo2 className="h-4 w-4" strokeWidth={2.5} />
        </IconBtn>
        <IconBtn onClick={redo} title="Redo">
          <Redo2 className="h-4 w-4" strokeWidth={2.5} />
        </IconBtn>
        <IconBtn onClick={clear} title="Clear">
          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
        </IconBtn>
        <button
          onClick={() => setPresenting(true)}
          className="brutal-border brutal-press flex items-center gap-2 bg-surface px-4 py-2 font-display text-xs tracking-[0.2em] text-teal hover:bg-teal/10"
        >
          <Play className="h-3.5 w-3.5 fill-teal" strokeWidth={3} />
          PRESENT
        </button>
        <button
          onClick={handleExport}
          className="brutal-border brutal-shadow-sm brutal-press flex items-center gap-2 bg-blue px-4 py-2 font-display text-xs tracking-[0.2em] text-ink"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={3} />
          EXPORT
        </button>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="brutal-border-2 brutal-press grid h-10 w-10 place-items-center bg-surface text-teal hover:bg-surface-2 hover:text-teal hover:border-teal"
    >
      {children}
    </button>
  );
}
