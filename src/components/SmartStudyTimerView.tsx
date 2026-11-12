import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  Flame,
  Coffee,
  Brain,
  Zap,
  BatteryCharging,
  Maximize2,
  Minimize2,
  ArrowRight,
  Layers,
  HelpCircle,
  Activity,
  Check,
  Plus,
  Sliders,
  RefreshCw,
  Wind,
  CloudRain,
  Headphones,
  Trees,
} from 'lucide-react';
import {
  SubjectCategory,
  UserProfile,
  ScheduleEnergyLevel,
  ScheduleGoalType,
  AiStudySchedule,
  AmbientSoundType,
} from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';
import { api } from '../lib/api';

interface SmartStudyTimerViewProps {
  profile: UserProfile;
  onNavigate: (view: any) => void;
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

const PRESETS = [
  {
    name: 'Pomodoro Classic',
    focus: 25,
    breakTime: 5,
    tag: 'Standard 25/5',
    desc: 'Ideal for general homework, theory reading & assignment chunks',
  },
  {
    name: 'Ultradian Rhythm',
    focus: 90,
    breakTime: 20,
    tag: 'Deep Work 90/20',
    desc: 'Based on biological peak-performance cycles for intense deep focus',
  },
  {
    name: '52 / 17 Sprint',
    focus: 52,
    breakTime: 17,
    tag: 'Deskera Rule',
    desc: 'Golden productivity ratio: 52m absolute sprint + 17m total detachment',
  },
  {
    name: 'Exam Crunch Sprint',
    focus: 45,
    breakTime: 10,
    tag: 'Simulation 45/10',
    desc: 'High-speed timed practice sets with short error-analysis reviews',
  },
  {
    name: 'Momentum Quick Burst',
    focus: 15,
    breakTime: 3,
    tag: 'Micro Sprint 15/3',
    desc: 'Overcomes procrastination when starting on low energy',
  },
];

export const SmartStudyTimerView: React.FC<SmartStudyTimerViewProps> = ({
  profile,
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
    autoAdvanceIntervals,
    ambientSound,
    ambientVolume,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setCustomDuration,
    completeAndLogSession,
    setActiveSubject,
    setActiveTopic,
    setSoundEnabled,
    loadSchedule,
    advanceToNextInterval,
    jumpToInterval,
    clearSchedule,
    setAutoAdvanceIntervals,
    setAmbientSound,
    setAmbientVolume,
  } = usePomodoro();

  // Generator form state
  const [targetTopic, setTargetTopic] = useState<string>(activeTopic || '');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>(
    activeSubject || profile.primarySubject || 'Mathematics'
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [energyLevel, setEnergyLevel] = useState<ScheduleEnergyLevel>('moderate');
  const [goalType, setGoalType] = useState<ScheduleGoalType>('deep_learning');
  const [customContext, setCustomContext] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Fullscreen zen mode state
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Box breathing interactive animation state
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');

  // Handle Box Breathing cycle timer
  React.useEffect(() => {
    if (mode === 'focus') return;
    const interval = setInterval(() => {
      setBreathingStep(prev => {
        if (prev === 'inhale') return 'hold1';
        if (prev === 'hold1') return 'exhale';
        if (prev === 'exhale') return 'hold2';
        return 'inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleGenerateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = targetTopic.trim() || `${selectedSubject} Concepts`;
    setIsGenerating(true);
    setGeneratorError(null);

    try {
      const schedule = await api.generateStudySchedule({
        subject: selectedSubject,
        topic: cleanTopic,
        totalDurationMinutes: durationMinutes,
        energyLevel,
        goalType,
        customContext: customContext.trim() || undefined,
        grade: profile.selectedClass || profile.grade,
      });

      loadSchedule(schedule);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate schedule';
      setGeneratorError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    clearSchedule();
    setActiveSubject(selectedSubject);
    setActiveTopic(preset.name);
    switchMode('focus', preset.focus);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsedSeconds = totalDuration - timeLeft;
  const progressPercent = totalDuration > 0 ? (elapsedSeconds / totalDuration) * 100 : 0;

  // SVG Circular progress math
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const isFocus = mode === 'focus';

  return (
    <div className={`flex flex-col h-full overflow-y-auto min-w-0 ${isZenMode ? 'p-4 md:p-8 max-w-4xl mx-auto' : 'p-3 sm:p-6 max-w-7xl mx-auto space-y-6'}`}>
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Smart AI Study Timer & Scheduler
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40">
                AI Adaptive Pacing
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cognitive-science study sprints with tailored brain resets, soundscapes & daily progress tracking
            </p>
          </div>
        </div>

        {/* Action Bar: Sound, Zen Mode, Clear */}
        <div className="flex items-center gap-2">
          {activeSchedule && (
            <button
              type="button"
              onClick={clearSchedule}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Return to standard timer"
            >
              Exit AI Schedule
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsZenMode(!isZenMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Fullscreen Focus'}
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isZenMode ? 'Exit Zen' : 'Zen Focus'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Timer Studio, Right AI Scheduler / Analytics */}
      <div className={`grid grid-cols-1 ${isZenMode ? 'max-w-xl mx-auto w-full' : 'lg:grid-cols-12'} gap-6 items-start`}>
        {/* TIMER CORE WORKSPACE (Left on desktop) */}
        <div className={`${isZenMode ? 'w-full' : 'lg:col-span-7 xl:col-span-7'} space-y-5`}>
          {/* Active Timer Card */}
          <div className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
            isFocus
              ? 'bg-gradient-to-b from-slate-900 to-[#0b101f] border-violet-500/30 text-white shadow-2xl shadow-violet-950/20'
              : 'bg-gradient-to-b from-slate-900 to-[#06171d] border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/20'
          } p-6 sm:p-8 flex flex-col items-center text-center`}>
            
            {/* Top Indicator Badges */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isFocus
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isFocus ? <Flame className="w-3.5 h-3.5 text-violet-400" /> : <Coffee className="w-3.5 h-3.5 text-emerald-400" />}
                  {mode === 'focus' ? 'Deep Work Sprint' : mode === 'long_break' ? 'Extended Recovery Break' : 'Restorative Break'}
                </span>

                {activeSchedule && (
                  <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                    Step {currentIntervalIndex + 1} of {activeSchedule.intervals.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
                  title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>
              </div>
            </div>

            {/* Target Subject & Topic Heading */}
            <div className="mb-6 max-w-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {activeSubject}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 truncate">
                {activeSchedule ? (currentInterval?.title || activeSchedule.title) : (activeTopic || `${activeSubject} Revision`)}
              </h2>
              {currentInterval?.objective && (
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-violet-300">Goal: </span>
                  {currentInterval.objective}
                </p>
              )}
            </div>

            {/* Circular Progress & Clock Face */}
            <div className="relative my-2 flex items-center justify-center">
              <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Animated Fill Ring */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className={`transition-all duration-1000 ease-linear ${
                    isFocus ? 'stroke-violet-500' : 'stroke-emerald-400'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inner Digits and Subtitle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-white select-none">
                  {timeFormatted}
                </span>
                <span className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
                  {isRunning ? 'Session Active' : 'Paused'}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {Math.round(progressPercent)}% elapsed
                </span>
              </div>
            </div>

            {/* Quick Interval Time Adjuster Pills (if not in fixed schedule) */}
            {!activeSchedule && (
              <div className="flex items-center gap-2 my-4">
                {[15, 25, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      switchMode('focus', mins);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                      mode === 'focus' && totalDuration === mins * 60
                        ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-900/50'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => switchMode('short_break', 5)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    mode === 'short_break'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-emerald-300 hover:bg-white/10'
                  }`}
                >
                  5m Break
                </button>
              </div>
            )}

            {/* Main Interactive Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  if (isRunning) pauseTimer();
                  else startTimer();
                }}
                className={`px-7 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2.5 shadow-xl transition-all transform active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                    : isFocus
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{timeLeft < totalDuration ? 'Resume Timer' : 'Start Focus Sprint'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
                title="Reset this interval"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setCustomDuration(Math.round(totalDuration / 60) + 5)}
                className="px-3.5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
                title="Add 5 more minutes"
              >
                +5m
              </button>

              {activeSchedule ? (
                <button
                  type="button"
                  onClick={advanceToNextInterval}
                  className="px-4 py-3.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-xs font-bold text-indigo-200 transition flex items-center gap-1.5"
                  title="Skip to next step in schedule"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={completeAndLogSession}
                  className="px-4 py-3.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 text-xs font-bold text-emerald-200 transition flex items-center gap-1.5"
                  title="Log current progress and save session"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log & Finish</span>
                </button>
              )}
            </div>

            {/* Auto-Advance Toggle for AI Schedule */}
            {activeSchedule && (
              <div className="flex items-center gap-2 mt-5 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="autoAdvance"
                  checked={autoAdvanceIntervals}
                  onChange={e => setAutoAdvanceIntervals(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="autoAdvance" className="cursor-pointer select-none">
                  Auto-transition to next interval when time expires
                </label>
              </div>
            )}
          </div>

          {/* AMBIENT SOUNDSCAPE CONTROLS BAR */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-violet-500" />
                Focus Soundscapes (Offline Synthesized)
              </span>
              <span className="text-[11px] text-slate-400">
                {ambientSound === 'none' ? 'Muted' : `Playing ${ambientSound.replace('_', ' ')}`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none' as const, label: 'Silent', icon: VolumeX },
                { id: 'rain' as const, label: 'Gentle Rain', icon: CloudRain },
                { id: 'white_noise' as const, label: 'Deep Noise', icon: Wind },
                { id: 'alpha_waves' as const, label: '432Hz Alpha', icon: Zap },
                { id: 'forest' as const, label: 'Forest Breeze', icon: Trees },
              ].map(snd => {
                const Icon = snd.icon;
                const isCurrent = ambientSound === snd.id;
                return (
                  <button
                    key={snd.id}
                    type="button"
                    onClick={() => setAmbientSound(snd.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isCurrent
                        ? 'bg-violet-600 text-white border-violet-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{snd.label}</span>
                  </button>
                );
              })}
            </div>

            {ambientSound !== 'none' && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Volume</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={e => setAmbientVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-violet-600"
                />
                <span className="text-[11px] font-mono text-slate-500">
                  {Math.round(ambientVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* ACTIVE BREAK COACH (Appears during breaks) */}
          {!isFocus && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900 border border-emerald-500/30 text-slate-900 dark:text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 animate-spin" />
                  Active Brain Recovery Coach
                </span>
                <span className="text-[11px] text-slate-500">Box Breathing 4-4-4-4</span>
              </div>

              {/* Visual Box Breathing Circle */}
              <div className="flex items-center gap-4 py-2">
                <div className="relative w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <div className={`w-8 h-8 rounded-full bg-emerald-400 transition-all duration-3000 ${
                    breathingStep === 'inhale' ? 'scale-150 opacity-90' : breathingStep === 'exhale' ? 'scale-75 opacity-40' : 'scale-100 opacity-70'
                  }`} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {breathingStep === 'inhale' && 'Inhale deeply (4s)...'}
                    {breathingStep === 'hold1' && 'Hold breath gently (4s)...'}
                    {breathingStep === 'exhale' && 'Slowly exhale (4s)...'}
                    {breathingStep === 'hold2' && 'Rest lungs & relax shoulders (4s)...'}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {currentInterval?.breakActivity || 'Drink 250ml cold water, relax your gaze 20 feet away, and roll your shoulders.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SCHEDULE STEPS TIMELINE (if an AI schedule is running) */}
          {activeSchedule && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeSchedule.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeSchedule.summary}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-800/40">
                  {activeSchedule.totalDurationMinutes} mins total
                </span>
              </div>

              {/* Intervals List */}
              <div className="space-y-2 pt-1">
                {activeSchedule.intervals.map((inv, idx) => {
                  const isCurrent = idx === currentIntervalIndex;
                  const isCompleted = inv.completed || idx < currentIntervalIndex;
                  return (
                    <div
                      key={inv.id}
                      onClick={() => jumpToInterval(idx)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                        isCurrent
                          ? 'border-violet-500 bg-violet-500/10 dark:bg-violet-950/40'
                          : isCompleted
                          ? 'border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-slate-900/60 opacity-75'
                          : 'border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {inv.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                              inv.type === 'focus'
                                ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            }`}>
                              {inv.durationMinutes}m
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {inv.objective}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded">
                            Active
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeSchedule.rationale && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Cognitive Science Rationale: </span>
                  {activeSchedule.rationale}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI SCHEDULE GENERATOR & PRESETS (Right on desktop) */}
        {!isZenMode && (
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            {/* AI Generator Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Generate Smart AI Schedule
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculates custom focus blocks & break activities tailored to your energy
                  </p>
                </div>
              </div>

              {generatorError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                  {generatorError}
                </div>
              )}

              <form onSubmit={handleGenerateSchedule} className="space-y-4">
                {/* Subject Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value as SubjectCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {ALL_SUBJECTS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic / Chapter Input */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Topic / Chapter Focus
                  </label>
                  <input
                    type="text"
                    value={targetTopic}
                    onChange={e => setTargetTopic(e.target.value)}
                    placeholder="e.g. Kinematics, Chemical Bonding, Calculus..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Available Study Time Duration */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Total Available Time
                    </label>
                    <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400">
                      {durationMinutes} Minutes
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {[30, 45, 60, 90, 120].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDurationMinutes(mins)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                          durationMinutes === mins
                            ? 'bg-violet-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Level Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                    Your Current Alertness / Energy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'high' as const, label: 'High Alert', icon: Zap, sub: 'Longer sprints' },
                      { id: 'moderate' as const, label: 'Moderate', icon: BatteryCharging, sub: 'Balanced 25m' },
                      { id: 'low' as const, label: 'Fatigued', icon: Coffee, sub: 'Gentle micro-blocks' },
                    ].map(lvl => {
                      const Icon = lvl.icon;
                      const isSelected = energyLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setEnergyLevel(lvl.id)}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                              : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                            <Icon className="w-3.5 h-3.5" />
                            <span>{lvl.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {lvl.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Goal Type Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Study Goal
                  </label>
                  <select
                    value={goalType}
                    onChange={e => setGoalType(e.target.value as ScheduleGoalType)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-white outline-none"
                  >
                    <option value="deep_learning">Deep Conceptual Theory & Notes</option>
                    <option value="problem_solving">Problem Solving & Numerical Drills</option>
                    <option value="rapid_revision">Rapid Exam Revision & Recall</option>
                    <option value="memorization">Terminology & Formula Flashcards</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 disabled:opacity-50 transition active:scale-[0.99]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Cognitive Schedule...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Schedule & Start</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Scientific Presets */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Evidence-Based Study Presets
                </h3>
              </div>

              <div className="space-y-2">
                {PRESETS.map(preset => (
                  <div
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 rounded-xl border border-slate-200/70 dark:border-white/5 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:border-violet-300 dark:hover:border-violet-700/50 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {preset.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-400 group-hover:text-violet-600 shadow-xs"
                      title="Load preset"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Productivity Summary */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5 text-indigo-300">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Today's Deep Work Metrics
                </span>
                <span className="text-[11px] text-slate-400">
                  Goal: {profile.dailyStudyTargetMinutes || 90}m
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-extrabold text-white">
                    {todayMinutes}m
                  </div>
                  <div className="text-[11px] text-slate-400">Focus Minutes Logged</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-extrabold text-white">
                    {todaySessionsCount}
                  </div>
                  <div className="text-[11px] text-slate-400">Sprints Completed</div>
                </div>
              </div>

              {/* Progress towards daily goal */}
              <div className="pt-1">
                <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                  <span>Daily Target Progress</span>
                  <span>
                    {Math.min(100, Math.round((todayMinutes / (profile.dailyStudyTargetMinutes || 90)) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((todayMinutes / (profile.dailyStudyTargetMinutes || 90)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
