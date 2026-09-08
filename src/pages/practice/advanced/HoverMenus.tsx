import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface MenuItem { label: string; href?: string; testId: string; children?: MenuItem[]; disabled?: boolean; }

const NAV_ITEMS: MenuItem[] = [
  {
    label: 'Products', testId: 'nav-products', children: [
      { label: 'Web Testing', testId: 'nav-web-testing', children: [
        { label: 'Selenium', testId: 'nav-selenium' },
        { label: 'Playwright', testId: 'nav-playwright' },
        { label: 'Cypress', testId: 'nav-cypress' },
      ]},
      { label: 'API Testing', testId: 'nav-api-testing', children: [
        { label: 'REST Assured', testId: 'nav-rest-assured' },
        { label: 'Postman', testId: 'nav-postman' },
        { label: 'k6', testId: 'nav-k6' },
      ]},
      { label: 'Mobile Testing (disabled)', testId: 'nav-mobile', disabled: true },
      { label: 'Performance Testing', testId: 'nav-performance' },
    ],
  },
  {
    label: 'Solutions', testId: 'nav-solutions', children: [
      { label: 'Enterprise', testId: 'nav-enterprise' },
      { label: 'Startups', testId: 'nav-startups' },
      { label: 'Open Source', testId: 'nav-open-source', children: [
        { label: 'GitHub Actions', testId: 'nav-github-actions' },
        { label: 'CircleCI', testId: 'nav-circleci' },
      ]},
    ],
  },
  {
    label: 'Resources', testId: 'nav-resources', children: [
      { label: 'Documentation', testId: 'nav-docs' },
      { label: 'Blog', testId: 'nav-blog' },
      { label: 'Community', testId: 'nav-community' },
      { label: 'Changelog', testId: 'nav-changelog' },
    ],
  },
  { label: 'Pricing', testId: 'nav-pricing' },
  { label: 'Contact', testId: 'nav-contact' },
];

interface SubMenuProps { items: MenuItem[]; depth?: number; onSelect: (label: string) => void; }

function SubMenu({ items, depth = 0, onSelect }: SubMenuProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenIdx(idx);
  };
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpenIdx(null), 150);
  };
  const keepOpen = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

  return (
    <div className={`absolute ${depth === 0 ? 'top-full left-0 mt-1' : 'left-full top-0 ml-0.5'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl min-w-48 py-1 z-50 animate-fade-in`}
      data-testid={`submenu-depth-${depth}`}
      onMouseEnter={keepOpen} onMouseLeave={leave}>
      {items.map((item, idx) => (
        <div key={item.testId} className="relative" onMouseEnter={() => item.children && enter(idx)} onMouseLeave={leave}>
          <button
            className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors text-left ${
              item.disabled ? 'opacity-40 cursor-not-allowed text-gray-400' :
              'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/50 hover:text-blue-700 dark:hover:text-blue-400'
            } ${openIdx === idx ? 'bg-blue-50 dark:bg-gray-700/50 text-blue-700 dark:text-blue-400' : ''}`}
            data-testid={item.testId}
            data-depth={depth}
            data-has-children={!!item.children}
            disabled={item.disabled}
            onClick={() => { if (!item.children && !item.disabled) { onSelect(item.label); } }}
            aria-haspopup={item.children ? 'true' : undefined}
            aria-expanded={item.children ? openIdx === idx : undefined}
          >
            <span>{item.label}</span>
            {item.children && <ChevronRight size={14} className="ml-2 shrink-0" />}
          </button>
          {item.children && openIdx === idx && (
            <SubMenu items={item.children} depth={depth + 1} onSelect={onSelect} />
          )}
        </div>
      ))}
    </div>
  );
}

function NavItem({ item, onSelect }: { item: MenuItem; onSelect: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const leave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 200); };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          open ? 'bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-400' :
          'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        data-testid={item.testId + '-trigger'}
        aria-haspopup={item.children ? 'true' : undefined}
        aria-expanded={item.children ? open : undefined}
        onClick={() => { if (!item.children) onSelect(item.label); }}
      >
        {item.label}
        {item.children && <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {item.children && open && (
        <SubMenu items={item.children} depth={0} onSelect={(label) => { onSelect(label); setOpen(false); }} />
      )}
    </div>
  );
}

export default function HoverMenusPage() {
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const [hoverLog, setHoverLog] = useState<string[]>([]);

  const handleSelect = (label: string) => {
    setLastSelected(label);
    setHoverLog((l) => [`${new Date().toLocaleTimeString()} — "${label}" selected`, ...l].slice(0, 10));
    console.log('[ClickAndVerify] Hover menu item selected:', label);
  };

  return (
    <PageLayout
      title="Hover Menus & Sub-menus"
      description="Multi-level navigation triggered by hover. Practice moveToElement() and hover actions."
      difficulty="advanced"
      testId="hover-menus-page"
      onReset={() => { setLastSelected(null); setHoverLog([]); }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card p-4" data-testid="hover-note">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hover over nav items to reveal submenus. Submenus have a short delay before closing so you can move the mouse into them. Items marked "disabled" cannot be clicked.
          </p>
        </div>

        {/* Main nav */}
        <div className="card p-4" data-testid="hover-nav-container">
          <p className="text-xs text-gray-400 mb-3 font-mono">data-testid: hover-navbar</p>
          <nav className="flex items-center gap-1 flex-wrap relative z-10" data-testid="hover-navbar" aria-label="Hover navigation">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.testId} item={item} onSelect={handleSelect} />
            ))}
          </nav>
          {lastSelected && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm" data-testid="hover-selected-item">
              Last selected: <span className="font-semibold text-green-700 dark:text-green-400" data-testid="hover-selected-value">{lastSelected}</span>
            </div>
          )}
        </div>

        {/* Interaction log */}
        {hoverLog.length > 0 && (
          <div className="card p-4" data-testid="hover-log">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Selection Log</h3>
            <ul className="space-y-1">
              {hoverLog.map((entry, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 font-mono" data-testid={`hover-log-entry-${i}`}>{entry}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Code examples */}
        <div className="card overflow-hidden" data-testid="hover-code-examples">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">How to Automate Hover Menus</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[{
              label: 'Playwright', color: 'text-green-400',
              code: `// Hover to open, then click submenu item
await page.getByTestId('nav-products-trigger').hover();
await page.getByTestId('nav-web-testing').hover();  // hover submenu item with children
await page.getByTestId('nav-playwright').click();   // final leaf item
expect(lastSelected).toBe('Playwright');`,
            }, {
              label: 'Selenium (Java)', color: 'text-orange-400',
              code: `Actions actions = new Actions(driver);
WebElement products = driver.findElement(By.cssSelector("[data-testid='nav-products-trigger']"));
WebElement webTesting = driver.findElement(By.cssSelector("[data-testid='nav-web-testing']"));
WebElement playwright = driver.findElement(By.cssSelector("[data-testid='nav-playwright']"));

actions.moveToElement(products).perform();
Thread.sleep(300);
actions.moveToElement(webTesting).perform();
Thread.sleep(300);
actions.moveToElement(playwright).click().perform();`,
            }, {
              label: 'Cypress', color: 'text-cyan-400',
              code: `cy.get('[data-testid="nav-products-trigger"]').trigger('mouseover');
cy.get('[data-testid="nav-web-testing"]').trigger('mouseover');
cy.get('[data-testid="nav-playwright"]').click();
cy.get('[data-testid="hover-selected-value"]').should('have.text', 'Playwright');`,
            }].map((ex) => (
              <div key={ex.label} data-testid={`hover-code-${ex.label.split(' ')[0].toLowerCase()}`}>
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
