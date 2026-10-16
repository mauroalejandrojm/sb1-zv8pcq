import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, FileWarning, FileCheck, HelpCircle, Layers } from 'lucide-react';

const MODES = {
  typical: {
    label: 'Typical AI stack',
    tone: 'text-destructive',
    bullets: [
      { icon: EyeOff, text: 'Your documents leave your perimeter on every query' },
      { icon: HelpCircle, text: 'Reasoning is opaque — nobody can audit why it answered' },
      { icon: FileWarning, text: 'Answers arrive unverifiable; errors surface in production' },
    ],
  },
  ml: {
    label: 'MadnessLab stack',
    tone: 'text-[rgb(var(--drift-1))]',
    bullets: [
      { icon: Eye, text: 'Data stays inside infrastructure you control' },
      { icon: Layers, text: 'Every layer — retrieval, routing, delivery — is inspectable' },
      { icon: FileCheck, text: 'Every answer carries citations back to your sources' },
    ],
  },
};

export default function BlackBoxDiagram() {
  const [mode, setMode] = useState('typical');
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => setMode((m) => (m === 'typical' ? 'ml' : 'typical')), 4200);
    return () => clearInterval(t);
  }, [locked]);

  const choose = (m) => {
    setLocked(true);
    setMode(m);
  };

  const isTypical = mode === 'typical';

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-border bg-background p-1">
          {Object.entries(MODES).map(([key, m]) => (
            <button
              key={key}
              type="button"
              onClick={() => choose(key)}
              className={`rounded-full px-4 py-1.5 font-mono-label transition-colors ${
                mode === key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="font-mono-label text-muted-foreground">{locked ? 'Manual mode' : 'Auto-cycling — click to compare'}</span>
      </div>

      <svg viewBox="0 0 640 250" className="mt-6 w-full" role="img" aria-label="Comparison of a typical third-party AI stack and the MadnessLab engineered core">
        {/* left node */}
        <rect x="14" y="98" width="124" height="54" rx="12" className="fill-secondary stroke-border" />
        <text x="76" y="121" textAnchor="middle" className="fill-foreground font-mono" fontSize="11">YOUR DATA</text>
        <text x="76" y="137" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="8.5">docs · crm · ops</text>

        {/* connectors */}
        <path d="M138 125 H188" className="bb-flow stroke-muted-foreground" strokeWidth="1.5" fill="none" />
        <polygon points="196,125 188,121 188,129" className="fill-muted-foreground" />
        <path d="M450 125 H494" className="bb-flow stroke-muted-foreground" strokeWidth="1.5" fill="none" />
        <polygon points="502,125 494,121 494,129" className="fill-muted-foreground" />

        {/* typical center */}
        <g className="bb-fade" style={{ opacity: isTypical ? 1 : 0 }}>
          <rect x="262" y="38" width="166" height="22" rx="11" className="fill-[rgb(var(--destructive)/0.12)]" />
          <text x="345" y="53" textAnchor="middle" className="fill-destructive font-mono" fontSize="8.5">DATA LEAVES YOUR CONTROL</text>
          <rect x="196" y="72" width="248" height="106" rx="14" className="fill-foreground" />
          <text x="320" y="98" textAnchor="middle" className="fill-background font-mono" fontSize="10">THIRD-PARTY LLM</text>
          <text x="320" y="112" textAnchor="middle" className="fill-background/60 font-mono" fontSize="8.5">trained on your prompts</text>
          <text x="320" y="160" textAnchor="middle" className="fill-background/80 font-heading" fontSize="36" fontWeight="700">?</text>
          <rect x="502" y="98" width="124" height="54" rx="12" className="fill-background stroke-[rgb(var(--destructive)/0.6)]" />
          <text x="564" y="121" textAnchor="middle" className="fill-destructive font-mono" fontSize="11">UNVERIFIED</text>
          <text x="564" y="137" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="8.5">no sources, no audit</text>
        </g>

        {/* madnesslab center */}
        <g className="bb-fade" style={{ opacity: isTypical ? 0 : 1 }}>
          <rect x="262" y="38" width="166" height="22" rx="11" className="fill-[rgb(var(--drift-1)/0.12)]" />
          <text x="345" y="53" textAnchor="middle" className="fill-[rgb(var(--drift-1))] font-mono" fontSize="8.5">DATA STAYS UNDER YOUR CONTROL</text>
          <rect x="212" y="88" width="248" height="106" rx="14" className="fill-secondary stroke-border" />
          <rect x="204" y="80" width="248" height="106" rx="14" className="fill-secondary stroke-border" />
          <rect x="196" y="72" width="248" height="106" rx="14" className="fill-background stroke-[rgb(var(--drift-1))]" strokeWidth="1.5" />
          <text x="320" y="92" textAnchor="middle" className="fill-foreground font-mono" fontSize="10">ENGINEERED CORE</text>
          {[
            { y: 102, label: 'DATA LAYER' },
            { y: 124, label: 'LOGIC LAYER' },
            { y: 146, label: 'ANSWER LAYER' },
          ].map((l) => (
            <g key={l.label}>
              <rect x="216" y={l.y} width="208" height="14" rx="7" className="fill-secondary stroke-border" />
              <text x="228" y={l.y + 10} className="fill-foreground/80 font-mono" fontSize="8">{l.label}</text>
            </g>
          ))}
          <rect x="502" y="98" width="124" height="54" rx="12" className="fill-background stroke-[rgb(var(--drift-1))]" />
          <text x="564" y="121" textAnchor="middle" className="fill-[rgb(var(--drift-1))] font-mono" fontSize="11">VERIFIED</text>
          <text x="564" y="137" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="8.5">cited &amp; auditable</text>
        </g>
      </svg>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
        {MODES[mode].bullets.map((b) => (
          <li key={mode + b.text} className={`flex items-start gap-2 animate-fade-up ${MODES[mode].tone}`}>
            <b.icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="text-xs leading-relaxed text-foreground/80">{b.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}