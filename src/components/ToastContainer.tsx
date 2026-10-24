import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-60 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : toast.type === 'info'
              ? 'bg-blue-900/95 text-white border-blue-700'
              : 'bg-slate-950/95 text-white border-slate-800'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 text-xs sm:text-sm font-semibold leading-snug">
            {toast.message}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
