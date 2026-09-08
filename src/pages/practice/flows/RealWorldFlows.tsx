import { Link } from 'react-router-dom';
import {
  ShoppingCart, Landmark, Briefcase, ArrowRight,
  CheckCircle, Clock, Target, Zap, BookOpen, Shield
} from 'lucide-react';

// ─── Flow definitions ─────────────────────────────────────────────────────────
const FLOWS = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Store',
    subtitle: 'ShopZone',
    description:
      'A full online shopping experience with 12 products, search & filters, product detail pages, cart management, promo codes, multi-step checkout, and an order confirmation.',
    icon: '🛒',
    color: 'from-orange-500 to-pink-600',
    bgLight: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400',
    path: '/practice/flows/ecommerce',
    difficulty: 'Intermediate → Expert',
    diffColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    estimatedTime: '20–30 min',
    stages: [
      { label: 'Browse & Search', desc: 'Grid/list view, category filter, price slider, stock filter', testIds: ['ec-search-input', 'ec-category-filter', 'ec-product-card-*'] },
      { label: 'Product Detail', desc: 'Color/size picker, qty selector, specs tabs, reviews, add-to-cart', testIds: ['ec-product-title', 'ec-color-*', 'ec-qty-value', 'ec-add-to-cart-detail'] },
      { label: 'Cart', desc: 'Qty controls, remove items, promo codes, live order summary', testIds: ['ec-cart-item-*', 'ec-promo-input', 'ec-summary-total'] },
      { label: 'Checkout', desc: 'Shipping address form, payment form, step indicator', testIds: ['co-shipping-form', 'co-payment-form', 'co-place-order'] },
      { label: 'Confirmation', desc: 'Order ID, items list, delivery estimate', testIds: ['ec-order-id', 'ec-confirm-total', 'ec-delivery-date'] },
    ],
    testScenarios: [
      'Search for "headphones" → verify 1 result',
      'Add 2 items → verify cart badge shows 2',
      'Apply promo SAVE20 → verify 20% discount',
      'Complete checkout → assert order ID format ORD-*',
      'Toggle grid/list view → verify layout change',
      'Click wishlist heart → verify aria-pressed=true',
    ],
    techTargets: ['Selenium', 'Playwright', 'Cypress'],
  },
  {
    id: 'banking',
    title: 'Online Banking',
    subtitle: 'SecureBank',
    description:
      'A realistic internet banking portal with multi-account dashboard, fund transfers (own & external), bill payments with scheduling, statement export, and a live loan eligibility calculator.',
    icon: '🏦',
    color: 'from-blue-700 to-blue-900',
    bgLight: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400',
    path: '/practice/flows/banking',
    difficulty: 'Advanced → Expert',
    diffColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    estimatedTime: '25–35 min',
    stages: [
      { label: 'Dashboard', desc: 'Account cards with hidden balance toggle, spending chart, recent transactions', testIds: ['bank-dashboard', 'bank-account-card-*', 'bank-toggle-balance-*', 'bank-chart-bars'] },
      { label: 'Transfer', desc: 'Own accounts / external wire, quick-amount buttons, 2-step confirm', testIds: ['bank-transfer-from', 'bank-transfer-amount', 'bank-quick-amount-*', 'bank-confirm-submit'] },
      { label: 'Bill Pay', desc: 'Payee selection, payment date scheduling, AutoPay toggle', testIds: ['bank-payee-*', 'bank-billpay-date-input', 'bank-billpay-autopay', 'bank-billpay-submit'] },
      { label: 'Statement', desc: 'Search, type/category/date filters, per-row assertions, CSV download', testIds: ['bank-statement-search', 'bank-stmt-row-*', 'bank-statement-download'] },
      { label: 'Loan Application', desc: 'Loan type picker, amount/term slider, credit score → eligibility result', testIds: ['bank-loan-type-*', 'bank-loan-credit-score', 'bank-loan-submit', 'bank-loan-approved'] },
    ],
    testScenarios: [
      'Click hide balance → verify "••••••" displayed',
      'Transfer $500 → verify reference number format',
      'Enter invalid routing number → verify error message',
      'Filter statement by "Income" → verify only credits shown',
      'Credit score 750, income $6000 → assert loan approved',
      'Credit score 400 → assert loan rejected + reasons shown',
    ],
    techTargets: ['Selenium', 'Playwright', 'REST Assured'],
  },
  {
    id: 'jobs',
    title: 'Job Portal',
    subtitle: 'TalentHub',
    description:
      'A fully featured career platform with a job listing engine, 3-step candidate registration, skill tagging, detailed job search with 5 filters, one-click apply with cover letter, and an application pipeline tracker.',
    icon: '💼',
    color: 'from-indigo-600 to-purple-700',
    bgLight: 'bg-indigo-50 dark:bg-indigo-900/10',
    border: 'border-indigo-200 dark:border-indigo-800',
    badge: 'border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400',
    path: '/practice/flows/jobs',
    difficulty: 'Intermediate → Expert',
    diffColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    estimatedTime: '20–30 min',
    stages: [
      { label: 'Landing / Hero', desc: 'Category cards, featured jobs, search bar with keyword + location', testIds: ['jp-hero', 'jp-hero-search-btn', 'jp-featured-*'] },
      { label: 'Register (3 steps)', desc: 'Personal info, skill tagging with suggestions, bio & social links', testIds: ['jp-reg-step-*', 'jp-skill-input', 'jp-skill-suggest-*', 'jp-reg-complete'] },
      { label: 'Job Search', desc: 'Keyword, location, category, level, type, salary range, remote toggle, sort', testIds: ['jp-search-keyword', 'jp-filter-category', 'jp-salary-filter', 'jp-job-list'] },
      { label: 'Job Detail & Apply', desc: 'Overview/requirements/company tabs, resume upload, cover letter', testIds: ['jp-detail-title', 'jp-tab-*', 'jp-resume-file-input', 'jp-apply-submit'] },
      { label: 'Application Tracker', desc: 'Pipeline (applied→offer), status badges, withdraw, next-step hints', testIds: ['jp-pipeline', 'jp-app-status-*', 'jp-app-withdraw-*', 'jp-tracker-filter-*'] },
    ],
    testScenarios: [
      'Register with all fields → verify profile name displayed in header',
      'Search "Playwright" → verify only matching jobs shown',
      'Filter "Remote Only" → verify all results have Remote badge',
      'Sort by "Highest Salary" → verify descending salary order',
      'Apply to a job → verify it appears in tracker with "applied" status',
      'Withdraw application → verify status changes to "withdrawn"',
    ],
    techTargets: ['Playwright', 'Cypress', 'Selenium'],
  },
];

// ─── Flow card ────────────────────────────────────────────────────────────────
function FlowCard({ flow, index }: { flow: typeof FLOWS[0]; index: number }) {
  return (
    <div
      className={`${flow.bgLight} border ${flow.border} rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group`}
      data-testid={`flow-card-${flow.id}`}
      data-flow-id={flow.id}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${flow.color} text-white p-6`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label={flow.title}>{flow.icon}</span>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{flow.subtitle}</p>
              <h2 className="text-xl font-black" data-testid={`flow-title-${flow.id}`}>{flow.title}</h2>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/20 backdrop-blur px-2.5 py-1 rounded-full" data-testid={`flow-number-${flow.id}`}>Flow {index + 1}</span>
        </div>
        <p className="text-white/85 text-sm leading-relaxed" data-testid={`flow-desc-${flow.id}`}>{flow.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium" data-testid={`flow-difficulty-${flow.id}`}>
            <Target size={11} /> {flow.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium" data-testid={`flow-time-${flow.id}`}>
            <Clock size={11} /> {flow.estimatedTime}
          </span>
          {flow.techTargets.map(t => (
            <span key={t} className="text-xs bg-white/15 px-2 py-0.5 rounded-full" data-testid={`flow-tech-${flow.id}-${t.toLowerCase()}`}>{t}</span>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stages pipeline */}
        <div data-testid={`flow-stages-${flow.id}`}>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap size={12} /> Stages
          </p>
          <div className="space-y-2">
            {flow.stages.map((stage, i) => (
              <div
                key={stage.label}
                className="flex gap-3 items-start"
                data-testid={`flow-stage-${flow.id}-${i + 1}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 bg-gradient-to-br ${flow.color} text-white shadow-sm`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stage.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stage.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {stage.testIds.slice(0, 3).map(id => (
                      <code
                        key={id}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded font-mono"
                        data-testid={`stage-testid-${flow.id}-${id}`}
                      >
                        {id}
                      </code>
                    ))}
                    {stage.testIds.length > 3 && (
                      <span className="text-xs text-gray-400">+{stage.testIds.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test scenarios */}
        <div data-testid={`flow-scenarios-${flow.id}`}>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle size={12} /> Key Test Scenarios
          </p>
          <ul className="space-y-1.5">
            {flow.testScenarios.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 text-xs text-gray-600 dark:text-gray-400"
                data-testid={`flow-scenario-${flow.id}-${i + 1}`}
              >
                <span className="text-green-500 shrink-0 font-bold">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          to={flow.path}
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${flow.color} hover:opacity-90 active:scale-98 transition-all shadow-md group-hover:shadow-lg`}
          data-testid={`flow-launch-btn-${flow.id}`}
          aria-label={`Launch ${flow.title} flow`}
        >
          Launch {flow.title} Flow
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main hub ─────────────────────────────────────────────────────────────────
export default function RealWorldFlows() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="real-world-flows-page">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-4" data-testid="rwf-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold mb-5" data-testid="rwf-badge">
            <Zap size={14} className="text-yellow-400" />
            Real-World Application Flows
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" data-testid="rwf-hero-title">
            Practice on{' '}
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Real App Flows
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed" data-testid="rwf-hero-subtitle">
            Unlike isolated UI components, these modules simulate complete, multi-screen application journeys —
            exactly the kind of end-to-end flows you'll automate on the job.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8" data-testid="rwf-stats">
            {[
              { val: '3', label: 'Full App Flows', testId: 'rwf-stat-flows' },
              { val: '15+', label: 'Distinct Stages', testId: 'rwf-stat-stages' },
              { val: '50+', label: 'Test Scenarios', testId: 'rwf-stat-scenarios' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl py-4" data-testid={s.testId}>
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-xs text-gray-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why section */}
      <div className="max-w-4xl mx-auto px-4 py-10" data-testid="rwf-why-section">
        <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 text-center mb-6">Why Real-World Flows?</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Target size={20} className="text-orange-500" />,
              title: 'End-to-End Practice',
              desc: 'Individual modules test one pattern. Flows test how multiple patterns work together across pages — like a real test suite.',
              testId: 'rwf-why-e2e',
            },
            {
              icon: <Shield size={20} className="text-blue-500" />,
              title: 'State Management',
              desc: 'Cart totals that update, balances that decrease after transfers, applications that persist in a tracker — test real state changes.',
              testId: 'rwf-why-state',
            },
            {
              icon: <BookOpen size={20} className="text-purple-500" />,
              title: 'Interview-Ready Skills',
              desc: 'Interviewers ask "automate a checkout flow" or "test a login + dashboard." These flows let you practise exactly that.',
              testId: 'rwf-why-interview',
            },
          ].map(w => (
            <div key={w.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5" data-testid={w.testId}>
              <div className="mb-3">{w.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{w.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>

        {/* Flow cards */}
        <div className="grid gap-8" data-testid="rwf-flow-cards">
          {FLOWS.map((flow, i) => (
            <FlowCard key={flow.id} flow={flow} index={i} />
          ))}
        </div>

        {/* Quick comparison table */}
        <div className="mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden" data-testid="rwf-comparison-table">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-gray-200">Flow Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Flow comparison table">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase">
                <tr>
                  {['Flow', 'Screens', 'Key Interactions', 'Best For', 'Tools'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  {
                    flow: '🛒 E-Commerce',
                    screens: 'Browse, Detail, Cart, Checkout, Confirmation',
                    interactions: 'Search, filter, cart CRUD, promo codes, checkout form',
                    bestFor: 'E2E checkout flows, cart state, form validation',
                    tools: 'Playwright, Cypress',
                    testId: 'rwf-compare-ecommerce',
                  },
                  {
                    flow: '🏦 Banking',
                    screens: 'Dashboard, Transfer, Bill Pay, Statement, Loan',
                    interactions: 'Balance toggle, transfer confirm, date picker, CSV export, loan calc',
                    bestFor: 'Financial apps, complex forms, data assertions',
                    tools: 'Selenium, Playwright, REST Assured',
                    testId: 'rwf-compare-banking',
                  },
                  {
                    flow: '💼 Job Portal',
                    screens: 'Landing, Register, Search, Detail, Apply, Tracker',
                    interactions: 'Multi-step register, skill tags, file upload, pipeline tracker',
                    bestFor: 'Registration flows, search/filter, status tracking',
                    tools: 'Cypress, Playwright',
                    testId: 'rwf-compare-jobs',
                  },
                ].map(row => (
                  <tr key={row.flow} className="hover:bg-gray-50 dark:hover:bg-gray-700/30" data-testid={row.testId}>
                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-200">{row.flow}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{row.screens}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{row.interactions}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{row.bestFor}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.tools.split(', ').map(t => (
                          <span key={t} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md font-mono">{t}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suggested learning path */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6" data-testid="rwf-learning-path">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={18} className="text-yellow-400" /> Suggested Automation Path</h2>
          <ol className="space-y-3">
            {[
              { n: 1, text: 'Start with E-Commerce — familiar UX patterns, clear assertions on cart totals and order IDs.' },
              { n: 2, text: 'Move to Banking — introduces hidden state (balance toggle), 2-step confirmation, and CSV download verification.' },
              { n: 3, text: 'Finish with Job Portal — 3-step registration, file upload, and pipeline status transitions are advanced E2E challenges.' },
            ].map(step => (
              <li key={step.n} className="flex gap-3 text-sm text-gray-300" data-testid={`rwf-path-step-${step.n}`}>
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-gray-900 font-black text-xs flex items-center justify-center shrink-0">{step.n}</span>
                {step.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
