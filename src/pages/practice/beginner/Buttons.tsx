import { useState } from 'react';
import { Download, Trash2, Save, Send, RefreshCw, Heart, Bell, Star, ThumbsUp, Copy, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

type BtnState = 'idle' | 'loading' | 'success' | 'error';

function AsyncButton({
  id, label, loadingLabel, successLabel, errorLabel, icon, variant, delay = 1500, failChance = 0,
}: {
  id: string; label: string; loadingLabel: string; successLabel: string; errorLabel: string;
  icon: React.ReactNode; variant: string; delay?: number; failChance?: number;
}) {
  const [state, setState] = useState<BtnState>('idle');

  const handleClick = async () => {
    if (state === 'loading') return;
    setState('loading');
    console.log(`[ClickAndVerify] Button clicked: ${id}`);
    await new Promise((r) => setTimeout(r, delay));
    const fails = Math.random() < failChance;
    setState(fails ? 'error' : 'success');
    console.log(`[ClickAndVerify] Button result: ${id} → ${fails ? 'error' : 'success'}`);
    setTimeout(() => setState('idle'), 3000);
  };

  const classes: Record<BtnState, string> = {
    idle: variant,
    loading: `${variant} opacity-80 cursor-wait`,
    success: 'btn bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    error: 'btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const icons: Record<BtnState, React.ReactNode> = {
    idle: icon,
    loading: <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>,
    success: <CheckCircle size={16} />,
    error: <XCircle size={16} />,
  };

  const labels: Record<BtnState, string> = {
    idle: label, loading: loadingLabel, success: successLabel, error: errorLabel,
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className={classes[state]}
      data-testid={`btn-${id}`}
      data-state={state}
      aria-busy={state === 'loading'}
      aria-label={labels[state]}
    >
      {icons[state]}
      {labels[state]}
    </button>
  );
}

function CounterButton({ id, label, icon, max = 10 }: { id: string; label: string; icon: React.ReactNode; max?: number }) {
  const [count, setCount] = useState(0);
  const pct = (count / max) * 100;
  return (
    <div className="flex flex-col items-center gap-2" data-testid={`counter-${id}-wrapper`}>
      <button
        onClick={() => { setCount((c) => Math.min(c + 1, max)); console.log(`[ClickAndVerify] Counter ${id}:`, count + 1); }}
        disabled={count >= max}
        className={`btn ${count >= max ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700' : 'btn-primary'}`}
        data-testid={`counter-${id}-btn`}
        aria-label={`${label}: ${count} of ${max}`}
      >
        {icon} {label}
      </button>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden" data-testid={`counter-${id}-bar`}>
        <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 font-mono" data-testid={`counter-${id}-count`}>{count} / {max}</span>
    </div>
  );
}

function ToggleButton({ id, label, onLabel, icon, onIcon, color = 'bg-blue-600' }: {
  id: string; label: string; onLabel: string; icon: React.ReactNode; onIcon: React.ReactNode; color?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => { setOn((v) => !v); console.log(`[ClickAndVerify] Toggle ${id}:`, !on); }}
      className={`btn ${on ? `${color} text-white` : 'btn-secondary'} transition-all`}
      data-testid={`toggle-${id}`}
      data-toggled={on}
      aria-pressed={on}
    >
      {on ? onIcon : icon}
      {on ? onLabel : label}
    </button>
  );
}

export default function ButtonsPage() {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [clickLog, setClickLog] = useState<string[]>([]);

  const logClick = (label: string) => {
    setClickLog((prev) => [`${new Date().toLocaleTimeString()} — ${label}`, ...prev].slice(0, 10));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('Copied from ClickAndVerify!').then(() => {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    });
  };

  return (
    <PageLayout
      title="Button States"
      description="Buttons in disabled, loading, success, error, toggle, and counting states."
      difficulty="beginner"
      testId="buttons-page"
      onReset={() => setClickLog([])}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Basic states */}
        <div className="card p-6" data-testid="section-basic-buttons">
          <h2 className="section-header">Basic States</h2>
          <p className="section-sub">Standard button variants and disabled states</p>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" data-testid="btn-primary" onClick={() => logClick('Primary')}>Primary</button>
            <button className="btn-secondary" data-testid="btn-secondary" onClick={() => logClick('Secondary')}>Secondary</button>
            <button className="btn-danger" data-testid="btn-danger" onClick={() => logClick('Danger')}>Danger</button>
            <button className="btn-success" data-testid="btn-success" onClick={() => logClick('Success')}>Success</button>
            <button className="btn-ghost" data-testid="btn-ghost" onClick={() => logClick('Ghost')}>Ghost</button>
            <button className="btn bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500" data-testid="btn-custom" onClick={() => logClick('Custom')}>Custom</button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button disabled className="btn-primary" data-testid="btn-disabled-primary">Disabled Primary</button>
            <button disabled className="btn-secondary" data-testid="btn-disabled-secondary">Disabled Secondary</button>
            <button disabled className="btn-danger" data-testid="btn-disabled-danger">Disabled Danger</button>
          </div>
        </div>

        {/* Sizes */}
        <div className="card p-6" data-testid="section-button-sizes">
          <h2 className="section-header">Sizes</h2>
          <p className="section-sub">Extra-small through extra-large</p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary px-2 py-1 text-xs" data-testid="btn-xs" onClick={() => logClick('XS')}>Extra Small</button>
            <button className="btn-primary text-xs px-3 py-1.5" data-testid="btn-sm" onClick={() => logClick('Small')}>Small</button>
            <button className="btn-primary" data-testid="btn-md" onClick={() => logClick('Medium')}>Medium</button>
            <button className="btn-primary px-6 py-3 text-base" data-testid="btn-lg" onClick={() => logClick('Large')}>Large</button>
            <button className="btn-primary px-8 py-4 text-lg" data-testid="btn-xl" onClick={() => logClick('XL')}>Extra Large</button>
          </div>
        </div>

        {/* Async / state-machine buttons */}
        <div className="card p-6" data-testid="section-async-buttons">
          <h2 className="section-header">Async Action Buttons</h2>
          <p className="section-sub">Click to see loading → success/error transitions (~1.5s each)</p>
          <div className="flex flex-wrap gap-4">
            <AsyncButton id="save" label="Save" loadingLabel="Saving…" successLabel="Saved!" errorLabel="Save Failed" icon={<Save size={16} />} variant="btn-primary" />
            <AsyncButton id="upload" label="Upload" loadingLabel="Uploading…" successLabel="Uploaded!" errorLabel="Upload Failed" icon={<Send size={16} />} variant="btn bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500" delay={2000} />
            <AsyncButton id="delete" label="Delete" loadingLabel="Deleting…" successLabel="Deleted!" errorLabel="Delete Failed" icon={<Trash2 size={16} />} variant="btn-danger" delay={1000} failChance={0.3} />
            <AsyncButton id="download" label="Download" loadingLabel="Downloading…" successLabel="Downloaded!" errorLabel="Failed" icon={<Download size={16} />} variant="btn-secondary" delay={2500} />
            <AsyncButton id="refresh" label="Refresh" loadingLabel="Refreshing…" successLabel="Refreshed!" errorLabel="Timed Out" icon={<RefreshCw size={16} />} variant="btn-ghost border border-gray-300 dark:border-gray-600" delay={800} />
          </div>
          <p className="text-xs text-gray-400 mt-3">⚠ Delete button fails ~30% of the time — practice retry logic!</p>
        </div>

        {/* Toggle buttons */}
        <div className="card p-6" data-testid="section-toggle-buttons">
          <h2 className="section-header">Toggle Buttons</h2>
          <p className="section-sub">Stateful on/off toggles with aria-pressed</p>
          <div className="flex flex-wrap gap-3">
            <ToggleButton id="like" label="Like" onLabel="Liked!" icon={<Heart size={16} />} onIcon={<Heart size={16} className="fill-current" />} color="bg-pink-600" />
            <ToggleButton id="star" label="Star" onLabel="Starred!" icon={<Star size={16} />} onIcon={<Star size={16} className="fill-current" />} color="bg-yellow-500" />
            <ToggleButton id="follow" label="Follow" onLabel="Following" icon={<Bell size={16} />} onIcon={<Bell size={16} className="fill-current" />} color="bg-blue-600" />
            <ToggleButton id="upvote" label="Upvote" onLabel="Upvoted" icon={<ThumbsUp size={16} />} onIcon={<ThumbsUp size={16} className="fill-current" />} color="bg-green-600" />
          </div>
        </div>

        {/* Counter buttons */}
        <div className="card p-6" data-testid="section-counter-buttons">
          <h2 className="section-header">Counter Buttons</h2>
          <p className="section-sub">Click multiple times — becomes disabled when max reached</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <CounterButton id="votes" label="Vote" icon={<ThumbsUp size={14} />} max={5} />
            <CounterButton id="likes" label="Like" icon={<Heart size={14} />} max={3} />
            <CounterButton id="stars" label="Star" icon={<Star size={14} />} max={5} />
            <CounterButton id="notifications" label="Notify" icon={<Bell size={14} />} max={10} />
          </div>
        </div>

        {/* Icon-only / special */}
        <div className="card p-6" data-testid="section-special-buttons">
          <h2 className="section-header">Special Buttons</h2>
          <p className="section-sub">Icon-only, copy, and link-style buttons</p>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" data-testid="btn-icon-only" aria-label="Star this item" onClick={() => logClick('Icon-only')}>
              <Star size={18} />
            </button>
            <button
              onClick={handleCopy}
              className={`btn ${copyState === 'copied' ? 'bg-green-600 text-white' : 'btn-secondary'}`}
              data-testid="btn-copy"
              data-copied={copyState === 'copied'}
              aria-label="Copy to clipboard"
            >
              {copyState === 'copied' ? <><CheckCircle size={15} /> Copied!</> : <><Copy size={15} /> Copy Text</>}
            </button>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" data-testid="btn-link-style" onClick={() => logClick('Link-style')}>Link-style button</button>
            <button className="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 gap-2" data-testid="btn-outline" onClick={() => logClick('Outline')}>
              <AlertCircle size={15} className="text-yellow-500" /> Outline
            </button>
            <button className="btn bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" data-testid="btn-gradient" onClick={() => logClick('Gradient')}>
              ✨ Gradient
            </button>
          </div>
        </div>

        {/* Alert / notification buttons */}
        <div className="card p-6" data-testid="section-notification-buttons">
          <h2 className="section-header">Status / Notification Buttons</h2>
          <p className="section-sub">Buttons with status icons that reflect intent</p>
          <div className="flex flex-wrap gap-3">
            <button className="btn bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" data-testid="btn-status-success" onClick={() => logClick('Status-success')}>
              <CheckCircle size={15} /> Success Action
            </button>
            <button className="btn bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" data-testid="btn-status-error" onClick={() => logClick('Status-error')}>
              <XCircle size={15} /> Error Action
            </button>
            <button className="btn bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800" data-testid="btn-status-warning" onClick={() => logClick('Status-warning')}>
              <AlertCircle size={15} /> Warning Action
            </button>
            <button className="btn bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" data-testid="btn-status-info" onClick={() => logClick('Status-info')}>
              <Info size={15} /> Info Action
            </button>
          </div>
        </div>

        {/* Click log */}
        {clickLog.length > 0 && (
          <div className="card p-4" data-testid="button-click-log">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Click Log</h3>
            <ul className="space-y-1 font-mono text-xs">
              {clickLog.map((entry, i) => (
                <li key={i} className="text-gray-500 dark:text-gray-400" data-testid={`click-log-entry-${i}`}>{entry}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
