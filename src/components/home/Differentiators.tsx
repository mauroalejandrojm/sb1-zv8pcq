import React from 'react';
import { Brain, ShieldCheck, Microscope, TrendingUp } from 'lucide-react';
import SectionMarker from '@/components/SectionMarker';

const ITEMS = [
  {
    icon: Brain,
    title: 'Knowledge, not vibes',
    body: 'We know how retrieval, evaluation and security work under the hood — so when a system misbehaves, we fix the cause instead of re-rolling the prompt.',
  },
  {
    icon: ShieldCheck,
    title: 'Your data stays yours',
    body: 'Every deployment is architected so client and company data never leaks into a third party\u2019s training set.',
  },
  {
    icon: Microscope,
    title: 'Transparent by design',
    body: 'No black boxes. Every answer traces to its source, and every layer is documented, audited and yours to inspect.',
  },
  {
    icon: TrendingUp,
    title: 'Results you can measure',
    body: 'We define success metrics before writing a line of code — then report against them: hours saved, accuracy, throughput.',
  },
];

export default function Differentiators() {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionMarker label="Why MadnessLab" index={3} total={5} />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 className="lg:col-span-7 font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Knowledge beats the <span className="drift-text">black box.</span>
          </h2>
          <p className="lg:col-span-5 text-sm leading-relaxed text-muted-foreground">
            Anyone can paste a prompt. We bring the engineering discipline that turns AI from a
            gamble into infrastructure your business can trust.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-[rgb(var(--drift-1)/0.5)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-[rgb(var(--drift-1)/0.5)]">
                <item.icon className="h-5 w-5 text-[rgb(var(--drift-1))]" />
              </div>
              <h3 className="mt-6 font-heading text-lg font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}