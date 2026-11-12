import React from 'react';
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
  Maximize2,
  CloudRain,
  Wind,
  Zap,
  Trees,
} from 'lucide-react';
import { usePomodoro } from '../contexts/PomodoroContext';
import { SubjectCategory, UserProfile } from '../types';

interface PomodoroTimerModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: any) => void;
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
  'Hindi',
  'Marathi',
  'Sanskrit',
  'Foundation & Olympiads',
  'UPSC General Studies',
];

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({
  profile,
  isOpen,
  onClose,
  onNavigate,
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
    activeSchedule,
    currentIntervalIndex,
    currentInterval,
    ambientSound,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setCustomDuration,
    completeAndLogSession,
    setActiveSubject,
    setActiveTopic,
    setSoundEnabled,
    advanceToNextInterval,
    setAmbientSound,
  } = usePomodoro();

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsedSeconds = totalDuration - timeLeft;
  const progressPercent = totalDuration > 0 ? (elapsedSeconds / totalDuration) * 100 : 0;

  // SVG Circular progress math
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleOpenFullStudio = () => {
    onClose();
    if (onNavigate) {
      onNavigate('timer');
    }
  };

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
            {onNavigate && (
              <button
                type="button"
                onClick={handleOpenFullStudio}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Open Full AI Study Timer Studio"
                aria-label="Expand to full timer view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
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
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Active AI Schedule Notification / Quick Launcher */}
          {activeSchedule ? (
            <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {activeSchedule.title} (Step {currentIntervalIndex + 1}/{activeSchedule.intervals.length})
                  </div>
                  <div className="text-[11px] text-violet-600 dark:text-violet-400 truncate">
                    {currentInterval?.objective || 'Active AI-scheduled interval'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={advanceToNextInterval}
                className="shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
              >
                Next Step
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Want an AI-scheduled study session with custom breaks?
                </span>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={handleOpenFullStudio}
                  className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition flex items-center gap-1"
                >
                  <span>AI Plan</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Mode Selector Tabs */}
          {!activeSchedule && (
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
                <span>Break (5m)</span>
              </button>

              <button
                type="button"
                onClick={() => switchMode('long_break')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'long_break'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Rest (15m)</span>
              </button>
            </div>
          )}

          {/* Circular Progress & Time Display */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="relative flex items-center justify-center">
              <svg className="w-56 h-56 transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className={`transition-all duration-1000 ease-linear ${
                    mode === 'focus'
                      ? 'stroke-indigo-600 dark:stroke-indigo-500'
                      : 'stroke-emerald-500 dark:stroke-emerald-400'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {timeFormatted}
                </span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-1">
                  {mode === 'focus' ? (
                    <>
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{activeSchedule ? (currentInterval?.title || 'Deep Work Sprint') : 'Deep Work'}</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3 h-3 text-emerald-500" />
                      <span>Restorative Break</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Quick +/- minutes buttons */}
            {!activeSchedule && (
              <div className="flex items-center gap-1.5 mt-3">
                {[15, 25, 45, 60].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCustomDuration(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      Math.round(totalDuration / 60) === m
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timer Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetTimer}
              className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (isRunning) pauseTimer();
                else startTimer();
              }}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                  : mode === 'focus'
                  ? 'clay-btn-primary shadow-indigo-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{timeLeft < totalDuration ? 'Resume' : 'Start Focus'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={completeAndLogSession}
              className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Log Current Minutes & Finish"
              aria-label="Log & Finish"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Ambient Soundscape Pills */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-xs">
            <span className="text-[11px] font-bold text-slate-500">Ambient:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'none' as const, label: 'Off', icon: VolumeX },
                { id: 'rain' as const, label: 'Rain', icon: CloudRain },
                { id: 'white_noise' as const, label: 'Noise', icon: Wind },
                { id: 'alpha_waves' as const, label: 'Alpha', icon: Zap },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setAmbientSound(s.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                    ambientSound === s.id
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Goal Form (when not running full AI schedule) */}
          {!activeSchedule && mode === 'focus' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Subject & Target Topic</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Logs to activity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
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

                <input
                  type="text"
                  placeholder="e.g. Newton's 2nd Law derivation"
                  value={activeTopic}
                  onChange={e => setActiveTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
        </div>
      </div>
    </div>
  );
};
