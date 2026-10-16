import * as React from "react";
import {
  fitProjection,
  slabOf,
  cylinder,
  lineOnTop,
  segment,
  iso,
  haloOf,
  planOutline,
  dotGrid,
  radialTicks,
  knurl,
  ring,
  translateAlong,
  type Plan,
} from "./iso-kit";
import { Solid, Line, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, useInView } from "./live";

const W = 440;
const H = 320;

const BENCH: Plan = { x: 2, y: 50, w: 136, d: 34, r: 4 };

const X_PARSE = 26;
const X_DECIDE = 44;
const X_TRANSFORM = 60;
const X_TOOL = 76;
const X_GATE = 92;
const X_END = 112;
const X_START = 10;
const STEPS_X = [X_PARSE, X_DECIDE, X_TRANSFORM, X_TOOL, X_GATE, X_END];

type Phase = "idle" | "running" | "held" | "paused" | "done";

const STATIONS: Record<string, string> = {
  trigger: "TRIGGER — AN EVENT OR SCHEDULE FIRES THE RUN",
  parse: "AI REASONING — READS THE CARD, PLANS THE ROUTE",
  decide: "DECIDE — THE SWITCH PICKS THE ROUTE",
  transform: "TRANSFORM — DATA RESHAPED BETWEEN STEPS",
  tool: "TOOL CALLS — ARMS REACH INTO CONNECTED SYSTEMS",
  gate: "HUMAN-IN-THE-LOOP — SENSITIVE STEPS WAIT FOR SIGN-OFF",
  desk: "CONTROL DESK — APPROVE · RETRY · STOP",
  tape: "AUDIT TRAIL — EVERY STEP ON THE TICKER",
  action: "ACTION — EXECUTED IN THE TARGET SYSTEM",
  exception: "EXCEPTIONS — FAILURES CAUGHT, ROUTED, RETRIED",
};

export default function WorkflowAutomation({ className }: { className?: string }) {
  const [focus, setFocus] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [retries, setRetries] = React.useState(0);

  const phaseRef = React.useRef<Phase>("idle");
  const targetX = React.useRef(X_GATE);
  const cardX = React.useRef(X_START);

  const wrap = React.useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const p = React.useMemo(
    () => fitProjection([[0, 34, 0], [140, 34, 0], [0, 86, -6], [140, 86, -6], [0, 34, 20], [140, 34, 20]], W, H, { pad: 26, headroom: 28 }),
    [],
  );

  // ---- static geometry ----
  const bench = React.useMemo(() => slabOf(BENCH, 0, 3, p), [p]);
  const legs = React.useMemo(() => [[8, 54], [8, 80], [132, 54], [132, 80]].map(([x, y]) => cylinder(x, y, 2, -6, 6, p, 18)), [p]);
  const halo = React.useMemo(() => haloOf(BENCH, 0, 2, p), [p]);

  const trigger = React.useMemo(
    () => ({ base: slabOf({ x: 5, y: 60, w: 8, d: 9, r: 1 }, 3, 6, p), button: cylinder(9, 64.5, 2.1, 9, 2.4, p, 24), cap: iso([9, 64.5, 11.6], p) }),
    [p],
  );

  const relayBodies = React.useMemo(
    () =>
      [X_PARSE - 4, X_DECIDE - 4, X_TRANSFORM - 4, X_TOOL - 4, X_GATE - 4].map((x) =>
        slabOf({ x, y: 52, w: 8, d: 12, r: 1 }, 3, 9, p),
      ),
    [p],
  );
  const relayLamps = React.useMemo(
    () => [X_PARSE, X_DECIDE, X_TRANSFORM, X_TOOL, X_GATE].map((x) => iso([x, 57, 12.4], p)), [p],
  );

  // reasoning head over the parse station
  const reasonHead = React.useMemo(
    () => ({
      left: slabOf({ x: 20, y: 52, w: 1.6, d: 14, r: 0.4 }, 3, 9, p),
      right: slabOf({ x: 30.4, y: 52, w: 1.6, d: 14, r: 0.4 }, 3, 9, p),
      bar: slabOf({ x: 20, y: 52, w: 12, d: 14, r: 1 }, 12, 2, p),
      dome: cylinder(26, 58, 2.4, 9, 3, p, 24),
      lens: ring(26, 58, 1.6, 9, p, 20),
      beam: segment([26, 58, 9], [26, 58, 6.4], p),
    }),
    [p],
  );

  // decide switch
  const decide = React.useMemo(
    () => ({
      main: lineOnTop([X_DECIDE - 4, 68], [X_GATE - 6, 68], 5.4, p),
      branch: segment([X_DECIDE + 2, 68, 5.4], [X_DECIDE + 5, 78, 5.4], p),
      blade: segment([X_DECIDE + 2, 68, 5.6], [X_DECIDE + 4.4, 71.5, 5.6], p),
    }),
    [p],
  );

  // transform stamp
  const stampPress = React.useMemo(
    () => ({
      left: slabOf({ x: 56, y: 52, w: 1.6, d: 14, r: 0.4 }, 3, 9, p),
      right: slabOf({ x: 64.4, y: 52, w: 1.6, d: 14, r: 0.4 }, 3, 9, p),
      bar: slabOf({ x: 56, y: 52, w: 10, d: 14, r: 1 }, 12, 1.8, p),
      stamp: slabOf({ x: 58.6, y: 56, w: 5, d: 5, r: 0.8 }, 8.6, 3.2, p),
    }),
    [p],
  );

  // tool arm + API sockets
  const toolArm = React.useMemo(
    () => ({
      shoulder: iso([X_TOOL, 58, 12.4], p),
      elbow: iso([X_TOOL + 2, 64, 14], p),
      hand: iso([X_TOOL - 2, 72, 11], p),
      cables: [segment([X_TOOL - 2, 60, 5.2], [X_TOOL - 6, 77.5, 4.6], p), segment([X_TOOL + 2, 60, 5.2], [X_TOOL + 3, 77.5, 4.6], p)].join(""),
    }),
    [p],
  );
  const apiBoxes = React.useMemo(
    () => [
      { body: slabOf({ x: X_TOOL - 8, y: 76, w: 6, d: 6, r: 0.8 }, 3, 5, p), face: dotGrid(X_TOOL - 7, 77, 2, 2, 2, 8.2, p) },
      { body: slabOf({ x: X_TOOL + 1, y: 76, w: 6, d: 6, r: 0.8 }, 3, 5, p), face: dotGrid(X_TOOL + 2, 77, 2, 2, 2, 8.2, p) },
    ],
    [p],
  );

  // approval gate
  const gate = React.useMemo(
    () => ({
      jawL: slabOf({ x: 88, y: 60, w: 1.6, d: 13, r: 0.4 }, 3, 8, p),
      jawR: slabOf({ x: 94.4, y: 60, w: 1.6, d: 13, r: 0.4 }, 3, 8, p),
      lintel: slabOf({ x: 88, y: 60, w: 8, d: 13, r: 1 }, 11, 1.4, p),
      post: cylinder(91, 66, 0.9, 11, 4, p, 12),
      lamp: iso([91, 66, 15.6], p),
      lens: ring(91.6, 67, 2.2, 13, p, 20),
      lensHandle: segment([93.6, 68.6, 13], [95, 70, 11.4], p),
    }),
    [p],
  );

  // action hopper
  const hopper = React.useMemo(() => slabOf({ x: 102, y: 58, w: 14, d: 10, r: 2 }, 3, 4, p), [p]);
  const doneCards = React.useMemo(
    () => [slabOf({ x: 104, y: 60, w: 3, d: 4, r: 0.4 }, 7, 1.3, p), slabOf({ x: 108.5, y: 60, w: 3, d: 4, r: 0.4 }, 7, 1.3, p)], [p],
  );

  // control desk
  const desk = React.useMemo(() => slabOf({ x: 52, y: 74, w: 34, d: 10, r: 2 }, 3, 2, p), [p]);
  const leverBases = React.useMemo(
    () => [58, 68, 78].map((x) => cylinder(x, 79, 1.2, 5, 2, p, 16)), [p],
  );
  const deskLamps = React.useMemo(() => [iso([54.5, 76.5, 5.4], p), iso([57, 76.5, 5.4], p), iso([59.5, 76.5, 5.4], p)], [p]);

  // audit ticker
  const printer = React.useMemo(() => slabOf({ x: 118, y: 72, w: 14, d: 8, r: 1 }, 3, 6, p), [p]);
  const printerKnob = React.useMemo(() => cylinder(132, 76, 1.6, 9, 1.6, p, 18), [p]);
  const tape = React.useMemo(() => slabOf({ x: 100, y: 82.5, w: 34, d: 2.6, r: 0.3 }, 3, 0.7, p), [p]);

  // exception bin
  const exceptionBin = React.useMemo(() => slabOf({ x: X_DECIDE + 4, y: 78, w: 8, d: 8, r: 1 }, 3, 3, p), [p]);
  const exceptionCard = React.useMemo(() => slabOf({ x: X_DECIDE + 5.4, y: 80.4, w: 3, d: 4, r: 0.4 }, 6, 1.3, p), [p]);

  // ---- the run: one clock moves the card along the line ----
  const time = React.useRef(0);
  const [, setTick] = React.useState(0);
  useLoop(
    (dt, calm) => {
      if (calm) {
        time.current = 1;
        setTick((n) => n + 1);
        return false;
      }
      time.current += dt;
      if (phaseRef.current === "running") {
        const dir = targetX.current >= cardX.current ? 1 : -1;
        cardX.current += dir * 26 * dt;
        if ((dir > 0 && cardX.current >= targetX.current) || (dir < 0 && cardX.current <= targetX.current)) {
          cardX.current = targetX.current;
          if (targetX.current === X_GATE) {
            phaseRef.current = "held";
            setPhase("held");
          } else if (targetX.current === X_END) {
            phaseRef.current = "done";
            setPhase("done");
          } else {
            // retry returned to the transform station — carry on to the gate
            targetX.current = X_GATE;
          }
        }
      }
      setTick((n) => n + 1);
      return true;
    },
    inView,
  );

  const t = time.current;
  const stampZ = -0.8 * (0.5 + 0.5 * Math.sin(t * 1.2));
  const leverAngles = ["approve", "retry", "stop"].map((key) => (focus === key ? 0.55 : 0.22));
  const leverTips = leverAngles.map((a, i) => {
    const x = [58, 68, 78][i]!;
    return [x + 3 * Math.sin(a), 79, 7 + 3 * Math.cos(a)] as [number, number, number];
  });

  const step = STEPS_X.filter((x) => cardX.current >= x - 0.2).length;

  const startRun = () => {
    if (phase === "paused") {
      phaseRef.current = "running";
      setPhase("running");
      return;
    }
    if (phase === "idle" || phase === "done") {
      cardX.current = X_START;
      targetX.current = X_GATE;
      setRetries(0);
      phaseRef.current = "running";
      setPhase("running");
    }
  };
  const approve = () => {
    if (phase === "held") {
      targetX.current = X_END;
      phaseRef.current = "running";
      setPhase("running");
    }
  };
  const retry = () => {
    if (phase === "held") {
      setRetries((n) => n + 1);
      targetX.current = X_TRANSFORM;
      phaseRef.current = "running";
      setPhase("running");
    }
  };
  const stopRun = () => {
    if (phase === "running") {
      phaseRef.current = "paused";
      setPhase("paused");
    }
  };

  const READOUTS: Record<Phase, string> = {
    idle: "IDLE — PRESS THE TRIGGER TO RUN",
    running: step < STEPS_X.length ? `RUN — STEP ${step + 1}/7 · STATE TRACKED` : `RUN — STEP 7/7 · CLOSING`,
    held: `HELD AT GATE — REVIEWER INSPECTS THE EVIDENCE · ${retries} RETR${retries === 1 ? "Y" : "IES"}`,
    paused: "STOPPED BY OPERATOR — PRESS TRIGGER TO RESUME",
    done: `COMPLETE — 7 STEPS · ${retries} RETR${retries === 1 ? "Y" : "IES"} · AUDIT SEALED`,
  };
  const readout = focus === null ? READOUTS[phase] : (STATIONS[focus] ?? READOUTS[phase]);

  const zone = (key: string, label: string, children: React.ReactNode, onClick?: () => void) => (
    <g
      key={key}
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={onClick}
      onPointerEnter={() => setFocus(key)}
      onPointerLeave={() => setFocus(null)}
      onFocus={() => setFocus(key)}
      onBlur={() => setFocus(null)}
      style={{ cursor: "pointer" }}
    >
      {children}
    </g>
  );
  const lit = (key: string) => focus === key;
  const lampTone = (x: number): "green" | "red" | "faint" => {
    if (x === X_GATE) return phase === "held" ? "red" : phase === "done" ? "green" : "faint";
    return cardX.current > x ? "green" : "faint";
  };

  return (
    <div ref={wrap}>
      <Plate
        fig="FIG B-03"
        title="Workflow Rail"
        hint="Press the trigger · work the desk"
        readout={readout}
        keys={[
          { mark: "raised", label: "Relay station" },
          { mark: "green", label: "Step passed" },
          { mark: "red", label: "Held / failed" },
          { mark: "dashed", label: "Exception path" },
        ]}
        caption="Not a script: a relay line where AI reads the card and plans the route, arms call live systems, and sensitive steps halt at the gate until a person at the desk approves or sends it back — every move printed on the ticker."
      >
        <IsoFigure width={W} height={H} label="Interactive isometric relay line executing a supervised workflow">
          <path className="iso-halo" d={halo} />

          {/* exception bin behind the line */}
          {zone("exception", STATIONS.exception, (
            <>
              <Solid paths={exceptionBin} tone={lit("exception") ? "hi" : "lo"} crease="none" />
              <Solid paths={exceptionCard} tone="mid" crease="none" />
              <Line d={planOutline({ x: X_DECIDE + 5.4, y: 80.4, w: 3, d: 4, r: 0.4 }, 7.3, p)} tone="red" />
            </>
          ))}

          {/* bench + relay line */}
          {legs.map((l, i) => (
            <Solid key={i} paths={l} tone="lo" crease="none" />
          ))}
          <Solid paths={bench} tone="lo" crease="faint" />
          <Line d={lineOnTop([X_START + 3, 68], [X_GATE + 2, 68], 5.4, p)} tone="mid" />
          <Line d={lineOnTop([X_GATE + 2, 68], [X_END - 4, 68], 5.4, p)} tone="mid" flow={phase === "running"} />

          {/* trigger */}
          {zone("trigger", STATIONS.trigger, (
            <>
              <Solid paths={trigger.base} tone={lit("trigger") ? "hi" : "mid"} crease="none" />
              <Solid paths={trigger.button} tone={lit("trigger") ? "hi" : "mid"} crease="none" />
              <Dots points={[trigger.cap]} size={0.9} tone={phase === "idle" ? "red" : "green"} pulse={phase === "idle"} />
            </>
          ), startRun)}

          {/* relay stations */}
          {relayBodies.map((body, i) => (
            <Solid key={i} paths={body} tone={lit(["parse", "decide", "transform", "tool", "gate"][i]!) ? "hi" : "mid"} crease="faint" />
          ))}
          {relayLamps.map((lamp, i) => (
            <Dots key={i} points={[lamp]} size={0.75} tone={lampTone([X_PARSE, X_DECIDE, X_TRANSFORM, X_TOOL, X_GATE][i]!)} pulse={[X_PARSE, X_DECIDE, X_TRANSFORM, X_TOOL, X_GATE][i] === X_GATE && phase === "held"} />
          ))}

          {/* AI reasoning head over the parse station */}
          {zone("parse", STATIONS.parse, (
            <>
              <Solid paths={reasonHead.left} tone={lit("parse") ? "hi" : "lo"} crease="none" />
              <Solid paths={reasonHead.right} tone={lit("parse") ? "hi" : "lo"} crease="none" />
              <Solid paths={reasonHead.bar} tone={lit("parse") ? "hi" : "mid"} crease="faint" />
              <Solid paths={reasonHead.dome} tone={lit("parse") ? "hi" : "mid"} crease="none" />
              <Line d={reasonHead.lens} tone="lo" />
              {Math.abs(cardX.current - X_PARSE) < 6 && phase === "running" ? <Line d={reasonHead.beam} tone="lit" /> : null}
            </>
          ))}

          {/* decide switch */}
          {zone("decide", STATIONS.decide, (
            <>
              <Line d={decide.blade} tone="hi" />
              <Line d={decide.branch} tone="red" dashed />
            </>
          ))}

          {/* transform stamp */}
          {zone("transform", STATIONS.transform, (
            <>
              <Solid paths={stampPress.left} tone={lit("transform") ? "hi" : "lo"} crease="none" />
              <Solid paths={stampPress.right} tone={lit("transform") ? "hi" : "lo"} crease="none" />
              <g transform={translateAlong(p, [0, 0, stampZ])}>
                <Solid paths={stampPress.stamp} tone="hi" crease="none" />
              </g>
              <Solid paths={stampPress.bar} tone={lit("transform") ? "hi" : "mid"} crease="faint" />
            </>
          ))}

          {/* tool arm into API sockets */}
          {zone("tool", STATIONS.tool, (
            <>
              <Line d={`M${toolArm.shoulder}L${toolArm.elbow}L${toolArm.hand}`} tone="hi" />
              <Dots points={[toolArm.shoulder, toolArm.elbow, toolArm.hand]} size={0.8} tone="hi" pulse={Math.abs(cardX.current - X_TOOL) < 6} />
              <Line d={toolArm.cables} tone="lo" />
              {apiBoxes.map((box, i) => (
                <g key={i}>
                  <Solid paths={box.body} tone={lit("tool") ? "hi" : "lo"} crease="none" />
                  <Dots points={box.face} size={0.35} tone="faint" />
                </g>
              ))}
            </>
          ))}

          {/* the card itself */}
          {phase !== "done" ? (
            <g>
              <Solid paths={slabOf({ x: cardX.current - 1.6, y: 66, w: 3.2, d: 4, r: 0.4 }, 5.2, 1.3, p)} tone="hi" crease="none" />
              {phase === "held" ? (
                <Line d={planOutline({ x: X_GATE - 1.6, y: 66, w: 3.2, d: 4, r: 0.4 }, 6.5, p)} tone="red" />
              ) : null}
              <Dots points={[iso([cardX.current, 68, 6.6], p)]} size={0.4} tone="faint" />
            </g>
          ) : null}

          {/* approval gate */}
          {zone("gate", STATIONS.gate, (
            <>
              <Solid paths={gate.jawL} tone={lit("gate") ? "hi" : "lo"} crease="none" />
              <Solid paths={gate.jawR} tone={lit("gate") ? "hi" : "lo"} crease="none" />
              <Solid paths={gate.lintel} tone={lit("gate") ? "hi" : "mid"} crease="faint" />
              <Solid paths={gate.post} tone="lo" crease="none" />
              <Dots points={[gate.lamp]} size={0.8} tone={phase === "held" ? "red" : "faint"} pulse={phase === "held"} />
              {phase === "held" ? (
                <>
                  <Line d={gate.lens} tone="hi" />
                  <Line d={gate.lensHandle} tone="lo" />
                </>
              ) : null}
            </>
          ))}

          {/* action hopper */}
          {zone("action", STATIONS.action, (
            <>
              <Solid paths={hopper} tone={lit("action") ? "hi" : "lo"} crease="none" />
              {doneCards.map((c, i) => (
                <Solid key={i} paths={c} tone={phase === "done" ? "hi" : "mid"} crease="none" />
              ))}
              {phase === "done" ? (
                <Dots points={[iso([111, 62, 8.6], p)]} size={0.6} tone="green" pulse />
              ) : null}
            </>
          ))}

          {/* control desk: approve / retry / stop */}
          <Solid paths={desk} tone={lit("approve") || lit("retry") || lit("stop") ? "hi" : "lo"} crease="faint" />
          <Dots points={[deskLamps[0]!]} size={0.6} tone={phase === "running" ? "green" : "faint"} pulse={phase === "running"} />
          <Dots points={[deskLamps[1]!]} size={0.6} tone={phase === "held" ? "red" : "faint"} pulse={phase === "held"} />
          <Dots points={[deskLamps[2]!]} size={0.6} tone={phase === "paused" ? "lit" : "faint"} />
          {[
            { key: "approve", action: approve, hint: "APPROVE — SIGN OFF, THE LINE RESUMES" },
            { key: "retry", action: retry, hint: "RETRY — SEND THE STEP BACK THROUGH" },
            { key: "stop", action: stopRun, hint: "STOP — HALT THE RUN WHERE IT STANDS" },
          ].map((lever, i) =>
            zone(lever.key, lever.hint, (
              <>
                <Solid paths={leverBases[i]!} tone="lo" crease="none" />
                <Line d={segment([[58, 68, 78][i]!, 79, 7], leverTips[i]!, p)} tone="hi" />
                <Dots points={[iso(leverTips[i]!, p)]} size={1} tone="hi" />
              </>
            ), lever.action),
          )}

          {/* audit ticker */}
          {zone("tape", STATIONS.tape, (
            <>
              <Solid paths={printer} tone={lit("tape") ? "hi" : "mid"} crease="none" />
              <Solid paths={printerKnob} tone="lo" crease="none" />
              <Line d={knurl(132, 76, 1.7, 9.2, 10.6, 6, p)} tone="faint" />
              <Solid paths={tape} tone="hi" crease="none" flat />
              {Array.from({ length: Math.min(14, step + retries) }, (_, i) => (
                <Line key={i} d={segment([101 + i * 1.9, 84.6, 3.7], [101 + i * 1.9, 83.6, 3.7], p)} tone="lo" />
              ))}
            </>
          ))}
        </IsoFigure>
      </Plate>
    </div>
  );
}