
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  LineChart,
  Workflow,
  Layers,
  ArrowRight,
} from 'lucide-react';
import CTA from '@/components/CTA';
import KnowledgeCore from '@/components/iso/KnowledgeCore';
import InsightsEngine from '@/components/iso/InsightsEngine';
import WorkflowAutomation from '@/components/iso/WorkflowAutomation';
import UnstructuredIntelligence from '@/components/iso/UnstructuredIntelligence';
import SectionMarker from '@/components/SectionMarker';

const products = [
  {
    n: '01',
    icon: Database,
    Fig: KnowledgeCore,
    title: 'AI Knowledge System',
    body: 'Employees ask in natural language; the system retrieves across documents, databases and institutional knowledge, follows the relationships between them, and returns grounded answers — every claim cited to its source.',
    points: [
      'Ingestion, chunking & embeddings across every source',
      'Hybrid retrieval + reranking over connected knowledge',
      'Role-aware permissions; answers cite the original documents',
    ],
    link: '/products/ai-assistant',
  },
  {
    n: '02',
    icon: LineChart,
    Fig: InsightsEngine,
    title: 'Insight Engine',
    body: 'A business question becomes an interactive analytical experience — a live chart your team re-cuts with filters, dimensions and date ranges, with anomalies explained and forecasts shown with their uncertainty.',
    points: [
      'Natural-language questions → live dashboards',
      'Interactive filters, dimensions & metrics',
      'Anomaly detection & forecasting with visible uncertainty',
    ],
    link: '/products/insight-engine',
  },
  {
    n: '03',
    icon: Workflow,
    Fig: WorkflowAutomation,
    title: 'AI Workflow Automation',
    body: 'Describe the outcome; the system builds a workflow of triggers, decisions, transformations and tool calls across your apps — with sensitive actions paused for human approval and every step logged.',
    points: [
      'Triggers, decisions & tool calls across connected systems',
      'Human-in-the-loop approvals on sensitive actions',
      'Retries, exception handling & a full audit trail',
    ],
    link: '/products/workflow-automation',
  },
  {
    n: '04',
    icon: Layers,
    Fig: UnstructuredIntelligence,
    title: 'Unstructured Data Intelligence',
    body: 'Whiteboards, notes, PDFs, contracts and transcripts become validated, machine-readable records — entities resolved, mapped to your schema and checked against business rules, every fact traceable to its source.',
    points: [
      'Extraction from notes, PDFs, transcripts, contracts & forms',
      'Entity resolution, schema mapping & business-rule validation',
      'Human review for conflicts; provenance kept on every record',
    ],
    link: '/products/data-vault',
  },
];

export default function Products() {
  return (
    <main className="products-page overflow-x-clip">
      {/* HEADER */}
      <section className="relative">
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
          <span className="font-mono-label text-foreground/70">
            / Products
          </span>

          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            Four platforms.{' '}
            <span className="drift-text">One engineered core.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            Each product is a proven system architecture — transparent by
            design, so you see exactly how the layers connect, from raw data
            to the answers your team acts on.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="relative border-t border-border sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="Our Products" index={1} total={1} />

          <div className="space-y-20 sm:space-y-28">
            {products.map((prod, i) => {
              const Icon = prod.icon;
              const Figure = prod.Fig;

              return (
                <article
                  key={prod.n}
                  className="product-reveal grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-14"
                  style={{ '--reveal-delay': `${i * 100}ms` }}
                >
                  {/* ILLUSTRATION */}
                  <div
                    className={`product-visual relative isolate h-[400px] min-w-0 overflow-hidden rounded-2xl bg-card sm:h-[440px] lg:col-span-7 lg:h-[480px] ${
                      i % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <div className="product-visual-inner absolute bg-background inset-0 min-w-0 pt-10">
                      <Figure />
                    </div>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div
                    className={`min-w-0 lg:col-span-5 ${
                      i % 2 === 1 ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 shrink-0 text-[rgb(var(--drift-1))] dark:text-indigo-400" />
                      <span className="font-mono-label text-base text-muted-foreground">
                        [ {prod.n} ]
                      </span>
                    </div>

                    <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                      {prod.title}
                    </h2>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {prod.body}
                    </p>

                    <ul className="mt-6 space-y-2.5">
                      {prod.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-sm text-foreground/80"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--drift-1))] dark:bg-indigo-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      <Link
                        to={prod.link}
                        aria-label={`Learn more about ${prod.title}`}
                        className="product-link group inline-flex items-center gap-2 font-medium text-indigo-600 dark:text-indigo-400"
                      >
                        Explore {prod.title}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
