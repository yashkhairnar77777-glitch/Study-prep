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
}

export type AppView =
  | 'landing'
  | 'dashboard'
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

