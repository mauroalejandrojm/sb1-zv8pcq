import React from 'react'
import { Brain, BarChart, Briefcase, Code, Users, Zap } from 'lucide-react'

const services = [
  {
    icon: Brain,
    name: 'AI Knowledge Systems (RAG)',
    description: 'We build intelligent internal knowledge assistants that search, understand, and answer from your company data using advanced retrieval systems.'
  },
  {
    icon: BarChart,
    name: 'Advanced Analytics & Insight Engines',
    description: 'Transform raw data into predictive dashboards, automated reports, and strategic insights tailored to your business goals.'
  },
  {
    icon: Briefcase,
    name: 'AI for Operations & Project Management',
    description: 'Deploy AI-powered assistants to automate workflows, summarize projects, track progress, and improve team productivity.'
  },
  {
    icon: Code,
    name: 'Custom AI Integration',
    description: 'Integrate AI directly into your existing tools, CRMs, databases, and workflows with secure and scalable architecture.'
  },
  {
    icon: Users,
    name: 'AI Implementation & Enablement',
    description: 'We guide your team through AI adoption with hands-on onboarding, documentation, and structured rollout plans.'
  },
  {
    icon: Zap,
    name: 'Intelligent Process Automation',
    description: 'Automate repetitive tasks using AI-driven systems that reduce costs and free your team for higher-value work.'
  }
]

const Services: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {services.map((service, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <service.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{service.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services