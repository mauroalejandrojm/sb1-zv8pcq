import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'

const MLLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="10" height="10" rx="2" className="fill-indigo-600 dark:fill-indigo-400" />
    <rect x="18" y="4" width="10" height="10" rx="2" className="fill-indigo-500 dark:fill-indigo-300" />
    <rect x="4" y="18" width="10" height="10" rx="2" className="fill-indigo-700 dark:fill-indigo-500" />
    <rect x="18" y="18" width="10" height="10" rx="2" className="fill-indigo-800 dark:fill-indigo-600" />
  </svg>
)

const Header: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { to: "/products", label: "Products" },
    { to: "/services", label: "Services" },
    { to: "/industries", label: "Industries" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <MLLogo />
            <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">madnessLab</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link key={item.to} to={item.to} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-2"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header