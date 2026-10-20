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
  Volume2,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
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
  OralTestItem,
  OralTestEvaluation,
  FormulaSheetItem,
  GeneratedFormulaSheet,
} from '../types';
import {
  SYLLABUS_REGISTRY,
  SyllabusBoardInfo,
  SyllabusClassInfo,
  SyllabusSubjectInfo,
  SyllabusChapter,
} from '../lib/syllabusData';
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
  // Stepper state: Step 1 (Source) -> Step 2 (Syllabus) -> Step 3 (Tools) -> Step 4 (Generate & Study)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: Source Mode ('ncert' | 'upload')
  const [sourceMode, setSourceMode] = useState<'syllabus' | 'upload'>('syllabus');

  // STEP 2: Syllabus & Chapters
  const [selectedBoardId, setSelectedBoardId] = useState<EducationBoard>('CBSE');
  const [selectedClassId, setSelectedClassId] = useState<string>('cbse-class-10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cbse-10-math');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('NCERT Standard Textbook');
  const [academicYear, setAcademicYear] = useState<string>('2025–2026');

  // Chapter Selection with Checkboxes & Select All
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(['ch-quadratic-equations']);
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');
  const [customChapterName, setCustomChapterName] = useState<string>('');
  const [customTopicsOrNotes, setCustomTopicsOrNotes] = useState<string>('');

  // STEP 1 & 2: Upload Mode State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedDocText, setExtractedDocText] = useState<string>('');
  const [docPageCount, setDocPageCount] = useState<number>(1);
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [docParseError, setDocParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STEP 3: Tools Selection
  const [selectedOutputs, setSelectedOutputs] = useState<StudyGeneratorOutputType[]>([
    'flashcards',
    'notes',
    'mcq_quiz',
    'short_test',
    'practice_exam',
    'oral_test',
    'formula_sheet',
    'important_questions',
  ]);

  // Exam Configuration
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Competitive'>('Medium');

  // STEP 4: Generation State & Results
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgressStage, setGenerationProgressStage] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [currentPack, setCurrentPack] = useState<GeneratedStudyPack | null>(null);
  const [savedPacks, setSavedPacks] = useState<GeneratedStudyPack[]>(storage.getGeneratedStudyPacks());
  const [activeTab, setActiveTab] = useState<StudyGeneratorOutputType>('flashcards');

  // Interactive Study Workspace States
  // Flashcards
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // MCQ Quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  // Short Test
  const [revealedShortAnswers, setRevealedShortAnswers] = useState<Record<string, boolean>>({});

  // Oral Test (Viva Simulator)
  const [oralQuestionIdx, setOralQuestionIdx] = useState<number>(0);
  const [oralAnswerText, setOralAnswerText] = useState<string>('');
  const [isRecordingOral, setIsRecordingOral] = useState<boolean>(false);
  const [oralEvaluation, setOralEvaluation] = useState<OralTestEvaluation | null>(null);
  const [isEvaluatingOral, setIsEvaluatingOral] = useState<boolean>(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Notes
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [editedNotesContent, setEditedNotesContent] = useState<string>('');

  // UI Utilities
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Derive board, class, subject
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

  // Filtered chapters for search
  const filteredChapters = currentSubject.chapters.filter(ch =>
    ch.name.toLowerCase().includes(chapterSearchQuery.toLowerCase()) ||
    ch.textbookRef.toLowerCase().includes(chapterSearchQuery.toLowerCase())
  );

  // Sync board change with valid class, subject, and chapter
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
          setSelectedChapterIds([firstSub.chapters[0].id]);
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
        setSelectedChapterIds([firstSub.chapters[0].id]);
      }
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = currentClass.subjects.find(s => s.id === subjectId);
    if (sub) {
      setSelectedCurriculum(sub.curricula[0] || 'Standard Curriculum');
      if (sub.chapters.length > 0) {
        setSelectedChapterIds([sub.chapters[0].id]);
      }
    }
  };

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Chapter Multi-Selection Controls
  const toggleChapterSelection = (chId: string) => {
    if (selectedChapterIds.includes(chId)) {
      if (selectedChapterIds.length === 1) {
        showToast('At least one chapter must remain selected.');
        return;
      }
      setSelectedChapterIds(selectedChapterIds.filter(id => id !== chId));
    } else {
      setSelectedChapterIds([...selectedChapterIds, chId]);
    }
  };

  const selectAllChapters = () => {
    setSelectedChapterIds(currentSubject.chapters.map(c => c.id));
  };

  const deselectAllChapters = () => {
    if (currentSubject.chapters.length > 0) {
      setSelectedChapterIds([currentSubject.chapters[0].id]);
    }
  };

  // Study Tools Toggle
  const toggleTool = (tool: StudyGeneratorOutputType) => {
    if (selectedOutputs.includes(tool)) {
      if (selectedOutputs.length === 1) {
        showToast('Please select at least one study tool.');
        return;
      }
      setSelectedOutputs(selectedOutputs.filter(t => t !== tool));
    } else {
      setSelectedOutputs([...selectedOutputs, tool]);
    }
  };

  const applyPreset = (preset: 'all' | 'revision' | 'exam' | 'oral') => {
    if (preset === 'all') {
      setSelectedOutputs([
        'flashcards',
        'notes',
        'mcq_quiz',
        'short_test',
        'practice_exam',
        'oral_test',
        'formula_sheet',
        'important_questions',
      ]);
    } else if (preset === 'revision') {
      setSelectedOutputs(['flashcards', 'notes', 'formula_sheet', 'important_questions']);
    } else if (preset === 'exam') {
      setSelectedOutputs(['mcq_quiz', 'short_test', 'practice_exam', 'formula_sheet']);
    } else if (preset === 'oral') {
      setSelectedOutputs(['oral_test', 'flashcards', 'important_questions']);
    }
  };

  // Document Upload Processing
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedDocument(e.dataTransfer.files[0]);
    }
  };

  // GENERATE STUDY SUITE
  const handleGenerate = async () => {
    if (sourceMode === 'upload' && !extractedDocText.trim()) {
      showToast('Please upload a document or notes first.');
      setCurrentStep(2);
      return;
    }

    if (sourceMode === 'syllabus' && selectedBoardId === 'Custom' && !customChapterName.trim()) {
      showToast('Please specify a chapter title for your custom syllabus.');
      setCurrentStep(2);
      return;
    }

    setCurrentStep(4);
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgressStage('Reading syllabus learning objectives...');

    const stageTimer1 = setTimeout(() => {
      setGenerationProgressStage('Synthesizing structured notes & LaTeX formulas...');
    }, 1800);
    const stageTimer2 = setTimeout(() => {
      setGenerationProgressStage('Formulating viva oral test questions and rubrics...');
    }, 3800);
    const stageTimer3 = setTimeout(() => {
      setGenerationProgressStage('Generating practice exam and interactive flashcards...');
    }, 6000);

    try {
      const selectedChapters = currentSubject.chapters.filter(ch =>
        selectedChapterIds.includes(ch.id)
      );

      const allTopics = selectedChapters.flatMap(c => c.syllabusTopics);
      const chapterNames = selectedChapters.map(c => c.name);

      const payload = {
        sourceMode,
        board: selectedBoardId,
        curriculum: selectedCurriculum,
        grade: currentClass.name,
        subject: currentSubject.name,
        academicYear,
        chapter: selectedChapters[0]?.name || customChapterName || 'Selected Syllabus',
        chaptersSelected: chapterNames.length > 0 ? chapterNames : [customChapterName || 'Chapter'],
        syllabusTopics: allTopics,
        customTopicsOrNotes: customTopicsOrNotes.trim() || undefined,
        documentTitle: uploadedFile?.name || 'Uploaded Document',
        documentContent: extractedDocText,
        pageContextSummary: `${docPageCount} page(s) parsed`,
        selectedOutputs,
        examConfig: {
          durationMinutes: examDuration,
          difficulty: examDifficulty,
          totalMarks: 20,
        },
        studentProfile: {
          name: profile.name,
          grade: profile.grade,
          language: profile.preferredLanguage,
          style: profile.defaultStyle,
        },
      };

      const result = await api.generateStudyPack(payload);

      setCurrentPack(result);
      storage.saveGeneratedStudyPack(result);
      setSavedPacks(storage.getGeneratedStudyPacks());

      if (selectedOutputs.includes('oral_test')) {
        setActiveTab('oral_test');
      } else if (selectedOutputs.includes('flashcards')) {
        setActiveTab('flashcards');
      } else if (selectedOutputs.includes('notes')) {
        setActiveTab('notes');
      } else {
        setActiveTab(selectedOutputs[0] || 'flashcards');
      }

      setFlashcardIdx(0);
      setIsCardFlipped(false);
      setQuizAnswers({});
      setRevealedShortAnswers({});
      setOralQuestionIdx(0);
      setOralAnswerText('');
      setOralEvaluation(null);

      if (result.outputs.notes) {
        setEditedNotesContent(result.outputs.notes.markdownContent);
      }

      showToast('Exam Prep study suite generated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation failed. Please try again.';
      setGenerationError(msg);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsGenerating(false);
    }
  };

  // Keyboard navigation for flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentStep !== 4 || activeTab !== 'flashcards' || !currentPack?.outputs.flashcards) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsCardFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setFlashcardIdx(prev =>
          prev < (currentPack.outputs.flashcards?.length || 1) - 1 ? prev + 1 : prev
        );
        setIsCardFlipped(false);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setFlashcardIdx(prev => (prev > 0 ? prev - 1 : prev));
        setIsCardFlipped(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, activeTab, flashcardIdx, currentPack]);

  // Oral Test Speech Synthesis (TTS)
  const handleSpeakOralQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingQuestion) {
        window.speechSynthesis.cancel();
        setIsSpeakingQuestion(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      setIsSpeakingQuestion(true);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech is not supported in this browser.');
    }
  };

  // Oral Test Speech Recognition (STT)
  const handleToggleOralRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition not available. You can type your response below.');
      return;
    }

    if (isRecordingOral) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecordingOral(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = profile.preferredLanguage === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsRecordingOral(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setOralAnswerText(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecordingOral(false);
        showToast('Microphone error. Please type your response directly.');
      };

      recognition.onend = () => {
        setIsRecordingOral(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      showToast('Microphone permission denied. You can type your spoken answer.');
    }
  };

  // Submit Oral Answer for Assessment
  const handleSubmitOralEvaluation = async () => {
    const questions = currentPack?.outputs.oralTest;
    if (!questions || !questions[oralQuestionIdx] || !oralAnswerText.trim()) {
      showToast('Please speak or type your answer before submitting.');
      return;
    }

    const currentQ = questions[oralQuestionIdx];
    setIsEvaluatingOral(true);
    setOralEvaluation(null);

    try {
      const evalResult = await api.evaluateOralAnswer({
        question: currentQ.question,
        studentSpeech: oralAnswerText.trim(),
        modelAnswer: currentQ.modelAnswer,
        expectedKeywords: currentQ.expectedKeywords,
        grade: currentClass.name,
        subject: currentSubject.name,
      });

      setOralEvaluation(evalResult);
      showToast('Oral viva evaluation complete!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Oral evaluation failed.';
      showToast(msg);
    } finally {
      setIsEvaluatingOral(false);
    }
  };

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
      <div className="max-w-7xl mx-auto space-y-6 pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Core Feature · Exam Prep Suite</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Guided Exam Prep Flow
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Configure curriculum sources, select multiple chapters, choose targeted study tools, and generate grounded exam materials with oral viva simulation.
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

        {/* Guided 4-Step Stepper Progress Bar */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-2xl text-left transition-all ${
                currentStep === 1
                  ? 'bg-violet-600 text-white shadow-sm'
                  : currentStep > 1
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 1
                    ? 'bg-white text-violet-600'
                    : currentStep > 1
                    ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step 1</div>
                <div className="text-xs sm:text-sm font-bold truncate">Choose Source</div>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-2xl text-left transition-all ${
                currentStep === 2
                  ? 'bg-violet-600 text-white shadow-sm'
                  : currentStep > 2
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 2
                    ? 'bg-white text-violet-600'
                    : currentStep > 2
                    ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step 2</div>
                <div className="text-xs sm:text-sm font-bold truncate">Syllabus & Chapters</div>
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-2xl text-left transition-all ${
                currentStep === 3
                  ? 'bg-violet-600 text-white shadow-sm'
                  : currentStep > 3
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 3
                    ? 'bg-white text-violet-600'
                    : currentStep > 3
                    ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
              </div>
              <div className="text-center sm:text-left min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step 3</div>
                <div className="text-xs sm:text-sm font-bold truncate">Choose Tools</div>
              </div>
            </button>

            {/* Step 4 */}
            <button
              type="button"
              onClick={() => currentPack && setCurrentStep(4)}
              disabled={!currentPack && !isGenerating}
              className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 sm:p-3 rounded-2xl text-left transition-all ${
                currentStep === 4
                  ? 'bg-violet-600 text-white shadow-sm'
                  : currentPack
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  : 'text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  currentStep === 4
                    ? 'bg-white text-violet-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                4
              </div>
              <div className="text-center sm:text-left min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step 4</div>
                <div className="text-xs sm:text-sm font-bold truncate">Generate & Study</div>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 1: CHOOSE SOURCE */}
        {currentStep === 1 && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in fade-in">
            <div className="space-y-1">
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Step 1: Choose Your Knowledge Source</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Select whether you want to ground your exam prep in official NCERT curriculum textbooks or upload your personal notes and materials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Option A: NCERT Textbook */}
              <div
                onClick={() => setSourceMode('syllabus')}
                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
                  sourceMode === 'syllabus'
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-md ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-[#0d1527]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-[11px] font-bold">
                      Official Curriculum
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      NCERT / Board Curriculum Textbook
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Select official NCERT textbooks, standard state boards, Cambridge, or IB curricula with verified chapter definitions, formulas, and syllabus learning targets.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ CBSE / NCERT Class 9-12
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ ICSE / CISCE
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ Cambridge & IB
                    </span>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-200/60 dark:border-white/10 mt-6">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Browse verified syllabus chapters
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    sourceMode === 'syllabus' ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {sourceMode === 'syllabus' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Option B: Upload My Own Notes */}
              <div
                onClick={() => setSourceMode('upload')}
                className={`p-6 rounded-3xl cursor-pointer transition-all border-2 flex flex-col justify-between ${
                  sourceMode === 'upload'
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-md ring-2 ring-violet-500/20'
                    : 'border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-[#0d1527]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                      Custom Ingestion
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      Upload My Own Notes or Textbook Material
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Upload your school teacher's handouts, lecture PDFs, scanned textbook chapters, or mobile snapshots of handwritten notebook formulas.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ PDF Ingestion (up to 30 pages)
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ Vision OCR for Handwritten Notes
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-semibold">
                      ✓ Markdown / Plain Text
                    </span>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-200/60 dark:border-white/10 mt-6">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {uploadedFile ? uploadedFile.name : 'Attach document or image'}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    sourceMode === 'upload' ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {sourceMode === 'upload' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="clay-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Step 2: Syllabus & Chapters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SYLLABUS & CHAPTERS */}
        {currentStep === 2 && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Step 2: {sourceMode === 'syllabus' ? 'Select Board, Curriculum & Chapters' : 'Upload & Process Study Documents'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {sourceMode === 'syllabus'
                    ? 'Select your board, class, subject, and select multiple chapters using checkboxes.'
                    : 'Attach your PDF document, lecture slides, or photos to extract grounded text.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="clay-btn-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </div>
            </div>

            {/* SYLLABUS WORKFLOW */}
            {sourceMode === 'syllabus' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Board */}
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

                  {/* Class / Grade */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Class / Level
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

                  {/* Subject */}
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

                  {/* Curriculum / Edition */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Curriculum Edition
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
                </div>

                {/* Chapter Selection Section with Checkboxes & Select All */}
                {selectedBoardId !== 'Custom' ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                          Select Chapters ({selectedChapterIds.length} of {currentSubject.chapters.length} Selected)
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                          Multi-Select Supported
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={selectAllChapters}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-violet-200 dark:border-violet-900/50"
                        >
                          Select All ({currentSubject.chapters.length})
                        </button>
                        <button
                          type="button"
                          onClick={deselectAllChapters}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-white/10"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Chapter search filter */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={chapterSearchQuery}
                        onChange={e => setChapterSearchQuery(e.target.value)}
                        placeholder="Search chapters by keyword, theorem, or textbook reference..."
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>

                    {/* Chapter Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                      {filteredChapters.map((ch, idx) => {
                        const isSelected = selectedChapterIds.includes(ch.id);
                        return (
                          <div
                            key={ch.id}
                            onClick={() => toggleChapterSelection(ch.id)}
                            className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-violet-50/80 dark:bg-violet-950/30 border-violet-500/80 shadow-xs ring-1 ring-violet-500/20'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="pt-0.5">
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400 dark:text-slate-600 shrink-0" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {ch.name}
                                </h4>
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                  {ch.syllabusTopics.length} Topics
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                Ref: {ch.textbookRef}
                              </p>

                              {isSelected && (
                                <div className="pt-1.5 flex flex-wrap gap-1">
                                  {ch.syllabusTopics.slice(0, 2).map((t, i) => (
                                    <span
                                      key={i}
                                      className="px-1.5 py-0.5 rounded bg-violet-100/70 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 text-[10px] truncate max-w-[200px]"
                                    >
                                      ✓ {t}
                                    </span>
                                  ))}
                                  {ch.syllabusTopics.length > 2 && (
                                    <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold self-center">
                                      +{ch.syllabusTopics.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* NCERT Content Verification Notice */}
                    <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/30 p-3.5 flex items-start gap-2.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">
                          NCERT Textbook Grounding Guarantee:
                        </span>{' '}
                        <span className="text-slate-600 dark:text-slate-300">
                          The study materials will be strictly formulated from official syllabus learning objectives for the {selectedChapterIds.length} selected chapter(s). If specific textbook pages or problem sets are missing from your course, you can attach them via Upload Mode.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Custom Chapter / Subject Name
                    </label>
                    <input
                      type="text"
                      value={customChapterName}
                      onChange={e => setCustomChapterName(e.target.value)}
                      placeholder="e.g. Thermodynamics, Heat Transfer & Carnot Cycles"
                      className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                    />

                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>
                        Note: Because this is a custom curriculum, we strongly recommend attaching your course outline or syllabus notes below to ensure 100% factual accuracy.
                      </span>
                    </div>
                  </div>
                )}

                {/* Teacher's Focus or Specific Problem Areas */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Optional: Supplemental Teacher Notes, Focus Topics, or Weak Areas
                  </label>
                  <input
                    type="text"
                    value={customTopicsOrNotes}
                    onChange={e => setCustomTopicsOrNotes(e.target.value)}
                    placeholder="e.g. Focus on proofs of irrationality, quadratic formula derivations, speed-distance word problems"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            )}

            {/* UPLOAD WORKFLOW */}
            {sourceMode === 'upload' && (
              <div className="space-y-4">
                {!uploadedFile ? (
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20 scale-[0.99]'
                        : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 bg-slate-50/50 dark:bg-slate-900/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          processUploadedDocument(e.target.files[0]);
                        }
                      }}
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
                      className="hidden"
                    />

                    <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-3 shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>

                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Drag and drop your study document, or browse
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      Supports PDF documents, classroom notes photos (.png, .jpg), and Markdown / Text files up to 25MB.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                            {uploadedFile.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · {docPageCount} page(s)
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setExtractedDocText('');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isParsingDoc && (
                      <div className="flex items-center gap-2 text-xs text-violet-600 font-semibold py-2">
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Extracting document text and equations...</span>
                      </div>
                    )}

                    {docParseError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                        {docParseError}
                      </div>
                    )}

                    {extractedDocText && (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto font-mono text-[11px]">
                        {extractedDocText.slice(0, 1000)}
                        {extractedDocText.length > 1000 && '... [truncated preview]'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="clay-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Step 3: Choose Study Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE STUDY TOOLS */}
        {currentStep === 3 && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Step 3: Choose Your Study & Assessment Tools</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select one or more tools to generate in a single coordinated workflow from your selected source.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => applyPreset('all')}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-violet-600"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('oral')}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-violet-600"
                >
                  Oral Viva
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('exam')}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-violet-600"
                >
                  Exam Ready
                </button>
              </div>
            </div>

            {/* Study Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tool 1: Oral Test (Tarko AI Signature Viva Feature) */}
              <div
                onClick={() => toggleTool('oral_test')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('oral_test')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                      Interactive Viva
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Oral Test & Viva Examiner
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      AI examiner asks questions orally. Respond by speaking or typing and receive instant feedback on conceptual clarity and terminology.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Spoken Assessment</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('oral_test')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 2: Interactive Flashcards */}
              <div
                onClick={() => toggleTool('flashcards')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('flashcards')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      Spaced Repetition
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Interactive Flashcards
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Two-sided study cards with 3D flip animation, keyboard shortcuts, and direct saving to your Leitner review deck.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Active Recall</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('flashcards')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 3: Chapter Summary Notes */}
              <div
                onClick={() => toggleTool('notes')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('notes')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      Comprehensive
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Chapter Summary Notes
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Structured Markdown notes with theoretical principles, LaTeX formulas, practical applications, and common exam pitfalls.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Editable & Exportable</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('notes')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 4: Quiz with Explanations */}
              <div
                onClick={() => toggleTool('mcq_quiz')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('mcq_quiz')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      Immediate Feedback
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Quiz with Explanations
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Interactive multiple-choice questions with instant correct/incorrect visual feedback and thorough rationale for each option.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Objective Test</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('mcq_quiz')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 5: Practice Paper / Exam */}
              <div
                onClick={() => toggleTool('practice_exam')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('practice_exam')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                      Timed Simulation
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Practice Paper & Mock Test
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Structured exam paper with Section A (objective) and Section B (analytical), launchable in our timed test simulator.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Timed Mock Test</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('practice_exam')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 6: Formula Sheet & Cheat Sheet */}
              <div
                onClick={() => toggleTool('formula_sheet')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('formula_sheet')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                      Equation Sheet
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Formula Sheet & Quick Reference
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      LaTeX formulas with variable breakdown, SI units, and common student calculation traps to avoid in exams.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Quick Review</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('formula_sheet')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>

              {/* Tool 7: Key Definitions & High-Yield Questions */}
              <div
                onClick={() => toggleTool('important_questions')}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                  selectedOutputs.includes('important_questions')
                    ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      High Yield
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      Key Definitions & Essential Terms
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Formal textbook terminology and frequently repeated board exam questions with verified full-mark answers.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-500 font-semibold">Exam Glossaries</span>
                  <input
                    type="checkbox"
                    checked={selectedOutputs.includes('important_questions')}
                    readOnly
                    className="w-4 h-4 accent-violet-600"
                  />
                </div>
              </div>
            </div>

            {/* Exam Configuration Parameters */}
            {selectedOutputs.includes('practice_exam') && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>Practice Exam Configuration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Time Allowed (Minutes)
                    </label>
                    <select
                      value={examDuration}
                      onChange={e => setExamDuration(Number(e.target.value))}
                      className="w-full font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="15">15 Minutes (Rapid Sprint)</option>
                      <option value="30">30 Minutes (Standard Quiz)</option>
                      <option value="45">45 Minutes (Unit Test)</option>
                      <option value="60">60 Minutes (Periodical Exam)</option>
                      <option value="90">90 Minutes (Mid-Term Simulation)</option>
                      <option value="180">180 Minutes (Full Board Mock)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Exam Difficulty
                    </label>
                    <select
                      value={examDifficulty}
                      onChange={e => setExamDifficulty(e.target.value as any)}
                      className="w-full font-semibold px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="Easy">Standard Board Level (Foundation)</option>
                      <option value="Medium">Medium (Balanced Scoring)</option>
                      <option value="Hard">Challenging (Exemplar & Derivations)</option>
                      <option value="Competitive">Competitive (JEE / NEET / Olympiad)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="clay-btn-primary px-7 py-3 text-xs font-bold flex items-center gap-2 shadow-sm text-sm"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Generate Study Suite ({selectedOutputs.length} Tools)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GENERATE & INTERACTIVE STUDY WORKSPACE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Generation In-Progress State */}
            {isGenerating && (
              <div className="clay-card p-10 sm:p-16 rounded-3xl text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-3xl bg-violet-600/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto shadow-inner">
                  <RotateCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Synthesizing Grounded Exam Suite
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {generationProgressStage || 'Processing syllabus learning objectives...'}
                </p>
                <div className="w-48 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            )}

            {/* Generation Error State */}
            {generationError && !isGenerating && (
              <div className="clay-card p-8 rounded-3xl border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-red-900 dark:text-red-200">
                  Generation Interrupted
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">
                  {generationError}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="clay-btn-secondary px-4 py-2 text-xs font-semibold"
                  >
                    Adjust Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="clay-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Generation</span>
                  </button>
                </div>
              </div>
            )}

            {/* Generated Results & Interactive Study Hub */}
            {currentPack && !isGenerating && (
              <div className="space-y-6 animate-in fade-in">
                {/* Pack Top Bar & Grounding Confirmation */}
                <div className="clay-card p-5 sm:p-6 rounded-3xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Grounded Exam Suite</span>
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(currentPack.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        {currentPack.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {currentPack.sourceMetadata.groundingSummary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="clay-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Change Syllabus</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleGenerate}
                        className="clay-btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>

                  {/* Tool Tabs Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-white/5 pb-1 no-scrollbar">
                    {currentPack.outputs.oralTest && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('oral_test')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'oral_test'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>Oral Viva ({currentPack.outputs.oralTest.length})</span>
                      </button>
                    )}

                    {currentPack.outputs.flashcards && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('flashcards')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'flashcards'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                        <span>Flashcards ({currentPack.outputs.flashcards.length})</span>
                      </button>
                    )}

                    {currentPack.outputs.notes && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('notes')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'notes'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Summary Notes</span>
                      </button>
                    )}

                    {currentPack.outputs.mcqQuiz && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('mcq_quiz')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'mcq_quiz'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Quiz ({currentPack.outputs.mcqQuiz.length})</span>
                      </button>
                    )}

                    {currentPack.outputs.practiceExam && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('practice_exam')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'practice_exam'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>Practice Paper</span>
                      </button>
                    )}

                    {currentPack.outputs.formulaSheet && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('formula_sheet')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'formula_sheet'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                        <span>Formula Sheet ({currentPack.outputs.formulaSheet.formulas.length})</span>
                      </button>
                    )}

                    {currentPack.outputs.importantQuestions && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('important_questions')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                          activeTab === 'important_questions'
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Definitions ({currentPack.outputs.importantQuestions.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* TAB 1: INTERACTIVE ORAL TEST (TARKO AI SIGNATURE FEATURE) */}
                {activeTab === 'oral_test' && currentPack.outputs.oralTest && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold">
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            Oral Viva Voce Examination
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Question {oralQuestionIdx + 1} of {currentPack.outputs.oralTest.length} · Evaluated on Accuracy, Terminology & Articulation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (oralQuestionIdx > 0) {
                              setOralQuestionIdx(oralQuestionIdx - 1);
                              setOralAnswerText('');
                              setOralEvaluation(null);
                            }
                          }}
                          disabled={oralQuestionIdx === 0}
                          className="p-2 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold px-2">
                          {oralQuestionIdx + 1} / {currentPack.outputs.oralTest.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (oralQuestionIdx < currentPack.outputs.oralTest!.length - 1) {
                              setOralQuestionIdx(oralQuestionIdx + 1);
                              setOralAnswerText('');
                              setOralEvaluation(null);
                            }
                          }}
                          disabled={oralQuestionIdx === currentPack.outputs.oralTest.length - 1}
                          className="p-2 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-40"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Active Viva Question Card */}
                    {(() => {
                      const q = currentPack.outputs.oralTest[oralQuestionIdx];
                      if (!q) return null;

                      return (
                        <div className="space-y-5">
                          {/* Examiner Question Box */}
                          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-transparent border border-violet-500/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Senior Examiner Question:</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handleSpeakOralQuestion(q.question)}
                                className="px-2.5 py-1 rounded-lg bg-violet-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isSpeakingQuestion ? 'Stop Audio' : 'Listen Question'}</span>
                              </button>
                            </div>

                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                              "{q.question}"
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                Rubric Focus: {q.rubricHint}
                              </span>
                            </div>
                          </div>

                          {/* Student Spoken / Transcribed Answer Input */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Your Spoken Response:
                              </label>

                              <button
                                type="button"
                                onClick={handleToggleOralRecording}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                  isRecordingOral
                                    ? 'bg-red-600 text-white animate-pulse'
                                    : 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 hover:bg-violet-200'
                                }`}
                              >
                                {isRecordingOral ? (
                                  <>
                                    <MicOff className="w-3.5 h-3.5" />
                                    <span>Stop Recording</span>
                                  </>
                                ) : (
                                  <>
                                    <Mic className="w-3.5 h-3.5" />
                                    <span>Speak via Microphone</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              rows={4}
                              value={oralAnswerText}
                              onChange={e => setOralAnswerText(e.target.value)}
                              placeholder="Click 'Speak via Microphone' to speak your answer, or type your oral response directly here..."
                              className="w-full text-xs sm:text-sm p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                            />

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-400">
                                {oralAnswerText.length} characters entered
                              </span>

                              <button
                                type="button"
                                onClick={handleSubmitOralEvaluation}
                                disabled={isEvaluatingOral || !oralAnswerText.trim()}
                                className="clay-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                              >
                                {isEvaluatingOral ? (
                                  <>
                                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Assessing Viva Response...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Submit for Examiner Assessment</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Viva Assessment Output Card */}
                          {oralEvaluation && (
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in">
                              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                  <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                                    Viva Score: {oralEvaluation.scoreOutOf5} / 5.0
                                  </span>
                                </div>

                                <span className="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold">
                                  Accuracy: {oralEvaluation.accuracyScore}%
                                </span>
                              </div>

                              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                <strong className="text-violet-600 dark:text-violet-400">Examiner Feedback: </strong>
                                {oralEvaluation.verbalFeedback}
                              </div>

                              {/* Terminology chips */}
                              <div className="space-y-1.5 text-xs">
                                <div className="font-bold text-slate-700 dark:text-slate-300">
                                  Academic Terminology Used:
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {oralEvaluation.terminologyUsed.map((term, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-[11px]"
                                    >
                                      ✓ {term}
                                    </span>
                                  ))}
                                  {oralEvaluation.missedKeywords.map((term, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-medium text-[11px]"
                                    >
                                      Missing: {term}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Exemplar Phrasing */}
                              <div className="p-3.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/40 text-xs space-y-1">
                                <div className="font-bold text-violet-900 dark:text-violet-200 flex items-center gap-1.5">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Top-Scoring Scholar Exemplar Phrasing:</span>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 italic">
                                  "{oralEvaluation.exemplarPhrasing}"
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 2: INTERACTIVE FLASHCARDS */}
                {activeTab === 'flashcards' && currentPack.outputs.flashcards && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          Interactive 3D Flashcards
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Card {flashcardIdx + 1} of {currentPack.outputs.flashcards.length} · Tap card or press Space to flip
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveAllFlashcardsToDeck}
                          className="clay-btn-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                          <span>Save All to Leitner Deck</span>
                        </button>
                      </div>
                    </div>

                    {/* 3D Card Flipper */}
                    {(() => {
                      const card = currentPack.outputs.flashcards[flashcardIdx];
                      if (!card) return null;

                      return (
                        <div className="space-y-4">
                          <div
                            onClick={() => setIsCardFlipped(!isCardFlipped)}
                            className="w-full min-h-[260px] sm:min-h-[300px] cursor-pointer perspective-1000 select-none"
                          >
                            <div
                              className={`relative w-full h-full min-h-[260px] sm:min-h-[300px] rounded-3xl p-6 sm:p-8 border transition-all duration-500 transform-style-3d shadow-md flex flex-col justify-between ${
                                isCardFlipped
                                  ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-violet-500'
                                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs opacity-75">
                                <span className="font-bold uppercase tracking-wider">
                                  {isCardFlipped ? 'Answer & Explanation' : 'Question Prompt'}
                                </span>
                                <span>{card.topic}</span>
                              </div>

                              <div className="my-auto py-4 text-center">
                                <div className="text-base sm:text-lg font-bold leading-relaxed">
                                  {isCardFlipped ? (
                                    <MarkdownRenderer content={card.back} />
                                  ) : (
                                    <MarkdownRenderer content={card.front} />
                                  )}
                                </div>
                              </div>

                              <div className="text-center text-[11px] opacity-60">
                                Tap anywhere or press Space to flip
                              </div>
                            </div>
                          </div>

                          {/* Navigation Controls */}
                          <div className="flex items-center justify-between pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFlashcardIdx(prev => (prev > 0 ? prev - 1 : prev));
                                setIsCardFlipped(false);
                              }}
                              disabled={flashcardIdx === 0}
                              className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous</span>
                            </button>

                            <div className="text-xs font-bold text-slate-500">
                              {flashcardIdx + 1} / {currentPack.outputs.flashcards.length}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setFlashcardIdx(prev =>
                                  prev < currentPack.outputs.flashcards!.length - 1 ? prev + 1 : prev
                                );
                                setIsCardFlipped(false);
                              }}
                              disabled={flashcardIdx === currentPack.outputs.flashcards.length - 1}
                              className="clay-btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 3: CHAPTER SUMMARY NOTES */}
                {activeTab === 'notes' && currentPack.outputs.notes && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          {currentPack.outputs.notes.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {currentPack.outputs.notes.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingNotes(!isEditingNotes)}
                          className="clay-btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditingNotes ? 'View Preview' : 'Edit Notes'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveNotesToLibrary}
                          className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save to Notes</span>
                        </button>
                      </div>
                    </div>

                    {isEditingNotes ? (
                      <textarea
                        rows={16}
                        value={editedNotesContent}
                        onChange={e => setEditedNotesContent(e.target.value)}
                        className="w-full text-xs font-mono p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 outline-none"
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm">
                        <MarkdownRenderer content={editedNotesContent || currentPack.outputs.notes.markdownContent} />
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: MCQ QUIZ */}
                {activeTab === 'mcq_quiz' && currentPack.outputs.mcqQuiz && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        Practice Quiz with Instant Explanations
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentPack.outputs.mcqQuiz.length} Conceptual Questions · Select an option to verify your answer
                      </p>
                    </div>

                    <div className="space-y-6">
                      {currentPack.outputs.mcqQuiz.map((mcq, idx) => {
                        const selectedAnswer = quizAnswers[mcq.id];
                        const hasAnswered = selectedAnswer !== undefined;

                        return (
                          <div
                            key={mcq.id}
                            className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {mcq.question}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                              {mcq.options.map((opt, optIdx) => {
                                const isCorrect = optIdx === mcq.correctOptionIndex;
                                const isSelected = selectedAnswer === optIdx;

                                let btnClass =
                                  'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-violet-400';

                                if (hasAnswered) {
                                  if (isCorrect) {
                                    btnClass =
                                      'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold';
                                  } else if (isSelected) {
                                    btnClass =
                                      'bg-red-100 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-100 font-bold';
                                  } else {
                                    btnClass =
                                      'opacity-50 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900';
                                  }
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => {
                                      if (!hasAnswered) {
                                        setQuizAnswers(prev => ({ ...prev, [mcq.id]: optIdx }));
                                      }
                                    }}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
                                  >
                                    <span>{opt}</span>
                                    {hasAnswered && isCorrect && (
                                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {hasAnswered && (
                              <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in space-y-1">
                                <div className="font-bold text-violet-900 dark:text-violet-200">
                                  Explanation:
                                </div>
                                <p>{mcq.explanation}</p>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          {currentPack.outputs.practiceExam.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Total Marks: {currentPack.outputs.practiceExam.totalMarks} · Duration: {currentPack.outputs.practiceExam.durationMinutes} Minutes
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onStartMockTest(currentPack.outputs.practiceExam!)}
                          className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Timed Test Simulation</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentPack.outputs.practiceExam.sections.map((sec, secIdx) => (
                        <div key={secIdx} className="space-y-3">
                          <div className="font-display font-bold text-sm text-violet-600 dark:text-violet-400 border-b border-slate-200 dark:border-white/10 pb-1">
                            {sec.sectionName}
                          </div>

                          <div className="space-y-3">
                            {sec.questions.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2 text-xs"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    Q{qIdx + 1}. {q.question}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold shrink-0">
                                    {q.marks} Marks
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 6: FORMULA SHEET */}
                {activeTab === 'formula_sheet' && currentPack.outputs.formulaSheet && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {currentPack.outputs.formulaSheet.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentPack.outputs.formulaSheet.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentPack.outputs.formulaSheet.formulas.map((form, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                              {form.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(form.formula);
                                showToast('Copied formula to clipboard!');
                              }}
                              className="p-1 rounded text-slate-400 hover:text-violet-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/30 text-center text-sm font-semibold text-violet-900 dark:text-violet-200 overflow-x-auto">
                            <MarkdownRenderer content={`$$${form.formula}$$`} />
                          </div>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            <strong>Variables:</strong> {form.variables}
                          </div>

                          <div className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-900/30">
                            <strong>Exam Tip:</strong> {form.examTip}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 7: IMPORTANT DEFINITIONS */}
                {activeTab === 'important_questions' && currentPack.outputs.importantQuestions && (
                  <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="border-b border-slate-100 dark:border-white/5 pb-4">
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        Key Definitions & Recurring Board Questions
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Essential scientific definitions and high-yield scoring answers
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentPack.outputs.importantQuestions.map((item, i) => (
                        <div
                          key={i}
                          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {item.termOrQuestion}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-[10px] font-bold shrink-0">
                              {item.importance}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            <MarkdownRenderer content={item.explanationOrAnswer} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Saved Study Packs Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="clay-card w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Saved Study Packs ({savedPacks.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {savedPacks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No saved study packs yet.
                  </div>
                ) : (
                  savedPacks.map(pack => (
                    <div
                      key={pack.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {pack.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {new Date(pack.createdAt).toLocaleDateString()} · {pack.sourceMode === 'syllabus' ? 'NCERT / Syllabus' : 'Uploaded Material'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPack(pack);
                            setCurrentStep(4);
                            setShowHistoryModal(false);
                            showToast(`Loaded "${pack.title}"`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            storage.deleteGeneratedStudyPack(pack.id);
                            setSavedPacks(storage.getGeneratedStudyPacks());
                            if (currentPack?.id === pack.id) setCurrentPack(null);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
