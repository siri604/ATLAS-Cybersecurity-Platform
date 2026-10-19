import React, { useState } from 'react';
import { 
  Shield, 
  ChevronDown, 
  Bell,
  Check,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PlatformRole } from '../../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    setActiveNav,
    tenant,
    setTenant
  } = usePlatform();

  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Direct SSH root login enabled',
      system: 'Customer Portal App Server',
      time: '12m ago',
      level: 'High',
      unread: true,
      nav: 'systems'
    },
    {
      id: 'notif-2',
      title: 'CIS Ubuntu Benchmark scan completed',
      system: 'Customer Portal App Server',
      time: '45m ago',
      level: 'Medium',
      unread: true,
      nav: 'compliance'
    },
    {
      id: 'notif-3',
      title: 'WAF rate limit rules updated',
      system: 'Corporate Website',
      time: '2h ago',
      level: 'Info',
      unread: false,
      nav: 'network-sec'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const roles: PlatformRole[] = ['Viewer', 'Analyst', 'Admin', 'SuperAdmin'];
  // For MVP, we use the active tenant from context or a placeholder if none is set
  const activeTenantName = tenant?.name || 'Default Enclave';

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#060A12] px-4 flex items-center justify-between z-30 sticky top-0 select-none">
      {/* Left: Brand & Tenant Lockup */}
      <div className="flex items-center gap-3">
        {/* Hexagonal Shield Logo Icon Box */}
        <div 
          onClick={() => setActiveNav('dashboard')}
          className="w-8 h-8 rounded-lg bg-[#071727] border border-cyan-400/80 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] cursor-pointer hover:border-cyan-300 transition-colors"
        >
          <Shield className="w-4 h-4 text-cyan-400 stroke-[2.2]" />
        </div>

        {/* Wordmark */}
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveNav('dashboard'); }}
          className="text-base font-bold tracking-wider text-white hover:text-cyan-400 transition-colors font-mono"
        >
          ATLAS
        </a>

        {/* Vertical Divider */}
        <span className="text-slate-700/80 font-mono text-sm mx-1">|</span>

        {/* Tenant Selector Dropdown (Exact match to screenshot) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
            className="flex items-center gap-2 bg-[#0B121E] hover:bg-[#0E1726] border border-slate-800 rounded-lg px-3 py-1.5 text-xs transition-colors"
          >
            <span className="text-slate-400 font-sans">Tenant:</span>
            <span className="text-white font-medium font-sans">{activeTenantName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isTenantDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-[#0C1320] border border-slate-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <div
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors ${
                    tenant ? 'text-cyan-400 font-medium bg-cyan-950/20' : 'text-slate-300'
                  }`}
                >
                  <span>{tenant?.name || 'Default Enclave'}</span>
                  {tenant && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Notification Bell & User Profile Lockup (Exact match to screenshot) */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with indicator dot & dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifDropdownOpen(!isNotifDropdownOpen);
              setIsUserDropdownOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0E1624] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 shadow-[0_0_6px_#00E5FF]" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0C1320] border border-slate-800 rounded-lg shadow-2xl z-50 text-xs font-sans overflow-hidden">
              <div className="px-3 py-2.5 bg-[#080E18] border-b border-slate-800 flex items-center justify-between">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Security Signals</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      setActiveNav(n.nav);
                      setIsNotifDropdownOpen(false);
                    }}
                    className={`p-3 hover:bg-[#111A2C] transition-colors cursor-pointer ${n.unread ? 'bg-cyan-950/15' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-white text-xs leading-snug">
                        {n.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                        n.level === 'High' ? 'text-rose-400 border-rose-500/30 bg-rose-950/30' :
                        n.level === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-950/30' :
                        'text-cyan-400 border-cyan-500/30 bg-cyan-950/30'
                      }`}>
                        {n.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>{n.system}</span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-800 bg-[#080E18] text-center">
                <button
                  onClick={() => {
                    setActiveNav('activity');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-medium"
                >
                  View Full Audit Stream →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Badge: DV · D. Vance · SecOps Principal */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#0E1624] transition-colors text-left"
          >
            {/* Dark box avatar with DV text */}
            <div className="w-7 h-7 rounded bg-[#0C1B2A] border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
              DV
            </div>
            
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-white flex items-center gap-1 font-sans">
                <span>D. Vance</span>
              </div>
              <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                <span>View as:</span>
                <span className="text-cyan-400 font-bold uppercase">{role === 'SuperAdmin' ? 'SUPER ADMIN' : 'ADMIN'}</span>
              </div>
            </div>

            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {/* User & Role Switcher Dropdown */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0D1422] border border-slate-800 rounded-lg shadow-2xl p-2 z-50 text-xs font-sans">
              <div className="p-2 border-b border-slate-800 mb-1">
                <div className="font-semibold text-white text-xs">D. Vance</div>
                <div className="text-[11px] text-slate-400">pmtosiri@gmail.com</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Enclave Security Operations</div>
              </div>

              <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Switch Platform Role:
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                      (role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin') === (r === 'SuperAdmin' ? 'SuperAdmin' : 'Admin')
                        ? 'bg-cyan-950/40 text-cyan-300 font-medium border border-cyan-500/30' 
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{r}</span>
                    {(role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin') === (r === 'SuperAdmin' ? 'SuperAdmin' : 'Admin') && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
