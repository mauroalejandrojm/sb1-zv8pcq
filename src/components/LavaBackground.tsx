import { useEffect, useRef } from "react";

const LavaBackground: React.FC = () => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interactive = interactiveRef.current!;
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    const easeFactor = 10;

    const move = () => {
      curX += (tgX - curX) / easeFactor;
      curY += (tgY - curY) / easeFactor;

      interactive.style.transform = `translate(${curX}px, ${curY}px)`;

      requestAnimationFrame(move);
    };

    window.addEventListener("pointermove", (e) => {
      tgX = e.clientX;
      tgY = e.clientY;
    });

    move();
  }, []);

  return (
    <div className="absolute -inset-20 overflow-hidden -z-5 bg-white dark:bg-gray-800">
      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 1 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="w-full h-full"
        style={{
          filter: "url(#goo) blur(30px)",
        }}
      >
        {/* Floating Gradients */}
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />

        {/* Cursor Interactive Blob */}
        <div ref={interactiveRef} className="interactive" />
      </div>
    </div>
  );
};

export default LavaBackground;
