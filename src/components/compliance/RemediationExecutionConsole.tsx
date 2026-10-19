import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

interface RemediationExecutionConsoleProps {
  findingTitle: string;
  systemName: string;
  remediationAction: string;
  onComplete: () => void;
  autonomyMode?: string;
  simulatedFailure?: boolean;
}

export const RemediationExecutionConsole: React.FC<RemediationExecutionConsoleProps> = ({
  findingTitle,
  systemName,
  remediationAction,
  onComplete,
  autonomyMode = 'Approval required',
  simulatedFailure = false
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; status?: 'info' | 'success' | 'warn' | 'error' }>>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isRollbackDone, setIsRollbackDone] = useState<boolean>(false);

  const logRef = useRef<HTMLDivElement>(null);

  const stages = [
    { id: 0, name: 'Preparing Approved Fix' },
    { id: 1, name: 'Capturing Pre-Fix Snapshot' },
    { id: 2, name: 'Applying Configuration Policy' },
    { id: 3, name: 'Validating System Service Health' },
    { id: 4, name: 'Targeted Reassessment Scan' },
    { id: 5, name: 'Remediation Verified' }
  ];

  useEffect(() => {
    const timeFormatted = () => new Date().toTimeString().split(' ')[0];

    const initialLogs = [
      { timestamp: timeFormatted(), text: `[${timeFormatted()}] Authorization granted for remediation on ${systemName}`, status: 'info' as const },
      { timestamp: timeFormatted(), text: `[${timeFormatted()}] Action: ${remediationAction}`, status: 'info' as const }
    ];
    setLogs(initialLogs);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStage(step);

      const t = timeFormatted();
      let logMsg = `[${t}] Executing step ${step}: ${stages[step]?.name || 'Finalizing'}`;
      let statusType: 'info' | 'success' | 'warn' | 'error' = 'info';

      if (step === 1) {
        logMsg = `[${t}] Capturing current configuration snapshot -> snapshot_id: snap_${Date.now().toString().slice(-6)}`;
      } else if (step === 2) {
        logMsg = `[${t}] Applying approved policy to ${systemName} via secure probe`;
        statusType = 'info';
      } else if (step === 3) {
        logMsg = `[${t}] Configuration updated. Validating system service health & socket response...`;
        statusType = 'info';
      } else if (step === 4) {
        if (simulatedFailure) {
          logMsg = `[${t}] ● Verification Failed: Service health check timeout on port 22`;
          statusType = 'error';
        } else {
          logMsg = `[${t}] Running targeted scan on AC-6 Least Privilege & IA-2 Identification controls...`;
          statusType = 'info';
        }
      } else if (step >= 5) {
        clearInterval(interval);
        if (simulatedFailure) {
          logMsg = `[${t}] Rollback initiated -> Previous configuration snapshot restored in 2.1s`;
          statusType = 'warn';
          setIsRollbackDone(true);
        } else {
          logMsg = `[${t}] ✓ Verification successful! Fresh evidence hash collected. Control marked PASSED.`;
          statusType = 'success';
        }
        setIsFinished(true);
      }

      setLogs((prev) => [...prev, { timestamp: t, text: logMsg, status: statusType }]);
    }, 1200);

    return () => clearInterval(interval);
  }, [systemName, remediationAction, simulatedFailure]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-5 rounded-xl border border-cyan-500/50 bg-[#090E17] text-slate-200 space-y-5 font-sans shadow-2xl">
      
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-[#00E5FF] animate-pulse" />
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-tight">
              LIVE REMEDIATION &amp; REASSESSMENT CONSOLE
            </h3>
            <p className="text-xs text-slate-400">
              Target: <strong className="text-slate-200 font-mono">{systemName}</strong> · Action: <strong className="text-cyan-300 font-mono">{remediationAction}</strong>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
          {isFinished ? (simulatedFailure ? 'ROLLBACK RESTORED' : 'VERIFIED PASSED') : 'EXECUTING'}
        </span>
      </div>

      {/* Assessment Stages Progress Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-xs">
        {stages.map((stg, idx) => {
          const isDone = idx < currentStage || (idx === currentStage && isFinished && !simulatedFailure);
          const isCurrent = idx === currentStage && !isFinished;
          const isFailed = idx === currentStage && simulatedFailure;

          return (
            <div 
              key={stg.id}
              className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all ${
                isDone 
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400'
                  : isFailed
                    ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                    : isCurrent
                      ? 'bg-cyan-950/50 border-[#00E5FF] text-[#00E5FF] animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'bg-[#0B1322] border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span>STAGE {idx + 1}</span>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : isCurrent ? '●' : '○'}
              </div>
              <div className="text-[11px] font-semibold mt-1 leading-tight">
                {stg.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Auto-scrolling Terminal Log */}
      <div 
        ref={logRef}
        className="h-40 bg-black/85 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1.5 overflow-y-auto shadow-inner"
      >
        {logs.map((lg, i) => (
          <div 
            key={i} 
            className={`flex items-start gap-2 ${
              lg.status === 'success' ? 'text-emerald-400 font-bold' :
              lg.status === 'error' ? 'text-rose-400 font-bold' :
              lg.status === 'warn' ? 'text-amber-300 font-semibold' : 'text-slate-300'
            }`}
          >
            <span className="text-slate-600 select-none">&gt;</span>
            <span>{lg.text}</span>
          </div>
        ))}
      </div>

      {/* Reassessment Targeted Scan Experience (Requirement 7) */}
      <div className="p-3.5 rounded-lg bg-[#0B1322] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            REASSESSING AFFECTED CONTROLS
          </span>
          <span className="text-cyan-400 font-bold">2 Controls Selected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="p-2 rounded bg-[#080E18] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">AC-6 Least Privilege</span>
            <span className={isFinished ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold animate-pulse'}>
              {isFinished ? '✓ PASSED' : '● Evaluating'}
            </span>
          </div>

          <div className="p-2 rounded bg-[#080E18] border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">IA-2 Identification</span>
            <span className={isFinished ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {isFinished ? '✓ PASSED' : '○ Queued'}
            </span>
          </div>
        </div>
      </div>

      {/* Completion CTA */}
      {isFinished && (
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          {simulatedFailure ? (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <RotateCcw className="w-4 h-4" />
              <span>✓ Rollback Completed - Previous Config Restored</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ REMEDIATION &amp; REASSESSMENT VERIFIED COMPLETE</span>
            </div>
          )}

          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            Acknowledge &amp; View Updated Posture
          </button>
        </div>
      )}

    </div>
  );
};
