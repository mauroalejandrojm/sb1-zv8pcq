import React from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'AI Pilot',
    price: '$20 / month',
    limited: true,
    description: 'Perfect for small teams getting started with AI',
    features: [
      'Access to Wiki Weaver or Insight Engine',
      'Up to 15 connected data sources',
      'Basic AI customization',
      'Up to 10 users',
      'Email support',
      'Standard security',
    ]
  },
  {
    name: 'Growth',
    price: '$50 / month',
    limited: true,
    description: 'For growing teams that rely on AI daily',
    features: [
      'Access to all AI tools',
      'Up to 50 connected data sources',
      'Advanced analytics & dashboards',
      'Up to 25 users',
      'Priority support',
      'API access & integrations',
    ]
  },
  {
    name: 'Startup or Enterprise',
    price: 'Custom',
    limited: false,
    description: 'Custom AI architecture for advanced teams',
    features: [
      'Full AI suite (Wiki Weaver + Insight Engine + AI Co-Pilot)',
      'Unlimited data sources',
      'Private deployment',
      'Unlimited users',
      'Dedicated AI consultant',
      'Custom integrations & security architecture',
    ]
  }
]

const keyFeaturesAndLimits = [
  {
    category: 'Users & Access',
    features: [
      { name: 'User accounts', pilot: 'Up to 10', growth: 'Up to 25', enterprise: 'Unlimited' },
      { name: 'Connected data sources', pilot: '15', growth: '50', enterprise: 'Unlimited' },
    ]
  },
  {
    category: 'AI Capabilities',
    features: [
      { name: 'Wiki Weaver (RAG system)', pilot: true, growth: true, enterprise: true },
      { name: 'Insight Engine (Analytics)', pilot: true, growth: true, enterprise: true },
      { name: 'AI Project Co-Pilot', pilot: false, growth: true, enterprise: true },
      { name: 'Custom AI models', pilot: false, growth: false, enterprise: true },
    ]
  },
  {
    category: 'Data & Analytics',
    features: [
      { name: 'Real-time analytics', pilot: false, growth: true, enterprise: true },
      { name: 'Advanced dashboards', pilot: false, growth: true, enterprise: true },
      { name: 'API integrations', pilot: false, growth: true, enterprise: true },
      { name: 'Data exports', pilot: 'CSV', growth: 'CSV & Excel', enterprise: 'Custom reports' },
    ]
  },
  {
    category: 'Support & Security',
    features: [
      { name: 'Support', pilot: 'Email', growth: 'Priority', enterprise: 'Dedicated' },
      { name: 'Private deployment', pilot: false, growth: false, enterprise: true },
      { name: 'Security customization', pilot: false, growth: false, enterprise: true },
      { name: 'Dedicated consultant', pilot: false, growth: false, enterprise: true },
    ]
  },
]

const Pricing: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
        AI Pricing Plans
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
        Flexible AI solutions designed for modern teams building smarter systems.
      </p>
      <div className="text-center mb-8">
        <span className="inline-block bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full">
          Early Adopter Pricing — Available for a Limited Time
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                      <div className="p-6 flex-grow">
            <div className="flex items-center md:justify-start gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {plan.name}
            </h2>
            {plan.limited && (
              <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Limited Time
              </span>
            )}
          </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {plan.description}
              </p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                {plan.price}
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-1" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300">
                Book Strategy Call
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-12">
        Launch pricing applies to early adopters. Prices may increase as new features and infrastructure scale.
      </p>

      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Feature Comparison
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">AI Pilot</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Growth</th>
              <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {keyFeaturesAndLimits.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <td colSpan={4} className="py-3 px-6 font-semibold text-gray-800 dark:text-white">
                    {category.category}
                  </td>
                </tr>

                {category.features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-300">
                      {feature.name}
                    </td>

                    {['pilot', 'growth', 'enterprise'].map((tier) => (
                      <td key={tier} className="py-3 px-6 text-gray-700 dark:text-gray-300">
                        {typeof feature[tier as keyof typeof feature] === 'boolean' ? (
                          feature[tier as keyof typeof feature] ? (
                            <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">--</span>
                          )
                        ) : (
                          feature[tier as keyof typeof feature]
                        )}
                      </td>
                    ))}
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
