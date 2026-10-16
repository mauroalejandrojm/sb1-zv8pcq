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
  type Plan,
} from "./iso-kit";
import { Solid, Line, Wire, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, useInView } from "./live";

const W = 440;
const H = 320;

const BENCH: Plan = { x: 2, y: 48, w: 134, d: 36, r: 4 };

type Dimension = "region" | "product";
type Range = 6 | 12;

const DATASETS: Record<Dimension, { label: string; n: string; m12: number[]; anomaly12: number; slope: number; spread: number }> = {
  region: {
    label: "REVENUE BY REGION",
    n: "4,882 ROWS",
    m12: [34, 38, 42, 40, 46, 52, 49, 57, 63, 60, 68, 74],
    anomaly12: 3,
    slope: 5,
    spread: 9,
  },
  product: {
    label: "UNITS BY PRODUCT",
    n: "6,144 ROWS",
    m12: [22, 26, 25, 29, 31, 30, 34, 33, 37, 35, 36, 38],
    anomaly12: 6,
    slope: 2.5,
    spread: 5.5,
  },
};

const STATIONS: Record<string, string> = {
  question: "ASK — A QUESTION IN NATURAL LANGUAGE",
  compile: "COMPILE — THE DRUM PUNCHES IT INTO A QUERY",
  data: "WAREHOUSE — GOVERNED ROWS FROM THE REFINERY",
  chart: "PLOT — THE TABLE REDRAWS WITH EVERY DIAL",
  range: "DATE RANGE — 6 / 12 MONTHS (CLICK THE DIAL)",
  dimension: "DIMENSION — REGION / PRODUCT (FLIP THE LEVER)",
  anomaly: "ANOMALY — DETECTED & EXPLAINED, NOT HIDDEN",
  forecast: "FORECAST — THE MODEL DRAWS ITS OWN UNCERTAINTY",
  benchZone: "THE ANALYST'S BENCH — METRICS & NOTES",
};

const BAR_X0 = 42;
const BAR_GAP = 3.6;
const BAR_H = 0.085;

export default function InsightsEngine({ className }: { className?: string }) {
  const [focus, setFocus] = React.useState<string | null>(null);
  const [dimension, setDimension] = React.useState<Dimension>("region");
  const [range, setRange] = React.useState<Range>(12);

  const wrap = React.useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const p = React.useMemo(
    () => fitProjection([[0, 32, 0], [138, 32, 0], [0, 86, -6], [138, 86, -6], [0, 32, 20], [138, 32, 20]], W, H, { pad: 26, headroom: 28 }),
    [],
  );

  const ds = DATASETS[dimension];
  const values = React.useMemo(() => (range === 12 ? ds.m12 : ds.m12.slice(-6)), [ds, range]);
  const anomalyIdx = range === 12 ? ds.anomaly12 : Math.max(0, ds.anomaly12 - 6);
  const bars = React.useMemo(
    () => values.map((v, i) => ({ x: BAR_X0 + i * BAR_GAP, h: v * BAR_H, plan: { x: BAR_X0 + i * BAR_GAP, y: 60, w: 3, d: 3.2, r: 0.4 } as Plan })),
    [values],
  );

  // ---- static geometry ----
  const bench = React.useMemo(() => slabOf(BENCH, 0, 3, p), [p]);
  const legs = React.useMemo(() => [[8, 52], [8, 80], [130, 52], [130, 80]].map(([x, y]) => cylinder(x, y, 2, -6, 6, p, 18)), [p]);
  const halo = React.useMemo(() => haloOf(BENCH, 0, 2, p), [p]);

  const pedestal = React.useMemo(() => slabOf({ x: 5, y: 60, w: 9, d: 9, r: 1 }, 3, 7, p), [p]);
  const questionCard = React.useMemo(() => slabOf({ x: 7.6, y: 62, w: 0.8, d: 5, r: 0.2 }, 10, 4, p), [p]);
  const askLamp = React.useMemo(() => iso([9.5, 66.5, 10.4], p), [p]);

  const drum = React.useMemo(() => cylinder(20, 57, 3, 3, 7, p, 28), [p]);
  const drumKnurl = React.useMemo(() => knurl(20, 57, 3.1, 3.4, 9.6, 10, p), [p]);
  const drumHoles = React.useMemo(() => dotGrid(18.2, 55.2, 3, 3, 1.5, 10.2, p), [p]);
  const queryShelf = React.useMemo(() => slabOf({ x: 25, y: 53, w: 7, d: 9, r: 0.8 }, 3, 1, p), [p]);
  const queryCard = React.useMemo(() => slabOf({ x: 26.4, y: 55, w: 1.6, d: 4.6, r: 0.3 }, 4, 1.5, p), [p]);

  const rack = React.useMemo(() => slabOf({ x: 5, y: 32, w: 28, d: 11, r: 1 }, 0, 15, p), [p]);
  const rackShelves = React.useMemo(
    () => [4.5, 9.5].map((z) => slabOf({ x: 7, y: 41, w: 9, d: 2.4, r: 0.4 }, z, 3.6, p)), [p],
  );
  const rackCards = React.useMemo(
    () => [6.5, 11.5].map((z) => dotGrid(8, 41.6, 5, 1, 1.5, z, p)), [p],
  );
  const rackCable = React.useMemo(() => segment([18, 41, 15.2], [20, 53, 10.6], p), [p]);

  const table = React.useMemo(() => slabOf({ x: 38, y: 56, w: 52, d: 26, r: 2 }, 3, 2, p), [p]);
  const sheet = React.useMemo(() => slabOf({ x: 40, y: 58, w: 48, d: 22, r: 0.5 }, 5, 0.7, p), [p]);
  const railBack = React.useMemo(() => slabOf({ x: 38, y: 56, w: 52, d: 1.1, r: 0.3 }, 10.5, 1.4, p), [p]);
  const railFront = React.useMemo(() => slabOf({ x: 38, y: 80.9, w: 52, d: 1.1, r: 0.3 }, 10.5, 1.4, p), [p]);
  const baseline = React.useMemo(() => lineOnTop([BAR_X0 - 1.4, 61.8], [86, 61.8], 5.75, p), [p]);

  const bell = React.useMemo(
    () => ({
      post: cylinder(93, 60, 1.1, 3, 5, p, 14),
      dome: cylinder(93, 60, 2, 8, 2.2, p, 24),
      knob: iso([93, 60, 10.4], p),
    }),
    [p],
  );

  const consoleTop = React.useMemo(() => slabOf({ x: 96, y: 68, w: 38, d: 15, r: 2 }, 3, 2, p), [p]);
  const dial = React.useMemo(
    () => ({
      body: cylinder(102, 75, 2.6, 5, 2.2, p, 28),
      ticks: radialTicks(102, 75, 2.3, 16, 4, 7.4, [0.4, 0.9], p),
      hub: iso([102, 75, 7.6], p),
    }),
    [p],
  );
  const leverBase = React.useMemo(() => cylinder(112, 75, 1.1, 5, 2, p, 16), [p]);
  const metricButtons = React.useMemo(
    () => [120, 124, 128].map((x) => slabOf({ x, y: 73.5, w: 3, d: 3, r: 0.5 }, 5, 1.4, p)), [p],
  );
  const noteCard = React.useMemo(() => slabOf({ x: 126, y: 78.6, w: 6, d: 3.4, r: 0.4 }, 5, 0.8, p), [p]);

  const lastBar = bars[bars.length - 1]!;
  const fanBase: [number, number, number] = [lastBar.x + 1.5, 61.6, 5.7 + lastBar.h];
  const fanTips = React.useMemo(
    () =>
      [
        [fanBase[0] + 5, fanBase[1] - 0.8, fanBase[2] + ds.slope * BAR_H + ds.spread * BAR_H],
        [fanBase[0] + 5.4, fanBase[1] + 0.4, fanBase[2] + ds.slope * BAR_H * 0.9],
        [fanBase[0] + 4.6, fanBase[1] + 1.6, fanBase[2] + ds.slope * BAR_H - ds.spread * BAR_H * 0.4],
      ] as [number, number, number][],
    [fanBase, ds],
  );

  // ---- one clock: the plotter bridge sweeps the sheet ----
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
      setTick((n) => n + 1);
      return true;
    },
    inView,
  );
  const bridgeX = 44.5 + 21 * (0.5 + 0.5 * Math.sin(time.current * 0.55));
  const needleA = range === 12 ? 1.15 : 0.35;
  const leverA = dimension === "region" ? -0.5 : 0.5;
  const leverTip: [number, number, number] = [112 + 3.2 * Math.sin(leverA), 75, 7 + 3.2 * Math.cos(leverA)];

  const readout =
    focus === null ? `QUERY — ${ds.label} · LAST ${range} MO · ${ds.n}` : (STATIONS[focus] ?? `QUERY — ${ds.label}`);

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
        fig="FIG B-02"
        title="Insight Engine"
        hint="Hover the studio · turn the dials"
        readout={readout}
        keys={[
          { mark: "raised", label: "Studio station" },
          { mark: "blue", label: "Fact (solid ink)" },
          { mark: "dashed", label: "Forecast (pencil)" },
          { mark: "red", label: "Anomaly flagged" },
        ]}
        caption="Not a static report: a question is punched into a query, the table plots it, and the dials re-cut the chart live — facts print in solid ink, forecasts stay dashed, and the bell marks what deserves a second look."
      >
        <IsoFigure width={W} height={H} label="Interactive isometric studio that turns a business question into a live, explorable chart">
          <path className="iso-halo" d={halo} />

          {/* warehouse rack */}
          {zone("data", STATIONS.data, (
            <>
              <Solid paths={rack} tone={lit("data") ? "hi" : "mid"} crease="faint" />
              {rackShelves.map((s, i) => (
                <Solid key={i} paths={s} tone={lit("data") ? "hi" : "lo"} crease="none" />
              ))}
              {rackCards.map((dots, i) => (
                <Dots key={i} points={dots} size={0.32} tone="faint" />
              ))}
              <Line d={rackCable} tone="lo" dashed />
            </>
          ))}

          {/* bench */}
          {legs.map((l, i) => (
            <Solid key={i} paths={l} tone="lo" crease="none" />
          ))}
          <Solid paths={bench} tone="lo" crease="faint" />

          {/* question pedestal */}
          {zone("question", STATIONS.question, (
            <>
              <Solid paths={pedestal} tone={lit("question") ? "hi" : "mid"} crease="none" />
              <Solid paths={questionCard} tone="hi" crease="none" />
              <Dots points={[askLamp]} size={0.8} tone="green" pulse />
            </>
          ))}

          {/* compiler drum */}
          {zone("compile", STATIONS.compile, (
            <>
              <Solid paths={drum} tone={lit("compile") ? "hi" : "mid"} crease="none" />
              <Line d={drumKnurl} tone="faint" />
              <Dots points={drumHoles} size={0.4} tone="blue" />
              <Solid paths={queryShelf} tone={lit("compile") ? "hi" : "lo"} crease="none" />
              <Solid paths={queryCard} tone="hi" crease="none" />
              <Line d={lineOnTop([24, 58], [25.4, 58], 10.4, p)} tone="mid" flow />
            </>
          ))}

          {/* drafting table with the live chart */}
          {zone("chart", STATIONS.chart, (
            <>
              <Solid paths={table} tone={lit("chart") ? "hi" : "lo"} crease="faint" />
              <Solid paths={sheet} tone="hi" crease="none" flat />
              <Line d={baseline} tone="lo" />
              {bars.map((b, i) => (
                <g key={i}>
                  <Solid paths={slabOf(b.plan, 5.7, b.h, p)} tone="mid" crease="none" />
                  {i === anomalyIdx ? (
                    <>
                      <Line d={planOutline(b.plan, 5.7 + b.h, p)} tone="red" />
                      <Wire from={iso([b.x + 1.5, 61.6, 6.4 + b.h], p)} to={iso([b.x + 1.5, 61.6, 6.4 + b.h], p)} tone="red" size={0.65} ends="both" />
                    </>
                  ) : null}
                </g>
              ))}
              <Solid paths={railBack} tone="lo" crease="none" />
              <Solid paths={railFront} tone="lo" crease="none" />
              <Solid paths={slabOf({ x: bridgeX - 1, y: 56, w: 2, d: 26, r: 0.3 }, 11.9, 1.5, p)} tone="hi" crease="none" />
              <Dots points={[iso([bridgeX, 68.5, 11.9], p)]} size={0.7} tone="hi" pulse />
              <Line d={segment([bridgeX, 68.5, 11.9], [bridgeX, 68.5, 8.4], p)} tone="hi" />
            </>
          ))}

          {/* forecast fan: uncertainty drawn, not hidden */}
          {zone("forecast", STATIONS.forecast, (
            <>
              {fanTips.map((tip, i) => (
                <Line key={i} d={segment(fanBase, tip, p)} tone="lo" dashed />
              ))}
              {fanTips.map((tip, i) => (
                <Dots key={`d${i}`} points={[iso(tip, p)]} size={0.45} tone="faint" />
              ))}
              <Dots points={[iso(fanBase, p)]} size={0.7} tone="hi" pulse />
            </>
          ))}

          {/* anomaly bell */}
          {zone("anomaly", STATIONS.anomaly, (
            <>
              <Solid paths={bell.post} tone="lo" crease="none" />
              <Solid paths={bell.dome} tone={lit("anomaly") ? "hi" : "mid"} crease="none" />
              <Dots points={[bell.knob]} size={0.7} tone="red" pulse />
              {bars.map((b, i) =>
                i === anomalyIdx ? <Line key={i} d={segment([92, 61, 9.4], [b.x + 1.5, 61.6, 6.2 + b.h], p)} tone="red" dashed /> : null,
              )}
            </>
          ))}

          {/* control console: the dials re-cut the chart live */}
          <Solid paths={consoleTop} tone={lit("dimension") || lit("range") || lit("benchZone") ? "hi" : "lo"} crease="faint" />
          {zone("dimension", STATIONS.dimension, (
            <>
              <Solid paths={leverBase} tone="lo" crease="none" />
              <Line d={segment([112, 75, 7], leverTip, p)} tone="hi" />
              <Dots points={[iso(leverTip, p)]} size={1} tone="hi" />
              <Dots points={[iso([109, 79, 5.5], p)]} size={0.6} tone={dimension === "region" ? "green" : "faint"} />
              <Dots points={[iso([115, 79, 5.5], p)]} size={0.6} tone={dimension === "product" ? "green" : "faint"} />
            </>
          ), () => setDimension((d) => (d === "region" ? "product" : "region")))}
          {zone("range", STATIONS.range, (
            <>
              <Solid paths={dial.body} tone={lit("range") ? "hi" : "mid"} crease="none" />
              <Line d={dial.ticks.minor} tone="faint" />
              <Line d={dial.ticks.major} tone="lo" />
              <Line d={segment([102, 75, 7.6], [102 + 1.9 * Math.sin(needleA), 75 - 1.9 * Math.cos(needleA), 7.6], p)} tone="hi" />
              <Dots points={[dial.hub]} size={0.8} tone="hi" />
            </>
          ), () => setRange((r) => (r === 12 ? 6 : 12)))}
          {zone("benchZone", STATIONS.benchZone, (
            <>
              {metricButtons.map((b, i) => (
                <Solid key={i} paths={b} tone="mid" crease="none" />
              ))}
              <Solid paths={noteCard} tone="hi" crease="none" />
            </>
          ))}
        </IsoFigure>
      </Plate>
    </div>
  );
}