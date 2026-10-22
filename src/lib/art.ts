// Geometry for the hand-built SVG illustrations. Everything is computed at build time,
// so the pages ship plain SVG and no JavaScript.

export interface Line { x1: number; y1: number; x2: number; y2: number; w: number; tone: number }
export interface Dot { x: number; y: number; r: number; o: number; twinkle: boolean; delay: number }

const round = (n: number) => Math.round(n * 10) / 10;

// Small deterministic random generator, so the art is the same on every build.
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

// A flower head seen from the front: rings of narrow petals around a darker centre.
export function flowerHead(cx: number, cy: number, r: number, seed = 1): Line[] {
  const rand = rng(seed);
  const lines: Line[] = [];
  const rings = [
    { from: 0.35, to: 1, count: 30, w: r * 0.11, tone: 0 },
    { from: 0.25, to: 0.8, count: 24, w: r * 0.1, tone: 1 },
    { from: 0.15, to: 0.55, count: 18, w: r * 0.09, tone: 2 },
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const a = (i / ring.count) * Math.PI * 2 + rand() * 0.12;
      const len = ring.to * (0.9 + rand() * 0.12);
      lines.push({
        x1: round(cx + Math.cos(a) * r * ring.from),
        y1: round(cy + Math.sin(a) * r * ring.from),
        x2: round(cx + Math.cos(a) * r * len),
        y2: round(cy + Math.sin(a) * r * len),
        w: round(ring.w),
        tone: ring.tone,
      });
    }
  }
  return lines;
}

// Merges lines that share a width and tone into one path each, so the SVG stays small.
export function paths(lines: Line[]): { d: string; w: number; tone: number }[] {
  const groups = new Map<string, { d: string[]; w: number; tone: number }>();
  for (const l of lines) {
    const key = `${l.w}|${l.tone}`;
    const group = groups.get(key) ?? { d: [], w: l.w, tone: l.tone };
    group.d.push(`M${l.x1} ${l.y1}L${l.x2} ${l.y2}`);
    groups.set(key, group);
  }
  return [...groups.values()].map((g) => ({ d: g.d.join(''), w: g.w, tone: g.tone }));
}

export function stars(count: number, width: number, height: number, seed = 3): Dot[] {
  const rand = rng(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: round(rand() * width),
    y: round(rand() * height),
    r: round(0.7 + rand() * 1.3),
    o: round(0.35 + rand() * 0.5),
    twinkle: i % 5 === 0,
    delay: round(rand() * 6),
  }));
}
