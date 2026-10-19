import React, { useState } from 'react';
import { 
  Terminal, 
  GitBranch, 
  ShieldCheck, 
  Package, 
  Check, 
  AlertTriangle,
  Play,
  RotateCw
} from 'lucide-react';
import { SettingsTabsHeader } from './SettingsTabsHeader';
import { usePlatform } from '../../context/PlatformContext';

export const ApplicationDevOpsSettings: React.FC = () => {
  const { role } = usePlatform();
  const [blockOnCriticalCVE, setBlockOnCriticalCVE] = useState<boolean>(true);
  const [requireDualApproval, setRequireDualApproval] = useState<boolean>(true);
  const [autoSbomGeneration, setAutoSbomGeneration] = useState<boolean>(true);

  const pipelines = [
    {
      id: 'pipe-payments',
      repo: 'vanguard-corp/payments-core-api',
      branch: 'main',
      scanner: 'Trivy + Semgrep',
      lastScan: '18m ago',
      findings: '0 Critical, 1 Low',
      status: 'Passing'
    },
    {
      id: 'pipe-portal',
      repo: 'vanguard-corp/customer-portal',
      branch: 'release/v4.2',
      scanner: 'CodeQL + Snyk',
      lastScan: '2h ago',
      findings: '0 Vulnerabilities',
      status: 'Passing'
    },
    {
      id: 'pipe-auth',
      repo: 'vanguard-corp/iam-federation-svc',
      branch: 'staging',
      scanner: 'Grype + Checkov',
      lastScan: '4h ago',
      findings: '1 Medium (Policy)',
      status: 'Warning'
    }
  ];

  return (
    <div className="space-y-6">
      <SettingsTabsHeader currentTab="app-devops" subTitle="CI/CD & Registries" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="atlas-page-title">
            Application & DevOps Security
          </h1>
          <p className="atlas-page-desc">
            Pipeline admission controllers, software bill of materials (SBOM), and container registry verification.
          </p>
        </div>
      </div>

      {/* CI/CD Repositories & Security Gateways */}
      <div className="bg-[#0A101C] border border-slate-800/90 rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 bg-[#080E18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="atlas-section-heading uppercase tracking-wider text-white">
              Monitored Code Repositories & Artifact Pipelines
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {pipelines.length} Active Pipelines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#060B14] text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                <th className="py-3 px-4">REPOSITORY</th>
                <th className="py-3 px-3">BRANCH</th>
                <th className="py-3 px-3">SECURITY SCANNERS</th>
                <th className="py-3 px-3">LAST ASSESSMENT</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {pipelines.map(p => (
                <tr key={p.id} className="hover:bg-[#0D1524] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white font-mono text-xs">{p.repo}</div>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-mono text-xs">
                    {p.branch}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-xs">
                    {p.scanner}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-xs">
                    {p.lastScan}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      p.status === 'Passing' 
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' 
                        : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                    }`}>
                      {p.status} ({p.findings})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      disabled={role === 'Viewer'}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono disabled:opacity-50"
                    >
                      Trigger Scan →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment Gating Policies */}
      <div className="bg-[#0A101C] border border-slate-800/90 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Deployment Admission Policies
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded bg-[#070D16] border border-slate-800">
            <div>
              <div className="font-medium text-slate-200">Block Deployments on Critical CVEs</div>
              <div className="text-[11px] text-slate-400">Prevent container admission if image contains unresolved CVSS 9.0+ vulnerabilities</div>
            </div>
            <input
              type="checkbox"
              checked={blockOnCriticalCVE}
              onChange={(e) => setBlockOnCriticalCVE(e.target.checked)}
              disabled={role === 'Viewer'}
              className="rounded bg-slate-900 border-slate-700 text-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#070D16] border border-slate-800">
            <div>
              <div className="font-medium text-slate-200">Enforce Dual-Party Production Approval</div>
              <div className="text-[11px] text-slate-400">Production cluster updates require cryptographic signature from SecOps Principal</div>
            </div>
            <input
              type="checkbox"
              checked={requireDualApproval}
              onChange={(e) => setRequireDualApproval(e.target.checked)}
              disabled={role === 'Viewer'}
              className="rounded bg-slate-900 border-slate-700 text-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#070D16] border border-slate-800">
            <div>
              <div className="font-medium text-slate-200">Automated CycloneDX SBOM Attestation</div>
              <div className="text-[11px] text-slate-400">Sign and attach verifiable bill of materials to image registry metadata</div>
            </div>
            <input
              type="checkbox"
              checked={autoSbomGeneration}
              onChange={(e) => setAutoSbomGeneration(e.target.checked)}
              disabled={role === 'Viewer'}
              className="rounded bg-slate-900 border-slate-700 text-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
