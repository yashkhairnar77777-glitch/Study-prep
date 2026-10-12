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
} from 'lucide-react';
import {
  UserProfile,
  MockTestAttempt,
  Flashcard,
  Conversation,
  StudyTask,
} from '../types';

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
  const totalQuestions = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'user').length,
    0
  );

  const completedTasks = tasks.filter(t => t.completed).length;

  const averageAccuracy =
    mockTests.length > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + t.accuracyPercentage, 0) / mockTests.length
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

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Academic Performance & Retention</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real data compiled from your practice tests, flashcard reviews, and problem-solving sessions.
          </p>
        </div>

        {/* Top 4 Real Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Test Accuracy</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {mockTests.length > 0 ? `${averageAccuracy}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-400">Across {mockTests.length} mock tests</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Flashcards Mastered</span>
              <Layers className="w-4 h-4 text-violet-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {flashcards.filter(c => c.box >= 4).length}
            </div>
            <div className="text-[11px] text-slate-400">In Box 4 & 5 (Permanent memory)</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Problems Solved</span>
              <MessageSquare className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalQuestions}
            </div>
            <div className="text-[11px] text-slate-400">With step-by-step reasoning</div>
          </div>

          <div className="clay-card p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Task Completion</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {tasks.length > 0 ? `${Math.round((completedTasks / tasks.length) * 100)}%` : '0%'}
            </div>
            <div className="text-[11px] text-slate-400">{completedTasks} of {tasks.length} tasks finished</div>
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
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              {flashcards.length} Total Cards
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-4 pt-2">
            {[
              { num: 1, label: 'Daily', color: 'bg-rose-500', count: boxCounts[0] },
              { num: 2, label: '3 Days', color: 'bg-amber-500', count: boxCounts[1] },
              { num: 3, label: '1 Week', color: 'bg-indigo-500', count: boxCounts[2] },
              { num: 4, label: '2 Weeks', color: 'bg-violet-500', count: boxCounts[3] },
              { num: 5, label: '1 Month', color: 'bg-emerald-500', count: boxCounts[4] },
            ].map(box => (
              <div key={box.num} className="clay-card-flat p-4 rounded-2xl text-center space-y-2">
                <div className="text-[11px] font-bold text-slate-500">Box {box.num}</div>
                <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  {box.count}
                </div>
                <div className="text-[10px] text-slate-400">{box.label}</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${box.color}`}
                    style={{
                      width: flashcards.length > 0 ? `${(box.count / flashcards.length) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Test Score History */}
        <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              Mock Test Performance History
            </h2>
            <span className="text-xs text-slate-500">
              {mockTests.length} {mockTests.length === 1 ? 'Exam' : 'Exams'} Completed
            </span>
          </div>

          {mockTests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              You haven't attempted any mock tests yet. Generate your first timed exam to track scores!
            </div>
          ) : (
            <div className="space-y-3">
              {mockTests.map(attempt => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-2xl clay-card-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {attempt.examTitle}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>{attempt.subject}</span>
                      <span>·</span>
                      <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{Math.round(attempt.timeSpentSeconds / 60)} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="font-display text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        {attempt.accuracyPercentage}%
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {attempt.obtainedMarks} / {attempt.totalMarks} marks
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
