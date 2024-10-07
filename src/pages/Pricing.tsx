import React from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$499',
    features: [
      'AI-powered chatbot',
      'Basic data analysis',
      'Email support',
      '5 user accounts'
    ]
  },
  {
    name: 'Professional',
    price: '$999',
    features: [
      'Advanced AI solutions',
      'Comprehensive data analysis',
      'Priority support',
      '20 user accounts',
      'Custom integrations'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Full suite of AI tools',
      'Real-time data analytics',
      'Dedicated account manager',
      'Unlimited user accounts',
      'On-site training and support'
    ]
  }
]

const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{plan.name}</h2>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{plan.price}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
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
    </div>
  )
}

export default Pricing