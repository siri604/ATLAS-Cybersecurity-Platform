// ATLAS Core Platform & Module Types
// Platform concepts are strictly module-neutral.

export type PlatformRole = 'Viewer' | 'Analyst' | 'Admin' | 'SuperAdmin';

export type AutonomyMode = 'Observe' | 'Recommend' | 'Approval required' | 'Autonomous';

export type SystemCategory = 
  | 'Internal System'
  | 'Web Application or Website'
  | 'Cloud or SaaS Service'
  | 'Partner or Supply Chain';

export type SystemType = 
  | 'Linux Server'
  | 'Windows Server'
  | 'Database'
  | 'Network Device'
  | 'API/Service'
  | 'SaaS Tenant'
  | 'Web Application'
  | 'Microsoft 365'
  | 'Cloud or SaaS Service'
  | 'Partner Environment';

export type SaasSystemType = 
  | 'Identity Provider'
  | 'Productivity Suite'
  | 'CRM'
  | 'Cloud Platform'
  | 'Security Platform'
  | 'Other SaaS';


export type Environment = 
  | 'Production'
  | 'Staging'
  | 'Development'
  | 'Test'
  | 'Disaster Recovery';

export type BusinessCriticality = 'Critical' | 'High' | 'Medium' | 'Low';

export type TechnicalAccessLevel = 'Read-only' | 'Privileged';

export type ConnectionStatus = 'Connected' | 'Degraded' | 'Unreachable' | 'Pending Verification';

export type CapabilityStatus = 'Not configured' | 'Active' | 'Needs attention';

export interface SystemCapability {
  moduleId: string;
  name: string;
  status: CapabilityStatus;
  summary: string;
  findingsCount?: number;
  lastAssessed?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  timestamp?: number;
}

export interface AtlasSystem {
  id: string;
  name: string;
  category: SystemCategory;
  type: SystemType;
  environment: Environment;
  criticality: BusinessCriticality;
  description?: string;
  hostname: string;
  port: number;
  username: string;
  authMethod: 'SSH Key' | 'Password';
  accessLevel: TechnicalAccessLevel;
  connectionStatus: ConnectionStatus;
  lastHeartbeat: string;
  latencyMs: number;
  uptimePercent: number;
  osInfo: string;
  connectionSubtitle?: string;
  monitoringStatus?: 'Active' | 'Paused' | 'Not configured';
  systemStatus?: 'Ready' | 'Needs Attention' | 'Paused';
  deploymentBoundary?: string;
  systemProfile?: string;
  capabilities: SystemCapability[];
  tags: string[];
}

export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ApprovalState = 
  | 'Open'
  | 'Recommended'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Executing'
  | 'Completed'
  | 'Verification Pending'
  | 'Verified';

export type VerificationState = 'Unverified' | 'Verification Pending' | 'Verified' | 'Verification Failed';

export interface FindingEvidence {
  id: string;
  source: string;
  freshness: string;
  timestamp: string;
  hash: string;
  rawSample: string;
  status: 'Ready' | 'Missing' | 'Stale';
}

export interface PlatformFinding {
  id: string;
  title: string;
  severity: FindingSeverity;
  affectedSystemId: string;
  affectedSystemName: string;
  sourceModule: string; // 'Compliance' | 'Zero Trust' | 'Network Security' | 'Intrusion Detection' | 'Anomaly Detection' | 'Human & Agent Threats' | 'Software QAi'
  controlRef?: string;
  whatFailed: string;
  whyItMatters: string;
  evidence: FindingEvidence[];
  recommendation: string;
  actionState: 'Open' | 'In Progress' | 'Remediated' | 'Suppressed';
  approvalState: ApprovalState;
  verificationState: VerificationState;
  detectedAt: string;
  activityHistory: {
    timestamp: string;
    actor: string;
    action: string;
    note?: string;
  }[];
  // Safe targeted remediation definition
  remediationPayload?: {
    type: 'targeted_config_fix';
    description: string;
    command: string;
    rollbackCommand: string;
    submittedBy?: string;
    approvedBy?: string;
    executedAt?: string;
    verifiedAt?: string;
    beforeState: string;
    afterState?: string;
  };
}

// Compliance Domain-Specific Types
export type ControlResult = 
  | 'Passed'
  | 'Failed'
  | 'Missing Evidence'
  | 'Not Assessed'
  | 'Not Applicable'
  | 'Needs Review';

export interface ComplianceControl {
  id: string;
  frameworkId: string;
  frameworkName: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  result: ControlResult;
  evidenceStatus: 'Ready' | 'Missing' | 'Manual Required';
  evidenceSource: string;
  rationale?: string;
  findingId?: string;
}

export type AssessmentStatus = 
  | 'Pending'
  | 'Running'
  | 'Completed'
  | 'Completed with Missing Evidence'
  | 'Failed';

export interface ComplianceAssessment {
  id: string;
  name: string;
  systemId: string;
  systemName: string;
  frameworkId: string;
  frameworkName: string;
  status: AssessmentStatus;
  score: number;
  controlsAssessed: number;
  passedCount: number;
  failedCount: number;
  missingEvidenceCount: number;
  needsReviewCount?: number;
  startedAt: string;
  completedAt?: string;
  controls: ComplianceControl[];
  evidenceSummary: {
    systemConnection: 'Ready' | 'Failed';
    hostConfig: 'Ready' | 'Missing';
    wazuhSca: 'Ready' | 'Missing';
    identityEvidence: 'Ready' | 'Missing';
    manualEvidenceControls: number;
  };
  activity: {
    timestamp: string;
    event: string;
    details: string;
  }[];
}

export type POAMStatus = 'Open' | 'In Progress' | 'Ready for Verification' | 'Closed' | 'Overdue';

export interface POAMItem {
  id: string;
  weakness: string;
  systemId: string;
  systemName: string;
  controlId: string;
  risk: FindingSeverity;
  owner: string;
  targetDate: string;
  milestone: string;
  status: POAMStatus;
  createdFromFindingId?: string;
}

export interface PlatformActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  role: PlatformRole;
  module: string;
  systemName?: string;
  action: string;
  details: string;
  status: 'Success' | 'Warning' | 'Error' | 'Info';
}

// Platform Operations (SuperAdmin)
export interface WorkflowExecution {
  id: string;
  name: string;
  module: string;
  systemName: string;
  trigger: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Queued' | 'Retrying';
  startedAt: string;
  durationMs: number;
  retries: number;
  steps: {
    name: string;
    status: 'passed' | 'failed' | 'running' | 'pending';
    durationMs: number;
  }[];
  traceId: string;
}

export interface AgentWorker {
  id: string;
  name: string;
  role: string;
  node: string;
  status: 'Healthy' | 'Degraded' | 'Offline';
  activeJobs: number;
  cpuPercent: number;
  memoryPercent: number;
  uptime: string;
  lastHeartbeat: string;
}

export interface PlatformIntegration {
  id: string;
  name: string;
  category: 'Evidence Source' | 'Identity Provider' | 'SIEM' | 'EDR' | 'Alerting';
  status: 'Connected' | 'Configuration Required' | 'Error';
  lastSync: string;
  description: string;
  scope: string;
}
