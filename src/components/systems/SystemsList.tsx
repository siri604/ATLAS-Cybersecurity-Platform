import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Plus, 
  Search, 
  ArrowRight, 
  MoreVertical,
  Pencil,
  CheckCircle2,
  Pause,
  Play,
  Trash2,
  ChevronDown,
  X
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { SystemWorkspace } from './SystemWorkspace';
import { SystemOnboardingModal } from '../onboarding/SystemOnboardingModal';
import { SettingsTabsHeader } from '../settings/SettingsTabsHeader';
import { ConnectionTestModal } from './ConnectionTestModal';
import { PauseSystemModal } from './PauseSystemModal';
import { ResumeSystemModal } from './ResumeSystemModal';
import { DeleteSystemModal } from './DeleteSystemModal';
import { AtlasSystem } from '../../types';

export const SystemsList: React.FC = () => {
  const { 
    systems, 
    selectedSystemId, 
    setSelectedSystemId, 
    pauseSystem,
    resumeSystem,
    removeSystem,
    addToast
  } = usePlatform();

  const [search, setSearch] = useState<string>('');
  const [envFilter, setEnvFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [editSystemTarget, setEditSystemTarget] = useState<AtlasSystem | null>(null);
  
  const [testSystemTarget, setTestSystemTarget] = useState<AtlasSystem | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  const [pauseSystemTarget, setPauseSystemTarget] = useState<AtlasSystem | null>(null);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);

  const [resumeSystemTarget, setResumeSystemTarget] = useState<AtlasSystem | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);

  const [deleteSystemTarget, setDeleteSystemTarget] = useState<AtlasSystem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Active overflow menu tracking
  const [activeMenuSystemId, setActiveMenuSystemId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close overflow menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuSystemId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // If a specific system is selected, show its workspace
  if (selectedSystemId) {
    const activeSys = systems.find(s => s.id === selectedSystemId);
    if (activeSys) {
      return (
        <SystemWorkspace 
          system={activeSys} 
          onBack={() => setSelectedSystemId(null)} 
        />
      );
    }
  }

  const totalSystems = systems.length;
  const connectedCount = systems.filter(s => s.connectionStatus === 'Connected').length;
  const monitoringActiveCount = systems.filter(s => s.systemStatus === 'Ready' || s.monitoringStatus === 'Active').length;
  const needsAttentionCount = systems.filter(s => s.systemStatus === 'Needs Attention' || s.systemStatus === 'Paused' || s.monitoringStatus === 'Paused').length;

  const filteredSystems = systems.filter(sys => {
    const matchesSearch = sys.name.toLowerCase().includes(search.toLowerCase()) || 
                          sys.hostname.toLowerCase().includes(search.toLowerCase()) ||
                          (sys.connectionSubtitle && sys.connectionSubtitle.toLowerCase().includes(search.toLowerCase()));
    const matchesEnv = envFilter === 'ALL' || sys.environment === envFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'Connected' && sys.connectionStatus === 'Connected') ||
                          (statusFilter === 'Ready' && sys.systemStatus === 'Ready') ||
                          (statusFilter === 'Needs attention' && (sys.systemStatus === 'Needs Attention' || sys.systemStatus === 'Paused'));
    return matchesSearch && matchesEnv && matchesStatus;
  });

  const isFilterActive = search !== '' || envFilter !== 'ALL' || statusFilter !== 'ALL';

  const resetFilters = () => {
    setSearch('');
    setEnvFilter('ALL');
    setStatusFilter('ALL');
  };

  // Handlers for overflow menu actions
  const handleOpenEdit = (sys: AtlasSystem) => {
    setActiveMenuSystemId(null);
    setEditSystemTarget(sys);
    setIsOnboardingOpen(true);
  };

  const handleOpenTest = (sys: AtlasSystem) => {
    setActiveMenuSystemId(null);
    setTestSystemTarget(sys);
    setIsTestModalOpen(true);
  };

  const handleOpenPause = (sys: AtlasSystem) => {
    setActiveMenuSystemId(null);
    setPauseSystemTarget(sys);
    setIsPauseModalOpen(true);
  };

  const handleConfirmPause = () => {
    if (!pauseSystemTarget) return;
    pauseSystem(pauseSystemTarget.id);
    addToast(`${pauseSystemTarget.name} paused`, 'warning');
    setIsPauseModalOpen(false);
    setPauseSystemTarget(null);
  };

  const handleOpenResume = (sys: AtlasSystem) => {
    setActiveMenuSystemId(null);
    setResumeSystemTarget(sys);
    setIsResumeModalOpen(true);
  };

  const handleConfirmResume = () => {
    if (!resumeSystemTarget) return;
    const targetStatus = resumeSystemTarget.name === 'Core Database Primary' ? 'Needs Attention' : 'Ready';
    resumeSystem(resumeSystemTarget.id, targetStatus);
    addToast(`${resumeSystemTarget.name} resumed`, 'success');
    setIsResumeModalOpen(false);
    setResumeSystemTarget(null);
  };

  const handleOpenDelete = (sys: AtlasSystem) => {
    setActiveMenuSystemId(null);
    setDeleteSystemTarget(sys);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteSystemTarget) return;
    const systemName = deleteSystemTarget.name;
    removeSystem(deleteSystemTarget.id);
    addToast(`${systemName} removed from ATLAS`, 'error');
    setIsDeleteModalOpen(false);
    setDeleteSystemTarget(null);
  };

  if (isOnboardingOpen) {
    return (
      <SystemOnboardingModal
        isOpen={isOnboardingOpen}
        editSystem={editSystemTarget}
        onClose={() => {
          setIsOnboardingOpen(false);
          setEditSystemTarget(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs Line & Horizontal Settings Navigation Tabs */}
      <SettingsTabsHeader currentTab="systems" subTitle="Systems" />

      {/* 2. Title & Subtitle + Add System CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="atlas-page-title">
            Systems
          </h1>
          <p className="atlas-page-desc">
            Systems connected to ATLAS
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              setEditSystemTarget(null);
              setIsOnboardingOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-black bg-[#00E5FF] hover:bg-[#33EAFF] transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] font-sans cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add System</span>
          </button>
        </div>
      </div>

      {/* 3. Top 4 KPI Cards (Interactive Filter Toggles) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono select-none">
        {/* TOTAL SYSTEMS */}
        <div 
          onClick={resetFilters}
          className={`border rounded-lg p-4 shadow-sm cursor-pointer transition-all ${
            statusFilter === 'ALL' && envFilter === 'ALL' && search === ''
              ? 'bg-[#0E1A29] border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
              : 'bg-[#0A101C] border-slate-800/90 hover:border-slate-700 hover:bg-[#0C1422]'
          }`}
          title="Click to view all systems"
        >
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center justify-between">
            <span>TOTAL SYSTEMS</span>
            {statusFilter === 'ALL' && envFilter === 'ALL' && search === '' && (
              <span className="text-[9px] text-cyan-400 font-sans">ALL</span>
            )}
          </div>
          <div className="text-3xl font-bold text-white mt-2 tabular-nums">
            {totalSystems}
          </div>
        </div>

        {/* CONNECTED */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'Connected' ? 'ALL' : 'Connected')}
          className={`border rounded-lg p-4 shadow-sm cursor-pointer transition-all ${
            statusFilter === 'Connected'
              ? 'bg-[#081F1A] border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50'
              : 'bg-[#0A101C] border-slate-800/90 hover:border-slate-700 hover:bg-[#0C1422]'
          }`}
          title="Click to filter by connected systems"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
              <span>CONNECTED</span>
            </div>
            {statusFilter === 'Connected' && (
              <span className="text-[9px] text-emerald-400 font-sans">FILTERED</span>
            )}
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2 tabular-nums">
            {connectedCount}
          </div>
        </div>

        {/* MONITORING ACTIVE */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'Ready' ? 'ALL' : 'Ready')}
          className={`border rounded-lg p-4 shadow-sm cursor-pointer transition-all ${
            statusFilter === 'Ready'
              ? 'bg-[#071F2C] border-cyan-500/70 shadow-[0_0_12px_rgba(0,229,255,0.2)] ring-1 ring-cyan-500/50'
              : 'bg-[#0A101C] border-slate-800/90 hover:border-slate-700 hover:bg-[#0C1422]'
          }`}
          title="Click to filter by active monitoring"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00E5FF]" />
              <span>MONITORING ACTIVE</span>
            </div>
            {statusFilter === 'Ready' && (
              <span className="text-[9px] text-cyan-400 font-sans">FILTERED</span>
            )}
          </div>
          <div className="text-3xl font-bold text-cyan-400 mt-2 tabular-nums">
            {monitoringActiveCount}
          </div>
        </div>

        {/* NEEDS ATTENTION */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'Needs attention' ? 'ALL' : 'Needs attention')}
          className={`border rounded-lg p-4 shadow-sm cursor-pointer transition-all ${
            statusFilter === 'Needs attention'
              ? 'bg-[#241708] border-amber-500/70 shadow-[0_0_12px_rgba(251,191,36,0.2)] ring-1 ring-amber-500/50'
              : 'bg-[#0A101C] border-slate-800/90 hover:border-slate-700 hover:bg-[#0C1422]'
          }`}
          title="Click to filter by systems needing attention"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
              <span>NEEDS ATTENTION</span>
            </div>
            {statusFilter === 'Needs attention' && (
              <span className="text-[9px] text-amber-400 font-sans">FILTERED</span>
            )}
          </div>
          <div className="text-3xl font-bold text-amber-400 mt-2 tabular-nums">
            {needsAttentionCount}
          </div>
        </div>
      </div>

      {/* 4. Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by system name, type, or tags..."
            className="w-full bg-[#0A101C] border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Active Filter Clear Tag */}
          {isFilterActive && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors font-mono cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}

          {/* Environment Filter */}
          <div className="relative">
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="bg-[#0A101C] border border-slate-800 rounded-lg px-3 py-2 pr-8 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none font-sans cursor-pointer"
            >
              <option value="ALL">All Environments</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
              <option value="Test">Test</option>
              <option value="Disaster Recovery">Disaster Recovery</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0A101C] border border-slate-800 rounded-lg px-3 py-2 pr-8 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none font-sans cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Ready">Ready</option>
              <option value="Needs attention">Needs Attention / Paused</option>
              <option value="Connected">Connected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. Systems Table (Exact Columns: NAME, TYPE, ENVIRONMENT, STATUS, LAST ACTIVITY, ACTION) */}
      <div className="bg-[#080E18] border border-slate-800/90 rounded-lg overflow-visible shadow-xl">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#060B14] text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-3">TYPE</th>
                <th className="py-3 px-3">ENVIRONMENT</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">LAST ACTIVITY</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredSystems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-mono text-xs">
                    No systems matching active filter criteria.{' '}
                    <button 
                      onClick={resetFilters} 
                      className="text-cyan-400 hover:underline ml-1"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredSystems.map((sys) => {
                  const isPaused = sys.systemStatus === 'Paused' || sys.monitoringStatus === 'Paused';
                  const isNeedsAttention = sys.systemStatus === 'Needs Attention' && !isPaused;
                  const isReady = !isPaused && !isNeedsAttention;

                  const isMenuOpen = activeMenuSystemId === sys.id;

                  return (
                    <tr 
                      key={sys.id} 
                      className="hover:bg-[#0D1524] transition-colors group relative"
                    >
                      {/* NAME with Server Icon Box & Subtitle */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0C1B2A] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm group-hover:border-cyan-400/60 transition-colors">
                            <Server className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors font-mono text-xs">
                              {sys.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {sys.connectionSubtitle || `${sys.authMethod} · ${sys.hostname}:${sys.port}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="py-3 px-3 text-slate-300 font-mono text-xs">
                        {sys.type}
                      </td>

                      {/* ENVIRONMENT */}
                      <td className="py-3 px-3 font-mono">
                        <span className="text-[11px] px-2 py-0.5 rounded border border-slate-700/80 bg-[#121A28] text-slate-300">
                          {sys.environment}
                        </span>
                      </td>

                      {/* STATUS (Exact match to screenshot) */}
                      <td className="py-3 px-3 font-mono">
                        {isReady && (
                          <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                            <span>Ready</span>
                          </span>
                        )}

                        {isNeedsAttention && (
                          <span className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
                            <span>Needs Attention</span>
                          </span>
                        )}

                        {isPaused && (
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            <span>Paused</span>
                          </span>
                        )}
                      </td>

                      {/* LAST ACTIVITY */}
                      <td className="py-3 px-3 text-slate-300 font-mono text-xs">
                        {sys.lastHeartbeat}
                      </td>

                      {/* ACTION: Workspace → and three-dot overflow button */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSystemId(sys.id);
                            }}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors font-sans hover:translate-x-0.5 cursor-pointer"
                          >
                            <span>Workspace</span>
                            <span className="text-cyan-400 font-bold">→</span>
                          </button>

                          {/* Overflow Menu Button */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuSystemId(isMenuOpen ? null : sys.id);
                              }}
                              className={`w-7 h-7 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                isMenuOpen 
                                  ? 'border-cyan-400 text-cyan-400 bg-[#0E1A29] shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
                                  : 'border-slate-700/80 bg-[#0A121F] text-slate-400 hover:text-white hover:border-cyan-500/70 hover:bg-[#0E1A29]'
                              }`}
                              title="System options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Floating Dropdown Popover (Exact match to screenshot) */}
                            {isMenuOpen && (
                              <div 
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-1.5 w-44 bg-[#090F1A] border border-slate-700/90 rounded-lg shadow-2xl py-1 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-800/80"
                              >
                                <div className="py-0.5">
                                  {/* Edit system */}
                                  <button
                                    onClick={() => handleOpenEdit(sys)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Edit system</span>
                                  </button>

                                  {/* Test connection */}
                                  <button
                                    onClick={() => handleOpenTest(sys)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Test connection</span>
                                  </button>

                                  {/* Pause system / Resume system */}
                                  {isPaused ? (
                                    <button
                                      onClick={() => handleOpenResume(sys)}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition-colors text-left cursor-pointer"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-emerald-400" />
                                      <span>Resume system</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenPause(sys)}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 transition-colors text-left cursor-pointer"
                                    >
                                      <Pause className="w-3.5 h-3.5" />
                                      <span>Pause system</span>
                                    </button>
                                  )}
                                </div>

                                <div className="py-0.5">
                                  {/* Delete system */}
                                  <button
                                    onClick={() => handleOpenDelete(sys)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete system</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Focused Connection Test Modal */}
      <ConnectionTestModal
        isOpen={isTestModalOpen}
        system={testSystemTarget}
        onClose={() => {
          setIsTestModalOpen(false);
          setTestSystemTarget(null);
        }}
        onEditConnection={(sys) => {
          setIsTestModalOpen(false);
          handleOpenEdit(sys);
        }}
        onOpenWorkspace={(systemId) => {
          setIsTestModalOpen(false);
          setSelectedSystemId(systemId);
        }}
      />

      {/* Pause Confirmation Modal */}
      <PauseSystemModal
        isOpen={isPauseModalOpen}
        system={pauseSystemTarget}
        onClose={() => {
          setIsPauseModalOpen(false);
          setPauseSystemTarget(null);
        }}
        onConfirm={handleConfirmPause}
      />

      {/* Resume Confirmation Modal */}
      <ResumeSystemModal
        isOpen={isResumeModalOpen}
        system={resumeSystemTarget}
        onClose={() => {
          setIsResumeModalOpen(false);
          setResumeSystemTarget(null);
        }}
        onConfirm={handleConfirmResume}
      />

      {/* Delete Destructive Confirmation Modal */}
      <DeleteSystemModal
        isOpen={isDeleteModalOpen}
        system={deleteSystemTarget}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteSystemTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
