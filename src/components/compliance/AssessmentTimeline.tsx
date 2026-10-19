import React from 'react';
import { Check, Clock, Lock, Zap } from 'lucide-react';

interface AssessmentTimelineProps {
  autonomyMode: string;
  approvalState: string;
  actionState: string;
  findingActivityHistory: Array<{ action: string }>;
}

export const AssessmentTimeline: React.FC<AssessmentTimelineProps> = ({
  autonomyMode,
  approvalState,
  actionState,
  findingActivityHistory
}) => {
  const isRemediated = actionState === 'Remediated' || approvalState === 'Verified';
  const isRejected = findingActivityHistory.some(a => a.action === 'Remediation Rejected');

  // Base stages according to autonomy mode
  let stages: Array<{ key: string; label: string; status: 'completed' | 'current' | 'future' | 'disabled' }> = [];

  if (autonomyMode === 'Observe') {
    stages = [
      { key: 'finding', label: 'Finding Detected', status: 'completed' },
      { key: 'monitoring', label: 'Monitoring (Observe)', status: 'current' },
      { key: 'recommendation', label: 'Recommendation', status: 'disabled' },
      { key: 'approval', label: 'Approval', status: 'disabled' },
      { key: 'execute', label: 'Execute', status: 'disabled' },
      { key: 'verify', label: 'Verify', status: 'disabled' }
    ];
  } else if (autonomyMode === 'Recommend') {
    stages = [
      { key: 'finding', label: 'Finding Detected', status: 'completed' },
      { key: 'recommendation', label: 'Recommendation Generated', status: 'completed' },
      { key: 'action', label: 'Awaiting Customer Action', status: 'current' },
      { key: 'execute', label: 'Execute', status: 'disabled' },
      { key: 'verify', label: 'Verify', status: 'disabled' }
    ];
  } else if (autonomyMode === 'Approval required') {
    stages = [
      { key: 'finding', label: 'Finding Detected', status: 'completed' },
      { key: 'recommendation', label: 'Recommendation Generated', status: 'completed' },
      { 
        key: 'approval', 
        label: isRemediated ? 'Approved' : approvalState === 'Approved' ? 'Approved' : isRejected ? 'Remediation Rejected' : 'Awaiting Approval',
        status: isRemediated || approvalState === 'Approved' || approvalState === 'Executing' ? 'completed' : isRejected ? 'completed' : 'current' 
      },
      { 
        key: 'execute', 
        label: 'Execute', 
        status: isRemediated ? 'completed' : approvalState === 'Executing' ? 'current' : approvalState === 'Approved' ? 'current' : isRejected ? 'disabled' : 'future' 
      },
      { 
        key: 'verify', 
        label: 'Verify & Reassess', 
        status: isRemediated ? 'completed' : approvalState === 'Executing' ? 'future' : isRejected ? 'disabled' : 'future' 
      }
    ];
  } else {
    // Autonomous
    stages = [
      { key: 'finding', label: 'Finding Detected', status: 'completed' },
      { key: 'recommendation', label: 'Recommendation Generated', status: 'completed' },
      { key: 'policy', label: 'Policy Validated', status: 'completed' },
      { 
        key: 'execute', 
        label: 'Executing Fix', 
        status: isRemediated ? 'completed' : 'current' 
      },
      { 
        key: 'verify', 
        label: 'Verify & Reassess', 
        status: isRemediated ? 'completed' : 'future' 
      }
    ];
  }

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-[#080E18] space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          REMEDIATION ACTION LIFECYCLE
        </span>
        <span className="text-slate-400 font-sans">
          Governance: <strong className="text-cyan-400 font-mono">{autonomyMode}</strong>
        </span>
      </div>

      {/* Horizontal Stage Sequence */}
      <div className="overflow-x-auto py-1">
        <div className="flex items-center justify-between min-w-[500px] relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

          {stages.map((stg, i) => (
            <div key={stg.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                stg.status === 'completed'
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400'
                  : stg.status === 'current'
                    ? 'bg-cyan-500/30 border-2 border-[#00E5FF] text-[#00E5FF] animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : stg.status === 'disabled'
                      ? 'bg-slate-900 border border-slate-800 text-slate-600'
                      : 'bg-[#0B1322] border border-slate-700 text-slate-500'
              }`}>
                {stg.status === 'completed' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stg.status === 'current' ? '●' : stg.status === 'disabled' ? '✕' : '○'}
              </div>

              <span className={`text-[10px] font-mono mt-1.5 text-center max-w-[85px] leading-tight ${
                stg.status === 'completed'
                  ? 'text-emerald-300 font-semibold'
                  : stg.status === 'current'
                    ? 'text-[#00E5FF] font-bold'
                    : stg.status === 'disabled'
                      ? 'text-slate-600 line-through'
                      : 'text-slate-500'
              }`}>
                {stg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
