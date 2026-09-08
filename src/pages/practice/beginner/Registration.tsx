import { useState } from 'react';
import { CheckCircle, User } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface RegForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;
  country: string;
  agreeTerms: boolean;
  subscribeNewsletter: boolean;
}

const DEFAULT: RegForm = {
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '', gender: '', dob: '', country: '', agreeTerms: false, subscribeNewsletter: false,
};

type Errors = Partial<Record<keyof RegForm, string>>;

function validate(form: RegForm): Errors {
  const e: Errors = {};
  if (!form.firstName.trim()) e.firstName = 'First name is required';
  else if (form.firstName.trim().length < 2) e.firstName = 'At least 2 characters';
  if (!form.lastName.trim()) e.lastName = 'Last name is required';
  if (!form.email) e.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
  if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
  if (!form.password) e.password = 'Password is required';
  else if (form.password.length < 8) e.password = 'At least 8 characters';
  else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain an uppercase letter';
  else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
  if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
  if (!form.gender) e.gender = 'Please select a gender';
  if (!form.dob) e.dob = 'Date of birth is required';
  if (!form.country) e.country = 'Please select a country';
  if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
  return e;
}

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Brazil', 'Japan', 'Other'];

const passwordStrength = (p: string) => {
  if (!p) return { score: 0, label: '', color: '' };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (p.length >= 12) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
  return { score, label: labels[score] || 'Weak', color: colors[score] || 'bg-red-500' };
};

export default function Registration() {
  const [form, setForm] = useState<RegForm>(DEFAULT);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegForm, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const update = (field: keyof RegForm, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      const newForm = { ...form, [field]: value };
      const newErrors = validate(newForm);
      setErrors((e) => ({ ...e, [field]: newErrors[field] }));
    }
  };

  const blur = (field: keyof RegForm) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const newErrors = validate(form);
    setErrors((e) => ({ ...e, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(DEFAULT).reduce((a, k) => ({ ...a, [k]: true }), {}) as Record<keyof RegForm, boolean>;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      console.log('[ClickAndVerify] Registration validation failed:', errs);
      return;
    }
    setStatus('loading');
    console.log('[ClickAndVerify] Registration submit:', form.email);
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
    setSubmitted(true);
    console.log('[ClickAndVerify] Registration success:', form.email);
  };

  const strength = passwordStrength(form.password);

  const Field = ({ id, field, label, type = 'text', placeholder, autoComplete }: {
    id: string; field: keyof RegForm; label: string; type?: string; placeholder?: string; autoComplete?: string;
  }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id} type={type} name={field as string}
        value={form[field] as string}
        onChange={(e) => update(field, e.target.value)}
        onBlur={() => blur(field)}
        className={`input ${touched[field] && errors[field] ? 'input-error' : ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-testid={`reg-${field}`}
        aria-invalid={!!(touched[field] && errors[field])}
        aria-describedby={touched[field] && errors[field] ? `${id}-error` : undefined}
      />
      {touched[field] && errors[field] && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid={`reg-${field}-error`} role="alert">
          {errors[field]}
        </p>
      )}
    </div>
  );

  if (status === 'success') {
    return (
      <PageLayout title="Registration Form" description="Client-side validated registration form" difficulty="beginner" testId="registration-page" onReset={() => { setForm(DEFAULT); setErrors({}); setTouched({}); setSubmitted(false); setStatus('idle'); }}>
        <div className="max-w-md mx-auto card p-10 text-center" data-testid="reg-success-panel">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2" data-testid="reg-success-title">Registration Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Welcome aboard,</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100" data-testid="reg-success-name">{form.firstName} {form.lastName}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-mono mt-1" data-testid="reg-success-email">{form.email}</p>
          {form.subscribeNewsletter && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2" data-testid="reg-subscribed-msg">✓ Subscribed to newsletter</p>
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Registration Form"
      description="Multi-field registration with real-time client-side validation."
      difficulty="beginner"
      testId="registration-page"
      onReset={() => { setForm(DEFAULT); setErrors({}); setTouched({}); setSubmitted(false); setStatus('idle'); }}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} noValidate data-testid="registration-form" aria-label="Registration form">
          {/* Personal */}
          <div className="card p-6 mb-6" data-testid="reg-section-personal">
            <h2 className="section-header">Personal Information</h2>
            <p className="section-sub">Basic contact details</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="reg-first-name" field="firstName" label="First Name *" placeholder="Jane" autoComplete="given-name" />
              <Field id="reg-last-name" field="lastName" label="Last Name *" placeholder="Smith" autoComplete="family-name" />
              <Field id="reg-email" field="email" label="Email Address *" type="email" placeholder="jane@example.com" autoComplete="email" />
              <Field id="reg-phone" field="phone" label="Phone (optional)" type="tel" placeholder="+1 555 0100" autoComplete="tel" />
              <div>
                <label className="label" htmlFor="reg-gender">Gender *</label>
                <select
                  id="reg-gender" name="gender"
                  value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}
                  onBlur={() => blur('gender')}
                  className={`input ${touched.gender && errors.gender ? 'input-error' : ''}`}
                  data-testid="reg-gender"
                  aria-invalid={!!(touched.gender && errors.gender)}
                >
                  <option value="">Select gender…</option>
                  <option value="male" data-testid="reg-gender-male">Male</option>
                  <option value="female" data-testid="reg-gender-female">Female</option>
                  <option value="non-binary" data-testid="reg-gender-nb">Non-binary</option>
                  <option value="prefer-not" data-testid="reg-gender-pnts">Prefer not to say</option>
                </select>
                {touched.gender && errors.gender && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid="reg-gender-error" role="alert">{errors.gender}</p>
                )}
              </div>
              <Field id="reg-dob" field="dob" label="Date of Birth *" type="date" />
              <div className="sm:col-span-2">
                <label className="label" htmlFor="reg-country">Country *</label>
                <select
                  id="reg-country" name="country"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  onBlur={() => blur('country')}
                  className={`input ${touched.country && errors.country ? 'input-error' : ''}`}
                  data-testid="reg-country"
                >
                  <option value="">Select country…</option>
                  {countries.map((c) => (
                    <option key={c} value={c} data-testid={`reg-country-${c.toLowerCase().replace(/\s+/g, '-')}`}>{c}</option>
                  ))}
                </select>
                {touched.country && errors.country && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid="reg-country-error" role="alert">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="card p-6 mb-6" data-testid="reg-section-password">
            <h2 className="section-header">Set Password</h2>
            <p className="section-sub">Must be 8+ chars with at least one uppercase and one number</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="reg-password-input">Password *</label>
                <input
                  id="reg-password-input" type="password" name="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  onBlur={() => blur('password')}
                  className={`input ${touched.password && errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  data-testid="reg-password"
                  autoComplete="new-password"
                  aria-invalid={!!(touched.password && errors.password)}
                />
                {form.password && (
                  <div className="mt-2" data-testid="reg-password-strength">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500" data-testid="reg-strength-label">Strength: <span className="font-medium">{strength.label}</span></p>
                  </div>
                )}
                {touched.password && errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid="reg-password-error" role="alert">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="reg-confirm-password">Confirm Password *</label>
                <input
                  id="reg-confirm-password" type="password" name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  onBlur={() => blur('confirmPassword')}
                  className={`input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  data-testid="reg-confirm-password"
                  autoComplete="new-password"
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1" data-testid="reg-passwords-match">✓ Passwords match</p>
                )}
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid="reg-confirm-error" role="alert">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Agreements */}
          <div className="card p-6 mb-6" data-testid="reg-section-agreements">
            <h2 className="section-header">Agreements</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer" data-testid="reg-terms-label">
                <input
                  type="checkbox" id="reg-terms" name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={(e) => update('agreeTerms', e.target.checked)}
                  onBlur={() => blur('agreeTerms')}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  data-testid="reg-terms-checkbox"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the <a href="#" className="text-blue-600 hover:underline" data-testid="reg-terms-link">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline" data-testid="reg-privacy-link">Privacy Policy</a> *
                </span>
              </label>
              {touched.agreeTerms && errors.agreeTerms && (
                <p className="text-xs text-red-600 dark:text-red-400" data-testid="reg-terms-error" role="alert">{errors.agreeTerms}</p>
              )}
              <label className="flex items-start gap-3 cursor-pointer" data-testid="reg-newsletter-label">
                <input
                  type="checkbox" id="reg-newsletter" name="subscribeNewsletter"
                  checked={form.subscribeNewsletter}
                  onChange={(e) => update('subscribeNewsletter', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  data-testid="reg-newsletter-checkbox"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Subscribe to newsletter (optional)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3"
            data-testid="reg-submit"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creating account…</>
            ) : (
              <><User size={16} /> Create Account</>
            )}
          </button>

          {submitted && Object.keys(errors).length > 0 && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" data-testid="reg-error-summary" role="alert" aria-live="assertive">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Please fix the following errors:</p>
              <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </form>
      </div>
    </PageLayout>
  );
}
