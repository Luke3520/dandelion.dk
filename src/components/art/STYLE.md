# Dandelion illustration style

Every drawing on the site follows this guide, so they read as one set.

## Look
Editorial print style. Wobbly ink outlines drawn with Rough.js (`src/lib/sketch.ts`) over flat colour
fields that sit a few units down and to the right of their outline, like a slightly misregistered
risograph print. Calm, warm, a little playful. No gradients, no drop shadows, no outlines-only clip art.

## Palette (CSS tokens only, so the drawings follow the theme)
| Token | Use |
|---|---|
| `--ink` | all outlines and small solid details |
| `--paper` | screens, sheets, cups: anything that should read as "white" |
| `--mist` | secondary fields, UI blocks |
| `--yellow` | the one accent per drawing; dandelion flowers; the "answer" |
| `--leaf` / `--stem` | plants, success, growth |
| `--clay` | small warm details (coffee, box sides, a circled choice) |
| `--line` | asphalt and other grey, stony surfaces |

At most three fill colours besides paper in one drawing. Yellow appears once as the focus.

## Strokes
- Main outlines: `strokeWidth` 2–2.4, roughness ~1.1.
- Details and text lines: 1.2–1.6.
- Small round things (dots, keys, seeds): `small` options: roughness ≤ 0.45, `disableMultiStroke`.
- Emphasis lines (headlines in a UI): 3.
- Hatching (`fillStyle: 'hachure'`) only for texture on surfaces like asphalt, in `--muted`.

## Composition
- Spot drawings: viewBox 320 × 220, subject centred, about 20 units of air on each side.
- Scene drawings: viewBox 400 × 320.
- One clear subject; at most two supporting props.
- Dandelion motifs (seed heads, drifting seeds, flowers) tie each drawing to the brand.

## Motion
- CSS only, slow (4–13 s), small (≤ 10 units or ≤ 8°), ease-in-out, infinite.
- At most two moving groups per drawing. Global `prefers-reduced-motion` turns it all off.

## Self-check before shipping
1. Screenshot at real size on mist and on white, desktop and 500 px wide.
2. Does it read in one second without the caption?
3. Any scribbly small shapes? Use the `small` options.
4. Any colour outside the palette, or more than one yellow focus?
5. Decorative drawings carry `aria-hidden`; scene drawings that carry meaning get a `role="img"` label.
