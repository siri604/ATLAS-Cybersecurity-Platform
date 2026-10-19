import {
  AtlasSystem,
  PlatformFinding,
  ComplianceAssessment,
  POAMItem,
  PlatformActivityLog,
  WorkflowExecution,
  AgentWorker,
  PlatformIntegration
} from '../types';

export const INITIAL_SYSTEMS: AtlasSystem[] = [
  {
    id: 'sys-payments-prod',
    name: 'Customer Portal App Server',
    category: 'Internal System',
    type: 'Linux Server',
    environment: 'Production',
    criticality: 'Critical',
    description: 'Core payment processing transaction gateway and tokenization cluster.',
    hostname: '10.20.1.15',
    port: 22,
    username: 'sec-admin',
    authMethod: 'SSH Key',
    accessLevel: 'Privileged',
    connectionStatus: 'Connected',
    monitoringStatus: 'Active',
    systemStatus: 'Ready',
    connectionSubtitle: 'Ubuntu 24.04 LTS · SSH · 10.20.1.15:22',
    lastHeartbeat: '3 mins ago',
    latencyMs: 14,
    uptimePercent: 99.98,
    osInfo: 'Ubuntu 24.04 LTS (Kernel 6.8.0-31-generic)',
    tags: ['pci-scope', 'tier-1', 'us-east-1'],
    capabilities: [
      { moduleId: 'compliance', name: 'Compliance', status: 'Needs attention', summary: '1 failed control, 2 missing identity evidence', findingsCount: 3, lastAssessed: 'Today 11:24' },
      { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Active', summary: 'mTLS & device posture enforced', findingsCount: 0, lastAssessed: 'Today 13:00' },
      { moduleId: 'network-sec', name: 'Network Security', status: 'Active', summary: 'Ingress filtered via security groups', findingsCount: 0, lastAssessed: 'Today 12:45' },
      { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Active', summary: 'Wazuh active agent v4.7.2', findingsCount: 1, lastAssessed: 'Today 13:10' },
      { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Active', summary: 'Baseline active (0 deviations)', findingsCount: 0, lastAssessed: 'Today 12:00' },
      { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Active', summary: 'PAM session audit active', findingsCount: 0, lastAssessed: 'Yesterday' },
      { moduleId: 'software-qai', name: 'Software QAi', status: 'Not configured', summary: 'Continuous integration webhook pending', findingsCount: 0 }
    ]
  },
  {
    id: 'sys-corp-web',
    name: 'Corporate Website',
    category: 'Web Application or Website',
    type: 'Web Application',
    environment: 'Production',
    criticality: 'Medium',
    description: 'Public marketing portal, customer documentation, and lead capture endpoints.',
    hostname: 'www.atlas-defense.internal',
    port: 443,
    username: 'svc-monitor',
    authMethod: 'SSH Key',
    accessLevel: 'Read-only',
    connectionStatus: 'Connected',
    monitoringStatus: 'Active',
    systemStatus: 'Ready',
    connectionSubtitle: 'HTTPS Scan · www.atlas-defense.internal',
    lastHeartbeat: '12 mins ago',
    latencyMs: 28,
    uptimePercent: 99.99,
    osInfo: 'Cloudflare Edge / Node.js 22 Runtime',
    tags: ['owasp-top10', 'dmz'],
    capabilities: [
      { moduleId: 'compliance', name: 'Compliance', status: 'Active', summary: 'OWASP ASVS L2 assessment passed', findingsCount: 0, lastAssessed: '2 days ago' },
      { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Not configured', summary: 'Public portal / No IAM required', findingsCount: 0 },
      { moduleId: 'network-sec', name: 'Network Security', status: 'Active', summary: 'WAF active with rate limiting', findingsCount: 0, lastAssessed: 'Today 12:00' },
      { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Active', summary: 'WAF blocked 140 probe attempts', findingsCount: 0, lastAssessed: 'Today 13:30' },
      { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Active', summary: 'Traffic model active', findingsCount: 0, lastAssessed: 'Today 12:15' },
      { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Not configured', summary: 'Not configured', findingsCount: 0 },
      { moduleId: 'software-qai', name: 'Software QAi', status: 'Active', summary: 'DAST scanner clean', findingsCount: 0, lastAssessed: '3 days ago' }
    ]
  },
  {
    id: 'sys-m365-tenant',
    name: 'Microsoft 365',
    category: 'Cloud or SaaS Service',
    type: 'Cloud or SaaS Service',
    environment: 'Production',
    criticality: 'Critical',
    description: 'Corporate productivity suite, Exchange online, and Teams collaboration tenant.',
    hostname: 'login.microsoftonline.com/e78f-gov',
    port: 443,
    username: 'atlas-cloud-app',
    authMethod: 'SSH Key',
    accessLevel: 'Read-only',
    connectionStatus: 'Connected',
    monitoringStatus: 'Active',
    systemStatus: 'Ready',
    connectionSubtitle: 'OAuth 2.0 API · Tenant e78f-gov',
    lastHeartbeat: '1 hour ago',
    latencyMs: 42,
    uptimePercent: 99.95,
    osInfo: 'Cloud SaaS API / Graph v1.0',
    tags: ['fedramp-moderate', 'soc2'],
    capabilities: [
      { moduleId: 'compliance', name: 'Compliance', status: 'Active', summary: 'SOC 2 Type II controls aligned', findingsCount: 0, lastAssessed: 'Yesterday' },
      { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Active', summary: 'Conditional access policy active', findingsCount: 0, lastAssessed: 'Today 09:30' },
      { moduleId: 'network-sec', name: 'Network Security', status: 'Not configured', summary: 'Cloud CASB policy required', findingsCount: 0 },
      { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Active', summary: 'Defender Graph signal ingested', findingsCount: 0, lastAssessed: 'Today 11:00' },
      { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Active', summary: 'Impossible travel model active', findingsCount: 0, lastAssessed: 'Today 13:00' },
      { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Active', summary: 'Phishing monitoring active', findingsCount: 0, lastAssessed: 'Today 10:15' },
      { moduleId: 'software-qai', name: 'Software QAi', status: 'Not configured', summary: 'Not applicable to SaaS tenant', findingsCount: 0 }
    ]
  },
  {
    id: 'sys-core-db',
    name: 'Core Database Primary',
    category: 'Internal System',
    type: 'Database',
    environment: 'Production',
    criticality: 'Critical',
    description: 'PostgreSQL 16 Primary high-availability cluster holding transactional accounts.',
    hostname: '10.20.4.8',
    port: 5432,
    username: 'db-sec-audit',
    authMethod: 'SSH Key',
    accessLevel: 'Privileged',
    connectionStatus: 'Connected',
    monitoringStatus: 'Active',
    systemStatus: 'Needs Attention',
    connectionSubtitle: 'TLS Mutual Auth · 10.20.4.8:5432',
    lastHeartbeat: '4 mins ago',
    latencyMs: 8,
    uptimePercent: 99.999,
    osInfo: 'Red Hat Enterprise Linux 9.3',
    tags: ['pci-dss', 'strict-iso', 'encrypted-nvme'],
    capabilities: [
      { moduleId: 'compliance', name: 'Compliance', status: 'Active', summary: 'PCI-DSS v4.0 baseline passing', findingsCount: 0, lastAssessed: 'Yesterday' },
      { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Active', summary: 'Private wireguard mesh access only', findingsCount: 0, lastAssessed: 'Today 08:00' },
      { moduleId: 'network-sec', name: 'Network Security', status: 'Active', summary: 'Zero inbound internet routing', findingsCount: 0, lastAssessed: 'Today 10:00' },
      { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Active', summary: 'Auditd daemon streaming', findingsCount: 0, lastAssessed: 'Today 13:20' },
      { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Active', summary: 'Query execution model normal', findingsCount: 0, lastAssessed: 'Today 11:30' },
      { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Active', summary: 'DBA access dual-key enforced', findingsCount: 0, lastAssessed: 'Today 09:00' },
      { moduleId: 'software-qai', name: 'Software QAi', status: 'Not configured', summary: 'Schema linter pending', findingsCount: 0 }
    ]
  },
  {
    id: 'sys-logistics-gw',
    name: 'Logistics Partner Gateway',
    category: 'Partner or Supply Chain',
    type: 'Partner Environment',
    environment: 'Staging',
    criticality: 'High',
    description: 'B2B EDI interchange and logistics dispatch partner webhooks.',
    hostname: '172.16.88.2',
    port: 443,
    username: 'b2b-gateway',
    authMethod: 'SSH Key',
    accessLevel: 'Read-only',
    connectionStatus: 'Connected',
    monitoringStatus: 'Paused',
    systemStatus: 'Paused',
    connectionSubtitle: 'IPsec Bastion · 172.16.88.2',
    lastHeartbeat: '2 days ago',
    latencyMs: 58,
    uptimePercent: 99.82,
    osInfo: 'Amazon Linux 2023 / Envoy Proxy',
    tags: ['third-party', 'supply-chain'],
    capabilities: [
      { moduleId: 'compliance', name: 'Compliance', status: 'Needs attention', summary: 'Monitoring paused - review bastion tunnel', findingsCount: 1, lastAssessed: '2 days ago' },
      { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Active', summary: 'Mutual TLS client certificates required', findingsCount: 0, lastAssessed: 'Today 09:00' },
      { moduleId: 'network-sec', name: 'Network Security', status: 'Active', summary: 'IP whitelist enforced', findingsCount: 0, lastAssessed: 'Today 10:00' },
      { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Needs attention', summary: 'Signature engine paused', findingsCount: 0, lastAssessed: 'Today 12:00' },
      { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Active', summary: 'Payload validation active', findingsCount: 0, lastAssessed: 'Today 13:00' },
      { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Not configured', summary: 'Not applicable', findingsCount: 0 },
      { moduleId: 'software-qai', name: 'Software QAi', status: 'Not configured', summary: 'API contract fuzz test warning', findingsCount: 0 }
    ]
  }
];

export const INITIAL_FINDINGS: PlatformFinding[] = [
  {
    id: 'fnd-ssh-root-01',
    title: 'SSH direct root login enabled',
    severity: 'High',
    affectedSystemId: 'sys-payments-prod',
    affectedSystemName: 'Customer Portal App Server',
    sourceModule: 'Compliance',
    controlRef: 'CIS 5.2.10',
    whatFailed: 'sshd_config directive PermitRootLogin is set to "yes" instead of "no". Direct root login over SSH is permitted on port 22.',
    whyItMatters: 'Allowing direct root login bypasses non-repudiation audit trails, grants immediate unconstrained privileges to compromised credentials, and increases brute-force vulnerability on core payment infrastructure.',
    evidence: [
      {
        id: 'ev-ssh-01',
        source: 'Wazuh SCA / Host Configuration Probe',
        freshness: '14 minutes ago',
        timestamp: '2026-10-05T13:25:00Z',
        hash: 'sha256:8f9b2c3a10e42719d3f54817a0211a7c',
        rawSample: 'grep "^PermitRootLogin" /etc/ssh/sshd_config\nPermitRootLogin yes\n[Exit Code 0]',
        status: 'Ready'
      }
    ],
    recommendation: 'Update /etc/ssh/sshd_config to set "PermitRootLogin no" and restart sshd daemon. Enforce administrative privilege elevation through sudo with MFA.',
    actionState: 'Open',
    approvalState: 'Recommended',
    verificationState: 'Unverified',
    detectedAt: '2026-10-05T11:24:12Z',
    activityHistory: [
      {
        timestamp: '2026-10-05T11:24:12Z',
        actor: 'ATLAS CIS Benchmark Engine',
        action: 'Finding identified during scheduled host configuration audit.'
      }
    ],
    remediationPayload: {
      type: 'targeted_config_fix',
      description: 'Disable direct SSH root login in sshd_config and reload sshd service cleanly.',
      command: "sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && systemctl reload sshd",
      rollbackCommand: "sed -i 's/^PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && systemctl reload sshd",
      beforeState: 'PermitRootLogin yes',
      afterState: 'PermitRootLogin no'
    }
  },
  {
    id: 'fnd-zt-m365-02',
    title: 'Conditional Access missing device compliance requirement',
    severity: 'Medium',
    affectedSystemId: 'sys-m365-tenant',
    affectedSystemName: 'Microsoft 365',
    sourceModule: 'Zero Trust',
    controlRef: 'ZT-ID-4.2',
    whatFailed: 'Tenant policy "CA-Corp-AllUsers" allows web access without checking endpoint compliance status from Intune/CrowdStrike.',
    whyItMatters: 'Unmanaged personal devices could sync corporate email and documents without meeting minimum disk encryption or patch level standards.',
    evidence: [],
    recommendation: 'Update Conditional Access policy to include "Require device to be marked as compliant" grant control.',
    actionState: 'Open',
    approvalState: 'Recommended',
    verificationState: 'Unverified',
    detectedAt: '2026-10-05T09:30:00Z',
    activityHistory: [
      {
        timestamp: '2026-10-05T09:30:00Z',
        actor: 'Zero Trust Posture Evaluator',
        action: 'Evaluated tenant policy matrix against Zero Trust Architecture baseline.'
      }
    ]
  },
  {
    id: 'fnd-anomaly-web-03',
    title: 'High-frequency 404 path traversal reconnaissance',
    severity: 'Medium',
    affectedSystemId: 'sys-corp-web',
    affectedSystemName: 'Corporate Website',
    sourceModule: 'Anomaly Detection',
    controlRef: 'ANOM-HTTP-8',
    whatFailed: 'IP range 198.51.100.0/24 executed 340 requests in 90 seconds targeting deprecated /admin.php and /.env URIs.',
    whyItMatters: 'Systematic reconnaissance indicates automated vulnerability mapping prior to targeted exploit payloads.',
    evidence: [
      {
        id: 'ev-anom-03',
        source: 'Edge Access Log Ingest',
        freshness: '45 minutes ago',
        timestamp: '2026-10-05T12:15:00Z',
        hash: 'sha256:39bf200d72',
        rawSample: 'GET /.env 404 | GET /wp-login.php 404 | GET /v1/backup.tar.gz 404 (Count: 340)',
        status: 'Ready'
      }
    ],
    recommendation: 'Apply temporary automated IP block at Cloudflare WAF edge for 24 hours.',
    actionState: 'Open',
    approvalState: 'Recommended',
    verificationState: 'Unverified',
    detectedAt: '2026-10-05T12:15:00Z',
    activityHistory: [
      {
        timestamp: '2026-10-05T12:15:00Z',
        actor: 'Anomaly Detection Engine',
        action: 'Threshold deviation detected: 28x baseline error rate.'
      }
    ]
  },
  {
    id: 'fnd-ids-pay-04',
    title: 'Unusual outbound DNS query to dynamic DNS provider',
    severity: 'Low',
    affectedSystemId: 'sys-payments-prod',
    affectedSystemName: 'Customer Portal App Server',
    sourceModule: 'Intrusion Detection',
    controlRef: 'IDS-SIG-201',
    whatFailed: 'Host resolved duckdns.org subdomain from payment transaction pod worker.',
    whyItMatters: 'Payment processing containers should only communicate with authorized payment network gateways.',
    evidence: [
      {
        id: 'ev-ids-04',
        source: 'Wazuh Active Response & Syslog',
        freshness: '28 minutes ago',
        timestamp: '2026-10-05T13:10:00Z',
        hash: 'sha256:e419b48c1f',
        rawSample: 'DNS Query: pay-node-04 -> edge-resolve.duckdns.org (A record)',
        status: 'Ready'
      }
    ],
    recommendation: 'Restrict DNS resolver egress in security group to internal AWS Route53 VPC resolver only.',
    actionState: 'Open',
    approvalState: 'Recommended',
    verificationState: 'Unverified',
    detectedAt: '2026-10-05T13:10:00Z',
    activityHistory: [
      {
        timestamp: '2026-10-05T13:10:00Z',
        actor: 'Wazuh Intrusion Engine',
        action: 'Rule 100204 (Dynamic DNS in PCI zone) fired.'
      }
    ]
  }
];

export const INITIAL_COMPLIANCE_ASSESSMENTS: ComplianceAssessment[] = [
  {
    id: 'asm-cis-payments-01',
    name: 'CIS Ubuntu Linux 24.04 LTS Benchmark v1.0',
    status: 'Completed',
    systemId: 'sys-payments-prod',
    systemName: 'Customer Portal App Server',
    frameworkId: 'cis-linux-v1',
    frameworkName: 'CIS Linux Benchmark',
    score: 74,
    controlsAssessed: 27,
    passedCount: 20,
    failedCount: 3,
    missingEvidenceCount: 3,
    needsReviewCount: 1,
    startedAt: '2026-10-05T11:20:00Z',
    completedAt: '2026-10-05T11:24:12Z',
    evidenceSummary: {
      systemConnection: 'Ready',
      hostConfig: 'Ready',
      wazuhSca: 'Ready',
      identityEvidence: 'Missing',
      manualEvidenceControls: 3
    },
    activity: [
      { timestamp: '11:20:00', event: 'Assessment Initialized', details: 'Triggered by scheduled policy on Customer Portal App Server' },
      { timestamp: '11:21:05', event: 'SSH Connection Verified', details: 'sec-admin key authentication valid (latency: 14ms)' },
      { timestamp: '11:22:18', event: 'Host Configuration Harvested', details: 'Parsed /etc/ssh/sshd_config, /etc/fstab, sysctl parameters' },
      { timestamp: '11:23:40', event: 'Evidence Check Notice', details: 'Identity Provider connector (Okta) missing; 3 identity controls flagged' },
      { timestamp: '11:24:12', event: 'Assessment Finalized', details: '20 Passed, 3 Failed, 3 Missing Evidence, 1 Needs Review' }
    ],
    controls: [
      { id: 'CIS 5.2.10', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure SSH PermitRootLogin is disabled', description: 'PermitRootLogin directive check.', severity: 'High', result: 'Failed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Direct root login permitted', findingId: 'fnd-ssh-root-01' },
      { id: 'CIS 5.2.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure permissions on /etc/ssh/sshd_config', description: 'Permissions check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Owner-only read/write permissions' },
      { id: 'CIS 5.2.4', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure SSH Protocol is set to 2', description: 'Protocol check.', severity: 'Critical', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Protocol 2 enforced' },
      { id: 'CIS 5.2.14', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure SSH MaxAuthTries', description: 'MaxAuthTries check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Maximum authentication attempts set' },
      { id: 'CIS 3.2.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure IP forwarding is disabled', description: 'IP forwarding check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'IP forwarding disabled' },
      { id: 'CIS 1.1.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure /tmp is mounted with noexec', description: '/tmp partition check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Partition mounted with noexec' },
      { id: 'CIS 5.3.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure sudo is installed', description: 'sudo check.', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Sudo package installed' },
      { id: 'CIS 4.1.1.3', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure auditing for processes enabled', description: 'auditd check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Auditing enabled' },
      { id: 'CIS 5.1.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure cron daemon enabled', description: 'cron check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Cron daemon active' },
      { id: 'CIS 5.4.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Account lockout check', description: 'PAM check.', severity: 'Medium', result: 'Missing Evidence', evidenceStatus: 'Missing', evidenceSource: 'Wazuh', rationale: 'PAM locking misconfigured' },
      { id: 'CIS 5.4.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Hardware MFA check', description: 'FIDO2 check.', severity: 'High', result: 'Missing Evidence', evidenceStatus: 'Missing', evidenceSource: 'Wazuh', rationale: 'MFA token not detected' },
      { id: 'CIS 1.2.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Ensure GPG keys for packages', description: 'GPG check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'GPG keys configured' },
      { id: 'CIS 6.1.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Filesystem integrity', description: 'Integrity check.', severity: 'Medium', result: 'Failed', evidenceStatus: 'Ready', evidenceSource: 'Wazuh', rationale: 'Unauthorized filesystem changes' },
      { id: 'CIS 6.1.3', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'System audit logs', description: 'Log check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Wazuh', rationale: 'Audit logs streaming' },
      { id: 'CIS 6.2.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Password aging', description: 'Aging check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Password aging policies set' },
      { id: 'CIS 6.2.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Password complexity', description: 'Complexity check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Password complexity enforced' },
      { id: 'CIS 6.2.3', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Account lock policy', description: 'Lock check.', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Account lock policy active' },
      { id: 'CIS 7.1.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Secure boot', description: 'Boot check.', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Secure boot enabled' },
      { id: 'CIS 7.1.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Boot loader password', description: 'Boot check.', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Boot loader password set' },
      { id: 'CIS 7.1.3', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Kernel modules', description: 'Kernel check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Kernel module signing enabled' },
      { id: 'CIS 8.1.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'User home directory', description: 'Dir check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Home directory permissions correct' },
      { id: 'CIS 8.1.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'User dotfiles', description: 'File check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Dotfile permissions secure' },
      { id: 'CIS 8.1.3', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'User .netrc', description: 'File check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Dotfile not found/secure' },
      { id: 'CIS 8.1.4', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'User .forward', description: 'File check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Dotfile not found/secure' },
      { id: 'CIS 8.1.5', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'User .rhosts', description: 'File check.', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'OpenSCAP', rationale: 'Dotfile not found/secure' },
      { id: 'CIS 9.2.1', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Needs Review - Access', description: 'Review required.', severity: 'Medium', result: 'Not Assessed', evidenceStatus: 'Missing', evidenceSource: 'Wazuh', rationale: 'Needs Review' },
      { id: 'CIS 9.2.2', frameworkId: 'cis-linux-v1', frameworkName: 'CIS Linux Benchmark', title: 'Failed - Unauthorised', description: 'Unauthorized.', severity: 'High', result: 'Failed', evidenceStatus: 'Ready', evidenceSource: 'Wazuh', rationale: 'Unauthorized system access' }
    ]
  },
  {
    id: 'asm-soc2-m365-02',
    name: 'SOC 2 Type II Security & Confidentiality Audit',
    systemId: 'sys-m365-tenant',
    systemName: 'Microsoft 365',
    frameworkId: 'soc2-v2',
    frameworkName: 'SOC 2 Type II',
    status: 'Completed',
    score: 91,
    controlsAssessed: 18,
    passedCount: 17,
    failedCount: 1,
    missingEvidenceCount: 0,
    startedAt: '2026-10-04T08:00:00Z',
    completedAt: '2026-10-04T08:14:00Z',
    evidenceSummary: {
      systemConnection: 'Ready',
      hostConfig: 'Ready',
      wazuhSca: 'Ready',
      identityEvidence: 'Ready',
      manualEvidenceControls: 0
    },
    activity: [
      { timestamp: '08:00:00', event: 'Assessment Initialized', details: 'Microsoft Graph connector sync initiated' },
      { timestamp: '08:14:00', event: 'Completed', details: '17 Passed, 1 Failed (Conditional Access device rule)' }
    ],
    controls: [
      { id: 'SOC2-CC6.1', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Access Control Policy', description: 'Logical access security requirements', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Tenant Config', rationale: 'Policy enforced.' },
      { id: 'SOC2-CC6.2', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Device Compliance Requirement', description: 'Conditional Access device trust check', severity: 'High', result: 'Failed', evidenceStatus: 'Ready', evidenceSource: 'M365 Conditional Access', rationale: 'CA policy allows web access without endpoint compliance.' },
      { id: 'SOC2-CC6.3', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'MFA Enforcement', description: 'Multi-factor authentication required for all users', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Auth Policy', rationale: 'MFA enabled.' },
      { id: 'SOC2-CC6.4', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Password Complexity', description: 'Strong password policies enforced', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Auth Policy', rationale: 'Password policy enforced.' },
      { id: 'SOC2-CC6.5', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Session Timeout', description: 'Automatic session timeout for inactive users', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Auth Policy', rationale: 'Timeout set.' },
      { id: 'SOC2-CC6.6', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Audit Logging', description: 'Comprehensive audit logs for all actions', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Audit Log', rationale: 'Logging enabled.' },
      { id: 'SOC2-CC6.7', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Encryption at Rest', description: 'Data at rest is encrypted', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Storage', rationale: 'Encryption active.' },
      { id: 'SOC2-CC6.8', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Encryption in Transit', description: 'Data in transit is encrypted', severity: 'High', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'M365 Network', rationale: 'TLS enforced.' },
      { id: 'SOC2-CC6.9', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Vulnerability Management', description: 'Regular vulnerability scans', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Security Center', rationale: 'Scans running.' },
      { id: 'SOC2-CC6.10', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Incident Response', description: 'Incident response plan in place', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Policy Doc', rationale: 'Plan active.' },
      { id: 'SOC2-CC6.11', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Access Reviews', description: 'Regular access reviews performed', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Identity Service', rationale: 'Reviews done.' },
      { id: 'SOC2-CC6.12', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Disaster Recovery', description: 'Disaster recovery plan tested', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Policy Doc', rationale: 'Test successful.' },
      { id: 'SOC2-CC6.13', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Backup Management', description: 'Regular backups performed', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Backup Service', rationale: 'Backups current.' },
      { id: 'SOC2-CC6.14', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Logical Access', description: 'Logical access controls managed', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Identity Service', rationale: 'Access controls managed.' },
      { id: 'SOC2-CC6.15', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Personnel Security', description: 'Personnel security checks performed', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'HR System', rationale: 'Checks passed.' },
      { id: 'SOC2-CC6.16', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Change Management', description: 'Change management procedures followed', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Change Log', rationale: 'Procedures followed.' },
      { id: 'SOC2-CC6.17', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Data Retention', description: 'Data retention policies followed', severity: 'Low', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Policy Doc', rationale: 'Policy followed.' },
      { id: 'SOC2-CC6.18', frameworkId: 'soc2-v2', frameworkName: 'SOC 2 Type II', title: 'Monitoring', description: 'Continuous monitoring of security controls', severity: 'Medium', result: 'Passed', evidenceStatus: 'Ready', evidenceSource: 'Security Center', rationale: 'Monitoring active.' }
    ]
  }
];

export const INITIAL_POAM_ITEMS: POAMItem[] = [
  {
    id: 'poam-01',
    weakness: 'Direct root login permitted via SSH configuration',
    systemId: 'sys-payments-prod',
    systemName: 'Customer Portal App Server',
    controlId: 'CIS 5.2.10',
    risk: 'High',
    owner: 'Infrastructure Security Team',
    targetDate: '2026-10-12',
    milestone: 'Apply sshd_config fix',
    status: 'Open',
    createdFromFindingId: 'fnd-ssh-root-01'
  },
  {
    id: 'poam-02',
    weakness: 'Conditional Access device trust check missing in M365 tenant',
    systemId: 'sys-m365-tenant',
    systemName: 'Microsoft 365',
    controlId: 'ZT-ID-4.2',
    risk: 'Medium',
    owner: 'Cloud Identity Team',
    targetDate: '2026-10-20',
    milestone: 'Review Intune compliance gate',
    status: 'In Progress',
    createdFromFindingId: 'fnd-zt-m365-02'
  },
  {
    id: 'poam-03',
    weakness: 'Logistics Partner EDI ingress rate limiting threshold adjustment',
    systemId: 'sys-logistics-gw',
    systemName: 'Logistics Partner Gateway',
    controlId: 'ISO-27001-A.14',
    risk: 'High',
    owner: 'Partner Engineering',
    targetDate: '2026-10-02', // Overdue for demo Needs Attention test
    milestone: 'Implement rate limiter',
    status: 'Overdue'
  },
  {
    id: 'poam-04',
    weakness: 'Identity Provider evidence connector sync for PAM controls',
    systemId: 'sys-payments-prod',
    systemName: 'Customer Portal App Server',
    controlId: 'CIS 5.4.1',
    risk: 'Medium',
    owner: 'SecOps Team',
    targetDate: '2026-10-15',
    milestone: 'Connect Identity Provider API',
    status: 'In Progress'
  },
  {
    id: 'poam-05',
    weakness: 'Initial tenant environment hardening pending completion',
    systemId: 'sys-payments-prod',
    systemName: 'Customer Portal App Server',
    controlId: 'GEN-02',
    risk: 'Low',
    owner: 'Platform Team',
    targetDate: '2026-10-16',
    milestone: 'Validate initial tenant security baseline',
    status: 'Open'
  },
  {
    id: 'poam-06',
    weakness: 'High-frequency 404 path traversal reconnaissance',
    systemId: 'sys-corp-web',
    systemName: 'Corporate Website',
    controlId: 'ANOM-HTTP-8',
    risk: 'Medium',
    owner: 'Security Operations',
    targetDate: '2026-10-18',
    milestone: 'Implement IP block at WAF edge',
    status: 'Open',
    createdFromFindingId: 'fnd-anomaly-web-03'
  }
];

export const INITIAL_ACTIVITY_LOGS: PlatformActivityLog[] = [
  {
    id: 'act-01',
    timestamp: '2026-10-05T13:25:00Z',
    actor: 'admin@atlas.sec',
    role: 'Admin',
    module: 'Compliance',
    systemName: 'Customer Portal App Server',
    action: 'Evidence Refresh',
    details: 'Harvested fresh host configuration evidence hash sha256:8f9b2c3a.',
    status: 'Info'
  },
  {
    id: 'act-02',
    timestamp: '2026-10-05T12:15:00Z',
    actor: 'System Autonomous Engine',
    role: 'SuperAdmin',
    module: 'Anomaly Detection',
    systemName: 'Corporate Website',
    action: 'Alert Flagged',
    details: 'High-frequency 404 path traversal reconnaissance detected (340 requests in 90s).',
    status: 'Warning'
  },
  {
    id: 'act-03',
    timestamp: '2026-10-05T11:24:12Z',
    actor: 'analyst@atlas.sec',
    role: 'Analyst',
    module: 'Compliance',
    systemName: 'Customer Portal App Server',
    action: 'Assessment Completed',
    details: 'CIS Ubuntu Linux 24.04 Benchmark finished with 1 failed control, 2 missing evidence.',
    status: 'Info'
  },
  {
    id: 'act-04',
    timestamp: '2026-10-05T10:00:00Z',
    actor: 'admin@atlas.sec',
    role: 'Admin',
    module: 'Platform Operations',
    action: 'Integration Health Check',
    details: 'Wazuh Active Agent and AWS CloudTrail connectors verified healthy.',
    status: 'Success'
  }
];

export const INITIAL_WORKFLOW_EXECUTIONS: WorkflowExecution[] = [
  {
    id: 'wf-exec-901',
    name: 'Host Configuration Harvester',
    module: 'Compliance',
    systemName: 'Customer Portal App Server',
    trigger: 'Scheduled / Cron (every 4h)',
    status: 'Completed',
    startedAt: '13:20:10',
    durationMs: 1420,
    retries: 0,
    steps: [
      { name: 'SSH Auth Handshake', status: 'passed', durationMs: 140 },
      { name: 'Probe /etc/ssh/sshd_config', status: 'passed', durationMs: 380 },
      { name: 'Audit Sysctl Parameters', status: 'passed', durationMs: 410 },
      { name: 'Cryptographic Hash Signing', status: 'passed', durationMs: 490 }
    ],
    traceId: 'tr-0941a2'
  },
  {
    id: 'wf-exec-902',
    name: 'Wazuh SCA Scan Ingestion',
    module: 'Intrusion Detection',
    systemName: 'Customer Portal App Server',
    trigger: 'Event Stream Webhook',
    status: 'Completed',
    startedAt: '13:10:00',
    durationMs: 2150,
    retries: 0,
    steps: [
      { name: 'Validate Agent TLS Cert', status: 'passed', durationMs: 220 },
      { name: 'Parse SCA Check Matrix', status: 'passed', durationMs: 1100 },
      { name: 'Map to ATLAS Finding Schema', status: 'passed', durationMs: 830 }
    ],
    traceId: 'tr-88b19f'
  },
  {
    id: 'wf-exec-903',
    name: 'Identity Evidence Ingest (Okta Connector)',
    module: 'Compliance',
    systemName: 'All Systems',
    trigger: 'Scheduled (every 1h)',
    status: 'Failed',
    startedAt: '13:00:00',
    durationMs: 310,
    retries: 3,
    steps: [
      { name: 'Initialize OAuth Client', status: 'passed', durationMs: 110 },
      { name: 'Fetch SSO Directory Metadata', status: 'failed', durationMs: 200 }
    ],
    traceId: 'tr-71e84a'
  },
  {
    id: 'wf-exec-904',
    name: 'Targeted Remediation Sandbox Execution',
    module: 'Platform Operations',
    systemName: 'Customer Portal App Server',
    trigger: 'Analyst Submission #rem-01',
    status: 'Queued',
    startedAt: 'Waiting for Admin Approval',
    durationMs: 0,
    retries: 0,
    steps: [
      { name: 'Pre-flight Snapshot', status: 'pending', durationMs: 0 },
      { name: 'Apply sshd_config patch', status: 'pending', durationMs: 0 },
      { name: 'Service reload verification', status: 'pending', durationMs: 0 }
    ],
    traceId: 'tr-rem-preview'
  }
];

export const INITIAL_AGENT_WORKERS: AgentWorker[] = [
  {
    id: 'wrk-core-01',
    name: 'Atlas Worker Alpha (Host Prober)',
    role: 'SSH Telemetry & Config Harvester',
    node: 'node-us-east-1a',
    status: 'Healthy',
    activeJobs: 1,
    cpuPercent: 12.4,
    memoryPercent: 34.1,
    uptime: '14d 6h',
    lastHeartbeat: '5s ago'
  },
  {
    id: 'wrk-core-02',
    name: 'Atlas Worker Beta (SCAP Runner)',
    role: 'OVAL & CIS Baseline Assessor',
    node: 'node-us-east-1b',
    status: 'Healthy',
    activeJobs: 0,
    cpuPercent: 8.1,
    memoryPercent: 28.5,
    uptime: '14d 6h',
    lastHeartbeat: '3s ago'
  },
  {
    id: 'wrk-core-03',
    name: 'Atlas Worker Gamma (Network Collector)',
    role: 'Flow & Packet Inspection Ingest',
    node: 'node-us-west-2a',
    status: 'Healthy',
    activeJobs: 2,
    cpuPercent: 24.8,
    memoryPercent: 42.0,
    uptime: '9d 12h',
    lastHeartbeat: '8s ago'
  },
  {
    id: 'wrk-core-04',
    name: 'Atlas Worker Delta (IdP Sync Engine)',
    role: 'Identity Directory Telemetry',
    node: 'node-us-east-1a',
    status: 'Degraded',
    activeJobs: 0,
    cpuPercent: 2.1,
    memoryPercent: 19.3,
    uptime: '2d 1h',
    lastHeartbeat: '45s ago'
  }
];

export const INITIAL_INTEGRATIONS: PlatformIntegration[] = [
  {
    id: 'int-wazuh',
    name: 'Wazuh SCA & EDR Agent',
    category: 'Evidence Source',
    status: 'Connected',
    lastSync: '14 minutes ago',
    description: 'Collects host configuration assessments, security compliance checks, and file integrity hashes.',
    scope: 'Customer Portal App Server, Core Database Primary'
  },
  {
    id: 'int-identity',
    name: 'Okta / Entra ID Identity Provider',
    category: 'Identity Provider',
    status: 'Configuration Required',
    lastSync: 'Never',
    description: 'Ingests user directory status, MFA hardware token enforcement, and PAM session evidence.',
    scope: 'All Systems'
  },
  {
    id: 'int-aws-cloudtrail',
    name: 'AWS CloudTrail Ingestion',
    category: 'SIEM',
    status: 'Connected',
    lastSync: '2 minutes ago',
    description: 'Streams management events, IAM role assumptions, and security group modifications.',
    scope: 'Production VPCs'
  },
  {
    id: 'int-cloudflare',
    name: 'Cloudflare Edge WAF',
    category: 'EDR',
    status: 'Connected',
    lastSync: '1 minute ago',
    description: 'Real-time HTTP edge firewall logs and automated rate limiting rules.',
    scope: 'Corporate Website'
  }
];
