const P = __P__;
const DATA = __DATA__;
const { mx: MX, BOARD, PLOT_Y, RAIL_Y, RAIL_Z, MONTH_LABEL, dim } = __GEOM__;

const vz = (f) => BOARD.Z0 + f * (BOARD.Z1 - BOARD.Z0); // fraction 0..1 → height
const plane = sideMatrix([0, PLOT_Y], 0, P, "left");     // 2D→screen for board content
const pl = (wx, wz) => [wx, -wz];                        // world (x,z) → plane local

// ---- Timeline (seconds). A declarative cycle: every frame renders from t,
// so there is no state machine that can stall. ----------------------------
const T_Q = 1.8;    // question card feeds into its slot
const T_ING = 3.8;  // rows slide in from the hopper
const T_FIL = 5.8;  // filter knob closes the gate
const T_DIM = 7.8;  // dimension drum indexes
const T_DAT = 9.8;  // date-range window settles on Jan–Jun
const T_PLOT = 14.6; // the pen draws the six-point line
const T_ANOM = 17.2; // the anomaly is flagged and explained
const T_FCST = 20.4; // the forecast + uncertainty band grow
const T_CLEAR = 20.4;
const CYCLE = 22.0;  // then the table clears and the next question runs

// Discrete beats for manual stepping — one representative t per phase.
const STEPS = [
  { t: T_Q - 0.1 }, { t: T_ING - 0.1 }, { t: T_FIL - 0.1 }, { t: T_DIM - 0.1 },
  { t: T_DAT - 0.1 }, { t: T_PLOT - 0.2 }, { t: T_ANOM - 0.2 }, { t: T_FCST - 0.2 },
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const lerp = (a, b, f) => a + (b - a) * f;

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const chartLayer = svg.querySelector("[data-chart]");
const gantryLayer = svg.querySelector("[data-gantry]");
const dimLayer = svg.querySelector("[data-dim]");
const readout = document.querySelector("[data-readout]");
const qcard = [...svg.querySelectorAll('[data-part="qcard"]')];
const tiles = [0, 1, 2, 3, 4, 5].map((i) => [...svg.querySelectorAll(`[data-tile="${i}"]`)]);
const filgate = [...svg.querySelectorAll('[data-part="filgate"]')];
const datewin = [...svg.querySelectorAll('[data-part="datewin"]')];
const still = matchMedia("(prefers-reduced-motion: reduce)");

let qi = 0;              // current question index
let t0 = performance.now();
let mode = still.matches ? "manual" : "auto";
let stepIdx = still.matches ? STEPS.length - 1 : 0;
let frame = 0, visible = true;

const lift = (el, dz) => {
  if (dz) el.setAttribute("transform", translateAlong(P, [0, 0, dz]));
  else el.removeAttribute("transform");
};
const slideX = (el, dx) => {
  if (dx) el.setAttribute("transform", translateAlong(P, [dx, 0, 0]));
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
  if (qnameEl) qnameEl.textContent = DATA[qi].label;
  if (stepEl) stepEl.textContent = mode === "manual" ? `step ${stepIdx + 1}/${STEPS.length}` : "auto play";
}

function render(t) {
  const ds = DATA[qi];
  const hist = ds.series, N = hist.length, max = ds.max;
  const clearing = t >= T_CLEAR;
  const cl = clearing ? clamp((t - T_CLEAR) / (CYCLE - T_CLEAR), 0, 1) : 0;

  // --- 1. question: the card feeds down into its slot
  let qdz;
  if (!clearing) qdz = t < T_Q ? (1 - ease(t / T_Q)) * 22 : 0;
  else qdz = cl * 22;
  qcard.forEach((el) => lift(el, qdz));

  // --- 2. ingest: rows slide in from the hopper, then two are filtered out
  tiles.forEach((els, i) => {
    const t0i = T_Q + i * 0.16;
    const on = t >= t0i && !clearing;
    const slide = on ? (1 - ease((t - t0i) / 0.55)) * -32 : -32;
    const filtered = (i === 1 || i === 4) && t >= T_FIL + 0.5;
    els.forEach((el) => {
      el.style.display = on ? "" : "none";
      el.style.opacity = filtered ? "0.26" : "1";
      slideX(el, slide);
    });
  });

  // --- 3. re-cut controls: filter gate, dimension drum, date window
  let gateX, winX, dimA;
  if (!clearing) {
    gateX = ease(clamp((t - T_FIL) / (T_DIM - T_FIL), 0, 1)) * -7;
    winX = lerp(15, 0, ease(clamp((t - T_DAT) / (T_PLOT - T_DAT), 0, 1)));
    dimA = ease(clamp((t - T_DIM) / (T_DAT - T_DIM), 0, 1)) * 135;
  } else {
    gateX = (1 - cl) * -7; winX = cl * 15; dimA = (1 - cl) * 135;
  }
  filgate.forEach((el) => slideX(el, gateX));
  datewin.forEach((el) => slideX(el, winX));
  {
    const a = dimA * Math.PI / 180;
    const tip = [dim.x + dim.r * Math.cos(a), dim.y + dim.r * Math.sin(a), dim.z];
    dimLayer.innerHTML = lineSvg(segment([dim.x, dim.y, dim.z], tip, P), { tone: "lit" }) +
      dotsSvg([iso(tip, P)], { size: 0.8, tone: "lit" });
  }

  // --- 4. chart: the pen draws the history, then anomaly, then forecast
  const plotP = !clearing ? ease(clamp((t - T_DAT) / (T_PLOT - T_DAT), 0, 1)) : 1;
  const nF = plotP * N;
  const full = Math.min(N, Math.floor(nF));
  const frac = nF - full;
  const pts = [pl(MX[0], vz(hist[0] / max))];
  for (let i = 1; i < full; i++) pts.push(pl(MX[i], vz(hist[i] / max)));
  let headX = MX[0], headZ = vz(hist[0] / max);
  if (full < N) {
    const i0 = Math.max(0, full - 1), i1 = Math.min(N - 1, full);
    headX = lerp(MX[i0], MX[i1], frac);
    headZ = vz(lerp(hist[i0], hist[i1], frac) / max);
    if (full >= 1) pts.push(pl(headX, headZ));
  } else { headX = MX[N - 1]; headZ = vz(hist[N - 1] / max); }

  let chart = "";
  if (pts.length > 1) chart += `<path class="ig-live" d="${pathOf(pts)}"/>`;

  // anomaly: red dot + a small flag planted on the spike
  const showAnom = t >= T_PLOT && !clearing;
  if (showAnom) {
    const ax = MX[ds.anomaly], az = vz(hist[ds.anomaly] / max);
    const ap = ease(clamp((t - T_PLOT) / (T_ANOM - T_PLOT), 0, 1));
    chart += `<circle class="ig-reddot" cx="${ax}" cy="${-az}" r="2.2"/>`;
    const h = 13 * ap;
    chart += `<path class="ig-flag" d="M${ax} ${-az}V${-(az + h)}"/>`;
    if (ap > 0.4) chart += `<path class="ig-flagfill" d="M${ax} ${-(az + h)}L${ax + 9} ${-(az + h - 2.6)}L${ax} ${-(az + h - 5.2)}Z"/>`;
  }

  // forecast: dashed centre line + a widening translucent uncertainty band
  const showFc = t >= T_ANOM && !clearing;
  if (showFc) {
    const fp = ease(clamp((t - T_ANOM) / (T_FCST - T_ANOM), 0, 1));
    const lastX = MX[N - 1], lastZ = vz(hist[N - 1] / max);
    const fcN = ds.fc.length, rev = fp * fcN;
    const cf = Math.min(fcN, Math.floor(rev)), cfr = rev - cf;
    const cpts = [pl(lastX, lastZ)], up = [pl(lastX, lastZ)], lo = [pl(lastX, lastZ)];
    for (let i = 0; i < cf; i++) {
      cpts.push(pl(MX[N + i], vz(ds.fc[i] / max)));
      up.push(pl(MX[N + i], vz(Math.min(max, ds.fc[i] + ds.band[i]) / max)));
      lo.push(pl(MX[N + i], vz(Math.max(0, ds.fc[i] - ds.band[i]) / max)));
    }
    if (cf < fcN) {
      const cx = lerp(MX[N - 1], MX[N + cf], cfr);
      const cv = lerp(hist[N - 1], ds.fc[cf], cfr);
      cpts.push(pl(cx, vz(cv / max)));
      up.push(pl(cx, vz(Math.min(max, cv + ds.band[cf]) / max)));
      lo.push(pl(cx, vz(Math.max(0, cv - ds.band[cf]) / max)));
    }
    const cone = up.concat(lo.slice().reverse());
    chart += `<path class="ig-band" d="${pathOf(cone, true)}"/>`;
    chart += `<path class="ig-bandedge" d="${pathOf(up)}"/><path class="ig-bandedge" d="${pathOf(lo)}"/>`;
    chart += `<path class="ig-live" d="${pathOf(cpts)}" stroke-dasharray="3 2.4"/>`;
  }
  chartLayer.innerHTML = `<g transform="${plane}">${chart}</g>`;
  chartLayer.style.opacity = clearing ? String(1 - cl) : "1";

  // --- 5. the gantry carriage + pen follow the head of the line
  {
    let gan = solidSvg(slabOf({ x: headX - 4, y: RAIL_Y - 4, w: 8, d: 8, r: 1 }, RAIL_Z - 3, 6, P, 4, 0.5), { tone: "hi" });
    if (RAIL_Z - headZ > 1) gan += solidSvg(cylinder(headX, RAIL_Y, 0.7, headZ, RAIL_Z - headZ, P, 8), { tone: "hi" });
    gan += lineSvg(segment([headX, RAIL_Y, headZ], [headX, PLOT_Y, headZ], P), { tone: "hi" });
    gan += dotsSvg([iso([headX, PLOT_Y, headZ], P)], { size: 1.1, tone: "lit" });
    gantryLayer.innerHTML = gan;
    gantryLayer.style.opacity = clearing ? String(1 - cl) : "1";
  }

  // --- readout narration
  let text;
  if (clearing) text = `clearing the console · next question`;
  else if (t < T_Q) text = `1) question — “${ds.q}”`;
  else if (t < T_ING) text = `2) ingest — pulling 6 months of rows`;
  else if (t < T_FIL) text = `3) filter — channel=web · region=EU`;
  else if (t < T_DIM) text = `4) dimension — grouped by ${ds.label === "churn" ? "plan tier" : "month"}`;
  else if (t < T_DAT) text = `5) date range — Jan–Jun (+ forecast to Sep)`;
  else if (t < T_PLOT) text = `6) chart — plotting ${ds.label} ${hist[0]}→${hist[N - 1]}${ds.unit}`;
  else if (t < T_ANOM) text = `7) anomaly — ${MONTH_LABEL[ds.anomaly]} ${hist[ds.anomaly]}${ds.unit} · ${ds.why}`;
  else text = `8) forecast — Jul–Sep → ${ds.fc[ds.fc.length - 1]}${ds.unit} · ±${ds.band[ds.band.length - 1]}${ds.unit} (80% band)`;

  const tag = mode === "manual" ? `  ·  step ${stepIdx + 1}/${STEPS.length}` : "";
  const full2 = text + tag;
  if (readout.textContent !== full2) readout.textContent = full2;
}

// ---- auto loop: render from the wall clock; manual steps render on demand ----
function tick(now) {
  frame = 0;
  if (mode !== "auto" || !visible) return;
  if (now - t0 >= CYCLE * 1000) { t0 = now; qi = (qi + 1) % DATA.length; updateHud(); }
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
function play() { t0 = performance.now() - STEPS[stepIdx].t * 1000; mode = "auto"; updateHud(); run(); }
function pause() { stepIdx = nearestStep(nowT()); mode = "manual"; showManual(); }
const togglePlay = () => (mode === "auto" ? pause() : play());
function stepBy(delta) { stepIdx = (stepIdx + delta + STEPS.length) % STEPS.length; mode = "manual"; showManual(); }
function reset() { stepIdx = 0; if (mode === "auto") { t0 = performance.now(); updateHud(); } else showManual(); }
function goQ(next) { qi = (next + DATA.length) % DATA.length; t0 = performance.now(); if (mode === "auto") updateHud(); else showManual(); }
const wire = (name, fn) => { const b = btn(name); if (b) b.addEventListener("click", fn); };
wire("play", togglePlay);
wire("next", () => stepBy(1));
wire("prev", () => stepBy(-1));
wire("reset", reset);
wire("qnext", () => goQ(qi + 1));
wire("qprev", () => goQ(qi - 1));

stage.addEventListener("keydown", (e) => {
  if (e.key === " ") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowRight") { e.preventDefault(); goQ(qi + 1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); goQ(qi - 1); }
  else if (e.key === "ArrowDown" || e.key === ".") { e.preventDefault(); stepBy(1); }
  else if (e.key === "ArrowUp" || e.key === ",") { e.preventDefault(); stepBy(-1); }
});

if (mode === "manual") showManual();
else { updateHud(); run(); }

new IntersectionObserver((es) => {
  visible = es[es.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
