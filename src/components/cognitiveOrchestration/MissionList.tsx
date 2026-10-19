import React, { useState } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  source: string;
  scope: string;
  systems: number;
  findings: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  progress: number;
  status: 'In Progress' | 'Awaiting Approval' | 'Executing' | 'Completed' | 'Blocked';
  lastActivity: string;
}

const initialMissions: Mission[] = [
  { id: '1', name: 'Restore Payment Environment to Approved Security Baseline', source: 'Compliance', scope: 'Payment Environment', systems: 26, findings: 71, priority: 'High', progress: 62, status: 'In Progress', lastActivity: '10m ago' },
  { id: '2', name: 'Resolve Privileged Access Gaps', source: 'Compliance + Zero Trust', scope: 'Production', systems: 12, findings: 19, priority: 'High', progress: 35, status: 'Awaiting Approval', lastActivity: '1h ago' },
  { id: '3', name: 'Reduce Critical Exposure', source: 'Vulnerability', scope: 'Production Systems', systems: 31, findings: 68, priority: 'Critical', progress: 18, status: 'In Progress', lastActivity: '2h ago' },
  { id: '4', name: 'Contain Suspicious Activity', source: 'IDS', scope: 'Customer Portal Environment', systems: 3, findings: 6, priority: 'Critical', progress: 80, status: 'Executing', lastActivity: '5m ago' },
];

export const MissionList: React.FC<{ onSelectMission: (id: string) => void }> = ({ onSelectMission }) => {
  const [missions] = useState<Mission[]>(initialMissions);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-[#0B121E] border border-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs">All Sources <ChevronDown className="w-3 h-3" /></button>
            <button className="flex items-center gap-2 bg-[#0B121E] border border-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs">All Scopes <ChevronDown className="w-3 h-3" /></button>
            <button className="flex items-center gap-2 bg-[#0B121E] border border-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs">All Priorities <ChevronDown className="w-3 h-3" /></button>
            <button className="flex items-center gap-2 bg-[#0B121E] border border-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs">All Statuses <ChevronDown className="w-3 h-3" /></button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" placeholder="Search missions..." className="bg-[#0B121E] border border-slate-800 text-white pl-8 pr-4 py-1.5 rounded text-xs w-64 focus:outline-none focus:border-cyan-500" />
        </div>
      </div>

      <div className="bg-[#0B121E] border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0E1726] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3">Mission</th>
              <th className="p-3">Source</th>
              <th className="p-3">Scope</th>
              <th className="p-3 text-center">Systems</th>
              <th className="p-3 text-center">Findings</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Progress</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Activity</th>
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-slate-800">
            {missions.map(m => (
              <tr key={m.id} onClick={() => onSelectMission(m.id)} className="hover:bg-[#0E1726] cursor-pointer">
                <td className="p-3 font-semibold text-cyan-100">{m.name}</td>
                <td className="p-3 text-slate-300">{m.source}</td>
                <td className="p-3 text-slate-300">{m.scope}</td>
                <td className="p-3 text-center font-mono">{m.systems}</td>
                <td className="p-3 text-center font-mono">{m.findings}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${m.priority === 'Critical' ? 'bg-red-950/30 text-red-400' : 'bg-amber-950/30 text-amber-400'}`}>{m.priority}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${m.progress}%` }}></div>
                    </div>
                    <span className="font-mono">{m.progress}%</span>
                  </div>
                </td>
                <td className="p-3 text-xs">{m.status}</td>
                <td className="p-3 text-slate-500 font-mono">{m.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
