import React, { useState } from 'react';
import { FilePlus, X, Check } from 'lucide-react';
import { PlatformFinding } from '../../types';

interface CreatePOAMModalProps {
  finding: PlatformFinding;
  onClose: () => void;
  onCreate: (finding: PlatformFinding, owner: string, targetDate: string, milestone: string) => void;
}

export const CreatePOAMModal: React.FC<CreatePOAMModalProps> = ({ finding, onClose, onCreate }) => {
  const [owner, setOwner] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [milestone, setMilestone] = useState<string>('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-lg bg-[#090E17] border border-slate-700 rounded-xl shadow-2xl p-6 text-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800 text-cyan-400">
              <FilePlus className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white font-mono tracking-tight">Create POA&M Item</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-only fields */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <label className="text-[10px] text-slate-500 font-mono uppercase block">Finding</label>
              <div className="text-white font-semibold mt-0.5">{finding.title}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <label className="text-[10px] text-slate-500 font-mono uppercase block">System</label>
              <div className="text-white font-semibold mt-0.5">{finding.affectedSystemName}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <label className="text-[10px] text-slate-500 font-mono uppercase block">Control</label>
              <div className="text-white font-semibold mt-0.5 font-mono">{finding.controlRef || 'GEN-01'}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
              <label className="text-[10px] text-slate-500 font-mono uppercase block">Risk</label>
              <div className="text-white font-semibold mt-0.5 font-mono">{finding.severity}</div>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. SecOps Team"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Milestone</label>
            <input
              type="text"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              className="w-full bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              placeholder="Concise description of the milestone..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(finding, owner, targetDate, milestone)}
            disabled={!owner || !targetDate || !milestone}
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            Create POA&M
          </button>
        </div>

      </div>
    </div>
  );
};
