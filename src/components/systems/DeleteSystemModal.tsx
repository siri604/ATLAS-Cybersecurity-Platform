import React, { useState, useEffect } from 'react';
import { Trash2, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AtlasSystem } from '../../types';

interface DeleteSystemModalProps {
  isOpen: boolean;
  system: AtlasSystem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSystemModal: React.FC<DeleteSystemModalProps> = ({
  isOpen,
  system,
  onClose,
  onConfirm
}) => {
  const [confirmationInput, setConfirmationInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput('');
    }
  }, [isOpen]);

  if (!isOpen || !system) return null;

  const isConfirmed = confirmationInput.trim() === system.name.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0E1017] border border-rose-500/50 rounded-xl shadow-2xl flex flex-col my-8 text-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1A0A0E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/70 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Trash2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight font-sans">
              Delete {system.name}?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed text-sm">
            This will remove the system from active ATLAS management. Historical assessments, findings, evidence, and audit records remain available according to retention policy.
          </p>

          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>This action cannot be undone in ATLAS.</span>
          </div>

          <div className="space-y-2 pt-1 font-mono">
            <label className="block text-slate-300 text-xs">
              Type <span className="font-bold text-white select-all">{system.name}</span> to confirm.
            </label>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Enter system name"
              autoFocus
              className="w-full bg-[#080B12] border border-slate-700 focus:border-rose-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#080D17] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmed}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 rounded-lg transition-colors font-mono shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete System</span>
          </button>
        </div>

      </div>
    </div>
  );
};
