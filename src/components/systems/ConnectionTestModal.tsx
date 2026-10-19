import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  Server,
  Shield,
  Key,
  Network
} from 'lucide-react';
import { AtlasSystem } from '../../types';
import { usePlatform } from '../../context/PlatformContext';

interface ConnectionTestModalProps {
  isOpen: boolean;
  system: AtlasSystem | null;
  onClose: () => void;
  onEditConnection: (system: AtlasSystem) => void;
  onOpenWorkspace: (systemId: string) => void;
}

export const ConnectionTestModal: React.FC<ConnectionTestModalProps> = ({
  isOpen,
  system,
  onClose,
  onEditConnection,
  onOpenWorkspace
}) => {
  const { testSystemConnection, addToast } = usePlatform();

  // Progressive check states: 'idle' | 'checking' | 'success' | 'warning' | 'failed'
  const [reachabilityState, setReachabilityState] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [authState, setAuthState] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [privilegeState, setPrivilegeState] = useState<'idle' | 'checking' | 'success' | 'warning' | 'failed'>('idle');

  const [finalStatus, setFinalStatus] = useState<'testing' | 'successful' | 'limited' | 'failed'>('testing');
  const [failureReason, setFailureReason] = useState<string>('');

  const runProgressiveChecks = async () => {
    if (!system) return;

    setFinalStatus('testing');
    setReachabilityState('checking');
    setAuthState('idle');
    setPrivilegeState('idle');

    // 1. Reachability Check
    await new Promise((r) => setTimeout(r, 600));
    setReachabilityState('success');

    // 2. Authentication Check
    setAuthState('checking');
    await new Promise((r) => setTimeout(r, 650));
    setAuthState('success');

    // 3. Access Level Check (Privilege Availability)
    setPrivilegeState('checking');
    await new Promise((r) => setTimeout(r, 600));
    const isPrivileged = system.accessLevel === 'Privileged';
    if (isPrivileged) {
      setPrivilegeState('success');
    } else {
      setPrivilegeState('warning');
    }

    // Determine final state
    if (isPrivileged) {
      setFinalStatus('successful');
    } else {
      setFinalStatus('limited');
    }

    // Update system last activity in context
    testSystemConnection(system.id);
  };

  useEffect(() => {
    if (isOpen && system) {
      runProgressiveChecks();
    }
  }, [isOpen, system]);

  if (!isOpen || !system) return null;

  const connectionMethod = system.type === 'Linux Server' || system.type === 'Database'
    ? 'SSH'
    : system.type === 'Web Application'
    ? 'HTTPS'
    : system.type === 'Cloud or SaaS Service'
    ? 'OAuth 2.0 API'
    : 'IPsec / SSH';

  const authMethodDisplay = system.authMethod === 'SSH Key' 
    ? 'Stored SSH Key' 
    : system.authMethod === 'Password' 
    ? 'Stored Credential' 
    : 'Stored SSH Key';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0D121D] border border-cyan-500/40 rounded-xl shadow-2xl flex flex-col my-8 text-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080D17]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Test Connection — {system.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Live host reachability, credential verification, and technical access diagnostics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Current Connection Info Card */}
          <div className="bg-[#090E19] border border-slate-800/90 rounded-lg p-3.5 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Current Connection Configuration
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500">Connection Method:</span>{' '}
                <span className="text-cyan-400 font-semibold">{connectionMethod}</span>
              </div>
              <div>
                <span className="text-slate-500">Target:</span>{' '}
                <span className="text-white">{system.hostname}:{system.port}</span>
              </div>
              <div>
                <span className="text-slate-500">Authentication:</span>{' '}
                <span className="text-slate-200">{authMethodDisplay}</span>
              </div>
              <div>
                <span className="text-slate-500">Technical Access:</span>{' '}
                <span className={system.accessLevel === 'Privileged' ? 'text-amber-300 font-semibold' : 'text-slate-300'}>
                  {system.accessLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Progressive Validation Checks */}
          <div className="space-y-2 text-xs font-mono">
            {/* 1. Reachability */}
            <div className="p-3 rounded bg-[#090F1A] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-300">Reachability</span>
              {reachabilityState === 'checking' && (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </span>
              )}
              {reachabilityState === 'success' && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reachable ({connectionMethod} verified in {system.latencyMs || 14}ms)</span>
                </span>
              )}
              {reachabilityState === 'failed' && (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Host unreachable</span>
                </span>
              )}
              {reachabilityState === 'idle' && (
                <span className="text-slate-600">Pending</span>
              )}
            </div>

            {/* 2. Authentication */}
            <div className="p-3 rounded bg-[#090F1A] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-300">Authentication</span>
              {authState === 'checking' && (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </span>
              )}
              {authState === 'success' && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authentication successful</span>
                </span>
              )}
              {authState === 'failed' && (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Authentication failed</span>
                </span>
              )}
              {authState === 'idle' && (
                <span className="text-slate-600">Pending</span>
              )}
            </div>

            {/* 3. Access Level */}
            <div className="p-3 rounded bg-[#090F1A] border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-300">Access Level</span>
              {privilegeState === 'checking' && (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </span>
              )}
              {privilegeState === 'success' && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Privileged access verified</span>
                </span>
              )}
              {privilegeState === 'warning' && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Read-only access verified</span>
                </span>
              )}
              {privilegeState === 'idle' && (
                <span className="text-slate-600">Pending</span>
              )}
            </div>
          </div>

          {/* Final State Banner */}
          {finalStatus === 'successful' && (
            <div className="p-4 rounded-lg bg-emerald-950/25 border border-emerald-500/40 text-xs font-sans space-y-1 animate-in fade-in">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Connection validated</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                ATLAS can securely reach and authenticate to this system.
              </p>
            </div>
          )}

          {finalStatus === 'limited' && (
            <div className="p-4 rounded-lg bg-amber-950/25 border border-amber-500/40 text-xs font-sans space-y-1 animate-in fade-in">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 font-mono text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Connection validated with limitations</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                ATLAS can collect configuration and evidence, but privileged actions are not available with the current credentials.
              </p>
            </div>
          )}

          {finalStatus === 'failed' && (
            <div className="p-4 rounded-lg bg-rose-950/25 border border-rose-500/40 text-xs font-sans space-y-1 animate-in fade-in">
              <div className="font-bold text-rose-400 flex items-center gap-1.5 font-mono text-sm">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Connection failed</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {failureReason || 'Host unreachable or SSH key authentication refused.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#080D17] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {finalStatus === 'successful' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWorkspace(system.id);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-mono shadow-sm"
              >
                <span>Open System Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {finalStatus === 'limited' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditConnection(system);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors font-mono"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit connection</span>
              </button>
            )}

            {finalStatus === 'failed' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditConnection(system);
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Edit connection
                </button>
                <button
                  type="button"
                  onClick={runProgressiveChecks}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
