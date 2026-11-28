import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
  Calendar,
  BookOpen,
  AlertTriangle,
  ArrowRightLeft,
  FileText,
  Layers,
  Award,
} from 'lucide-react';
import {
  AppView,
  Flashcard,
  GoalConfig,
  MockTestAttempt,
  SavedNote,
  TopicStatus,
} from '../types';
import { computeSyllabusSummary } from '../lib/syllabusTracker';

interface SyllabusTrackerViewProps {
  goalConfig: GoalConfig;
  topicProgress: Record<string, TopicStatus>;
  onUpdateTopicStatus: (topicId: string, status: TopicStatus) => void;
  notes: SavedNote[];
  flashcards: Flashcard[];
  mockTests: MockTestAttempt[];
  onStudyTopicWithAi: (prompt: string, subjectName: string) => void;
  onNavigate: (view: AppView) => void;
  onOpenGoalSwitcher: () => void;
}

const STATUS_META: Record<
  TopicStatus,
  {
    label: string;
    shortLabel: string;
    icon: React.FC<{ className?: string }>;
    badgeClass: string;
    activeBtnClass: string;
  }
> = {
  not_started: {
    label: 'Not started',
    shortLabel: 'Not started',
    icon: Circle,
    badgeClass:
      'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    activeBtnClass:
      'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200',
  },
  in_progress: {
    label: 'In progress',
    shortLabel: 'In progress',
    icon: Clock,
    badgeClass:
      'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/70',
    activeBtnClass: 'bg-indigo-600 text-white border-indigo-600',
  },
  completed: {
    label: 'Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    badgeClass:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/70',
    activeBtnClass: 'bg-emerald-600 text-white border-emerald-600',
  },
  needs_revision: {
    label: 'Needs revision',
    shortLabel: 'Revise',
    icon: RotateCcw,
    badgeClass:
      'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/70',
    activeBtnClass: 'bg-amber-600 text-white border-amber-600',
  },
};

const CHAPTERS_PAGE_SIZE = 8;

export const SyllabusTrackerView: React.FC<SyllabusTrackerViewProps> = ({
  goalConfig,
  topicProgress,
  onUpdateTopicStatus,
  notes,
  flashcards,
  mockTests,
  onStudyTopicWithAi,
  onNavigate,
  onOpenGoalSwitcher,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TopicStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [visibleChapterLimit, setVisibleChapterLimit] = useState<number>(CHAPTERS_PAGE_SIZE);

  const summary = useMemo(
    () => computeSyllabusSummary(goalConfig, topicProgress, notes, flashcards, mockTests),
    [goalConfig, topicProgress, notes, flashcards, mockTests]
  );

  const filteredChapters = useMemo(() => {
    if (!summary.isAvailable) return [];
    const q = searchQuery.trim().toLowerCase();

    const chapters = summary.subjects
      .filter(sub => selectedSubjectId === 'all' || sub.subjectId === selectedSubjectId)
      .flatMap(sub => sub.chapters);

    return chapters
      .map(ch => {
        const matchingTopics = ch.topics.filter(topic => {
          const matchesStatus = statusFilter === 'all' || topic.status === statusFilter;
          const matchesQuery =
            !q ||
            topic.title.toLowerCase().includes(q) ||
            ch.name.toLowerCase().includes(q) ||
            ch.subjectName.toLowerCase().includes(q) ||
            ch.textbookRef.toLowerCase().includes(q);
          return matchesStatus && matchesQuery;
        });
        return {
          ...ch,
          filteredTopics: matchingTopics,
        };
      })
      .filter(ch => ch.filteredTopics.length > 0);
  }, [summary, selectedSubjectId, statusFilter, searchQuery]);

  const visibleChapters = filteredChapters.slice(0, visibleChapterLimit);
  const hasMoreChapters = filteredChapters.length > visibleChapterLimit;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  if (!summary.isAvailable) {
    return (
      <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-16">
          <div className="surface-card rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Syllabus Data Unavailable for {goalConfig.label}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {summary.unavailableReason}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  ORYQEN only tracks verified official syllabus topics and never fabricates missing
                  chapters or textbook structures.
                  {summary.availableClassesForBoard.length > 0 && (
                    <>
                      {' '}
                      Currently verified for {goalConfig.board}:{' '}
                      <strong>{summary.availableClassesForBoard.join(', ')}</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-[#1e2a47]">
              <button
                type="button"
                onClick={onOpenGoalSwitcher}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to Verified Goal</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('doc')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1e2a47] hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Upload Your Syllabus PDF</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('generator')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1e2a47] hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use AI Study Generator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Top Goal & Progress Header */}
        <div className="surface-card rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-violet-600 dark:text-violet-400 font-bold">
                  Intelligent Syllabus Tracker
                </span>
                <span aria-hidden="true">·</span>
                <span>{goalConfig.label}</span>
                <span aria-hidden="true">·</span>
                <span>{goalConfig.medium} Medium</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {goalConfig.pathType === 'competitive'
                  ? `${goalConfig.competitiveExam} Complete Syllabus`
                  : `${goalConfig.selectedClass} · ${goalConfig.board} Syllabus`}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenGoalSwitcher}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-white dark:bg-[#090e1a] hover:border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Switch Goal</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('generator')}
                className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Study Pack</span>
              </button>
            </div>
          </div>

          {/* 6 KPI Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/80 dark:border-[#1e2a47] p-3.5">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Total Topics
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                {summary.totalTopics}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/50 p-3.5">
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Completed
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5">
                {summary.completedTopics}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/80 dark:border-[#1e2a47] p-3.5">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Remaining
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                {summary.remainingTopics}
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200/80 dark:border-indigo-800/50 p-3.5">
              <div className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                In Progress
              </div>
              <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 tabular-nums mt-0.5">
                {summary.inProgressTopics}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-800/50 p-3.5">
              <div className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                Needs Revision
              </div>
              <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 tabular-nums mt-0.5">
                {summary.needsRevisionTopics}
              </div>
            </div>

            <div className="rounded-xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200/80 dark:border-violet-800/50 p-3.5">
              <div className="text-[11px] font-medium text-violet-700 dark:text-violet-300">
                Overall Completion
              </div>
              <div className="text-2xl font-extrabold text-violet-700 dark:text-violet-300 tabular-nums mt-0.5">
                {summary.completionPercentage}%
              </div>
            </div>
          </div>

          {/* Overall Progress Bar + Transparent Estimated Completion Date */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-1">
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Progress Formula: ({summary.completedTopics} completed ÷ {summary.totalTopics} total topics) × 100
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {summary.completionPercentage}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200/80 dark:border-[#1e2a47] p-3.5 flex items-start gap-3">
              <Calendar className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Estimated Completion: {summary.estimatedCompletionDate || 'N/A'}
                  </span>
                  {summary.estimatedDaysRemaining !== null && summary.estimatedDaysRemaining > 0 && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      (~{summary.estimatedDaysRemaining} days)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {summary.estimateBasisNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Breakdown Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Subject-Wise Completion ({summary.subjects.length})
            </h2>
            {selectedSubjectId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSubjectId('all')}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
              >
                Show All Subjects
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {summary.subjects.map(sub => {
              const isSelected = selectedSubjectId === sub.subjectId;
              return (
                <button
                  key={sub.subjectId}
                  type="button"
                  onClick={() => {
                    setSelectedSubjectId(isSelected ? 'all' : sub.subjectId);
                    setVisibleChapterLimit(CHAPTERS_PAGE_SIZE);
                  }}
                  className={`text-left rounded-xl p-4 border transition-all space-y-2.5 ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/30 ring-1 ring-violet-500/30'
                      : 'surface-card-interactive'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {sub.subjectName}
                    </span>
                    <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400 tabular-nums shrink-0">
                      {sub.completionPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all duration-300"
                      style={{ width: `${sub.completionPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      {sub.completedTopics}/{sub.totalTopics} topics
                    </span>
                    <span>
                      {sub.needsRevisionTopics > 0
                        ? `${sub.needsRevisionTopics} revise`
                        : `${sub.remainingTopics} left`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="surface-card rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setVisibleChapterLimit(CHAPTERS_PAGE_SIZE);
              }}
              placeholder="Search chapters, topics, or textbooks..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by subject"
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value);
                setVisibleChapterLimit(CHAPTERS_PAGE_SIZE);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] text-xs font-semibold outline-none"
            >
              <option value="all">All Subjects ({summary.subjects.length})</option>
              {summary.subjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#090e1a] border border-slate-200 dark:border-[#1e2a47]">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'not_started', label: 'Not started' },
                  { id: 'in_progress', label: 'In progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'needs_revision', label: 'Needs revision' },
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setVisibleChapterLimit(CHAPTERS_PAGE_SIZE);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-white dark:bg-violet-600 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chapters & Topic Status List (Paginated for performance) */}
        <div className="space-y-3">
          {visibleChapters.length === 0 ? (
            <div className="surface-card rounded-2xl p-8 text-center space-y-2">
              <BookOpen className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                No syllabus topics match your current filter
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try clearing your search query or switching back to all statuses.
              </p>
            </div>
          ) : (
            visibleChapters.map((ch, index) => {
              const isExpanded =
                expandedChapters[ch.id] !== undefined ? expandedChapters[ch.id] : index < 2;

              return (
                <div
                  key={ch.id}
                  className="surface-card rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleChapter(ch.id)}
                    className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-violet-600 dark:text-violet-400">
                          {ch.subjectName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{ch.textbookRef}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {ch.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right tabular-nums">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {ch.completionPercentage}%
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {ch.completedCount}/{ch.topics.length} done
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-[#1e2a47] divide-y divide-slate-100 dark:divide-[#19233d]">
                      {ch.filteredTopics.map(topic => {
                        const meta = STATUS_META[topic.status];
                        const StatusIcon = meta.icon;

                        return (
                          <div
                            key={topic.id}
                            className="px-5 py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white/60 dark:bg-transparent"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold shrink-0 ${meta.badgeClass}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  <span>{meta.label}</span>
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {topic.title}
                                </span>
                              </div>

                              {(topic.hasLinkedNote ||
                                topic.hasLinkedFlashcard ||
                                topic.hasLinkedMockTest) && (
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                                  {topic.hasLinkedNote && (
                                    <span className="inline-flex items-center gap-1">
                                      <FileText className="w-3 h-3 text-indigo-500" />
                                      Notes linked
                                    </span>
                                  )}
                                  {topic.hasLinkedFlashcard && (
                                    <span className="inline-flex items-center gap-1">
                                      <Layers className="w-3 h-3 text-emerald-500" />
                                      Flashcards linked
                                    </span>
                                  )}
                                  {topic.hasLinkedMockTest && (
                                    <span className="inline-flex items-center gap-1">
                                      <Award className="w-3 h-3 text-amber-500" />
                                      Mock attempt logged
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Explicit 4-status controls + Study Action */}
                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              {(
                                ['not_started', 'in_progress', 'completed', 'needs_revision'] as TopicStatus[]
                              ).map(st => {
                                const stMeta = STATUS_META[st];
                                const Icon = stMeta.icon;
                                const isActive = topic.status === st;
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => onUpdateTopicStatus(topic.id, st)}
                                    aria-pressed={isActive}
                                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                                      isActive
                                        ? stMeta.activeBtnClass
                                        : 'border-slate-200 dark:border-[#1e2a47] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    <span>{stMeta.shortLabel}</span>
                                  </button>
                                );
                              })}

                              <button
                                type="button"
                                onClick={() =>
                                  onStudyTopicWithAi(
                                    `Teach me "${topic.title}" from ${ch.name} (${ch.subjectName}, ${goalConfig.label}). Give clear conceptual explanations, key exam points, and 2 practice questions.`,
                                    ch.subjectCategory
                                  )
                                }
                                className="ml-1 px-2.5 py-1 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 text-violet-700 dark:text-violet-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Ask AI</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {hasMoreChapters && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleChapterLimit(prev => prev + CHAPTERS_PAGE_SIZE)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-white dark:bg-[#0d1323] hover:border-violet-500/40 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors tabular-nums"
              >
                Show more chapters ({filteredChapters.length - visibleChapterLimit} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
