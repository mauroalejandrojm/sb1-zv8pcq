import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import type { Product } from '@/data/products';
import SectionMarker from '@/components/SectionMarker';

interface ProductDetailPageProps {
  product: Product;
}

export default function ProductDetailPage({
  product,
}: ProductDetailPageProps) {
  const ProductIcon = product.icon;

  return (
    <main className="overflow-hidden text-foreground pt-6">
      {/* HERO */}
      <section className="relative">
       

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:px-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 font-mono-label text-xs text-foreground/60"
          >
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/products"
              className="transition-colors hover:text-foreground"
            >
              Products
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/80">{product.name}</span>
          </nav>

          <div className="mt-0 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl">
                  <ProductIcon className="h-5 w-5 text-[rgb(var(--drift-1))] dark:text-indigo-400" />
                </span>
                <span className="font-mono-label text-sm text-foreground/60">
                  / PRODUCT {product.number}
                </span>
              </div>

              <p className="mt-8 font-mono-label text-sm text-foreground/60">
                {product.subtitle}
              </p>

              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                {product.title}
                <span className="drift-text">.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                {product.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  {product.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  Explore capabilities
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* PRODUCT SUMMARY PANEL */}
            <div className="relative lg:col-span-5">
              <div className="absolute -inset-3 rounded-3xl border border-border/50 bg-card" />

              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-12">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono-label text-xs text-foreground/50">
                      SYSTEM OVERVIEW
                    </span>
                    <h2 className="mt-3 font-heading text-xl font-bold">
                      {product.name}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-foreground/65">
                  {product.heroDescription}
                </p>

                <div className="my-6 border-t border-border" />

                <p className="font-mono-label text-xs text-foreground/50">
                  CORE CAPABILITIES
                </p>

                <ul className="mt-4 space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--drift-1))]/10 dark:bg-indigo-400/10">
                        <Check className="h-3 w-3 text-[rgb(var(--drift-1))] dark:text-indigo-400" />
                      </span>
                      <span className="text-sm text-foreground/80">
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                  <span className="font-mono-label text-xs text-foreground/50">
                    MADNESS LAB
                  </span>
                  <span className="font-mono-label text-xs text-foreground/50">
                    SYSTEM {product.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-border py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="Capabilities" index={1} />
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Built for the way your business works.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/65 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
              {product.features.map((feature, index) => {
                const FeatureIcon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[rgb(var(--drift-1))]/50 sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-lg font-bold">
                        {feature.title}
                      </h3>

                      <span className="shrink-0 font-mono-label text-xs text-foreground/40">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border bg-foreground/[0.02] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <SectionMarker label="Process" index={2} />
          <div className="max-w-2xl">
            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-5xl">
              From input to outcome.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/65">
              A clear process connects your existing systems and information
              to an outcome your team can use.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {product.steps.map((step, index) => {
              const StepIcon = step.icon;

              return (
                <article
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-label text-sm text-foreground/45">
                      STEP 0{index + 1}
                    </span>
                    {/* <StepIcon className="h-5 w-5 text-[rgb(var(--drift-1))] dark:text-indigo-400" /> */}
                  </div>

                  <h3 className="mt-8 font-heading text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full" />

            <div className="relative">
              <span className="font-mono-label text-sm text-foreground/60">
                / NEXT STEP
              </span>

              <h2 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">
                {product.ctaTitle}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground/65">
                {product.ctaDescription}
              </p>

              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                {product.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}