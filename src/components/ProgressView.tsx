import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  MessageSquare,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Brain,
  AlertTriangle,
  Flame,
  Calendar,
} from 'lucide-react';
import {
  UserProfile,
  MockTestAttempt,
  Flashcard,
  Conversation,
  StudyTask,
  StudyStreak,
} from '../types';
import { storage } from '../lib/storage';

interface ProgressViewProps {
  profile: UserProfile;
  mockTests: MockTestAttempt[];
  flashcards: Flashcard[];
  conversations: Conversation[];
  tasks: StudyTask[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  mockTests,
  flashcards,
  conversations,
  tasks,
}) => {
  const streak: StudyStreak = storage.getStudyStreak();

  const totalQuestions = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'user').length,
    0
  );

  const completedTasks = tasks.filter(t => t.completed).length;

  const averageAccuracy =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + (Number(t.accuracyPercentage) || 0), 0) / mockTests.length
        )
      : 0;

  // Box distribution in Leitner system
  const boxCounts = [1, 2, 3, 4, 5].map(
    boxNum => flashcards.filter(c => c.box === boxNum).length
  );

  // Subject question distribution
  const subjectDistribution: Record<string, number> = {};
  conversations.forEach(c => {
    const qCount = c.messages.filter(m => m.role === 'user').length;
    if (qCount > 0) {
      subjectDistribution[c.subject] = (subjectDistribution[c.subject] || 0) + qCount;
    }
  });

  // Real weak-topic analysis from incorrect test results
  const incorrectQuestions = mockTests.flatMap(t =>
    t.questionResults.filter(q => !q.isCorrect)
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Academic Performance & Retention</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Learning Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real data compiled from your practice tests, flashcard recall, and focus sprints.
          </p>
        </div>

        {/* Top 4 Real Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Study Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {streak.currentStreak} Days
            </div>
            <div className="text-[11px] text-slate-400">Longest streak: {streak.longestStreak} days</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Exam Accuracy</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {mockTests.length > 0 ? `${averageAccuracy}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-400">Across {mockTests.length} mock tests</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Mastered Cards</span>
              <Layers className="w-4 h-4 text-violet-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {flashcards.filter(c => c.box >= 4).length}
            </div>
            <div className="text-[11px] text-slate-400">In Box 4 & 5 (Permanent memory)</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Focus Time Today</span>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {streak.todayMinutes}m
            </div>
            <div className="text-[11px] text-slate-400">Daily goal: {profile.dailyStudyTargetMinutes || 30}m</div>
          </div>
        </div>

        {/* Leitner Spaced Repetition Box Distribution */}
        <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Spaced Repetition Retention Curve (Leitner 5-Box System)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Flashcards move into higher boxes as you recall them successfully, extending interval spacing.
              </p>
            </div>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950 px-2.5 py-1 rounded-full border border-violet-200/60 dark:border-violet-800/60">
              {flashcards.length} Total Cards
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { box: 1, label: 'Box 1', interval: '1 Day', color: 'bg-rose-500' },
              { box: 2, label: 'Box 2', interval: '3 Days', color: 'bg-amber-500' },
              { box: 3, label: 'Box 3', interval: '7 Days', color: 'bg-indigo-500' },
              { box: 4, label: 'Box 4', interval: '14 Days', color: 'bg-violet-500' },
              { box: 5, label: 'Box 5', interval: '30 Days', color: 'bg-emerald-500' },
            ].map(b => {
              const count = boxCounts[b.box - 1];
              const pct = flashcards.length > 0 ? Math.round((count / flashcards.length) * 100) : 0;
              return (
                <div key={b.box} className="space-y-2 text-center">
                  <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800/60 p-2 flex flex-col justify-end items-center overflow-hidden">
                    <div
                      className={`w-full ${b.color} rounded-xl transition-all duration-500 min-h-[4px]`}
                      style={{ height: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                  <div>
                    <div className="font-display font-bold text-slate-900 dark:text-white text-sm">
                      {count}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{b.label}</div>
                    <div className="text-[10px] text-slate-400">{b.interval}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column Grid: Weak-Topic Analysis & Recent Exam Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weak-Topic & Diagnostic Focus */}
          <div className="clay-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Weak-Topic Diagnostic
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identified from questions missed during mock examination attempts.
            </p>

            {incorrectQuestions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="font-bold text-slate-800 dark:text-slate-200 block">No Critical Weaknesses Flagged</span>
                <span>You answered all questions correctly or haven't attempted a mock test yet.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {incorrectQuestions.slice(0, 5).map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-xs space-y-1"
                  >
                    <div className="font-bold text-rose-900 dark:text-rose-200 line-clamp-1">
                      {q.question}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      Review Solution: {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Performance Trajectory */}
          <div className="clay-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Mock Test Score Trajectory
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recent timed exam attempts and accuracy scores.
            </p>

            {mockTests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
                No mock test attempts recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {mockTests.slice(0, 5).map(test => (
                  <div
                    key={test.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                        {test.examTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(test.completedAt).toLocaleDateString()} · {test.obtainedMarks}/{test.totalMarks} marks
                      </div>
                    </div>
                    <div className="font-display font-black text-sm text-emerald-600 dark:text-emerald-400 shrink-0">
                      {test.accuracyPercentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
