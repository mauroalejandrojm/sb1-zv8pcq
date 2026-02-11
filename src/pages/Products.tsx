import React from 'react'
import { Bot, Database, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'

const products = [
  {
    icon: Bot,
    name: 'Wiki Weaver',
    description: 'Turn your company knowledge into an AI that actually answers questions correctly. Keep sensitive information secure from outsiders while giving your team full access.',
    features: [
      'Connects to your internal docs (Notion, PDFs, Confluence, Drive)', 
      'Creates a reliable AI assistant grounded in your data', 
      'Eliminates repeated internal questions',
      'Protect your data from'
    ],
    link: "/products/ai-assistant",
  },
  {
    icon: Database,
    name: 'PM Assistant',
    description: 'Your AI teammate for project planning, reporting & task tracking.',
    features: [
      'Ensure project guidelines with your team', 
      'Predict delays before they happen', 
      'Analyze the content of your tools without leaving the apps',
      'Generate Gantt Charts to share your progress smootly'
    ],
    link: "/products/data-vault",
  },
  {
    icon: LineChart,
    name: 'Insight Engine',
    description: 'Ask your data questions in plain English (or any language) — get real business answers.',
    features: [
      'Natural language queries over your database',
      'Instant dashboards without manual setup', 
      'Predict revenue trends & churn risk',
      'Automated executive-ready reports'
    ],
    link: "/products/insight-engine",
  }
]

const Products: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {products.map((product, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 overflow-hidden">
            <div className="p-6">
              <product.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <Link aria-label={`Learn more about ${product.name}`} to={product.link} className="w-full btn btn-primary">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products