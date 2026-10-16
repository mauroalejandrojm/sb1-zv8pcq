import { useRef, useState } from 'react';
import SectionMarker from '@/components/SectionMarker';
import logo_1 from '@/assets/logos/pytorch.png';
import logo_2 from '@/assets/logos/tensor_flow.png';
import logo_3 from '@/assets/logos/sklearn.png';
import logo_4 from '@/assets/logos/collab.png';
import logo_5 from '@/assets/logos/kaggle.png';
import logo_6 from '@/assets/logos/pandas.png';
import logo_7 from '@/assets/logos/dmlc.png';
import logo_8 from '@/assets/logos/fast_ai.png';
import logo_9 from '@/assets/logos/hf.png';
import logo_10 from '@/assets/logos/keras.png';
import logo_11 from '@/assets/logos/lightning.png';
import logo_12 from '@/assets/logos/torch_ignite.png';
import logo_13 from '@/assets/logos/python.png';
import logo_14 from '@/assets/logos/r.png';
import logo_15 from '@/assets/logos/jupyterlab.png';
import logo_16 from '@/assets/logos/kubernetes.png';
import logo_17 from '@/assets/logos/kubeflow.png';
import logo_18 from '@/assets/logos/aws.png';
import logo_19 from '@/assets/logos/gcp.png';
import logo_20 from '@/assets/logos/azure.png';
import logo_21 from "@/assets/logos/django.png";
import logo_22 from "@/assets/logos/fastapi.png";
import logo_23 from "@/assets/logos/flask.webp";
import logo_24 from "@/assets/logos/dotnet.png";
import logo_25 from "@/assets/logos/cplus.png";
import logo_26 from "@/assets/logos/javascript.png";
import logo_27 from "@/assets/logos/express.svg";
import logo_28 from "@/assets/logos/hono.png";

const logos = [
  { name: 'PyTorch', src: logo_1, category: 'ML Frameworks' },
  { name: 'TensorFlow', src: logo_2, category: 'ML Frameworks' },
  { name: 'Scikit-learn', src: logo_3, category: 'ML Frameworks' },
  { name: 'Keras', src: logo_10, category: 'ML Frameworks' },
  { name: 'FastAI', src: logo_8, category: 'ML Frameworks' },
  { name: 'Hugging Face', src: logo_9, category: 'ML Frameworks' },
  { name: 'PyTorch Lightning', src: logo_11, category: 'ML Frameworks' },
  { name: 'TorchIgnite', src: logo_12, category: 'ML Frameworks' },
  { name: 'DMLC', src: logo_7, category: 'ML Frameworks' },
  { name: 'Python', src: logo_13, category: 'Languages' },
  { name: 'R', src: logo_14, category: 'Data & Research' },
  { name: 'Pandas', src: logo_6, category: 'Data & Research' },
  { name: 'Google Colab', src: logo_4, category: 'Data & Research' },
  { name: 'Kaggle', src: logo_5, category: 'Data & Research' },
  { name: 'JupyterLab', src: logo_15, category: 'Data & Research' },
  { name: 'Kubernetes', src: logo_16, category: 'Cloud & MLOps' },
  { name: 'Kubeflow', src: logo_17, category: 'Cloud & MLOps' },
  { name: 'AWS', src: logo_18, category: 'Cloud & MLOps' },
  { name: 'Google Cloud', src: logo_19, category: 'Cloud & MLOps' },
  { name: 'Azure', src: logo_20, category: 'Cloud & MLOps' },
  { name: 'Django', src: logo_21, category: 'Web Frameworks' },
  { name: 'FastAPI', src: logo_22, category: 'Web Frameworks' },
  { name: 'Flask', src: logo_23, category: 'Web Frameworks' },
  { name: '.NET', src: logo_24, category: 'Languages' },
  { name: 'C++', src: logo_25, category: 'Languages' },
  { name: 'JavaScript', src: logo_26, category: 'Languages' },
  { name: 'Express', src: logo_27, category: 'Web Frameworks' },
  { name: 'Hono', src: logo_28, category: 'Web Frameworks' },
];

const categories = [
  "All",
  "Languages",
  "Web Frameworks",
  "ML Frameworks",
  "Data & Research",
  "Cloud & MLOps",
];

export default function LogoStrip() {
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollRef = useRef(null);

  const filteredLogos =
    activeCategory === 'All'
      ? logos
      : logos.filter((logo) => logo.category === activeCategory);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction * scrollRef.current.clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative border-t border-border py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionMarker label="Our Technology" index={5} />

        {/* Compact editorial heading */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-end">
          <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:col-span-7">
            Built on the tools that move AI forward.
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
            Proven machine learning frameworks, research tools, and
            production-grade cloud infrastructure for systems that scale.
          </p>
        </div>

        {/* Categories and carousel controls */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Filter technologies"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: 0,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  aria-pressed={isActive}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="mr-2 font-mono-label text-xs text-muted-foreground">
              {filteredLogos.length} TECHNOLOGIES
            </span>

            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll technologies left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll technologies right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal carousel */}
        <div className="relative mt-5">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredLogos.map((logo) => (
              <div
                key={logo.name}
                title={logo.name}
                className="group flex min-h-[104px] w-[150px] shrink-0 snap-start flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/70 sm:w-[170px]"
              >
                <div className="flex h-10 items-center">
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className="h-8 max-w-full object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-sm font-medium leading-tight text-muted-foreground transition-colors group-hover:text-foreground">
                    {logo.name}
                  </span>

                  <span className="mb-0.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:w-12" />
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono-label text-xs text-muted-foreground">
            THE TECHNOLOGY BEHIND OUR WORK
          </span>
          <span className="text-xs text-muted-foreground">
            Scroll to explore →
          </span>
        </div>
      </div>
    </section>
  );
}