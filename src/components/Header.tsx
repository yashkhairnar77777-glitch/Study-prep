import React, { useState, useEffect } from 'react';
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
  Crown,
  Sparkles,
  ShieldAlert,
  CreditCard,
  WifiOff,
  ArrowRightLeft,
} from 'lucide-react';
import { UserProfile, AppView, GoalConfig } from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';
import { useNotifications } from '../contexts/NotificationContext';
import { OryqenLogo } from './OryqenLogo';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenMobileMenu: () => void;
  onOpenProfile: () => void;
  profile: UserProfile;
  goalConfig: GoalConfig;
  onOpenGoalSwitcher: () => void;
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
  goalConfig,
  onOpenGoalSwitcher,
  isDark,
  onToggleTheme,
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

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const viewTitles: Record<AppView, string> = {
    landing: 'Home',
    dashboard: 'Dashboard',
    syllabus: 'Syllabus Tracker',
    generator: 'AI Study Generator',
    chat: goalConfig.kind === 'upsc' ? 'AI Tutor & Answer Writing' : 'AI Tutor',
    photo: 'Photo Question Solver',
    doc: goalConfig.kind === 'upsc' ? 'Current Affairs & PDF Analysis' : 'PDF & Document Analysis',
    exam: 'Mock Tests & Exam Generator',
    mock_test: 'Timed Exam Simulation',
    revision: 'Smart Flashcards',
    planner: 'Study Planner',
    notes: 'Study Notes',
    progress: 'Learning Diagnostics',
    pricing: 'Plans & Upgrades',
    my_subscription: 'My Subscription',
    admin_payments: 'Payment Management',
    timer: 'Smart AI Study Timer',
    ncert_hub: goalConfig.kind === 'neet' ? 'NCERT Revision Hub' : 'Subjects & Chapters (NCERT)',
  };

  return (
    <header className="sticky top-0 z-30 h-15 border-b backdrop-blur-md px-3 sm:px-6 transition-colors bg-white/85 dark:bg-[#0b101f]/90 border-slate-200/80 dark:border-[#19233d]">
      <div className="flex h-full items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger, Current View Title & Clickable Active Goal Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden sm:block md:hidden shrink-0">
              <OryqenLogo size="sm" showWordmark={false} />
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {viewTitles[currentView] || 'ORYQEN STUDY AI'}
              </h2>
              <span className="hidden sm:inline-flex text-xs text-slate-400" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                onClick={onOpenGoalSwitcher}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#131b2f] hover:bg-violet-50 dark:hover:bg-violet-950/50 border border-slate-200/80 dark:border-[#1e2a47] text-[11px] sm:text-xs font-semibold text-violet-700 dark:text-violet-300 transition-colors shrink-0"
                title="Switch active learning goal"
              >
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{goalConfig.label}</span>
                <ArrowRightLeft className="w-3 h-3 opacity-75 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Controls: Connectivity Status, Pomodoro Timer, Notifications, Theme, Admin, Plans, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {!isOnline && (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 shadow-xs shrink-0"
              title="No internet connection. Local study notes and cached flashcards remain available."
            >
              <WifiOff className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Offline</span>
            </div>
          )}

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
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-emerald-500'
                    : 'text-slate-500'
                }`}
              />
              <span className="font-mono font-bold tracking-tight text-xs tabular-nums">
                {timeFormatted}
              </span>
              <span className="hidden xl:inline text-[10px] text-slate-400 uppercase font-medium">
                {mode === 'focus' ? 'Focus' : 'Break'}
              </span>
            </button>

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
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400" />
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

          {/* Admin Portal Shortcut */}
          <button
            type="button"
            onClick={() => setCurrentView('admin_payments')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              currentView === 'admin_payments'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
            }`}
            title="Authorised Admin Access Portal"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Admin</span>
          </button>

          {/* Plans & UPI Payment Button */}
          <button
            type="button"
            onClick={() => setCurrentView('pricing')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
              currentView === 'pricing'
                ? 'bg-violet-600 text-white border-transparent'
                : profile.subscriptionTier === 'pro'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-100/40'
                : profile.subscriptionTier === 'plus'
                ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100/60'
                : 'bg-violet-600 hover:bg-violet-700 text-white border-transparent'
            }`}
            title="View Plans & Pay via UPI (Scholar Plus / Mastery Pro)"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {profile.subscriptionTier === 'pro'
                ? 'Pro Active'
                : profile.subscriptionTier === 'plus'
                ? 'Plus Active'
                : 'Plans & UPI'}
            </span>
            <span className="xs:hidden">
              {profile.subscriptionTier === 'pro' ? 'Pro' : profile.subscriptionTier === 'plus' ? 'Plus' : 'Plans'}
            </span>
          </button>

          {/* Student Profile Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl p-1 sm:px-2 sm:py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-100"
            title="Account & Study Settings"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover shadow-xs border border-violet-400/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {profile.name ? profile.name[0].toUpperCase() : 'S'}
              </div>
            )}
            <span className="hidden sm:inline font-bold truncate max-w-28 text-left">
              {profile.name || 'Student'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
