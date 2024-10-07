import React from 'react'
import { Brain, BarChart, Briefcase, Code, Users, Zap } from 'lucide-react'

const services = [
  {
    icon: Brain,
    name: 'AI Consulting',
    description: 'Expert guidance on integrating AI into your business processes for maximum efficiency and innovation.'
  },
  {
    icon: BarChart,
    name: 'Data Analysis',
    description: 'In-depth analysis of your data to uncover insights and drive informed decision-making.'
  },
  {
    icon: Briefcase,
    name: 'Business Strategy',
    description: 'Comprehensive business consulting to optimize your operations and achieve sustainable growth.'
  },
  {
    icon: Code,
    name: 'Custom AI Development',
    description: 'Tailored AI solutions designed and developed to address your specific business challenges.'
  },
  {
    icon: Users,
    name: 'AI Training & Workshops',
    description: 'Educational programs to empower your team with AI knowledge and skills.'
  },
  {
    icon: Zap,
    name: 'Process Automation',
    description: 'Streamline your workflows with intelligent automation powered by AI and machine learning.'
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