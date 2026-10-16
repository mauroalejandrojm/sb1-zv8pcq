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

const logos = [
  { name: 'PyTorch', src: logo_1, category: 'ML FRAMEWORKS' },
  { name: 'TensorFlow', src: logo_2, category: 'ML FRAMEWORKS' },
  { name: 'Scikit-learn', src: logo_3, category: 'ML FRAMEWORKS' },
  { name: 'Keras', src: logo_10, category: 'ML FRAMEWORKS' },
  { name: 'FastAI', src: logo_8, category: 'ML FRAMEWORKS' },
  { name: 'Hugging Face', src: logo_9, category: 'ML FRAMEWORKS' },
  { name: 'PyTorch Lightning', src: logo_11, category: 'ML FRAMEWORKS' },
  { name: 'TorchIgnite', src: logo_12, category: 'ML FRAMEWORKS' },
  { name: 'DMLC', src: logo_7, category: 'ML FRAMEWORKS' },

  { name: 'Python', src: logo_13, category: 'DATA & RESEARCH' },
  { name: 'R', src: logo_14, category: 'DATA & RESEARCH' },
  { name: 'Pandas', src: logo_6, category: 'DATA & RESEARCH' },
  { name: 'Google Colab', src: logo_4, category: 'DATA & RESEARCH' },
  { name: 'Kaggle', src: logo_5, category: 'DATA & RESEARCH' },
  { name: 'JupyterLab', src: logo_15, category: 'DATA & RESEARCH' },

  { name: 'Kubernetes', src: logo_16, category: 'CLOUD & MLOPS' },
  { name: 'Kubeflow', src: logo_17, category: 'CLOUD & MLOPS' },
  { name: 'AWS', src: logo_18, category: 'CLOUD & MLOPS' },
  { name: 'Google Cloud', src: logo_19, category: 'CLOUD & MLOPS' },
  { name: 'Azure', src: logo_20, category: 'CLOUD & MLOPS' },
];

const categories = [
  'ML FRAMEWORKS',
  'DATA & RESEARCH',
  'CLOUD & MLOPS',
];

export default function LogoStrip() {
  return (
    <section className="relative border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionMarker label="Our Technology" index={5} />

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="font-heading text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:col-span-7">
            Built on the tools that move AI forward.
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground lg:col-span-5">
            We combine proven machine learning frameworks, research
            tools, and production-grade cloud infrastructure to build
            reliable systems that scale.
          </p>
        </div>

        <div className="mt-14 space-y-10">
          {categories.map((category) => {
            const categoryLogos = logos.filter(
              (logo) => logo.category === category
            );

            return (
              <div key={category}>
                <div className="mb-5 flex items-center gap-4">
                  <span className="shrink-0 font-mono-label text-xs text-muted-foreground">
                    {category}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {categoryLogos.map((logo) => (
                    <div
                      key={logo.name}
                      className="group flex min-h-24 items-center gap-3 rounded-xl px-4 py-5 transition-colors hover:bg-secondary/70 sm:px-5"
                      title={logo.name}
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        loading="lazy"
                        className="h-8 w-8 shrink-0 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 sm:h-9 sm:w-9"
                      />

                      <span className="text-sm font-medium leading-snug text-muted-foreground transition-colors group-hover:text-foreground">
                        {logo.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}