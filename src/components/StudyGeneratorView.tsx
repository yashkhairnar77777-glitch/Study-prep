import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Upload,
  Layers,
  FileText,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  Play,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  BookMarked,
  Flame,
  FileCheck,
  Search,
  Eye,
  RefreshCw,
  FolderOpen,
  X,
} from 'lucide-react';
import {
  UserProfile,
  StudyGeneratorOutputType,
  EducationBoard,
  GeneratedStudyPack,
  GeneratedFlashcardItem,
  GeneratedChapterNotes,
  GeneratedMCQItem,
  GeneratedShortTestItem,
  GeneratedImportantItem,
  ExamPaper,
  Flashcard,
  SavedNote,
  SubjectCategory,
} from '../types';
import { SYLLABUS_REGISTRY, SyllabusBoardInfo, SyllabusClassInfo, SyllabusSubjectInfo, SyllabusChapter } from '../lib/syllabusData';
import { MarkdownRenderer } from './MarkdownRenderer';
import { api } from '../lib/api';
import { storage } from '../lib/storage';

interface StudyGeneratorViewProps {
  profile: UserProfile;
  onStartMockTest: (paper: ExamPaper) => void;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
  onCreateFlashcard: (front: string, back: string, subject: SubjectCategory) => void;
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  onUpdateNotes: (notes: SavedNote[]) => void;
}

export const StudyGeneratorView: React.FC<StudyGeneratorViewProps> = ({
  profile,
  onStartMockTest,
  onSaveAsNote,
  onCreateFlashcard,
  onUpdateFlashcards,
  onUpdateNotes,
}) => {
  // Source Mode
  const [sourceMode, setSourceMode] = useState<'syllabus' | 'upload'>('syllabus');

  // Syllabus Mode State
  const [selectedBoardId, setSelectedBoardId] = useState<EducationBoard>('CBSE');
  const [selectedClassId, setSelectedClassId] = useState<string>('cbse-class-10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cbse-10-math');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('NCERT Standard Textbook');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-quadratic-equations');
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [customTopicsOrNotes, setCustomTopicsOrNotes] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('2025–2026');

  // Upload Mode State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string>('');
  const [docPageCount, setDocPageCount] = useState<number>(1);
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [docParseError, setDocParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Output Types
  const [selectedOutputs, setSelectedOutputs] = useState<StudyGeneratorOutputType[]>([
    'flashcards',
    'notes',
    'mcq_quiz',
    'short_test',
    'practice_exam',
    'important_questions',
  ]);

  // Exam Configuration
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Competitive'>('Medium');

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgressStage, setGenerationProgressStage] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentPack, setCurrentPack] = useState<GeneratedStudyPack | null>(null);
  const [savedPacks, setSavedPacks] = useState<GeneratedStudyPack[]>(storage.getGeneratedStudyPacks());
  const [activeTab, setActiveTab] = useState<StudyGeneratorOutputType>('flashcards');

  // Interactive Viewer states
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedShortAnswers, setRevealedShortAnswers] = useState<Record<string, boolean>>({});
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [editedNotesContent, setEditedNotesContent] = useState<string>('');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Derive board, class, subject, chapter objects
  const currentBoard: SyllabusBoardInfo =
    SYLLABUS_REGISTRY.find(b => b.id === selectedBoardId) || SYLLABUS_REGISTRY[0];

  const currentClass: SyllabusClassInfo =
    currentBoard.classes.find(c => c.id === selectedClassId) || currentBoard.classes[0] || {
      id: 'default',
      name: 'Standard Level',
      gradeEquivalent: profile.grade,
      subjects: [],
    };

  const currentSubject: SyllabusSubjectInfo =
    currentClass.subjects.find(s => s.id === selectedSubjectId) || currentClass.subjects[0] || {
      id: 'default-sub',
      name: profile.primarySubject,
      category: profile.primarySubject,
      curricula: ['Standard Textbook'],
      chapters: [],
    };

  const currentChapter: SyllabusChapter | undefined = currentSubject.chapters.find(
    ch => ch.id === selectedChapterId
  );

  // Sync board changes with valid class & subject
  const handleBoardChange = (boardId: EducationBoard) => {
    setSelectedBoardId(boardId);
    const board = SYLLABUS_REGISTRY.find(b => b.id === boardId);
    if (board && board.classes.length > 0) {
      const firstClass = board.classes[0];
      setSelectedClassId(firstClass.id);
      if (firstClass.subjects.length > 0) {
        const firstSub = firstClass.subjects[0];
        setSelectedSubjectId(firstSub.id);
        setSelectedCurriculum(firstSub.curricula[0] || 'Standard Curriculum');
        if (firstSub.chapters.length > 0) {
          setSelectedChapterId(firstSub.chapters[0].id);
        }
      }
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const cls = currentBoard.classes.find(c => c.id === classId);
    if (cls && cls.subjects.length > 0) {
      const firstSub = cls.subjects[0];
      setSelectedSubjectId(firstSub.id);
      setSelectedCurriculum(firstSub.curricula[0] || 'Standard Curriculum');
      if (firstSub.chapters.length > 0) {
        setSelectedChapterId(firstSub.chapters[0].id);
      }
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = currentClass.subjects.find(s => s.id === subjectId);
    if (sub) {
      setSelectedCurriculum(sub.curricula[0] || 'Standard Curriculum');
      if (sub.chapters.length > 0) {
        setSelectedChapterId(sub.chapters[0].id);
      }
    }
  };

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Toggle output checkboxes
  const toggleOutput = (outputType: StudyGeneratorOutputType) => {
    if (selectedOutputs.includes(outputType)) {
      if (selectedOutputs.length === 1) {
        showToast('Please select at least one study output.');
        return;
      }
      setSelectedOutputs(selectedOutputs.filter(o => o !== outputType));
    } else {
      setSelectedOutputs([...selectedOutputs, outputType]);
    }
  };

  // Presets
  const applyPreset = (preset: 'all' | 'revision' | 'exam') => {
    if (preset === 'all') {
      setSelectedOutputs([
        'flashcards',
        'notes',
        'mcq_quiz',
        'short_test',
        'practice_exam',
        'important_questions',
      ]);
    } else if (preset === 'revision') {
      setSelectedOutputs(['flashcards', 'notes', 'important_questions']);
    } else if (preset === 'exam') {
      setSelectedOutputs(['mcq_quiz', 'short_test', 'practice_exam']);
    }
  };

  // Upload Processing
  const processUploadedDocument = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      setDocParseError('File size exceeds the 25MB maximum limit.');
      return;
    }

    setUploadedFile(file);
    setIsParsingDoc(true);
    setDocParseError(null);
    setExtractedDocText('');

    try {
      if (
        file.type === 'text/plain' ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv')
      ) {
        const text = await file.text();
        if (!text.trim()) throw new Error('Uploaded text file is empty.');
        setExtractedDocText(text.trim());
        setDocPageCount(Math.max(1, Math.ceil(text.length / 2500)));
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfjs = await import('pdfjs-dist');
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        setDocPageCount(pdf.numPages);
        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 30);

        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const tokenized = await page.getTextContent();
          const pageText = tokenized.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
          if (pageText.trim()) {
            fullText += `\n[--- Page ${i} of ${pdf.numPages} ---]\n${pageText}\n`;
          }
        }

        if (!fullText.trim()) {
          throw new Error(
            'This PDF appears to be a scanned document without embedded text. You can upload individual page images or snapshot photos to extract using our OCR engine.'
          );
        }

        setExtractedDocText(fullText.trim());
      } else if (file.type.startsWith('image/')) {
        // Run OCR on student photo or scanned image
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const res = reader.result as string;
            const b64 = res.split(',')[1] || res;
            resolve(b64);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;

        const ocrResult = await api.ocrDocumentImage({
          imageBase64: base64Data,
          mimeType: file.type || 'image/jpeg',
          pageNumber: 1,
        });

        setExtractedDocText(ocrResult.text.trim());
        setDocPageCount(1);
      } else {
        throw new Error('Unsupported format. Please upload PDF (.pdf), image (.png, .jpg), or Markdown/Text (.md, .txt).');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to extract text from document.';
      setDocParseError(msg);
      setExtractedDocText('');
    } finally {
      setIsParsingDoc(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedDocument(file);
  };

  // Core Generation Function
  const handleGenerate = async () => {
    if (selectedOutputs.length === 0) {
      setGenerationError('Please select at least one study output.');
      return;
    }

    if (sourceMode === 'upload' && !extractedDocText) {
      setGenerationError('Please upload a document or wait for text extraction to complete.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgressStage('Grounding against verified curriculum & source context...');

    try {
      const chapterTitle =
        selectedBoardId === 'Custom'
          ? customChapterName || 'Custom Academic Unit'
          : currentChapter?.name || 'Curriculum Chapter';

      const syllabusTopics =
        selectedBoardId === 'Custom'
          ? customTopicsOrNotes.split(',').map(s => s.trim()).filter(Boolean)
          : currentChapter?.syllabusTopics || [];

      // Step progress messages
      const progressTimer1 = setTimeout(() => {
        setGenerationProgressStage('Synthesizing structured notes and formula breakdowns...');
      }, 1500);

      const progressTimer2 = setTimeout(() => {
        setGenerationProgressStage('Generating active-recall flashcards & assessments...');
      }, 3500);

      const result = await api.generateStudyPack({
        sourceMode,
        board: selectedBoardId,
        curriculum: selectedCurriculum,
        grade: currentClass.name,
        subject: currentSubject.name,
        academicYear,
        chapter: chapterTitle,
        syllabusTopics,
        customTopicsOrNotes: customTopicsOrNotes.trim() || undefined,
        documentTitle: uploadedFile?.name,
        documentContent: sourceMode === 'upload' ? extractedDocText : undefined,
        pageContextSummary:
          sourceMode === 'upload' ? `${docPageCount} extracted pages` : undefined,
        selectedOutputs,
        examConfig: {
          durationMinutes: examDuration,
          difficulty: examDifficulty,
          totalMarks: 20,
        },
        studentProfile: {
          name: profile.name,
          grade: profile.selectedClass || profile.grade,
          language: profile.preferredLanguage,
          style: profile.defaultStyle,
        },
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);

      setCurrentPack(result);
      storage.saveGeneratedStudyPack(result);
      setSavedPacks(storage.getGeneratedStudyPacks());
      storage.recordStudyEngagement(5); // 5 mins engagement credit

      // Set first available tab
      if (result.outputs.flashcards && selectedOutputs.includes('flashcards')) {
        setActiveTab('flashcards');
      } else if (result.outputs.notes && selectedOutputs.includes('notes')) {
        setActiveTab('notes');
      } else if (result.outputs.mcqQuiz && selectedOutputs.includes('mcq_quiz')) {
        setActiveTab('mcq_quiz');
      } else {
        setActiveTab(selectedOutputs[0]);
      }

      setFlashcardIdx(0);
      setIsCardFlipped(false);
      setQuizAnswers({});
      setRevealedSolutions({});
      setRevealedShortAnswers({});
      if (result.outputs.notes) {
        setEditedNotesContent(result.outputs.notes.markdownContent);
      }
      showToast('Study Pack generated and grounded successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Study pack generation failed.';
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
      setGenerationProgressStage('');
    }
  };

  // Keyboard controls for Flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'flashcards' || !currentPack?.outputs.flashcards) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsCardFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        const total = currentPack.outputs.flashcards.length;
        if (flashcardIdx < total - 1) {
          setIsCardFlipped(false);
          setFlashcardIdx(prev => prev + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        if (flashcardIdx > 0) {
          setIsCardFlipped(false);
          setFlashcardIdx(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, flashcardIdx, currentPack]);

  // Save all flashcards to user's Leitner deck
  const handleSaveAllFlashcardsToDeck = () => {
    if (!currentPack?.outputs.flashcards || currentPack.outputs.flashcards.length === 0) return;
    const newCards: Flashcard[] = currentPack.outputs.flashcards.map((c, i) => ({
      id: `fc-gen-${Date.now()}-${i}`,
      front: c.front,
      back: c.back,
      subject: (currentSubject.category || profile.primarySubject) as SubjectCategory,
      topic: c.topic || currentPack.title,
      box: 1,
      nextReviewDate: Date.now(),
      reviewCount: 0,
      easeScore: 'unreviewed',
    }));

    storage.appendFlashcards(newCards);
    onUpdateFlashcards(storage.getFlashcards());
    showToast(`Added ${newCards.length} flashcards to your Leitner review deck!`);
  };

  // Save notes to user's saved notes
  const handleSaveNotesToLibrary = () => {
    if (!currentPack?.outputs.notes) return;
    const newNote: SavedNote = {
      id: `note-gen-${Date.now()}`,
      title: currentPack.outputs.notes.title || currentPack.title,
      content: isEditingNotes ? editedNotesContent : currentPack.outputs.notes.markdownContent,
      subject: (currentSubject.category || profile.primarySubject) as SubjectCategory,
      createdAt: Date.now(),
      tags: [currentBoard.shortName, currentPack.title],
    };

    storage.appendNote(newNote);
    onUpdateNotes(storage.getNotes());
    showToast('Saved to your Study Notes library!');
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Core Study Generation Suite</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              AI Study Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Generate grounded flashcards, notes, interactive quizzes, short tests, and full practice exams from accredited syllabus frameworks or your uploaded study notes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {savedPacks.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="clay-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
                title="View previous study packs"
              >
                <FolderOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Saved Packs ({savedPacks.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="p-3 rounded-2xl bg-violet-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="p-1 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Source Mode Toggle: Syllabus Mode vs Upload Mode */}
        <div className="clay-card p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Step 1: Choose Knowledge Source Mode</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground your study pack in official board syllabuses or private documents.
              </p>
            </div>

            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setSourceMode('syllabus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  sourceMode === 'syllabus'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Syllabus Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  sourceMode === 'upload'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Mode (PDF/Image/Notes)</span>
              </button>
            </div>
          </div>

          {/* SYLLABUS MODE CONFIGURATION */}
          {sourceMode === 'syllabus' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Board Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Education Board
                  </label>
                  <select
                    value={selectedBoardId}
                    onChange={e => handleBoardChange(e.target.value as EducationBoard)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="CBSE">CBSE / NCERT (National India & International)</option>
                    <option value="ICSE">ICSE / CISCE (CISCE Council India)</option>
                    <option value="MSBSHSE">Maharashtra State Board (Balbharati)</option>
                    <option value="Cambridge">Cambridge International (CAIE - IGCSE & A-Level)</option>
                    <option value="IB">International Baccalaureate (IB MYP & DP)</option>
                    <option value="Custom">Custom / University / Exam Syllabus</option>
                  </select>
                </div>

                {/* Class / Grade Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class / Grade Level
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={e => handleClassChange(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {currentBoard.classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => handleSubjectChange(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {currentClass.subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Curriculum / Textbook Edition */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Prescribed Curriculum / Textbook
                  </label>
                  <select
                    value={selectedCurriculum}
                    onChange={e => setSelectedCurriculum(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {currentSubject.curricula.map((cur, i) => (
                      <option key={i} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Academic Session
                  </label>
                  <select
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    {currentBoard.academicYears.map((yr, i) => (
                      <option key={i} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Selector */}
                {selectedBoardId !== 'Custom' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Chapter
                    </label>
                    <select
                      value={selectedChapterId}
                      onChange={e => setSelectedChapterId(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                      {currentSubject.chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Custom Chapter Name
                    </label>
                    <input
                      type="text"
                      value={customChapterName}
                      onChange={e => setCustomChapterName(e.target.value)}
                      placeholder="e.g. Thermodynamics & Carnot Cycles"
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Verified Syllabus Grounding Card */}
              {selectedBoardId !== 'Custom' && currentChapter && (
                <div className="rounded-2xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/30 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <span className="font-bold text-violet-900 dark:text-violet-200">
                        Verified Syllabus Topics for {currentChapter.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ref: {currentChapter.textbookRef}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentChapter.syllabusTopics.map((top, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-violet-200/60 dark:border-violet-800/40 font-medium text-[11px]"
                      >
                        ✓ {top}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                    Authentic Grounding Guarantee: The AI engine strictly formulates flashcards, notes, and exam items based on these verified syllabus learning objectives. No fictitious textbook citations or page numbers are invented.
                  </p>
                </div>
              )}

              {/* Supplemental Focus / Teacher Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional: Supplemental Topics or Teacher's Exam Focus (Comma-separated)
                </label>
                <input
                  type="text"
                  value={customTopicsOrNotes}
                  onChange={e => setCustomTopicsOrNotes(e.target.value)}
                  placeholder="e.g. Focus on derivation of quadratic formula, word problems involving speed and distance"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          )}

          {/* UPLOAD MODE CONFIGURATION */}
          {sourceMode === 'upload' && (
            <div className="space-y-4 animate-in fade-in">
              {!uploadedFile ? (
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-violet-400 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 mb-3 shadow-xs">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Drag & drop or browse study document
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PDF (.pdf), Photos / Scanned Notes (.png, .jpg), and Markdown / Text (.md, .txt) up to 25MB
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 shrink-0">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">
                          {uploadedFile.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                          <span aria-hidden="true">·</span>
                          <span>{docPageCount} {docPageCount === 1 ? 'page' : 'pages'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {extractedDocText.length.toLocaleString()} characters indexed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setExtractedDocText('');
                          setDocParseError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="rounded-xl bg-rose-50 dark:bg-rose-950/60 p-2 text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {extractedDocText && (
                    <div className="max-h-28 overflow-y-auto rounded-xl bg-white dark:bg-slate-950 p-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                      <p className="line-clamp-4">{extractedDocText.slice(0, 450)}...</p>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.json"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) processUploadedDocument(file);
                }}
                className="hidden"
              />

              {isParsingDoc && (
                <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-violet-600" />
                  <span>Extracting digital text, formulas, and page markers...</span>
                </div>
              )}

              {docParseError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{docParseError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Choose Output Formats & Configuration */}
        <div className="clay-card p-6 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Step 2: Choose Desired Study Outputs</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select one or more coordinated assets to generate in a single streamlined workflow.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600"
              >
                Complete Pack (All 6)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('revision')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600"
              >
                Revision Pack
              </button>
              <button
                type="button"
                onClick={() => applyPreset('exam')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600"
              >
                Exam & Test Pack
              </button>
            </div>
          </div>

          {/* 6 Output Checkbox Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                id: 'flashcards' as const,
                title: 'Interactive Flashcards',
                desc: 'Question & answer pairs designed for active recall & Leitner spaced repetition.',
                icon: Layers,
              },
              {
                id: 'notes' as const,
                title: 'Structured Chapter Notes',
                desc: 'Executive summary, key formulas with KaTeX, theoretical laws, and derivations.',
                icon: FileText,
              },
              {
                id: 'mcq_quiz' as const,
                title: 'MCQ Quizzes & Explanations',
                desc: 'Multiple choice questions with immediate option validation and step-by-step logic.',
                icon: HelpCircle,
              },
              {
                id: 'short_test' as const,
                title: 'Short-Answer Tests',
                desc: 'Conceptual & quantitative questions with model answers and scoring point rubrics.',
                icon: BookMarked,
              },
              {
                id: 'practice_exam' as const,
                title: 'Full Practice Exam',
                desc: 'Multi-section timed exam with instructions, section divisions, and launchable simulation.',
                icon: Award,
              },
              {
                id: 'important_questions' as const,
                title: 'Important Qs & Key Definitions',
                desc: 'High-yield exam items, recurring questions, and glossary of essential definitions.',
                icon: Flame,
              },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = selectedOutputs.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleOutput(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-500/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:border-violet-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-violet-600 text-white'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exam Configuration Parameters (if Practice Exam or Quizzes are selected) */}
          {(selectedOutputs.includes('practice_exam') || selectedOutputs.includes('mcq_quiz')) && (
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Exam Parameters:</span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Duration:</span>
                <select
                  value={examDuration}
                  onChange={e => setExamDuration(Number(e.target.value))}
                  className="rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">Target Difficulty:</span>
                <select
                  value={examDifficulty}
                  onChange={e => setExamDifficulty(e.target.value as any)}
                  className="rounded-xl px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200"
                >
                  <option value="Easy">Easy (Foundation / Recall)</option>
                  <option value="Medium">Medium (Standard Board Exam)</option>
                  <option value="Hard">Hard (Deep Analytical)</option>
                  <option value="Competitive">Competitive (JEE / NEET / Olympiad)</option>
                </select>
              </div>
            </div>
          )}

          {/* Generation Error Banner */}
          {generationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generationError}</span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500"
              >
                Retry
              </button>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Generating <span className="font-bold text-violet-600 dark:text-violet-400">{selectedOutputs.length} outputs</span> in one coordinated workflow.
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || (sourceMode === 'upload' && !extractedDocText)}
              className="w-full sm:w-auto px-6 py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-40 shadow-md"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Study Materials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Study Materials</span>
                </>
              )}
            </button>
          </div>

          {/* Multi-stage Progress Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-violet-700 dark:text-violet-300">
                  {generationProgressStage || 'Processing study materials...'}
                </span>
                <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400">
                  AI Active
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-violet-200 dark:bg-violet-900 overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>

        {/* RESULTS WORKSPACE */}
        {currentPack && (
          <div className="space-y-6 animate-in fade-in">
            {/* Grounding Summary Banner */}
            <div className="p-4.5 rounded-3xl bg-slate-900 text-white border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Verified Grounding
                  </span>
                  <span className="text-xs text-slate-300 font-medium truncate">
                    {currentPack.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {currentPack.sourceMetadata.groundingSummary} (No fabricated citations).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Output Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10">
              {currentPack.outputs.flashcards && selectedOutputs.includes('flashcards') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'flashcards'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Flashcards ({currentPack.outputs.flashcards.length})</span>
                </button>
              )}

              {currentPack.outputs.notes && selectedOutputs.includes('notes') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'notes'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Chapter Notes</span>
                </button>
              )}

              {currentPack.outputs.mcqQuiz && selectedOutputs.includes('mcq_quiz') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('mcq_quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'mcq_quiz'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>MCQ Quiz ({currentPack.outputs.mcqQuiz.length})</span>
                </button>
              )}

              {currentPack.outputs.shortTest && selectedOutputs.includes('short_test') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('short_test')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'short_test'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span>Short-Answer Test</span>
                </button>
              )}

              {currentPack.outputs.practiceExam && selectedOutputs.includes('practice_exam') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('practice_exam')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'practice_exam'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Practice Exam</span>
                </button>
              )}

              {currentPack.outputs.importantQuestions && selectedOutputs.includes('important_questions') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('important_questions')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'important_questions'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Important Qs & Defs ({currentPack.outputs.importantQuestions.length})</span>
                </button>
              )}
            </div>

            {/* TAB 1: FLASHCARDS INTERACTIVE VIEWER */}
            {activeTab === 'flashcards' && currentPack.outputs.flashcards && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Card <span className="font-bold text-slate-900 dark:text-white">{flashcardIdx + 1}</span> of {currentPack.outputs.flashcards.length}
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveAllFlashcardsToDeck}
                    className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to My Flashcard Deck</span>
                  </button>
                </div>

                {/* 3D Flip Card */}
                {(() => {
                  const card = currentPack.outputs.flashcards[flashcardIdx];
                  if (!card) return null;
                  return (
                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="group min-h-[260px] sm:min-h-[300px] flex flex-col justify-between rounded-3xl clay-card p-6 sm:p-8 cursor-pointer select-none transition-all hover:border-violet-500/40 relative shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-white/5 pb-3">
                        <span className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider text-[11px]">
                          {isCardFlipped ? 'Answer / Solution' : 'Question / Prompt'}
                        </span>
                        <span className="text-slate-500 font-medium">{card.topic}</span>
                      </div>

                      <div className="my-auto py-6">
                        {!isCardFlipped ? (
                          <div className="text-center space-y-2">
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-xl mx-auto">
                              {card.front}
                            </h3>
                          </div>
                        ) : (
                          <div className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                            <MarkdownRenderer content={card.back} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                        <span>Space to flip · Arrow keys to navigate</span>
                        <span className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1">
                          <RotateCw className="w-3 h-3" />
                          <span>Click anywhere to flip</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Nav buttons */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (flashcardIdx > 0) {
                        setIsCardFlipped(false);
                        setFlashcardIdx(flashcardIdx - 1);
                      }
                    }}
                    disabled={flashcardIdx === 0}
                    className="px-3.5 py-2 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (flashcardIdx < (currentPack.outputs.flashcards?.length || 0) - 1) {
                        setIsCardFlipped(false);
                        setFlashcardIdx(flashcardIdx + 1);
                      }
                    }}
                    disabled={flashcardIdx === (currentPack.outputs.flashcards?.length || 0) - 1}
                    className="px-3.5 py-2 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <span>Next Card</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CHAPTER NOTES */}
            {activeTab === 'notes' && currentPack.outputs.notes && (
              <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {currentPack.outputs.notes.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {currentPack.outputs.notes.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                      className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingNotes ? 'View Rendered' : 'Edit Notes'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveNotesToLibrary}
                      className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save to My Notes</span>
                    </button>
                  </div>
                </div>

                {/* Key formulas strip */}
                {currentPack.outputs.notes.keyFormulas && currentPack.outputs.notes.keyFormulas.length > 0 && (
                  <div className="rounded-2xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-900/30 p-4 space-y-2">
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                      Key Formulas & Derivations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentPack.outputs.notes.keyFormulas.map((f, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-violet-200/60 dark:border-violet-800/40 text-xs font-mono text-slate-800 dark:text-slate-200">
                          <MarkdownRenderer content={f} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Markdown Viewer / Editor */}
                {isEditingNotes ? (
                  <textarea
                    value={editedNotesContent}
                    onChange={e => setEditedNotesContent(e.target.value)}
                    rows={16}
                    className="w-full text-xs font-mono p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    <MarkdownRenderer content={editedNotesContent || currentPack.outputs.notes.markdownContent} />
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MCQ QUIZ INTERACTIVE RUNNER */}
            {activeTab === 'mcq_quiz' && currentPack.outputs.mcqQuiz && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Self-Graded Practice Quiz ({currentPack.outputs.mcqQuiz.length} Questions)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizAnswers({});
                      setRevealedSolutions({});
                    }}
                    className="text-slate-500 hover:text-violet-600 font-semibold"
                  >
                    Reset Answers
                  </button>
                </div>

                <div className="space-y-4">
                  {currentPack.outputs.mcqQuiz.map((mcq, qIdx) => {
                    const selectedOpt = quizAnswers[mcq.id];
                    const isRevealed = revealedSolutions[mcq.id] || selectedOpt !== undefined;
                    const isCorrect = selectedOpt === mcq.correctOptionIndex;

                    return (
                      <div
                        key={mcq.id || qIdx}
                        className="clay-card p-5 rounded-2xl space-y-3.5 border border-slate-200/80 dark:border-white/10"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                            <span className="text-violet-600 dark:text-violet-400 mr-2">Q{qIdx + 1}.</span>
                            {mcq.question}
                          </h4>
                          {isRevealed && (
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {isCorrect ? 'Correct' : 'Review Required'}
                            </span>
                          )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mcq.options.map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            const isAnswerKey = optIdx === mcq.correctOptionIndex;

                            let optClasses = 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 hover:border-violet-400';
                            if (isRevealed) {
                              if (isAnswerKey) {
                                optClasses = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                              } else if (isChosen) {
                                optClasses = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                              }
                            } else if (isChosen) {
                              optClasses = 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  setQuizAnswers({ ...quizAnswers, [mcq.id]: optIdx });
                                  setRevealedSolutions({ ...revealedSolutions, [mcq.id]: true });
                                }}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${optClasses}`}
                              >
                                <span className="font-bold shrink-0">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Toggle */}
                        {isRevealed && (
                          <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-xs space-y-1 bg-slate-50/60 dark:bg-slate-900/40 p-3 rounded-xl">
                            <span className="font-bold text-violet-700 dark:text-violet-300 block">
                              Detailed Solution Rationale:
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                              {mcq.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: SHORT-ANSWER TEST */}
            {activeTab === 'short_test' && currentPack.outputs.shortTest && (
              <div className="space-y-4">
                <div className="text-xs text-slate-500">
                  Analytical & Derivation Questions with Verified Marking Rubrics
                </div>

                <div className="space-y-4">
                  {currentPack.outputs.shortTest.map((item, idx) => {
                    const isRevealed = revealedShortAnswers[item.id || idx];

                    return (
                      <div key={idx} className="clay-card p-5 rounded-2xl space-y-3.5 border border-slate-200/80 dark:border-white/10">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                            <span className="text-violet-600 dark:text-violet-400 mr-2">Q{idx + 1}.</span>
                            {item.question}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold shrink-0">
                            {item.maxMarks} Marks
                          </span>
                        </div>

                        <div className="space-y-2">
                          <textarea
                            placeholder="Type your outline, formula, or solution here to test yourself..."
                            rows={3}
                            className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setRevealedShortAnswers({
                                ...revealedShortAnswers,
                                [item.id || idx]: !isRevealed,
                              })
                            }
                            className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isRevealed ? 'Hide Model Solution' : 'Reveal Model Solution & Marking Rubric'}</span>
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-xs space-y-2 animate-in fade-in">
                            <div>
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                                Exemplar Model Answer:
                              </span>
                              <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                                <MarkdownRenderer content={item.modelAnswer} />
                              </div>
                            </div>

                            {item.keyPoints && item.keyPoints.length > 0 && (
                              <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/30">
                                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1 text-[11px]">
                                  Mark Allocation Criteria:
                                </span>
                                <ul className="space-y-1">
                                  {item.keyPoints.map((pt, pIdx) => (
                                    <li key={pIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: PRACTICE EXAM */}
            {activeTab === 'practice_exam' && currentPack.outputs.practiceExam && (
              <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                      Practice Exam Simulation Ready
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {currentPack.outputs.practiceExam.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Total Marks: {currentPack.outputs.practiceExam.totalMarks}</span>
                      <span aria-hidden="true">·</span>
                      <span>Time Allowed: {currentPack.outputs.practiceExam.durationMinutes} mins</span>
                      <span aria-hidden="true">·</span>
                      <span>Difficulty: {currentPack.outputs.practiceExam.difficulty}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartMockTest(currentPack.outputs.practiceExam!)}
                    className="clay-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Timed Mock Test Simulation</span>
                  </button>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-xs space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">General Instructions:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    {currentPack.outputs.practiceExam.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>

                {/* Sections and Questions */}
                <div className="space-y-6">
                  {currentPack.outputs.practiceExam.sections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-3">
                      <div className="border-b border-slate-200/80 dark:border-white/10 pb-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {sec.sectionName}
                        </h4>
                        <p className="text-[11px] text-slate-400">{sec.description}</p>
                      </div>

                      <div className="space-y-3">
                        {sec.questions.map((q, qIdx) => (
                          <div
                            key={q.id || qIdx}
                            className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 space-y-2 text-xs"
                          >
                            <div className="flex items-start justify-between gap-3 font-semibold text-slate-800 dark:text-slate-200">
                              <span>
                                {secIdx === 0 ? `Q${qIdx + 1}.` : `Q${sec.questions.length + qIdx + 1}.`} {q.question}
                              </span>
                              <span className="text-slate-400 font-bold shrink-0">
                                [{q.marks} Mark{q.marks !== 1 ? 's' : ''}]
                              </span>
                            </div>

                            {q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 pl-4">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="text-[11px] text-slate-600 dark:text-slate-400">
                                    <span className="font-bold mr-1">({String.fromCharCode(97 + oIdx)})</span>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            {q.stepByStepSolution && (
                              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-white/5">
                                <span className="font-bold text-violet-600 dark:text-violet-400">Solution: </span>
                                <span>{q.stepByStepSolution}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: IMPORTANT QUESTIONS & DEFINITIONS */}
            {activeTab === 'important_questions' && currentPack.outputs.importantQuestions && (
              <div className="space-y-4">
                <div className="text-xs text-slate-500">
                  High-Yield Examination Questions and Essential Key Definitions
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPack.outputs.importantQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="clay-card p-5 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              item.type === 'definition'
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {item.type === 'definition' ? 'Key Definition' : 'High-Yield Question'}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-400">
                            {item.importance}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                          {item.termOrQuestion}
                        </h4>

                        <div className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed pt-1">
                          <MarkdownRenderer content={item.explanationOrAnswer} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SAVED PACKS MODAL */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-[#19233d] p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Saved Study Packs ({savedPacks.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {savedPacks.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No saved packs yet. Generate your first study pack above!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto">
                  {savedPacks.map(pack => (
                    <div
                      key={pack.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {pack.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {pack.sourceMetadata.groundingSummary} · {new Date(pack.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPack(pack);
                            setShowHistoryModal(false);
                            showToast(`Loaded ${pack.title}`);
                          }}
                          className="clay-btn-primary px-3 py-1.5 text-[11px] font-bold"
                        >
                          Open Pack
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            storage.deleteGeneratedStudyPack(pack.id);
                            setSavedPacks(storage.getGeneratedStudyPacks());
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                          title="Delete pack"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
