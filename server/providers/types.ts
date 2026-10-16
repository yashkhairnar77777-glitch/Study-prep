export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ExplanationStyle = 'quick' | 'step_by_step' | 'exam_ready' | 'basics';

export interface ChatRequestPayload {
  messages: ChatMessage[];
  grade?: string;
  selectedClass?: string;
  collegeCourse?: string;
  competitiveExamCategory?: string;
  studentName?: string;
  primaryGoal?: string;
  subject?: string;
  language?: string;
  explanationDepth?: ExplanationStyle;
  preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
}

export interface ProviderResponse {
  content: string;
  providerUsed: 'groq' | 'openrouter' | 'gemini';
  modelUsed: string;
  fallbackOccurred?: boolean;
  fallbackDetails?: string;
}

export interface PhotoSolvePayload {
  imageBase64: string;
  mimeType: string;
  questionPrompt?: string;
  grade?: string;
  subject?: string;
  preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
}

export interface ExamQuestionGenerated {
  id: string;
  type: 'mcq' | 'short' | 'long' | 'true_false' | 'fill_in_the_blank';
  question: string;
  marks: number;
  options?: string[];
  correctAnswer: string;
  correctOptionIndex?: number;
  rubricOrCriteria?: string;
  stepByStepSolution: string;
  topic?: string;
}

export interface ExamPaperGenerated {
  title: string;
  grade: string;
  subject: string;
  difficulty: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: {
    sectionName: string;
    description: string;
    questions: ExamQuestionGenerated[];
  }[];
  isAiGeneratedPractice: true;
}

export interface ExamRequestPayload {
  grade: string;
  subject: string;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Competitive';
  numQuestions: number;
  questionTypes: ('mcq' | 'short' | 'long' | 'true_false' | 'fill_in_the_blank')[];
  totalMarks: number;
  durationMinutes: number;
  specialInstructions?: string;
}

export interface DocumentAnalysisPayload {
  documentTitle: string;
  documentContent: string;
  question: string;
  grade?: string;
  subject?: string;
}

export interface ProviderStatusInfo {
  groq: {
    configured: boolean;
    model: string;
    visionModel: string;
    hasVision: boolean;
  };
  openrouter: {
    configured: boolean;
    model: string;
    hasVision: boolean;
  };
  gemini: {
    configured: boolean;
    model: string;
    hasVision: boolean;
  };
  primary: 'groq' | 'openrouter' | 'gemini' | 'none';
  secondary: 'openrouter' | 'gemini' | 'none';
}

export type StudyGeneratorOutputType =
  | 'flashcards'
  | 'notes'
  | 'mcq_quiz'
  | 'short_test'
  | 'practice_exam'
  | 'important_questions';

export interface StudyGeneratorRequestPayload {
  sourceMode: 'syllabus' | 'upload';
  board?: string;
  curriculum?: string;
  grade?: string;
  subject?: string;
  academicYear?: string;
  chapter?: string;
  syllabusTopics?: string[];
  customTopicsOrNotes?: string;
  documentTitle?: string;
  documentContent?: string;
  pageContextSummary?: string;
  selectedOutputs: StudyGeneratorOutputType[];
  examConfig?: {
    durationMinutes: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Competitive';
    totalMarks?: number;
  };
  studentProfile?: {
    name?: string;
    grade?: string;
    language?: string;
    style?: string;
  };
  preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
}

export interface GeneratedFlashcardItem {
  front: string;
  back: string;
  topic: string;
}

export interface GeneratedChapterNotes {
  title: string;
  summary: string;
  markdownContent: string;
  keyFormulas?: string[];
  keyTakeaways?: string[];
}

export interface GeneratedMCQItem {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic?: string;
}

export interface GeneratedShortTestItem {
  id: string;
  question: string;
  maxMarks: number;
  modelAnswer: string;
  keyPoints: string[];
}

export interface GeneratedImportantItem {
  type: 'definition' | 'high_yield_question';
  termOrQuestion: string;
  explanationOrAnswer: string;
  importance: 'Essential' | 'Frequent Exam Topic' | 'Advanced';
}

export interface StudyGeneratorResponsePayload {
  id: string;
  title: string;
  sourceMode: 'syllabus' | 'upload';
  sourceMetadata: {
    board?: string;
    curriculum?: string;
    grade?: string;
    subject?: string;
    chapter?: string;
    documentTitle?: string;
    pageCount?: number;
    groundingSummary: string;
  };
  createdAt: number;
  outputs: {
    flashcards?: GeneratedFlashcardItem[];
    notes?: GeneratedChapterNotes;
    mcqQuiz?: GeneratedMCQItem[];
    shortTest?: GeneratedShortTestItem[];
    practiceExam?: ExamPaperGenerated;
    importantQuestions?: GeneratedImportantItem[];
  };
  providerUsed?: string;
  modelUsed?: string;
}

