import React from 'react';

export default function SectionMarker({ label, index, total = 8 }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 w-full">
        <span className="font-mono-label text-muted-foreground">/ {label}</span>
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono-label text-muted-foreground">[ {index} / {String(total).padStart(2, '0')} ]</span>
      </div>
    </div>
  );
}