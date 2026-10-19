import React, { useState } from 'react';
import { Sliders, X, Check, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ComplianceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceSettingsModal: React.FC<ComplianceSettingsModalProps> = ({ isOpen, onClose }) => {
  const { role } = usePlatform();

  const [schedule, setSchedule] = useState<string>('every_4_hours');
  const [autoReassess, setAutoReassess] = useState<boolean>(true);
  const [evidenceStrictness, setEvidenceStrictness] = useState<string>('strict');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0E1420] border border-slate-800 rounded-lg shadow-2xl p-6 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white font-mono">
              Compliance Module Settings
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Automated Audit Assessment Schedule
            </label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="every_hour">Continuous / Hourly</option>
              <option value="every_4_hours">Every 4 Hours (Default Baseline)</option>
              <option value="daily">Daily at 00:00 UTC</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Evidence Freshness & Attestation Strictness
            </label>
            <select
              value={evidenceStrictness}
              onChange={(e) => setEvidenceStrictness(e.target.value)}
              className="w-full bg-[#121926] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="strict">Strict: Missing evidence invalidates control compliance</option>
              <option value="permissive">Permissive: Flag missing evidence as provisional</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              ATLAS policy mandates that missing evidence must never be treated as passing.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReassess}
                onChange={(e) => setAutoReassess(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-400"
              />
              <span className="text-slate-300 font-medium">
                Automated Reassessment upon Remediation Completion
              </span>
            </label>
            <p className="text-[11px] text-slate-500 pl-5 mt-0.5">
              Automatically trigger probe harvest and verify targeted fix before updating finding status.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-[11px] text-cyan-400 font-mono">
            Authorized for {role}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition-colors"
            >
              {saveSuccess ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
