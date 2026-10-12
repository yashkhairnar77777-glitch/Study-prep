import React from 'react';
import {
  Sparkles,
  Award,
  Layers,
  MessageSquare,
  Bookmark,
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
} from '../types';
import { IMAGES } from '../assets/images';

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
}) => {
  const totalQuestionsAsked = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'user').length,
    0
  );

  const dueFlashcards = flashcards.filter(c => c.nextReviewDate <= Date.now());

  const averageAccuracy =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + t.accuracyPercentage, 0) / mockTests.length
        )
      : 0;

  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Personalized Welcome Clay Card with 3D Mascot */}
        <div className="relative overflow-hidden rounded-3xl clay-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/40">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {profile.selectedClass || profile.grade}
                {profile.collegeCourse ? ` · ${profile.collegeCourse}` : ''}
                {profile.competitiveExamCategory ? ` · ${profile.competitiveExamCategory}` : ''}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {profile.name || 'Scholar'}!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Your personalized study space is active for{' '}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.primarySubject}</span>.
              Explore concepts with AI step-by-step reasoning, snap homework photos, analyze documents, and practice with curriculum-aligned mock tests.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('chat')}
                className="px-5 py-2.5 clay-btn-primary font-bold text-xs flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask AI Tutor</span>
              </button>

              <button
                onClick={() => onNavigate('exam')}
                className="px-5 py-2.5 clay-btn-secondary font-bold text-xs flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Generate Mock Exam</span>
              </button>
            </div>
          </div>

          {/* 3D Clay Mascot Display */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl overflow-hidden p-1 bg-white/80 dark:bg-slate-800/80 shadow-inner">
              <img
                src={IMAGES.CLAY_MASCOT}
                alt="AI Mascot"
                className="w-full h-full object-cover rounded-xl filter drop-shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Real Metrics Clay Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalQuestionsAsked}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Questions Solved</div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {dueFlashcards.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Flashcards Due</div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {mockTests.length > 0 ? `${averageAccuracy}%` : 'N/A'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mock Test Accuracy</div>
            </div>
          </div>

          <div className="clay-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {completedTasks}/{tasks.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tasks Completed</div>
            </div>
          </div>
        </div>

        {/* Core Tool Action Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Study Tools & Workspaces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. AI Chat */}
            <div
              onClick={() => onNavigate('chat')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Conversational Tutor
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ask conceptual questions, request step-by-step math derivations, or get exam-ready scoring outlines.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Start Chat</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. Photo Solver */}
            <div
              onClick={() => onNavigate('photo')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Photo Question Solver
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Snap or upload textbook questions, geometry figures, and complex circuit diagrams for verified solutions.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                <span>Solve Image</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. PDF Analysis */}
            <div
              onClick={() => onNavigate('doc')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  PDF & Doc Analysis
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Extract passages from textbook PDFs, summarize lengthy research papers, and generate chapter study guides.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Analyze Document</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 4. Exam Generator */}
            <div
              onClick={() => onNavigate('exam')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Exam Generator & Mocks
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generate realistic examination papers with custom rubrics. Take timed mock tests with instant answer feedback.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Create Exam</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Lower Grid: Study Planner Tasks & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Study Planner Checklist (7 Cols) */}
          <div className="lg:col-span-7 clay-card p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Study Planner
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High-yield study checklist for {profile.primarySubject}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All Tasks
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 opacity-60'
                      : 'clay-card-flat border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        task.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {task.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity / Flashcards Quick Review (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Flashcard Box */}
            <div className="clay-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-500" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Smart Flashcards
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('revision')}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Review Mode
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                You have <span className="font-bold text-violet-600 dark:text-violet-400">{dueFlashcards.length} cards</span> ready for review using the Leitner 5-box memory curve.
              </p>

              <div className="p-3.5 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-900/40">
                <div className="text-xs font-bold text-violet-900 dark:text-violet-200">
                  {flashcards[0]?.topic || 'Physics & Math Key Formulas'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                  "{flashcards[0]?.front || 'What is Newton’s Second Law?'}"
                </div>
              </div>

              <button
                onClick={() => onNavigate('revision')}
                className="w-full py-2.5 clay-btn-primary font-bold text-xs"
              >
                Review Due Cards Now
              </button>
            </div>

            {/* Recent Mock Tests / Attempts */}
            <div className="clay-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Recent Mock Tests
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('exam')}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  New Test
                </button>
              </div>

              {mockTests.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500">
                  No mock tests completed yet. Take your first test to track your scoring trajectory!
                </div>
              ) : (
                <div className="space-y-2">
                  {mockTests.slice(0, 3).map(test => (
                    <div
                      key={test.id}
                      className="p-2.5 rounded-xl clay-card-flat flex items-center justify-between text-xs"
                    >
                      <div className="truncate">
                        <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {test.examTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(test.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">
                          {test.accuracyPercentage}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {test.obtainedMarks}/{test.totalMarks} marks
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
