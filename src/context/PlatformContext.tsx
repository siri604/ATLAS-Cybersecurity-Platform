import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  PlatformRole,
  AutonomyMode,
  AtlasSystem,
  PlatformFinding,
  ComplianceAssessment,
  POAMItem,
  PlatformActivityLog,
  WorkflowExecution,
  AgentWorker,
  PlatformIntegration,
  POAMStatus,
  ToastMessage,
  ControlResult
} from '../types';
import {
  INITIAL_SYSTEMS,
  INITIAL_FINDINGS,
  INITIAL_COMPLIANCE_ASSESSMENTS,
  INITIAL_POAM_ITEMS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_WORKFLOW_EXECUTIONS,
  INITIAL_AGENT_WORKERS,
  INITIAL_INTEGRATIONS
} from '../data/mockData';

export interface Tenant {
  name: string;
  environment: string;
  admin: {
    name: string;
    email: string;
  };
}

interface PlatformContextType {
  role: PlatformRole;
  setRole: (role: PlatformRole) => void;
  autonomyMode: AutonomyMode;
  setAutonomyMode: (mode: AutonomyMode) => void;
  requestAutonomyChange: (mode: AutonomyMode) => void;
  confirmAutonomousMode: () => void;
  cancelAutonomousModeModal: () => void;
  showAutonomousModal: boolean;

  systems: AtlasSystem[];
  selectedSystemId: string | null; // null represents "All Systems"
  setSelectedSystemId: (id: string | null) => void;
  selectedSystem: AtlasSystem | null;

  activeNav: string;
  setActiveNav: (nav: string) => void;

  findings: PlatformFinding[];
  selectedFinding: PlatformFinding | null;
  setSelectedFinding: (finding: PlatformFinding | null) => void;

  complianceAssessments: ComplianceAssessment[];
  selectedAssessmentId: string | null;
  setSelectedAssessmentId: (id: string | null) => void;

  poamItems: POAMItem[];
  activityLogs: PlatformActivityLog[];
  workflowExecutions: WorkflowExecution[];
  agentWorkers: AgentWorker[];
  integrations: PlatformIntegration[];

  // Action methods
  addSystem: (system: AtlasSystem) => void;
  updateSystem: (system: AtlasSystem) => void;
  pauseSystem: (systemId: string) => void;
  resumeSystem: (systemId: string, targetStatus?: 'Ready' | 'Needs Attention') => void;
  toggleSystemMonitoring: (systemId: string) => void;
  testSystemConnection: (systemId: string) => Promise<{ success: boolean; latency: number; details: string }>;
  removeSystem: (systemId: string) => void;
  startAssessment: (systemId: string, frameworkId: string) => ComplianceAssessment | void;
  submitRemediation: (findingId: string) => void;
  approveRemediation: (findingId: string) => void;
  rejectRemediation: (findingId: string) => void;
  executeRemediationAndVerify: (findingId: string) => Promise<void>;
  addFindingToPOAM: (findingId: string) => void;
  createPOAMItem: (finding: PlatformFinding, owner: string, targetDate: string, milestone: string) => void;
  updatePOAMStatus: (poamId: string, status: POAMStatus) => void;
  updateControlResult: (assessmentId: string, controlId: string, result: ControlResult) => void;
  configureIntegration: (integrationId: string) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // AI Agent Drawer
  isAiAgentOpen: boolean;
  setIsAiAgentOpen: (open: boolean) => void;
  aiSuggestedPrompt: string | null;
  openAiAgentWithPrompt: (prompt?: string) => void;

  // Active Remediation Modal
  activeRemediationFinding: PlatformFinding | null;
  setActiveRemediationFinding: (finding: PlatformFinding | null) => void;
  isExecutingRemediation: boolean;
  isTenantConfigured: boolean;
  setIsTenantConfigured: (configured: boolean) => void;
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<PlatformRole>('Admin');
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('Approval required');
  const [showAutonomousModal, setShowAutonomousModal] = useState<boolean>(false);
  const [pendingAutonomyMode, setPendingAutonomyMode] = useState<AutonomyMode | null>(null);

  const [systems, setSystems] = useState<AtlasSystem[]>(INITIAL_SYSTEMS);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null); // default to All Systems

  const [activeNav, setActiveNav] = useState<string>('systems'); // default to systems as requested in screenshot

  const [findings, setFindings] = useState<PlatformFinding[]>(INITIAL_FINDINGS);
  const [selectedFinding, setSelectedFinding] = useState<PlatformFinding | null>(null);

  const [complianceAssessments, setComplianceAssessments] = useState<ComplianceAssessment[]>(INITIAL_COMPLIANCE_ASSESSMENTS);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>('asm-cis-payments-01');

  const [poamItems, setPoamItems] = useState<POAMItem[]>(INITIAL_POAM_ITEMS);
  const [activityLogs, setActivityLogs] = useState<PlatformActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>(INITIAL_WORKFLOW_EXECUTIONS);
  const [agentWorkers] = useState<AgentWorker[]>(INITIAL_AGENT_WORKERS);
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>(INITIAL_INTEGRATIONS);

  const [isAiAgentOpen, setIsAiAgentOpen] = useState<boolean>(false);
  const [aiSuggestedPrompt, setAiSuggestedPrompt] = useState<string | null>(null);

  const [activeRemediationFinding, setActiveRemediationFinding] = useState<PlatformFinding | null>(null);
  const [isExecutingRemediation, setIsExecutingRemediation] = useState<boolean>(false);
  const [isTenantConfigured, setIsTenantConfigured] = useState<boolean>(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success', duration: number = 4500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { id, message, type, timestamp: Date.now() };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const selectedSystem = useMemo(() => {
    if (!selectedSystemId) return null;
    return systems.find(s => s.id === selectedSystemId) || null;
  }, [selectedSystemId, systems]);

  const requestAutonomyChange = (mode: AutonomyMode) => {
    if (mode === 'Autonomous') {
      setPendingAutonomyMode('Autonomous');
      setShowAutonomousModal(true);
    } else {
      setAutonomyMode(mode);
      logActivity(
        'Platform Operations',
        'Autonomy Policy Changed',
        `Autonomy policy shifted to '${mode}' by ${role}.`,
        'Info'
      );
    }
  };

  const confirmAutonomousMode = () => {
    setAutonomyMode('Autonomous');
    setShowAutonomousModal(false);
    setPendingAutonomyMode(null);
    logActivity(
      'Platform Operations',
      'Autonomous Mode Enabled',
      `SuperAdmin enabled Autonomous Mode. ATLAS permitted to execute verified policy actions without per-action approval.`,
      'Warning'
    );
  };

  const cancelAutonomousModeModal = () => {
    setShowAutonomousModal(false);
    setPendingAutonomyMode(null);
  };

  const logActivity = (
    module: string,
    action: string,
    details: string,
    status: 'Success' | 'Warning' | 'Error' | 'Info' = 'Info',
    systemName?: string
  ) => {
    const newLog: PlatformActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: role === 'SuperAdmin' ? 'superadmin@atlas.sec' : role === 'Admin' ? 'admin@atlas.sec' : role === 'Analyst' ? 'analyst@atlas.sec' : 'viewer@atlas.sec',
      role,
      module,
      systemName,
      action,
      details,
      status
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addSystem = (system: AtlasSystem) => {
    setSystems(prev => [system, ...prev]);
    setActiveNav('systems');
    logActivity(
      'Systems',
      'System Onboarded',
      `System ${system.name} (${system.hostname}) registered and verified reachable on port ${system.port}.`,
      'Success',
      system.name
    );
  };

  const updateSystem = (updatedSystem: AtlasSystem) => {
    setSystems(prev => prev.map(s => s.id === updatedSystem.id ? updatedSystem : s));
    logActivity(
      'Systems',
      'System Updated',
      `Configuration for ${updatedSystem.name} updated by ${role}.`,
      'Success',
      updatedSystem.name
    );
  };

  const pauseSystem = (systemId: string) => {
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          monitoringStatus: 'Paused',
          systemStatus: 'Paused'
        };
      }
      return s;
    }));
    const sys = systems.find(s => s.id === systemId);
    if (sys) {
      logActivity(
        'Systems',
        'System Paused',
        `Monitoring and scheduled assessment activity for ${sys.name} paused.`,
        'Warning',
        sys.name
      );
    }
  };

  const resumeSystem = (systemId: string, targetStatus: 'Ready' | 'Needs Attention' = 'Ready') => {
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          monitoringStatus: 'Active',
          systemStatus: targetStatus
        };
      }
      return s;
    }));
    const sys = systems.find(s => s.id === systemId);
    if (sys) {
      logActivity(
        'Systems',
        'System Resumed',
        `Monitoring and active signals for ${sys.name} resumed as ${targetStatus}.`,
        'Success',
        sys.name
      );
    }
  };

  const toggleSystemMonitoring = (systemId: string) => {
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        const nextMonitoring = s.monitoringStatus === 'Active' ? 'Paused' : 'Active';
        logActivity(
          'Systems',
          `Monitoring ${nextMonitoring}`,
          `Monitoring status for ${s.name} changed to ${nextMonitoring} by ${role}.`,
          nextMonitoring === 'Active' ? 'Success' : 'Warning',
          s.name
        );
        return {
          ...s,
          monitoringStatus: nextMonitoring,
          systemStatus: nextMonitoring === 'Active' ? 'Ready' : 'Paused'
        };
      }
      return s;
    }));
  };

  const testSystemConnection = async (systemId: string): Promise<{ success: boolean; latency: number; details: string }> => {
    const sys = systems.find(s => s.id === systemId);
    if (!sys) return { success: false, latency: 0, details: 'System not found' };

    // Simulate real handshake
    await new Promise(r => setTimeout(r, 600));
    const randomLatency = Math.floor(Math.random() * 8) + 12;

    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        return {
          ...s,
          connectionStatus: 'Connected',
          lastHeartbeat: 'Just now',
          latencyMs: randomLatency
        };
      }
      return s;
    }));

    logActivity(
      'Systems',
      'Connection Tested',
      `Manual handshake on ${sys.hostname}:${sys.port} validated (${randomLatency}ms). Cipher: TLS_AES_256_GCM_SHA384 / ED25519.`,
      'Success',
      sys.name
    );

    return {
      success: true,
      latency: randomLatency,
      details: `SSH-2.0-OpenSSH_9.6p1 validated · ${randomLatency}ms RTT`
    };
  };

  const removeSystem = (systemId: string) => {
    const sys = systems.find(s => s.id === systemId);
    setSystems(prev => prev.filter(s => s.id !== systemId));
    if (selectedSystemId === systemId) {
      setSelectedSystemId(null);
    }
    if (sys) {
      logActivity(
        'Systems',
        'System De-registered',
        `System ${sys.name} (${sys.hostname}) removed from ATLAS platform scope.`,
        'Info',
        sys.name
      );
    }
  };

  const startAssessment = (systemId: string, frameworkId: string) => {
    const targetSys = systems.find(s => s.id === systemId);
    if (!targetSys) return;

    // Check if identity integration is connected
    const identityConnected = integrations.find(i => i.id === 'int-identity')?.status === 'Connected';

    const newAssessmentId = `asm-cis-${Date.now()}`;
    const newAssessment: ComplianceAssessment = {
      id: newAssessmentId,
      name: `CIS Ubuntu Linux Benchmark (${targetSys.name})`,
      systemId: targetSys.id,
      systemName: targetSys.name,
      frameworkId,
      frameworkName: 'CIS Linux Benchmark',
      status: identityConnected ? 'Completed' : 'Completed with Missing Evidence',
      score: identityConnected ? 92 : 83,
      controlsAssessed: 12,
      passedCount: identityConnected ? 11 : 9,
      failedCount: 1,
      missingEvidenceCount: identityConnected ? 0 : 2,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      evidenceSummary: {
        systemConnection: 'Ready',
        hostConfig: 'Ready',
        wazuhSca: 'Ready',
        identityEvidence: identityConnected ? 'Ready' : 'Missing',
        manualEvidenceControls: identityConnected ? 0 : 2
      },
      activity: [
        { timestamp: 'Just now', event: 'Assessment Initialized', details: `Triggered by ${role} on ${targetSys.name}` },
        { timestamp: 'Just now', event: 'Connection Verified', details: `Host ${targetSys.hostname} key handshake verified` },
        { timestamp: 'Just now', event: 'Harvest Complete', details: identityConnected ? 'All 12 controls assessed with verified evidence' : '10 controls assessed; 2 identity evidence sources missing' }
      ],
      controls: [
        {
          id: 'CIS 5.2.10',
          frameworkId,
          frameworkName: 'CIS Linux Benchmark',
          title: 'Ensure SSH PermitRootLogin is disabled',
          description: 'The PermitRootLogin parameter specifies whether the system administrator can log in directly using the ssh protocol.',
          severity: 'High',
          result: 'Failed',
          evidenceStatus: 'Ready',
          evidenceSource: '/etc/ssh/sshd_config',
          rationale: 'PermitRootLogin is set to "yes".',
          findingId: 'fnd-ssh-root-01'
        },
        {
          id: 'CIS 5.2.1',
          frameworkId,
          frameworkName: 'CIS Linux Benchmark',
          title: 'Ensure permissions on /etc/ssh/sshd_config are configured',
          description: 'The /etc/ssh/sshd_config file ownership and permissions must be 0600 root:root.',
          severity: 'Medium',
          result: 'Passed',
          evidenceStatus: 'Ready',
          evidenceSource: 'stat /etc/ssh/sshd_config',
          rationale: 'Permissions: 0600, Owner: root:root.'
        },
        {
          id: 'CIS 5.2.4',
          frameworkId,
          frameworkName: 'CIS Linux Benchmark',
          title: 'Ensure SSH Protocol is set to 2',
          description: 'SSH protocol version 1 suffers from known design flaws. Only protocol version 2 should be permitted.',
          severity: 'Critical',
          result: 'Passed',
          evidenceStatus: 'Ready',
          evidenceSource: 'sshd -T',
          rationale: 'Protocol 2 enforced.'
        },
        {
          id: 'CIS 5.4.1',
          frameworkId,
          frameworkName: 'CIS Linux Benchmark',
          title: 'Ensure user account lockout after 5 failed attempts (PAM)',
          description: 'Centralized directory integration required to verify account lockout thresholds.',
          severity: 'Medium',
          result: identityConnected ? 'Passed' : 'Missing Evidence',
          evidenceStatus: identityConnected ? 'Ready' : 'Missing',
          evidenceSource: identityConnected ? 'Okta Directory Policy /api/v1/policies' : 'Okta Connector (Missing)',
          rationale: identityConnected ? 'Lockout threshold verified at 5 attempts with 30-min backoff.' : 'Identity evidence unavailable.'
        },
        {
          id: 'CIS 5.4.2',
          frameworkId,
          frameworkName: 'CIS Linux Benchmark',
          title: 'Ensure administrative identity access requires Hardware MFA token',
          description: 'Verification of FIDO2 / WebAuthn token policy requires live IdP sync.',
          severity: 'High',
          result: identityConnected ? 'Passed' : 'Missing Evidence',
          evidenceStatus: identityConnected ? 'Ready' : 'Missing',
          evidenceSource: identityConnected ? 'Okta FIDO2 Authenticator Telemetry' : 'Identity Connector (Missing)',
          rationale: identityConnected ? 'WebAuthn hardware authenticator enforced for admin group.' : 'Identity evidence unavailable.'
        }
      ]
    };

    setComplianceAssessments(prev => [newAssessment, ...prev]);
    setSelectedAssessmentId(newAssessmentId);
    logActivity(
      'Compliance',
      'Assessment Executed',
      `CIS Linux Benchmark assessment completed for ${targetSys.name}. Score: ${newAssessment.score}%.`,
      'Success',
      targetSys.name
    );
    return newAssessment;
  };

  const submitRemediation = (findingId: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        const updatedHistory = [
          ...f.activityHistory,
          {
            timestamp: new Date().toISOString(),
            actor: `${role} (${role === 'Analyst' ? 'analyst@atlas.sec' : 'admin@atlas.sec'})`,
            action: 'Submitted targeted configuration remediation for authorized Admin approval.'
          }
        ];
        return {
          ...f,
          approvalState: 'Pending Approval',
          activityHistory: updatedHistory,
          remediationPayload: f.remediationPayload ? {
            ...f.remediationPayload,
            submittedBy: role
          } : undefined
        };
      }
      return f;
    }));

    // Update active finding if selected
    if (selectedFinding?.id === findingId) {
      setSelectedFinding(prev => prev ? { ...prev, approvalState: 'Pending Approval' } : null);
    }

    logActivity(
      'Compliance',
      'Remediation Submitted',
      `Targeted remediation workflow for finding #${findingId} submitted. Awaiting Admin authorization.`,
      'Info',
      'Customer Portal App Server'
    );
  };

  const approveRemediation = (findingId: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        const updatedHistory = [
          ...f.activityHistory,
          {
            timestamp: new Date().toISOString(),
            actor: `${role} (${role === 'Admin' ? 'admin@atlas.sec' : 'superadmin@atlas.sec'})`,
            action: 'Authorized remediation execution under ATLAS platform execution policy.'
          }
        ];
        return {
          ...f,
          approvalState: 'Approved',
          activityHistory: updatedHistory,
          remediationPayload: f.remediationPayload ? {
            ...f.remediationPayload,
            approvedBy: role
          } : undefined
        };
      }
      return f;
    }));

    if (selectedFinding?.id === findingId) {
      setSelectedFinding(prev => prev ? { ...prev, approvalState: 'Approved' } : null);
    }

    logActivity(
      'Platform Operations',
      'Remediation Authorized',
      `Admin approved execution of targeted configuration change on Customer Portal App Server.`,
      'Success',
      'Customer Portal App Server'
    );
  };

  const rejectRemediation = (findingId: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        const updatedHistory = [
          ...f.activityHistory,
          {
            timestamp: new Date().toISOString(),
            actor: `${role}`,
            action: 'Remediation Rejected'
          }
        ];
        return {
          ...f,
          approvalState: 'Open',
          activityHistory: updatedHistory,
        };
      }
      return f;
    }));

    if (selectedFinding?.id === findingId) {
      setSelectedFinding(prev => prev ? { ...prev, approvalState: 'Open' } : null);
    }

    logActivity(
      'Compliance',
      'Remediation Rejected',
      `Remediation rejected by ${role}. Finding returned to Open status.`,
      'Warning',
      'Customer Portal App Server'
    );
  };

  const executeRemediationAndVerify = async (findingId: string) => {
    setIsExecutingRemediation(true);

    // 1. Transition to Executing
    setFindings(prev => prev.map(f => f.id === findingId ? { ...f, approvalState: 'Executing' } : f));
    if (selectedFinding?.id === findingId) {
      setSelectedFinding(prev => prev ? { ...prev, approvalState: 'Executing' } : null);
    }

    // Simulate execution steps
    await new Promise(res => setTimeout(res, 1200));

    // 2. Transition to Verification Pending
    setFindings(prev => prev.map(f => f.id === findingId ? { ...f, approvalState: 'Completed', verificationState: 'Verification Pending' } : f));

    // Simulate automated fresh evidence collection & reassessment
    await new Promise(res => setTimeout(res, 1000));

    const timestampNow = new Date().toISOString();
    const freshEvidenceHash = `sha256:${Math.random().toString(36).substring(2, 12)}e921d7`;

    // 3. Mark Verified!
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return {
          ...f,
          actionState: 'Remediated',
          approvalState: 'Verified',
          verificationState: 'Verified',
          evidence: [
            {
              id: `ev-fresh-${Date.now()}`,
              source: 'Wazuh SCA / Fresh Reassessment Probe',
              freshness: 'Just now (Fresh)',
              timestamp: timestampNow,
              hash: freshEvidenceHash,
              rawSample: 'grep "^PermitRootLogin" /etc/ssh/sshd_config\nPermitRootLogin no\n[Exit Code 0]',
              status: 'Ready'
            },
            ...f.evidence
          ],
          activityHistory: [
            ...f.activityHistory,
            {
              timestamp: timestampNow,
              actor: 'ATLAS Reassessment & Verification Engine',
              action: 'Automated verification check passed. Fresh evidence collected: PermitRootLogin is "no". Finding closed.'
            }
          ],
          remediationPayload: f.remediationPayload ? {
            ...f.remediationPayload,
            executedAt: timestampNow,
            verifiedAt: timestampNow,
            afterState: 'PermitRootLogin no'
          } : undefined
        };
      }
      return f;
    }));

    // Update compliance assessment control CIS 5.2.10 to Passed!
    setComplianceAssessments(prev => prev.map(asm => {
      if (asm.systemId === 'sys-payments-prod') {
        const updatedControls = asm.controls.map(c => {
          if (c.id === 'CIS 5.2.10') {
            return {
              ...c,
              result: 'Passed' as const,
              rationale: 'PermitRootLogin successfully verified as "no". Remediated and verified via ATLAS execution pipeline.'
            };
          }
          return c;
        });

        const failedRemaining = updatedControls.filter(c => c.result === 'Failed').length;
        const passedCount = updatedControls.filter(c => c.result === 'Passed').length;
        const newScore = Math.round((passedCount / asm.controlsAssessed) * 100);

        return {
          ...asm,
          controls: updatedControls,
          failedCount: failedRemaining,
          passedCount: passedCount,
          score: newScore,
          activity: [
            {
              timestamp: 'Just now',
              event: 'Control CIS 5.2.10 Reassessed & Verified',
              details: 'Fresh host probe validated PermitRootLogin no. Result updated to Passed.'
            },
            ...asm.activity
          ]
        };
      }
      return asm;
    }));

    // Update POA&M if exists
    setPoamItems(prev => prev.map(p => {
      if (p.createdFromFindingId === findingId || p.controlId === 'CIS 5.2.10') {
        return {
          ...p,
          status: 'Closed' as const,
          milestone: 'Targeted configuration applied & verified through automated reassessment'
        };
      }
      return p;
    }));

    // Update System capability
    setSystems(prev => prev.map(sys => {
      if (sys.id === 'sys-payments-prod') {
        return {
          ...sys,
          capabilities: sys.capabilities.map(cap => {
            if (cap.moduleId === 'compliance') {
              return {
                ...cap,
                status: 'Active',
                summary: 'All actionable failed controls resolved. 0 critical findings.',
                findingsCount: 0
              };
            }
            return cap;
          })
        };
      }
      return sys;
    }));

    logActivity(
      'Compliance',
      'Remediation Verified',
      `Automated reassessment completed for finding #${findingId}. Evidence verified fresh (PermitRootLogin no). Status: Verified.`,
      'Success',
      'Customer Portal App Server'
    );

    setIsExecutingRemediation(false);
  };

  const addFindingToPOAM = (findingId: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    createPOAMItem(
      finding,
      role === 'Analyst' ? 'SecOps Team' : 'Security Architecture',
      new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      'Evaluate remediation playbook and execute through ATLAS human-in-the-loop workflow'
    );
  };

  const createPOAMItem = (finding: PlatformFinding, owner: string, targetDate: string, milestone: string) => {
    const existing = poamItems.find(p => p.createdFromFindingId === finding.id);
    if (existing) return;

    const newPOAM: POAMItem = {
      id: `poam-${Date.now()}`,
      weakness: finding.title,
      systemId: finding.affectedSystemId,
      systemName: finding.affectedSystemName,
      controlId: finding.controlRef || 'GEN-01',
      risk: finding.severity,
      owner,
      targetDate,
      milestone,
      status: 'Open',
      createdFromFindingId: finding.id
    };

    setPoamItems(prev => [newPOAM, ...prev]);
    logActivity(
      'Compliance',
      'POA&M Item Created',
      `Finding "${finding.title}" added to Plan of Action & Milestones.`,
      'Info',
      finding.affectedSystemName
    );
  };

  const updatePOAMStatus = (poamId: string, status: POAMStatus) => {
    setPoamItems(prev => prev.map(p => p.id === poamId ? { ...p, status } : p));
    logActivity(
      'Compliance',
      'POA&M Status Updated',
      `Milestone #${poamId} status changed to ${status}.`,
      'Info'
    );
  };

  const updateControlResult = (assessmentId: string, controlId: string, result: ControlResult) => {
    setComplianceAssessments(prev => prev.map(asm => {
      if (asm.id === assessmentId) {
        const updatedControls = asm.controls.map(c => {
          if (c.id === controlId) {
            return {
              ...c,
              result
            };
          }
          return c;
        });
        return { ...asm, controls: updatedControls };
      }
      return asm;
    }));
    logActivity(
      'Compliance',
      'Control Result Updated',
      `Control ${controlId} in assessment ${assessmentId} updated to ${result}.`,
      'Info'
    );
  };

  const configureIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === integrationId) {
        return {
          ...int,
          status: 'Connected',
          lastSync: 'Just now'
        };
      }
      return int;
    }));

    if (integrationId === 'int-identity') {
      // Resolve missing identity evidence across compliance assessments!
      setComplianceAssessments(prev => prev.map(asm => {
        if (asm.frameworkId === 'cis-linux-v1') {
          const updatedControls = asm.controls.map(c => {
            if (c.evidenceStatus === 'Missing' && c.id.startsWith('CIS 5.4')) {
              return {
                ...c,
                result: 'Passed' as const,
                evidenceStatus: 'Ready' as const,
                evidenceSource: 'Okta Directory API /live',
                rationale: 'Identity Provider connector verified live MFA token enforcement and lockout thresholds.'
              };
            }
            return c;
          });

          return {
            ...asm,
            status: 'Completed',
            missingEvidenceCount: 0,
            passedCount: updatedControls.filter(c => c.result === 'Passed').length,
            score: 92,
            evidenceSummary: {
              ...asm.evidenceSummary,
              identityEvidence: 'Ready',
              manualEvidenceControls: 0
            },
            activity: [
              {
                timestamp: 'Just now',
                event: 'Identity Connector Ingested',
                details: 'Admin configured Okta Identity Provider connector. Missing evidence resolved for 2 controls.'
              },
              ...asm.activity
            ],
            controls: updatedControls
          };
        }
        return asm;
      }));

      logActivity(
        'Integrations',
        'Identity Connector Configured',
        'Admin configured Okta / Entra ID Identity Provider. Live telemetry ingestion active.',
        'Success'
      );
    }
  };

  const openAiAgentWithPrompt = (prompt?: string) => {
    if (prompt) setAiSuggestedPrompt(prompt);
    setIsAiAgentOpen(true);
  };

  return (
    <PlatformContext.Provider
      value={{
        role,
        setRole,
        autonomyMode,
        setAutonomyMode,
        requestAutonomyChange,
        confirmAutonomousMode,
        cancelAutonomousModeModal,
        showAutonomousModal,

        systems,
        selectedSystemId,
        setSelectedSystemId,
        selectedSystem,

        activeNav,
        setActiveNav,

        findings,
        selectedFinding,
        setSelectedFinding,

        complianceAssessments,
        selectedAssessmentId,
        setSelectedAssessmentId,

        poamItems,
        activityLogs,
        workflowExecutions,
        agentWorkers,
        integrations,

        addSystem,
        updateSystem,
        pauseSystem,
        resumeSystem,
        toggleSystemMonitoring,
        testSystemConnection,
        removeSystem,
        startAssessment,
        submitRemediation,
        approveRemediation,
        rejectRemediation,
        executeRemediationAndVerify,
        addFindingToPOAM,
        createPOAMItem,
        updatePOAMStatus,
        updateControlResult,
        configureIntegration,

        toasts,
        addToast,
        removeToast,

        isAiAgentOpen,
        setIsAiAgentOpen,
        aiSuggestedPrompt,
        openAiAgentWithPrompt,

        activeRemediationFinding,
        setActiveRemediationFinding,
        isExecutingRemediation,
        isTenantConfigured,
        setIsTenantConfigured,
        tenant,
        setTenant
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
