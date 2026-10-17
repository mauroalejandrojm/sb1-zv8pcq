import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.agents/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.agents/skills/anatomy/kit/lathe.mjs";
import { kitScript } from "../.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 860;
const HEIGHT = 540;

// ---------------------------------------------------------------------------
// Playback controls (below the figure). Buttons drive live.mjs: step through
// the sequence manually, or toggle automatic play. Theme-aware via CSS vars.
// ---------------------------------------------------------------------------
const CTL_CSS = `
.iso-ctl{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;margin:16px 0 0;font-family:var(--anatomy-mono);font-size:12px;letter-spacing:.03em}
.iso-ctl-btn{font:inherit;font-size:12px;line-height:1;color:var(--anatomy-text);background:var(--anatomy-card);border:1px solid var(--anatomy-mid);border-radius:7px;padding:7px 11px;cursor:pointer;min-width:30px;transition:border-color .15s ease,color .15s ease}
.iso-ctl-btn:hover{border-color:var(--anatomy-hi);color:var(--anatomy-strong)}
.iso-ctl-btn:focus-visible{outline:2px solid var(--anatomy-blue);outline-offset:2px}
.iso-ctl-btn[data-active]{border-color:var(--anatomy-hi);color:var(--anatomy-strong)}
.iso-ctl [data-btn="play"]{min-width:70px}
.iso-ctl-q{color:var(--anatomy-strong);min-width:6ch;text-align:center}
.iso-ctl-step{color:var(--anatomy-muted);white-space:nowrap}
.iso-ctl-sep{width:1px;height:20px;background:var(--anatomy-mid);opacity:.5}
@media (max-width:430px){.iso-ctl{gap:6px;font-size:11px}.iso-ctl-btn{padding:6px 9px}.iso-ctl [data-btn="play"]{min-width:60px}}
`;

const CTL_HTML = `
<div class="iso-ctl" role="group" aria-label="Playback controls">
  <button type="button" class="iso-ctl-btn" data-btn="reset" aria-label="Restart from the beginning" title="Restart">↺</button>
  <button type="button" class="iso-ctl-btn" data-btn="prev" aria-label="Previous step" title="Previous step">◀</button>
  <button type="button" class="iso-ctl-btn" data-btn="play" aria-label="Play" aria-pressed="false" title="Play or pause">Play</button>
  <button type="button" class="iso-ctl-btn" data-btn="next" aria-label="Next step" title="Next step">▶</button>
  <span class="iso-ctl-sep" aria-hidden="true"></span>
  <button type="button" class="iso-ctl-btn" data-btn="qprev" aria-label="Previous query" title="Previous query">‹</button>
  <span class="iso-ctl-q" data-qname>apple</span>
  <button type="button" class="iso-ctl-btn" data-btn="qnext" aria-label="Next query" title="Next query">›</button>
  <span class="iso-ctl-step" data-step>auto play</span>
</div>`;

// ---------------------------------------------------------------------------
// THE OBJECT: a cartographer's plotting table (the vector space).
// RAG reads left to right:
//   sheet cut into strips (text splitting)  →  strips stamped, each becomes a
//   pin planted at (x,y) on the map (vector embedding)  →  a query drops a lit
//   pin, dividers pivot on it and swing to the nearest pins, measuring distance
//   (semantic search)  →  the nearest k are clipped to the clipboard (context).
// ---------------------------------------------------------------------------

const PLATE = { x: -184, y: -104, w: 452, d: 200, r: 10 };   // table top: x -184..268, y -104..96
const MAP = { x: 2, y: -74, w: 244, d: 118, r: 3 };           // plotting sheet: x 2..246, y -74..44
const MAPZ = 1.2;                                             // sheet surface height
const HEADZ = 16;                                             // pin-head height
const PIVOTZ = 27;                                            // dividers pivot height

// Worked example. Four document notes plotted by meaning; three queries.
// Distance on the map = semantic distance; nearest k become context.
const NOTES = [
  { label: "gravity", p: [36, -6] },
  { label: "apple", p: [152, 16] },
  { label: "earth", p: [96, 30] },
  { label: "moon", p: [200, -24] },
];
const QUERIES = [
  { label: "apple", p: [140, 8] },
  { label: "earth", p: [87, 24] },
  { label: "gravity", p: [30, -12] },
];
const TOPK = 3;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -17, 0),
    ...k.boxCorners(MAP, MAPZ - 1, MAPZ),
    [-172, -68, 46], [-40, -68, 46], [-56, -66, 78],        // cutter + stamp top
    [258, 92, 6], [150, 50, 6],                              // clipboard corners
    ...QUERIES.flatMap((q) => [[q.p[0] - 4, q.p[1] - 4, PIVOTZ + 4], [q.p[0] + 4, q.p[1] + 4, PIVOTZ + 4]]),
    ...NOTES.map((n) => [n.p[0], n.p[1], HEADZ + 4]),
    [246, -74, MAPZ], [2, 44, MAPZ], [2, -74, MAPZ], [246, 44, MAPZ],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 44 }
);

const at = (p) => k.iso(p, P);
// layers keep painter order sane; ties broken by true depth
const L_BASE = 0, L_BED = 0.5, L_CUT = 1, L_MAP = 2, L_STAMP = 3, L_PIN = 4, L_QUERY = 5, L_CARD = 6, L_CARDS = 7;
const items = [];
function emit(layer, center, svg) {
  items.push({ layer, depth: k.depthOf(center, P), svg });
}
function slab(plan, z, h, style, steps = 6, bevel = 0.6) {
  return k.solidSvg(k.slabOf(plan, z, h, P, steps, bevel), style);
}
function cyl(cx, cy, r, z, h, style, steps = 26) {
  return k.solidSvg(k.cylinder(cx, cy, r, z, h, P, steps), style);
}
// vertical coil around a post (the kit's coil only runs along x/y)
function vcoil(cx, cy, z0, z1, r, turns) {
  const count = Math.round(turns * 22);
  const back = [], front = [];
  let run = [], near = null;
  for (let i = 0; i <= count; i++) {
    const share = i / count;
    const a = share * turns * Math.PI * 2;
    const pt = at([cx + r * Math.cos(a), cy + r * Math.sin(a), z0 + (z1 - z0) * share]);
    const facing = Math.cos(a) * 0.707 + Math.sin(a) * 0.707 > 0;
    if (near === null) near = facing;
    if (facing !== near) { run.push(pt); (near ? front : back).push(k.pathOf(run)); run = [pt]; near = facing; continue; }
    run.push(pt);
  }
  if (run.length > 1) (near ? front : back).push(k.pathOf(run));
  return { back: back.join(""), front: front.join("") };
}
const wrap = (attr, svg) => `<g ${attr}>${svg}</g>`;

// ===========================================================================
// BASE: table top on feet + coordinate rulers (the axes of the vector space)
// ===========================================================================
emit(L_BASE, [-80, 0, -6], `<path class="iso-halo" d="${k.haloOf(PLATE, -17, 12, P)}"/>`);
for (const [x, y] of k.corners(PLATE, 24)) {
  emit(L_BASE, [x, y, -17], k.solidSvg(k.cylinder(x, y, 7, -17, 1.6, P, 26), { tone: "lo" }));
  emit(L_BASE, [x, y, -16], k.solidSvg(k.cylinder(x, y, 5.4, -15.4, 3.4, P, 26), { tone: "mid" }));
}
emit(L_BASE, [-80, 0, -6], slab(PLATE, -12, 12, { tone: "mid" }));
emit(L_BASE, [-80, 0, 0], k.lineSvg(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
for (const [x, y] of k.corners(PLATE, 11)) {
  emit(L_BASE, [x, y, 0], k.lineSvg(k.ring(x, y, 2.2, 0, P, 16), { tone: "lo" }));
  emit(L_BASE, [x, y, 0], k.dotsSvg([at([x, y, 0])], { size: 0.5 }));
}

// X ruler along the front edge of the map (horizontal coordinate axis)
const XRULER = { x: MAP.x + 4, y: 46, w: MAP.w - 8, d: 7, r: 1 };
emit(L_BASE, [MAP.x + MAP.w / 2, 49, 0.4], slab(XRULER, 0, 0.6, { tone: "lo", crease: "none" }));
const xt = k.topTicks(XRULER.x + 6, XRULER.x + XRULER.w - 6, 8, 5, XRULER.y + 0.9, 0.6, [1.6, 3.4], P);
emit(L_BASE, [MAP.x + MAP.w / 2, 49, 1], k.lineSvg(xt.minor, { tone: "lo" }));
emit(L_BASE, [MAP.x + MAP.w / 2, 49, 1], k.lineSvg(xt.major, { tone: "mid" }));
emit(L_BASE, [XRULER.x + 1, 49, 0.6], k.dotsSvg([at([XRULER.x + 1, XRULER.y + 3.5, 0.6])], { size: 0.45 }));

// Y ruler along the left edge of the map (vertical coordinate axis)
const YRULER = { x: -8, y: MAP.y + 4, w: 7, d: MAP.d - 8, r: 1 };
emit(L_BASE, [-4.5, MAP.y + MAP.d / 2, 0.4], slab(YRULER, 0, 0.6, { tone: "lo", crease: "none" }));
const yt = k.topTicks(YRULER.y + 6, YRULER.y + YRULER.d - 6, 8, 5, YRULER.x + 0.9, 0.6, [1.6, 3.4], P, "y");
emit(L_BASE, [-4.5, MAP.y + MAP.d / 2, 1], k.lineSvg(yt.minor, { tone: "lo" }));
emit(L_BASE, [-4.5, MAP.y + MAP.d / 2, 1], k.lineSvg(yt.major, { tone: "mid" }));
emit(L_BASE, [-4.5, YRULER.y + 1, 0.6], k.dotsSvg([at([YRULER.x + 3.5, YRULER.y + 1, 0.6])], { size: 0.45 }));

// Label plate, engraved — sits in the open front-left of the plate
const LABEL = { x: -170, y: 58, w: 64, d: 20, r: 3 };
emit(L_BASE, [-138, 68, 0], slab(LABEL, 0, 0.8, { tone: "mid" }));
emit(L_BASE, [-138, 68, 0.8], k.lineSvg(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P), { tone: "faint" }));
const lc = LABEL.x + LABEL.w / 2;
for (const [dx, len] of [[-14, 16], [0, 22], [12, 10]]) {
  emit(L_BASE, [lc + dx, 68, 0.8], k.lineSvg(k.lineOnTop([lc + dx - len / 2, 68], [lc + dx + len / 2, 68], 0.8, P), { tone: "lo", free: true }));
}

// ===========================================================================
// MAP: the plotting sheet = the vector space (grid + origin)
// ===========================================================================
emit(L_MAP, [MAP.x + MAP.w / 2, MAP.y + MAP.d / 2, MAPZ - 1], slab(MAP, 0, 1.2, { tone: "hi", crease: "lo" }));
emit(L_MAP, [MAP.x + MAP.w / 2, MAP.y + MAP.d / 2, MAPZ], k.lineSvg(k.planOutline(k.insetPlan(MAP, 1), MAPZ, P), { tone: "faint" }));
// coordinate grid, edge to edge — this is the "map of coordinates"
for (let gx = 20; gx < MAP.x + MAP.w; gx += 20) {
  emit(L_MAP, [gx, MAP.y + MAP.d / 2, MAPZ], k.lineSvg(k.lineOnTop([gx, MAP.y + 1.5], [gx, MAP.y + MAP.d - 1.5], MAPZ, P), { tone: "lo" }));
}
for (let gy = -60; gy < MAP.y + MAP.d; gy += 20) {
  emit(L_MAP, [MAP.x + MAP.w / 2, gy, MAPZ], k.lineSvg(k.lineOnTop([MAP.x + 1.5, gy], [MAP.x + MAP.w - 1.5, gy], MAPZ, P), { tone: "lo" }));
}
// origin marker
emit(L_MAP, [MAP.x + 6, MAP.y + 6, MAPZ], k.dotsSvg([at([MAP.x + 6, MAP.y + 6, MAPZ + 0.2])], { size: 0.7 }));

// ===========================================================================
// CUTTER: sheet → strips (text splitting). Blade stands in front of its guard
// housing so the rotary disc is fully visible.
// ===========================================================================
const BED = { x: -176, y: -70, w: 156, d: 58, r: 3 };   // x -176..-20
emit(L_BED, [-98, -41, 2], slab(BED, 0, 5, { tone: "mid" }));
emit(L_BED, [-98, -41, 5], k.lineSvg(k.planOutline(k.insetPlan(BED, 1.5), 5, P), { tone: "faint" }));
// feed tray lip on the left
emit(L_CUT, [-178, -41, 4], slab({ x: -184, y: -70, w: 8, d: 58, r: 1 }, 0, 8, { tone: "lo" }));
// guard housing sits BEHIND the blade (blade faces front, fully visible)
const HOOD = { x: -112, y: -66, w: 32, d: 24, r: 3 };
emit(L_CUT, [-96, -54, 17], slab(HOOD, 0, 34, { tone: "mid" }));
emit(L_CUT, [-96, -54, 34], k.lineSvg(k.planOutline(k.insetPlan(HOOD, 2), 34, P), { tone: "lo" }));
// knurled knob on the guard
emit(L_CUT, [-96, -54, 35], cyl(-96, -54, 5, 34, 5, { tone: "hi" }, 20));
emit(L_CUT, [-96, -54, 39], k.lineSvg(k.radialTicks(-96, -54, 5, 16, 4, 39, [0, 1.4], P), { tone: "lo" }));
// rotary blade: vertical disc (axis along y), hub on the axis
const blade = (() => {
  const F = G.frameAlong([-96, -41, 15], [0, 1, 0]);
  const disc = k.solidSvg(G.disc(-2, 2, 15, F, P, { steps: 44 }), { tone: "hi" });
  const hub = k.solidSvg(G.disc(-5, 5, 4, F, P, { steps: 24 }), { tone: "mid" });
  return hub + disc;
})();
emit(L_CUT, [-96, -41, 15], blade);

// the source sheet being fed (slides right into the blade in the split phase)
const SHEET = { x: -172, y: -62, w: 52, d: 44, r: 1 };
emit(L_CUT, [-146, -40, 6], wrap('data-part="sheet"', slab(SHEET, 5, 0.8, { tone: "hi", crease: "lo" })));
emit(L_CUT, [-146, -40, 5.8], wrap('data-part="sheet"', k.lineSvg(k.planOutline(k.insetPlan(SHEET, 2), 5.8, P), { tone: "lo" })));
for (let i = 0; i < 4; i++) {
  const yy = -56 + i * 9;
  emit(L_CUT, [-146, yy, 5.8], wrap('data-part="sheet"', k.lineSvg(k.lineOnTop([-166, yy], [-130, yy], 5.8, P), { tone: "lo", free: true })));
}
// 4 strips cut out to the right of the blade (one per note; consumed as pins form)
for (let i = 0; i < 4; i++) {
  const sx = -80 + i * 8;
  emit(L_CUT, [sx + 3.5, -40, 6], wrap(`data-strip="${i}" style="display:none"`, slab({ x: sx, y: -62, w: 7, d: 44, r: 1 }, 5, 0.8, { tone: "hi", crease: "lo" })));
  emit(L_CUT, [sx + 3.5, -40, 6], wrap(`data-strip="${i}" style="display:none"`, k.dotsSvg([[sx + 3, -50], [sx + 3, -42], [sx + 3, -34]].map((p) => at([p[0], p[1], 6])), { size: 0.5 })));
}

// ===========================================================================
// STAMP (arbor press): column + top arm + guide rod + sliding ram that meets
// the anvil. The ram presses down once per note (vector embedding).
// ===========================================================================
const STX = -40, STY = -41;
// anvil / die the ram presses onto
emit(L_STAMP, [STX, STY, 3], slab({ x: STX - 8, y: STY - 8, w: 16, d: 16, r: 2 }, 0, 6, { tone: "mid" }));
emit(L_STAMP, [STX, STY, 6], k.lineSvg(k.planOutline(k.insetPlan({ x: STX - 8, y: STY - 8, w: 16, d: 16, r: 2 }, 1.4), 6, P), { tone: "lo" }));
// column behind + top arm reaching over the anvil
emit(L_STAMP, [STX, STY - 20, 39], cyl(STX, STY - 20, 3.5, 0, 78, { tone: "mid" }));
emit(L_STAMP, [STX, STY - 8, 76], slab({ x: STX - 9, y: STY - 24, w: 18, d: 36, r: 2 }, 74, 4, { tone: "mid" }));
// fixed guide rod the ram slides on
emit(L_STAMP, [STX, STY, 46], cyl(STX, STY, 1.8, 19, 74, { tone: "hi" }, 14));
// return spring around the rod, above the ram's travel
{
  const sp = vcoil(STX, STY, 40, 71, 4, 4);
  emit(L_STAMP, [STX, STY, 55], k.lineSvg(sp.back, { tone: "lo" }));
  emit(L_STAMP, [STX, STY, 55], k.lineSvg(sp.front, { tone: "mid" }));
}
// the sliding ram: foot + head block, presses down (data-part="stamp")
emit(L_STAMP, [STX, STY, 31], wrap('data-part="stamp"', slab({ x: STX - 7, y: STY - 7, w: 14, d: 14, r: 2 }, 27, 8, { tone: "hi" })));
emit(L_STAMP, [STX, STY, 24], wrap('data-part="stamp"', k.solidSvg(k.slabOf({ x: STX - 5, y: STY - 5, w: 10, d: 10, r: 1 }, 22, 5, P, 4, 0.5), { tone: "hi" })));

// ===========================================================================
// DOCUMENT PINS: planted on the map at their coordinates (hidden until planted)
// ===========================================================================
function pinHtml(p, tone) {
  const out = [];
  out.push(k.solidSvg(k.cylinder(p[0], p[1], 0.9, MAPZ, HEADZ - 2, P, 12), { tone: "mid" }));
  out.push(k.solidSvg(G.sphereOf([p[0], p[1], HEADZ], 3, P, { steps: 30 }), { tone, lit: tone === "lit" }));
  return out.join("");
}
NOTES.forEach((n, i) => {
  emit(L_PIN, [n.p[0], n.p[1], HEADZ], wrap(`data-pin="${i}" style="display:none"`, pinHtml(n.p, "hi")));
  // little base ring on the sheet where it stands
  emit(L_MAP, [n.p[0], n.p[1], MAPZ], wrap(`data-pinring="${i}" style="display:none"`, k.lineSvg(k.ring(n.p[0], n.p[1], 3.4, MAPZ + 0.1, P, 20), { tone: "faint" })));
});

// ===========================================================================
// SEARCH LAYER placeholder: query pin + dividers + radius are rebuilt live
// ===========================================================================

// ===========================================================================
// CLIPBOARD: the retrieved context (nearest k)
// ===========================================================================
const BOARD = { x: 150, y: 52, w: 108, d: 42, r: 3 };
emit(L_CARD, [204, 73, 1.4], slab(BOARD, 0, 2.4, { tone: "mid" }));
emit(L_CARD, [204, 73, 2.4], k.lineSvg(k.planOutline(k.insetPlan(BOARD, 2), 2.4, P), { tone: "faint" }));
// clip at the top edge
emit(L_CARD, [204, 54, 5], slab({ x: 194, y: 50, w: 20, d: 6, r: 1 }, 2.4, 6, { tone: "hi" }));
emit(L_CARD, [204, 51, 4], slab({ x: 190, y: 47, w: 28, d: 4, r: 1 }, 2.4, 3, { tone: "lo" }));
// context cards (the nearest k notes) — higher layer so they sit ON the board
const CARDS = [162, 184, 206];
CARDS.forEach((cx, i) => {
  emit(L_CARDS, [cx, 76, 6], wrap(`data-card="${i}" style="display:none"`, slab({ x: cx, y: 64, w: 20, d: 26, r: 1 }, 2.6, 6, { tone: "hi", lit: true })));
  emit(L_CARDS, [cx, 76, 8.6], wrap(`data-card="${i}" style="display:none"`, k.lineSvg(k.lineOnTop([cx + 3, 70], [cx + 17, 70], 8.6, P), { tone: "lo", free: true })));
  emit(L_CARDS, [cx, 76, 8.6], wrap(`data-card="${i}" style="display:none"`, k.lineSvg(k.lineOnTop([cx + 3, 76], [cx + 14, 76], 8.6, P), { tone: "lo", free: true })));
});

// ===========================================================================
// Assemble
// ===========================================================================
items.sort((a, b) => a.layer - b.layer || a.depth - b.depth);
// the search layer (query pin, dividers, radius) is rebuilt every frame by live.mjs
const body = items.map((i) => i.svg).join("") + `<g data-search></g>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A plotting-table anatomy of RAG. A document sheet is cut into strips (text splitting); each strip is stamped and becomes a pin planted at an (x,y) coordinate on the map — the vector embedding. A query drops a lit pin at its own coordinate, and a pair of dividers pivots on it and swings to the nearest document pins, measuring the distance between them (semantic search). The nearest three pins are clipped to the clipboard — that is the context handed to the model (context generation).",
  body: [body],
});

const liveSource = readFileSync(join(HERE, "live.mjs"), "utf8");
const live = liveSource
  .replace(/__P__/g, JSON.stringify(P))
  .replace(/__NOTES__/g, JSON.stringify(NOTES))
  .replace(/__QUERIES__/g, JSON.stringify(QUERIES))
  .replace(/__MAP__/g, JSON.stringify(MAP))
  .replace(/__TOPK__/g, JSON.stringify(TOPK))
  .replace(/__GEOM__/g, JSON.stringify({ MAPZ, HEADZ, PIVOTZ }));

const bodyHtml = k.plateHtml({
  fig: "Fig 1",
  title: "How RAG works",
  readout: "split · embed · search · context",
  keys: [
    { mark: "hi", label: "Pin: a document at its vector coordinate" },
    { mark: "lit", label: "Query pin · collected context card" },
    { mark: "dotted", label: "Search radius = semantic distance" },
  ],
  caption:
    "Four notes are plotted by meaning: gravity (36,−6), apple (152,16), earth (96,30), moon (200,−24). Query “apple” lands at (140,8); the dividers measure apple 14.4, earth 49.2, moon 68.0, gravity 104.9. The three nearest are clipped as the context for the model.",
  body: `<style>${CTL_CSS}</style><div class="iso-stage" tabindex="0" role="region" aria-label="RAG anatomy: a plotting table where documents become pins on a coordinate map, dividers measure semantic distance, and the nearest notes are clipped as context">${svg}</div>`,
});

writeFileSync(
  join(HERE, theme === "light" ? "rag-light.html" : "rag.html"),
  k.pageHtml({ title: "How RAG works", theme, body: bodyHtml + CTL_HTML, script: kitScript() + live })
);
console.log("wrote", theme === "light" ? "rag-light.html" : "rag.html");
