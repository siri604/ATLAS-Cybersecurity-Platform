import React from 'react';
import { Building2, ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const OrganizationOverview: React.FC = () => {
  const { systems, tenant, setActiveNav } = usePlatform();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="atlas-page-title">Organization Overview</h1>
        <button 
          onClick={() => setActiveNav('systems')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg atlas-button-label font-semibold text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
        >
          <span>Onboard First System</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A101C] border border-slate-800 rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Tenant Details</h3>
          <div className="space-y-2 text-sm font-mono text-slate-400">
            <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="text-white">{tenant?.name || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Environment:</span> <span className="text-white">{tenant?.environment || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Admin:</span> <span className="text-white">{tenant?.admin.name || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="text-emerald-400">Active</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Systems:</span> <span className="text-white">{systems.length}</span></div>
          </div>
        </div>

        <div className="bg-[#0A101C] border border-slate-800 rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Scope Hierarchy</h3>
          <div className="space-y-1 font-mono text-xs">
            <div className="text-white">Global <span className="text-slate-600">(Platform-managed)</span></div>
            <div className="pl-4 text-cyan-400">↓</div>
            <div className="text-white">Tenant <span className="text-emerald-400">(Active)</span></div>
            <div className="pl-4 text-cyan-400">↓</div>
            <div className="text-slate-600">Enclave / Organization <span className="text-slate-700">(Planned)</span></div>
            <div className="pl-4 text-slate-700">↓</div>
            <div className="text-white">Systems <span className="text-emerald-400">(Active)</span></div>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <button disabled className="w-full py-2 bg-slate-900 text-slate-500 font-semibold rounded text-sm border border-slate-800">
              Add Enclave (Planned)
            </button>
            <p className="text-[10px] text-slate-500 mt-2">Enclave-level segmentation will support isolated environments, security boundaries, and scoped systems in a future release.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
