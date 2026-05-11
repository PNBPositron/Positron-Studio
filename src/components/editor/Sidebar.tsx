import { useEditor } from "@/store/editor";
import { LayoutTemplate, Type, Shapes, Upload, Palette, Maximize2 } from "lucide-react";
import { TemplatesPanel } from "./panels/TemplatesPanel";
import { TextPanel } from "./panels/TextPanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { UploadsPanel } from "./panels/UploadsPanel";
import { ColorPanel } from "./panels/ColorPanel";
import { SizePanel } from "./panels/SizePanel";

const TOOLS = [
  { id: "templates", label: "Templates", icon: LayoutTemplate, bg: "bg-yellow" },
  { id: "text", label: "Text", icon: Type, bg: "bg-teal" },
  { id: "shapes", label: "Shapes", icon: Shapes, bg: "bg-blue" },
  { id: "uploads", label: "Uploads", icon: Upload, bg: "bg-teal" },
  { id: "color", label: "Color", icon: Palette, bg: "bg-blue" },
  { id: "size", label: "Size", icon: Maximize2, bg: "bg-yellow" },
] as const;

export function Sidebar() {
  const { tool, setTool } = useEditor();
  return (
    <aside className="flex h-full">
      <nav className="flex w-20 flex-col gap-2 border-r-[3px] border-ink bg-ink p-2">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`brutal-border-2 flex flex-col items-center gap-1 px-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-transform ${
                active
                  ? `${t.bg} text-ink translate-x-1`
                  : "bg-paper text-ink hover:translate-x-0.5"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} />
              {t.label}
            </button>
          );
        })}
      </nav>
      <div className="w-72 overflow-y-auto border-r-[3px] border-ink bg-paper p-4">
        {tool === "templates" && <TemplatesPanel />}
        {tool === "text" && <TextPanel />}
        {tool === "shapes" && <ShapesPanel />}
        {tool === "uploads" && <UploadsPanel />}
        {tool === "color" && <ColorPanel />}
        {tool === "size" && <SizePanel />}
      </div>
    </aside>
  );
}
