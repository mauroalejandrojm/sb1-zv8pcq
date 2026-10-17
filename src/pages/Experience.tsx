import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, BarChart3, Boxes, Cog, Gauge, Map, Search } from 'lucide-react';
import PigmentDrift from '@/components/PigmentDrift';
import SectionMarker from '@/components/SectionMarker';
import CTA from '@/components/CTA';

const challenges = [
  {
    icon: BookOpen,
    title: 'Scattered Knowledge & Internal Documentation',
    problem: 'Teams lose hours searching across Notion, Google Drive, PDFs, Slack messages, and databases. Information exists — but it is fragmented and difficult to retrieve.',
    approach: 'We deploy secure AI knowledge systems (RAG-based assistants like Wiki Weaver) that centralize your data and provide instant, contextual answers.',
  },
  {
    icon: BarChart3,
    title: 'Data Without Actionable Insights',
    problem: 'Organizations collect large amounts of data but struggle to convert it into strategic insights, dashboards, or executive-ready reports.',
    approach: 'Our Insight Engine transforms raw data into predictive analytics, automated reporting, and decision-ready dashboards.',
  },
  {
    icon: Cog,
    title: 'Manual & Inefficient Workflows',
    problem: 'Repetitive operational tasks and disconnected systems slow down productivity and increase operational costs.',
    approach: 'We design AI-powered workflow automation and project assistants to streamline operations and improve execution speed.',
  },
  {
    icon: Map,
    title: 'Unclear AI Strategy & Implementation',
    problem: 'Many companies want to adopt AI but lack a clear roadmap, technical structure, or secure deployment strategy.',
    approach: 'We create practical AI implementation roadmaps and deliver scalable, secure systems aligned with your business objectives.',
  },
];

const deliveryStages = [
  {
    icon: Search,
    n: '01',
    title: 'Understand the work',
    body: 'We map the people, decisions, data, and existing tools behind the challenge before recommending a solution.',
  },
  {
    icon: Boxes,
    n: '02',
    title: 'Shape the system',
    body: 'We define the data foundations, integrations, safeguards, and success measures the system needs.',
  },
  {
    icon: Cog,
    n: '03',
    title: 'Build into your stack',
    body: 'We implement and connect the solution around your current tools, with clear validation and human oversight.',
  },
  {
    icon: Gauge,
    n: '04',
    title: 'Measure and improve',
    body: 'We help your team put the system to work, track its impact, and refine it as your needs change.',
  },
];

export default function Experience() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border">
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <span className="font-mono-label text-foreground/70 mt-1.5">/ Experience</span>
          <h1 className="mt-10 max-w-4xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl">
            Challenges we help <span className="drift-text">solve.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            We focus on solving real operational and data challenges with practical, scalable AI systems
            designed for growing teams and modern organizations.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 mt-6">
          <div className="py-8 lg:py-0">
            <SectionMarker label="Out Experience" index={1} total={2} />
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {challenges.map((c, i) => (
              <div
                key={i}
                className="grid gap-6 bg-card p-7 sm:p-9 md:grid-cols-12 md:items-start"
              >
                {/* Icon */}
                <div className="md:col-span-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <c.icon className="h-5 w-5 text-[rgb(var(--drift-1))] dark:text-indigo-400" />
                  </div>
                </div>

                {/* Challenge and approach share aligned rows */}
                <div className="md:col-span-11">
                  <div className="grid gap-x-8 gap-y-3 md:grid-cols-11">
                    {/* Challenge heading */}
                    <div className="md:col-span-5">
                      <span className="font-mono-label text-muted-foreground">
                        [ {String(i + 1).padStart(2, '0')} ]
                      </span>

                      <h2 className="mt-3 font-heading text-xl font-bold tracking-tight sm:text-2xl">
                        {c.title}
                      </h2>
                    </div>

                    {/* Approach heading */}
                    <div className="md:col-span-6 md:border-l md:border-border md:pl-8 mt-10">
                      <span className="font-mono-label text-[rgb(var(--drift-1))] dark:text-[rgb(var(--drift-4))]">
                        / Our Approach
                      </span>
                    </div>

                    {/* Problem paragraph */}
                    <div className="md:col-span-5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {c.problem}
                      </p>
                    </div>

                    {/* Approach paragraph */}
                    <div className="md:col-span-6 md:border-l md:border-border md:pl-8">
                      <p className="text-sm leading-relaxed  text-muted-foreground">
                        {c.approach}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Whether you're an individual, a growing team, or an established organization, we build practical AI solutions tailored to your needs.
          </p>
          <Link
            to="/services"
            className="group mt-8 inline-flex items-center gap-2 font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore our services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      <section className="relative border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="Our Delivery Approach" index={2} total={2} />

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:col-span-7">
              From operational challenge to a system your team can use.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
              Good AI starts with the work itself. We move from understanding
              your needs to building, integrating, and improving practical
              systems alongside your team.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {deliveryStages.map((stage) => (
              <article
                key={stage.n}
                className="group flex flex-col bg-card p-7 transition-colors hover:bg-card/60 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                    <stage.icon className="h-5 w-5 text-[rgb(var(--drift-1))] transition-transform group-hover:scale-110 dark:text-indigo-400" />
                  </div>
                  <span className="font-mono-label text-base text-muted-foreground">
                    [ {stage.n} ]
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-bold leading-snug tracking-tight">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {stage.body}
                </p>

                <div className="mt-auto pt-6">
                  <span className="block h-px w-full bg-gradient-to-r from-[rgb(var(--drift-1))] via-[rgb(var(--drift-2))] to-transparent opacity-60 transition-opacity group-hover:opacity-100 dark:from-indigo-400/80 dark:via-indigo-400/40 dark:to-transparent" />
                </div>
              </article>
            ))}
          </div>

          <Link
            to="/services"
            className="group mt-8 inline-flex items-center gap-2 font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore our services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      {/* CALL TO ACTION */}
      <CTA />
    </div>
    
  );
}