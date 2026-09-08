import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { InspectorProvider } from './context/InspectorContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';

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
