import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-24 text-center">
        <span className="font-mono-label text-foreground/70">/ Start Building</span>
        <h2 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1] tracking-tight sm:text-6xl">
          Ready to build your <span className="drift-text">AI system?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-foreground/70">
          Let's design a tailored AI solution aligned with your data, workflows, and growth strategy.
        </p>
        <Link to="/contact" className="group mt-9 inline-flex items-center gap-1.5 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]">
          Start the Conversation
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}