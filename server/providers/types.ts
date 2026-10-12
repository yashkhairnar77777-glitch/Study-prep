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
