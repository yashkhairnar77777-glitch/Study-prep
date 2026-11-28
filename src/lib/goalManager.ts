import {
  ActiveGoalKind,
  CompetitiveExamType,
  Conversation,
  EducationBoard,
  Flashcard,
  GoalConfig,
  GoalSnapshot,
  GradeLevel,
  MockTestAttempt,
  PreparationLevel,
  SavedNote,
  StudyTask,
  SubjectCategory,
  TopicStatus,
  UserProfile,
} from '../types';
import {
  SYLLABUS_REGISTRY,
  SyllabusBoardInfo,
  SyllabusClassInfo,
  SyllabusSubjectInfo,
} from './syllabusData';

export const SCHOOL_CLASSES = [
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
] as const;

export const SCHOOL_BOARDS: {
  id: EducationBoard;
  label: string;
  description: string;
}[] = [
  { id: 'CBSE', label: 'CBSE / NCERT', description: 'National NCERT curriculum (Classes 5–10)' },
  { id: 'ICSE', label: 'ICSE / CISCE', description: 'Council for the Indian School Certificate Examinations' },
  { id: 'MSBSHSE', label: 'State Board (Maharashtra / SSC)', description: 'Balbharati State Board & regional syllabus' },
  { id: 'Cambridge', label: 'Cambridge / IGCSE', description: 'Cambridge Assessment International Education' },
  { id: 'Custom', label: 'Custom Syllabus', description: 'Upload or customize your own syllabus topics' },
];

export const COMPETITIVE_EXAMS: {
  id: CompetitiveExamType;
  label: string;
  subtitle: string;
  defaultSubjects: SubjectCategory[];
}[] = [
  {
    id: 'UPSC',
    label: 'UPSC Civil Services',
    subtitle: 'Prelims & Mains · GS I–IV, CSAT, Current Affairs & Optional',
    defaultSubjects: ['UPSC General Studies', 'History & Social Studies', 'Economics & Commerce'],
  },
  {
    id: 'JEE',
    label: 'IIT-JEE (Main & Advanced)',
    subtitle: 'Physics, Chemistry & Mathematics problem-solving mastery',
    defaultSubjects: ['Physics', 'Chemistry', 'Mathematics'],
  },
  {
    id: 'NEET',
    label: 'NEET-UG (Medical)',
    subtitle: 'Biology (Botany & Zoology), Physics & Chemistry with NCERT core',
    defaultSubjects: ['Biology', 'Chemistry', 'Physics'],
  },
];

export const UPSC_OPTIONAL_SUBJECTS = [
  'Political Science & International Relations (PSIR)',
  'Sociology',
  'Geography',
  'Anthropology',
  'History',
  'Public Administration',
  'Economics',
  'Philosophy',
  'Mathematics',
  'Literature / Regional Language',
  'Undecided / Exploring',
];

export function resolveActiveGoalKind(profile: UserProfile): ActiveGoalKind {
  if (profile.competitiveExam) {
    if (profile.competitiveExam === 'UPSC') return 'upsc';
    if (profile.competitiveExam === 'JEE') return 'jee';
    if (profile.competitiveExam === 'NEET') return 'neet';
  }
  if (profile.educationCategory === 'competitive' || profile.board === 'UPSC' || profile.board === 'JEE' || profile.board === 'NEET') {
    const cat = `${profile.competitiveExamCategory || ''} ${profile.targetExam || ''} ${profile.board || ''}`.toUpperCase();
    if (cat.includes('UPSC') || cat.includes('IAS') || cat.includes('CIVIL')) return 'upsc';
    if (cat.includes('NEET') || cat.includes('MEDICAL') || cat.includes('AIIMS')) return 'neet';
    if (cat.includes('JEE') || cat.includes('ENGINEERING')) return 'jee';
  }
  return 'school';
}

export function deriveGoalId(config: Pick<GoalConfig, 'pathType' | 'board' | 'selectedClass' | 'academicYear' | 'competitiveExam' | 'targetExamYear'>): string {
  if (config.pathType === 'competitive') {
    const exam = config.competitiveExam || 'JEE';
    const year = config.targetExamYear || '2026';
    return `competitive:${exam}:${year}`;
  }
  const board = config.board || 'CBSE';
  const cls = (config.selectedClass || 'Class 10').replace(/\s+/g, '_');
  const yr = (config.academicYear || '2026–2027').replace(/\s+/g, '');
  return `school:${board}:${cls}:${yr}`;
}

export function buildGoalConfigFromProfile(profile: UserProfile): GoalConfig {
  const kind = resolveActiveGoalKind(profile);
  if (kind !== 'school') {
    const exam: CompetitiveExamType = kind === 'upsc' ? 'UPSC' : kind === 'neet' ? 'NEET' : 'JEE';
    const board: EducationBoard = exam;
    const year = profile.targetExamYear || '2026';
    const selectedSubjects =
      profile.selectedSyllabusSubjects && profile.selectedSyllabusSubjects.length > 0
        ? profile.selectedSyllabusSubjects
        : exam === 'UPSC'
        ? ['GS Paper I', 'GS Paper II', 'GS Paper III', 'GS Paper IV', 'UPSC CSAT']
        : exam === 'NEET'
        ? ['Biology (Botany & Zoology)', 'Physics for NEET', 'Chemistry for NEET']
        : ['Physics for JEE', 'Chemistry for JEE', 'Mathematics for JEE'];

    return {
      id: profile.activeGoalId || deriveGoalId({ pathType: 'competitive', board, academicYear: year, competitiveExam: exam, targetExamYear: year }),
      pathType: 'competitive',
      kind,
      label: `${exam === 'UPSC' ? 'UPSC CSE' : exam === 'JEE' ? 'IIT-JEE' : 'NEET-UG'} · ${year}`,
      board,
      academicYear: profile.academicYear || '2026–2027',
      medium: profile.preferredLanguage || 'English',
      selectedSubjects,
      primarySubject:
        profile.primarySubject ||
        (exam === 'UPSC' ? 'UPSC General Studies' : exam === 'NEET' ? 'Biology' : 'Physics'),
      competitiveExam: exam,
      targetExamYear: year,
      preparationLevel: profile.preparationLevel || 'intermediate',
      upscOptionalSubject: profile.upscOptionalSubject,
      upscFocusStage: profile.upscFocusStage || 'Prelims + Mains',
      jeeStream: profile.jeeStream || 'JEE Main & Advanced',
      neetNcertFocus: profile.neetNcertFocus ?? true,
      dailyStudyTargetMinutes: profile.dailyStudyTargetMinutes || 90,
    };
  }

  const board: EducationBoard = profile.board || 'CBSE';
  const selectedClass = profile.selectedClass || 'Class 10';
  const academicYear = profile.academicYear || '2026–2027';

  return {
    id: profile.activeGoalId || deriveGoalId({ pathType: 'school', board, selectedClass, academicYear }),
    pathType: 'school',
    kind: 'school',
    label: `${selectedClass} · ${board}`,
    board,
    selectedClass,
    academicYear,
    medium: profile.preferredLanguage || 'English',
    selectedSubjects: profile.selectedSyllabusSubjects || [],
    primarySubject: profile.primarySubject || 'Mathematics',
    dailyStudyTargetMinutes: profile.dailyStudyTargetMinutes || 45,
  };
}

export interface ResolvedSyllabusContext {
  boardInfo: SyllabusBoardInfo | undefined;
  classInfo: SyllabusClassInfo | undefined;
  allSubjectsInClass: SyllabusSubjectInfo[];
  activeSubjects: SyllabusSubjectInfo[];
  isAvailable: boolean;
  unavailableReason?: string;
  availableClassesForBoard: string[];
}

export function resolveSyllabusForGoal(config: GoalConfig): ResolvedSyllabusContext {
  const boardInfo = SYLLABUS_REGISTRY.find(b => b.id === config.board);
  if (!boardInfo) {
    return {
      boardInfo: undefined,
      classInfo: undefined,
      allSubjectsInClass: [],
      activeSubjects: [],
      isAvailable: false,
      unavailableReason: `No verified syllabus source is currently loaded for ${config.board}.`,
      availableClassesForBoard: [],
    };
  }

  const availableClassesForBoard = boardInfo.classes.map(c => c.name);

  let classInfo: SyllabusClassInfo | undefined;
  if (config.pathType === 'competitive') {
    classInfo = boardInfo.classes[0];
  } else {
    const targetClass = (config.selectedClass || 'Class 10').toLowerCase().trim();
    classInfo = boardInfo.classes.find(c => {
      const cName = c.name.toLowerCase();
      // Exact or leading class number match (avoid Class 1 matching Class 10)
      const numMatch = targetClass.match(/class\s*(\d+)/i);
      if (numMatch) {
        const regex = new RegExp(`\\bclass\\s*${numMatch[1]}\\b`, 'i');
        return regex.test(cName);
      }
      return cName.includes(targetClass);
    });
  }

  if (!classInfo) {
    return {
      boardInfo,
      classInfo: undefined,
      allSubjectsInClass: [],
      activeSubjects: [],
      isAvailable: false,
      unavailableReason: `Verified curriculum chapters for ${boardInfo.shortName} ${config.selectedClass || ''} are not yet available in the local syllabus repository.`,
      availableClassesForBoard,
    };
  }

  const allSubjectsInClass = classInfo.subjects || [];
  let activeSubjects = allSubjectsInClass;

  if (config.selectedSubjects && config.selectedSubjects.length > 0) {
    const wanted = new Set(config.selectedSubjects.map(s => s.toLowerCase()));
    const filtered = allSubjectsInClass.filter(
      s =>
        wanted.has(s.id.toLowerCase()) ||
        wanted.has(s.name.toLowerCase()) ||
        wanted.has(s.category.toLowerCase()) ||
        config.selectedSubjects.some(w => s.name.toLowerCase().includes(w.toLowerCase()))
    );
    if (filtered.length > 0) {
      activeSubjects = filtered;
    }
  }

  const totalChapters = activeSubjects.reduce((acc, s) => acc + (s.chapters?.length || 0), 0);

  if (totalChapters === 0) {
    return {
      boardInfo,
      classInfo,
      allSubjectsInClass,
      activeSubjects,
      isAvailable: false,
      unavailableReason: `No verified chapters are loaded for the selected subjects under ${boardInfo.shortName} ${classInfo.name}.`,
      availableClassesForBoard,
    };
  }

  return {
    boardInfo,
    classInfo,
    allSubjectsInClass,
    activeSubjects,
    isAvailable: true,
    availableClassesForBoard,
  };
}

export function applyGoalConfigToProfile(
  baseProfile: UserProfile,
  config: GoalConfig
): UserProfile {
  let resolvedGrade: GradeLevel = baseProfile.grade;
  if (config.pathType === 'competitive') {
    resolvedGrade = 'Competitive Exams (JEE / NEET / SAT / AP / GRE)';
  } else {
    const classNum = parseInt((config.selectedClass || 'Class 10').replace(/\D/g, ''), 10) || 10;
    if (classNum <= 5) resolvedGrade = 'Class 1-5 (Primary)';
    else if (classNum <= 8) resolvedGrade = 'Class 6-8 (Middle School)';
    else if (classNum <= 10) resolvedGrade = 'Class 9-10 (Secondary)';
    else resolvedGrade = 'Class 11-12 (Higher Secondary)';
  }

  const syllabusCtx = resolveSyllabusForGoal(config);
  const categoriesFromSyllabus = Array.from(
    new Set(syllabusCtx.activeSubjects.map(s => s.category))
  ) as SubjectCategory[];

  const defaultSubs: SubjectCategory[] =
    categoriesFromSyllabus.length > 0
      ? categoriesFromSyllabus
      : config.kind === 'upsc'
      ? ['UPSC General Studies', 'History & Social Studies', 'Economics & Commerce']
      : config.kind === 'neet'
      ? ['Biology', 'Chemistry', 'Physics']
      : config.kind === 'jee'
      ? ['Physics', 'Chemistry', 'Mathematics']
      : ['Mathematics', 'General Science', 'English & Languages'];

  return {
    ...baseProfile,
    activeGoalId: config.id,
    educationCategory: config.pathType === 'competitive' ? 'competitive' : 'school',
    grade: resolvedGrade,
    board: config.board,
    selectedClass: config.pathType === 'school' ? config.selectedClass : undefined,
    academicYear: config.academicYear,
    competitiveExam: config.competitiveExam,
    competitiveExamCategory:
      config.competitiveExam === 'UPSC'
        ? 'Civil Services (UPSC / State PSC)'
        : config.competitiveExam === 'NEET'
        ? 'Medical (NEET / AIIMS)'
        : config.competitiveExam === 'JEE'
        ? 'Engineering (JEE / BITSAT)'
        : undefined,
    targetExam: config.competitiveExam,
    targetExamYear: config.targetExamYear,
    preparationLevel: config.preparationLevel,
    upscOptionalSubject: config.upscOptionalSubject,
    upscFocusStage: config.upscFocusStage,
    jeeStream: config.jeeStream,
    neetNcertFocus: config.neetNcertFocus,
    selectedSyllabusSubjects: config.selectedSubjects,
    favoriteSubjects: defaultSubs,
    primarySubject: config.primarySubject || defaultSubs[0],
    preferredLanguage: config.medium || baseProfile.preferredLanguage || 'English',
    dailyStudyTargetMinutes: config.dailyStudyTargetMinutes || baseProfile.dailyStudyTargetMinutes || 45,
    primaryGoal: config.pathType === 'competitive' ? 'exam_prep' : baseProfile.primaryGoal || 'both',
    isOnboarded: true,
  };
}

export function createGoalWelcomeConversation(
  profile: UserProfile,
  config: GoalConfig
): Conversation {
  const introTitle =
    config.kind === 'upsc'
      ? `UPSC CSE ${config.targetExamYear || ''} · GS Strategy`
      : config.kind === 'jee'
      ? `IIT-JEE ${config.targetExamYear || ''} · PCM Workspace`
      : config.kind === 'neet'
      ? `NEET-UG ${config.targetExamYear || ''} · NCERT Core`
      : `${config.selectedClass || 'School'} (${config.board}) · ${config.primarySubject}`;

  const body =
    config.kind === 'upsc'
      ? `Welcome, Future IAS. Your workspace is tailored for **UPSC Civil Services (${config.targetExamYear || 'Target'})** at **${config.preparationLevel || 'intermediate'}** level.\n\n- **Focus**: ${config.upscFocusStage || 'Prelims + Mains'}\n- **Optional Subject**: ${config.upscOptionalSubject || 'Not selected yet'}\n- **Daily Target**: ${config.dailyStudyTargetMinutes} mins/day\n\nAsk any GS Paper I–IV concept question, request a Mains 150/250-word answer evaluation, or analyze current affairs.`
      : config.kind === 'jee'
      ? `Welcome, Future Engineer. Your workspace is configured for **${config.jeeStream || 'IIT-JEE Main & Advanced'} (${config.targetExamYear || 'Target'})**.\n\n- **Core Subjects**: Physics · Chemistry · Mathematics\n- **Preparation Level**: ${config.preparationLevel || 'intermediate'}\n- **Daily Target**: ${config.dailyStudyTargetMinutes} mins/day\n\nShare a challenging numerical, ask for multi-concept derivations, or run a formula revision sprint.`
      : config.kind === 'neet'
      ? `Welcome, Future Doctor. Your workspace is configured for **NEET-UG (${config.targetExamYear || 'Target'})**.\n\n- **Core Subjects**: Biology (Botany & Zoology) · Physics · Chemistry\n- **NCERT Line-by-Line Priority**: ${config.neetNcertFocus ? 'Enabled' : 'Standard'}\n- **Daily Target**: ${config.dailyStudyTargetMinutes} mins/day\n\nAsk for high-yield NCERT concept breakdowns, tricky assertion-reason questions, or diagram explanations.`
      : `Welcome, Future Achiever. Your workspace is configured for **${config.selectedClass || 'School'} (${config.board})** · Academic Year **${config.academicYear}** (${config.medium} medium).\n\nWhat chapter, concept, or practice question would you like to work on today?`;

  return {
    id: `convo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: introTitle,
    messages: [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: body,
        timestamp: Date.now(),
      },
    ],
    grade: profile.grade,
    subject: config.primarySubject,
    language: config.medium || 'English',
    style: profile.defaultStyle || 'step_by_step',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export interface GoalWorkspaceData {
  topicProgress: Record<string, TopicStatus>;
  notes: SavedNote[];
  flashcards: Flashcard[];
  mockTests: MockTestAttempt[];
  tasks: StudyTask[];
  conversations: Conversation[];
}

export function saveGoalIntoRegistry(
  savedGoals: Record<string, GoalSnapshot>,
  profile: UserProfile,
  data: GoalWorkspaceData
): Record<string, GoalSnapshot> {
  const config = buildGoalConfigFromProfile(profile);
  const existing = savedGoals[config.id];
  const now = Date.now();
  return {
    ...savedGoals,
    [config.id]: {
      config,
      topicProgress: data.topicProgress,
      notes: data.notes,
      flashcards: data.flashcards,
      mockTests: data.mockTests,
      tasks: data.tasks,
      conversations: data.conversations,
      createdAt: existing?.createdAt || now,
      lastActiveAt: now,
    },
  };
}

export function switchGoalWithPreservation(
  savedGoals: Record<string, GoalSnapshot>,
  currentProfile: UserProfile,
  currentData: GoalWorkspaceData,
  targetConfig: GoalConfig
): {
  updatedSavedGoals: Record<string, GoalSnapshot>;
  nextProfile: UserProfile;
  nextData: GoalWorkspaceData;
  wasRestored: boolean;
} {
  // 1. Preserve current active goal state first
  const withCurrentSaved = saveGoalIntoRegistry(savedGoals, currentProfile, currentData);

  // 2. Check if target goal already has saved progress
  const existingTarget = withCurrentSaved[targetConfig.id];
  const nextProfile = applyGoalConfigToProfile(currentProfile, targetConfig);

  if (existingTarget) {
    const restoredConfig: GoalConfig = {
      ...existingTarget.config,
      ...targetConfig,
    };
    const mergedProfile = applyGoalConfigToProfile(nextProfile, restoredConfig);
    const nextData: GoalWorkspaceData = {
      topicProgress: existingTarget.topicProgress || {},
      notes: existingTarget.notes || [],
      flashcards: existingTarget.flashcards || [],
      mockTests: existingTarget.mockTests || [],
      tasks: existingTarget.tasks || [],
      conversations:
        existingTarget.conversations && existingTarget.conversations.length > 0
          ? existingTarget.conversations
          : [createGoalWelcomeConversation(mergedProfile, restoredConfig)],
    };

    return {
      updatedSavedGoals: {
        ...withCurrentSaved,
        [targetConfig.id]: {
          ...existingTarget,
          config: restoredConfig,
          lastActiveAt: Date.now(),
        },
      },
      nextProfile: mergedProfile,
      nextData,
      wasRestored: true,
    };
  }

  // 3. New goal: initialize clean workspace without touching other saved goals
  const welcomeConvo = createGoalWelcomeConversation(nextProfile, targetConfig);
  const freshData: GoalWorkspaceData = {
    topicProgress: {},
    notes: [],
    flashcards: [],
    mockTests: [],
    tasks: [],
    conversations: [welcomeConvo],
  };

  return {
    updatedSavedGoals: {
      ...withCurrentSaved,
      [targetConfig.id]: {
        config: targetConfig,
        ...freshData,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      },
    },
    nextProfile,
    nextData: freshData,
    wasRestored: false,
  };
}
