import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { Building2, User, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export const TenantSetup: React.FC = () => {
  const { setIsTenantConfigured, setActiveNav, setTenant } = usePlatform();
  const [step, setStep] = useState(1);
  const [tenantName, setTenantName] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const steps = [
    { id: 1, name: 'Tenant' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Ready' }
  ];

  return (
    <div className="bg-[#0A101C] border border-slate-800 rounded-lg p-8 max-w-2xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Tenant Setup</h2>
        <p className="text-sm text-slate-400">Initialize your ATLAS environment foundation.</p>
      </div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs ${step >= s.id ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
              {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
            </div>
            <span className={`text-xs font-semibold ${step >= s.id ? 'text-white' : 'text-slate-600'}`}>{s.name}</span>
            {idx < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700 ml-2" />}
          </div>
        ))}
      </div>

      <div className="min-h-[200px]">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tenant / Organization Name</label>
              <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" placeholder="e.g., Global Cyber Corp" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Environment</label>
              <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white">
                <option>Production</option>
                <option>Sandbox</option>
              </select>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded text-sm transition-colors">Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Name</label>
              <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" placeholder="Admin Name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Email</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" placeholder="admin@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Role</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-500">Admin</div>
            </div>
            <button onClick={() => setStep(3)} className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded text-sm transition-colors">Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="text-sm text-slate-400 space-y-1">
              <p>Tenant created ✓</p>
              <p>First Admin created ✓</p>
            </div>
            <button 
              onClick={() => {
                setTenant({
                  name: tenantName,
                  environment,
                  admin: {
                    name: adminName,
                    email: adminEmail
                  }
                });
                setIsTenantConfigured(true);
                setActiveNav('systems');
              }}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded text-sm transition-colors"
            >
              Onboard First System
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
