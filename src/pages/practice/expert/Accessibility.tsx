import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

export default function AccessibilityPage() {
  const [showViolations, setShowViolations] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('good-forms');

  const toggle = (id: string) => setExpandedSection(s => s === id ? null : id);

  return (
    <PageLayout title="Accessibility (a11y) Targets" description="Correct ARIA patterns mixed with intentional violations. Practice axe-core, NVDA, and WCAG audits." difficulty="expert" testId="accessibility-page"
      onReset={() => { setShowViolations(true); setExpandedSection('good-forms'); }}>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="card p-4 flex items-center justify-between" data-testid="a11y-controls">
          <p className="text-sm text-gray-600 dark:text-gray-400">Toggle to show/hide intentional violations below</p>
          <label className="flex items-center gap-2 cursor-pointer" data-testid="a11y-violations-toggle-label">
            <span className="text-sm font-medium">{showViolations ? 'Violations: ON' : 'Violations: OFF'}</span>
            <button
              role="switch"
              aria-checked={showViolations}
              onClick={() => setShowViolations(v => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors ${showViolations ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              data-testid="a11y-violations-toggle"
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showViolations ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        </div>

        {/* ✅ GOOD: Accessible form */}
        <section className="card p-6" data-testid="a11y-section-good-forms" aria-labelledby="good-forms-title">
          <button className="w-full flex items-center justify-between" onClick={() => toggle('good-forms')} data-testid="a11y-accordion-good-forms" aria-expanded={expandedSection === 'good-forms'}>
            <h2 id="good-forms-title" className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500"/> ✅ Accessible Form Patterns
            </h2>
            <span className="text-xs text-gray-400">{expandedSection === 'good-forms' ? '▲' : '▼'}</span>
          </button>
          {expandedSection === 'good-forms' && (
            <div className="mt-4 space-y-4">
              <form aria-label="Accessible contact form" data-testid="a11y-good-form" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="a11y-name" className="label">Full Name <span aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
                    <input id="a11y-name" type="text" name="name" className="input" aria-required="true" aria-describedby="name-hint" placeholder="Jane Smith" data-testid="a11y-input-name" />
                    <p id="name-hint" className="text-xs text-gray-400 mt-1">Enter your legal full name</p>
                  </div>
                  <div>
                    <label htmlFor="a11y-email" className="label">Email <span aria-hidden="true">*</span></label>
                    <input id="a11y-email" type="email" name="email" className="input" aria-required="true" placeholder="jane@example.com" data-testid="a11y-input-email" autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="a11y-role" className="label">Role</label>
                    <select id="a11y-role" name="role" className="input" aria-label="Select your role" data-testid="a11y-select-role">
                      <option value="">Choose a role…</option>
                      <option value="qa">QA Engineer</option>
                      <option value="dev">Developer</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <fieldset>
                    <legend className="label mb-1">Experience Level</legend>
                    <div className="space-y-1.5">
                      {['Beginner','Intermediate','Advanced'].map(l => (
                        <label key={l} className="flex items-center gap-2 text-sm cursor-pointer" data-testid={`a11y-radio-label-${l.toLowerCase()}`}>
                          <input type="radio" name="experience" value={l.toLowerCase()} className="w-4 h-4" data-testid={`a11y-radio-${l.toLowerCase()}`} aria-label={`Experience: ${l}`} />
                          {l}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <button type="submit" className="btn-primary mt-4" data-testid="a11y-good-submit" aria-label="Submit contact form">
                  Submit Form
                </button>
              </form>
            </div>
          )}
        </section>

        {/* ✅ GOOD: Accessible navigation */}
        <section className="card p-6" data-testid="a11y-section-good-nav" aria-labelledby="good-nav-title">
          <h2 id="good-nav-title" className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-green-500"/> ✅ Accessible Navigation & Live Regions
          </h2>
          <nav aria-label="Breadcrumb" data-testid="a11y-breadcrumb">
            <ol className="flex items-center gap-1 text-sm" aria-label="breadcrumb">
              <li><a href="#" className="text-blue-600 hover:underline" data-testid="a11y-breadcrumb-home">Home</a></li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li><a href="#" className="text-blue-600 hover:underline" data-testid="a11y-breadcrumb-practice">Practice</a></li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li aria-current="page" className="text-gray-600 dark:text-gray-400" data-testid="a11y-breadcrumb-current">Accessibility</li>
            </ol>
          </nav>
          <div role="status" aria-live="polite" aria-atomic="true" className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-400" data-testid="a11y-live-region">
            Live region: updates here are announced to screen readers without focus change.
          </div>
          <div role="alert" aria-live="assertive" className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400" data-testid="a11y-alert-region">
            Alert region (assertive): critical updates are announced immediately.
          </div>
        </section>

        {/* ✅ GOOD: Focus management */}
        <section className="card p-6" data-testid="a11y-section-focus" aria-labelledby="focus-title">
          <h2 id="focus-title" className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-green-500"/> ✅ Focus Management & Skip Links
          </h2>
          <a href="#main-content-skip" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded" data-testid="a11y-skip-link">Skip to main content</a>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary focus:ring-4 focus:ring-blue-300" data-testid="a11y-focus-btn-1" tabIndex={0}>First (Tab)</button>
            <button className="btn-secondary focus:ring-4 focus:ring-gray-300" data-testid="a11y-focus-btn-2" tabIndex={0}>Second</button>
            <button className="btn-secondary focus:ring-4 focus:ring-gray-300" data-testid="a11y-focus-btn-3" tabIndex={0}>Third</button>
            <button className="btn-secondary opacity-50 cursor-not-allowed" data-testid="a11y-focus-disabled" tabIndex={-1} aria-disabled="true">Removed from tab order</button>
          </div>
          <p id="main-content-skip" className="text-xs text-gray-400 mt-2">Tab through the buttons above — focus ring should be clearly visible.</p>
        </section>

        {/* ✅ GOOD: Tables and landmarks */}
        <section className="card p-6" data-testid="a11y-section-table" aria-labelledby="table-title">
          <h2 id="table-title" className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-green-500"/> ✅ Accessible Table
          </h2>
          <table aria-label="Test results summary" data-testid="a11y-good-table">
            <caption className="text-sm text-gray-500 text-left mb-2">Summary of recent automated test runs</caption>
            <thead>
              <tr>
                <th scope="col" className="text-left px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800">Suite</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800">Passed</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800">Failed</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800">Duration</th>
              </tr>
            </thead>
            <tbody>
              {[['Login', 12, 0, '1.2s'],['Checkout', 8, 1, '3.5s'],['API', 45, 2, '8.1s']].map(([suite,p,f,d]) => (
                <tr key={suite as string} className="border-t border-gray-100 dark:border-gray-800" data-testid={`a11y-table-row-${suite}`}>
                  <th scope="row" className="text-left px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{suite}</th>
                  <td className="px-3 py-2 text-sm text-green-600" data-testid={`a11y-table-passed-${suite}`}>{p}</td>
                  <td className="px-3 py-2 text-sm text-red-500" data-testid={`a11y-table-failed-${suite}`}>{f}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 font-mono">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ❌ VIOLATIONS */}
        {showViolations && (
          <section className="card p-6 border-2 border-red-200 dark:border-red-900/50" data-testid="a11y-section-violations" aria-labelledby="violations-title">
            <h2 id="violations-title" className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
              <XCircle size={16}/> ❌ Intentional Violations (axe-core targets)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">The following elements intentionally violate WCAG. Use axe-core to detect them.</p>
            <div className="space-y-5">
              {/* Missing label */}
              <div data-testid="violation-missing-label">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Input without &lt;label&gt; (WCAG 1.3.1)</p>
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                <input type="text" placeholder="No label! axe finds this." className="input max-w-xs border-red-300 dark:border-red-700" data-testid="violation-input-no-label" />
              </div>
              {/* Low contrast */}
              <div data-testid="violation-low-contrast">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Low contrast text (WCAG 1.4.3)</p>
                <p style={{ color: '#aaa', backgroundColor: '#fff' }} className="text-sm p-2 border rounded" data-testid="violation-text-low-contrast">This gray text on white fails contrast ratio requirements.</p>
              </div>
              {/* Missing alt */}
              <div data-testid="violation-missing-alt">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Image without alt text (WCAG 1.1.1)</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Crect width='80' height='40' fill='%23f97316'/%3E%3Ctext x='50%25' y='60%25' fill='white' font-size='12' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E" data-testid="violation-img-no-alt" />
              </div>
              {/* Positive tabindex */}
              <div data-testid="violation-tabindex">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Positive tabIndex (WCAG 2.4.3)</p>
                <button tabIndex={5} className="btn-secondary text-sm" data-testid="violation-positive-tabindex">tabIndex=5 (disrupts tab order)</button>
              </div>
              {/* Click on div (not button) */}
              <div data-testid="violation-div-button">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Div used as button, no role/keyboard (WCAG 4.1.2)</p>
                {/* Intentional violation — no role, no keyboard handler */}
                <div onClick={() => alert('Div click')} className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer inline-block text-sm" data-testid="violation-div-as-button">
                  Looks like a button (div)
                </div>
              </div>
              {/* Empty button */}
              <div data-testid="violation-empty-button">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">⚠ Button with no accessible name (WCAG 4.1.2)</p>
                <button className="btn-secondary p-2" data-testid="violation-empty-btn">
                  <Eye size={16} />
                  {/* No aria-label! axe catches this */}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* axe-core usage */}
        <div className="card overflow-hidden" data-testid="a11y-code-example">
          <div className="px-4 py-2 bg-gray-800 flex items-center justify-between">
            <span className="text-gray-300 text-xs font-mono">axe-core integration</span>
            <span className="text-gray-500 text-xs">Playwright</span>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 text-xs overflow-x-auto font-mono leading-relaxed">{`import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/practice/accessibility');

  // Run axe on the full page
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('violations section should have expected issues', async ({ page }) => {
  await page.goto('/practice/accessibility');
  // Scope axe to just the violations section
  const results = await new AxeBuilder({ page })
    .include('[data-testid="a11y-section-violations"]')
    .analyze();
  // We expect violations in this section!
  expect(results.violations.length).toBeGreaterThan(0);
  console.log('Found violations:', results.violations.map(v => v.id));
});`}</pre>
        </div>
      </div>
    </PageLayout>
  );
}
