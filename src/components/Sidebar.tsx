import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Camera,
  FileText,
  Award,
  Layers,
  LayoutDashboard,
  Calendar,
  BookMarked,
  BarChart3,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  Download,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import { Conversation, UserProfile, AppView } from '../types';
import { IMAGES } from '../assets/images';

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
  onToggleTheme,
  onOpenLanding,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);

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
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'chat' as const, label: 'AI Chat', icon: MessageSquare },
    { id: 'photo' as const, label: 'Photo Solver', icon: Camera },
    { id: 'doc' as const, label: 'PDF Analysis', icon: FileText },
  ];

  const toolsNav = [
    { id: 'exam' as const, label: 'Mock Tests', icon: Award },
    { id: 'revision' as const, label: 'Flashcards', icon: Layers },
    { id: 'planner' as const, label: 'Study Planner', icon: Calendar },
    { id: 'notes' as const, label: 'Notes', icon: BookMarked },
    { id: 'progress' as const, label: 'Progress', icon: BarChart3 },
  ];

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 md:static ${
          isDark
            ? 'bg-[#0e1526] border-white/10 text-slate-200'
            : 'bg-white/90 border-slate-200/80 text-slate-800'
        } ${isOpenMobile ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'} ${
          isCollapsedDesktop ? 'md:w-18' : 'md:w-68'
        }`}
      >
        {/* Brand & Collapse Header */}
        <div className="p-3.5 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          {!isCollapsedDesktop ? (
            <div
              onClick={onOpenLanding}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="View Public Landing Page"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-indigo-600">
                <img
                  src={IMAGES.CLAY_MASCOT}
                  alt="Mascot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  ORYQEN <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/50">AI</span>
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-400">Clay Study Platform</p>
              </div>
            </div>
          ) : (
            <div
              onClick={onOpenLanding}
              className="mx-auto w-8 h-8 rounded-xl overflow-hidden cursor-pointer"
            >
              <img src={IMAGES.CLAY_MASCOT} alt="Mascot" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsedDesktop ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Primary Action: New Chat */}
        <div className="p-3 border-b border-slate-200/60 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              onNewConversation();
              setCurrentView('chat');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-xl clay-btn-primary px-3 py-2.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all ${
              isCollapsedDesktop ? 'p-2.5' : ''
            }`}
            title="Start New Chat"
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" />
            {!isCollapsedDesktop && <span>New AI Chat</span>}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-2.5 space-y-4 flex-1 overflow-y-auto">
          {/* Section: Main Tools */}
          <div>
            {!isCollapsedDesktop && (
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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
                        ? 'clay-btn-secondary text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/60 dark:border-indigo-800/60'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-white'
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

          {/* Section: Study Tools */}
          <div>
            {!isCollapsedDesktop && (
              <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Study Tools
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
                        ? 'clay-btn-secondary text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/60 dark:border-indigo-800/60'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-white'
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

          {/* Conversations History */}
          {!isCollapsedDesktop && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-white/10">
              <div className="flex items-center justify-between px-2.5 mb-1.5">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Recent Chats
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold tabular-nums">
                  {conversations.length}
                </span>
              </div>

              {conversations.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-slate-600 dark:text-slate-400">
                  No saved conversations yet.
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {conversations.slice(0, 10).map(convo => {
                    const isSelected = convo.id === activeConvoId && currentView === 'chat';
                    const isEditing = editingId === convo.id;

                    return (
                      <div
                        key={convo.id}
                        onClick={() => {
                          onSelectConversation(convo.id);
                          setCurrentView('chat');
                          onCloseMobile();
                        }}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-800/60'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="w-full rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-900 border border-indigo-400 outline-none text-slate-800 dark:text-slate-100"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveRename(convo.id, e as unknown as React.MouseEvent);
                                if (e.key === 'Escape') cancelRename(e as unknown as React.MouseEvent);
                              }}
                            />
                            <button
                              type="button"
                              onClick={e => saveRename(convo.id, e)}
                              className="text-emerald-500 hover:text-emerald-600 p-0.5"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelRename}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 truncate">
                              <MessageSquare className="h-3 w-3 shrink-0 opacity-60" />
                              <span className="truncate">{convo.title}</span>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                              <button
                                type="button"
                                onClick={e => startRename(convo, e)}
                                className="p-1 hover:text-indigo-600 rounded"
                                title="Rename"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  onDeleteConversation(convo.id);
                                }}
                                className="p-1 hover:text-rose-600 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-2.5 border-t border-slate-200/60 dark:border-white/10 space-y-2">
          {/* Upgrade to Pro Card */}
          {!isCollapsedDesktop && (
            <div
              onClick={() => {
                setCurrentView('pricing');
                onCloseMobile();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-300/40 dark:border-indigo-500/20 cursor-pointer hover:border-indigo-400 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Scholar Pro</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Unlimited exams & vision</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Upgrade</span>
            </div>
          )}

          {/* Theme & Profile Bar */}
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={onOpenProfile}
              className={`flex-1 flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                isCollapsedDesktop ? 'justify-center' : ''
              }`}
              title="Profile and Settings"
            >
              <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                {profile.name ? profile.name[0].toUpperCase() : 'S'}
              </div>
              {!isCollapsedDesktop && (
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {profile.name || 'Student'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {profile.selectedClass || profile.grade}
                  </div>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
