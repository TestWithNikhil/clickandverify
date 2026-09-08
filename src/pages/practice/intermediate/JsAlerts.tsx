import { useState } from 'react';
import { AlertTriangle, HelpCircle, MessageSquare, Terminal } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface AlertEvent { type: string; triggered: string; result?: string; }

export default function JsAlertsPage() {
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [confirmResult, setConfirmResult] = useState<boolean | null>(null);
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  const log = (event: AlertEvent) => setEvents((prev) => [event, ...prev].slice(0, 20));

  const triggerAlert = () => {
    const msg = `Alert #${alertCount + 1}: This is a native browser alert. Click OK to dismiss.`;
    setAlertCount((c) => c + 1);
    console.log('[ClickAndVerify] alert() triggered');
    log({ type: 'alert', triggered: new Date().toLocaleTimeString() });
    alert(msg);
    console.log('[ClickAndVerify] alert() dismissed');
  };

  const triggerConfirm = () => {
    console.log('[ClickAndVerify] confirm() triggered');
    log({ type: 'confirm', triggered: new Date().toLocaleTimeString() });
    const result = confirm('Do you want to proceed with this action?');
    setConfirmResult(result);
    log({ type: 'confirm-result', triggered: new Date().toLocaleTimeString(), result: result ? 'OK' : 'Cancel' });
    console.log('[ClickAndVerify] confirm() result:', result);
  };

  const triggerPrompt = () => {
    console.log('[ClickAndVerify] prompt() triggered');
    log({ type: 'prompt', triggered: new Date().toLocaleTimeString() });
    const result = prompt('Enter your test automation tool name:', 'Selenium');
    setPromptResult(result);
    log({ type: 'prompt-result', triggered: new Date().toLocaleTimeString(), result: result === null ? '(cancelled)' : result || '(empty)' });
    console.log('[ClickAndVerify] prompt() result:', result);
  };

  const triggerDelayedAlert = (ms: number) => {
    console.log(`[ClickAndVerify] Delayed alert triggered (${ms}ms)`);
    log({ type: `delayed-alert-${ms}ms`, triggered: new Date().toLocaleTimeString() });
    setTimeout(() => { alert(`This alert was delayed by ${ms}ms. Used setTimeout!`); }, ms);
  };

  const triggerMultipleAlerts = () => {
    console.log('[ClickAndVerify] Chained alerts triggered');
    log({ type: 'chained-alerts', triggered: new Date().toLocaleTimeString() });
    alert('First alert — click OK to see the next one.');
    alert('Second alert — one more after this!');
    alert('Third and final alert.');
  };

  const triggerAlertInLoop = () => {
    console.log('[ClickAndVerify] Loop alert triggered');
    for (let i = 1; i <= 3; i++) {
      alert(`Loop iteration ${i} of 3`);
    }
  };

  const dialogs = [
    {
      id: 'alert',
      label: 'alert()',
      desc: 'Native browser alert dialog. Requires Accept (OK) to dismiss.',
      icon: <AlertTriangle size={18} className="text-yellow-500" />,
      btnLabel: 'Trigger alert()',
      btnClass: 'bg-yellow-500 text-white hover:bg-yellow-600 btn',
      testId: 'btn-trigger-alert',
      onClick: triggerAlert,
    },
    {
      id: 'confirm',
      label: 'confirm()',
      desc: 'Dialog with OK and Cancel. Tests must handle both outcomes.',
      icon: <HelpCircle size={18} className="text-blue-500" />,
      btnLabel: 'Trigger confirm()',
      btnClass: 'btn-primary',
      testId: 'btn-trigger-confirm',
      onClick: triggerConfirm,
    },
    {
      id: 'prompt',
      label: 'prompt()',
      desc: 'Dialog with text input, OK, and Cancel. Tests can type and submit.',
      icon: <MessageSquare size={18} className="text-purple-500" />,
      btnLabel: 'Trigger prompt()',
      btnClass: 'bg-purple-600 text-white hover:bg-purple-700 btn',
      testId: 'btn-trigger-prompt',
      onClick: triggerPrompt,
    },
  ];

  return (
    <PageLayout title="JS Alerts & Dialogs" description="Trigger native browser alert(), confirm(), and prompt() dialogs." difficulty="intermediate" testId="js-alerts-page"
      onReset={() => { setEvents([]); setConfirmResult(null); setPromptResult(null); setAlertCount(0); }}>
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Primary dialogs */}
          {dialogs.map((d) => (
            <div key={d.id} className="card p-5" data-testid={`section-${d.id}`}>
              <div className="flex items-center gap-2 mb-2">
                {d.icon}
                <h2 className="font-bold text-gray-900 dark:text-gray-100 font-mono">{d.label}</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{d.desc}</p>
              <button onClick={d.onClick} className={d.btnClass} data-testid={d.testId}>{d.btnLabel}</button>
            </div>
          ))}

          {/* Results */}
          {confirmResult !== null && (
            <div className="card p-4 border-l-4 border-blue-500" data-testid="confirm-result-panel">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">confirm() result:</p>
              <span className={`badge mt-1 ${confirmResult ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`} data-testid="confirm-result-value">
                {confirmResult ? 'OK (true)' : 'Cancel (false)'}
              </span>
            </div>
          )}
          {promptResult !== null && (
            <div className="card p-4 border-l-4 border-purple-500" data-testid="prompt-result-panel">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">prompt() result:</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 text-sm mt-1" data-testid="prompt-result-value">
                {promptResult === null ? 'null (cancelled)' : `"${promptResult}"`}
              </p>
            </div>
          )}

          {/* Advanced scenarios */}
          <div className="card p-5" data-testid="section-advanced-alerts">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Terminal size={16} className="text-gray-500" /> Advanced Scenarios
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Edge cases for testing async and sequential dialog handling</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => triggerDelayedAlert(1000)} className="btn-secondary text-xs" data-testid="btn-delayed-alert-1s">Alert after 1s</button>
              <button onClick={() => triggerDelayedAlert(3000)} className="btn-secondary text-xs" data-testid="btn-delayed-alert-3s">Alert after 3s</button>
              <button onClick={triggerMultipleAlerts} className="btn-secondary text-xs" data-testid="btn-chained-alerts">3 Chained Alerts</button>
              <button onClick={triggerAlertInLoop} className="btn-secondary text-xs" data-testid="btn-loop-alerts">Alert in Loop</button>
            </div>
          </div>
        </div>

        {/* Event log */}
        <div className="space-y-4">
          <div className="card p-5" data-testid="alerts-hint">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">How to Handle in Automation</h3>
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              {[
                { tool: 'Selenium', code: 'driver.switchTo().alert().accept();\ndriver.switchTo().alert().dismiss();' },
                { tool: 'Playwright', code: 'page.on("dialog", d => d.accept());\n// or d.dismiss()' },
                { tool: 'Cypress', code: 'cy.on("window:alert", (msg) => {\n  expect(msg).to.contain("expected");\n});' },
              ].map((h) => (
                <div key={h.tool} data-testid={`hint-${h.tool.toLowerCase()}`}>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{h.tool}</p>
                  <pre className="bg-gray-900 text-green-400 rounded p-2 text-xs overflow-x-auto font-mono">{h.code}</pre>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5" data-testid="alerts-event-log">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
              Event Log <span className="text-gray-400 text-xs">({events.length})</span>
            </h3>
            {events.length === 0 ? (
              <p className="text-xs text-gray-400" data-testid="alerts-log-empty">No dialogs triggered yet.</p>
            ) : (
              <ul className="space-y-1.5 max-h-64 overflow-y-auto" data-testid="alerts-log-list">
                {events.map((e, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs" data-testid={`alert-log-${i}`}>
                    <span className="text-gray-400 font-mono w-16 shrink-0">{e.triggered}</span>
                    <span className={`badge text-xs ${e.type.includes('alert') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : e.type.includes('confirm') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                      {e.type}
                    </span>
                    {e.result && <span className="text-gray-600 dark:text-gray-400">→ {e.result}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
