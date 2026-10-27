import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Copy,
  Check,
  ChevronRight,
  BookMarked,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Flame,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  UserProfile,
  Flashcard,
  SavedNote,
  SubjectCategory,
  GeneratedFlashcardItem,
  GeneratedChapterNotes,
  GeneratedStudyPack,
} from '../types';
import { SYLLABUS_REGISTRY, SyllabusChapter, SyllabusSubjectInfo, SyllabusClassInfo } from '../lib/syllabusData';
import { api } from '../lib/api';
import { storage } from '../lib/storage';
import { MarkdownRenderer } from './MarkdownRenderer';

export type QuickGeneratorMode = 'flashcards' | 'notes' | 'both';

interface NcertQuickGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: QuickGeneratorMode;
  profile: UserProfile;
  onAddFlashcards?: (cards: Flashcard[]) => void;
  onAddNote?: (note: SavedNote) => void;
  onNavigateToRevision?: () => void;
  onNavigateToNotes?: () => void;
}

export const NcertQuickGeneratorModal: React.FC<NcertQuickGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'flashcards',
  profile,
  onAddFlashcards,
  onAddNote,
  onNavigateToRevision,
  onNavigateToNotes,
}) => {
  // Mode: flashcards, notes, or both
  const [mode, setMode] = useState<QuickGeneratorMode>(initialMode);

  // NCERT Board reference (CBSE)
  const ncertBoard = useMemo(() => {
    return SYLLABUS_REGISTRY.find(b => b.id === 'CBSE') || SYLLABUS_REGISTRY[0];
  }, []);

  // Class Selection (dynamically auto-sync with user profile)
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const raw = (profile.selectedClass || '').toLowerCase();
    const num = raw.replace(/\D/g, '');
    if (num) {
      const match = ncertBoard.classes.find(
        c => c.id === `cbse-class-${num}` || c.name.toLowerCase().includes(`class ${num}`)
      );
      if (match) return match.id;
    }
    return 'cbse-class-5';
  });

  const currentClass: SyllabusClassInfo = useMemo(() => {
    return ncertBoard.classes.find(c => c.id === selectedClassId) || ncertBoard.classes[0];
  }, [ncertBoard, selectedClassId]);

  // Subject Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Auto-sync subject when class changes or on mount
  useEffect(() => {
    if (currentClass.subjects.length > 0) {
      const match = currentClass.subjects.find(
        s => s.category === profile.primarySubject || s.name.toLowerCase().includes(profile.primarySubject.toLowerCase())
      );
      setSelectedSubjectId(match ? match.id : currentClass.subjects[0].id);
    }
  }, [currentClass, profile.primarySubject]);

  const currentSubject: SyllabusSubjectInfo | undefined = useMemo(() => {
    return currentClass.subjects.find(s => s.id === selectedSubjectId) || currentClass.subjects[0];
  }, [currentClass, selectedSubjectId]);

  // Chapter Selection (Just Chap Select!)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');

  // Auto-select first chapter when subject changes
  useEffect(() => {
    if (currentSubject?.chapters && currentSubject.chapters.length > 0) {
      setSelectedChapterId(currentSubject.chapters[0].id);
    }
  }, [currentSubject]);

  const selectedChapter: SyllabusChapter | undefined = useMemo(() => {
    if (!currentSubject) return undefined;
    return currentSubject.chapters.find(c => c.id === selectedChapterId) || currentSubject.chapters[0];
  }, [currentSubject, selectedChapterId]);

  // Filtered chapters for live search
  const filteredChapters = useMemo(() => {
    if (!currentSubject) return [];
    if (!chapterSearchQuery.trim()) return currentSubject.chapters;
    const q = chapterSearchQuery.toLowerCase();
    return currentSubject.chapters.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.textbookRef.toLowerCase().includes(q) ||
        c.syllabusTopics.some(t => t.toLowerCase().includes(q))
    );
  }, [currentSubject, chapterSearchQuery]);

  // Generation options
  const [numFlashcards, setNumFlashcards] = useState<number>(10);
  const [notesDepth, setNotesDepth] = useState<'comprehensive' | 'exam_summary'>('comprehensive');

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStage, setGenStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generated results
  const [generatedPack, setGeneratedPack] = useState<GeneratedStudyPack | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'flashcards' | 'notes'>('flashcards');

  // Card review carousel in modal
  const [previewCardIdx, setPreviewCardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Reset state when opening or closing
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setGeneratedPack(null);
      setErrorMessage(null);
      setSavedSuccessMessage(null);
      setPreviewCardIdx(0);
      setIsCardFlipped(false);
    }
  }, [isOpen, initialMode]);

  // Generate Flashcards and/or Notes from selected NCERT Chapter
  const handleGenerate = async () => {
    if (!currentSubject || !selectedChapter) {
      setErrorMessage('Please select an NCERT chapter first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setSavedSuccessMessage(null);
    setGeneratedPack(null);

    const neededOutputs =
      mode === 'both' ? (['flashcards', 'notes'] as const) : mode === 'flashcards' ? (['flashcards'] as const) : (['notes'] as const);

    setActiveResultTab(mode === 'notes' ? 'notes' : 'flashcards');

    // Stage 1
    setGenStage(`Retrieving verified ${selectedChapter.textbookRef}...`);
    const timer1 = setTimeout(() => {
      setGenStage(
        mode === 'flashcards'
          ? `Synthesizing ${numFlashcards} active-recall NCERT flashcards...`
          : mode === 'notes'
          ? `Formulating structured chapter revision notes & KaTeX derivations...`
          : `Synthesizing ${numFlashcards} flashcards & complete chapter notes...`
      );
    }, 1200);

    const timer2 = setTimeout(() => {
      setGenStage('Validating curriculum accuracy and formatting equations...');
    }, 2800);

    try {
      const pack = await api.generateStudyPack({
        sourceMode: 'syllabus',
        board: 'CBSE',
        curriculum: 'NCERT Standard Textbook',
        grade: currentClass.name,
        subject: String(currentSubject.name),
        chapter: selectedChapter.name,
        chaptersSelected: [selectedChapter.name],
        syllabusTopics: selectedChapter.syllabusTopics,
        selectedOutputs: [...neededOutputs],
        studentProfile: {
          name: profile.name,
          grade: currentClass.name,
          language: profile.preferredLanguage,
          style: profile.defaultStyle,
        },
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setGeneratedPack(pack);
      setPreviewCardIdx(0);
      setIsCardFlipped(false);
    } catch (err: unknown) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      const msg = err instanceof Error ? err.message : 'Generation failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save generated Flashcards directly into user deck
  const handleSaveFlashcardsToDeck = () => {
    if (!generatedPack?.outputs.flashcards || generatedPack.outputs.flashcards.length === 0) return;

    const newCards: Flashcard[] = generatedPack.outputs.flashcards.map((c, i) => ({
      id: `fc-ncert-${Date.now()}-${i}`,
      front: c.front,
      back: c.back,
      subject: (currentSubject?.category || profile.primarySubject) as SubjectCategory,
      topic: `${selectedChapter?.name || currentSubject?.name} (NCERT)`,
      box: 1,
      nextReviewDate: Date.now(),
      reviewCount: 0,
      easeScore: 'unreviewed',
    }));

    const existing = storage.getFlashcards();
    const updated = [...newCards, ...existing];
    storage.saveFlashcards(updated);
    if (onAddFlashcards) {
      onAddFlashcards(updated);
    }

    setSavedSuccessMessage(`✓ Successfully added ${newCards.length} NCERT flashcards to your Leitner deck!`);
    setTimeout(() => setSavedSuccessMessage(null), 4000);
  };

  // Save generated Notes directly into user notes
  const handleSaveNotesToLibrary = () => {
    if (!generatedPack?.outputs.notes) return;

    const notesOutput = generatedPack.outputs.notes;
    const newNote: SavedNote = {
      id: `note-ncert-${Date.now()}`,
      title: `${selectedChapter?.name || 'Chapter'} — NCERT Revision Guide`,
      content: `${notesOutput.markdownContent}\n\n### Key Takeaways\n${(notesOutput.keyTakeaways || [])
        .map(t => `- ${t}`)
        .join('\n')}`,
      subject: (currentSubject?.category || profile.primarySubject) as SubjectCategory,
      createdAt: Date.now(),
      tags: ['NCERT', selectedChapter?.name || '', String(currentSubject?.name || '')].filter(Boolean),
    };

    const existing = storage.getNotes();
    const updated = [newNote, ...existing];
    storage.saveNotes(updated);
    if (onAddNote) {
      onAddNote(newNote);
    }

    setSavedSuccessMessage('✓ Successfully saved NCERT chapter notes to your Notes Library!');
    setTimeout(() => setSavedSuccessMessage(null), 4000);
  };

  // Save both Flashcards & Notes
  const handleSaveEverything = () => {
    handleSaveFlashcardsToDeck();
    handleSaveNotesToLibrary();
    setSavedSuccessMessage('✓ Successfully saved both Flashcards and Notes!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-[#090e1b]/70 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click NCERT Engine</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Curriculum Grounded</span>
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {mode === 'flashcards'
                ? 'NCERT Flashcard Generator'
                : mode === 'notes'
                ? 'NCERT Chapter Notes Generator'
                : 'NCERT Flashcards & Notes Generator'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Just select your NCERT chapter below to instantly generate syllabus-verified active recall cards or complete chapter revision notes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setMode('flashcards');
                setGeneratedPack(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'flashcards'
                  ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('notes');
                setGeneratedPack(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'notes'
                  ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chapter Notes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('both');
                setGeneratedPack(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'both'
                  ? 'bg-white dark:bg-violet-600 text-violet-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Both (1-Click)</span>
            </button>
          </div>

          {/* If NOT generated yet: Show Chapter Selection Workspace */}
          {!generatedPack ? (
            <div className="space-y-5">
              {/* Class & Subject Selector Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 block uppercase tracking-wider">
                    1. NCERT Class / Grade
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={e => setSelectedClassId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {ncertBoard.classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 block uppercase tracking-wider">
                    2. Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {currentClass.subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Just Chapter Select Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>3. Choose Chapter to Generate</span>
                      <span className="text-violet-600 dark:text-violet-400 font-bold">
                        ({currentSubject?.chapters.length || 0} NCERT Chapters Available)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Click any chapter to select it. Flashcards and notes will be strictly formulated from its verified NCERT syllabus.
                    </p>
                  </div>

                  {/* Chapter Quick Filter */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={chapterSearchQuery}
                      onChange={e => setChapterSearchQuery(e.target.value)}
                      placeholder="Search chapter e.g. Quadratic..."
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {/* Optional Book Filter Chips */}
                {currentSubject?.curricula && currentSubject.curricula.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book Filter:</span>
                    <button
                      type="button"
                      onClick={() => setChapterSearchQuery('')}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                        !chapterSearchQuery
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      All Books ({currentSubject.chapters.length})
                    </button>
                    {currentSubject.curricula.map(book => {
                      const shortName = book.replace(/^NCERT\s+/, '').split('(')[0].trim();
                      const isActive = chapterSearchQuery.toLowerCase() === shortName.toLowerCase();
                      return (
                        <button
                          key={book}
                          type="button"
                          onClick={() => setChapterSearchQuery(isActive ? '' : shortName)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                            isActive
                              ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-violet-400'
                          }`}
                        >
                          {shortName}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Chapter Card Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {filteredChapters.map((ch, idx) => {
                    const isSelected = ch.id === selectedChapterId;
                    const isExploringSociety = ch.textbookRef.includes('Exploring Society');
                    return (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`p-3 rounded-2xl cursor-pointer border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-violet-50/80 dark:bg-violet-950/40 border-violet-600 shadow-sm ring-2 ring-violet-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                            <span className="font-bold text-violet-600 dark:text-violet-400">
                              Ch {idx + 1}
                            </span>
                            {isExploringSociety ? (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[9px] border border-indigo-200/60 dark:border-indigo-800/40">
                                Exploring Society
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-semibold">
                                {ch.syllabusTopics.length} Topics
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                            {ch.name}
                          </h4>
                        </div>

                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-violet-200 dark:border-violet-900/50 flex items-center justify-between text-[10px] text-violet-700 dark:text-violet-300 font-bold">
                            <span>Selected</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredChapters.length === 0 && (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-xs text-slate-500">
                    No chapters matched &quot;{chapterSearchQuery}&quot;. Clear search to view all {currentSubject?.name} chapters.
                  </div>
                )}
              </div>

              {/* Selected Chapter Curriculum Inspector Card */}
              {selectedChapter && (
                <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {selectedChapter.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {selectedChapter.textbookRef}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Syllabus Learning Objectives & Proofs:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {selectedChapter.syllabusTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-900/40 text-[10px] text-slate-700 dark:text-slate-200"
                        >
                          ✓ {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Options Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-white/5">
                {(mode === 'flashcards' || mode === 'both') && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Flashcard Deck Size:
                    </span>
                    {[6, 10, 15].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setNumFlashcards(cnt)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                          numFlashcards === cnt
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cnt} Cards
                      </button>
                    ))}
                  </div>
                )}

                {(mode === 'notes' || mode === 'both') && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Notes Depth:
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotesDepth('comprehensive')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                        notesDepth === 'comprehensive'
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      In-Depth & Proofs
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotesDepth('exam_summary')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                        notesDepth === 'exam_summary'
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Exam Revision
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          ) : (
            /* Results Hub: Preview Flashcards or Notes */
            <div className="space-y-5 animate-in fade-in">
              {/* Success Notification Bar */}
              {savedSuccessMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{savedSuccessMessage}</span>
                  </div>
                </div>
              )}

              {/* Result Tab Switcher (if both were generated) */}
              {mode === 'both' && (
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('flashcards')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeResultTab === 'flashcards'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Generated Flashcards ({generatedPack.outputs.flashcards?.length || 0})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveResultTab('notes')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeResultTab === 'notes'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generated Chapter Notes</span>
                  </button>
                </div>
              )}

              {/* Flashcards View */}
              {activeResultTab === 'flashcards' && generatedPack.outputs.flashcards && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        {selectedChapter?.name} — NCERT Flashcard Deck
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Card {previewCardIdx + 1} of {generatedPack.outputs.flashcards.length} · Click card to flip
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveFlashcardsToDeck}
                        className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save All to My Deck</span>
                      </button>
                    </div>
                  </div>

                  {/* 3D Flip Card Interactive Preview */}
                  {generatedPack.outputs.flashcards.length > 0 && (
                    <div className="space-y-3">
                      <div
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="cursor-pointer min-h-[220px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-violet-500/30 dark:border-violet-500/20 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-slate-900 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold text-[11px]">
                            {isCardFlipped ? '💡 Back: Verified NCERT Solution / Definition' : '❓ Front: Question & Prompt'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Click to flip
                          </span>
                        </div>

                        <div className="py-4 text-center">
                          <div className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
                            {isCardFlipped
                              ? generatedPack.outputs.flashcards[previewCardIdx].back
                              : generatedPack.outputs.flashcards[previewCardIdx].front}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 dark:border-white/5 pt-3">
                          <span className="font-medium">
                            Topic: {generatedPack.outputs.flashcards[previewCardIdx].topic || selectedChapter?.name}
                          </span>
                          <span className="text-violet-600 dark:text-violet-400 font-bold">
                            NCERT Grounded
                          </span>
                        </div>
                      </div>

                      {/* Card Carousel Controls */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewCardIdx(prev => (prev > 0 ? prev - 1 : prev));
                            setIsCardFlipped(false);
                          }}
                          disabled={previewCardIdx === 0}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {generatedPack.outputs.flashcards.map((_, i) => (
                            <span
                              key={i}
                              onClick={() => {
                                setPreviewCardIdx(i);
                                setIsCardFlipped(false);
                              }}
                              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                                previewCardIdx === i ? 'bg-violet-600 w-4' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPreviewCardIdx(prev =>
                              prev < (generatedPack.outputs.flashcards?.length || 1) - 1 ? prev + 1 : prev
                            );
                            setIsCardFlipped(false);
                          }}
                          disabled={previewCardIdx === (generatedPack.outputs.flashcards?.length || 1) - 1}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center gap-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notes View */}
              {activeResultTab === 'notes' && generatedPack.outputs.notes && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {generatedPack.outputs.notes.title || `${selectedChapter?.name} Notes`}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {generatedPack.outputs.notes.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPack.outputs.notes?.markdownContent || '');
                          setCopiedNotes(true);
                          setTimeout(() => setCopiedNotes(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNotes ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveNotesToLibrary}
                        className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save to My Notes</span>
                      </button>
                    </div>
                  </div>

                  {/* Key formulas chips */}
                  {generatedPack.outputs.notes.keyFormulas && generatedPack.outputs.notes.keyFormulas.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                      <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Core NCERT Formulas & Equations:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedPack.outputs.notes.keyFormulas.map((f, i) => (
                          <code
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 text-xs font-mono border border-slate-200 dark:border-white/5"
                          >
                            {f}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rendered Markdown Notes */}
                  <div className="clay-card p-5 sm:p-6 rounded-3xl max-h-96 overflow-y-auto">
                    <MarkdownRenderer content={generatedPack.outputs.notes.markdownContent} />
                  </div>
                </div>
              )}

              {/* Action Buttons at bottom of results */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setGeneratedPack(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Select Another NCERT Chapter
                </button>

                <div className="flex items-center gap-2">
                  {mode === 'both' && (
                    <button
                      type="button"
                      onClick={handleSaveEverything}
                      className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Save All Cards & Notes</span>
                    </button>
                  )}

                  {onNavigateToRevision && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveFlashcardsToDeck();
                        onClose();
                        onNavigateToRevision();
                      }}
                      className="clay-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Study Flashcards Deck</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onNavigateToNotes && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveNotesToLibrary();
                        onClose();
                        onNavigateToNotes();
                      }}
                      className="clay-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Open Notes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Action Trigger) */}
        {!generatedPack && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#090e1b]/70 shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {selectedChapter ? (
                <span>
                  Selected: <strong className="text-slate-800 dark:text-slate-200">{selectedChapter.name}</strong> ({selectedChapter.textbookRef})
                </span>
              ) : (
                'Select an NCERT chapter above to begin'
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="clay-btn-secondary px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedChapter}
                className="clay-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{genStage || 'Generating...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {mode === 'flashcards'
                        ? 'Generate NCERT Flashcards (1-Click)'
                        : mode === 'notes'
                        ? 'Generate NCERT Notes (1-Click)'
                        : 'Generate Flashcards & Notes (1-Click)'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
