import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  ShieldCheck, 
  AlertCircle, 
  Activity, 
  Lock, 
  ArrowRight, 
  Radio, 
  Zap, 
  Bot,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const DashboardOverview: React.FC = () => {
  const { 
    systems, 
    findings, 
    complianceAssessments, 
    setActiveNav, 
    openAiAgentWithPrompt,
    autonomyMode,
    role
  } = usePlatform();

  const openFindings = findings.filter(f => f.actionState === 'Open');
  const criticalFindings = openFindings.filter(f => f.severity === 'Critical' || f.severity === 'High');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="atlas-page-title flex items-center gap-2.5">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            Mission Defense Dashboard
          </h1>
          <p className="atlas-page-desc">
            Unified threat telemetry, compliance posture, and autonomous operational status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono">
            Policy: <span className="text-cyan-400">{autonomyMode}</span>
          </div>
          <button
            onClick={() => openAiAgentWithPrompt('Provide executive summary of cross-system posture and threat indicators.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 text-cyan-300 text-xs font-medium transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            AI Executive Brief
          </button>
        </div>
      </div>

      {/* Intelligence-First Summary Banner (Section 20) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white text-sm">
              Intelligence-First Briefing
            </div>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              {openFindings.length > 0 
                ? `${openFindings.length} findings require attention across ${systems.length} systems. Resolving the top ${Math.min(openFindings.length, 2)} would materially improve the current posture.`
                : 'All onboarded systems report verified baseline compliance. Zero unresolved high-priority threats.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveNav('compliance')}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap"
        >
          <span>Open Compliance Module</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cross-Platform Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div 
          onClick={() => setActiveNav('systems')}
          className="bg-[#0E1420] border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-colors"
        >
          <div className="text-slate-400 font-medium">Onboarded Systems</div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            {systems.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {systems.filter(s => s.connectionStatus === 'Connected').length} Reachable & Healthy
          </div>
        </div>

        <div 
          onClick={() => setActiveNav('compliance')}
          className="bg-[#0E1420] border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-colors"
        >
          <div className="text-slate-400 font-medium">Overall Assessed Posture</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2 tabular-nums">
            85%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            CIS & SOC 2 Baselines Enforced
          </div>
        </div>

        <div 
          onClick={() => setActiveNav('findings')}
          className="bg-[#0E1420] border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-colors"
        >
          <div className="text-slate-400 font-medium">Open Findings</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2 tabular-nums">
            {openFindings.length}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1 font-medium">
            {criticalFindings.length} High Priority
          </div>
        </div>

        <div 
          onClick={() => setActiveNav('anomaly-det')}
          className="bg-[#0E1420] border border-slate-800 hover:border-slate-700 rounded-lg p-4 cursor-pointer transition-colors"
        >
          <div className="text-slate-400 font-medium">Active Threat Signals</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
            2
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Reconnaissance & DNS queries
          </div>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
          Mission Modules Status
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Compliance */}
          <div 
            onClick={() => setActiveNav('compliance')}
            className="bg-[#0E1420] border border-slate-800 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white font-mono">Compliance</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                CIS Linux Benchmark & SOC 2. 1 targeted remediation ready on Customer Portal App Server.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-cyan-400">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Zero Trust */}
          <div 
            onClick={() => setActiveNav('zero-trust')}
            className="bg-[#0E1420] border border-slate-800 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white font-mono">Zero Trust</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                mTLS mesh active. 1 conditional access policy gap detected on Microsoft 365 tenant.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-cyan-400">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Anomaly Detection */}
          <div 
            onClick={() => setActiveNav('anomaly-det')}
            className="bg-[#0E1420] border border-slate-800 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white font-mono">Anomaly Detection</h3>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                  Needs Attention
                </span>
              </div>
              <p className="text-slate-400 mt-2 leading-relaxed">
                10 anomalies detected. ATLAS recommends investigating 2 (path traversal scan on Corporate Website).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-cyan-400">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
