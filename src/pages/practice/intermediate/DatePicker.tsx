import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function pad2(n: number) { return String(n).padStart(2, '0'); }
function formatDate(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function parseDate(s: string): Date | null { const d = new Date(s + 'T00:00:00'); return isNaN(d.getTime()) ? null : d; }

interface CalendarWidgetProps { value: Date | null; onChange: (d: Date) => void; minDate?: Date; maxDate?: Date; id: string; }

function CalendarWidget({ value, onChange, minDate, maxDate, id }: CalendarWidgetProps) {
  const today = new Date();
  const [view, setView] = useState({ year: value?.getFullYear() ?? today.getFullYear(), month: value?.getMonth() ?? today.getMonth() });

  const daysInMonth = getDaysInMonth(view.year, view.month);
  const firstDay = getFirstDayOfMonth(view.year, view.month);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const isSelected = (day: number) => value && value.getFullYear() === view.year && value.getMonth() === view.month && value.getDate() === day;
  const isToday = (day: number) => today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day;
  const isDisabled = (day: number) => {
    const d = new Date(view.year, view.month, day);
    return (minDate && d < minDate) || (maxDate && d > maxDate) || false;
  };

  const prevMonth = () => setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () => setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-72 p-4" data-testid={`calendar-${id}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400" data-testid={`cal-prev-${id}`} aria-label="Previous month"><ChevronLeft size={16} /></button>
        <div className="flex gap-2">
          <select value={view.month} onChange={(e) => setView((v) => ({ ...v, month: Number(e.target.value) }))} className="text-sm font-semibold bg-transparent text-gray-800 dark:text-gray-200 cursor-pointer" data-testid={`cal-month-select-${id}`} aria-label="Month">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={view.year} onChange={(e) => setView((v) => ({ ...v, year: Number(e.target.value) }))} className="text-sm font-semibold bg-transparent text-gray-800 dark:text-gray-200 cursor-pointer" data-testid={`cal-year-select-${id}`} aria-label="Year">
            {Array.from({ length: 20 }, (_, i) => today.getFullYear() - 5 + i).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400" data-testid={`cal-next-${id}`} aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5" data-testid={`cal-grid-${id}`} role="grid" aria-label="Calendar grid">
        {cells.map((day, idx) => (
          <div key={idx} role="gridcell">
            {day ? (
              <button
                onClick={() => { if (!isDisabled(day)) onChange(new Date(view.year, view.month, day)); }}
                disabled={isDisabled(day) || false}
                className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors ${
                  isSelected(day) ? 'bg-blue-600 text-white font-semibold' :
                  isToday(day) ? 'border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold' :
                  isDisabled(day) ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                  'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                data-testid={`cal-day-${view.year}-${pad2(view.month + 1)}-${pad2(day)}-${id}`}
                aria-label={`${day} ${MONTHS[view.month]} ${view.year}${isSelected(day) ? ' (selected)' : ''}${isToday(day) ? ' (today)' : ''}`}
                aria-selected={!!isSelected(day)}
                aria-disabled={isDisabled(day) || false}
              >
                {day}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>
      <button
        onClick={() => { onChange(today); setView({ year: today.getFullYear(), month: today.getMonth() }); }}
        className="mt-3 w-full text-xs text-blue-600 dark:text-blue-400 hover:underline"
        data-testid={`cal-today-${id}`}
      >
        Go to today
      </button>
    </div>
  );
}

function DateInput({ id, label, value, onChange, minDate, maxDate, required }: {
  id: string; label: string; value: Date | null; onChange: (d: Date | null) => void; minDate?: Date; maxDate?: Date; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [textVal, setTextVal] = useState(value ? formatDate(value) : '');

  useEffect(() => { setTextVal(value ? formatDate(value) : ''); }, [value]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative" data-testid={`datepicker-${id}`}>
      <label htmlFor={`dp-input-${id}`} className="label">{label}{required && ' *'}</label>
      <div className="relative">
        <input
          id={`dp-input-${id}`}
          type="text"
          value={textVal}
          onChange={(e) => {
            setTextVal(e.target.value);
            const d = parseDate(e.target.value);
            if (d) onChange(d);
          }}
          onFocus={() => setOpen(true)}
          className="input pr-10"
          placeholder="YYYY-MM-DD"
          data-testid={`datepicker-input-${id}`}
          aria-haspopup="true"
          aria-expanded={open}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
          data-testid={`datepicker-trigger-${id}`}
          aria-label="Open calendar"
        >
          <CalendarIcon size={16} />
        </button>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(null); setTextVal(''); }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400"
            data-testid={`datepicker-clear-${id}`}
            aria-label="Clear date"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {value && (
        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1" data-testid={`datepicker-selected-${id}`}>
          Selected: {value.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
      {open && (
        <div className="absolute z-40 mt-1 left-0" data-testid={`datepicker-popup-${id}`}>
          <CalendarWidget
            id={id}
            value={value}
            onChange={(d) => { onChange(d); setOpen(false); console.log(`[ClickAndVerify] Date selected (${id}):`, formatDate(d)); }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  );
}

export default function DatePickerPage() {
  const today = new Date();
  const [single, setSingle] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [birth, setBirth] = useState<Date | null>(null);
  const [future, setFuture] = useState<Date | null>(null);

  return (
    <PageLayout title="Date Picker" description="Calendar widget with type-in, click-to-select, range, and restricted date support." difficulty="intermediate" testId="date-picker-page"
      onReset={() => { setSingle(null); setRangeStart(null); setRangeEnd(null); setBirth(null); setFuture(null); }}>
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="card p-6" data-testid="section-single-date">
          <h2 className="section-header">Single Date Picker</h2>
          <p className="section-sub">Click the calendar icon or type a date (YYYY-MM-DD). Click "Go to today" in the picker.</p>
          <DateInput id="single" label="Select a date" value={single} onChange={setSingle} />
        </div>

        <div className="card p-6" data-testid="section-date-range">
          <h2 className="section-header">Date Range</h2>
          <p className="section-sub">Select a start and end date. End date can't be before start date.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <DateInput id="range-start" label="Start Date" value={rangeStart} onChange={(d) => { setRangeStart(d); if (d && rangeEnd && d > rangeEnd) setRangeEnd(null); }} />
            <DateInput id="range-end" label="End Date" value={rangeEnd} onChange={setRangeEnd} minDate={rangeStart ?? undefined} />
          </div>
          {rangeStart && rangeEnd && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm" data-testid="date-range-summary">
              <span className="text-blue-700 dark:text-blue-400">
                Range: <span className="font-mono font-semibold" data-testid="date-range-start">{formatDate(rangeStart)}</span>
                {' → '}
                <span className="font-mono font-semibold" data-testid="date-range-end">{formatDate(rangeEnd)}</span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                (<span data-testid="date-range-days">{Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000)}</span> days)
              </span>
            </div>
          )}
        </div>

        <div className="card p-6" data-testid="section-restricted-dates">
          <h2 className="section-header">Restricted Dates</h2>
          <p className="section-sub">Birthdate (max: today) and future event (min: tomorrow)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <DateInput id="birthdate" label="Date of Birth" value={birth} onChange={setBirth} maxDate={today} />
            <DateInput id="future-event" label="Schedule Future Event" value={future} onChange={setFuture}
              minDate={new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
