import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart, BarChart, TrendingUp } from 'lucide-react';

const InsightEngine: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Insight Engine</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Powerful analytics tool that turns raw data into actionable business insights</p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-purple-600 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Unlock the Power of Your Data</h2>
            <p className="text-lg mb-6">Our Insight Engine leverages advanced analytics and machine learning to help you discover hidden patterns and make data-driven decisions.</p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Explore Now</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <TrendingUp className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">Forecast future trends and outcomes using advanced machine learning algorithms.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <PieChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Custom Dashboards</h3>
            <p className="text-gray-600 dark:text-gray-300">Create personalized, interactive dashboards to visualize your data in meaningful ways.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <BarChart className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Automated Reporting</h3>
            <p className="text-gray-600 dark:text-gray-300">Generate comprehensive reports automatically, saving time and ensuring consistent insights.</p>
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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to turn your data into insights?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Start using Insight Engine today and make data-driven decisions with confidence.</p>
            <Link to="/contact" className="btn btn-primary text-indigo-600 dark:text-indigo-100 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300">
                Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightEngine;