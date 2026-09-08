import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Terminal, Zap, Code, Globe } from 'lucide-react';

const learningPath = [
  {
    step: 1,
    level: 'Beginner',
    color: 'bg-green-500',
    modules: ['Login Form', 'Form Controls', 'Registration', 'Static Table', 'Button States'],
    skills: ['Basic CSS selectors', 'XPath basics', 'Form interactions', 'Assertions on text/state'],
    tools: ['Selenium WebDriver', 'Playwright', 'Cypress'],
  },
  {
    step: 2,
    level: 'Intermediate',
    color: 'bg-yellow-500',
    modules: ['Multi-Step Form', 'Custom Dropdown', 'Date Picker', 'File Upload', 'Modals & Toasts'],
    skills: ['Explicit waits', 'Dynamic element strategies', 'Keyboard interactions', 'Screenshot on failure'],
    tools: ['All above + TestNG/JUnit', 'Page Object Model'],
  },
  {
    step: 3,
    level: 'Advanced',
    color: 'bg-orange-500',
    modules: ['Dynamic IDs', 'Nested iFrames', 'Shadow DOM', 'Async Loading', 'Flaky Elements'],
    skills: ['iframe context switching', 'Shadow DOM piercing', 'Retry logic', 'Custom wait conditions'],
    tools: ['All above + REST Assured', 'Playwright CDP'],
  },
  {
    step: 4,
    level: 'Expert',
    color: 'bg-red-500',
    modules: ['Auth Flow', 'API Playground', 'Checkout Flow', 'Accessibility', 'Canvas/SVG'],
    skills: ['JWT auth testing', 'API chaining', 'E2E flow design', 'axe-core integration', 'Visual regression'],
    tools: ['All above + Postman/Newman', 'axe-core', 'Percy/Applitools'],
  },
];

const tools = [
  { name: 'Selenium', logo: '🌐', desc: 'Java/Python/JS WebDriver. Use stable data-testid locators via CSS or XPath.' },
  { name: 'Playwright', logo: '🎭', desc: 'getByTestId(), locator(), and evaluate() for shadow DOM. Auto-waits built in.' },
  { name: 'Cypress', logo: '🌲', desc: 'cy.get("[data-testid=…]"), cy.intercept() for API mocking, cy.origin() for cross-domain.' },
  { name: 'REST Assured', logo: '☕', desc: 'Hit /api/* endpoints. Practice given().when().then() for all HTTP verbs.' },
  { name: 'Postman', logo: '📮', desc: 'Import the OpenAPI spec from /api/docs. Run Newman for CI integration.' },
];

export default function GettingStarted() {
  return (
    <div className="min-h-screen" data-testid="getting-started-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-3" data-testid="gs-title">Getting Started</h1>
          <p className="text-blue-100 text-lg" data-testid="gs-subtitle">
            Your roadmap from zero to automation expert — with ClickAndVerify as your practice ground.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* What is this */}
        <section data-testid="gs-intro">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What is ClickAndVerify?</h2>
          <div className="card p-6 space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            <p>
              ClickAndVerify is a fully interactive practice sandbox built <em>specifically</em> for automation testers.
              Unlike random websites, every element here is designed to be tested — with predictable{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-blue-600 dark:text-blue-400">data-testid</code>{' '}
              attributes, reset buttons for repeatability, and intentional traps for advanced learners.
            </p>
            <p>
              The backend is a real Express/Node.js REST API with JWT auth, rate limiting, chaos endpoints,
              and WebSocket support — so you can practice API testing too, not just UI automation.
            </p>
            <p>
              Use the <strong>Element Inspector</strong> toggle in the navbar to reveal all{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-blue-600 dark:text-blue-400">data-testid</code>{' '}
              values directly on screen — great for beginners learning locator strategies.
            </p>
          </div>
        </section>

        {/* Key features */}
        <section data-testid="gs-features">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <CheckCircle size={16} className="text-green-500" />, title: 'Stable Locators', desc: 'Every element has data-testid, name, and semantic HTML. Beginners start here.' },
              { icon: <Zap size={16} className="text-yellow-500" />, title: 'Tricky Edge Cases', desc: 'Dynamic IDs, shadow DOM, iframes, flaky elements — advanced traps throughout.' },
              { icon: <Terminal size={16} className="text-blue-500" />, title: 'REST API Backend', desc: 'Full CRUD API at /api/* with auth, pagination, rate limiting, and chaos modes.' },
              { icon: <Code size={16} className="text-purple-500" />, title: 'Reset per Module', desc: 'Each module has a Reset button — perfect for repeatable automated test runs.' },
              { icon: <Globe size={16} className="text-orange-500" />, title: 'Dark Mode', desc: 'Toggle dark/light mode — practice theme-dependent assertions and visual testing.' },
              { icon: <CheckCircle size={16} className="text-indigo-500" />, title: 'Console Logging', desc: 'Key actions are logged to the browser console. Useful for debugging test runs.' },
            ].map((f) => (
              <div key={f.title} className="card p-4 flex gap-3" data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="mt-0.5 shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported tools */}
        <section data-testid="gs-tools">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Supported Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div key={tool.name} className="card p-4" data-testid={`tool-${tool.name.toLowerCase()}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{tool.logo}</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{tool.name}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Path */}
        <section data-testid="gs-learning-path">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Suggested Learning Path</h2>
          <div className="space-y-6">
            {learningPath.map((stage, idx) => (
              <div
                key={stage.level}
                className="card p-6 relative overflow-hidden"
                data-testid={`learning-stage-${stage.step}`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${stage.color}`} />
                <div className="ml-3">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full ${stage.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                      {stage.step}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{stage.level}</h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Modules</p>
                      <ul className="space-y-1">
                        {stage.modules.map((m) => (
                          <li key={m} className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <ArrowRight size={10} className="text-gray-400 shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Skills Practiced</p>
                      <ul className="space-y-1">
                        {stage.skills.map((s) => (
                          <li key={s} className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <CheckCircle size={10} className="text-green-500 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tools</p>
                      <ul className="space-y-1">
                        {stage.tools.map((t) => (
                          <li key={t} className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-xs">
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{t}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick start code */}
        <section data-testid="gs-quickstart">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Start Examples</h2>
          <div className="space-y-4">
            <div className="card overflow-hidden" data-testid="quickstart-playwright">
              <div className="bg-gray-800 text-gray-200 px-4 py-2 text-xs font-mono flex items-center justify-between">
                <span>Playwright — Login Test</span>
                <span className="text-gray-500">TypeScript</span>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
{`import { test, expect } from '@playwright/test';

test('login with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:5173/practice/login');
  
  await page.getByTestId('login-email').fill('admin@test.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();
  
  await expect(page.getByTestId('login-success-msg')).toBeVisible();
});`}
              </pre>
            </div>
            <div className="card overflow-hidden" data-testid="quickstart-cypress">
              <div className="bg-gray-800 text-gray-200 px-4 py-2 text-xs font-mono flex items-center justify-between">
                <span>Cypress — Login Test</span>
                <span className="text-gray-500">JavaScript</span>
              </div>
              <pre className="bg-gray-900 text-cyan-400 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
{`describe('Login Form', () => {
  it('shows error for invalid credentials', () => {
    cy.visit('/practice/login');
    cy.get('[data-testid="login-email"]').type('bad@email.com');
    cy.get('[data-testid="login-password"]').type('wrongpass');
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="login-error"]').should('be.visible')
      .and('contain', 'Invalid');
  });
});`}
              </pre>
            </div>
            <div className="card overflow-hidden" data-testid="quickstart-api">
              <div className="bg-gray-800 text-gray-200 px-4 py-2 text-xs font-mono flex items-center justify-between">
                <span>REST Assured — API Test</span>
                <span className="text-gray-500">Java</span>
              </div>
              <pre className="bg-gray-900 text-yellow-400 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
{`given()
  .baseUri("http://localhost:4000")
  .header("Content-Type", "application/json")
  .body("{\\"email\\":\\"admin@test.com\\",\\"password\\":\\"password123\\"}")
.when()
  .post("/api/auth/login")
.then()
  .statusCode(200)
  .body("token", notNullValue())
  .body("user.role", equalTo("admin"));`}
              </pre>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-6" data-testid="gs-cta">
          <Link
            to="/"
            className="btn-primary text-base px-8 py-3"
            data-testid="gs-cta-modules"
          >
            Browse All Modules
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
