import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Globe, Zap } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">AI Assistant</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Intelligent chatbot powered by advanced natural language processing</p>
      </header>

      <section className="mb-16">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 via-65% to-blue-700 to-100% text-white py-12 px-6 rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Makes computer vision super easy</h2>
            <p className="text-lg mb-6">Our AI Assistant leverages cutting-edge natural language processing to provide seamless communication and support for your customers.</p>
            {/* <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300">Get Started</button> */}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <MessageCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Customer Support</h3>
            <p className="text-gray-600 dark:text-gray-300">Provide round-the-clock assistance to your customers, improving satisfaction and reducing support costs.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Globe className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-language Support</h3>
            <p className="text-gray-600 dark:text-gray-300">Communicate with customers in their preferred language, breaking down language barriers and expanding your global reach.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-transparent hover:border-indigo-500 transition duration-300">
            <Zap className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customizable Responses</h3>
            <p className="text-gray-600 dark:text-gray-300">Tailor the AI's responses to match your brand voice and specific use cases, ensuring consistent and accurate communication.</p>
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
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-300">The AI Assistant analyzes and understands user queries using advanced NLP techniques.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Context-Aware Responses</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">Based on the analysis, the AI generates relevant and context-aware responses.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-violet-200">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-600" />
              </span>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Continuous Learning</h3>
              <p className="text-base font-normal text-gray-500 dark:text-gray-300">The AI Assistant learns from interactions, continuously improving its responses and accuracy.</p>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div className="bg-gray-100 dark:bg-gray-800 py-12 px-6 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Ready to transform your customer support?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Get started with our AI Assistant today and experience the future of customer interaction.</p>
            <Link to="/contact" className="btn btn-primary text-indigo-600 dark:text-indigo-100 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300">
                Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAssistant;