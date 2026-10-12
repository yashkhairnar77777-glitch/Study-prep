import {
  Conversation,
  Flashcard,
  SavedNote,
  MockTestAttempt,
  UserProfile,
  StudyTask,
} from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'oryqen_conversations_v1',
  FLASHCARDS: 'oryqen_flashcards_v1',
  NOTES: 'oryqen_notes_v1',
  MOCK_TESTS: 'oryqen_mock_tests_v1',
  PROFILE: 'oryqen_profile_v1',
  ACTIVE_CONVO_ID: 'oryqen_active_convo_id',
  AUTH_SESSION: 'oryqen_auth_session_v1',
  STUDY_TASKS: 'oryqen_study_tasks_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  educationCategory: 'school',
  grade: 'Class 9-10 (Secondary)',
  selectedClass: 'Class 10',
  primaryGoal: 'exam_prep',
  favoriteSubjects: ['Mathematics', 'Physics', 'Chemistry'],
  primarySubject: 'Mathematics',
  preferredLanguage: 'English',
  defaultStyle: 'step_by_step',
  dailyStudyTargetMinutes: 30,
  theme: 'dark',
  isOnboarded: false,
  authProvider: 'local',
};

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'What is Newton’s Second Law of Motion?',
    back: 'F = dp/dt (Force equals rate of change of momentum). For constant mass m, F = m·a, where force is in Newtons (N), mass in kg, and acceleration in m/s².',
    subject: 'Physics',
    topic: 'Classical Mechanics',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-2',
    front: 'State the Quadratic Formula and the condition for real distinct roots.',
    back: 'For ax² + bx + c = 0, x = (-b ± √(b² - 4ac)) / (2a). Real distinct roots exist if and only if the Discriminant Δ = b² - 4ac > 0.',
    subject: 'Mathematics',
    topic: 'Algebra',
    box: 2,
    nextReviewDate: Date.now() + 86400000,
    reviewCount: 1,
    easeScore: 'medium',
  },
  {
    id: 'fc-3',
    front: 'What is Le Chatelier’s Principle in chemical equilibrium?',
    back: 'If a chemical system at equilibrium experiences a change in concentration, temperature, or pressure, the equilibrium will shift in a direction that counteracts that change.',
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-4',
    front: 'What are the main stages of Cellular Respiration in aerobic organisms?',
    back: '1. Glycolysis (cytoplasm)\n2. Pyruvate Oxidation / Link Reaction (mitochondrial matrix)\n3. Krebs / Citric Acid Cycle (mitochondrial matrix)\n4. Oxidative Phosphorylation & Electron Transport Chain (inner mitochondrial membrane)',
    subject: 'Biology',
    topic: 'Cellular Energetics',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
];

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review Physics: Newton’s Laws & Momentum derivation',
    subject: 'Physics',
    dueDate: 'Today',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Solve 10 Calculus integration problems with step-by-step checks',
    subject: 'Mathematics',
    dueDate: 'Tomorrow',
    completed: true,
    priority: 'medium',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'task-3',
    title: 'Generate Mock Test on Chemical Equilibrium & Le Chatelier',
    subject: 'Chemistry',
    dueDate: 'This Week',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 14400000,
  },
];

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return DEFAULT_PROFILE;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_PROFILE, ...parsed };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage saveProfile failed', e);
    }
  },

  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveConversations(convos: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convos));
    } catch (e) {
      console.warn('Storage saveConversations failed', e);
    }
  },

  getActiveConvoId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
    } catch {
      return null;
    }
  },

  setActiveConvoId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
      }
    } catch (e) {
      console.warn('Storage setActiveConvoId failed', e);
    }
  },

  getFlashcards(): Flashcard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(DEFAULT_FLASHCARDS));
      return DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  },

  saveFlashcards(cards: Flashcard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
    } catch (e) {
      console.warn('Storage saveFlashcards failed', e);
    }
  },

  getNotes(): SavedNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveNotes(notes: SavedNote[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage saveNotes failed', e);
    }
  },

  getMockTests(): MockTestAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_TESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockTest(test: MockTestAttempt): void {
    try {
      const tests = this.getMockTests();
      tests.unshift(test);
      localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(tests));
    } catch (e) {
      console.warn('Storage saveMockTest failed', e);
    }
  },

  reviewCard(cardId: string, rating: 'easy' | 'medium' | 'hard'): Flashcard[] {
    const cards = this.getFlashcards();
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const intervals: Record<number, number> = {
      1: 1 * DAY_MS,
      2: 3 * DAY_MS,
      3: 7 * DAY_MS,
      4: 14 * DAY_MS,
      5: 30 * DAY_MS,
    };

    const updated = cards.map(c => {
      if (c.id !== cardId) return c;
      let newBox = c.box;
      if (rating === 'hard') {
        newBox = 1;
      } else if (rating === 'medium') {
        newBox = Math.min(5, Math.max(1, c.box));
      } else if (rating === 'easy') {
        newBox = Math.min(5, c.box + 1);
      }

      const nextInterval = intervals[newBox] || DAY_MS;
      return {
        ...c,
        box: newBox,
        reviewCount: c.reviewCount + 1,
        easeScore: rating,
        nextReviewDate: now + nextInterval,
      };
    });

    this.saveFlashcards(updated);
    return updated;
  },

  getTasks(): StudyTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_TASKS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: StudyTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage saveTasks failed', e);
    }
  },

  exportAllData(): string {
    const backup = {
      profile: this.getProfile(),
      conversations: this.getConversations(),
      flashcards: this.getFlashcards(),
      notes: this.getNotes(),
      mockTests: this.getMockTests(),
      tasks: this.getTasks(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (Array.isArray(parsed.conversations)) this.saveConversations(parsed.conversations);
      if (Array.isArray(parsed.flashcards)) this.saveFlashcards(parsed.flashcards);
      if (Array.isArray(parsed.notes)) this.saveNotes(parsed.notes);
      if (Array.isArray(parsed.tasks)) this.saveTasks(parsed.tasks);
      if (Array.isArray(parsed.mockTests)) {
        localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(parsed.mockTests));
      }
      return true;
    } catch (e) {
      console.error('Failed to parse import data', e);
      return false;
    }
  },

  logoutUser(): void {
    const profile = this.getProfile();
    profile.isOnboarded = false;
    this.saveProfile(profile);
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  },
};
