import { useState } from 'react';
import PageLayout from '../../../components/layout/PageLayout';

type Fruit = 'apple' | 'banana' | 'cherry' | 'durian' | 'elderberry';
type Color = 'red' | 'green' | 'blue';
type Priority = 'low' | 'medium' | 'high' | 'critical';

interface FormState {
  textInput: string;
  numberInput: string;
  emailInput: string;
  urlInput: string;
  textarea: string;
  rangeValue: number;
  color: Color;
  fruit: Fruit;
  priority: Priority;
  checkboxes: Record<string, boolean>;
  multiSelect: string[];
}

const DEFAULT: FormState = {
  textInput: '',
  numberInput: '',
  emailInput: '',
  urlInput: '',
  textarea: '',
  rangeValue: 50,
  color: 'red',
  fruit: 'apple',
  priority: 'medium',
  checkboxes: { notifications: false, newsletter: false, terms: false, marketing: false },
  multiSelect: [],
};

export default function FormControls() {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [submitted, setSubmitted] = useState(false);

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vals = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm((f) => ({ ...f, multiSelect: vals }));
    console.log('[ClickAndVerify] Multi-select changed:', vals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('[ClickAndVerify] Form Controls submitted:', form);
  };

  return (
    <PageLayout
      title="Form Controls"
      description="Text inputs, checkboxes, radio buttons, and native <select> dropdowns."
      difficulty="beginner"
      testId="form-controls-page"
      onReset={() => { setForm(DEFAULT); setSubmitted(false); }}
    >
      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Text Inputs */}
          <div className="card p-6" data-testid="section-text-inputs">
            <h2 className="section-header">Text Inputs</h2>
            <p className="section-sub">Various input types: text, number, email, URL, textarea</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="fc-text">Text Input</label>
                <input id="fc-text" type="text" className="input" placeholder="Type anything…"
                  value={form.textInput} onChange={(e) => setForm((f) => ({ ...f, textInput: e.target.value }))}
                  data-testid="fc-text-input" name="textInput" />
              </div>
              <div>
                <label className="label" htmlFor="fc-number">Number Input</label>
                <input id="fc-number" type="number" className="input" placeholder="0"
                  value={form.numberInput} onChange={(e) => setForm((f) => ({ ...f, numberInput: e.target.value }))}
                  data-testid="fc-number-input" name="numberInput" min="0" max="999" />
              </div>
              <div>
                <label className="label" htmlFor="fc-email">Email Input</label>
                <input id="fc-email" type="email" className="input" placeholder="you@example.com"
                  value={form.emailInput} onChange={(e) => setForm((f) => ({ ...f, emailInput: e.target.value }))}
                  data-testid="fc-email-input" name="emailInput" />
              </div>
              <div>
                <label className="label" htmlFor="fc-url">URL Input</label>
                <input id="fc-url" type="url" className="input" placeholder="https://example.com"
                  value={form.urlInput} onChange={(e) => setForm((f) => ({ ...f, urlInput: e.target.value }))}
                  data-testid="fc-url-input" name="urlInput" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fc-textarea">Textarea</label>
                <textarea id="fc-textarea" rows={3} className="input resize-y" placeholder="Enter multi-line text…"
                  value={form.textarea} onChange={(e) => setForm((f) => ({ ...f, textarea: e.target.value }))}
                  data-testid="fc-textarea" name="textarea" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fc-range">
                  Range Slider — Value: <span data-testid="fc-range-value" className="font-mono text-blue-600 dark:text-blue-400">{form.rangeValue}</span>
                </label>
                <input id="fc-range" type="range" min={0} max={100} step={5}
                  value={form.rangeValue}
                  onChange={(e) => { setForm((f) => ({ ...f, rangeValue: Number(e.target.value) })); console.log('[ClickAndVerify] Range:', e.target.value); }}
                  className="w-full accent-blue-600" data-testid="fc-range-input" name="rangeValue" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>100</span></div>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="card p-6" data-testid="section-checkboxes">
            <h2 className="section-header">Checkboxes</h2>
            <p className="section-sub">Standard checkboxes with labels and accessible IDs</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(form.checkboxes).map(([key, val]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  data-testid={`fc-checkbox-label-${key}`}>
                  <input
                    type="checkbox"
                    id={`fc-checkbox-${key}`}
                    name={key}
                    checked={val}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, checkboxes: { ...f.checkboxes, [key]: e.target.checked } }));
                      console.log(`[ClickAndVerify] Checkbox ${key}:`, e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    data-testid={`fc-checkbox-${key}`}
                  />
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  {val && <span className="ml-auto text-green-500 text-xs font-mono" data-testid={`fc-checkbox-${key}-checked`}>✓</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="card p-6" data-testid="section-radio">
            <h2 className="section-header">Radio Buttons</h2>
            <p className="section-sub">Mutually exclusive selection within a group</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <fieldset>
                <legend className="label mb-2">Favourite Color</legend>
                <div className="space-y-2" role="radiogroup" aria-label="Favourite color">
                  {(['red', 'green', 'blue'] as Color[]).map((c) => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer" data-testid={`fc-radio-color-label-${c}`}>
                      <input
                        type="radio"
                        name="color"
                        value={c}
                        checked={form.color === c}
                        onChange={() => { setForm((f) => ({ ...f, color: c })); console.log('[ClickAndVerify] Color radio:', c); }}
                        className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        data-testid={`fc-radio-color-${c}`}
                        id={`fc-radio-color-${c}`}
                      />
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full ${c === 'red' ? 'bg-red-500' : c === 'green' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        {c}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="label mb-2">Priority Level</legend>
                <div className="space-y-2" role="radiogroup" aria-label="Priority level">
                  {(['low', 'medium', 'high', 'critical'] as Priority[]).map((p) => (
                    <label key={p} className="flex items-center gap-3 cursor-pointer" data-testid={`fc-radio-priority-label-${p}`}>
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={form.priority === p}
                        onChange={() => { setForm((f) => ({ ...f, priority: p })); console.log('[ClickAndVerify] Priority radio:', p); }}
                        className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        data-testid={`fc-radio-priority-${p}`}
                        id={`fc-radio-priority-${p}`}
                      />
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{p}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="card p-6" data-testid="section-dropdowns">
            <h2 className="section-header">Native Dropdowns</h2>
            <p className="section-sub">Standard HTML select elements — single and multi-select</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="fc-select-fruit">Single Select</label>
                <select
                  id="fc-select-fruit"
                  name="fruit"
                  value={form.fruit}
                  onChange={(e) => { setForm((f) => ({ ...f, fruit: e.target.value as Fruit })); console.log('[ClickAndVerify] Fruit select:', e.target.value); }}
                  className="input"
                  data-testid="fc-select-fruit"
                >
                  {(['apple', 'banana', 'cherry', 'durian', 'elderberry'] as Fruit[]).map((f) => (
                    <option key={f} value={f} data-testid={`fc-option-${f}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="fc-select-multi">Multi-Select <span className="text-gray-400 text-xs">(Ctrl/Cmd+click)</span></label>
                <select
                  id="fc-select-multi"
                  name="multiSelect"
                  multiple
                  size={5}
                  value={form.multiSelect}
                  onChange={handleMultiSelect}
                  className="input h-auto"
                  data-testid="fc-select-multi"
                >
                  {['JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust'].map((lang) => (
                    <option key={lang} value={lang} data-testid={`fc-multi-option-${lang.toLowerCase()}`}>{lang}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1" data-testid="fc-multi-selected">
                  Selected: {form.multiSelect.length > 0 ? form.multiSelect.join(', ') : 'none'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="btn-primary w-full"
            data-testid="fc-submit"
          >
            Submit Form
          </button>

          {submitted && (
            <div
              className="card p-4 border-l-4 border-green-500"
              data-testid="fc-submitted-values"
              role="status"
              aria-live="polite"
            >
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Submitted Values</h3>
              <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(form, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Summary panel */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20" data-testid="fc-live-summary">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Live Summary</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Text:</span>
                <span className="text-gray-800 dark:text-gray-200 truncate max-w-[120px]" data-testid="summary-text">{form.textInput || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Number:</span>
                <span className="text-gray-800 dark:text-gray-200" data-testid="summary-number">{form.numberInput || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Range:</span>
                <span className="text-blue-600 dark:text-blue-400" data-testid="summary-range">{form.rangeValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Color:</span>
                <span className="capitalize text-gray-800 dark:text-gray-200" data-testid="summary-color">{form.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Priority:</span>
                <span className="capitalize text-gray-800 dark:text-gray-200" data-testid="summary-priority">{form.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fruit:</span>
                <span className="capitalize text-gray-800 dark:text-gray-200" data-testid="summary-fruit">{form.fruit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Checks:</span>
                <span className="text-gray-800 dark:text-gray-200" data-testid="summary-checkboxes">
                  {Object.entries(form.checkboxes).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Multi:</span>
                <span className="text-gray-800 dark:text-gray-200" data-testid="summary-multi">
                  {form.multiSelect.join(', ') || 'none'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
