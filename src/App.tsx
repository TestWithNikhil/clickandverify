import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InspectorProvider } from './context/InspectorContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ClickAndVerify — Automation Testing Practice Sandbox',
    description: 'Practice Selenium, Playwright, Cypress, REST Assured, and UI automation with realistic browser scenarios and test flows.',
  },
  '/getting-started': {
    title: 'Getting Started | ClickAndVerify',
    description: 'Learn how to use the ClickAndVerify sandbox and start practicing automation testing with real-world scenarios.',
  },
  '/cheat-sheet': {
    title: 'Cheat Sheet | ClickAndVerify',
    description: 'Quick reference for automation commands, selectors, and testing patterns used across UI and API testing.',
  },
  '/practice/login': {
    title: 'Login Practice | ClickAndVerify',
    description: 'Practice login flows, validation, and authentication scenarios for UI automation testing.',
  },
  '/practice/form-controls': {
    title: 'Form Controls Practice | ClickAndVerify',
    description: 'Test text fields, radio buttons, checkboxes, selects, and form validation in a realistic UI sandbox.',
  },
  '/practice/registration': {
    title: 'Registration Form Practice | ClickAndVerify',
    description: 'Practice end-to-end registration flows and form validations in the ClickAndVerify sandbox.',
  },
  '/practice/table': {
    title: 'Table Practice | ClickAndVerify',
    description: 'Interact with data tables, row selection, sorting, and table assertions for browser automation automation.',
  },
  '/practice/buttons': {
    title: 'Button Interactions Practice | ClickAndVerify',
    description: 'Practice button click flows, enabled states, disabled controls, and UI interaction checks.',
  },
  '/practice/multi-step-form': {
    title: 'Multi-Step Form Practice | ClickAndVerify',
    description: 'Automate multi-step user journeys and validation across sequential forms in a browser-based practice app.',
  },
  '/practice/custom-dropdown': {
    title: 'Custom Dropdown Practice | ClickAndVerify',
    description: 'Practice selecting values from custom dropdown menus and handling hidden or dynamic UI components.',
  },
  '/practice/drag-drop': {
    title: 'Drag & Drop Practice | ClickAndVerify',
    description: 'Practice drag-and-drop interactions and element movement scenarios in browser automation tests.',
  },
  '/practice/file-upload': {
    title: 'File Upload Practice | ClickAndVerify',
    description: 'Practice file upload interactions, validation, and browser automation for input file controls.',
  },
  '/practice/modals-toasts': {
    title: 'Modals & Toasts Practice | ClickAndVerify',
    description: 'Work with modals, toasts, popups, and confirmation flows in a realistic automation testing sandbox.',
  },
  '/practice/date-picker': {
    title: 'Date Picker Practice | ClickAndVerify',
    description: 'Practice selecting dates, validating calendar controls, and handling date picker UI states.',
  },
  '/practice/data-table': {
    title: 'Data Table Practice | ClickAndVerify',
    description: 'Practice sorting, filtering, and verification with browser automation on data tables and grids.',
  },
  '/practice/js-alerts': {
    title: 'JavaScript Alerts Practice | ClickAndVerify',
    description: 'Handle alerts, confirmations, and prompts in real browser automation workflows with test-ready pages.',
  },
  '/practice/dynamic-ids': {
    title: 'Dynamic IDs Practice | ClickAndVerify',
    description: 'Practice automation against dynamic selectors, unstable IDs, and changing DOM attributes.',
  },
  '/practice/iframes': {
    title: 'IFrames Practice | ClickAndVerify',
    description: 'Practice switching contexts and interacting with content inside nested iframe elements.',
  },
  '/practice/shadow-dom': {
    title: 'Shadow DOM Practice | ClickAndVerify',
    description: 'Test automation strategies for shadow-root DOM structures and encapsulated UI components.',
  },
  '/practice/async-loading': {
    title: 'Async Loading Practice | ClickAndVerify',
    description: 'Practice waiting for dynamic content, delayed elements, and asynchronous page updates.',
  },
  '/practice/hover-menus': {
    title: 'Hover Menu Practice | ClickAndVerify',
    description: 'Learn to handle hover-driven navigation menus and hidden submenus in UI automation tests.',
  },
  '/practice/websocket': {
    title: 'WebSocket Practice | ClickAndVerify',
    description: 'Practice testing live updates, real-time messaging, and WebSocket-driven UI behaviors.',
  },
  '/practice/flaky-elements': {
    title: 'Flaky Elements Practice | ClickAndVerify',
    description: 'Explore flaky UI states, timing issues, and reliability patterns in automation testing workflows.',
  },
  '/practice/flows': {
    title: 'Real-World Flows | ClickAndVerify',
    description: 'Practice end-to-end real-world browser automation flows for e-commerce, banking, and job portal scenarios.',
  },
  '/practice/flows/ecommerce': {
    title: 'E-commerce Flow Practice | ClickAndVerify',
    description: 'Practice complete commerce flows such as product selection, cart action, and checkout automation.',
  },
  '/practice/flows/banking': {
    title: 'Banking Flow Practice | ClickAndVerify',
    description: 'Practice banking and account actions in realistic automation scenarios across UI interactions.',
  },
  '/practice/flows/jobs': {
    title: 'Job Portal Flow Practice | ClickAndVerify',
    description: 'Practice job application flows, candidate steps, and navigation patterns used in customer journeys.',
  },
  '/practice/auth-flow': {
    title: 'Auth Flow Practice | ClickAndVerify',
    description: 'Practice login, logout, session handling, and protected route testing in browser automation.',
  },
  '/practice/rbac': {
    title: 'RBAC Practice | ClickAndVerify',
    description: 'Practice role-based access control testing and permission checks with realistic app behavior.',
  },
  '/practice/checkout': {
    title: 'Checkout Flow Practice | ClickAndVerify',
    description: 'Practice checkout journeys and payment-related interaction checks in a browser automation sandbox.',
  },
  '/practice/api-playground': {
    title: 'API Playground Practice | ClickAndVerify',
    description: 'Explore API endpoint testing, request validation, and automation-friendly API playground scenarios.',
  },
  '/practice/accessibility': {
    title: 'Accessibility Practice | ClickAndVerify',
    description: 'Practice keyboard navigation, screen-reader-related flows, and accessibility-focused UI validation.',
  },
  '/practice/canvas': {
    title: 'Canvas Practice | ClickAndVerify',
    description: 'Test interaction and drawing flows on a canvas-based app using browser automation techniques.',
  },
  '/practice/cross-window': {
    title: 'Cross-Window Practice | ClickAndVerify',
    description: 'Practice switching windows, tabs, and multi-window browser scenarios in automation tests.',
  },
};

function SeoMeta() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://clickandverify.onrender.com';
    const pathname = location.pathname || '/';
    const meta = routeMeta[pathname] ?? routeMeta['/'];
    const canonicalUrl = `${baseUrl}${pathname === '/' ? '' : pathname}`;

    document.title = meta.title;

    const setMeta = (selector: string, value: string, attr = 'content') => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name' in attr ? 'name' : 'property', selector.includes('og:') ? selector.replace('meta[property="', '').replace('"]', '') : selector.replace('meta[name="', '').replace('"]', ''));
      }

      if (selector.startsWith('meta[name="')) {
        element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
      }
      if (selector.startsWith('meta[property="')) {
        element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
      }
      element.setAttribute('content', value);
      document.head.appendChild(element);
    };

    const descriptionTag = document.head.querySelector('meta[name="description"]') || document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    descriptionTag.setAttribute('content', meta.description);
    document.head.appendChild(descriptionTag);

    const ogTitleTag = document.head.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitleTag.setAttribute('property', 'og:title');
    ogTitleTag.setAttribute('content', meta.title);
    document.head.appendChild(ogTitleTag);

    const ogDescriptionTag = document.head.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescriptionTag.setAttribute('property', 'og:description');
    ogDescriptionTag.setAttribute('content', meta.description);
    document.head.appendChild(ogDescriptionTag);

    const ogUrlTag = document.head.querySelector('meta[property="og:url"]') || document.createElement('meta');
    ogUrlTag.setAttribute('property', 'og:url');
    ogUrlTag.setAttribute('content', canonicalUrl);
    document.head.appendChild(ogUrlTag);

    const ogTypeTag = document.head.querySelector('meta[property="og:type"]') || document.createElement('meta');
    ogTypeTag.setAttribute('property', 'og:type');
    ogTypeTag.setAttribute('content', 'website');
    document.head.appendChild(ogTypeTag);

    const twitterDescriptionTag = document.head.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
    twitterDescriptionTag.setAttribute('name', 'twitter:description');
    twitterDescriptionTag.setAttribute('content', meta.description);
    document.head.appendChild(twitterDescriptionTag);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [location.pathname]);

  return null;
}

// Pages
import Home from './pages/Home';
import GettingStarted from './pages/GettingStarted';
import CheatSheet from './pages/CheatSheet';

// Beginner
import Login from './pages/practice/beginner/Login';
import FormControls from './pages/practice/beginner/FormControls';
import Registration from './pages/practice/beginner/Registration';
import Table from './pages/practice/beginner/Table';
import Buttons from './pages/practice/beginner/Buttons';

// Intermediate
import MultiStepForm from './pages/practice/intermediate/MultiStepForm';
import CustomDropdown from './pages/practice/intermediate/CustomDropdown';
import DragDrop from './pages/practice/intermediate/DragDrop';
import FileUpload from './pages/practice/intermediate/FileUpload';
import ModalsToasts from './pages/practice/intermediate/ModalsToasts';
import DatePicker from './pages/practice/intermediate/DatePicker';
import DataTable from './pages/practice/intermediate/DataTable';
import JsAlerts from './pages/practice/intermediate/JsAlerts';

// Advanced
import DynamicIds from './pages/practice/advanced/DynamicIds';
import Iframes from './pages/practice/advanced/Iframes';
import ShadowDom from './pages/practice/advanced/ShadowDom';
import AsyncLoading from './pages/practice/advanced/AsyncLoading';
import HoverMenus from './pages/practice/advanced/HoverMenus';
import WebSocketPage from './pages/practice/advanced/WebSocketPage';
import FlakyElements from './pages/practice/advanced/FlakyElements';

// Real-World Flows
import RealWorldFlows from './pages/practice/flows/RealWorldFlows';
import EcommerceFlow from './pages/practice/flows/EcommerceFlow';
import BankingFlow from './pages/practice/flows/BankingFlow';
import JobPortalFlow from './pages/practice/flows/JobPortalFlow';

// Expert
import AuthFlow from './pages/practice/expert/AuthFlow';
import Rbac from './pages/practice/expert/Rbac';
import Checkout from './pages/practice/expert/Checkout';
import ApiPlayground from './pages/practice/expert/ApiPlayground';
import Accessibility from './pages/practice/expert/Accessibility';
import Canvas from './pages/practice/expert/Canvas';
import CrossWindow from './pages/practice/expert/CrossWindow';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <InspectorProvider>
            <ToastProvider>
              <SeoMeta />
              <div className="min-h-screen flex flex-col" data-testid="app-root">
                <Navbar />
                <main className="flex-1" id="main-content" data-testid="main-content">
                  <Routes>
                    {/* Core */}
                    <Route path="/" element={<Home />} />
                    <Route path="/getting-started" element={<GettingStarted />} />
                    <Route path="/cheat-sheet" element={<CheatSheet />} />

                    {/* Beginner */}
                    <Route path="/practice/login" element={<Login />} />
                    <Route path="/practice/form-controls" element={<FormControls />} />
                    <Route path="/practice/registration" element={<Registration />} />
                    <Route path="/practice/table" element={<Table />} />
                    <Route path="/practice/buttons" element={<Buttons />} />

                    {/* Intermediate */}
                    <Route path="/practice/multi-step-form" element={<MultiStepForm />} />
                    <Route path="/practice/custom-dropdown" element={<CustomDropdown />} />
                    <Route path="/practice/drag-drop" element={<DragDrop />} />
                    <Route path="/practice/file-upload" element={<FileUpload />} />
                    <Route path="/practice/modals-toasts" element={<ModalsToasts />} />
                    <Route path="/practice/date-picker" element={<DatePicker />} />
                    <Route path="/practice/data-table" element={<DataTable />} />
                    <Route path="/practice/js-alerts" element={<JsAlerts />} />

                    {/* Advanced */}
                    <Route path="/practice/dynamic-ids" element={<DynamicIds />} />
                    <Route path="/practice/iframes" element={<Iframes />} />
                    <Route path="/practice/shadow-dom" element={<ShadowDom />} />
                    <Route path="/practice/async-loading" element={<AsyncLoading />} />
                    <Route path="/practice/hover-menus" element={<HoverMenus />} />
                    <Route path="/practice/websocket" element={<WebSocketPage />} />
                    <Route path="/practice/flaky-elements" element={<FlakyElements />} />

                    {/* Real-World Flows */}
                    <Route path="/practice/flows" element={<RealWorldFlows />} />
                    <Route path="/practice/flows/ecommerce" element={<EcommerceFlow />} />
                    <Route path="/practice/flows/banking" element={<BankingFlow />} />
                    <Route path="/practice/flows/jobs" element={<JobPortalFlow />} />

                    {/* Expert */}
                    <Route path="/practice/auth-flow" element={<AuthFlow />} />
                    <Route path="/practice/rbac" element={<Rbac />} />
                    <Route path="/practice/checkout" element={<Checkout />} />
                    <Route path="/practice/api-playground" element={<ApiPlayground />} />
                    <Route path="/practice/accessibility" element={<Accessibility />} />
                    <Route path="/practice/canvas" element={<Canvas />} />
                    <Route path="/practice/cross-window" element={<CrossWindow />} />

                    {/* 404 */}
                    <Route path="*" element={
                      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" data-testid="not-found">
                        <div className="text-6xl">🔍</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
                        <p className="text-gray-500 dark:text-gray-400">This route doesn't exist yet.</p>
                        <a href="/" className="btn-primary" data-testid="not-found-home-link">Back to Home</a>
                      </div>
                    } />
                  </Routes>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-xs text-gray-400 dark:text-gray-600" data-testid="footer">
                  ⚡ ClickAndVerify — Automation Testing Practice Sandbox — No real data collected
                </footer>
              </div>
            </ToastProvider>
          </InspectorProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
