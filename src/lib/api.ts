import {
  ChatMessage,
  GradeLevel,
  SubjectCategory,
  ExplanationStyle,
  ExamPaper,
  ProviderStatus,
} from '../types';

export interface ChatResponseData {
  content: string;
  providerUsed: 'groq' | 'openrouter' | 'gemini';
  modelUsed: string;
  fallbackOccurred?: boolean;
  fallbackDetails?: string;
}

export const api = {
  async getProviderStatus(): Promise<ProviderStatus | null> {
    try {
      const res = await fetch('/api/providers/status');
      if (!res.ok) return null;
      const json = await res.json();
      return json.status || null;
    } catch {
      return null;
    }
  },

  async sendChatMessage(params: {
    messages: { role: 'user' | 'assistant'; content: string }[];
    grade: GradeLevel;
    selectedClass?: string;
    collegeCourse?: string;
    competitiveExamCategory?: string;
    studentName?: string;
    primaryGoal?: string;
    subject: SubjectCategory;
    language: string;
    explanationDepth: ExplanationStyle;
    preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
  }): Promise<ChatResponseData> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Server responded with status ${res.status}`);
    }

    return json.data;
  },

  async solvePhotoQuestion(params: {
    imageBase64: string;
    mimeType: string;
    questionPrompt?: string;
    grade: GradeLevel;
    subject: SubjectCategory;
    preferredProvider?: 'auto' | 'groq' | 'openrouter' | 'gemini';
  }): Promise<ChatResponseData> {
    const res = await fetch('/api/solve-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `Photo solver failed with status ${res.status}`);
    }

    return json.data;
  },

  async generateExam(params: {
    grade: GradeLevel;
    subject: SubjectCategory;
    topics: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Competitive';
    numQuestions: number;
    questionTypes: ('mcq' | 'short' | 'long' | 'true_false' | 'fill_in_the_blank')[];
    totalMarks: number;
    durationMinutes: number;
    specialInstructions?: string;
  }): Promise<ExamPaper> {
    const res = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Exam paper generation failed.');
    }

    return json.data;
  },

  async evaluateSubjectiveAnswer(params: {
    question: string;
    studentAnswer: string;
    modelSolution: string;
    maxMarks: number;
    grade: GradeLevel;
  }): Promise<{
    awardedMarks: number;
    maxMarks: number;
    feedback: string;
    keyPointsHit: string[];
    missingPoints: string[];
    improvementTip: string;
  }> {
    const res = await fetch('/api/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to evaluate answer.');
    }

    return json.data;
  },

  async analyzeDocument(params: {
    documentTitle: string;
    documentContent: string;
    question: string;
    grade: GradeLevel;
    subject: SubjectCategory;
  }): Promise<ChatResponseData> {
    const res = await fetch('/api/analyze-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Document analysis failed.');
    }

    return json.data;
  },
};
