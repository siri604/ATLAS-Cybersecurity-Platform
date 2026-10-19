import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { ComplianceOverview } from './ComplianceOverview';
import { ComplianceAssessments } from './ComplianceAssessments';
import { ComplianceFindings } from './ComplianceFindings';
import { CompliancePOAM } from './CompliancePOAM';
import { ComplianceDrift } from './ComplianceDrift';
import { ComplianceSettingsModal } from './ComplianceSettingsModal';
import { DefineAssessment } from './DefineAssessment';
import { AssessmentProgress } from './AssessmentProgress';

export const ComplianceModule: React.FC = () => {
  const { 
    setSelectedAssessmentId,
    selectedAssessmentId,
    setSelectedFinding,
    findings,
    startAssessment
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'findings' | 'poam' | 'drift' | 'define-assessment' | 'assessment-progress'>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [launchedSystemId, setLaunchedSystemId] = useState<string>('sys-payments-prod');
  const [launchedFrameworkId, setLaunchedFrameworkId] = useState<string>('cis-linux-v1');

  const handleOpenAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    setActiveTab('assessments');
  };

  const handleOpenFinding = (id: string) => {
    const fnd = findings.find(f => f.id === id);
    if (fnd) {
      setSelectedFinding(fnd);
    }
    setActiveTab('findings');
  };

  const handleLaunchAssessment = (systemId: string, frameworkId: string) => {
    setLaunchedSystemId(systemId);
    setLaunchedFrameworkId(frameworkId);
    setActiveTab('assessment-progress');
  };

  return (
    <div className="space-y-6">
      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <ComplianceOverview
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenAssessment={handleOpenAssessment}
          onOpenFinding={handleOpenFinding}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {activeTab === 'define-assessment' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-[#00E5FF] font-bold">Define Assessment</span>
            </div>
          </div>
          <DefineAssessment
            onCancel={() => setActiveTab('overview')}
            onLaunch={handleLaunchAssessment}
          />
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold">Assessments</span>
            </div>
          </div>
          <ComplianceAssessments
            key={selectedAssessmentId}
            onOpenFinding={handleOpenFinding}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNavigateDefineAssessment={() => setActiveTab('define-assessment')}
          />
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold">Findings</span>
            </div>
          </div>
          <ComplianceFindings />
        </div>
      )}

      {activeTab === 'poam' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold">POA&M</span>
            </div>
          </div>
          <CompliancePOAM />
        </div>
      )}

      {activeTab === 'drift' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold">Continuous Monitoring</span>
            </div>
          </div>
          <ComplianceDrift onOpenFinding={handleOpenFinding} />
        </div>
      )}

      {activeTab === 'assessment-progress' && (
        <div className="space-y-4 font-sans">
          {/* Subnavigation Bar when in Sub-tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
              >
                ← Back to Overview
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-[#00E5FF] font-bold">Assessment Progress</span>
            </div>
          </div>
          <AssessmentProgress
            systemId={launchedSystemId}
            frameworkId={launchedFrameworkId}
            onComplete={() => {
              const assessment = startAssessment(launchedSystemId, launchedFrameworkId);
              if (assessment && assessment.id) {
                setSelectedAssessmentId(assessment.id);
              }
              setActiveTab('assessments');
            }}
            onBack={() => setActiveTab('assessments')}
          />
        </div>
      )}

      {/* Settings Modal (Admin / SuperAdmin) */}
      <ComplianceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
