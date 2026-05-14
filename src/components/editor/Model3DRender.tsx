import type { Model3DElement } from "@/store/editor";

const FACES: Array<{ tx: string; bg: (c: string) => string }> = [
  { tx: "translateZ(50%)", bg: (c) => c },
  { tx: "rotateY(180deg) translateZ(50%)", bg: (c) => shade(c, -25) },
  { tx: "rotateY(90deg) translateZ(50%)", bg: (c) => shade(c, -10) },
  { tx: "rotateY(-90deg) translateZ(50%)", bg: (c) => shade(c, -15) },
  { tx: "rotateX(90deg) translateZ(50%)", bg: (c) => shade(c, 20) },
  { tx: "rotateX(-90deg) translateZ(50%)", bg: (c) => shade(c, -35) },
];

function shade(hex: string, amt: number) {
  const m = /^#?([a-f\d]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + Math.round((amt / 100) * 255));
  const g = clamp(((n >> 8) & 255) + Math.round((amt / 100) * 255));
  const b = clamp((n & 255) + Math.round((amt / 100) * 255));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function Model3DRender({ element }: { element: Model3DElement }) {
  const { shape, color, spinSpeed, tiltX, tiltY } = element;
  const animStyle: React.CSSProperties =
    spinSpeed > 0
      ? { animation: `positron-spin3d ${spinSpeed}s linear infinite` }
      : {};

  if (shape === "sphere") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 25%, ${shade(color, 45)} 0%, ${color} 35%, ${shade(color, -45)} 90%)`,
          boxShadow: `inset -20% -25% 40% ${shade(color, -55)}, 0 14px 30px rgba(0,0,0,0.35)`,
        }}
      />
    );
  }

  if (shape === "torus") {
    return (
      <svg viewBox="-60 -60 120 120" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id={`tg-${element.id}`} cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor={shade(color, 40)} />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor={shade(color, -40)} />
          </radialGradient>
        </defs>
        <g style={{ transformOrigin: "50% 50%", ...animStyle }} transform={`rotate(${tiltX + tiltY})`}>
          <ellipse cx="0" cy="0" rx="50" ry="20" fill="none" stroke={`url(#tg-${element.id})`} strokeWidth="14" />
        </g>
      </svg>
    );
  }

  if (shape === "pyramid") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          perspective: "900px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            ...animStyle,
          }}
        >
          {[0, 90, 180, 270].map((deg, i) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                width: 0,
                height: 0,
                marginLeft: "-50%",
                borderLeft: "50% solid transparent",
                borderRight: "50% solid transparent",
                borderBottom: `100% solid ${shade(color, i * -8)}`,
                transformOrigin: "50% 100%",
                transform: `rotateY(${deg}deg) rotateX(60deg)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // cube
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        perspective: "900px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          ...animStyle,
        }}
      >
        {FACES.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              background: f.bg(color),
              border: "2px solid rgba(0,0,0,0.35)",
              transform: f.tx,
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>
    </div>
  );
}
