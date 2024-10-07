import React from 'react'
import { Github, Linkedin, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2023 madnessLab. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Github className="h-6 w-6" /></a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Linkedin className="h-6 w-6" /></a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400"><Twitter className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer