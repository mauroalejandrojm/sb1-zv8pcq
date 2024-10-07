import React from 'react'
import { Bot, Database, LineChart } from 'lucide-react'

const products = [
  {
    icon: Bot,
    name: 'AI Assistant',
    description: 'An intelligent chatbot powered by advanced natural language processing.',
    features: ['24/7 customer support', 'Multi-language support', 'Customizable responses']
  },
  {
    icon: Database,
    name: 'Data Vault',
    description: 'Secure and scalable data storage solution with built-in analytics capabilities.',
    features: ['End-to-end encryption', 'Real-time backups', 'Advanced access controls']
  },
  {
    icon: LineChart,
    name: 'Insight Engine',
    description: 'Powerful analytics tool that turns raw data into actionable business insights.',
    features: ['Predictive analytics', 'Custom dashboards', 'Automated reporting']
  }
]

const Products: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((product, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <product.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <button className="w-full btn btn-primary">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products