import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  Zap, 
  Sliders, 
  Activity,
  Check,
  Server
} from 'lucide-react';
import { SettingsTabsHeader } from './SettingsTabsHeader';
import { usePlatform } from '../../context/PlatformContext';

export const AIComputeSettings: React.FC = () => {
  const { role, autonomyMode, requestAutonomyChange } = usePlatform();
  const [modelRouting, setModelRouting] = useState<'flash' | 'pro'>('flash');
  const [allowFunctionCalling, setAllowFunctionCalling] = useState<boolean>(true);
  const [ragVectorIndexing, setRagVectorIndexing] = useState<boolean>(true);
  const [maxTokenBudget, setMaxTokenBudget] = useState<number>(8000);

  return (
    <div className="space-y-6">
      <SettingsTabsHeader currentTab="ai-compute" subTitle="Model & Inference" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="atlas-page-title">
            AI & Compute Runtime
          </h1>
          <p className="atlas-page-desc">
            ATLAS AI Agent model routing, reasoning compute boundaries, and vector security memory index.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Engine Status */}
        <div className="bg-[#0A101C] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#051324] border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Atlas AI Agent Engine</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                Online · Edge Sandbox Active
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Current Model</span>
              <span className="text-cyan-400">gemini-2.5-flash</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Execution Sandbox</span>
              <span className="text-slate-200">gVisor Container v1.4</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Autonomy Authorization</span>
              <span className="text-amber-400">{autonomyMode}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Telemetry Latency</span>
              <span className="text-emerald-400">142ms avg RTT</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0A101C] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Model Selection & Reasoning Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => setModelRouting('flash')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  modelRouting === 'flash'
                    ? 'border-cyan-500/70 bg-[#0E1A29] shadow-sm'
                    : 'border-slate-800 bg-[#070D16] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Gemini 2.5 Flash</span>
                  {modelRouting === 'flash' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  High-speed sub-second signal correlation, continuous anomaly triage, and real-time posture assessments.
                </p>
              </div>

              <div 
                onClick={() => setModelRouting('pro')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  modelRouting === 'pro'
                    ? 'border-cyan-500/70 bg-[#0E1A29] shadow-sm'
                    : 'border-slate-800 bg-[#070D16] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Gemini 2.5 Pro</span>
                  {modelRouting === 'pro' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Deep multi-step attack graph reconstruction, complex zero-day threat modeling, and formal verification proofs.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded bg-[#070D16] border border-slate-800">
                <div>
                  <div className="font-medium text-slate-200">Autonomous Tool & Function Calling</div>
                  <div className="text-[11px] text-slate-400">Permit agent to invoke verified system diagnostic inspection tools</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowFunctionCalling}
                  onChange={(e) => setAllowFunctionCalling(e.target.checked)}
                  disabled={role === 'Viewer'}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-[#070D16] border border-slate-800">
                <div>
                  <div className="font-medium text-slate-200">Real-Time Vector Security Memory (RAG)</div>
                  <div className="text-[11px] text-slate-400">Embed platform audit logs and compliance controls into live vector memory</div>
                </div>
                <input
                  type="checkbox"
                  checked={ragVectorIndexing}
                  onChange={(e) => setRagVectorIndexing(e.target.checked)}
                  disabled={role === 'Viewer'}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
