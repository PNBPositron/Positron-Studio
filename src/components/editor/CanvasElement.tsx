import { useRef, useState, useEffect } from "react";
import { useEditor, type AnyElement, DEFAULT_FILTERS, type ImageFilters } from "@/store/editor";
import { ShapeRender } from "./ShapeRender";
import { Model3DRender } from "./Model3DRender";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

const filterCss = (f?: ImageFilters) => {
  const v = { ...DEFAULT_FILTERS, ...(f ?? {}) };
  return `brightness(${v.brightness}%) contrast(${v.contrast}%) saturate(${v.saturate}%) blur(${v.blur}px) grayscale(${v.grayscale}%) sepia(${v.sepia}%) hue-rotate(${v.hueRotate}deg) invert(${v.invert}%)`;
};

type Handle = "nw" | "ne" | "sw" | "se";

export function CanvasElement({ element, scale }: { element: AnyElement; scale: number }) {
  const { selectedId, select, update } = useEditor();
  const selected = selectedId === element.id;
  const ref = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const linkActive = element.type === "text" && !!element.href && !selected && !editing;

  const onDragStart = (e: React.MouseEvent) => {
    if (editing) return;
    if (linkActive) return; // let the <a> handle the click
    e.stopPropagation();
    select(element.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = element.x;
    const oy = element.y;
    const onMove = (m: MouseEvent) => {
      update(element.id, {
        x: ox + (m.clientX - startX) / scale,
        y: oy + (m.clientY - startY) / scale,
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeStart = (handle: Handle) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y, width, height } = element;
    const onMove = (m: MouseEvent) => {
      const dx = (m.clientX - startX) / scale;
      const dy = (m.clientY - startY) / scale;
      let nx = x, ny = y, nw = width, nh = height;
      if (handle === "se") { nw = Math.max(20, width + dx); nh = Math.max(20, height + dy); }
      if (handle === "ne") { ny = y + dy; nh = Math.max(20, height - dy); nw = Math.max(20, width + dx); }
      if (handle === "sw") { nx = x + dx; nw = Math.max(20, width - dx); nh = Math.max(20, height + dy); }
      if (handle === "nw") { nx = x + dx; ny = y + dy; nw = Math.max(20, width - dx); nh = Math.max(20, height - dy); }
      update(element.id, { x: nx, y: ny, width: nw, height: nh });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (!selected) setEditing(false);
  }, [selected]);

  return (
    <div
      ref={ref}
      onMouseDown={onDragStart}
      onDoubleClick={(e) => {
        if (element.type === "text") {
          e.stopPropagation();
          setEditing(true);
        }
      }}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        cursor: editing ? "text" : "move",
        outline: selected ? "3px solid #2b6bff" : "none",
        outlineOffset: "2px",
      }}
    >
      {element.type === "text" && (() => {
        const presenting = useEditor.getState().presenting;
        const display = element.bullet && !editing
          ? (element.text || "").split("\n").map((l) => (l.trim() ? `• ${l}` : l)).join("\n")
          : element.text;
        const isLink = !!element.href && presenting && !editing;
        const textStyle: React.CSSProperties = {
          width: "100%",
          height: "100%",
          fontSize: element.fontSize,
          color: element.color,
          fontWeight: element.fontWeight,
          fontFamily: element.fontFamily,
          textAlign: element.align,
          fontStyle: element.italic ? "italic" : "normal",
          textDecoration: element.underline || isLink ? "underline" : "none",
          outline: "none",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        };
        const inner = (
          <div
            contentEditable={editing}
            suppressContentEditableWarning
            onBlur={(e) => {
              update(element.id, { text: e.currentTarget.innerText || "" });
              setEditing(false);
            }}
            style={textStyle}
          >
            {display}
          </div>
        );
        if (isLink) {
          return (
            <a
              href={element.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={(e) => e.stopPropagation()}
              style={{ display: "block", width: "100%", height: "100%", color: "inherit" }}
            >
              {inner}
            </a>
          );
        }
        return inner;
      })()}
      {element.type === "shape" && (
        <ShapeRender element={element} />
      )}
      {element.type === "image" && (
        <img
          src={element.src}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: filterCss(element.filters),
          }}
        />
      )}
      {element.type === "icon" && (() => {
        const Comp =
          (LucideIcons as unknown as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[element.name] ??
          HelpCircle;
        return (
          <Comp
            color={element.color}
            strokeWidth={element.strokeWidth}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        );
      })()}
      {element.type === "model3d" && <Model3DRender element={element} />}

      {selected && !editing && (
        <>
          {(["nw", "ne", "sw", "se"] as Handle[]).map((h) => (
            <div
              key={h}
              onMouseDown={onResizeStart(h)}
              style={{
                position: "absolute",
                width: 18,
                height: 18,
                background: "#ffd84a",
                border: "3px solid #0a0f1f",
                ...(h.includes("n") ? { top: -10 } : { bottom: -10 }),
                ...(h.includes("w") ? { left: -10 } : { right: -10 }),
                cursor: `${h}-resize`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
