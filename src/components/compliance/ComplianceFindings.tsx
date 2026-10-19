import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert, 
  Terminal, 
  Plus, 
  ExternalLink, 
  Play,
  Check, 
  RotateCcw, 
  Zap, 
  Lock, 
  History, 
  FileCheck 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PlatformFinding, FindingSeverity } from '../../types';
import { AssessmentTimeline } from './AssessmentTimeline';
import { SecurityCheckpointModal } from './SecurityCheckpointModal';
import { RemediationExecutionConsole } from './RemediationExecutionConsole';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { CreatePOAMModal } from './CreatePOAMModal';
import { EvidenceGapModal } from './EvidenceGapModal';

interface ComplianceFindingsProps {
  onOpenFindingDetail?: (finding: PlatformFinding) => void;
}

export const ComplianceFindings: React.FC<ComplianceFindingsProps> = () => {
  const { 
    findings, 
    selectedFinding, 
    setSelectedFinding, 
    role,
    autonomyMode,
    submitRemediation,
    approveRemediation,
    rejectRemediation,
    executeRemediationAndVerify,
    createPOAMItem,
    poamItems,
    isExecutingRemediation,
    updateControlResult,
    configureIntegration,
    addToast
  } = usePlatform();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Gaming Console state
  const [showSecurityCheckpoint, setShowSecurityCheckpoint] = useState<boolean>(false);
  const [showExecutionConsole, setShowExecutionConsole] = useState<boolean>(false);
  const [showPOAMModal, setShowPOAMModal] = useState<boolean>(false);
  const [showEvidenceGapModal, setShowEvidenceGapModal] = useState<boolean>(false);

  const filteredFindings = findings.filter(f => {
    const matchesSev = severityFilter === 'ALL' || f.severity === severityFilter;
    const matchesStat = statusFilter === 'ALL' || f.actionState === statusFilter;
    return matchesSev && matchesStat;
  });

  const activeFinding = selectedFinding || findings[0];

  const isAlreadyInPoam = activeFinding ? poamItems.some(p => p.createdFromFindingId === activeFinding.id) : false;

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'Critical': return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
      case 'High': return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
      case 'Medium': return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      case 'Low': return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            Findings Catalog
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 font-sans">
            Module-neutral security deviations, configuration failures, and threat signals.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="High">High & Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="Open">Open</option>
            <option value="Remediated">Remediated</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Finding List (Left 4 cols) + Detail Pattern (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Finding List */}
        <div className="lg:col-span-4 space-y-2">
          {filteredFindings.map((fnd) => {
            const isSelected = activeFinding?.id === fnd.id;
            return (
              <div
                key={fnd.id}
                onClick={() => setSelectedFinding(fnd)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#121926] border-cyan-500/70 shadow-md'
                    : 'bg-[#0E1420] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getSeverityBadge(fnd.severity)}`}>
                        {fnd.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {fnd.controlRef || fnd.sourceModule}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-white leading-snug">
                      {fnd.title}
                    </h3>

                    <div className="text-[11px] text-slate-300">
                      {fnd.affectedSystemName}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      fnd.actionState === 'Remediated'
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
                        : 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                    }`}>
                      {fnd.actionState}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Reusable Finding Detail Pattern (Section 12) */}
        {activeFinding && (
          <div className="lg:col-span-8 bg-[#0E1420] border border-slate-800 rounded-lg p-6 space-y-5">
            {/* Header */}
            <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(activeFinding.severity)}`}>
                    {activeFinding.severity}
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">
                    {activeFinding.controlRef}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300">
                    Source: {activeFinding.sourceModule}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white tracking-tight">
                  {activeFinding.title}
                </h2>

                <div className="text-xs text-slate-300">
                  Target System: <strong className="text-white">{activeFinding.affectedSystemName}</strong>
                </div>
              </div>

              {/* Status Chips */}
            </div>

            {/* MISSION TIMELINE (Requirement 3) */}
            <AssessmentTimeline
              autonomyMode={autonomyMode}
              approvalState={activeFinding.approvalState}
              actionState={activeFinding.actionState}
              findingActivityHistory={activeFinding.activityHistory}
            />

            {/* What Failed & Why It Matters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  What Failed
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeFinding.whatFailed}
                </p>
              </div>

              <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  Why It Matters
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeFinding.whyItMatters}
                </p>
              </div>
            </div>

            {/* Evidence Provenance (Screen 5) */}
            {activeFinding.evidence.length > 0 ? (
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider flex items-center justify-between">
                  <span>EVIDENCE PROVENANCE &amp; HARVEST</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {activeFinding.evidence[0]?.freshness || 'Verified 2m ago'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  {/* Primary Evidence Source: OpenSCAP */}
                  <div className="p-3 bg-[#080E18] border border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px]">
                      <span>Primary Source: OpenSCAP</span>
                      <span className="text-emerald-400">✓ Connected</span>
                    </div>
                    <div className="text-[11px] text-slate-200 space-y-1 pt-1 border-t border-slate-800">
                      <div>Assessment: <span className="text-white">CIS Linux Benchmark</span></div>
                      <div>Observed: <span className="text-rose-300 font-bold bg-rose-950/40 px-1 rounded">PermitRootLogin yes</span></div>
                      <div>Expected: <span className="text-emerald-300 font-bold bg-emerald-950/40 px-1 rounded">PermitRootLogin no</span></div>
                    </div>
                  </div>

                  {/* Supporting Evidence Source: Wazuh */}
                  <div className="p-3 bg-[#080E18] border border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px]">
                      <span>Supporting Source: Wazuh</span>
                      <span className="text-emerald-400">✓ Connected</span>
                    </div>
                    <div className="text-[11px] text-slate-200 space-y-1 pt-1 border-t border-slate-800">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Wazuh Agent Status</span>
                        <span className="text-emerald-300 font-bold">Agent connected ✓</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>SSH Service Inspection</span>
                        <span className="text-emerald-300 font-bold">Monitored ✓</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>sshd Config Audit</span>
                        <span className="text-emerald-300 font-bold">Monitored ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-rose-950/10 border border-rose-900/30 flex items-center justify-between">
                <span className="text-xs text-rose-300 font-mono">Evidence Unavailable</span>
                <button
                  onClick={() => setShowEvidenceGapModal(true)}
                  className="px-3 py-1 rounded bg-rose-900 text-xs text-white font-semibold hover:bg-rose-800 transition-colors"
                >
                  View Evidence
                </button>
              </div>
            )}

            {/* Recommended Remediation Plan (Screen 5) */}
            <div className="p-4 rounded-xl bg-[#081320] border border-cyan-500/30 text-xs space-y-3 font-sans">
              <div className="font-semibold text-cyan-300 font-mono text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>RECOMMENDED REMEDIATION PLAN</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Execution Provider: OpenSCAP Remediation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-[#090E17] border border-slate-800 space-y-1">
                  <div className="text-[10px] text-amber-400 uppercase font-bold">Recommended Action</div>
                  <div className="text-white font-semibold">{activeFinding.recommendation || 'Disable direct SSH root login'}</div>
                </div>

                <div className="p-2.5 rounded bg-[#090E17] border border-slate-800 space-y-1">
                  <div className="text-[10px] text-amber-400 uppercase font-bold">State Shift</div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded">Current: PermitRootLogin yes</span>
                    <span>→</span>
                    <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">Target: PermitRootLogin no</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 bg-[#090E17] border border-slate-800 rounded">
                  <span className="text-amber-400 block text-[10px]">Risk</span>
                  <span className="text-emerald-400 font-bold">Low</span>
                </div>
                <div className="p-2 bg-[#090E17] border border-slate-800 rounded">
                  <span className="text-amber-400 block text-[10px]">Execution Method</span>
                  <span className="text-cyan-400 font-bold">OpenSCAP Remediation</span>
                </div>
                <div className="p-2 bg-[#090E17] border border-slate-800 rounded">
                  <span className="text-amber-400 block text-[10px]">Rollback Readiness</span>
                  <span className="text-emerald-400 font-bold">✓ Snapshot captured</span>
                </div>
                <div className="p-2 bg-[#090E17] border border-slate-800 rounded">
                  <span className="text-amber-400 block text-[10px]">Verification Probe</span>
                  <span className="text-cyan-400 font-bold">Automated Re-scan</span>
                </div>
              </div>
            </div>

            {/* Requirement 8: BEFORE vs AFTER ANIMATED COMPARISON */}
            {(activeFinding.verificationState === 'Verified' || activeFinding.actionState === 'Remediated') && (
              <BeforeAfterComparison
                findingTitle={activeFinding.title}
                controlRef={activeFinding.controlRef || 'AC-6 Least Privilege'}
                systemName={activeFinding.affectedSystemName}
                beforeScore={82}
                afterScore={89}
              />
            )}

            {/* Activity History */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-300" />
                Finding History
              </div>
              <div className="divide-y divide-slate-700/80">
                {activeFinding.activityHistory.map((item, idx) => (
                  <div key={idx} className="py-2 text-[11px] flex items-start gap-2">
                    <span className="font-mono text-slate-400 shrink-0">
                      {item.timestamp.split('T')[1]?.substring(0, 8) || '11:24:12'}
                    </span>
                    <span className="text-cyan-300 font-medium shrink-0">[{item.actor}]</span>
                    <span className="text-slate-200">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Human-in-the-Loop Remediation Workflow Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Action 1: Add to POA&M */}
                <button
                  onClick={() => setShowPOAMModal(true)}
                  disabled={role === 'Viewer' || isAlreadyInPoam}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    isAlreadyInPoam 
                      ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-default'
                      : role === 'Viewer'
                        ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600'
                  }`}
                  title={role === 'Viewer' ? 'Analyst role or higher required.' : ''}
                >
                  {isAlreadyInPoam ? 'Added to POA&M ✓' : '+ Add to POA&M'}
                </button>
              </div>

              {/* Workflow Stepper: Analyst Submits -> Admin Approves -> ATLAS Executes -> Verify */}
              <div className="flex items-center gap-2">
                {activeFinding.actionState === 'Remediated' ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified Remediated
                  </div>
                ) : (
                  <>
                    {/* Analyst submits */}
                    {activeFinding.approvalState === 'Recommended' && (
                      <button
                        onClick={() => submitRemediation(activeFinding.id)}
                        disabled={role === 'Viewer'}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition-colors ${
                          role === 'Viewer'
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'text-black bg-cyan-400 hover:bg-cyan-300 shadow-sm'
                        }`}
                        title={role === 'Viewer' ? 'Analyst role or higher required.' : 'Submit targeted configuration remediation for admin approval'}
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Approve &amp; Execute
                      </button>
                    )}

                    {/* Pending Approval: Admin or SuperAdmin approves */}
                    {activeFinding.approvalState === 'Pending Approval' && (
                      <div className="flex items-center gap-2">
                        {role === 'Analyst' ? (
                          <div className="text-xs text-amber-400 font-mono italic">
                            Awaiting Admin approval (Analyst cannot self-approve)
                          </div>
                        ) : role === 'Admin' || role === 'SuperAdmin' ? (
                          <button
                            onClick={() => setShowSecurityCheckpoint(true)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Approve Remediation (Admin)
                          </button>
                        ) : (
                          <div className="text-xs text-slate-500 italic">
                            Awaiting Admin authorization
                          </div>
                        )}
                      </div>
                    )}

                    {/* Approved: Trigger execution & verification */}
                    {activeFinding.approvalState === 'Approved' && (
                      <button
                        onClick={() => setShowExecutionConsole(true)}
                        disabled={isExecutingRemediation}
                        className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-colors shadow-sm disabled:opacity-50 cursor-pointer font-bold"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Execute &amp; Reassess Now
                      </button>
                    )}

                    {activeFinding.approvalState === 'Executing' && (
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
                        <Terminal className="w-4 h-4 animate-spin" />
                        Executing targeted fix and collecting fresh probe...
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
              {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-4">
               <button onClick={() => setSelectedFinding(null)} className="text-slate-300 hover:text-white text-xs flex items-center gap-1.5 font-medium">
                 <ArrowLeft className="w-3 h-3" /> Back to Findings
               </button>
               <button className="text-slate-300 hover:text-white text-xs flex items-center gap-1.5 font-medium">
                 View Assessment <ExternalLink className="w-3 h-3" />
               </button>
            </div>
          </div>
        )}
      </div>

      {/* SECURITY CHECKPOINT MODAL (Requirement 4 & 5) */}
      {showSecurityCheckpoint && activeFinding && (
        <SecurityCheckpointModal
          targetSystemName={activeFinding.affectedSystemName}
          findingTitle={activeFinding.title}
          proposedAction={activeFinding.recommendation}
          expectedImpact="Remediates security non-conformity and updates control posture score to PASSED"
          rollbackReadiness="Automated configuration snapshot captured (Restore time < 2s)"
          supportingEvidence={activeFinding.evidence[0]?.hash || 'hash_x8f391a20e'}
          autonomyMode={autonomyMode}
          onApprove={() => {
            setShowSecurityCheckpoint(false);
            approveRemediation(activeFinding.id);
            setShowExecutionConsole(true);
          }}
          onReject={() => {
            setShowSecurityCheckpoint(false);
            rejectRemediation(activeFinding.id);
          }}
        />
      )}

      {/* EVIDENCE GAP MODAL */}
      {showEvidenceGapModal && activeFinding && (
        <EvidenceGapModal
          finding={activeFinding}
          onClose={() => setShowEvidenceGapModal(false)}
          onUpdateResult={updateControlResult}
          configureIntegration={configureIntegration}
          addToast={addToast}
        />
      )}

      {/* CREATE POA&M MODAL */}
      {showPOAMModal && activeFinding && (
        <CreatePOAMModal
          finding={activeFinding}
          onClose={() => setShowPOAMModal(false)}
          onCreate={(finding, owner, targetDate, milestone) => {
            createPOAMItem(finding, owner, targetDate, milestone);
            setShowPOAMModal(false);
          }}
        />
      )}

      {/* REMEDIATION EXECUTION & REASSESSMENT CONSOLE (Requirement 6 & 7) */}
      {showExecutionConsole && activeFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl">
            <RemediationExecutionConsole
              findingTitle={activeFinding.title}
              systemName={activeFinding.affectedSystemName}
              remediationAction={activeFinding.recommendation}
              autonomyMode={autonomyMode}
              onComplete={async () => {
                setShowExecutionConsole(false);
                await executeRemediationAndVerify(activeFinding.id);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
