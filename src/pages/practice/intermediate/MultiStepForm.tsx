import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, User, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface StepData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; zip: string; country: string;
  cardName: string; cardNumber: string; expiry: string; cvv: string;
}

const DEFAULT: StepData = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '', zip: '', country: '',
  cardName: '', cardNumber: '', expiry: '', cvv: '',
};

type FieldErrors = Partial<Record<keyof StepData, string>>;

const steps = [
  { id: 1, label: 'Personal', icon: <User size={16} /> },
  { id: 2, label: 'Address', icon: <MapPin size={16} /> },
  { id: 3, label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 4, label: 'Review', icon: <Check size={16} /> },
];

function validateStep(step: number, data: StepData): FieldErrors {
  const e: FieldErrors = {};
  if (step === 1) {
    if (!data.firstName.trim()) e.firstName = 'Required';
    if (!data.lastName.trim()) e.lastName = 'Required';
    if (!data.email) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Invalid email';
    if (data.phone && !/^\+?[\d\s\-()]{7,}$/.test(data.phone)) e.phone = 'Invalid phone';
  }
  if (step === 2) {
    if (!data.address.trim()) e.address = 'Required';
    if (!data.city.trim()) e.city = 'Required';
    if (!data.state.trim()) e.state = 'Required';
    if (!data.zip.trim()) e.zip = 'Required';
    else if (!/^\d{4,10}$/.test(data.zip)) e.zip = 'Invalid zip';
    if (!data.country) e.country = 'Required';
  }
  if (step === 3) {
    if (!data.cardName.trim()) e.cardName = 'Required';
    if (!data.cardNumber) e.cardNumber = 'Required';
    else if (!/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) e.cardNumber = 'Invalid card number';
    if (!data.expiry) e.expiry = 'Required';
    else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) e.expiry = 'Format: MM/YY';
    if (!data.cvv) e.cvv = 'Required';
    else if (!/^\d{3,4}$/.test(data.cvv)) e.cvv = 'Invalid CVV';
  }
  return e;
}

function StepField({ id, label, field, data, errors, onChange, type = 'text', placeholder, required }: {
  id: string; label: string; field: keyof StepData; data: StepData; errors: FieldErrors;
  onChange: (f: keyof StepData, v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && ' *'}</label>
      <input
        id={id} type={type} name={field as string}
        value={data[field] as string}
        onChange={(e) => onChange(field, e.target.value)}
        className={`input ${errors[field] ? 'input-error' : ''}`}
        placeholder={placeholder}
        data-testid={`msf-${field}`}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${id}-err` : undefined}
      />
      {errors[field] && <p id={`${id}-err`} className="text-xs text-red-600 dark:text-red-400 mt-1" data-testid={`msf-${field}-error`} role="alert">{errors[field]}</p>}
    </div>
  );
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<StepData>(DEFAULT);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof StepData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const next = () => {
    const errs = validateStep(currentStep, data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setCurrentStep((s) => s + 1);
    console.log(`[ClickAndVerify] Multi-step form: step ${currentStep} → ${currentStep + 1}`);
  };

  const back = () => { setCurrentStep((s) => s - 1); setErrors({}); };

  const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '');
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : d;
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('[ClickAndVerify] Multi-step form submitting…');
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    console.log('[ClickAndVerify] Multi-step form submitted:', data.email);
  };

  const reset = () => { setData(DEFAULT); setCurrentStep(1); setErrors({}); setSubmitted(false); };

  const completedSteps = new Set(
    [1, 2, 3].filter((s) => s < currentStep && Object.keys(validateStep(s, data)).length === 0)
  );

  return (
    <PageLayout title="Multi-Step Form" description="Wizard with progress indicator, per-step validation, and back/next navigation." difficulty="intermediate" testId="multi-step-form-page" onReset={reset}>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8" data-testid="msf-progress" aria-label="Form progress">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => { if (step.id < currentStep) { setCurrentStep(step.id); setErrors({}); } }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all border-2 ${
                    step.id === currentStep ? 'bg-blue-600 text-white border-blue-600 shadow-md' :
                    completedSteps.has(step.id) ? 'bg-green-500 text-white border-green-500 cursor-pointer' :
                    'bg-white dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600'
                  }`}
                  data-testid={`msf-step-indicator-${step.id}`}
                  data-state={step.id === currentStep ? 'active' : completedSteps.has(step.id) ? 'completed' : 'pending'}
                  aria-current={step.id === currentStep ? 'step' : undefined}
                  aria-label={`Step ${step.id}: ${step.label}`}
                  disabled={step.id > currentStep}
                >
                  {completedSteps.has(step.id) ? <Check size={16} /> : step.icon}
                </button>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${step.id === currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} data-testid={`msf-connector-${step.id}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6" data-testid={`msf-step-${currentStep}`}>
          {submitted ? (
            <div className="text-center py-8" data-testid="msf-success">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2" data-testid="msf-success-title">Order Confirmed!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Confirmation sent to</p>
              <p className="font-mono text-blue-600 dark:text-blue-400" data-testid="msf-success-email">{data.email}</p>
              <button onClick={reset} className="btn-secondary mt-6" data-testid="msf-start-over">Start Over</button>
            </div>
          ) : currentStep === 1 ? (
            <>
              <h2 className="section-header">Personal Information</h2>
              <p className="section-sub">Step 1 of 3</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <StepField id="msf-fn" label="First Name" field="firstName" data={data} errors={errors} onChange={update} required placeholder="Jane" />
                <StepField id="msf-ln" label="Last Name" field="lastName" data={data} errors={errors} onChange={update} required placeholder="Smith" />
                <StepField id="msf-em" label="Email" field="email" data={data} errors={errors} onChange={update} type="email" required placeholder="jane@example.com" />
                <StepField id="msf-ph" label="Phone" field="phone" data={data} errors={errors} onChange={update} type="tel" placeholder="+1 555 0100" />
              </div>
            </>
          ) : currentStep === 2 ? (
            <>
              <h2 className="section-header">Shipping Address</h2>
              <p className="section-sub">Step 2 of 3</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><StepField id="msf-addr" label="Street Address" field="address" data={data} errors={errors} onChange={update} required placeholder="123 Main St" /></div>
                <StepField id="msf-city" label="City" field="city" data={data} errors={errors} onChange={update} required placeholder="New York" />
                <StepField id="msf-state" label="State / Province" field="state" data={data} errors={errors} onChange={update} required placeholder="NY" />
                <StepField id="msf-zip" label="Zip / Postal Code" field="zip" data={data} errors={errors} onChange={update} required placeholder="10001" />
                <div>
                  <label className="label" htmlFor="msf-country">Country *</label>
                  <select id="msf-country" name="country" value={data.country} onChange={(e) => update('country', e.target.value)} className={`input ${errors.country ? 'input-error' : ''}`} data-testid="msf-country">
                    <option value="">Select…</option>
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="text-xs text-red-600 mt-1" data-testid="msf-country-error" role="alert">{errors.country}</p>}
                </div>
              </div>
            </>
          ) : currentStep === 3 ? (
            <>
              <h2 className="section-header">Payment Details</h2>
              <p className="section-sub">Step 3 of 3 — Mock payment, no real data sent</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="msf-cardName">Cardholder Name *</label>
                  <input id="msf-cardName" type="text" name="cardName" value={data.cardName} onChange={(e) => update('cardName', e.target.value)} className={`input ${errors.cardName ? 'input-error' : ''}`} placeholder="Jane Smith" data-testid="msf-cardName" />
                  {errors.cardName && <p className="text-xs text-red-600 mt-1" data-testid="msf-cardName-error" role="alert">{errors.cardName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="msf-cardNumber">Card Number *</label>
                  <input id="msf-cardNumber" type="text" name="cardNumber" value={data.cardNumber} onChange={(e) => update('cardNumber', formatCard(e.target.value))} className={`input font-mono ${errors.cardNumber ? 'input-error' : ''}`} placeholder="1234 5678 9012 3456" maxLength={19} data-testid="msf-cardNumber" />
                  {errors.cardNumber && <p className="text-xs text-red-600 mt-1" data-testid="msf-cardNumber-error" role="alert">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="msf-expiry">Expiry *</label>
                  <input id="msf-expiry" type="text" name="expiry" value={data.expiry} onChange={(e) => update('expiry', formatExpiry(e.target.value))} className={`input font-mono ${errors.expiry ? 'input-error' : ''}`} placeholder="MM/YY" maxLength={5} data-testid="msf-expiry" />
                  {errors.expiry && <p className="text-xs text-red-600 mt-1" data-testid="msf-expiry-error" role="alert">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="msf-cvv">CVV *</label>
                  <input id="msf-cvv" type="password" name="cvv" value={data.cvv} onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} className={`input font-mono ${errors.cvv ? 'input-error' : ''}`} placeholder="•••" maxLength={4} data-testid="msf-cvv" />
                  {errors.cvv && <p className="text-xs text-red-600 mt-1" data-testid="msf-cvv-error" role="alert">{errors.cvv}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="section-header">Review & Confirm</h2>
              <p className="section-sub">Check your details before submitting</p>
              <div className="space-y-4">
                {[
                  { label: 'Personal', fields: [['Name', `${data.firstName} ${data.lastName}`], ['Email', data.email], ['Phone', data.phone || '—']] },
                  { label: 'Shipping', fields: [['Address', data.address], ['City/State', `${data.city}, ${data.state} ${data.zip}`], ['Country', data.country]] },
                  { label: 'Payment', fields: [['Card', `**** **** **** ${data.cardNumber.slice(-4)}`], ['Expiry', data.expiry], ['Name', data.cardName]] },
                ].map((section) => (
                  <div key={section.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4" data-testid={`msf-review-${section.label.toLowerCase()}`}>
                    <h3 className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{section.label}</h3>
                    <dl className="space-y-1">
                      {section.fields.map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-sm">
                          <dt className="text-gray-500 w-20 shrink-0">{k}:</dt>
                          <dd className="font-medium text-gray-900 dark:text-gray-100" data-testid={`msf-review-${k.toLowerCase().replace(/\//g, '-')}`}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          {!submitted && (
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={back} disabled={currentStep === 1} className="btn-secondary gap-1.5 disabled:opacity-40" data-testid="msf-back-btn">
                <ChevronLeft size={16} /> Back
              </button>
              {currentStep < 4 ? (
                <button onClick={next} className="btn-primary gap-1.5" data-testid="msf-next-btn">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn-primary gap-1.5" data-testid="msf-submit-btn" aria-busy={loading}>
                  {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting…</> : <>Confirm Order <Check size={16} /></>}
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4" data-testid="msf-step-counter">
          Step <span data-testid="msf-current-step">{currentStep}</span> of <span data-testid="msf-total-steps">4</span>
        </p>
      </div>
    </PageLayout>
  );
}
