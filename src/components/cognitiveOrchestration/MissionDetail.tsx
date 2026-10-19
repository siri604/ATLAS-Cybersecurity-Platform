import React from 'react';
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';

export const MissionDetail: React.FC<{ missionId: string, onBack: () => void }> = ({ missionId, onBack }) => {
    // This would ideally fetch the mission data based on ID
    return (
        <div className="space-y-6 font-sans">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-400 text-xs hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back to Missions
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Restore Payment Environment to Approved Security Baseline</h1>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 bg-[#0B1322] p-6 rounded-lg border border-slate-800 space-y-6">
                    <div className="text-xs text-slate-400">Source: Compliance | Scope: Payment Environment | Systems: 26</div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Objective</h3>
                        <p className="text-sm text-slate-300">Restore the payment environment to the approved CIS v8 security baseline by addressing identified drift across 26 production systems.</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Findings/Signals</h3>
                        <div className="space-y-2">
                             <div className="p-3 bg-[#0E1726] rounded border border-slate-800 text-xs text-slate-300">Privileged Access: 34 findings</div>
                             <div className="p-3 bg-[#0E1726] rounded border border-slate-800 text-xs text-slate-300">System Hardening: 22 findings</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-[#0B1322] p-6 rounded-lg border border-slate-800 space-y-6">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</h3>
                    <div className="text-2xl font-bold text-cyan-400">62%</div>
                    <div className="text-xs text-slate-400">34 verified, 12 pending approval</div>
                    <button className="w-full bg-emerald-600 text-white text-xs font-bold py-2 rounded">Approve Actions</button>
                </div>
            </div>
        </div>
    )
}
