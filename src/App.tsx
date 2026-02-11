import React, { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
const Header = React.lazy(() => import('./components/Header'))
const Footer = React.lazy(() => import('./components/Footer'))
const Home = React.lazy(() => import('./pages/Home'))
const Products = React.lazy(() => import('./pages/Products'))
const Services = React.lazy(() => import('./pages/Services'))
const Industries = React.lazy(() => import('./pages/Industries'))
const Pricing = React.lazy(() => import('./pages/Pricing'))
const Contact = React.lazy(() => import('./pages/Contact'))
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'))
const DataVault = React.lazy(() => import('./pages/DataVault'))
const InsightEngine = React.lazy(() => import('./pages/InsightEngine'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products/ai-assistant" element={<AIAssistant />} />
              <Route path="/products/data-vault" element={<DataVault />} />
              <Route path="/products/insight-engine" element={<InsightEngine />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </div>
    </Router>
  )
}

export default App