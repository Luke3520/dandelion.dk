// Hand-drawn shapes for the spot illustrations, made with Rough.js at build time.
// Pages ship plain SVG paths; no drawing code runs in the browser.
// The look: wobbly ink outlines over flat colour fields that sit slightly off the lines, like a print.
import rough from 'roughjs';

type Options = Parameters<ReturnType<typeof rough.generator>['rectangle']>[4];
type Drawable = ReturnType<ReturnType<typeof rough.generator>['rectangle']>;

export interface Mark { d: string; stroke?: string; fill?: string; width?: number; dx?: number; dy?: number }

const generator = rough.generator();
// Coordinates are rounded to tenths; large, busy drawings can pass 0 for whole units to save bytes.
const tidy = (d: string, precision: number) => {
  const f = 10 ** precision;
  return d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * f) / f));
};

// The colour field sits a few units down and to the right of its outline.
const OFFSET = { dx: 3, dy: 3 };

export function sketchbook(seed: number, precision = 1) {
  let next = seed;
  const marks: Mark[] = [];

  const toMarks = (drawable: Drawable, extra: Partial<Mark> = {}) => {
    for (const p of generator.toPaths(drawable)) {
      marks.push({
        d: tidy(p.d, precision),
        stroke: p.stroke === 'none' ? undefined : p.stroke,
        fill: p.fill && p.fill !== 'none' ? p.fill : undefined,
        width: p.strokeWidth || undefined,
        ...extra,
      });
    }
  };

  const ink = (o: Options = {}): Options => ({
    seed: next++, roughness: 1.1, bowing: 0.9, strokeWidth: 2.2, stroke: 'var(--ink)', preserveVertices: true, ...o,
  });
  const wash = (fill: string, o: Options = {}): Options => ({
    seed: next++, roughness: 0.9, fill, fillStyle: 'solid', stroke: 'none', strokeWidth: 0, ...o,
  });

  // Each shape method draws a colour field (when given a fill) and then the ink outline on top.
  const both = (make: (o: Options) => Drawable, fill: string | undefined, o: Options) => {
    if (fill) toMarks(make(wash(fill)), OFFSET);
    toMarks(make(ink(o)));
  };

  return {
    marks,
    rect: (x: number, y: number, w: number, h: number, fill?: string, o: Options = {}) =>
      both((opt) => generator.rectangle(x, y, w, h, opt), fill, o),
    round: (x: number, y: number, w: number, h: number, r: number, fill?: string, o: Options = {}) =>
      both((opt) => generator.path(roundedRect(x, y, w, h, r), opt), fill, o),
    circle: (cx: number, cy: number, diameter: number, fill?: string, o: Options = {}) =>
      both((opt) => generator.circle(cx, cy, diameter, opt), fill, o),
    ellipse: (cx: number, cy: number, w: number, h: number, fill?: string, o: Options = {}) =>
      both((opt) => generator.ellipse(cx, cy, w, h, opt), fill, o),
    poly: (points: [number, number][], fill?: string, o: Options = {}) =>
      both((opt) => generator.polygon(points, opt), fill, o),
    path: (d: string, fill?: string, o: Options = {}) => both((opt) => generator.path(d, opt), fill, o),
    line: (x1: number, y1: number, x2: number, y2: number, o: Options = {}) => toMarks(generator.line(x1, y1, x2, y2, ink(o))),
    curve: (points: [number, number][], o: Options = {}) => toMarks(generator.curve(points, ink(o))),
    // A soft patch of colour with no outline, for highlights and shadows.
    patch: (d: string, fill: string) => toMarks(generator.path(d, wash(fill, { roughness: 1.4 }))),
    // Hand-hatched texture inside a shape, for stony or earthy surfaces.
    hatch: (d: string, color: string, o: Options = {}) =>
      toMarks(generator.path(d, {
        seed: next++, roughness: 1.2, fill: color, fillStyle: 'hachure', hachureGap: 7, hachureAngle: -38,
        fillWeight: 1, stroke: 'none', strokeWidth: 0, ...o,
      })),
  };
}

// A loose dandelion seed: a fan of hairs above a small dark seed. (x, y) is the top of the stalk.
export function seedMarks(x: number, y: number, size: number, seed: number) {
  const b = sketchbook(seed);
  const calm = { roughness: 0.3, disableMultiStroke: true };
  b.line(x, y + 15 * size, x, y + 2 * size, { ...calm, strokeWidth: 1.5 });
  for (let i = -4; i <= 4; i++) {
    const a = -Math.PI / 2 + i * 0.26;
    b.line(x, y + 2 * size, x + Math.cos(a) * 11 * size, y + 2 * size + Math.sin(a) * 11 * size, { ...calm, strokeWidth: 1.1 });
  }
  b.ellipse(x, y + 18 * size, 3.5 * size, 7 * size, 'var(--ink)', { ...calm, strokeWidth: 1 });
  return b.marks;
}

// Points of a dandelion leaf: a narrow stalk, backward-pointing teeth and a broad tip.
export function leafPoints(x: number, y: number, length: number, width: number, angle: number, lobes = 4): [number, number][] {
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  const steps = lobes * 3 + 3;
  for (let i = 1; i < steps; i++) {
    const u = i / steps;
    const lobe = (u * lobes) % 1;
    const teeth = u < 0.78 ? 0.45 + 0.55 * (1 - lobe) ** 2 : 1;
    const w = width * Math.sin(Math.PI * u ** 0.8) * (0.3 + 0.7 * u) * teeth;
    upper.push([u * length, -w]);
    lower.push([u * length, w * 0.9]);
  }
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const place = ([px, py]: [number, number]): [number, number] => [x + px * cos - py * sin, y + px * sin + py * cos];
  return [[x, y], ...upper.map(place), place([length, 0]), ...lower.reverse().map(place)];
}

export function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
