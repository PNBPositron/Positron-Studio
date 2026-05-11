import { useEditor, newImage } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const PHOTOS = [
  "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=600",
  "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=600",
  "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600",
  "https://images.unsplash.com/photo-1620207418302-439b387441b0?w=600",
  "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600",
];

export function PhotosPanel() {
  const { add } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Photos" />
      <div className="grid grid-cols-2 gap-2">
        {PHOTOS.map((src) => (
          <button
            key={src}
            onClick={() => add(newImage(src))}
            className="brutal-border-2 brutal-press overflow-hidden bg-white"
          >
            <img src={src} alt="" className="h-24 w-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
