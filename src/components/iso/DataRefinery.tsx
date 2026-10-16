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
  topTicks,
  knurl,
  ring,
  translateAlong,
  type Plan,
} from "./iso-kit";
import { Solid, Line, Wire, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, follow, useInView } from "./live";

const W = 440;
const H = 340;

const BENCH: Plan = { x: 2, y: 48, w: 134, d: 36, r: 4 };
const BELT: Plan = { x: 32, y: 64, w: 74, d: 12, r: 2 };
const TRAY: Plan = { x: 5, y: 76, w: 24, d: 8, r: 2 };
const DESK_BLOCK: Plan = { x: 56, y: 28, w: 32, d: 11, r: 2 };
const DESK_TOP: Plan = { x: 54, y: 26, w: 36, d: 14, r: 2 };
const CABINET: Plan = { x: 106, y: 30, w: 26, d: 16, r: 2 };

const TILE: Omit<Plan, "x"> = { y: 66.5, w: 5, d: 7, r: 1 };
const tileAt = (x: number): Plan => ({ ...TILE, x });

const STATION_LABELS: Record<string, string> = {
  input: "INTAKE — WHITEBOARDS · NOTES · PDFs · SHEETS · CONTRACTS",
  extract: "EXTRACT — TEXT · TABLES · LAYOUT · 99.1% COVERAGE",
  resolve: "RESOLVE — DUPLICATES MERGED & ENTITIES LINKED",
  map: "MAP — EVERY FIELD STAMPED TO THE SCHEMA",
  validate: "VALIDATE — BUSINESS RULES · GAUGE CHECKS EACH RECORD",
  uses: "USE — QUERY · REPORT · FORECAST · RETRIEVE · DECIDE",
  idle: "FRAGMENTS IN — DECISIONS OUT",
};

export default function DataRefinery({ className }: { className?: string }) {
  const [focus, setFocus] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(3);
  const [records, setRecords] = React.useState(11942);

  const wrap = React.useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const p = React.useMemo(
    () => fitProjection([[0, 26, 0], [138, 26, 0], [0, 86, -6], [138, 86, -6], [0, 26, 24], [138, 26, 24]], W, H, { pad: 26, headroom: 30 }),
    [],
  );

  // ---- static geometry, built once ----
  const bench = React.useMemo(() => slabOf(BENCH, 0, 3, p), [p]);
  const legs = React.useMemo(
    () => [[10, 52], [10, 80], [128, 52], [128, 80]].map(([x, y]) => cylinder(x, y, 2, -6, 6, p, 20)), [p],
  );
  const halo = React.useMemo(() => haloOf(BENCH, 0, 2, p), [p]);

  const tray = React.useMemo(() => slabOf(TRAY, 3, 1.5, p), [p]);
  const trayWall = React.useMemo(() => slabOf({ x: 5, y: 76, w: 24, d: 1.6, r: 0.5 }, 4.5, 3.5, p), [p]);
  const board = React.useMemo(() => slabOf({ x: 7.5, y: 77.5, w: 2.4, d: 6.5, r: 0.5 }, 4.5, 6.5, p), [p]);
  const boardGrid = React.useMemo(() => dotGrid(7.9, 78.4, 2, 4, 1.2, 11.1, p), [p]);
  const wad = React.useMemo(
    () => [
      slabOf({ x: 11, y: 78.6, w: 4, d: 3.4, r: 0.8 }, 4.5, 2, p),
      slabOf({ x: 11.6, y: 78, w: 4, d: 3.4, r: 0.8 }, 6.5, 2, p),
      slabOf({ x: 12.2, y: 78.4, w: 3.4, d: 3, r: 0.8 }, 8.5, 1.8, p),
    ],
    [p],
  );
  const roll = React.useMemo(() => cylinder(24.5, 80.5, 2.4, 4.5, 4.5, p, 24), [p]);
  const rollSeam = React.useMemo(() => `${knurl(24.5, 80.5, 2.6, 4.5, 9, 6, p)}${ring(24.5, 80.5, 2.9, 6.5, p, 24)}`, [p]);
  const contract = React.useMemo(() => slabOf({ x: 17, y: 77.6, w: 4.6, d: 6.4, r: 0.5 }, 4.5, 3.4, p), [p]);
  const sheet = React.useMemo(() => slabOf({ x: 17.4, y: 78, w: 3.8, d: 5.4, r: 0.4 }, 7.9, 0.8, p), [p]);
  const spread = React.useMemo(() => slabOf({ x: 7, y: 82.6, w: 11, d: 1.8, r: 0.4 }, 4.5, 0.8, p), [p]);
  const spreadGrid = React.useMemo(() => dotGrid(8, 83, 5, 1, 1.8, 5.4, p), [p]);

  const belt = React.useMemo(() => slabOf(BELT, 3, 2, p), [p]);
  const rails = React.useMemo(
    () => [slabOf({ x: 32, y: 63.6, w: 74, d: 1, r: 0.4 }, 5, 1.6, p), slabOf({ x: 32, y: 75.4, w: 74, d: 1, r: 0.4 }, 5, 1.6, p)], [p],
  );
  const messyOnBelt = React.useMemo(
    () => [slabOf({ x: 34.6, y: 68, w: 4, d: 4.6, r: 0.8 }, 5, 2.4, p), slabOf({ x: 39.4, y: 67, w: 3, d: 5.6, r: 0.6 }, 5, 1.4, p)], [p],
  );

  const gantry = React.useMemo(
    () => ({
      left: slabOf({ x: 36, y: 60, w: 2.6, d: 20, r: 0.6 }, 3, 16, p),
      right: slabOf({ x: 43.4, y: 60, w: 2.6, d: 20, r: 0.6 }, 3, 16, p),
      bar: slabOf({ x: 35, y: 60, w: 12.6, d: 20, r: 1 }, 19, 2.4, p),
      head: slabOf({ x: 38, y: 66, w: 6, d: 6, r: 1 }, 16, 3, p),
    }),
    [p],
  );

  const tilePlans = React.useMemo(() => [48.5, 61, 72.5, 88.5, 94.5, 100.5].map(tileAt), []);
  const tiles = React.useMemo(() => tilePlans.map((plan) => slabOf(plan, 5, 1.4, p)), [tilePlans, p]);
  const tileGrids = React.useMemo(() => tilePlans.map((plan) => dotGrid(plan.x + 0.9, 67.4, 3, 2, 1.05, 6.5, p)), [tilePlans, p]);
  const pairTiles = React.useMemo(
    () => [slabOf({ x: 45.5, y: 63.4, w: 5, d: 6, r: 1 }, 5, 1.4, p), slabOf({ x: 45.5, y: 67.2, w: 5, d: 6, r: 1 }, 5, 1.4, p)], [p],
  );

  const press = React.useMemo(
    () => ({
      left: slabOf({ x: 57.5, y: 62, w: 2.2, d: 18, r: 0.6 }, 3, 11, p),
      right: slabOf({ x: 65, y: 62, w: 2.2, d: 18, r: 0.6 }, 3, 11, p),
      bar: slabOf({ x: 56, y: 62, w: 12.6, d: 18, r: 1 }, 14, 2, p),
      stamp: slabOf({ x: 59, y: 65.5, w: 6, d: 6, r: 1 }, 8, 3, p),
      guide: segment([62, 65.5, 14], [62, 65.5, 11], p),
    }),
    [p],
  );
  const stampedTicks = React.useMemo(() => topTicks(61.6, 65.4, 0.9, 2, 72.9, 6.5, [0.4, 0.8], p, "x"), [p]);

  const gate = React.useMemo(
    () => ({
      left: slabOf({ x: 75, y: 62.6, w: 1.8, d: 15, r: 0.5 }, 5, 10, p),
      right: slabOf({ x: 82, y: 62.6, w: 1.8, d: 15, r: 0.5 }, 5, 10, p),
      lintel: slabOf({ x: 74, y: 62.6, w: 10.4, d: 15, r: 1 }, 15, 1.6, p),
      flagged: slabOf(tileAt(77.5), 5, 1.4, p),
    }),
    [p],
  );
  const gauge = React.useMemo(
    () => ({
      post: cylinder(87.5, 79.5, 1.3, 3, 7, p, 18),
      dial: cylinder(87.5, 79.5, 4.2, 10, 2.2, p, 32),
      ticks: radialTicks(87.5, 79.5, 3.7, 20, 5, 12.5, [0.5, 1], p),
      fail: radialTicks(87.5, 79.5, 4.1, 4, 1, 12.5, [0.7, 1.5], p, 1.5, 0.7),
      hub: iso([87.5, 79.5, 12.6], p),
    }),
    [p],
  );

  const deskBlock = React.useMemo(() => slabOf(DESK_BLOCK, 0, 9, p), [p]);
  const deskTop = React.useMemo(() => slabOf(DESK_TOP, 9, 2, p), [p]);
  const deskTile = React.useMemo(() => slabOf({ x: 60, y: 30, w: 5.5, d: 6, r: 1 }, 11, 1.4, p), [p]);
  const leverBase = React.useMemo(() => cylinder(69, 31.5, 1.2, 11, 2, p, 16), [p]);
  const lamp = React.useMemo(
    () => ({
      post: cylinder(86.5, 30, 1, 11, 5.5, p, 14),
      arm: segment([86.5, 30, 16.5], [80, 31, 15.5], p),
      head: slabOf({ x: 78, y: 30, w: 3, d: 2, r: 0.5 }, 15, 1.4, p),
      light: iso([79.4, 31, 14.6], p),
    }),
    [p],
  );

  const cabinet = React.useMemo(() => slabOf(CABINET, 0, 24, p), [p]);
  const drawers = React.useMemo(
    () => [4, 11, 18].map((z) => slabOf({ x: 109, y: 44, w: 8, d: 3.2, r: 0.5 }, z, 5.2, p)), [p],
  );
  const drawerHandles = React.useMemo(
    () => [6.6, 13.6, 20.6].map((z) => segment([111, 47.6, z], [114, 47.6, z], p)).join(""), [p],
  );
  const cabinetTopTicks = React.useMemo(() => topTicks(108, 130, 2.2, 2, 31, 24.2, [0.5, 0.9], p, "x"), [p]);

  const uses = React.useMemo(
    () => ({
      pad: slabOf({ x: 106, y: 75.5, w: 30, d: 8.5, r: 2 }, 3, 1, p),
      bars: [
        cylinder(110, 80.5, 1.5, 4, 5.5, p, 16),
        cylinder(113.5, 80.5, 1.5, 4, 8.5, p, 16),
        cylinder(117, 80.5, 1.5, 4, 4, p, 16),
      ],
      baseline: lineOnTop([108, 82.6], [119, 82.6], 4, p),
      fanBase: iso([121.5, 81, 6], p),
      fan: [iso([126, 79, 14], p), iso([128, 81, 10.5], p), iso([126.5, 83, 7.5], p)],
      card: slabOf({ x: 121, y: 82.8, w: 5, d: 2.6, r: 0.5 }, 4, 2.2, p),
      lampPost: cylinder(133, 81, 1.1, 4, 6.5, p, 14),
      lampCap: cylinder(133, 81, 2, 10.5, 1.5, p, 20),
      lampDot: iso([133, 81, 12.3], p),
    }),
    [p],
  );

  const flowSegments = React.useMemo(
    () => [[33, 36], [46, 48], [52, 56], [67, 71], [73, 76], [84, 88], [91, 94], [97, 100]].map(([a, b], i) => (
      <Line key={i} d={lineOnTop([a, 70], [b, 70], 5.15, p)} tone="mid" flow />
    )),
    [p],
  );

  // ---- live model: one clock drives the moving parts ----
  const time = React.useRef(0);
  const dip = React.useRef(0);
  const [, setTick] = React.useState(0);
  useLoop(
    (dt, calm) => {
      if (calm) {
        time.current = 1.2;
        dip.current = 0;
        setTick((t) => t + 1);
        return false;
      }
      time.current += dt;
      dip.current = follow(dip.current, 0, dt, 0.35);
      setTick((t) => t + 1);
      return true;
    },
    inView,
  );

  const t = time.current;
  const beamX = 40.5 + 3.4 * Math.sin(t * 1.3);
  const needleA = 0.55 + 0.18 * Math.sin(t * 0.85);
  const stampLift = -0.9 * (0.5 + 0.5 * Math.sin(t * 1.05));
  const leverA = 0.22 + 0.85 * dip.current;
  const leverTip: [number, number, number] = [69 + 3.4 * Math.sin(leverA), 31.5, 13 + 3.4 * Math.cos(leverA)];
  const needleTip: [number, number, number] = [87.5 + 3.1 * Math.sin(needleA), 79.5 - 3.1 * Math.cos(needleA), 12.6];

  const approve = () => {
    if (pending > 0) {
      setPending((n) => n - 1);
      setRecords((n) => n + 1);
      dip.current = 1;
    }
  };

  const READOUTS: Record<string, string> = {
    ...STATION_LABELS,
    validate: `VALIDATE — 98.6% PASS · ${pending} FLAGGED`,
    review: pending > 0 ? `REVIEW — ${pending} AWAITING SIGN-OFF` : "REVIEW — ALL CLEAR · LINE RESUMED",
    archive: `ARCHIVE — ${records.toLocaleString("en-US")} GOVERNED RECORDS`,
  };
  const readout = focus === null ? READOUTS.idle : (READOUTS[focus] ?? READOUTS.idle);

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

  return (
    <div ref={wrap}>
      <Plate
        fig="FIG A-01"
        title="Data Refinery"
        hint="Hover the line · press the lever"
        readout={readout}
        keys={[
          { mark: "raised", label: "Processing stage" },
          { mark: "red", label: "Flagged for review" },
          { mark: "dashed", label: "Review loop & lineage" },
          { mark: "blue", label: "Source link (provenance)" },
        ]}
        caption="Documents in, decisions out — fragments are read, resolved, mapped and validated; conflicts go to a person, and every record keeps its source."
      >
        <IsoFigure width={W} height={H} label="Interactive isometric diagram of unstructured company information refined into governed, machine-readable records">
          <path className="iso-halo" d={halo} />

          {/* review desk (back) */}
          {zone("review", READOUTS.review, (
            <>
              <Solid paths={deskBlock} tone={lit("review") ? "hi" : "lo"} crease="none" />
              <Solid paths={deskTop} tone={lit("review") ? "hi" : "mid"} crease="faint" />
              <Solid paths={deskTile} tone="mid" crease="none" />
              <Line d={planOutline({ x: 60, y: 30, w: 5.5, d: 6, r: 1 }, 12.4, p)} tone={pending > 0 ? "red" : "green"} />
              <Solid paths={lamp.post} tone="lo" crease="none" />
              <Line d={lamp.arm} tone="lo" />
              <Solid paths={lamp.head} tone="lo" crease="none" />
              <Dots points={[lamp.light]} size={1} tone="lit" pulse />
              <Solid paths={leverBase} tone="lo" crease="none" />
              <Line d={segment([69, 31.5, 13], leverTip, p)} tone="hi" />
              <Dots points={[iso(leverTip, p)]} size={1.1} tone="hi" />
              <Line d={segment([78.5, 66, 16], [70, 36, 12], p)} tone="red" dashed />
              <Line d={segment([64, 31, 12.5], [74, 70, 6.6], p)} tone="green" dashed />
            </>
          ), approve)}

          {/* archive cabinet (back right) */}
          {zone("archive", READOUTS.archive, (
            <>
              <Solid paths={cabinet} tone={lit("archive") ? "hi" : "mid"} crease="faint" />
              {drawers.map((d, i) => (
                <Solid key={i} paths={d} tone={lit("archive") ? "hi" : "lo"} crease="none" />
              ))}
              <Line d={drawerHandles} tone="lo" />
              <Line d={cabinetTopTicks.minor} tone="faint" />
              <Line d={cabinetTopTicks.major} tone="lo" />
              {[7, 14, 21].map((z, i) => (
                <Wire key={i} from={iso([113, 47.4, z], p)} to={iso([113, 47.4, z], p)} tone="blue" size={0.6} ends="both" />
              ))}
            </>
          ))}

          {/* bench */}
          {legs.map((l, i) => (
            <Solid key={i} paths={l} tone="lo" crease="none" />
          ))}
          <Solid paths={bench} tone="lo" crease="faint" />

          {/* intake tray with messy sources */}
          {zone("input", READOUTS.input, (
            <>
              <Solid paths={tray} tone={lit("input") ? "hi" : "lo"} crease="none" />
              <Solid paths={trayWall} tone={lit("input") ? "hi" : "lo"} crease="none" />
              <Solid paths={board} tone={lit("input") ? "hi" : "mid"} crease="none" />
              <Dots points={boardGrid} size={0.35} tone="faint" />
              {wad.map((d, i) => (
                <Solid key={i} paths={d} tone={lit("input") ? "hi" : "mid"} crease="none" />
              ))}
              <Solid paths={roll} tone={lit("input") ? "hi" : "mid"} crease="none" />
              <Line d={rollSeam} tone="faint" />
              <Solid paths={contract} tone={lit("input") ? "hi" : "mid"} crease="none" />
              <Solid paths={sheet} tone={lit("input") ? "hi" : "lo"} crease="none" />
              <Solid paths={spread} tone={lit("input") ? "hi" : "lo"} crease="none" />
              <Dots points={spreadGrid} size={0.35} tone="faint" />
            </>
          ))}
          {/* provenance: the source keeps a link to everything it becomes */}
          <Line d={segment([8.7, 80.7, 11.2], [30, 72, 9], p)} tone="blue" dashed />
          <Wire from={iso([8.7, 80.7, 11.2], p)} to={iso([8.7, 80.7, 11.2], p)} tone="blue" size={0.7} ends="both" />

          {/* belt */}
          <Solid paths={belt} tone="lo" crease="faint" />
          {rails.map((r, i) => (
            <Solid key={i} paths={r} tone="lo" crease="none" />
          ))}

          {/* extraction gantry */}
          {zone("extract", READOUTS.extract, (
            <>
              <Solid paths={gantry.left} tone={lit("extract") ? "hi" : "lo"} crease="none" />
              <Solid paths={gantry.right} tone={lit("extract") ? "hi" : "lo"} crease="none" />
              <Solid paths={gantry.bar} tone={lit("extract") ? "hi" : "mid"} crease="faint" />
              <Solid paths={gantry.head} tone={lit("extract") ? "hi" : "mid"} crease="none" />
              <Line d={segment([beamX, 69, 16], [beamX, 69, 6.5], p)} tone="lit" />
              <Dots points={[iso([38.5, 68.5, 6.8], p), iso([41, 69.5, 6.8], p), iso([43.2, 68, 6.8], p)]} size={0.5} tone="hi" />
              {messyOnBelt.map((m, i) => (
                <Solid key={i} paths={m} tone={lit("extract") ? "hi" : "mid"} crease="none" />
              ))}
            </>
          ))}

          {/* resolve: duplicates merge */}
          {zone("resolve", READOUTS.resolve, (
            <>
              {pairTiles.map((tile, i) => (
                <Solid key={i} paths={tile} tone={lit("resolve") ? "hi" : "mid"} crease="none" />
              ))}
              <Line d={planOutline({ x: 45.5, y: 67.2, w: 5, d: 6, r: 1 }, 6.4, p)} tone="red" />
              <Line d={segment([50.5, 66.4, 6.4], [54, 70, 6.4], p)} tone="mid" flow />
              <Line d={segment([50.5, 72.6, 6.4], [54, 70, 6.4], p)} tone="mid" flow />
            </>
          ))}

          {/* tiles on the belt */}
          {tiles.map((tile, i) => (
            <g key={i}>
              <Solid paths={tile} tone="mid" crease="none" />
              <Dots points={tileGrids[i]!} size={0.32} tone="faint" />
            </g>
          ))}
          {flowSegments}

          {/* schema stamp */}
          {zone("map", READOUTS.map, (
            <>
              <Solid paths={press.left} tone={lit("map") ? "hi" : "lo"} crease="none" />
              <Solid paths={press.right} tone={lit("map") ? "hi" : "lo"} crease="none" />
              <Line d={press.guide} tone="faint" />
              <g transform={translateAlong(p, [0, 0, stampLift])}>
                <Solid paths={press.stamp} tone={lit("map") ? "hi" : "hi"} crease="none" />
              </g>
              <Solid paths={press.bar} tone={lit("map") ? "hi" : "mid"} crease="faint" />
            </>
          ))}
          <Line d={stampedTicks.minor} tone="faint" />

          {/* validation gate + gauge */}
          {zone("validate", READOUTS.validate, (
            <>
              <Solid paths={gate.left} tone={lit("validate") ? "hi" : "lo"} crease="none" />
              <Solid paths={gate.right} tone={lit("validate") ? "hi" : "lo"} crease="none" />
              <Solid paths={gate.lintel} tone={lit("validate") ? "hi" : "mid"} crease="faint" />
              <Solid paths={gate.flagged} tone="mid" crease="none" />
              <Line d={planOutline(tileAt(77.5), 6.4, p)} tone={pending > 0 ? "red" : "green"} />
              <Solid paths={gauge.post} tone="lo" crease="none" />
              <Solid paths={gauge.dial} tone={lit("validate") ? "hi" : "mid"} crease="faint" />
              <Line d={gauge.ticks.minor} tone="faint" />
              <Line d={gauge.ticks.major} tone="lo" />
              <Line d={gauge.fail.minor} tone="red" />
              <Line d={segment([87.5, 79.5, 12.6], needleTip, p)} tone="hi" />
              <Dots points={[gauge.hub]} size={0.9} tone="hi" />
            </>
          ))}

          {/* approved records flow up into the archive */}
          <Line d={segment([102, 70, 6.6], [110, 46, 14], p)} tone="blue" dashed flow />
          {[88.5, 94.5, 100.5].map((x, i) => (
            <Wire key={i} from={iso([x + 2.5, 70, 6.6], p)} to={iso([x + 2.5, 70, 6.6], p)} tone="blue" size={0.55} ends="both" />
          ))}

          {/* downstream uses */}
          {zone("uses", READOUTS.uses, (
            <>
              <Solid paths={uses.pad} tone={lit("uses") ? "hi" : "lo"} crease="none" />
              <Line d={uses.baseline} tone="lo" />
              {uses.bars.map((b, i) => (
                <Solid key={i} paths={b} tone={lit("uses") ? "hi" : "mid"} crease="none" />
              ))}
              {uses.fan.map((point, i) => (
                <Line key={i} d={`M${uses.fanBase[0]} ${uses.fanBase[1]}L${point[0]} ${point[1]}`} tone="lo" dashed />
              ))}
              <Dots points={[uses.fanBase]} size={0.7} tone="hi" pulse />
              <Solid paths={uses.card} tone={lit("uses") ? "hi" : "mid"} crease="none" />
              <Solid paths={uses.lampPost} tone="lo" crease="none" />
              <Solid paths={uses.lampCap} tone={lit("uses") ? "hi" : "mid"} crease="none" />
              <Dots points={[uses.lampDot]} size={0.8} tone="green" pulse />
            </>
          ))}
        </IsoFigure>
      </Plate>
    </div>
  );
}