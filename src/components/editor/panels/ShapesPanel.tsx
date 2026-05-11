import { useEditor, newShape, type ShapeKind } from "@/store/editor";
import { PanelHeader } from "./TextPanel";

const SHAPES: { kind: ShapeKind; label: string }[] = [
  { kind: "rect", label: "Rectangle" },
  { kind: "circle", label: "Circle" },
  { kind: "triangle", label: "Triangle" },
  { kind: "star", label: "Star" },
  { kind: "arrow", label: "Arrow" },
];

const FILLS = ["#ffd84a", "#5fd4d6", "#4d7cff", "#0a0f1f", "#ffffff"];

export function ShapesPanel() {
  const { add } = useEditor();
  return (
    <div className="space-y-4">
      <PanelHeader title="Shapes" />
      <div className="grid grid-cols-3 gap-2">
        {SHAPES.flatMap((s) =>
          FILLS.slice(0, 3).map((fill) => (
            <button
              key={s.kind + fill}
              onClick={() => add(newShape(s.kind, { fill }))}
              className="brutal-border-2 brutal-press grid h-20 place-items-center bg-paper"
              title={s.label}
            >
              <ShapePreview kind={s.kind} fill={fill} />
            </button>
          )),
        )}
      </div>
    </div>
  );
}

function ShapePreview({ kind, fill }: { kind: ShapeKind; fill: string }) {
  const stroke = "#0a0f1f";
  const sw = 4;
  if (kind === "rect")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <rect x="3" y="3" width="38" height="38" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  if (kind === "circle")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="19" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  if (kind === "triangle")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <polygon points="22,4 40,40 4,40" fill={fill} stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  if (kind === "star")
    return (
      <svg width="44" height="44" viewBox="0 0 44 44">
        <polygon
          points="22,4 27,17 41,17 30,26 34,40 22,32 10,40 14,26 3,17 17,17"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      </svg>
    );
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <polygon
        points="3,17 28,17 28,8 41,22 28,36 28,27 3,27"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    </svg>
  );
}
