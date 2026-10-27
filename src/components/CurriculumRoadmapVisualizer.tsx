import React, { useState, useMemo } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  MessageSquare,
  BookMarked,
  Filter,
  Flame,
  Zap,
  RotateCcw,
  Eye,
  X,
} from 'lucide-react';
import {
  UserProfile,
  SavedNote,
  MockTestAttempt,
  Flashcard,
  AppView,
  SubjectCategory,
  Conversation,
} from '../types';
import {
  SYLLABUS_REGISTRY,
  SyllabusChapter,
  SyllabusSubjectInfo,
  SyllabusClassInfo,
} from '../lib/syllabusData';
import { storage } from '../lib/storage';
import { MarkdownRenderer } from './MarkdownRenderer';

interface CurriculumRoadmapVisualizerProps {
  profile: UserProfile;
  notes: SavedNote[];
  mockTests: MockTestAttempt[];
  flashcards: Flashcard[];
  onNavigate: (view: AppView) => void;
  onSelectConversation?: (id: string) => void;
  onUpdateNotes?: (notes: SavedNote[]) => void;
  onOpenNcertGenerator?: (mode?: 'flashcards' | 'notes' | 'both') => void;
}

type ChapterStatus = 'mastered' | 'in_progress' | 'not_started';

export const CurriculumRoadmapVisualizer: React.FC<CurriculumRoadmapVisualizerProps> = ({
  profile,
  notes,
  mockTests,
  flashcards,
  onNavigate,
  onSelectConversation,
  onUpdateNotes,
  onOpenNcertGenerator,
}) => {
  // Manual progress overrides stored in localStorage
  const [manualProgress, setManualProgress] = useState<Record<string, ChapterStatus>>(() =>
    storage.getCurriculumProgress()
  );

  // Expanded nodes set
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set());

  // Quick read note preview modal state
  const [previewNote, setPreviewNote] = useState<SavedNote | null>(null);

  // Filter state for chapters
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'in_progress' | 'not_started'>('all');

  // Board and class lookup
  const boardInfo = SYLLABUS_REGISTRY[0]; // CBSE / NCERT default

  const currentClassInfo: SyllabusClassInfo = useMemo(() => {
    if (profile.selectedClass) {
      const match = boardInfo.classes.find(
        c =>
          c.name.toLowerCase().includes(profile.selectedClass!.toLowerCase()) ||
          profile.selectedClass!.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) return match;
    }
    if (profile.grade) {
      const match = boardInfo.classes.find(
        c =>
          c.gradeEquivalent.toLowerCase().includes(profile.grade.toLowerCase()) ||
          profile.grade.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) return match;
    }
    // Default to Class 6 or first available class
    return boardInfo.classes.find(c => c.name.includes('Class 6')) || boardInfo.classes[1] || boardInfo.classes[0];
  }, [boardInfo, profile.selectedClass, profile.grade]);

  // Subject options in the selected class
  const availableSubjects = currentClassInfo.subjects;

  // Selected subject state (defaults to profile.primarySubject if present in class, else first available)
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>(() => {
    const match = availableSubjects.find(
      s => s.name.toLowerCase() === profile.primarySubject.toLowerCase()
    );
    return match ? match.name : availableSubjects[0]?.name || 'Mathematics';
  });

  const activeSubjectInfo: SyllabusSubjectInfo = useMemo(() => {
    return (
      availableSubjects.find(s => s.name.toLowerCase() === selectedSubjectName.toLowerCase()) ||
      availableSubjects[0]
    );
  }, [availableSubjects, selectedSubjectName]);

  const chapters = activeSubjectInfo?.chapters || [];

  // Expand / collapse helper
  const toggleExpand = (id: string) => {
    setExpandedChapterIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedChapterIds(new Set(chapters.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedChapterIds(new Set());
  };

  // Helper to extract chapter number from ID or title
  const extractChapterNumber = (ch: SyllabusChapter, index: number): number => {
    const match = ch.id.match(/(\d+)$/) || ch.name.match(/chapter\s*(\d+)/i) || ch.name.match(/^(\d+)[\.\s]/);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return index + 1;
  };

  // Helper to find related notes for a chapter
  const getRelatedNotes = (ch: SyllabusChapter, chIndex: number): SavedNote[] => {
    const chNum = extractChapterNumber(ch, chIndex);
    const chNameLower = ch.name.toLowerCase();
    const chNumPatterns = [`ch ${chNum}`, `chapter ${chNum}`, `ch-${chNum}`, `chapter-${chNum}`];

    return notes.filter(n => {
      const titleLower = n.title.toLowerCase();
      const contentLower = n.content.toLowerCase();
      const tagsLower = n.tags ? n.tags.map(t => t.toLowerCase()) : [];

      // Check subject match or SST/Exploring Society correlation
      const isExploringSocietyChapter = ch.textbookRef.toLowerCase().includes('exploring society');
      const isExploringSocietyNote =
        titleLower.includes('exploring society') ||
        contentLower.includes('exploring society') ||
        tagsLower.some(t => t.includes('exploring society'));

      if (isExploringSocietyChapter && isExploringSocietyNote) {
        if (chNumPatterns.some(pat => titleLower.includes(pat) || contentLower.includes(pat))) {
          return true;
        }
      }

      // Direct name match or chapter number match
      const titleMatches = titleLower.includes(chNameLower) || chNumPatterns.some(p => titleLower.includes(p));
      const tagMatches = tagsLower.some(t => t.includes(chNameLower) || chNumPatterns.some(p => t.includes(p)));

      return titleMatches || tagMatches;
    });
  };

  // Helper to find related mock tests for a chapter
  const getRelatedMockTests = (ch: SyllabusChapter, chIndex: number): MockTestAttempt[] => {
    const chNum = extractChapterNumber(ch, chIndex);
    const chNameLower = ch.name.toLowerCase();
    const chNumPatterns = [`ch ${chNum}`, `chapter ${chNum}`, `ch-${chNum}`];

    return mockTests.filter(m => {
      const titleLower = m.examTitle.toLowerCase();
      const subjectMatches =
        m.subject.toLowerCase() === activeSubjectInfo.name.toLowerCase() ||
        m.subject.toLowerCase() === activeSubjectInfo.category.toLowerCase();

      const nameMatches = titleLower.includes(chNameLower) || chNumPatterns.some(p => titleLower.includes(p));
      return nameMatches || (subjectMatches && mockTests.length === 1);
    });
  };

  // Helper to find related flashcards for a chapter
  const getRelatedFlashcards = (ch: SyllabusChapter, chIndex: number): Flashcard[] => {
    const chNum = extractChapterNumber(ch, chIndex);
    const chNameLower = ch.name.toLowerCase();
    const chNumPatterns = [`ch ${chNum}`, `chapter ${chNum}`];

    return flashcards.filter(f => {
      const topicLower = f.topic.toLowerCase();
      const frontLower = f.front.toLowerCase();
      return (
        topicLower.includes(chNameLower) ||
        chNumPatterns.some(p => topicLower.includes(p) || frontLower.includes(p))
      );
    });
  };

  // Determine chapter status
  const getChapterStatus = (ch: SyllabusChapter, chIndex: number): ChapterStatus => {
    // 1. Check manual override
    if (manualProgress[ch.id]) {
      return manualProgress[ch.id];
    }
    // 2. Automatic determination based on assets & test performance
    const relNotes = getRelatedNotes(ch, chIndex);
    const relTests = getRelatedMockTests(ch, chIndex);
    const relCards = getRelatedFlashcards(ch, chIndex);

    const hasHighScoringTest = relTests.some(t => t.accuracyPercentage >= 70);

    if (relNotes.length > 0 && hasHighScoringTest) {
      return 'mastered';
    }
    if (relNotes.length > 0 || relTests.length > 0 || relCards.length > 0) {
      return 'in_progress';
    }
    return 'not_started';
  };

  // Toggle chapter manual completion
  const handleToggleManualStatus = (chId: string, currentStatus: ChapterStatus) => {
    let newStatus: ChapterStatus = 'in_progress';
    if (currentStatus === 'not_started') newStatus = 'in_progress';
    else if (currentStatus === 'in_progress') newStatus = 'mastered';
    else if (currentStatus === 'mastered') newStatus = 'not_started';

    const updated = { ...manualProgress, [chId]: newStatus };
    setManualProgress(updated);
    storage.saveCurriculumProgress(updated);
  };

  // 1-Click Generate Note for a Chapter
  const handleGenerateNoteForChapter = (ch: SyllabusChapter, chIndex: number) => {
    const chNum = extractChapterNumber(ch, chIndex);
    const isExploringSociety = ch.textbookRef.toLowerCase().includes('exploring society');

    const newNote: SavedNote = {
      id: `note-${ch.id}-${Date.now()}`,
      title: isExploringSociety
        ? `NCERT Exploring Society Ch ${chNum}: ${ch.name}`
        : `NCERT ${activeSubjectInfo.name} Ch ${chNum}: ${ch.name}`,
      subject: activeSubjectInfo.category as SubjectCategory,
      createdAt: Date.now(),
      tags: [activeSubjectInfo.name, `Ch ${chNum}`, ch.name, 'Curriculum Roadmap'],
      content: `## NCERT ${currentClassInfo.name} — ${activeSubjectInfo.name}
### Chapter ${chNum}: ${ch.name}
**Reference**: ${ch.textbookRef}

---

### 1. Key Syllabus Topics
${ch.syllabusTopics.map(t => `- **${t}**: Fundamental concept required for master-level understanding and exam scoring.`).join('\n')}

---

### 2. Core Learning Objectives
${ch.learningObjectives.map(o => `✓ ${o}`).join('\n')}

${ch.coreFormulas && ch.coreFormulas.length > 0 ? `
---

### 3. Essential Formulas & Quantitative Rules
${ch.coreFormulas.map(f => `$$${f}$$`).join('\n\n')}
` : ''}

---

### 4. Practice & Self-Check Questions
1. **Explain the central concept of ${ch.name} in simple everyday terms.**
2. **What are the common exam traps or misconceptions students encounter in this topic?**
3. **Summarize how this chapter connects to the broader ${activeSubjectInfo.name} curriculum.**`,
    };

    const updatedNotes = [newNote, ...notes];
    if (onUpdateNotes) {
      onUpdateNotes(updatedNotes);
    } else {
      storage.saveNotes(updatedNotes);
    }

    // Automatically mark chapter as in_progress if not yet
    if (getChapterStatus(ch, chIndex) === 'not_started') {
      const updated = { ...manualProgress, [ch.id]: 'in_progress' as ChapterStatus };
      setManualProgress(updated);
      storage.saveCurriculumProgress(updated);
    }
  };

  // Launch AI Tutor for this specific chapter
  const handleLaunchTutorForChapter = (ch: SyllabusChapter, chIndex: number) => {
    const chNum = extractChapterNumber(ch, chIndex);
    const prompt = `I am studying my syllabus roadmap for ${currentClassInfo.name} ${activeSubjectInfo.name} — Chapter ${chNum}: "${ch.name}".
Please tutor me step-by-step:
1. Explain the core topics: ${ch.syllabusTopics.slice(0, 3).join(', ')}.
2. Give 1 memorable real-world analogy.
3. Test my understanding with a conceptual multiple-choice question.`;

    const convos = storage.getConversations();
    const newConvo: Conversation = {
      id: `convo-roadmap-${Date.now()}`,
      title: `${activeSubjectInfo.name} Ch ${chNum}: ${ch.name}`,
      subject: activeSubjectInfo.category as SubjectCategory,
      grade: profile.grade,
      language: profile.preferredLanguage || 'English',
      style: profile.defaultStyle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          role: 'user' as const,
          content: prompt,
          timestamp: Date.now(),
        },
      ],
    };

    const updatedConvos = [newConvo, ...convos];
    storage.saveConversations(updatedConvos);
    storage.setActiveConvoId(newConvo.id);
    if (onSelectConversation) {
      onSelectConversation(newConvo.id);
    }
    onNavigate('chat');
  };

  // Compute overall subject progress statistics
  const stats = useMemo(() => {
    let masteredCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;
    let totalLinkedNotes = 0;
    let totalLinkedMockTests = 0;

    chapters.forEach((ch, idx) => {
      const status = getChapterStatus(ch, idx);
      if (status === 'mastered') masteredCount++;
      else if (status === 'in_progress') inProgressCount++;
      else notStartedCount++;

      totalLinkedNotes += getRelatedNotes(ch, idx).length;
      totalLinkedMockTests += getRelatedMockTests(ch, idx).length;
    });

    const total = chapters.length;
    const progressPercent = total > 0 ? Math.round(((masteredCount + inProgressCount * 0.5) / total) * 100) : 0;

    return {
      masteredCount,
      inProgressCount,
      notStartedCount,
      total,
      progressPercent,
      totalLinkedNotes,
      totalLinkedMockTests,
    };
  }, [chapters, manualProgress, notes, mockTests, flashcards]);

  // Filter chapters based on active statusFilter
  const filteredChapters = useMemo(() => {
    if (statusFilter === 'all') return chapters;
    return chapters.filter((ch, idx) => getChapterStatus(ch, idx) === statusFilter);
  }, [chapters, statusFilter, manualProgress, notes, mockTests, flashcards]);

  return (
    <div className="clay-card rounded-3xl p-5 sm:p-7 space-y-6 border border-slate-200/80 dark:border-white/10 shadow-sm transition-colors">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Curriculum Roadmap & Syllabus Visualizer</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentClassInfo.name} — {activeSubjectInfo.name} Journey
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Interactive syllabus milestone map. Expand any chapter node to inspect linked notes, test scores, formula sheets, and AI tutor starters.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenNcertGenerator && (
            <button
              type="button"
              onClick={() => onOpenNcertGenerator('both')}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-700 dark:text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Generate comprehensive flashcards and notes from NCERT syllabus"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>⚡ NCERT Pack Engine</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={expandAll}
              className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* 2. Subject Switcher & Board Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0 uppercase tracking-wider">
            Subject:
          </span>
          {availableSubjects.map(subj => {
            const isSelected = subj.name.toLowerCase() === activeSubjectInfo.name.toLowerCase();
            const isExploring = subj.name.toLowerCase().includes('social') || subj.curricula.some(c => c.includes('Exploring Society'));
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubjectName(subj.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{isExploring ? '📘 ' + subj.name : subj.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {subj.chapters.length} Ch
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {boardInfo.shortName}
          </span>
          <span>·</span>
          <span>Academic Year 2025–2026</span>
        </div>
      </div>

      {/* 3. Progress Metric Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-emerald-500/10 border border-violet-500/20 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Syllabus Completion</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-display text-2xl font-black text-slate-900 dark:text-white">
              {stats.progressPercent}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {stats.masteredCount} of {stats.total} Mastered
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Linked Notes</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {stats.totalLinkedNotes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">documents</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Revision sheets & formulas
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mock Test Attempts</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-display text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.totalLinkedMockTests}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">papers</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Graded self-assessments
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Node Filter</div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(['all', 'mastered', 'in_progress', 'not_started'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {status === 'all'
                  ? `All (${chapters.length})`
                  : status === 'mastered'
                  ? `Mastered (${stats.masteredCount})`
                  : status === 'in_progress'
                  ? `In Progress (${stats.inProgressCount})`
                  : `To Do (${stats.notStartedCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Interactive Node Trail / Roadmap Graph */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-400">
            No chapters match the selected filter.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:top-4 before:bottom-4 before:left-3 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-indigo-500 before:to-slate-300 dark:before:to-slate-800">
            {filteredChapters.map((ch, idx) => {
              const chNum = extractChapterNumber(ch, idx);
              const status = getChapterStatus(ch, idx);
              const isExpanded = expandedChapterIds.has(ch.id);
              const relatedNotes = getRelatedNotes(ch, idx);
              const relatedTests = getRelatedMockTests(ch, idx);
              const relatedCards = getRelatedFlashcards(ch, idx);

              return (
                <div
                  key={ch.id}
                  className={`relative rounded-2xl border transition-all duration-200 ${
                    isExpanded
                      ? 'border-violet-500/60 bg-white dark:bg-slate-900 shadow-md ring-2 ring-violet-500/10'
                      : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 hover:border-violet-400/50'
                  }`}
                >
                  {/* Timeline Node Node Marker */}
                  <div
                    onClick={() => handleToggleManualStatus(ch.id, status)}
                    title={`Status: ${status} (Click to toggle)`}
                    className={`absolute -left-[31px] sm:-left-[39px] top-4.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xs ${
                      status === 'mastered'
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                        : status === 'in_progress'
                        ? 'bg-violet-600 text-white ring-4 ring-violet-500/20 animate-pulse'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-500 text-[10px] font-bold'
                    }`}
                  >
                    {status === 'mastered' ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : status === 'in_progress' ? (
                      <Flame className="w-3.5 h-3.5" />
                    ) : (
                      <span>{chNum}</span>
                    )}
                  </div>

                  {/* Chapter Card Header */}
                  <div
                    onClick={() => toggleExpand(ch.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                          Chapter {chNum}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {ch.textbookRef}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            status === 'mastered'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                              : status === 'in_progress'
                              ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {status === 'mastered' ? 'Mastered' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                        {ch.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {ch.syllabusTopics.join(' · ')}
                      </p>
                    </div>

                    {/* Quick Counts & Expand Toggle */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                      {/* Notes count badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                          relatedNotes.length > 0
                            ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                        title={`${relatedNotes.length} related note(s)`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{relatedNotes.length}</span>
                      </span>

                      {/* Mock Tests count badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
                          relatedTests.length > 0
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                        title={`${relatedTests.length} mock test attempt(s)`}
                      >
                        <Award className="w-3 h-3" />
                        <span>{relatedTests.length}</span>
                      </span>

                      {/* Flashcards count badge */}
                      {relatedCards.length > 0 && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          title={`${relatedCards.length} flashcard(s)`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{relatedCards.length}</span>
                        </span>
                      )}

                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* 5. Expanded Node Body (Detailed Inspection) */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-200/80 dark:border-white/10 space-y-5 animate-in fade-in duration-150">
                      {/* Syllabus Topics Checklist */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Syllabus Topics Covered:
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ch.syllabusTopics.length} core concepts
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {ch.syllabusTopics.map((topic, tIdx) => (
                            <div
                              key={tIdx}
                              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Two-Column Grid: Related Notes & Related Mock Tests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {/* LEFT COLUMN: Related Notes */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-indigo-500/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                              <FileText className="w-4 h-4" />
                              <span>Related Notes ({relatedNotes.length})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGenerateNoteForChapter(ch, idx)}
                              className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>+ Generate Note</span>
                            </button>
                          </div>

                          {relatedNotes.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900/40 text-center space-y-2">
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                No revision notes saved for this chapter yet.
                              </p>
                              <button
                                type="button"
                                onClick={() => handleGenerateNoteForChapter(ch, idx)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>⚡ 1-Click Generate Chapter Note</span>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {relatedNotes.map(note => (
                                <div
                                  key={note.id}
                                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 transition-all text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                      {note.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                      {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {note.content.replace(/[#*`$]/g, '')}
                                  </p>
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewNote(note)}
                                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Quick Read</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onNavigate('notes')}
                                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
                                    >
                                      <span>Open Notes</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Related Mock Tests */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-amber-500/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                              <Award className="w-4 h-4" />
                              <span>Mock Tests & Assessments ({relatedTests.length})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onNavigate('exam')}
                              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <span>+ Practice Exam</span>
                            </button>
                          </div>

                          {relatedTests.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-amber-200 dark:border-amber-900/40 text-center space-y-2">
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                No mock test attempts recorded for this chapter yet.
                              </p>
                              <button
                                type="button"
                                onClick={() => onNavigate('exam')}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>📝 Create Practice Test</span>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {relatedTests.map(test => (
                                <div
                                  key={test.id}
                                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                      {test.examTitle}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                        (test.accuracyPercentage || 0) >= 70
                                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                      }`}
                                    >
                                      {Math.round(test.accuracyPercentage || 0)}% Score
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                                    <span>
                                      {test.obtainedMarks ?? 0} / {test.totalMarks ?? 0} marks ({Math.round((test.timeSpentSeconds || 0) / 60)} mins)
                                    </span>
                                    <span>{test.completedAt ? new Date(test.completedAt).toLocaleDateString() : 'Recent'}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar: Deep Dive in AI Tutor, Flashcards, or Toggle Status */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 dark:border-white/5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLaunchTutorForChapter(ch, idx)}
                            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>🤖 Tutor in AI Chat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigate('revision')}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Flashcard Practice</span>
                          </button>
                        </div>

                        {/* Manual Status Toggle */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">Progress Status:</span>
                          <button
                            type="button"
                            onClick={() => handleToggleManualStatus(ch.id, status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                              status === 'mastered'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                : status === 'in_progress'
                                ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {status === 'mastered' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Mastered (Click to reset)</span>
                              </>
                            ) : status === 'in_progress' ? (
                              <>
                                <Flame className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                                <span>In Progress (Click to complete)</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3.5 h-3.5 text-slate-400" />
                                <span>Not Started (Click to begin)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Quick Read Note Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Quick Note Viewer
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {previewNote.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewNote(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
              <MarkdownRenderer content={previewNote.content} />
            </div>

            <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created on {new Date(previewNote.createdAt).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPreviewNote(null);
                  onNavigate('notes');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>Edit in Full Notes Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
