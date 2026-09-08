import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface DelayedItem {
  id: string; label: string; delay: number; status: 'waiting' | 'loading' | 'done' | 'error';
  startedAt?: number; appearedAt?: number; content?: string;
}

const SCENARIOS: Omit<DelayedItem, 'status'>[] = [
  { id: 'instant', label: 'Instant element (0ms)', delay: 0, content: 'This appeared immediately — no wait needed.' },
  { id: 'fast', label: 'Fast element (500ms)', delay: 500, content: 'This appeared after 500ms. A smart explicit wait catches it.' },
  { id: 'medium', label: 'Medium element (1500ms)', delay: 1500, content: 'This took 1.5 seconds. Use waitForSelector or waitUntilVisible.' },
  { id: 'slow', label: 'Slow element (3000ms)', delay: 3000, content: 'This took 3 seconds. Default timeouts might not be enough.' },
  { id: 'very-slow', label: 'Very slow element (6000ms)', delay: 6000, content: 'This took 6 seconds. Increase your wait timeout explicitly.' },
  { id: 'random', label: 'Random delay (1–5s)', delay: -1, content: 'Delay is random each time — practice dynamic wait strategies.' },
  { id: 'error-prone', label: 'Sometimes fails (33% chance)', delay: 1000, content: 'Successfully loaded after retry.' },
];

function useElapsedTime(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const t = setInterval(() => setElapsed(Date.now() - start), 50);
    return () => clearInterval(t);
  }, [running]);
  return elapsed;
}

function TimerBar({ delay, elapsed, status }: { delay: number; elapsed: number; status: string }) {
  if (status === 'done' || status === 'error') return null;
  const actual = delay < 0 ? 5000 : delay || 100;
  const pct = Math.min((elapsed / actual) * 100, 95);
  return (
    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
      <div className="h-1 bg-blue-400 rounded-full transition-all duration-100" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AsyncLoadingPage() {
  const [items, setItems] = useState<DelayedItem[]>([]);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const elapsed = useElapsedTime(running);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setItems([]);
    setRunning(false);
    setStartTime(null);
  };

  const start = () => {
    reset();
    const now = Date.now();
    setStartTime(now);
    setRunning(true);
    const initial: DelayedItem[] = SCENARIOS.map((s) => ({ ...s, status: 'waiting' }));
    setItems(initial);
    console.log('[ClickAndVerify] Async loading started');

    SCENARIOS.forEach((s) => {
      const actualDelay = s.delay < 0 ? 1000 + Math.random() * 4000 : s.delay;
      setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: s.delay === 0 ? 'done' : 'loading', startedAt: now, appearedAt: s.delay === 0 ? now : undefined } : i));

      if (s.delay === 0) return;

      const t = setTimeout(() => {
        if (s.id === 'error-prone' && Math.random() < 0.33) {
          setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: 'error', appearedAt: Date.now() } : i));
          console.log('[ClickAndVerify] error-prone element failed');
        } else {
          setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: 'done', appearedAt: Date.now() } : i));
          console.log(`[ClickAndVerify] Element appeared: ${s.id} after ${Math.round(actualDelay)}ms`);
        }
      }, actualDelay);
      timers.current.push(t);
    });

    const allDone = Math.max(...SCENARIOS.map((s) => s.delay < 0 ? 5500 : s.delay)) + 500;
    const doneT = setTimeout(() => setRunning(false), allDone);
    timers.current.push(doneT);
  };

  const allDone = items.length > 0 && items.every((i) => i.status === 'done' || i.status === 'error');

  return (
    <PageLayout
      title="Async Loading & Spinners"
      description="Elements that appear after varying delays. Practice explicit waits, polling, and timeout strategies."
      difficulty="advanced"
      testId="async-loading-page"
      onReset={reset}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card p-5" data-testid="async-controls">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Simulate Async Loads</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click Start to trigger {SCENARIOS.length} elements with different delays.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={start} disabled={running} className="btn-primary gap-1.5 disabled:opacity-50" data-testid="btn-start-async">
                {running ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Running…</> : <><RefreshCw size={14} /> Start</>}
              </button>
            </div>
          </div>
          {running && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-2" data-testid="async-elapsed">
              Elapsed: <span data-testid="async-elapsed-value">{(elapsed / 1000).toFixed(1)}s</span>
            </p>
          )}
          {allDone && <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2" data-testid="async-all-done">✓ All elements finished loading</p>}
        </div>

        {/* Element cards */}
        <div className="space-y-3" data-testid="async-elements-list">
          {SCENARIOS.map((s) => {
            const item = items.find((i) => i.id === s.id);
            const status = item?.status ?? 'waiting';
            const appearMs = item?.appearedAt && item?.startedAt ? item.appearedAt - item.startedAt : null;

            return (
              <div
                key={s.id}
                className={`card p-4 transition-all ${status === 'done' ? 'border-green-200 dark:border-green-800' : status === 'error' ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-800'}`}
                data-testid={`async-item-${s.id}`}
                data-status={status}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {status === 'waiting' && <Clock size={16} className="text-gray-300 dark:text-gray-600" />}
                    {status === 'loading' && <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                    {status === 'done' && <CheckCircle size={16} className="text-green-500" />}
                    {status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200" data-testid={`async-label-${s.id}`}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {appearMs !== null && (
                      <span className="text-xs font-mono text-gray-400" data-testid={`async-time-${s.id}`}>{appearMs}ms</span>
                    )}
                    <span className={`badge text-xs ${
                      status === 'waiting' ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' :
                      status === 'loading' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`} data-testid={`async-status-${s.id}`}>{status}</span>
                  </div>
                </div>

                {status === 'loading' && (
                  <TimerBar delay={s.delay} elapsed={elapsed} status={status} />
                )}

                {status === 'done' && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 animate-fade-in" data-testid={`async-content-${s.id}`} role="status" aria-live="polite">
                    ✓ {item?.content}
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 animate-fade-in" data-testid={`async-error-${s.id}`} role="alert">
                    ✗ Load failed. Use retry logic with waitFor or poll.
                    <button onClick={() => {
                      setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: 'loading' } : i));
                      setTimeout(() => {
                        setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: 'done', content: 'Loaded after retry!' } : i));
                      }, 800);
                    }} className="ml-2 text-blue-600 dark:text-blue-400 underline" data-testid={`async-retry-${s.id}`}>Retry</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll-into-view practice */}
        <div className="card p-5" data-testid="section-scroll-into-view">
          <h2 className="section-header">Scroll-Into-View Required</h2>
          <p className="section-sub">This element is positioned far down. Scroll to it before clicking.</p>
          <div className="h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg" data-testid="scroll-container">
            <div className="p-4 space-y-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded" data-testid={`scroll-filler-${i}`} />
              ))}
              <button
                className="btn-primary w-full sticky-button"
                data-testid="scroll-target-button"
                onClick={() => console.log('[ClickAndVerify] Scroll-target button clicked')}
              >
                🎯 You found the scroll target!
              </button>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Playwright: <code className="font-mono">await element.scrollIntoViewIfNeeded()</code></p>
        </div>
      </div>
    </PageLayout>
  );
}
