import React, { useState } from 'react';
import { History, Search, Filter, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const ActivityModule: React.FC = () => {
  const { activityLogs, selectedSystemId } = usePlatform();
  const [search, setSearch] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSystem = !selectedSystemId || log.systemName === selectedSystemId || !log.systemName;
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                          log.details.toLowerCase().includes(search.toLowerCase()) ||
                          log.actor.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    return matchesSystem && matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <History className="w-5 h-5 text-cyan-400" />
            Platform Activity & Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Cryptographically signed audit logs for operational actions, role access, and automated remediations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity logs..."
            className="bg-[#121926] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none w-52"
          />

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="Compliance">Compliance</option>
            <option value="Systems">Systems</option>
            <option value="Anomaly Detection">Anomaly Detection</option>
            <option value="Platform Operations">Platform Operations</option>
            <option value="Integrations">Integrations</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0E1420] border border-slate-800 rounded-lg overflow-hidden">
        <div className="divide-y divide-slate-800/80 text-xs font-mono">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'Success' ? 'bg-emerald-400' :
                    log.status === 'Warning' ? 'bg-amber-400' :
                    log.status === 'Error' ? 'bg-rose-400' : 'bg-cyan-400'
                  }`} />
                  <span className="font-bold text-white text-xs">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    in <strong className="text-cyan-400 font-mono">{log.module}</strong>
                  </span>
                  {log.systemName && (
                    <span className="text-[10px] text-slate-500">
                      ({log.systemName})
                    </span>
                  )}
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  {log.details}
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0 text-[11px] text-slate-500">
                <div className="text-slate-300">{log.actor}</div>
                <div className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
