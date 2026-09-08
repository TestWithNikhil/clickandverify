import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Terminal, Zap, Shield } from 'lucide-react';
import { modules, modulesByDifficulty } from '../data/modules';
import type { Difficulty, Module } from '../types';

const difficultyMeta: Record<Difficulty, { label: string; badge: string; desc: string; icon: React.ReactNode; color: string }> = {
  beginner: {
    label: 'Beginner',
    badge: 'badge-beginner',
    desc: 'No prior automation experience needed. Practice basic selectors and form interactions.',
    icon: <BookOpen size={18} />,
    color: 'border-green-200 dark:border-green-900/40',
  },
  intermediate: {
    label: 'Intermediate',
    badge: 'badge-intermediate',
    desc: 'Comfortable with basic selectors. Learn waits, dynamic elements, and complex interactions.',
    icon: <Zap size={18} />,
    color: 'border-yellow-200 dark:border-yellow-900/40',
  },
  advanced: {
    label: 'Advanced',
    badge: 'badge-advanced',
    desc: 'Push your skills with iframes, shadow DOM, async patterns, and flaky element strategies.',
    icon: <Shield size={18} />,
    color: 'border-orange-200 dark:border-orange-900/40',
  },
  expert: {
    label: 'Expert',
    badge: 'badge-expert',
    desc: 'Full e2e flows, API testing, auth, chaos engineering, and accessibility audits.',
    icon: <Terminal size={18} />,
    color: 'border-red-200 dark:border-red-900/40',
  },
};

function ModuleCard({ module }: { module: Module }) {
  const meta = difficultyMeta[module.difficulty];
  return (
    <Link
      to={module.path}
      className="module-card flex flex-col gap-3"
      data-testid={`module-card-${module.id}`}
      aria-label={`${module.title} - ${meta.label}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" role="img" aria-label={module.title}>{module.icon}</span>
        <span className={meta.badge} data-testid={`module-badge-${module.id}`}>{meta.label}</span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {module.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {module.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 mt-auto">
        {module.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md font-mono"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 gap-1 group-hover:gap-2 transition-all">
        Open module <ArrowRight size={12} />
      </div>
    </Link>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Difficulty | 'all'>('all');

  const filtered = modules.filter((m) => {
    const matchesSearch =
      search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = activeFilter === 'all' || m.difficulty === activeFilter;
    return matchesSearch && matchesDiff;
  });

  const difficulties: (Difficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div className="min-h-screen" data-testid="homepage">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="text-yellow-300">⚡</span>
              Automation Testing Practice Sandbox
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" data-testid="hero-title">
              Practice. Automate.{' '}
              <span className="text-yellow-300">Verify.</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed" data-testid="hero-subtitle">
              A realistic UI playground for Selenium, Playwright, Cypress, REST Assured, and Postman.
              Beginner-friendly, expert-challenging — with stable <code className="bg-white/20 px-1 rounded text-sm">data-testid</code> locators and intentionally tricky edge cases.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/getting-started"
                className="btn bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg"
                data-testid="hero-cta-start"
              >
                <BookOpen size={16} />
                Get Started
              </Link>
              <Link
                to="/cheat-sheet"
                className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur border border-white/20"
                data-testid="hero-cta-cheatsheet"
              >
                <Terminal size={16} />
                Cheat Sheet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-800" data-testid="stats-strip">
            {[
              { label: 'Total Modules', value: modules.length.toString(), testId: 'stat-modules' },
              { label: 'Beginner', value: modulesByDifficulty.beginner.length.toString(), testId: 'stat-beginner' },
              { label: 'Intermediate+', value: (modulesByDifficulty.intermediate.length + modulesByDifficulty.advanced.length).toString(), testId: 'stat-intermediate' },
              { label: 'Expert', value: modulesByDifficulty.expert.length.toString(), testId: 'stat-expert' },
            ].map((stat) => (
              <div key={stat.testId} className="px-6 py-4 text-center" data-testid={stat.testId}>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8" data-testid="module-controls">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search modules or tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
              data-testid="module-search"
              aria-label="Search modules"
            />
          </div>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by difficulty" data-testid="difficulty-filter">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setActiveFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activeFilter === d
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                data-testid={`filter-${d}`}
                aria-pressed={activeFilter === d}
              >
                {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered results */}
        {search || activeFilter !== 'all' ? (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" data-testid="search-results-count">
              {filtered.length} module{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400" data-testid="no-results">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No modules match your search</p>
                <p className="text-sm mt-1">Try a different keyword or clear the filter</p>
              </div>
            )}
          </div>
        ) : (
          /* Grouped by difficulty */
          <div className="space-y-12" data-testid="modules-by-difficulty">
            {(Object.entries(modulesByDifficulty) as [Difficulty, Module[]][]).map(([diff, mods]) => {
              const meta = difficultyMeta[diff];
              return (
                <section
                  key={diff}
                  data-testid={`section-${diff}`}
                  className={`rounded-2xl border-2 ${meta.color} p-6 bg-white dark:bg-gray-900`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-lg ${
                      diff === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      diff === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      diff === 'advanced' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {meta.label}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          diff === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          diff === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          diff === 'advanced' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`} data-testid={`section-count-${diff}`}>
                          {mods.length} modules
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{meta.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {mods.map((m) => (
                      <ModuleCard key={m.id} module={m} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
