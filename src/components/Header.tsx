import React from 'react';
import { Menu, User, Sparkles, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { UserProfile, AppView } from '../types';
import { IMAGES } from '../assets/images';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenMobileMenu: () => void;
  onOpenProfile: () => void;
  profile: UserProfile;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenLanding: () => void;
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
}) => {
  const viewTitles: Record<AppView, string> = {
    landing: 'Home',
    dashboard: 'Dashboard',
    chat: 'AI Tutor Chat',
    photo: 'Photo Question Solver',
    doc: 'PDF & Document Analysis',
    exam: 'Mock Tests & Exam Generator',
    mock_test: 'Timed Exam Simulation',
    revision: 'Smart Spaced Flashcards',
    planner: 'Study Planner',
    notes: 'Study Notes',
    progress: 'Learning Diagnostics',
    pricing: 'Plans & Upgrades',
  };

  return (
    <header className="sticky top-0 z-30 h-15 border-b backdrop-blur-md px-4 sm:px-6 transition-colors bg-white/75 dark:bg-[#0c1222]/85 border-slate-200/70 dark:border-white/10">
      <div className="flex h-full items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Current View Breadcrumb */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors clay-btn-secondary"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 overflow-hidden flex items-center justify-center">
              <img src={IMAGES.CLAY_MASCOT} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{viewTitles[currentView] || 'ORYQEN STUDY AI'}</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                  {profile.selectedClass || profile.grade}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
          {[
            { id: 'dashboard' as const, label: 'Dashboard' },
            { id: 'chat' as const, label: 'AI Chat' },
            { id: 'photo' as const, label: 'Photo Solver' },
            { id: 'doc' as const, label: 'PDF Analysis' },
            { id: 'exam' as const, label: 'Mock Tests' },
            { id: 'revision' as const, label: 'Flashcards' },
            { id: 'planner' as const, label: 'Planner' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentView === tab.id
                  ? 'clay-btn-secondary text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: Theme Toggle & Profile Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenLanding}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Public Landing Page"
          >
            <span>Landing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-amber-400 clay-btn-secondary transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 clay-btn-secondary text-xs font-semibold text-slate-800 dark:text-slate-100"
            title="Account & Study Settings"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px]">
              {profile.name ? profile.name[0].toUpperCase() : 'S'}
            </div>
            <span className="hidden sm:inline font-bold truncate max-w-28">
              {profile.name || 'Student'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
