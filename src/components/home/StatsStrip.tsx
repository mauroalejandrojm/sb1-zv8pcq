import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 94.1, decimals: 1, suffix: '%', label: 'Answer hit rate' },
  { value: 38, decimals: 0, suffix: 'ms', label: 'P95 retrieval latency' },
  { value: 4.2, decimals: 1, suffix: 'K/min', label: 'Document ingest' },
  { value: 100, decimals: 0, suffix: '%', label: 'Auditable layers' },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function Stat({ value, decimals, suffix, label, active }) {
  const current = useCountUp(value, active);
  return (
    <div className="text-center sm:text-left">
      <p className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        {current.toFixed(decimals)}
        <span className="text-[rgb(var(--drift-1))]">{suffix}</span>
      </p>
      <p className="mt-2 font-mono-label text-muted-foreground">{label}</p>
    </div>
  );
}

export default function StatsStrip() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-4 lg:px-12">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} active={active} />
        ))}
      </div>
    </section>
  );
}