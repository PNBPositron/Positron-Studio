import { useEditor, CANVAS_W, CANVAS_H } from "@/store/editor";
import { toPng } from "html-to-image";
import { Undo2, Redo2, Trash2, Download, Square } from "lucide-react";

export function Toolbar() {
  const { undo, redo, clear } = useEditor();

  const handleExport = async () => {
    const node = document.getElementById("canvas-export");
    if (!node) return;
    useEditor.getState().select(null);
    await new Promise((r) => setTimeout(r, 50));
    const dataUrl = await toPng(node, {
      width: CANVAS_W,
      height: CANVAS_H,
      pixelRatio: 2,
      style: { transform: "none", left: "0", top: "0", margin: "0" },
    });
    const link = document.createElement("a");
    link.download = `brutal-design-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b-[3px] border-ink bg-yellow px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center bg-ink brutal-border-2">
            <Square className="h-5 w-5 fill-yellow text-yellow" strokeWidth={3} />
          </div>
          <div className="font-display text-2xl tracking-tighter text-ink">
            BRUTO<span className="text-blue-deep">/</span>STUDIO
          </div>
        </div>
        <div className="ml-4 hidden items-center gap-2 md:flex">
          <input
            defaultValue="Untitled design"
            className="brutal-border-2 bg-paper px-3 py-1.5 text-sm font-semibold focus:outline-none focus:bg-teal"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <IconBtn onClick={undo} title="Undo">
          <Undo2 className="h-4 w-4" strokeWidth={3} />
        </IconBtn>
        <IconBtn onClick={redo} title="Redo">
          <Redo2 className="h-4 w-4" strokeWidth={3} />
        </IconBtn>
        <IconBtn onClick={clear} title="Clear">
          <Trash2 className="h-4 w-4" strokeWidth={3} />
        </IconBtn>
        <button
          onClick={handleExport}
          className="brutal-border brutal-shadow-sm brutal-press flex items-center gap-2 bg-blue px-4 py-2 font-display text-sm tracking-wide text-white"
        >
          <Download className="h-4 w-4" strokeWidth={3} />
          EXPORT PNG
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
      className="brutal-border-2 brutal-press grid h-10 w-10 place-items-center bg-paper"
    >
      {children}
    </button>
  );
}
