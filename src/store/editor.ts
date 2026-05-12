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

export type Page = {
  id: string;
  elements: AnyElement[];
  bgColor: string;
};

export const DEFAULT_W = 1080;
export const DEFAULT_H = 1080;
const DEFAULT_BG = "#fafaf2";

export const CANVAS_PRESETS = [
  { name: "Square", w: 1080, h: 1080 },
  { name: "Story", w: 1080, h: 1920 },
  { name: "Post 4:5", w: 1080, h: 1350 },
  { name: "Landscape", w: 1920, h: 1080 },
  { name: "A4", w: 1240, h: 1754 },
  { name: "Slide 16:9", w: 1920, h: 1080 },
] as const;

type Tool = "templates" | "text" | "shapes" | "uploads" | "color" | "size";

type HistorySnap = { pages: Page[]; currentIndex: number };

type State = {
  pages: Page[];
  currentIndex: number;
  // derived mirror of current page (kept in sync)
  elements: AnyElement[];
  bgColor: string;
  selectedId: string | null;
  tool: Tool;
  canvasW: number;
  canvasH: number;
  history: HistorySnap[];
  future: HistorySnap[];
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
  // pages
  addPage: () => void;
  removePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  setCurrentPage: (index: number) => void;
  movePage: (from: number, to: number) => void;
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

const newPage = (overrides: Partial<Page> = {}): Page => ({
  id: uid(),
  elements: [],
  bgColor: DEFAULT_BG,
  ...overrides,
});

const initialPage = newPage();

export const useEditor = create<State>((set, get) => {
  const snap = (): HistorySnap => ({
    pages: JSON.parse(JSON.stringify(get().pages)),
    currentIndex: get().currentIndex,
  });
  const pushHistory = () => {
    set({ history: [...get().history, snap()].slice(-50), future: [] });
  };
  const syncCurrent = (pages: Page[], currentIndex: number) => {
    const p = pages[currentIndex];
    return { pages, currentIndex, elements: p.elements, bgColor: p.bgColor };
  };
  const updateCurrentPage = (mut: (p: Page) => Page) => {
    const { pages, currentIndex } = get();
    const next = pages.map((p, i) => (i === currentIndex ? mut(p) : p));
    set(syncCurrent(next, currentIndex));
  };

  return {
    pages: [initialPage],
    currentIndex: 0,
    elements: initialPage.elements,
    bgColor: initialPage.bgColor,
    selectedId: null,
    tool: "templates",
    canvasW: DEFAULT_W,
    canvasH: DEFAULT_H,
    history: [],
    future: [],
    presenting: false,

    setTool: (tool) => set({ tool }),
    setCanvasSize: (canvasW, canvasH) => set({ canvasW, canvasH }),
    setPresenting: (presenting) => set({ presenting }),
    select: (selectedId) => set({ selectedId }),

    add: (el) => {
      pushHistory();
      updateCurrentPage((p) => ({ ...p, elements: [...p.elements, el] }));
      set({ selectedId: el.id });
    },
    update: (id, patch) =>
      updateCurrentPage((p) => ({
        ...p,
        elements: p.elements.map((e) => (e.id === id ? ({ ...e, ...patch } as AnyElement) : e)),
      })),
    remove: (id) => {
      pushHistory();
      updateCurrentPage((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== id) }));
      if (get().selectedId === id) set({ selectedId: null });
    },
    duplicate: (id) => {
      const el = get().elements.find((e) => e.id === id);
      if (!el) return;
      pushHistory();
      const clone = { ...el, id: uid(), x: el.x + 30, y: el.y + 30 } as AnyElement;
      updateCurrentPage((p) => ({ ...p, elements: [...p.elements, clone] }));
      set({ selectedId: clone.id });
    },
    bringForward: (id) => {
      updateCurrentPage((p) => {
        const arr = [...p.elements];
        const i = arr.findIndex((e) => e.id === id);
        if (i < 0 || i === arr.length - 1) return p;
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        return { ...p, elements: arr };
      });
    },
    sendBackward: (id) => {
      updateCurrentPage((p) => {
        const arr = [...p.elements];
        const i = arr.findIndex((e) => e.id === id);
        if (i <= 0) return p;
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        return { ...p, elements: arr };
      });
    },
    setBg: (bgColor) => {
      pushHistory();
      updateCurrentPage((p) => ({ ...p, bgColor }));
    },
    undo: () => {
      const { history, future } = get();
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      set({
        ...syncCurrent(prev.pages, Math.min(prev.currentIndex, prev.pages.length - 1)),
        history: history.slice(0, -1),
        future: [snap(), ...future].slice(0, 50),
        selectedId: null,
      });
    },
    redo: () => {
      const { future, history } = get();
      if (future.length === 0) return;
      const [next, ...rest] = future;
      set({
        ...syncCurrent(next.pages, Math.min(next.currentIndex, next.pages.length - 1)),
        future: rest,
        history: [...history, snap()].slice(-50),
        selectedId: null,
      });
    },
    clear: () => {
      pushHistory();
      updateCurrentPage((p) => ({ ...p, elements: [] }));
      set({ selectedId: null });
    },
    loadTemplate: (els, bg) => {
      pushHistory();
      updateCurrentPage((p) => ({ ...p, elements: els, bgColor: bg ?? p.bgColor }));
      set({ selectedId: null });
    },

    addPage: () => {
      pushHistory();
      const { pages, currentIndex, bgColor } = get();
      const created = newPage({ bgColor });
      const next = [...pages.slice(0, currentIndex + 1), created, ...pages.slice(currentIndex + 1)];
      set({ ...syncCurrent(next, currentIndex + 1), selectedId: null });
    },
    removePage: (index) => {
      const { pages, currentIndex } = get();
      if (pages.length <= 1) return;
      pushHistory();
      const next = pages.filter((_, i) => i !== index);
      const newIdx = Math.min(currentIndex > index ? currentIndex - 1 : currentIndex, next.length - 1);
      set({ ...syncCurrent(next, newIdx), selectedId: null });
    },
    duplicatePage: (index) => {
      pushHistory();
      const { pages } = get();
      const src = pages[index];
      const clone: Page = {
        id: uid(),
        bgColor: src.bgColor,
        elements: src.elements.map((e) => ({ ...e, id: uid() })),
      };
      const next = [...pages.slice(0, index + 1), clone, ...pages.slice(index + 1)];
      set({ ...syncCurrent(next, index + 1), selectedId: null });
    },
    setCurrentPage: (index) => {
      const { pages } = get();
      if (index < 0 || index >= pages.length) return;
      set({ ...syncCurrent(pages, index), selectedId: null });
    },
    movePage: (from, to) => {
      const { pages, currentIndex } = get();
      if (from === to || from < 0 || to < 0 || from >= pages.length || to >= pages.length) return;
      pushHistory();
      const arr = [...pages];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      const newIdx = currentIndex === from ? to : currentIndex;
      set(syncCurrent(arr, newIdx));
    },
  };
});
