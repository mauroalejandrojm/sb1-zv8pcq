import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, BarChart3, Cog, Map } from 'lucide-react';
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

export default function Experience() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-10 sm:py-20">
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
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
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
          <Link to="/contact" className="group mt-8 inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]">
            Book a Strategy Call
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
      {/* CALL TO ACTION */}
      <CTA />
    </div>
    
  );
}