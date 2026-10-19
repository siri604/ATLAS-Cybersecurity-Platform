import React from 'react';
import { ShieldAlert, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ComplianceDrift: React.FC<{onOpenFinding: (id: string) => void}> = ({ onOpenFinding }) => {
  const driftEvents = [
    {
      id: 'drift-001',
      system: 'Customer Portal App Server',
      control: 'CIS 5.2.10',
      previousState: 'PermitRootLogin no',
      currentState: 'PermitRootLogin yes',
      severity: 'High',
      findingId: 'fnd-123'
    }
  ];

  return (
    <div className="space-y-4 font-sans p-5 rounded-xl border border-slate-800/90 bg-[#0B1322]">
      <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-500" />
        Continuous Monitoring: Drift Detected
      </h2>

      <div className="space-y-3">
        {driftEvents.map(event => (
          <div key={event.id} className="p-4 rounded-lg border border-slate-800 bg-[#080E18] space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-white">{event.system}</div>
                <div className="text-[10px] font-mono text-cyan-400">{event.control}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-rose-950/50 border-rose-500/40 text-rose-400">
                Drift Detected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="text-slate-400">Previous: <span className="text-slate-200">{event.previousState}</span></div>
              <div className="text-slate-400">Current: <span className="text-rose-400">{event.currentState}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Monitoring ✓</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-rose-400">Drift Detected ●</span>
                <ChevronRight className="w-3 h-3" />
                <span>Finding Created ○</span>
                <ChevronRight className="w-3 h-3" />
                <span>Remediation Pending ○</span>
              </div>
              <button
                onClick={() => onOpenFinding(event.findingId)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-medium transition-colors"
              >
                View Finding
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
