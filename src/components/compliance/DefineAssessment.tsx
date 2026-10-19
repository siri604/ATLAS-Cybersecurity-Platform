import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  X, 
  Lock, 
  Check, 
  AlertTriangle,
  Server,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface DefineAssessmentProps {
  onCancel: () => void;
  onLaunch: (systemId: string, frameworkId: string) => void;
}

export const DefineAssessment: React.FC<DefineAssessmentProps> = ({
  onCancel,
  onLaunch
}) => {
  const { role, autonomyMode, systems } = usePlatform();
  const isAdmin = role === 'Admin' || role === 'SuperAdmin';

  const [selectedSysId, setSelectedSystemId] = useState<string>('sys-payments-prod');
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('cis-linux-v1');
  const [showAllControls, setShowAllControls] = useState<boolean>(false);

  const activeSystem = systems.find(s => s.id === selectedSysId) || systems[0];

  const uniqueSystems = systems.filter((system, index, self) =>
    index === self.findIndex((t) => (
      t.name === system.name
    ))
  );

  const getSystemMetadata = (name: string, type: string) => {
    if (name === 'Microsoft 365') return 'SaaS Service · Cloud';
    if (name === 'Core Database Primary') return 'Database Server · Production';
    if (name === 'Logistics Partner Gateway') return 'Partner / Supply Chain System';
    if (name === 'Customer Portal App Server') return 'Ubuntu 24.04 LTS · SSH · 10.20.1.15:22';
    if (type === 'Linux Server') return 'Linux Server · Ubuntu 24.04';
    return 'Web Application · cloud';
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[#00E5FF] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="atlas-page-title text-xl font-bold text-white tracking-tight">
                Define Assessment
              </h1>
              
              {/* Autonomy Mode Context (Read-Only) */}
              <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-900/60 text-slate-400 text-[10px] font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Current Mode: {autonomyMode || 'Approval required'}</span>
              </span>
            </div>

            <p className="atlas-page-desc text-xs text-slate-400 mt-1">
              Choose the system, framework, and controls ATLAS should assess
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Progress Indicator at Top (Requirement: SYSTEM ✓ → FRAMEWORK ✓ → CONTROLS ✓ → READY ✓) */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-[#080E18] space-y-1.5 font-sans">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 pb-1.5 border-b border-slate-800/60">
          <span>ASSESSMENT SETUP PROGRESS</span>
          <span className="text-[#00E5FF] font-bold">Assessment Setup Complete</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 px-4 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-emerald-500/50 z-0" />
          
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            <span className="text-[10px] font-mono mt-1 text-emerald-400 font-bold">SYSTEM ✓</span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            <span className="text-[10px] font-mono mt-1 text-emerald-400 font-bold">FRAMEWORK ✓</span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            <span className="text-[10px] font-mono mt-1 text-emerald-400 font-bold">CONTROLS ✓</span>
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            <span className="text-[10px] font-mono mt-1 text-emerald-400 font-bold">READY ✓</span>
          </div>
        </div>
      </div>

      {/* Setup Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Step 1 Card: Select Target System */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-3.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            1. Select Target System
          </div>
          
          <div className="space-y-2.5">
            {uniqueSystems.map((sys) => {
              const isSelected = sys.id === selectedSysId;
              return (
                <div
                  key={sys.id}
                  onClick={() => setSelectedSystemId(sys.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-[#072433] border-cyan-500 text-white shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                      : 'bg-[#080E18] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sys.name}</span>
                    {isSelected && <span className="text-cyan-400 text-[10px] font-bold">ACTIVE</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                    <div>{getSystemMetadata(sys.name, sys.type)}</div>
                    <div className="flex items-center gap-1.5 text-[10px] pt-1 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 font-medium">Reachable ✓</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 Card: Select Framework */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-3.5 flex flex-col h-[350px]">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>2. Select Framework</span>
            <span className="text-cyan-400 text-[9px] font-normal">1 Active</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {[
              { id: 'cis-linux-v1', name: 'CIS', status: 'Available', disabled: false },
              { id: 'fisma', name: 'FISMA', status: 'Planned', disabled: true },
              { id: 'iso27001', name: 'ISO 27001', status: 'Planned', disabled: true },
              { id: 'bb-csf', name: 'Bangladesh Bank CSF v1.0', status: 'Planned', disabled: true },
              { id: 'nist-800-53', name: 'NIST 800-53', status: 'Planned', disabled: true },
              { id: 'nist-800-171', name: 'NIST 800-171', status: 'Planned', disabled: true },
              { id: 'nist-csf-v2', name: 'NIST CSF 2.0', status: 'Planned', disabled: true },
              { id: 'rmf', name: 'RMF', status: 'Planned', disabled: true },
              { id: 'fedramp', name: 'FedRAMP', status: 'Planned', disabled: true },
              { id: 'cmmc-2', name: 'CMMC 2.0', status: 'Planned', disabled: true },
              { id: 'soc2', name: 'SOC 2 Type II', status: 'Planned', disabled: true },
              { id: 'sox', name: 'SOX', status: 'Planned', disabled: true },
            ].map((fw) => {
              const isSelected = fw.id === selectedFrameworkId;
              const isPlanned = fw.status === 'Planned';

              return (
                <div
                  key={fw.id}
                  onClick={() => {
                    if (!fw.disabled) {
                      setSelectedFrameworkId(selectedFrameworkId === fw.id ? '' : fw.id);
                    }
                  }}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                    fw.disabled
                      ? 'bg-[#060A14]/30 border-[#0f172a]/60 text-slate-500 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#072433] border-cyan-500 text-white shadow-[0_0_10px_rgba(0,229,255,0.15)] cursor-pointer'
                      : 'bg-[#080E18] border-slate-800 hover:border-slate-700 text-slate-400 cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold font-mono ${fw.disabled ? 'text-slate-500' : 'text-white'}`}>
                      {fw.name}
                    </span>
                    {isPlanned && (
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                        {fw.status}
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={!fw.disabled && isSelected}
                    disabled={fw.disabled}
                    onChange={() => {}}
                    className={`w-3.5 h-3.5 rounded border ${
                      fw.disabled
                        ? 'border-slate-800 bg-slate-950 accent-slate-700'
                        : 'border-cyan-500/50 bg-[#080D18] accent-[#00E5FF] cursor-pointer'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3 Card: Assessment Controls */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0B1322] space-y-3.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            3. Assessment Controls
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080E18] space-y-3 text-xs">
            {/* Header row */}
            <div className="flex items-center justify-between font-mono pb-2 border-b border-slate-800/60">
              <span className="font-bold text-white">ATLAS Recommended</span>
              <span className="text-[#00E5FF] font-bold">27 Controls</span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ATLAS automatically selects Controls and Safeguards relevant to this system and connected evidence collectors.
            </p>

            {/* Compact row */}
            <div className="flex items-center justify-between bg-black/25 border border-slate-800/60 rounded px-2.5 py-1.5 font-mono text-[11px]">
              <span className="text-slate-400 font-semibold">
                {showAllControls ? 'Showing 27 of 27 controls' : 'Showing 4 of 27 controls'}
              </span>
              <button
                type="button"
                onClick={() => setShowAllControls(!showAllControls)}
                className="text-[#00E5FF] hover:text-[#33EAFF] font-bold flex items-center gap-1 transition-colors cursor-pointer select-none"
              >
                <span>{showAllControls ? 'Hide Controls' : 'View All Controls'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllControls ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="p-2 rounded bg-black/40 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
              {!showAllControls ? (
                <>
                  <div>• AC-6 Least Privilege (Host config)</div>
                  <div>• IA-2 Identity Auth (MFA checks)</div>
                  <div>• CM-6 Configuration Settings</div>
                  <div>• SC-7 Boundary Protection</div>
                </>
              ) : (
                <>
                  <div>• AC-1 Access Control Policy</div>
                  <div>• AC-2 Account Management</div>
                  <div>• AC-3 Access Enforcement</div>
                  <div>• AC-4 Information Flow Enforcement</div>
                  <div>• AC-5 Separation of Duties</div>
                  <div>• AC-6 Least Privilege (Host config)</div>
                  <div>• AC-7 Unsuccessful Logon Attempts</div>
                  <div>• AC-11 Device Lock</div>
                  <div>• AC-12 Session Termination</div>
                  <div>• AC-17 Remote Access</div>
                  <div>• IA-1 Identification and Authentication Policy</div>
                  <div>• IA-2 Identity Auth (MFA checks)</div>
                  <div>• IA-3 Device Identification and Authentication</div>
                  <div>• IA-5 Authenticator Management</div>
                  <div>• IA-8 Identification and Authentication (Non-Organizational Users)</div>
                  <div>• CM-1 Configuration Management Policy</div>
                  <div>• CM-2 Baseline Configuration</div>
                  <div>• CM-3 Configuration Change Control</div>
                  <div>• CM-6 Configuration Settings</div>
                  <div>• CM-7 Least Functionality</div>
                  <div>• CM-8 Component Inventory</div>
                  <div>• SC-1 System and Communications Protection Policy</div>
                  <div>• SC-5 Denial of Service Protection</div>
                  <div>• SC-7 Boundary Protection</div>
                  <div>• SC-8 Transmission Confidentiality and Integrity</div>
                  <div>• SC-15 Collaborative Computing Devices</div>
                  <div>• SC-28 Protection of Information at Rest</div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Compact Assessment Inputs Status Strip (Evidence Sources) */}
      <div className="p-3 rounded-lg border border-slate-800 bg-[#080E18] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">ASSESSMENT INPUTS:</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            OpenSCAP ✓ ONLINE
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Wazuh ✓ ONLINE
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Target system ✓ REACHABLE
          </span>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-700 bg-[#0B1322] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer font-sans"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onLaunch(selectedSysId, selectedFrameworkId)}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-1.5 font-sans"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Assessment</span>
        </button>
      </div>

    </div>
  );
};
