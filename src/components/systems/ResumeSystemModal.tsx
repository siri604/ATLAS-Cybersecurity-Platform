import React from 'react';
import { Play, X, CheckCircle2 } from 'lucide-react';
import { AtlasSystem } from '../../types';

interface ResumeSystemModalProps {
  isOpen: boolean;
  system: AtlasSystem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResumeSystemModal: React.FC<ResumeSystemModalProps> = ({
  isOpen,
  system,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !system) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0D121D] border border-cyan-500/40 rounded-xl shadow-2xl flex flex-col my-8 text-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#07131F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Play className="w-4 h-4 fill-cyan-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight font-sans">
              Resume {system.name}?
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
            ATLAS will resume monitoring, scheduled assessments, and automated activity for this system using its existing configuration
          </p>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">What resumes</div>
            <div>• Monitoring</div>
            <div>• Scheduled assessments</div>
            <div>• Security telemetry collection</div>
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-mono shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Resume System</span>
          </button>
        </div>

      </div>
    </div>
  );
};
