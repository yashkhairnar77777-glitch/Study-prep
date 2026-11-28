import React, { useMemo } from 'react';
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
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  Zap,
  Target,
  ArrowRightLeft,
  BarChart3,
  RotateCcw,
  AlertTriangle,
  PenTool,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
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
  GoalConfig,
  TopicStatus,
  SubjectCategory,
} from '../types';
import { usePomodoro } from '../contexts/PomodoroContext';
import { storage } from '../lib/storage';
import { computeSyllabusSummary } from '../lib/syllabusTracker';

interface DashboardViewProps {
  profile: UserProfile;
  goalConfig: GoalConfig;
  topicProgress: Record<string, TopicStatus>;
  conversations: Conversation[];
  flashcards: Flashcard[];
  notes: SavedNote[];
  mockTests: MockTestAttempt[];
  tasks: StudyTask[];
  onToggleTask: (id: string) => void;
  providerStatus: ProviderStatus | null;
  onNavigate: (view: AppView) => void;
  onSelectConversation: (id: string) => void;
  onOpenGoalSwitcher: () => void;
  onLaunchTutorPrompt: (prompt: string, subject?: SubjectCategory) => void;
  onOpenNcertGenerator?: (mode?: 'flashcards' | 'notes' | 'both') => void;
  onUpdateNotes?: (notes: SavedNote[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  goalConfig,
  topicProgress,
  conversations,
  flashcards,
  notes,
  mockTests,
  tasks,
  onToggleTask,
  onNavigate,
  onOpenGoalSwitcher,
  onLaunchTutorPrompt,
  onOpenNcertGenerator,
}) => {
  const { todayMinutes } = usePomodoro();

  const streak: StudyStreak = storage.getStudyStreak();
  const activities: StudyActivity[] = storage.getStudyActivities();

  const syllabusSummary = useMemo(
    () => computeSyllabusSummary(goalConfig, topicProgress, notes, flashcards, mockTests),
    [goalConfig, topicProgress, notes, flashcards, mockTests]
  );

  const totalQuestionsAsked = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'user').length,
    0
  );

  const dueFlashcards = flashcards.filter(c => c.nextReviewDate <= Date.now());

  const averageAccuracy =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + (Number(t.accuracyPercentage) || 0), 0) /
            mockTests.length
        )
      : null;

  const dailyGoalMinutes = goalConfig.dailyStudyTargetMinutes || profile.dailyStudyTargetMinutes || 45;
  const safeTodayMinutes = Number(todayMinutes) || 0;
  const goalProgressPercent = Math.min(
    100,
    Math.max(0, dailyGoalMinutes > 0 ? Math.round((safeTodayMinutes / dailyGoalMinutes) * 100) : 0)
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7;

  const revisionQueueTopics = useMemo(
    () =>
      syllabusSummary.allTopics
        .filter(t => t.status === 'needs_revision')
        .slice(0, 4),
    [syllabusSummary.allTopics]
  );

  const heroSubtitle =
    goalConfig.kind === 'upsc'
      ? `Civil Services workspace focused on ${goalConfig.upscFocusStage || 'Prelims + Mains'}${
          goalConfig.upscOptionalSubject ? ` and ${goalConfig.upscOptionalSubject}` : ''
        }.`
      : goalConfig.kind === 'jee'
      ? `Focused on ${goalConfig.jeeStream || 'JEE Main & Advanced'} problem-solving across Physics, Chemistry, and Mathematics.`
      : goalConfig.kind === 'neet'
      ? `Medical entrance preparation prioritizing Biology, Chemistry, Physics, and line-by-line NCERT mastery.`
      : `Structured learning workspace for ${goalConfig.selectedClass || 'School'} (${goalConfig.board}) · ${goalConfig.academicYear}.`;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Goal-Personalized Hero */}
        <section className="rounded-2xl bg-[#0d1527] text-white p-6 sm:p-8 border border-[#1e2a47] shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                <span className="font-bold text-violet-300">{goalConfig.label}</span>
                <span aria-hidden="true">·</span>
                <span>{goalConfig.medium} Medium</span>
                {goalConfig.preparationLevel && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{goalConfig.preparationLevel} Level</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {getGreeting()}, {profile.name || 'Scholar'}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">{heroSubtitle}</p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('syllabus')}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Target className="w-4 h-4" />
                  <span>Open Syllabus Tracker</span>
                </button>

                {goalConfig.kind === 'upsc' ? (
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchTutorPrompt(
                        `Give me a UPSC Mains practice question (150 words / 10 marks) from GS Paper II or III tailored to ${goalConfig.targetExamYear || '2027'}, then wait for my answer and evaluate structure, constitutional/data backing, and conclusion.`,
                        'UPSC General Studies'
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-amber-300" />
                    <span>Answer Writing Practice</span>
                  </button>
                ) : goalConfig.kind === 'jee' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('exam')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Timed JEE Mock Test</span>
                  </button>
                ) : goalConfig.kind === 'neet' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('ncert_hub')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-300" />
                    <span>NCERT Revision Hub</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('ncert_hub')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-300" />
                    <span>Subjects & Chapters</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-violet-300" />
                  <span>AI Tutor</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenGoalSwitcher}
                  className="px-3.5 py-2.5 rounded-xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Switch Goal</span>
                </button>
              </div>
            </div>

            {/* Daily Focus & Streak Card */}
            <div className="w-full lg:w-72 rounded-xl bg-[#11192e] border border-[#1e2a47] p-4 space-y-3.5 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-display text-base font-extrabold tabular-nums">
                      {streak.currentStreak} Day{streak.currentStreak !== 1 ? 's' : ''} Streak
                    </div>
                    <div className="text-[11px] text-slate-400 tabular-nums">
                      Best: {streak.longestStreak} days
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">Active</span>
              </div>

              <div className="flex items-center justify-between gap-1">
                {daysOfWeek.map((day, idx) => {
                  const isPastOrToday = idx <= todayDayIndex;
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        isPastOrToday
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="text-slate-300 font-medium">Daily Study Target</span>
                  <span className="font-bold text-violet-300">
                    {safeTodayMinutes} / {dailyGoalMinutes} mins
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${goalProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Activity Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface-card p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {totalQuestionsAsked}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Tutor Questions</div>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dueFlashcards.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Flashcards Due</div>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {averageAccuracy !== null ? `${averageAccuracy}%` : 'No Mocks'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Mock Accuracy ({mockTests.length})
              </div>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {safeTodayMinutes}m
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Focus Time Today</div>
            </div>
          </div>
        </section>

        {/* Intelligent Syllabus Tracker Overview */}
        <section className="surface-card rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                <span>Intelligent Syllabus Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live topic tracking for {goalConfig.label}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('syllabus')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors shrink-0"
            >
              <span>Manage Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!syllabusSummary.isAvailable ? (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Verified syllabus unavailable for {goalConfig.label}</p>
                  <p>{syllabusSummary.unavailableReason}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenGoalSwitcher}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
              >
                Switch Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 tabular-nums">
                <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Completion</div>
                  <div className="text-xl font-extrabold text-violet-600 dark:text-violet-400">
                    {syllabusSummary.completionPercentage}%
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Completed</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {syllabusSummary.completedTopics}/{syllabusSummary.totalTopics}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">In Progress</div>
                  <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {syllabusSummary.inProgressTopics}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Needs Revision</div>
                  <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                    {syllabusSummary.needsRevisionTopics}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Est. Finish</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {syllabusSummary.estimatedCompletionDate || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {syllabusSummary.subjects.slice(0, 6).map(sub => (
                  <div
                    key={sub.subjectId}
                    onClick={() => onNavigate('syllabus')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/70 dark:border-[#1e2a47] hover:border-violet-500/40 cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {sub.subjectName}
                      </span>
                      <span className="font-bold text-violet-600 dark:text-violet-400 tabular-nums shrink-0">
                        {sub.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-violet-600 rounded-full"
                        style={{ width: `${sub.completionPercentage}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {sub.completedTopics} of {sub.totalTopics} topics completed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Goal-Specific Workspace Modules */}
        {goalConfig.kind === 'upsc' && (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              UPSC Civil Services Workspace
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                onClick={() => onNavigate('syllabus')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <Landmark className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    GS I–IV + CSAT
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  General Studies & CSAT Pillars
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Track History, Geography, Polity, Economy, Environment & Ethics topic by topic.
                </p>
              </div>

              <div
                onClick={() => onNavigate('doc')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    PDF & Policy Briefs
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Current Affairs & PIB Analysis
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Upload Economic Survey, Yojana, or editorials for structured UPSC GS bullet summaries.
                </p>
              </div>

              <div
                onClick={() =>
                  onLaunchTutorPrompt(
                    `Evaluate my UPSC Optional Subject strategy for "${goalConfig.upscOptionalSubject || 'Political Science & International Relations'}" and give me 2 high-yield Mains questions.`,
                    'UPSC General Studies'
                  )
                }
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <PenTool className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {goalConfig.upscFocusStage || 'Prelims + Mains'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Optional & Answer Writing Lab
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Practice 150/250-word structured Mains answers and optional topics with instant critique.
                </p>
              </div>
            </div>
          </section>
        )}

        {goalConfig.kind === 'jee' && (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              IIT-JEE Preparation Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => onNavigate('photo')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Camera className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Numerical Problem Solver
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Snap Physics, Chemistry, or Calculus numericals for rigorous step-by-step derivations.
                </p>
              </div>

              <div
                onClick={() => onNavigate('generator')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Atom className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Formula & Concept Sheets
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Generate condensed JEE formula sheets and active-recall decks per chapter.
                </p>
              </div>

              <div
                onClick={() => onNavigate('exam')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Timed JEE Mock Tests
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Simulate exam timing with negative marking and accuracy breakdown.
                </p>
              </div>

              <div
                onClick={() => onNavigate('progress')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Performance Analytics
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Review weak topics flagged for revision and mock test score trends.
                </p>
              </div>
            </div>
          </section>
        )}

        {goalConfig.kind === 'neet' && (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              NEET-UG Medical Workspace
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => onNavigate('ncert_hub')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Dna className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  NCERT-Based Revision
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  High-yield NCERT Biology & Chemistry line-by-line conceptual mastery.
                </p>
              </div>

              <div
                onClick={() => onNavigate('generator')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <FlaskConical className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Topic-Wise Bio & Chem Packs
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Build flashcards and summary notes for Genetics, Human Physiology, and Organic Chemistry.
                </p>
              </div>

              <div
                onClick={() => onNavigate('exam')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Timed NEET Mock Tests
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Practice speed and negative-marking discipline across 180-question style tests.
                </p>
              </div>

              <div
                onClick={() => onNavigate('progress')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Performance Analysis
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Track Botany, Zoology, Physics, and Chemistry accuracy over time.
                </p>
              </div>
            </div>
          </section>
        )}

        {goalConfig.kind === 'school' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                School Learning Tools ({goalConfig.selectedClass} · {goalConfig.board})
              </h2>
              {onOpenNcertGenerator && (
                <button
                  type="button"
                  onClick={() => onOpenNcertGenerator('both')}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Chapter Pack</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => onNavigate('ncert_hub')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Subjects & Chapters
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Browse verified NCERT textbooks, Foundation (5–8) & Secondary (9–10) chapters.
                </p>
              </div>

              <div
                onClick={() => onNavigate('notes')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chapter Notes ({notes.length})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Review saved summaries, definitions, and textbook exam pointers.
                </p>
              </div>

              <div
                onClick={() => onNavigate('revision')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Layers className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Flashcards ({dueFlashcards.length} due)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Active-recall Leitner spaced repetition for long-term memory.
                </p>
              </div>

              <div
                onClick={() => onNavigate('exam')}
                className="surface-card-interactive p-5 rounded-2xl cursor-pointer space-y-2.5"
              >
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  MCQ & Practice Tests
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Chapter quizzes, competency-based practice, and timed mock exams.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Lower Split: Study Planner & Revision Queue + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Revision Queue (topics marked Needs Revision) */}
            {revisionQueueTopics.length > 0 && (
              <div className="surface-card p-5 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Needs Revision Queue
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('syllabus')}
                    className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-2">
                  {revisionQueueTopics.map(topic => (
                    <div
                      key={topic.id}
                      className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {topic.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {topic.subjectName} · {topic.chapterName}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onLaunchTutorPrompt(
                            `Help me revise "${topic.title}" (${topic.chapterName}, ${topic.subjectName}) with key takeaways and 3 quick recall questions.`,
                            topic.subjectCategory
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0"
                      >
                        Revise
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Planner Checklist */}
            <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
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
                  Open Planner ({tasks.length})
                </button>
              </div>

              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-3">
                    No tasks scheduled for this goal yet. Add milestones in the Study Planner.
                  </p>
                ) : (
                  tasks.slice(0, 4).map(task => (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        task.completed
                          ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/60 dark:border-white/5 opacity-60'
                          : 'bg-white dark:bg-[#090e1a] border-slate-200/80 dark:border-[#1e2a47] hover:border-violet-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center text-white shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500'
                              : 'border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-semibold truncate ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 dark:text-slate-100'
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
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Real Student Activity Feed */}
            <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Recent Activity
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('progress')}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                >
                  <span>Analytics</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Complete a focus session, quiz, or topic review to start your study log.
                  </p>
                ) : (
                  activities.slice(0, 4).map(act => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/60 dark:border-[#1e2a47] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="truncate pr-2">{act.title}</span>
                        {act.durationMinutes && (
                          <span className="text-violet-600 dark:text-violet-400 font-bold shrink-0 tabular-nums">
                            {act.durationMinutes}m
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Flashcard Review */}
            <div className="surface-card p-5 sm:p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Spaced Revision
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {dueFlashcards.length} Due
                </span>
              </div>

              {flashcards[0] ? (
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {flashcards[0].topic}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    "{flashcards[0].front}"
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create flashcards from chapters or AI Tutor chats to build active recall decks.
                </p>
              )}

              <button
                type="button"
                onClick={() => onNavigate('revision')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                {dueFlashcards.length > 0 ? 'Review Due Flashcards' : 'Open Flashcard Studio'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
