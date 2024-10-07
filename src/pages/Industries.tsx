import React from 'react'
import { TrendingUp, ShieldCheck, Stethoscope, Truck, DollarSign, Leaf } from 'lucide-react'

const industries = [
  {
    icon: TrendingUp,
    name: 'Finance',
    application: 'Fraud Detection',
    description: 'Machine learning models analyze transaction patterns to identify and prevent fraudulent activities in real-time.',
    impact: 'Reduced fraud losses by up to 50% and improved customer trust.',
  },
  {
    icon: ShieldCheck,
    name: 'Cybersecurity',
    application: 'Threat Detection',
    description: 'AI-powered systems continuously monitor network traffic to detect and respond to potential security threats.',
    impact: 'Decreased response time to security incidents by 60% and enhanced overall security posture.',
  },
  {
    icon: Stethoscope,
    name: 'Healthcare',
    application: 'Disease Prediction',
    description: 'Machine learning algorithms analyze patient data to predict the likelihood of developing certain diseases.',
    impact: 'Early detection rates improved by 40%, leading to better treatment outcomes and reduced healthcare costs.',
  },
  {
    icon: Truck,
    name: 'Logistics',
    application: 'Route Optimization',
    description: 'AI algorithms optimize delivery routes considering traffic, weather, and other real-time factors.',
    impact: 'Reduced fuel consumption by 20% and improved on-time deliveries by 30%.',
  },
  {
    icon: DollarSign,
    name: 'Retail',
    application: 'Personalized Recommendations',
    description: 'Machine learning models analyze customer behavior to provide tailored product recommendations.',
    impact: 'Increased sales by 25% and improved customer satisfaction scores by 15%.',
  },
  {
    icon: Leaf,
    name: 'Agriculture',
    application: 'Crop Yield Prediction',
    description: 'AI systems analyze soil, weather, and historical data to predict crop yields and optimize farming practices.',
    impact: 'Improved crop yields by up to 15% and reduced water usage by 20%.',
  },
]

const Industries: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">AI Applications Across Industries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {industries.map((industry, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <industry.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{industry.name}</h2>
            <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">{industry.application}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{industry.description}</p>
            <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Impact:</h4>
              <p className="text-indigo-700 dark:text-indigo-300">{industry.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Industries