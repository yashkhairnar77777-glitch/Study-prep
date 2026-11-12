import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  Layers,
  FileText,
  CheckCircle2,
  HelpCircle,
  Brain,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  RotateCw,
  Copy,
  Check,
  Save,
  MessageSquare,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  Zap,
  GraduationCap,
  Calculator,
  Compass,
  Languages,
  BookMarked,
  X,
  Target,
  BarChart2,
  CheckSquare,
  Square,
  Star,
} from 'lucide-react';
import {
  UserProfile,
  SubjectCategory,
  AppView,
  ProviderStatus,
  ExamPaper,
  GeneratedStudyPack,
} from '../types';
import { api } from '../lib/api';
import {
  SyllabusClassInfo,
  SyllabusSubjectInfo,
  SyllabusChapter,
} from '../lib/curriculum/types';
import { SYLLABUS_REGISTRY } from '../lib/syllabusData';

interface NcertLearningHubViewProps {
  profile: UserProfile;
  providerStatus: ProviderStatus | null;
  onNavigate: (view: AppView) => void;
  onSaveAsNote?: (title: string, content: string, subject: SubjectCategory) => void;
  onCreateFlashcard?: (front: string, back: string, subject: SubjectCategory) => void;
  onStartMockTest?: (paper: ExamPaper) => void;
}

type LearningTab = 'overview' | 'notes' | 'flashcards' | 'quiz' | 'tutor';

const CLASS_CONFIGS: {
  id: string;
  label: string;
  classNum: number;
  mode: 'foundation' | 'secondary';
  nepStage: string;
  badgeColor: string;
}[] = [
  { id: 'cbse-class-5', label: 'Class 5', classNum: 5, mode: 'foundation', nepStage: 'Preparatory Stage (NEP 2020)', badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 'cbse-class-6', label: 'Class 6', classNum: 6, mode: 'foundation', nepStage: 'Middle Stage (Curiosity & Inquiry)', badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  { id: 'cbse-class-7', label: 'Class 7', classNum: 7, mode: 'foundation', nepStage: 'Middle Stage (Applied Concepts)', badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { id: 'cbse-class-8', label: 'Class 8', classNum: 8, mode: 'foundation', nepStage: 'Middle Stage (Pre-Secondary Foundation)', badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { id: 'cbse-class-9', label: 'Class 9', classNum: 9, mode: 'secondary', nepStage: 'Secondary Stage (Board Foundations)', badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  { id: 'cbse-class-10', label: 'Class 10', classNum: 10, mode: 'secondary', nepStage: 'Secondary Stage (CBSE Board Exam)', badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
];

export const NcertLearningHubView: React.FC<NcertLearningHubViewProps> = ({
  profile,
  providerStatus,
  onNavigate,
  onSaveAsNote,
  onCreateFlashcard,
  onStartMockTest,
}) => {
  // Available classes in CBSE / NCERT (Classes 5-10)
  const cbseBoard = SYLLABUS_REGISTRY[0];
  const ncertClasses = useMemo(() => {
    return (cbseBoard?.classes || []).filter(c =>
      ['cbse-class-5', 'cbse-class-6', 'cbse-class-7', 'cbse-class-8', 'cbse-class-9', 'cbse-class-10'].includes(c.id)
    );
  }, [cbseBoard]);

  // Determine initial class from profile or default to Class 10
  const initialClassId = useMemo(() => {
    const pGrade = profile.grade || '';
    const match = CLASS_CONFIGS.find(c => pGrade.includes(`Class ${c.classNum}`) || pGrade.includes(`${c.classNum}`));
    return match ? match.id : 'cbse-class-10';
  }, [profile.grade]);

  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapter, setActiveChapter] = useState<SyllabusChapter | null>(null);
  const [activeTab, setActiveTab] = useState<LearningTab>('overview');

  // Completed chapters tracking in localStorage
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('oryqen_ncert_completed_chapters');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleChapterCompletion = (chapterId: string) => {
    setCompletedChapters(prev => {
      const next = { ...prev, [chapterId]: !prev[chapterId] };
      try {
        localStorage.setItem('oryqen_ncert_completed_chapters', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Selected class data
  const currentClassInfo: SyllabusClassInfo | undefined = useMemo(() => {
    return ncertClasses.find(c => c.id === selectedClassId) || ncertClasses[0];
  }, [ncertClasses, selectedClassId]);

  const currentClassConfig = useMemo(() => {
    return CLASS_CONFIGS.find(c => c.id === selectedClassId) || CLASS_CONFIGS[5];
  }, [selectedClassId]);

  // Ensure selected subject is valid for the current class
  useEffect(() => {
    if (currentClassInfo && currentClassInfo.subjects.length > 0) {
      const exists = currentClassInfo.subjects.some(s => s.id === selectedSubjectId);
      if (!exists) {
        setSelectedSubjectId(currentClassInfo.subjects[0].id);
      }
    }
  }, [currentClassInfo, selectedSubjectId]);

  const currentSubjectInfo: SyllabusSubjectInfo | undefined = useMemo(() => {
    if (!currentClassInfo) return undefined;
    return currentClassInfo.subjects.find(s => s.id === selectedSubjectId) || currentClassInfo.subjects[0];
  }, [currentClassInfo, selectedSubjectId]);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    if (!currentSubjectInfo) return [];
    if (!searchQuery.trim()) return currentSubjectInfo.chapters;
    const q = searchQuery.toLowerCase();
    return currentSubjectInfo.chapters.filter(ch =>
      ch.name.toLowerCase().includes(q) ||
      ch.textbookRef.toLowerCase().includes(q) ||
      ch.syllabusTopics.some(t => t.toLowerCase().includes(q)) ||
      (ch.importantDefinitions && ch.importantDefinitions.some(d => d.toLowerCase().includes(q)))
    );
  }, [currentSubjectInfo, searchQuery]);

  // Total stats for current class
  const classStats = useMemo(() => {
    if (!currentClassInfo) return { totalChapters: 0, completedCount: 0, percentage: 0 };
    let total = 0;
    let completed = 0;
    currentClassInfo.subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        total++;
        if (completedChapters[ch.id]) completed++;
      });
    });
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalChapters: total, completedCount: completed, percentage: pct };
  }, [currentClassInfo, completedChapters]);

  // Notification / Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------
  // CHAPTER LEARNING ENGINE: Notes Generator State
  // ----------------------------------------------------
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');

  const handleGenerateChapterNotes = async () => {
    if (!activeChapter || !currentSubjectInfo || !currentClassConfig) return;
    setIsGeneratingNotes(true);
    try {
      const prompt = `You are a master NCERT educator for ${currentClassConfig.label} ${currentSubjectInfo.name}.
Generate a comprehensive, structured NCERT chapter study guide for:
Chapter: "${activeChapter.name}"
Textbook Reference: "${activeChapter.textbookRef}"
Mode: ${currentClassConfig.mode === 'foundation' ? 'Foundation Learning (Classes 5–8 Concept building, mental math, intuitive examples)' : 'Secondary Exam Preparation (Classes 9–10 Board exam focus, high yield formulas, definitions, marking scheme tips)'}

Topics to cover in detail:
${activeChapter.syllabusTopics.map(t => `- ${t}`).join('\n')}

Format with clear Markdown headers, bullet points, intuitive explanations, key definitions, formulas (using LaTeX), and 3 essential exam takeaways.`;

      const res = await api.sendChatMessage({
        messages: [{ role: 'user', content: prompt }],
        grade: (currentClassConfig.classNum <= 8 ? 'Middle School (6-8)' : 'High School (9-10)') as any,
        subject: currentSubjectInfo.category,
        language: 'English',
        explanationDepth: 'step_by_step',
        selectedClass: currentClassConfig.label,
      });

      setGeneratedNotes(res.content);
      showToast('Comprehensive NCERT notes generated!');
    } catch (err: any) {
      showToast(`Notes generation error: ${err.message || 'Please try again.'}`);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  // ----------------------------------------------------
  // CHAPTER LEARNING ENGINE: Flashcard State
  // ----------------------------------------------------
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Record<number, 'mastered' | 'review'>>({});

  // Synthesize rich flashcards from chapter metadata
  const chapterFlashcards = useMemo(() => {
    if (!activeChapter) return [];
    const cards: { front: string; back: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string }[] = [];

    // Core definitions
    if (activeChapter.importantDefinitions && activeChapter.importantDefinitions.length > 0) {
      activeChapter.importantDefinitions.forEach(def => {
        const parts = def.split(':');
        if (parts.length >= 2) {
          cards.push({
            front: `What is ${parts[0].trim()}?`,
            back: parts.slice(1).join(':').trim(),
            difficulty: 'Easy',
            topic: 'Definition',
          });
        }
      });
    }

    // Key concepts
    if (activeChapter.keyConcepts && activeChapter.keyConcepts.length > 0) {
      activeChapter.keyConcepts.forEach((kc, i) => {
        cards.push({
          front: `Key Concept ${i + 1}: How does this apply in ${activeChapter.name}?`,
          back: kc,
          difficulty: 'Medium',
          topic: 'Core Principle',
        });
      });
    }

    // Formulas
    if (activeChapter.coreFormulas && activeChapter.coreFormulas.length > 0) {
      activeChapter.coreFormulas.forEach((formula, i) => {
        cards.push({
          front: `State the formula or theorem for Concept #${i + 1} in ${activeChapter.name}:`,
          back: `${formula}`,
          difficulty: 'Hard',
          topic: 'Formula & Equation',
        });
      });
    }

    // Syllabus topics
    activeChapter.syllabusTopics.forEach((t) => {
      if (cards.length < 8) {
        cards.push({
          front: `Explain the topic: "${t.slice(0, 80)}"`,
          back: `This is a core topic under ${activeChapter.textbookRef}. Mastery requires understanding the theoretical basis, standard textbook derivation, and typical numerical or subjective questions asked in school exams.`,
          difficulty: 'Medium',
          topic: 'Syllabus Focus',
        });
      }
    });

    return cards;
  }, [activeChapter]);

  // Reset card index when chapter changes
  useEffect(() => {
    setCardIndex(0);
    setIsCardFlipped(false);
    setReviewedCards({});
    setGeneratedNotes('');
  }, [activeChapter]);

  // ----------------------------------------------------
  // CHAPTER LEARNING ENGINE: Quiz State
  // ----------------------------------------------------
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  // Synthesize quiz questions
  const chapterQuiz = useMemo(() => {
    if (!activeChapter) return [];
    const questions: {
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      type: 'mcq' | 'competency' | 'olympiad';
    }[] = [];

    // Synthesize MCQs from topics
    if (activeChapter.syllabusTopics.length > 0) {
      questions.push({
        id: 1,
        question: `According to the NCERT curriculum for "${activeChapter.name}", which of the following is a primary learning outcome?`,
        options: [
          activeChapter.learningObjectives[0] || activeChapter.syllabusTopics[0],
          'Rote memorization without conceptual proof',
          'Only calculating formulas without understanding definitions',
          'Skipping practical real-world applications',
        ],
        correctAnswer: 0,
        explanation: `NCERT emphasizes conceptual mastery and application. The verified outcome is: ${activeChapter.learningObjectives[0] || activeChapter.syllabusTopics[0]}`,
        type: 'mcq',
      });
    }

    if (activeChapter.importantDefinitions && activeChapter.importantDefinitions.length > 0) {
      const def = activeChapter.importantDefinitions[0];
      const term = def.split(':')[0].trim();
      const meaning = def.split(':')[1]?.trim() || def;
      questions.push({
        id: 2,
        question: `Which definition accurately describes "${term}"?`,
        options: [
          meaning,
          'A phenomenon observed only in hypothetical laboratory settings',
          'A term no longer included in the revised NCERT edition',
          'An obsolete scientific measurement unit',
        ],
        correctAnswer: 0,
        explanation: `According to ${activeChapter.textbookRef}: "${term}" is defined as ${meaning}.`,
        type: 'mcq',
      });
    }

    if (activeChapter.coreFormulas && activeChapter.coreFormulas.length > 0) {
      questions.push({
        id: 3,
        question: `Which core mathematical/scientific equation is fundamental to ${activeChapter.name}?`,
        options: [
          activeChapter.coreFormulas[0],
          'E = m c^3',
          'F = m / a^2',
          'a^2 + b^2 = c^3',
        ],
        correctAnswer: 0,
        explanation: `The textbook formula is: ${activeChapter.coreFormulas[0]}.`,
        type: 'mcq',
      });
    }

    return questions;
  }, [activeChapter]);

  // ----------------------------------------------------
  // CHAPTER LEARNING ENGINE: AI Tutor Chat State
  // ----------------------------------------------------
  const [tutorMessages, setTutorMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isTutorThinking, setIsTutorThinking] = useState(false);

  // Initialize tutor message when chapter opens
  useEffect(() => {
    if (activeChapter && currentSubjectInfo && currentClassConfig) {
      setTutorMessages([
        {
          role: 'assistant',
          content: `Hello! I am your dedicated **${currentClassConfig.label} NCERT AI Tutor** for **${currentSubjectInfo.name}**.
We are currently exploring **"${activeChapter.name}"** (${activeChapter.textbookRef}).

${currentClassConfig.mode === 'foundation'
  ? '🌟 In **Foundation Mode**, I will explain concepts using simple real-world examples, fun analogies, and mental math shortcuts!'
  : '🎯 In **Secondary Exam Mode**, I will focus on NCERT board patterns, marking schemes, definitions, and high-yield questions!'}

Ask me any question, ask for an intuitive example, or click one of the quick prompts below!`,
        },
      ]);
    }
  }, [activeChapter, currentSubjectInfo, currentClassConfig]);

  const handleSendTutorMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || tutorInput;
    if (!textToSend.trim() || !activeChapter || !currentSubjectInfo || !currentClassConfig) return;

    const newHistory = [...tutorMessages, { role: 'user' as const, content: textToSend }];
    setTutorMessages(newHistory);
    setTutorInput('');
    setIsTutorThinking(true);

    try {
      const systemInstruction = `You are an expert NCERT teacher for ${currentClassConfig.label} ${currentSubjectInfo.name}.
Chapter context: "${activeChapter.name}" (${activeChapter.textbookRef}).
Key chapter topics: ${activeChapter.syllabusTopics.join(', ')}.
Target audience: ${currentClassConfig.label} student (${currentClassConfig.nepStage}).
Style: ${currentClassConfig.mode === 'foundation' ? 'Warm, intuitive, step-by-step, age-appropriate, encouraging, visual examples' : 'Rigorous, clear, highlighting keywords needed for CBSE board examinations'}.
Do not introduce unnecessary complex college jargon. Directly answer the student's question clearly.`;

      const res = await api.sendChatMessage({
        messages: [
          { role: 'user', content: systemInstruction },
          ...newHistory.map(m => ({ role: m.role, content: m.content })),
        ],
        grade: (currentClassConfig.classNum <= 8 ? 'Middle School (6-8)' : 'High School (9-10)') as any,
        subject: currentSubjectInfo.category,
        language: 'English',
        explanationDepth: 'step_by_step',
        selectedClass: currentClassConfig.label,
      });

      setTutorMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
    } catch (err: any) {
      setTutorMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ I encountered an error: ${err.message || 'Please try again.'}` },
      ]);
    } finally {
      setIsTutorThinking(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Class Selection Bar */}
      <div className="shrink-0 border-b border-slate-200 dark:border-[#19233d] bg-white/80 dark:bg-[#0b101f]/90 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                    NCERT Learning Hub (Classes 5–10)
                  </h1>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                    2025–2026 NEP Edition
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive curriculum, authentic textbooks, chapter mastery & AI tutor
                </p>
              </div>
            </div>
          </div>

          {/* Class Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CLASS_CONFIGS.map(cfg => {
              const isSelected = cfg.id === selectedClassId;
              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => {
                    setSelectedClassId(cfg.id);
                    setActiveChapter(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-105'
                      : 'bg-slate-100 dark:bg-[#131b32] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#1e2945]'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                  {cfg.mode === 'foundation' ? (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                      Foundation
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                      Secondary
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Class Mode Banner & Stats */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-100 dark:border-[#151f38] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${currentClassConfig.badgeColor}`}>
              {currentClassConfig.mode === 'foundation' ? '🌱 Foundation Mode (Classes 5–8)' : '🎯 Secondary Board Mode (Classes 9–10)'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              {currentClassConfig.nepStage}
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Class Progress:</span>
              <span className="font-bold text-violet-600 dark:text-violet-400">
                {classStats.completedCount} / {classStats.totalChapters} Chapters ({classStats.percentage}%)
              </span>
            </div>
            <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-[#1a233d] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${classStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Subject Navigation Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                NCERT Subjects ({currentClassInfo?.subjects.length || 0})
              </h2>
              {/* Search Bar */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search chapters or topics..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1e2a4a] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(currentClassInfo?.subjects || []).map(subject => {
                const isSelected = subject.id === selectedSubjectId;
                const completedInSubject = subject.chapters.filter(ch => completedChapters[ch.id]).length;
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(subject.id);
                      setActiveChapter(null);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border text-left flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/20'
                        : 'bg-white dark:bg-[#0c1326] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#131b32] border-slate-200/80 dark:border-[#1a2542]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{subject.name}</span>
                      {subject.subjectCode && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          #{subject.subjectCode}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
                      {completedInSubject}/{subject.chapters.length} chapters completed
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Subject Information Banner */}
          {currentSubjectInfo && (
            <div className="rounded-2xl p-4 bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-[#1a2542] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {currentSubjectInfo.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/20">
                      NCERT Verified Curriculum
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Textbook: <span className="font-medium text-slate-700 dark:text-slate-300">{currentSubjectInfo.textbookName || currentSubjectInfo.curricula[0]}</span>
                    {currentSubjectInfo.edition && ` • ${currentSubjectInfo.edition}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('generator')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#151f38] hover:bg-slate-200 dark:hover:bg-[#1a2645] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span>Open AI Generator</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Tutor</span>
                </button>
              </div>
            </div>
          )}

          {/* Chapters Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Official NCERT Chapters ({filteredChapters.length})
              </h3>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-violet-500 hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredChapters.length === 0 ? (
              <div className="rounded-2xl p-8 bg-white dark:bg-[#0c1326] border border-slate-200 dark:border-[#1a2542] text-center space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No chapters found matching &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-slate-400">Try searching with a broader topic name.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChapters.map((chapter, idx) => {
                  const isCompleted = !!completedChapters[chapter.id];
                  const hasFormulas = (chapter.coreFormulas || []).length > 0;
                  const hasDefinitions = (chapter.importantDefinitions || []).length > 0;

                  return (
                    <div
                      key={chapter.id}
                      className={`group rounded-2xl p-4 bg-white dark:bg-[#0c1326] border transition-all duration-200 hover:shadow-md flex flex-col justify-between gap-3 ${
                        isCompleted
                          ? 'border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/10'
                          : 'border-slate-200 dark:border-[#1a2542] hover:border-violet-500/40'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Chapter Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#151f38] text-slate-600 dark:text-slate-400">
                              Ch {idx + 1}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Mastered</span>
                              </span>
                            )}
                          </div>

                          {/* Completion Toggle */}
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleChapterCompletion(chapter.id);
                            }}
                            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            className="text-slate-400 hover:text-emerald-500 transition-colors p-1 cursor-pointer"
                          >
                            {isCompleted ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 dark:text-slate-600 hover:text-slate-300" />
                            )}
                          </button>
                        </div>

                        {/* Title & Reference */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                            {chapter.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {chapter.textbookRef}
                          </p>
                        </div>

                        {/* Topics Preview */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Key Focus Topics:
                          </span>
                          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {chapter.syllabusTopics.slice(0, 2).map((topic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-1.5 text-[11px] line-clamp-1">
                                <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                <span className="truncate">{topic}</span>
                              </li>
                            ))}
                            {chapter.syllabusTopics.length > 2 && (
                              <li className="text-[10px] text-violet-500 font-medium">
                                +{chapter.syllabusTopics.length - 2} more topics
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {hasDefinitions && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Definitions
                            </span>
                          )}
                          {hasFormulas && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Formulas
                            </span>
                          )}
                          {currentClassConfig.mode === 'foundation' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Mental Math
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Board Patterns
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button: Open Chapter Engine */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveChapter(chapter);
                          setActiveTab('overview');
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-violet-600/10 dark:bg-violet-500/15 hover:bg-violet-600 text-violet-700 dark:text-violet-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:bg-violet-600 group-hover:text-white"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Launch Chapter Engine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* CHAPTER LEARNING ENGINE: MODAL / FULL DRAWER */}
      {/* ---------------------------------------------------- */}
      {activeChapter && currentSubjectInfo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-5xl h-[92vh] rounded-3xl bg-white dark:bg-[#0b101f] border border-slate-200 dark:border-[#1d2745] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="shrink-0 border-b border-slate-200 dark:border-[#1a2542] px-5 py-4 bg-slate-50 dark:bg-[#0e162b] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-300">
                      {currentClassConfig.label} • {currentSubjectInfo.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentClassConfig.badgeColor}`}>
                      {currentClassConfig.mode === 'foundation' ? 'Foundation Mode' : 'Secondary Mode'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                    {activeChapter.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleChapterCompletion(activeChapter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    completedChapters[activeChapter.id]
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-[#151f38] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1e2a4a]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedChapters[activeChapter.id] ? 'Completed' : 'Mark Completed'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChapter(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#151f38] hover:bg-slate-200 dark:hover:bg-[#1a2645] text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="shrink-0 border-b border-slate-200 dark:border-[#1a2542] px-5 py-2.5 bg-white dark:bg-[#0b101f] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b32]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Overview & Concepts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'notes'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b32]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>AI Study Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('flashcards')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'flashcards'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b32]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards ({chapterFlashcards.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'quiz'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b32]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Quiz & Board Questions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tutor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'tutor'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131b32]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chapter AI Tutor</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 dark:bg-[#070b14]/50">
              {/* TAB 1: OVERVIEW & KEY CONCEPTS */}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Overview summary */}
                  {activeChapter.overviewSummary && (
                    <div className="rounded-2xl p-5 bg-gradient-to-r from-violet-900/20 via-indigo-900/10 to-transparent border border-violet-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                          Chapter Big Picture & Overview
                        </h4>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {activeChapter.overviewSummary}
                      </p>
                    </div>
                  )}

                  {/* Core Topics Checklist */}
                  <div className="rounded-2xl p-5 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Official Syllabus Topics</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {activeChapter.syllabusTopics.map((topic, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-[#131b32] border border-slate-200/60 dark:border-[#1e2a4a] text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-lg bg-violet-500/20 text-violet-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Formulas & Equations */}
                  {activeChapter.coreFormulas && activeChapter.coreFormulas.length > 0 && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          <span>Core Formulas & Mathematical Proofs</span>
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {activeChapter.coreFormulas.map((formula, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-[#161c2e] border border-amber-500/20 flex items-center justify-between gap-3"
                          >
                            <code className="text-sm font-mono text-amber-600 dark:text-amber-300 font-bold overflow-x-auto">
                              {formula}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(formula);
                                showToast('Formula copied to clipboard!');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                              title="Copy formula"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Important Definitions */}
                  {activeChapter.importantDefinitions && activeChapter.importantDefinitions.length > 0 && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2">
                        <BookMarked className="w-4 h-4" />
                        <span>Key Definitions & Scientific Terminology</span>
                      </h4>
                      <div className="space-y-2">
                        {activeChapter.importantDefinitions.map((def, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-blue-500/5 dark:bg-[#11192e] border border-blue-500/20 text-xs leading-relaxed"
                          >
                            <span className="font-bold text-blue-600 dark:text-blue-300">
                              {def.split(':')[0]}:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 ml-1">
                              {def.split(':').slice(1).join(':')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Foundation Mode: Vocabulary & Mental Math */}
                  {currentClassConfig.mode === 'foundation' && (
                    <div className="rounded-2xl p-5 bg-emerald-500/5 dark:bg-[#0c1c24] border border-emerald-500/20 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span>Foundation Skill Builders (Classes 5–8)</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        In Foundation mode, focus on rapid mental math, logical reasoning, and language vocabulary:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-emerald-500/20">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                            💡 Mental Math / Intuition Tip:
                          </span>
                          Break down multi-step problems into estimation first before exact calculation.
                        </div>
                        <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-emerald-500/20">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                            📖 Vocabulary Builder:
                          </span>
                          Write definitions in your own words with at least one real-world kitchen or playground example.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI REVISION NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542]">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        AI-Generated Structured Revision Notes
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Generate comprehensive, high-yield revision notes tailored to {currentClassConfig.label} NCERT standard.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleGenerateChapterNotes}
                        disabled={isGeneratingNotes}
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        {isGeneratingNotes ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Synthesizing Notes...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{generatedNotes ? 'Regenerate Notes' : 'Generate Full Notes'}</span>
                          </>
                        )}
                      </button>

                      {generatedNotes && onSaveAsNote && (
                        <button
                          type="button"
                          onClick={() => {
                            onSaveAsNote(
                              `${activeChapter.name} (NCERT Notes)`,
                              generatedNotes,
                              currentSubjectInfo.category
                            );
                            showToast('Saved to your Study Notes!');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#151f38] hover:bg-slate-200 dark:hover:bg-[#1e2a4a] text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Save to Notes</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes Content */}
                  {generatedNotes ? (
                    <div className="rounded-2xl p-6 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                      {generatedNotes}
                    </div>
                  ) : (
                    <div className="rounded-2xl p-8 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] text-center space-y-3">
                      <FileText className="w-10 h-10 mx-auto text-violet-400" />
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        No custom notes generated yet
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Click &ldquo;Generate Full Notes&rdquo; to have our NCERT AI engine generate comprehensive notes, definitions, formulas, and board exam tips for this chapter.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FLASHCARDS */}
              {activeTab === 'flashcards' && (
                <div className="space-y-6 max-w-2xl mx-auto py-2">
                  {chapterFlashcards.length === 0 ? (
                    <div className="rounded-2xl p-8 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] text-center">
                      <p className="text-sm text-slate-400">No flashcards available for this chapter.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Card Counter & Save Button */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500 dark:text-slate-400">
                          Card {cardIndex + 1} of {chapterFlashcards.length}
                        </span>
                        {onCreateFlashcard && (
                          <button
                            type="button"
                            onClick={() => {
                              chapterFlashcards.forEach(c => {
                                onCreateFlashcard(c.front, c.back, currentSubjectInfo.category);
                              });
                              showToast(`Saved all ${chapterFlashcards.length} flashcards to your deck!`);
                            }}
                            className="text-violet-600 dark:text-violet-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save All to My Flashcards</span>
                          </button>
                        )}
                      </div>

                      {/* Interactive Flip Card */}
                      <div
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className={`min-h-[260px] rounded-3xl p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between border shadow-lg ${
                          isCardFlipped
                            ? 'bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-[#0e162b] border-violet-500/50'
                            : 'bg-white dark:bg-[#0e162b] border-slate-200 dark:border-[#1a2542] hover:border-violet-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 font-bold uppercase text-[10px]">
                            {chapterFlashcards[cardIndex].topic}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <RotateCw className="w-3 h-3" />
                            <span>Click anywhere to flip</span>
                          </span>
                        </div>

                        <div className="my-6 text-center">
                          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                            {isCardFlipped ? 'ANSWER / EXPLANATION' : 'QUESTION / CONCEPT'}
                          </p>
                          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                            {isCardFlipped
                              ? chapterFlashcards[cardIndex].back
                              : chapterFlashcards[cardIndex].front}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
                          <span>Difficulty: {chapterFlashcards[cardIndex].difficulty}</span>
                          <span className="text-violet-500 font-medium">Flip to verify</span>
                        </div>
                      </div>

                      {/* Flashcard Navigation & Rating Controls */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCardIndex(prev => Math.max(0, prev - 1));
                            setIsCardFlipped(false);
                          }}
                          disabled={cardIndex === 0}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#151f38] hover:bg-slate-200 dark:hover:bg-[#1e2a4a] disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewedCards(prev => ({ ...prev, [cardIndex]: 'review' }));
                              if (cardIndex < chapterFlashcards.length - 1) {
                                setCardIndex(prev => prev + 1);
                                setIsCardFlipped(false);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Needs Review
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewedCards(prev => ({ ...prev, [cardIndex]: 'mastered' }));
                              if (cardIndex < chapterFlashcards.length - 1) {
                                setCardIndex(prev => prev + 1);
                                setIsCardFlipped(false);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mastered!
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCardIndex(prev => Math.min(chapterFlashcards.length - 1, prev + 1));
                            setIsCardFlipped(false);
                          }}
                          disabled={cardIndex === chapterFlashcards.length - 1}
                          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: QUIZ & EXAMINATION PRACTICE */}
              {activeTab === 'quiz' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Action banner to launch full mock test */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-violet-900/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {currentClassConfig.mode === 'foundation' ? 'Olympiad & School Practice' : 'CBSE Board Examination Practice'}
                      </h4>
                      <p className="text-xs text-slate-300">
                        Test your speed and concept retention with authentic NCERT questions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('exam')}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Generate Full Timed Mock</span>
                    </button>
                  </div>

                  {/* Interactive MCQs */}
                  <div className="space-y-4">
                    {chapterQuiz.map((q, idx) => {
                      const selected = selectedQuizAnswers[idx];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === q.correctAnswer;

                      return (
                        <div
                          key={q.id}
                          className="rounded-2xl p-5 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-400">
                              Question {idx + 1}
                            </span>
                            {isAnswered && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (Review)'}
                              </span>
                            )}
                          </div>

                          <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                            {q.question}
                          </h5>

                          {/* Options */}
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              let optStyle = 'bg-slate-50 dark:bg-[#131b32] hover:bg-slate-100 dark:hover:bg-[#182342] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1e2a4a]';
                              if (isAnswered) {
                                if (optIdx === q.correctAnswer) {
                                  optStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold';
                                } else if (optIdx === selected) {
                                  optStyle = 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (!isAnswered) {
                                      setSelectedQuizAnswers(prev => ({ ...prev, [idx]: optIdx }));
                                    }
                                  }}
                                  className={`w-full p-3 rounded-xl border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && optIdx === q.correctAnswer && (
                                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {isAnswered && (
                            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              <span className="font-bold text-violet-400 block">
                                Rationale & Textbook Reference:
                              </span>
                              <p>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Competency & Case Based Section for Class 9-10 */}
                  {activeChapter.competencyQuestions && activeChapter.competencyQuestions.length > 0 && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>Competency-Based High-Order Thinking (HOTS)</span>
                      </h4>
                      <div className="space-y-3">
                        {activeChapter.competencyQuestions.map((cq, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-[#15172b] border border-purple-500/20 text-xs space-y-2">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              Q{i + 1}. {cq}
                            </p>
                            <button
                              type="button"
                              onClick={() => setRevealedSolutions(prev => ({ ...prev, [i]: !prev[i] }))}
                              className="text-[11px] font-bold text-violet-400 hover:underline cursor-pointer"
                            >
                              {revealedSolutions[i] ? 'Hide Answer Framework' : 'View Answer Framework & Key Points'}
                            </button>
                            {revealedSolutions[i] && (
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-purple-500/20">
                                Model answer should state the fundamental law, cite textual evidence from {activeChapter.textbookRef}, and provide a structured conclusion addressing both aspects of the prompt.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CHAPTER AI TUTOR */}
              {activeTab === 'tutor' && (
                <div className="max-w-3xl mx-auto flex flex-col h-[520px] rounded-2xl bg-white dark:bg-[#0e162b] border border-slate-200 dark:border-[#1a2542] overflow-hidden">
                  {/* Chat message stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {tutorMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Brain className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-violet-600 text-white font-medium'
                              : 'bg-slate-100 dark:bg-[#131b32] text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-[#1e2a4a]'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTutorThinking && (
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="rounded-2xl p-3 bg-slate-100 dark:bg-[#131b32] text-xs text-slate-400 italic">
                          Thinking in {currentClassConfig.label} NCERT context...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick suggested chips */}
                  <div className="px-3 py-2 border-t border-slate-100 dark:border-[#17223b] bg-slate-50/50 dark:bg-[#0b101f] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {[
                      `Explain ${activeChapter.name.slice(0, 20)} simply`,
                      'Give me an intuitive real-world example',
                      'What is the most common mistake students make?',
                      'Test me with a tricky exam question',
                    ].map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendTutorMessage(chip)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151f38] hover:bg-violet-500/10 text-slate-600 dark:text-slate-300 hover:text-violet-400 text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleSendTutorMessage();
                    }}
                    className="p-3 border-t border-slate-200 dark:border-[#1a2542] flex items-center gap-2 bg-white dark:bg-[#0e162b]"
                  >
                    <input
                      type="text"
                      value={tutorInput}
                      onChange={e => setTutorInput(e.target.value)}
                      placeholder={`Ask your ${currentClassConfig.label} tutor about ${activeChapter.name}...`}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-[#131b32] text-slate-900 dark:text-white border border-transparent focus:border-violet-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!tutorInput.trim() || isTutorThinking}
                      className="p-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
