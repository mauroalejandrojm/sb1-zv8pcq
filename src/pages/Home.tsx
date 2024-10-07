import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, BarChart, Briefcase, ChevronRight, Bot, Database, LineChart, TrendingUp, ShieldCheck, Stethoscope } from 'lucide-react'
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


const Home: React.FC = () => {
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroAnimation />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Unleash the Power of <span className="text-indigo-600 dark:text-indigo-400">AI</span> for Your Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Transform your business with cutting-edge AI solutions, data-driven insights, and expert consulting.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Unlock the Power of Your Data with</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <Bot className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Products</h3>
              <p className="text-gray-600 dark:text-gray-300">Cutting-edge AI solutions including AI Assistant, Data Vault, and Insight Engine.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <Brain className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Services</h3>
              <p className="text-gray-600 dark:text-gray-300">Expert AI consulting, data analysis, and custom AI development tailored to your needs.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <TrendingUp className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industry Solutions</h3>
              <p className="text-gray-600 dark:text-gray-300">AI applications across finance, healthcare, cybersecurity, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Unlock the Power of AI with Our Knowledge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <ShieldCheck className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cutting-edge Technology</h3>
              <p className="text-gray-600 dark:text-gray-300">Stay ahead with our state-of-the-art AI solutions.</p>
            </div>
            <div className="text-center">
              <BarChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data-driven Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Make informed decisions with our advanced analytics.</p>
            </div>
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Consulting</h3>
              <p className="text-gray-600 dark:text-gray-300">Benefit from our team of experienced AI professionals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Transforming Data into Actionable Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border-l-4 border-gray-500 dark:border-gray-400 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">Step 1: Data Collection</h3>
              <p className="text-gray-600 dark:text-gray-300">
              We begin by gathering data from various sources tailored to your needs. This foundational step ensures that we have the right information to analyze.
              </p>
            </div>
            <div className="border-l-4 border-gray-50 dark:border-gray-800 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">Step 2: Data Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
              Our advanced AI algorithms process the collected data, uncovering patterns and trends. This analysis transforms raw data into meaningful information.
              </p>
            </div>
            <div className="border-l-4 border-gray-50 dark:border-gray-800 dark:bg-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-2">Step 3: Actionable Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Finally, we present you with actionable insights that inform your strategy. With our support, you can make informed decisions that propel your business forward.
                </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Tailor-made solutions, just for You with multiple stacks</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
            <div className='flex flex-col p-0'>
              <div className="w-auto sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 gap-2 p-4">
                <div className="grid grid-cols-6 space-y-2 gap-8 items-center justify-center">
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_1} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_2} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_3} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_4} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_5} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_6} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_7} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_8} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_9} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_10} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_11} alt="" />
                  <img loading="lazy" className="block w-32 h-12 object-contain rounded-md" src={logo_12} alt="" />
                </div>
              </div> 
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-indigo-600 dark:bg-indigo-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-indigo-100 mb-8">Explore our flexible pricing options and find the perfect plan for your needs.</p>
          <Link to="/pricing" className="btn bg-white text-indigo-600 hover:bg-indigo-100">View Pricing</Link>
        </div>
      </section>
    </div>
  )
}

export default Home