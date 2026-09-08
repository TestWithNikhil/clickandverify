import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, Lock, LogOut, RefreshCw, Shield, User } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

type Stage = 'signup' | 'verify' | 'login' | 'dashboard' | 'token-refresh';

interface AuthUser { name: string; email: string; role: 'admin' | 'user'; token: string; refreshToken: string; verified: boolean; }

const MOCK_USERS: AuthUser[] = [
  { name: 'Admin User', email: 'admin@test.com', role: 'admin', token: 'eyJhbGciOiJIUzI1NiJ9.admin', refreshToken: 'refresh_admin_abc123', verified: true },
  { name: 'Test User', email: 'user@test.com', role: 'user', token: 'eyJhbGciOiJIUzI1NiJ9.user', refreshToken: 'refresh_user_def456', verified: true },
];

function genVerifyCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }

export default function AuthFlowPage() {
  const [stage, setStage] = useState<Stage>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [verifyCode, setVerifyCode] = useState('');
  const [sentCode] = useState(genVerifyCode);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokenAge, setTokenAge] = useState(0);
  const [refreshed, setRefreshed] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => { setLog((l) => [...l, `${new Date().toLocaleTimeString()} — ${msg}`]); console.log(`[ClickAndVerify] Auth: ${msg}`); };

  const reset = () => { setStage('signup'); setError(''); setUser(null); setLog([]); setSignupData({ name: '', email: '', password: '', confirmPassword: '' }); setLoginData({ email: '', password: '' }); setTokenAge(0); setRefreshed(false); };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupData.name || !signupData.email || !signupData.password) { setError('All fields required'); return; }
    if (signupData.password !== signupData.confirmPassword) { setError('Passwords do not match'); return; }
    if (signupData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    addLog(`Signup attempt: ${signupData.email}`);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    addLog(`Account created: ${signupData.email}. Verification code: ${sentCode}`);
    setStage('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    addLog(`Verification attempt: code=${verifyCode}`);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    if (verifyCode !== sentCode) { setError(`Invalid code. (Hint: ${sentCode})`); return; }
    addLog('Email verified successfully');
    setStage('login');
    setLoginData(d => ({ ...d, email: signupData.email }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) { setError('Email and password required'); return; }
    setLoading(true);
    addLog(`Login attempt: ${loginData.email}`);
    await new Promise(r => setTimeout(r, 1200));
    const found = MOCK_USERS.find(u => u.email === loginData.email) ||
      (loginData.email === signupData.email ? { name: signupData.name, email: signupData.email, role: 'user' as const, token: `eyJ.${Date.now()}`, refreshToken: `refresh_${Date.now()}`, verified: true } : null);
    if (!found || (loginData.email !== signupData.email && loginData.password !== 'password123' && loginData.password !== 'user1234')) {
      setLoading(false); setError('Invalid credentials'); addLog('Login failed: invalid credentials'); return;
    }
    setLoading(false);
    setUser(found);
    setTokenAge(0);
    addLog(`Login success: ${found.email} (role: ${found.role}). JWT issued.`);
    setStage('dashboard');
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    addLog('Token refresh requested');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setRefreshed(true);
    setTokenAge(0);
    addLog('Token refreshed successfully. New JWT issued.');
    setTimeout(() => setRefreshed(false), 3000);
  };

  const handleLogout = () => { addLog(`Logout: ${user?.email}`); setUser(null); setStage('signup'); reset(); };

  const stageSteps = [
    { id: 'signup', label: 'Sign Up', num: 1 },
    { id: 'verify', label: 'Verify Email', num: 2 },
    { id: 'login', label: 'Login', num: 3 },
    { id: 'dashboard', label: 'Dashboard', num: 4 },
  ];
  const stageIdx = stageSteps.findIndex(s => s.id === stage);

  return (
    <PageLayout title="Full Auth Flow" description="Signup → email verification → login → JWT session → protected dashboard → logout → token refresh" difficulty="expert" testId="auth-flow-page" onReset={reset}>
      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <div className="flex items-center gap-2" data-testid="auth-progress">
            {stageSteps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < stageIdx ? 'bg-green-500 text-white' : i === stageIdx ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40' : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}`}
                  data-testid={`auth-step-${s.id}`} data-active={i === stageIdx}>
                  {i < stageIdx ? '✓' : s.num}
                </div>
                <span className={`text-xs ml-1.5 hidden sm:block ${i === stageIdx ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-400'}`}>{s.label}</span>
                {i < stageSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < stageIdx ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg p-3" role="alert" data-testid="auth-error">{error}</div>
          )}

          {/* Signup */}
          {stage === 'signup' && (
            <div className="card p-6" data-testid="auth-signup-form-container">
              <h2 className="section-header">Create Account</h2>
              <p className="section-sub">Step 1: Register a new account</p>
              <form onSubmit={handleSignup} noValidate data-testid="auth-signup-form">
                <div className="space-y-4">
                  <div><label className="label" htmlFor="signup-name">Full Name *</label>
                    <input id="signup-name" type="text" className="input" value={signupData.name} onChange={e => setSignupData(d => ({...d, name: e.target.value}))} placeholder="Jane Smith" data-testid="auth-signup-name" required /></div>
                  <div><label className="label" htmlFor="signup-email">Email *</label>
                    <input id="signup-email" type="email" className="input" value={signupData.email} onChange={e => setSignupData(d => ({...d, email: e.target.value}))} placeholder="jane@example.com" data-testid="auth-signup-email" required /></div>
                  <div><label className="label" htmlFor="signup-password">Password * (min 8 chars)</label>
                    <input id="signup-password" type="password" className="input" value={signupData.password} onChange={e => setSignupData(d => ({...d, password: e.target.value}))} placeholder="••••••••" data-testid="auth-signup-password" required /></div>
                  <div><label className="label" htmlFor="signup-confirm">Confirm Password *</label>
                    <input id="signup-confirm" type="password" className="input" value={signupData.confirmPassword} onChange={e => setSignupData(d => ({...d, confirmPassword: e.target.value}))} placeholder="••••••••" data-testid="auth-signup-confirm" required /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="auth-signup-submit" aria-busy={loading}>
                    {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creating…</> : <><User size={15}/> Create Account</>}
                  </button>
                  <p className="text-xs text-center text-gray-500">Or use: <button type="button" onClick={() => { setLoginData({email:'admin@test.com',password:'password123'}); setStage('login'); }} className="text-blue-600 hover:underline" data-testid="auth-skip-to-login">Skip to login with test credentials</button></p>
                </div>
              </form>
            </div>
          )}

          {/* Verify */}
          {stage === 'verify' && (
            <div className="card p-6" data-testid="auth-verify-container">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30"><Mail size={20} className="text-blue-600 dark:text-blue-400"/></div>
                <div><h2 className="font-bold text-gray-900 dark:text-gray-100">Check Your Email</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">We sent a 6-digit code to <span className="font-mono font-semibold">{signupData.email}</span></p></div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4 text-sm" data-testid="auth-verify-hint">
                🔑 Mock code: <span className="font-mono font-bold text-yellow-800 dark:text-yellow-400" data-testid="auth-verify-code-hint">{sentCode}</span>
              </div>
              <form onSubmit={handleVerify} data-testid="auth-verify-form">
                <label className="label" htmlFor="verify-code">Enter 6-digit code</label>
                <input id="verify-code" type="text" inputMode="numeric" maxLength={6} className="input font-mono text-lg tracking-widest text-center mb-4" value={verifyCode} onChange={e => setVerifyCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" data-testid="auth-verify-input" />
                <button type="submit" disabled={loading || verifyCode.length !== 6} className="btn-primary w-full" data-testid="auth-verify-submit" aria-busy={loading}>
                  {loading ? 'Verifying…' : <><CheckCircle size={15}/> Verify Email</>}
                </button>
              </form>
            </div>
          )}

          {/* Login */}
          {stage === 'login' && (
            <div className="card p-6" data-testid="auth-login-container">
              <h2 className="section-header">Sign In</h2>
              <p className="section-sub">Step 3: Authenticate with your credentials</p>
              <form onSubmit={handleLogin} noValidate data-testid="auth-login-form">
                <div className="space-y-4">
                  <div><label className="label" htmlFor="login-email-auth">Email</label>
                    <input id="login-email-auth" type="email" className="input" value={loginData.email} onChange={e => setLoginData(d => ({...d, email: e.target.value}))} placeholder="admin@test.com" data-testid="auth-login-email" /></div>
                  <div><label className="label" htmlFor="login-password-auth">Password</label>
                    <input id="login-password-auth" type="password" className="input" value={loginData.password} onChange={e => setLoginData(d => ({...d, password: e.target.value}))} placeholder="password123" data-testid="auth-login-password" /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="auth-login-submit" aria-busy={loading}>
                    {loading ? 'Signing in…' : <><Lock size={15}/> Sign In</>}
                  </button>
                </div>
              </form>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono space-y-1" data-testid="auth-credentials-hint">
                <p className="text-gray-500 font-sans font-semibold mb-1">Test credentials:</p>
                <p><span className="text-gray-400">admin:</span> <span className="text-blue-600 dark:text-blue-400">admin@test.com</span> / <span className="text-blue-600 dark:text-blue-400">password123</span></p>
                <p><span className="text-gray-400">user:</span> <span className="text-blue-600 dark:text-blue-400">user@test.com</span> / <span className="text-blue-600 dark:text-blue-400">user1234</span></p>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {stage === 'dashboard' && user && (
            <div className="card p-6" data-testid="auth-dashboard">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100" data-testid="auth-dashboard-name">{user.name}</p>
                    <p className="text-xs text-gray-500" data-testid="auth-dashboard-email">{user.email}</p>
                  </div>
                </div>
                <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`} data-testid="auth-dashboard-role">{user.role}</span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3" data-testid="auth-jwt-panel">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">JWT Token</p>
                  <p className="font-mono text-xs text-green-600 dark:text-green-400 break-all" data-testid="auth-jwt-value">{user.token}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3" data-testid="auth-refresh-token-panel">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Refresh Token</p>
                  <p className="font-mono text-xs text-orange-600 dark:text-orange-400 break-all" data-testid="auth-refresh-token-value">{user.refreshToken}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleRefreshToken} disabled={loading} className="btn-secondary flex-1 text-sm gap-1.5" data-testid="auth-refresh-btn" aria-busy={loading}>
                    {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Refreshing…</> : <><RefreshCw size={14}/> Refresh Token</>}
                  </button>
                  <button onClick={handleLogout} className="btn-danger flex-1 text-sm gap-1.5" data-testid="auth-logout-btn">
                    <LogOut size={14}/> Logout
                  </button>
                </div>
                {refreshed && <p className="text-xs text-green-600 dark:text-green-400 font-semibold" data-testid="auth-refresh-success">✓ Token refreshed!</p>}
                {user.role === 'admin' && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3" data-testid="auth-admin-panel">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1"><Shield size={12}/> Admin-only content</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This section is only visible to admins. Test that regular users cannot see it.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Log panel */}
        <div className="card p-4 h-fit" data-testid="auth-event-log">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Auth Event Log</h3>
          {log.length === 0 ? <p className="text-xs text-gray-400">No events yet.</p> : (
            <ul className="space-y-1.5 max-h-96 overflow-y-auto">
              {log.map((entry, i) => <li key={i} className="text-xs text-gray-500 dark:text-gray-400 font-mono leading-relaxed" data-testid={`auth-log-${i}`}>{entry}</li>)}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
