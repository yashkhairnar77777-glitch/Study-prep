import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  MessageSquare,
  Camera,
  FileText,
  Award,
  Layers,
  LayoutDashboard,
  Calendar,
  BookMarked,
  BarChart3,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
} from 'lucide-react';
import { Conversation, UserProfile, AppView } from '../types';
import { OryqenLogo } from './OryqenLogo';

interface SidebarProps {
  conversations: Conversation[];
  activeConvoId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  profile: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfile: () => void;
  onExportData: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenLanding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConvoId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  currentView,
  setCurrentView,
  profile,
  isOpenMobile,
  onCloseMobile,
  onOpenProfile,
  onExportData,
  isDark,
  onOpenLanding,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const startRename = (c: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const mainNav = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator' as const, label: 'Study Generator', icon: Sparkles },
    { id: 'chat' as const, label: 'AI Tutor', icon: MessageSquare },
    { id: 'photo' as const, label: 'Photo Solver', icon: Camera },
    { id: 'doc' as const, label: 'PDF Analysis', icon: FileText },
  ];

  const toolsNav = [
    { id: 'exam' as const, label: 'Mock Tests & Exams', icon: Award },
    { id: 'revision' as const, label: 'Flashcards', icon: Layers },
    { id: 'planner' as const, label: 'Study Planner', icon: Calendar },
    { id: 'notes' as const, label: 'Study Notes', icon: BookMarked },
    { id: 'progress' as const, label: 'Learning Diagnostics', icon: BarChart3 },
  ];

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#19233d] bg-[#0b101f] text-slate-200 transition-all duration-300 md:static ${
          isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsedDesktop ? 'md:w-18' : 'md:w-68'}`}
      >
        {/* Brand & Collapse Header */}
        <div className="p-3.5 border-b border-[#19233d] flex items-center justify-between">
          {!isCollapsedDesktop ? (
            <div
              onClick={onOpenLanding}
              className="cursor-pointer group select-none"
              title="ORYQEN STUDY AI Overview"
            >
              <OryqenLogo size="md" showWordmark={true} />
            </div>
          ) : (
            <div
              onClick={onOpenLanding}
              className="mx-auto cursor-pointer"
              title="ORYQEN STUDY AI"
            >
              <OryqenLogo size="sm" showWordmark={false} />
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsedDesktop ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Primary Action: New AI Chat */}
        <div className="p-3 border-b border-[#19233d]">
          <button
            type="button"
            onClick={() => {
              onNewConversation();
              setCurrentView('chat');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-xl clay-btn-primary px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
              isCollapsedDesktop ? 'p-2.5' : ''
            }`}
            title="Start New Chat Session"
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" />
            {!isCollapsedDesktop && <span>New AI Session</span>}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="p-2.5 space-y-4 flex-1 overflow-y-auto">
          {/* Main Workspace Navigation */}
          <div>
            {!isCollapsedDesktop && (
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Workspace
              </p>
            )}
            <nav className="space-y-1">
              {mainNav.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white font-bold shadow-sm shadow-violet-900/40 border border-violet-400/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!isCollapsedDesktop && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Practice & Retention Tools */}
          <div>
            {!isCollapsedDesktop && (
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Practice & Retention
              </p>
            )}
            <nav className="space-y-1">
              {toolsNav.map(item => {
                const Icon = item.icon;
                const isActive =
                  currentView === item.id ||
                  (item.id === 'exam' && currentView === 'mock_test');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white font-bold shadow-sm shadow-violet-900/40 border border-violet-400/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!isCollapsedDesktop && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Recent AI Chat History (when not collapsed) */}
          {!isCollapsedDesktop && (
            <div className="pt-2 border-t border-[#19233d]">
              <div className="flex items-center justify-between px-2.5 mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Recent Sessions ({conversations.length})
                </span>
              </div>

              {conversations.length > 5 && (
                <div className="px-2 mb-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-1.5 rounded-lg bg-[#070b14] border border-[#1e2a47] focus:outline-none focus:ring-1 focus:ring-violet-500 text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <p className="text-[11px] text-slate-400 px-2.5 py-1">
                    No matching conversations.
                  </p>
                ) : (
                  filteredConversations.map(c => {
                    const isSelected = activeConvoId === c.id && currentView === 'chat';
                    const isEditing = editingId === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectConversation(c.id);
                          setCurrentView('chat');
                          onCloseMobile();
                        }}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-violet-600/25 text-violet-300 font-semibold border border-violet-500/30'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full rounded bg-[#070b14] px-1.5 py-0.5 text-xs border border-violet-500 text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={e => saveRename(c.id, e)}
                              className="p-1 hover:text-emerald-400"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelRename}
                              className="p-1 hover:text-rose-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 truncate pr-2">
                              <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                              <span className="truncate">{c.title}</span>
                            </div>

                            <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={e => startRename(c, e)}
                                className="p-1 text-slate-400 hover:text-white rounded"
                                title="Rename"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  onDeleteConversation(c.id);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Settings, Backup, Overview */}
        <div className="p-3 border-t border-[#19233d] space-y-1">
          <button
            type="button"
            onClick={onOpenProfile}
            className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors ${
              isCollapsedDesktop ? 'justify-center' : ''
            }`}
            title="Profile & Preferences"
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isCollapsedDesktop && <span>Settings & Profile</span>}
          </button>

          <button
            type="button"
            onClick={onExportData}
            className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors ${
              isCollapsedDesktop ? 'justify-center' : ''
            }`}
            title="Export Study Data (JSON)"
          >
            <Download className="h-4 w-4 shrink-0" />
            {!isCollapsedDesktop && <span>Backup Study Data</span>}
          </button>

          {!isCollapsedDesktop && (
            <button
              type="button"
              onClick={onOpenLanding}
              className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-violet-400 transition-colors"
            >
              <span>Platform Overview</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
