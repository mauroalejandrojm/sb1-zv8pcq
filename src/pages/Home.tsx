import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Database, Workflow } from 'lucide-react';
import PigmentDrift from '@/components/PigmentDrift';
import SectionMarker from '@/components/SectionMarker';
import CoreStack from '@/components/iso/CoreStack';
import CTA from '@/components/CTA';
import CopyCommand from '@/components/home/CopyCommand';
import StatsStrip from '@/components/home/StatsStrip';
import RiskSection from '@/components/home/RiskSection';
import Differentiators from '@/components/home/Differentiators';
import LogoStrip from '@/components/home/LogoStrip';
import { useTheme } from 'next-themes';

const entries = [
  {
    icon: Database,
    label: '/ Products',
    title: 'Intelligent systems, built to order.',
    body: 'Explore the platforms we engineer — knowledge assistants, insight engines and workflow automations, each with a transparent architecture.',
    to: '/products',
    cta: 'Explore Products',
  },
  {
    icon: Workflow,
    label: '/ Services',
    title: 'A partner for adopting AI, end to end.',
    body: 'From structuring your data to deploying and operating the systems that run on it — without hiring an in-house AI team.',
    to: '/services',
    cta: 'Explore Services',
  },
];

export default function Home() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">
        <PigmentDrift 
          imageAngle={180} 
          fadeAngle={0} 
          fadeStart={50} 
          fadeEnd={50} 
          darkness={resolvedTheme === "dark" ? 0.60 : 0} 
          backdropBlur={25} 
          backdropBrightness={1.5} 
          fade={true} />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-8 lg:items-center lg:px-12 py-20">
          <div className="min-w-0 lg:col-span-6 animate-fade-up">
            <span className="font-mono-label text-foreground/70">/ The antidote to black-box AI</span>
            <h1 className="mt-6 font-heading text-[clamp(2rem,9vw,2.6rem)] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Turn your company knowledge <span className="drift-text">&amp; data</span> into intelligent systems.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
              We help small businesses &amp; startups adopt AI to automate workflows and improve efficiency —
              eliminating the need for an in-house AI team, without handing your data to a black box.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]">
                Book a Strategy Call
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link to="/experience" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-secondary">
                See our Experience <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 max-w-sm">
              <p className="font-mono-label text-muted-foreground">/ Or bootstrap your stack</p>
              <CopyCommand className="mt-3" />
            </div>
          </div>

          <div className="lg:col-span-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgb(var(--drift-1)/0.18),transparent)] blur-2xl" />
              {/* <CoreStack /> */}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsStrip />

      {/* THE RISK */}
      <RiskSection />

      {/* WHY MADNESSLAB */}
      <Differentiators />

      {/* PRODUCTS & SERVICES ENTRY */}
      <section className="relative border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="What We Do" index={4} total={5} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 className="lg:col-span-7 font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Two ways to work with MadnessLab.
            </h2>
            <p className="lg:col-span-5 text-sm leading-relaxed text-muted-foreground">
              Browse the systems we build, or see how we work alongside your team — from structuring
              your data to running the systems that depend on it.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {entries.map((e) => (
              <Link
                key={e.to}
                to={e.to}
                className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:bg-secondary/70 sm:p-10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
                  <e.icon className="h-5 w-5 text-[rgb(var(--drift-1))]" />
                </div>
                <span className="mt-6 block font-mono-label text-muted-foreground">{e.label}</span>
                <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight">{e.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
                <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {e.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <LogoStrip />
      <CTA />
    </div>
  );
}