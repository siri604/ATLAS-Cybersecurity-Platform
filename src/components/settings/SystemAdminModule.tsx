import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  LayoutGrid, 
  Lock, 
  Users, 
  Zap, 
  Cloud, 
  User, 
  ChevronRight, 
  ChevronDown, 
  Shield, 
  Download, 
  RefreshCw, 
  Check, 
  Lightbulb, 
  X, 
  Save, 
  Plus, 
  AlertTriangle,
  CheckCircle2,
  Sliders,
  SlidersHorizontal,
  Layers,
  Terminal,
  Globe
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SettingsTabsHeader } from './SettingsTabsHeader';
import { PlatformRole, AutonomyMode } from '../../types';

export const SystemAdminModule: React.FC = () => {
  const { role, setRole, addToast, setActiveNav, autonomyMode, requestAutonomyChange, setAutonomyMode } = usePlatform();

  // Active accordion section tracking ('features' | 'tabs' | 'members' | 'flags' | 'system' | 'sysPref' | 'autonomy' | 'userPref' | null)
  // All tabs collapsed by default per user request
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Autonomy selection state
  const [selectedAutonomyMode, setSelectedAutonomyMode] = useState<AutonomyMode>(autonomyMode || 'Approval required');
  const [isEditingAutonomy, setIsEditingAutonomy] = useState<boolean>(false);
  const [isFuturePolicyExpanded, setIsFuturePolicyExpanded] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAutonomyMode(autonomyMode);
  }, [autonomyMode]);

  const handleSelectAutonomyMode = (mode: AutonomyMode) => {
    setSelectedAutonomyMode(mode);
    if (mode !== autonomyMode) {
      setIsEditingAutonomy(true);
    }
  };

  const handleSaveAutonomyChanges = () => {
    if (selectedAutonomyMode === 'Autonomous' && autonomyMode !== 'Autonomous') {
      setIsEditingAutonomy(false);
      requestAutonomyChange('Autonomous');
    } else {
      setAutonomyMode(selectedAutonomyMode);
      setIsEditingAutonomy(false);
      addToast('Autonomy policy updated', 'success');
    }
  };

  const handleCancelAutonomyChanges = () => {
    setSelectedAutonomyMode(autonomyMode);
    setIsEditingAutonomy(false);
  };

  // Training Guide modal state
  const [isTrainingGuideOpen, setIsTrainingGuideOpen] = useState<boolean>(false);

  // Invite member modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<PlatformRole>('Analyst');

  // 1. Platform Features State
  const [platformFeatures, setPlatformFeatures] = useState({
    compliance: true,
    threatIntel: true,
    zeroTrust: true,
    networkSec: true,
    ids: true,
    anomalyDet: true,
    softwareQai: true,
    orchestration: true
  });

  // 2. Tab Access Matrix State
  const [tabPermissions, setTabPermissions] = useState({
    dashboard: ['Viewer', 'Analyst', 'Admin', 'SuperAdmin'],
    compliance: ['Viewer', 'Analyst', 'Admin', 'SuperAdmin'],
    threats: ['Viewer', 'Analyst', 'Admin', 'SuperAdmin'],
    zeroTrust: ['Analyst', 'Admin', 'SuperAdmin'],
    network: ['Analyst', 'Admin', 'SuperAdmin'],
    ids: ['Analyst', 'Admin', 'SuperAdmin'],
    anomaly: ['Analyst', 'Admin', 'SuperAdmin'],
    softwareQai: ['Analyst', 'Admin', 'SuperAdmin'],
    orchestration: ['SuperAdmin']
  });

  // 3. Members & Roles State
  const [members, setMembers] = useState([
    {
      id: 'usr-1',
      name: 'D. Vance',
      email: 'pmtosiri@gmail.com',
      role: 'SuperAdmin' as PlatformRole,
      title: 'SecOps Principal',
      status: 'Active',
      lastActive: 'Just now'
    },
    {
      id: 'usr-2',
      name: 'Sarah Chen',
      email: 's.chen@vanguard.sec',
      role: 'Analyst' as PlatformRole,
      title: 'Lead Security Analyst',
      status: 'Active',
      lastActive: '14 mins ago'
    },
    {
      id: 'usr-3',
      name: 'Marcus Brody',
      email: 'm.brody@vanguard.sec',
      role: 'Admin' as PlatformRole,
      title: 'DevOps Security Lead',
      status: 'Active',
      lastActive: '1 hour ago'
    },
    {
      id: 'usr-4',
      name: 'Elena Rostova',
      email: 'e.rostova@external.audit',
      role: 'Viewer' as PlatformRole,
      title: 'Compliance Auditor',
      status: 'Active',
      lastActive: '3 hours ago'
    }
  ]);

  // 4. Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    autonomous_remediation_v2: false,
    gemini_2_5_reasoning_core: true,
    ebpf_kernel_probe_stream: true,
    zero_trust_hardware_tpm: true,
    streaming_sbom_verification: true,
    deep_packet_forensics: false
  });

  // 5. Atlas System State
  const [atlasSystemConfig, setAtlasSystemConfig] = useState({
    clusterNode: 'node-us-west1-prod-01',
    daemonVersion: 'ATLAS v4.18.2-enterprise-hardened',
    heartbeatIntervalSec: 30,
    discoverySubnet: '10.20.0.0/16',
    vectorCache: 'Redis Enterprise Cluster (Active)',
    encryptionRoot: 'FIPS 140-3 Hardware HSM Partition 4'
  });

  // 6. System Preferences State
  const [systemPreferences, setSystemPreferences] = useState({
    defaultCriticality: 'High',
    sessionTimeoutMin: 15,
    auditRetentionDays: 365,
    automatedBackup: true,
    webhookEndpoint: 'https://hooks.vanguard.sec/alerts/sys-admin'
  });

  // 7. User Preferences State
  const [userPreferences, setUserPreferences] = useState({
    themeDensity: 'compact',
    chimeAlerts: true,
    fontFamily: 'JetBrains Mono',
    defaultLanding: 'systems',
    digestFrequency: 'immediate'
  });

  // Toggle helper
  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  // Actions
  const handleTestConnections = () => {
    addToast('All 5 system probes validated with active latency (14ms avg RTT). Network connections healthy.', 'success');
  };

  const handleExportConfig = () => {
    const configData = {
      version: '4.18.2',
      exportDate: new Date().toISOString(),
      platformFeatures,
      tabPermissions,
      featureFlags,
      atlasSystemConfig,
      systemPreferences,
      userPreferences
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-configuration-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Configuration exported as atlas-configuration.json', 'success');
  };

  const handleReload = () => {
    addToast('Configuration reloaded from secure storage', 'info');
  };

  const handleCancel = () => {
    setActiveNav('systems');
  };

  const handleSaveConfiguration = () => {
    addToast('Configuration saved successfully', 'success');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    const newMember = {
      id: `usr-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      title: 'Security Member',
      status: 'Active',
      lastActive: 'Just now'
    };
    setMembers(prev => [...prev, newMember]);
    addToast(`Invitation sent to ${inviteEmail} as ${inviteRole}`, 'success');
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
  };

  return (
    <div className="space-y-6">
      {/* Outer Card with Gold Rim Border Matching Screenshot */}
      <div className="bg-[#070D18] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Header Row (Exact match to screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            {/* Yellow Rounded Square with Gear Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#FFB300] flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(255,179,0,0.3)] shrink-0">
              <Settings className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="atlas-page-title text-base sm:text-lg font-semibold text-[#FFC837]">
                  ATLAS Configuration
                </h1>

                {/* Training Guide Pill Badge with Lightbulb & Amber Dot */}
                <button
                  type="button"
                  onClick={() => setIsTrainingGuideOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121A28] border border-amber-500/50 hover:border-amber-400 text-amber-300 atlas-button-label transition-colors cursor-pointer group"
                >
                  <Lightbulb className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="atlas-button-label text-amber-300">Training Guide</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B] ml-0.5" />
                </button>
              </div>

              <p className="atlas-page-desc">
                Platform Settings & System Configuration
              </p>
            </div>
          </div>

          {/* Close X Button */}
          <button
            onClick={() => setActiveNav('systems')}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors self-start sm:self-center cursor-pointer"
            title="Close Configuration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Horizontal Tabs Navigation Bar */}
        <SettingsTabsHeader currentTab="sys-admin" hideBreadcrumb={true} />

        {/* The Accordion Options List (Standardized ATLAS hierarchy) */}
        <div className="space-y-2 pt-1 font-sans">

          {/* 1. Platform Features */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('features')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  Platform Features
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'features' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'features' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Toggle enterprise security modules and runtime engines active in this tenant deployment.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[
                    { key: 'compliance', label: 'Compliance & Audit Frameworks (CIS, SOC 2, PCI)', active: platformFeatures.compliance },
                    { key: 'threatIntel', label: 'Human & Agent Threat Intelligence', active: platformFeatures.threatIntel },
                    { key: 'zeroTrust', label: 'Zero Trust Micro-segmentation & mTLS', active: platformFeatures.zeroTrust },
                    { key: 'networkSec', label: 'Network Security Firewalls & Routing', active: platformFeatures.networkSec },
                    { key: 'ids', label: 'Intrusion Detection System (Wazuh / SCA)', active: platformFeatures.ids },
                    { key: 'anomalyDet', label: 'Behavioral Anomaly Detection Model', active: platformFeatures.anomalyDet },
                    { key: 'softwareQai', label: 'Software QAi CI/CD Supply Chain Scanner', active: platformFeatures.softwareQai },
                    { key: 'orchestration', label: 'Multi-Agent Autonomous Orchestration', active: platformFeatures.orchestration }
                  ].map((item) => (
                    <div 
                      key={item.key}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#0C1524] border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <span className="atlas-card-title">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => setPlatformFeatures(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Tab Access */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('tabs')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  Tab Access
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'tabs' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'tabs' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Role-based visibility and interaction access matrix for main navigation tabs.
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#0C1524] atlas-metadata">
                        <th className="py-2.5 px-3 font-medium uppercase tracking-wider">NAVIGATION TAB</th>
                        <th className="py-2.5 px-3 text-center font-medium uppercase tracking-wider">VIEWER</th>
                        <th className="py-2.5 px-3 text-center font-medium uppercase tracking-wider">ANALYST</th>
                        <th className="py-2.5 px-3 text-center font-medium uppercase tracking-wider">ADMIN</th>
                        <th className="py-2.5 px-3 text-center font-medium uppercase tracking-wider">SUPERADMIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {[
                        { id: 'dashboard', name: 'Dashboard' },
                        { id: 'compliance', name: 'Compliance' },
                        { id: 'threats', name: 'Threat Intelligence' },
                        { id: 'zeroTrust', name: 'Zero Trust' },
                        { id: 'network', name: 'Network Security' },
                        { id: 'ids', name: 'Intrusion Detection' },
                        { id: 'anomaly', name: 'Anomaly Detection' },
                        { id: 'softwareQai', name: 'Software QAi' },
                        { id: 'orchestration', name: 'Platform Operations' }
                      ].map((tab) => (
                        <tr key={tab.id} className="hover:bg-[#0C1524]/60">
                          <td className="py-2.5 px-3 atlas-card-title">{tab.name}</td>
                          {['Viewer', 'Analyst', 'Admin', 'SuperAdmin'].map((r) => {
                            const hasAccess = (tabPermissions as any)[tab.id]?.includes(r);
                            return (
                              <td key={r} className="py-2.5 px-3 text-center">
                                <span className={`inline-block w-4 h-4 rounded-full text-[10px] leading-4 text-center font-sans ${
                                  hasAccess ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' : 'bg-slate-900 text-slate-600'
                                }`}>
                                  {hasAccess ? '✓' : '−'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 3. Members & Roles */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('members')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  Members & Roles
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'members' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'members' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="atlas-body-text">
                    Manage security personnel, assigned platform access levels, and active operator enclaves.
                  </div>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 atlas-button-label transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Member</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 rounded-lg border border-slate-800 bg-[#0C1524]">
                  {members.map((m) => (
                    <div key={m.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#071322] border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-medium text-xs font-sans">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="atlas-card-title text-white">{m.name}</div>
                          <div className="atlas-secondary-text">{m.email} · {m.title}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`atlas-status-label px-2 py-0.5 rounded border ${
                          m.role === 'SuperAdmin' ? 'bg-amber-950/40 text-amber-300 border-amber-500/40' :
                          m.role === 'Admin' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' :
                          m.role === 'Analyst' ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {m.role}
                        </span>

                        <span className="atlas-metadata text-emerald-400 flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Feature Flags */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('flags')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  Feature Flags
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'flags' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'flags' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Granular control over preview modules, experimental kernel probes, and high-assurance security features.
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'gemini_2_5_reasoning_core', title: 'gemini_2_5_reasoning_core', desc: 'Enable multi-hop causal graph analysis using Gemini 2.5 reasoning models.' },
                    { key: 'autonomous_remediation_v2', title: 'autonomous_remediation_v2', desc: 'Allow automated remediation engine to execute verified system fixes without per-action approval.' },
                    { key: 'ebpf_kernel_probe_stream', title: 'ebpf_kernel_probe_stream', desc: 'Deploy low-overhead eBPF syscall monitors directly to Linux kernel runtimes.' },
                    { key: 'zero_trust_hardware_tpm', title: 'zero_trust_hardware_tpm', desc: 'Require FIPS 140-3 Hardware TPM device identity certificates on all client enclaves.' },
                    { key: 'streaming_sbom_verification', title: 'streaming_sbom_verification', desc: 'Real-time CycloneDX software bill of materials validation during CI build phases.' }
                  ].map((flag) => (
                    <div 
                      key={flag.key}
                      className="p-2.5 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-mono text-xs font-semibold text-cyan-300">{flag.title}</div>
                        <div className="atlas-secondary-text mt-0.5">{flag.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={(featureFlags as any)[flag.key]}
                        onChange={(e) => setFeatureFlags(prev => ({ ...prev, [flag.key]: e.target.checked }))}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. ATLAS Systems */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('system')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Cloud className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  ATLAS Systems
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'system' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'system' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Core daemon architecture, cluster synchronization parameters, and root cryptographic settings.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1">
                    <span className="atlas-secondary-text">Control Plane Version</span>
                    <div className="text-cyan-400 font-medium text-xs font-mono">{atlasSystemConfig.daemonVersion}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1">
                    <span className="atlas-secondary-text">Primary Discovery Gateway</span>
                    <div className="text-white font-medium text-xs font-mono">{atlasSystemConfig.discoverySubnet}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1">
                    <span className="atlas-secondary-text">Vector Memory & State Cache</span>
                    <div className="text-white font-medium text-xs font-mono">{atlasSystemConfig.vectorCache}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1">
                    <span className="atlas-secondary-text">Cryptographic Root</span>
                    <div className="text-emerald-400 font-medium text-xs font-mono">{atlasSystemConfig.encryptionRoot}</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Agent Heartbeat Polling Interval</div>
                    <div className="atlas-secondary-text mt-0.5">Frequency of telemetry synchronizations from edge daemons</div>
                  </div>
                  <select
                    value={atlasSystemConfig.heartbeatIntervalSec}
                    onChange={(e) => setAtlasSystemConfig(prev => ({ ...prev, heartbeatIntervalSec: Number(e.target.value) }))}
                    className="bg-[#080D18] border border-slate-700 text-cyan-300 text-xs rounded px-2.5 py-1.5 font-sans cursor-pointer"
                  >
                    <option value={10}>10 Seconds (Aggressive)</option>
                    <option value={30}>30 Seconds (Recommended)</option>
                    <option value={60}>60 Seconds (Standard)</option>
                    <option value={300}>300 Seconds (Low Overhead)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 6. System Preferences */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('sysPref')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  System Preferences
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'sysPref' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'sysPref' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Global operational settings, session governance, and automated backup schedules.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Default Asset Criticality
                    </label>
                    <select
                      value={systemPreferences.defaultCriticality}
                      onChange={(e) => setSystemPreferences(prev => ({ ...prev, defaultCriticality: e.target.value }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High (Recommended)</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Session Inactivity Timeout
                    </label>
                    <select
                      value={systemPreferences.sessionTimeoutMin}
                      onChange={(e) => setSystemPreferences(prev => ({ ...prev, sessionTimeoutMin: Number(e.target.value) }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                      <option value={120}>2 Hours</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Audit Log Retention Policy
                    </label>
                    <select
                      value={systemPreferences.auditRetentionDays}
                      onChange={(e) => setSystemPreferences(prev => ({ ...prev, auditRetentionDays: Number(e.target.value) }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value={90}>90 Days</option>
                      <option value={180}>180 Days</option>
                      <option value={365}>365 Days (Compliant)</option>
                      <option value={730}>2 Years</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="atlas-card-title text-white">Automated Snapshot & Backup</div>
                      <div className="atlas-secondary-text">Nightly backup at 02:00 UTC to encrypted cloud cold storage</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemPreferences.automatedBackup}
                      onChange={(e) => setSystemPreferences(prev => ({ ...prev, automatedBackup: e.target.checked }))}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 7. Autonomy & Approvals */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('autonomy')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  Autonomy & Approvals
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'autonomy' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'autonomy' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Controls ATLAS execution authority for remediation and action execution across onboarded systems. Currently active: <span className="text-cyan-400 font-medium">{autonomyMode}</span>
                </div>
                
                {/* Autonomy Sub-Heading */}
                <div className="pt-1">
                  <h3 className="atlas-section-heading">Autonomy</h3>
                </div>

                {/* 2x2 Grid of Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                  
                  {/* Card 1: Observe */}
                  <div
                    onClick={() => handleSelectAutonomyMode('Observe')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      selectedAutonomyMode === 'Observe'
                        ? 'border-cyan-500/80 bg-[#071626] ring-1 ring-cyan-500/40 shadow-sm'
                        : 'border-slate-800 bg-[#0C1524] hover:border-slate-700 hover:bg-[#0E192D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {selectedAutonomyMode === 'Observe' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`atlas-card-title ${selectedAutonomyMode === 'Observe' ? 'text-white' : ''}`}>
                            Observe
                          </span>
                          {autonomyMode === 'Observe' && (
                            <span className="px-2 py-0.5 rounded border border-cyan-400/80 bg-[#072433] text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.35)] atlas-status-label flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="atlas-secondary-text mt-1 leading-relaxed">
                          ATLAS detects, analyzes, and reports issues without recommending or executing changes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Recommend */}
                  <div
                    onClick={() => handleSelectAutonomyMode('Recommend')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      selectedAutonomyMode === 'Recommend'
                        ? 'border-cyan-500/80 bg-[#071626] ring-1 ring-cyan-500/40 shadow-sm'
                        : 'border-slate-800 bg-[#0C1524] hover:border-slate-700 hover:bg-[#0E192D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {selectedAutonomyMode === 'Recommend' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`atlas-card-title ${selectedAutonomyMode === 'Recommend' ? 'text-white' : ''}`}>
                            Recommend
                          </span>
                          {autonomyMode === 'Recommend' && (
                            <span className="px-2 py-0.5 rounded border border-cyan-400/80 bg-[#072433] text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.35)] atlas-status-label flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="atlas-secondary-text mt-1 leading-relaxed">
                          ATLAS recommends how to address an issue, but changes are performed manually by the customer.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Approval required */}
                  <div
                    onClick={() => handleSelectAutonomyMode('Approval required')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      selectedAutonomyMode === 'Approval required'
                        ? 'border-cyan-500/80 bg-[#071626] ring-1 ring-cyan-500/40 shadow-sm'
                        : 'border-slate-800 bg-[#0C1524] hover:border-slate-700 hover:bg-[#0E192D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {selectedAutonomyMode === 'Approval required' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`atlas-card-title ${selectedAutonomyMode === 'Approval required' ? 'text-white' : ''}`}>
                            Approval required
                          </span>
                          {autonomyMode === 'Approval required' && (
                            <span className="px-2 py-0.5 rounded border border-cyan-400/80 bg-[#072433] text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.35)] atlas-status-label flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="atlas-secondary-text mt-1 leading-relaxed text-slate-300">
                          ATLAS can prepare and execute permitted actions only after an authorized user approves them.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Autonomous */}
                  <div
                    onClick={() => handleSelectAutonomyMode('Autonomous')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      selectedAutonomyMode === 'Autonomous'
                        ? 'border-cyan-500/80 bg-[#071626] ring-1 ring-cyan-500/40 shadow-sm'
                        : 'border-slate-800 bg-[#0C1524] hover:border-slate-700 hover:bg-[#0E192D]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {selectedAutonomyMode === 'Autonomous' ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-transparent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`atlas-card-title ${selectedAutonomyMode === 'Autonomous' ? 'text-white' : ''}`}>
                            Autonomous
                          </span>
                          {autonomyMode === 'Autonomous' && (
                            <span className="px-2 py-0.5 rounded border border-cyan-400/80 bg-[#072433] text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.35)] atlas-status-label flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="atlas-secondary-text mt-1 leading-relaxed">
                          ATLAS can execute permitted actions without individual approval, subject to configured policies and system access.
                        </p>
                        <div className="text-yellow-400 mt-2 flex items-center gap-1.5 font-medium text-[11px] leading-4">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-yellow-400" />
                          <span className="text-yellow-400">Requires verified access and configured policy boundaries</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Status text & Cancel / Save changes buttons */}
                {isEditingAutonomy && (
                  <div className="pt-1 flex items-center justify-end gap-2 text-xs font-sans animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={handleCancelAutonomyChanges}
                      className="px-3.5 py-1.5 rounded-lg atlas-button-label text-slate-400 hover:text-white bg-[#0A121E] border border-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAutonomyChanges}
                      className="px-3.5 py-1.5 rounded-lg atlas-button-label text-white bg-[#007A87] hover:bg-[#0097A7] transition-colors cursor-pointer shadow-sm"
                    >
                      Save changes
                    </button>
                  </div>
                )}

                {/* Approvals Governance - Only visible when Approval required or Autonomous is active */}
                {(autonomyMode === 'Approval required' || autonomyMode === 'Autonomous') && (
                  <div className="p-3.5 rounded-lg bg-[#0C1524] border border-slate-800 space-y-2 font-sans animate-in fade-in duration-150">
                    <div>
                      <h3 className="atlas-section-heading">Approvals</h3>
                    </div>
                    <p className="atlas-secondary-text leading-relaxed">
                      Actions requiring administrative approval are queued in the Operations authorization pool before dispatch to target systems.
                    </p>
                    <div className="flex items-center gap-4 pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Dual-operator approval for high-impact remediations</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Pre-authorized low-risk operational rollbacks</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Future policy controls container - Collapsed by default */}
                <div className="p-3.5 rounded-lg bg-[#0C1524] border border-slate-800 space-y-3 font-sans transition-all">
                  <div 
                    onClick={() => setIsFuturePolicyExpanded(!isFuturePolicyExpanded)}
                    className="flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <h3 className="atlas-section-heading">
                        Future policy controls
                      </h3>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isFuturePolicyExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                    </div>
                    <span className="border border-amber-500/70 bg-[#2A1E07] text-amber-400 px-2 py-0.5 rounded atlas-status-label">
                      PLANNED
                    </span>
                  </div>

                  {isFuturePolicyExpanded && (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                      <p className="atlas-secondary-text leading-relaxed">
                        Future versions will allow ATLAS autonomy policies to be inherited and overridden at different organizational scopes.
                      </p>

                      {/* Scope Hierarchy */}
                      <div className="space-y-1.5">
                        <div className="atlas-metadata uppercase tracking-wider">
                          EXAMPLE SCOPE HIERARCHY
                        </div>

                        <div className="flex items-center flex-wrap gap-2 pt-0.5 font-sans">
                          <div className="px-2.5 py-1 rounded border border-slate-700 bg-[#0B1525] text-xs font-sans font-medium text-slate-200 shadow-sm">
                            Global
                          </div>
                          <span className="text-slate-600 text-xs font-sans">→</span>
                          <div className="px-2.5 py-1 rounded border border-slate-700 bg-[#0B1525] text-xs font-sans font-medium text-slate-200 shadow-sm">
                            Tenant
                          </div>
                          <span className="text-slate-600 text-xs font-sans">→</span>
                          <div className="px-2.5 py-1 rounded border border-slate-700 bg-[#0B1525] text-xs font-sans font-medium text-slate-200 shadow-sm">
                            Organization
                          </div>
                          <span className="text-slate-600 text-xs font-sans">→</span>
                          <div className="px-2.5 py-1 rounded border border-cyan-500/80 bg-[#0A2638] text-xs font-sans font-medium text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                            System
                          </div>
                        </div>
                      </div>

                      {/* 6 Feature Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-slate-800/80 font-sans">
                        <div>
                          <div className="atlas-card-title">Global policy</div>
                          <div className="atlas-secondary-text mt-0.5">Enterprise-wide default baseline</div>
                        </div>

                        <div>
                          <div className="atlas-card-title">Tenant policy</div>
                          <div className="atlas-secondary-text mt-0.5">Enclave compliance boundaries</div>
                        </div>

                        <div>
                          <div className="atlas-card-title">Organization policy</div>
                          <div className="atlas-secondary-text mt-0.5">Departmental & unit policies</div>
                        </div>

                        <div>
                          <div className="atlas-card-title">System-specific overrides</div>
                          <div className="atlas-secondary-text mt-0.5">Targeted exceptions for critical hosts</div>
                        </div>

                        <div>
                          <div className="atlas-card-title">Policy inheritance</div>
                          <div className="atlas-secondary-text mt-0.5">Cascading rule precedence</div>
                        </div>

                        <div>
                          <div className="atlas-card-title">Audit history</div>
                          <div className="atlas-secondary-text mt-0.5">Cryptographic ledger of policy changes</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* 8. User Preferences */}
          <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
            <button
              onClick={() => toggleSection('userPref')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="atlas-section-heading">
                  User Preferences
                </span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'userPref' ? 'rotate-90 text-cyan-400' : ''}`} />
            </button>

            {expandedSection === 'userPref' && (
              <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
                <div className="atlas-body-text">
                  Operator console layout density, terminal fonts, and audible breach warning settings.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-sans">
                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Console Display Density
                    </label>
                    <select
                      value={userPreferences.themeDensity}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, themeDensity: e.target.value }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value="compact">Compact Mission Density</option>
                      <option value="comfortable">Comfortable SaaS Density</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Monospace Font Family
                    </label>
                    <select
                      value={userPreferences.fontFamily}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value="JetBrains Mono">JetBrains Mono</option>
                      <option value="Fira Code">Fira Code</option>
                      <option value="Roboto Mono">Roboto Mono</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="atlas-card-title text-white">Audible Breach Notification Chime</div>
                      <div className="atlas-secondary-text">Play acoustic alert tone when high or critical breach signals trigger</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={userPreferences.chimeAlerts}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, chimeAlerts: e.target.checked }))}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                    <label className="block atlas-card-title">
                      Default Startup View
                    </label>
                    <select
                      value={userPreferences.defaultLanding}
                      onChange={(e) => setUserPreferences(prev => ({ ...prev, defaultLanding: e.target.value }))}
                      className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans"
                    >
                      <option value="systems">Security Posture → Systems</option>
                      <option value="dashboard">Mission Dashboard</option>
                      <option value="compliance">Compliance Overview</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Action Footer Bar (Exact font match to left nav) */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          
          {/* Left Buttons: Test Connections, Export Config, Reload */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            {/* Test Connections Button (Green outline) */}
            <button
              type="button"
              onClick={handleTestConnections}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-emerald-500/60 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40 atlas-button-label transition-all cursor-pointer shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Test Connections</span>
            </button>

            {/* Export Config Button (Yellow outline) */}
            <button
              type="button"
              onClick={handleExportConfig}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-amber-500/60 text-amber-400 bg-amber-950/20 hover:bg-amber-900/40 atlas-button-label transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Export Config</span>
            </button>

            {/* Reload Button (Blue outline) */}
            <button
              type="button"
              onClick={handleReload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-blue-500/60 text-blue-400 bg-blue-950/20 hover:bg-blue-900/40 atlas-button-label transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Reload</span>
            </button>
          </div>

          {/* Right Buttons: Cancel (Red), Save Configuration (Yellow) */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Cancel Button (Red Solid) */}
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-1.5 rounded-lg bg-[#E53935] hover:bg-[#D32F2F] text-white atlas-button-label transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>

            {/* Save Configuration Button (Yellow Solid) */}
            <button
              type="button"
              onClick={handleSaveConfiguration}
              className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-[#FFB300] hover:bg-[#FFA000] text-slate-950 atlas-button-label transition-colors cursor-pointer shadow-[0_0_12px_rgba(255,179,0,0.3)]"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.4]" />
              <span>Save Configuration</span>
            </button>
          </div>

        </div>

      </div>

      {/* Training Guide Modal */}
      {isTrainingGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0D121D] border border-amber-500/50 rounded-xl shadow-2xl p-6 text-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base font-sans">
                  ATLAS System Administration Training Guide
                </h3>
              </div>
              <button
                onClick={() => setIsTrainingGuideOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                The System Administration console provides the master configuration layer for the ATLAS cybersecurity platform:
              </p>

              <div className="space-y-2 font-sans text-xs bg-slate-900/80 p-3.5 rounded border border-slate-800">
                <div><span className="text-cyan-300 font-bold">1. Platform Features:</span> Activate or disable core mission capabilities without redeploying daemons.</div>
                <div><span className="text-cyan-300 font-bold">2. Tab Access:</span> Govern visibility and interaction permissions per operator role across navigation modules.</div>
                <div><span className="text-cyan-300 font-bold">3. Members & Roles:</span> Assign platform-wide roles (<span className="text-white">Viewer, Analyst, Admin, SuperAdmin</span>).</div>
                <div><span className="text-cyan-300 font-bold">4. Feature Flags:</span> Enable preview features like autonomous remediation and Gemini reasoning.</div>
                <div><span className="text-cyan-300 font-bold">5. ATLAS Systems:</span> Review daemon clusters, discovery subnets, and cryptographic HSM partition status.</div>
                <div><span className="text-cyan-300 font-bold">6. System Preferences:</span> Set operational thresholds, retention windows, and incident webhooks.</div>
                <div><span className="text-cyan-300 font-bold">7. Autonomy & Approvals:</span> Configure ATLAS execution authority across Observe, Recommend, Approval required, and Autonomous modes.</div>
                <div><span className="text-cyan-300 font-bold">8. User Preferences:</span> Customize theme density, alert tones, and monospace font families.</div>
              </div>

              <p className="text-[11px] text-slate-400">
                To test system connectivity before applying changes, use the <span className="text-emerald-400">Test Connections</span> tool in the bottom action bar.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsTrainingGuideOpen(false)}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#0D121D] border border-cyan-500/40 rounded-xl shadow-2xl p-6 text-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Invite Platform Operator</span>
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#080D18] border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. a.morgan@vanguard.sec"
                  className="w-full bg-[#080D18] border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Platform Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as PlatformRole)}
                  className="w-full bg-[#080D18] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
                >
                  <option value="Viewer">Viewer (Read-only)</option>
                  <option value="Analyst">Analyst (Practitioner)</option>
                  <option value="Admin">Admin (Lead SecOps)</option>
                  <option value="SuperAdmin">SuperAdmin (Platform Engineer)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
