import { useState } from 'react';
import { Search, Copy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestId { testId: string; element: string; module: string; path: string; difficulty: string; notes: string; }

const ALL_TESTIDS: TestId[] = [
  // Layout
  { testId: 'navbar', element: 'header', module: 'Navbar', path: '/', difficulty: 'all', notes: 'Main site header' },
  { testId: 'navbar-logo', element: 'a', module: 'Navbar', path: '/', difficulty: 'all', notes: 'Logo link → navigates to /' },
  { testId: 'navbar-nav', element: 'nav', module: 'Navbar', path: '/', difficulty: 'all', notes: 'Desktop nav container' },
  { testId: 'theme-toggle', element: 'button', module: 'Navbar', path: '/', difficulty: 'all', notes: 'Toggles light/dark mode. aria-label changes.' },
  { testId: 'inspector-toggle', element: 'button', module: 'Navbar', path: '/', difficulty: 'all', notes: 'aria-pressed=true when inspector is ON' },
  { testId: 'mobile-menu-toggle', element: 'button', module: 'Navbar', path: '/', difficulty: 'all', notes: 'Visible on mobile only' },
  // Homepage
  { testId: 'homepage', element: 'div', module: 'Home', path: '/', difficulty: 'all', notes: 'Root of home page' },
  { testId: 'hero-title', element: 'h1', module: 'Home', path: '/', difficulty: 'all', notes: 'Contains "Practice. Automate. Verify."' },
  { testId: 'module-search', element: 'input', module: 'Home', path: '/', difficulty: 'all', notes: 'Search modules by name or tag' },
  { testId: 'difficulty-filter', element: 'div', module: 'Home', path: '/', difficulty: 'all', notes: 'Group of filter buttons' },
  { testId: 'filter-all', element: 'button', module: 'Home', path: '/', difficulty: 'all', notes: 'aria-pressed=true when active' },
  { testId: 'filter-beginner', element: 'button', module: 'Home', path: '/', difficulty: 'all', notes: 'aria-pressed=true when active' },
  { testId: 'section-beginner', element: 'section', module: 'Home', path: '/', difficulty: 'all', notes: 'Beginner modules group' },
  { testId: 'module-card-login', element: 'a', module: 'Home', path: '/', difficulty: 'all', notes: 'Card link to /practice/login' },
  // Login
  { testId: 'login-page', element: 'div', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Root container' },
  { testId: 'login-form', element: 'form', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'aria-label="Login form"' },
  { testId: 'login-email', element: 'input[type=email]', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Email field' },
  { testId: 'login-password', element: 'input[type=password]', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Password field' },
  { testId: 'login-toggle-password', element: 'button', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Toggles input type text↔password' },
  { testId: 'login-remember-me', element: 'input[type=checkbox]', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Remember me checkbox' },
  { testId: 'login-submit', element: 'button[type=submit]', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'aria-busy=true while loading (~1.2s)' },
  { testId: 'login-error', element: 'div', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'role=alert, appears on invalid credentials' },
  { testId: 'login-success-msg', element: 'h2', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'Contains "Welcome, {name}!" after success' },
  { testId: 'logged-in-role', element: 'span', module: 'Login', path: '/practice/login', difficulty: 'beginner', notes: 'badge showing "admin" or "user"' },
  // Form Controls
  { testId: 'fc-text-input', element: 'input[type=text]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Basic text input' },
  { testId: 'fc-number-input', element: 'input[type=number]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Number input, min=0 max=999' },
  { testId: 'fc-email-input', element: 'input[type=email]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: '' },
  { testId: 'fc-range-input', element: 'input[type=range]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Min 0, max 100, step 5' },
  { testId: 'fc-range-value', element: 'span', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Live numeric display of range value' },
  { testId: 'fc-checkbox-notifications', element: 'input[type=checkbox]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: '' },
  { testId: 'fc-radio-color-red', element: 'input[type=radio]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'name=color value=red' },
  { testId: 'fc-select-fruit', element: 'select', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Single select' },
  { testId: 'fc-select-multi', element: 'select[multiple]', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Multi-select, Ctrl+click for multi' },
  { testId: 'fc-submit', element: 'button', module: 'FormControls', path: '/practice/form-controls', difficulty: 'beginner', notes: 'Shows submitted JSON below' },
  // Registration
  { testId: 'registration-form', element: 'form', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: '' },
  { testId: 'reg-firstName', element: 'input', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: 'Required, min 2 chars' },
  { testId: 'reg-password', element: 'input[type=password]', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: '8+ chars, 1 uppercase, 1 number' },
  { testId: 'reg-password-strength', element: 'div', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: 'Visible when password is non-empty' },
  { testId: 'reg-strength-label', element: 'p', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: 'Text: Weak|Fair|Good|Strong|Very Strong' },
  { testId: 'reg-terms-checkbox', element: 'input[type=checkbox]', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: 'Required to submit' },
  { testId: 'reg-submit', element: 'button', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: 'aria-busy=true while submitting' },
  { testId: 'reg-success-title', element: 'h2', module: 'Registration', path: '/practice/registration', difficulty: 'beginner', notes: '"Registration Complete!" after success' },
  // Table
  { testId: 'employee-table', element: 'table', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: 'aria-label="Employee table"' },
  { testId: 'table-search', element: 'input[type=search]', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: '' },
  { testId: 'table-header-name', element: 'th', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: 'aria-sort=ascending|descending|none' },
  { testId: 'table-row-1', element: 'tr', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: 'Row for employee id=1' },
  { testId: 'table-pagination', element: 'div', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: '' },
  { testId: 'table-page-next', element: 'button', module: 'Table', path: '/practice/table', difficulty: 'beginner', notes: 'disabled when on last page' },
  // Buttons
  { testId: 'btn-primary', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: '' },
  { testId: 'btn-disabled-primary', element: 'button[disabled]', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'disabled attribute present' },
  { testId: 'btn-save', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'data-state: idle|loading|success|error' },
  { testId: 'btn-delete', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'Fails ~30% of the time' },
  { testId: 'toggle-like', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'aria-pressed changes on click' },
  { testId: 'counter-votes-btn', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'Disabled when count reaches max (5)' },
  { testId: 'counter-votes-count', element: 'span', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'Text: "N / 5"' },
  { testId: 'btn-copy', element: 'button', module: 'Buttons', path: '/practice/buttons', difficulty: 'beginner', notes: 'data-copied=true after click' },
  // Multi-step form
  { testId: 'msf-step-indicator-1', element: 'button', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: 'data-state=active|completed|pending' },
  { testId: 'msf-current-step', element: 'span', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: 'Text: current step number' },
  { testId: 'msf-next-btn', element: 'button', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: 'Advances to next step after validation' },
  { testId: 'msf-back-btn', element: 'button', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: 'disabled on step 1' },
  { testId: 'msf-submit-btn', element: 'button', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: 'Only visible on step 4 (Review)' },
  { testId: 'msf-success-title', element: 'h2', module: 'MultiStepForm', path: '/practice/multi-step-form', difficulty: 'intermediate', notes: '"Order Confirmed!" after submit' },
  // Custom Dropdown
  { testId: 'dropdown-country-trigger', element: 'button', module: 'CustomDropdown', path: '/practice/custom-dropdown', difficulty: 'intermediate', notes: 'aria-haspopup=true, aria-expanded toggles' },
  { testId: 'dropdown-country-menu', element: 'div', module: 'CustomDropdown', path: '/practice/custom-dropdown', difficulty: 'intermediate', notes: 'Visible when dropdown is open' },
  { testId: 'dropdown-country-search', element: 'input', module: 'CustomDropdown', path: '/practice/custom-dropdown', difficulty: 'intermediate', notes: 'Type to filter options' },
  { testId: 'dropdown-country-option-us', element: 'li', module: 'CustomDropdown', path: '/practice/custom-dropdown', difficulty: 'intermediate', notes: 'aria-selected=true when selected' },
  { testId: 'dropdown-skills-tags', element: 'div', module: 'CustomDropdown', path: '/practice/custom-dropdown', difficulty: 'intermediate', notes: 'Container of selected skill tags' },
  // Drag Drop
  { testId: 'sortable-list', element: 'div', module: 'DragDrop', path: '/practice/drag-drop', difficulty: 'intermediate', notes: 'role=list, contains all drag items' },
  { testId: 'drag-item-t1', element: 'div', module: 'DragDrop', path: '/practice/drag-drop', difficulty: 'intermediate', notes: 'data-priority=high data-done=false' },
  { testId: 'drag-handle-t1', element: 'button', module: 'DragDrop', path: '/practice/drag-drop', difficulty: 'intermediate', notes: 'Grab this to drag' },
  { testId: 'drag-toggle-t1', element: 'button', module: 'DragDrop', path: '/practice/drag-drop', difficulty: 'intermediate', notes: 'aria-pressed=true when done' },
  { testId: 'order-id-1', element: 'span', module: 'DragDrop', path: '/practice/drag-drop', difficulty: 'intermediate', notes: 'Text = task ID currently at position 1' },
  // File Upload
  { testId: 'file-input-single', element: 'input[type=file]', module: 'FileUpload', path: '/practice/file-upload', difficulty: 'intermediate', notes: 'Hidden, triggered by btn-browse-single' },
  { testId: 'file-input-multi', element: 'input[type=file][multiple]', module: 'FileUpload', path: '/practice/file-upload', difficulty: 'intermediate', notes: 'multiple attribute present' },
  { testId: 'dropzone', element: 'div', module: 'FileUpload', path: '/practice/file-upload', difficulty: 'intermediate', notes: 'data-dragging=true when file is over it' },
  { testId: 'file-list', element: 'div', module: 'FileUpload', path: '/practice/file-upload', difficulty: 'intermediate', notes: 'Appears after first file is added' },
  // Modals
  { testId: 'btn-open-modal-info', element: 'button', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: '' },
  { testId: 'modal-info', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'role=dialog aria-modal=true' },
  { testId: 'modal-overlay-info', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'Click to close modal' },
  { testId: 'modal-close-info', element: 'button', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'X button inside modal' },
  { testId: 'toast-container', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'Fixed bottom-right container' },
  { testId: 'toast-success', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'role=alert, auto-dismisses in 4s' },
  { testId: 'tooltip-trigger-top', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'Hover to show tooltip' },
  { testId: 'tooltip-content-top', element: 'div', module: 'ModalsToasts', path: '/practice/modals-toasts', difficulty: 'intermediate', notes: 'role=tooltip, visible on hover' },
  // Advanced
  { testId: 'dynamic-btn-submit', element: 'button', module: 'DynamicIds', path: '/practice/dynamic-ids', difficulty: 'advanced', notes: 'id changes on reload, data-testid is stable' },
  { testId: 'btn-regenerate-ids', element: 'button', module: 'DynamicIds', path: '/practice/dynamic-ids', difficulty: 'advanced', notes: 'Forces ID regeneration' },
  { testId: 'floating-target-1', element: 'button', module: 'DynamicIds', path: '/practice/dynamic-ids', difficulty: 'advanced', notes: 'Positioned randomly in arena' },
  { testId: 'iframe-level-1', element: 'iframe', module: 'Iframes', path: '/practice/iframes', difficulty: 'advanced', notes: 'Contains level 2 iframe inside' },
  { testId: 'iframe-l3-input', element: 'input (in iframe)', module: 'Iframes', path: '/practice/iframes', difficulty: 'advanced', notes: 'In level 3 iframe — needs context switch' },
  { testId: 'shadow-counter-host', element: 'cav-counter', module: 'ShadowDom', path: '/practice/shadow-dom', difficulty: 'advanced', notes: 'Custom element host' },
  { testId: 'shadow-increment', element: 'button (in shadow)', module: 'ShadowDom', path: '/practice/shadow-dom', difficulty: 'advanced', notes: 'Inside open shadow root' },
  { testId: 'async-item-slow', element: 'div', module: 'AsyncLoading', path: '/practice/async-loading', difficulty: 'advanced', notes: 'data-status=waiting|loading|done|error' },
  { testId: 'btn-start-async', element: 'button', module: 'AsyncLoading', path: '/practice/async-loading', difficulty: 'advanced', notes: '' },
  { testId: 'hover-navbar', element: 'nav', module: 'HoverMenus', path: '/practice/hover-menus', difficulty: 'advanced', notes: 'Hover nav container' },
  { testId: 'nav-products-trigger', element: 'button', module: 'HoverMenus', path: '/practice/hover-menus', difficulty: 'advanced', notes: 'Hover to reveal submenu' },
  { testId: 'ws-status-dot', element: 'div', module: 'WebSocket', path: '/practice/websocket', difficulty: 'advanced', notes: 'Green pulse when connected' },
  { testId: 'ws-counter-value', element: 'div', module: 'WebSocket', path: '/practice/websocket', difficulty: 'advanced', notes: 'Increments every second when connected' },
  { testId: 'ws-message-list', element: 'div', module: 'WebSocket', path: '/practice/websocket', difficulty: 'advanced', notes: 'aria-live=polite, aria-label=Live feed messages' },
  { testId: 'flaky-btn-mild', element: 'button', module: 'FlakyElements', path: '/practice/flaky-elements', difficulty: 'advanced', notes: 'data-status=idle|loading|success|error, 20% fail rate' },
  { testId: 'flaky-btn-severe', element: 'button', module: 'FlakyElements', path: '/practice/flaky-elements', difficulty: 'advanced', notes: '70% fail rate — needs retry logic' },
  // Expert
  { testId: 'auth-signup-form', element: 'form', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: '' },
  { testId: 'auth-verify-input', element: 'input', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: 'Type 6-digit code. Hint shown on page.' },
  { testId: 'auth-login-submit', element: 'button', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: '' },
  { testId: 'auth-dashboard', element: 'div', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: 'Only visible after successful login' },
  { testId: 'auth-jwt-value', element: 'p', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: 'Contains current JWT token text' },
  { testId: 'auth-refresh-btn', element: 'button', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: '' },
  { testId: 'auth-logout-btn', element: 'button', module: 'AuthFlow', path: '/practice/auth-flow', difficulty: 'expert', notes: 'Resets to signup stage' },
  { testId: 'rbac-role-btn-admin', element: 'button', module: 'RBAC', path: '/practice/rbac', difficulty: 'expert', notes: 'aria-pressed=true when admin is active' },
  { testId: 'rbac-current-role', element: 'span.badge', module: 'RBAC', path: '/practice/rbac', difficulty: 'expert', notes: 'Text: guest|user|moderator|admin' },
  { testId: 'permission-denied-read-analytics', element: 'div', module: 'RBAC', path: '/practice/rbac', difficulty: 'expert', notes: 'Visible for non-admin roles' },
  { testId: 'checkout-cart', element: 'div', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: '' },
  { testId: 'cart-item-p1', element: 'div', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: '' },
  { testId: 'cart-inc-p1', element: 'button', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: 'Increases quantity' },
  { testId: 'checkout-promo-input', element: 'input', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: 'Try TEST20 or FREE' },
  { testId: 'summary-total', element: 'span', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: 'Live total including discounts' },
  { testId: 'confirmation-order-number', element: 'p', module: 'Checkout', path: '/practice/checkout', difficulty: 'expert', notes: 'e.g. ORD-12345' },
  { testId: 'drawing-canvas', element: 'canvas', module: 'Canvas', path: '/practice/canvas', difficulty: 'expert', notes: 'data-mode, data-color, data-size attributes' },
  { testId: 'canvas-x', element: 'span', module: 'Canvas', path: '/practice/canvas', difficulty: 'expert', notes: 'Live mouse X coordinate' },
  { testId: 'canvas-y', element: 'span', module: 'Canvas', path: '/practice/canvas', difficulty: 'expert', notes: 'Live mouse Y coordinate' },
  { testId: 'svg-bar-chart', element: 'svg', module: 'Canvas', path: '/practice/canvas', difficulty: 'expert', notes: 'role=img aria-label=Bar chart...' },
  { testId: 'bar-selenium', element: 'g (SVG)', module: 'Canvas', path: '/practice/canvas', difficulty: 'expert', notes: 'data-value=35 data-label=Selenium' },
  { testId: 'btn-open-new-tab', element: 'button', module: 'CrossWindow', path: '/practice/cross-window', difficulty: 'expert', notes: 'Opens new tab' },
  { testId: 'btn-open-popup', element: 'button', module: 'CrossWindow', path: '/practice/cross-window', difficulty: 'expert', notes: 'Opens popup window' },
  { testId: 'popup-received-message', element: 'span', module: 'CrossWindow', path: '/practice/cross-window', difficulty: 'expert', notes: 'Shows postMessage value from popup' },
  { testId: 'endpoint-get-users', element: 'div', module: 'ApiPlayground', path: '/practice/api-playground', difficulty: 'expert', notes: 'data-method=GET data-path=/api/users' },
  { testId: 'btn-try-get-users', element: 'button', module: 'ApiPlayground', path: '/practice/api-playground', difficulty: 'expert', notes: 'Sends HTTP request to backend' },
  { testId: 'response-status-get-users', element: 'span', module: 'ApiPlayground', path: '/practice/api-playground', difficulty: 'expert', notes: 'HTTP status code after response' },
];

const DIFF_COLORS: Record<string, string> = {
  all: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  beginner: 'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced: 'badge-advanced',
  expert: 'badge-expert',
};

export default function CheatSheetPage() {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = [...new Set(ALL_TESTIDS.map(t => t.module))].sort();

  const filtered = ALL_TESTIDS.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.testId.toLowerCase().includes(q) || t.module.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q);
    const matchDiff = !diffFilter || t.difficulty === diffFilter;
    const matchModule = !moduleFilter || t.module === moduleFilter;
    return matchSearch && matchDiff && matchModule;
  });

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <div className="min-h-screen" data-testid="cheat-sheet-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black mb-2" data-testid="cheat-sheet-title">data-testid Cheat Sheet</h1>
          <p className="text-gray-400" data-testid="cheat-sheet-subtitle">
            {ALL_TESTIDS.length} test IDs across {modules.length} modules — your ground truth for automation scripts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6" data-testid="cheat-sheet-filters">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 text-sm" placeholder="Search test ID, module, or notes…" data-testid="cs-search" aria-label="Search cheat sheet" />
          </div>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} className="input w-auto text-sm" data-testid="cs-filter-difficulty">
            <option value="">All Difficulties</option>
            {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="input w-auto text-sm" data-testid="cs-filter-module">
            <option value="">All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <span className="self-center text-sm text-gray-500 dark:text-gray-400" data-testid="cs-results-count">
            {filtered.length} / {ALL_TESTIDS.length} entries
          </span>
        </div>

        {/* Table */}
        <div className="card overflow-hidden" data-testid="cheat-sheet-table">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="data-testid cheat sheet">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-64">data-testid</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-40 hidden sm:table-cell">Module</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 w-28 hidden md:table-cell">Difficulty</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Element</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Notes / Expected Behavior</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400" data-testid="cs-empty">No entries match your search</td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={t.testId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 group" data-testid={`cs-row-${i}`}>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded" data-testid={`cs-testid-${i}`}>
                        {t.testId}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <Link to={t.path} className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline" data-testid={`cs-module-link-${i}`}>
                        {t.module}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span className={`badge text-xs ${DIFF_COLORS[t.difficulty]}`}>{t.difficulty}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      <code className="text-xs text-gray-500 dark:text-gray-400">{t.element}</code>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400 max-w-xs">{t.notes}</td>
                    <td className="px-2 py-2.5">
                      <button
                        onClick={() => copy(`[data-testid="${t.testId}"]`, t.testId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-500"
                        title="Copy CSS selector"
                        data-testid={`cs-copy-${i}`}
                        aria-label={`Copy selector for ${t.testId}`}
                      >
                        {copiedId === t.testId ? <CheckCircle size={12} className="text-green-500" /> : <Copy size={12} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSS/XPath patterns */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="card p-5" data-testid="cs-selector-patterns">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Common Selector Patterns</h2>
            <div className="space-y-2 text-xs font-mono">
              {[
                ['CSS', '[data-testid="login-submit"]'],
                ['XPath', '//*[@data-testid="login-submit"]'],
                ['Playwright', 'page.getByTestId("login-submit")'],
                ['Cypress', 'cy.get(\'[data-testid="login-submit"]\')'],
                ['Selenium', 'By.cssSelector(\'[data-testid="login-submit"]\')'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start gap-2" data-testid={`pattern-${label.toLowerCase()}`}>
                  <span className="w-16 text-gray-400 shrink-0">{label}</span>
                  <code className="text-blue-600 dark:text-blue-400 break-all">{val}</code>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5" data-testid="cs-attribute-patterns">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">State Attribute Patterns</h2>
            <div className="space-y-2 text-xs font-mono">
              {[
                ['Loading btn', '[data-testid="btn-save"][data-state="loading"]'],
                ['Success btn', '[data-testid="btn-save"][data-state="success"]'],
                ['Active step', '[data-testid="msf-step-indicator-2"][data-active="true"]'],
                ['Dragging item', '[data-testid="drag-item-t1"][style*="zIndex"]'],
                ['Toggle on', '[data-testid="toggle-like"][aria-pressed="true"]'],
                ['WS connected', '[data-testid="ws-status-dot"].bg-green-500'],
              ].map(([label, val]) => (
                <div key={label} className="flex items-start gap-2" data-testid={`state-pattern-${label.replace(/\s+/g, '-').toLowerCase()}`}>
                  <span className="text-gray-400 w-24 shrink-0">{label}</span>
                  <code className="text-orange-600 dark:text-orange-400 break-all">{val}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
