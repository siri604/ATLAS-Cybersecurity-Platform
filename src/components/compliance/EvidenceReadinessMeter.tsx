import React from 'react';
import { Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EvidenceReadinessMeterProps {
  isIdentityReady?: boolean;
  totalControls?: number;
  readyControls?: number;
  compact?: boolean;
}

export const EvidenceReadinessMeter: React.FC<EvidenceReadinessMeterProps> = ({
  isIdentityReady = false,
  totalControls = 27,
  readyControls = 24, // 27 total - 3 missing
  compact = false
}) => {
  const readinessPercent = Math.round((readyControls / totalControls) * 100);

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-[#080E18] space-y-3 font-sans">
      {/* Top Header & Meter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            PRE-FLIGHT EVIDENCE READINESS
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#00E5FF] font-bold">{readyControls} / {totalControls}</span>
          <span className="text-slate-400">Controls with available evidence</span>
        </div>
      </div>

      {/* Progress Rail */}
      <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 transition-all duration-500"
          style={{ width: `${readinessPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
        {/* OpenSCAP */}
        <div className="p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <div className="font-bold text-white text-[11px]">OpenSCAP</div>
            <div className="text-[10px] text-emerald-400">Evidence available</div>
          </div>
        </div>

        {/* Wazuh */}
        <div className="p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <div className="font-bold text-white text-[11px]">Wazuh Agent</div>
            <div className="text-[10px] text-emerald-400">Telemetry available</div>
          </div>
        </div>

        {/* Identity Provider */}
        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 bg-amber-950/20 border-amber-500/40`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-amber-500/20 border border-amber-500/50 text-amber-400`}>
            <AlertTriangle className="w-3 h-3" />
          </div>
          <div>
            <div className="font-bold text-white text-[11px]">Identity Provider</div>
            <div className={`text-[10px] text-amber-400 font-semibold`}>
              Evidence missing
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300/90 leading-relaxed font-sans">
          <strong>Evidence Gap Notice:</strong> Missing evidence for 3 controls detected (Identity Provider sync pending). Assessment will continue with remaining {readyControls} controls.
        </div>
      )}
    </div>
  );
};
