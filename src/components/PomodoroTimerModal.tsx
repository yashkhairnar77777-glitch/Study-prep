import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Flame,
  Coffee,
  BookOpen,
  ChevronRight,
  Target,
  Layers,
} from 'lucide-react';
import { usePomodoro } from '../contexts/PomodoroContext';
import { SubjectCategory, UserProfile } from '../types';

interface PomodoroTimerModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const ALL_SUBJECTS: SubjectCategory[] = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English & Languages',
  'History & Social Studies',
  'Economics & Commerce',
  'General Science',
  'Japanese',
  'Foundation & Olympiads',
];

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const {
    mode,
    timeLeft,
    totalDuration,
    isRunning,
    activeSubject,
    activeTopic,
    soundEnabled,
    todayMinutes,
    todaySessionsCount,
    recentSessions,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setCustomDuration,
    completeAndLogSession,
    setActiveSubject,
    setActiveTopic,
    setSoundEnabled,
  } = usePomodoro();

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsedSeconds = totalDuration - timeLeft;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const progressPercent = totalDuration > 0 ? (elapsedSeconds / totalDuration) * 100 : 0;

  // SVG Circular progress math
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pomodoro-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="pomodoro-title"
                className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white"
              >
                Study Focus Sprint
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Deep work cycles automatically recorded in your study activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              aria-label={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Focus Timer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Mode Selector Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchMode('focus')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'focus'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Focus (25m)</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('short_break')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'short_break'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Short Break (5m)</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('long_break')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'long_break'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Long Break (15m)</span>
            </button>
          </div>

          {/* Quick Preset Durations */}
          {mode === 'focus' && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Sprint duration:</span>
              {[15, 25, 45, 50, 60].map(mins => {
                const isSelected = totalDuration === mins * 60;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setCustomDuration(mins)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-semibold ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          )}

          {/* Circular Countdown Display */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 220 220">
                {/* Background Track */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Animated Progress Arc */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className={`transition-all duration-1000 ${
                    mode === 'focus'
                      ? 'stroke-indigo-600 dark:stroke-indigo-400'
                      : mode === 'short_break'
                      ? 'stroke-emerald-500'
                      : 'stroke-amber-500'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {timeFormatted}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {mode === 'focus' ? activeSubject : mode === 'short_break' ? 'Rest & Refresh' : 'Extended Rest'}
                </div>
                {activeTopic && mode === 'focus' && (
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-40 mt-0.5">
                    "{activeTopic}"
                  </div>
                )}
              </div>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Reset Timer"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={isRunning ? pauseTimer : startTimer}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-md active:scale-95 ${
                  mode === 'focus'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                    : mode === 'short_break'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{timeLeft === totalDuration ? 'Start Focus' : 'Resume'}</span>
                  </>
                )}
              </button>

              {mode === 'focus' && elapsedMinutes >= 1 && (
                <button
                  type="button"
                  onClick={completeAndLogSession}
                  className="px-3.5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors text-xs font-bold flex items-center gap-1.5"
                  title="Finish session early and log activity"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log ({elapsedMinutes}m)</span>
                </button>
              )}
            </div>
          </div>

          {/* Subject & Goal Form */}
          {mode === 'focus' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Subject & Target Topic</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Logs to your activity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="pomo-subject" className="sr-only">
                    Subject
                  </label>
                  <select
                    id="pomo-subject"
                    value={activeSubject}
                    onChange={e => setActiveSubject(e.target.value as SubjectCategory)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ALL_SUBJECTS.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pomo-topic" className="sr-only">
                    Study Goal or Topic
                  </label>
                  <input
                    id="pomo-topic"
                    type="text"
                    placeholder="e.g. Newton's 2nd Law derivation"
                    value={activeTopic}
                    onChange={e => setActiveTopic(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Daily Progress & Streak Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Today's Focus: <span className="text-indigo-600 dark:text-indigo-400">{todayMinutes} mins</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {todaySessionsCount} focus sprint{todaySessionsCount !== 1 ? 's' : ''} completed today
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Target</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {profile.dailyStudyTargetMinutes || 30} mins
              </div>
            </div>
          </div>

          {/* Recent Completed Sessions Feed */}
          {recentSessions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Recent Focus Sessions
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recentSessions.slice(0, 4).map(sess => (
                  <div
                    key={sess.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {sess.subject}
                      </span>
                      {sess.topic && (
                        <span className="text-slate-400 truncate text-[11px]">· {sess.topic}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
                      {sess.durationMinutes} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
