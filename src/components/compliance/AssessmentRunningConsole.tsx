import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  X, 
  FileCheck, 
  Download,
  RotateCcw
} from 'lucide-react';

interface AssessmentRunningConsoleProps {
  systemName: string;
  frameworkName: string;
  onComplete: () => void;
  onCancel?: () => void;
  mode?: 'assessment' | 'evidence_package';
  hasEvidenceGaps?: boolean;
}

export const AssessmentRunningConsole: React.FC<AssessmentRunningConsoleProps> = ({
  systemName,
  frameworkName,
  onComplete,
  onCancel,
  mode = 'assessment',
  hasEvidenceGaps = false
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(5);
  const [logs, setLogs] = useState<Array<{ timestamp: string; text: string; active?: boolean }>>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const assessmentStages = [
    { id: 0, label: 'System connected' },
    { id: 1, label: 'OpenSCAP ready' },
    { id: 2, label: 'Wazuh ready' },
    { id: 3, label: 'Collecting evidence' },
    { id: 4, label: 'Evaluating controls' },
    { id: 5, label: 'Building findings' },
    { id: 6, label: 'Completing assessment' }
  ];

  const evidencePackageStages = [
    { id: 0, label: 'Assessment Results' },
    { id: 1, label: 'Evidence Collected' },
    { id: 2, label: 'Findings Included' },
    { id: 3, label: 'POA&M Included' },
    { id: 4, label: 'Approval History Included' },
    { id: 5, label: 'Remediation History Included' },
    { id: 6, label: 'Building Package' },
    { id: 7, label: 'Evidence Package Ready' }
  ];

  const stages = mode === 'assessment' ? assessmentStages : evidencePackageStages;

  useEffect(() => {
    const timeFormatted = () => {
      const now = new Date();
      return now.toTimeString().split(' ')[0];
    };

    const initialLogText = mode === 'assessment' 
      ? `[${timeFormatted()}] Assessment initialized for target system: ${systemName}`
      : `[${timeFormatted()}] Evidence package generation initiated for ${systemName}`;

    setLogs([{ timestamp: timeFormatted(), text: initialLogText, active: true }]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 6;
        const boundedNext = Math.min(next, 100);

        // Update stage based on progress
        const stageStep = Math.min(
          Math.floor((boundedNext / 100) * stages.length),
          stages.length - 1
        );
        setCurrentStageIndex(stageStep);

        // Add log entry
        const timeStr = timeFormatted();
        let logMsg = `[${timeStr}] Progressing stage: ${stages[stageStep].label}`;
        if (mode === 'assessment') {
          if (boundedNext > 20 && boundedNext < 40) logMsg = `[${timeStr}] Connected OpenSCAP & Wazuh telemetry probes`;
          if (boundedNext >= 40 && boundedNext < 60) logMsg = `[${timeStr}] Evaluating AC-6 Least Privilege & IA-2 Identification controls`;
          if (boundedNext >= 60 && boundedNext < 80) logMsg = `[${timeStr}] Correlating configuration evidence with NIST baseline`;
          if (boundedNext >= 80 && boundedNext < 98) logMsg = `[${timeStr}] Generating structured findings & compliance posture metrics`;
          if (boundedNext >= 100) logMsg = `[${timeStr}] Assessment complete. All 28 controls evaluated.`;
        } else {
          if (boundedNext > 20 && boundedNext < 40) logMsg = `[${timeStr}] Indexing cryptographic evidence hashes`;
          if (boundedNext >= 40 && boundedNext < 60) logMsg = `[${timeStr}] Compiling POA&M milestones & approval logs`;
          if (boundedNext >= 60 && boundedNext < 80) logMsg = `[${timeStr}] Bundling verification proofs & remediation history`;
          if (boundedNext >= 80 && boundedNext < 98) logMsg = `[${timeStr}] Formatting PDF & JSON compliance bundle`;
          if (boundedNext >= 100) logMsg = hasEvidenceGaps ? `[${timeStr}] Evidence package compiled. Evidence gaps included.` : `[${timeStr}] Evidence package compiled successfully.`;
        }

        setLogs((existing) => [
          ...existing.map(l => ({ ...l, active: false })),
          { timestamp: timeStr, text: logMsg, active: true }
        ]);

        return boundedNext;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [systemName, frameworkName, mode]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-3xl bg-[#090E17] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.2)] p-6 text-slate-200 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-[#00E5FF] animate-pulse">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider">
                  {mode === 'assessment' ? 'LIVE MISSION SEQUENCE' : 'EVIDENCE PACKAGE COMPILER'}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
                  {progress < 100 ? 'RUNNING' : 'COMPLETE'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight font-mono mt-0.5">
                {mode === 'assessment' 
                  ? `Assessing ${systemName}` 
                  : `Compiling Evidence Package for ${systemName}`}
              </h2>
            </div>
          </div>

          {onCancel && !isFinished && (
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Smooth Gaming Progress Bar & Rail */}
        <div className="space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">MISSION PROGRESS</span>
            <span className="text-[#00E5FF] font-bold text-sm">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-[#00E5FF] to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,229,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Nodes Timeline */}
        <div className="py-2 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] relative">
            {/* Connecting progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-cyan-400 -translate-y-1/2 transition-all duration-300 z-0"
              style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
            />

            {stages.map((stg, idx) => {
              const isCompleted = idx < currentStageIndex || (idx === currentStageIndex && progress === 100);
              const isCurrent = idx === currentStageIndex && progress < 100;

              return (
                <div key={stg.id} className="relative z-10 flex flex-col items-center group">
                  {/* Circle status node */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : isCurrent
                        ? 'bg-cyan-500/30 border-2 border-[#00E5FF] text-[#00E5FF] animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                        : 'bg-[#0B1322] border border-slate-700 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? '●' : '○'}
                  </div>

                  {/* Stage label */}
                  <span className={`text-[10px] font-mono mt-2 text-center max-w-[80px] leading-tight ${
                    isCompleted ? 'text-emerald-300 font-semibold' : isCurrent ? 'text-[#00E5FF] font-bold' : 'text-slate-500'
                  }`}>
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Auto-scrolling Terminal Activity Feed */}
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              LIVE TELEMETRY FEED
            </span>
            <span className="text-[10px] text-slate-500">Auto-scrolling</span>
          </div>

          <div 
            ref={logContainerRef}
            className="h-36 bg-black/80 border border-slate-800 rounded-xl p-3 overflow-y-auto space-y-1 text-xs text-slate-300 font-mono shadow-inner"
          >
            {logs.map((log, i) => (
              <div key={i} className={`flex items-start gap-2 ${log.active ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}>
                <span className="text-slate-600 select-none">&gt;</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button on Complete */}
        {isFinished && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex flex-col gap-1 text-xs text-emerald-400 font-mono font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{mode === 'assessment' ? '✓ ASSESSMENT COMPLETE' : '✓ EVIDENCE PACKAGE READY'}</span>
              </div>
              {mode === 'evidence_package' && hasEvidenceGaps && (
                <div className="text-[10px] text-amber-400 pl-6">Evidence gaps included</div>
              )}
            </div>

            <button
              type="button"
              onClick={onComplete}
              className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-2"
            >
              {mode === 'assessment' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>View Assessment Results</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Package (ZIP/PDF)</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
