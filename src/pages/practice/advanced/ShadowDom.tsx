import { useEffect, useRef, useState } from 'react';
import PageLayout from '../../../components/layout/PageLayout';

// Define custom web components as strings and register them once
const COMPONENT_SCRIPT = `
if (!customElements.get('cav-counter')) {
  class CavCounter extends HTMLElement {
    constructor() {
      super();
      this._count = 0;
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = \`
        <style>
          :host { display: block; padding: 16px; background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 12px; font-family: sans-serif; }
          .count { font-size: 2rem; font-weight: bold; color: #2563eb; text-align: center; margin: 8px 0; }
          .controls { display: flex; gap: 8px; justify-content: center; }
          button { padding: 8px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: opacity 0.15s; }
          button:active { opacity: 0.8; }
          .dec { background: #fee2e2; color: #dc2626; }
          .inc { background: #dcfce7; color: #16a34a; }
          .reset { background: #f3f4f6; color: #374151; }
          p.label { text-align: center; font-size: 12px; color: #6b7280; margin: 4px 0 12px; }
        </style>
        <p class="label">Shadow DOM Counter (mode: open)</p>
        <div class="count" data-testid="shadow-count">0</div>
        <div class="controls">
          <button class="dec" data-testid="shadow-decrement">−</button>
          <button class="reset" data-testid="shadow-reset">Reset</button>
          <button class="inc" data-testid="shadow-increment">+</button>
        </div>
      \`;
      shadow.querySelector('.inc').addEventListener('click', () => this._update(this._count + 1));
      shadow.querySelector('.dec').addEventListener('click', () => this._update(this._count - 1));
      shadow.querySelector('.reset').addEventListener('click', () => this._update(0));
    }
    _update(val) {
      this._count = val;
      this.shadowRoot.querySelector('.count').textContent = val;
      this.dispatchEvent(new CustomEvent('countchange', { detail: val, bubbles: true }));
    }
  }
  customElements.define('cav-counter', CavCounter);
}

if (!customElements.get('cav-login-widget')) {
  class CavLoginWidget extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = \`
        <style>
          :host { display: block; font-family: sans-serif; }
          .wrap { background: #faf5ff; border: 2px solid #e9d5ff; border-radius: 12px; padding: 20px; }
          label { display: block; font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 4px; }
          input { width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 10px; font-size: 14px; margin-bottom: 12px; box-sizing: border-box; }
          input:focus { outline: 2px solid #7c3aed; border-color: transparent; }
          button { width: 100%; background: #7c3aed; color: white; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
          button:hover { background: #6d28d9; }
          #msg { margin-top: 10px; font-size: 13px; text-align: center; font-weight: 600; }
          p.label { font-size: 12px; color: #6b7280; text-align: center; margin: 0 0 16px; }
        </style>
        <div class="wrap">
          <p class="label">Shadow DOM Login Widget (mode: open)</p>
          <label for="sw-email">Email</label>
          <input id="sw-email" type="email" data-testid="shadow-email" placeholder="test@example.com" />
          <label for="sw-pass">Password</label>
          <input id="sw-pass" type="password" data-testid="shadow-password" placeholder="••••••••" />
          <button data-testid="shadow-login-btn">Sign In</button>
          <div id="msg" data-testid="shadow-login-msg"></div>
        </div>
      \`;
      shadow.querySelector('button').addEventListener('click', () => {
        const email = shadow.querySelector('#sw-email').value;
        const pass = shadow.querySelector('#sw-pass').value;
        const msg = shadow.querySelector('#msg');
        if (email === 'shadow@test.com' && pass === 'shadow123') {
          msg.style.color = '#16a34a'; msg.textContent = '✓ Shadow login successful!';
        } else {
          msg.style.color = '#dc2626'; msg.textContent = '✗ Invalid credentials';
        }
        this.dispatchEvent(new CustomEvent('logintry', { detail: { email, success: email === 'shadow@test.com' && pass === 'shadow123' }, bubbles: true }));
      });
    }
  }
  customElements.define('cav-login-widget', CavLoginWidget);
}

if (!customElements.get('cav-closed-widget')) {
  class CavClosedWidget extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'closed' });
      shadow.innerHTML = \`
        <style>
          :host { display: block; }
          .wrap { background: #fff1f2; border: 2px dashed #fecdd3; border-radius: 12px; padding: 16px; font-family: sans-serif; }
          p { color: #be123c; font-size: 13px; }
          button { background: #be123c; color: white; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-size: 13px; }
          #result { margin-top: 8px; font-weight: bold; }
        </style>
        <div class="wrap">
          <p><strong>Closed Shadow DOM (mode: closed)</strong><br>This shadow root is inaccessible via JavaScript. You cannot pierce it with shadowRoot.</p>
          <button onclick="this.getRootNode().querySelector('#closed-result').textContent='Button clicked! (but you cannot target this via automation)'">Try Click Me</button>
          <div id="closed-result"></div>
        </div>
      \`;
    }
  }
  customElements.define('cav-closed-widget', CavClosedWidget);
}
`;

export default function ShadowDomPage() {
  const [counterVal, setCounterVal] = useState<number | null>(null);
  const [loginEvent, setLoginEvent] = useState<{ email: string; success: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (scriptInjected.current) return;
    scriptInjected.current = true;
    const script = document.createElement('script');
    script.textContent = COMPONENT_SCRIPT;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onCount = (e: Event) => setCounterVal((e as CustomEvent).detail);
    const onLogin = (e: Event) => setLoginEvent((e as CustomEvent).detail);
    el.addEventListener('countchange', onCount);
    el.addEventListener('logintry', onLogin);
    return () => { el.removeEventListener('countchange', onCount); el.removeEventListener('logintry', onLogin); };
  }, []);

  const playwrightCode = `// Playwright — pierce shadow DOM with locator
// Playwright auto-pierces shadow DOM for CSS selectors!
await page.locator('[data-testid="shadow-increment"]').click();
await expect(page.locator('[data-testid="shadow-count"]')).toHaveText('1');

// For login widget:
await page.locator('[data-testid="shadow-email"]').fill('shadow@test.com');
await page.locator('[data-testid="shadow-password"]').fill('shadow123');
await page.locator('[data-testid="shadow-login-btn"]').click();
await expect(page.locator('[data-testid="shadow-login-msg"]')).toContainText('successful');`;

  const seleniumCode = `// Selenium — JavaScript executor to pierce shadow DOM
WebElement counter = (WebElement) ((JavascriptExecutor) driver)
  .executeScript("return document.querySelector('cav-counter').shadowRoot.querySelector('[data-testid=\"shadow-count\"]')");
System.out.println("Count: " + counter.getText());

// Click increment:
((JavascriptExecutor) driver).executeScript(
  "document.querySelector('cav-counter').shadowRoot.querySelector('[data-testid=\"shadow-increment\"]').click()"
);`;

  const cypressCode = `// Cypress — shadow() command
cy.get('cav-counter')
  .shadow()
  .find('[data-testid="shadow-increment"]')
  .click();

cy.get('cav-counter')
  .shadow()
  .find('[data-testid="shadow-count"]')
  .should('have.text', '1');`;

  return (
    <PageLayout
      title="Shadow DOM"
      description="Custom web components with open and closed shadow roots. Practice piercing shadow DOM."
      difficulty="advanced"
      testId="shadow-dom-page"
    >
      <div className="max-w-4xl mx-auto space-y-6" ref={containerRef}>
        <div className="card p-4" data-testid="shadow-dom-info">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Custom elements below use <strong>Shadow DOM</strong>. Their internals are encapsulated — standard CSS selectors and JavaScript cannot reach inside unless you use special techniques. The open shadow root <em>can</em> be pierced; the closed one cannot.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Counter web component */}
          <div className="card p-5" data-testid="section-shadow-counter">
            <h2 className="section-header text-base">Open Shadow: Counter</h2>
            <p className="section-sub text-xs">
              Host: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">cav-counter</code> — mode: open
            </p>
            {/* @ts-ignore */}
            <cav-counter data-testid="shadow-counter-host" class="block" />
            {counterVal !== null && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-mono" data-testid="shadow-counter-event-value">
                Latest countchange event: <strong>{counterVal}</strong>
              </p>
            )}
          </div>

          {/* Login web component */}
          <div className="card p-5" data-testid="section-shadow-login">
            <h2 className="section-header text-base">Open Shadow: Login Widget</h2>
            <p className="section-sub text-xs">
              Credentials: <code className="font-mono">shadow@test.com</code> / <code className="font-mono">shadow123</code>
            </p>
            {/* @ts-ignore */}
            <cav-login-widget data-testid="shadow-login-host" class="block" />
            {loginEvent && (
              <p className={`text-xs mt-2 font-mono ${loginEvent.success ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`} data-testid="shadow-login-event">
                logintry event: {loginEvent.success ? '✓ success' : '✗ failed'} for {loginEvent.email}
              </p>
            )}
          </div>
        </div>

        {/* Closed shadow */}
        <div className="card p-5" data-testid="section-shadow-closed">
          <h2 className="section-header text-base">Closed Shadow DOM</h2>
          <p className="section-sub text-xs">mode: closed — JavaScript cannot access shadowRoot. Even Playwright cannot auto-pierce this.</p>
          {/* @ts-ignore */}
          <cav-closed-widget data-testid="shadow-closed-host" class="block" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Note: For automation, always prefer <code className="font-mono">mode: "open"</code> web components — they're testable. Closed is an anti-pattern for testability.
          </p>
        </div>

        {/* Code examples */}
        <div className="card overflow-hidden" data-testid="shadow-dom-code">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">How to Automate Shadow DOM</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { label: 'Playwright (TypeScript)', code: playwrightCode, color: 'text-green-400' },
              { label: 'Selenium (Java)', code: seleniumCode, color: 'text-orange-400' },
              { label: 'Cypress (JavaScript)', code: cypressCode, color: 'text-cyan-400' },
            ].map((ex) => (
              <div key={ex.label} data-testid={`shadow-code-${ex.label.split(' ')[0].toLowerCase()}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
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
