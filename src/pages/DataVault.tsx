import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Lock, RefreshCw, Shield } from 'lucide-react';

const DataVault: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">PM Assitant</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
        Your AI teammate for planning, tracking, and delivering projects faster.
        </p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-green-700 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Keep Projects Moving Without Manual Overhead</h2>
            <p className="text-lg mb-6">
            The PM Assitant ensure and give you a project guidance, generates project tasks,
  tracks deadlines, and predicts delivery risks — so your team stays aligned and on time.
            </p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Learn More</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Lock className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tool Agnostic</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ensure PM2 guidance with state-of-the-art multi agent capabilities, the tool can work with any other tool with OCR.
              </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <RefreshCw className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Task Generation</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Transform unclear objectives into prioritized tasks in seconds.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Detection</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Identify potential delays and blockers before they impact delivery.
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
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Data Ingestion</h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-300">
                Securely ingest data from various sources using the chrome extension.
                </p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">AI Structuring</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">
              Extract key decisions, tasks, and timelines automatically using pm2 guidelines.
              </p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Continous & Secure Learning</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">
              Learning constantly from your documents without storing or sharing your data.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Deliver projects faster with AI support</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Let your AI Co-Pilot handle the admin work while your team focuses on impact.
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

export default DataVault;