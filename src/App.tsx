import React, { useState } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AutonomousConfirmModal } from './components/common/AutonomousConfirmModal';
import { AtlasAIAgentDrawer } from './components/aiAgent/AtlasAIAgentDrawer';
import { ToastContainer } from './components/common/ToastContainer';

import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { SystemsList } from './components/systems/SystemsList';
import { ComplianceModule } from './components/compliance/ComplianceModule';
import { ComplianceFindings } from './components/compliance/ComplianceFindings';
import { ActivityModule } from './components/activity/ActivityModule';
import { GenericModuleView } from './components/otherModules/GenericModuleView';
import { CognitiveOrchestration } from './components/cognitiveOrchestration/CognitiveOrchestration';
import { AutonomySettings } from './components/settings/AutonomySettings';
import { IntegrationsSettings } from './components/settings/IntegrationsSettings';
import { SecurityPostureSettings } from './components/settings/SecurityPostureSettings';
import { SystemAdminModule } from './components/settings/SystemAdminModule';
import { OrganizationEnvironmentSettings } from './components/settings/OrganizationEnvironmentSettings';
import { ApplicationDevOpsSettings } from './components/settings/ApplicationDevOpsSettings';
import { AIComputeSettings } from './components/settings/AIComputeSettings';
import { BookOpen, Check, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';

const DemoGuideWidget: React.FC = () => {
  const { role, setRole, setActiveNav, setSelectedSystemId } = usePlatform();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 right-6 z-40">
      {isOpen ? (
        <div className="w-88 bg-[#0E1420] border border-cyan-500/50 rounded-lg shadow-2xl p-4 text-xs text-slate-200 space-y-3 animate-in fade-in duration-150 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-white font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              ATLAS Interactive Demo Playbook
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            {/* Journey A: Onboarding */}
            <div className="p-2.5 rounded border border-slate-800 bg-slate-900/80 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center justify-between">
                <span>Journey A: Onboarding</span>
                <button
                  onClick={() => {
                    setSelectedSystemId(null);
                    setActiveNav('systems');
                  }}
                  className="text-[10px] text-black bg-cyan-400 px-1.5 py-0.5 rounded font-sans font-semibold hover:bg-cyan-300"
                >
                  Start →
                </button>
              </div>
              <p className="text-slate-300 font-sans text-[11px]">
                Systems → Add System → Linux Server → Connect (SSH) → Test Connection → Review → Register → Ready Workspace.
              </p>
            </div>

            {/* Journey B: Viewer Compliance */}
            <div className={`p-2.5 rounded border space-y-1 ${role === 'Viewer' ? 'bg-cyan-950/40 border-cyan-500/50 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <div className="font-bold text-cyan-300 flex items-center justify-between">
                <span>Journey B: Viewer Role</span>
                <button
                  onClick={() => {
                    setRole('Viewer');
                    setSelectedSystemId(null);
                    setActiveNav('compliance');
                  }}
                  className="text-[10px] text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded font-sans hover:bg-cyan-950"
                >
                  Switch Role & Test
                </button>
              </div>
              <p className="font-sans text-[11px]">
                Compliance → All Systems Overview → Open assessment → Findings → Evidence. All action buttons disabled with &quot;Analyst role or higher required&quot;.
              </p>
            </div>

            {/* Journey C: Analyst */}
            <div className={`p-2.5 rounded border space-y-1 ${role === 'Analyst' ? 'bg-cyan-950/40 border-cyan-500/50 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <div className="font-bold text-cyan-300 flex items-center justify-between">
                <span>Journey C: Analyst Role</span>
                <button
                  onClick={() => {
                    setRole('Analyst');
                    setSelectedSystemId('sys-payments-prod');
                    setActiveNav('compliance');
                  }}
                  className="text-[10px] text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded font-sans hover:bg-cyan-950"
                >
                  Switch Role & Test
                </button>
              </div>
              <p className="font-sans text-[11px]">
                Start CIS assessment → Review failed control → Add to POA&M → Submit targeted remediation for Admin authorization.
              </p>
            </div>

            {/* Journey D: Admin */}
            <div className={`p-2.5 rounded border space-y-1 ${role === 'Admin' ? 'bg-cyan-950/40 border-cyan-500/50 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <div className="font-bold text-cyan-300 flex items-center justify-between">
                <span>Journey D: Admin Role</span>
                <button
                  onClick={() => {
                    setRole('Admin');
                    setActiveNav('compliance');
                  }}
                  className="text-[10px] text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded font-sans hover:bg-cyan-950"
                >
                  Switch Role & Test
                </button>
              </div>
              <p className="font-sans text-[11px]">
                Configure missing Identity Integration → Review remediation request → Approve → Reassess & verify fresh evidence.
              </p>
            </div>

            {/* Journey E: SuperAdmin */}
            <div className={`p-2.5 rounded border space-y-1 ${role === 'SuperAdmin' ? 'bg-amber-950/40 border-amber-500/50 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>Journey E: SuperAdmin Role</span>
                <button
                  onClick={() => {
                    setRole('SuperAdmin');
                    setActiveNav('sys-admin');
                  }}
                  className="text-[10px] text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-sans hover:bg-amber-950"
                >
                  Switch Role & Test
                </button>
              </div>
              <p className="font-sans text-[11px]">
                System Administration → Autonomy & Approvals → Select Autonomous → Confirmation Modal → Platform Operations diagnostics.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0E1420] border border-cyan-500/60 text-cyan-300 hover:text-white text-xs font-mono shadow-xl transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Demo Playbook</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeNav, role } = usePlatform();

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'systems':
        return <SystemsList />;
      case 'compliance':
        return <ComplianceModule />;
      case 'findings':
        return <ComplianceFindings />;
      case 'activity':
        return <ActivityModule />;
      case 'human-threats':
        return <GenericModuleView moduleId="human-threats" />;
      case 'zero-trust':
        return <GenericModuleView moduleId="zero-trust" />;
      case 'network-sec':
        return <GenericModuleView moduleId="network-sec" />;
      case 'intrusion-det':
        return <GenericModuleView moduleId="intrusion-det" />;
      case 'anomaly-det':
        return <GenericModuleView moduleId="anomaly-det" />;
      case 'software-qai':
        return <GenericModuleView moduleId="software-qai" />;
      case 'platform-ops':
        return (role === 'SuperAdmin' || role === 'Admin') ? <CognitiveOrchestration /> : <DashboardOverview />;
      case 'sec-posture':
        return <SecurityPostureSettings />;
      case 'org-env':
        return <OrganizationEnvironmentSettings />;
      case 'app-devops':
        return <ApplicationDevOpsSettings />;
      case 'ai-compute':
        return <AIComputeSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'sys-admin':
        return <SystemAdminModule />;
      default:
        return <ComplianceModule />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#080C14] p-6 lg:p-8 relative">
      <div className="max-w-7xl mx-auto pb-16">
        {renderContent()}
      </div>
      <DemoGuideWidget />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080C14] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <MainContent />
        </div>
        <AutonomousConfirmModal />
        <AtlasAIAgentDrawer />
        <ToastContainer />
      </div>
    </PlatformProvider>
  );
}
