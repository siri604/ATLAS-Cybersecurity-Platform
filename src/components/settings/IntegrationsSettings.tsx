import React, { useState } from 'react';
import { Plug, CheckCircle2, AlertTriangle, RefreshCw, Key, Shield } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SettingsTabsHeader } from './SettingsTabsHeader';

export const IntegrationsSettings: React.FC = () => {
  const { integrations, configureIntegration, role } = usePlatform();
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  const handleConnectIdentity = () => {
    configureIntegration('int-identity');
    setConfiguringId(null);
  };

  return (
    <div className="space-y-6">
      <SettingsTabsHeader currentTab="integrations" subTitle="External Connectors" />

      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Plug className="w-5 h-5 text-cyan-400" />
          <h1 className="atlas-page-title">
            Integrations & Notifications
          </h1>
        </div>
        <p className="atlas-page-desc">
          Connect external identity providers, EDR agents, SIEM log streams, and alert endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int) => (
          <div key={int.id} className="bg-[#0E1420] border border-slate-800 rounded-lg p-5 flex flex-col justify-between text-xs space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="atlas-card-title text-white">{int.name}</h3>
                  <div className="atlas-secondary-text">{int.category} · Scope: {int.scope}</div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  int.status === 'Connected'
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                    : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                }`}>
                  {int.status}
                </span>
              </div>

              <p className="text-slate-300 mt-2 text-xs leading-relaxed">
                {int.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">Last Sync: {int.lastSync}</span>

              {int.status === 'Configuration Required' ? (
                <button
                  onClick={() => {
                    if (role === 'Admin' || role === 'SuperAdmin') {
                      handleConnectIdentity();
                    }
                  }}
                  disabled={role === 'Viewer' || role === 'Analyst'}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    role === 'Viewer' || role === 'Analyst'
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-black'
                  }`}
                  title={role === 'Viewer' || role === 'Analyst' ? 'Admin role or higher required.' : ''}
                >
                  Configure & Connect
                </button>
              ) : (
                <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
