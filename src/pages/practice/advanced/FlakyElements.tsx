import { useState, useCallback } from 'react';
import { Dice5, RefreshCw, AlertCircle, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface ClickResult { attempt: number; success: boolean; delay: number; ts: number; }

interface FlakyConfig {
  id: string; label: string; failRate: number; minDelay: number; maxDelay: number;
  desc: string; testId: string;
}

const FLAKY_CONFIGS: FlakyConfig[] = [
  { id: 'mild', label: 'Mild Flakiness', failRate: 0.2, minDelay: 200, maxDelay: 600, desc: '20% fail rate. 1 in 5 clicks fails.', testId: 'flaky-btn-mild' },
  { id: 'moderate', label: 'Moderate Flakiness', failRate: 0.4, minDelay: 300, maxDelay: 1200, desc: '40% fail rate. Random 300–1200ms delay.', testId: 'flaky-btn-moderate' },
  { id: 'severe', label: 'Severe Flakiness', failRate: 0.7, minDelay: 500, maxDelay: 2000, desc: '70% fail rate. Needs multiple retries.', testId: 'flaky-btn-severe' },
  { id: 'random-delay', label: 'Random Delay Only', failRate: 0, minDelay: 100, maxDelay: 4000, desc: 'Always succeeds but delay is unpredictable.', testId: 'flaky-btn-random-delay' },
  { id: 'disappearing', label: 'Disappearing Element', failRate: 0.5, minDelay: 0, maxDelay: 500, desc: 'Element randomly disappears mid-click.', testId: 'flaky-btn-disappearing' },
];

function useFlakyButton(config: FlakyConfig) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [history, setHistory] = useState<ClickResult[]>([]);
  const [visible, setVisible] = useState(true);

  const click = useCallback(async () => {
    if (status === 'loading') return;
    const attempt = history.length + 1;
    const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
    const willFail = Math.random() < config.failRate;
    const willDisappear = config.id === 'disappearing' && Math.random() < 0.5;

    setStatus('loading');
    console.log(`[ClickAndVerify] Flaky click attempt #${attempt} on "${config.label}"`);

    if (willDisappear) {
      setTimeout(() => { setVisible(false); setTimeout(() => setVisible(true), 2000); }, delay / 2);
    }

    await new Promise((r) => setTimeout(r, delay));

    const success = !willFail;
    setStatus(success ? 'success' : 'error');
    const result: ClickResult = { attempt, success, delay: Math.round(delay), ts: Date.now() };
    setHistory((h) => [result, ...h].slice(0, 20));
    console.log(`[ClickAndVerify] Flaky result: attempt=${attempt} success=${success} delay=${Math.round(delay)}ms`);
    setTimeout(() => setStatus('idle'), 1500);
  }, [config, history, status]);

  const reset = () => { setStatus('idle'); setHistory([]); setVisible(true); };
  const successRate = history.length > 0 ? (history.filter((h) => h.success).length / history.length * 100).toFixed(0) : null;

  return { status, history, visible, click, reset, successRate };
}

function FlakyButton({ config }: { config: FlakyConfig }) {
  const { status, history, visible, click, reset, successRate } = useFlakyButton(config);

  if (!visible) {
    return (
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 animate-pulse" data-testid={`${config.testId}-missing`}>
        ⚠ Element disappeared! Re-appearing in 2s…
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={click}
        disabled={status === 'loading'}
        className={`btn w-full transition-all ${
          status === 'idle' ? 'btn-secondary' :
          status === 'loading' ? 'btn-secondary opacity-70 cursor-wait' :
          status === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
          'bg-red-600 text-white hover:bg-red-700'
        } btn`}
        data-testid={config.testId}
        data-status={status}
        data-attempt={history.length + 1}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Processing…</> :
         status === 'success' ? <><CheckCircle size={15} /> Success!</> :
         status === 'error' ? <><XCircle size={15} /> Failed (retry!)</> :
         <><Dice5 size={15} /> {config.label}</>}
      </button>

      {history.length > 0 && (
        <div className="text-xs space-y-0.5" data-testid={`${config.testId}-history`}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={12} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              {history.filter((h) => h.success).length}/{history.length} succeeded
              {successRate && <span className="ml-1 font-mono text-blue-600 dark:text-blue-400" data-testid={`${config.testId}-success-rate`}>({successRate}%)</span>}
            </span>
            <button onClick={reset} className="ml-auto text-gray-400 hover:text-gray-600 text-xs" data-testid={`${config.testId}-reset`}>reset</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {[...history].reverse().slice(0, 10).map((r, i) => (
              <span
                key={r.ts}
                className={`w-5 h-5 rounded text-white text-xs flex items-center justify-center font-bold ${r.success ? 'bg-green-500' : 'bg-red-500'}`}
                title={`Attempt ${r.attempt}: ${r.success ? 'OK' : 'FAIL'} in ${r.delay}ms`}
                data-testid={`${config.testId}-attempt-${r.attempt}`}
                data-success={r.success}
              >
                {r.success ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlakyElementsPage() {
  const [retryStrategy, setRetryStrategy] = useState<'none' | 'fixed' | 'exponential'>('none');
  const [retryCount, setRetryCount] = useState(3);
  const [autoRetryRunning, setAutoRetryRunning] = useState(false);
  const [autoRetryLog, setAutoRetryLog] = useState<string[]>([]);

  const runAutoRetry = async () => {
    setAutoRetryRunning(true);
    setAutoRetryLog([]);
    const maxAttempts = retryCount;
    let delay = 500;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const willFail = Math.random() < 0.5;
      const waitTime = retryStrategy === 'exponential' ? delay : 500;
      if (attempt > 1) await new Promise((r) => setTimeout(r, waitTime));
      if (retryStrategy === 'exponential') delay *= 2;

      const log = `Attempt ${attempt}/${maxAttempts}: ${willFail ? '✗ FAILED' : '✓ SUCCEEDED'}${attempt > 1 ? ` (waited ${waitTime}ms)` : ''}`;
      setAutoRetryLog((l) => [...l, log]);

      if (!willFail) {
        setAutoRetryLog((l) => [...l, '🎉 Operation completed successfully']);
        break;
      }
      if (attempt === maxAttempts) {
        setAutoRetryLog((l) => [...l, `❌ All ${maxAttempts} attempts failed. Giving up.`]);
      }
    }
    setAutoRetryRunning(false);
  };

  return (
    <PageLayout
      title="Flaky / Broken Elements"
      description="Elements that randomly fail. Practice retry logic, wait strategies, and resilient test design."
      difficulty="advanced"
      testId="flaky-elements-page"
      onReset={() => setAutoRetryLog([])}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card p-4" data-testid="flaky-intro">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-world apps have race conditions, slow networks, and timing issues that cause tests to fail intermittently.
            These buttons simulate various flakiness patterns — practice wrapping them in retry loops.
          </p>
        </div>

        {/* Flaky buttons */}
        <div className="grid sm:grid-cols-2 gap-4" data-testid="flaky-buttons-grid">
          {FLAKY_CONFIGS.map((config) => (
            <div key={config.id} className="card p-5" data-testid={`flaky-card-${config.id}`}>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{config.label}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{config.desc}</p>
              <FlakyButton config={config} />
            </div>
          ))}
        </div>

        {/* Retry simulator */}
        <div className="card p-5" data-testid="retry-simulator">
          <h2 className="section-header">Retry Logic Simulator</h2>
          <p className="section-sub">Simulate a flaky operation with configurable retry strategy</p>
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="label" htmlFor="retry-strategy">Strategy</label>
              <select id="retry-strategy" className="input w-auto" value={retryStrategy} onChange={(e) => setRetryStrategy(e.target.value as typeof retryStrategy)} data-testid="retry-strategy-select">
                <option value="none">No Retry</option>
                <option value="fixed">Fixed Interval (500ms)</option>
                <option value="exponential">Exponential Backoff</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="retry-count">Max Attempts</label>
              <input id="retry-count" type="number" min={1} max={10} value={retryCount} onChange={(e) => setRetryCount(Number(e.target.value))} className="input w-24" data-testid="retry-count-input" />
            </div>
            <button onClick={runAutoRetry} disabled={autoRetryRunning} className="btn-primary gap-1.5 disabled:opacity-50" data-testid="btn-run-retry-sim">
              {autoRetryRunning ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Running…</> : <><RefreshCw size={14} /> Run Simulation</>}
            </button>
          </div>
          {autoRetryLog.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs" data-testid="retry-sim-log" aria-live="polite">
              {autoRetryLog.map((entry, i) => (
                <div key={i} className={`mb-0.5 ${entry.includes('✓') || entry.includes('🎉') ? 'text-green-400' : entry.includes('✗') || entry.includes('❌') ? 'text-red-400' : 'text-gray-400'}`} data-testid={`retry-log-${i}`}>
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Code examples */}
        <div className="card overflow-hidden" data-testid="flaky-code-examples">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Retry Patterns in Test Frameworks</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[{
              label: 'Playwright — built-in auto-retry',
              color: 'text-green-400',
              code: `// Playwright retries by default until timeout. Customize:
await expect(page.getByTestId('flaky-btn-mild')).toBeEnabled({ timeout: 10_000 });

// Manual retry with retry library:
await retry(async () => {
  await page.getByTestId('flaky-btn-mild').click();
  await expect(page.getByTestId('flaky-btn-mild')).toHaveAttribute('data-status', 'success');
}, { retries: 5, delay: 500 });`,
            }, {
              label: 'Cypress — built-in retry + custom',
              color: 'text-cyan-400',
              code: `// Cypress auto-retries .should() assertions
cy.get('[data-testid="flaky-btn-mild"]').click();
cy.get('[data-testid="flaky-btn-mild"]', { timeout: 10000 })
  .should('have.attr', 'data-status', 'success');

// Custom retry:
Cypress.Commands.add('clickUntilSuccess', (selector, retries = 5) => {
  cy.get(selector).click();
  cy.get(selector).then($el => {
    if ($el.attr('data-status') !== 'success' && retries > 0) {
      cy.clickUntilSuccess(selector, retries - 1);
    }
  });
});`,
            }].map((ex) => (
              <div key={ex.label}>
                <div className="px-4 py-2 bg-gray-800"><span className="text-gray-300 text-xs font-mono">{ex.label}</span></div>
                <pre className={`bg-gray-900 ${ex.color} p-4 text-xs overflow-x-auto font-mono leading-relaxed`}>{ex.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
