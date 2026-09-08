import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Shuffle, Eye, Target } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

function uid() { return Math.random().toString(36).slice(2, 10); }
function randomClass() {
  const classes = ['btn-alpha', 'btn-beta', 'btn-gamma', 'control-x', 'control-y', 'widget-a', 'widget-b'];
  return classes[Math.floor(Math.random() * classes.length)];
}
function randomPosition() { return { top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }; }

interface DynamicElement {
  stableTestId: string;
  dynamicId: string;
  dynamicClass: string;
  label: string;
  value: string;
  clicked: boolean;
}

interface FloatingTarget { stableTestId: string; dynamicId: string; pos: { top: string; left: string }; found: boolean; }

function generateElements(): DynamicElement[] {
  return [
    { stableTestId: 'dynamic-btn-submit', dynamicId: `btn-${uid()}`, dynamicClass: randomClass(), label: 'Submit Action', value: 'SUBMIT_42', clicked: false },
    { stableTestId: 'dynamic-btn-cancel', dynamicId: `btn-${uid()}`, dynamicClass: randomClass(), label: 'Cancel Action', value: 'CANCEL_99', clicked: false },
    { stableTestId: 'dynamic-input-alpha', dynamicId: `input-${uid()}`, dynamicClass: randomClass(), label: 'Alpha Input', value: '', clicked: false },
    { stableTestId: 'dynamic-input-beta', dynamicId: `input-${uid()}`, dynamicClass: randomClass(), label: 'Beta Input', value: '', clicked: false },
    { stableTestId: 'dynamic-link-docs', dynamicId: `link-${uid()}`, dynamicClass: randomClass(), label: 'Docs Link', value: 'docs', clicked: false },
  ];
}

function generateTargets(): FloatingTarget[] {
  return Array.from({ length: 5 }, (_, i) => ({
    stableTestId: `floating-target-${i + 1}`,
    dynamicId: `target-${uid()}`,
    pos: randomPosition(),
    found: false,
  }));
}

export default function DynamicIdsPage() {
  const [elements, setElements] = useState<DynamicElement[]>(generateElements);
  const [targets, setTargets] = useState<FloatingTarget[]>(generateTargets);
  const [reloadCount, setReloadCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [attrTable, setAttrTable] = useState(generateElements);

  const regenerate = useCallback(() => {
    setElements(generateElements());
    setTargets(generateTargets());
    setAttrTable(generateElements());
    setReloadCount((c) => c + 1);
    setSelectedValue(null);
    console.log('[ClickAndVerify] Dynamic IDs regenerated');
  }, []);

  // Auto-regenerate IDs every 30s to simulate real dynamic apps
  useEffect(() => {
    const t = setInterval(regenerate, 30000);
    return () => clearInterval(t);
  }, [regenerate]);

  const handleClick = (idx: number) => {
    setElements((prev) => prev.map((el, i) => i === idx ? { ...el, clicked: true } : el));
    setSelectedValue(elements[idx].value);
    console.log(`[ClickAndVerify] Dynamic element clicked: stableTestId=${elements[idx].stableTestId} dynamicId=${elements[idx].dynamicId}`);
  };

  const handleTargetClick = (idx: number) => {
    setTargets((prev) => prev.map((t, i) => i === idx ? { ...t, found: true } : t));
    console.log(`[ClickAndVerify] Target found: ${targets[idx].stableTestId}`);
  };

  const foundCount = targets.filter((t) => t.found).length;

  return (
    <PageLayout
      title="Dynamic / Randomized IDs"
      description="Elements whose id and class attributes randomize on reload. Practice stable locator strategies."
      difficulty="advanced"
      testId="dynamic-ids-page"
      onReset={regenerate}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Reload counter */}
        <div className="card p-4 flex items-center justify-between" data-testid="dynamic-reload-info">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">IDs regenerated <span className="font-mono text-blue-600 dark:text-blue-400" data-testid="reload-count">{reloadCount}</span> times</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">IDs auto-rotate every 30s. Use stable <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">data-testid</code> instead of <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">id</code> or <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">class</code>.</p>
          </div>
          <button onClick={regenerate} className="btn-secondary gap-1.5" data-testid="btn-regenerate-ids">
            <RefreshCw size={14} /> Regenerate Now
          </button>
        </div>

        {/* Dynamic elements */}
        <div className="card p-6" data-testid="section-dynamic-elements">
          <h2 className="section-header">Elements with Dynamic IDs</h2>
          <p className="section-sub">The <code className="font-mono">id</code> and <code className="font-mono">class</code> change each reload. Only <code className="font-mono">data-testid</code> is stable.</p>
          <div className="space-y-3">
            {elements.map((el, idx) => (
              <div key={el.stableTestId} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={el.stableTestId}>
                <div className="flex-1 grid grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-gray-400">data-testid:</span><br />
                    <span className="text-green-600 dark:text-green-400 font-semibold">{el.stableTestId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">id (dynamic):</span><br />
                    <span className="text-red-500 line-through">{el.dynamicId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">class (dynamic):</span><br />
                    <span className="text-orange-500">{el.dynamicClass}</span>
                  </div>
                </div>
                {el.label.includes('Input') ? (
                  <input
                    id={el.dynamicId}
                    className={`input w-40 text-sm ${el.dynamicClass}`}
                    placeholder={el.label}
                    data-testid={el.stableTestId + '-input'}
                    data-dynamic-id={el.dynamicId}
                  />
                ) : el.label.includes('Link') ? (
                  <a
                    href="#"
                    id={el.dynamicId}
                    className={`text-blue-600 dark:text-blue-400 hover:underline text-sm ${el.dynamicClass}`}
                    data-testid={el.stableTestId}
                    data-dynamic-id={el.dynamicId}
                    onClick={(e) => { e.preventDefault(); handleClick(idx); }}
                  >
                    {el.label}
                  </a>
                ) : (
                  <button
                    id={el.dynamicId}
                    className={`btn-primary text-sm ${el.dynamicClass} ${el.clicked ? '!bg-green-600' : ''}`}
                    data-testid={el.stableTestId}
                    data-dynamic-id={el.dynamicId}
                    data-value={el.value}
                    onClick={() => handleClick(idx)}
                  >
                    {el.clicked ? '✓ Clicked' : el.label}
                  </button>
                )}
              </div>
            ))}
          </div>
          {selectedValue && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm" data-testid="dynamic-selected-value">
              Last clicked value: <span className="font-mono font-semibold text-green-700 dark:text-green-400">{selectedValue}</span>
            </div>
          )}
        </div>

        {/* Attribute comparison table */}
        <div className="card p-6" data-testid="section-attr-table">
          <h2 className="section-header">Before vs After Reload</h2>
          <p className="section-sub">Click "Regenerate Now" above to see IDs change while data-testid stays constant.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono" data-testid="attr-comparison-table">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-500 font-semibold">data-testid (stable)</th>
                  <th className="text-left py-2 px-3 text-red-500 font-semibold">id (changes)</th>
                  <th className="text-left py-2 px-3 text-orange-500 font-semibold">class (changes)</th>
                </tr>
              </thead>
              <tbody>
                {attrTable.map((el) => (
                  <tr key={el.stableTestId} className="border-b border-gray-100 dark:border-gray-800" data-testid={`attr-row-${el.stableTestId}`}>
                    <td className="py-2 px-3 text-green-700 dark:text-green-400">{el.stableTestId}</td>
                    <td className="py-2 px-3 text-red-500">{el.dynamicId}</td>
                    <td className="py-2 px-3 text-orange-500">{el.dynamicClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating targets */}
        <div className="card p-6" data-testid="section-floating-targets">
          <h2 className="section-header flex items-center gap-2">
            <Target size={18} className="text-orange-500" /> Hunt the Targets
          </h2>
          <p className="section-sub">
            5 targets are randomly placed. Find and click each one using its stable <code className="font-mono">data-testid</code>.
            Targets: <code className="font-mono text-blue-600 dark:text-blue-400">floating-target-1</code> through <code className="font-mono text-blue-600 dark:text-blue-400">floating-target-5</code>.
          </p>
          <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700" data-testid="targets-arena">
            {targets.map((target, idx) => (
              <button
                key={target.dynamicId}
                style={{ position: 'absolute', top: target.pos.top, left: target.pos.left, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleTargetClick(idx)}
                disabled={target.found}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                  target.found ? 'bg-green-500 scale-110' : 'bg-orange-500 hover:bg-orange-600 hover:scale-110 animate-pulse'
                }`}
                data-testid={target.stableTestId}
                data-dynamic-id={target.dynamicId}
                aria-label={`Target ${idx + 1}`}
              >
                {target.found ? '✓' : idx + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3" data-testid="targets-progress">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="h-2 bg-orange-500 rounded-full transition-all" style={{ width: `${(foundCount / 5) * 100}%` }} />
            </div>
            <span className="text-sm font-mono" data-testid="targets-found-count">{foundCount}/5 found</span>
            {foundCount === 5 && <span className="text-green-600 dark:text-green-400 font-semibold text-sm" data-testid="targets-complete">🎉 All found!</span>}
          </div>
        </div>

        {/* Strategy guide */}
        <div className="card p-5" data-testid="section-locator-strategies">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Eye size={14} /> Stable Locator Strategies</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
            {[
              { label: '✅ data-testid (best)', example: '[data-testid="dynamic-btn-submit"]' },
              { label: '✅ name attribute', example: '[name="submitAction"]' },
              { label: '✅ ARIA role + text', example: 'button:has-text("Submit Action")' },
              { label: '✅ Relative XPath', example: '//button[contains(@data-testid,"submit")]' },
              { label: '❌ id (unstable)', example: '#btn-a3f9c2d1 — changes each reload' },
              { label: '❌ class (unstable)', example: '.btn-alpha — changes each reload' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded p-2" data-testid={`strategy-${s.label.slice(0, 6).replace(/[^a-z]/gi, '-').toLowerCase()}`}>
                <p className="font-semibold mb-1">{s.label}</p>
                <code className="text-blue-600 dark:text-blue-400">{s.example}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
