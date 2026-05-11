import { createFileRoute } from "@tanstack/react-router";
import { Toolbar } from "@/components/editor/Toolbar";
import { Sidebar } from "@/components/editor/Sidebar";
import { Canvas } from "@/components/editor/Canvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { PresentationMode } from "@/components/editor/PresentationMode";

export const Route = createFileRoute("/")({
  component: Editor,
  head: () => ({
    meta: [
      { title: "Bruto Studio — Neobrutalist Design Editor" },
      {
        name: "description",
        content:
          "A loud, neobrutalist design editor for posters, social posts and graphics. Drag, drop, type, ship.",
      },
    ],
  }),
});

function Editor() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative flex-1 overflow-hidden bg-[repeating-linear-gradient(45deg,_transparent_0_18px,_rgba(10,15,31,0.04)_18px_19px)]">
          <Canvas />
        </main>
        <PropertiesPanel />
      </div>
      <PresentationMode />
    </div>
  );
}
