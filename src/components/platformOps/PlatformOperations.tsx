import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  HardDrive, 
  Activity, 
  Radio, 
  Shield, 
  Server, 
  Database,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const PlatformOperations: React.FC = () => {
  const { 
    workflowExecutions, 
    agentWorkers, 
    integrations, 
    systems,
    role 
  } = usePlatform();

  const [activeSubsection, setActiveSubsection] = useState<'overview' | 'workflows' | 'fleet' | 'tools' | 'diagnostics'>('overview');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredWorkflows = workflowExecutions.filter(wf => {
    const matchMod = moduleFilter === 'ALL' || wf.module === moduleFilter;
    const matchStat = statusFilter === 'ALL' || wf.status === statusFilter;
    return matchMod && matchStat;
  });

  return (
    <div className="space-y-6">
      {/* SuperAdmin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight font-sans">
                Platform Operations
              </h1>
              <span className="text-[10px] font-sans text-amber-400 bg-amber-950/40 border border-amber-600/40 px-1.5 py-0.5 rounded font-medium">
                SuperAdmin Engine Room
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Centralized orchestration engine, asynchronous workers, probe telemetry, and low-level diagnostics.
            </p>
          </div>
        </div>

        {/* Subsection Selector (Section 24) */}
        <div className="flex items-center bg-[#0E1420] p-1 rounded-lg border border-slate-800 text-xs font-medium font-mono">
          <button
            onClick={() => setActiveSubsection('overview')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubsection === 'overview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubsection('workflows')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubsection === 'workflows'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Orchestration
          </button>
          <button
            onClick={() => setActiveSubsection('fleet')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubsection === 'fleet'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent Fleet
          </button>
          <button
            onClick={() => setActiveSubsection('tools')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubsection === 'tools'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tool Health
          </button>
          <button
            onClick={() => setActiveSubsection('diagnostics')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubsection === 'diagnostics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diagnostics
          </button>
        </div>
      </div>

      {/* SUBSECTION: OVERVIEW */}
      {activeSubsection === 'overview' && (
        <div className="space-y-6">
          {/* Top Engine KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
              <div className="text-slate-400 font-medium">Orchestration Health</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                Nominal
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Zero pipeline bottlenecks
              </div>
            </div>

            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
              <div className="text-slate-400 font-medium">Active Worker Nodes</div>
              <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
                {agentWorkers.filter(w => w.status === 'Healthy').length} / {agentWorkers.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                1 node degraded (IdP Sync)
              </div>
            </div>

            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
              <div className="text-slate-400 font-medium">Workflow Execution Rate</div>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-2 tabular-nums">
                24 / hr
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Avg duration: 1.4s
              </div>
            </div>

            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
              <div className="text-slate-400 font-medium">Failure / Retry Rate</div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
                2.1%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                3 retries logged in last hour
              </div>
            </div>
          </div>

          {/* Quick Engine Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-3">
                Live Worker Node Status
              </h3>
              <div className="space-y-3">
                {agentWorkers.map((worker) => (
                  <div key={worker.id} className="p-3 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{worker.name}</div>
                      <div className="text-[11px] text-slate-400">{worker.role} · {worker.node}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className={worker.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}>
                        ● {worker.status}
                      </div>
                      <div className="text-[10px] text-slate-500">CPU: {worker.cpuPercent}% | RAM: {worker.memoryPercent}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5">
              <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-3">
                Recent Orchestrated Workflows
              </h3>
              <div className="space-y-3">
                {workflowExecutions.slice(0, 3).map((wf) => (
                  <div key={wf.id} className="p-3 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white font-mono">{wf.name}</div>
                      <div className="text-[11px] text-slate-400">{wf.module} · {wf.systemName}</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        wf.status === 'Completed' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' :
                        wf.status === 'Failed' ? 'text-rose-400 bg-rose-950/40 border-rose-500/30' :
                        'text-amber-400 bg-amber-950/40 border-amber-500/30'
                      }`}>
                        {wf.status}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">{wf.durationMs}ms</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION: WORKFLOWS */}
      {activeSubsection === 'workflows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Modules</option>
                <option value="Compliance">Compliance</option>
                <option value="Intrusion Detection">Intrusion Detection</option>
                <option value="Platform Operations">Platform Operations</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Queued">Queued</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Workflows
            </button>
          </div>

          <div className="bg-[#0E1420] border border-slate-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-slate-800 text-xs font-mono">
              {filteredWorkflows.map((wf) => (
                <div key={wf.id} className="p-4 hover:bg-slate-900/40 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-sm">{wf.name}</span>
                      <span className="text-slate-500">[{wf.id}]</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        wf.status === 'Completed' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' :
                        wf.status === 'Failed' ? 'text-rose-400 bg-rose-950/40 border-rose-500/30' :
                        'text-amber-400 bg-amber-950/40 border-amber-500/30'
                      }`}>
                        {wf.status}
                      </span>
                      <span className="text-slate-400 text-[11px] tabular-nums">{wf.durationMs}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Target: <strong className="text-slate-200">{wf.systemName}</strong></span>
                    <span>·</span>
                    <span>Module: <strong className="text-cyan-400">{wf.module}</strong></span>
                    <span>·</span>
                    <span>Trigger: {wf.trigger}</span>
                    <span>·</span>
                    <span>Trace: {wf.traceId}</span>
                  </div>

                  {/* Step Breakdown */}
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                    {wf.steps.map((st, i) => (
                      <div 
                        key={i} 
                        className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
                          st.status === 'passed' ? 'bg-slate-900 border-emerald-500/30 text-emerald-300' :
                          st.status === 'failed' ? 'bg-slate-900 border-rose-500/30 text-rose-300' :
                          'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>{st.status === 'passed' ? '✓' : st.status === 'failed' ? '✗' : '•'}</span>
                        <span>{st.name}</span>
                        {st.durationMs > 0 && <span className="text-slate-500">({st.durationMs}ms)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBSECTION: AGENT FLEET */}
      {activeSubsection === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentWorkers.map((worker) => (
              <div key={worker.id} className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 space-y-4 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white font-mono">{worker.name}</h3>
                    <div className="text-[11px] text-slate-400">{worker.role}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    worker.status === 'Healthy' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                  }`}>
                    {worker.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <div className="text-slate-500">Node</div>
                    <div className="text-slate-200 mt-0.5">{worker.node}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">CPU Load</div>
                    <div className="text-cyan-400 mt-0.5 tabular-nums">{worker.cpuPercent}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Memory</div>
                    <div className="text-cyan-400 mt-0.5 tabular-nums">{worker.memoryPercent}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Active Jobs</div>
                    <div className="text-slate-200 mt-0.5">{worker.activeJobs}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Uptime</div>
                    <div className="text-slate-200 mt-0.5">{worker.uptime}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Heartbeat</div>
                    <div className="text-emerald-400 mt-0.5">{worker.lastHeartbeat}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION: TOOLS & INTEGRATIONS */}
      {activeSubsection === 'tools' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((int) => (
              <div key={int.id} className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white font-mono">{int.name}</h3>
                    <div className="text-[11px] text-slate-400">{int.category} · Scope: {int.scope}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    int.status === 'Connected' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                  }`}>
                    {int.status}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {int.description}
                </p>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Last Sync: {int.lastSync}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBSECTION: DIAGNOSTICS */}
      {activeSubsection === 'diagnostics' && (
        <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-bold text-white text-sm">Low-Level Diagnostics Telemetry</span>
            <span className="text-emerald-400 text-[11px]">Subsystem Latency: 12ms</span>
          </div>

          <div className="p-4 rounded bg-black/60 border border-slate-800 text-slate-300 space-y-2 overflow-x-auto text-[11px]">
            <div>[DIAG] Host Connection Pool: 24 active SSH persistent multiplexed sessions</div>
            <div>[DIAG] Wazuh Collector API: 200 OK (v4.7.2, queue depth: 0)</div>
            <div>[DIAG] Identity Provider Connector: 401 Unauthorized / Token Missing (Requires Admin API Key)</div>
            <div>[DIAG] Execution Queue Latency: p50: 12ms | p95: 48ms | p99: 110ms</div>
            <div>[DIAG] Token Budget (Gemini Security Intelligence): 8,420 tokens consumed in current window</div>
            <div>[DIAG] Platform Autonomy Enforcement: Strict Human-in-the-Loop Gateway active</div>
          </div>
        </div>
      )}
    </div>
  );
};
