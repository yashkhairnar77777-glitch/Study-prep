import {
  Flashcard,
  GoalConfig,
  MockTestAttempt,
  SavedNote,
  SubjectCategory,
  TopicStatus,
} from '../types';
import { SyllabusChapter, SyllabusSubjectInfo } from './curriculum/types';
import { resolveSyllabusForGoal } from './goalManager';

export interface TrackedTopic {
  id: string;
  title: string;
  chapterId: string;
  chapterName: string;
  textbookRef: string;
  subjectId: string;
  subjectName: string;
  subjectCategory: SubjectCategory;
  status: TopicStatus;
  hasLinkedNote: boolean;
  hasLinkedFlashcard: boolean;
  hasLinkedMockTest: boolean;
}

export interface TrackedChapter {
  id: string;
  name: string;
  textbookRef: string;
  subjectId: string;
  subjectName: string;
  subjectCategory: SubjectCategory;
  topics: TrackedTopic[];
  completedCount: number;
  inProgressCount: number;
  needsRevisionCount: number;
  notStartedCount: number;
  completionPercentage: number;
}

export interface SubjectProgressSummary {
  subjectId: string;
  subjectName: string;
  subjectCategory: SubjectCategory;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  needsRevisionTopics: number;
  notStartedTopics: number;
  remainingTopics: number;
  completionPercentage: number;
  chapters: TrackedChapter[];
}

export interface SyllabusSummary {
  isAvailable: boolean;
  unavailableReason?: string;
  availableClassesForBoard: string[];
  totalTopics: number;
  completedTopics: number;
  remainingTopics: number;
  inProgressTopics: number;
  needsRevisionTopics: number;
  notStartedTopics: number;
  completionPercentage: number; // Exact formula: (Completed / Total) * 100
  estimatedCompletionDate: string | null;
  estimatedDaysRemaining: number | null;
  estimateBasisNote: string;
  subjects: SubjectProgressSummary[];
  allTopics: TrackedTopic[];
}

export function buildTopicKey(chapterId: string, topicIndex: number): string {
  return `${chapterId}::topic-${topicIndex}`;
}

function inferStatusFromActivity(
  chapter: SyllabusChapter,
  subject: SyllabusSubjectInfo,
  notes: SavedNote[],
  flashcards: Flashcard[],
  mockTests: MockTestAttempt[]
): {
  status: TopicStatus;
  hasLinkedNote: boolean;
  hasLinkedFlashcard: boolean;
  hasLinkedMockTest: boolean;
} {
  const chLower = chapter.name.toLowerCase();

  const hasLinkedNote = notes.some(n => {
    const t = n.title.toLowerCase();
    const tags = (n.tags || []).map(x => x.toLowerCase());
    return t.includes(chLower) || tags.some(tag => tag.includes(chLower));
  });

  const hasLinkedFlashcard = flashcards.some(f => {
    const topicLower = f.topic.toLowerCase();
    const frontLower = f.front.toLowerCase();
    return topicLower.includes(chLower) || frontLower.includes(chLower);
  });

  const relatedTests = mockTests.filter(m => {
    const titleLower = m.examTitle.toLowerCase();
    const subjLower = m.subject.toLowerCase();
    return (
      titleLower.includes(chLower) ||
      (subjLower === subject.category.toLowerCase() &&
        m.questionResults?.some(q => q.question.toLowerCase().includes(chLower)))
    );
  });

  const hasLinkedMockTest = relatedTests.length > 0;

  // Never auto-mark as completed just from opening a note; only infer in_progress or needs_revision from low mock accuracy
  const hasLowMockScore = relatedTests.some(t => t.accuracyPercentage < 60);
  if (hasLowMockScore) {
    return { status: 'needs_revision', hasLinkedNote, hasLinkedFlashcard, hasLinkedMockTest };
  }
  if (hasLinkedNote || hasLinkedFlashcard || hasLinkedMockTest) {
    return { status: 'in_progress', hasLinkedNote, hasLinkedFlashcard, hasLinkedMockTest };
  }
  return { status: 'not_started', hasLinkedNote, hasLinkedFlashcard, hasLinkedMockTest };
}

export function computeSyllabusSummary(
  config: GoalConfig,
  topicProgress: Record<string, TopicStatus>,
  notes: SavedNote[],
  flashcards: Flashcard[],
  mockTests: MockTestAttempt[]
): SyllabusSummary {
  const resolved = resolveSyllabusForGoal(config);

  if (!resolved.isAvailable) {
    return {
      isAvailable: false,
      unavailableReason: resolved.unavailableReason,
      availableClassesForBoard: resolved.availableClassesForBoard,
      totalTopics: 0,
      completedTopics: 0,
      remainingTopics: 0,
      inProgressTopics: 0,
      needsRevisionTopics: 0,
      notStartedTopics: 0,
      completionPercentage: 0,
      estimatedCompletionDate: null,
      estimatedDaysRemaining: null,
      estimateBasisNote: 'Unavailable until a verified syllabus is loaded for this goal.',
      subjects: [],
      allTopics: [],
    };
  }

  const subjects: SubjectProgressSummary[] = [];
  const allTopics: TrackedTopic[] = [];

  for (const subject of resolved.activeSubjects) {
    const trackedChapters: TrackedChapter[] = [];
    let subTotal = 0;
    let subCompleted = 0;
    let subInProgress = 0;
    let subNeedsRevision = 0;
    let subNotStarted = 0;

    for (const ch of subject.chapters) {
      const activity = inferStatusFromActivity(ch, subject, notes, flashcards, mockTests);
      const rawTopics =
        ch.syllabusTopics && ch.syllabusTopics.length > 0
          ? ch.syllabusTopics
          : [ch.name];

      const trackedTopics: TrackedTopic[] = rawTopics.map((topicTitle, idx) => {
        const key = buildTopicKey(ch.id, idx);
        const status: TopicStatus = topicProgress[key] || activity.status;

        const item: TrackedTopic = {
          id: key,
          title: topicTitle,
          chapterId: ch.id,
          chapterName: ch.name,
          textbookRef: ch.textbookRef,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCategory: subject.category,
          status,
          hasLinkedNote: activity.hasLinkedNote,
          hasLinkedFlashcard: activity.hasLinkedFlashcard,
          hasLinkedMockTest: activity.hasLinkedMockTest,
        };

        allTopics.push(item);
        return item;
      });

      const chCompleted = trackedTopics.filter(t => t.status === 'completed').length;
      const chInProgress = trackedTopics.filter(t => t.status === 'in_progress').length;
      const chNeedsRevision = trackedTopics.filter(t => t.status === 'needs_revision').length;
      const chNotStarted = trackedTopics.filter(t => t.status === 'not_started').length;
      const chTotal = trackedTopics.length;
      const chPct = chTotal > 0 ? Math.round((chCompleted / chTotal) * 1000) / 10 : 0;

      subTotal += chTotal;
      subCompleted += chCompleted;
      subInProgress += chInProgress;
      subNeedsRevision += chNeedsRevision;
      subNotStarted += chNotStarted;

      trackedChapters.push({
        id: ch.id,
        name: ch.name,
        textbookRef: ch.textbookRef,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCategory: subject.category,
        topics: trackedTopics,
        completedCount: chCompleted,
        inProgressCount: chInProgress,
        needsRevisionCount: chNeedsRevision,
        notStartedCount: chNotStarted,
        completionPercentage: chPct,
      });
    }

    const subPct = subTotal > 0 ? Math.round((subCompleted / subTotal) * 1000) / 10 : 0;
    subjects.push({
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCategory: subject.category,
      totalTopics: subTotal,
      completedTopics: subCompleted,
      inProgressTopics: subInProgress,
      needsRevisionTopics: subNeedsRevision,
      notStartedTopics: subNotStarted,
      remainingTopics: subTotal - subCompleted,
      completionPercentage: subPct,
      chapters: trackedChapters,
    });
  }

  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter(t => t.status === 'completed').length;
  const inProgressTopics = allTopics.filter(t => t.status === 'in_progress').length;
  const needsRevisionTopics = allTopics.filter(t => t.status === 'needs_revision').length;
  const notStartedTopics = allTopics.filter(t => t.status === 'not_started').length;
  const remainingTopics = Math.max(0, totalTopics - completedTopics);

  // Exact required formula: Completion percentage = (Completed topics / Total applicable topics) * 100
  const completionPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 1000) / 10 : 0;

  // Transparent estimate based on remaining workload & planned daily study schedule
  // Assume ~45 study minutes per topic on average (adjusted by path complexity)
  const minutesPerTopic = config.kind === 'upsc' ? 65 : config.kind === 'jee' || config.kind === 'neet' ? 55 : 40;
  const dailyTarget = Math.max(15, config.dailyStudyTargetMinutes || 45);
  const revisionPenaltyTopics = Math.ceil(needsRevisionTopics * 0.4);
  const effectiveRemainingUnits = remainingTopics + revisionPenaltyTopics;

  let estimatedCompletionDate: string | null = null;
  let estimatedDaysRemaining: number | null = null;
  let estimateBasisNote = '';

  if (totalTopics === 0) {
    estimateBasisNote = 'No topics loaded.';
  } else if (remainingTopics === 0) {
    estimatedDaysRemaining = 0;
    estimatedCompletionDate = 'Syllabus Completed';
    estimateBasisNote = 'All applicable syllabus topics are marked completed.';
  } else {
    const totalEstimatedMinutes = effectiveRemainingUnits * minutesPerTopic;
    estimatedDaysRemaining = Math.max(1, Math.ceil(totalEstimatedMinutes / dailyTarget));
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + estimatedDaysRemaining);
    estimatedCompletionDate = targetDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    estimateBasisNote = `Estimate based on ${remainingTopics} remaining topic${remainingTopics === 1 ? '' : 's'} (~${minutesPerTopic}m/topic) at your ${dailyTarget} min/day study plan.`;
  }

  return {
    isAvailable: true,
    availableClassesForBoard: resolved.availableClassesForBoard,
    totalTopics,
    completedTopics,
    remainingTopics,
    inProgressTopics,
    needsRevisionTopics,
    notStartedTopics,
    completionPercentage,
    estimatedCompletionDate,
    estimatedDaysRemaining,
    estimateBasisNote,
    subjects,
    allTopics,
  };
}
