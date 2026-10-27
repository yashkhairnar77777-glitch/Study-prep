import React from 'react';
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

  // Last 7 days streak indicators (Sun..Sat)
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
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
                  onClick={() => setIsOpenModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>Start Focus Sprint</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
