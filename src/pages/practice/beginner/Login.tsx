import { useState } from 'react';
import { Eye, EyeOff, LogIn, CheckCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

const VALID_USERS = [
  { email: 'admin@test.com', password: 'password123', name: 'Admin User', role: 'admin' },
  { email: 'user@test.com', password: 'user1234', name: 'Test User', role: 'user' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const DEFAULT: FormState = { email: '', password: '', rememberMe: false };

export default function LoginPage() {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<typeof VALID_USERS[0] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const reset = () => {
    setForm(DEFAULT);
    setStatus('idle');
    setErrorMsg('');
    setLoggedInUser(null);
    setShowPassword(false);
    setTouched({});
  };

  const emailError = touched.email && !form.email ? 'Email is required' :
    touched.email && !/\S+@\S+\.\S+/.test(form.email) ? 'Enter a valid email' : '';
  const passwordError = touched.password && !form.password ? 'Password is required' :
    touched.password && form.password.length < 4 ? 'Password must be at least 4 characters' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (emailError || passwordError || !form.email || !form.password) return;

    setStatus('loading');
    setErrorMsg('');
    console.log('[ClickAndVerify] Login attempt:', form.email);

    await new Promise((r) => setTimeout(r, 1200));

    const user = VALID_USERS.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (user) {
      setStatus('success');
      setLoggedInUser(user);
      console.log('[ClickAndVerify] Login success:', user.email, 'role:', user.role);
    } else {
      setStatus('error');
      setErrorMsg('Invalid email or password. Please try again.');
      console.log('[ClickAndVerify] Login failed for:', form.email);
    }
  };

  return (
    <PageLayout
      title="Login Form"
      description="Practice basic form interaction, credential validation, and error states."
      difficulty="beginner"
      testId="login-page"
      onReset={reset}
    >
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        {/* Login card */}
        <div className="card p-8" data-testid="login-card">
          {status === 'success' && loggedInUser ? (
            <div className="text-center py-6" data-testid="login-success-panel">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1" data-testid="login-success-msg">
                Welcome, {loggedInUser.name}!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logged in as</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 text-sm mb-1" data-testid="logged-in-email">
                {loggedInUser.email}
              </p>
              <span
                className={loggedInUser.role === 'admin' ? 'badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                data-testid="logged-in-role"
              >
                {loggedInUser.role}
              </span>
              <button
                onClick={reset}
                className="btn-secondary mt-6 w-full"
                data-testid="login-logout-btn"
              >
                Log out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate data-testid="login-form" aria-label="Login form">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Sign in</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your credentials to continue</p>

              {/* Error banner */}
              {status === 'error' && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg p-3 mb-4 flex items-start gap-2"
                  role="alert"
                  data-testid="login-error"
                  aria-live="assertive"
                >
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="login-email-input" className="label">Email address</label>
                <input
                  id="login-email-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`input ${emailError ? 'input-error' : ''}`}
                  placeholder="admin@test.com"
                  data-testid="login-email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  disabled={status === 'loading'}
                />
                {emailError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" id="email-error" data-testid="login-email-error" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="login-password-input" className="label">Password</label>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`input pr-10 ${passwordError ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    data-testid="login-password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    disabled={status === 'loading'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    data-testid="login-toggle-password"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" id="password-error" data-testid="login-password-error" role="alert">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm((f) => ({ ...f, rememberMe: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  data-testid="login-remember-me"
                />
                <label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary w-full"
                data-testid="login-submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign in
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Hint panel */}
        <div className="space-y-4">
          <div className="card p-5" data-testid="login-credentials-hint">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Test Credentials</h3>
            <div className="space-y-3">
              {VALID_USERS.map((u) => (
                <div key={u.email} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono text-xs" data-testid={`credential-${u.role}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-blue-600 dark:text-blue-400 select-all">{u.email}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Password:</span>
                    <span className="text-blue-600 dark:text-blue-400 select-all">{u.password}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className={u.role === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'}>{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5" data-testid="login-test-scenarios">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Test Scenarios</h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              {[
                'Submit empty form → both errors shown',
                'Invalid email format → email error only',
                'Valid email, wrong password → error banner',
                'Valid credentials → success panel with role',
                'Loading state lasts ~1.2s → test spinner visible',
                'Toggle show/hide password → input type changes',
                'Remember me checkbox → verify checked state',
              ].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-400 shrink-0">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
