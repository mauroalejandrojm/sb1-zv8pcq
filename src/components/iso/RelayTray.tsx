import * as React from "react";
import { fitProjection, slabOf, insetPlan, sideTicks, iso, type SolidPaths } from "./iso-kit";
import { Solid, Line, Dots, IsoFigure, Plate } from "./draw";


const WIDTH = 320;
const HEIGHT = 220;
const TRAY: { x: number; y: number; w: number; d: number; r: number } = { x: 10, y: 10, w: 130, d: 80, r: 5 };
const CHANNELS = 8;
const UTIL = [0.86, 0.72, 0.96, 0.55, 0.81, 0.44, 0.9, 0.67];

export default function RelayTray({ className }: { className?: string }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const projection = React.useMemo(() => fitProjection([[0, 0, 0], [146, 0, 0], [0, 96, 0], [146, 96, 0], [146, 96, 14]], WIDTH, HEIGHT, { pad: 30, headroom: 40 }), []);

  const trayPaths: SolidPaths = React.useMemo(() => slabOf(TRAY, 0, 12, projection, 8), [projection]);
  const basinPaths: SolidPaths = React.useMemo(() => slabOf(insetPlan(TRAY, 6), 10, 3, projection, 8), [projection]);
  const ticks = React.useMemo(() => sideTicks(0, 80, 4, 4, 10, 12, [0.6, 1.2], projection, "y"), [projection]);

  const readout = hover === null ? "RELAY STABLE" : `CH ${hover + 1} — UTIL ${(UTIL[hover]! * 100).toFixed(0)}%`;

  const channels = [];
  for (let index = 0; index < CHANNELS; index++) {
    const x = 22 + index * 14;
    const util = UTIL[index]!;
    const lit = hover === index;
    const midY = 50;
    const half = 4 + util * 26;
    channels.push(
      <g
        key={index}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label={`Relay channel ${index + 1} at ${(util * 100).toFixed(0)} percent utilization`}
        onPointerEnter={() => setHover(index)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(index)}
        onBlur={() => setHover(null)}
      >
        <Line d={iso([x, midY - half, 13], projection).join(",") + ` L` + iso([x, midY + half, 13], projection).join(",")} tone={lit ? "hi" : "mid"} />
        <Dots points={[iso([x, midY, 13], projection)]} size={lit ? 1 : 0.7} tone={lit ? "hi" : "mid"} pulse={lit} />
      </g>,
    );
  }

  return (
    <div>
      <Plate
        fig="FIG A-02"
        title="Relay Tray"
        hint="Hover a channel"
        readout={readout}
        keys={[
          { mark: "raised", label: "Channel load" },
          { mark: "lit", label: "Focused relay" },
        ]}
        caption="Eight relay channels move data through the tray — each one is monitored for utilization in real time."
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label="Interactive isometric diagram of eight relay channels">
          <Solid paths={trayPaths} tone="mid" crease="faint" lit={false} />
          <Solid paths={basinPaths} tone="lo" crease="none" />
          <Line d={ticks.minor} tone="faint" />
          <Line d={ticks.major} tone="lo" />
          {channels}
        </IsoFigure>
      </Plate>
    </div>
  );
}