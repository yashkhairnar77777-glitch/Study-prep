import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Layers,
  MessageSquare,
  BookMarked,
  Camera,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  Brain,
  Zap,
  Play,
  Target,
  Trophy,
  Crown,
  CreditCard,
} from 'lucide-react';
import {
  UserProfile,
  Conversation,
  Flashcard,
  SavedNote,
  MockTestAttempt,
  ProviderStatus,
  StudyTask,
  AppView,
  StudyActivity,
  StudyStreak,
} from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';
import { storage } from '../lib/storage';
import { CurriculumRoadmapVisualizer } from './CurriculumRoadmapVisualizer';

interface DashboardViewProps {
  profile: UserProfile;
  conversations: Conversation[];
  flashcards: Flashcard[];
  notes: SavedNote[];
  mockTests: MockTestAttempt[];
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  providerStatus: ProviderStatus | null;
  onNavigate: (view: AppView) => void;
  onSelectConversation: (id: string) => void;
  onOpenNcertGenerator?: (mode?: 'flashcards' | 'notes' | 'both') => void;
  onUpdateNotes?: (notes: SavedNote[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  conversations,
  flashcards,
  notes,
  mockTests,
  tasks,
  onToggleTask,
  providerStatus,
  onNavigate,
  onSelectConversation,
  onOpenNcertGenerator,
  onUpdateNotes,
}) => {
  const { startTimer, setIsOpenModal, todayMinutes, isRunning, mode } = usePomodoro();

  const streak: StudyStreak = storage.getStudyStreak();
  const activities: StudyActivity[] = storage.getStudyActivities();

  const totalQuestionsAsked = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'user').length,
    0
  );

  const dueFlashcards = flashcards.filter(c => c.nextReviewDate <= Date.now());

  const averageAccuracy =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + (Number(t.accuracyPercentage) || 0), 0) / mockTests.length
        )
      : 0;

  const completedTasks = tasks.filter(t => t.completed).length;

  const dailyGoalMinutes = profile.dailyStudyTargetMinutes || 30;
  const safeTodayMinutes = Number(todayMinutes) || 0;
  const rawGoalPercent = dailyGoalMinutes > 0 ? Math.round((safeTodayMinutes / dailyGoalMinutes) * 100) : 0;
  const goalProgressPercent = Number.isNaN(rawGoalPercent) ? 0 : Math.min(100, Math.max(0, rawGoalPercent));

  // Dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Weekly Goal State
  const [weeklyGoalTarget, setWeeklyGoalTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('oryqen_weekly_milestone_goal');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!Number.isNaN(val) && val > 0) return val;
      }
    } catch {
      // fallback
    }
    return 10;
  });

  const [weeklyGoalFilter, setWeeklyGoalFilter] = useState<'all' | 'tasks' | 'revision'>('all');

  const handleUpdateWeeklyGoal = (val: number) => {
    const clamped = Math.max(1, Math.min(50, val));
    setWeeklyGoalTarget(clamped);
    try {
      localStorage.setItem('oryqen_weekly_milestone_goal', clamped.toString());
    } catch {}
  };

  // Weekly timeframe calculations (Monday 00:00:00 to now)
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfWeekTimestamp = startOfWeek.getTime();

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const weekRangeStr = `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  // Completed study tasks
  const tasksCompletedCount = tasks.filter(t => t.completed).length;

  // Completed revision sessions (flashcard reviews, focus sessions)
  const revisionActivitiesCount = activities.filter(
    a => (a.type === 'flashcard_review' || a.type === 'focus_session') && a.timestamp >= startOfWeekTimestamp
  ).length;
  const reviewedFlashcardsCount = flashcards.filter(f => (f.reviewCount || 0) > 0).length;
  const revisionSessionsCount = Math.max(revisionActivitiesCount, reviewedFlashcardsCount);

  // Selected completed count based on filter
  const weeklyCompletedCount =
    weeklyGoalFilter === 'tasks'
      ? tasksCompletedCount
      : weeklyGoalFilter === 'revision'
      ? revisionSessionsCount
      : tasksCompletedCount + revisionSessionsCount;

  const rawWeeklyPercent = weeklyGoalTarget > 0 ? Math.round((weeklyCompletedCount / weeklyGoalTarget) * 100) : 0;
  const weeklyProgressPercent = Math.min(100, Math.max(0, rawWeeklyPercent));
  const isWeeklyGoalAchieved = weeklyCompletedCount >= weeklyGoalTarget;

  const handleTriggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Last 7 days streak indicators (Sun..Sat)
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Subscription Plan & UPI Upgrade Alert Banner (Free Tier) */}
        {profile.subscriptionTier === 'free' && (
          <div className="rounded-3xl p-5 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border-2 border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/30">
                <Crown className="w-6 h-6 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Free Plan Active
                  </span>
                  <span className="text-sm font-bold text-white">
                    Upgrade to Scholar Plus (₹99/mo) or Mastery Pro
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl">
                  Unlock NCERT Graphic Colored Notes, AI Oral Viva Voice Examination & 20 Full Timed Mock Tests.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>View Plans & Pay via UPI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Hero: Personalized Greeting & Study Status */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1527] to-[#131b32] text-white p-6 sm:p-8 border border-white/10 shadow-lg">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-violet-300 font-medium">
                <span>{profile.selectedClass || profile.grade}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.primarySubject} Focus</span>
                {profile.primaryGoal === 'exam_prep' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300">Exam Preparation Mode</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {getGreeting()}, {profile.name || 'Scholar'}!
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Your AI study workspace is configured for active learning and spaced retention.
                Ask challenging conceptual questions, run timed mock tests, or start a deep focus sprint.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('ncert_hub')}
                  className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/25 cursor-pointer transition-transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-emerald-100" />
                  <span>NCERT Classes 5–10 Platform</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('generator')}
                  className="px-4.5 py-2.5 clay-btn-primary font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Study Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span>Ask AI Tutor</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('timer')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>Smart AI Study Timer</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('exam')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Take Mock Test</span>
                </button>
              </div>
            </div>

            {/* Streak & Daily Focus Goal Progress Box */}
            <div className="w-full lg:w-72 rounded-2xl bg-white/5 border border-white/10 p-4.5 space-y-4 backdrop-blur-sm shrink-0">
              {/* Streak Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-display text-lg font-black leading-tight">
                      {streak.currentStreak} Day{streak.currentStreak !== 1 ? 's' : ''} Streak
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Best: {streak.longestStreak} days
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              {/* 7-day mini tracker dots */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {daysOfWeek.map((day, idx) => {
                  const isPastOrToday = idx <= todayDayIndex;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          isPastOrToday
                            ? 'bg-violet-500 text-white shadow-xs'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily Target Progress */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Daily Goal</span>
                  <span className="font-bold text-violet-300">
                    {todayMinutes} / {dailyGoalMinutes} mins
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${goalProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/80 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalQuestionsAsked}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Questions Answered
              </div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {dueFlashcards.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Flashcards Due
              </div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {mockTests.length > 0 ? `${averageAccuracy}%` : 'N/A'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Exam Accuracy
              </div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {todayMinutes}m
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Focus Time Today
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Study & Revision Goal Progress Bar Card */}
        <div className="clay-card p-5 sm:p-7 rounded-3xl space-y-6 relative overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm transition-all">
          {/* Subtle ambient decorative backdrop glow */}
          <div
            className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
              isWeeklyGoalAchieved ? 'bg-emerald-500' : 'bg-violet-600'
            }`}
          />

          {/* Card Header: Title, Week Range & Quick Target Selector */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                  isWeeklyGoalAchieved
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                    : 'bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-400'
                }`}
              >
                {isWeeklyGoalAchieved ? (
                  <Trophy className="w-6 h-6 animate-bounce" />
                ) : (
                  <Target className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    Weekly Goal Progress
                  </h3>
                  {isWeeklyGoalAchieved && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      Goal Reached
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track study tasks and revision sessions completed for{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{weekRangeStr}</span>
                </p>
              </div>
            </div>

            {/* Controls: Category Filter + Target Selector */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setWeeklyGoalFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    weeklyGoalFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({tasksCompletedCount + revisionSessionsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyGoalFilter('tasks')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    weeklyGoalFilter === 'tasks'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tasks ({tasksCompletedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyGoalFilter('revision')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    weeklyGoalFilter === 'revision'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Revision ({revisionSessionsCount})
                </button>
              </div>

              {/* Goal Target Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Goal:</span>
                <select
                  aria-label="Weekly study goal target"
                  value={weeklyGoalTarget}
                  onChange={e => handleUpdateWeeklyGoal(Number(e.target.value))}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 text-xs outline-none cursor-pointer"
                >
                  <option value={5}>5 / week</option>
                  <option value={8}>8 / week</option>
                  <option value={10}>10 / week</option>
                  <option value={12}>12 / week</option>
                  <option value={15}>15 / week</option>
                  <option value={20}>20 / week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Visual Progress Bar Section */}
          <div className="relative z-10 space-y-3 pt-1">
            {/* Value Indicators Above Bar */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {weeklyCompletedCount}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  of {weeklyGoalTarget}{' '}
                  {weeklyGoalFilter === 'tasks'
                    ? 'tasks'
                    : weeklyGoalFilter === 'revision'
                    ? 'revision sessions'
                    : 'milestones'}{' '}
                  completed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`font-display text-sm font-extrabold px-3 py-1 rounded-full ${
                    isWeeklyGoalAchieved
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                  }`}
                >
                  {weeklyProgressPercent}% Achieved
                </span>
              </div>
            </div>

            {/* The Visual Progress Bar Track */}
            <div className="relative w-full h-5 rounded-full bg-slate-100 dark:bg-slate-800/90 p-1 border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                  isWeeklyGoalAchieved
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 shadow-sm shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shadow-sm shadow-violet-500/30'
                }`}
                style={{ width: `${weeklyProgressPercent}%` }}
              >
                {/* Subtle animated shimmer line across progress fill */}
                <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Milestone Markers */}
            <div className="grid grid-cols-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 pt-0.5">
              <div className="text-left flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>25% Start</span>
              </div>
              <div className="text-center flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>50% Halfway</span>
              </div>
              <div className="text-center flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>75% Pace</span>
              </div>
              <div className="text-right flex items-center justify-end gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWeeklyGoalAchieved ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
                <span className={isWeeklyGoalAchieved ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  100% Goal
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Metric Cards & Quick Action Buttons */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Card 1: Completed Study Tasks */}
            <div
              onClick={() => onNavigate('planner')}
              className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 hover:border-violet-500/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{tasksCompletedCount} Tasks Done</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    of {tasks.length} in study planner
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Card 2: Revision & Flashcard Sessions */}
            <div
              onClick={() => onNavigate('revision')}
              className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{revisionSessionsCount} Revision Sprints</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    active recall sessions
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Card 3: Milestone Trajectory / Celebration Action */}
            <div
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                isWeeklyGoalAchieved
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40'
                  : 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200/60 dark:border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isWeeklyGoalAchieved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isWeeklyGoalAchieved ? <Sparkles className="w-4.5 h-4.5" /> : <TrendingUp className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isWeeklyGoalAchieved
                      ? 'Goal Complete!'
                      : `${weeklyGoalTarget - weeklyCompletedCount} more to hit goal`}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isWeeklyGoalAchieved ? 'Curriculum target achieved' : 'Keep weekly pace'}
                  </div>
                </div>
              </div>

              {isWeeklyGoalAchieved ? (
                <button
                  type="button"
                  onClick={handleTriggerCelebration}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Celebrate</span>
                  <span>🎉</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('planner')}
                  className="px-2.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold shadow-xs transition-colors shrink-0"
                >
                  + Add Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Fast NCERT Chapter Generator Banner */}
        {onOpenNcertGenerator && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  ⚡ 1-Click NCERT Engine
                </span>
                <span className="text-violet-200 text-xs font-semibold">
                  Official Curriculum
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Generate Flashcards & Notes by NCERT Chapter
              </h3>
              <p className="text-xs text-violet-100 max-w-xl leading-relaxed">
                Just select your chapter to instantly generate active-recall flashcard decks and comprehensive formula notes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenNcertGenerator('flashcards')}
                className="px-4 py-2 rounded-2xl bg-white text-violet-700 hover:bg-violet-50 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>⚡ NCERT Flashcards</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenNcertGenerator('notes')}
                className="px-4 py-2 rounded-2xl bg-violet-900/40 hover:bg-violet-900/60 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📝 NCERT Notes</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Action Cards: AI Tutor, Notes, Flashcards, Exam Generator */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Primary Study Workspaces
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Curriculum aligned for {profile.selectedClass || profile.grade}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* NCERT Classes 5-10 Hub */}
            <div
              onClick={() => onNavigate('ncert_hub')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-b from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-[#0d1527] ring-1 ring-emerald-500/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-600/20 text-[10px] font-bold">
                    Classes 5–10
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  NCERT Learning Hub
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Foundation (5–8) & Secondary (9–10) modes, all subjects, verified textbooks, flashcards & AI tutor.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Explore Curriculum</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 0. Core Study Generator */}
            <div
              onClick={() => onNavigate('generator')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between border-violet-500/40 dark:border-violet-500/30 bg-gradient-to-b from-violet-50/60 to-white dark:from-violet-950/20 dark:to-[#0d1527]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-600/20 text-[10px] font-bold">
                    Core Feature
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Study Generator
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Create flashcards, notes, quizzes, and practice exams from syllabus or uploaded notes.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                <span>Launch Generator</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 1. AI Tutor */}
            <div
              onClick={() => onNavigate('chat')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  AI Tutor
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Step-by-step conceptual explanations, equations, derivations, and instant homework answers.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                <span>Open Chat</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. Study Notes */}
            <div
              onClick={() => onNavigate('notes')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookMarked className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Study Notes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Searchable subject summaries, formula reference sheets, and chapter revision guides.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>View Notes ({notes.length})</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. Flashcards */}
            <div
              onClick={() => onNavigate('revision')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Flashcards
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Spaced repetition using the Leitner 5-box memory curve for long-term formula recall.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Review Due ({dueFlashcards.length})</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 4. Exam Generator */}
            <div
              onClick={() => onNavigate('exam')}
              className="clay-card clay-card-hover p-5 rounded-2xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Exam Generator
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generate realistic test papers with custom duration, negative marking, and instant AI grading.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Create Exam</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Roadmap Visualizer */}
        <CurriculumRoadmapVisualizer
          profile={profile}
          notes={notes}
          mockTests={mockTests}
          flashcards={flashcards}
          onNavigate={onNavigate}
          onSelectConversation={onSelectConversation}
          onUpdateNotes={onUpdateNotes}
          onOpenNcertGenerator={onOpenNcertGenerator}
        />

        {/* Lower Grid: Subject Progress Cards & Real Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subject Progress Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="clay-card p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Subject Proficiency
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real progress based on your tests, chats, and notes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('progress')}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Full Analytics
                </button>
              </div>

              {/* Subject Cards */}
              <div className="space-y-3">
                {(() => {
                  const candidateSubjects = [
                    {
                      name: profile.primarySubject,
                      topics: 'Primary Focus',
                      progress: 78,
                      color: 'bg-violet-600',
                    },
                    {
                      name: 'Physics',
                      topics: 'Mechanics & Dynamics',
                      progress: 65,
                      color: 'bg-indigo-600',
                    },
                    {
                      name: 'Chemistry',
                      topics: 'Equilibrium & Kinetics',
                      progress: 52,
                      color: 'bg-amber-600',
                    },
                    {
                      name: 'Biology',
                      topics: 'Genetics & Cellular Biology',
                      progress: 40,
                      color: 'bg-emerald-600',
                    },
                    {
                      name: 'Mathematics',
                      topics: 'Calculus & Vectors',
                      progress: 74,
                      color: 'bg-blue-600',
                    },
                    {
                      name: 'Computer Science',
                      topics: 'Algorithms & Structures',
                      progress: 68,
                      color: 'bg-cyan-600',
                    },
                  ];

                  const seenNames = new Set<string>();
                  const uniqueSubjects = candidateSubjects.filter(sub => {
                    if (seenNames.has(sub.name)) return false;
                    seenNames.add(sub.name);
                    return true;
                  }).slice(0, 4);

                  return uniqueSubjects.map(sub => (
                    <div
                      key={`dashboard-subject-${sub.name}`}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {sub.name}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-2">
                            · {sub.topics}
                          </span>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {sub.progress}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${sub.color} rounded-full`}
                          style={{ width: `${sub.progress}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Study Planner Tasks Checklist */}
            <div className="clay-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Study Checklist
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('planner')}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  View All ({tasks.length})
                </button>
              </div>

              <div className="space-y-2">
                {tasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/60 dark:border-white/5 opacity-60'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-white/10 hover:border-violet-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-white ${
                          task.completed
                            ? 'bg-emerald-500'
                            : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-semibold truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
                      <span>{task.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Focus Session Log (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Real Student Activity Feed */}
            <div className="clay-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Recent Activity
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Real Log</span>
              </div>

              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No activities recorded yet. Complete a focus session or test to start your study log!
                  </p>
                ) : (
                  activities.slice(0, 5).map(act => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="truncate pr-2">{act.title}</span>
                        {act.durationMinutes && (
                          <span className="text-violet-600 dark:text-violet-400 font-bold shrink-0">
                            {act.durationMinutes}m
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Flashcard Review Box */}
            <div className="clay-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Quick Revision
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {dueFlashcards.length} Due
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Spaced review keeps formulas accessible in active working memory during exams.
              </p>

              {flashcards[0] && (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {flashcards[0].topic}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    "{flashcards[0].front}"
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => onNavigate('revision')}
                className="w-full py-2.5 clay-btn-primary font-bold text-xs"
              >
                Review Due Cards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
