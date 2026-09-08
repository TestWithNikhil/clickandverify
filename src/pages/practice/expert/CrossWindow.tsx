import { useState, useEffect } from 'react';
import { ExternalLink, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

const POPUP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CAV Popup Window</title>
  <style>
    body { font-family: sans-serif; padding: 24px; background: #eff6ff; }
    h1 { color: #1d4ed8; font-size: 20px; }
    .data { background: white; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .field { margin-bottom: 8px; }
    label { font-size: 12px; color: #6b7280; display: block; }
    input { border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 10px; width: 200px; }
    button { background: #1d4ed8; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; margin-top: 8px; }
    button:hover { background: #1e40af; }
    #status { margin-top: 12px; font-weight: bold; color: #15803d; }
    .info { font-size: 12px; color: #6b7280; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>⚡ ClickAndVerify — Popup Window</h1>
  <p class="info">This is a separate browser window/tab. Test context switching here.</p>
  <div class="data">
    <div class="field">
      <label for="popup-input">Type something:</label>
      <input id="popup-input" type="text" data-testid="popup-input" placeholder="Hello from popup!" />
    </div>
    <button data-testid="popup-submit-btn" onclick="
      var val = document.getElementById('popup-input').value;
      document.getElementById('status').textContent = 'Submitted: ' + (val || '(empty)');
      if (window.opener) window.opener.postMessage({type:'popup-submit', value: val}, '*');
      console.log('[ClickAndVerify] Popup submitted:', val);
    ">Submit & Notify Parent</button>
    <button data-testid="popup-close-btn" style="margin-left:8px;background:#dc2626;" onclick="window.close()">Close Window</button>
    <div id="status" data-testid="popup-status"></div>
  </div>
  <p class="info">data-testid values: <code>popup-input</code>, <code>popup-submit-btn</code>, <code>popup-close-btn</code>, <code>popup-status</code></p>
</body>
</html>`;

const NEW_TAB_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CAV New Tab</title>
  <style>
    body { font-family: sans-serif; padding: 24px; background: #f0fdf4; max-width: 600px; margin: 0 auto; }
    h1 { color: #15803d; }
    .card { background: white; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 12px 0; }
    button { background: #15803d; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; }
    select { border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 10px; margin-right: 8px; }
    #result { margin-top: 8px; font-weight: bold; color: #15803d; min-height: 20px; }
    .info { font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <h1>⚡ ClickAndVerify — New Tab Page</h1>
  <div class="card">
    <p>This page opened in a new tab. Switch to it and interact with these elements:</p>
    <div style="margin-top:12px;">
      <select id="tab-select" data-testid="tab-select">
        <option value="">Choose a tool…</option>
        <option value="selenium">Selenium</option>
        <option value="playwright">Playwright</option>
        <option value="cypress">Cypress</option>
        <option value="postman">Postman</option>
      </select>
      <button data-testid="tab-confirm-btn" onclick="
        var val = document.getElementById('tab-select').value;
        document.getElementById('result').textContent = val ? 'Selected: ' + val : 'Please select a tool first';
        console.log('[ClickAndVerify] Tab selection:', val);
      ">Confirm</button>
      <div id="result" data-testid="tab-result"></div>
    </div>
    <p class="info" style="margin-top:12px;">Close this tab and switch back to verify the original window is still available.</p>
  </div>
  <div class="card">
    <p class="info">data-testid values: <code>tab-select</code>, <code>tab-confirm-btn</code>, <code>tab-result</code></p>
  </div>
</body>
</html>`;

export default function CrossWindowPage() {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [windowCount, setWindowCount] = useState(1);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => { setLog(l => [`${new Date().toLocaleTimeString()} — ${msg}`, ...l].slice(0, 15)); };

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'popup-submit') {
        setPopupMessage(e.data.value || '(empty)');
        addLog(`postMessage received from popup: "${e.data.value}"`);
        console.log('[ClickAndVerify] postMessage from popup:', e.data.value);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const openPopup = () => {
    const url = URL.createObjectURL(new Blob([POPUP_HTML], { type: 'text/html' }));
    const w = window.open(url, 'cav-popup', 'width=520,height=380,top=200,left=200');
    if (w) { setWindowCount(c => c + 1); addLog('Popup window opened'); console.log('[ClickAndVerify] Popup opened'); }
    else addLog('Popup blocked! Allow popups in browser settings.');
  };

  const openNewTab = () => {
    const url = URL.createObjectURL(new Blob([NEW_TAB_HTML], { type: 'text/html' }));
    window.open(url, '_blank');
    setWindowCount(c => c + 1);
    addLog('New tab opened');
    console.log('[ClickAndVerify] New tab opened');
  };

  const openNamedWindow = () => {
    const w = window.open('about:blank', 'cav-named-window', 'width=600,height=400');
    if (w) {
      w.document.write(`<html><body style="font-family:sans-serif;padding:20px;background:#fef9c3"><h2>Named Window: cav-named-window</h2><p>This window has a specific name, so <code>window.open('...', 'cav-named-window')</code> always reuses it instead of creating a new one.</p><p data-testid="named-window-content">Named window content here.</p></body></html>`);
      w.document.close();
      setWindowCount(c => c + 1);
      addLog('Named window opened/focused: cav-named-window');
    }
  };

  const codeExamples = [
    {
      label: 'Playwright — New Tab',
      color: 'text-green-400',
      code: `const [newTab] = await Promise.all([
  context.waitForEvent('page'),
  page.getByTestId('btn-open-new-tab').click(),
]);
await newTab.waitForLoadState();
await newTab.getByTestId('tab-select').selectOption('playwright');
await newTab.getByTestId('tab-confirm-btn').click();
await expect(newTab.getByTestId('tab-result')).toContainText('playwright');
await newTab.close();`,
    },
    {
      label: 'Playwright — Popup Window',
      color: 'text-green-400',
      code: `const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByTestId('btn-open-popup').click(),
]);
await popup.waitForLoadState();
await popup.getByTestId('popup-input').fill('Hello from test!');
await popup.getByTestId('popup-submit-btn').click();
await expect(popup.getByTestId('popup-status')).toContainText('Submitted');
// Check postMessage was received back in parent
await expect(page.getByTestId('popup-received-message')).toContainText('Hello from test!');`,
    },
    {
      label: 'Selenium — Window Handles',
      color: 'text-orange-400',
      code: `String mainHandle = driver.getWindowHandle();
driver.findElement(By.cssSelector("[data-testid='btn-open-new-tab']")).click();

// Wait for new tab
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
wait.until(ExpectedConditions.numberOfWindowsToBe(2));

// Switch to new tab
for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(mainHandle)) {
        driver.switchTo().window(handle);
        break;
    }
}

driver.findElement(By.cssSelector("[data-testid='tab-select']")).sendKeys("playwright");
driver.findElement(By.cssSelector("[data-testid='tab-confirm-btn']")).click();

// Switch back to main
driver.switchTo().window(mainHandle);`,
    },
    {
      label: 'Cypress — Multiple Tabs (workaround)',
      color: 'text-cyan-400',
      code: `// Cypress doesn't support multiple tabs natively.
// Stub window.open to prevent tab creation and test in-page:
cy.window().then(win => cy.stub(win, 'open').as('windowOpen'));
cy.get('[data-testid="btn-open-new-tab"]').click();
cy.get('@windowOpen').should('have.been.called');

// Alternative: Use cy.origin() for cross-origin
// Or test the target page directly:
cy.visit('/new-tab-content');
cy.get('[data-testid="tab-select"]').select('playwright');`,
    },
  ];

  return (
    <PageLayout title="Cross-Window / Tab Behavior" description="Open new tabs, popups, and named windows. Practice context switching in automation tools." difficulty="expert" testId="cross-window-page"
      onReset={() => { setPopupMessage(null); setLog([]); setWindowCount(1); }}>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="card p-5" data-testid="section-window-actions">
          <h2 className="section-header">Window / Tab Controls</h2>
          <p className="section-sub">Each button opens a different type of browser context</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={openNewTab} className="btn-primary gap-1.5" data-testid="btn-open-new-tab">
              <ExternalLink size={14} /> Open New Tab
            </button>
            <button onClick={openPopup} className="btn-secondary gap-1.5" data-testid="btn-open-popup">
              <Monitor size={14} /> Open Popup Window
            </button>
            <button onClick={openNamedWindow} className="btn-secondary gap-1.5" data-testid="btn-open-named-window">
              <Monitor size={14} /> Open Named Window
            </button>
            <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="btn bg-purple-600 text-white hover:bg-purple-700 gap-1.5" data-testid="btn-open-external-link">
              <ExternalLink size={14} /> External Link (new tab)
            </a>
          </div>

          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3" data-testid="window-count-display">
              <p className="text-xs text-gray-500 dark:text-gray-400">Windows/Tabs Opened</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono" data-testid="window-count">{windowCount}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:col-span-2" data-testid="popup-message-display">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">postMessage from Popup</p>
              {popupMessage ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-400 font-mono" data-testid="popup-received-message">"{popupMessage}"</span>
                </div>
              ) : (
                <p className="text-gray-400 text-xs" data-testid="popup-no-message">No message received yet. Open popup and submit.</p>
              )}
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="card p-5" data-testid="section-window-scenarios">
          <h2 className="section-header">Test Scenarios</h2>
          <div className="space-y-2">
            {[
              { id: 's1', scenario: 'Open new tab → interact → close → verify parent still functional' },
              { id: 's2', scenario: 'Open popup → fill input → submit → verify postMessage in parent' },
              { id: 's3', scenario: 'Open named window → click again (reuses same window, no duplicate)' },
              { id: 's4', scenario: 'Click external link → verify new tab URL contains "example.com"' },
              { id: 's5', scenario: 'window count increments correctly on each open' },
              { id: 's6', scenario: 'Switch focus back to main window after popup closes' },
            ].map(s => (
              <div key={s.id} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400" data-testid={`scenario-${s.id}`}>
                <span className="text-blue-400 shrink-0">→</span> {s.scenario}
              </div>
            ))}
          </div>
        </div>

        {/* Alert for popup blockers */}
        <div className="card p-4 border-l-4 border-yellow-400" data-testid="popup-blocker-warning">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Browser Popup Blockers</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Browsers block popups not triggered by direct user interaction. In automation, WebDriver/Playwright bypass this. Cypress requires <code className="font-mono">cy.stub(win, 'open')</code> or use of <code className="font-mono">cy.origin()</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Event log */}
        {log.length > 0 && (
          <div className="card p-4" data-testid="window-event-log">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Event Log</h3>
            <ul className="space-y-1">
              {log.map((entry, i) => (
                <li key={i} className="text-xs font-mono text-gray-500 dark:text-gray-400" data-testid={`window-log-${i}`}>{entry}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Code examples */}
        <div className="card overflow-hidden" data-testid="cross-window-code-examples">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Cross-Window Automation Code</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {codeExamples.map(ex => (
              <div key={ex.label} data-testid={`cross-code-${ex.label.split(' ')[0].toLowerCase()}-${ex.label.split(' ')[2]?.toLowerCase() || ''}`}>
                <div className="px-4 py-2 bg-gray-800">
                  <span className="text-gray-300 text-xs font-mono">{ex.label}</span>
                </div>
                <pre className={`bg-gray-900 ${ex.color} p-4 text-xs overflow-x-auto font-mono leading-relaxed`}>{ex.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
