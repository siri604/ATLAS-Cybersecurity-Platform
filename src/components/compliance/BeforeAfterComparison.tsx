import React from 'react';
import { CheckCircle2, AlertCircle, ArrowDown, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

interface BeforeAfterComparisonProps {
  findingTitle: string;
  controlRef: string;
  beforeScore?: number;
  afterScore?: number;
  systemName?: string;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  findingTitle,
  controlRef,
  beforeScore = 82,
  afterScore = 89,
  systemName = 'Customer Portal App Server'
}) => {
  const delta = afterScore - beforeScore;

  return (
    <div className="p-5 rounded-xl border border-emerald-500/50 bg-gradient-to-br from-[#081822] via-[#09101C] to-[#0B1516] text-slate-200 space-y-4 font-sans shadow-xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
            ATLAS MEASURABLE IMPROVEMENT PROOF
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
          REMEDIATED &amp; VERIFIED
        </span>
      </div>

      {/* Animated 3-Stage Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative z-10 font-mono">
        
        {/* Stage 1: BEFORE */}
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-center space-y-2 relative group hover:border-rose-500 transition-colors">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
            BEFORE REMEDIATION
          </div>
          <div className="text-3xl font-bold text-rose-400">
            {beforeScore}%
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 border border-rose-500/50 text-rose-300 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            FAILED
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1 text-left space-y-0.5">
            <div>Status: <span className="text-white">Failed</span></div>
            <div>Observed: <span className="text-rose-300 font-mono">PermitRootLogin yes</span></div>
            <div>Source: <span className="text-white">OpenSCAP</span></div>
          </div>
        </div>

        {/* Transition Arrow / Badge */}
        <div className="flex flex-col items-center justify-center space-y-1 my-2 md:my-0">
          <div className="p-2 rounded-full bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] animate-pulse">
            <ArrowDown className="w-5 h-5 md:-rotate-90 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            REMEDIATED
          </span>
        </div>

        {/* Stage 2: AFTER */}
        <div className="p-4 rounded-xl border border-emerald-500/60 bg-emerald-950/30 text-center space-y-2 relative group hover:border-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            AFTER VERIFICATION
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {afterScore}%
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PASSED
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1 text-left space-y-0.5">
            <div>Status: <span className="text-white">Passed</span></div>
            <div>Observed: <span className="text-emerald-300 font-mono">PermitRootLogin no</span></div>
            <div>Verified: <span className="text-white">OpenSCAP reassessment</span></div>
          </div>
        </div>

      </div>

      {/* Metrics Breakdown Proof */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs border-t border-slate-800/80 relative z-10">
        <div className="p-2.5 rounded-lg bg-[#080E18] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-sans">Posture Delta</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +{delta}% Posture
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#080E18] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-sans">Audit Finding</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5">
            1 Resolved
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#080E18] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-sans">POA&M Milestone</div>
          <div className="text-cyan-400 font-bold text-sm mt-0.5">
            1 Completed
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#080E18] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-sans">Evidence Freshness</div>
          <div className="text-emerald-400 font-bold text-sm mt-0.5">
            Verified Hash
          </div>
        </div>
      </div>

    </div>
  );
};
