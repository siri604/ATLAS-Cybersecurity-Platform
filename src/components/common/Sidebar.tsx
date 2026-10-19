import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Target, 
  Lock, 
  Network, 
  Radio, 
  Activity, 
  Code2, 
  GitMerge, 
  Settings, 
  Building2, 
  Terminal, 
  Cpu, 
  Shield, 
  ShieldAlert,
  Server, 
  Bell, 
  Sliders, 
  ChevronDown
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const Sidebar: React.FC = () => {
  const { 
    activeNav, 
    setActiveNav, 
    openAiAgentWithPrompt 
  } = usePlatform();

  const [isSettingsExpanded, setIsSettingsExpanded] = useState<boolean>(false);
  const [isSecurityPostureExpanded, setIsSecurityPostureExpanded] = useState<boolean>(false);

  const platformModules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'human-threats', label: 'Threat Intelligence', icon: Target },
    { id: 'zero-trust', label: 'Zero Trust', icon: Lock },
    { id: 'network-sec', label: 'Network Security', icon: Network },
    { id: 'intrusion-det', label: 'IDS', icon: Radio },
    { id: 'anomaly-det', label: 'Anomaly Detection', icon: Activity },
    { id: 'software-qai', label: 'Software QAi', icon: Code2 },
    { id: 'platform-ops', label: 'Cognitive Orchestration', icon: GitMerge }
  ];

  const handleNav = (navId: string) => {
    setActiveNav(navId);
  };

  const isSystemsActive = activeNav === 'systems';

  return (
    <aside className="w-[260px] border-r border-slate-800/80 bg-[#060A12] flex flex-col shrink-0 select-none overflow-hidden h-[calc(100vh-3.5rem)] text-slate-300">
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        
        {/* Section: PLATFORM MODULES */}
        <div>
          <div className="px-3 mb-2 atlas-metadata tracking-widest uppercase">
            PLATFORM MODULES
          </div>

          <ul className="space-y-0.5">
            {platformModules.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-[#0E1A29] text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate font-sans">{item.label}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Section: Settings */}
        <div>
          {/* Settings Group Header with Left Cyan Accent Tab */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold text-cyan-400 bg-[#0A1624] hover:bg-[#0C1B2E] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Settings</span>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${isSettingsExpanded ? 'rotate-0' : '-rotate-90'}`} />
              </div>
            </button>
          </div>

          {/* Subitems under Settings */}
          {isSettingsExpanded && (
            <ul className="mt-1 pl-2 space-y-0.5">
              {/* Organization & Environment */}
              <li>
                <button
                  onClick={() => handleNav('org-env')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-colors ${
                    activeNav === 'org-env' ? 'bg-[#0E1A29] text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Organization & Environment</span>
                </button>
              </li>

              {/* Application & DevOps */}
              <li>
                <button
                  onClick={() => handleNav('app-devops')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-colors ${
                    activeNav === 'app-devops' ? 'bg-[#0E1A29] text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Application & DevOps</span>
                </button>
              </li>

              {/* AI & Compute */}
              <li>
                <button
                  onClick={() => handleNav('ai-compute')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-colors ${
                    activeNav === 'ai-compute' ? 'bg-[#0E1A29] text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">AI & Compute</span>
                </button>
              </li>

              {/* Security Posture (Active block matching screenshot) */}
              <li className="space-y-0.5 pt-0.5">
                <div 
                  onClick={() => {
                    setIsSecurityPostureExpanded(!isSecurityPostureExpanded);
                    handleNav('sec-posture');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm ${
                    activeNav === 'sec-posture'
                      ? 'bg-[#1864DF] text-white border border-blue-400/50 shadow-md'
                      : 'bg-[#0A2234] border border-cyan-500/40 text-white hover:border-cyan-500/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Security Posture</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSecurityPostureExpanded ? 'rotate-0 text-cyan-300' : '-rotate-90 text-slate-400'}`} />
                </div>

                {/* Sub-items under Security Posture */}
                {isSecurityPostureExpanded && (
                  <div className="pl-4 pt-1 space-y-0.5">
                    {/* 1. Security Configuration */}
                    <button
                      onClick={() => handleNav('sec-posture')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-sans transition-colors ${
                        activeNav === 'sec-posture'
                          ? 'bg-[#0E1A29] text-white font-medium shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                      }`}
                    >
                      <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${activeNav === 'sec-posture' ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate font-sans">Security Configuration</span>
                    </button>

                    {/* 2. Zero Trust */}
                    <button
                      onClick={() => handleNav('sec-posture')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-sans transition-colors ${
                        activeNav === 'sec-posture'
                          ? 'bg-[#0E1A29] text-white font-medium shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate font-sans">Zero Trust</span>
                    </button>

                    {/* 3. System Onboarding */}
                    <button
                      onClick={() => handleNav('systems')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-sans transition-colors ${
                        isSystemsActive
                          ? 'bg-[#0E1A29] text-white font-medium shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                      }`}
                    >
                      <Server className={`w-3.5 h-3.5 shrink-0 ${isSystemsActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate font-sans">System Onboarding</span>
                    </button>

                    {/* 4. Network & Scanning */}
                    <button
                      onClick={() => handleNav('sec-posture')}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-sans transition-colors ${
                        activeNav === 'sec-posture'
                          ? 'bg-[#0E1A29] text-white font-medium shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate font-sans">Network & Scanning</span>
                    </button>
                  </div>
                )}
              </li>

              {/* Integrations & Notifications */}
              <li>
                <button
                  onClick={() => handleNav('integrations')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-colors ${
                    activeNav === 'integrations' ? 'bg-[#0E1A29] text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Integrations & Notifications</span>
                </button>
              </li>

              {/* System Administration */}
              <li>
                <button
                  onClick={() => handleNav('sys-admin')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded text-xs transition-colors ${
                    activeNav === 'sys-admin' ? 'bg-[#0E1A29] text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B101C]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">System Administration</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* ANCHORED IN LOWER-LEFT CORNER: ATLAS AI Agent (Exact Match to Screenshot) */}
      <div className="p-3 border-t border-slate-800/80 bg-[#050811]">
        <div 
          onClick={() => openAiAgentWithPrompt()}
          className="p-2.5 rounded-xl bg-[#09111D] border border-slate-800/90 hover:border-cyan-500/40 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            {/* Glowing Cybernetic Avatar with Status Dot */}
            <div className="relative w-9 h-9 rounded-full bg-[#051324] border border-cyan-500/60 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0 overflow-hidden">
              <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                <path d="M18 5C13.58 5 10 8.58 10 13C10 16.5 12.2 19.5 15.3 20.6V23H20.7V20.6C23.8 19.5 26 16.5 26 13C26 8.58 22.42 5 18 5Z" fill="#0C1B2E" stroke="#00E5FF" strokeWidth="1" />
                <path d="M12.5 12.5H23.5C23.5 12.5 22.5 15 18 15C13.5 15 12.5 12.5 12.5 12.5Z" fill="#00E5FF" />
                <line x1="14" y1="13.5" x2="22" y2="13.5" stroke="#FFFFFF" strokeWidth="0.8" />
                <path d="M7 32C7 26.5 11.5 23 18 23C24.5 23 29 26.5 29 32" stroke="#00E5FF" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="18" cy="27" r="1.5" fill="#00E5FF" />
              </svg>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#09111D] absolute bottom-0 right-0 shadow-[0_0_6px_#10B981]" />
            </div>

            {/* Agent Info */}
            <div className="leading-tight">
              <div className="text-xs font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                Atlas AI Agent
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-sans">
                <span className="text-emerald-400 font-medium">● Online</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Click to chat</span>
              </div>
            </div>
          </div>

          {/* AI Pill Badge */}
          <div className="px-1.5 py-0.5 rounded bg-[#0A2234] border border-cyan-500/40 text-[10px] font-bold font-mono text-cyan-400">
            AI
          </div>
        </div>
      </div>

    </aside>
  );
};
