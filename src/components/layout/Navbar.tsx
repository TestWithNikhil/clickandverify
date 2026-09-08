import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Eye, EyeOff, Menu, X, Terminal, BookOpen, Map } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useInspector } from '../../context/InspectorContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { inspectorEnabled, toggleInspector } = useInspector();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: <Map size={15} /> },
    { to: '/getting-started', label: 'Get Started', icon: <BookOpen size={15} /> },
    { to: '/cheat-sheet', label: 'Cheat Sheet', icon: <Terminal size={15} /> },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
            data-testid="navbar-logo"
          >
            <span className="text-xl">⚡</span>
            <span className="hidden sm:block">ClickAndVerify</span>
            <span className="sm:hidden">CAV</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" data-testid="navbar-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Inspector toggle */}
            <button
              onClick={toggleInspector}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inspectorEnabled
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              data-testid="inspector-toggle"
              aria-label="Toggle element inspector"
              aria-pressed={inspectorEnabled}
              title="Toggle data-testid Inspector"
            >
              {inspectorEnabled ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden sm:block">Inspector</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              data-testid="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden pb-3 border-t border-gray-100 dark:border-gray-800 pt-2 animate-fade-in"
            data-testid="mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium mb-1 ${
                  location.pathname === link.to
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Inspector banner */}
      {inspectorEnabled && (
        <div
          className="bg-blue-600 text-white text-xs text-center py-1 font-mono"
          data-testid="inspector-banner"
        >
          🔍 Element Inspector ON — all data-testid values are highlighted
        </div>
      )}
    </header>
  );
}
