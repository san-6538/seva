import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Shield, Heart, AlertTriangle, DollarSign, Home } from 'lucide-react'
import { Button } from '../ui/Button'
import { useTheme } from '../../contexts/ThemeContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Submit Issue', path: '/submit-issue', icon: AlertTriangle },
    { name: 'Blood Request', path: '/blood-request', icon: Heart },
    { name: 'Fundraiser', path: '/fundraiser', icon: DollarSign },
    { name: 'SOS', path: '/sos', icon: Shield },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            < img src="/seva final.png" alt="Seva Logo" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Seva</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Theme Toggle */}
          

            {/* Admin Access */}
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="ml-2"
            >
              Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            > */}
              {/* {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} */}
            {/* </Button> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/admin')
                  setIsMenuOpen(false)
                }}
                className="w-full mt-2"
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
