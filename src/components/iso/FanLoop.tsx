import * as React from "react";
import { fitProjection, slabOf, insetPlan, radialTicks, topTicks, iso, type SolidPaths } from "./iso-kit";
import { Solid, Line, Dots, IsoFigure, Plate } from "./draw";
import { useLoop, useInView } from "./live";

const WIDTH = 300;
const HEIGHT = 250;

const RING = 8;

export default function FanLoop({ className }: { className?: string }) {
  const [hover, setHover] = React.useState(false);
  const rotation = React.useRef(0);
  const [, setTick] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement>(null);
  const inView = useInView(wrap);

  const projection = React.useMemo(() => fitProjection([[0, 0, 0], [122, 0, 0], [0, 92, 0], [122, 92, 0], [122, 92, 16]], WIDTH, HEIGHT, { pad: 30, headroom: 60 }), []);

  const housingPaths: SolidPaths = React.useMemo(() => slabOf({ x: 8, y: 8, w: 74, d: 74, r: 6 }, 0, 10, projection, 8), [projection]);
  const ventPaths: SolidPaths = React.useMemo(() => slabOf({ x: 92, y: 30, w: 26, d: 22, r: 2 }, 0, 6, projection, 8), [projection]);
  const gaugeTicks = React.useMemo(() => radialTicks(108, 16, 7, 12, 4, 7, [0.7, 1.4], projection), [projection]);
  const ventTicks = React.useMemo(() => topTicks(94, 116, 2, 6, 31, 7, [0.6, 1.2], projection, "x"), [projection]);

  useLoop(
    (dt, calm) => {
      rotation.current = (rotation.current + dt * (calm ? 0 : 260)) % 360;
      setTick((tick) => tick + 1);
      return true;
    },
    inView,
  );

  const readout = hover ? "INTAKE 3.2K RPM — LOOP STABLE" : "INTAKE IDLE — LOOP STABLE";

  const blades = [];
  for (let index = 0; index < 5; index++) {
    blades.push(
      <g key={index} transform={`rotate(${rotation.current + index * 72})`}>
        <path className="tb-shine" d="M5 -2 L17 -6 L19 1 L7 3 Z" />
        <path className="iso-line" data-tone="lo" d="M5 -2 L17 -6 L19 1 L7 3 Z" />
      </g>,
    );
  }

  return (
    <div ref={wrap}>
      <Plate
        fig="FIG A-04"
        title="Cooling Loop"
        hint="Hover the fan"
        readout={readout}
        keys={[
          { mark: "lit", label: "Intake fan" },
          { mark: "dotted", label: "Airflow path" },
        ]}
        caption="Every request passes a cooling loop — intake, venting and a standing gauge on the model layer."
      >
        <IsoFigure width={WIDTH} height={HEIGHT} label="Interactive isometric diagram of a request cooling loop">
          <Solid paths={housingPaths} tone="mid" crease="none" lit={!hover} />
          <g
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            aria-label="Intake fan"
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
          >
            <g transform={`translate(${iso([45, 45, 10], projection)[0]} ${iso([45, 45, 10], projection)[1]})`}>
              {blades}
              <circle className="tb-shade" r={RING} />
              <circle className="iso-line" data-tone="hi" r={RING} fill="none" />
              <circle className="tb-ring" data-tone="mid" r={RING - 2.2} fill="none" />
            </g>
          </g>
          <Solid paths={ventPaths} tone="lo" crease="none" />
          <Line d={ventTicks.minor} tone="faint" />
          <Line d={ventTicks.major} tone="lo" />
          <Line d={gaugeTicks.minor} tone="faint" />
          <Line d={gaugeTicks.major} tone="lo" />
          <Line d={`${iso([70, 40, 10], projection).join(",")} L${iso([94, 40, 10], projection).join(",")}`} tone="faint" dotted />
          <Dots
            points={[iso([76, 40, 11], projection), iso([84, 40, 11], projection), iso([92, 40, 11], projection)]}
            size={0.6}
            tone="mid"
            pulse
          />
        </IsoFigure>
      </Plate>
    </div>
  );
}