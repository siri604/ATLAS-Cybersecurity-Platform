import React, { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2, 
  Terminal, 
  RefreshCw,
  Pencil,
  Shield,
  Activity,
  Cpu,
  Lock,
  Wifi
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { AtlasSystem } from '../../types';

interface SystemWorkspaceProps {
  system: AtlasSystem;
  onBack?: () => void;
}

export const SystemWorkspace: React.FC<SystemWorkspaceProps> = ({ system, onBack }) => {
  const { setActiveNav, setSelectedSystemId, addToast, autonomyMode } = usePlatform();
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedSystemId(null);
      setActiveNav('systems');
    }
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    addToast(`Triggering connection probe for ${system.name}...`, 'info');
    
    setTimeout(() => {
      setIsTesting(false);
      setTestResult(`SUCCESS · Latency: 14ms · SSH Handshake Verified`);
      addToast(`Connection to ${system.name} verified successfully!`, 'success');
    }, 1200);
  };

  const handleEditConnection = () => {
    addToast(`To edit connection settings for ${system.name}, use 'Edit system' from the Systems menu list.`, 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans py-2 animate-in fade-in duration-300">
      
      {/* Back Link & Admin Badge Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer select-none font-mono uppercase"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Systems</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Admin Role Badge */}
          <span className="px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 font-bold text-[10px] uppercase font-mono tracking-wider">
            ADMIN ROLE
          </span>
          <span className="px-2 py-0.5 rounded border border-slate-800 bg-[#0B1322] text-slate-400 text-[10px] font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Mode: {autonomyMode}</span>
          </span>
        </div>
      </div>

      {/* Cyber Console System Header Card */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#0B1322] relative overflow-hidden shadow-lg">
        {/* Absolute top-right glowing neon corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight font-mono">
                {system.name}
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready ✓
              </span>
            </div>
            
            <p className="text-slate-400 text-xs font-mono">
              {system.type} · {system.osInfo || 'Ubuntu 24.04 LTS'} · {system.environment}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Status Modules Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Section 1: Connection */}
        <div className="p-4.5 rounded-xl border border-slate-800 bg-[#0B1322] space-y-4 font-mono">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800/80">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connection</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
              <span className="text-emerald-400 font-bold">SSH Connected</span>
            </div>

            <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">ENDPOINT</span>
              <span className="text-white font-bold text-xs">{system.hostname || '10.20.1.15'}:{system.port || 22}</span>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              Last successful check {system.lastHeartbeat || '3 mins ago'}
            </div>
          </div>
        </div>

        {/* Section 2: OpenSCAP */}
        <div className="p-4.5 rounded-xl border border-slate-800 bg-[#0B1322] space-y-4 font-mono">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800/80">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>OpenSCAP</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
              <span className="text-emerald-400 font-bold">Ready</span>
            </div>

            <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">SECURITY PROFILE</span>
              <span className="text-cyan-300 font-bold text-xs">CIS Ubuntu 24.04 L1</span>
            </div>

            <div className="text-[10px] text-slate-400">
              Probes aligned to target kernel
            </div>
          </div>
        </div>

        {/* Section 3: Wazuh */}
        <div className="p-4.5 rounded-xl border border-slate-800 bg-[#0B1322] space-y-4 font-mono">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800/80">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wazuh</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>

            <div className="p-2.5 bg-[#080E18] border border-slate-800 rounded space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">AGENT STATUS</span>
              <span className="text-white font-bold text-xs">Active telemetry feed</span>
            </div>

            <div className="text-[10px] text-slate-400">
              Agent ID: 042 · Active socket
            </div>
          </div>
        </div>

      </div>

      {/* Connection Probe Console Logging when probe is executing */}
      {isTesting && (
        <div className="p-4 rounded-xl border border-cyan-500/40 bg-black/60 font-mono text-xs space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-[#00E5FF] font-bold text-[10px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 animate-spin" />
              EXECUTING CONNECTION PROBE...
            </span>
          </div>
          <div className="text-slate-300 space-y-1 text-[11px] leading-relaxed">
            <div>&gt; Initializing SSH client handshake to {system.hostname || '10.20.1.15'}:{system.port || 22}</div>
            <div>&gt; Exchanging cryptographic keys and identity certificates</div>
            <div>&gt; Verifying OpenSCAP configuration schemas and Wazuh telemetry channels</div>
          </div>
        </div>
      )}

      {testResult && !isTesting && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-[#081813] font-mono text-xs text-emerald-400 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PROBE LOGS COMPLETED</span>
          </div>
          <div className="text-[11px] font-mono mt-1 text-emerald-300">
            {testResult}
          </div>
        </div>
      )}

      {/* Cyber Actions Grid Section */}
      <div className="pt-2">
        <h3 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-3">
          ACTIONS
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          
          {/* Action 1: Test Connection */}
          <button
            type="button"
            disabled={isTesting}
            onClick={handleTestConnection}
            className={`p-4 rounded-xl border hover:border-cyan-500/60 bg-[#0A121F] hover:bg-[#0E1A29] text-left transition-all group cursor-pointer flex flex-col justify-between h-28 ${
              isTesting ? 'opacity-55 cursor-not-allowed' : ''
            }`}
          >
            <div className="p-2 rounded-lg bg-[#0E1F2E] text-cyan-400 group-hover:scale-105 transition-transform self-start">
              <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Test Connection</div>
              <div className="text-[10px] text-slate-500 mt-1">Run connection probe</div>
            </div>
          </button>

          {/* Action 2: Edit Connection */}
          <button
            type="button"
            onClick={handleEditConnection}
            className="p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/60 bg-[#0A121F] hover:bg-[#0E1A29] text-left transition-all group cursor-pointer flex flex-col justify-between h-28"
          >
            <div className="p-2 rounded-lg bg-[#0E1F2E] text-cyan-400 group-hover:scale-105 transition-transform self-start">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Edit Connection</div>
              <div className="text-[10px] text-slate-500 mt-1">Modify settings & credentials</div>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};
