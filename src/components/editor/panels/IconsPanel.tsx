import { useMemo, useState } from "react";
import { useEditor, newIcon } from "@/store/editor";
import { PanelHeader } from "./TextPanel";
import * as LucideIcons from "lucide-react";

const CURATED = [
  "Star", "Heart", "Sparkles", "Zap", "Sun", "Moon", "Cloud", "Flame",
  "Rocket", "Crown", "Trophy", "Award", "Bell", "Bookmark", "Camera", "Music",
  "Play", "Pause", "Mic", "Headphones", "Image", "Video", "Map", "MapPin",
  "Compass", "Globe", "Plane", "Car", "Bike", "ShoppingBag", "ShoppingCart", "CreditCard",
  "Mail", "MessageCircle", "Phone", "Send", "Share2", "Link", "Wifi", "Bluetooth",
  "Lock", "Unlock", "Shield", "Key", "Search", "Filter", "Settings", "Sliders",
  "User", "Users", "Smile", "ThumbsUp", "Eye", "EyeOff", "Hand", "Brain",
  "Code", "Terminal", "Cpu", "Database", "Server", "Cloud as CloudSync",
  "Github", "Twitter", "Instagram", "Youtube", "Twitch", "Linkedin",
  "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ChevronRight", "Plus", "Minus", "Check", "X",
  "Circle", "Square", "Triangle", "Hexagon", "Diamond", "Atom", "Infinity", "Bolt",
  "Coffee", "Pizza", "IceCream", "Beer", "Cake", "Apple", "Cherry", "Carrot",
  "Leaf", "Flower2", "TreePine", "Mountain", "Waves", "Snowflake", "Umbrella", "Rainbow",
];

const NAMES = Array.from(new Set(CURATED.map((n) => n.split(" as ")[0])));

export function IconsPanel() {
  const { add } = useEditor();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return NAMES;
    return NAMES.filter((n) => n.toLowerCase().includes(term));
  }, [q]);

  return (
    <div className="space-y-4">
      <PanelHeader title="Icon Library" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search 1500+ icons…"
        className="brutal-border-2 w-full bg-surface px-2 py-2 font-mono text-xs text-teal placeholder:text-teal/40 focus:outline-none focus:border-teal"
      />
      <div className="grid grid-cols-4 gap-2">
        {filtered.slice(0, 80).map((name) => {
          const Comp = (LucideIcons as unknown as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[name];
          if (!Comp) return null;
          return (
            <button
              key={name}
              title={name}
              onClick={() => add(newIcon(name))}
              className="brutal-border-2 brutal-press grid h-14 place-items-center bg-surface text-teal hover:bg-surface-2 hover:border-teal"
            >
              <Comp className="h-6 w-6" strokeWidth={2} />
            </button>
          );
        })}
      </div>
      <div className="font-mono text-[10px] text-teal/50">
        &gt; type to search the full lucide set
      </div>
    </div>
  );
}
