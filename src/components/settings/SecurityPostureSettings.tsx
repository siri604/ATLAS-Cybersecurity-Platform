import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  Radio, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Save, 
  X
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SettingsTabsHeader } from './SettingsTabsHeader';

export const SecurityPostureSettings: React.FC = () => {
  const { role, addToast, setActiveNav } = usePlatform();

  // Accordion collapsed by default per request
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  // State configurations
  const [secConfig, setSecConfig] = useState({
    severityThreshold: 'high',
    quarantinePolicy: 'prompt',
    slackAlerts: true,
    complianceDriftCheck: true,
    pollingInterval: '30s'
  });

  const [zeroTrustConfig, setZeroTrustConfig] = useState({
    strictMtls: true,
    hardwareTpm: true,
    tokenLifetime: '1h',
    lateralInterception: 'enforce'
  });

  const [onboardingConfig, setOnboardingConfig] = useState({
    defaultBaseline: 'cis-level-2',
    isolateUntilVerified: true,
    handshakeTimeout: '30s',
    enrollmentKeyExpiry: '90d'
  });

  const [networkConfig, setNetworkConfig] = useState({
    scanCadence: 'daily',
    ebpfDepth: 'deep',
    portKnocking: true,
    egressInspection: true
  });

  // Action Bar Handlers
  const handleTestConnections = () => {
    addToast('Testing Security Posture probe connections...', 'info');
    setTimeout(() => {
      addToast('All Security Posture probes responding with nominal latency (18ms).', 'success');
    }, 700);
  };

  const handleExportConfig = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      module: 'Security Posture',
      secConfig,
      zeroTrustConfig,
      onboardingConfig,
      networkConfig
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-security-posture-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Security Posture configuration exported successfully.', 'success');
  };

  const handleReload = () => {
    setSecConfig({
      severityThreshold: 'high',
      quarantinePolicy: 'prompt',
      slackAlerts: true,
      complianceDriftCheck: true,
      pollingInterval: '30s'
    });
    setZeroTrustConfig({
      strictMtls: true,
      hardwareTpm: true,
      tokenLifetime: '1h',
      lateralInterception: 'enforce'
    });
    setOnboardingConfig({
      defaultBaseline: 'cis-level-2',
      isolateUntilVerified: true,
      handshakeTimeout: '30s',
      enrollmentKeyExpiry: '90d'
    });
    setNetworkConfig({
      scanCadence: 'daily',
      ebpfDepth: 'deep',
      portKnocking: true,
      egressInspection: true
    });
    addToast('Security Posture settings reloaded to active operational state.', 'info');
  };

  const handleCancel = () => {
    addToast('Changes discarded. Returning to Systems view.', 'info');
    setActiveNav('systems');
  };

  const handleSaveConfiguration = () => {
    addToast('Security Posture configuration saved successfully.', 'success');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="atlas-page-title text-base sm:text-lg font-semibold text-[#FFC837]">
                Security Posture
              </h1>
            </div>
            <p className="atlas-page-desc">
              Platform Settings & Security Posture Configuration
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

      {/* Top Category Tabs (Security Posture selected and highlighted) */}
      <SettingsTabsHeader currentTab="sec-posture" hideBreadcrumb={true} />

      {/* Accordion Settings Rows (Collapsed by default, expand only on click) */}
      <div className="space-y-2 pt-1 font-sans">

        {/* 1. Security Configuration */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => toggleSection('sec-config')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="atlas-section-heading">
                Security Configuration
              </span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'sec-config' ? 'rotate-90 text-cyan-400' : ''}`} />
          </button>

          {expandedSection === 'sec-config' && (
            <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
              <div className="atlas-body-text">
                Minimum severity escalation boundaries, automated containment policies, and incident response triggers.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Minimum Severity for Automatic Escalation
                  </label>
                  <select
                    value={secConfig.severityThreshold}
                    onChange={(e) => setSecConfig(prev => ({ ...prev, severityThreshold: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="critical">Critical Only</option>
                    <option value="high">High and Critical (Recommended)</option>
                    <option value="medium">Medium, High, and Critical</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Zero Trust Isolation Trigger
                  </label>
                  <select
                    value={secConfig.quarantinePolicy}
                    onChange={(e) => setSecConfig(prev => ({ ...prev, quarantinePolicy: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="prompt">Prompt for Admin Approval</option>
                    <option value="isolated">Immediate Micro-segmentation Isolation</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Real-Time Incident Dispatch Webhook</div>
                    <div className="atlas-secondary-text mt-0.5">Send high-priority telemetry to configured SOC endpoints</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={secConfig.slackAlerts}
                    onChange={(e) => setSecConfig(prev => ({ ...prev, slackAlerts: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Compliance Drift Sentinel</div>
                    <div className="atlas-secondary-text mt-0.5">Enforce continuous CIS audit verification loop</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={secConfig.complianceDriftCheck}
                    onChange={(e) => setSecConfig(prev => ({ ...prev, complianceDriftCheck: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Zero Trust */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => toggleSection('zero-trust')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="atlas-section-heading">
                Zero Trust
              </span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'zero-trust' ? 'rotate-90 text-cyan-400' : ''}`} />
          </button>

          {expandedSection === 'zero-trust' && (
            <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
              <div className="atlas-body-text">
                Micro-segmentation boundaries, mutual TLS authentication policies, and hardware root-of-trust enforcement.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Strict Mutual TLS (mTLS) Mesh Enforcement</div>
                    <div className="atlas-secondary-text mt-0.5">Require cryptographically signed client certs for inter-pod routing</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={zeroTrustConfig.strictMtls}
                    onChange={(e) => setZeroTrustConfig(prev => ({ ...prev, strictMtls: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Hardware TPM 2.0 Identity Attestation</div>
                    <div className="atlas-secondary-text mt-0.5">Validate hardware-backed endorsement keys on registered enclaves</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={zeroTrustConfig.hardwareTpm}
                    onChange={(e) => setZeroTrustConfig(prev => ({ ...prev, hardwareTpm: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Ephemeral Session Token Max Lifetime
                  </label>
                  <select
                    value={zeroTrustConfig.tokenLifetime}
                    onChange={(e) => setZeroTrustConfig(prev => ({ ...prev, tokenLifetime: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="15m">15 Minutes (High Security)</option>
                    <option value="1h">1 Hour (Recommended)</option>
                    <option value="8h">8 Hours (Standard Operator)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Dynamic Lateral Movement Interception
                  </label>
                  <select
                    value={zeroTrustConfig.lateralInterception}
                    onChange={(e) => setZeroTrustConfig(prev => ({ ...prev, lateralInterception: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="enforce">Active Intercept & Drop</option>
                    <option value="audit">Shadow Audit Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Cybersecurity Onboarding */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => toggleSection('onboarding')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="atlas-section-heading">
                Cybersecurity Onboarding
              </span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'onboarding' ? 'rotate-90 text-cyan-400' : ''}`} />
          </button>

          {expandedSection === 'onboarding' && (
            <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
              <div className="atlas-body-text">
                Default security baselines, agent handshake timeouts, and quarantine gates for newly onboarded systems.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Default Hardening Baseline on Ingestion
                  </label>
                  <select
                    value={onboardingConfig.defaultBaseline}
                    onChange={(e) => setOnboardingConfig(prev => ({ ...prev, defaultBaseline: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="cis-level-2">CIS Benchmark Level 2 (Strict)</option>
                    <option value="soc2-high">SOC 2 High Assurance Baseline</option>
                    <option value="pci-core">PCI-DSS 4.0 Core Requirements</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Isolate Discovered Hosts Until Verified</div>
                    <div className="atlas-secondary-text mt-0.5">Gate newly joined machines until CIS baseline is checked</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={onboardingConfig.isolateUntilVerified}
                    onChange={(e) => setOnboardingConfig(prev => ({ ...prev, isolateUntilVerified: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Pre-flight SSH & Agent Handshake Timeout
                  </label>
                  <select
                    value={onboardingConfig.handshakeTimeout}
                    onChange={(e) => setOnboardingConfig(prev => ({ ...prev, handshakeTimeout: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="10s">10 Seconds (Fast Fail)</option>
                    <option value="30s">30 Seconds (Standard)</option>
                    <option value="60s">60 Seconds (High Latency WAN)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Agent Enrollment Token Expiry Cycle
                  </label>
                  <select
                    value={onboardingConfig.enrollmentKeyExpiry}
                    onChange={(e) => setOnboardingConfig(prev => ({ ...prev, enrollmentKeyExpiry: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days (Recommended)</option>
                    <option value="365d">365 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Network & Scanning */}
        <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => toggleSection('network')}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#0E192D] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="atlas-section-heading">
                Network & Scanning
              </span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedSection === 'network' ? 'rotate-90 text-cyan-400' : ''}`} />
          </button>

          {expandedSection === 'network' && (
            <div className="p-4 border-t border-slate-800/80 bg-[#070E1A] space-y-3.5 text-xs font-sans animate-in fade-in duration-150">
              <div className="atlas-body-text">
                Automated network probe schedules, eBPF packet inspection depth, and egress filtering rules.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    Vulnerability Scanning Cadence
                  </label>
                  <select
                    value={networkConfig.scanCadence}
                    onChange={(e) => setNetworkConfig(prev => ({ ...prev, scanCadence: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="continuous">Continuous Event-Driven Stream</option>
                    <option value="hourly">Hourly Differential Sweep</option>
                    <option value="daily">Daily at 02:00 UTC (Recommended)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 space-y-1.5">
                  <label className="block atlas-card-title">
                    eBPF Kernel Probe Telemetry Depth
                  </label>
                  <select
                    value={networkConfig.ebpfDepth}
                    onChange={(e) => setNetworkConfig(prev => ({ ...prev, ebpfDepth: e.target.value }))}
                    disabled={role === 'Viewer'}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded p-2 text-xs font-sans cursor-pointer"
                  >
                    <option value="standard">Standard Audit Filter (Low Overhead)</option>
                    <option value="deep">Deep Syscall & Socket Tracing</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Ingress Port Knocking & Stealth Guard</div>
                    <div className="atlas-secondary-text mt-0.5">Drop unauthenticated SYN packets prior to handshake</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={networkConfig.portKnocking}
                    onChange={(e) => setNetworkConfig(prev => ({ ...prev, portKnocking: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#0C1524] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="atlas-card-title text-white">Egress Anomaly Tunneling Inspection</div>
                    <div className="atlas-secondary-text mt-0.5">Inspect outbound DNS & HTTPS channels for C2 beaconing</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={networkConfig.egressInspection}
                    onChange={(e) => setNetworkConfig(prev => ({ ...prev, egressInspection: e.target.checked }))}
                    disabled={role === 'Viewer'}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
