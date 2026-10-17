const P = __P__;
const DATA = __DATA__;
const SC = __SCENE__;

// ---------------------------------------------------------------------------
// Timeline (seconds). One declarative cycle: every frame is rendered from t,
// so there is no state machine that can stall.
// ---------------------------------------------------------------------------
const T = {
  fire: 1.4,      // a selected external source transmits an event
  atDecide: 3.0,  // the rule evaluator starts
  leaveDecide: 3.6,
  atArch: 5.0,    // transform stage begins
  leaveArch: 6.2,
  atGate: 7.6,    // sensitive action waits for a human
  approved: 9.0,  // approval unlocks the next node
  atTool: 10.2,   // integration call begins
  fail: 11.0,     // integration returns an error
  retryGo: 11.6,  // retry policy starts
  retryBack: 14.4,
  callOk: 15.4,   // second attempt succeeds
  atFinish: 17.0, // all workflow validations pass
  clear: 19.6,    // dashboard resets for the next workflow
  CYCLE: 21.6,
};

// One representative t per step, for manual stepping.
const STEPS = [0.9, 2.6, 5.4, 8.4, 10.6, 14.2, 17.2];

// Validation completion times unlock the next graph node.
const VALIDATED_AT = [T.atDecide, T.leaveDecide, T.leaveArch, T.approved, T.callOk, T.callOk, T.atFinish];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const ease = (t) => { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const win = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const pulse = (t, a, b, c, d) => ease(win(t, a, b)) - ease(win(t, c, d));

// --- DOM --------------------------------------------------------------------
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const screenNodes = SC.NODE_NAMES.map((_, i) => ({
  frame: svg.querySelector(`[data-screen-node="${i}"] [data-screen-frame]`),
  check: svg.querySelector(`[data-screen-node="${i}"] [data-screen-check]`),
  state: svg.querySelector(`[data-screen-state="${i}"]`),
}));
const screenLinks = SC.NODE_NAMES.slice(0, -1).map((_, i) => svg.querySelector(`[data-screen-link="${i}"]`));
const screenValidation = svg.querySelector("[data-screen-validation]");
const screenInput = svg.querySelector("[data-screen-input]");
const screenWorkflow = svg.querySelector("[data-screen-workflow]");
const consoleStatus = [...svg.querySelectorAll("[data-console-status]")];
const arm = svg.querySelector('[data-part="switcharm"]');
const needle = svg.querySelector('[data-part="rneedle"] path');
const button = [...svg.querySelectorAll('[data-part="approvebtn"]')];
const plug = [...svg.querySelectorAll('[data-part="plug"]')];
const signals = [...svg.querySelectorAll("[data-signal]")];
const fiberSources = SC.SOURCES.map((_, i) => [...svg.querySelectorAll(`[data-fiber-source="${i}"]`)]);
const rpcFiber = [...svg.querySelectorAll("[data-fiber-rpc]")];
const appFibers = SC.INTEGRATIONS.map((_, i) => [...svg.querySelectorAll(`[data-fiber-out="${i}"]`)]);
const appModules = SC.INTEGRATIONS.map((_, i) => svg.querySelector(`[data-app-module="${i}"]`));
const computeFibers = SC.COMPUTE_LINKS.map((_, i) => [...svg.querySelectorAll(`[data-compute-fiber="${i}"]`)]);
const computeModules = SC.COMPUTE_LINKS.map((_, i) => svg.querySelector(`[data-compute-module="${i}"]`));
const fabricLink = [...svg.querySelectorAll("[data-fabric-link]")];
const fabricSwitch = svg.querySelector("[data-fabric-switch]");

// --- small builders the live code needs -------------------------------------
function armAt(px, py, len, w, deg, z, h) {
  const a = (deg * Math.PI) / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const nx = -dy * (w / 2), ny = dx * (w / 2);
  const tipx = px + dx * len, tipy = py + dy * len;
  const ring = [[px + nx, py + ny], [tipx + nx, tipy + ny], [tipx - nx, tipy - ny], [px - nx, py - ny]];
  return solidSvg(extrude(ring, z, h, P, { convex: true, bevel: 0.5 }), { tone: "hi" });
}
const polar = (cx, cy, r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];

// --- playback state ---------------------------------------------------------
let qi = 0;
let t0 = performance.now();
let mode = still.matches ? "manual" : "auto";
let stepIdx = still.matches ? STEPS.length - 1 : 0;
let frame = 0, visible = true;
let armAngle = 55, needleAngle = 0;
let lastNow = performance.now();

const btn = (n) => document.querySelector(`[data-btn="${n}"]`);
const qnameEl = document.querySelector("[data-qname]");
const stepEl = document.querySelector("[data-step]");
const nowT = () => clamp((performance.now() - t0) / 1000, 0, T.CYCLE);
const nearestStep = () => {
  let best = 0, bd = Infinity;
  STEPS.forEach((s, i) => { const d = Math.abs(s - nowT()); if (d < bd) { bd = d; best = i; } });
  return best;
};
function updateHud() {
  const play = btn("play");
  if (play) {
    const on = mode === "auto";
    play.textContent = on ? "Pause" : "Play";
    play.setAttribute("aria-label", on ? "Pause" : "Play");
    play.setAttribute("aria-pressed", on ? "true" : "false");
    if (on) play.setAttribute("data-active", ""); else play.removeAttribute("data-active");
  }
  if (qnameEl) qnameEl.textContent = DATA[qi].label;
  if (stepEl) stepEl.textContent = mode === "manual" ? `step ${stepIdx + 1}/${STEPS.length}` : "auto play";
}

const signal = (name, on) => signals.forEach((g) => {
  if (g.dataset.signal !== name) return;
  g.querySelectorAll("path[data-tone]").forEach((p) => p.setAttribute("data-tone", on ? "lit" : p.dataset.off || "lo"));
});
const flow = (path, on) => { if (path) { if (on) path.setAttribute("data-flow", ""); else path.removeAttribute("data-flow"); } };
const move = (els, dz) => (Array.isArray(els) ? els : [els]).forEach((e) => { if (dz) e.setAttribute("transform", translateAlong(P, dz)); else e.removeAttribute("transform"); });

// --- render -----------------------------------------------------------------
function render(t, dt) {
  const ds = DATA[qi];
  const clearing = t >= T.clear;
  const ct = clearing ? win(t, T.clear, T.CYCLE) : 0;

  // 1. decision: the rule selector points at the validated branch
  const wantArm = t < T.atDecide - 0.8 ? 55 : DEC_YES();
  armAngle += (wantArm - armAngle) * (mode === "manual" ? 1 : Math.min(1, dt * 6));
  if (arm && Math.abs(armAngle - (arm.__a ?? -999)) > 0.12) {
    arm.__a = armAngle;
    arm.innerHTML = armAt(SC.DEC.pivot[0], SC.DEC.pivot[1], SC.DEC.armLen, SC.DEC.armW, armAngle, SC.DEC.plinth.h + 3, 3);
  }

  // 2. approval: pressing the operator control signals a validated gate
  const press = 1.6 * pulse(t, T.atGate + 0.3, T.atGate + 0.55, T.atGate + 0.9, T.atGate + 1.2) *
    (1 - ease(win(t, T.clear, T.clear + 0.8)));
  move(button, press ? [0, 0, -press] : null);

  // 3. integration: the plug retries after a transient error
  let pz = 7 * (1 - ease(win(t, T.atTool - 0.4, T.atTool)))
    + 7 * pulse(t, T.fail, T.fail + 0.4, T.callOk - 0.8, T.callOk - 0.4)
    + 7 * ease(win(t, T.clear, T.clear + 0.8));
  pz = clamp(pz, 0, 7);
  move(plug, pz ? [0, 0, pz] : null);

  // 4. the retry meter advances after a failed integration call
  const wantNeedle = t >= T.fail ? 90 : 0;
  needleAngle += (wantNeedle - needleAngle) * (mode === "manual" ? 1 : Math.min(1, dt * 5));
  if (needle) {
    const [cx, cy] = SC.counter.c;
    const a = (needleAngle * Math.PI) / 180;
    const tail = polar(cx, cy, 2.4, a + Math.PI), tip = polar(cx, cy, 5.4, a);
    needle.setAttribute("d", pathOf([iso(tail, P), iso(tip, P)]));
  }

  // 5. each dashboard node is locked until its predecessor validates.
  const activeSteps = [
    t >= T.fire - 0.6 && t < T.atDecide,
    t >= T.atDecide && t < T.leaveDecide,
    t >= T.atArch && t < T.leaveArch,
    t >= T.atGate && t < T.approved,
    t >= T.atTool && t < T.fail,
    t >= T.retryGo && t < T.callOk,
    t >= T.atFinish && t < T.clear,
  ];
  screenNodes.forEach(({ frame, check, state }, i) => {
    const complete = !clearing && t >= VALIDATED_AT[i];
    const failed = !clearing && i === 4 && t >= T.fail && t < T.callOk;
    const active = !clearing && activeSteps[i];
    const ready = !clearing && !complete && !failed && !active && (i === 0 || t >= VALIDATED_AT[i - 1]);
    const tone = complete ? "green" : failed ? "red" : active ? "lit" : ready ? "mid" : "faint";
    if (frame) frame.setAttribute("data-tone", tone);
    if (check) {
      check.setAttribute("data-tone", tone);
      check.style.opacity = complete ? "1" : "0";
    }
    if (state) {
      state.textContent = complete ? "PASS" : failed ? "RETRY" : active ? "RUN" : ready ? "READY" : "LOCK";
      state.setAttribute("data-tone", tone);
    }
  });
  screenLinks.forEach((link, i) => {
    if (link) link.setAttribute("data-tone", !clearing && t >= VALIDATED_AT[i] ? "green" : "faint");
  });
  if (screenWorkflow) screenWorkflow.textContent = ds.label.toUpperCase();
  if (screenValidation) {
    let message = "READY · WAITING FOR TRIGGER";
    let tone = "faint";
    const activeIndex = activeSteps.findIndex(Boolean);
    if (t >= T.atGate && t < T.approved) {
      message = "HUMAN APPROVAL REQUIRED · HOLD";
      tone = "lit";
    } else if (t >= T.fail && t < T.callOk) {
      message = "HTTP ERROR · RETRY POLICY ACTIVE";
      tone = "red";
    } else if (t >= T.atFinish && !clearing) {
      message = "ALL CHECKS PASS · WORKFLOW COMPLETE";
      tone = "green";
    } else if (t >= T.approved && t < T.atTool) {
      message = "APPROVED · NEXT NODE UNLOCKED";
      tone = "green";
    } else if (activeIndex >= 0) {
      message = `VALIDATING · ${ds.validations[activeIndex]}`;
      tone = "lit";
    }
    if (clearing) {
      message = "RESETTING · NODES LOCKED";
      tone = "faint";
    }
    screenValidation.textContent = message;
    screenValidation.setAttribute("data-tone", tone);
  }
  const fiberTx = t >= T.fire - 0.6 && t < T.leaveDecide && !clearing;
  SC.SOURCES.forEach((source, i) => {
    const active = fiberTx && i === ds.source;
    signal(`source${i}`, active);
    fiberSources[i].forEach((fiber) => {
      if (active) fiber.setAttribute("data-fiber-active", "");
      else fiber.removeAttribute("data-fiber-active");
      const trace = fiber.querySelector(".wf-fiber-trace");
      if (trace) {
        trace.setAttribute("data-tone", active ? "lit" : "blue");
        flow(trace, active);
      }
    });
  });
  signal("receiver", fiberTx);

  const appRequest = (t >= T.atTool && t < T.fail) || (t >= T.retryGo && t < T.callOk);
  const appFailure = t >= T.fail && t < T.retryGo;
  const appResponse = t >= T.callOk && t < T.clear;
  const appIndex = ds.integration;
  rpcFiber.forEach((fiber) => {
    if (appRequest) fiber.setAttribute("data-fiber-active", "");
    else fiber.removeAttribute("data-fiber-active");
    const trace = fiber.querySelector(".wf-fiber-trace");
    if (trace) {
      trace.setAttribute("data-tone", appFailure ? "red" : appRequest ? "lit" : "blue");
      flow(trace, appRequest);
    }
  });
  signal("toolinput", appRequest);
  SC.INTEGRATIONS.forEach((app, i) => {
    const selected = i === appIndex;
    const active = selected && appRequest;
    signal(`out${i}`, active);
    signal(`app${i}`, active);
    appModules[i]?.toggleAttribute("data-app-active", active || (selected && appResponse));
    appModules[i]?.toggleAttribute("data-app-failed", selected && appFailure);
    appFibers[i].forEach((fiber) => {
      if (active || (selected && appResponse)) fiber.setAttribute("data-fiber-active", "");
      else fiber.removeAttribute("data-fiber-active");
      const trace = fiber.querySelector(".wf-fiber-trace");
      if (trace) {
        trace.setAttribute("data-tone", appFailure && selected ? "red" : active ? "lit" : selected && appResponse ? "green" : "blue");
        flow(trace, active);
      }
    });
  });
  const rackActive = t >= T.fire && t < T.clear && !clearing;
  const acceleratorActive = t >= T.atArch && t < T.leaveArch && !clearing;
  const computeActive = [rackActive, acceleratorActive, false];
  SC.COMPUTE_LINKS.forEach((unit, i) => {
    const active = computeActive[i];
    signal(`compute${i}`, active);
    computeModules[i]?.toggleAttribute("data-compute-active", active);
    computeFibers[i].forEach((fiber) => {
      if (active) fiber.setAttribute("data-fiber-active", "");
      else fiber.removeAttribute("data-fiber-active");
      const trace = fiber.querySelector(".wf-fiber-trace");
      if (trace) {
        trace.setAttribute("data-tone", active ? "lit" : "blue");
        flow(trace, active);
      }
    });
  });
  fabricSwitch?.toggleAttribute("data-fabric-active", rackActive);
  signal("fabric", rackActive);
  fabricLink.forEach((fiber) => {
    if (rackActive) fiber.setAttribute("data-fiber-active", "");
    else fiber.removeAttribute("data-fiber-active");
    const trace = fiber.querySelector(".wf-fiber-trace");
    if (trace) {
      trace.setAttribute("data-tone", rackActive ? "lit" : "blue");
      flow(trace, rackActive);
    }
  });
  if (screenInput) {
    const sourceName = SC.SOURCES[ds.source].name;
    const appName = SC.INTEGRATIONS[appIndex].name;
    screenInput.textContent = appFailure
      ? `APP LINK · ${appName} · ERROR · RETRY QUEUED`
      : appRequest
        ? `APP LINK · ${appName} · REQUEST SENT`
        : appResponse
          ? `APP LINK · ${appName} · RESPONSE VALIDATED`
          : acceleratorActive
            ? "GPU / TPU · TRANSFORM INFERENCE"
            : fiberTx
              ? `OPTICAL RX · ${sourceName} · EVENT RECEIVED`
              : `FABRIC READY · QUANTUM ${clearing ? "STANDBY" : "OPTIONAL"}`;
    screenInput.setAttribute("data-tone", appFailure ? "red" : appRequest || acceleratorActive || fiberTx ? "lit" : appResponse || t >= T.leaveDecide && !clearing ? "green" : "faint");
  }
  consoleStatus.forEach((group, i) => {
    const active = i === 0
      ? t >= T.atGate && t < T.approved
      : i === 1
        ? t >= T.fail && t < T.callOk
        : t >= T.atFinish && !clearing;
    const passed = i === 0
      ? t >= T.approved && !clearing
      : i === 1
        ? t >= T.callOk && !clearing
        : false;
    group.querySelectorAll("[data-tone]").forEach((path) =>
      path.setAttribute("data-tone", active ? (i === 1 ? "red" : "lit") : passed ? "green" : "lo"));
  });

  // 6. hardware signals mirror the active workflow nodes
  signal("approve", t >= T.atGate && t < T.approved && !clearing);
  const toolLive = appRequest || (t >= T.callOk - 0.6 && !clearing);
  signal("tool", toolLive && !clearing);
  signal("finish", t >= T.atFinish && !clearing);

  // 7. readout follows the validated node.
  const idx = Math.min(VALIDATED_AT.filter((time) => t >= time).length, 6);
  let text = ds.steps[idx];
  if (t >= T.atFinish) text = `workflow complete · 7 steps validated · ${ds.label}`;
  if (clearing) text = `resetting workflow graph · next workflow`;
  const tag = mode === "manual" ? `  ·  step ${stepIdx + 1}/${STEPS.length}` : "";
  const full = text + tag;
  if (readout.textContent !== full) readout.textContent = full;
}

function DEC_YES() { return SC.DEC.yes; }

// --- loop -------------------------------------------------------------------
function tick(now) {
  frame = 0;
  if (mode !== "auto" || !visible) return;
  const dt = Math.min((now - lastNow) / 1000, 1 / 30);
  lastNow = now;
  if (now - t0 >= T.CYCLE * 1000) { t0 = now; qi = (qi + 1) % DATA.length; updateHud(); }
  render(clamp((now - t0) / 1000, 0, T.CYCLE), dt);
  frame = requestAnimationFrame(tick);
}
function run() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  lastNow = performance.now();
  if (visible && mode === "auto") frame = requestAnimationFrame(tick);
}
const showManual = () => { render(STEPS[stepIdx], 1 / 60); updateHud(); };

// --- controls ---------------------------------------------------------------
function play() { t0 = performance.now() - STEPS[stepIdx] * 1000; mode = "auto"; updateHud(); run(); }
function pause() { stepIdx = nearestStep(); mode = "manual"; showManual(); }
const togglePlay = () => (mode === "auto" ? pause() : play());
function stepBy(delta) { stepIdx = (stepIdx + delta + STEPS.length) % STEPS.length; mode = "manual"; showManual(); }
function reset() { stepIdx = 0; if (mode === "auto") { t0 = performance.now(); updateHud(); } else showManual(); }
function goQ(next) { qi = (next + DATA.length) % DATA.length; t0 = performance.now(); armAngle = 55; needleAngle = 0; if (mode === "auto") updateHud(); else showManual(); }
const wire = (name, fn) => { const b = btn(name); if (b) b.addEventListener("click", fn); };
wire("play", togglePlay);
wire("next", () => stepBy(1));
wire("prev", () => stepBy(-1));
wire("reset", reset);
wire("qnext", () => goQ(qi + 1));
wire("qprev", () => goQ(qi - 1));

stage.addEventListener("keydown", (e) => {
  if (e.key === " ") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); goQ(qi + 1); }
  else if (e.key === "ArrowDown") { e.preventDefault(); goQ(qi - 1); }
});
stage.addEventListener("pointerdown", () => { if (mode === "auto") pause(); });

readout.setAttribute("aria-live", "polite");
if (mode === "manual") showManual();
else { updateHud(); run(); }

new IntersectionObserver((es) => {
  visible = es[es.length - 1].isIntersecting;
  if (visible) run();
  else if (frame) { cancelAnimationFrame(frame); frame = 0; }
}, { rootMargin: "120px 0px" }).observe(stage);
