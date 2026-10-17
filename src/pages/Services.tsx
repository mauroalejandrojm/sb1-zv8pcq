import React from 'react';
import {
  Search,
  Gauge,
  Layers,
  Sparkles,
  Brain,
  BarChart,
  Briefcase,
  Code,
  Users,
  Zap,
} from 'lucide-react';
import PigmentDrift from '@/components/PigmentDrift';
import SectionMarker from '@/components/SectionMarker';
import CTA from '@/components/CTA';

const problems = [
  {
    icon: Search,
    title: 'Hours lost searching for internal information',
    body: 'AI knowledge assistants centralize documentation, databases, and internal systems into one intelligent interface.',
  },
  {
    icon: Gauge,
    title: 'Data, but no clear insights',
    body: 'Our Insight Engine converts fragmented data into actionable analytics and predictive intelligence.',
  },
  {
    icon: Layers,
    title: 'Manual processes slow operations',
    body: 'AI-driven automations remove bottlenecks and scale operational efficiency across your team.',
  },
  {
    icon: Sparkles,
    title: 'Scaling creates complexity and chaos',
    body: 'Our systems evolve with your company, providing structure, intelligence, and operational clarity.',
  },
];

const services = [
  {
    icon: Brain,
    name: 'AI Knowledge Systems (RAG)',
    description:
      'We build intelligent internal knowledge assistants that search, understand, and answer questions using your company data and advanced retrieval systems.',
  },
  {
    icon: BarChart,
    name: 'Advanced Analytics & Insight Engines',
    description:
      'Transform raw data into predictive dashboards, automated reports, and strategic insights tailored to your business goals.',
  },
  {
    icon: Briefcase,
    name: 'AI for Operations & Project Management',
    description:
      'Deploy AI-powered assistants to automate workflows, summarize projects, track progress, and improve team productivity.',
  },
  {
    icon: Code,
    name: 'Custom AI Integration',
    description:
      'Integrate AI directly into your existing tools, CRMs, databases, and workflows with secure and scalable architecture.',
  },
  {
    icon: Users,
    name: 'AI Implementation & Enablement',
    description:
      'We guide your team through AI adoption with hands-on onboarding, documentation, and structured rollout plans.',
  },
  {
    icon: Zap,
    name: 'Intelligent Process Automation',
    description:
      'Automate repetitive tasks using AI-driven systems that reduce costs and free your team for higher-value work.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Structure Your Data',
    body: 'We consolidate fragmented data sources, documents, and internal systems into structured knowledge layers ready for AI-powered retrieval and analysis.',
  },
  {
    n: '02',
    title: 'Deploy Intelligent Systems',
    body: 'From AI knowledge assistants to predictive analytics engines, we implement tailored systems designed to integrate directly into your workflows.',
  },
  {
    n: '03',
    title: 'Deliver Measurable Impact',
    body: 'Our solutions generate operational clarity, automation, and actionable insights that scale with your business.',
  },
];

export default function Services() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-20 lg:px-12">
          <span className="font-mono-label text-foreground/70">
            / Services
          </span>

          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            Adopt AI{' '}
            <span className="drift-text">without hiring</span> an AI team.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            We work alongside your team from data to deployment — structuring,
            building, and operating intelligent systems tailored to your
            business.
          </p>
        </div>
      </section>

      {/* CHALLENGES */}
      <section className="relative border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="py-8 lg:py-0">
            <SectionMarker label="Challenges We Tackle" index={1} total={3} />
          </div>

          <h2 className="mt-10 max-w-3xl font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Turning complex business challenges into intelligent solutions.
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {problems.map((p, i) => (
              <div
                key={i}
                className="group flex gap-5 bg-card p-7 transition-colors hover:bg-card/60 sm:p-8"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                  <p.icon className="h-5 w-5 text-[rgb(var(--drift-1))] dark:text-indigo-400" />
                </div>

                <div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="What We Do" index={2} total={3} />

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:col-span-7">
              Practical AI solutions, built around your needs.
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
              From intelligent knowledge systems to custom integrations and
              automation, we help individuals, teams, and organizations put AI
              to work where it matters most.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.name}
                className="group flex flex-col bg-card p-7 transition-colors hover:bg-card/60 sm:p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                  <service.icon className="h-5 w-5 text-[rgb(var(--drift-1))] dark:text-indigo-400 transition-transform group-hover:scale-110" />
                </div>

                <h3 className="mt-6 font-heading text-xl font-bold leading-snug tracking-tight">
                  {service.name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-auto pt-6">
                  <span className="block h-px w-full bg-gradient-to-r from-[rgb(var(--drift-1))] via-[rgb(var(--drift-2))] to-transparent dark:from-indigo-400/80 dark:via-indigo-400/40 dark:to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="Process" index={3} total={3} />

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:col-span-7">
              Transforming data into actionable insights.
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
              Data creates value when it leads to action. Our three-stage
              process turns disconnected information into intelligent,
              practical, and scalable business solutions.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <article key={s.n} className="flex h-full flex-col">
                <span className="font-mono-label text-base text-[rgb(var(--drift-1))] dark:text-indigo-400">
                  {s.n}
                </span>

                <h3 className="mt-4 font-heading text-xl font-bold leading-snug tracking-tight md:min-h-[3.5rem]">
                  {s.title}
                </h3>

                <p className="mt-3 mb-5 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>

                <span className="mt-auto block h-px w-full bg-gradient-to-r from-[rgb(var(--drift-1))] via-[rgb(var(--drift-2))] to-transparent dark:from-indigo-400/80 dark:via-indigo-400/40 dark:to-transparent pt-0" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <CTA />
    </div>
  );
}