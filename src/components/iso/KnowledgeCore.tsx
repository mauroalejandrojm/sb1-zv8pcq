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
  translateAlong,
  type Plan,
} from "./iso-kit";
import { Solid, Line, Wire, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, follow, useInView } from "./live";

const W = 440;
const H = 320;

const BENCH: Plan = { x: 2, y: 50, w: 134, d: 34, r: 4 };

type Mode = "search" | "reason";

const STATIONS: Record<string, string> = {
  intake: "INTAKE — DOCS FED TO THE GRANULATOR",
  chunks: "CHUNKING — SLICED INTO PASSAGES",
  embed: "EMBEDDING — EACH CARD PUNCHED WITH ITS SIGNATURE",
  catalog: "VECTOR INDEX — CARDS FILED BY MEANING",
  permissions: "PERMISSIONS — RED BADGE LOCKS THE RESTRICTED DRAWER",
  retrieve: "RETRIEVAL — ARM PULLS CANDIDATES FROM EVERY SOURCE",
  rerank: "RERANK — THE BALANCE WEIGHS RELEVANCE",
  relate: "REASONING — GEARS FOLLOW RELATIONSHIPS BETWEEN FACTS",
  generate: "GENERATION — TYPEWRITER COMPOSES, CITATIONS ATTACHED",
  idleSearch: "SEARCH — LITERAL MATCHES ONLY",
  idleReason: "REASONING OVER CONNECTED KNOWLEDGE — NOT JUST SEARCH",
};

export default function KnowledgeCore({ className }: { className?: string }) {
  const [focus, setFocus] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<Mode>("reason");

  const wrap = React.useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const p = React.useMemo(
    () => fitProjection([[0, 34, 0], [138, 34, 0], [0, 86, -6], [138, 86, -6], [0, 34, 22], [138, 34, 22]], W, H, { pad: 26, headroom: 28 }),
    [],
  );

  // ---- static geometry ----
  const bench = React.useMemo(() => slabOf(BENCH, 0, 3, p), [p]);
  const legs = React.useMemo(() => [[8, 54], [8, 78], [130, 54], [130, 78]].map(([x, y]) => cylinder(x, y, 2, -6, 6, p, 18)), [p]);
  const halo = React.useMemo(() => haloOf(BENCH, 0, 2, p), [p]);

  // granulator: documents in, chunk cards out
  const intakeBody = React.useMemo(() => slabOf({ x: 6, y: 52, w: 15, d: 15, r: 1 }, 3, 12, p), [p]);
  const drum = React.useMemo(() => cylinder(13.5, 59.5, 3, 12, 5, p, 28), [p]);
  const drumKnurl = React.useMemo(() => knurl(13.5, 59.5, 3.1, 12.4, 16.6, 10, p), [p]);
  const feedTray = React.useMemo(() => slabOf({ x: 5, y: 70, w: 13, d: 9, r: 1 }, 3, 1.5, p), [p]);
  const feedDocs = React.useMemo(
    () => ({
      board: slabOf({ x: 7, y: 71.5, w: 2.2, d: 6.4, r: 0.5 }, 4.5, 6, p),
      stack: [slabOf({ x: 10.5, y: 72, w: 3.4, d: 5, r: 0.6 }, 4.5, 2.4, p), slabOf({ x: 11, y: 71.4, w: 3.2, d: 4.6, r: 0.6 }, 6.9, 2.4, p)],
      roll: cylinder(15.5, 75.5, 1.9, 4.5, 3.8, p, 20),
    }),
    [p],
  );
  const chunkShelf = React.useMemo(() => slabOf({ x: 24, y: 54, w: 9, d: 12, r: 0.8 }, 3, 1, p), [p]);
  const chunkCards = React.useMemo(
    () => [0, 1, 2, 3].map((i) => slabOf({ x: 25 + i * 2.1, y: 58, w: 1.8, d: 4, r: 0.3 }, 4, 1.6, p)), [p],
  );

  // embedding press
  const press = React.useMemo(
    () => ({
      left: slabOf({ x: 37, y: 52, w: 2.2, d: 14, r: 0.5 }, 3, 12, p),
      right: slabOf({ x: 45, y: 52, w: 2.2, d: 14, r: 0.5 }, 3, 12, p),
      bar: slabOf({ x: 36, y: 52, w: 12.4, d: 14, r: 1 }, 15, 2, p),
      stamp: slabOf({ x: 39.5, y: 55.5, w: 5.4, d: 6, r: 0.8 }, 9, 3.4, p),
      guide: segment([42.2, 55.5, 15], [42.2, 55.5, 12.4], p),
    }),
    [p],
  );
  const punchShelf = React.useMemo(() => slabOf({ x: 50, y: 55, w: 9, d: 11, r: 0.8 }, 3, 1, p), [p]);
  const punchCards = React.useMemo(
    () => [
      { paths: slabOf({ x: 51.2, y: 58, w: 1.8, d: 4, r: 0.3 }, 4, 1.6, p), dots: dotGrid(51.5, 58.6, 2, 3, 0.55, 5.7, p) },
      { paths: slabOf({ x: 54.4, y: 58, w: 1.8, d: 4, r: 0.3 }, 4, 1.6, p), dots: dotGrid(54.7, 58.6, 2, 3, 0.55, 5.7, p) },
      { paths: slabOf({ x: 57.6, y: 58, w: 1.8, d: 4, r: 0.3 }, 4, 1.6, p), dots: dotGrid(57.9, 58.6, 2, 3, 0.55, 5.7, p) },
    ],
    [p],
  );

  // card catalog (the vector index)
  const catalogBody = React.useMemo(() => slabOf({ x: 62, y: 36, w: 24, d: 11, r: 1 }, 0, 18, p), [p]);
  const drawers = React.useMemo(
    () => [4.5, 10.5, 16.5].map((z) => slabOf({ x: 64, y: 45, w: 8, d: 3, r: 0.5 }, z, 4.2, p)), [p],
  );
  const drawerHandles = React.useMemo(() => [7, 13, 19].map((z) => segment([66, 48.4, z], [69, 48.4, z], p)).join(""), [p]);
  const drawerCards = React.useMemo(() => [7, 13, 19].map((z) => dotGrid(65, 45.6, 5, 1, 1.5, z + 2.2, p)), [p]);

  // question console with the mode lever
  const consoleBody = React.useMemo(() => slabOf({ x: 62, y: 73, w: 15, d: 9, r: 2 }, 3, 6, p), [p]);
  const consoleTop = React.useMemo(() => slabOf({ x: 60, y: 71, w: 19, d: 11, r: 2 }, 9, 2, p), [p]);
  const questionCard = React.useMemo(() => slabOf({ x: 64, y: 74, w: 0.9, d: 5.4, r: 0.2 }, 11, 4.5, p), [p]);
  const leverBase = React.useMemo(() => cylinder(73, 76, 1.2, 11, 2, p, 16), [p]);
  const lampSearch = React.useMemo(() => iso([66, 79.5, 11.3], p), [p]);
  const lampReason = React.useMemo(() => iso([69, 79.5, 11.3], p), [p]);

  // retrieval arm: pantograph from console to drawers
  const arm = React.useMemo(
    () => ({
      joints: [iso([70, 74, 13], p), iso([63, 62, 16], p), iso([60, 50, 18], p), iso([65.5, 45.5, 14], p)] as [number, number][],
      deepJoint: iso([69.5, 45.5, 9], p),
    }),
    [p],
  );

  // rerank balance
  const balance = React.useMemo(
    () => ({
      post: cylinder(88, 60, 1.4, 3, 9, p, 16),
      beam: slabOf({ x: 81, y: 58.4, w: 14.4, d: 3, r: 0.6 }, 12.4, 1.4, p),
      panLeft: slabOf({ x: 81.5, y: 60, w: 4.6, d: 4.2, r: 0.6 }, 10.2, 0.9, p),
      panRight: slabOf({ x: 90.5, y: 60, w: 4.6, d: 4.2, r: 0.6 }, 10.2, 0.9, p),
      hangL: segment([83.8, 62, 12.4], [83.8, 62, 11.1], p),
      hangR: segment([92.7, 62, 12.4], [92.7, 62, 11.1], p),
    }),
    [p],
  );
  const beamCards = React.useMemo(
    () => [slabOf({ x: 82.2, y: 61, w: 2, d: 2.8, r: 0.3 }, 11.1, 1.4, p), slabOf({ x: 91.2, y: 61, w: 2, d: 2.8, r: 0.3 }, 11.1, 1.4, p)], [p],
  );
  const rejectBin = React.useMemo(() => slabOf({ x: 84, y: 72, w: 9, d: 8, r: 1 }, 3, 2.6, p), [p]);
  const rejectCards = React.useMemo(
    () => [slabOf({ x: 85.5, y: 74.5, w: 2.2, d: 3, r: 0.3 }, 5.6, 1.4, p), slabOf({ x: 88.5, y: 74.5, w: 2.2, d: 3, r: 0.3 }, 5.6, 1.4, p)], [p],
  );

  // reasoning gears + linked facts
  const gears = React.useMemo(
    () => [
      { c: [100.5, 56] as [number, number], r: 2.6, body: cylinder(100.5, 56, 2.6, 3, 4, p, 24), knurl: knurl(100.5, 56, 2.7, 3.4, 6.6, 9, p) },
      { c: [106.5, 60] as [number, number], r: 2.2, body: cylinder(106.5, 60, 2.2, 3, 4, p, 24), knurl: knurl(106.5, 60, 2.3, 3.4, 6.6, 8, p) },
      { c: [104, 50] as [number, number], r: 1.8, body: cylinder(104, 50, 1.8, 3, 4, p, 20), knurl: knurl(104, 50, 1.9, 3.4, 6.6, 7, p) },
    ],
    [p],
  );
  const gearLinks = React.useMemo(() => [segment([100.5, 56, 7], [106.5, 60, 7], p), segment([100.5, 56, 7], [104, 50, 7], p)].join(""), [p]);
  const factRack = React.useMemo(() => slabOf({ x: 98, y: 66, w: 13, d: 8, r: 0.8 }, 3, 1.2, p), [p]);
  const factCards = React.useMemo(
    () => [slabOf({ x: 99.5, y: 67.5, w: 2.4, d: 3.4, r: 0.3 }, 4.2, 1.6, p), slabOf({ x: 103.5, y: 67.5, w: 2.4, d: 3.4, r: 0.3 }, 4.2, 1.6, p), slabOf({ x: 107.5, y: 67.5, w: 2.4, d: 3.4, r: 0.3 }, 4.2, 1.6, p)], [p],
  );
  const factWires = React.useMemo(
    () => [segment([101.9, 69.2, 5.8], [104.9, 69.2, 5.8], p), segment([105.9, 69.2, 5.8], [108.9, 69.2, 5.8], p)].join(""), [p],
  );

  // generation typewriter
  const typer = React.useMemo(
    () => ({
      body: slabOf({ x: 116, y: 72, w: 19, d: 11, r: 1 }, 3, 5, p),
      keys: dotGrid(118, 76.6, 7, 2, 2, 5.2, p),
      roll: cylinder(118.5, 73.5, 1.8, 8, 5, p, 20),
      carriage: slabOf({ x: 118, y: 74, w: 13, d: 5.5, r: 0.5 }, 8, 1.6, p),
      sheet: slabOf({ x: 121, y: 76, w: 0.9, d: 6.4, r: 0.2 }, 9.6, 7.4, p),
    }),
    [p],
  );
  const citations = React.useMemo(
    () => ({
      toFacts: segment([121.4, 79, 14.5], [108.9, 69.4, 6.5], p),
      toCatalog: segment([121.4, 78.4, 13], [72.5, 47.5, 12], p),
      toConsole: segment([121.4, 77.6, 12], [64.9, 76.6, 13.5], p),
    }),
    [p],
  );

  // permissions: the arm is blocked at the red-badged drawer
  const permissionLine = React.useMemo(() => segment([69.5, 45.5, 12], [64, 45.5, 17], p), [p]);
  const redBadge = React.useMemo(() => iso([70.5, 48.4, 14.6], p), [p]);

  // ---- one clock for the moving parts ----
  const time = React.useRef(0);
  const [, setTick] = React.useState(0);
  useLoop(
    (dt, calm) => {
      if (calm) {
        time.current = 1.1;
        setTick((n) => n + 1);
        return false;
      }
      time.current += dt;
      setTick((n) => n + 1);
      return true;
    },
    inView,
  );

  const t = time.current;
  const stampZ = -0.85 * (0.5 + 0.5 * Math.sin(t * 1.1));
  const leverA = mode === "reason" ? 0.5 : -0.5;
  const leverTip: [number, number, number] = [73 + 3.4 * Math.sin(leverA), 76, 13 + 3.4 * Math.cos(leverA)];
  const beamBob = 0.35 * Math.sin(t * 1.6);
  const gearDots = gears.map((g, i) => iso([g.c[0] + (g.r - 0.5) * Math.cos(t * (0.9 + i * 0.35) + i), g.c[1] + (g.r - 0.5) * Math.sin(t * (0.9 + i * 0.35) + i), 7.3], p));

  const readout =
    focus === null
      ? mode === "reason"
        ? STATIONS.idleReason
        : STATIONS.idleSearch
      : (STATIONS[focus] ?? STATIONS.idleReason);

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
  const dimmed = mode === "search";

  return (
    <div ref={wrap}>
      <Plate
        fig="FIG B-01"
        title="Knowledge Core"
        hint="Hover the line · flip the lever"
        readout={readout}
        keys={[
          { mark: "raised", label: "Machine station" },
          { mark: "blue", label: "Citation / source link" },
          { mark: "red", label: "Access denied" },
          { mark: "dashed", label: "Relationship followed" },
        ]}
        caption="Not a search box: documents are chunked, embedded and filed; the arm retrieves, the balance reranks, gears follow relationships, and the typewriter answers with citations — permission-gated at the drawer."
      >
        <IsoFigure width={W} height={H} label="Interactive isometric machine that answers questions from company knowledge with citations">
          <path className="iso-halo" d={halo} />

          {/* intake: documents to the granulator */}
          {zone("intake", STATIONS.intake, (
            <>
              <Solid paths={intakeBody} tone={lit("intake") ? "hi" : "mid"} crease="faint" />
              <Solid paths={drum} tone={lit("intake") ? "hi" : "lo"} crease="none" />
              <Line d={drumKnurl} tone="faint" />
              <Solid paths={feedTray} tone={lit("intake") ? "hi" : "lo"} crease="none" />
              <Solid paths={feedDocs.board} tone={lit("intake") ? "hi" : "mid"} crease="none" />
              {feedDocs.stack.map((s, i) => (
                <Solid key={i} paths={s} tone={lit("intake") ? "hi" : "mid"} crease="none" />
              ))}
              <Solid paths={feedDocs.roll} tone={lit("intake") ? "hi" : "mid"} crease="none" />
            </>
          ))}

          {/* bench */}
          {legs.map((l, i) => (
            <Solid key={i} paths={l} tone="lo" crease="none" />
          ))}
          <Solid paths={bench} tone="lo" crease="faint" />

          {/* chunking */}
          {zone("chunks", STATIONS.chunks, (
            <>
              <Solid paths={chunkShelf} tone={lit("chunks") ? "hi" : "lo"} crease="none" />
              {chunkCards.map((c, i) => (
                <Solid key={i} paths={c} tone={lit("chunks") ? "hi" : "mid"} crease="none" />
              ))}
              <Line d={lineOnTop([22, 58], [24, 58], 8, p)} tone="mid" flow />
            </>
          ))}

          {/* embedding press */}
          {zone("embed", STATIONS.embed, (
            <>
              <Solid paths={press.left} tone={lit("embed") ? "hi" : "lo"} crease="none" />
              <Solid paths={press.right} tone={lit("embed") ? "hi" : "lo"} crease="none" />
              <Line d={press.guide} tone="faint" />
              <g transform={translateAlong(p, [0, 0, stampZ])}>
                <Solid paths={press.stamp} tone="hi" crease="none" />
              </g>
              <Solid paths={press.bar} tone={lit("embed") ? "hi" : "mid"} crease="faint" />
              <Solid paths={punchShelf} tone={lit("embed") ? "hi" : "lo"} crease="none" />
              {punchCards.map((c, i) => (
                <g key={i}>
                  <Solid paths={c.paths} tone={lit("embed") ? "hi" : "mid"} crease="none" />
                  <Dots points={c.dots} size={0.3} tone={dimmed ? "faint" : "blue"} />
                </g>
              ))}
            </>
          ))}

          {/* card catalog = vector index */}
          {zone("catalog", STATIONS.catalog, (
            <>
              <Solid paths={catalogBody} tone={lit("catalog") ? "hi" : "mid"} crease="faint" />
              {drawers.map((d, i) => (
                <Solid key={i} paths={d} tone={lit("catalog") ? "hi" : "lo"} crease="none" />
              ))}
              <Line d={drawerHandles} tone="lo" />
              {drawerCards.map((dots, i) => (
                <Dots key={i} points={dots} size={0.32} tone="faint" />
              ))}
            </>
          ))}

          {/* question console + mode lever */}
          {zone("console", mode === "reason" ? STATIONS.idleReason : STATIONS.idleSearch, (
            <>
              <Solid paths={consoleBody} tone={lit("console") ? "hi" : "mid"} crease="none" />
              <Solid paths={consoleTop} tone={lit("console") ? "hi" : "lo"} crease="faint" />
              <Solid paths={questionCard} tone="hi" crease="none" />
              <Solid paths={leverBase} tone="lo" crease="none" />
              <Line d={segment([73, 76, 13], leverTip, p)} tone="hi" />
              <Dots points={[iso(leverTip, p)]} size={1.1} tone="hi" />
              <Dots points={[lampSearch]} size={0.8} tone={mode === "search" ? "red" : "faint"} pulse={mode === "search"} />
              <Dots points={[lampReason]} size={0.8} tone={mode === "reason" ? "green" : "faint"} pulse={mode === "reason"} />
            </>
          ), () => setMode((m) => (m === "reason" ? "search" : "reason")))}

          {/* retrieval arm */}
          {zone("retrieve", STATIONS.retrieve, (
            <>
              <Line d={`M${arm.joints[0]}L${arm.joints[1]}L${arm.joints[2]}L${arm.joints[3]}`} tone={dimmed ? "faint" : "hi"} />
              <Line d={`M${arm.joints[2]}L${arm.deepJoint}`} tone={dimmed ? "faint" : "hi"} />
              {arm.joints.map((j, i) => (
                <Dots key={i} points={[j]} size={i === 3 || i === 2 ? 0.9 : 0.7} tone={dimmed ? "lo" : "hi"} pulse={!dimmed} />
              ))}
              <Dots points={[arm.deepJoint]} size={0.7} tone={dimmed ? "lo" : "hi"} pulse={!dimmed} />
            </>
          ))}

          {/* permissions drawer */}
          {zone("permissions", STATIONS.permissions, (
            <>
              <Wire from={redBadge} to={redBadge} tone="red" size={0.8} ends="both" />
              <Line d={permissionLine} tone="red" dashed />
            </>
          ))}

          {/* rerank balance */}
          {zone("rerank", STATIONS.rerank, (
            <>
              <Solid paths={balance.post} tone="lo" crease="none" />
              <g transform={translateAlong(p, [0, 0, beamBob])}>
                <Solid paths={balance.beam} tone={lit("rerank") ? "hi" : "mid"} crease="none" />
                <Line d={balance.hangL} tone="lo" />
                <Line d={balance.hangR} tone="lo" />
                <Solid paths={balance.panLeft} tone={lit("rerank") ? "hi" : "lo"} crease="none" />
                <Solid paths={balance.panRight} tone={lit("rerank") ? "hi" : "lo"} crease="none" />
                {beamCards.map((c, i) => (
                  <Solid key={i} paths={c} tone="mid" crease="none" />
                ))}
              </g>
              <Solid paths={rejectBin} tone={lit("rerank") ? "hi" : "lo"} crease="none" />
              {rejectCards.map((c, i) => (
                <Solid key={i} paths={c} tone="lo" crease="none" />
              ))}
              <Line d={segment([92.7, 63.5, 11.4], [92, 74, 7], p)} tone="faint" dashed />
            </>
          ))}

          {/* reasoning gears over linked facts */}
          {zone("relate", STATIONS.relate, (
            <>
              {gears.map((g, i) => (
                <g key={i}>
                  <Solid paths={g.body} tone={dimmed ? "lo" : lit("relate") ? "hi" : "mid"} crease="none" />
                  <Line d={g.knurl} tone="faint" />
                </g>
              ))}
              <Line d={gearLinks} tone={dimmed ? "faint" : "lo"} />
              {gearDots.map((pt, i) => (
                <Dots key={i} points={[pt]} size={0.45} tone={dimmed ? "faint" : "hi"} />
              ))}
              <Solid paths={factRack} tone={lit("relate") ? "hi" : "lo"} crease="none" />
              {factCards.map((c, i) => (
                <Solid key={i} paths={c} tone={dimmed ? "lo" : "mid"} crease="none" />
              ))}
              <Line d={factWires} tone={dimmed ? "faint" : "blue"} />
            </>
          ))}

          {/* generation typewriter with citations */}
          {zone("generate", STATIONS.generate, (
            <>
              <Solid paths={typer.body} tone={lit("generate") ? "hi" : "mid"} crease="faint" />
              <Dots points={typer.keys} size={0.4} tone="faint" />
              <Solid paths={typer.roll} tone="lo" crease="none" />
              <Solid paths={typer.carriage} tone="lo" crease="none" />
              <Solid paths={typer.sheet} tone={lit("generate") ? "hi" : "hi"} crease="none" />
              <Line d={citations.toFacts} tone="blue" dashed />
              <Line d={citations.toCatalog} tone="blue" dashed />
              <Line d={citations.toConsole} tone="blue" dashed />
              <Dots points={[iso([121.4, 79.2, 17.2], p)]} size={0.6} tone="blue" pulse />
            </>
          ))}
        </IsoFigure>
      </Plate>
    </div>
  );
}