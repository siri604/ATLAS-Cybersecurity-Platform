import React from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Check, 
  AlertTriangle, 
  Layers, 
  Info,
  Lock,
  ArrowRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { AutonomyMode } from '../../types';

export const AutonomySettings: React.FC = () => {
  const { autonomyMode, requestAutonomyChange, role } = usePlatform();

  const modes: {
    id: AutonomyMode;
    title: string;
    description: string;
    actionBehavior: string;
    warning?: string;
  }[] = [
    {
      id: 'Observe',
      title: 'Observe',
      description: 'ATLAS detects, analyzes, and reports security events and posture anomalies.',
      actionBehavior: 'No recommendations generated and no actions executed.'
    },
    {
      id: 'Recommend',
      title: 'Recommend',
      description: 'ATLAS provides contextual recommended actions and remediation playbooks.',
      actionBehavior: 'Customer or operator performs all remediation actions manually.'
    },
    {
      id: 'Approval required',
      title: 'Approval required (Safer Default)',
      description: 'ATLAS may execute permitted actions only after explicit authorized approval.',
      actionBehavior: 'Analyst submits remediation, Admin approves, and ATLAS orchestrates targeted execution with automated verification.'
    },
    {
      id: 'Autonomous',
      title: 'Autonomous',
      description: 'ATLAS may execute permitted actions without per-action approval, subject to policy and available technical permissions.',
      actionBehavior: 'Automated execution and instant reassessment across connected privileged systems.',
      warning: 'Autonomous mode requires confirmation and audit log attestation.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h1 className="atlas-page-title">
            Autonomy & Approvals
          </h1>
        </div>
        <p className="atlas-page-desc">
          Shared platform execution policy. Modules consume this effective policy rather than enforcing separate local autonomy settings.
        </p>
      </div>

      {role !== 'SuperAdmin' && (
        <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Viewing as <strong className="text-slate-200">{role}</strong>. Platform execution policy modifications require <strong className="text-amber-400">SuperAdmin</strong> role. Switch role in the top bar to test modification.
          </span>
        </div>
      )}

      {/* 4 Autonomy Modes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="atlas-section-heading">Autonomy</h2>
          <span className="atlas-metadata uppercase text-cyan-400">EFFECTIVE PLATFORM MODE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((m) => {
            const isCurrent = autonomyMode === m.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (role === 'SuperAdmin' || role === 'Admin') {
                    requestAutonomyChange(m.id);
                  }
                }}
                className={`p-5 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-md ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-[#0E1420] hover:border-slate-700'
                } ${role === 'SuperAdmin' || role === 'Admin' ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="atlas-card-title font-semibold text-white">{m.title}</h3>
                    </div>
                    {isCurrent && (
                      <span className="atlas-status-label text-cyan-400 bg-cyan-500/20 border border-cyan-500/50 px-2 py-0.5 rounded">
                        Active Policy
                      </span>
                    )}
                  </div>

                  <p className="atlas-secondary-text mt-2 leading-relaxed text-slate-300">
                    {m.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded bg-black/40 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    <span className="text-slate-500">Behavior: </span>
                    {m.actionBehavior}
                  </div>
                </div>

                {m.warning && (
                  <div className="mt-3 text-[10px] text-amber-400 flex items-center gap-1.5 font-sans">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{m.warning}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Approvals Governance */}
      <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="atlas-section-heading">Approvals</h3>
          <span className="atlas-metadata uppercase text-slate-400">AUTHORIZATION BOUNDARY</span>
        </div>
        <p className="atlas-secondary-text leading-relaxed">
          Actions requiring administrative approval are queued in the Operations authorization pool before dispatch to target systems.
        </p>
        <div className="flex items-center gap-4 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Dual-operator approval for high-impact remediations</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Pre-authorized low-risk operational rollbacks</span>
          </div>
        </div>
      </div>

      {/* Planned Future Policy Hierarchy (Section 20) */}
      <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="atlas-section-heading">
              Future policy controls
            </h3>
          </div>
          <span className="atlas-status-label text-amber-400 bg-[#2A1E07] border border-amber-500/70 px-2 py-0.5 rounded">
            PLANNED
          </span>
        </div>

        <p className="atlas-secondary-text leading-relaxed">
          Future versions will allow ATLAS autonomy policies to be inherited and overridden at different organizational scopes.
        </p>

        {/* Visual Hierarchy Diagram */}
        <div className="space-y-2">
          <div className="atlas-metadata uppercase tracking-wider">Example hierarchy:</div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-slate-300">
            <div className="p-2 rounded bg-slate-900 border border-slate-700 font-medium text-white">
              Global
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="p-2 rounded bg-slate-900 border border-slate-700 font-medium text-white">
              Tenant
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="p-2 rounded bg-slate-900 border border-slate-700 font-medium text-white">
              Organization
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <div className="p-2 rounded bg-slate-900 border border-slate-700 font-medium text-cyan-400">
              System
            </div>
          </div>
        </div>

        {/* Future capabilities list */}
        <div className="pt-2 border-t border-slate-800">
          <div className="atlas-metadata uppercase tracking-wider mb-2">
            Future capabilities (Planned):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans">
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">Global policy</span>
              <span className="atlas-metadata">Planned</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">Tenant policy</span>
              <span className="atlas-metadata">Planned</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">Organization policy</span>
              <span className="atlas-metadata">Planned</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">System-specific overrides</span>
              <span className="atlas-metadata">Planned</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">Policy inheritance</span>
              <span className="atlas-metadata">Planned</span>
            </div>
            <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 flex justify-between">
              <span className="atlas-card-title">Audit history</span>
              <span className="atlas-metadata">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
