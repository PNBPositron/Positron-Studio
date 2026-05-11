import { useState } from "react";
import { useEditor, newImage } from "@/store/editor";
import { PanelHeader } from "./TextPanel";
import { Upload } from "lucide-react";

export function UploadsPanel() {
  const { add } = useEditor();
  const [uploads, setUploads] = useState<string[]>([]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        setUploads((u) => [src, ...u]);
      };
      reader.readAsDataURL(f);
    });
  };

  return (
    <div className="space-y-4">
      <PanelHeader title="Uploads" />
      <label className="brutal-border-2 brutal-press flex cursor-pointer flex-col items-center gap-2 bg-blue p-4 text-white">
        <Upload className="h-6 w-6" strokeWidth={3} />
        <span className="font-display text-xs uppercase tracking-wider">Upload image</span>
        <input type="file" accept="image/*" multiple onChange={onFile} className="hidden" />
      </label>
      {uploads.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {uploads.map((src, i) => (
            <button
              key={i}
              onClick={() => add(newImage(src))}
              className="brutal-border-2 brutal-press overflow-hidden bg-white"
            >
              <img src={src} alt="" className="h-24 w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
