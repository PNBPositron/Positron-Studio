import { create } from "zustand";

export type ElementBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type TextElement = ElementBase & {
  type: "text";
  text: string;
  fontSize: number;
  color: string;
  fontWeight: number;
  fontFamily: string;
  align: "left" | "center" | "right";
  italic?: boolean;
  underline?: boolean;
};

export type ShapeKind = "rect" | "circle" | "triangle" | "star" | "arrow";
export type ShapeElement = ElementBase & {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
};

export type ImageElement = ElementBase & {
  type: "image";
  src: string;
};

export type AnyElement = TextElement | ShapeElement | ImageElement;

export const DEFAULT_W = 1080;
export const DEFAULT_H = 1080;

export const CANVAS_PRESETS = [
  { name: "Square", w: 1080, h: 1080 },
  { name: "Story", w: 1080, h: 1920 },
  { name: "Post 4:5", w: 1080, h: 1350 },
  { name: "Landscape", w: 1920, h: 1080 },
  { name: "A4", w: 1240, h: 1754 },
  { name: "Slide 16:9", w: 1920, h: 1080 },
] as const;

type Tool = "templates" | "text" | "shapes" | "uploads" | "color" | "size";

type State = {
  elements: AnyElement[];
  selectedId: string | null;
  tool: Tool;
  bgColor: string;
  canvasW: number;
  canvasH: number;
  history: AnyElement[][];
  future: AnyElement[][];
  presenting: boolean;
  setTool: (t: Tool) => void;
  select: (id: string | null) => void;
  add: (el: AnyElement) => void;
  update: (id: string, patch: Partial<AnyElement>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  setBg: (c: string) => void;
  setCanvasSize: (w: number, h: number) => void;
  setPresenting: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  loadTemplate: (els: AnyElement[], bg?: string) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const newText = (overrides: Partial<TextElement> = {}): TextElement => ({
  id: uid(),
  type: "text",
  x: 120,
  y: 120,
  width: 520,
  height: 120,
  rotation: 0,
  text: "Edit me",
  fontSize: 72,
  color: "#0a0f1f",
  fontWeight: 900,
  fontFamily: "Archivo Black",
  align: "left",
  ...overrides,
});

export const newShape = (
  shape: ShapeKind,
  overrides: Partial<ShapeElement> = {},
): ShapeElement => ({
  id: uid(),
  type: "shape",
  x: 200,
  y: 200,
  width: 320,
  height: 320,
  rotation: 0,
  shape,
  fill: "#ffd84a",
  stroke: "#0a0f1f",
  strokeWidth: 6,
  ...overrides,
});

export const newImage = (src: string, overrides: Partial<ImageElement> = {}): ImageElement => ({
  id: uid(),
  type: "image",
  x: 200,
  y: 200,
  width: 480,
  height: 480,
  rotation: 0,
  src,
  ...overrides,
});

export const useEditor = create<State>((set, get) => {
  const pushHistory = () => {
    const { elements, history } = get();
    set({
      history: [...history, JSON.parse(JSON.stringify(elements))].slice(-50),
      future: [],
    });
  };
  return {
    elements: [],
    selectedId: null,
    tool: "templates",
    bgColor: "#fafaf2",
    history: [],
    future: [],
    setTool: (tool) => set({ tool }),
    select: (selectedId) => set({ selectedId }),
    add: (el) => {
      pushHistory();
      set({ elements: [...get().elements, el], selectedId: el.id });
    },
    update: (id, patch) =>
      set({
        elements: get().elements.map((e) =>
          e.id === id ? ({ ...e, ...patch } as AnyElement) : e,
        ),
      }),
    remove: (id) => {
      pushHistory();
      set({
        elements: get().elements.filter((e) => e.id !== id),
        selectedId: get().selectedId === id ? null : get().selectedId,
      });
    },
    duplicate: (id) => {
      const el = get().elements.find((e) => e.id === id);
      if (!el) return;
      pushHistory();
      const clone = { ...el, id: uid(), x: el.x + 30, y: el.y + 30 } as AnyElement;
      set({ elements: [...get().elements, clone], selectedId: clone.id });
    },
    bringForward: (id) => {
      const arr = [...get().elements];
      const i = arr.findIndex((e) => e.id === id);
      if (i < 0 || i === arr.length - 1) return;
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      set({ elements: arr });
    },
    sendBackward: (id) => {
      const arr = [...get().elements];
      const i = arr.findIndex((e) => e.id === id);
      if (i <= 0) return;
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      set({ elements: arr });
    },
    setBg: (bgColor) => {
      pushHistory();
      set({ bgColor });
    },
    undo: () => {
      const { history, elements, future } = get();
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      set({
        elements: prev,
        history: history.slice(0, -1),
        future: [elements, ...future].slice(0, 50),
      });
    },
    redo: () => {
      const { future, elements, history } = get();
      if (future.length === 0) return;
      const [next, ...rest] = future;
      set({
        elements: next,
        future: rest,
        history: [...history, elements].slice(-50),
      });
    },
    clear: () => {
      pushHistory();
      set({ elements: [], selectedId: null });
    },
    loadTemplate: (els, bg) => {
      pushHistory();
      set({ elements: els, bgColor: bg ?? get().bgColor, selectedId: null });
    },
  };
});
