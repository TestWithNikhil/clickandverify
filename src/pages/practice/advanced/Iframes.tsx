import { useEffect, useRef } from 'react';
import PageLayout from '../../../components/layout/PageLayout';

// We generate the iframe HTML as blob URLs so no external dependencies are needed
function makeLevel3Html() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: sans-serif; padding: 16px; background: #f0fdf4; }
  input { border: 1px solid #ccc; border-radius: 6px; padding: 6px 10px; width: 200px; }
  button { background: #16a34a; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; margin-left: 8px; }
  button:hover { background: #15803d; }
  #result { margin-top: 12px; color: #15803d; font-weight: bold; }
</style></head>
<body>
  <p><strong>Level 3 (deepest iframe)</strong></p>
  <p>data-testid values work inside iframes!</p>
  <label for="deep-input">Deep Input:</label><br>
  <input id="deep-input" data-testid="iframe-l3-input" placeholder="Type here…" />
  <button id="deep-btn" data-testid="iframe-l3-btn" onclick="document.getElementById('result').textContent='L3 button clicked: '+document.getElementById('deep-input').value">Submit</button>
  <div id="result" data-testid="iframe-l3-result"></div>
  <p style="font-size:11px;color:#666;margin-top:12px;">Locator: <code>[data-testid="iframe-l3-input"]</code></p>
</body></html>`;
}

function makeLevel2Html(l3Src: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: sans-serif; padding: 16px; background: #eff6ff; }
  select { border: 1px solid #ccc; border-radius: 6px; padding: 6px 10px; }
  label { display: block; margin-bottom: 4px; font-size: 14px; }
  #selected-val { margin-top: 8px; font-weight: bold; color: #2563eb; }
  iframe { margin-top: 16px; border: 2px solid #93c5fd; border-radius: 8px; width: 100%; }
</style></head>
<body>
  <p><strong>Level 2 iframe</strong></p>
  <label for="l2-select">Select option:</label>
  <select id="l2-select" data-testid="iframe-l2-select" onchange="document.getElementById('selected-val').textContent=this.value">
    <option value="">Choose…</option>
    <option value="alpha">Alpha</option>
    <option value="beta">Beta</option>
    <option value="gamma">Gamma</option>
  </select>
  <div id="selected-val" data-testid="iframe-l2-selected"></div>
  <iframe src="${l3Src}" data-testid="iframe-level-3" width="100%" height="160" title="Level 3 iframe"></iframe>
</body></html>`;
}

function makeLevel1Html(l2Src: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: sans-serif; padding: 16px; background: #fef9c3; }
  .row { display: flex; gap: 8px; margin-bottom: 8px; }
  input[type=checkbox] { width: 16px; height: 16px; }
  label { font-size: 14px; }
  button { background: #ca8a04; color: white; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; margin-top: 8px; }
  #l1-result { margin-top: 8px; color: #ca8a04; font-weight: bold; }
  iframe { margin-top: 16px; border: 2px solid #fcd34d; border-radius: 8px; width: 100%; }
</style></head>
<body>
  <p><strong>Level 1 iframe</strong></p>
  <div class="row"><input type="checkbox" id="l1-cb1" data-testid="iframe-l1-checkbox-a"><label for="l1-cb1">Option A</label></div>
  <div class="row"><input type="checkbox" id="l1-cb2" data-testid="iframe-l1-checkbox-b"><label for="l1-cb2">Option B</label></div>
  <div class="row"><input type="checkbox" id="l1-cb3" data-testid="iframe-l1-checkbox-c"><label for="l1-cb3">Option C</label></div>
  <button data-testid="iframe-l1-btn" onclick="var checked=[...document.querySelectorAll('input:checked')].map(e=>e.nextElementSibling.textContent).join(', ');document.getElementById('l1-result').textContent='Selected: '+checked">Get Selected</button>
  <div id="l1-result" data-testid="iframe-l1-result"></div>
  <iframe src="${l2Src}" data-testid="iframe-level-2" width="100%" height="300" title="Level 2 iframe"></iframe>
</body></html>`;
}

function blobUrl(html: string) {
  const blob = new Blob([html], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

export default function IframesPage() {
  const l3Url = useRef(blobUrl(makeLevel3Html()));
  const l2Url = useRef(blobUrl(makeLevel2Html(l3Url.current)));
  const l1Url = useRef(blobUrl(makeLevel1Html(l2Url.current)));

  useEffect(() => {
    const l3 = l3Url.current; const l2 = l2Url.current; const l1 = l1Url.current;
    return () => { URL.revokeObjectURL(l3); URL.revokeObjectURL(l2); URL.revokeObjectURL(l1); };
  }, []);

  const seleniumCode = `// Selenium Java — switch to nested iframes
WebDriver driver = new ChromeDriver();
driver.get("http://localhost:5173/practice/iframes");

// Switch into Level 1
driver.switchTo().frame(driver.findElement(By.cssSelector("[data-testid='iframe-level-1']")));

// Switch into Level 2 within Level 1
driver.switchTo().frame(driver.findElement(By.cssSelector("[data-testid='iframe-level-2']")));

// Switch into Level 3 within Level 2
driver.switchTo().frame(driver.findElement(By.cssSelector("[data-testid='iframe-level-3']")));

// Now interact with Level 3 elements
driver.findElement(By.cssSelector("[data-testid='iframe-l3-input']")).sendKeys("Hello from L3!");
driver.findElement(By.cssSelector("[data-testid='iframe-l3-btn']")).click();

// Switch back to default
driver.switchTo().defaultContent();`;

  const playwrightCode = `// Playwright — frameLocator chaining
const l1 = page.frameLocator('[data-testid="iframe-level-1"]');
const l2 = l1.frameLocator('[data-testid="iframe-level-2"]');
const l3 = l2.frameLocator('[data-testid="iframe-level-3"]');

await l3.getByTestId('iframe-l3-input').fill('Hello from L3!');
await l3.getByTestId('iframe-l3-btn').click();
await expect(l3.getByTestId('iframe-l3-result')).toContainText('Hello from L3!');`;

  const cypressCode = `// Cypress — cy.iframe() (cypress-iframe plugin)
cy.get('[data-testid="iframe-level-1"]')
  .its('0.contentDocument.body')
  .find('[data-testid="iframe-l1-checkbox-a"]')
  .check();

// For deep nesting, use iframe().iframe() chaining
cy.iframe('[data-testid="iframe-level-1"]')
  .iframe('[data-testid="iframe-level-2"]')
  .find('[data-testid="iframe-l2-select"]')
  .select('beta');`;

  return (
    <PageLayout
      title="Nested iFrames"
      description="3 levels of nested iframes with interactive content. Practice context switching."
      difficulty="advanced"
      testId="iframes-page"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card p-5" data-testid="iframes-structure-info">
          <h2 className="section-header">iframe Structure</h2>
          <div className="flex items-start gap-3 text-sm font-mono bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <p>📄 <span className="text-blue-600 dark:text-blue-400">Main page</span> (this page)</p>
              <p className="ml-4">└─ 🖼 <span className="text-yellow-600 dark:text-yellow-400">iframe-level-1</span> — checkboxes + "Get Selected" button</p>
              <p className="ml-12">└─ 🖼 <span className="text-blue-600 dark:text-blue-400">iframe-level-2</span> — custom dropdown select</p>
              <p className="ml-20">└─ 🖼 <span className="text-green-600 dark:text-green-400">iframe-level-3</span> — text input + submit button</p>
            </div>
          </div>
        </div>

        {/* The actual nested iframe */}
        <div className="card p-5" data-testid="iframes-container">
          <h2 className="section-header mb-4">Live Nested Iframe (3 levels)</h2>
          <iframe
            src={l1Url.current}
            data-testid="iframe-level-1"
            title="Level 1 iframe"
            className="w-full border-2 border-yellow-300 dark:border-yellow-700 rounded-xl bg-white"
            style={{ height: 520 }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        {/* Code examples */}
        <div className="card overflow-hidden" data-testid="iframes-code-examples">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Automation Code Examples</h2>
          </div>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { label: 'Selenium (Java)', lang: 'Java', code: seleniumCode, color: 'text-orange-400' },
              { label: 'Playwright (TypeScript)', lang: 'TypeScript', code: playwrightCode, color: 'text-green-400' },
              { label: 'Cypress (JavaScript)', lang: 'JavaScript', code: cypressCode, color: 'text-cyan-400' },
            ].map((ex) => (
              <div key={ex.label} data-testid={`iframe-code-${ex.label.split(' ')[0].toLowerCase()}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <span className="text-gray-300 text-xs font-mono">{ex.label}</span>
                  <span className="text-gray-500 text-xs">{ex.lang}</span>
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
