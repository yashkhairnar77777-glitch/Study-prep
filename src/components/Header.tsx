import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  ArrowUpRight,
  Clock,
  Play,
  Pause,
  Flame,
  Search,
  Bell,
} from 'lucide-react';
import { UserProfile, AppView } from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';
import { useNotifications } from '../contexts/NotificationContext';
import { OryqenLogo } from './OryqenLogo';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenMobileMenu: () => void;
  onOpenProfile: () => void;
  profile: UserProfile;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenLanding: () => void;
  streakCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenMobileMenu,
  onOpenProfile,
  profile,
  isDark,
  onToggleTheme,
  onOpenLanding,
  streakCount = 3,
}) => {
  const {
    mode,
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    setIsOpenModal,
  } = usePomodoro();

  const {
    setIsOpenModal: setIsOpenNotificationModal,
    unreadCount,
    dueFlashcardCount,
    pendingTasksCount,
  } = useNotifications();

  const totalAlerts = unreadCount > 0 ? unreadCount : dueFlashcardCount + pendingTasksCount;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const viewTitles: Record<AppView, string> = {
    landing: 'Home',
    dashboard: 'Dashboard',
    generator: 'AI Study Generator',
    chat: 'AI Tutor',
    photo: 'Photo Question Solver',
    doc: 'PDF & Document Analysis',
    exam: 'Mock Tests & Exam Generator',
    mock_test: 'Timed Exam Simulation',
    revision: 'Smart Flashcards',
    planner: 'Study Planner',
    notes: 'Study Notes',
    progress: 'Learning Diagnostics',
    pricing: 'Plans & Upgrades',
  };

  return (
    <header className="sticky top-0 z-30 h-15 border-b backdrop-blur-md px-3 sm:px-6 transition-colors bg-white/85 dark:bg-[#0b101f]/90 border-slate-200/80 dark:border-[#19233d]">
      <div className="flex h-full items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Current View Breadcrumb */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block md:hidden">
              <OryqenLogo size="sm" showWordmark={false} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {viewTitles[currentView] || 'ORYQEN STUDY AI'}
                </span>
                <span className="hidden sm:inline-flex text-[11px] text-slate-400 font-normal">
                  ·
                </span>
                <span className="hidden sm:inline-flex text-xs font-semibold text-violet-600 dark:text-violet-400">
                  {profile.selectedClass || profile.grade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Top Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-[#131b2f] border border-slate-200/60 dark:border-[#1e2a47] text-xs font-semibold">
          {[
            { id: 'dashboard' as const, label: 'Dashboard' },
            { id: 'generator' as const, label: 'Study Gen' },
            { id: 'chat' as const, label: 'AI Tutor' },
            { id: 'photo' as const, label: 'Photo Solver' },
            { id: 'doc' as const, label: 'PDF Analysis' },
            { id: 'exam' as const, label: 'Mocks' },
            { id: 'revision' as const, label: 'Flashcards' },
            { id: 'planner' as const, label: 'Planner' },
            { id: 'notes' as const, label: 'Notes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === tab.id
                  ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Controls: Pomodoro Timer, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Pomodoro Focus Timer Pill */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#131b2f] border border-slate-200/80 dark:border-[#1e2a47] rounded-xl p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isRunning
                  ? mode === 'focus'
                    ? 'text-violet-600 dark:text-violet-300'
                    : 'text-emerald-600 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
              title="Open Focus Timer Modal"
            >
              <Clock
                className={`w-3.5 h-3.5 ${
                  isRunning
                    ? mode === 'focus'
                      ? 'text-violet-600 dark:text-violet-400 animate-pulse'
                      : 'text-emerald-500 animate-pulse'
                    : 'text-slate-500'
                }`}
              />
              <span className="font-mono font-bold tracking-tight text-xs">
                {timeFormatted}
              </span>
              <span className="hidden xl:inline text-[10px] text-slate-400 uppercase font-medium">
                {mode === 'focus' ? 'Focus' : 'Break'}
              </span>
            </button>

            {/* Quick 1-click play/pause inside header pill */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                if (isRunning) pauseTimer();
                else startTimer();
              }}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
              title={isRunning ? 'Pause Timer' : 'Start Focus Timer'}
              aria-label={isRunning ? 'Pause Timer' : 'Start Focus Timer'}
            >
              {isRunning ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
            </button>
          </div>

          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setIsOpenNotificationModal(true)}
            aria-label="Open Notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Study Alerts (${dueFlashcardCount} reviews due, ${pendingTasksCount} tasks pending)`}
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600 dark:bg-violet-400" />
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
          </button>

          {/* Student Profile Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl p-1 sm:px-2 sm:py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-100"
            title="Account & Study Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {profile.name ? profile.name[0].toUpperCase() : 'S'}
            </div>
            <span className="hidden sm:inline font-bold truncate max-w-28 text-left">
              {profile.name || 'Student'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
