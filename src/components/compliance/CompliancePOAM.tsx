import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Calendar, 
  User 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { POAMItem, POAMStatus, FindingSeverity } from '../../types';

export const CompliancePOAM: React.FC = () => {
  const { poamItems, updatePOAMStatus, role, selectedSystemId } = usePlatform();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredPoam = poamItems.filter(item => {
    const matchesSystem = !selectedSystemId || item.systemId === selectedSystemId;
    const matchesSearch = item.weakness.toLowerCase().includes(search.toLowerCase()) || 
                          item.systemName.toLowerCase().includes(search.toLowerCase()) ||
                          item.controlId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSystem && matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: POAMStatus) => {
    switch (status) {
      case 'Open': return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      case 'In Progress': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40';
      case 'Ready for Verification': return 'text-purple-400 bg-purple-950/40 border-purple-500/40';
      case 'Closed': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    }
  };

  const getRiskBadge = (risk: FindingSeverity) => {
    switch (risk) {
      case 'Critical': return 'text-rose-400';
      case 'High': return 'text-rose-400 font-semibold';
      case 'Medium': return 'text-amber-400';
      case 'Low': return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5 font-sans">
            <FileText className="w-5 h-5 text-cyan-400" />
            Plan of Action & Milestones (POA&M)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Remediation milestone tracking for compliance weaknesses and audit findings.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search weaknesses or controls..."
              className="bg-[#121926] border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121926] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready for Verification">Ready for Verification</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* POA&M Table */}
      <div className="bg-[#0E1420] border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-[#121926] text-[11px] text-white uppercase font-mono tracking-wide">
                <th className="py-3 px-4">Finding</th>
                <th className="py-3 px-3">System</th>
                <th className="py-3 px-3">Control</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Target Date</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredPoam.map((item) => {
                const isOverdue = item.status !== 'Closed' && item.targetDate < '2026-10-05';
                return (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs">
                      <div className="truncate">{item.weakness}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">#{item.id}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                      {item.systemName}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-cyan-400 whitespace-nowrap">
                      {item.controlId}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className={getRiskBadge(item.risk)}>{item.risk}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {item.owner}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums whitespace-nowrap">
                      <span className={isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                        {item.targetDate}
                      </span>
                      {isOverdue && <span className="text-[10px] text-rose-400 block">Overdue</span>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm text-[11px] leading-relaxed">
                      {item.milestone}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {role === 'Viewer' ? (
                        <span className="text-slate-500 text-[11px] italic">Read-only</span>
                      ) : (
                        <select
                          value={item.status}
                          onChange={(e) => updatePOAMStatus(item.id, e.target.value as POAMStatus)}
                          className="bg-[#121926] border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none font-mono"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Ready for Verification">Ready</option>
                          <option value="Closed">Closed</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
