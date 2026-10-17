import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.agents/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.agents/skills/anatomy/kit/lathe.mjs";
import { kitScript } from "../.agents/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";
const WIDTH = 940;
const HEIGHT = 560;

// ---------------------------------------------------------------------------
// Playback controls (below the figure).
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
  <button type="button" class="iso-ctl-btn" data-btn="reset" aria-label="Restart" title="Restart">↺</button>
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
// THE OBJECT: an unstructured-data intelligence bench.
// Reads left→right. Capture (front): a whiteboard holds anything you write /
// type / draw → a scan head transcribes the marks into tokens → a validator
// gate stamps them → a matcher compares them against saved records.
// Intelligence (back/right): an extractor pulls fields from many document
// types → an entity resolver dedups them, maps them to a schema and runs
// business rules → a human review desk settles conflicts, keeping provenance
// on every record.
// ---------------------------------------------------------------------------

const PLATE = { x: -204, y: -110, w: 512, d: 212, r: 12 }; // x -204..308, y -110..102

// --- Whiteboard (vertical board, back-left) --------------------------------
const WHITE = { X0: -190, X1: -74, Z0: 12, Z1: 82, BY: -66, T: 4 };
const W_FRONT = WHITE.BY + WHITE.T;
const W_PLANE = W_FRONT - 0.6;

// --- Capture lane (front-left): tokens → validator → compare store ---------
const TOK_N = 5;
const LANE = { x: -182, y: 26, w: 150, d: 26, r: 3 };
const tokX = (i) => LANE.x + 12 + i * ((LANE.w - 40) / (TOK_N - 1));
const tokY = LANE.y + 13;
const VALID = { x: -12, y: 39 };
const STORE = { x: 20, y: -78, w: 60, d: 50, r: 3 };
const recY = (i) => STORE.y + 12 + i * 12;

// --- Extraction (back-right): a rack of source documents → field tokens ----
const EXTRA = {
  rack: { x: 100, y: -78, w: 104, d: 36, r: 3 },
  docX: [112, 132, 152, 172, 190], docY: -60,
  chipX: [122, 150, 178], chipY: -22,
};

// --- Entity resolution + schema (front-right): dedup → record card → rules --
const RESOLVE = {
  card: { x: 120, y: 22, w: 84, d: 40, r: 2 },
  fieldY: (r) => 30 + r * 9,                    // three schema field rows
  dupX: [108, 108], dupY: [30, 44],             // two duplicate chips that merge
};

// --- Human review + provenance (far-right) ---------------------------------
const REVIEW = {
  card: { x: 230, y: -14, w: 64, d: 44, r: 2 },
  fieldY: (r) => -6 + r * 8,
  magX: 250, magY: 2,                           // magnifier over a field
  originX: 214, originY: -8,                    // provenance origin markers
};

// Worked example. Each question carries source documents, extracted fields,
// a duplicate to resolve, a schema, a conflict and its provenance.
const DATA = [
  {
    label: "revenue",
    q: "reconcile the Q2 revenue figure",
    records: ["FY23 actual", "plan v2", "promo log"], matches: [0, 2],
    sources: ["notes", "PDF", "transcript", "contract", "form"],
    fields: [["amount", "92k$"], ["date", "Apr 4"], ["party", "PromoCo"]],
    entity: "PromoCo · Apr", conflictField: 0,
    conflict: "92k$ (contract) vs 88k$ (form)", resolved: "92k$",
    provenance: ["contract §4", "notes p1", "form 22B"],
  },
  {
    label: "churn",
    q: "explain the March churn spike",
    records: ["billing log", "status page", "plan mix"], matches: [0, 1],
    sources: ["notes", "PDF", "status log", "invoice", "form"],
    fields: [["rate", "4.4%"], ["date", "Mar 12"], ["cause", "outage"]],
    entity: "Billing · Mar", conflictField: 0,
    conflict: "4.4% (status) vs 3.9% (invoice)", resolved: "4.4%",
    provenance: ["status log", "notes p2", "invoice L7"],
  },
  {
    label: "sessions",
    q: "trace the May sessions surge",
    records: ["campaign db", "referrals", "search console"], matches: [0],
    sources: ["notes", "PDF", "transcript", "campaign", "form"],
    fields: [["count", "118k"], ["date", "May 9"], ["source", "paid"]],
    entity: "Campaign · May", conflictField: 0,
    conflict: "118k (campaign) vs 112k (form)", resolved: "118k",
    provenance: ["campaign db", "notes p1", "form 09A"],
  },
];

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -17, 0),
    ...k.boxCorners({ x: WHITE.X0 - 6, y: WHITE.BY - 4, w: WHITE.X1 - WHITE.X0 + 12, d: WHITE.T + 8 }, 0, WHITE.Z1 + 4),
    ...k.boxCorners({ x: EXTRA.rack.x, y: EXTRA.rack.y, w: EXTRA.rack.w, d: EXTRA.rack.d }, 0, 30),
    [EXTRA.chipX[0], EXTRA.chipY, 8], [EXTRA.chipX[2], EXTRA.chipY, 8],
    [RESOLVE.card.x + RESOLVE.card.w / 2, RESOLVE.card.y + RESOLVE.card.d / 2, 8],
    [REVIEW.card.x + REVIEW.card.w / 2, REVIEW.card.y + REVIEW.card.d / 2, 14],
    [REVIEW.magX, REVIEW.magY, 16], [REVIEW.originX, REVIEW.originY, 8],
    [VALID.x, VALID.y, 24], [STORE.x + STORE.w / 2, STORE.y, 26],
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 44 }
);

const at = (p) => k.iso(p, P);
const L_BASE = 0, L_WHITE = 1, L_STORE = 2, L_TOKEN = 3, L_VALID = 4, L_EXTRA = 5, L_RESOLVE = 6, L_REVIEW = 7;
const items = [];
function emit(layer, center, svg) { items.push({ layer, depth: k.depthOf(center, P), svg }); }
function slab(plan, z, h, style, steps = 6, bevel = 0.6) { return k.solidSvg(k.slabOf(plan, z, h, P, steps, bevel), style); }
function cyl(cx, cy, r, z, h, style, steps = 26) { return k.solidSvg(k.cylinder(cx, cy, r, z, h, P, steps), style); }
const wrap = (attr, svg) => `<g ${attr}>${svg}</g>`;
function vboard(B, layer, tone = "mid") {
  const F = G.frameAlong([0, B.BY, 0], [0, 1, 0]);
  const poly = k.roundedPlan({ x: -B.X1, y: B.Z0, w: B.X1 - B.X0, d: B.Z1 - B.Z0, r: 3 }, 6);
  emit(layer, [(B.X0 + B.X1) / 2, B.BY, (B.Z0 + B.Z1) / 2], k.solidSvg(G.prismOf(F, poly, -B.T / 2, B.T / 2, P), { tone }));
  for (const bx of [B.X0 + 10, B.X1 - 10]) emit(layer, [bx, B.BY, 4], slab({ x: bx - 8, y: B.BY - 6, w: 16, d: 12, r: 2 }, 0, 8, { tone: "lo" }));
}

// ===========================================================================
// BASE
// ===========================================================================
emit(L_BASE, [-60, 0, -6], `<path class="iso-halo" d="${k.haloOf(PLATE, -17, 12, P)}"/>`);
for (const [x, y] of k.corners(PLATE, 24)) {
  emit(L_BASE, [x, y, -17], k.solidSvg(k.cylinder(x, y, 7, -17, 1.6, P, 26), { tone: "lo" }));
  emit(L_BASE, [x, y, -16], k.solidSvg(k.cylinder(x, y, 5.4, -15.4, 3.4, P, 26), { tone: "mid" }));
}
emit(L_BASE, [-60, 0, -6], slab(PLATE, -12, 12, { tone: "mid" }));
emit(L_BASE, [-60, 0, 0], k.lineSvg(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
for (const [x, y] of k.corners(PLATE, 11)) {
  emit(L_BASE, [x, y, 0], k.lineSvg(k.ring(x, y, 2.2, 0, P, 16), { tone: "lo" }));
  emit(L_BASE, [x, y, 0], k.dotsSvg([at([x, y, 0])], { size: 0.5 }));
}
const LABEL = { x: -196, y: 66, w: 58, d: 20, r: 3 };
emit(L_BASE, [-167, 76, 0], slab(LABEL, 0, 0.8, { tone: "mid" }));
emit(L_BASE, [-167, 76, 0.8], k.lineSvg(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P), { tone: "faint" }));
for (const [dx, len] of [[-12, 15], [2, 22], [13, 9]]) {
  emit(L_BASE, [-167 + dx, 76, 0.8], k.lineSvg(k.lineOnTop([-167 + dx - len / 2, 76], [-167 + dx + len / 2, 76], 0.8, P), { tone: "lo", free: true }));
}

// ===========================================================================
// WHITEBOARD
// ===========================================================================
vboard(WHITE, L_WHITE, "hi");
emit(L_WHITE, [(WHITE.X0 + WHITE.X1) / 2, W_FRONT + 4, 10], slab({ x: WHITE.X0 + 4, y: W_FRONT + 1, w: WHITE.X1 - WHITE.X0 - 8, d: 7, r: 1.5 }, 9, 2.4, { tone: "mid" }));
emit(L_WHITE, [WHITE.X0 - 5, W_FRONT + 6, (WHITE.Z0 + WHITE.Z1) / 2], cyl(WHITE.X0 - 5, W_FRONT + 6, 1.8, WHITE.Z0, WHITE.Z1 - WHITE.Z0, { tone: "mid" }, 14));
emit(L_WHITE, [WHITE.X1 + 5, W_FRONT + 6, (WHITE.Z0 + WHITE.Z1) / 2], cyl(WHITE.X1 + 5, W_FRONT + 6, 1.8, WHITE.Z0, WHITE.Z1 - WHITE.Z0, { tone: "mid" }, 14));
emit(L_WHITE, [(WHITE.X0 + WHITE.X1) / 2, W_FRONT + 6, WHITE.Z1 + 2], slab({ x: WHITE.X0 - 6, y: W_FRONT + 4, w: WHITE.X1 - WHITE.X0 + 12, d: 5, r: 1.5 }, WHITE.Z1, 3, { tone: "hi" }));

// ===========================================================================
// TOKEN LANE + VALIDATOR + COMPARE STORE
// ===========================================================================
emit(L_TOKEN, [LANE.x + LANE.w / 2 - 30, tokY, 0], slab({ x: LANE.x, y: LANE.y, w: LANE.w - 40, d: LANE.d, r: 3 }, 0, 1.2, { tone: "lo", crease: "none" }));
emit(L_TOKEN, [LANE.x + LANE.w / 2 - 30, tokY, 1.2], k.lineSvg(k.planOutline(k.insetPlan({ x: LANE.x, y: LANE.y, w: LANE.w - 40, d: LANE.d, r: 3 }, 2), 1.2, P), { tone: "faint" }));
for (let i = 0; i < TOK_N; i++) {
  const tx = tokX(i);
  emit(L_TOKEN, [tx, tokY, 4], wrap(`data-tok="${i}" style="display:none"`, slab({ x: tx - 9, y: LANE.y + 6, w: 18, d: 14, r: 1.5 }, 1.2, 4, { tone: "hi" })));
  emit(L_TOKEN, [tx, tokY, 5.2], wrap(`data-tok="${i}" style="display:none"`, k.lineSvg(k.lineOnTop([tx - 6, LANE.y + 11], [tx + 6, LANE.y + 11], 5.4, P), { tone: "lo", free: true })));
  emit(L_TOKEN, [tx, tokY, 5.2], wrap(`data-tok="${i}" style="display:none"`, k.lineSvg(k.lineOnTop([tx - 6, LANE.y + 16], [tx + 3, LANE.y + 16], 5.4, P), { tone: "lo", free: true })));
}
emit(L_VALID, [VALID.x, VALID.y, 7], slab({ x: VALID.x - 11, y: VALID.y - 12, w: 22, d: 24, r: 2 }, 0, 14, { tone: "mid" }));
emit(L_VALID, [VALID.x, VALID.y - 11, 20], slab({ x: VALID.x - 11, y: VALID.y - 13, w: 22, d: 3, r: 1 }, 14, 6, { tone: "lo" }));
emit(L_VALID, [VALID.x, VALID.y, 15], wrap('data-part="vstamp"', slab({ x: VALID.x - 4, y: VALID.y - 4, w: 8, d: 8, r: 1 }, 12, 4, { tone: "hi" })));
emit(L_VALID, [VALID.x, VALID.y, 16], cyl(VALID.x, VALID.y, 3.2, 14, 4, { tone: "hi" }, 18));
// compare store
emit(L_STORE, [STORE.x + STORE.w / 2, STORE.y + STORE.d / 2, 9], slab(STORE, 0, 18, { tone: "mid" }));
emit(L_STORE, [STORE.x + STORE.w / 2, STORE.y + STORE.d / 2, 18], k.lineSvg(k.planOutline(k.insetPlan(STORE, 2), 18, P), { tone: "lo" }));
emit(L_STORE, [STORE.x + STORE.w / 2, STORE.y + STORE.d / 2, 19], slab({ x: STORE.x + 6, y: STORE.y + 6, w: STORE.w - 12, d: STORE.d - 12, r: 2 }, 18, 1.4, { tone: "lo", crease: "none" }));
for (let i = 0; i < 3; i++) {
  const ry = recY(i);
  emit(L_STORE, [STORE.x + 4, ry, 10], slab({ x: STORE.x - 2, y: ry - 5, w: 5, d: 10, r: 1 }, 4, 6, { tone: "lo" }));
  emit(L_STORE, [STORE.x + 1, ry, 7], wrap(`data-rec="${i}"`, cyl(STORE.x - 1, ry, 1.6, 6, 1.6, { tone: "hi" }, 14)));
}

// ===========================================================================
// EXTRACTION: a rack of source documents → field tokens pulled out
// ===========================================================================
emit(L_EXTRA, [EXTRA.rack.x + EXTRA.rack.w / 2, EXTRA.rack.y + EXTRA.rack.d / 2, 3], slab(EXTRA.rack, 0, 6, { tone: "mid" }));
emit(L_EXTRA, [EXTRA.rack.x + EXTRA.rack.w / 2, EXTRA.rack.y + EXTRA.rack.d / 2, 6], k.lineSvg(k.planOutline(k.insetPlan(EXTRA.rack, 2), 6, P), { tone: "lo" }));
// five standing source documents, each with a distinguishing mark
EXTRA.docX.forEach((dx, i) => {
  const doc = [];
  doc.push(slab({ x: dx - 7, y: EXTRA.docY - 1, w: 14, d: 2, r: 0.6 }, 6, 20, { tone: "hi" }));
  for (let r = 0; r < 3; r++) doc.push(k.lineSvg(k.lineOnTop([dx - 4, EXTRA.docY + 1], [dx + 4 - (r === 2 ? 3 : 0), EXTRA.docY + 1], 10 + r * 4, P), { tone: "lo", free: true }));
  if (i === 3) doc.push(k.solidSvg(k.cylinder(dx, EXTRA.docY + 1, 1.6, 22, 1.4, P, 12), { tone: "lo" }));       // contract seal
  if (i === 4) { doc.push(k.lineSvg(k.lineOnTop([dx - 4, EXTRA.docY + 1], [dx - 1, EXTRA.docY + 1], 22, P), { tone: "lo", free: true })); doc.push(k.lineSvg(k.lineOnTop([dx + 1, EXTRA.docY + 1], [dx + 4, EXTRA.docY + 1], 22, P), { tone: "lo", free: true })); } // form boxes
  emit(L_EXTRA, [dx, EXTRA.docY, 16], wrap(`data-doc="${i}"`, doc.join("")));
});
// extractor jaw above the rack (presses down during extraction)
emit(L_EXTRA, [EXTRA.rack.x + EXTRA.rack.w / 2, EXTRA.docY, 30], wrap('data-part="xjaw"', slab({ x: EXTRA.rack.x + 8, y: EXTRA.docY - 6, w: EXTRA.rack.w - 16, d: 12, r: 2 }, 28, 4, { tone: "hi" })));
emit(L_EXTRA, [EXTRA.rack.x + EXTRA.rack.w / 2, EXTRA.docY, 34], cyl(EXTRA.rack.x + EXTRA.rack.w / 2, EXTRA.docY, 3, 32, 4, { tone: "hi" }, 18));
// extracted field tokens appear in front of the rack
EXTRA.chipX.forEach((cx, i) => {
  emit(L_EXTRA, [cx, EXTRA.chipY, 4], wrap(`data-field="${i}" style="display:none"`, slab({ x: cx - 12, y: EXTRA.chipY - 6, w: 24, d: 12, r: 1.5 }, 1, 3, { tone: "hi" })));
  emit(L_EXTRA, [cx, EXTRA.chipY, 5], wrap(`data-field="${i}" style="display:none"`, k.dotsSvg([at([cx - 8, EXTRA.chipY, 5])], { size: 0.5 })));
});

// ===========================================================================
// ENTITY RESOLUTION + SCHEMA: dedup → record card fills → business rules
// ===========================================================================
emit(L_RESOLVE, [RESOLVE.card.x + RESOLVE.card.w / 2, RESOLVE.card.y + RESOLVE.card.d / 2, 1], slab(RESOLVE.card, 0, 2, { tone: "hi" }));
emit(L_RESOLVE, [RESOLVE.card.x + RESOLVE.card.w / 2, RESOLVE.card.y + RESOLVE.card.d / 2, 2], k.lineSvg(k.planOutline(k.insetPlan(RESOLVE.card, 2), 2, P), { tone: "faint" }));
// two duplicate chips that merge into the card (dedup)
RESOLVE.dupY.forEach((dy, i) => {
  emit(L_RESOLVE, [RESOLVE.dupX[i], dy, 4], wrap(`data-dup="${i}"`, slab({ x: RESOLVE.dupX[i] - 7, y: dy - 5, w: 14, d: 10, r: 1.5 }, 1, 4, { tone: "lo" })));
});

// ===========================================================================
// HUMAN REVIEW + PROVENANCE: record under a magnifier, conflict + approve
// ===========================================================================
emit(L_REVIEW, [REVIEW.card.x + REVIEW.card.w / 2, REVIEW.card.y + REVIEW.card.d / 2, 1], slab(REVIEW.card, 0, 2, { tone: "hi" }));
emit(L_REVIEW, [REVIEW.card.x + REVIEW.card.w / 2, REVIEW.card.y + REVIEW.card.d / 2, 2], k.lineSvg(k.planOutline(k.insetPlan(REVIEW.card, 2), 2, P), { tone: "faint" }));
// the resolved record's fields, ready for human review
for (let r = 0; r < 3; r++) {
  emit(L_REVIEW, [REVIEW.card.x + REVIEW.card.w / 2, REVIEW.fieldY[r], 2.4], wrap(`data-rfield="${r}"`, k.lineSvg(k.lineOnTop([REVIEW.card.x + 6, REVIEW.fieldY[r]], [REVIEW.card.x + REVIEW.card.w - 8, REVIEW.fieldY[r]], 2.4, P), { tone: "lo", free: true })));
}
// provenance origin markers (where each field came from)
for (let r = 0; r < 3; r++) emit(L_REVIEW, [REVIEW.originX, REVIEW.originY + r * 6, 3], wrap(`data-origin="${r}"`, cyl(REVIEW.originX, REVIEW.originY + r * 6, 1.6, 2, 1.6, { tone: "mid" }, 12)));
// magnifier lens over the record + an approve stamp
emit(L_REVIEW, [REVIEW.magX, REVIEW.magY, 12], wrap('data-part="lens"', k.lineSvg(k.ring(REVIEW.magX, REVIEW.magY, 8, 12, P, 30), { tone: "lit" })));
emit(L_REVIEW, [REVIEW.magX + 9, REVIEW.magY - 9, 15], wrap('data-part="lens"', cyl(REVIEW.magX + 8, REVIEW.magY - 8, 1.4, 12, 6, { tone: "hi" }, 12)));
emit(L_REVIEW, [REVIEW.card.x + REVIEW.card.w - 8, REVIEW.card.y + REVIEW.card.d + 8, 8], wrap('data-part="approve"', slab({ x: REVIEW.card.x + REVIEW.card.w - 13, y: REVIEW.card.y + REVIEW.card.d + 3, w: 10, d: 10, r: 1.5 }, 6, 4, { tone: "hi" })));

// ===========================================================================
// Assemble
// ===========================================================================
items.sort((a, b) => a.layer - b.layer || a.depth - b.depth);
const body = items.map((i) => i.svg).join("") +
  `<g data-board></g><g data-scan></g><g data-flow></g><g data-extra></g><g data-resolve></g><g data-review></g>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An unstructured-data intelligence bench: anything written on a whiteboard is transcribed into tokens, validated and compared against saved records; an extractor pulls fields from notes, PDFs, transcripts, contracts and forms; an entity resolver deduplicates them, maps them to a schema and runs business rules; and a human review desk settles conflicts under a magnifier while provenance is kept on every record.",
  body: [body],
});

const liveSource = readFileSync(join(HERE, "live.mjs"), "utf8");
const live = liveSource
  .replace(/__P__/g, JSON.stringify(P))
  .replace(/__DATA__/g, JSON.stringify(DATA))
  .replace(/__SCENE__/g, JSON.stringify({
    WHITE, W_PLANE, LANE, tokX: Array.from({ length: TOK_N }, (_, i) => tokX(i)), tokY, VALID, STORE, recY: [0, 1, 2].map(recY),
    EXTRA, RESOLVE: { ...RESOLVE, fieldY: [0, 1, 2].map(RESOLVE.fieldY) }, REVIEW: { ...REVIEW, fieldY: [0, 1, 2].map(REVIEW.fieldY) },
  }));

const css = `
.ig-live{stroke:var(--anatomy-lit);fill:none}
.ig-ink{stroke:var(--anatomy-strong);fill:none;opacity:.85}
.ig-scan{stroke:var(--anatomy-lit);fill:none}
.ig-check{stroke:var(--anatomy-green);fill:none}
.ig-red{stroke:var(--anatomy-red);fill:none}
.ig-reddot{fill:var(--anatomy-red)}
.ig-lit{fill:var(--anatomy-lit)}
.iso-stage svg{overflow:visible}
`;

const bodyHtml = k.plateHtml({
  fig: "Fig 1",
  title: "Unstructured data → trusted records",
  readout: "write · transcribe · validate · compare · extract · resolve · review",
  keys: [
    { mark: "lit", label: "Scan head · magnifier · resolved value" },
    { mark: "hi", label: "Token · field · record: the data moving through" },
    { mark: "dotted", label: "Green = valid · red = conflict · dot = provenance origin" },
  ],
  caption:
    "A whiteboard question is transcribed into tokens, validated and compared against saved records. An extractor pulls fields (amount 92k$, date Apr 4, party PromoCo) from notes, PDF, transcript, contract and form. An entity resolver merges the duplicates (PromoCo · Apr), maps them to a schema and runs business rules. A human review settles the conflict (92k$ contract vs 88k$ form → 92k$), keeping provenance on every field.",
  body: `<style>${CTL_CSS}${css}</style><div class="iso-stage" tabindex="0" role="region" aria-label="Unstructured-data intelligence anatomy: a whiteboard question is transcribed, validated and compared, then extracted from many document types, resolved to a schema with business rules, and human-reviewed for conflicts with provenance kept on every record">${svg}</div>`,
});

writeFileSync(
  join(HERE, theme === "light" ? "intel-light.html" : "intel.html"),
  k.pageHtml({ title: "Unstructured data → trusted records", theme, body: bodyHtml + CTL_HTML, script: kitScript() + live })
);

console.log("wrote", theme === "light" ? "intel-light.html" : "intel.html");
