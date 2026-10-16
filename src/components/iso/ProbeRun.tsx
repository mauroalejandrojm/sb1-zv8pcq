import * as React from "react";
import { fitProjection, slabOf, dotGrid, iso, type SolidPaths } from "./iso-kit";
import { Solid, Line, Dots, IsoFigure, Plate } from "./draw";


const WIDTH = 420;
const HEIGHT = 190;
const RAIL: { x: number; y: number; w: number; d: number; r: number } = { x: 6, y: 44, w: 152, d: 22, r: 2 };
const STAGES = ["INGEST", "PARSE", "EMBED", "RANK", "REVIEW", "SHIP"];

export default function ProbeRun({ className }: { className?: string }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const projection = React.useMemo(() => fitProjection([[0, 0, 0], [162, 0, 0], [0, 74, 0], [162, 74, 0], [162, 74, 26]], WIDTH, HEIGHT, { pad: 28, headroom: 24 }), []);

  const railPaths: SolidPaths = React.useMemo(() => slabOf(RAIL, 0, 7, projection, 8), [projection]);
  const floorDots = React.useMemo(() => dotGrid(10, 12, 16, 4, 9, 0, projection), [projection]);

  const readout = hover === null ? "PROBE LINE READY" : `STAGE ${hover + 1}/${STAGES.length} — ${STAGES[hover]}`;

  const probes = [];
  for (let index = 0; index < STAGES.length; index++) {
    const x = 16 + index * 24;
    const lit = hover === index;
    probes.push(
      <g
        key={index}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label={`Pipeline stage ${index + 1}: ${STAGES[index]}`}
        onPointerEnter={() => setHover(index)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(index)}
        onBlur={() => setHover(null)}
      >
        <Solid
          paths={slabOf({ x: x - 6, y: 49, w: 12, d: 12, r: 1 }, 7, lit ? 8 : 5, projection, 4)}
          tone={lit ? "hi" : "lo"}
          crease="none"
          lit={lit}
        />
        <Line d={iso([x, 55, 15], projection).join(",") + ` L` + iso([x, 55, 24], projection).join(",")} tone={lit ? "mid" : "faint"} />
        <Dots points={[iso([x, 55, 26], projection)]} size={lit ? 1 : 0.6} tone={lit ? "hi" : "faint"} pulse={lit} />
      </g>,
    );
  }

  return (
    <div>
      <Plate
        fig="FIG A-03"
        title="Probe Run"
        hint="Hover a probe"
        readout={readout}
        keys={[
          { mark: "lit", label: "Active stage" },
          { mark: "dim", label: "Standing probe" },
        ]}
        caption="Six probes ride the rail on every run — ingest, parse, embed, rank, review and ship."
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label="Interactive isometric diagram of a six stage pipeline">
          <Dots points={floorDots} size={0.4} tone="faint" />
          <Solid paths={railPaths} tone="mid" crease="none" />
          <Line d={iso([2, 44, 8], projection).join(",") + ` L` + iso([162, 44, 8], projection).join(",")} tone="faint" />
          {probes}
        </IsoFigure>
      </Plate>
    </div>
  );
}