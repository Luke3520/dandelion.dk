// Dandelion plants in the hand-drawn style: a leaf rosette, a stem and either a flower or a seed head.
// Shared by the hero meadow, the services section and the spot drawings, so they all match.
import { sketchbook, leafPoints, type Mark } from './sketch';

export interface PlantOptions {
  height: number;
  lean?: number;
  head?: 'flower' | 'clock' | 'bud';
  leaves?: boolean;
  scale?: number;
  seed?: number;
}

const small = { roughness: 0.45, disableMultiStroke: true };

/** Draws a plant standing at (x, y). Returns the rosette and the stem with its head separately, so the head can sway. */
export function plant(x: number, y: number, o: PlantOptions): { rosette: Mark[]; top: Mark[] } {
  const s = o.scale ?? 1;
  const lean = o.lean ?? 0;
  const seed = o.seed ?? 1;
  const hx = x + lean;
  const hy = y - o.height;

  // Plants are large and busy, so whole-unit coordinates: smaller files, no visible difference.
  const rosette = sketchbook(seed * 10, 0);
  if (o.leaves !== false) {
    const spread = [[-2.95, 1, 1], [-3.4, 0.75, 0.8], [-0.2, 1.05, 1], [0.25, 0.75, 0.8], [-2.45, 0.65, 0.7]] as const;
    for (const [angle, len, wid] of spread) {
      rosette.poly(leafPoints(x, y, 92 * s * len, 17 * s * wid, angle), 'var(--leaf)', { strokeWidth: 1.6 * s, disableMultiStroke: true });
    }
  }

  const top = sketchbook(seed * 10 + 1, 0);
  top.curve([[x, y], [x + lean * 0.1, y - o.height * 0.45], [hx - lean * 0.25, hy + o.height * 0.25], [hx, hy]],
    { strokeWidth: 2.6 * s, stroke: 'var(--stem)', roughness: 0.6 });

  if (o.head === 'clock') {
    const r = 30 * s;
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const tx = hx + Math.cos(a) * r;
      const ty = hy + Math.sin(a) * r;
      top.line(hx + Math.cos(a) * 4 * s, hy + Math.sin(a) * 4 * s, tx, ty,
        { strokeWidth: 0.9 * s, roughness: 0.3, disableMultiStroke: true, stroke: 'var(--seed, var(--ink))' });
      top.circle(tx, ty, 4.2 * s, undefined, { ...small, strokeWidth: 0.8 * s, stroke: 'var(--seed, var(--ink))' });
    }
    top.circle(hx, hy, 9 * s, 'var(--leaf)', { ...small, strokeWidth: 1.4 * s });
  } else if (o.head === 'bud') {
    top.ellipse(hx, hy - 6 * s, 14 * s, 26 * s, 'var(--leaf)', { strokeWidth: 1.6 * s });
    top.line(hx - 3 * s, hy - 16 * s, hx - 1 * s, hy - 22 * s, { ...small, strokeWidth: 1.6 * s, stroke: 'var(--yellow)' });
  } else {
    const r = 27 * s;
    top.poly([[hx - 12 * s, hy + 12 * s], [hx - 6 * s, hy + 20 * s], [hx, hy + 13 * s], [hx + 7 * s, hy + 20 * s], [hx + 13 * s, hy + 11 * s]],
      'var(--leaf)', { strokeWidth: 1.3 * s });
    top.circle(hx, hy, r * 2, 'var(--yellow)', { strokeWidth: 1.8 * s });
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      const r2 = r * (0.86 + (i % 2) * 0.1);
      top.line(hx + Math.cos(a) * r * 0.3, hy + Math.sin(a) * r * 0.3, hx + Math.cos(a) * r2, hy + Math.sin(a) * r2,
        { strokeWidth: 1 * s, roughness: 0.5, disableMultiStroke: true });
    }
    top.circle(hx, hy, r * 0.42, 'var(--clay)', { ...small, strokeWidth: 1.3 * s });
  }
  return { rosette: rosette.marks, top: top.marks };
}
