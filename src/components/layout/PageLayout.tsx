import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import type { Difficulty } from '../../types';

interface PageLayoutProps {
  title: string;
  description: string;
  difficulty: Difficulty;
  testId: string;
  onReset?: () => void;
  children: React.ReactNode;
}

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'badge-beginner' },
  intermediate: { label: 'Intermediate', color: 'badge-intermediate' },
  advanced: { label: 'Advanced', color: 'badge-advanced' },
  expert: { label: 'Expert', color: 'badge-expert' },
};

export default function PageLayout({
  title,
  description,
  difficulty,
  testId,
  onReset,
  children,
}: PageLayoutProps) {
  const config = difficultyConfig[difficulty];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid={testId}>
      {/* Page header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                data-testid="back-to-home"
                aria-label="Back to home"
              >
                <ChevronLeft size={18} />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100" data-testid="page-title">
                    {title}
                  </h1>
                  <span className={config.color} data-testid="difficulty-badge">
                    {config.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="page-description">
                  {description}
                </p>
              </div>
            </div>
            {onReset && (
              <button
                onClick={() => {
                  onReset();
                  console.log(`[ClickAndVerify] Reset: ${title}`);
                }}
                className="btn-secondary text-xs gap-1.5"
                data-testid="reset-btn"
                aria-label="Reset module to default state"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
