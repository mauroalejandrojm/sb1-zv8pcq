import React from 'react'
import { Brain, Database, FileSearch, Workflow } from 'lucide-react'

const useCases = [
  {
    icon: FileSearch,
    title: 'Scattered Knowledge & Internal Documentation',
    description:
      'Teams lose hours searching across Notion, Google Drive, PDFs, Slack messages, and databases. Information exists — but it is fragmented and difficult to retrieve.',
    solution:
      'We deploy secure AI knowledge systems (RAG-based assistants like Wiki Weaver) that centralize your data and provide instant, contextual answers.',
  },
  {
    icon: Database,
    title: 'Data Without Actionable Insights',
    description:
      'Organizations collect large amounts of data but struggle to convert it into strategic insights, dashboards, or executive-ready reports.',
    solution:
      'Our Insight Engine transforms raw data into predictive analytics, automated reporting, and decision-ready dashboards.',
  },
  {
    icon: Workflow,
    title: 'Manual & Inefficient Workflows',
    description:
      'Repetitive operational tasks and disconnected systems slow down productivity and increase operational costs.',
    solution:
      'We design AI-powered workflow automation and project assistants to streamline operations and improve execution speed.',
  },
  {
    icon: Brain,
    title: 'Unclear AI Strategy & Implementation',
    description:
      'Many companies want to adopt AI but lack a clear roadmap, technical structure, or secure deployment strategy.',
    solution:
      'We create practical AI implementation roadmaps and deliver scalable, secure systems aligned with your business objectives.',
  },
]

const Experience: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Challenges We Help Solve
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We focus on solving real operational and data challenges with practical,
          scalable AI systems designed for growing teams and modern organizations.
        </p>
      </div>

      {/* Use Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {useCases.map((item, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300"
          >
            {/* Icon */}
            <item.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-6 transition-transform duration-300 group-hover:scale-110" />

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {item.title}
            </h2>

            {/* Problem */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {item.description}
            </p>

            {/* Solution Box */}
            <div className="bg-indigo-50 dark:bg-indigo-900 rounded-xl p-4">
              <p className="text-indigo-800 dark:text-indigo-200 font-semibold mb-1">
                Our Approach
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                {item.solution}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Positioning Line */}
      <div className="text-center mt-16">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ideal for startups and growing teams managing large volumes of internal knowledge and operational data.
        </p>
      </div>

    </div>
  )
}

export default Experience
