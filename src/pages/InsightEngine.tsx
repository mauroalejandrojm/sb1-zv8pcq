import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart, BarChart, TrendingUp } from 'lucide-react';

const InsightEngine: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Insight Engine</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
        Ask your data questions in plain English (or any language) — get real business answers instantly.
          </p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-purple-600 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stop Waiting on Analysts</h2>
            <p className="text-lg mb-6">
            Insight Engine connects directly to your data sources and lets you explore,
  visualize, and predict trends using natural language queries and advanced analytics.
            </p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Explore Now</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <TrendingUp className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Natural Language Queries</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Ask business questions in plain English and receive instant data-driven answers.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <PieChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Executive-Ready Dashboards</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Automatically generate interactive dashboards tailored to your KPIs.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <BarChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Predictive Intelligence</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Forecast revenue, churn, and operational trends using machine learning models.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <LineChart className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Data Integration</h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-300">Connect and integrate data from various sources, including our Data Vault and external systems.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Analysis and Visualization</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Apply advanced analytics techniques and create interactive visualizations to explore your data.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Insight Generation</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Discover actionable insights and receive recommendations for business improvements.</p>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Turn raw data into competitive advantage</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover what your data is really telling you — in seconds, not days.
            </p>
            <Link to="/contact" aria-label="contact redirect of the website" className="btn btn-primary text-indigo-600 dark:text-indigo-100 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightEngine;