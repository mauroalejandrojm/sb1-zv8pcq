import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Bot, LineChart, Zap, GitBranch, Repeat, Search } from 'lucide-react'
import LavaBackground from '../components/LavaBackground'
import HeroAnimation from '../components/HeroAnimation'
import logo_1 from '../assets/logos/pytorch.png';
import logo_2 from '../assets/logos/tensor_flow.png';
import logo_3 from '../assets/logos/sklearn.png';
import logo_4 from '../assets/logos/collab.png';
import logo_5 from '../assets/logos/kaggle.png';
import logo_6 from '../assets/logos/pandas.png';
import logo_7 from '../assets/logos/dmlc.png';
import logo_8 from '../assets/logos/fast_ai.png';
import logo_9 from '../assets/logos/hf.png';
import logo_10 from '../assets/logos/keras.png';
import logo_11 from '../assets/logos/lightning.png';
import logo_12 from '../assets/logos/torch_ignite.png';
import logo_13 from '../assets/logos/python.png'
import logo_14 from '../assets/logos/r.png'
import logo_15 from '../assets/logos/jupyterlab.png'
import logo_16 from '../assets/logos/kubernetes.png'
import logo_17 from '../assets/logos/kubeflow.png'
import logo_18 from '../assets/logos/aws.png'
import logo_19 from '../assets/logos/gcp.png'
import logo_20 from '../assets/logos/azure.png'


const logos = [
  { name: "pytorch", src: logo_1 },
  { name: "tensorflow", src: logo_2 },
  { name: "sklearn", src: logo_3 },
  { name: "collab", src: logo_4 },
  { name: "kaggle", src: logo_5 },
  { name: "pandas", src: logo_6 },
  { name: "dmlc", src: logo_7 },
  { name: "fastai", src: logo_8 },
  { name: "huggingface", src: logo_9 },
  { name: "keras", src: logo_10 },
  { name: "lighningai", src: logo_11 },
  { name: "torchignite", src: logo_12 },
  { name: "python", src: logo_13 },
  { name: "r", src: logo_14 },
  { name: "jupyterlab", src: logo_15 },
  { name: "kubernetes", src: logo_16 },
  { name: "kubeflow", src: logo_17 },
  { name: "aws", src: logo_18 },
  { name: "gcp", src: logo_19 },
  { name: "azure", src: logo_20 }
]

const Home: React.FC = () => {
  return (
    <div>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <LavaBackground />  
      <div className="pointer-events-none absolute inset-0 z-0 
          bg-gradient-to-b 
          from-white via-transparent to-white
          dark:from-gray-800 dark:to-gray-650" 
        />
        <HeroAnimation />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Turn Your Company Knowledge & Data Into
            <span className="text-indigo-600 dark:text-indigo-400"> Intelligent Systems</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We design and deploy AI-powered knowledge assistants, analytics engines,
            and automation systems for growing teams overwhelmed by information.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="btn btn-primary text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2"
            >
              Book a Strategy Call <ChevronRight size={18} />
            </Link>

            <Link
              to="/pricing"
              className="btn bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-8 rounded-full"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

       {/* ================= CORE SOLUTIONS ================= */}
       <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core AI Systems
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <Bot className="h-12 w-12 text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">AI Knowledge Systems</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deploy internal knowledge assistants powered by RAG architecture
                that understand your documents, data sources, and internal workflows.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <LineChart className="h-12 w-12 text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Insight Engine</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Transform raw business data into predictive insights, dashboards,
                and automated reports that drive smarter decisions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
              <Zap className="h-12 w-12 text-indigo-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">AI Workflow Automation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automate repetitive tasks and decision workflows using intelligent
                systems integrated directly into your existing tools.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PROBLEMS WE SOLVE ================= */}
      <section className="py-16">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
      Problems We Help Solve
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

      <div className="text-center">
        <Search className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Your team spends hours searching for internal information
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          We deploy AI knowledge assistants that centralize documentation,
          databases, and internal systems into one intelligent interface.
        </p>
      </div>

      <div className="text-center">
        <LineChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          You have data but no clear insights
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Our Insight Engine converts fragmented data into actionable
          analytics and predictive intelligence.
        </p>
      </div>

      <div className="text-center">
        <Repeat className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Manual processes slow down operations
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          We design AI-driven automations that remove bottlenecks and
          scale operational efficiency.
        </p>
      </div>

      <div className="text-center">
        <GitBranch className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Scaling creates complexity and chaos
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Our systems evolve with your company, providing structure,
          intelligence, and operational clarity.
        </p>
      </div>

    </div>
  </div>
</section>


      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Transforming Data into Actionable Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border-l-4 border-gray-500 dark:border-gray-400 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">01 — Centralize & Structure Your Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
              We consolidate fragmented data sources, documents, and internal systems
          into structured knowledge layers ready for AI-powered retrieval and analysis.
              </p>
            </div>
            <div className="border-l-4 border-gray-50 dark:border-gray-800 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">          
              02 — Deploy Intelligent Systems
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
              From AI knowledge assistants to predictive analytics engines, we
          implement tailored systems designed to integrate directly into your workflows.</p>
            </div>
            <div className="border-l-4 border-gray-50 dark:border-gray-800 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">03 — Deliver Measurable Impact</h3>
              <p className="text-gray-600 dark:text-gray-300">
              Our solutions generate operational clarity, automation, and
          actionable insights that scale with your business growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Built with Enterprise-Grade AI Infrastructure
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10 text-center">
            Leveraging modern AI frameworks, scalable cloud platforms,
            and production-ready ML tooling.
          </p>
          <div className="logo-grid-container grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <div className='flex w-auto flex-col p-0'>
              <div className="w-auto sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 p-2">
                <div className="flex flex-wrap w-auto space-y-2 justify-center items-center gap-8 p-0">
                  {logos.map((logo) => (
                    <div key={logo.name} className="logo-item">
                      <img width={140} height={60} loading='lazy' src={logo.src} alt={logo.name} className="logo-image grayscale hover:grayscale-0 block w-auto h-8 object-contain rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-600 dark:bg-indigo-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your AI System?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
          Let’s design a tailored AI solution aligned with your data,
            workflows, and growth strategy.
          </p>
          <Link
            to="/contact"
            className="btn bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-3 px-8 rounded-full"
          >
            Start the Conversation
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home