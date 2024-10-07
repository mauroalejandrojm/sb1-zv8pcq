import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have questions about our AI solutions or services? We're here to help. Reach out to us using the contact information below or fill out the form, and we'll get back to you as soon as possible.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">info@madnesslab.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">123 AI Street, Tech City, TC 12345</span>
            </div>
          </div>
        </div>
        <div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact