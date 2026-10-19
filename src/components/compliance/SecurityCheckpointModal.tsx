import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

interface SecurityCheckpointModalProps {
  targetSystemName: string;
  findingTitle: string;
  proposedAction: string;
  expectedImpact: string;
  rollbackReadiness: string;
  supportingEvidence: string;
  onApprove: () => void;
  onReject: () => void;
  autonomyMode?: string;
}

export const SecurityCheckpointModal: React.FC<SecurityCheckpointModalProps> = ({
  targetSystemName,
  findingTitle,
  proposedAction,
  expectedImpact,
  rollbackReadiness,
  supportingEvidence,
  onApprove,
  onReject,
  autonomyMode = 'Approval required'
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-xl bg-[#090E17] border-2 border-amber-500/60 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 text-slate-200 space-y-5">
        
        {/* Security Checkpoint Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  SECURITY CHECKPOINT
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[10px]">
                  AUTHORIZATION REQUIRED
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight font-mono mt-0.5">
                Human Approval Checkpoint
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onReject}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy State Info */}
        <div className="p-3 rounded-lg bg-[#0E1626] border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Current Governance Mode:</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            {autonomyMode}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-xs font-sans">
          
          {/* Target & Finding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#0B1322] border border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">TARGET SYSTEM</div>
              <div className="text-sm font-bold text-white mt-1 font-mono">{targetSystemName}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1322] border border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">FINDING</div>
              <div className="text-xs font-semibold text-rose-300 mt-1 line-clamp-1">{findingTitle}</div>
            </div>
          </div>

          {/* Proposed Action */}
          <div className="p-3.5 rounded-lg bg-[#0B1322] border border-cyan-500/30 space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase text-cyan-400">PROPOSED REMEDIATION ACTION</div>
            <div className="text-xs font-mono text-slate-200 leading-relaxed font-semibold">
              {proposedAction}
            </div>
          </div>

          {/* Impact & Rollback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0B1322] border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">EXPECTED IMPACT</div>
              <div className="text-slate-300 leading-relaxed text-[11px]">{expectedImpact}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1322] border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                ROLLBACK READINESS
              </div>
              <div className="text-emerald-300 leading-relaxed text-[11px] font-mono">
                {rollbackReadiness}
              </div>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase font-bold">SUPPORTING EVIDENCE HARVEST</div>
            <div className="text-cyan-300">{supportingEvidence}</div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReject}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0B1322] hover:bg-slate-800 text-slate-300 text-xs font-semibold font-sans transition-colors cursor-pointer"
          >
            Reject Action
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center gap-2 font-sans"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Approve &amp; Execute Remediation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
