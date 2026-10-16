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
  type Plan,
} from "./iso-kit";
import { Solid, Line, Wire, Dots, IsoFigure, Plate } from "./draw";

const W = 420;
const H = 300;

const APRON: Plan = { x: 4, y: 40, w: 28, d: 44, r: 4 };
const LINE: Plan = { x: 36, y: 50, w: 62, d: 18, r: 3 };
const STATIONS: { plan: Plan; label: string }[] = [
  { plan: { x: 38, y: 52, w: 11, d: 14, r: 2 }, label: "EXTRACT — TEXT, TABLES & LAYOUT" },
  { plan: { x: 56, y: 52, w: 11, d: 14, r: 2 }, label: "RESOLVE — ENTITIES DEDUPED & LINKED" },
  { plan: { x: 74, y: 52, w: 11, d: 14, r: 2 }, label: "MAP — FIELDS → SCHEMA" },
];
const GATE: Plan = { x: 90, y: 50, w: 8, d: 18, r: 2 };
const REVIEW: Plan = { x: 58, y: 22, w: 32, d: 13, r: 3 };
const PALLET: Plan = { x: 106, y: 50, w: 16, d: 18, r: 3 };
const RECORD: Plan = { x: 108, y: 52, w: 12, d: 14, r: 1 };

const READOUTS = {
  apron: "INGEST — WHITEBOARDS · PDFs · NOTES · CONTRACTS",
  gate: "VALIDATE — 98.6% PASS · BUSINESS RULES",
  review: "FLAGGED — HUMAN REVIEWS CONFLICTS",
  output: "GOVERNED RECORDS — SOURCE-LINKED",
  idle: "UNSTRUCTURED IN — GOVERNED DATA OUT",
};

export default function DataFoundry({ className }: { className?: string }) {
  const [focus, setFocus] = React.useState<string | null>(null);

  const p = React.useMemo(
    () => fitProjection([[4, 22, 0], [134, 22, 0], [4, 84, 0], [134, 68, 19], [94, 50, 18]], W, H, { pad: 24, headroom: 26 }),
    [],
  );

  const apron = React.useMemo(() => slabOf(APRON, 0, 3, p), [p]);
  const rawDocs = React.useMemo(
    () => [
      slabOf({ x: 7, y: 44, w: 7, d: 9, r: 1 }, 3, 9, p),
      slabOf({ x: 16, y: 45, w: 11, d: 13, r: 1 }, 3, 2, p),
      slabOf({ x: 18, y: 66, w: 7, d: 7, r: 1 }, 3, 5, p),
      slabOf({ x: 6, y: 62, w: 9, d: 5, r: 1 }, 3, 3, p),
    ],
    [p],
  );
  const rawRoll = React.useMemo(() => cylinder(11, 70, 3.5, 3, 5, p, 20), [p]);
  const line = React.useMemo(() => slabOf(LINE, 0, 5, p), [p]);
  const halo = React.useMemo(() => haloOf(LINE, 0, 2, p), [p]);
  const stationBodies = React.useMemo(() => STATIONS.map((s) => slabOf(s.plan, 5, 6, p)), [p]);
  const gate = React.useMemo(() => slabOf(GATE, 5, 13, p), [p]);
  const reviewBay = React.useMemo(() => slabOf(REVIEW, 0, 4, p), [p]);
  const flagged = React.useMemo(
    () => [slabOf({ x: 62, y: 24, w: 6, d: 6, r: 1 }, 4, 3, p), slabOf({ x: 74, y: 24, w: 6, d: 6, r: 1 }, 4, 3, p)],
    [p],
  );
  const pallet = React.useMemo(() => slabOf(PALLET, 0, 3, p), [p]);
  const records = React.useMemo(() => [3, 7, 11, 15].map((z) => slabOf(RECORD, z, 4, p)), [p]);

  const stationLabel = STATIONS.find((_, i) => focus === `station-${i}`)?.label;
  const readout =
    stationLabel ??
    (focus && focus in READOUTS ? READOUTS[focus as keyof typeof READOUTS] : READOUTS.idle);

  const zone = (key: string, label: string, children: React.ReactNode) => (
    <g
      key={key}
      tabIndex={0}
      role="button"
      aria-label={label}
      onPointerEnter={() => setFocus(key)}
      onPointerLeave={() => setFocus(null)}
      onFocus={() => setFocus(key)}
      onBlur={() => setFocus(null)}
      style={{ cursor: "pointer" }}
    >
      {children}
    </g>
  );

  const provenance: [number, number, number][] = [
    [10, 48, 12],
    [21, 51, 5],
    [11, 70, 8],
    [21, 69, 8],
    [10, 64, 6],
  ];

  return (
    <Plate
      fig="FIG B-04"
      title="Data Foundry"
      hint="Hover each stage"
      readout={readout}
      keys={[
        { mark: "raised", label: "Processing stage" },
        { mark: "red", label: "Flagged for review" },
        { mark: "dashed", label: "Review loop & lineage" },
        { mark: "blue", label: "Provenance marker" },
      ]}
      caption="Not OCR: a governed path from fragments to validated records — every fact keeps its source, conflicts go to humans, and the clean data feeds every downstream system."
    >
      <IsoFigure width={W} height={H} label="Interactive isometric diagram of unstructured data becoming governed records">
        {zone("review", READOUTS.review, (
          <>
            <Solid paths={reviewBay} tone={focus === "review" ? "hi" : "lo"} crease="none" />
            {flagged.map((f, i) => (
              <Solid key={i} paths={f} tone="mid" crease="none" />
            ))}
            <Line d={planOutline({ x: 62, y: 24, w: 6, d: 6, r: 1 }, 7, p)} tone="red" />
            <Line d={planOutline({ x: 74, y: 24, w: 6, d: 6, r: 1 }, 7, p)} tone="red" />
          </>
        ))}

        {zone("apron", READOUTS.apron, (
          <>
            <Solid paths={apron} tone={focus === "apron" ? "hi" : "lo"} crease="none" />
            {rawDocs.map((d, i) => (
              <Solid key={i} paths={d} tone={focus === "apron" ? "hi" : "mid"} crease="none" />
            ))}
            <Solid paths={rawRoll} tone={focus === "apron" ? "hi" : "mid"} crease="none" />
          </>
        ))}
        {provenance.map(([x, y, z], i) => (
          <Wire key={i} from={iso([x, y, z], p)} to={iso([x, y, z], p)} tone="blue" size={0.6} ends="both" />
        ))}

        <path className="iso-halo" d={halo} />
        <Solid paths={line} tone="lo" crease="faint" />
        {[
          [32, 36],
          [49, 56],
          [67, 74],
          [85, 90],
          [98, 106],
        ].map(([a, b], i) => (
          <Line key={i} d={lineOnTop([a, 59], [b, 59], 5, p)} tone="mid" flow />
        ))}

        {STATIONS.map((s, i) =>
          zone(`station-${i}`, s.label, <Solid paths={stationBodies[i]!} tone={focus === `station-${i}` ? "hi" : "mid"} lit={focus === `station-${i}`} crease="none" />),
        )}

        {zone("gate", READOUTS.gate, <Solid paths={gate} tone={focus === "gate" ? "hi" : "hi"} lit={focus === "gate"} crease="none" />)}
        <Line d={segment([94, 50, 18], [88, 35, 7], p)} tone="red" dashed />
        <Line d={segment([80, 35, 7], [92, 50, 5], p)} tone="green" dashed />

        {zone("output", READOUTS.output, (
          <>
            <Solid paths={pallet} tone="lo" crease="none" />
            {records.map((r, i) => (
              <Solid key={i} paths={r} tone={focus === "output" ? "hi" : "mid"} crease="none" />
            ))}
          </>
        ))}
        <Wire from={iso([114, 59, 19.6], p)} to={iso([114, 59, 19.6], p)} tone="blue" size={0.7} ends="both" />
        <Line d={lineOnTop([122, 59], [130, 59], 3, p)} tone="mid" flow />
        <Dots points={[iso([132, 54, 3], p), iso([132, 60, 3], p), iso([132, 66, 3], p)]} size={0.7} tone="hi" pulse />
      </IsoFigure>
    </Plate>
  );
}