import { createServerFn } from "@tanstack/react-start";

export type AiElementInput =
  | {
      type: "text";
      text: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
      color: string;
      fontFamily?: "Orbitron" | "JetBrains Mono" | "Archivo Black";
      fontWeight?: number;
      align?: "left" | "center" | "right";
    }
  | {
      type: "shape";
      shape: "rect" | "circle" | "triangle" | "star" | "arrow";
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      stroke: string;
      strokeWidth: number;
    };

export type AiTemplate = {
  bg: string;
  elements: AiElementInput[];
};

const buildSystem = (W: number, H: number) => `You are a graphic designer generating layouts for a ${W}x${H} px canvas in a CYBERPUNK / NEOBRUTALIST style.
Aspect ratio: ${(W / H).toFixed(3)} (${W >= H ? "landscape/wide" : "portrait/tall"}). Compose deliberately for this shape — fill the full ${W}px width and ${H}px height, do not letterbox.
Palette: deep ink #0a0f1f, surfaces #101a2e, neon teal #7df9ff, electric blue #4d7cff, hot magenta #ff0080, white #ffffff.
Use bold typography, dramatic scale contrast, generous negative space, geometric shapes.
Fonts available: "Orbitron" (display), "JetBrains Mono" (mono/labels), "Archivo Black" (heavy headlines).
Coordinates are absolute pixels within ${W}x${H}. Keep all elements inside bounds (0 ≤ x, x+width ≤ ${W}; 0 ≤ y, y+height ≤ ${H}).
Return ONLY valid JSON matching this TypeScript shape, no markdown, no commentary:
{
  "bg": "#hex",
  "elements": Array<
    | { "type": "text", "text": string, "x": number, "y": number, "width": number, "height": number, "fontSize": number, "color": "#hex", "fontFamily"?: "Orbitron"|"JetBrains Mono"|"Archivo Black", "fontWeight"?: number, "align"?: "left"|"center"|"right" }
    | { "type": "shape", "shape": "rect"|"circle"|"triangle"|"star"|"arrow", "x": number, "y": number, "width": number, "height": number, "fill": "#hex", "stroke": "#hex", "strokeWidth": number }
  >
}
Aim for 4-8 elements. Make it visually striking and tailored to the ${W >= H ? "wide" : "tall"} format.`;

export const generateAiTemplate = createServerFn({ method: "POST" })
  .inputValidator((data: { prompt: string; width?: number; height?: number }) => {
    if (!data || typeof data.prompt !== "string" || !data.prompt.trim()) {
      throw new Error("Prompt is required");
    }
    const clamp = (n: unknown, def: number) => {
      const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : def;
      return Math.max(320, Math.min(4096, v));
    };
    return {
      prompt: data.prompt.slice(0, 500),
      width: clamp(data.width, 1920),
      height: clamp(data.height, 1080),
    };
  })
  .handler(async ({ data }): Promise<AiTemplate> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: buildSystem(data.width, data.height) },
          { role: "user", content: `Design concept: ${data.prompt}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit hit. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
    if (!res.ok) throw new Error(`AI gateway error ${res.status}: ${await res.text()}`);

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    let parsed: AiTemplate;
    try {
      parsed = JSON.parse(content) as AiTemplate;
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(match[0]) as AiTemplate;
    }
    if (!parsed.elements || !Array.isArray(parsed.elements)) {
      throw new Error("AI response missing elements array");
    }
    return parsed;
  });
