import * as React from "react";
import {
  fitProjection,
  slabOf,
  insetPlan,
  type Plan,
  cylinder,
  knurl,
  ring,
  dotGrid,
  topTicks,
  sideTicks,
  radialTicks,
  lineOnTop,
  iso,
  haloOf,
  translateAlong,
  type SolidPaths,
} from "./iso-kit";
import { Solid, Line, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, follow } from "./live";

interface Tier {
  name: string;
  metric: string;
  paths: SolidPaths;
  base: Plan;
  z: number;
  height: number;
}

const CORE_PLAN: Plan = { x: 20, y: 20, w: 80, d: 80, r: 5 };
const INSETS = [0, 6, 10, 14, 17];
const Z_BASES = [0, 8, 24, 38, 50];
const HEIGHTS = [6, 14, 12, 10, 5];
const NAMES = ["CONCOURSE", "MEMORY", "RETRIEVAL", "INFERENCE", "ORCHESTRATOR"];
const METRICS = ["INGEST 4.2K/MIN", "HIT RATE 94.1%", "P95 38MS", "16 ROUTES", "SUPERVISOR LIVE"];

const WIDTH = 420;
const HEIGHT = 320;

export default function CoreStack({ className }: { className?: string }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const lift = React.useRef<number[]>([0, 0, 0, 0, 0]);
  const [, setTick] = React.useState(0);

  const projection = React.useMemo(
    () => fitProjection([[8, 8, 0], [124, 8, 0], [8, 112, 0], [124, 112, 0], [124, 112, 58]], WIDTH, HEIGHT, { pad: 34, headroom: 50 }),
    [],
  );

  const tiers: Tier[] = React.useMemo(
    () =>
      INSETS.map((inset, index) => {
        const base = inset === 0 ? CORE_PLAN : insetPlan(CORE_PLAN, inset);
        return {
          name: NAMES[index]!,
          metric: METRICS[index]!,
          paths: slabOf(base, Z_BASES[index]!, HEIGHTS[index]!, projection, 8),
          base,
          z: Z_BASES[index]!,
          height: HEIGHTS[index]!,
        };
      }),
    [projection],
  );

  const railPaths = React.useMemo(() => slabOf({ x: 4, y: 36, w: 8, d: 48, r: 2 }, 0, 12, projection, 8), [projection]);
  const coilPaths = React.useMemo(() => cylinder(116, 62, 6, 0, 32, projection, 32), [projection]);
  const knurlLines = React.useMemo(() => knurl(116, 62, 6, 0, 32, 10, projection), [projection]);
  const coilRings = React.useMemo(() => [14, 21, 28].map((z) => ring(116, 62, 8.5, z, projection, 28)).join(""), [projection]);

  const topTicksPaths = React.useMemo(() => topTicks(20, 100, 4, 5, 14, 52, [0.8, 1.6], projection, "x"), [projection]);
  const sideTicksPaths = React.useMemo(() => sideTicks(0, 80, 4, 4, 14, 44, [1, 2], projection, "y"), [projection]);
  const topDots = React.useMemo(() => dotGrid(26, 26, 8, 8, 7, 53, projection), [projection]);
  const coreDot = React.useMemo(() => iso([60, 60, 54], projection), [projection]);
  const halo = React.useMemo(() => haloOf(CORE_PLAN, 0, 2, projection), [projection]);
  const railHalo = React.useMemo(() => haloOf({ x: 4, y: 36, w: 8, d: 48, r: 2 }, 0, 1, projection), [projection]);

  useLoop(
    (dt, calm) => {
      let busy = false;
      lift.current = lift.current.map((value, index) => {
        const target = hover === index ? 1.5 : 0;
        const next = follow(value, target, dt, 0.06, calm);
        if (next !== target) busy = true;
        return next;
      });
      setTick((tick) => tick + 1);
      return busy;
    },
    hover !== null,
  );

  const readout = hover === null ? "SYSTEM NOMINAL" : `${tiers[hover]!.name} — ${tiers[hover]!.metric}`;

  return (
    <div>
      <Plate
        fig="FIG A-01"
        title="Data Core"
        hint="Hover the tiers"
        readout={readout}
        keys={[
          { mark: "raised", label: "Stack tier" },
          { mark: "lit", label: "Focused tier" },
          { mark: "edge", label: "Reference edge" },
        ]}
        caption="Five stacked services share one concourse — memory, retrieval, inference and orchestration above it."
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label="Interactive isometric diagram of the MadnessLab data core stack">
          <path className="iso-halo" d={halo} />
          <path className="iso-halo" d={railHalo} />
          <Solid paths={tiers[0]!.paths} tone="mid" crease="none" />
          {tiers.slice(1).map((tier, index) => {
            const lit = hover === index + 1;
            const by = lift.current[index + 1] ?? 0;
            return (
              <g
                key={tier.name}
                transform={by ? translateAlong(projection, [0, 0, by]) : undefined}
                style={{ cursor: "pointer" }}
                tabIndex={0}
                role="button"
                aria-label={`${tier.name}: ${tier.metric}`}
                onPointerEnter={() => setHover(index + 1)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(index + 1)}
                onBlur={() => setHover(null)}
              >
                <Solid paths={tier.paths} tone={lit ? "hi" : "mid"} crease="faint" lit={lit} />
              </g>
            );
          })}
          <Solid paths={railPaths} tone="lo" crease="none" flat />
          <Solid paths={coilPaths} tone="lo" crease="none" />
          <Line d={knurlLines} tone="faint" />
          <Line d={coilRings} tone="faint" />
          <Line d={topTicksPaths.minor} tone="faint" />
          <Line d={topTicksPaths.major} tone="lo" />
          <Line d={sideTicksPaths.minor} tone="faint" />
          <Line d={sideTicksPaths.major} tone="lo" />
          <Line d={lineOnTop([14, 100], [106, 100], 2, projection)} tone="lo" />
          <Dots points={topDots} size={0.45} tone="faint" />
          <Dots points={[coreDot]} size={1} tone="hi" pulse />
        </IsoFigure>
      </Plate>
    </div>
  );
}