import React from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { ComplianceControl, ControlResult } from '../../types';

interface EvidenceReviewModalProps {
  control: ComplianceControl;
  assessmentId: string;
  onClose: () => void;
  onUpdateResult: (assessmentId: string, controlId: string, result: ControlResult) => void;
}

export const EvidenceReviewModal: React.FC<EvidenceReviewModalProps> = ({
  control,
  assessmentId,
  onClose,
  onUpdateResult
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0E1420] border border-cyan-500/50 rounded-lg w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Review Evidence: {control.title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="text-slate-400">Control:</span>
            <span className="text-white font-mono">{control.id}</span>
            <span className="text-slate-400">Evidence Type:</span>
            <span className="text-white">Uploaded</span>
            <span className="text-slate-400">Submitted By:</span>
            <span className="text-white">User (Dev)</span>
            <span className="text-slate-400">Submitted Date:</span>
            <span className="text-white">2026-10-08</span>
          </div>
          
          <div className="p-3 bg-slate-900 border border-slate-700 rounded text-sm text-slate-200">
            {control.title} evidence artifact submitted for review.
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-cyan-900/50">
          <button
            onClick={() => {
              onUpdateResult(assessmentId, control.id, 'Passed');
              onClose();
            }}
            className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded text-sm font-semibold"
          >
            Accept Evidence
          </button>
          <button
            onClick={() => {
              onUpdateResult(assessmentId, control.id, 'Missing Evidence');
              onClose();
            }}
            className="flex-1 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded text-sm font-semibold"
          >
            Reject Evidence
          </button>
        </div>
      </div>
    </div>
  );
};
