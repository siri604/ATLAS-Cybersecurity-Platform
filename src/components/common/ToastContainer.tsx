import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePlatform();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-lg border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-top-2 fade-in duration-200 text-xs font-sans ${
              isSuccess
                ? 'bg-[#06151E]/95 border-cyan-500/50 text-slate-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : isWarning
                ? 'bg-[#1C1306]/95 border-amber-500/50 text-slate-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : isError
                ? 'bg-[#1A0A0E]/95 border-rose-500/50 text-slate-100 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : 'bg-[#0B1220]/95 border-slate-700/80 text-slate-100 shadow-xl'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {isInfo && <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}

              <div className="leading-snug font-medium">
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
