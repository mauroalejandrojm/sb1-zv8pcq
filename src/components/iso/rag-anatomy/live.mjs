const P = __P__;
const NOTES = __NOTES__;
const QUERIES = __QUERIES__;
const TOPK = __TOPK__;
const { MAPZ, HEADZ, PIVOTZ } = __GEOM__;

// ---- Timeline (seconds). A declarative cycle: every frame renders from t,
// so there is no state machine that can stall. ----------------------------
const SPLIT_END = 3.0;   // sheet feeds into the cutter, strips come out
const EMBED_END = 8.0;   // stamp presses; each strip becomes a planted pin
const DROP_END = 9.0;    // query pin drops onto its coordinate
const SEARCH_END = 14.0; // dividers swing to each note, nearest first
const CTX_END = 17.0;    // nearest TOPK clipped to the clipboard
const CYCLE = 18.0;      // then the table clears and a new query runs
const SLOT = (EMBED_END - SPLIT_END) / NOTES.length; // per-note embed slot
const SWING = (SEARCH_END - DROP_END) / NOTES.length; // per-note measure time

// Discrete beats for manual stepping. Each maps to a representative time t in
// the same declarative timeline, so manual and auto share a single render().
const STEPS = [
  { t: SPLIT_END - 0.05 },                                   // 0 split: sheet cut, strips out
  ...NOTES.map((_, i) => ({ t: SPLIT_END + (i + 1) * SLOT - 0.03 })), // 1..4: pin i planted
  { t: DROP_END + 0.02 },                                    // 5: query lands, dividers on nearest
  ...[1, 2, 3].map((k) => ({ t: DROP_END + (k + 1) * SWING - 0.05 })), // 6..8: dividers to rank k
  { t: SEARCH_END + 1.3 },                                   // 9: nearest TOPK clipped
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Semantic search = rank notes by distance from the query (nearest first).
function ranked(q) {
  return NOTES.map((n, i) => ({ i, n, d: dist(n.p, q.p) })).sort((a, b) => a.d - b.d);
}

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const searchLayer = svg.querySelector("[data-search]");
const readout = document.querySelector("[data-readout]");
const sheets = svg.querySelectorAll('[data-part="sheet"]');
const stamps = svg.querySelectorAll('[data-part="stamp"]');
const strips = NOTES.map((_, i) => [...svg.querySelectorAll(`[data-strip="${i}"]`)]);
const pins = [...svg.querySelectorAll("[data-pin]")];
const pinrings = [...svg.querySelectorAll("[data-pinring]")];
const cards = [0, 1, 2].map((c) => [...svg.querySelectorAll(`[data-card="${c}"]`)]);
const still = matchMedia("(prefers-reduced-motion: reduce)");

let qi = 0;              // current query index
let t0 = performance.now(); // wall-clock start of this cycle
let mode = still.matches ? "manual" : "auto"; // "auto" plays the loop; "manual" freezes on a step
let stepIdx = still.matches ? STEPS.length - 1 : 0;
let frame = 0, visible = true;

const setAll = (nodes, on) => nodes.forEach((el) => (el.style.display = on ? "" : "none"));
const lift = (el, dz) => {
  if (dz) el.setAttribute("transform", translateAlong(P, [0, 0, dz]));
  else el.removeAttribute("transform");
};

// --- playback controls (built in build.mjs) ----------------------------------
const btn = (n) => document.querySelector(`[data-btn="${n}"]`);
const qnameEl = document.querySelector("[data-qname]");
const stepEl = document.querySelector("[data-step]");
const nowT = () => clamp((performance.now() - t0) / 1000, 0, CYCLE);
const nearestStep = (t) => {
  let best = 0, bd = Infinity;
  STEPS.forEach((s, i) => { const d = Math.abs(s.t - t); if (d < bd) { bd = d; best = i; } });
  return best;
};
function updateHud() {
  const play = btn("play");
  if (play) {
    const playing = mode === "auto";
    play.textContent = playing ? "Pause" : "Play";
    play.setAttribute("aria-label", playing ? "Pause" : "Play");
    play.setAttribute("aria-pressed", playing ? "true" : "false");
    if (playing) play.setAttribute("data-active", ""); else play.removeAttribute("data-active");
  }
  if (qnameEl) qnameEl.textContent = QUERIES[qi].label;
  if (stepEl) stepEl.textContent = mode === "manual" ? `step ${stepIdx + 1}/${STEPS.length}` : "auto play";
}

// Build the query pin + dividers + search radius (iso-kit only).
function searchSvg(q, target, showDividers, pinLift) {
  const [qx, qy] = q.p;
  const out = [];
  // query pin: shaft + marker head, dropped by pinLift
  const sh = `<g transform="${translateAlong(P, [0, 0, pinLift])}">`;
  out.push(
    sh,
    solidSvg(cylinder(qx, qy, 0.9, MAPZ, HEADZ, P, 12), { tone: "lit" }),
    solidSvg(cylinder(qx, qy, 3.4, HEADZ - 1.4, 3.4, P, 22), { tone: "lit", lit: true }),
    `</g>`
  );
  if (showDividers && target) {
    // hinge post standing on the query pin + knuckle
    out.push(solidSvg(cylinder(qx, qy, 1.0, HEADZ, PIVOTZ - HEADZ, P, 12), { tone: "hi" }));
    out.push(solidSvg(cylinder(qx, qy, 4.4, PIVOTZ - 1.4, 3.0, P, 24), { tone: "hi" }));
    out.push(lineSvg(ring(qx, qy, 4.4, PIVOTZ + 1.6, P, 24), { tone: "lo" }));
    // swing leg: hinge out to the note it is measuring (a needle-like pointer)
    const [tx, ty] = target.n.p;
    out.push(lineSvg(segment([qx, qy, PIVOTZ + 1.5], [tx, ty, HEADZ + 1], P), { tone: "hi" }));
    out.push(dotsSvg([iso([tx, ty, HEADZ + 1], P)], { size: 1.0, tone: "lit" }));
    // search radius on the map = the measured distance
    out.push(lineSvg(ring(qx, qy, target.d, MAPZ + 0.25, P, 64), { tone: "lit", dashed: true }));
  }
  return out.join("");
}

function render(t) {
  const clearing = t >= CTX_END;
  const r = ranked(QUERIES[qi]);

  // --- 1. text splitting: sheet feeds right, strips appear, then are consumed
  const feed = clearing ? 46 * (1 - clamp((t - CTX_END) / (CYCLE - CTX_END), 0, 1)) : 46 * ease(t / SPLIT_END);
  sheets.forEach((el) => el.setAttribute("transform", translateAlong(P, [feed, 0, 0])));
  strips.forEach((els, i) => {
    const appear = t >= 1.6 + i * 0.4;
    const used = t >= SPLIT_END + (i + 0.5) * SLOT; // consumed when its pin plants
    const on = appear && !used && !clearing;
    els.forEach((el) => (el.style.display = on ? "" : "none"));
  });

  // --- 2. vector embedding: stamp presses, a pin drops onto its coordinate
  let stampDz = 0;
  if (t >= SPLIT_END && t < EMBED_END) {
    const u = ((t - SPLIT_END) % SLOT) / SLOT;
    stampDz = -(u < 0.5 ? u / 0.5 : (1 - u) / 0.5) * 16;
  }
  stamps.forEach((el) => el.setAttribute("transform", translateAlong(P, [0, 0, stampDz])));
  pins.forEach((el, i) => {
    const plant = SPLIT_END + (i + 0.5) * SLOT;
    const on = t >= plant && !clearing;
    el.style.display = on ? "" : "none";
    lift(el, on ? (1 - ease((t - plant) / 0.6)) * 30 : 0);
    if (pinrings[i]) pinrings[i].style.display = on && t >= plant + 0.6 ? "" : "none";
  });

  // --- 3. semantic search: query drops, dividers swing nearest-first
  const showQuery = t >= EMBED_END && !clearing;
  const pinLift = t < DROP_END ? (1 - clamp((t - EMBED_END) / (DROP_END - EMBED_END), 0, 1)) * 40 : 0;
  const showDiv = t >= DROP_END && !clearing;
  let target = null, note = null, d = 0, text = "";
  if (showDiv) {
    const k = t < SEARCH_END ? clamp(Math.floor((t - DROP_END) / SWING), 0, NOTES.length - 1) : 0;
    target = r[k]; note = target.n; d = target.d;
  }
  searchLayer.innerHTML = showQuery ? searchSvg(QUERIES[qi], target, showDiv, pinLift) : "";

  // --- 4. context generation: nearest TOPK clipped to the clipboard
  cards.forEach((els, c) => {
    const on = t >= SEARCH_END + c * 0.5 && t < CTX_END;
    els.forEach((el) => (el.style.display = on ? "" : "none"));
  });

  // --- readout narration
  if (clearing) text = `clearing the table · next query`;
  else if (t < SPLIT_END) text = `1) split — cutting the sheet into chunks`;
  else if (t < EMBED_END) text = `2) embed — pin ${clamp(Math.floor((t - SPLIT_END) / SLOT) + 1, 1, NOTES.length)}/${NOTES.length} plotted at its coordinate`;
  else if (t < DROP_END) text = `3) search — query “${QUERIES[qi].label}” plotted at (${QUERIES[qi].p.join(", ")})`;
  else if (t < SEARCH_END) text = `3) search — dividers reach ${note.label} · distance ${d.toFixed(1)}`;
  else if (t < CTX_END) text = `4) context — nearest ${TOPK} clipped (${QUERIES[qi].label})`;
  const tag = mode === "manual" ? `  ·  step ${stepIdx + 1}/${STEPS.length}` : "";
  const full = text + tag;
  if (readout.textContent !== full) readout.textContent = full;
  stage.setAttribute("aria-valuenow", String(TOPK));
}

// ---- auto loop: render from the wall clock; manual steps render on demand ----
function tick(now) {
  frame = 0;
  if (mode !== "auto" || !visible) return;
  if (now - t0 >= CYCLE * 1000) {   // wrap the cycle → declarative reset
    t0 = now;
    qi = (qi + 1) % QUERIES.length;
    updateHud();
  }
  render(clamp((now - t0) / 1000, 0, CYCLE));
  frame = requestAnimationFrame(tick);
}
function run() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  if (visible && mode === "auto") frame = requestAnimationFrame(tick);
}
const showManual = () => { render(STEPS[stepIdx].t); updateHud(); };

// ---- controls ---------------------------------------------------------------
function play() {            // manual → auto: resume the clock from this step
  t0 = performance.now() - STEPS[stepIdx].t * 1000;
  mode = "auto";
  updateHud();
  run();
}
function pause() {           // auto → manual: freeze on the nearest step
  stepIdx = nearestStep(nowT());
  mode = "manual";
  showManual();
}
const togglePlay = () => (mode === "auto" ? pause() : play());
function stepBy(delta) {
  stepIdx = (stepIdx + delta + STEPS.length) % STEPS.length;
  mode = "manual";
  showManual();
}
function reset() {
  stepIdx = 0;
  if (mode === "auto") { t0 = performance.now(); updateHud(); }
  else showManual();
}
function goQ(next) {
  qi = (next + QUERIES.length) % QUERIES.length;
  t0 = performance.now();
  if (mode === "auto") updateHud();
  else showManual();
}
const wire = (name, fn) => { const b = btn(name); if (b) b.addEventListener("click", fn); };
wire("play", togglePlay);
wire("next", () => stepBy(1));
wire("prev", () => stepBy(-1));
wire("reset", reset);
wire("qnext", () => goQ(qi + 1));
wire("qprev", () => goQ(qi - 1));

// keyboard: space play/pause · ←→ query · ↑↓ step
stage.addEventListener("keydown", (e) => {
  if (e.key === " ") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowRight") { e.preventDefault(); goQ(qi + 1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); goQ(qi - 1); }
  else if (e.key === "ArrowDown" || e.key === ".") { e.preventDefault(); stepBy(1); }
  else if (e.key === "ArrowUp" || e.key === ",") { e.preventDefault(); stepBy(-1); }
});

// ---- start: auto plays, reduced-motion opens on the settled last step -------
if (mode === "manual") showManual();
else { updateHud(); run(); }

new IntersectionObserver((es) => {
  visible = es[es.length - 1].isIntersecting;
  if (visible) run();               // no-op unless mode is auto
}, { rootMargin: "120px 0px" }).observe(stage);
