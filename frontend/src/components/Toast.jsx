import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error:   <XCircle    className="w-5 h-5 text-red-400" />,
  info:    <Info       className="w-5 h-5 text-brand-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
};

const BORDERS = {
  success: 'border-emerald-500/40',
  error:   'border-red-500/40',
  info:    'border-brand-500/40',
  warning: 'border-yellow-500/40',
};

/**
 * Individual toast item.
 */
function ToastItem({ id, type = 'info', title, message, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 w-80 p-4 rounded-xl glass-card border ${BORDERS[type]}
        animate-slide-in-right shadow-card
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{ICONS[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold text-slate-100 mb-0.5">{title}</p>}
        {message && <p className="text-xs text-slate-400 leading-relaxed">{message}</p>}
      </div>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast container — render at top level and use via useToast hook.
 *
 * Usage:
 *   const { toasts, addToast, removeToast } = useToast();
 *   <ToastContainer toasts={toasts} onRemove={removeToast} />
 */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

/** Hook for managing toasts */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, addToast, removeToast };
}
