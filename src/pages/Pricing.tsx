import React from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$400',
    features: [
      'Basic data analysis',
      'AI-powered chatbot',
      'Email support',
      '3 user accounts',
      'CSV reports exports',
    ]
  },
  {
    name: 'Professional',
    price: '$1000',
    features: [
      'Advanced AI solutions',
      'API & swagger documentation',
      'Comprehensive data analysis',
      'Priority support',
      '15 user accounts',
      'Custom integrations',
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Full suite of AI tools',
      'Real-time data analytics',
      'Dedicated monitoring',
      'Unlimited user accounts',
      'On-site training and support',
      'Volume discounts at larger scale',
    ]
  }
]

const keyFeaturesAndLimits = [
  {
    category: 'Users and Credits',
    features: [
      { name: 'User accounts', starter: '3', professional: '15', enterprise: 'Unlimited' },
      { name: 'API credits', starter: '500/mo', professional: '2,000/mo', enterprise: 'Custom' },
    ]
  },
  {
    category: 'AI Tools and Access',
    features: [
      { name: 'AI chatbot', starter: true, professional: true, enterprise: true },
      { name: 'Predictive analytics', starter: false, professional: true, enterprise: true },
      { name: 'Custom AI models', starter: false, professional: false, enterprise: true },
    ]
  },
  {
    category: 'Data and Analytics',
    features: [
      { name: 'Data storage', starter: '10GB', professional: '500GB', enterprise: 'Custom' },
      { name: 'In-depth analysis', starter: '3 months', professional: '12 months', enterprise: 'Unlimited' },
      { name: 'Real-time analytics', starter: false, professional: true, enterprise: true },
      { name: 'Integrations', starter: false, professional: true, enterprise: true },
      { name: 'Exports', starter: 'CSV files', professional: 'CSV or Excel files', enterprise: 'CSV, Excel or Custom Reports' },
    ]
  },
  {
    category: 'Support and Training',
    features: [
      { name: 'Support', starter: 'Email', professional: 'Priority', enterprise: 'Dedicated' },
      { name: 'Documentation', starter: false, professional: true, enterprise: true },
      { name: 'Training sessions', starter: false, professional: '2/year', enterprise: 'Up to 10/year' },
      { name: 'On-site support', starter: false, professional: false, enterprise: true },
      { name: 'Dedicated monitoring', starter: false, professional: false, enterprise: true },
    ]
  },
]

const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{plan.name}</h2>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <button className="w-full btn btn-primary">
                Choose Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Key Features & Limits</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Starter</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Professional</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {keyFeaturesAndLimits.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td colSpan={4} className="py-3 px-6 font-semibold text-gray-800 dark:text-white">{category.category}</td>
                </tr>
                {category.features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">{feature.name}</td>
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <span className="text-gray-400 dark:text-gray-600">--</span>
                      ) : (
                        feature.starter
                      )}
                    </td>
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <span className="text-gray-400 dark:text-gray-600">--</span>
                      ) : (
                        feature.professional
                      )}
                    </td>
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <span className="text-gray-400 dark:text-gray-600">--</span>
                      ) : (
                        feature.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Pricing