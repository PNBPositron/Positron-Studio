import { useEditor } from "@/store/editor";
import { Copy, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const SWATCHES = ["#0a0f1f", "#ffffff", "#ffd84a", "#f5b800", "#5fd4d6", "#1aa3a6", "#4d7cff", "#1f3fb8", "#ff5252"];

export function PropertiesPanel() {
  const { elements, selectedId, update, remove, duplicate, bringForward, sendBackward } = useEditor();
  const el = elements.find((e) => e.id === selectedId);
  if (!el) {
    return (
      <div className="border-l-[3px] border-ink bg-paper p-4 w-72 hidden lg:block">
        <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
          Select an element
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Click anything on the canvas to edit its properties.
        </p>
      </div>
    );
  }
  return (
    <div className="border-l-[3px] border-ink bg-paper w-72 overflow-y-auto">
      <div className="border-b-[3px] border-ink bg-yellow px-4 py-3">
        <div className="font-display text-xs uppercase tracking-widest">
          {el.type} layer
        </div>
      </div>

      <div className="space-y-4 p-4">
        {el.type === "text" && (
          <>
            <Field label="Text">
              <textarea
                value={el.text}
                onChange={(e) => update(el.id, { text: e.target.value })}
                rows={3}
                className="brutal-border-2 w-full bg-white p-2 text-sm focus:outline-none focus:bg-teal/30"
              />
            </Field>
            <Field label="Font size">
              <input
                type="range"
                min={12}
                max={240}
                value={el.fontSize}
                onChange={(e) => update(el.id, { fontSize: +e.target.value })}
                className="w-full accent-blue-deep"
              />
              <div className="font-mono text-xs">{el.fontSize}px</div>
            </Field>
            <Field label="Font family">
              <select
                value={el.fontFamily}
                onChange={(e) => update(el.id, { fontFamily: e.target.value })}
                className="brutal-border-2 w-full bg-white px-2 py-1.5 text-sm font-bold"
              >
                {["Archivo Black", "Inter", "Space Grotesk", "JetBrains Mono", "Georgia"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
            <Field label="Color">
              <ColorRow value={el.color} onChange={(c) => update(el.id, { color: c })} />
            </Field>
            <Field label="Align">
              <div className="flex gap-1">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => update(el.id, { align: a })}
                    className={`brutal-border-2 flex-1 py-1.5 text-xs font-bold uppercase ${
                      el.align === a ? "bg-blue text-white" : "bg-white"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {el.type === "shape" && (
          <>
            <Field label="Fill">
              <ColorRow value={el.fill} onChange={(c) => update(el.id, { fill: c })} />
            </Field>
            <Field label="Stroke">
              <ColorRow value={el.stroke} onChange={(c) => update(el.id, { stroke: c })} />
            </Field>
            <Field label="Stroke width">
              <input
                type="range"
                min={0}
                max={32}
                value={el.strokeWidth}
                onChange={(e) => update(el.id, { strokeWidth: +e.target.value })}
                className="w-full accent-blue-deep"
              />
              <div className="font-mono text-xs">{el.strokeWidth}px</div>
            </Field>
          </>
        )}

        <Field label="Rotation">
          <input
            type="range"
            min={-180}
            max={180}
            value={el.rotation}
            onChange={(e) => update(el.id, { rotation: +e.target.value })}
            className="w-full accent-blue-deep"
          />
          <div className="font-mono text-xs">{el.rotation}°</div>
        </Field>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <ActionBtn onClick={() => bringForward(el.id)} icon={<ArrowUp className="h-3 w-3" strokeWidth={3} />}>
            Forward
          </ActionBtn>
          <ActionBtn onClick={() => sendBackward(el.id)} icon={<ArrowDown className="h-3 w-3" strokeWidth={3} />}>
            Backward
          </ActionBtn>
          <ActionBtn onClick={() => duplicate(el.id)} icon={<Copy className="h-3 w-3" strokeWidth={3} />}>
            Duplicate
          </ActionBtn>
          <ActionBtn
            onClick={() => remove(el.id)}
            icon={<Trash2 className="h-3 w-3" strokeWidth={3} />}
            danger
          >
            Delete
          </ActionBtn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-display text-[10px] uppercase tracking-widest text-ink">
        {label}
      </label>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ColorRow({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        {SWATCHES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`brutal-border-2 h-7 w-7 ${value === s ? "ring-2 ring-blue ring-offset-2" : ""}`}
            style={{ background: s }}
          />
        ))}
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="brutal-border-2 h-9 w-full bg-white"
      />
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  icon,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`brutal-border-2 brutal-press flex items-center justify-center gap-1 py-2 text-[10px] font-bold uppercase tracking-wider ${
        danger ? "bg-destructive text-white" : "bg-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
