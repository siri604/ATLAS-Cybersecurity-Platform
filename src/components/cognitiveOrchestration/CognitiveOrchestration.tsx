import React, { useState } from 'react';
import { MissionList } from './MissionList';
import { MissionDetail } from './MissionDetail';

export const CognitiveOrchestration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Missions' | 'Approvals' | 'Activity'>('Missions');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sans">
      <h1 className="text-xl font-bold text-white tracking-wide">Cognitive Orchestration</h1>

      {activeTab === 'Missions' && !selectedMissionId && (
          <div className="flex gap-4 border-b border-slate-800">
            {(['Missions', 'Approvals', 'Activity'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
      )}

      {activeTab === 'Missions' && selectedMissionId && (
          <MissionDetail missionId={selectedMissionId} onBack={() => setSelectedMissionId(null)} />
      )}
      
      {activeTab === 'Missions' && !selectedMissionId && <MissionList onSelectMission={setSelectedMissionId} />}
      {activeTab === 'Approvals' && <div className="text-slate-400 text-sm">Approvals view</div>}
      {activeTab === 'Activity' && <div className="text-slate-400 text-sm">Activity log</div>}
    </div>
  );
};
