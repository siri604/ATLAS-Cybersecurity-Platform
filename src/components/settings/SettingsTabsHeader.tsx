import React from 'react';
import { 
  MapPin, 
  LayoutGrid, 
  Link2, 
  Shield, 
  Bell, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface SettingsTabsHeaderProps {
  currentTab: 'org-env' | 'app-devops' | 'ai-compute' | 'systems' | 'integrations' | 'sys-admin' | 'sec-posture';
  subTitle?: string;
  hideBreadcrumb?: boolean;
}

export const SettingsTabsHeader: React.FC<SettingsTabsHeaderProps> = ({ currentTab, subTitle, hideBreadcrumb = false }) => {
  const { setActiveNav, setSelectedSystemId } = usePlatform();

  const tabs = [
    { id: 'org-env', label: 'Organization & Environment', icon: MapPin },
    { id: 'app-devops', label: 'Applications & DevOps', icon: LayoutGrid },
    { id: 'ai-compute', label: 'AI & Compute', icon: Link2 },
    { id: 'systems', label: 'Security Posture', icon: Shield },
    { id: 'integrations', label: 'Integrations & Notifications', icon: Bell },
    { id: 'sys-admin', label: 'System Administration', icon: Zap }
  ] as const;

  const currentTabObj = tabs.find(t => t.id === currentTab || (currentTab === 'sec-posture' && t.id === 'systems'));

  return (
    <div className="space-y-4">
      {/* Breadcrumb line */}
      {!hideBreadcrumb && (
        <div className="flex items-center gap-2 text-xs font-sans text-slate-400">
          <span 
            onClick={() => setActiveNav('sys-admin')}
            className="hover:text-slate-200 cursor-pointer"
          >
            Settings
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span 
            onClick={() => {
              if (currentTab === 'systems' || currentTab === 'sec-posture') setSelectedSystemId(null);
              setActiveNav(currentTab === 'sec-posture' ? 'sec-posture' : currentTab);
            }}
            className="text-cyan-400 font-semibold cursor-pointer hover:underline"
          >
            {currentTabObj ? currentTabObj.label : 'Security Posture'}
          </span>
          {subTitle && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200">
                {subTitle}
              </span>
            </>
          )}
        </div>
      )}

      {/* Horizontal Settings Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isSecurityPostureTab = tab.id === 'systems';
          const isActive = currentTab === tab.id || (isSecurityPostureTab && currentTab === 'sec-posture');
          const isBlueHighlighted = (isActive && tab.id === 'sys-admin') || (isActive && isSecurityPostureTab);

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'systems') {
                  setSelectedSystemId(null);
                  setActiveNav('sec-posture');
                } else {
                  setActiveNav(tab.id);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg whitespace-nowrap atlas-button-label transition-all cursor-pointer ${
                isBlueHighlighted
                  ? 'bg-[#1864DF] text-white font-semibold shadow-md border border-blue-400/50'
                  : isActive
                  ? 'border border-cyan-500/70 bg-[#0A2234] text-cyan-300 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1726]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isBlueHighlighted ? 'text-white' : isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
