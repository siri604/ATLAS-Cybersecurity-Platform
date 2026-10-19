import React from 'react';
import { 
  Lock, 
  Network, 
  Radio, 
  Activity, 
  UserX, 
  Code2, 
  AlertCircle, 
  Bot, 
  ChevronRight,
  ShieldAlert,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface GenericModuleViewProps {
  moduleId: 'human-threats' | 'zero-trust' | 'network-sec' | 'intrusion-det' | 'anomaly-det' | 'software-qai';
}

export const GenericModuleView: React.FC<GenericModuleViewProps> = ({ moduleId }) => {
  const { openAiAgentWithPrompt, findings, selectedSystemId, setSelectedFinding, setActiveNav } = usePlatform();

  const moduleConfig = {
    'human-threats': {
      title: 'Human & Agent Threats',
      icon: UserX,
      description: 'PAM session auditing, phishing attack telemetry, and agent behavioral boundaries.',
      aiQuestion: 'Why did this human threat alert trigger?',
      kpi1: { label: 'Quarantined Phishing', val: '2 Clicks' },
      kpi2: { label: 'PAM Sessions Audited', val: '14 Active' },
      intelligence: '2 elevated phishing payloads quarantined on Microsoft 365 tenant. No credential harvesting detected.'
    },
    'zero-trust': {
      title: 'Zero Trust',
      icon: Lock,
      description: 'Identity-first microsegmentation, continuous device attestation, and mTLS enforcement.',
      aiQuestion: 'Why was this user denied access?',
      kpi1: { label: 'mTLS Peer Handshakes', val: '100% Valid' },
      kpi2: { label: 'Device Trust Gaps', val: '1 Gap' },
      intelligence: 'Tenant policy CA-Corp-AllUsers allows web access without checking endpoint compliance status.'
    },
    'network-sec': {
      title: 'Network Security',
      icon: Network,
      description: 'Distributed security group baselines, packet filtering, and VPC peering ingress control.',
      aiQuestion: 'What caused this traffic spike?',
      kpi1: { label: 'Blocked Ingress Packets', val: '1,420 / hr' },
      kpi2: { label: 'Security Group Drift', val: '0 Rules' },
      intelligence: 'Port 22/tcp ingress on Customer Portal App Server restricted to authorized bastion subnet only.'
    },
    'intrusion-det': {
      title: 'Intrusion Detection',
      icon: Radio,
      description: 'Signature-based threat detection, Wazuh host daemon streaming, and rootkit probers.',
      aiQuestion: 'Explain this IDS signature match and root cause',
      kpi1: { label: 'Active Wazuh Daemons', val: '6 Nodes' },
      kpi2: { label: 'Dynamic DNS Probes', val: '1 Alert' },
      intelligence: 'Rule 100204 (Dynamic DNS in PCI zone) fired on Customer Portal App Server. Egress filter adjustment recommended.'
    },
    'anomaly-det': {
      title: 'Anomaly Detection',
      icon: Activity,
      description: 'Statistical baseline models, volumetric traffic deviations, and automated cluster scoring.',
      aiQuestion: 'Why is this behavior anomalous?',
      kpi1: { label: 'Total Deviations', val: '10' },
      kpi2: { label: 'Actionable Priority', val: '2 Recommended' },
      intelligence: '10 anomalies detected. ATLAS recommends investigating 2 (path traversal scan on Corporate Website).'
    },
    'software-qai': {
      title: 'Software QAi',
      icon: Code2,
      description: 'Software security quality assurance, DAST scanning, and API contract fuzz testing.',
      aiQuestion: 'Why did this test fail?',
      kpi1: { label: 'DAST Scans Run', val: '18 Passed' },
      kpi2: { label: 'Fuzz Contract Warnings', val: '1 Warning' },
      intelligence: 'Logistics Partner Gateway EDI webhook contract returned 1 schema mismatch during staging fuzzing.'
    }
  }[moduleId];

  const Icon = moduleConfig.icon;
  const relatedFindings = findings.filter(f => {
    const matchesSys = !selectedSystemId || f.affectedSystemId === selectedSystemId;
    return matchesSys;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight font-sans">
              {moduleConfig.title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {moduleConfig.description}
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={() => openAiAgentWithPrompt(moduleConfig.aiQuestion)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 text-cyan-300 text-xs font-medium transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>&quot;{moduleConfig.aiQuestion}&quot;</span>
          </button>
        </div>
      </div>

      {/* Intelligence-First Summary Box (Section 20) */}
      <div className="p-4 rounded-lg bg-[#0E1420] border border-cyan-500/30 flex items-start gap-3 text-xs">
        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-white">ATLAS Intelligence Recommendation</div>
          <div className="text-slate-300 mt-0.5 leading-relaxed">
            {moduleConfig.intelligence}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-medium">{moduleConfig.kpi1.label}</div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            {moduleConfig.kpi1.val}
          </div>
        </div>

        <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-medium">{moduleConfig.kpi2.label}</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2 tabular-nums">
            {moduleConfig.kpi2.val}
          </div>
        </div>

        <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-medium">Model Calibration</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            Active
          </div>
        </div>

        <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 font-medium">Execution Scope</div>
          <div className="text-2xl font-bold font-mono text-slate-300 mt-2">
            6 Systems
          </div>
        </div>
      </div>

      {/* Relevant Findings for this Module */}
      <div className="bg-[#0E1420] border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
            Related Deviations & Findings
          </h2>
          <button
            onClick={() => setActiveNav('findings')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>View All Findings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {relatedFindings.slice(0, 3).map((f) => (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFinding(f);
                setActiveNav('findings');
              }}
              className="py-3 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-white">{f.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{f.affectedSystemName} · {f.controlRef}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 text-rose-400 bg-rose-950/30">
                  {f.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
