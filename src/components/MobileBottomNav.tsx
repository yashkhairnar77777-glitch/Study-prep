import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  Layers,
  Award,
  Clock,
} from 'lucide-react';
import { AppView } from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';

interface MobileBottomNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { isRunning, timeLeft, setIsOpenModal, mode } = usePomodoro();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerStr = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'generator' as const, label: 'Generator', icon: Sparkles },
    { id: 'chat' as const, label: 'Tutor', icon: MessageSquare },
    { id: 'revision' as const, label: 'Cards', icon: Layers },
    { id: 'exam' as const, label: 'Exams', icon: Award },
  ];

  return (
    <nav
      className="md:hidden shrink-0 z-30 bg-white/95 dark:bg-[#0b101f]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-[#19233d] pb-safe transition-colors"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-15 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
              )}
            </button>
          );
        })}

        {/* Focus Sprint Timer Mobile Tab */}
        <button
          type="button"
          onClick={() => setIsOpenModal(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
            isRunning
              ? 'text-violet-600 dark:text-violet-300 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Study Focus Timer"
        >
          <div className="relative">
            <Clock className={`w-5 h-5 mb-0.5 ${isRunning ? 'animate-pulse text-violet-500' : ''}`} />
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          <span className="text-[10px] tracking-tight font-mono">
            {isRunning ? timerStr : 'Timer'}
          </span>
        </button>
      </div>
    </nav>
  );
};
