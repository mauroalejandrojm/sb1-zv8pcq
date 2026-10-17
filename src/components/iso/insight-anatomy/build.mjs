import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.agents/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.agents/skills/anatomy/kit/lathe.mjs";
import { kitScript } from "../.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 880;
const HEIGHT = 560;

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
.iso-ctl-q{color:var(--anatomy-strong);min-width:8ch;text-align:center}
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
  <button type="button" class="iso-ctl-btn" data-btn="qprev" aria-label="Previous question" title="Previous question">‹</button>
  <span class="iso-ctl-q" data-qname>revenue</span>
  <button type="button" class="iso-ctl-btn" data-btn="qnext" aria-label="Next question" title="Next question">›</button>
  <span class="iso-ctl-step" data-step>auto play</span>
</div>`;

// ---------------------------------------------------------------------------
// THE OBJECT: an insight console. A business question becomes a live chart.
// Reads left→right, back→front→back:
//   data drums (the warehouse) → hopper → a lane of raw rows → a bank of
//   re-cut controls (filter knob, dimension drum, date-range slider) → a
//   vertical chart board where a gantry pen-plotter draws the line, plants a
//   red flag on the anomaly, and extends the line into a forecast whose
//   uncertainty band widens.
// ---------------------------------------------------------------------------

const PLATE = { x: -184, y: -104, w: 452, d: 200, r: 10 }; // x -184..268, y -104..96

// Chart board (vertical, x–z plane at the back-right).
const BOARD = { X0: 96, X1: 250, Z0: 8, Z1: 74, BY: -34, T: 5 };
const FRONT_Y = BOARD.BY + BOARD.T;         // front face of the board (−29)
const PLOT_Y = FRONT_Y - 0.6;               // plane the chart + pen sit in
const RAIL_Y = FRONT_Y + 7;                 // gantry rail, in front of the board
const RAIL_Z = BOARD.Z1 + 6;                // rail height (above the plot)
const MONTHS = 9;
const mx = (i) => BOARD.X0 + 16 + i * ((BOARD.X1 - BOARD.X0 - 32) / (MONTHS - 1));
const vz = (f) => BOARD.Z0 + f * (BOARD.Z1 - BOARD.Z0); // fraction 0..1 → height

// Worked example. Three business questions, each with a real little model:
// a six-point history, one anomaly, and a three-point forecast with a band.
const DATA = [
  {
    label: "revenue", unit: "k$", max: 100,
    q: "why did revenue spike in Q2?",
    series: [42, 48, 45, 92, 51, 55],
    anomaly: 3, why: "promo launched Apr 4 · +87% over baseline",
    fc: [58, 62, 66], band: [6, 9, 13],
  },
  {
    label: "churn", unit: "%", max: 5,
    q: "what drove the March churn jump?",
    series: [2.1, 2.3, 4.4, 2.2, 2.3, 2.4],
    anomaly: 2, why: "billing outage Mar 12 · +2.4pt in a day",
    fc: [2.3, 2.4, 2.5], band: [0.3, 0.45, 0.62],
  },
  {
    label: "sessions", unit: "k", max: 130,
    q: "why did May sessions surge?",
    series: [61, 58, 64, 70, 118, 74],
    anomaly: 4, why: "paid campaign May 9 · +142% new users",
    fc: [78, 83, 88], band: [8, 12, 17],
  },
];
const MONTH_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -17, 0),
    ...k.boxCorners({ x: BOARD.X0 - 8, y: BOARD.BY - 4, w: BOARD.X1 - BOARD.X0 + 16, d: BOARD.T + 8 }, 0, RAIL_Z + 4),
    [RAIL_Y, BOARD.X0 - 8, RAIL_Z + 3], [RAIL_Y, BOARD.X1 + 8, RAIL_Z + 3], // rail ends
    [-168, -70, 30], [-168, -40, 30], [-110, -54, 46],                      // drums + hopper top
    [0, 58, 20], [90, 58, 20],                                              // control bank
    [-150, 60, 22],                                                         // question card top
    ...DATA.flatMap((d) => d.series.map((_, i) => [mx(i), PLOT_Y, vz(d.series[i] / d.max) + 3])),
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 44 }
);

const at = (p) => k.iso(p, P);
const plane = k.sideMatrix([0, PLOT_Y], 0, P, "left"); // 2D→screen for board content
const pl = (wx, wz) => [wx, -wz];                       // world (x,z) → plane local
const planePath = (pts, close) => k.pathOf(pts.map(([wx, wz]) => pl(wx, wz)), close);

// layers keep painter order sane; ties broken by true depth
const L_BASE = 0, L_STORE = 1, L_QUESTION = 2, L_LANE = 3, L_BANK = 4, L_BOARD = 5, L_GANTRY = 6;
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
const wrap = (attr, svg) => `<g ${attr}>${svg}</g>`;

// ===========================================================================
// BASE: bench plate on feet + a label plate
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
// engraved label plate, front-left open area
const LABEL = { x: -176, y: 66, w: 60, d: 20, r: 3 };
emit(L_BASE, [-146, 76, 0], slab(LABEL, 0, 0.8, { tone: "mid" }));
emit(L_BASE, [-146, 76, 0.8], k.lineSvg(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P), { tone: "faint" }));
for (const [dx, len] of [[-13, 15], [1, 22], [13, 9]]) {
  emit(L_BASE, [-146 + dx, 76, 0.8], k.lineSvg(k.lineOnTop([-146 + dx - len / 2, 76], [-146 + dx + len / 2, 76], 0.8, P), { tone: "lo", free: true }));
}

// ===========================================================================
// DATA STORE: two warehouse drums feeding a hopper (the raw rows)
// ===========================================================================
const DRUM = [{ x: -170, y: -84, r: 15 }, { x: -170, y: -46, r: 15 }];
DRUM.forEach((d, i) => {
  emit(L_STORE, [d.x, d.y, 12], cyl(d.x, d.y, d.r, 0, 24, { tone: "mid" }));
  emit(L_STORE, [d.x, d.y, 24], k.solidSvg(k.cylinder(d.x, d.y, d.r + 1.4, 23, 2.2, P, 30), { tone: "lo" })); // rim
  emit(L_STORE, [d.x, d.y, 24], cyl(d.x, d.y, d.r - 3, 24, 1.4, { tone: "lo" }, 24));                         // lid
  emit(L_STORE, [d.x, d.y, 12], k.lineSvg(k.ring(d.x, d.y, d.r + 0.2, 12, P, 34), { tone: "lo" }));           // band
  emit(L_STORE, [d.x, d.y, 3], k.solidSvg(k.cylinder(d.x, d.y, d.r + 0.8, 0, 2.4, P, 30), { tone: "lo" }));    // base collar
  // little drain port facing the hopper
  emit(L_STORE, [d.x + d.r - 1, d.y + 6, 6], k.solidSvg(k.cylinder(d.x + d.r - 1, d.y + 6, 2.4, 4, 3.4, P, 16), { tone: "hi" }));
});
// manifold pipe from the drums to the hopper (a straight run + elbow)
emit(L_STORE, [-138, -65, 6], k.solidSvg(k.cylinder(-138, -65, 2.4, 4.4, 3.2, P, 18), { tone: "hi" }));
emit(L_STORE, [-124, -60, 22], k.lineSvg(k.segment([-155, -66, 6], [-124, -60, 22], P), { tone: "hi" }));
emit(L_STORE, [-155, -66, 6], k.dotsSvg([at([-155, -66, 6])], { size: 1.0, tone: "hi" }));

// hopper: a tapered funnel on a post above the data lane
const HOP = { x: -104, y: -52 };
emit(L_STORE, [HOP.x, HOP.y, 20], cyl(HOP.x, HOP.y, 2.2, 0, 40, { tone: "mid" }, 16));         // post
emit(L_STORE, [HOP.x, HOP.y, 41], slab({ x: HOP.x - 12, y: HOP.y - 12, w: 24, d: 24, r: 2 }, 40, 3, { tone: "lo" })); // mouth rim
emit(L_STORE, [HOP.x, HOP.y, 38], k.solidSvg(k.slabOf({ x: HOP.x - 10, y: HOP.y - 10, w: 20, d: 20, r: 2 }, 34, 6, P, 4, 0.5), { tone: "mid" })); // funnel
emit(L_STORE, [HOP.x, HOP.y, 33], cyl(HOP.x, HOP.y, 4, 30, 5, { tone: "hi" }, 20));            // throat

// ===========================================================================
// QUESTION: a card feeds down into a slot (the business question)
// ===========================================================================
const SLOT = { x: -172, y: 30, w: 58, d: 20, r: 2 };
emit(L_QUESTION, [-143, 40, 0], slab(SLOT, -1.4, 1.4, { tone: "lo", crease: "none" })); // recessed groove
emit(L_QUESTION, [-143, 40, 0], k.lineSvg(k.planOutline(k.insetPlan(SLOT, 2), 0.1, P), { tone: "faint" }));
// the question card (slides down into the slot during the question beat)
const CARD = { x: -168, y: 33, w: 50, d: 1.6, r: 1 };
{
  const card = [];
  card.push(slab(CARD, 0, 22, { tone: "hi", crease: "lo" }));
  for (const [zz, len] of [[16, 34], [11, 40], [6, 26]]) {
    card.push(k.lineSvg(k.lineOnTop([CARD.x + 5, CARD.y + CARD.d], [CARD.x + 5 + len, CARD.y + CARD.d], zz, P), { tone: "lo", free: true }));
  }
  emit(L_QUESTION, [-143, 34, 11], wrap('data-part="qcard"', card.join("")));
}

// ===========================================================================
// LANE: a row of raw rows (tiles) that slide in, then get filtered
// ===========================================================================
const TILE_N = 6;
const LANE = { x: -96, y: 30, w: 96, d: 22, r: 2 };
emit(L_LANE, [-48, 41, 0], slab(LANE, 0, 1.2, { tone: "lo", crease: "none" }));
emit(L_LANE, [-48, 41, 1.2], k.lineSvg(k.planOutline(k.insetPlan(LANE, 2), 1.2, P), { tone: "faint" }));
const tileX = (i) => LANE.x + 8 + i * ((LANE.w - 16) / (TILE_N - 1));
for (let i = 0; i < TILE_N; i++) {
  emit(L_LANE, [tileX(i), 41, 4], wrap(`data-tile="${i}" style="display:none"`, slab({ x: tileX(i) - 5, y: 36, w: 10, d: 10, r: 1 }, 1.2, 4, { tone: "hi" })));
  emit(L_LANE, [tileX(i), 41, 5.2], wrap(`data-tile="${i}" style="display:none"`, k.dotsSvg([at([tileX(i), 41, 5.4])], { size: 0.5 })));
}

// ===========================================================================
// RE-CUT BANK: three controls that re-slice the rows → the chart
// ===========================================================================
// 1. FILTER: a housing with a knurled knob and a sliding gate
const FIL = { x: 2, y: 42 };
emit(L_BANK, [FIL.x, FIL.y, 5], slab({ x: FIL.x - 12, y: FIL.y - 12, w: 24, d: 24, r: 2 }, 0, 10, { tone: "mid" }));
emit(L_BANK, [FIL.x, FIL.y, 10], k.lineSvg(k.planOutline(k.insetPlan({ x: FIL.x - 12, y: FIL.y - 12, w: 24, d: 24, r: 2 }, 1.6), 10, P), { tone: "lo" }));
emit(L_BANK, [FIL.x, FIL.y, 11], wrap('data-part="filgate"', slab({ x: FIL.x - 8, y: FIL.y - 3, w: 16, d: 6, r: 1 }, 10, 2.4, { tone: "hi" }))); // gate slider
emit(L_BANK, [FIL.x, FIL.y, 13], cyl(FIL.x, FIL.y, 5.4, 12, 5, { tone: "hi" }, 22));             // knob
emit(L_BANK, [FIL.x, FIL.y, 17], k.lineSvg(k.radialTicks(FIL.x, FIL.y, 5.4, 18, 4, 17, [0, 1.4], P), { tone: "lo" }));
// 2. DIMENSION: a drum with a pointer that rotates to pick the grouping
const DIM = { x: 34, y: 42 };
emit(L_BANK, [DIM.x, DIM.y, 4], slab({ x: DIM.x - 12, y: DIM.y - 12, w: 24, d: 24, r: 2 }, 0, 8, { tone: "mid" }));
emit(L_BANK, [DIM.x, DIM.y, 14], cyl(DIM.x, DIM.y, 8, 8, 10, { tone: "hi" }, 26));
emit(L_BANK, [DIM.x, DIM.y, 18], k.lineSvg(k.radialTicks(DIM.x, DIM.y, 8, 12, 3, 18, [0, 1.6], P), { tone: "lo" }));
emit(L_BANK, [DIM.x, DIM.y, 18], k.lineSvg(k.ring(DIM.x, DIM.y, 8, 18.1, P, 24), { tone: "lo" })); // index ring (pointer is live)
// 3. DATE RANGE: a month ruler with a sliding window frame
const DATE = { x: 70, y: 42, w: 40 };
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 3], slab({ x: DATE.x - 12, y: DATE.y - 12, w: DATE.w + 24, d: 24, r: 2 }, 0, 6, { tone: "mid" }));
const ruler = { x: DATE.x - 8, y: DATE.y - 4, w: DATE.w + 16, d: 8, r: 1 };
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 6], slab(ruler, 6, 0.6, { tone: "lo", crease: "none" }));
const rt = k.topTicks(ruler.x + 4, ruler.x + ruler.w - 4, 7, 4, ruler.y + 1, 6.6, [1.4, 3.0], P);
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 7], k.lineSvg(rt.minor, { tone: "lo" }));
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 7], k.lineSvg(rt.major, { tone: "mid" }));
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 9], wrap('data-part="datewin"', slab({ x: DATE.x - 6, y: DATE.y - 7, w: 22, d: 14, r: 1.5 }, 7, 3, { tone: "lit", lit: true }))); // window slider
emit(L_BANK, [DATE.x + DATE.w / 2, DATE.y, 12], wrap('data-part="datewin"', cyl(DATE.x + 5, DATE.y, 3, 10, 3, { tone: "hi" }, 18))); // thumb

// ===========================================================================
// BOARD: a raised vertical panel + a static grid (the chart's frame)
// ===========================================================================
{
  const F = G.frameAlong([0, BOARD.BY, 0], [0, 1, 0]);
  const poly = k.roundedPlan({ x: -BOARD.X1, y: BOARD.Z0, w: BOARD.X1 - BOARD.X0, d: BOARD.Z1 - BOARD.Z0, r: 3 }, 6);
  emit(L_BOARD, [(BOARD.X0 + BOARD.X1) / 2, BOARD.BY, (BOARD.Z0 + BOARD.Z1) / 2], k.solidSvg(G.prismOf(F, poly, -BOARD.T / 2, BOARD.T / 2, P), { tone: "mid" }));
  // feet / bracket holding the board up
  for (const bx of [BOARD.X0 + 10, BOARD.X1 - 10]) {
    emit(L_BOARD, [bx, BOARD.BY, 4], slab({ x: bx - 8, y: BOARD.BY - 6, w: 16, d: 12, r: 2 }, 0, 8, { tone: "lo" }));
  }
  // static grid, drawn in the board plane
  const g = [];
  for (let i = 0; i < MONTHS; i++) g.push(k.pathOf([pl(mx(i), BOARD.Z0), pl(mx(i), BOARD.Z1 - 2)]));
  for (let f = 0.2; f <= 1.001; f += 0.2) g.push(k.pathOf([pl(BOARD.X0 + 4, vz(f)), pl(BOARD.X1 - 4, vz(f))]));
  emit(L_BOARD, [(BOARD.X0 + BOARD.X1) / 2, PLOT_Y, (BOARD.Z0 + BOARD.Z1) / 2],
    `<g transform="${plane}"><path class="iso-line" data-tone="lo" d="${g.join("")}"/><path class="iso-line" data-tone="mid" d="${k.pathOf([pl(BOARD.X0 + 4, BOARD.Z0), pl(BOARD.X1 - 4, BOARD.Z0)])}"/></g>`);
}

// ===========================================================================
// GANTRY: two posts + a top rail the pen carriage rides on (static parts)
// ===========================================================================
for (const gx of [BOARD.X0 - 6, BOARD.X1 + 6]) {
  emit(L_GANTRY, [gx, RAIL_Y, RAIL_Z / 2], cyl(gx, RAIL_Y, 2.6, 2, RAIL_Z - 2, { tone: "mid" }, 16)); // posts
  emit(L_GANTRY, [gx, RAIL_Y, 2], slab({ x: gx - 5, y: RAIL_Y - 5, w: 10, d: 10, r: 2 }, 0, 4, { tone: "lo" })); // feet
}
emit(L_GANTRY, [(BOARD.X0 + BOARD.X1) / 2, RAIL_Y, RAIL_Z], slab({ x: BOARD.X0 - 8, y: RAIL_Y - 2.2, w: BOARD.X1 - BOARD.X0 + 16, d: 4.4, r: 1.6 }, RAIL_Z - 1.6, 3.2, { tone: "hi" })); // rail bar the carriage rides on

// ===========================================================================
// Assemble: static items sorted, then the two live layers on top
// ===========================================================================
items.sort((a, b) => a.layer - b.layer || a.depth - b.depth);
const body = items.map((i) => i.svg).join("") + `<g data-dim></g><g data-chart></g><g data-gantry></g>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An insight-engine console: a question card feeds a slot, warehouse drums supply a hopper, a lane of raw rows passes a filter knob, a dimension drum and a date-range slider that re-cut the data, and a gantry pen-plotter draws the live line on a chart board, plants a red flag on the anomaly and extends the line into a forecast whose shaded uncertainty band widens.",
  body: [body],
});

const liveSource = readFileSync(join(HERE, "live.mjs"), "utf8");
const live = liveSource
  .replace(/__P__/g, JSON.stringify(P))
  .replace(/__DATA__/g, JSON.stringify(DATA))
  .replace(/__GEOM__/g, JSON.stringify({ mx: Array.from({ length: MONTHS }, (_, i) => mx(i)), BOARD, PLOT_Y, RAIL_Y, RAIL_Z, MONTH_LABEL, dim: { x: DIM.x, y: DIM.y, r: 6.5, z: 18.4 } }));

const chartCss = `
.ig-red{stroke:var(--anatomy-red);fill:none}
.ig-reddot{fill:var(--anatomy-red)}
.ig-band{fill:var(--anatomy-hi);opacity:.16}
.ig-bandedge{stroke:var(--anatomy-hi);opacity:.5;fill:none}
.ig-live{stroke:var(--anatomy-lit);fill:none}
.ig-lit{fill:var(--anatomy-lit)}
.ig-flag{stroke:var(--anatomy-red);fill:none}
.ig-flagfill{fill:var(--anatomy-red)}
.iso-stage svg{overflow:visible}
`;

const bodyHtml = k.plateHtml({
  fig: "Fig 1",
  title: "How an insight engine works",
  readout: "question · ingest · re-cut · chart · anomaly · forecast",
  keys: [
    { mark: "hi", label: "Row · knob · slider: the data you re-cut" },
    { mark: "lit", label: "Live line drawn by the pen-plotter" },
    { mark: "dotted", label: "Red flag = anomaly · band = forecast uncertainty" },
  ],
  caption:
    "A question (“why did revenue spike in Q2?”) pulls six months of rows, filtered to channel=web and grouped by month over Jan–Jun. The line plots revenue 42→55 k$; April’s 92 k$ is flagged (promo Apr 4 · +87% over baseline). The forecast extends Jul–Sep to 66 k$ with a widening ±13 k$ uncertainty band.",
  body: `<style>${CTL_CSS}${chartCss}</style><div class="iso-stage" tabindex="0" role="region" aria-label="Insight-engine anatomy: a console where a business question becomes a live chart, re-cut by filters, dimensions and date ranges, with an anomaly flagged and a forecast drawn with its uncertainty band">${svg}</div>`,
});

writeFileSync(
  join(HERE, theme === "light" ? "insight-light.html" : "insight.html"),
  k.pageHtml({ title: "How an insight engine works", theme, body: bodyHtml + CTL_HTML, script: kitScript() + live })
);

console.log("wrote", theme === "light" ? "insight-light.html" : "insight.html");
