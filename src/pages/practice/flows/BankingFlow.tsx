import { useState, useMemo } from 'react';
import {
  ArrowLeftRight, Send, Receipt, FileText, TrendingUp,
  TrendingDown, DollarSign, CreditCard, Shield, Bell,
  ChevronRight, ArrowLeft, CheckCircle, AlertTriangle,
  Plus, Minus, Eye, EyeOff, Download, Search, Filter,
  Building, Smartphone, Globe, Clock, Lock, RefreshCw,
  PiggyBank, Landmark, BarChart3, Wallet, ArrowUpRight,
  ArrowDownLeft, Settings, LogOut, User, ChevronDown, X, ArrowRight
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type BankScreen =
  | 'dashboard'
  | 'transfer'
  | 'transfer-confirm'
  | 'transfer-success'
  | 'billpay'
  | 'billpay-confirm'
  | 'billpay-success'
  | 'statement'
  | 'loan'
  | 'loan-result';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  category: string;
  amount: number;
  date: string;
  balance: number;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface Account {
  id: string;
  name: string;
  number: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  available: number;
  currency: string;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_ACCOUNTS: Account[] = [
  { id: 'chk001', name: 'Primary Checking', number: '****4521', type: 'checking', balance: 8425.63, available: 8425.63, currency: 'USD', color: 'from-blue-600 to-blue-800' },
  { id: 'sav001', name: 'High-Yield Savings', number: '****7890', type: 'savings', balance: 24310.00, available: 24310.00, currency: 'USD', color: 'from-green-500 to-green-700' },
  { id: 'crd001', name: 'Platinum Credit Card', number: '****1234', type: 'credit', balance: -1240.50, available: 8759.50, currency: 'USD', color: 'from-purple-600 to-purple-900' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'txn001', type: 'debit', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, date: '2026-09-08', balance: 8425.63, status: 'completed', reference: 'REF20260908001' },
  { id: 'txn002', type: 'credit', description: 'Salary Deposit — TechCorp', category: 'Income', amount: 3500.00, date: '2026-09-07', balance: 8441.62, status: 'completed', reference: 'REF20260907002' },
  { id: 'txn003', type: 'debit', description: 'Whole Foods Market', category: 'Groceries', amount: 87.43, date: '2026-09-06', balance: 4941.62, status: 'completed', reference: 'REF20260906003' },
  { id: 'txn004', type: 'debit', description: 'Amazon Prime', category: 'Shopping', amount: 14.99, date: '2026-09-05', balance: 5029.05, status: 'completed', reference: 'REF20260905004' },
  { id: 'txn005', type: 'debit', description: 'Starbucks Coffee', category: 'Food & Drink', amount: 6.75, date: '2026-09-05', balance: 5044.04, status: 'completed', reference: 'REF20260905005' },
  { id: 'txn006', type: 'credit', description: 'Freelance Payment — DesignCo', category: 'Income', amount: 500.00, date: '2026-09-04', balance: 5050.79, status: 'completed', reference: 'REF20260904006' },
  { id: 'txn007', type: 'debit', description: 'Electric Bill — PowerGrid', category: 'Utilities', amount: 112.00, date: '2026-09-03', balance: 4550.79, status: 'completed', reference: 'REF20260903007' },
  { id: 'txn008', type: 'debit', description: 'Gym Membership — FitLife', category: 'Health', amount: 49.99, date: '2026-09-02', balance: 4662.79, status: 'completed', reference: 'REF20260902008' },
  { id: 'txn009', type: 'debit', description: 'Uber Ride', category: 'Transport', amount: 23.50, date: '2026-09-01', balance: 4712.78, status: 'completed', reference: 'REF20260901009' },
  { id: 'txn010', type: 'credit', description: 'Refund — AppStore', category: 'Refund', amount: 9.99, date: '2026-08-31', balance: 4736.28, status: 'pending', reference: 'REF20260831010' },
  { id: 'txn011', type: 'debit', description: 'Internet — FiberNet', category: 'Utilities', amount: 59.99, date: '2026-08-30', balance: 4726.29, status: 'completed', reference: 'REF20260830011' },
  { id: 'txn012', type: 'debit', description: 'Spotify', category: 'Entertainment', amount: 9.99, date: '2026-08-29', balance: 4786.28, status: 'completed', reference: 'REF20260829012' },
];

const PAYEES = [
  { id: 'p1', name: 'City Electric Co.', category: 'Utilities', accountNumber: '7821-004', logo: '⚡' },
  { id: 'p2', name: 'FiberNet Internet', category: 'Utilities', accountNumber: '3310-998', logo: '🌐' },
  { id: 'p3', name: 'City Water Authority', category: 'Utilities', accountNumber: '5512-331', logo: '💧' },
  { id: 'p4', name: 'Netflix', category: 'Entertainment', accountNumber: 'NF-8821', logo: '📺' },
  { id: 'p5', name: 'Mortgage — HomeBank', category: 'Housing', accountNumber: 'MTG-2246', logo: '🏠' },
  { id: 'p6', name: 'Car Insurance — SafeDrive', category: 'Insurance', accountNumber: 'POL-9901', logo: '🚗' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Income: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Groceries: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shopping: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Utilities: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Food & Drink': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Transport: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Health: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Refund: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Housing: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-400',
  Insurance: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

// ─── Helper ────────────────────────────────────────────────────────────────────
function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n));
}

// ─── Account Card ─────────────────────────────────────────────────────────────
function AccountCard({ account, selected, onClick, showFull }: {
  account: Account; selected?: boolean; onClick?: () => void; showFull?: boolean;
}) {
  const [hidden, setHidden] = useState(true);
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${account.color} text-white rounded-2xl p-5 cursor-pointer transition-all duration-200 ${selected ? 'ring-4 ring-white/50 scale-105 shadow-xl' : 'hover:scale-102 hover:shadow-lg'}`}
      data-testid={`bank-account-card-${account.id}`}
      data-account-type={account.type}
      data-selected={selected}
      role={onClick ? 'button' : undefined}
      aria-pressed={selected}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{account.type}</p>
          <p className="font-bold text-lg mt-0.5" data-testid={`bank-account-name-${account.id}`}>{account.name}</p>
        </div>
        <Landmark size={24} className="text-white/40" />
      </div>
      <p className="font-mono text-sm tracking-wider text-white/80 mb-4" data-testid={`bank-account-number-${account.id}`}>
        {account.number}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/60 text-xs mb-0.5">
            {account.type === 'credit' ? 'Outstanding Balance' : 'Available Balance'}
          </p>
          <p className="text-2xl font-black" data-testid={`bank-account-balance-${account.id}`}>
            {showFull || !hidden ? formatCurrency(account.balance) : '••••••'}
          </p>
        </div>
        {!showFull && (
          <button
            onClick={e => { e.stopPropagation(); setHidden(h => !h); }}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            data-testid={`bank-toggle-balance-${account.id}`}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
          >
            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ accounts, transactions, onNavigate }: {
  accounts: Account[];
  transactions: Transaction[];
  onNavigate: (s: BankScreen) => void;
}) {
  const totalAssets = accounts.filter(a => a.type !== 'credit').reduce((s, a) => s + a.balance, 0);
  const totalDebt = accounts.filter(a => a.type === 'credit').reduce((s, a) => s + Math.abs(a.balance), 0);
  const recent = transactions.slice(0, 5);
  const thisMonthSpend = transactions.filter(t => t.type === 'debit' && t.date.startsWith('2026-09')).reduce((s, t) => s + t.amount, 0);

  const quickActions = [
    { label: 'Transfer', icon: <ArrowLeftRight size={20} />, screen: 'transfer' as BankScreen, color: 'bg-blue-600', testId: 'bank-quick-transfer' },
    { label: 'Pay Bill', icon: <Receipt size={20} />, screen: 'billpay' as BankScreen, color: 'bg-green-600', testId: 'bank-quick-billpay' },
    { label: 'Statement', icon: <FileText size={20} />, screen: 'statement' as BankScreen, color: 'bg-purple-600', testId: 'bank-quick-statement' },
    { label: 'Loan', icon: <Landmark size={20} />, screen: 'loan' as BankScreen, color: 'bg-orange-500', testId: 'bank-quick-loan' },
  ];

  return (
    <div data-testid="bank-dashboard">
      {/* Net worth summary */}
      <div className="grid grid-cols-3 gap-4 mb-6" data-testid="bank-net-summary">
        {[
          { label: 'Total Assets', value: formatCurrency(totalAssets), icon: <TrendingUp size={16} />, color: 'text-green-600 dark:text-green-400', testId: 'bank-total-assets' },
          { label: 'Total Debt', value: formatCurrency(totalDebt), icon: <TrendingDown size={16} />, color: 'text-red-500', testId: 'bank-total-debt' },
          { label: 'Sep Spending', value: formatCurrency(thisMonthSpend), icon: <BarChart3 size={16} />, color: 'text-orange-500', testId: 'bank-month-spend' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4" data-testid={s.testId}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${s.color}`}>{s.icon}{s.label}</div>
            <p className="text-lg font-black text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Accounts */}
      <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wide">My Accounts</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-6" data-testid="bank-accounts-list">
        {accounts.map(acc => <AccountCard key={acc.id} account={acc} />)}
      </div>

      {/* Quick actions */}
      <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm uppercase tracking-wide">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3 mb-6" data-testid="bank-quick-actions">
        {quickActions.map(a => (
          <button
            key={a.label}
            onClick={() => { onNavigate(a.screen); console.log(`[ClickAndVerify] Bank: Navigate to ${a.screen}`); }}
            className={`${a.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 hover:opacity-90 active:scale-95 transition-all`}
            data-testid={a.testId}
          >
            {a.icon}
            <span className="text-xs font-semibold">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Spending chart (mock bars) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6" data-testid="bank-spending-chart">
        <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-blue-500" /> Monthly Spending</h2>
        <div className="flex items-end gap-2 h-24" data-testid="bank-chart-bars">
          {[
            { month: 'Apr', amount: 1850, color: 'bg-blue-200 dark:bg-blue-900/40' },
            { month: 'May', amount: 2100, color: 'bg-blue-200 dark:bg-blue-900/40' },
            { month: 'Jun', amount: 1680, color: 'bg-blue-200 dark:bg-blue-900/40' },
            { month: 'Jul', amount: 2340, color: 'bg-blue-200 dark:bg-blue-900/40' },
            { month: 'Aug', amount: 1920, color: 'bg-blue-200 dark:bg-blue-900/40' },
            { month: 'Sep', amount: thisMonthSpend, color: 'bg-blue-600' },
          ].map(b => (
            <div key={b.month} className="flex-1 flex flex-col items-center gap-1" data-testid={`bank-chart-bar-${b.month.toLowerCase()}`} data-amount={b.amount.toFixed(0)}>
              <span className="text-xs text-gray-400">${(b.amount / 1000).toFixed(1)}k</span>
              <div className={`w-full rounded-t-lg ${b.color} transition-all`} style={{ height: `${(b.amount / 2500) * 72}px` }} />
              <span className="text-xs text-gray-500">{b.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" data-testid="bank-recent-transactions">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">Recent Transactions</h2>
          <button onClick={() => onNavigate('statement')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline" data-testid="bank-view-all-txn">View All</button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recent.map(txn => (
            <div key={txn.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" data-testid={`bank-txn-${txn.id}`} data-type={txn.type}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                {txn.type === 'credit' ? <ArrowDownLeft size={15} className="text-green-600 dark:text-green-400" /> : <ArrowUpRight size={15} className="text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" data-testid={`bank-txn-desc-${txn.id}`}>{txn.description}</p>
                <p className="text-xs text-gray-400">{txn.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm ${txn.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`} data-testid={`bank-txn-amount-${txn.id}`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                </p>
                <span className={`text-xs ${txn.status === 'pending' ? 'text-yellow-500' : 'text-gray-400'}`} data-testid={`bank-txn-status-${txn.id}`}>{txn.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Transfer ─────────────────────────────────────────────────────────────────
function Transfer({ accounts, onSuccess, onBack, addTransaction }: {
  accounts: Account[];
  onSuccess: () => void;
  onBack: () => void;
  addTransaction: (txn: Transaction) => void;
}) {
  const [screen, setScreen] = useState<'form' | 'confirm' | 'success'>('form');
  const [fromId, setFromId] = useState(accounts[0].id);
  const [toId, setToId] = useState(accounts[1].id);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferType, setTransferType] = useState<'own' | 'external'>('own');
  const [extName, setExtName] = useState('');
  const [extAccount, setExtAccount] = useState('');
  const [extRouting, setExtRouting] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [txnRef] = useState(`TXN${Date.now().toString().slice(-8)}`);

  const fromAccount = accounts.find(a => a.id === fromId)!;
  const toAccount = accounts.find(a => a.id === toId);
  const amtNum = parseFloat(amount);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(amtNum) || amtNum <= 0) e.amount = 'Enter a valid amount';
    else if (amtNum > fromAccount.available) e.amount = `Exceeds available balance (${formatCurrency(fromAccount.available)})`;
    else if (amtNum > 10000) e.amount = 'Single transfer limit is $10,000';
    if (transferType === 'own' && fromId === toId) e.to = 'From and To accounts must be different';
    if (transferType === 'external') {
      if (!extName.trim()) e.extName = 'Recipient name required';
      if (!extAccount.trim()) e.extAccount = 'Account number required';
      if (!extRouting.trim()) e.extRouting = 'Routing number required';
      else if (!/^\d{9}$/.test(extRouting)) e.extRouting = 'Must be 9 digits';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = () => { if (validate()) setScreen('confirm'); };

  const execute = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addTransaction({
      id: txnRef, type: 'debit',
      description: transferType === 'own' ? `Transfer to ${toAccount?.name}` : `Transfer to ${extName}`,
      category: 'Transfer', amount: amtNum,
      date: new Date().toISOString().slice(0, 10),
      balance: fromAccount.balance - amtNum,
      status: 'completed', reference: txnRef,
    });
    setLoading(false);
    setScreen('success');
    console.log(`[ClickAndVerify] Bank: Transfer ${formatCurrency(amtNum)} from ${fromId} — ref ${txnRef}`);
  };

  if (screen === 'success') {
    return (
      <div className="text-center py-10 max-w-md mx-auto" data-testid="bank-transfer-success">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1" data-testid="bank-transfer-success-title">Transfer Successful!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-1 text-sm">Your transfer has been processed.</p>
        <p className="font-mono text-blue-600 dark:text-blue-400 text-sm mb-4" data-testid="bank-transfer-ref">Ref: {txnRef}</p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left text-sm mb-6 space-y-2" data-testid="bank-transfer-summary">
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900 dark:text-gray-100" data-testid="bank-transfer-summary-amount">{formatCurrency(amtNum)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">From</span><span className="text-gray-700 dark:text-gray-300">{fromAccount.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">To</span><span className="text-gray-700 dark:text-gray-300">{transferType === 'own' ? toAccount?.name : extName}</span></div>
          {note && <div className="flex justify-between"><span className="text-gray-500">Note</span><span className="text-gray-700 dark:text-gray-300">{note}</span></div>}
        </div>
        <button onClick={onSuccess} className="btn-primary w-full py-3 rounded-xl font-bold" data-testid="bank-transfer-done">Back to Dashboard</button>
      </div>
    );
  }

  if (screen === 'confirm') {
    return (
      <div className="max-w-md mx-auto" data-testid="bank-transfer-confirm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">Confirm Transfer</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-black text-2xl text-blue-700 dark:text-blue-400" data-testid="bank-confirm-amount">{formatCurrency(amtNum)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">From</span><span className="font-semibold" data-testid="bank-confirm-from">{fromAccount.name} ({fromAccount.number})</span></div>
          <div className="flex justify-between"><span className="text-gray-500">To</span><span className="font-semibold" data-testid="bank-confirm-to">{transferType === 'own' ? `${toAccount?.name} (${toAccount?.number})` : `${extName} ****${extAccount.slice(-4)}`}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-mono text-xs" data-testid="bank-confirm-ref">{txnRef}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Processing</span><span className="text-green-600 dark:text-green-400">Instant</span></div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg" data-testid="bank-confirm-warning">
          <AlertTriangle size={13} className="text-yellow-500 shrink-0" /> This transfer cannot be reversed once processed.
        </div>
        <div className="flex gap-3">
          <button onClick={() => setScreen('form')} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800" data-testid="bank-confirm-edit">Edit</button>
          <button onClick={execute} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="bank-confirm-submit" aria-busy={loading}>
            {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Processing…</> : <><Send size={14} /> Confirm Transfer</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto" data-testid="bank-transfer-form">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5" data-testid="bank-transfer-back"><ArrowLeft size={14} />Back</button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2"><ArrowLeftRight size={20} className="text-blue-500" /> Transfer Money</h2>

      {/* Transfer type tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5" data-testid="bank-transfer-type" role="group">
        {([['own', 'Between My Accounts'], ['external', 'External Transfer']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setTransferType(val)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${transferType === val ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500'}`}
            data-testid={`bank-transfer-type-${val}`} aria-pressed={transferType === val}>{label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* From account */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">From Account *</label>
          <select value={fromId} onChange={e => setFromId(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" data-testid="bank-transfer-from" aria-label="From account">
            {accounts.filter(a => a.type !== 'credit').map(a => <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.available)}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Available: <span className="font-semibold text-gray-600 dark:text-gray-300">{formatCurrency(fromAccount.available)}</span></p>
        </div>

        {/* To account */}
        {transferType === 'own' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">To Account *</label>
            <select value={toId} onChange={e => setToId(e.target.value)} className={`w-full border rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.to ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} data-testid="bank-transfer-to">
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.number})</option>)}
            </select>
            {errors.to && <p className="text-xs text-red-500 mt-1" data-testid="bank-transfer-to-error">{errors.to}</p>}
          </div>
        ) : (
          <div className="space-y-3 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50" data-testid="bank-external-fields">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
              <input value={extName} onChange={e => setExtName(e.target.value)} className={`w-full border rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.extName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="Jane Smith" data-testid="bank-ext-name" />
              {errors.extName && <p className="text-xs text-red-500 mt-1" data-testid="bank-ext-name-error">{errors.extName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Account Number *</label>
                <input value={extAccount} onChange={e => setExtAccount(e.target.value)} className={`w-full border rounded-xl px-3 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.extAccount ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="1234567890" data-testid="bank-ext-account" />
                {errors.extAccount && <p className="text-xs text-red-500 mt-1" data-testid="bank-ext-account-error">{errors.extAccount}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Routing Number *</label>
                <input value={extRouting} onChange={e => setExtRouting(e.target.value)} maxLength={9} className={`w-full border rounded-xl px-3 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.extRouting ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`} placeholder="021000021" data-testid="bank-ext-routing" />
                {errors.extRouting && <p className="text-xs text-red-500 mt-1" data-testid="bank-ext-routing-error">{errors.extRouting}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Amount *</label>
          <div className="relative">
            <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01"
              className={`w-full border rounded-xl pl-10 pr-4 py-3 text-lg font-bold bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
              placeholder="0.00" data-testid="bank-transfer-amount" aria-label="Transfer amount" />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1" data-testid="bank-transfer-amount-error">{errors.amount}</p>}
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2" data-testid="bank-quick-amounts">
            {[50, 100, 250, 500, 1000].map(v => (
              <button key={v} onClick={() => setAmount(String(v))} className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${parseFloat(amount) === v ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-400 hover:text-blue-500'}`} data-testid={`bank-quick-amount-${v}`}>${v}</button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Note (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Rent payment" data-testid="bank-transfer-note" maxLength={80} />
        </div>

        <button onClick={confirm} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors" data-testid="bank-transfer-continue">
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Bill Pay ─────────────────────────────────────────────────────────────────
function BillPay({ accounts, onBack, addTransaction }: {
  accounts: Account[];
  onBack: () => void;
  addTransaction: (txn: Transaction) => void;
}) {
  const [step, setStep] = useState<'select' | 'amount' | 'confirm' | 'success'>('select');
  const [selectedPayee, setSelectedPayee] = useState<typeof PAYEES[0] | null>(null);
  const [fromId, setFromId] = useState(accounts[0].id);
  const [amount, setAmount] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState('');
  const [autopay, setAutopay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payRef] = useState(`BILL${Date.now().toString().slice(-8)}`);
  const fromAccount = accounts.find(a => a.id === fromId)!;
  const amtNum = parseFloat(amount);

  const pay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    addTransaction({
      id: payRef, type: 'debit',
      description: `Bill Payment — ${selectedPayee?.name}`,
      category: 'Utilities', amount: amtNum,
      date: scheduleDate, balance: fromAccount.balance - amtNum,
      status: scheduleDate === new Date().toISOString().slice(0, 10) ? 'completed' : 'pending',
      reference: payRef,
    });
    setLoading(false);
    setStep('success');
    console.log(`[ClickAndVerify] Bank: Bill paid ${formatCurrency(amtNum)} to ${selectedPayee?.name} — ref ${payRef}`);
  };

  if (step === 'success') {
    return (
      <div className="text-center py-10 max-w-md mx-auto" data-testid="bank-billpay-success">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4"><CheckCircle size={40} className="text-green-500" /></div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2" data-testid="bank-billpay-success-title">Payment Scheduled!</h2>
        <p className="text-gray-500 mb-4 text-sm">Your bill payment has been {scheduleDate === new Date().toISOString().slice(0, 10) ? 'processed' : 'scheduled'}.</p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left text-sm space-y-2 mb-6" data-testid="bank-billpay-receipt">
          <div className="flex justify-between"><span className="text-gray-500">Payee</span><span className="font-semibold" data-testid="bank-billpay-payee">{selectedPayee?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-lg" data-testid="bank-billpay-amount">{formatCurrency(amtNum)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date</span><span data-testid="bank-billpay-date">{scheduleDate}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-mono text-xs" data-testid="bank-billpay-ref">{payRef}</span></div>
          {autopay && <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={12} />AutoPay enabled</div>}
        </div>
        <button onClick={onBack} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700" data-testid="bank-billpay-done">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto" data-testid="bank-billpay-form">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5" data-testid="bank-billpay-back"><ArrowLeft size={14} />Back</button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2"><Receipt size={20} className="text-green-500" /> Pay a Bill</h2>

      {/* Step 1: Payee */}
      <div className={`mb-5 ${step !== 'select' ? 'opacity-60' : ''}`} data-testid="bank-billpay-step-payee">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">1. Select Payee</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PAYEES.map(p => (
            <button key={p.id} onClick={() => { if (step === 'select') { setSelectedPayee(p); setStep('amount'); } }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedPayee?.id === p.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-green-400 bg-white dark:bg-gray-800'}`}
              data-testid={`bank-payee-${p.id}`} aria-pressed={selectedPayee?.id === p.id}>
              <span className="text-2xl">{p.logo}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              {selectedPayee?.id === p.id && <CheckCircle size={16} className="text-green-500 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Steps 2+: Amount & schedule */}
      {(step === 'amount' || step === 'confirm') && selectedPayee && (
        <div className="space-y-4" data-testid="bank-billpay-step-amount">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">2. Payment Details</p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pay From</label>
            <select value={fromId} onChange={e => setFromId(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" data-testid="bank-billpay-from">
              {accounts.filter(a => a.type !== 'credit').map(a => <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.available)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Amount</label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 text-lg font-bold bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00" data-testid="bank-billpay-amount-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Payment Date</label>
            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              data-testid="bank-billpay-date-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Memo (optional)</label>
            <input value={memo} onChange={e => setMemo(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Account #, invoice #…" data-testid="bank-billpay-memo" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl" data-testid="bank-billpay-autopay-label">
            <input type="checkbox" checked={autopay} onChange={e => setAutopay(e.target.checked)} className="w-4 h-4 rounded text-green-600" data-testid="bank-billpay-autopay" />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable AutoPay</p>
              <p className="text-xs text-gray-400">Pay this bill automatically every month</p>
            </div>
          </label>

          {step === 'amount' ? (
            <button onClick={() => { if (amount && amtNum > 0) setStep('confirm'); }} disabled={!amount || amtNum <= 0}
              className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-40 transition-colors" data-testid="bank-billpay-review">
              Review Payment
            </button>
          ) : (
            <div className="space-y-3" data-testid="bank-billpay-confirm-step">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm space-y-2">
                <p className="font-bold text-green-800 dark:text-green-300 mb-2">Confirm Payment</p>
                <div className="flex justify-between"><span className="text-gray-500">To</span><span className="font-semibold">{selectedPayee.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-lg" data-testid="bank-billpay-confirm-amount">{formatCurrency(amtNum)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{scheduleDate}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('amount')} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold" data-testid="bank-billpay-edit">Edit</button>
                <button onClick={pay} disabled={loading} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="bank-billpay-submit" aria-busy={loading}>
                  {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Processing…</> : 'Pay Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Statement ────────────────────────────────────────────────────────────────
function Statement({ transactions, accounts, onBack }: {
  transactions: Transaction[];
  accounts: Account[];
  onBack: () => void;
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('chk001');
  const [dateFrom, setDateFrom] = useState('2026-08-01');
  const [dateTo, setDateTo] = useState('2026-09-08');

  const categories = [...new Set(transactions.map(t => t.category))].sort();

  const filtered = useMemo(() => transactions.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchCat = !categoryFilter || t.category === categoryFilter;
    const matchDate = t.date >= dateFrom && t.date <= dateTo;
    return matchSearch && matchType && matchCat && matchDate;
  }), [transactions, search, typeFilter, categoryFilter, dateFrom, dateTo]);

  const totalCredits = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  const downloadCSV = () => {
    const header = 'Date,Description,Category,Type,Amount,Status,Reference';
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.type === 'credit' ? t.amount : -t.amount},${t.status},${t.reference}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'statement.csv'; a.click();
    console.log('[ClickAndVerify] Bank: Statement downloaded');
  };

  return (
    <div data-testid="bank-statement">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5" data-testid="bank-statement-back"><ArrowLeft size={14} />Back</button>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><FileText size={20} className="text-purple-500" /> Account Statement</h2>
        <button onClick={downloadCSV} className="flex items-center gap-1.5 text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors" data-testid="bank-statement-download"><Download size={13} /> Export CSV</button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 space-y-3" data-testid="bank-statement-filters">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Search transactions…" data-testid="bank-statement-search" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" data-testid="bank-statement-type-filter">
            <option value="all">All Types</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" data-testid="bank-statement-category-filter">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" data-testid="bank-statement-date-from" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500" data-testid="bank-statement-date-to" />
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-4" data-testid="bank-statement-summary">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Transactions</p>
          <p className="font-black text-gray-900 dark:text-gray-100" data-testid="bank-statement-count">{filtered.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Total Credits</p>
          <p className="font-black text-green-600 dark:text-green-400" data-testid="bank-statement-credits">+{formatCurrency(totalCredits)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 mb-0.5">Total Debits</p>
          <p className="font-black text-red-500" data-testid="bank-statement-debits">-{formatCurrency(totalDebits)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" data-testid="bank-statement-table">
        <table className="w-full text-sm" aria-label="Transaction statement">
          <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Balance</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400" data-testid="bank-statement-empty">No transactions match your filters</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors" data-testid={`bank-stmt-row-${t.id}`} data-type={t.type}>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono" data-testid={`bank-stmt-date-${t.id}`}>{t.date}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 dark:text-gray-200" data-testid={`bank-stmt-desc-${t.id}`}>{t.description}</p>
                  <p className="text-xs text-gray-400 font-mono">{t.reference}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`badge text-xs ${CATEGORY_COLORS[t.category] || 'bg-gray-100 text-gray-600'}`} data-testid={`bank-stmt-cat-${t.id}`}>{t.category}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${t.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`} data-testid={`bank-stmt-amount-${t.id}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-500 font-mono text-xs hidden md:table-cell" data-testid={`bank-stmt-bal-${t.id}`}>{formatCurrency(t.balance)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`badge text-xs ${t.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700'}`} data-testid={`bank-stmt-status-${t.id}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Loan Application ─────────────────────────────────────────────────────────
function LoanApplication({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [form, setForm] = useState({ loanType: 'personal', amount: '10000', term: '36', purpose: '', employment: 'employed', income: '', creditScore: '', existingDebt: '', collateral: false });
  const [result, setResult] = useState<{ approved: boolean; rate: number; emi: number; totalInterest: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const u = (field: string, val: string | boolean) => setForm(f => ({ ...f, [field]: val }));

  const LOAN_TYPES = [
    { val: 'personal', label: 'Personal Loan', icon: '👤', maxAmount: 50000 },
    { val: 'home', label: 'Home Loan', icon: '🏠', maxAmount: 500000 },
    { val: 'auto', label: 'Auto Loan', icon: '🚗', maxAmount: 80000 },
    { val: 'education', label: 'Education Loan', icon: '🎓', maxAmount: 100000 },
    { val: 'business', label: 'Business Loan', icon: '💼', maxAmount: 200000 },
  ];

  const calculate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const score = parseInt(form.creditScore) || 650;
    const income = parseFloat(form.income) || 4000;
    const debt = parseFloat(form.existingDebt) || 0;
    const amt = parseFloat(form.amount) || 10000;
    const months = parseInt(form.term) || 36;
    const dti = (debt / income) * 100;
    const approved = score >= 600 && income >= 2000 && dti < 50 && amt > 0;
    let baseRate = form.loanType === 'home' ? 6.5 : form.loanType === 'auto' ? 7.9 : form.loanType === 'education' ? 8.5 : 11.5;
    if (score >= 750) baseRate -= 2; else if (score >= 700) baseRate -= 1; else if (score < 650) baseRate += 2;
    const monthlyRate = baseRate / 100 / 12;
    const emi = approved ? amt * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : 0;
    const totalInterest = approved ? emi * months - amt : 0;
    setResult({ approved, rate: baseRate, emi, totalInterest });
    setStep('result');
    setLoading(false);
    console.log(`[ClickAndVerify] Bank: Loan application — approved:${approved} rate:${baseRate}% emi:$${emi.toFixed(2)}`);
  };

  return (
    <div className="max-w-lg mx-auto" data-testid="bank-loan-form">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5" data-testid="bank-loan-back"><ArrowLeft size={14} />Back</button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2"><Landmark size={20} className="text-orange-500" /> Loan Application</h2>

      {step === 'result' && result ? (
        <div data-testid="bank-loan-result">
          <div className={`rounded-2xl p-6 text-center mb-6 ${result.approved ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`} data-testid={result.approved ? 'bank-loan-approved' : 'bank-loan-rejected'}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${result.approved ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {result.approved ? <CheckCircle size={32} className="text-green-500" /> : <X size={32} className="text-red-500" />}
            </div>
            <h3 className="text-2xl font-black mb-1" data-testid="bank-loan-result-title">{result.approved ? '🎉 Congratulations!' : 'Application Declined'}</h3>
            <p className="text-sm text-gray-500">{result.approved ? 'Your loan has been pre-approved!' : 'We are unable to approve at this time.'}</p>
          </div>

          {result.approved && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3 text-sm mb-5" data-testid="bank-loan-offer">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Your Loan Offer</h3>
              {[
                { label: 'Loan Amount', val: formatCurrency(parseFloat(form.amount)), id: 'bank-loan-amount' },
                { label: 'Interest Rate', val: `${result.rate.toFixed(2)}% p.a.`, id: 'bank-loan-rate' },
                { label: 'Loan Term', val: `${form.term} months`, id: 'bank-loan-term' },
                { label: 'Monthly EMI', val: formatCurrency(result.emi), id: 'bank-loan-emi' },
                { label: 'Total Interest', val: formatCurrency(result.totalInterest), id: 'bank-loan-total-interest' },
                { label: 'Total Payable', val: formatCurrency(parseFloat(form.amount) + result.totalInterest), id: 'bank-loan-total-payable' },
              ].map(r => (
                <div key={r.label} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100" data-testid={r.id}>{r.val}</span>
                </div>
              ))}
            </div>
          )}

          {!result.approved && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-5" data-testid="bank-loan-rejection-reasons">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Why was it declined?</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {parseInt(form.creditScore) < 600 && <li className="flex gap-2"><AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />Credit score below minimum requirement (600)</li>}
                {parseFloat(form.income) < 2000 && <li className="flex gap-2"><AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />Monthly income below minimum ($2,000)</li>}
                {(parseFloat(form.existingDebt) / parseFloat(form.income)) * 100 >= 50 && <li className="flex gap-2"><AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />Debt-to-income ratio exceeds 50%</li>}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold" data-testid="bank-loan-reapply">Modify Application</button>
            {result.approved && <button onClick={onBack} className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600" data-testid="bank-loan-accept">Accept Offer</button>}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Loan type */}
          <div data-testid="bank-loan-type-selector">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Loan Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LOAN_TYPES.map(lt => (
                <button key={lt.val} onClick={() => u('loanType', lt.val)}
                  className={`p-3 rounded-xl border text-left transition-all ${form.loanType === lt.val ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'}`}
                  data-testid={`bank-loan-type-${lt.val}`} aria-pressed={form.loanType === lt.val}>
                  <span className="text-xl block mb-1">{lt.icon}</span>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{lt.label}</p>
                  <p className="text-xs text-gray-400">Up to ${(lt.maxAmount / 1000).toFixed(0)}k</p>
                </button>
              ))}
            </div>
          </div>

          {/* Loan details */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4" data-testid="bank-loan-details">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Loan Amount ($)</label>
              <input type="number" value={form.amount} onChange={e => u('amount', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-lg font-bold bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="10000" data-testid="bank-loan-amount-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Loan Term: <span className="text-orange-500 font-bold" data-testid="bank-loan-term-display">{form.term} months</span></label>
              <input type="range" min={6} max={360} step={6} value={form.term} onChange={e => u('term', e.target.value)} className="w-full accent-orange-500" data-testid="bank-loan-term-range" aria-label="Loan term in months" />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>6 mo</span><span>30 yr</span></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Purpose</label>
              <select value={form.purpose} onChange={e => u('purpose', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" data-testid="bank-loan-purpose">
                <option value="">Select purpose…</option>
                <option value="debt_consolidation">Debt Consolidation</option>
                <option value="home_improvement">Home Improvement</option>
                <option value="medical">Medical Expenses</option>
                <option value="vacation">Vacation</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Financial details */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4" data-testid="bank-loan-financial">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Financial Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Employment Status</label>
                <select value={form.employment} onChange={e => u('employment', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" data-testid="bank-loan-employment">
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Monthly Income ($)</label>
                <input type="number" value={form.income} onChange={e => u('income', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="5000" data-testid="bank-loan-income" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Credit Score (300–850)</label>
                <input type="number" value={form.creditScore} onChange={e => u('creditScore', e.target.value)} min={300} max={850} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="720" data-testid="bank-loan-credit-score" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Existing Monthly Debt ($)</label>
                <input type="number" value={form.existingDebt} onChange={e => u('existingDebt', e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="500" data-testid="bank-loan-existing-debt" />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer" data-testid="bank-loan-collateral-label">
              <input type="checkbox" checked={form.collateral} onChange={e => u('collateral', e.target.checked)} className="w-4 h-4 rounded text-orange-500" data-testid="bank-loan-collateral" />
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Offer Collateral</p>
                <p className="text-xs text-gray-400">May improve approval chances and lower interest rate</p>
              </div>
            </label>
          </div>

          <button onClick={calculate} disabled={loading || !form.amount || !form.income || !form.creditScore}
            className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
            data-testid="bank-loan-submit" aria-busy={loading}>
            {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Evaluating Application…</> : <><TrendingUp size={18} />Check Eligibility & Rate</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BankingFlow() {
  const [screen, setScreen] = useState<BankScreen>('dashboard');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
    setAccounts(prev => prev.map(a =>
      a.id === 'chk001' ? { ...a, balance: a.balance - txn.amount, available: a.available - txn.amount } : a
    ));
  };

  const reset = () => {
    setScreen('dashboard');
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" data-testid="banking-flow">
      {/* Bank header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white sticky top-14 z-30" data-testid="bank-header">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark size={22} />
            <div>
              <p className="font-black text-lg leading-none" data-testid="bank-name">SecureBank</p>
              <p className="text-blue-200 text-xs">Online Banking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs text-blue-200 hover:text-white underline" data-testid="bank-reset-btn">Reset</button>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-sm" data-testid="bank-user-info">
              <User size={14} />
              <span>John Doe</span>
            </div>
          </div>
        </div>
        {/* Nav tabs */}
        <div className="max-w-4xl mx-auto px-4 flex gap-0 overflow-x-auto" data-testid="bank-nav-tabs">
          {[
            { screen: 'dashboard' as BankScreen, label: 'Dashboard', icon: <Wallet size={14} /> },
            { screen: 'transfer' as BankScreen, label: 'Transfer', icon: <ArrowLeftRight size={14} /> },
            { screen: 'billpay' as BankScreen, label: 'Pay Bills', icon: <Receipt size={14} /> },
            { screen: 'statement' as BankScreen, label: 'Statement', icon: <FileText size={14} /> },
            { screen: 'loan' as BankScreen, label: 'Loans', icon: <Landmark size={14} /> },
          ].map(tab => (
            <button key={tab.screen} onClick={() => setScreen(tab.screen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${screen === tab.screen ? 'border-white text-white' : 'border-transparent text-blue-300 hover:text-white'}`}
              data-testid={`bank-tab-${tab.screen}`} aria-selected={screen === tab.screen}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {screen === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} onNavigate={setScreen} />}
        {screen === 'transfer' && <Transfer accounts={accounts} onSuccess={() => setScreen('dashboard')} onBack={() => setScreen('dashboard')} addTransaction={addTransaction} />}
        {screen === 'billpay' && <BillPay accounts={accounts} onBack={() => setScreen('dashboard')} addTransaction={addTransaction} />}
        {screen === 'statement' && <Statement transactions={transactions} accounts={accounts} onBack={() => setScreen('dashboard')} />}
        {screen === 'loan' && <LoanApplication onBack={() => setScreen('dashboard')} />}
      </div>
    </div>
  );
}
