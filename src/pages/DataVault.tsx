import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Lock, RefreshCw, Shield } from 'lucide-react';

const DataVault: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Data Vault</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Secure and scalable data storage solution with built-in analytics capabilities</p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-green-700 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Secure, Scalable, and Smart Data Storage</h2>
            <p className="text-lg mb-6">Our Data Vault provides a robust and secure platform for storing and analyzing your valuable data, with advanced encryption and analytics capabilities.</p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Learn More</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Lock className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">End-to-end Encryption</h3>
            <p className="text-gray-600 dark:text-gray-300">Protect your data with state-of-the-art encryption techniques, ensuring maximum security at rest and in transit.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <RefreshCw className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Backups</h3>
            <p className="text-gray-600 dark:text-gray-300">Automatic and continuous backups ensure your data is always safe and recoverable in case of any unforeseen events.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Access Controls</h3>
            <p className="text-gray-600 dark:text-gray-300">Granular access management allows you to control who can view, edit, or analyze your data with precision.</p>
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
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-300">Securely ingest data from various sources using our API or data connectors.</p>
            </li>
            <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Encryption and Storage</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Data is encrypted and stored in our secure, distributed storage system.</p>
            </li>
            <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Access and Analysis</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Authorized users can securely access and analyze data using our built-in analytics tools.</p>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to secure and leverage your data?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Start using Data Vault today and unlock the full potential of your data assets.</p>
            <Link to="/contact" className="btn btn-primary text-indigo-600 dark:text-indigo-100 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300">
                Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataVault;