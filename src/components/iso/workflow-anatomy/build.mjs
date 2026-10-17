import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.agents/skills/anatomy/kit/iso-kit.mjs";
import * as G from "../.agents/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../.agents/skills/anatomy/kit/tube.mjs";
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
.iso-ctl-q{color:var(--anatomy-strong);min-width:9ch;text-align:center}
.iso-ctl-step{color:var(--anatomy-muted);white-space:nowrap}
.iso-ctl-sep{width:1px;height:20px;background:var(--anatomy-mid);opacity:.5}
@media (max-width:430px){.iso-ctl{gap:6px;font-size:11px}.iso-ctl-btn{padding:6px 9px}.iso-ctl [data-btn="play"]{min-width:60px}}
`;
const CTL_HTML = `
<div class="iso-ctl" role="group" aria-label="Playback controls">
  <button type="button" class="iso-ctl-btn" data-btn="reset" aria-label="Restart" title="Restart">&#8634;</button>
  <button type="button" class="iso-ctl-btn" data-btn="prev" aria-label="Previous step" title="Previous step">&#9664;</button>
  <button type="button" class="iso-ctl-btn" data-btn="play" aria-label="Play" aria-pressed="false" title="Play or pause">Play</button>
  <button type="button" class="iso-ctl-btn" data-btn="next" aria-label="Next step" title="Next step">&#9654;</button>
  <span class="iso-ctl-sep" aria-hidden="true"></span>
  <button type="button" class="iso-ctl-btn" data-btn="qprev" aria-label="Previous workflow" title="Previous workflow">&#8249;</button>
  <span class="iso-ctl-q" data-qname>lead routing</span>
  <button type="button" class="iso-ctl-btn" data-btn="qnext" aria-label="Next workflow" title="Next workflow">&#8250;</button>
  <span class="iso-ctl-step" data-step>auto play</span>
</div>`;

// ---------------------------------------------------------------------------
// THE OBJECT: a workflow-orchestration desk. A live dashboard shows the
// workflow graph and unlocks each node only after its validation passes. The
// operator's approval console gates sensitive actions; a patch bay connects
// external tools, while the retry meter shows recovery after a failed call.
// ---------------------------------------------------------------------------

const PLATE = { x: -190, y: -104, w: 520, d: 210, r: 12 };
const LABEL = { x: 92, y: 78, w: 62, d: 18, r: 3 };
const KEYBOARD = { x: -64, y: 28, w: 128, d: 66, r: 3 };

// Independent input devices send events to the workstation over routed fiber.
const SOURCES = [
  { name: "WEBHOOK", kind: "gateway", x: -178, y: -98, w: 36, d: 22, h: 7, rxY: -72 },
  { name: "SCHEDULE", kind: "timer", x: -178, y: -68, w: 36, d: 22, h: 8, rxY: -66 },
  { name: "TICKET", kind: "reader", x: -178, y: -38, w: 36, d: 22, h: 7, rxY: -60 },
].map((source) => ({ ...source, r: 3, portY: source.y + 11 }));
const OPTIC_RX = { x: -118, y: -82, w: 28, d: 28, r: 3, h: 7, portX: -90, portZ: 9.55 };
const INTEGRATIONS = [
  { name: "CRM", kind: "records", x: 170, y: -96, w: 46, d: 26, h: 8, socket: 98, laneX: 150 },
  { name: "PAYMENTS", kind: "terminal", x: 170, y: -64, w: 46, d: 26, h: 8, socket: 118, laneX: 156 },
  { name: "HELPDESK", kind: "inbox", x: 170, y: -32, w: 46, d: 26, h: 8, socket: 138, laneX: 162 },
].map((app) => ({ ...app, r: 3, connectorX: app.x + 7, connectorY: app.y + app.d / 2 }));
const COMPUTE_LINKS = [
  { name: "SERVER RACK", kind: "rack", x: 220, y: 12, w: 48, d: 34, h: 44, laneX: 168, portY: 22, portZ: 15 },
  { name: "GPU / TPU", kind: "accelerator", x: 220, y: 52, w: 54, d: 26, h: 15, laneX: 176, portY: 62, portZ: 7.5 },
  { name: "QUANTUM", kind: "quantum", x: -184, y: 40, w: 70, d: 64, h: 68, laneX: 324, portY: 60, portZ: 10 },
].map((unit) => ({
  ...unit,
  r: 3,
  portX: unit.kind === "quantum" ? unit.x + unit.w + 2.5 : unit.x,
}));
const FABRIC_SWITCH = { x: 278, y: 82, w: 42, d: 22, r: 2.5, h: 8, portX: 320, portY: 93, portZ: 5 };

// decision: plinth beside the track, pivoting switch arm reaching over it
const DEC = {
  plinth: { x: -90, y: -34, w: 30, d: 18, r: 3, h: 7 },
  pivot: [-75, -25],
  armLen: 26,
  armW: 7,
  yes: 18,
  no: 80,
};

const TRANSFORM = { x: 10, y: -11, z: 12.1 };

// tool plinth (beside the track) + patch bay of connected systems (back)
const TOOL = { plinth: { x: 76, y: 24, w: 64, d: 24, r: 3, h: 7 }, node: [86, 36], inputX: 76, inputY: 36 };
const BAY = {
  x: 76, y: -102, w: 84, d: 34, r: 3, h: 10,
  sockets: [86, 106, 126, 146], sockY: -80, active: 1,
};

// approval gate: two posts flanking the track, a lifting barrier, a lamp tower
const CON = {
  x: 68, y: -12, w: 68, d: 34, r: 3, h: 10,
  approve: [82, 10], reject: [106, 10], screen: { x: 118, y: 2, w: 14, d: 16, r: 2 },
};
const MONITOR = { x0: -80, x1: 62, yBack: -72, yFront: -66, z0: 18, z1: 82 };
const MONITOR_SCREEN = { x0: -74, x1: 56, z0: 24, z1: 76, y: MONITOR.yFront + 0.05 };
const NODE_X = [-64, -45.5, -27, -8.5, 10, 28.5, 47];
const NODE_NAMES = ["TRIG", "RULE", "MAP", "HUMAN", "APP", "RETRY", "DONE"];

// Retry counter shows recovery attempts without implying a physical conveyor.
const RETRY = {
  counter: [150, 34],
};

// Completion beacon on the desk, beside the workflow monitor.
const FINISH = { beacon: { x: 72, y: 56, w: 16, d: 16, r: 3 } };

// Three worked examples of workflows the system builds.
const DATA = [
  {
    label: "lead routing",
    triggerSrc: "new lead (webhook)", source: 0,
    integration: 0,
    decision: "score > 80 ?", yes: "sales lane", no: "nurture",
    transform: "enrich + normalise",
    tool: "CRM · create deal",
    sensitive: "write to CRM",
    retryOf: "CRM · 429 rate limit",
    steps: [
      "trigger · new lead (webhook)",
      "decision · score 92 > 80 → sales",
      "transform · enrich company + role",
      "approval · sensitive write → approved",
      "tool · CRM.createDeal()",
      "retry · 429 backoff · attempt 2 ok",
      "finish · deal created",
    ],
    links: 4, attempts: 2, entries: 7,
    validations: ["EVENT RECEIVED", "SCORE 92 > 80", "FIELDS NORMALIZED", "HUMAN APPROVED", "CRM RESPONSE OK", "RETRY RESPONSE OK", "WORKFLOW COMPLETE"],
  },
  {
    label: "invoice sync",
    triggerSrc: "schedule · nightly", source: 1,
    integration: 1,
    decision: "amount < 5k ?", yes: "auto-pay lane", no: "finance review",
    transform: "map to ledger codes",
    tool: "Payments · charge",
    sensitive: "move money",
    retryOf: "Payments · timeout",
    steps: [
      "trigger · schedule · nightly",
      "decision · 1.2k < 5k → auto-pay",
      "transform · map ledger codes",
      "approval · move money → approved",
      "tool · payments.charge()",
      "retry · timeout · attempt 2 ok",
      "finish · invoice paid",
    ],
    links: 5, attempts: 2, entries: 7,
    validations: ["SCHEDULE FIRED", "AMOUNT 1.2K < 5K", "LEDGER MAPPED", "PAYMENT APPROVED", "CHARGE RESPONSE OK", "RETRY RESPONSE OK", "WORKFLOW COMPLETE"],
  },
  {
    label: "support triage",
    triggerSrc: "new ticket", source: 2,
    integration: 2,
    decision: "refund < 100 ?", yes: "auto-refund", no: "agent review",
    transform: "classify + summarise",
    tool: "Helpdesk · reply",
    sensitive: "customer-facing send",
    retryOf: "Helpdesk · 503",
    steps: [
      "trigger · new ticket",
      "decision · refund 40 < 100 → auto",
      "transform · classify + summarise",
      "approval · customer send → approved",
      "tool · helpdesk.reply()",
      "retry · 503 · attempt 2 ok",
      "finish · reply sent",
    ],
    links: 6, attempts: 2, entries: 7,
    validations: ["TICKET RECEIVED", "REFUND 40 < 100", "SUMMARY READY", "REPLY APPROVED", "HELPDESK RESPONSE OK", "RETRY RESPONSE OK", "WORKFLOW COMPLETE"],
  },
];

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -17, 0),
    [MONITOR.x0, MONITOR.yBack, MONITOR.z0], [MONITOR.x1, MONITOR.yBack, MONITOR.z0],
    [MONITOR.x1, MONITOR.yBack, MONITOR.z1], [MONITOR.x0, MONITOR.yBack, MONITOR.z1],
    [MONITOR.x0, MONITOR.yFront, MONITOR.z0], [MONITOR.x1, MONITOR.yFront, MONITOR.z1],
    ...SOURCES.flatMap((s) => k.boxCorners(s, 0, s.h + 8)),
    ...k.boxCorners(OPTIC_RX, 2.4, OPTIC_RX.h + 2.4),
    ...INTEGRATIONS.flatMap((app) => k.boxCorners(app, 0, app.h + 8)),
    ...COMPUTE_LINKS.flatMap((unit) => k.boxCorners(unit, 0, unit.h + 6)),
    ...k.boxCorners(FABRIC_SWITCH, 0, FABRIC_SWITCH.h + 4),
    ...k.boxCorners(DEC.plinth, 0, 14),
    ...k.boxCorners(BAY, 0, BAY.h + 6),
    ...k.boxCorners(CON, 0, CON.h + 4),
    [CON.approve[0], CON.approve[1], 16], [CON.screen.x, CON.screen.y, 14],
    ...k.boxCorners(TOOL.plinth, 0, 13),
    [RETRY.counter[0], RETRY.counter[1], 16],
    ...k.boxCorners(FINISH.beacon, 0, 16),
  ],
  WIDTH,
  HEIGHT,
  { pad: 62, azimuth: 44 }
);

const at = (p) => k.iso(p, P);

// One paint order: the base first (halo, feet, plate and every flat floor
// mark), then everything else sorted back-to-front by depth. `bias` lifts an
// item that physically sits above a nearer neighbour (the switch arm and arch
// beam over what passes beneath them).
const items = [];
function emit(depth, svg, bias = 0) { items.push({ key: depth + bias, svg }); }
function emitBase(svg) { items.push({ key: -Infinity, svg, base: true }); }
function slab(plan, z, h, style, steps = 6, bevel = 0.6) { return k.solidSvg(k.slabOf(plan, z, h, P, steps, bevel), style); }
function cyl(cx, cy, r, z, h, style, steps = 24) { return k.solidSvg(k.cylinder(cx, cy, r, z, h, P, steps), style); }
const wrap = (attr, svg) => `<g ${attr}>${svg}</g>`;
const seg = (a, b, z, tone = "lo") => k.lineSvg(k.lineOnTop(a, b, z, P), { tone, free: true });
const D = (x, y) => k.depthOf([x, y, 0], P);
const projectedPlan = (plan, y, z0, z1) =>
  k.pathOf([[plan.x, y, z0], [plan.x + plan.w, y, z0], [plan.x + plan.w, y, z1], [plan.x, y, z1]].map(at), true);
const wallPort = (x, y, z, r, steps = 22) => k.pathOf(
  Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return at([x, y + Math.cos(a) * r, z + Math.sin(a) * r]);
  }),
  true,
);

function workflowDisplay() {
  const { x0, x1, z0, z1, y } = MONITOR_SCREEN;
  const boxPath = (cx) => `M${cx - 6.2} -58h12.4v8h-12.4Z`;
  const nodes = NODE_X.map((x, i) => [
    `<g data-screen-node="${i}">`,
    `<path class="iso-line" data-screen-frame data-tone="faint" d="${boxPath(x)}"/>`,
    `<path class="wf-check iso-line" data-screen-check data-free data-tone="faint" d="M${x - 2.5} -54l1.8 2 3.6-4" style="opacity:0"/>`,
    `<text class="iso-face-text" data-screen-label="${i}" data-tone="lo" x="${x}" y="-46.5" font-size="2.8" text-anchor="middle">${NODE_NAMES[i]}</text>`,
    `<text class="iso-face-text" data-screen-state="${i}" data-tone="faint" x="${x}" y="-42.5" font-size="2.2" text-anchor="middle">LOCK</text>`,
    `</g>`,
  ].join("")).join("");
  const links = NODE_X.slice(0, -1).map((x, i) =>
    `<path class="iso-line" data-screen-link="${i}" data-tone="faint" d="M${x + 6.7} -54H${NODE_X[i + 1] - 6.7}"/>`).join("");
  const screenShape = k.pathOf([[x0, -z0], [x1, -z0], [x1, -z1], [x0, -z1]], true);
  return [
    `<g transform="${k.sideMatrix([0, y], 0, P, "left")}" class="wf-screen-ui">`,
    `<path class="wf-screen-glass" d="${screenShape}"/>`,
    `<text class="iso-face-text" data-tone="hi" x="-69" y="-69" font-size="4.2">ORCHESTRATOR / <tspan data-screen-workflow>LEAD ROUTING</tspan></text>`,
    `<path class="iso-line" data-tone="faint" d="M-74 -66H56"/>`,
    `<text class="iso-face-text" data-tone="faint" x="-69" y="-62.2" font-size="2.6">WORKFLOW GRAPH · VALIDATION REQUIRED AT EACH HANDOFF</text>`,
    links,
    nodes,
    `<path class="iso-line" data-tone="faint" d="M-74 -39H56"/>`,
    `<text class="iso-face-text" data-tone="faint" x="-69" y="-34.5" font-size="2.4">STEP CHECK</text>`,
    `<text class="iso-face-text" data-screen-validation data-tone="lit" x="-48" y="-34.5" font-size="2.6">READY · WAITING FOR TRIGGER</text>`,
    `<text class="iso-face-text" data-screen-input data-tone="faint" x="-69" y="-28" font-size="2.4">OPTICAL RX · LINK READY</text>`,
    `</g>`,
  ].join("");
}

// A pivoting bar: a rotated rectangle extruded at height z. Rebuilt each frame.
function armSvg(px, py, len, w, deg, z, h) {
  const a = (deg * Math.PI) / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const nx = -dy * (w / 2), ny = dx * (w / 2);
  const tip = [px + dx * len, py + dy * len];
  const ring = [
    [px + nx, py + ny], [tip[0] + nx, tip[1] + ny],
    [tip[0] - nx, tip[1] - ny], [px - nx, py - ny],
  ];
  return k.solidSvg(k.extrude(ring, z, h, P, { convex: true, bevel: 0.5 }), { tone: "hi" });
}
// ===========================================================================
// BASE: bench plate on feet, groove, ruler strip, label plate
// ===========================================================================
emitBase(`<path class="iso-halo" d="${k.haloOf(PLATE, -17, 12, P)}"/>`);
for (const [x, y] of k.corners(PLATE, 24)) {
  emitBase(k.solidSvg(k.cylinder(x, y, 7, -17, 1.6, P, 26), { tone: "lo" }));
  emitBase(k.solidSvg(k.cylinder(x, y, 5.4, -15.4, 3.4, P, 26), { tone: "mid" }));
}
emitBase(slab(PLATE, -12, 12, { tone: "mid" }, 8, 1.4));
emitBase(k.lineSvg(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
for (const [x, y] of k.corners(PLATE, 11)) {
  emitBase(k.lineSvg(k.ring(x, y, 2.4, 0, P, 16), { tone: "lo" }));
  emitBase(k.dotsSvg([at([x, y, 0])], { size: 0.5 }));
}
// engraved signal-path nameplate
emitBase(slab(LABEL, 0, 0.9, { tone: "mid" }, 4, 0.4));
emitBase(k.lineSvg(k.planOutline(k.insetPlan(LABEL, 1.6), 0.9, P), { tone: "faint" }));
emitBase(k.faceTextSvg(k.topMatrix([LABEL.x + 5, LABEL.y + 13], 0.96, P, "x"), "EVENT → FLOW → APP", { size: 3.4, tone: "lo" }));
for (const [x, y] of [[LABEL.x + 4, LABEL.y + 4], [LABEL.x + LABEL.w - 4, LABEL.y + LABEL.d - 4]]) {
  emitBase(k.dotsSvg([at([x, y, 0.95])], { size: 0.5 }));
}

// ===========================================================================
// ORCHESTRATOR DISPLAY: mounted dashboard with a gated workflow graph
// ===========================================================================
const monitorStand = { x: -59, y: -78, w: 102, d: 15, r: 2.5 };
emit(D(-8, -70), slab(monitorStand, 0, 2.4, { tone: "lo" }, 5, 0.5));
for (const x of [-38, 20]) {
  emit(D(x, -69), cyl(x, -69, 2.2, 2.4, 15.6, { tone: "mid" }, 20));
  emit(D(x, -69), k.lineSvg(k.sideArc(x, -69, 2.2, 10, P, 16), { tone: "faint" }));
}
{
  const screen = MONITOR_SCREEN;
  const panel = projectedPlan({ x: MONITOR.x0, w: MONITOR.x1 - MONITOR.x0 }, MONITOR.yFront, MONITOR.z0, MONITOR.z1);
  const rightSide = k.pathOf([
    [MONITOR.x1, MONITOR.yBack, MONITOR.z0],
    [MONITOR.x1, MONITOR.yFront, MONITOR.z0],
    [MONITOR.x1, MONITOR.yFront, MONITOR.z1],
    [MONITOR.x1, MONITOR.yBack, MONITOR.z1],
  ].map(at), true);
  const topSide = k.pathOf([
    [MONITOR.x0, MONITOR.yBack, MONITOR.z1],
    [MONITOR.x1, MONITOR.yBack, MONITOR.z1],
    [MONITOR.x1, MONITOR.yFront, MONITOR.z1],
    [MONITOR.x0, MONITOR.yFront, MONITOR.z1],
  ].map(at), true);
  const glass = projectedPlan({ x: screen.x0, w: screen.x1 - screen.x0 }, screen.y, screen.z0, screen.z1);
  const screenOutline = glass;
  emit(D((MONITOR.x0 + MONITOR.x1) / 2, MONITOR.yFront), [
    `<path class="iso-shade" data-shade="1" d="${rightSide}"/>`,
    `<path class="iso-shade" data-shade="2" d="${topSide}"/>`,
    `<path class="iso-fill" d="${panel}"/>`,
    `<path class="iso-line" data-tone="lo" d="${panel}"/>`,
    `<path class="wf-screen-glass" d="${glass}"/>`,
    `<path class="iso-line" data-tone="faint" d="${screenOutline}"/>`,
    k.dotsSvg([[MONITOR.x0 + 3, MONITOR.z0 + 3], [MONITOR.x1 - 3, MONITOR.z0 + 3],
      [MONITOR.x0 + 3, MONITOR.z1 - 3], [MONITOR.x1 - 3, MONITOR.z1 - 3]]
      .map(([x, z]) => at([x, MONITOR.yFront + 0.05, z])), { size: 0.55, tone: "mid" }),
    workflowDisplay(),
  ].join(""));
}

// ===========================================================================
// OPERATOR KEYBOARD: a complete, tactile workstation keyboard
// ===========================================================================
emitBase(slab(KEYBOARD, 0, 2.4, { tone: "mid" }, 6, 0.7));
emitBase(k.lineSvg(k.planOutline(k.insetPlan(KEYBOARD, 2), 2.4, P), { tone: "lo" }));
const KEY_U = 5.55, KEY_GAP = 0.45, KEY_D = 6.15, KEY_PITCH = 9.4;
const KEY_START_X = KEYBOARD.x + 3.2, KEY_MAIN_W = 92;
const KEY_START_Y = KEYBOARD.y + 3.2;
let keycapCount = 0;
const keycapPlans = [];
const drawKey = (x, y, units, legend, tone = "mid", gap = KEY_GAP) => {
  const w = units * KEY_U + Math.max(0, units - 1) * gap;
  const plan = { x, y, w, d: KEY_D, r: 0.65 };
  keycapPlans.push({ ...plan, legend });
  const cx = x + w / 2, cy = y + KEY_D / 2;
  const legendSvg = legend
    ? k.faceTextSvg(k.topMatrix([cx, cy], 3.84, P, "x"), legend, {
      size: legend.length > 1 ? 1.65 : 2.6,
      tone: "hi",
    })
    : "";
  const cap = slab(plan, 2.4, 1.4, { tone }, 3, 0.32) +
    k.lineSvg(k.planOutline(k.insetPlan(plan, 0.55), 3.8, P), { tone: "mid" }) +
    legendSvg;
  emit(D(cx, cy), wrap(`data-keycap="${++keycapCount}" data-key="${legend || "space"}"`, cap));
};
const mainRows = [
  [
    ["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1],
    ["8", 1], ["9", 1], ["0", 1], ["-", 1], ["=", 1], ["Bksp", 2],
  ],
  [
    ["Tab", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1],
    ["I", 1], ["O", 1], ["P", 1], ["[", 1], ["]", 1], ["\\", 1.5],
  ],
  [
    ["Caps", 1.75], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1],
    ["J", 1], ["K", 1], ["L", 1], [";", 1], ["'", 1], ["Enter", 2.25],
  ],
  [
    ["Shift", 2.25], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1],
    ["M", 1], [",", 1], [".", 1], ["/", 1], ["Shift", 2.75],
  ],
  [
    ["Ctrl", 1.25], ["Win", 1.25], ["Alt", 1.25], ["Space", 6.25],
    ["Alt", 1.25], ["Fn", 1.25], ["Menu", 1.25], ["Ctrl", 1.25],
  ],
];
const keyRowWidth = (row) =>
  row.reduce((sum, [, units]) => sum + units * KEY_U + (units - 1) * KEY_GAP, 0) +
  (row.length - 1) * KEY_GAP;
const placeRow = (row, y, tone = "mid") => {
  const rowIndex = mainRows.indexOf(row);
  const stagger = [0.5, 1, 1.5, 2, 1.5][rowIndex];
  let x = KEY_START_X + stagger * KEY_U + (KEY_MAIN_W - keyRowWidth(row)) / 2;
  row.forEach(([legend, units], i) => {
    drawKey(x, y, units, legend, tone);
    x += units * KEY_U + (units - 1) * KEY_GAP + (i === row.length - 1 ? 0 : KEY_GAP);
  });
};

const functionRow = [
  ["Esc", "Esc"], ["F1", "F1"], ["F2", "F2"], ["F3", "F3"], ["F4", "F4"],
  ["F5", "F5"], ["F6", "F6"], ["F7", "F7"], ["F8", "F8"],
  ["F9", "F9"], ["F10", "F10"], ["F11", "F11"], ["F12", "F12"],
];
const functionGaps = new Set([1, 5, 9]);
const functionUnit = KEY_U, functionGap = KEY_GAP, groupGap = 2.5;
const functionWidth = functionRow.reduce((sum, _, i) =>
  sum + functionUnit + (i ? (functionGaps.has(i) ? groupGap : functionGap) : 0), 0);
let fx = KEY_START_X + (KEY_MAIN_W - functionWidth) / 2;
functionRow.forEach(([legend], i) => {
  drawKey(fx, KEY_START_Y, 1, legend, "lo");
  fx += functionUnit + (i < functionRow.length - 1
    ? (functionGaps.has(i + 1) ? groupGap : functionGap)
    : 0);
});
mainRows.forEach((row, i) => placeRow(row, KEY_START_Y + (i + 1) * KEY_PITCH, i === 3 ? "lo" : "mid"));

const NAV_X = KEYBOARD.x + 107;
const navRows = [
  ["Ins", "Home", "PgUp"],
  ["Del", "End", "PgDn"],
];
navRows.forEach((row, rowIndex) => row.forEach((legend, colIndex) =>
  drawKey(NAV_X + colIndex * 5.3, KEY_START_Y + (rowIndex + 2) * KEY_PITCH, 0.88, legend, "lo", 0.2)
));
drawKey(NAV_X + 5.3, KEY_START_Y + 5 * KEY_PITCH, 0.88, "Up", "mid", 0.2);
drawKey(NAV_X, KEY_START_Y + 6 * KEY_PITCH, 0.88, "Left", "lo", 0.2);
drawKey(NAV_X + 5.3, KEY_START_Y + 6 * KEY_PITCH, 0.88, "Down", "mid", 0.2);
drawKey(NAV_X + 10.6, KEY_START_Y + 6 * KEY_PITCH, 0.88, "Right", "lo", 0.2);
if (keycapCount !== 84) throw new Error(`75% keyboard must have 84 keycaps; built ${keycapCount}`);
for (const cap of keycapPlans) {
  if (cap.x < KEYBOARD.x || cap.y < KEYBOARD.y ||
      cap.x + cap.w > KEYBOARD.x + KEYBOARD.w ||
      cap.y + cap.d > KEYBOARD.y + KEYBOARD.d) {
    throw new Error(`Keycap "${cap.legend || "space"}" extends beyond the keyboard case`);
  }
}
for (let i = 0; i < keycapPlans.length; i++) for (let j = i + 1; j < keycapPlans.length; j++) {
  const a = keycapPlans[i], b = keycapPlans[j];
  const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y);
  if (overlapX > 0.01 && overlapY > 0.01) {
    throw new Error(`Keycaps "${a.legend || "space"}" and "${b.legend || "space"}" overlap`);
  }
}

// ===========================================================================
// EXTERNAL SIGNAL SOURCES: independent devices feed the workstation by fiber
// ===========================================================================
for (const [i, source] of SOURCES.entries()) {
  const plan = { x: source.x, y: source.y, w: source.w, d: source.d, r: source.r };
  const top = source.h;
  const cx = source.x + source.w / 2;
  const cy = source.y + source.d / 2;
  const portX = source.x + source.w - 2;
  emit(D(cx, cy), slab(plan, 0, top, { tone: "mid" }, 5, 0.7));
  emit(D(cx, cy), k.lineSvg(k.planOutline(k.insetPlan(plan, 1.8), top, P), { tone: "lo" }));
  for (const [x, y] of k.corners(plan, 3.5)) emit(D(x, y), k.dotsSvg([at([x, y, top])], { size: 0.45 }));
  emit(D(cx, source.y + source.d - 4), k.faceTextSvg(
    k.topMatrix([source.x + 3, source.y + source.d - 4], top + 0.05, P, "x"),
    source.name,
    { size: 3.2, tone: "lo" },
  ));

  if (source.kind === "gateway") {
    for (const x of [source.x + 21, source.x + 27]) {
      emit(D(x, cy), cyl(x, cy, 1.8, top, 1.2, { tone: "lo" }, 16));
      emit(D(x, cy), k.lineSvg(k.ring(x, cy, 1.8, top + 1.25, P, 16), { tone: "faint" }));
    }
    emit(D(portX, source.portY), wrap(`data-signal="source${i}"`,
      `<path class="iso-line" data-tone="lo" d="${wallPort(portX, source.portY, top / 2, 2.3)}"/>` +
      `<path class="iso-line" data-tone="faint" d="${wallPort(portX, source.portY, top / 2, 1.2)}"/>` +
      k.dotsSvg([at([portX, source.portY, top / 2])], { size: 0.55, tone: "mid" })));
    for (const x of [source.x + 8, source.x + 13]) {
      emit(D(x, source.y + 4), cyl(x, source.y + 4, 0.7, top, 8, { tone: "lo" }, 12));
      emit(D(x, source.y + 4), k.dotsSvg([at([x, source.y + 4, top + 8])], { size: 0.45, tone: "mid" }));
    }
  } else if (source.kind === "timer") {
    const x = source.x + 24, y = cy;
    emit(D(x, y), cyl(x, y, 4.2, top, 2.8, { tone: "hi" }, 24, 0.3));
    emit(D(x, y), k.lineSvg(k.ring(x, y, 4.2, top + 2.85, P, 24), { tone: "lo" }));
    emit(D(x, y), k.lineSvg(k.radialTicks(x, y, 3.5, 8, 2, top + 2.9, [0.8, 1.7], P), { tone: "mid" }));
    emit(D(portX, source.portY), wrap(`data-signal="source${i}"`,
      `<path class="iso-line" data-tone="lo" d="${wallPort(portX, source.portY, top / 2, 2.3)}"/>` +
      `<path class="iso-line" data-tone="faint" d="${wallPort(portX, source.portY, top / 2, 1.2)}"/>` +
      k.dotsSvg([at([portX, source.portY, top / 2])], { size: 0.55, tone: "mid" })));
  } else {
    const slot = { x: source.x + 19, y: source.y + 4, w: 9, d: 8, r: 1.4 };
    emit(D(slot.x + slot.w / 2, slot.y + slot.d / 2),
      slab(slot, top, 0.35, { tone: "lo" }, 3, 0.15));
    emit(D(slot.x + slot.w / 2, slot.y + slot.d / 2),
      k.lineSvg(k.planOutline(slot, top + 0.35, P), { tone: "faint" }));
    for (let n = 0; n < 3; n++) {
      const x = slot.x + 2 + n * 2.5;
      emit(D(x, slot.y + 2), seg([x, slot.y + 2, top + 0.4], [x, slot.y + 6, top + 0.4], top + 0.4, "mid"));
    }
    emit(D(portX, source.portY), wrap(`data-signal="source${i}"`,
      `<path class="iso-line" data-tone="lo" d="${wallPort(portX, source.portY, top / 2, 2.3)}"/>` +
      `<path class="iso-line" data-tone="faint" d="${wallPort(portX, source.portY, top / 2, 1.2)}"/>` +
      k.dotsSvg([at([portX, source.portY, top / 2])], { size: 0.55, tone: "mid" })));
  }
}

// The optical receiver sits at the workstation's left-side input bank.
emit(D(OPTIC_RX.x + OPTIC_RX.w / 2, OPTIC_RX.y + OPTIC_RX.d / 2),
  slab(OPTIC_RX, 2.4, OPTIC_RX.h, { tone: "mid" }, 5, 0.5));
emit(D(OPTIC_RX.x + OPTIC_RX.w / 2, OPTIC_RX.y + OPTIC_RX.d / 2),
  k.lineSvg(k.planOutline(k.insetPlan(OPTIC_RX, 1.5), OPTIC_RX.h + 2.4, P), { tone: "lo" }));
emit(D(OPTIC_RX.x + OPTIC_RX.w / 2, OPTIC_RX.y + OPTIC_RX.d / 2),
  k.faceTextSvg(k.topMatrix([OPTIC_RX.x + 3, OPTIC_RX.y + 8], OPTIC_RX.h + 2.45, P, "x"), "OPTICAL RX", { size: 3, tone: "lo" }));
for (const [i, source] of SOURCES.entries()) {
  const portX = OPTIC_RX.x;
  const portZ = 4.8;
  emit(D(portX, source.rxY), wrap('data-signal="receiver"',
    `<path class="iso-line" data-tone="lo" d="${wallPort(portX, source.rxY, portZ, 2.8)}"/>` +
    `<path class="iso-line" data-tone="faint" d="${wallPort(portX, source.rxY, portZ, 1.5)}"/>` +
    k.dotsSvg([at([portX, source.rxY, portZ])], { size: 0.6, tone: "mid" })));

  const portY = source.portY;
  const portSourceX = source.x + source.w;
  const laneX = portSourceX + 4 + i * 6;
  const route = G.fillet([
    [portSourceX, portY, source.h / 2],
    [laneX, portY, source.h / 2],
    [laneX, source.rxY, 1.4],
    [portX, source.rxY, 1.4],
    [portX, source.rxY, portZ],
  ], 3, 10, { P, tube: 1.05 });
  for (const piece of tubePieces(route, 1.05, P, { maxLength: 28, spacing: 0.8 })) {
    const trace = k.lineSvg(k.pathOf(piece.points.map((point) => k.iso(point, P))), { tone: "blue", free: true })
      .replace('class="iso-line"', 'class="iso-line wf-fiber-trace"');
    emit(D(piece.mid[0], piece.mid[1]), wrap(`data-fiber-source="${i}"`,
      `${tubeSvg(piece, { tone: "mid" })}${trace}`), 0.05);
  }
}

// ===========================================================================
// DECISION: a rule selector with a pointer and detents
// ===========================================================================
emit(D(DEC.plinth.x + DEC.plinth.w / 2, DEC.plinth.y + DEC.plinth.d / 2), slab(DEC.plinth, 0, DEC.plinth.h, { tone: "mid" }, 5, 0.7));
emit(D(DEC.plinth.x + DEC.plinth.w / 2, DEC.plinth.y + DEC.plinth.d / 2),
  k.lineSvg(k.planOutline(k.insetPlan(DEC.plinth, 2), DEC.plinth.h, P), { tone: "lo" }));
for (const [x, y] of k.corners(DEC.plinth, 4)) emit(D(x, y), k.dotsSvg([at([x, y, DEC.plinth.h])], { size: 0.5 }));
emit(D(DEC.pivot[0], DEC.pivot[1]), cyl(DEC.pivot[0], DEC.pivot[1], 5, DEC.plinth.h, 3, { tone: "lo" }, 22));
emit(D(DEC.pivot[0], DEC.pivot[1]), wrap('data-part="switcharm"', armSvg(DEC.pivot[0], DEC.pivot[1], DEC.armLen, DEC.armW, DEC.yes, DEC.plinth.h + 3, 3), 10));
emit(D(DEC.pivot[0], DEC.pivot[1]), wrap('data-part="switch"', cyl(DEC.pivot[0], DEC.pivot[1], 3, DEC.plinth.h + 3, 4, { tone: "hi" }, 20)));
emit(D(DEC.pivot[0], DEC.pivot[1]), wrap('data-part="switch"', k.lineSvg(k.ring(DEC.pivot[0], DEC.pivot[1], 3, DEC.plinth.h + 7.1, P, 20), { tone: "faint" })));
// TRANSFORM: a desktop rotary encoder for the normalization stage
// ===========================================================================
{
  const encoder = { x: 2, y: -22, w: 22, d: 22, r: 3 };
  const [x, y] = [10, -11];
  emit(D(x, y), slab(encoder, 0, 6, { tone: "mid" }, 5, 0.7));
  emit(D(x, y), k.lineSvg(k.planOutline(k.insetPlan(encoder, 2), 6, P), { tone: "lo" }));
  emit(D(x, y), cyl(x, y, 3, 6, 3, { tone: "lo" }, 20));
  emit(D(x, y), k.solidSvg(k.cylinder(x, y, 7.5, 9, 3, P, 40, 0.5), { tone: "hi" }));
  emit(D(x, y), k.lineSvg(k.knurl(x, y, 7.5, 9, 12, 30, P, 0.35), { tone: "lo" }));
  emit(D(x, y), k.lineSvg(k.radialTicks(x, y, 7.2, 16, 4, 12.05, [1.4, 4.2], P), { tone: "mid" }));
  emit(D(x, y), wrap('data-part="wheelspin"', k.dotsSvg([at([x + 5.6, y, 12.1])], { size: 0.9, tone: "lit" })));
}

// ===========================================================================
// TOOL PLINTH + PATCH BAY of connected systems
// ===========================================================================
emit(D(TOOL.plinth.x + TOOL.plinth.w / 2, TOOL.plinth.y + TOOL.plinth.d / 2), slab(TOOL.plinth, 0, TOOL.plinth.h, { tone: "mid" }, 5, 0.7));
emit(D(TOOL.plinth.x + TOOL.plinth.w / 2, TOOL.plinth.y + TOOL.plinth.d / 2),
  k.lineSvg(k.planOutline(k.insetPlan(TOOL.plinth, 2), TOOL.plinth.h, P), { tone: "lo" }));
for (const [x, y] of k.corners(TOOL.plinth, 4)) emit(D(x, y), k.dotsSvg([at([x, y, TOOL.plinth.h])], { size: 0.5 }));
emit(D(TOOL.node[0], TOOL.node[1]), wrap('data-part="toolnode"', cyl(TOOL.node[0], TOOL.node[1], 5, TOOL.plinth.h, 4, { tone: "hi" }, 24)));
emit(D(TOOL.node[0], TOOL.node[1]), wrap('data-part="toolnode" data-signal="tool"', k.lineSvg(k.ring(TOOL.node[0], TOOL.node[1], 5, TOOL.plinth.h + 4.1, P, 24), { tone: "lo" })));
emit(D(BAY.x + BAY.w / 2, BAY.y + BAY.d / 2), slab(BAY, 0, BAY.h, { tone: "mid" }, 6, 0.8));
emit(D(BAY.x + BAY.w / 2, BAY.y + BAY.d / 2), k.lineSvg(k.planOutline(k.insetPlan(BAY, 2.5), BAY.h, P), { tone: "lo" }));
for (const [x, y] of k.corners(BAY, 5)) emit(D(x, y), k.dotsSvg([at([x, y, BAY.h])], { size: 0.5 }));
BAY.sockets.forEach((sx, i) => {
  emit(D(sx, BAY.sockY), wrap(`data-socket="${i}"`, k.lineSvg(k.ring(sx, BAY.sockY, 4.4, BAY.h + 0.05, P, 22), { tone: "lo" })));
  emit(D(sx, BAY.sockY), wrap(`data-socket="${i}"`, k.dotsSvg([at([sx, BAY.sockY, BAY.h + 0.1])], { size: 0.6 })));
});
emit(D(BAY.sockets[BAY.active], BAY.sockY), wrap('data-part="plug"', cyl(BAY.sockets[BAY.active], BAY.sockY, 3, BAY.h, 4.5, { tone: "hi" }, 20, 0.4)));
emit(D(BAY.sockets[BAY.active], BAY.sockY), wrap('data-part="plug"', k.lineSvg(k.ring(BAY.sockets[BAY.active], BAY.sockY, 3, BAY.h + 4.55, P, 20), { tone: "faint" })));
{
  const cx = BAY.sockets[BAY.active];
  const portY = TOOL.inputY, portZ = 4.8;
  const portX = TOOL.inputX;
  emit(D(portX, portY), wrap('data-signal="toolinput"',
    `<path class="iso-line" data-tone="lo" d="${wallPort(portX, portY, portZ, 2.8)}"/>` +
    `<path class="iso-line" data-tone="faint" d="${wallPort(portX, portY, portZ, 1.4)}"/>` +
    k.dotsSvg([at([portX, portY, portZ])], { size: 0.55, tone: "mid" })));
  const route = G.fillet([
    [cx, BAY.sockY, BAY.h + 4.55],
    [cx, BAY.y + BAY.d + 2, BAY.h + 4.55],
    [cx, BAY.y + BAY.d + 2, 1.5],
    [portX - 4, BAY.y + BAY.d + 2, 1.5],
    [portX - 4, portY, 1.5],
    [portX, portY, portZ],
  ], 3.5, 10, { P, tube: 1.05 });
  for (const piece of tubePieces(route, 1.05, P, { maxLength: 24, spacing: 0.8 })) {
    const trace = k.lineSvg(k.pathOf(piece.points.map((point) => k.iso(point, P))), { tone: "blue", free: true })
      .replace('class="iso-line"', 'class="iso-line wf-fiber-trace"');
    emit(D(piece.mid[0], piece.mid[1]), wrap('data-fiber-rpc',
      `${tubeSvg(piece, { tone: "mid" })}${trace}`), 0.05);
  }
}

// ===========================================================================
// EXTERNAL APPS: the action gateway patches requests out to real tool modules
// ===========================================================================
for (const [i, app] of INTEGRATIONS.entries()) {
  const cx = app.x + app.w / 2;
  const cy = app.y + app.d / 2;
  const top = app.h;
  const plan = { x: app.x, y: app.y, w: app.w, d: app.d, r: app.r };
  const details = [];
  details.push(slab(plan, 0, top, { tone: "mid" }, 5, 0.7));
  details.push(k.lineSvg(k.planOutline(k.insetPlan(plan, 1.8), top, P), { tone: "lo" }));
  for (const [x, y] of k.corners(plan, 3)) details.push(k.dotsSvg([at([x, y, top])], { size: 0.45, tone: "lo" }));
  details.push(k.faceTextSvg(k.topMatrix([app.x + 4, app.y + app.d - 7], top + 0.1, P, "x"), app.name, {
    size: 3.2, tone: "lo",
  }).replace('class="iso-face-text"', 'class="wf-app-name iso-face-text"'));

  if (app.kind === "records") {
    for (let row = 0; row < 3; row++) {
      const card = { x: app.x + 6, y: app.y + 3 + row * 5, w: 18, d: 3.2, r: 0.7 };
      details.push(slab(card, top, 0.8, { tone: "lo" }, 3, 0.2));
      details.push(k.lineSvg(k.planOutline(card, top + 0.8, P), { tone: "faint" }));
      details.push(seg([card.x + 2, card.y + 1.6, top + 0.85], [card.x + 15, card.y + 1.6, top + 0.85], top + 0.85, "mid"));
    }
    details.push(cyl(app.x + 31, cy, 3.1, top, 1.4, { tone: "lo" }, 18));
    details.push(k.lineSvg(k.ring(app.x + 31, cy, 3.1, top + 1.45, P, 18), { tone: "faint" }));
  } else if (app.kind === "terminal") {
    const slot = { x: app.x + 6, y: app.y + 3, w: 18, d: 5, r: 1 };
    details.push(slab(slot, top, 0.45, { tone: "lo" }, 3, 0.15));
    details.push(k.lineSvg(k.planOutline(slot, top + 0.45, P), { tone: "faint" }));
    for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
      const x = app.x + 8 + col * 5, y = app.y + 12 + row * 5;
      details.push(slab({ x: x - 1.5, y: y - 1.2, w: 3, d: 2.4, r: 0.5 }, top, 1.1, { tone: "lo" }, 2, 0.15));
      details.push(k.dotsSvg([at([x, y, top + 1.15])], { size: 0.45, tone: "mid" }));
    }
    details.push(cyl(app.x + 31, cy, 3.1, top, 1.4, { tone: "lo" }, 18));
  } else {
    const tray = { x: app.x + 6, y: app.y + 3, w: 19, d: 13, r: 1.2 };
    details.push(slab(tray, top, 0.7, { tone: "lo" }, 3, 0.2));
    for (let row = 0; row < 3; row++) {
      const y = tray.y + 3 + row * 3.3;
      details.push(seg([tray.x + 2, y, top + 0.75], [tray.x + 15, y, top + 0.75], top + 0.75, "faint"));
    }
    details.push(cyl(app.x + 31, cy, 3.1, top, 1.4, { tone: "lo" }, 18));
    details.push(k.lineSvg(k.ring(app.x + 31, cy, 3.1, top + 1.45, P, 18), { tone: "faint" }));
  }

  const px = app.connectorX, py = app.connectorY;
  details.push(cyl(px, py, 2.7, top, 1.4, { tone: "lo" }, 22));
  details.push(`<path class="iso-line" data-tone="lo" data-signal="app${i}" d="${k.ring(px, py, 2.7, top + 1.45, P, 22)}"/>`);
  details.push(`<path class="iso-line" data-tone="faint" d="${k.ring(px, py, 1.35, top + 1.5, P, 18)}"/>`);
  details.push(k.dotsSvg([at([px, py, top + 1.5])], { size: 0.55, tone: "mid" }));
  emit(D(cx, cy), wrap(`data-app-module="${i}"`, details.join("")));
}

for (const [i, app] of INTEGRATIONS.entries()) {
  const plugX = [TOOL.plinth.x + 22, TOOL.plinth.x + 32, TOOL.plinth.x + 42][i];
  const plugY = TOOL.node[1] + 4;
  emit(D(plugX, plugY), wrap(`data-signal="out${i}"`,
    `<path class="iso-line" data-tone="lo" d="${k.ring(plugX, plugY, 2.4, TOOL.plinth.h + 0.05, P, 20)}"/>` +
    `<path class="iso-line" data-tone="faint" d="${k.ring(plugX, plugY, 1.2, TOOL.plinth.h + 0.1, P, 16)}"/>` +
    k.dotsSvg([at([plugX, plugY, TOOL.plinth.h + 0.15])], { size: 0.5, tone: "mid" })));

  const endpointX = app.x - 2;
  const endpointZ = app.h + 1.5;
  const route = G.fillet([
    [plugX, plugY, TOOL.plinth.h + 0.15],
    [app.laneX, plugY, TOOL.plinth.h + 0.15],
    [app.laneX, app.connectorY, 1.5],
    [endpointX, app.connectorY, 1.5],
    [endpointX, app.connectorY, endpointZ],
    [app.connectorX, app.connectorY, endpointZ],
  ], 4, 10, { P, tube: 1.05 });
  const cable = [];
  for (const piece of tubePieces(route, 1.05, P, { maxLength: 26, spacing: 0.8 })) {
    cable.push(tubeSvg(piece, { tone: "mid" }));
  }
  const trace = k.lineSvg(k.pathOf(route.map((point) => k.iso(point, P))), { tone: "blue", free: true })
    .replace('class="iso-line"', 'class="iso-line wf-fiber-trace"');
  emit(D((plugX + app.connectorX) / 2, (plugY + app.connectorY) / 2),
    wrap(`data-fiber-out="${i}"`, cable.join("") + trace), 0.05);
}

// ===========================================================================
// COMPUTE BACKPLANE: rack, accelerator sled and optional quantum instrument
// ===========================================================================
const computePorts = [-14, -6, 2];
COMPUTE_LINKS.forEach((unit, i) => {
  const sourceY = computePorts[i];
  const portRings = (x, y, z) =>
    `<path class="iso-line" data-tone="lo" d="${wallPort(x, y, z, 2.6)}"/>` +
    `<path class="iso-line" data-tone="faint" d="${wallPort(x, y, z, 1.3)}"/>` +
    k.dotsSvg([at([x, y, z])], { size: 0.55, tone: "mid" });
  emit(D(TOOL.plinth.x + TOOL.plinth.w, sourceY),
    wrap(`data-signal="compute${i}"`, portRings(TOOL.plinth.x + TOOL.plinth.w, sourceY, 4.8)));
  emit(D(unit.portX, unit.portY),
    wrap(`data-signal="compute${i}"`, portRings(unit.portX, unit.portY, unit.portZ)));

  const route = unit.kind === "quantum"
    ? G.fillet([
      [TOOL.plinth.x + TOOL.plinth.w, sourceY, 4.8],
      [unit.laneX, sourceY, 4.8],
      [unit.laneX, PLATE.y + PLATE.d - 2.2, 12],
      [unit.portX, PLATE.y + PLATE.d - 2.2, 12],
      [unit.portX, unit.portY, 12],
      [unit.portX, unit.portY, unit.portZ],
    ], 6, 10, { P, tube: 0.9 })
    : G.fillet([
      [TOOL.plinth.x + TOOL.plinth.w, sourceY, 4.8],
      [unit.laneX, sourceY, 4.8],
      [unit.laneX, unit.portY, 1.2],
      [unit.portX, unit.portY, 1.2],
      [unit.portX, unit.portY, unit.portZ],
    ], 3.6, 10, { P, tube: 0.9 });
  const cable = tubePieces(route, 0.9, P, { maxLength: 24, spacing: 0.7 })
    .map((piece) => tubeSvg(piece, { tone: "mid" })).join("");
  const trace = k.lineSvg(k.pathOf(route.map((point) => k.iso(point, P))), { tone: "blue", free: true })
    .replace('class="iso-line"', 'class="iso-line wf-fiber-trace"');
  emit(D((TOOL.plinth.x + TOOL.plinth.w + unit.portX) / 2, (sourceY + unit.portY) / 2),
    wrap(`data-compute-fiber="${i}"`, cable + trace), 0.05);

  const { x, y, w, d, h } = unit;
  const cx = x + w / 2, cy = y + d / 2;
  const parts = [];
  const plan = { x, y, w, d, r: unit.r };
  const fasteners = (rect, z, size = 0.45) =>
    k.dotsSvg(k.corners(rect, 3).map(([px, py]) => at([px, py, z])), { size, tone: "lo" });
  const topEdge = (rect, z) => k.lineSvg(k.planOutline(k.insetPlan(rect, 1.5), z, P), { tone: "lo" });

  if (unit.kind === "rack") {
    const footPlan = { x: x + 4, y: y + 3, w: w - 8, d: d - 6, r: 2 };
    parts.push(slab(footPlan, 0, 3, { tone: "mid" }, 5, 0.5), topEdge(footPlan, 3), fasteners(footPlan, 3));
    for (const [px, py] of [[x + 4, y + 4], [x + w - 6, y + 4], [x + 4, y + d - 6], [x + w - 6, y + d - 6]]) {
      const post = { x: px, y: py, w: 2, d: 2, r: 0.35 };
      parts.push(slab(post, 3, h - 6, { tone: "lo" }, 2, 0.25));
      parts.push(k.lineSvg(k.planOutline(post, h - 3, P), { tone: "faint" }));
    }
    const cap = { x: x + 2, y: y + 2, w: w - 4, d: d - 4, r: 1.5 };
    parts.push(slab(cap, h - 3, 2, { tone: "mid" }, 4, 0.4), topEdge(cap, h - 1), fasteners(cap, h - 1));
    for (const level of [8, 19, 30]) {
      const tray = { x: x + 6, y: y + 5, w: w - 12, d: d - 10, r: 1.2 };
      parts.push(slab(tray, level, 2, { tone: "mid" }, 4, 0.3));
      const server = { x: x + 7, y: y + 6, w: w - 14, d: d - 12, r: 1 };
      parts.push(slab(server, level + 2, 3, { tone: "lo" }, 4, 0.25), topEdge(server, level + 5), fasteners(server, level + 5));
      for (const fx of [x + 16, x + 27, x + 36]) {
        parts.push(cyl(fx, cy, 3.2, level + 5, 0.8, { tone: "mid" }, 18));
        parts.push(k.lineSvg(k.ring(fx, cy, 2.5, level + 5.85, P, 16), { tone: "faint" }));
        parts.push(cyl(fx, cy, 0.7, level + 5.85, 0.55, { tone: "lo" }, 12));
      }
      for (let vent = 0; vent < 5; vent++) {
        const vx = x + 8 + vent * 2.2;
        parts.push(seg([vx, y + d - 7, level + 5.1], [vx, y + d - 4, level + 5.1], level + 5.1, "faint"));
      }
    }
    const connectorShelf = { x: x + 8, y: y + d - 4, w: w - 16, d: 2, r: 0.5 };
    parts.push(slab(connectorShelf, 4, 1.2, { tone: "lo" }, 2, 0.15));
    parts.push(k.dotsSvg(Array.from({ length: 8 }, (_, n) => at([x + 11 + n * 4, y + d - 3, 5.3])), { size: 0.5, tone: "mid" }));
  } else if (unit.kind === "accelerator") {
    const chassis = { x, y, w, d, r: 2.5 };
    parts.push(slab(chassis, 0, 4, { tone: "mid" }, 5, 0.6), topEdge(chassis, 4), fasteners(chassis, 4));
    const deck = { x: x + 3, y: y + 3, w: w - 6, d: d - 6, r: 1.2 };
    parts.push(slab(deck, 4, 1.2, { tone: "lo" }, 4, 0.25), topEdge(deck, 5.2));
    for (const boardX of [x + 5, x + 27]) {
      const board = { x: boardX, y: y + 5, w: 20, d: 12, r: 0.8 };
      parts.push(slab(board, 5.2, 0.9, { tone: "mid" }, 3, 0.15));
      for (let fin = 0; fin < 6; fin++) {
        const fx = boardX + 2 + fin * 2.7;
        parts.push(slab({ x: fx, y: y + 6, w: 0.9, d: 8, r: 0.2 }, 6.1, 1.3, { tone: "lo" }, 2, 0.1));
      }
      const fanX = boardX + 10, fanY = y + 11;
      parts.push(cyl(fanX, fanY, 3.4, 6.1, 1.1, { tone: "mid" }, 20));
      parts.push(k.lineSvg(k.ring(fanX, fanY, 2.6, 7.25, P, 18), { tone: "faint" }));
      parts.push(cyl(fanX, fanY, 0.8, 7.25, 0.45, { tone: "lo" }, 12));
    }
    const tpuBoard = { x: x + 5, y: y + 18, w: 42, d: 4, r: 0.6 };
    parts.push(slab(tpuBoard, 5.2, 0.9, { tone: "lo" }, 3, 0.12), topEdge(tpuBoard, 6.1));
    for (let chip = 0; chip < 6; chip++) {
      const chipX = x + 8 + chip * 7;
      parts.push(slab({ x: chipX, y: y + 18.4, w: 4.2, d: 3.2, r: 0.4 }, 6.1, 1.1, { tone: "mid" }, 2, 0.12));
      parts.push(k.dotsSvg([at([chipX + 2.1, y + 20, 7.25])], { size: 0.45, tone: "faint" }));
    }
    for (const px of [x + 8, x + w - 8]) {
      parts.push(k.dotsSvg([at([px, y + 2.2, 4.1])], { size: 0.6, tone: "lo" }));
      parts.push(seg([px, y + 2.5, 7.5], [px, y + 4.2, 7.5], 7.5, "faint"));
    }
  } else {
    const feet = [[x + 5, y + 4], [x + w - 7, y + 4], [x + 5, y + d - 7], [x + w - 7, y + d - 7]];
    for (const [fx, fy] of feet) {
      parts.push(cyl(fx, fy, 2.5, 0, 2.5, { tone: "lo" }, 18));
      parts.push(k.lineSvg(k.ring(fx, fy, 2.1, 2.55, P, 16), { tone: "faint" }));
    }
    const baseDeck = { x: x + 2, y: y + 2, w: w - 4, d: d - 4, r: 2 };
    parts.push(slab(baseDeck, 2.5, 2, { tone: "mid" }, 5, 0.4), topEdge(baseDeck, 4.5), fasteners(baseDeck, 4.5));
    const frameTop = h - 7;
    const framePosts = [[x + 4, y + 4], [x + w - 6, y + 4], [x + 4, y + d - 6], [x + w - 6, y + d - 6]];
    for (const [fx, fy] of framePosts) {
      const post = { x: fx, y: fy, w: 2, d: 2, r: 0.3 };
      parts.push(slab(post, 4.5, frameTop - 4.5, { tone: "lo" }, 2, 0.2));
      parts.push(k.lineSvg(k.planOutline(post, frameTop, P), { tone: "faint" }));
    }
    const chamberX = cx, chamberY = cy;
    for (const [radius, z, height, tone] of [
      [21, 4.5, 5, "mid"], [18, 9.5, 8, "lo"], [15, 17.5, 9, "mid"],
      [12, 26.5, 10, "lo"], [8.5, 36.5, 10, "mid"], [14, 46.5, 4, "lo"],
      [4.5, 50.5, 8, "hi"],
    ]) {
      parts.push(cyl(chamberX, chamberY, radius, z, height, { tone }, 32, 0.3));
      parts.push(k.lineSvg(k.ring(chamberX, chamberY, radius, z + height + 0.05, P, 28), { tone: "faint" }));
    }
    const control = { x: x + 5, y: y + 4, w: 11, d: 10, r: 1 };
    parts.push(slab(control, 4.5, 9, { tone: "mid" }, 4, 0.35), topEdge(control, 13.5));
    parts.push(cyl(x + 10.5, y + 9, 2, 13.5, 1.2, { tone: "lo" }, 16));
    for (const fx of [x + 7, x + 11]) {
      parts.push(k.dotsSvg([at([fx, y + 6, 13.6])], { size: 0.5, tone: "mid" }));
      parts.push(seg([fx, y + 11, 13.6], [fx, y + 12.8, 13.6], 13.6, "faint"));
    }
    const coax = G.fillet([
      [x + 18, y + 9, 14], [x + 23, y + 9, 14],
      [chamberX - 12, chamberY - 4, 18], [chamberX - 9, chamberY - 3, 20],
    ], 2.8, 8, { P, tube: 0.45 });
    for (const piece of tubePieces(coax, 0.45, P, { maxLength: 12, spacing: 0.6 })) {
      parts.push(tubeSvg(piece, { tone: "mid" }));
    }
  }

  const indicator = unit.kind === "quantum"
    ? [x + 10.5, y + 9, 14.75]
    : [x + w - 5, y + d - 5, unit.kind === "rack" ? h - 1 : h + 1.5];
  const connector = {
    x: unit.kind === "quantum" ? unit.portX - 2.5 : unit.portX,
    y: unit.portY - 2,
    w: 2.5,
    d: 4,
    r: 0.5,
  };
  parts.push(slab(connector, unit.portZ - 1, 2, { tone: "lo" }, 3, 0.2));
  parts.push(topEdge(connector, unit.portZ + 1), fasteners(connector, unit.portZ + 1, 0.35));
  parts.push(wrap(`class="wf-compute-lamp" data-signal="compute${i}"`,
    k.lineSvg(k.ring(indicator[0], indicator[1], 1.2, indicator[2], P, 14), { tone: "lo" }) +
    k.dotsSvg([at(indicator)], { size: 0.65, tone: "lo" })));
  emit(D(cx, cy), wrap(`data-compute-module="${i}"`, parts.join("")));
});

// Optical fabric switch: the server rack's uplink fans into this physical patch point.
{
  const { x, y, w, d, h } = FABRIC_SWITCH;
  const plan = { x, y, w, d, r: FABRIC_SWITCH.r };
  const parts = [
    slab(plan, 0, h, { tone: "mid" }, 5, 0.6),
    k.lineSvg(k.planOutline(k.insetPlan(plan, 1.7), h, P), { tone: "lo" }),
    k.dotsSvg(k.corners(plan, 3).map(([px, py]) => at([px, py, h])), { size: 0.45, tone: "lo" }),
  ];
  for (let row = 0; row < 2; row++) for (let col = 0; col < 4; col++) {
    const px = x + 7 + col * 8.5, py = y + 5 + row * 9;
    const cage = { x: px - 2.4, y: py - 1.5, w: 4.8, d: 3, r: 0.45 };
    parts.push(slab(cage, h, 0.8, { tone: "lo" }, 2, 0.12));
    parts.push(k.lineSvg(k.planOutline(cage, h + 0.8, P), { tone: "faint" }));
    parts.push(k.dotsSvg([at([px, py, h + 0.85])], { size: 0.42, tone: "mid" }));
  }
  for (const px of [x + 6, x + w - 6]) {
    parts.push(cyl(px, y + 3, 1.3, h, 1, { tone: "lo" }, 14));
  }
  const portBlock = { x: FABRIC_SWITCH.portX - 2.5, y: FABRIC_SWITCH.portY - 2, w: 2.5, d: 4, r: 0.45 };
  parts.push(slab(portBlock, FABRIC_SWITCH.portZ - 1, 2, { tone: "lo" }, 3, 0.18));
  parts.push(k.dotsSvg([at([FABRIC_SWITCH.portX, FABRIC_SWITCH.portY, FABRIC_SWITCH.portZ])], { size: 0.6, tone: "mid" }));
  parts.push(wrap('class="wf-fabric-lamp" data-signal="fabric"',
    k.lineSvg(k.ring(x + 4, y + d - 4, 1.15, h + 0.1, P, 14), { tone: "lo" }) +
    k.dotsSvg([at([x + 4, y + d - 4, h + 0.1])], { size: 0.6, tone: "lo" })));
  emit(D(x + w / 2, y + d / 2), wrap('data-fabric-switch', parts.join("")));

  const rack = COMPUTE_LINKS[0];
  const rackPortX = rack.x + rack.w;
  const rackPortY = rack.portY + 16;
  emit(D(rackPortX, rackPortY), wrap('data-signal="fabric"',
    `<path class="iso-line" data-tone="lo" d="${wallPort(rackPortX, rackPortY, 12, 2.5)}"/>` +
    `<path class="iso-line" data-tone="faint" d="${wallPort(rackPortX, rackPortY, 12, 1.2)}"/>` +
    k.dotsSvg([at([rackPortX, rackPortY, 12])], { size: 0.55, tone: "mid" })));
  const rackBlock = { x: rackPortX - 4, y: rackPortY - 2, w: 4, d: 4, r: 0.45 };
  emit(D(rackPortX, rackPortY), slab(rackBlock, 10, 4, { tone: "lo" }, 3, 0.18));

  const route = G.fillet([
    [rackPortX, rackPortY, 12],
    [rackPortX + 3, rackPortY, 12],
    [rackPortX + 3, FABRIC_SWITCH.y - 3, 12],
    [FABRIC_SWITCH.portX + 6, FABRIC_SWITCH.y - 3, 12],
    [FABRIC_SWITCH.portX + 6, FABRIC_SWITCH.portY, 1.2],
    [FABRIC_SWITCH.portX, FABRIC_SWITCH.portY, 1.2],
    [FABRIC_SWITCH.portX, FABRIC_SWITCH.portY, FABRIC_SWITCH.portZ],
  ], 4, 10, { P, tube: 0.9 });
  const cable = tubePieces(route, 0.9, P, { maxLength: 24, spacing: 0.7 })
    .map((piece) => tubeSvg(piece, { tone: "mid" })).join("");
  const trace = k.lineSvg(k.pathOf(route.map((point) => k.iso(point, P))), { tone: "blue", free: true })
    .replace('class="iso-line"', 'class="iso-line wf-fiber-trace"');
  emit(D((rackPortX + FABRIC_SWITCH.portX) / 2, (rackPortY + FABRIC_SWITCH.portY) / 2),
    wrap('data-fabric-link', cable + trace), 0.05);
}

// ===========================================================================
// OPERATOR CONSOLE: approval, rejection and a secondary touch display
// ===========================================================================
emit(D(CON.x + CON.w / 2, CON.y + CON.d / 2), slab(CON, 0, CON.h, { tone: "mid" }, 6, 0.8));
emit(D(CON.x + CON.w / 2, CON.y + CON.d / 2), k.lineSvg(k.planOutline(k.insetPlan(CON, 2.5), CON.h, P), { tone: "lo" }));
for (const [x, y] of k.corners(CON, 5)) emit(D(x, y), k.dotsSvg([at([x, y, CON.h])], { size: 0.5 }));
emit(D(CON.approve[0], CON.approve[1]), wrap('data-part="approvebtn"', cyl(CON.approve[0], CON.approve[1], 4.4, CON.h, 4, { tone: "hi" }, 22, 0.4)));
emit(D(CON.approve[0], CON.approve[1]), wrap('data-part="approvebtn" data-signal="approve"', k.lineSvg(k.ring(CON.approve[0], CON.approve[1], 4.4, CON.h + 4.05, P, 24), { tone: "lo" })));
emit(D(CON.approve[0], CON.approve[1]), k.lineSvg(k.ring(CON.approve[0], CON.approve[1], 6.4, CON.h + 0.05, P, 26), { tone: "faint" }));
emit(D(CON.reject[0], CON.reject[1]), cyl(CON.reject[0], CON.reject[1], 4.4, CON.h, 3, { tone: "lo" }, 22));
emit(D(CON.reject[0], CON.reject[1]), k.lineSvg(k.ring(CON.reject[0], CON.reject[1], 6.4, CON.h + 0.05, P, 26), { tone: "faint" }));
emit(D(CON.screen.x + CON.screen.w / 2, CON.screen.y + CON.screen.d / 2), slab(CON.screen, CON.h, 3, { tone: "lo" }, 4, 0.4));
emit(D(CON.screen.x + CON.screen.w / 2, CON.screen.y + CON.screen.d / 2),
  wrap('data-part="conscreen"',
    k.lineSvg(k.planOutline(k.insetPlan(CON.screen, 1.4), CON.h + 3, P), { tone: "faint" }) +
    [0, 1, 2].map((i) => {
      const x = CON.screen.x + 2.2, y = CON.screen.y + 3 + i * 4;
      const row = k.pathOf([[x, y], [x + 9.5, y], [x + 9.5, y + 1.5], [x, y + 1.5]].map(([px, py]) => at([px, py, CON.h + 3.05])), true);
      const mark = k.lineSvg(k.ring(CON.screen.x + 12, y + 0.75, 0.8, CON.h + 3.05, P, 12), { tone: "lo" });
      return `<g data-console-status="${i}"><path class="iso-line" data-tone="lo" d="${row}"/>${mark}</g>`;
    }).join("")));

// ===========================================================================
// RETRY: the lane that loops an exception back, with an attempt-counter dial
// ===========================================================================
{
  const [cx, cy] = RETRY.counter;
  emit(D(cx, cy), slab({ x: cx - 13, y: cy - 13, w: 26, d: 26, r: 3 }, 0, 7, { tone: "mid" }, 5, 0.7));
  emit(D(cx, cy), k.lineSvg(k.planOutline(k.insetPlan({ x: cx - 13, y: cy - 13, w: 26, d: 26, r: 3 }, 2), 7, P), { tone: "lo" }));
  for (const [x, y] of k.corners({ x: cx - 13, y: cy - 13, w: 26, d: 26, r: 3 }, 4)) emit(D(x, y), k.dotsSvg([at([x, y, 7])], { size: 0.5 }));
  emit(D(cx, cy), cyl(cx, cy, 8.5, 7, 7, { tone: "hi" }, 40, 0.6));
  emit(D(cx, cy), k.lineSvg(k.knurl(cx, cy, 8.5, 11.6, 14, 44, P, 0.3), { tone: "lo" }));
  emit(D(cx, cy), k.lineSvg(k.sideArc(cx, cy, 8.5, 11.6, P, 28), { tone: "faint" }));
  emit(D(cx, cy), k.lineSvg(k.ring(cx, cy, 6.8, 14, P, 36), { tone: "lo" }));
  emit(D(cx, cy), k.lineSvg(k.radialTicks(cx, cy, 6.4, 4, 1, 14.05, [1.4, 3], P), { tone: "mid" }));
  emit(D(cx, cy), wrap('data-part="rneedle"', k.lineSvg(k.lineOnTop([cx, cy + 2.4], [cx, cy - 5.4], 14.15, P), { tone: "lit", free: "start" })));
  emit(D(cx, cy), k.lineSvg(k.ring(cx, cy, 1.7, 14.1, P, 18), { tone: "mid" }));
}

// ===========================================================================
// COMPLETION: a final-state beacon on the desk
// ===========================================================================
emit(D(FINISH.beacon.x + 8, FINISH.beacon.y + 8), slab(FINISH.beacon, 0, 6, { tone: "mid" }, 5, 0.6));
emit(D(FINISH.beacon.x + 8, FINISH.beacon.y + 8), k.lineSvg(k.planOutline(k.insetPlan(FINISH.beacon, 2), 6, P), { tone: "lo" }));
emit(D(FINISH.beacon.x + 8, FINISH.beacon.y + 8), wrap('data-part="finish"', cyl(FINISH.beacon.x + 8, FINISH.beacon.y + 8, 5, 6, 7, { tone: "hi" }, 24, 0.5)));
emit(D(FINISH.beacon.x + 8, FINISH.beacon.y + 8), wrap('data-part="finish" data-signal="finish"', k.lineSvg(k.ring(FINISH.beacon.x + 8, FINISH.beacon.y + 8, 5, 13.1, P, 26), { tone: "lo" })));

// ===========================================================================
// Assemble
// ===========================================================================
const wrapK = (key, svg) => `<g data-k="${Number.isFinite(key) ? Math.round(key * 100) / 100 : -1e9}">${svg}</g>`;
const base = items.filter((i) => i.base).map((i) => wrapK(i.key, i.svg)).join("");
const rest = items.filter((i) => !i.base).sort((a, b) => a.key - b.key).map((i) => wrapK(i.key, i.svg)).join("");
const body = base + rest + `<g data-flow></g><g data-flags></g>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An AI workflow-orchestration desk with a gateway, scheduler and ticket reader sending events to a workstation over separate optical-fiber links. Its monitor validates workflow nodes in sequence, holds for human approval and shows integration retries.",
  body: [body],
});

const liveSource = readFileSync(join(HERE, "live.mjs"), "utf8");
const live = liveSource
  .replace(/__P__/g, JSON.stringify(P))
  .replace(/__DATA__/g, JSON.stringify(DATA))
  .replace(/__SCENE__/g, JSON.stringify({
    SOURCES, INTEGRATIONS, COMPUTE_LINKS, OPTIC_RX, DEC, TRANSFORM, TOOL, BAY, CON, RETRY, FINISH, NODE_X, NODE_NAMES,
    counter: { c: RETRY.counter, r: 6.4 },
  }));

const css = `
.iso-stage svg{overflow:visible}
.wf-screen-glass{fill:var(--anatomy-shade-0);stroke:none}
.wf-screen-ui .iso-face-text[data-tone="lit"]{fill:var(--anatomy-lit)}
.wf-screen-ui .iso-face-text[data-tone="green"]{fill:var(--anatomy-green)}
.wf-screen-ui .iso-face-text[data-tone="red"]{fill:var(--anatomy-red)}
.wf-screen-ui .wf-check[data-tone="green"]{stroke:var(--anatomy-green)}
.wf-fiber-trace{stroke-width:1.25}
[data-fiber-active] .tb-edge{stroke:var(--anatomy-lit)}
[data-app-active] .wf-app-name{fill:var(--anatomy-lit)}
[data-app-failed] .wf-app-name{fill:var(--anatomy-red)}
[data-app-active] .tb-edge{stroke:var(--anatomy-lit)}
[data-app-failed] .tb-edge{stroke:var(--anatomy-red)}
[data-compute-active] .wf-compute-lamp [data-tone="lit"]{fill:var(--anatomy-lit);stroke:var(--anatomy-lit)}
[data-fabric-active] .wf-fabric-lamp [data-tone="lit"]{fill:var(--anatomy-lit);stroke:var(--anatomy-lit)}
`;

const bodyHtml = k.plateHtml({
  fig: "Fig 1",
  title: "Workflow + compute orchestration",
  hint: "",
  readout: "event · rule · transform · human gate · integration · retry · complete",
  keys: [
    { mark: "lit", label: "Active workflow node and current validation" },
    { mark: "raised", label: "Gateway, timer and ticket reader connect to the workstation" },
    { mark: "dotted", label: "Optical-fiber links transmit events; validated graph nodes unlock in order" },
    { mark: "raised", label: "Server rack, GPU / TPU sled, optical fabric switch and optional quantum backend" },
  ],
  caption:
    "A webhook gateway, schedule timer or ticket reader sends an event over optical fiber to the workstation. Its monitor validates each workflow node before unlocking the next; a fiber backplane links the PC to a server rack, GPU / TPU accelerator sled and optional quantum cryostat. An optical fabric switch joins the rack uplink; the accelerator lights during transform, while quantum compute remains on standby. Sensitive writes wait for human approval; CRM, Payments or Helpdesk calls can retry after an error.",
  body: `<style>${CTL_CSS}${css}</style><div class="iso-stage" tabindex="0" role="region" aria-label="Workflow orchestration and compute bench: a live dashboard validates workflow nodes, connects external apps, and shows a cabled server rack, GPU and TPU accelerators, an optical fabric switch, and an optional quantum compute system">${svg}</div>`,
});

writeFileSync(
  join(HERE, theme === "light" ? "workflow-light.html" : "workflow.html"),
  k.pageHtml({ title: "AI workflow automation", theme, body: bodyHtml + CTL_HTML, script: kitScript() + live })
);

console.log("wrote", theme === "light" ? "workflow-light.html" : "workflow.html");
