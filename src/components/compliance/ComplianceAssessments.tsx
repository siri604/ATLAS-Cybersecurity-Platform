import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  ChevronRight, 
  AlertCircle, 
  X,
  FileText,
  Download,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ControlResult, ComplianceControl } from '../../types';
import { EvidenceReadinessMeter } from './EvidenceReadinessMeter';
import { AssessmentRunningConsole } from './AssessmentRunningConsole';
import { EvidenceGapModal } from './EvidenceGapModal';
import { EvidenceReviewModal } from './EvidenceReviewModal';

interface ComplianceAssessmentsProps {
  onOpenFinding: (findingId: string) => void;
  onOpenSettings: () => void;
  onNavigateDefineAssessment?: () => void;
}

export const ComplianceAssessments: React.FC<ComplianceAssessmentsProps> = ({
  onOpenFinding,
  onNavigateDefineAssessment
}) => {
  const { 
    complianceAssessments, 
    selectedAssessmentId, 
    setSelectedAssessmentId,
    systems,
    role,
    startAssessment,
    integrations,
    updateControlResult,
    configureIntegration,
    addToast
  } = usePlatform();

  // Wizard state for "+ New Assessment"
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [targetSystemId, setTargetSystemId] = useState<string>('sys-payments-prod');
  const [targetFrameworkId, setTargetFrameworkId] = useState<string>('cis-linux-v1');
  const [isRunningAssessment, setIsRunningAssessment] = useState<boolean>(false);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState<boolean>(false);

  // Tab inside selected assessment detail: Summary | Controls | Evidence | Activity
  const [activeTab, setActiveTab] = useState<'summary' | 'controls' | 'evidence' | 'activity'>('controls');
  const [controlFilter, setControlFilter] = useState<string>('ALL');
  const [activeEvidenceGap, setActiveEvidenceGap] = useState<{assessmentId: string, control: ComplianceControl} | null>(null);
  const [activeReview, setActiveReview] = useState<{assessmentId: string, control: ComplianceControl} | null>(null);

  const selectedAssessment = complianceAssessments.find(a => a.id === selectedAssessmentId) || complianceAssessments[0];

  const identityIntegration = integrations.find(i => i.id === 'int-identity');
  const isIdentityReady = identityIntegration?.status === 'Connected';

  const handleStartNewAssessment = () => {
    setIsWizardOpen(false);
    setIsRunningAssessment(true);
  };

  const handleAssessmentConsoleComplete = () => {
    startAssessment(targetSystemId, targetFrameworkId);
    setIsRunningAssessment(false);
    setWizardStep(1);
  };

  const getResultBadgeClass = (result: ControlResult) => {
    switch (result) {
      case 'Passed': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
      case 'Failed': return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
      case 'Missing Evidence': return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      case 'Not Assessed': return 'text-slate-400 bg-slate-800 border-slate-700';
      case 'Not Applicable': return 'text-slate-500 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HISTORICAL & CONTINUOUS ASSESSMENTS CONTAINER */}
      <div className="p-5 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-4 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <h2 className="atlas-section-heading font-mono font-bold text-xs uppercase tracking-wider text-slate-200">
              Historical &amp; Continuous Assessments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit evaluations executed against connected enclave workloads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (role !== 'Viewer') {
                if (onNavigateDefineAssessment) onNavigateDefineAssessment();
                else setIsWizardOpen(true);
              }
            }}
            disabled={role === 'Viewer'}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              role === 'Viewer'
                ? 'bg-slate-800/60 border border-slate-700/60 text-slate-500 cursor-not-allowed'
                : 'bg-[#00E5FF] hover:bg-[#33EAFF] text-slate-950 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>New Assessment</span>
          </button>
        </div>

        {/* DYNAMIC ASSESSMENT ROWS */}
        <div className="space-y-2.5">
          {complianceAssessments.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAssessmentId(a.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selectedAssessmentId === a.id
                  ? 'bg-[#072433] border-cyan-500/70 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'bg-[#080E18] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold text-white text-xs">
                  {a.name} ({a.systemName})
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold text-[10px] tracking-wide">
                    {a.id.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                    a.missingEvidenceCount > 0 
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-400' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    {a.missingEvidenceCount > 0 ? 'Completed with Missing Evidence' : 'Completed'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  System: <span className="text-slate-200">{a.systemName}</span> · Framework: <span className="text-slate-200">{a.frameworkName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-cyan-400">{a.score}%</div>
                  <div className="text-[10px] text-slate-400 font-mono">{a.passedCount} of {a.controlsAssessed} Passed</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SELECTED ASSESSMENT INSPECTOR DRILL-DOWN */}
      {selectedAssessment && (
        <div className="p-5 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-4 shadow-xs">
          
          {/* Inspection Header */}
          <div className="pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-mono">
                {selectedAssessment.name} ({selectedAssessment.systemName})
              </h3>
              <div className="font-mono text-cyan-400 font-bold text-[10px] mt-0.5">
                {selectedAssessment.id.toUpperCase()}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>System: <strong className="text-slate-200">{selectedAssessment.systemName}</strong></span>
                <span className="text-slate-600">·</span>
                <span>Framework: <strong className="text-cyan-400">{selectedAssessment.frameworkName}</strong></span>
                <span className="text-slate-600">·</span>
                <span>Status: <strong className="text-slate-200">
                  {selectedAssessment.missingEvidenceCount > 0 ? 'Completed with Missing Evidence' : 'Completed'}
                </strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsGeneratingPackage(true)}
                className="px-3 py-1.5 rounded-lg bg-[#121D2F] hover:bg-[#18263E] border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generate Evidence Package</span>
              </button>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Overall Score</div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  {selectedAssessment.score}%
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tabs: Controls | Summary | Evidence Readiness | Activity */}
          <div className="flex items-center gap-4 border-b border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('controls')}
              className={`py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'controls'
                  ? 'border-cyan-400 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Technical Checks ({selectedAssessment.controls.length})
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'summary'
                  ? 'border-cyan-400 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'evidence'
                  ? 'border-cyan-400 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Evidence Readiness
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'border-cyan-400 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Activity ({selectedAssessment.activity.length})
            </button>
          </div>

          {/* TAB: CONTROLS */}
          {activeTab === 'controls' && (
            <div className="py-2 space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Filter by result:</span>
                  {[
                    { id: 'ALL', label: 'All', count: selectedAssessment.controls.length },
                    { id: 'Failed', label: 'Failed', count: selectedAssessment.controls.filter(c => c.result === 'Failed').length },
                    { id: 'Passed', label: 'Passed', count: selectedAssessment.controls.filter(c => c.result === 'Passed').length },
                    { id: 'Missing Evidence', label: 'Missing Evidence', count: selectedAssessment.controls.filter(c => c.result === 'Missing Evidence' || c.result === 'Needs Review').length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setControlFilter(f.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        controlFilter === f.id
                          ? 'bg-slate-700 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {f.label} ({f.count})
                    </button>
                  ))}
                </div>

                <span className="text-slate-500 text-[11px] font-mono">
                  Showing {selectedAssessment.controls.filter(c => controlFilter === 'ALL' || c.result === controlFilter).length} controls
                </span>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden text-xs bg-[#080E18] max-h-[400px] overflow-y-auto">
                {selectedAssessment.controls
                  .filter(c => controlFilter === 'ALL' || (controlFilter === 'Missing Evidence' ? (c.result === 'Missing Evidence' || c.result === 'Needs Review') : c.result === controlFilter))
                  .map((ctrl) => (
                    <div key={ctrl.id} className="p-3.5 hover:bg-[#0B1322] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-200 font-semibold">
                            {ctrl.title}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getResultBadgeClass(ctrl.result)}`}>
                            {ctrl.result}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          Observed: {ctrl.rationale}
                        </div>

                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 pt-0.5">
                          <span>Source:</span>
                          <span className="text-slate-400">{ctrl.evidenceSource}</span>
                        </div>
                      </div>

                      <div>
                        {ctrl.result === 'Failed' && ctrl.findingId ? (
                          <button
                            type="button"
                            onClick={() => onOpenFinding(ctrl.findingId!)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                          >
                            View Finding
                          </button>
                        ) : (ctrl.result === 'Missing Evidence' || ctrl.result === 'Needs Review') ? (
                          <div className="flex gap-2">
                            {ctrl.result === 'Needs Review' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveReview({assessmentId: selectedAssessment.id, control: ctrl});
                                }}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                              >
                                Review Evidence
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEvidenceGap({assessmentId: selectedAssessment.id, control: ctrl});
                              }}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                            >
                              View Evidence
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="py-2 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-lg bg-[#080E18] border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Controls Assessed</div>
                  <div className="text-base font-bold font-mono text-white mt-1">
                    {selectedAssessment.controlsAssessed}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080E18] border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Passed</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                    {selectedAssessment.passedCount}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080E18] border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Failed</div>
                  <div className="text-base font-bold font-mono text-rose-400 mt-1">
                    {selectedAssessment.failedCount}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080E18] border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Missing Evidence</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1">
                    {selectedAssessment.missingEvidenceCount}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#080E18] border border-slate-800">
                  <div className="text-slate-500 text-[11px]">Needs Review</div>
                  <div className="text-base font-bold font-mono text-purple-400 mt-1">
                    1
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#080E18] border border-slate-800 leading-relaxed text-slate-300">
                <div className="font-semibold text-white mb-1">Assessment Analysis:</div>
                {selectedAssessment.passedCount} of {selectedAssessment.controlsAssessed} controls passed. {selectedAssessment.failedCount} failed, {selectedAssessment.missingEvidenceCount} are missing evidence, and 1 requires review.
              </div>
            </div>
          )}

          {/* TAB: EVIDENCE READINESS */}
          {activeTab === 'evidence' && (
            <div className="py-2 space-y-3">
              <EvidenceReadinessMeter isIdentityReady={isIdentityReady} />
            </div>
          )}

          {/* TAB: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="py-2 space-y-3">
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-[#080E18] p-3 text-xs">
                {selectedAssessment.activity.map((act, idx) => (
                  <div key={idx} className="py-2.5 flex items-start gap-3">
                    <div className="font-mono text-cyan-400 text-[11px] shrink-0 w-16">
                      {act.timestamp}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{act.event}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{act.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* NEW ASSESSMENT WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0E1420] border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2 font-mono">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Start Compliance Assessment
              </h2>
              <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wizard Steps */}
            <div className="my-4 py-2 border-y border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className={wizardStep === 1 ? 'text-cyan-400 font-bold' : ''}>1. Target System</span>
              <span>→</span>
              <span className={wizardStep === 2 ? 'text-cyan-400 font-bold' : ''}>2. Framework</span>
              <span>→</span>
              <span className={wizardStep === 3 ? 'text-cyan-400 font-bold' : ''}>3. Readiness</span>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-slate-300">
                  Select Target System:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {systems.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setTargetSystemId(s.id)}
                      className={`p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                        targetSystemId === s.id
                          ? 'border-cyan-500 bg-[#072433] text-white'
                          : 'border-slate-800 bg-[#080E18] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.category} · {s.type} ({s.environment})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-slate-300">
                  Select Compliance Framework:
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setTargetFrameworkId('cis-linux-v1')}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition-colors ${
                      targetFrameworkId === 'cis-linux-v1'
                        ? 'border-cyan-500 bg-[#072433] text-white'
                        : 'border-slate-800 bg-[#080E18] text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-white">NIST CSF 2.0 Security Baseline</div>
                    <div className="text-[11px] text-slate-400">Comprehensive security &amp; privacy control benchmarking.</div>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <EvidenceReadinessMeter isIdentityReady={isIdentityReady} compact={true} />
              </div>
            )}

            {/* Wizard Actions */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (wizardStep === 1) setIsWizardOpen(false);
                  else setWizardStep(s => s - 1);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </button>

              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(s => s + 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] rounded-lg transition-colors cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartNewAssessment}
                  disabled={isRunningAssessment}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isRunningAssessment ? 'Executing Audit...' : 'Execute Assessment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIVE MISSION ASSESSMENT CONSOLE */}
      {isRunningAssessment && (
        <AssessmentRunningConsole
          systemName={systems.find(s => s.id === targetSystemId)?.name || 'Customer Portal App Server'}
          frameworkName="NIST CSF 2.0 Baseline"
          onComplete={handleAssessmentConsoleComplete}
          onCancel={() => setIsRunningAssessment(false)}
          mode="assessment"
        />
      )}

      {/* EVIDENCE GAP MODAL */}
      {activeEvidenceGap && (
        <EvidenceGapModal
          assessmentId={activeEvidenceGap.assessmentId}
          control={activeEvidenceGap.control}
          onClose={() => setActiveEvidenceGap(null)}
          onUpdateResult={updateControlResult}
          configureIntegration={configureIntegration}
          addToast={addToast}
        />
      )}

      {/* EVIDENCE REVIEW MODAL */}
      {activeReview && (
        <EvidenceReviewModal
          assessmentId={activeReview.assessmentId}
          control={activeReview.control}
          onClose={() => setActiveReview(null)}
          onUpdateResult={updateControlResult}
        />
      )}

      {/* EVIDENCE PACKAGE COMPILER CONSOLE */}
      {isGeneratingPackage && (
        <AssessmentRunningConsole
          systemName={selectedAssessment.systemName}
          frameworkName={selectedAssessment.frameworkName}
          onComplete={() => setIsGeneratingPackage(false)}
          onCancel={() => setIsGeneratingPackage(false)}
          mode="evidence_package"
        />
      )}

    </div>
  );
};
