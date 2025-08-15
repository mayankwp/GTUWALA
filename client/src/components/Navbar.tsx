import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent cursor-pointer">
              GTUWALA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Contact
            </Link>
            {isAuthenticated && (user as any)?.isAdmin && (
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
                Admin
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <Button
                onClick={() => window.location.href = '/api/logout'}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-3">
            <Link href="/" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/contact" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
              Contact
            </Link>
            {isAuthenticated && (user as any)?.isAdmin && (
              <Link href="/admin" className="block text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-pink-500 transition-colors font-medium">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Button
                onClick={() => window.location.href = '/api/logout'}
                className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg transition-all"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg transition-all"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
