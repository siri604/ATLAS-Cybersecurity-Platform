import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Terminal, 
  AlertTriangle, 
  ShieldAlert, 
  Play, 
  ArrowRight,
  TrendingUp,
  Lock
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface AssessmentProgressProps {
  systemId: string;
  frameworkId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  systemId,
  frameworkId,
  onComplete,
  onBack
}) => {
  const { autonomyMode, systems } = usePlatform();
  const selectedSystem = systems.find(s => s.id === systemId) || { name: 'linux-prod-01' };

  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setCurrentStageIndex] = useState<number>(0);
  const [logs, setLogs] = useState<Array<{ time: string; text: string; severity?: 'high' | 'info' | 'success' }>>([]);
  const [evaluatedCount, setEvaluatedCount] = useState<number>(0);
  const [passedCount, setPassedCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [needsReviewCount, setNeedsReviewCount] = useState<number>(0);

  const stages = [
    { label: 'Target connected', key: 'connected' },
    { label: 'OpenSCAP assessment started', key: 'openscap' },
    { label: 'Wazuh evidence collected', key: 'wazuh' },
    { label: 'Technical checks evaluating', key: 'evaluating' },
    { label: 'Compliance mappings updating', key: 'register' },
    { label: 'Findings generating', key: 'findings' },
    { label: 'Assessment complete', key: 'complete' }
  ];

  useEffect(() => {
    const timeFormatted = () => {
      const d = new Date();
      return d.toTimeString().split(' ')[0];
    };

    setLogs([
      { time: timeFormatted(), text: `Assessment sequence initialized against target: ${selectedSystem.name}`, severity: 'info' }
    ]);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 6) + 4;
        const boundedNext = Math.min(next, 100);

        // Map progress to stage index
        const newStage = Math.min(
          Math.floor((boundedNext / 100) * stages.length),
          stages.length - 1
        );
        setCurrentStageIndex(newStage);

        // Dynamically increment counters based on progress
        const calculatedPassed = Math.min(Math.floor((boundedNext / 100) * 20), 20);
        const calculatedFailed = Math.min(Math.floor((boundedNext / 100) * 3), 3);
        const calculatedReview = Math.min(Math.floor((boundedNext / 100) * 1), 1);

        setPassedCount(calculatedPassed);
        setFailedCount(calculatedFailed);
        setNeedsReviewCount(calculatedReview);

        // Live logs and findings streaming
        const tStr = timeFormatted();
        setLogs((prevLogs) => {
          const updated = [...prevLogs];
          if (boundedNext > 15 && prev < 15) {
            updated.push({ time: tStr, text: 'Established secure credential handshake with Wazuh manager API', severity: 'success' });
          }
          if (boundedNext > 30 && prev < 30) {
            updated.push({ time: tStr, text: 'Triggered OpenSCAP profile evaluation: xccdf_org.ssgproject.content_profile_ospp', severity: 'info' });
          }
          if (boundedNext > 45 && prev < 45) {
            updated.push({ time: tStr, text: 'Assessment discovering potential compliance risks...', severity: 'info' });
          }
          if (boundedNext > 80 && prev < 80) {
            updated.push({ time: tStr, text: '3 findings generated from 3 failed technical checks', severity: 'high' });
          }
          if (boundedNext >= 100) {
            updated.push({ time: tStr, text: 'Assessment completed. 27 in-scope technical checks assessed.', severity: 'success' });
          }
          return updated;
        });

        return boundedNext;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [selectedSystem.name]);

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[#00E5FF] shrink-0">
            <ShieldCheck className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="atlas-page-title text-xl font-bold text-white tracking-tight">
                {progress < 100 ? 'Assessment in progress' : 'Assessment Complete ✓'}
              </h1>

              {/* Autonomy Mode Context (Read-Only) */}
              <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900/60 text-slate-400 text-[10px] font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Current Mode: {autonomyMode || 'Approval required'}</span>
              </span>
            </div>

            <p className="atlas-page-desc text-xs text-slate-400 mt-1">
              {progress < 100 ? 'ATLAS is executing the compliance evaluation probe' : 'Assessment completed. Available evidence has been evaluated for the selected scope.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Assessment Metadata Summary & Big Progress Bar */}
      <div className="p-4.5 rounded-xl border border-slate-800 bg-[#0B1322] space-y-4 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded">
            <span className="text-slate-500 block text-[9px] uppercase font-sans">Target</span>
            <span className="text-white font-bold">{selectedSystem.name}</span>
          </div>
          <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded">
            <span className="text-slate-500 block text-[9px] uppercase font-sans">Framework</span>
            <span className="text-cyan-300 font-bold">CIS Controls v8.1</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Technical baseline: CIS AlmaLinux 9 Benchmark</span>
          </div>
          <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded">
            <span className="text-slate-500 block text-[9px] uppercase font-sans">Autonomy Mode</span>
            <span className="text-white font-bold">{autonomyMode || 'Approval required'}</span>
          </div>
          <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded">
            <span className="text-slate-500 block text-[9px] uppercase font-sans">Assessment Elapsed</span>
            <span className="text-cyan-400 font-bold font-mono">{(progress * 0.12).toFixed(1)}s elapsed</span>
          </div>
        </div>

        {/* Large Assessment Progress Bar */}
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-sans font-medium">ASSESSMENT EXECUTION</span>
            <span className="text-[#00E5FF] font-bold text-sm">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-[#00E5FF] to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,229,255,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Left Timeline + Live Counts / Right Panel Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Live Timeline (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Timeline Node Sequence */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1322] space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              ASSESSMENT STAGES
            </div>

            <div className="space-y-3 pt-1">
              {stages.map((st, idx) => {
                const isCompleted = idx < stageIndex || (idx === stageIndex && progress === 100);
                const isCurrent = idx === stageIndex && progress < 100;

                return (
                  <div key={st.key} className="flex items-center gap-3 text-xs font-mono">
                    {/* Circle Node */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCompleted 
                        ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400' 
                        : isCurrent
                          ? 'bg-cyan-500/30 border border-[#00E5FF] text-[#00E5FF] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                          : 'bg-[#080E18] border border-slate-800 text-slate-600'
                    }`}>
                      {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                    </div>

                    <span className={`transition-colors duration-300 ${
                      isCompleted ? 'text-emerald-300 font-semibold' : isCurrent ? 'text-[#00E5FF] font-bold' : 'text-slate-500'
                    }`}>
                      {st.label} {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry / Terminal Activity Logs */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-2 font-mono">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{progress < 100 ? 'Live Telemetry Worklog' : 'Assessment Activity'}</span>
            </div>

            <div className="h-40 bg-black/70 border border-slate-800 rounded-lg p-3 text-slate-300 text-[11px] overflow-y-auto space-y-1">
              {logs.map((lg, i) => (
                <div key={i} className={`flex items-start gap-2 ${
                  lg.severity === 'high' ? 'text-rose-400 font-semibold' : lg.severity === 'success' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  <span className="text-slate-600 select-none">[{lg.time}]</span>
                  <span>{lg.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Live Counters & compact panels (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Counters */}
          {(() => {
            const notAssessedCount = 27 - passedCount - failedCount - needsReviewCount;
            return (
              <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-3 font-mono">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Assessment Results
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#080E18] border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500">In Scope</div>
                    <div className="text-white font-bold text-lg">27</div>
                  </div>
                  <div className="p-2 bg-[#080E18] border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500 text-slate-400">Not Assessed</div>
                    <div className="text-slate-400 font-bold text-lg">{notAssessedCount}</div>
                  </div>
                  <div className="p-2 bg-[#080E18] border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500 text-emerald-400">Passed</div>
                    <div className="text-emerald-400 font-bold text-lg">{passedCount}</div>
                  </div>
                  <div className="p-2 bg-[#080E18] border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-500 text-rose-400">Failed</div>
                    <div className="text-rose-400 font-bold text-lg">{failedCount}</div>
                  </div>
                </div>

                <div className="p-2 bg-[#080E18] border border-slate-800 rounded text-center text-xs">
                  <div className="text-[10px] text-amber-400">Needs Review</div>
                  <div className="text-amber-400 font-bold text-sm">{needsReviewCount}</div>
                </div>
              </div>
            );
          })()}

          {/* Compact Evidence Sources panel */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-2.5 font-mono text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              CONNECTED COLLECTORS
            </div>
            
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 bg-[#080E18] border border-slate-800/80 rounded">
                <span className="text-slate-300">OpenSCAP</span>
                <span className="text-emerald-400 font-bold">Complete</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#080E18] border border-slate-800/80 rounded">
                <span className="text-slate-300">Wazuh</span>
                <span className="text-emerald-400 font-bold">Complete</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#080E18] border border-slate-800/80 rounded">
                <span className="text-slate-300">Target System</span>
                <span className="text-emerald-400 font-bold">Healthy</span>
              </div>
            </div>
          </div>

          {/* Small Live Findings panel */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-2 font-mono text-xs">
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{progress < 100 ? 'Live Findings Discovered' : 'Findings Discovered'}</span>
            </div>

            <div className="space-y-1.5 text-[10px]">
              {progress > 45 ? (
                <div className="p-2 bg-rose-950/20 border border-rose-900/40 rounded text-rose-300">
                  <div className="font-bold">[CIS 5.2.10] PermitRootLogin enabled</div>
                  <div className="text-slate-400 mt-0.5">High severity · open</div>
                </div>
              ) : (
                <div className="text-slate-500 italic text-center py-2">Waiting for evaluation...</div>
              )}

              {progress > 60 && (
                <div className="p-2 bg-rose-950/20 border border-rose-900/40 rounded text-rose-300">
                  <div className="font-bold">[CIS 1.1.1.2] Mount config missing checks</div>
                  <div className="text-slate-400 mt-0.5">Medium severity · open</div>
                </div>
              )}

              {progress > 75 && (
                <div className="p-2 bg-rose-950/20 border border-rose-900/40 rounded text-rose-300">
                  <div className="font-bold">[CIS 3.4.1] SSH banner missing</div>
                  <div className="text-slate-400 mt-0.5">Medium severity · open</div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Action / CTA Footer */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-end text-xs">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0B1322] hover:bg-slate-800 text-slate-300 font-semibold cursor-pointer transition-colors"
          >
            Back to Assessments
          </button>

          {progress >= 100 && (
            <button
              type="button"
              onClick={onComplete}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-1"
            >
              <span>View Assessment Results</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
