import React, { useState } from 'react';
import { X, AlertCircle, Link, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { PlatformFinding, ComplianceControl, ControlResult } from '../../types';

interface EvidenceGapModalProps {
  finding?: PlatformFinding;
  control?: ComplianceControl;
  assessmentId?: string;
  onClose: () => void;
  onUpdateResult: (assessmentId: string, controlId: string, result: ControlResult) => void;
  configureIntegration: (integrationId: string) => void;
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const EvidenceGapModal: React.FC<EvidenceGapModalProps> = ({ 
  finding, 
  control, 
  assessmentId,
  onClose, 
  onUpdateResult,
  configureIntegration,
  addToast
}) => {
  if (!assessmentId || !control) return null;

  const [view, setView] = useState<'main' | 'upload' | 'attest'>('main');
  const [connectProgress, setConnectProgress] = useState<number>(0);
  const [connectStatus, setConnectStatus] = useState<string>('');
  const [finalResult, setFinalResult] = useState<ControlResult | null>(null);

  const handleConnect = () => {
    const isWazuh = control.evidenceSource === 'Wazuh';
    configureIntegration(isWazuh ? 'int-wazuh' : 'int-identity');
    
    setConnectProgress(25);
    setConnectStatus('Connecting to ' + (isWazuh ? 'Wazuh' : 'Identity Provider'));

    setTimeout(() => {
      setConnectProgress(50);
      setConnectStatus('Collecting Evidence');
    }, 2000);

    setTimeout(() => {
      setConnectProgress(75);
      setConnectStatus('Evaluating Control');
    }, 4000);

    setTimeout(() => {
      setConnectProgress(100);
      setConnectStatus('Evaluation Complete');
      const finalStatus = 'Needs Review';
      setFinalResult(finalStatus);
      onUpdateResult(assessmentId, control.id, finalStatus);
      
      // Auto-close after showing result
      setTimeout(onClose, 1500);
    }, 6000);
  };

  const handleManualAction = (result: ControlResult) => {
    setConnectProgress(25);
    setConnectStatus('Submitting Evidence/Attestation');
    
    setTimeout(() => {
      setConnectProgress(50);
      setConnectStatus('Processing Submission');
    }, 1500);

    setTimeout(() => {
      setConnectProgress(100);
      setConnectStatus('Submission Complete');
      setFinalResult(result);
      onUpdateResult(assessmentId, control.id, result);

      // Auto-close after showing result
      setTimeout(onClose, 1500);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0E1420] border border-rose-500/50 rounded-lg w-full max-w-lg p-6 space-y-4">
        {/* Progress Panel visible in any view */}
        {connectProgress > 0 && (
          <div className="space-y-2 py-2 border-b border-rose-900/50 pb-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{connectStatus}</span>
              <span>{connectProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${connectProgress === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                style={{ width: `${connectProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-rose-900/50 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {view !== 'main' && (
              <button onClick={() => setView('main')} className="hover:text-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <AlertCircle className="w-5 h-5 text-rose-500" />
            {view === 'main' ? 'Evidence Gap Detected' : view === 'upload' ? 'Upload Evidence' : 'Add Attestation'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {view === 'main' && (
          <div className="space-y-3 text-sm text-slate-300">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-400">Control:</span>
              <span className="text-white font-mono">{finding?.controlRef || control.id}</span>
              <span className="text-slate-400">Required Evidence:</span>
              <span className="text-white">{finding ? 'Full System Configuration Audit' : control.title}</span>
              <span className="text-slate-400">Expected Source:</span>
              <span className="text-white">{finding ? 'OpenSCAP / Wazuh' : control.evidenceSource}</span>
              <span className="text-slate-400">Current Status:</span>
              <span className={finalResult ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {finalResult || 'Missing Evidence'}
              </span>
            </div>
            
            {finalResult && (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700">
                <span className="text-slate-400">Result:</span>
                <span className="text-white font-bold">{finalResult}</span>
              </div>
            )}
            
            <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded text-xs text-rose-200">
              Reason: Expected evidence was not returned from {finding ? 'OpenSCAP/Wazuh' : control.evidenceSource || 'the configured source'}.
            </div>
          </div>
        )}

        {view === 'upload' && (
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center text-slate-400 text-sm">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              Click to upload or drag & drop audit artifact
            </div>
            <button
              onClick={() => handleManualAction('Needs Review')}
              className="w-full py-2 bg-cyan-900 hover:bg-cyan-800 text-white rounded text-sm font-semibold"
            >
              Submit Evidence
            </button>
          </div>
        )}

        {view === 'attest' && (
          <div className="space-y-4 py-4">
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-sm text-white"
              placeholder="Enter attestation statement..."
              rows={3}
            />
            <input 
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
              placeholder="Attester Name"
            />
            <button
              onClick={() => handleManualAction('Needs Review')}
              className="w-full py-2 bg-cyan-900 hover:bg-cyan-800 text-white rounded text-sm font-semibold"
            >
              Submit Attestation
            </button>
          </div>
        )}

        {view === 'main' && (
          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={handleConnect}
              disabled={connectProgress > 0 && connectProgress < 100}
              className="flex items-center gap-2 px-4 py-2 rounded bg-rose-900 hover:bg-rose-800 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Link className="w-4 h-4" />
              Connect Evidence Source
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setView('upload')}
                disabled={connectProgress > 0 && connectProgress < 100}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Upload Evidence
              </button>
              <button
                onClick={() => setView('attest')}
                disabled={connectProgress > 0 && connectProgress < 100}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Add Attestation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
