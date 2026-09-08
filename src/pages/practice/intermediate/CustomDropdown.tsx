import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Option { value: string; label: string; group?: string; disabled?: boolean; }

const COUNTRIES: Option[] = [
  { value: 'us', label: 'United States', group: 'Americas' },
  { value: 'ca', label: 'Canada', group: 'Americas' },
  { value: 'br', label: 'Brazil', group: 'Americas' },
  { value: 'mx', label: 'Mexico', group: 'Americas' },
  { value: 'gb', label: 'United Kingdom', group: 'Europe' },
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'es', label: 'Spain', group: 'Europe' },
  { value: 'it', label: 'Italy', group: 'Europe' },
  { value: 'nl', label: 'Netherlands', group: 'Europe' },
  { value: 'jp', label: 'Japan', group: 'Asia' },
  { value: 'cn', label: 'China', group: 'Asia' },
  { value: 'in', label: 'India', group: 'Asia' },
  { value: 'kr', label: 'South Korea', group: 'Asia' },
  { value: 'au', label: 'Australia', group: 'Oceania' },
  { value: 'nz', label: 'New Zealand', group: 'Oceania' },
  { value: 'zz', label: 'Restricted Region', group: 'Other', disabled: true },
];

const SKILLS: Option[] = [
  { value: 'selenium', label: 'Selenium' }, { value: 'playwright', label: 'Playwright' },
  { value: 'cypress', label: 'Cypress' }, { value: 'jest', label: 'Jest' },
  { value: 'pytest', label: 'PyTest' }, { value: 'junit', label: 'JUnit' },
  { value: 'restassured', label: 'REST Assured' }, { value: 'postman', label: 'Postman' },
  { value: 'k6', label: 'k6' }, { value: 'gatling', label: 'Gatling' },
  { value: 'appium', label: 'Appium' }, { value: 'detox', label: 'Detox' },
];

interface DropdownProps {
  id: string; options: Option[]; value: string | string[]; onChange: (v: string | string[]) => void;
  placeholder?: string; multi?: boolean; searchable?: boolean; grouped?: boolean;
}

function Dropdown({ id, options, value, onChange, placeholder = 'Select…', multi = false, searchable = false, grouped = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { if (open && searchable && inputRef.current) inputRef.current.focus(); }, [open, searchable]);

  const filtered = options.filter((o) => !query || o.label.toLowerCase().includes(query.toLowerCase()));

  const isSelected = (v: string) => multi ? (value as string[]).includes(v) : value === v;

  const select = useCallback((opt: Option) => {
    if (opt.disabled) return;
    if (multi) {
      const arr = value as string[];
      const next = arr.includes(opt.value) ? arr.filter((v) => v !== opt.value) : [...arr, opt.value];
      onChange(next);
      console.log(`[ClickAndVerify] Multi-select ${id}:`, next);
    } else {
      onChange(opt.value);
      setOpen(false);
      setQuery('');
      console.log(`[ClickAndVerify] Dropdown ${id}:`, opt.value);
    }
  }, [multi, value, onChange, id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) { setOpen(true); e.preventDefault(); return; }
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1); return; }
    if (e.key === 'ArrowDown') { setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); e.preventDefault(); }
    if (e.key === 'ArrowUp') { setActiveIdx((i) => Math.max(i - 1, 0)); e.preventDefault(); }
    if (e.key === 'Enter' && activeIdx >= 0) { select(filtered[activeIdx]); e.preventDefault(); }
  };

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const item = listRef.current.children[activeIdx] as HTMLElement;
      item?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [activeIdx]);

  const displayLabel = multi
    ? (value as string[]).length === 0 ? placeholder : `${(value as string[]).length} selected`
    : options.find((o) => o.value === value)?.label || placeholder;

  const groups = grouped ? [...new Set(filtered.map((o) => o.group || ''))] : null;

  return (
    <div ref={ref} className="relative" data-testid={`dropdown-${id}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`input flex items-center justify-between gap-2 cursor-pointer text-left w-full ${open ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
        data-testid={`dropdown-${id}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${id} dropdown`}
      >
        <span className={`truncate ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'}`} data-testid={`dropdown-${id}-value`}>
          {displayLabel}
        </span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {multi && (value as string[]).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2" data-testid={`dropdown-${id}-tags`}>
          {(value as string[]).map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <span key={v} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full" data-testid={`dropdown-${id}-tag-${v}`}>
                {opt?.label}
                <button type="button" onClick={() => select(opt!)} className="hover:text-blue-900 dark:hover:text-blue-200" aria-label={`Remove ${opt?.label}`} data-testid={`dropdown-${id}-remove-${v}`}><X size={11} /></button>
              </span>
            );
          })}
          <button type="button" onClick={() => onChange([])} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" data-testid={`dropdown-${id}-clear`}>Clear all</button>
        </div>
      )}

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-fade-in max-h-64 flex flex-col" data-testid={`dropdown-${id}-menu`}>
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                  className="input py-1.5 pl-8 text-sm"
                  placeholder="Search…"
                  data-testid={`dropdown-${id}-search`}
                  aria-label="Search options"
                />
              </div>
            </div>
          )}
          <ul ref={listRef} role="listbox" aria-label={`${id} options`} aria-multiselectable={multi} className="overflow-y-auto py-1 flex-1" data-testid={`dropdown-${id}-list`}>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400" data-testid={`dropdown-${id}-no-results`}>No options found</li>
            ) : grouped && groups ? (
              groups.map((group) => (
                <div key={group}>
                  <p className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{group}</p>
                  {filtered.filter((o) => (o.group || '') === group).map((opt, i) => {
                    const globalIdx = filtered.indexOf(opt);
                    return (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected(opt.value)}
                        aria-disabled={opt.disabled}
                        onClick={() => !opt.disabled && select(opt)}
                        className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${opt.disabled ? 'opacity-40 cursor-not-allowed' : globalIdx === activeIdx ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} ${isSelected(opt.value) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-900 dark:text-gray-100'}`}
                        data-testid={`dropdown-${id}-option-${opt.value}`}
                      >
                        {opt.label}
                        {isSelected(opt.value) && <Check size={14} />}
                      </li>
                    );
                  })}
                </div>
              ))
            ) : (
              filtered.map((opt, i) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected(opt.value)}
                  aria-disabled={opt.disabled}
                  onClick={() => !opt.disabled && select(opt)}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${opt.disabled ? 'opacity-40 cursor-not-allowed' : i === activeIdx ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} ${isSelected(opt.value) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-900 dark:text-gray-100'}`}
                  data-testid={`dropdown-${id}-option-${opt.value}`}
                >
                  {opt.label}
                  {isSelected(opt.value) && <Check size={14} />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CustomDropdownPage() {
  const [country, setCountry] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [simple, setSimple] = useState('');

  return (
    <PageLayout title="Custom Dropdown / Autocomplete" description="Non-native dropdowns with keyboard navigation, search, grouped options, and multi-select." difficulty="intermediate" testId="custom-dropdown-page"
      onReset={() => { setCountry(''); setSkills([]); setSimple(''); }}>
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="card p-6" data-testid="section-simple-dropdown">
          <h2 className="section-header">Simple Dropdown</h2>
          <p className="section-sub">Click to open, keyboard arrows to navigate, Enter to select, Escape to close</p>
          <Dropdown id="simple" options={[
            { value: 'a', label: 'Option Alpha' }, { value: 'b', label: 'Option Beta' },
            { value: 'c', label: 'Option Gamma' }, { value: 'd', label: 'Option Delta', disabled: true },
            { value: 'e', label: 'Option Epsilon' },
          ]} value={simple} onChange={(v) => setSimple(v as string)} placeholder="Choose an option…" />
          {simple && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Selected: <span className="font-mono font-semibold text-blue-600 dark:text-blue-400" data-testid="simple-selected">{simple}</span></p>}
        </div>

        <div className="card p-6" data-testid="section-searchable-grouped-dropdown">
          <h2 className="section-header">Searchable + Grouped Dropdown</h2>
          <p className="section-sub">Type to filter options, grouped by region. One disabled option.</p>
          <Dropdown id="country" options={COUNTRIES} value={country} onChange={(v) => setCountry(v as string)} placeholder="Search country…" searchable grouped />
          {country && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Selected: <span className="font-semibold text-blue-600 dark:text-blue-400" data-testid="country-selected">{COUNTRIES.find((c) => c.value === country)?.label}</span></p>}
        </div>

        <div className="card p-6" data-testid="section-multi-select-dropdown">
          <h2 className="section-header">Multi-Select Dropdown</h2>
          <p className="section-sub">Click multiple items to select them. Tags appear below. Click X or "Clear all" to deselect.</p>
          <Dropdown id="skills" options={SKILLS} value={skills} onChange={(v) => setSkills(v as string[])} placeholder="Select skills…" multi searchable />
          {skills.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              <span className="font-semibold" data-testid="skills-count">{skills.length}</span> skill{skills.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="card p-5" data-testid="keyboard-hints">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            {[['Enter / Space', 'Open dropdown'], ['↓ / ↑', 'Navigate options'], ['Enter', 'Select focused option'], ['Escape', 'Close dropdown'], ['Tab', 'Move focus out']].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <kbd className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">{k}</kbd>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
