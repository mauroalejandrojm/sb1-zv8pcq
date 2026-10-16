import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CMD = 'npx madnesslab init --private-stack';

export default function CopyCommand({ className = '' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 text-left backdrop-blur transition-colors hover:bg-secondary/70 ${className}`}
    >
      <span className="flex min-w-0 items-center gap-2 font-mono text-[13px]">
        <span className="text-muted-foreground">$</span>
        <span className="truncate text-foreground/90">{CMD}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5 font-mono-label text-muted-foreground">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 transition-colors group-hover:text-foreground" /> Copy
          </>
        )}
      </span>
    </button>
  );
}