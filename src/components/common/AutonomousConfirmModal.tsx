import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Clock, 
  Layers, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  FileText,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Activity
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

type ModalStage = 'confirm' | 'initializing' | 'active';

export const AutonomousConfirmModal: React.FC = () => {
  const { 
    showAutonomousModal, 
    confirmAutonomousMode, 
    cancelAutonomousModeModal,
    setAutonomyMode,
    setActiveNav,
    addToast,
    systems
  } = usePlatform();

  const [stage, setStage] = useState<ModalStage>('confirm');
  const [initStep, setInitStep] = useState<number>(0);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState<boolean>(false);
  const [workflowScenario, setWorkflowScenario] = useState<'nominal' | 'barrier'>('nominal');
  const [timestamps, setTimestamps] = useState({
    t1: '11:42:08',
    t2: '11:42:09',
    t3: '11:42:09',
    t4: '11:42:10',
    t5: '11:42:10'
  });

  // Reset stage whenever modal opens
  useEffect(() => {
    if (showAutonomousModal) {
      setStage('confirm');
      setInitStep(0);
      setShowWorkflowDetails(false);

      // Generate current local timestamps for the timeline stream
      const now = new Date();
      const formatTime = (d: Date) => d.toTimeString().split(' ')[0];
      const t1 = new Date(now.getTime() - 2000);
      const t2 = new Date(now.getTime() - 1500);
      const t3 = new Date(now.getTime() - 1000);
      const t4 = new Date(now.getTime() - 500);
      const t5 = now;

      setTimestamps({
        t1: formatTime(t1),
        t2: formatTime(t2),
        t3: formatTime(t3),
        t4: formatTime(t4),
        t5: formatTime(t5)
      });
    }
  }, [showAutonomousModal]);

  // Command console activation transition sequence
  const initializationSteps = [
    { label: 'Loading autonomy policy', duration: 260 },
    { label: 'Validating operator permissions', duration: 280 },
    { label: 'Evaluating connected system permissions', duration: 320 },
    { label: 'Calculating executable action scope', duration: 320 },
    { label: 'Audit logging enabled', duration: 240 },
    { label: 'Autonomous Mode active', duration: 280 }
  ];

  const handleStartActivation = () => {
    setStage('initializing');
    setInitStep(0);

    let currentStep = 0;
    const executeNextStep = () => {
      if (currentStep < initializationSteps.length - 1) {
        currentStep += 1;
        setInitStep(currentStep);
        setTimeout(executeNextStep, initializationSteps[currentStep].duration);
      } else {
        // Activation complete: shift platform state to Autonomous
        setTimeout(() => {
          setAutonomyMode('Autonomous');
          addToast('Autonomous Mode active across ATLAS. 12 action scopes operational.', 'success');
          setStage('active');
        }, 300);
      }
    };

    setTimeout(executeNextStep, initializationSteps[0].duration);
  };

  const handleConfirmAutonomous = () => {
    confirmAutonomousMode();
    addToast('Autonomy policy updated', 'success');
  };

  const handleDone = () => {
    cancelAutonomousModeModal();
  };

  const handleViewPolicy = () => {
    setActiveNav('sys-admin');
    cancelAutonomousModeModal();
  };

  const handleViewActivity = () => {
    setActiveNav('platform-ops');
    cancelAutonomousModeModal();
  };

  if (!showAutonomousModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-[#090F1B] border border-amber-500/40 rounded-xl shadow-2xl relative text-slate-100 font-sans my-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="autonomous-modal-title"
      >
        {/* Top Header Strip with Amber Security Border Glow */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* =========================================================================
            STAGE 1: CONFIRMATION PHASE
            ========================================================================= */}
        {stage === 'confirm' && (
          <div className="p-6 space-y-5 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 id="autonomous-modal-title" className="atlas-page-title text-base sm:text-lg">
                  Confirm Autonomous Mode
                </h2>
                <p className="atlas-secondary-text text-slate-400 mt-0.5">
                  Enable autonomous execution within configured policy boundaries
                </p>
              </div>
            </div>

            {/* Main Body Statement */}
            <div className="border-t border-slate-800/90 pt-4">
              <p className="atlas-body-text text-slate-300 leading-relaxed">
                ATLAS may execute permitted actions without individual approval when allowed by the configured autonomy policy, user permissions, and connected system access
              </p>
            </div>

            {/* Warning Callout */}
            <div className="rounded-lg bg-[#140E05] border border-amber-500/60 p-3.5 space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.08)]">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  WARNING
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium leading-relaxed">
                Autonomous actions are recorded in the audit log. Actions outside configured policy boundaries will require approval or will not execute
              </p>
            </div>

            {/* Confirmation Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={cancelAutonomousModeModal}
                className="px-4 py-2 atlas-button-label text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAutonomous}
                className="px-4 py-2 atlas-button-label font-semibold text-slate-950 bg-[#FFB300] hover:bg-[#FFA000] rounded-lg transition-all shadow-[0_0_15px_rgba(255,179,0,0.3)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                Enable Autonomous Mode
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2: ACTIVATION TRANSITION SEQUENCE (1 - 2 SECONDS)
            ========================================================================= */}
        {stage === 'initializing' && (
          <div className="p-6 space-y-5 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 animate-pulse stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="atlas-page-title text-base tracking-wider uppercase flex items-center gap-2 text-white">
                    <span>INITIALIZING AUTONOMY</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </h2>
                  <p className="atlas-secondary-text text-slate-400 mt-0.5">
                    Command console evaluating operational boundaries before activation
                  </p>
                </div>
              </div>

              <span className="atlas-metadata text-cyan-400 font-mono">
                {Math.round(((initStep + 1) / initializationSteps.length) * 100)}%
              </span>
            </div>

            {/* Slender Progress Bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-200 ease-out"
                style={{ width: `${Math.round(((initStep + 1) / initializationSteps.length) * 100)}%` }}
              />
            </div>

            {/* Console Sequence Stream */}
            <div className="rounded-lg bg-[#050912] border border-slate-800/90 p-4 space-y-2 font-mono text-xs shadow-inner">
              {initializationSteps.map((step, idx) => {
                const isPassed = idx < initStep;
                const isCurrent = idx === initStep;

                return (
                  <div 
                    key={step.label}
                    className={`flex items-center justify-between transition-colors ${
                      isPassed 
                        ? 'text-emerald-400' 
                        : isCurrent 
                        ? 'text-cyan-300 font-medium' 
                        : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 text-center text-slate-700 shrink-0">○</span>
                      )}
                      <span>{step.label}</span>
                    </div>

                    <span className="text-[10px] text-slate-500 uppercase">
                      {isPassed ? 'OK' : isCurrent ? 'RUNNING' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Terminal Telemetry Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>[ENCLAVE: VANGUARD_ROOT]</span>
              <span>[CRYPTO_ROOT: HSM_VALIDATED]</span>
              <span>[AUDIT: CONTINUOUS]</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3: AUTONOMOUS MODE ENABLED OPERATIONAL CONSOLE
            ========================================================================= */}
        {stage === 'active' && (
          <div className="p-6 space-y-5 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
            {/* Console Header & Status Indicator */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="atlas-page-title text-base uppercase tracking-wider text-white">
                    AUTONOMOUS MODE ACTIVE
                  </h2>
                  <p className="atlas-secondary-text text-slate-400 mt-0.5">
                    ATLAS can execute permitted actions automatically within configured policy boundaries.
                  </p>
                </div>
              </div>

              {/* Prominent Active Indicator */}
              <div className="atlas-status-label flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
                <span>● ACTIVE</span>
              </div>
            </div>

            {/* Effective Autonomy Scope */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="atlas-section-heading uppercase tracking-wider text-slate-400">
                  Effective Autonomy Scope
                </h3>
                <span className="atlas-metadata uppercase text-cyan-400">
                  OPERATIONAL BOUNDARY
                </span>
              </div>

              {/* 4 Console Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Scope */}
                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-0.5">
                  <div className="atlas-metadata uppercase text-slate-400">Scope</div>
                  <div className="atlas-card-title text-white font-semibold truncate">All ATLAS Systems</div>
                  <div className="atlas-secondary-text text-slate-500 text-[10px]">{systems.length || 5} Connected Hosts</div>
                </div>

                {/* Allowed Automatically */}
                <div className="p-3 rounded-lg bg-[#081514] border border-emerald-900/60 space-y-0.5">
                  <div className="atlas-metadata uppercase text-emerald-400/90 font-semibold">Allowed Automatically</div>
                  <div className="text-sm font-bold text-emerald-400">12 actions</div>
                  <div className="atlas-secondary-text text-emerald-500/80 text-[10px]">Zero-touch execution</div>
                </div>

                {/* Approval Required */}
                <div className="p-3 rounded-lg bg-[#151208] border border-amber-900/60 space-y-0.5">
                  <div className="atlas-metadata uppercase text-amber-400/90 font-semibold">Approval Required</div>
                  <div className="text-sm font-bold text-amber-400">7 actions</div>
                  <div className="atlas-secondary-text text-amber-500/80 text-[10px]">Operator sign-off</div>
                </div>

                {/* Blocked */}
                <div className="p-3 rounded-lg bg-[#140A0F] border border-rose-900/60 space-y-0.5">
                  <div className="atlas-metadata uppercase text-rose-400/90 font-semibold">Blocked</div>
                  <div className="text-sm font-bold text-rose-400">4 actions</div>
                  <div className="atlas-secondary-text text-rose-500/80 text-[10px]">Strict barrier</div>
                </div>
              </div>

              {/* Visual Distribution Ratio Bar */}
              <div className="p-2.5 rounded-lg bg-[#070D16] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between atlas-metadata text-[10px] text-slate-400">
                  <span>ACTION RATIO (23 TOTAL)</span>
                  <span className="text-slate-500">52% AUTO · 30% APPROVAL · 18% BLOCKED</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-400" style={{ width: '52%' }} title="12 Allowed Automatically" />
                  <div className="h-full bg-amber-400" style={{ width: '30%' }} title="7 Approval Required" />
                  <div className="h-full bg-rose-500" style={{ width: '18%' }} title="4 Blocked" />
                </div>
              </div>
            </div>

            {/* Operational Timeline: Autonomy Activity Timeline */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="atlas-section-heading uppercase tracking-wider text-slate-400">
                  Autonomy Activity Timeline
                </h3>
                <span className="atlas-metadata uppercase text-emerald-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>SOC LOG STREAM</span>
                </span>
              </div>

              <div className="rounded-lg bg-[#050A14] border border-slate-800/90 p-3 space-y-2 font-mono text-[11px] text-slate-300 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500">{timestamps.t1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Policy evaluated</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">SYS_ADMIN</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500">{timestamps.t2}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Permissions validated</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">SUPERADMIN</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500">{timestamps.t3}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Effective action scope calculated</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">POLICY_CORE</span>
                </div>

                <div className="flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-500 font-semibold">{timestamps.t4}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                    <span className="font-semibold">Autonomous Mode activated</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">COMMITTED</span>
                </div>

                <div className="flex items-center justify-between text-emerald-400/90">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500">{timestamps.t5}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Audit monitoring active</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">LEDGER_ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Ongoing Autonomous Activity & Workflow Lifecycle (Gaming Console Command Pattern) */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowWorkflowDetails(!showWorkflowDetails)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#0A101C] border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="atlas-section-heading text-slate-200">
                    Ongoing Autonomous Workflow Architecture
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="atlas-metadata text-slate-400">5-STAGE ENGINE</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showWorkflowDetails ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </button>

              {showWorkflowDetails && (
                <div className="p-3.5 rounded-lg bg-[#070D16] border border-slate-800 space-y-3.5 animate-in fade-in duration-150">
                  {/* The 5-Step Workflow: Observe → Recommend → Policy Check → Execute → Verify */}
                  <div className="space-y-1.5">
                    <div className="atlas-metadata uppercase text-slate-400">
                      AUTONOMOUS EXECUTION PIPELINE
                    </div>
                    <div className="flex items-center flex-wrap gap-1.5 pt-0.5 text-xs font-sans">
                      <span className="px-2 py-0.5 rounded bg-[#0A1A2E] text-cyan-300 border border-cyan-800/60 font-medium">
                        1. Observe
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-0.5 rounded bg-[#0A1A2E] text-cyan-300 border border-cyan-800/60 font-medium">
                        2. Recommend
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-0.5 rounded bg-[#2A1E07] text-amber-300 border border-amber-800/60 font-medium">
                        3. Policy Check
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-0.5 rounded bg-[#0A261E] text-emerald-300 border border-emerald-800/60 font-medium">
                        4. Execute
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="px-2 py-0.5 rounded bg-[#0A261E] text-emerald-300 border border-emerald-800/60 font-medium">
                        5. Verify
                      </span>
                    </div>
                  </div>

                  {/* Scenario Toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="atlas-metadata uppercase text-slate-400">
                      TELEMETRY PREVIEW
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-sans">
                      <button
                        type="button"
                        onClick={() => setWorkflowScenario('nominal')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          workflowScenario === 'nominal'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Nominal Execution
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkflowScenario('barrier')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          workflowScenario === 'barrier'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/50 font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Policy Gated / Recovery
                      </button>
                    </div>
                  </div>

                  {/* Live Simulation Stream */}
                  {workflowScenario === 'nominal' ? (
                    <div className="space-y-1 font-mono text-[11px] bg-[#050A12] p-2.5 rounded border border-slate-800 text-slate-300">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>12:14:22  Configuration drift detected</span>
                        <span className="text-cyan-400 text-[10px]">OBSERVE</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>12:14:24  Remediation evaluated</span>
                        <span className="text-cyan-400 text-[10px]">RECOMMEND</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-300">
                        <span>12:14:25  Policy check passed</span>
                        <span className="text-amber-400 text-[10px]">POLICY CHECK</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-300">
                        <span>12:14:27  Remediation executed</span>
                        <span className="text-emerald-400 text-[10px]">EXECUTE</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400 font-semibold">
                        <span>12:14:31  Verification passed</span>
                        <span className="text-emerald-400 text-[10px]">VERIFIED (100%)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-[11px] bg-[#050A12] p-2.5 rounded border border-slate-800 text-slate-300">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>12:21:04  High-impact kernel syscall anomaly</span>
                        <span className="text-cyan-400 text-[10px]">OBSERVE</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>12:21:05  Remediation evaluated</span>
                        <span className="text-cyan-400 text-[10px]">RECOMMEND</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400">
                        <span>12:21:06  Policy check: Approval Required</span>
                        <span className="text-amber-400 text-[10px]">GATED</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-300">
                        <span>12:21:07  Execution paused → Queued for operator sign-off</span>
                        <span className="text-amber-400 text-[10px]">WAITING</span>
                      </div>
                      <div className="flex items-center justify-between text-rose-400 font-semibold">
                        <span>12:21:08  Operator Attention Required [Audit Logged]</span>
                        <span className="text-rose-400 text-[10px]">HUMAN-IN-THE-LOOP</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleViewPolicy}
                  className="px-3.5 py-1.5 rounded-lg atlas-button-label text-slate-300 hover:text-white bg-[#0C1524] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs w-full sm:w-auto justify-center"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Autonomy Policy</span>
                </button>
                <button
                  type="button"
                  onClick={handleViewActivity}
                  className="px-3.5 py-1.5 rounded-lg atlas-button-label text-slate-300 hover:text-white bg-[#0C1524] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs w-full sm:w-auto justify-center"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Activity Log</span>
                </button>
              </div>

              {/* Done: Primary Completion Action */}
              <button
                type="button"
                onClick={handleDone}
                className="px-5 py-1.5 atlas-button-label font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer w-full sm:w-auto text-center"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
