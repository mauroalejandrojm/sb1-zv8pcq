import React from 'react';
import SectionMarker from '@/components/SectionMarker';
import BlackBoxDiagram from '@/components/home/BlackBoxDiagram';

export default function RiskSection() {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionMarker label="The Risk" index={1} total={4} />
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              The black box is costing more than you think.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Pasting company data into a public chat window is easy — that's the problem. Your
              documents, client records and internal know-how drift through systems nobody on your
              team can inspect, explain or hold accountable.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We build the opposite: engineered systems where every layer sits in plain sight and
              every answer can be traced back to its source.
            </p>
          </div>
          <div className="lg:col-span-7">
            <BlackBoxDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}