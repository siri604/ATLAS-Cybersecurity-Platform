import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Globe, 
  Cloud, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Lock, 
  Activity, 
  Radio, 
  UserX, 
  Network, 
  AlertCircle,
  Edit3,
  Zap,
  Key,
  CheckCircle2,
  Shield,
  Code2,
  FileCheck
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SettingsTabsHeader } from '../settings/SettingsTabsHeader';
import { 
  SystemCategory, 
  SystemType, 
  Environment, 
  BusinessCriticality, 
  TechnicalAccessLevel, 
  AtlasSystem,
  SaasSystemType
} from '../../types';

interface SystemOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editSystem?: AtlasSystem | null;
}

export const SystemOnboardingModal: React.FC<SystemOnboardingModalProps> = ({ 
  isOpen, 
  onClose,
  editSystem = null
}) => {
  const { addSystem, updateSystem, addToast, setSelectedSystemId, setActiveNav } = usePlatform();

  const isEditMode = !!editSystem;

  // Workflow steps: 1 System -> 2 Connect -> 3 Review
  const [step, setStep] = useState<number>(1); 

  // Step 1: System Details
  const [name, setName] = useState<string>('Corporate Okta Tenant');
  const [category, setCategory] = useState<SystemCategory>('Cloud or SaaS Service');
  const [systemType, setSystemType] = useState<SystemType>('Cloud or SaaS Service');
  const [saasSystemType, setSaasSystemType] = useState<string>('Identity Provider');
  const [provider, setProvider] = useState<string>('Okta');
  const [otherProvider, setOtherProvider] = useState<string>('');
  const [environment, setEnvironment] = useState<Environment>('Production');
  const [criticality, setCriticality] = useState<BusinessCriticality>('Critical');
  const [description, setDescription] = useState<string>('Primary workforce identity provider used for authentication, MFA, privileged access, and application SSO.');


  // Advanced options · Optional (collapsed by default)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [deploymentBoundary, setDeploymentBoundary] = useState<string>('Corporate DMZ');
  const [systemProfile, setSystemProfile] = useState<string>('Regulated Bank Production');

  // Helper to dynamically calculate System Profile based on Category, SystemType, Environment, and Name
  const calculateSystemProfile = (cat: SystemCategory, type: SystemType, env: Environment, systemName: string): string => {
    const nameLower = systemName.toLowerCase();
    const typeLower = type.toLowerCase();

    // 1. Mission or range environment
    if (nameLower.includes('mission') || nameLower.includes('range')) {
      return 'Mission Range';
    }

    // 2. Regulated banking production system
    if (nameLower.includes('bank') || nameLower.includes('regulated')) {
      return 'Regulated Bank Production';
    }

    // 3. Threat intelligence source
    if (
      cat === 'Partner or Supply Chain' || 
      typeLower.includes('threat') || 
      typeLower.includes('intel')
    ) {
      return 'Threat Intelligence Feed';
    }

    // 4. Web Application / Website
    if (
      cat === 'Web Application or Website' || 
      typeLower.includes('web') || 
      typeLower.includes('website')
    ) {
      return 'Public Web Application / Website';
    }

    // 5. Linux Server or similar internal host → Protected Host Estate
    return 'Protected Host Estate';
  };

  // Step 2: Connection
  const [hostname, setHostname] = useState<string>('10.20.1.15');
  const [port, setPort] = useState<number>(22);
  const [username, setUsername] = useState<string>('atlas-sec');
  const [authMethod, setAuthMethod] = useState<'SSH Key' | 'Password' | 'Certificate'>('SSH Key');
  const [credentialSource, setCredentialSource] = useState<'stored' | 'paste'>('stored');
  const [accessLevel, setAccessLevel] = useState<TechnicalAccessLevel>('Read-only');
  const [connectionMethod, setConnectionMethod] = useState<'SSH' | 'API' | 'Deploy Agent' | 'Agentless Scan'>('SSH');
  const [showAdvancedNetwork, setShowAdvancedNetwork] = useState<boolean>(false);
  const [requiresVPN, setRequiresVPN] = useState<boolean>(false);
  const [requiresBastion, setRequiresBastion] = useState<boolean>(false);

  // Connection Test State
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'failed_privileged'>('idle');

  // Registration & Activation Sequence State
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [demoExperience, setDemoExperience] = useState<'First-time setup' | 'Operational system' | 'Needs attention'>('First-time setup');
  const [registeredSystemId, setRegisteredSystemId] = useState<string | null>(null);
  const [activationStage, setActivationStage] = useState<number>(1);
  const [activationProgress, setActivationProgress] = useState<number>(5);
  const [consoleLogs, setConsoleLogs] = useState<{ id: string; time: string; text: string; active?: boolean }[]>([]);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const consoleEndRef = React.useRef<HTMLDivElement>(null);

  // Helper for live console timestamps
  const formatTimestamp = (): string => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
    return `${hrs}:${mins}:${secs}.${ms}`;
  };

  // Auto-scroll console feed
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // State for selected credential dropdown in Step 2
  const [selectedCredential, setSelectedCredential] = useState<string>('atlas-vault-prod-key-ed25519');

  // Synchronize state when opening or when editSystem changes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsReady(false);
      setIsRegistering(false);
      setTestState('idle');
      setIsAdvancedOpen(false);
      setShowAdvancedNetwork(false);
      setRequiresVPN(false);
      setRequiresBastion(false);

      if (editSystem) {
        setName(editSystem.name);
        setCategory(editSystem.category || 'Internal System');
        setSystemType(editSystem.type || 'Linux Server');
        setEnvironment(editSystem.environment || 'Production');
        setCriticality(editSystem.criticality || 'Critical');
        setDescription(editSystem.description || '');
        setDeploymentBoundary(editSystem.deploymentBoundary || 'Corporate DMZ');
        setSystemProfile(editSystem.systemProfile || calculateSystemProfile(editSystem.category || 'Internal System', editSystem.type || 'Linux Server', editSystem.environment || 'Production', editSystem.name || ''));
        setHostname(editSystem.hostname || '10.20.1.15');
        setPort(editSystem.port || 22);
        setUsername(editSystem.username || 'atlas-sec');
        setAuthMethod((editSystem.authMethod as any) || 'SSH Key');
        setAccessLevel(editSystem.accessLevel || 'Read-only');
      } else {
        const defaultName = 'Customer Portal App Server';
        const defaultCat: SystemCategory = 'Internal System';
        const defaultType: SystemType = 'Linux Server';
        const defaultEnv: Environment = 'Production';

        setName(defaultName);
        setCategory(defaultCat);
        setSystemType(defaultType);
        setEnvironment(defaultEnv);
        setCriticality('Critical');
        setDescription('Core PCI-DSS transaction processing server handling merchant tokenized payment traffic.');
        setDeploymentBoundary('Corporate DMZ');
        setSystemProfile(calculateSystemProfile(defaultCat, defaultType, defaultEnv, defaultName));
        setHostname('10.20.1.15');
        setPort(22);
        setUsername('atlas-sec');
        setAuthMethod('SSH Key');
        setCredentialSource('stored');
        setAccessLevel('Read-only');
      }
      setDemoExperience('First-time setup');
    }
  }, [isOpen, editSystem]);

  // Dynamically update System Profile and Connection Method when category or systemType changes
  useEffect(() => {
    if (isOpen && !isEditMode) {
      setSystemProfile(calculateSystemProfile(category, systemType, environment, name));
      if (category === 'Internal System' && systemType === 'Linux Server') {
        setConnectionMethod('SSH');
      }
    }
  }, [category, systemType, environment, name, isOpen, isEditMode]);

  if (!isOpen) return null;

  // The 4 selectable category cards
  const categories: {
    id: SystemCategory;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'Internal System',
      title: 'Internal System',
      description: 'On-premises or private network servers, databases, and core infrastructure',
      icon: Server
    },
    {
      id: 'Web Application or Website',
      title: 'Web Application / Website',
      description: 'Customer portals, web services, HTTP endpoints, and public domains',
      icon: Globe
    },
    {
      id: 'Cloud or SaaS Service',
      title: 'Cloud / SaaS Service',
      description: 'Managed cloud workloads, SaaS suites, and hyperscaler subscriptions',
      icon: Cloud
    },
    {
      id: 'Partner or Supply Chain',
      title: 'Partner / Supply Chain',
      description: 'Federated partner environments, upstream suppliers, and contractor fleets',
      icon: ShieldCheck
    }
  ];

  // System Type options per selected Category
  const getTypesForCategory = (cat: SystemCategory): SystemType[] => {
    switch (cat) {
      case 'Internal System':
        return ['Linux Server', 'Windows Server', 'Database', 'Network Device'];
      case 'Web Application or Website':
        return ['Web Application', 'API/Service', 'Linux Server'];
      case 'Cloud or SaaS Service':
        return ['Cloud or SaaS Service', 'Microsoft 365', 'SaaS Tenant'];
      case 'Partner or Supply Chain':
        return ['Partner Environment', 'API/Service', 'Network Device'];
      default:
        return ['Linux Server', 'Windows Server', 'Database', 'Network Device'];
    }
  };

  const availableTypes = getTypesForCategory(category);

  const handleCategorySelect = (selectedCat: SystemCategory) => {
    setCategory(selectedCat);
    const validTypes = getTypesForCategory(selectedCat);
    if (!validTypes.includes(systemType)) {
      setSystemType(validTypes[0]);
    }
  };

  const handleTestConnection = () => {
    setTestState('testing');
    setTimeout(() => {
      setTestState('success');
    }, 750);
  };

  const handleConfirmRegistration = () => {
    setIsRegistering(true);
    setIsReady(false);
    setActivationStage(1);
    setActivationProgress(8);
    setShowTechnicalDetails(false);

    const generatedId = editSystem ? editSystem.id : `sys-${Date.now()}`;
    setRegisteredSystemId(generatedId);

    const t1 = formatTimestamp();
    setConsoleLogs([
      { id: '1', time: t1, text: 'Registering system with ATLAS...', active: true }
    ]);

    // Stage 1 -> 2: Connection Verified
    setTimeout(() => {
      setActivationProgress(25);
      setActivationStage(2);
      setConsoleLogs((prev) => [
        ...prev.map(l => ({ ...l, active: false })),
        { id: '2', time: formatTimestamp(), text: 'System registration complete', active: false },
        { id: '3', time: formatTimestamp(), text: 'Validating secure connection...', active: true }
      ]);
    }, 1200);

    // Stage 2 -> 3: Environment Discovery
    setTimeout(() => {
      setActivationProgress(45);
      setActivationStage(3);
      setConsoleLogs((prev) => [
        ...prev.map(l => ({ ...l, active: false })),
        { id: '4', time: formatTimestamp(), text: 'SSH connection verified', active: false },
        { id: '5', time: formatTimestamp(), text: 'Authentication verified', active: false },
        { id: '6', time: formatTimestamp(), text: 'Discovering system environment...', active: true }
      ]);
    }, 2600);

    // Stage 3 -> 4: ATLAS Services Initializing
    setTimeout(() => {
      setActivationProgress(68);
      setActivationStage(4);
      setConsoleLogs((prev) => [
        ...prev.map(l => ({ ...l, active: false })),
        { id: '7', time: formatTimestamp(), text: 'System environment identified', active: false },
        { id: '8', time: formatTimestamp(), text: 'Initializing ATLAS services...', active: true }
      ]);
    }, 4000);

    // Stage 4 -> 5: Monitoring Starting
    setTimeout(() => {
      setActivationProgress(88);
      setActivationStage(5);
      setConsoleLogs((prev) => [
        ...prev.map(l => ({ ...l, active: false })),
        { id: '9', time: formatTimestamp(), text: 'Security services initialized', active: false },
        { id: '10', time: formatTimestamp(), text: 'Starting monitoring...', active: true },
        { id: '11', time: formatTimestamp(), text: 'Establishing system baseline', active: false }
      ]);
    }, 5400);

    // Stage 5 -> 6: Ready (Reaches 100%)
    setTimeout(() => {
      setActivationProgress(100);
      setActivationStage(6);
      setConsoleLogs((prev) => [
        ...prev.map(l => ({ ...l, active: false })),
        { id: '12', time: formatTimestamp(), text: 'Finalizing system activation...', active: false },
        { id: '13', time: formatTimestamp(), text: 'System ready', active: false }
      ]);
    }, 6500);

    // Finalize Activation - Hold at 100% for 0.5 seconds before transitioning to Confirmation Screen
    setTimeout(() => {
      setIsRegistering(false);
      setIsReady(true);

      const systemPayload: AtlasSystem = {
        id: generatedId,
        name,
        category,
        type: systemType,
        environment,
        criticality,
        description,
        deploymentBoundary,
        systemProfile,
        hostname,
        port,
        username,
        authMethod: authMethod === 'Password' ? 'Password' : 'SSH Key',
        accessLevel,
        connectionStatus: 'Connected',
        lastHeartbeat: 'Just now',
        latencyMs: 14,
        uptimePercent: 99.98,
        osInfo: systemType === 'Windows Server' ? 'Windows Server 2022 Datacenter' : 'Ubuntu 24.04 LTS (Kernel 6.8.0)',
        tags: [environment.toLowerCase(), criticality.toLowerCase()],
        capabilities: [
          { moduleId: 'human-threats', name: 'Human & Agent Threats', status: 'Not configured', summary: 'Configure threat detection' },
          { moduleId: 'compliance', name: 'Compliance', status: 'Not configured', summary: 'Start baseline assessment' },
          { moduleId: 'zero-trust', name: 'Zero Trust', status: 'Not configured', summary: 'Configure Zero Trust posture' },
          { moduleId: 'anomaly-det', name: 'Anomaly Detection', status: 'Not configured', summary: 'Configure anomaly detection' },
          { moduleId: 'intrusion-det', name: 'Intrusion Detection', status: 'Not configured', summary: 'Connect or deploy an IDS sensor' },
          { moduleId: 'network-sec', name: 'Network Security', status: 'Not configured', summary: 'Configure network security' },
          { moduleId: 'software-qai', name: 'Software QAi', status: 'Not configured', summary: 'Link repository webhook' }
        ]
      };

      if (editSystem) {
        updateSystem(systemPayload);
      } else {
        addSystem(systemPayload);
      }
    }, 7000);
  };

  const handleNavigateToCapability = (navId: string) => {
    const targetId = editSystem ? editSystem.id : registeredSystemId;
    if (targetId) {
      setSelectedSystemId(targetId);
    }
    setActiveNav(navId);
    onClose();
  };

  const handleSaveChanges = () => {
    if (!editSystem) return;
    
    const updatedSystem: AtlasSystem = {
      ...editSystem,
      name,
      environment,
      criticality,
      description,
      deploymentBoundary,
      systemProfile,
      tags: [environment.toLowerCase(), criticality.toLowerCase()]
    };
    
    updateSystem(updatedSystem);
    addToast(`${name} configuration saved successfully`, 'success');
    onClose();
  };

  // Dedicated Standalone Post-Activation Confirmation Screen (Separate Screen altogether, no onboarding headers/stepper/toasts)
  if (isReady) {
    const cardsData = [
      {
        id: 'human-threats',
        title: 'Human & Agent Threats',
        icon: UserX,
        status: demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active',
        desc: demoExperience === 'First-time setup'
          ? 'Connect identity integration or deploy host telemetry agent to analyze insider risk.'
          : 'No active threat signals detected. Insider risk and agent behavior tracking online.',
        cta: demoExperience === 'First-time setup' ? 'Configure human threats' : 'View threats',
      },
      {
        id: 'compliance',
        title: 'Compliance',
        icon: FileCheck,
        status: demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active',
        desc: demoExperience === 'First-time setup'
          ? 'Align systems to standard benchmarks like CIS or NIST.'
          : 'System meets CIS Benchmark L1 baseline. Continuously assessing compliance.',
        cta: demoExperience === 'First-time setup' ? 'Configure compliance' : 'View assessment',
      },
      {
        id: 'zero-trust',
        title: 'Zero Trust',
        icon: Lock,
        status: demoExperience === 'Needs attention' ? 'Needs attention' : (demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active'),
        desc: demoExperience === 'First-time setup'
          ? 'Enforce continuous trust verification, device health, and micro-segmentation.'
          : demoExperience === 'Needs attention'
          ? 'Device certification expired. Zero Trust posture enforcement restricted.'
          : 'Device posture verified. Adaptive access policies actively enforced.',
        cta: demoExperience === 'First-time setup'
          ? 'Configure Zero Trust'
          : demoExperience === 'Needs attention'
          ? 'Resolve configuration'
          : 'View Zero Trust posture',
      },
      {
        id: 'anomaly-det',
        title: 'Anomaly Detection',
        icon: Activity,
        status: demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active',
        desc: demoExperience === 'First-time setup'
          ? 'Collect system behavioral signals to build a machine learning baseline.'
          : 'Machine learning baseline constructed. Live network telemetry monitored.',
        cta: demoExperience === 'First-time setup' ? 'Configure anomaly detection' : 'View anomalies',
      },
      {
        id: 'intrusion-det',
        title: 'Intrusion Detection',
        icon: Radio,
        status: demoExperience === 'Needs attention' ? 'Needs attention' : (demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active'),
        desc: demoExperience === 'First-time setup'
          ? 'Connect or deploy an IDS sensor.'
          : demoExperience === 'Needs attention'
          ? 'IDS daemon heartbeat lost. Connection with sensor interrupted.'
          : 'Intrusion detection sensor deployed. Signatures and port scanning monitored.',
        cta: demoExperience === 'First-time setup'
          ? 'Configure intrusion detection'
          : demoExperience === 'Needs attention'
          ? 'Review issue'
          : 'View detections',
      },
      {
        id: 'network-sec',
        title: 'Network Security',
        icon: Network,
        status: demoExperience === 'First-time setup' ? 'Needs configuration' : 'Active',
        desc: demoExperience === 'First-time setup'
          ? 'Map ingress firewall rules and trace network packet flows.'
          : 'Inbound/outbound traffic rules mapped and isolated.',
        cta: demoExperience === 'First-time setup' ? 'Configure network security' : 'View network activity',
      },
      {
        id: 'software-qai',
        title: 'Software QAi',
        icon: Code2,
        status: 'Needs configuration',
        desc: 'Link code repositories and configure SBOM supply chain validation.',
        cta: 'Configure software QAi',
      },
    ];

    return (
      <div className="space-y-6 max-w-6xl mx-auto font-sans py-4 animate-in fade-in duration-300 relative">
        
        {/* Prototype Demo Experience Dropdown Control (Upper Right of main content area) */}
        <div className="absolute top-2 right-2 z-40 flex items-center gap-2 bg-[#0C121F] border border-cyan-500/30 rounded-lg px-2.5 py-1.5 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Demo Experience:</span>
          <div className="relative flex items-center">
            <select
              value={demoExperience}
              onChange={(e) => setDemoExperience(e.target.value as any)}
              className="bg-[#080D18] text-cyan-300 font-mono font-bold text-xs focus:outline-none border border-slate-800 rounded px-2 py-1 pr-6 cursor-pointer hover:border-cyan-500/50 appearance-none"
            >
              <option value="First-time setup">First-time setup</option>
              <option value="Operational system">Operational system</option>
              <option value="Needs attention">Needs attention</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Top Success Header */}
        <div className="text-center space-y-3 pt-6 sm:pt-0">
          <div className="w-12 h-12 rounded-full border border-emerald-500/50 bg-[#07251F] text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono">
            {demoExperience === 'First-time setup' 
              ? `${name || 'Customer Portal App Server'} is onboarded`
              : (name || 'Customer Portal App Server')}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {demoExperience === 'First-time setup'
              ? 'System onboarding is complete. Your entitled ATLAS capabilities are now ready for capability specific setup'
              : demoExperience === 'Operational system'
              ? 'ATLAS capabilities are actively protecting and monitoring this system'
              : 'Most ATLAS capabilities are operating normally. Review the items that need attention'}
          </p>
        </div>

        {/* Compact Progress Indicator (Only for First-time setup) */}
        {demoExperience === 'First-time setup' && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono py-2.5 px-4 bg-[#080D18]/60 border border-slate-800/80 rounded-xl max-w-2xl mx-auto animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="font-bold">System registered</span>
              <span className="font-sans font-bold">✓</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="font-bold">Connection validated</span>
              <span className="font-sans font-bold">✓</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="font-bold">System onboarded</span>
              <span className="font-sans font-bold">✓</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-cyan-400 animate-pulse">
              <span className="font-bold">Capability setup next</span>
              <span className="text-[9px] font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300">ACTIVE</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between pt-2">
          <span className="atlas-section-heading uppercase tracking-wider text-slate-300 font-bold text-xs">
            ENTITLED ATLAS CAPABILITIES
          </span>
          <span className="text-cyan-400 text-xs font-semibold">
            7 Entitled Modules
          </span>
        </div>

        {/* Capability Cards 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsData.map((card) => {
            const Icon = card.icon;
            const isNeedsConfig = card.status === 'Needs configuration';
            const isNeedsAttention = card.status === 'Needs attention';
            const isActive = card.status === 'Active';

            return (
              <div 
                key={card.id} 
                className="p-4 rounded-xl border border-slate-800/90 bg-[#0B1322] flex flex-col justify-between space-y-3 shadow-xs min-h-[185px] animate-in fade-in duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-[#081827] border border-cyan-500/30 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-white text-xs leading-snug">{card.title}</h3>
                    </div>
                    {isNeedsConfig && (
                      <span className="px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-400 text-[11px] font-semibold flex items-center gap-1 shrink-0 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                        Needs configuration
                      </span>
                    )}
                    {isNeedsAttention && (
                      <span className="px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/40 text-amber-400 text-[11px] font-semibold flex items-center gap-1 shrink-0 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Needs attention
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 text-[11px] font-semibold flex items-center gap-1 shrink-0 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-3">
                    {card.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigateToCapability(card.id)}
                  className={`w-full px-3.5 py-2 rounded-lg transition-all text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    isNeedsConfig
                      ? 'bg-[#042436] border border-cyan-500/50 text-cyan-300 hover:bg-[#063048]'
                      : isNeedsAttention
                      ? 'bg-[#2A1408] border border-amber-500/50 text-amber-300 hover:bg-[#3E1D0C]'
                      : 'bg-[#080D18] border border-slate-800 text-white hover:border-slate-700'
                  }`}
                >
                  <span>{card.cta}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${
                    isNeedsConfig ? 'text-cyan-400' : isNeedsAttention ? 'text-amber-400' : 'text-slate-400'
                  }`} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4 font-sans">
          <button
            type="button"
            onClick={() => {
              setIsReady(false);
              setIsRegistering(false);
              setStep(1);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to System Onboarding</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none font-mono uppercase"
          >
            <span>Go to Systems List</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto font-sans py-2 animate-in fade-in duration-300">
        
        {/* Header with Breadcrumb-style Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono uppercase mb-1">
              <span>Systems</span>
              <span>/</span>
              <span className="text-cyan-400">Edit System Settings</span>
            </div>
            <h1 className="atlas-page-title">
              Edit — {editSystem?.name}
            </h1>
            <p className="atlas-page-desc">
              Update editable system metadata and advanced profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 font-bold text-[10px] uppercase font-mono tracking-wider">
              ADMIN ROLE
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="p-6 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-5 shadow-md">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            SYSTEM METADATA
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Read-Only System Category */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono text-[11px] uppercase">
                System Category <span className="text-slate-500 font-sans">(Read-Only)</span>
              </label>
              <div className="p-2.5 bg-[#080E18] border border-slate-800 text-slate-400 rounded-lg text-xs font-mono">
                {editSystem?.category}
              </div>
            </div>

            {/* Read-Only System Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-mono text-[11px] uppercase">
                System Type <span className="text-slate-500 font-sans">(Read-Only)</span>
              </label>
              <div className="p-2.5 bg-[#080E18] border border-slate-800 text-slate-400 rounded-lg text-xs font-mono">
                {editSystem?.type}
              </div>
            </div>

            {/* Editable: System Name */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono text-[11px] uppercase font-semibold flex items-center gap-1">
                <span>System Name</span>
                <span className="text-[#00E5FF] font-bold">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer Portal App Server"
                className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans"
              />
            </div>

            {/* Editable: Environment */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono text-[11px] uppercase font-semibold">
                Environment
              </label>
              <div className="relative">
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as any)}
                  className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2.5 pr-10 text-xs text-slate-300 focus:outline-none transition-colors appearance-none font-sans cursor-pointer"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                  <option value="Test">Test</option>
                  <option value="Disaster Recovery">Disaster Recovery</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Editable: Business Criticality */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono text-[11px] uppercase font-semibold">
                Business Criticality
              </label>
              <div className="relative">
                <select
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value as any)}
                  className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2.5 pr-10 text-xs text-slate-300 focus:outline-none transition-colors appearance-none font-sans cursor-pointer"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Editable: Description */}
          <div className="space-y-1.5 pt-2">
            <label className="text-slate-300 font-mono text-[11px] uppercase font-semibold">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a functional description of this system..."
              className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors resize-none font-sans"
            />
          </div>

          {/* Advanced Options (Collapsed by default) */}
          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none font-mono uppercase"
            >
              <span>{isAdvancedOpen ? 'Hide' : 'Show'} Advanced Profile Settings</span>
              <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAdvancedOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 pt-1 animate-in slide-in-from-top-2 duration-150">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[11px] uppercase">
                    Deployment Boundary / Zone
                  </label>
                  <input
                    type="text"
                    value={deploymentBoundary}
                    onChange={(e) => setDeploymentBoundary(e.target.value)}
                    placeholder="e.g. PCI-DSS Enclave"
                    className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-mono text-[11px] uppercase">
                    System Profile Baselines
                  </label>
                  <input
                    type="text"
                    value={systemProfile}
                    onChange={(e) => setSystemProfile(e.target.value)}
                    placeholder="e.g. Regulated Bank Production"
                    className="w-full bg-[#0A101C] border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed font-sans cursor-pointer"
          >
            <span>Save Changes</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* 1. Breadcrumbs Line & Horizontal Settings Navigation Tabs */}
      <SettingsTabsHeader currentTab="systems" subTitle={isEditMode ? `Edit — ${name}` : 'Add System'} />

      {/* 2. Onboarding Stepper (Mission Progression Bar) */}
      <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] p-2.5 flex items-center justify-between text-xs font-sans shadow-xs">
        {/* Step 1: System */}
        <div 
          onClick={() => !isRegistering && !isReady && setStep(1)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all ${
            !isRegistering && !isReady ? 'cursor-pointer' : ''
          } ${
            step === 1 
              ? 'bg-[#07192A] border border-cyan-500/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40' 
              : step > 1 
              ? 'text-emerald-400 hover:text-emerald-300' 
              : 'text-slate-400'
          }`}
        >
          <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
            step === 1 
              ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_6px_#00E5FF]' 
              : step > 1 
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {step > 1 ? '✓' : '1'}
          </span>
          <div className="leading-tight">
            <div className="font-semibold flex items-center gap-1.5 atlas-card-title text-white">
              <span>System</span>
              {step === 1 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />}
            </div>
            <div className={`atlas-secondary-text text-[10px] ${step === 1 ? 'text-cyan-300' : 'text-slate-500'}`}>
              Define what you are onboarding
            </div>
          </div>
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />

        {/* Step 2: Connect */}
        <div 
          onClick={() => !isRegistering && !isReady && step > 1 && setStep(2)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all ${
            step > 1 && !isRegistering && !isReady ? 'cursor-pointer' : ''
          } ${
            step === 2 
              ? 'bg-[#07192A] border border-cyan-500/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40' 
              : step > 2 
              ? 'text-emerald-400 hover:text-emerald-300' 
              : 'text-slate-400'
          }`}
        >
          <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
            step === 2 
              ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_6px_#00E5FF]' 
              : step > 2 
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {step > 2 ? '✓' : '2'}
          </span>
          <div className="leading-tight">
            <div className="font-semibold flex items-center gap-1.5 atlas-card-title text-white">
              <span>Connect</span>
              {step === 2 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />}
            </div>
            <div className={`atlas-secondary-text text-[10px] ${step === 2 ? 'text-cyan-300' : 'text-slate-500'}`}>
              Configure secure access
            </div>
          </div>
        </div>

        <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />

        {/* Step 3: Review */}
        <div 
          onClick={() => !isRegistering && !isReady && step > 2 && setStep(3)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all ${
            step > 2 && !isRegistering && !isReady ? 'cursor-pointer' : ''
          } ${
            step === 3 
              ? 'bg-[#07192A] border border-cyan-500/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40' 
              : step > 3 || isReady 
              ? 'text-emerald-400' 
              : 'text-slate-400'
          }`}
        >
          <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
            step === 3 
              ? 'bg-[#00E5FF] text-slate-950 shadow-[0_0_6px_#00E5FF]' 
              : step > 3 || isReady
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {step > 3 || isReady ? '✓' : '3'}
          </span>
          <div className="leading-tight">
            <div className="font-semibold flex items-center gap-1.5 atlas-card-title text-white">
              <span>Review</span>
              {step === 3 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22D3EE]" />}
            </div>
            <div className={`atlas-secondary-text text-[10px] ${step === 3 ? 'text-cyan-300' : 'text-slate-500'}`}>
              Confirm and activate
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="space-y-5">

        {/* ========================================================================= */}
        {/* STEP 1: SYSTEM DETAILS                                                     */}
        {/* ========================================================================= */}
        {step === 1 && !isRegistering && !isReady && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Header Titles */}
            <div>
              <h1 className="atlas-page-title">
                {isEditMode ? `Edit System — ${name}` : 'Add System'}
              </h1>
              <p className="atlas-page-desc">
                Tell ATLAS what you want to connect
              </p>
            </div>

            {/* What are you onboarding? */}
            <div className="space-y-2">
              <h2 className="atlas-section-heading uppercase tracking-wider text-slate-300">
                WHAT ARE YOU ONBOARDING?
              </h2>

              {/* 4 Selectable Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleCategorySelect(c.id)}
                      className={`p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer select-none relative group ${
                        isSelected
                          ? 'border-cyan-500 bg-[#07192A] shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/40'
                          : 'border-slate-800/90 bg-[#0B1322] hover:border-slate-700 hover:bg-[#0E1A29]'
                      }`}
                    >
                      <div>
                        {/* Top Icon & Checkmark badge */}
                        <div className="flex items-start justify-between">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                              : 'bg-[#080D18] border border-slate-800 text-slate-400 group-hover:text-slate-300'
                          }`}>
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>

                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_6px_#22D3EE]">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className={`atlas-card-title font-semibold mt-3 transition-colors ${isSelected ? 'text-white font-bold' : 'text-slate-200'}`}>
                          {c.title}
                        </h3>

                        {/* Description */}
                        <p className={`atlas-secondary-text mt-1 leading-relaxed transition-colors ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          {c.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Type and Provider Selector for Cloud/SaaS */}
            {category === 'Cloud or SaaS Service' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* System Type */}
                <div className="space-y-1.5">
                  <label className="atlas-section-heading uppercase tracking-wider text-slate-300">
                    SYSTEM TYPE
                  </label>
                  <select
                    value={saasSystemType}
                    onChange={(e) => {
                      setSaasSystemType(e.target.value as SaasSystemType);
                      setProvider('');
                    }}
                    className="w-full p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/90 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Identity Provider">Identity Provider</option>
                    <option value="Productivity Suite">Productivity Suite</option>
                    <option value="CRM">CRM</option>
                    <option value="Cloud Platform">Cloud Platform</option>
                    <option value="Security Platform">Security Platform</option>
                    <option value="Other SaaS">Other SaaS</option>
                  </select>
                </div>
                {/* Provider */}
                <div className="space-y-1.5">
                  <label className="atlas-section-heading uppercase tracking-wider text-slate-300">
                    PROVIDER
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => {
                      setProvider(e.target.value);
                      if (e.target.value !== 'Other') setOtherProvider('');
                    }}
                    className="w-full p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/90 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select Provider</option>
                    {saasSystemType === 'Identity Provider' && <>
                      <option value="Okta">Okta</option>
                      <option value="Microsoft Entra ID">Microsoft Entra ID</option>
                      <option value="Ping Identity">Ping Identity</option>
                    </>}
                    {saasSystemType === 'Productivity Suite' && <>
                      <option value="Microsoft 365">Microsoft 365</option>
                      <option value="Google Workspace">Google Workspace</option>
                    </>}
                    {saasSystemType === 'CRM' && <>
                      <option value="Salesforce">Salesforce</option>
                      <option value="HubSpot">HubSpot</option>
                    </>}
                    {saasSystemType === 'Cloud Platform' && <>
                      <option value="AWS">AWS</option>
                      <option value="Microsoft Azure">Microsoft Azure</option>
                      <option value="Google Cloud Platform">Google Cloud Platform</option>
                    </>}
                    {saasSystemType === 'Security Platform' && <>
                      <option value="CrowdStrike">CrowdStrike</option>
                      <option value="Microsoft Defender">Microsoft Defender</option>
                      <option value="Wiz">Wiz</option>
                      <option value="Splunk">Splunk</option>
                    </>}
                    <option value="Other">Other</option>
                  </select>
                  {provider === 'Other' && (
                    <input
                      type="text"
                      value={otherProvider}
                      onChange={(e) => setOtherProvider(e.target.value)}
                      placeholder="Enter provider name"
                      className="w-full p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/90 text-white text-xs mt-1"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Original System Type Selector for others */
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="atlas-section-heading uppercase tracking-wider text-slate-300">
                    SYSTEM TYPE
                  </label>
                  
                  {/* Quick Selection Pills */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="atlas-metadata text-slate-500">Quick:</span>
                    {availableTypes.slice(0, 3).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSystemType(t)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-sans transition-colors cursor-pointer ${
                          systemType === t
                            ? 'bg-[#0E2034] text-cyan-300 border border-cyan-500/50 font-semibold shadow-xs'
                            : 'bg-[#080D18] text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between w-full p-2.5 rounded-lg bg-[#0B1322] border border-slate-800/90 hover:border-slate-700 transition-colors shadow-xs">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                        <Terminal className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>
                      
                      <span className="font-semibold text-white text-xs whitespace-nowrap">
                        {systemType}
                      </span>

                      <span className="atlas-status-label px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 text-[10px] font-mono shrink-0">
                        Active Target
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative flex items-center">
                        <select
                          value={systemType}
                          onChange={(e) => setSystemType(e.target.value as SystemType)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        >
                          {availableTypes.map((t) => (
                            <option key={t} value={t} className="bg-[#0B1322] text-slate-200">
                              {t}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                          <span>{availableTypes.length} options available</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Information Card */}
            <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] p-4 space-y-3.5 font-sans shadow-xs">
              <h3 className="atlas-section-heading uppercase tracking-wider text-slate-300">
                SYSTEM INFORMATION
              </h3>

              {/* 3 Columns: System Name, Environment, Business Criticality */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="block atlas-card-title text-slate-300 mb-1">
                    System Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
                    placeholder="e.g. Customer Portal App Server"
                  />
                </div>

                <div>
                  <label className="block atlas-card-title text-slate-300 mb-1">
                    Environment <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as Environment)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                    <option value="Test">Test</option>
                    <option value="Disaster Recovery">Disaster Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block atlas-card-title text-slate-300 mb-1">
                    Business Criticality <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={criticality}
                    onChange={(e) => setCriticality(e.target.value as BusinessCriticality)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="block atlas-card-title text-slate-300 mb-1">
                  Description <span className="atlas-secondary-text text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
                  placeholder="Core PCI-DSS transaction processing server handling merchant tokenized payment traffic."
                />
              </div>

              {/* Advanced options · Optional (Collapsed by default) */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none py-1"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdvancedOpen ? 'rotate-0' : '-rotate-90'}`} />
                  <span className="atlas-card-title text-cyan-400">Advanced options · Optional</span>
                </button>

                {isAdvancedOpen && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="block atlas-card-title text-slate-300">
                        Deployment Boundary
                      </label>
                      <select
                        value={deploymentBoundary}
                        onChange={(e) => setDeploymentBoundary(e.target.value)}
                        className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                      >
                        <option value="PCI-DSS Enclave">PCI-DSS Enclave</option>
                        <option value="Core Banking Perimeter">Core Banking Perimeter</option>
                        <option value="Corporate DMZ">Corporate DMZ</option>
                        <option value="Cloud VPC Prod">Cloud VPC Prod</option>
                        <option value="Default Zero Trust Zone">Default Zero Trust Zone</option>
                      </select>
                      <p className="atlas-secondary-text text-slate-500">
                        Deployment boundary preselected based on category. Override when necessary.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="block atlas-card-title text-slate-300">
                        System Profile
                      </label>
                      <select
                        value={systemProfile}
                        onChange={(e) => setSystemProfile(e.target.value)}
                        className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                      >
                        <option value="Protected Host Estate">Protected Host Estate</option>
                        <option value="Public Web Application / Website">Public Web Application / Website</option>
                        <option value="Threat Intelligence Feed">Threat Intelligence Feed</option>
                        <option value="Regulated Bank Production">Regulated Bank Production</option>
                        <option value="Mission Range">Mission Range</option>
                      </select>
                      <p className="atlas-secondary-text text-slate-500">
                        Automatically recommended by ATLAS based on system category and target profile. Editable override.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Cancel & Continue to Connect */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between font-sans">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg atlas-button-label text-slate-400 hover:text-white bg-[#080D18] border border-slate-800 hover:bg-[#0E1726] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim() || (category === 'Cloud or SaaS Service' && (!provider || (provider === 'Other' && !otherProvider)))}
                className="flex items-center gap-2 px-5 py-2 rounded-lg atlas-button-label font-semibold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Connect</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CONNECT                                                            */}
        {/* ========================================================================= */}
        {step === 2 && !isRegistering && !isReady && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="atlas-page-title">Connect</h1>
                <span className="px-2.5 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 font-semibold text-xs font-mono shadow-xs">
                  {name}
                </span>
              </div>
              <p className="atlas-page-desc mt-1">
                Configure secure communication and permissions for this host
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] p-4 space-y-3.5 font-sans shadow-xs">
              
              {/* Row 1: Connection method */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="atlas-card-title text-slate-300 font-sans">
                    Connection method <span className="text-cyan-400">*</span>
                  </label>
                  <span className="atlas-metadata text-slate-500">Protocol & Transport Channel</span>
                </div>
                <div className="relative">
                  <select
                    value={connectionMethod}
                    onChange={(e) => setConnectionMethod(e.target.value as any)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer appearance-none pr-8"
                  >
                    <option value="SSH">SSH (Default and recommended)</option>
                    <option value="API">API</option>
                    <option value="Deploy Agent">Deploy Agent</option>
                    <option value="Agentless Scan">Agentless Scan</option>
                  </select>
                  {connectionMethod === 'SSH' && (
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                      <span className="px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 text-[10px] font-semibold">
                        Default and recommended
                      </span>
                    </div>
                  )}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Row 2: Hostname or IP Address & SSH Port */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="md:col-span-2">
                  <label className="block atlas-card-title text-slate-300 mb-1 font-sans">
                    Hostname or IP Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="10.20.1.15"
                  />
                </div>

                <div>
                  <label className="block atlas-card-title text-slate-300 mb-1 font-sans">
                    SSH Port
                  </label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Row 3: Service Username */}
              <div>
                <label className="block atlas-card-title text-slate-300 mb-1 font-sans">
                  Service Username <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  placeholder="atlas-sec"
                />
              </div>

              {/* Row 4: SSH Authentication Method */}
              <div>
                <label className="block atlas-card-title text-slate-300 mb-1 font-sans">
                  SSH Authentication Method <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={authMethod}
                  onChange={(e) => setAuthMethod(e.target.value as any)}
                  className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="SSH Key">SSH Key (Recommended)</option>
                  <option value="Password">Password</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              {/* Row 5: SSH Key Source Card Box */}
              <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080E18] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="atlas-card-title text-slate-300">
                    SSH Key Source <span className="text-cyan-400">*</span>
                  </label>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between w-full p-2.5 rounded-lg bg-[#0B1322] border border-slate-700 text-xs text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Stored Credential</span>
                      <span className="px-2 py-0.5 rounded border border-cyan-500/40 bg-[#072433] text-cyan-300 text-[10px] font-semibold">
                        Recommended
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block atlas-card-title text-slate-300">
                    Select Credential <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={selectedCredential}
                    onChange={(e) => setSelectedCredential(e.target.value)}
                    className="w-full bg-[#0B1322] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="atlas-vault-prod-key-ed25519">
                      atlas-vault-prod-key-ed25519 (Ed25519 · ATLAS Enclave Vault (Hardware KMS))
                    </option>
                    <option value="atlas-vault-prod-key-rsa4096">
                      atlas-vault-prod-key-rsa4096 (RSA 4096 · ATLAS Enclave Vault (Hardware KMS))
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Hardware-isolated enclave vault credential with automated rotation. Key material is never exposed or transferred in plaintext.</span>
                </div>
              </div>

              {/* Row 6: Permissions (Strictly 2 options: Read-only (Default) and Privileged) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="atlas-card-title text-slate-300 font-sans">
                    Permissions <span className="text-cyan-400">*</span>
                  </label>
                  <span className="px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 text-[10px] font-semibold">
                    Default: Read-only
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as TechnicalAccessLevel)}
                    className="w-full bg-[#080D18] border border-slate-700 text-white rounded-lg p-2.5 text-xs font-sans focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer appearance-none pr-8"
                  >
                    <option value="Read-only">Read-only (Default)</option>
                    <option value="Privileged">Privileged</option>
                  </select>
                  {accessLevel === 'Read-only' && (
                    <div className="absolute left-[78px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                      <span className="px-2 py-0.5 rounded border border-cyan-500/50 bg-[#072433] text-cyan-300 text-[10px] font-semibold">
                        Default - Read-only
                      </span>
                    </div>
                  )}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="atlas-secondary-text text-slate-400 text-xs mt-1">
                  {accessLevel === 'Read-only'
                    ? 'Collect and assess only. No system changes.'
                    : 'Allows elevated access for actions that require administrative permissions.'}
                </p>
              </div>

              {/* Row 7: Network Access (Optional, collapsed by default) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedNetwork(!showAdvancedNetwork)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer select-none"
                >
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showAdvancedNetwork ? 'rotate-90 text-cyan-400' : ''}`} />
                  <span>Advanced Network Access <span className="atlas-secondary-text text-slate-500">(Optional)</span></span>
                </button>

                {showAdvancedNetwork && (
                  <div className="mt-2.5 p-3 rounded-lg border border-slate-800 bg-[#080E18] space-y-2.5 text-xs animate-in fade-in duration-150 font-sans">
                    <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requiresVPN}
                        onChange={(e) => setRequiresVPN(e.target.checked)}
                        className="rounded border-slate-700 bg-[#0B1322] text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer accent-cyan-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-200">Requires VPN Connection</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requiresBastion}
                        onChange={(e) => setRequiresBastion(e.target.checked)}
                        className="rounded border-slate-700 bg-[#0B1322] text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer accent-cyan-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-200">Requires Bastion / Jump Host</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Row 8: Test Connection Probe Row matching image */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="atlas-secondary-text text-slate-400">
                  Verify network reachability and credentials before proceeding.
                </span>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testState === 'testing'}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#081827] border border-cyan-500/50 text-cyan-300 font-semibold atlas-button-label transition-colors hover:bg-[#0A2035] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400 stroke-[2.2]" />
                  <span>{testState === 'testing' ? 'Testing Handshake...' : 'Test Connection'}</span>
                </button>
              </div>

              {testState === 'success' && accessLevel === 'Read-only' && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 animate-in fade-in duration-150 font-sans">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connection validated successfully</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1.5 border-t border-emerald-500/20">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">SSH Reachability:</span>
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Authentication:</span>
                      <span className="text-emerald-400 font-semibold">Success</span>
                    </div>
                  </div>
                </div>
              )}

              {testState === 'success' && accessLevel === 'Privileged' && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 animate-in fade-in duration-150 font-sans">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connection & Privileged Access validated successfully</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1.5 border-t border-emerald-500/20">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">SSH Reachability:</span>
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Authentication:</span>
                      <span className="text-emerald-400 font-semibold">Success</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Privileged Access:</span>
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {testState === 'failed_privileged' && accessLevel === 'Privileged' && (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/40 text-rose-300 text-xs space-y-2 animate-in fade-in duration-150 font-sans">
                  <div className="font-semibold flex items-center gap-1.5 text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Privileged Access Validation Failed</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1.5 border-t border-rose-500/20">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">SSH Reachability:</span>
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Authentication:</span>
                      <span className="text-emerald-400 font-semibold">Success</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-slate-300 font-medium">Privileged Access:</span>
                      <span className="text-rose-400 font-semibold">Failed</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    The selected permission level requires elevated access. Sudo administrative rights were not detected for <code className="text-rose-300 font-mono">{username}</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions for Step 2 */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between font-sans">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 atlas-button-label text-slate-300 hover:text-white bg-[#080D18] border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to System</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg atlas-button-label font-semibold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)] cursor-pointer"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: REVIEW                                                            */}
        {/* ========================================================================= */}
        {step === 3 && !isRegistering && !isReady && (
          <div className="space-y-5 animate-in fade-in duration-150 font-sans">
            <div>
              <h1 className="atlas-page-title">
                Review
              </h1>
              <p className="atlas-page-desc mt-1">
                Confirm and activate
              </p>
            </div>

            {/* Main Review Summary Card */}
            <div className="rounded-xl border border-slate-800/90 bg-[#0B1322] p-5 space-y-6 shadow-xs">
              
              {/* Hero Header Row */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg border border-cyan-500/30 bg-[#081827] text-cyan-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white leading-snug">{name}</h2>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{systemType}</span>
                      <span>·</span>
                      <span>{environment}</span>
                      <span>·</span>
                      <span className="text-cyan-400 font-semibold">{criticality}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 text-xs font-semibold tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>READY FOR ACTIVATION</span>
                </div>
              </div>

              {/* SYSTEM DETAILS section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="atlas-section-heading uppercase tracking-wider text-slate-300">
                    SYSTEM DETAILS
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
                  <div>
                    <span className="block atlas-card-title text-slate-400 mb-1">System Name</span>
                    <span className="font-bold text-white">{name}</span>
                  </div>
                  <div>
                    <span className="block atlas-card-title text-slate-400 mb-1">Type</span>
                    <span className="font-bold text-white">{systemType}</span>
                  </div>
                  <div>
                    <span className="block atlas-card-title text-slate-400 mb-1">Environment</span>
                    <span className="font-bold text-white">{environment}</span>
                  </div>
                  <div>
                    <span className="block atlas-card-title text-slate-400 mb-1">Deployment Boundary</span>
                    <span className="font-bold text-cyan-400">{deploymentBoundary || 'Default Corporate Network'}</span>
                  </div>
                </div>
              </div>

              {/* CONNECTION & ACCESS CONFIGURATION section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="atlas-section-heading uppercase tracking-wider text-slate-300">
                    CONNECTION & ACCESS CONFIGURATION
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                  {/* Card 1: Connection Method */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] space-y-1">
                    <span className="block atlas-card-title text-slate-400 uppercase text-[10px] tracking-wider">
                      CONNECTION METHOD
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white pt-0.5">
                      <span className="text-cyan-400 font-mono font-bold text-sm">&gt;_</span>
                      <span>{connectionMethod}</span>
                    </div>
                  </div>

                  {/* Card 2: Permissions */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] space-y-1">
                    <span className="block atlas-card-title text-slate-400 uppercase text-[10px] tracking-wider">
                      PERMISSIONS
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white pt-0.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>{accessLevel}</span>
                    </div>
                  </div>

                  {/* Card 3: Auth Method */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] space-y-1">
                    <span className="block atlas-card-title text-slate-400 uppercase text-[10px] tracking-wider">
                      AUTH METHOD
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white pt-0.5">
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span>{authMethod}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate pt-0.5">
                      {selectedCredential}
                    </div>
                  </div>

                  {/* Card 4: Onboarding Status */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] space-y-1">
                    <span className="block atlas-card-title text-slate-400 uppercase text-[10px] tracking-wider">
                      ONBOARDING STATUS
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-cyan-400 pt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>Ready for use</span>
                    </div>
                  </div>
                </div>

                {/* Compact Verified Connection Summary Row */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] flex items-center justify-between text-xs font-mono mt-3">
                  <div className="text-slate-200">
                    <span>{hostname}:{port}</span>
                    <span className="text-slate-500 mx-2">·</span>
                    <span>{username}</span>
                    <span className="text-slate-500 mx-2">·</span>
                    <span>{authMethod.toLowerCase() === 'ssh key' ? 'SSH key' : authMethod}</span>
                    {accessLevel === 'Privileged' && (
                      <>
                        <span className="text-slate-500 mx-2">·</span>
                        <span className="text-emerald-400 font-semibold">Privileged Access: Verified</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Step 3 */}
            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between font-sans">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 atlas-button-label text-slate-300 hover:text-white bg-[#080D18] border border-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmRegistration}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg atlas-button-label font-bold text-slate-950 bg-[#00E5FF] hover:bg-[#33EAFF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
              >
                <Zap className="w-4 h-4 stroke-[2.5] fill-slate-950" />
                <span>Confirm and Activate</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SYSTEM ACTIVATION PROGRESS EXPERIENCE                                    */}
        {/* ========================================================================= */}
        {isRegistering && !isReady && (
          <div className="space-y-5 animate-in fade-in duration-200 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="atlas-page-title flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${activationProgress === 100 ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'} shrink-0`} />
                  <span>{activationProgress === 100 ? `${name} is ready` : `Activating ${name}`}</span>
                </h1>
                <p className="atlas-page-desc mt-1">
                  {activationProgress === 100
                    ? 'System successfully onboarded and ready for ATLAS services'
                    : 'Executing system initialization and security service binding'}
                </p>
              </div>
            </div>

            {/* Gaming Console Progress Container */}
            <div className="p-5 rounded-xl border border-slate-800/90 bg-[#0B1322] space-y-5 shadow-xs">
              
              {/* Progress Bar & Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold tracking-wider uppercase flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    INITIALIZATION PROGRESS
                  </span>
                  <span className="font-bold text-sm font-mono text-cyan-300">
                    {Math.min(100, Math.round(activationProgress))}%
                  </span>
                </div>

                <div className="relative w-full h-3 bg-[#080D18] rounded-full overflow-hidden border border-slate-800/90 shadow-inner">
                  <div 
                    className="h-full transition-all duration-300 ease-out relative rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)]"
                    style={{ width: `${Math.min(100, Math.max(4, activationProgress))}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
              </div>

              {/* 6 Sequential Stages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                {[
                  { id: 1, label: 'System Registered' },
                  { id: 2, label: 'Connection Verified' },
                  { id: 3, label: 'Environment Discovery' },
                  { id: 4, label: 'ATLAS Services Initializing' },
                  { id: 5, label: 'Monitoring Starting' },
                  { id: 6, label: 'Ready' }
                ].map((stg) => {
                  const isCompleted = activationStage > stg.id || (stg.id === 6 && activationProgress === 100);
                  const isActive = activationStage === stg.id && !(stg.id === 6 && activationProgress === 100);

                  return (
                    <div 
                      key={stg.id}
                      className={`p-2.5 rounded-lg border text-xs font-sans transition-all duration-200 flex flex-col justify-between h-16 ${
                        isCompleted
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                          : isActive
                          ? 'border-cyan-400/90 bg-[#072433] text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.2)] animate-pulse'
                          : 'border-slate-800/80 bg-[#080D18] text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold opacity-75">0{stg.id}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isActive ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        )}
                      </div>
                      <div className={`font-semibold text-[11px] leading-tight mt-1 ${
                        isCompleted ? 'text-emerald-300' : isActive ? 'text-cyan-300' : 'text-slate-500'
                      }`}>
                        {stg.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Console Feed */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    CURRENT ACTIVITY CONSOLE
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    EXECUTING
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#080E18] space-y-2 font-mono text-xs max-h-48 overflow-y-auto shadow-inner">
                  {consoleLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`flex items-start gap-2.5 transition-all duration-150 ${
                        log.active 
                          ? 'text-cyan-300 font-bold' 
                          : 'text-slate-400'
                      }`}
                    >
                      <span className={log.active ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {log.active ? '❯' : '✓'}
                      </span>
                      <span className="text-slate-500 select-none">{log.time}</span>
                      <span className={log.active ? 'text-cyan-300' : 'text-slate-300'}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
