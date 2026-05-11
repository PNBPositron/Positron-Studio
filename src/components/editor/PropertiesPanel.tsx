import { useEditor } from "@/store/editor";
import { Copy, Trash2, ArrowUp, ArrowDown, Layers } from "lucide-react";

const SWATCHES = [
  "#7df9ff", "#00d9ff", "#0ea5e9", "#4d7cff", "#1f3fb8",
  "#0a0f1f", "#ffffff", "#ff0080", "#00ff88",
];

export function PropertiesPanel() {
  const { elements, selectedId, update, remove, duplicate, bringForward, sendBackward } = useEditor();
  const el = elements.find((e) => e.id === selectedId);
  if (!el) {
    return (
      <div className="hidden w-72 border-l border-teal/30 bg-paper p-4 lg:block">
        <div className="brutal-border bg-ink px-3 py-2.5">
          <div className="font-display text-xs uppercase tracking-[0.25em] text-teal/60">
            ▌ No selection
          </div>
        </div>
        <div className="mt-4 space-y-2 font-mono text-[11px] text-teal/50">
          <p>&gt; awaiting input...</p>
          <p>&gt; click a layer to inspect</p>
          <p className="text-teal/30">&gt; _</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-72 overflow-y-auto border-l border-teal/30 bg-paper">
      <div className="border-b border-teal/40 bg-blue-deep px-4 py-3 glow-blue">
        <div className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.25em] text-teal">
          <Layers className="h-3.5 w-3.5" strokeWidth={2.5} />
          {el.type}_layer
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
                className="brutal-border-2 w-full bg-surface p-2 font-mono text-xs text-teal focus:outline-none focus:border-teal focus:bg-surface-2"
              />
            </Field>
            <Field label="Font size">
              <input
                type="range"
                min={12}
                max={240}
                value={el.fontSize}
                onChange={(e) => update(el.id, { fontSize: +e.target.value })}
                className="w-full accent-teal"
              />
              <div className="font-mono text-[11px] text-teal/70">{el.fontSize}px</div>
            </Field>
            <Field label="Font family">
              <select
                value={el.fontFamily}
                onChange={(e) => update(el.id, { fontFamily: e.target.value })}
                className="brutal-border-2 w-full bg-surface px-2 py-1.5 font-mono text-xs text-teal focus:outline-none focus:border-teal"
              >
                {["Orbitron", "JetBrains Mono", "Inter", "Archivo Black", "Georgia"].map((f) => (
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
                    className={`brutal-border-2 flex-1 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                      el.align === a
                        ? "bg-blue text-ink border-teal"
                        : "bg-surface text-teal hover:border-teal"
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
                className="w-full accent-teal"
              />
              <div className="font-mono text-[11px] text-teal/70">{el.strokeWidth}px</div>
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
            className="w-full accent-teal"
          />
          <div className="font-mono text-[11px] text-teal/70">{el.rotation}°</div>
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
      <label className="mb-1.5 block font-display text-[10px] uppercase tracking-[0.2em] text-teal/80">
        ▸ {label}
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
            className={`brutal-border-2 h-7 w-7 transition-all ${
              value === s ? "border-teal scale-110 glow-teal" : "hover:border-teal"
            }`}
            style={{ background: s }}
          />
        ))}
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="brutal-border-2 h-9 w-full bg-surface"
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
      className={`brutal-border-2 brutal-press flex items-center justify-center gap-1 py-2 font-mono text-[10px] uppercase tracking-wider ${
        danger
          ? "bg-destructive text-white border-destructive hover:border-destructive"
          : "bg-surface text-teal hover:border-teal"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
