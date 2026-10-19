import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Play, 
  Sliders,
  ChevronDown, 
  Check 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ComplianceOverviewProps {
  onNavigateTab: (tab: 'overview' | 'assessments' | 'findings' | 'poam' | 'define-assessment') => void;
  onOpenAssessment: (assessmentId: string) => void;
  onOpenFinding: (findingId: string) => void;
  onOpenSettings?: () => void;
}

export const ComplianceOverview: React.FC<ComplianceOverviewProps> = ({
  onNavigateTab,
  onOpenSettings
}) => {
  const { role, autonomyMode, configureIntegration } = usePlatform();

  const isAdmin = role === 'Admin' || role === 'SuperAdmin';

  // Selected Target System for dropdown (Default to Customer Portal App Server for Admin, Corporate Website for Viewer)
  const [targetSystem, setTargetSystem] = useState<string>(isAdmin ? 'Customer Portal App Server' : 'Corporate Website');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const targetSystemOptions = [
    { label: 'All Systems', sysTag: 'all-systems', scoreOffset: -1 },
    { label: 'Customer Portal App Server', sysTag: 'sys-payments-prod', scoreOffset: 0 },
    { label: 'Corporate Website', sysTag: 'sys-corp-web', scoreOffset: 0 },
    { label: 'Microsoft 365', sysTag: 'sys-m365-tenant', scoreOffset: -4 },
    { label: 'Core Database Primary', sysTag: 'sys-core-db', scoreOffset: 2 },
    { label: 'Logistics Partner Gateway', sysTag: 'sys-logistics-gw', scoreOffset: -2 },
    { label: 'Threat Intel Feed', sysTag: 'sys-threat-feed', scoreOffset: 1 }
  ];

  const currentOption = targetSystemOptions.find(o => o.label === targetSystem) || targetSystemOptions[0];

  // Dynamic stats based on target system
  const overallPosture = 86 + currentOption.scoreOffset;
  const verifiedControls = 82 + Math.round(currentOption.scoreOffset * 0.8);

  return (
    <div className="space-y-5 font-sans">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="atlas-page-title text-xl font-bold text-white tracking-tight">
                Compliance
              </h1>

              {/* Current Mode Badge (Requirement 3) */}
              <span className="px-2 py-0.5 rounded border border-cyan-500/40 bg-[#072433] text-cyan-300 text-[10px] font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Current Mode: {autonomyMode || 'Approval required'}</span>
              </span>
            </div>

            <p className="atlas-page-desc text-xs text-slate-400 mt-1">
              {isAdmin 
                ? 'Compliance governance: manage framework baselines, evidence source mappings, and integrations.'
                : 'Read-only compliance posture, frameworks, audit findings, and verified evidence.'}
            </p>
          </div>
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2.5">
          {/* Governance Config Button (Admin / SuperAdmin) - Requirement 1 */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onOpenSettings && onOpenSettings()}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-[#0B1322] hover:bg-[#0E182A] text-slate-200 text-xs font-semibold flex items-center gap-1.5 font-sans transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-300" />
              <span>Autonomy &amp; Governance</span>
            </button>
          )}

          {/* Start Assessment Button */}
          <button
            type="button"
            onClick={() => role !== 'Viewer' && onNavigateTab('define-assessment')}
            disabled={role === 'Viewer'}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 font-sans transition-all select-none ${
              role === 'Viewer'
                ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 opacity-50 cursor-not-allowed'
                : 'bg-[#00E5FF] hover:bg-[#33EAFF] text-slate-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.25)] cursor-pointer'
            }`}
            title={role === 'Viewer' ? 'Viewer role: Action disabled' : 'Start Assessment'}
          >
            <Play className={`w-3 h-3 fill-current ${role === 'Viewer' ? 'text-slate-500' : 'text-slate-950'}`} />
            <span>Start Assessment</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT WARNING BANNER (Requirement 2) */}
      <div className="p-3 rounded-lg border border-amber-500/40 bg-[#1A140A] text-amber-200 text-xs font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-300 mr-2">1 evidence source needs attention:</span>
            <span className="text-amber-200/90 text-xs">NIST IA-2 identity controls cannot be fully assessed</span>
          </div>
        </div>

        {/* Connect Identity Source Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => configureIntegration('int-identity')}
            className="px-3 py-1 rounded bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1 font-sans"
          >
            Connect Identity Source
          </button>
        )}
      </div>

      {/* 3. TABS & TARGET SYSTEM DROPDOWN ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-2">
        {/* Tabs Bar */}
        <div className="flex items-center gap-6 border-b border-slate-800/80 text-xs font-sans">
          {/* Overview */}
          <button
            type="button"
            onClick={() => onNavigateTab('overview')}
            className="pb-2.5 border-b-2 border-cyan-400 text-cyan-300 font-bold transition-colors cursor-pointer"
          >
            Overview
          </button>

          {/* Assessments 4 */}
          <button
            type="button"
            onClick={() => onNavigateTab('assessments')}
            className="pb-2.5 text-slate-400 hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Assessments</span>
            <span className="px-1.5 py-0.2 rounded bg-[#131D2E] border border-slate-700/60 text-slate-400 text-[10px] font-mono">
              4
            </span>
          </button>

          {/* Findings 3 */}
          <button
            type="button"
            onClick={() => onNavigateTab('findings')}
            className="pb-2.5 text-slate-400 hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Findings</span>
            <span className="px-1.5 py-0.2 rounded bg-[#131D2E] border border-slate-700/60 text-slate-400 text-[10px] font-mono">
              3
            </span>
          </button>

          {/* POA&M 2 */}
          <button
            type="button"
            onClick={() => onNavigateTab('poam')}
            className="pb-2.5 text-slate-400 hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>POA&M</span>
            <span className="px-1.5 py-0.2 rounded bg-[#131D2E] border border-slate-700/60 text-slate-400 text-[10px] font-mono">
              2
            </span>
          </button>
          
          {/* Continuous Monitoring */}
          <button
            type="button"
            onClick={() => onNavigateTab('overview')}
            className="pb-2.5 text-slate-400 hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continuous Monitoring</span>
          </button>
        </div>

        {/* Right side: Target System Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 font-sans font-medium">
            Target System
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#0B1322] hover:bg-[#0E182A] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-sans font-medium transition-colors cursor-pointer shadow-xs"
            >
              <span>{targetSystem}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Dark ATLAS Menu Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-[#0B1322] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs font-sans">
                {targetSystemOptions.map((opt) => {
                  const isSelected = opt.label === targetSystem;
                  return (
                    <div
                      key={opt.label}
                      onClick={() => {
                        setTargetSystem(opt.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] font-semibold' 
                          : 'text-slate-300 hover:bg-[#0E182A]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00E5FF]" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. SUMMARY CARDS (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans select-none">
        
        {/* Card 1: OVERALL COMPLIANCE POSTURE */}
        <div className="p-4 rounded-xl border border-slate-800/90 bg-[#0B1322] shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            <span>OVERALL COMPLIANCE POSTURE</span>
            <span className="text-slate-500 font-normal">Last assessed 2h ago</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-bold text-[#00E5FF]">
              {overallPosture}%
            </span>
            <span className="text-xs font-sans font-semibold text-emerald-400">
              +4.2% (Last 30d)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {verifiedControls} of 96 assessed controls passed
          </p>
        </div>


        {/* Card 2: COMPLIANCE FRAMEWORKS (Requirement 1) */}
        <div className="p-4 rounded-xl border border-slate-800/90 bg-[#0B1322] shadow-xs">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            COMPLIANCE FRAMEWORKS
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-white">
            4 Active
          </div>
          <p className="text-xs text-slate-400 mt-2">
            NIST CSF, PCI-DSS, SOC 2, CIS
          </p>
        </div>

        {/* Card 3: OPEN AUDIT FINDINGS */}
        <div 
          onClick={() => onNavigateTab('findings')}
          className="p-4 rounded-xl border border-slate-800/90 bg-[#0B1322] shadow-xs hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            OPEN COMPLIANCE FINDINGS
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              3
            </span>
            <span className="text-xs font-mono font-bold text-rose-400">
              0 Critical
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            2 High, 1 Medium Non-conformity
          </p>
        </div>

        {/* Card 4: ACTIVE POA&M MILESTONES */}
        <div 
          onClick={() => onNavigateTab('poam')}
          className="p-4 rounded-xl border border-slate-800/90 bg-[#0B1322] shadow-xs hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            ACTIVE POA&M MILESTONES
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-mono text-[#C084FC]">
            2 Items
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Next milestone scheduled Oct 15
          </p>
        </div>

      </div>

      {/* RECOMMENDED MISSIONS TABLE */}
      <div className="p-5 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-4 shadow-xs font-sans">
        <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Recommended Missions</h2>
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-2 font-medium">Mission</th>
              <th className="pb-2 font-medium">Systems</th>
              <th className="pb-2 font-medium">Findings</th>
              <th className="pb-2 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="py-3 font-semibold text-cyan-100">Restore Payment Environment</td>
              <td className="py-3 text-slate-400 font-mono">26</td>
              <td className="py-3 text-slate-400 font-mono">71</td>
              <td className="py-3 text-rose-400 font-bold">Critical</td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="py-3 font-semibold text-cyan-100">Patch Core Database</td>
              <td className="py-3 text-slate-400 font-mono">2</td>
              <td className="py-3 text-slate-400 font-mono">12</td>
              <td className="py-3 text-amber-400 font-bold">High</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. FRAMEWORK ASSESSMENT STATUS (Requirements 4, 5, 6, 7, 8) */}
      <div className="p-5 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-4 shadow-xs font-sans">
        
        {/* Section Title, Subtitle & Action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ASSESSMENT STATUS
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current compliance posture mapped against international standards.
            </p>
          </div>
        </div>

        {/* 2-Column Grid of Framework Cards with Honest Maturity States */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: CIS (PRIMARY MVP FRAMEWORK) */}
          <div className="p-4 rounded-lg border-2 border-cyan-500/50 bg-[#081220] space-y-3 shadow-[0_0_15px_rgba(0,229,255,0.08)] relative">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-xs font-mono">
                    CIS
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#072433] border border-cyan-500/60 text-[#00E5FF] font-mono text-[10px] font-bold uppercase tracking-wider">
                    Active Assessment
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  CIS Critical Security Controls v8
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-[#00E5FF] shrink-0">
                {92 + Math.round(currentOption.scoreOffset * 0.5)}% Score
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-mono">
              <span className="text-emerald-400 font-bold">26 Passed · 1 Failed</span>
              <span className="text-slate-400">Target: <strong className="text-cyan-300">{targetSystem}</strong></span>
            </div>
          </div>

          {/* Card 2: NIST CSF 2.0 (SUPPORTED MAPPING) */}
          <div className="p-4 rounded-lg border border-slate-800/80 bg-[#080E18] space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-xs font-mono">
                    NIST CSF 2.0
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Planned
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Controls can be mapped, but full automated assessment evidence is not yet available.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span className="text-cyan-400/90 font-medium">Assessment coverage: Partial</span>
              <span className="text-slate-400">{targetSystem}</span>
            </div>
          </div>

          {/* Card 3: PCI-DSS 4.0 (SUPPORTED MAPPING) */}
          <div className="p-4 rounded-lg border border-slate-800/80 bg-[#080E18] space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-xs font-mono">
                    PCI-DSS 4.0
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Planned
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Control mapping is available, but end to end automated assessment is not yet enabled.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span className="text-cyan-400/90 font-medium">Assessment coverage: Partial</span>
              <span className="text-slate-400">{targetSystem}</span>
            </div>
          </div>

          {/* Card 4: SOC 2 Type II (PLANNED) */}
          <div className="p-4 rounded-lg border border-slate-800/60 bg-[#080E18]/80 space-y-3 shadow-xs opacity-90">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-300 text-xs font-mono">
                    SOC 2 Type II
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    Planned
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Full evidence based assessment workflow is not yet available.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-500">
              <span>Assessment workflow: Planned</span>
              <span>{targetSystem}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
