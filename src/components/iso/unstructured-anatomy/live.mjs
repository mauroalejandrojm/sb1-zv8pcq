const P = __P__;
const DATA = __DATA__;
const S = __SCENE__;
const { WHITE, W_PLANE, LANE, tokX, tokY, VALID, STORE, recY, EXTRA, RESOLVE, REVIEW } = S;

const plane = sideMatrix([0, W_PLANE], 0, P, "left");
const pl = (wx, wz) => [wx, -wz];

// ---- Timeline (seconds) ---------------------------------------------------
const T_W = 1.8;    // marks written on the whiteboard
const T_TR = 3.8;   // scan head transcribes marks → tokens
const T_VA = 5.6;   // validator stamps the tokens
const T_CMP = 7.4;  // matcher compares against saved records
const T_EXT = 10.2; // extractor pulls fields from source documents
const T_RES = 13.4; // entity resolution · schema mapping · business rules
const T_REV = 16.8; // human review of conflicts · provenance kept
const T_CLEAR = 16.8;
const CYCLE = 18.5;

const STEPS = [
  { t: T_W - 0.1 }, { t: T_TR - 0.1 }, { t: T_VA - 0.05 }, { t: T_CMP - 0.05 },
  { t: T_EXT - 0.05 }, { t: T_RES - 0.05 }, { t: T_REV - 0.05 },
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const lerp = (a, b, f) => a + (b - a) * f;

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const boardLayer = svg.querySelector("[data-board]");
const scanLayer = svg.querySelector("[data-scan]");
const flowLayer = svg.querySelector("[data-flow]");
const extraLayer = svg.querySelector("[data-extra]");
const resolveLayer = svg.querySelector("[data-resolve]");
const reviewLayer = svg.querySelector("[data-review]");
const readout = document.querySelector("[data-readout]");
const toks = [0, 1, 2, 3, 4].map((i) => [...svg.querySelectorAll(`[data-tok="${i}"]`)]);
const recs = [0, 1, 2].map((i) => [...svg.querySelectorAll(`[data-rec="${i}"]`)]);
const docs = [0, 1, 2, 3, 4].map((i) => [...svg.querySelectorAll(`[data-doc="${i}"]`)]);
const fields = [0, 1, 2].map((i) => [...svg.querySelectorAll(`[data-field="${i}"]`)]);
const dups = [0, 1].map((i) => [...svg.querySelectorAll(`[data-dup="${i}"]`)]);
const origins = [0, 1, 2].map((i) => [...svg.querySelectorAll(`[data-origin="${i}"]`)]);
const vstamp = [...svg.querySelectorAll('[data-part="vstamp"]')];
const xjaw = [...svg.querySelectorAll('[data-part="xjaw"]')];
const lens = [...svg.querySelectorAll('[data-part="lens"]')];
const approve = [...svg.querySelectorAll('[data-part="approve"]')];
const rfields = [0, 1, 2].map((i) => [...svg.querySelectorAll(`[data-rfield="${i}"]`)]);
const still = matchMedia("(prefers-reduced-motion: reduce)");

let qi = 0, t0 = performance.now();
let mode = still.matches ? "manual" : "auto";
let stepIdx = still.matches ? STEPS.length - 1 : 0;
let frame = 0, visible = true;

const lift = (el, dz) => { if (dz) el.setAttribute("transform", translateAlong(P, [0, 0, dz])); else el.removeAttribute("transform"); };
const slideX = (el, dx) => { if (dx) el.setAttribute("transform", translateAlong(P, [dx, 0, 0])); else el.removeAttribute("transform"); };
const slideXY = (el, dx, dy) => { if (dx || dy) el.setAttribute("transform", translateAlong(P, [dx, dy, 0])); else el.removeAttribute("transform"); };

// --- playback controls ------------------------------------------------------
const btn = (n) => document.querySelector(`[data-btn="${n}"]`);
const qnameEl = document.querySelector("[data-qname]");
const stepEl = document.querySelector("[data-step]");
const nowT = () => clamp((performance.now() - t0) / 1000, 0, CYCLE);
const nearestStep = (t) => { let b = 0, bd = Infinity; STEPS.forEach((s, i) => { const d = Math.abs(s.t - t); if (d < bd) { bd = d; b = i; } }); return b; };
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

// scrawl: a wavy handwriting stroke in the whiteboard plane, drawn progressively
function scrawl(x0, z0, len, amp, phase, p) {
  const n = Math.max(2, Math.round(len / 3));
  let d = "";
  for (let i = 0; i <= n; i++) { const x = x0 + len * i / n; const z = z0 + amp * Math.sin(i * 0.85 + phase); d += (i ? "L" : "M") + x.toFixed(1) + " " + (-z).toFixed(1); }
  return `<path class="ig-ink" d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - p).toFixed(3)}" stroke-width="1.4"/>`;
}

// check mark in screen space centred on a world point
function checkAt(wx, wy, wz, p, tone = "ig-check") {
  const c = iso([wx, wy, wz], P);
  return `<path class="${tone}" d="M${c[0] - 3} ${c[1]}l2.4 2.6L${c[0] + 3.6} ${c[1] - 3}" stroke-width="1.6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${(1 - p).toFixed(2)}"/>`;
}
// short text-rule (a filled value slot) in world top plane
function slot(x0, x1, y, z, p, tone = "ig-live") {
  const xe = lerp(x0, x1, p);
  return lineSvg(lineOnTop([x0, y], [xe, y], z, P), { tone, free: true });
}

function render(t) {
  const ds = DATA[qi];
  const clearing = t >= T_CLEAR;
  const cl = clearing ? clamp((t - T_CLEAR) / (CYCLE - T_CLEAR), 0, 1) : 0;

  // --- 1. whiteboard: the question + notes get written
  {
    const marks = [
      { x: WHITE.X0 + 10, z: WHITE.Z1 - 14, len: 92, amp: 2.6, ph: 0, at: 0.2, w: 0.6 },
      { x: WHITE.X0 + 12, z: WHITE.Z1 - 30, len: 58, amp: 2.0, ph: 1, at: 0.9, w: 0.4 },
      { x: WHITE.X0 + 12, z: WHITE.Z1 - 39, len: 50, amp: 2.0, ph: 2, at: 1.2, w: 0.4 },
      { x: WHITE.X0 + 12, z: WHITE.Z1 - 48, len: 62, amp: 2.0, ph: 3, at: 1.5, w: 0.4 },
    ];
    let body = "";
    for (const m of marks) {
      const p = clearing ? 1 : ease(clamp((t - m.at) / m.w, 0, 1));
      if (p > 0) body += scrawl(m.x, m.z, m.len, m.amp, m.ph, p);
    }
    const sx = WHITE.X1 - 34;
    const sp = clearing ? 1 : ease(clamp((t - 1.5) / 0.4, 0, 1));
    if (sp > 0) {
      let sk = "";
      for (let b = 0; b < 4; b++) { const h = 6 + b * 3.4; sk += `<path class="ig-ink" d="M${sx + b * 7} ${-(WHITE.Z0 + 14)}V${-(WHITE.Z0 + 14 + h * sp)}" stroke-width="2.4"/>`; }
      body += `<g>${sk}</g>`;
    }
    boardLayer.innerHTML = `<g transform="${plane}">${body}</g>`;
    boardLayer.style.opacity = clearing ? String(1 - cl) : "1";
  }

  // --- 2. transcribe: scan head sweeps down, tokens appear in the lane
  const scanP = clearing ? 1 : ease(clamp((t - T_W) / (T_TR - T_W), 0, 1));
  {
    const sz = lerp(WHITE.Z1 - 4, WHITE.Z0 + 4, scanP);
    const on = t >= T_W && t < T_VA + 0.4 && !clearing;
    scanLayer.innerHTML = on
      ? `<g transform="${plane}"><path class="ig-scan" d="M${WHITE.X0 + 2} ${-sz}H${WHITE.X1 - 2}" stroke-width="1.4"/></g>`
      : "";
  }
  toks.forEach((els, i) => {
    const at = T_W + 0.2 + (i + 1) * (T_TR - T_W) / 5;
    const on = t >= at && !clearing;
    els.forEach((el) => { el.style.display = on ? "" : "none"; el.style.opacity = (t >= T_TR && !clearing) ? "1" : "0.55"; });
  });

  // --- 3. validate: stamp presses each token, green checks land
  let stampDz = 0;
  if (t >= T_VA - 1.6 && t < T_VA && !clearing) {
    const u = ((t - (T_VA - 1.6)) % 0.4) / 0.4;
    stampDz = -(u < 0.5 ? u / 0.5 : (1 - u) / 0.5) * 5;
  }
  vstamp.forEach((el) => lift(el, stampDz));

  // --- flow layer: validation checks + compare matcher arm
  {
    let f = "";
    if (t >= T_VA - 1.8 && !clearing) {
      for (let i = 0; i < 5; i++) {
        const at = T_VA - 1.8 + i * 0.26;
        const p = ease(clamp((t - at) / 0.35, 0, 1));
        if (p > 0) f += checkAt(tokX[i], tokY, 5.6, p);
      }
    }
    if (t >= T_VA && !clearing) {
      const p = ease(clamp((t - T_VA - 0.2) / (T_CMP - T_VA - 0.4), 0, 1));
      ds.matches.forEach((ri) => {
        const tx = STORE.x - 1, ty = recY[ri], tz = 7;
        const ex = lerp(VALID.x, tx, p), ey = lerp(VALID.y, ty, p), ez = lerp(14, tz, p);
        f += lineSvg(segment([VALID.x, VALID.y, 14], [ex, ey, ez], P), { tone: "hi" });
        if (p > 0.98) f += dotsSvg([iso([tx, ty, tz], P)], { size: 1.2, tone: "lit" });
      });
    }
    flowLayer.innerHTML = f;
  }
  recs.forEach((els, i) => els.forEach((el) => { el.style.opacity = (t >= T_VA + 0.6 && ds.matches.includes(i) && !clearing) ? "1" : "0.55"; }));

  // --- 4. extraction: jaw presses, source docs light, field tokens pull out
  let jawDz = 0;
  if (t >= T_CMP + 1.0 && t < T_EXT && !clearing) {
    const u = ((t - (T_CMP + 1.0)) % 0.4) / 0.4;
    jawDz = -(u < 0.5 ? u / 0.5 : (1 - u) / 0.5) * 4;
  }
  xjaw.forEach((el) => lift(el, jawDz));
  docs.forEach((els, i) => {
    const on = t >= T_CMP + i * 0.2 && !clearing;
    els.forEach((el) => { el.style.opacity = on ? "1" : "0.35"; });
  });
  fields.forEach((els, i) => {
    const at = T_CMP + 0.8 + i * 0.5;
    const on = t >= at && !clearing;
    const p = ease(clamp((t - at) / 0.5, 0, 1));
    // slide forward out of the rack as they're extracted
    const dy = lerp(8, 0, p);
    els.forEach((el) => { el.style.display = on ? "" : "none"; slideXY(el, 0, dy); });
  });
  {
    let e = "";
    // feed lines from docs → field tokens once extracted
    if (t >= T_CMP + 0.8 && !clearing) {
      EXTRA.chipX.forEach((cx, i) => {
        const p = ease(clamp((t - (T_CMP + 0.8 + i * 0.5)) / 0.5, 0, 1));
        if (p > 0.2) e += lineSvg(segment([EXTRA.docX[i + 1], EXTRA.docY, 8], [cx, EXTRA.chipY + lerp(8, 0, p), 4], P), { tone: "lo" });
      });
    }
    extraLayer.innerHTML = e;
  }

  // --- 5. entity resolution: duplicates merge, schema fields fill, rules pass
  {
    let r = "";
    // dedup: the two duplicate chips slide together and collapse into the card
    const merge = !clearing ? ease(clamp((t - T_RES + 1.4) / 1.0, 0, 1)) : 1 - cl;
    dups[0].forEach((el) => slideXY(el, merge * 6, 0));
    dups[1].forEach((el) => slideXY(el, merge * 6, merge * -14));
    dups.forEach((els, i) => els.forEach((el) => { el.style.display = (t >= T_EXT + 0.4 && !(clearing && cl > 0.6)) ? "" : "none"; el.style.opacity = String(1 - merge * (i === 1 ? 1 : 0)); }));
    // schema field slots fill in, each followed by a green business-rule check
    const cardL = RESOLVE.card.x + 6, cardR = RESOLVE.card.x + RESOLVE.card.w - 22;
    for (let fi = 0; fi < 3; fi++) {
      const at = T_EXT + 0.4 + fi * 0.55;
      const p = ease(clamp((t - at) / 0.5, 0, 1));
      if (p > 0 && !clearing) {
        r += slot(cardL, cardR, RESOLVE.fieldY[fi], 2.4, p);
        const cp = ease(clamp((t - at - 0.5) / 0.3, 0, 1));
        if (cp > 0) r += checkAt(RESOLVE.card.x + RESOLVE.card.w - 10, RESOLVE.fieldY[fi], 2.6, cp);
      }
    }
    // the resolved entity badge above the card
    const bp = ease(clamp((t - T_RES + 0.2) / 0.5, 0, 1));
    if (bp > 0 && !clearing) {
      const c0 = iso([RESOLVE.card.x + 8, RESOLVE.card.y - 6, 3], P);
      r += `<path class="ig-live" d="M${c0[0]} ${c0[1]}v${-8 * bp}" stroke-width="1.2"/>`;
      if (bp > 0.8) r += dotsSvg([iso([RESOLVE.card.x + 8, RESOLVE.card.y - 6, 3], P)], { size: 1.1, tone: "lit" });
    }
    resolveLayer.innerHTML = r;
    resolveLayer.style.opacity = clearing ? String(1 - cl) : "1";
  }

  // --- 6. human review: record arrives, lens inspects the conflict,
  //     approve stamps, provenance kept on every field
  const rBase = T_RES;
  const rOn = t >= rBase && !clearing;
  rfields.forEach((els) => els.forEach((el) => { el.style.display = rOn ? "" : "none"; }));
  {
    let v = "";
    if (rOn) {
      const cf = ds.conflictField;
      // lens glides onto the disputed field
      const mp = ease(clamp((t - (rBase + 0.4)) / 1.2, 0, 1));
      const my = lerp(REVIEW.magY, REVIEW.fieldY[cf], mp);
      lens.forEach((el) => el.setAttribute("transform", translateAlong(P, [0, my - REVIEW.magY, 0])));
      // red conflict dot on the disputed field
      const cp = ease(clamp((t - (rBase + 0.8)) / 0.4, 0, 1));
      if (cp > 0) {
        const c = iso([REVIEW.card.x + 16, REVIEW.fieldY[cf], 2.6], P);
        v += `<circle class="ig-reddot" r="${(2 * cp).toFixed(2)}" cx="${c[0]}" cy="${c[1]}"/>`;
      }
      // provenance: connectors from each origin marker back to its field
      const pp = clamp((t - (rBase + 1.2)) / 1.4, 0, 1);
      for (let fr = 0; fr < 3; fr++) {
        const gp = clamp(pp * 3 - fr, 0, 1);
        if (gp > 0) {
          v += lineSvg(segment([REVIEW.originX + 2, REVIEW.originY + fr * 8, 3], [REVIEW.card.x + 3, REVIEW.fieldY[fr], 2.4], P), { tone: "hi" });
          if (gp > 0.9) v += dotsSvg([iso([REVIEW.originX + 2, REVIEW.originY + fr * 8, 3], P)], { size: 0.9, tone: "lit" });
        }
      }
      // approve stamp presses down
      const ap = ease(clamp((t - (rBase + 2.2)) / 0.5, 0, 1));
      approve.forEach((el) => lift(el, -ap * 3));
      // resolved value lights on the conflict field
      const rp = ease(clamp((t - (rBase + 2.6)) / 0.5, 0, 1));
      if (rp > 0) v += slot(REVIEW.card.x + 6, REVIEW.card.x + 34, REVIEW.fieldY[cf], 2.6, rp, "ig-live");
    } else {
      lens.forEach((el) => el.removeAttribute("transform"));
      approve.forEach((el) => el.removeAttribute("transform"));
    }
    reviewLayer.innerHTML = v;
    reviewLayer.style.opacity = clearing ? String(1 - cl) : "1";
  }
  origins.forEach((els, i) => els.forEach((el) => { el.style.opacity = rOn ? "1" : "0.4"; }));

  // --- readout
  let text;
  if (clearing) text = `clearing · next record`;
  else if (t < T_W) text = `1) write — “${ds.q}”`;
  else if (t < T_TR) text = `2) transcribe — scan reads marks → ${toks.length} tokens`;
  else if (t < T_VA) text = `3) validate — schema + range checks pass`;
  else if (t < T_CMP) text = `4) compare — ${ds.matches.length}/${ds.records.length} saved records match`;
  else if (t < T_EXT) text = `5) extract — fields from ${ds.sources.join(" · ")}`;
  else if (t < T_RES) text = `6) resolve — ${ds.entity} · schema mapped · rules pass`;
  else text = `7) review — ${ds.conflict} → ${ds.resolved} · provenance kept`;

  const tag = mode === "manual" ? `  ·  step ${stepIdx + 1}/${STEPS.length}` : "";
  const full = text + tag;
  if (readout.textContent !== full) readout.textContent = full;
}

function tick(now) {
  frame = 0; if (mode !== "auto" || !visible) return;
  if (now - t0 >= CYCLE * 1000) { t0 = now; qi = (qi + 1) % DATA.length; updateHud(); }
  render(clamp((now - t0) / 1000, 0, CYCLE));
  frame = requestAnimationFrame(tick);
}
function run() { if (frame) cancelAnimationFrame(frame); frame = 0; if (visible && mode === "auto") frame = requestAnimationFrame(tick); }
const showManual = () => { render(STEPS[stepIdx].t); updateHud(); };

function play() { t0 = performance.now() - STEPS[stepIdx].t * 1000; mode = "auto"; updateHud(); run(); }
function pause() { stepIdx = nearestStep(nowT()); mode = "manual"; showManual(); }
const togglePlay = () => (mode === "auto" ? pause() : play());
function stepBy(d) { stepIdx = (stepIdx + d + STEPS.length) % STEPS.length; mode = "manual"; showManual(); }
function reset() { stepIdx = 0; if (mode === "auto") { t0 = performance.now(); updateHud(); } else showManual(); }
function goQ(n) { qi = (n + DATA.length) % DATA.length; t0 = performance.now(); if (mode === "auto") updateHud(); else showManual(); }
const wire = (n, fn) => { const b = btn(n); if (b) b.addEventListener("click", fn); };
wire("play", togglePlay); wire("next", () => stepBy(1)); wire("prev", () => stepBy(-1)); wire("reset", reset); wire("qnext", () => goQ(qi + 1)); wire("qprev", () => goQ(qi - 1));

stage.addEventListener("keydown", (e) => {
  if (e.key === " ") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowRight") { e.preventDefault(); goQ(qi + 1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); goQ(qi - 1); }
  else if (e.key === "ArrowDown" || e.key === ".") { e.preventDefault(); stepBy(1); }
  else if (e.key === "ArrowUp" || e.key === ",") { e.preventDefault(); stepBy(-1); }
});

if (mode === "manual") showManual(); else { updateHud(); run(); }
new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
