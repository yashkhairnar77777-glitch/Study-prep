export type GradeLevel =
  | 'Class 1-5 (Primary)'
  | 'Class 6-8 (Middle School)'
  | 'Class 9-10 (Secondary)'
  | 'Class 11-12 (Higher Secondary)'
  | 'College / Undergraduate'
  | 'Competitive Exams (JEE / NEET / SAT / AP / GRE)'
  | 'Independent Learner';

export type SubjectCategory =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'English & Languages'
  | 'History & Social Studies'
  | 'Economics & Commerce'
  | 'General Science';

export type ExplanationStyle = 'quick' | 'step_by_step' | 'exam_ready' | 'basics';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  providerUsed?: string;
  modelUsed?: string;
  fallbackOccurred?: boolean;
  fallbackDetails?: string;
  styleUsed?: ExplanationStyle;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  grade: GradeLevel;
  subject: SubjectCategory;
  language: string;
  style: ExplanationStyle;
  createdAt: number;
  updatedAt: number;
}

export interface ExamQuestion {
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

export interface ExamPaper {
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
    questions: ExamQuestion[];
  }[];
  isAiGeneratedPractice: true;
}

export interface MockTestAttempt {
  id: string;
  examTitle: string;
  grade: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  accuracyPercentage: number;
  completedAt: number;
  timeSpentSeconds: number;
  questionResults: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    marksAwarded: number;
    maxMarks: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: SubjectCategory;
  topic: string;
  box: number; // 1 to 5 (Leitner system)
  nextReviewDate: number; // Timestamp
  reviewCount: number;
  easeScore: 'easy' | 'medium' | 'hard' | 'unreviewed';
}

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  subject: SubjectCategory;
  createdAt: number;
  tags: string[];
}

export type EducationCategory = 'school' | 'college' | 'university' | 'competitive' | 'other';

export type LearningGoal = 'exam_prep' | 'learn_anything' | 'both';

export interface UserProfile {
  userId?: string;
  email?: string;
  name: string;
  educationCategory: EducationCategory;
  grade: GradeLevel;
  selectedClass?: string;
  collegeCourse?: string;
  competitiveExamCategory?: string;
  targetExam?: string;
  primaryGoal: LearningGoal;
  favoriteSubjects: SubjectCategory[];
  primarySubject: SubjectCategory;
  preferredLanguage: string;
  defaultStyle: ExplanationStyle;
  dailyStudyTargetMinutes: number;
  theme: 'dark' | 'light';
  isOnboarded: boolean;
  authProvider: 'supabase' | 'local';
}

export interface StudyTask {
  id: string;
  title: string;
  subject: SubjectCategory;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  reminderEnabled?: boolean;
  reminderTime?: string; // e.g. "17:00" or ISO string
  notified?: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  flashcardReminders: boolean;
  taskReminders: boolean;
  reminderTime: string; // e.g. "09:00"
  frequencyMinutes: number; // e.g. 60
  sound: boolean;
}

export interface AppNotification {
  id: string;
  type: 'flashcard_due' | 'task_reminder' | 'study_streak' | 'system';
  title: string;
  body: string;
  targetView: AppView;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  meta?: Record<string, any>;
}

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'generator'
  | 'chat'
  | 'photo'
  | 'doc'
  | 'exam'
  | 'mock_test'
  | 'revision'
  | 'planner'
  | 'notes'
  | 'progress'
  | 'pricing';

export interface ProviderStatus {
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

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

export interface PomodoroSession {
  id: string;
  durationMinutes: number;
  mode: PomodoroMode;
  subject: SubjectCategory;
  topic?: string;
  completedAt: number;
  completed: boolean;
}

export interface StudyActivity {
  id: string;
  type: 'focus_session' | 'chat_question' | 'mock_test' | 'flashcard_review' | 'task_completed';
  title: string;
  subject?: SubjectCategory;
  durationMinutes?: number;
  timestamp: number;
  meta?: Record<string, any>;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayMinutes: number;
  todayGoalMinutes: number;
  history: Record<string, number>; // dateStr -> minutes
}

export type EducationBoard =
  | 'CBSE'
  | 'ICSE'
  | 'MSBSHSE'
  | 'Cambridge'
  | 'IB'
  | 'Custom';

export type StudyGeneratorOutputType =
  | 'flashcards'
  | 'notes'
  | 'mcq_quiz'
  | 'short_test'
  | 'practice_exam'
  | 'oral_test'
  | 'formula_sheet'
  | 'important_questions';

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

export interface OralTestItem {
  id: string;
  question: string;
  expectedKeywords: string[];
  modelAnswer: string;
  rubricHint: string;
  difficulty: 'Basic' | 'Moderate' | 'Advanced';
}

export interface OralTestEvaluation {
  scoreOutOf5: number;
  accuracyScore: number; // 0-100%
  terminologyUsed: string[];
  missedKeywords: string[];
  verbalFeedback: string;
  exemplarPhrasing: string;
}

export interface FormulaSheetItem {
  formula: string;
  name: string;
  variables: string;
  examTip: string;
}

export interface GeneratedFormulaSheet {
  title: string;
  summary: string;
  formulas: FormulaSheetItem[];
}

export interface GeneratedImportantItem {
  type: 'definition' | 'high_yield_question';
  termOrQuestion: string;
  explanationOrAnswer: string;
  importance: 'Essential' | 'Frequent Exam Topic' | 'Advanced';
}

export interface GeneratedStudyPack {
  id: string;
  title: string;
  sourceMode: 'syllabus' | 'upload';
  sourceMetadata: {
    board?: string;
    curriculum?: string;
    grade?: string;
    subject?: string;
    chapter?: string;
    chaptersSelected?: string[];
    academicYear?: string;
    documentTitle?: string;
    pageCount?: number;
    groundingSummary: string;
    isNcertVerified?: boolean;
  };
  createdAt: number;
  outputs: {
    flashcards?: GeneratedFlashcardItem[];
    notes?: GeneratedChapterNotes;
    mcqQuiz?: GeneratedMCQItem[];
    shortTest?: GeneratedShortTestItem[];
    practiceExam?: ExamPaper;
    oralTest?: OralTestItem[];
    formulaSheet?: GeneratedFormulaSheet;
    importantQuestions?: GeneratedImportantItem[];
  };
  providerUsed?: string;
  modelUsed?: string;
}

export interface StudyGeneratorPayload {
  sourceMode: 'syllabus' | 'upload';
  board?: string;
  curriculum?: string;
  grade?: string;
  subject?: string;
  academicYear?: string;
  chapter?: string;
  chaptersSelected?: string[];
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



