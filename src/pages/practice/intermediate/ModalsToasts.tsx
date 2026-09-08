import { useState, useRef, useEffect } from 'react';
import { X, Info, AlertTriangle, CheckCircle, Trash2, XCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';
import { useToast } from '../../../components/ui/Toast';

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps { id: string; title: string; children: React.ReactNode; onClose: () => void; size?: string; }
function Modal({ id, title, children, onClose, size = 'max-w-md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      data-testid={`modal-overlay-${id}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${id}`}
    >
      <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full ${size} animate-slide-in`} data-testid={`modal-${id}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 id={`modal-title-${id}`} className="font-semibold text-gray-900 dark:text-gray-100" data-testid={`modal-title-${id}`}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" data-testid={`modal-close-${id}`} aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="p-5" data-testid={`modal-body-${id}`}>{children}</div>
      </div>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ children, tip, id, pos = 'top' }: { children: React.ReactNode; tip: string; id: string; pos?: 'top' | 'bottom' | 'left' | 'right' }) {
  const [show, setShow] = useState(false);
  const posClass = { top: 'bottom-full left-1/2 -translate-x-1/2 mb-2', bottom: 'top-full left-1/2 -translate-x-1/2 mt-2', left: 'right-full top-1/2 -translate-y-1/2 mr-2', right: 'left-full top-1/2 -translate-y-1/2 ml-2' }[pos];

  return (
    <div className="relative inline-block" data-testid={`tooltip-wrapper-${id}`}>
      <div
        onMouseEnter={() => { setShow(true); console.log(`[ClickAndVerify] Tooltip shown: ${id}`); }}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        data-testid={`tooltip-trigger-${id}`}
      >
        {children}
      </div>
      {show && (
        <div
          className={`absolute z-50 ${posClass} bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap pointer-events-none animate-fade-in`}
          data-testid={`tooltip-content-${id}`}
          role="tooltip"
          id={`tooltip-${id}`}
        >
          {tip}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${
            pos === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
            pos === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
            pos === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2' :
            'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
          }`} />
        </div>
      )}
    </div>
  );
}

// ── Nested Modal (needs own state to avoid TypeScript narrowing issues) ───────
function NestedModal({ onClose }: { onClose: () => void }) {
  const [showInner, setShowInner] = useState(false);
  return (
    <Modal id="nested" title="First Level Modal" onClose={onClose}>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">This modal can open another on top of it.</p>
      <button onClick={() => setShowInner(true)} className="btn-primary mb-4" data-testid="btn-open-nested-modal">Open Nested Modal</button>
      {showInner && (
        <Modal id="nested2" title="Second Level Modal" onClose={() => setShowInner(false)}>
          <p className="text-sm text-gray-700 dark:text-gray-300">You are two levels deep!</p>
          <div className="flex justify-end mt-4">
            <button onClick={() => setShowInner(false)} className="btn-primary" data-testid="modal-nested2-close">Back</button>
          </div>
        </Modal>
      )}
      <div className="flex justify-end">
        <button onClick={onClose} className="btn-secondary" data-testid="modal-nested-close">Close</button>
      </div>
    </Modal>
  );
}

export default function ModalsToastsPage() {
  const { addToast } = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', feedback: '' });

  const openModal = (id: string) => {
    setActiveModal(id);
    console.log(`[ClickAndVerify] Modal opened: ${id}`);
  };
  const closeModal = () => {
    console.log(`[ClickAndVerify] Modal closed: ${activeModal}`);
    setActiveModal(null);
  };

  return (
    <PageLayout title="Modals, Toasts & Tooltips" description="Practice overlay interactions, notification systems, and tooltip visibility assertions." difficulty="intermediate" testId="modals-toasts-page"
      onReset={() => { setActiveModal(null); setConfirmResult(null); setFormData({ name: '', feedback: '' }); }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Modals */}
        <div className="card p-6" data-testid="section-modals">
          <h2 className="section-header">Modal Dialogs</h2>
          <p className="section-sub">Click any button to open. Press Escape or click backdrop to close.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => openModal('info')} className="btn-primary" data-testid="btn-open-modal-info">Open Info Modal</button>
            <button onClick={() => openModal('confirm')} className="btn-danger" data-testid="btn-open-modal-confirm">Open Confirm Modal</button>
            <button onClick={() => openModal('form')} className="btn-secondary" data-testid="btn-open-modal-form">Open Form Modal</button>
            <button onClick={() => openModal('large')} className="btn bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500" data-testid="btn-open-modal-large">Open Large Modal</button>
            <button onClick={() => openModal('nested')} className="btn-secondary" data-testid="btn-open-modal-nested">Nested Modal</button>
          </div>
          {confirmResult && (
            <p className="mt-3 text-sm font-medium" data-testid="confirm-result">
              Confirm result: <span className={confirmResult === 'confirmed' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{confirmResult}</span>
            </p>
          )}
        </div>

        {/* Toasts */}
        <div className="card p-6" data-testid="section-toasts">
          <h2 className="section-header">Toast Notifications</h2>
          <p className="section-sub">Toasts appear bottom-right and auto-dismiss after 4s. Check the toast-container in DOM.</p>
          <div className="flex flex-wrap gap-3">
            {([
              { type: 'success', title: 'Operation successful', message: 'Your changes have been saved.', testId: 'btn-toast-success' },
              { type: 'error', title: 'Something went wrong', message: 'Failed to connect to server.', testId: 'btn-toast-error' },
              { type: 'warning', title: 'Warning', message: 'This action cannot be undone.', testId: 'btn-toast-warning' },
              { type: 'info', title: 'Did you know?', message: 'You can use data-testid to locate elements.', testId: 'btn-toast-info' },
            ] as const).map((t) => (
              <button
                key={t.type}
                onClick={() => addToast({ type: t.type, title: t.title, message: t.message })}
                className={`btn ${t.type === 'success' ? 'btn-success' : t.type === 'error' ? 'btn-danger' : t.type === 'warning' ? 'bg-yellow-500 text-white hover:bg-yellow-600 btn' : 'btn-primary'}`}
                data-testid={t.testId}
              >
                {t.title.split(' ')[0]} Toast
              </button>
            ))}
            <button
              onClick={() => addToast({ type: 'info', title: 'Long-lived toast', message: 'This one sticks for 10 seconds.', duration: 10000 })}
              className="btn-secondary"
              data-testid="btn-toast-long"
            >
              10s Toast
            </button>
          </div>
        </div>

        {/* Tooltips */}
        <div className="card p-6" data-testid="section-tooltips">
          <h2 className="section-header">Tooltips</h2>
          <p className="section-sub">Hover (or focus) each element. Tooltips appear from different directions.</p>
          <div className="flex flex-wrap gap-6 items-center justify-center py-8">
            <Tooltip id="top" tip="I appear on top!" pos="top">
              <button className="btn-secondary" data-testid="btn-tooltip-top" aria-describedby="tooltip-top">Hover (top)</button>
            </Tooltip>
            <Tooltip id="bottom" tip="I appear on the bottom!" pos="bottom">
              <button className="btn-secondary" data-testid="btn-tooltip-bottom" aria-describedby="tooltip-bottom">Hover (bottom)</button>
            </Tooltip>
            <Tooltip id="left" tip="I appear on the left!" pos="left">
              <button className="btn-secondary" data-testid="btn-tooltip-left" aria-describedby="tooltip-left">Hover (left)</button>
            </Tooltip>
            <Tooltip id="right" tip="I appear on the right!" pos="right">
              <button className="btn-secondary" data-testid="btn-tooltip-right" aria-describedby="tooltip-right">Hover (right)</button>
            </Tooltip>
            <Tooltip id="icon" tip="This button submits the form" pos="top">
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" data-testid="btn-tooltip-icon" aria-describedby="tooltip-icon">
                <Info size={18} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {activeModal === 'info' && (
        <Modal id="info" title="Information" onClose={closeModal}>
          <div className="flex gap-3">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">This is an informational modal. Test that it opens, has the correct title, and closes via button or backdrop click.</p>
              <p className="text-xs text-gray-400">Locator: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">[data-testid="modal-info"]</code></p>
            </div>
          </div>
          <div className="flex justify-end mt-5"><button onClick={closeModal} className="btn-primary" data-testid="modal-info-ok">OK</button></div>
        </Modal>
      )}

      {activeModal === 'confirm' && (
        <Modal id="confirm" title="Confirm Deletion" onClose={closeModal}>
          <div className="flex gap-3 mb-5">
            <Trash2 size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">Are you sure you want to delete this record? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setConfirmResult('cancelled'); closeModal(); }} className="btn-secondary" data-testid="modal-confirm-cancel">Cancel</button>
            <button onClick={() => { setConfirmResult('confirmed'); closeModal(); addToast({ type: 'success', title: 'Deleted!', message: 'Record was removed.' }); }} className="btn-danger" data-testid="modal-confirm-ok">Delete</button>
          </div>
        </Modal>
      )}

      {activeModal === 'form' && (
        <Modal id="form" title="Submit Feedback" onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="modal-form-name">Your Name</label>
              <input id="modal-form-name" type="text" className="input" placeholder="Jane Smith" value={formData.name} onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))} data-testid="modal-form-name" />
            </div>
            <div>
              <label className="label" htmlFor="modal-form-feedback">Feedback</label>
              <textarea id="modal-form-feedback" rows={3} className="input resize-none" placeholder="Write your feedback…" value={formData.feedback} onChange={(e) => setFormData((d) => ({ ...d, feedback: e.target.value }))} data-testid="modal-form-feedback" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={closeModal} className="btn-secondary" data-testid="modal-form-cancel">Cancel</button>
            <button onClick={() => { closeModal(); addToast({ type: 'success', title: 'Feedback received!', message: `Thanks, ${formData.name || 'Tester'}!` }); }} className="btn-primary" data-testid="modal-form-submit">Submit</button>
          </div>
        </Modal>
      )}

      {activeModal === 'large' && (
        <Modal id="large" title="Large Scrollable Modal" onClose={closeModal} size="max-w-2xl">
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2" data-testid="modal-large-content">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={`modal-large-item-${i + 1}`}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Section {i + 1}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is scrollable content item {i + 1}. Scroll down to see more items below this one.</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5"><button onClick={closeModal} className="btn-primary" data-testid="modal-large-close">Close</button></div>
        </Modal>
      )}

      {activeModal === 'nested' && (
        <NestedModal onClose={closeModal} />
      )}
    </PageLayout>
  );
}
