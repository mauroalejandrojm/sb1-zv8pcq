import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Globe, Zap } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Wiki Weaver</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Turn your company knowledge into a reliable AI that answers questions instantly — grounded in your real data.</p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-blue-700 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Your Internal AI, Powered by Your Documents</h2>
            <p className="text-lg mb-6">
            Wiki Weaver connects to your internal documentation (Notion, PDFs, Confluence, Google Drive) 
  and builds a secure AI assistant that delivers accurate, context-aware answers — 
  without hallucinations.
            </p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Get Started</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <MessageCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Grounded in Your Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Responses are generated from your internal knowledge base — 
  reducing misinformation and increasing trust.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Globe className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Reduce Repeated Questions</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Eliminate repetitive internal with multi-language support queries and free up your team’s time.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Zap className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Deployment</h3>
            <p className="text-gray-600 dark:text-gray-300">
            Private, secure architecture with full control over your data and governace to delegate access.
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
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Natural Language Processing</h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-300">The tool can analyzes and understands user queries using advanced NLP techniques.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Context-Aware Responses</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Based on your knowledge base, the user can ask specific questions and get answers with relevant information.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Continuous Learning</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">The Wiki Weaver learns from interactions, continuously improving its responses and accuracy.</p>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to turn your company knowledge into an AI advantage?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Deploy Wiki Weaver and empower your team with instant and reliable answers.</p>
            <Link to="/contact" aria-label="contact redirect of the website" className="btn btn-primary text-indigo-600 dark:text-indigo-100 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAssistant;