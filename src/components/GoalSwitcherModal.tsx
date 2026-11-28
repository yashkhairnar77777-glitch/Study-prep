import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  ArrowRightLeft,
  GraduationCap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  BookMarked,
  Award,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import {
  CompetitiveExamType,
  EducationBoard,
  GoalConfig,
  GoalSnapshot,
  LearningPathType,
  PreparationLevel,
  SubjectCategory,
  UserProfile,
} from '../types';
import {
  COMPETITIVE_EXAMS,
  SCHOOL_BOARDS,
  SCHOOL_CLASSES,
  UPSC_OPTIONAL_SUBJECTS,
  deriveGoalId,
  resolveSyllabusForGoal,
} from '../lib/goalManager';
import { computeSyllabusSummary } from '../lib/syllabusTracker';

interface GoalSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  activeGoalConfig: GoalConfig;
  savedGoals: Record<string, GoalSnapshot>;
  onConfirmSwitchGoal: (targetConfig: GoalConfig) => void;
}

const ACADEMIC_YEARS = ['2026–2027', '2025–2026', '2027–2028'];
const TARGET_EXAM_YEARS = ['2026', '2027', '2028', '2029'];
const MEDIUMS = ['English', 'Hindi', 'Hinglish', 'Marathi', 'Sanskrit'];

export const GoalSwitcherModal: React.FC<GoalSwitcherModalProps> = ({
  isOpen,
  onClose,
  profile,
  activeGoalConfig,
  savedGoals,
  onConfirmSwitchGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'new'>('saved');
  const [pendingConfirm, setPendingConfirm] = useState<{
    config: GoalConfig;
    isExistingSaved: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPendingConfirm(null);
      const hasOthers = Object.values(savedGoals).some(s => s.config.id !== activeGoalConfig.id);
      setActiveTab(hasOthers ? 'saved' : 'new');
    }
  }, [isOpen, savedGoals, activeGoalConfig.id]);

  // New Goal builder state
  const [pathType, setPathType] = useState<LearningPathType>(activeGoalConfig.pathType);
  const [selectedClass, setSelectedClass] = useState<string>(
    activeGoalConfig.selectedClass || 'Class 10'
  );
  const [board, setBoard] = useState<EducationBoard>(
    activeGoalConfig.pathType === 'school' ? activeGoalConfig.board : 'CBSE'
  );
  const [academicYear, setAcademicYear] = useState<string>(
    activeGoalConfig.academicYear || '2026–2027'
  );
  const [medium, setMedium] = useState<string>(activeGoalConfig.medium || 'English');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [competitiveExam, setCompetitiveExam] = useState<CompetitiveExamType>(
    activeGoalConfig.competitiveExam || 'UPSC'
  );
  const [targetExamYear, setTargetExamYear] = useState<string>(
    activeGoalConfig.targetExamYear || '2027'
  );
  const [preparationLevel, setPreparationLevel] = useState<PreparationLevel>(
    activeGoalConfig.preparationLevel || 'intermediate'
  );
  const [upscOptionalSubject, setUpscOptionalSubject] = useState<string>(
    activeGoalConfig.upscOptionalSubject || UPSC_OPTIONAL_SUBJECTS[0]
  );
  const [upscFocusStage, setUpscFocusStage] = useState<'Prelims + Mains' | 'Prelims Focus' | 'Mains & Essay'>(
    activeGoalConfig.upscFocusStage || 'Prelims + Mains'
  );
  const [jeeStream, setJeeStream] = useState<'JEE Main & Advanced' | 'JEE Main Only'>(
    activeGoalConfig.jeeStream || 'JEE Main & Advanced'
  );
  const [neetNcertFocus, setNeetNcertFocus] = useState<boolean>(
    activeGoalConfig.neetNcertFocus ?? true
  );

  const otherSavedGoals = useMemo(() => {
    return Object.values(savedGoals)
      .filter(s => s.config.id !== activeGoalConfig.id)
      .sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0));
  }, [savedGoals, activeGoalConfig.id]);

  const draftGoalConfig: GoalConfig = useMemo(() => {
    if (pathType === 'school') {
      const id = deriveGoalId({
        pathType: 'school',
        board,
        selectedClass,
        academicYear,
      });
      return {
        id,
        pathType: 'school',
        kind: 'school',
        label: `${selectedClass} · ${board}`,
        board,
        selectedClass,
        academicYear,
        medium,
        selectedSubjects,
        primarySubject: (profile.primarySubject || 'Mathematics') as SubjectCategory,
        dailyStudyTargetMinutes: profile.dailyStudyTargetMinutes || 45,
      };
    }

    const kind = competitiveExam === 'UPSC' ? 'upsc' : competitiveExam === 'NEET' ? 'neet' : 'jee';
    const id = deriveGoalId({
      pathType: 'competitive',
      board: competitiveExam,
      academicYear: targetExamYear,
      competitiveExam,
      targetExamYear,
    });
    return {
      id,
      pathType: 'competitive',
      kind,
      label: `${
        competitiveExam === 'UPSC' ? 'UPSC CSE' : competitiveExam === 'JEE' ? 'IIT-JEE' : 'NEET-UG'
      } · ${targetExamYear}`,
      board: competitiveExam,
      academicYear: targetExamYear,
      medium,
      selectedSubjects: [],
      primarySubject:
        competitiveExam === 'UPSC'
          ? 'UPSC General Studies'
          : competitiveExam === 'NEET'
          ? 'Biology'
          : 'Physics',
      competitiveExam,
      targetExamYear,
      preparationLevel,
      upscOptionalSubject: competitiveExam === 'UPSC' ? upscOptionalSubject : undefined,
      upscFocusStage: competitiveExam === 'UPSC' ? upscFocusStage : undefined,
      jeeStream: competitiveExam === 'JEE' ? jeeStream : undefined,
      neetNcertFocus: competitiveExam === 'NEET' ? neetNcertFocus : undefined,
      dailyStudyTargetMinutes: Math.max(60, profile.dailyStudyTargetMinutes || 90),
    };
  }, [
    pathType,
    board,
    selectedClass,
    academicYear,
    medium,
    selectedSubjects,
    competitiveExam,
    targetExamYear,
    preparationLevel,
    upscOptionalSubject,
    upscFocusStage,
    jeeStream,
    neetNcertFocus,
    profile.primarySubject,
    profile.dailyStudyTargetMinutes,
  ]);

  const draftSyllabusPreview = useMemo(
    () => resolveSyllabusForGoal(draftGoalConfig),
    [draftGoalConfig]
  );

  if (!isOpen) return null;

  const isSameAsActive = draftGoalConfig.id === activeGoalConfig.id;

  const toggleDraftSubject = (name: string) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-switcher-title"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#1e2a47] bg-white dark:bg-[#0d1323] shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1e2a47] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-violet-600/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h2 id="goal-switcher-title" className="text-base font-bold truncate">
                Learning Goal Workspace
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                One active goal at a time. Switching preserves every goal’s progress.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close goal switcher"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Active Goal Summary Banner */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#090e1a] border-b border-slate-200 dark:border-[#1e2a47] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Goal:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activeGoalConfig.label}
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {activeGoalConfig.medium} Medium
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
            Auto-saved locally{profile.userId ? ' & Cloud' : ''}
          </span>
        </div>

        {/* Explicit Confirmation Banner when a switch target is chosen */}
        {pendingConfirm && (
          <div className="px-6 py-4 bg-amber-50 dark:bg-amber-950/35 border-b border-amber-200 dark:border-amber-800/60 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Switch active learning goal to {pendingConfirm.config.label}?
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your current workspace (<strong>{activeGoalConfig.label}</strong>) including all
                  completed topics, notes, flashcards, mock tests, and chat history will be saved safely.
                  {pendingConfirm.isExistingSaved
                    ? ' Your previously saved progress for this goal will be restored immediately.'
                    : ' A tailored workspace will be initialized for this new goal.'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
              >
                Keep Current Goal
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = pendingConfirm.config;
                  setPendingConfirm(null);
                  onConfirmSwitchGoal(target);
                }}
                className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Confirm & Switch Goal
              </button>
            </div>
          </div>
        )}

        {/* Mode Tabs */}
        <div className="px-6 pt-4 flex items-center gap-2 border-b border-slate-200 dark:border-[#1e2a47]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('saved');
              setPendingConfirm(null);
            }}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Saved Goals ({otherSavedGoals.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setPendingConfirm(null);
            }}
            className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'new'
                ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Switch to New Goal
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'saved' ? (
            otherSavedGoals.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#243252] p-8 text-center space-y-3">
                <Sparkles className="w-7 h-7 text-violet-500 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">No other saved goals yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    When you switch to a new learning path or exam, your current{' '}
                    <strong>{activeGoalConfig.label}</strong> progress is preserved here so you can
                    return anytime.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors"
                >
                  Configure Another Goal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {otherSavedGoals.map(snapshot => {
                  const summary = computeSyllabusSummary(
                    snapshot.config,
                    snapshot.topicProgress || {},
                    snapshot.notes || [],
                    snapshot.flashcards || [],
                    snapshot.mockTests || []
                  );

                  return (
                    <div
                      key={snapshot.config.id}
                      className="rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50/70 dark:bg-[#11192e] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {snapshot.config.label}
                          </span>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {snapshot.config.pathType === 'competitive'
                              ? 'Competitive Prep'
                              : `${snapshot.config.academicYear}`}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {summary.isAvailable && (
                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                              {summary.completionPercentage}% syllabus ({summary.completedTopics}/
                              {summary.totalTopics} topics)
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <BookMarked className="w-3 h-3" />
                            {snapshot.notes?.length || 0} notes
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {snapshot.flashcards?.length || 0} cards
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {snapshot.mockTests?.length || 0} mocks
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last active {new Date(snapshot.lastActiveAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPendingConfirm({ config: snapshot.config, isExistingSaved: true })
                        }
                        className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-700 text-white text-xs font-bold shrink-0 transition-colors"
                      >
                        Restore & Switch
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="space-y-5">
              {/* Path Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPathType('school');
                    setSelectedSubjects([]);
                    setPendingConfirm(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    pathType === 'school'
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/30'
                      : 'border-slate-200 dark:border-[#1e2a47] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <GraduationCap
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      pathType === 'school' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">School Learning</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Classes 5–10 · CBSE / ICSE / State / Cambridge
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPathType('competitive');
                    setSelectedSubjects([]);
                    setPendingConfirm(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    pathType === 'competitive'
                      ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/30'
                      : 'border-slate-200 dark:border-[#1e2a47] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Target
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      pathType === 'competitive'
                        ? 'text-violet-600 dark:text-violet-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">Competitive Exams</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      UPSC CSE · IIT-JEE · NEET-UG
                    </div>
                  </div>
                </button>
              </div>

              {pathType === 'school' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Class</label>
                      <select
                        value={selectedClass}
                        onChange={e => {
                          setSelectedClass(e.target.value);
                          setSelectedSubjects([]);
                        }}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
                      >
                        {SCHOOL_CLASSES.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Education Board</label>
                      <select
                        value={board}
                        onChange={e => {
                          setBoard(e.target.value as EducationBoard);
                          setSelectedSubjects([]);
                        }}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
                      >
                        {SCHOOL_BOARDS.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Academic Year</label>
                      <select
                        value={academicYear}
                        onChange={e => setAcademicYear(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
                      >
                        {ACADEMIC_YEARS.map(y => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Language / Medium</label>
                      <select
                        value={medium}
                        onChange={e => setMedium(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
                      >
                        {MEDIUMS.map(m => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Verified Subjects Picker if available */}
                  {draftSyllabusPreview.isAvailable && draftSyllabusPreview.allSubjectsInClass.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">
                          Subjects ({draftSyllabusPreview.allSubjectsInClass.length} verified)
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {selectedSubjects.length === 0
                            ? 'All subjects included'
                            : `${selectedSubjects.length} selected`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {draftSyllabusPreview.allSubjectsInClass.map(sub => {
                          const isSelected = selectedSubjects.includes(sub.name);
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => toggleDraftSubject(sub.name)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-violet-600 text-white border-violet-600'
                                  : 'bg-slate-50 dark:bg-[#090e1a] border-slate-200 dark:border-[#1e2a47] text-slate-700 dark:text-slate-300 hover:border-violet-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              <span>{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {COMPETITIVE_EXAMS.map(exam => (
                      <button
                        key={exam.id}
                        type="button"
                        onClick={() => setCompetitiveExam(exam.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          competitiveExam === exam.id
                            ? 'border-violet-600 bg-violet-50/70 dark:bg-violet-950/30'
                            : 'border-slate-200 dark:border-[#1e2a47] hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{exam.id}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {exam.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Target Year</label>
                      <select
                        value={targetExamYear}
                        onChange={e => setTargetExamYear(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none"
                      >
                        {TARGET_EXAM_YEARS.map(y => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Preparation Level</label>
                      <select
                        value={preparationLevel}
                        onChange={e => setPreparationLevel(e.target.value as PreparationLevel)}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none"
                      >
                        <option value="beginner">Beginner (Building Foundations)</option>
                        <option value="intermediate">Intermediate (Syllabus & Practice)</option>
                        <option value="advanced">Advanced (Mocks & Revision)</option>
                      </select>
                    </div>
                  </div>

                  {competitiveExam === 'UPSC' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">UPSC Stage Focus</label>
                        <select
                          value={upscFocusStage}
                          onChange={e => setUpscFocusStage(e.target.value as 'Prelims + Mains' | 'Prelims Focus' | 'Mains & Essay')}
                          className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none"
                        >
                          <option value="Prelims + Mains">Prelims + Mains Integrated</option>
                          <option value="Prelims Focus">Prelims Intensive</option>
                          <option value="Mains & Essay">Mains Answer Writing & Essay</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">Optional Subject</label>
                        <select
                          value={upscOptionalSubject}
                          onChange={e => setUpscOptionalSubject(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none"
                        >
                          {UPSC_OPTIONAL_SUBJECTS.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {competitiveExam === 'JEE' && (
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">JEE Track</label>
                      <select
                        value={jeeStream}
                        onChange={e => setJeeStream(e.target.value as 'JEE Main & Advanced' | 'JEE Main Only')}
                        className="w-full rounded-xl border border-slate-200 dark:border-[#1e2a47] bg-slate-50 dark:bg-[#090e1a] px-3 py-2 text-xs outline-none"
                      >
                        <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                        <option value="JEE Main Only">JEE Main Focus</option>
                      </select>
                    </div>
                  )}

                  {competitiveExam === 'NEET' && (
                    <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={neetNcertFocus}
                        onChange={e => setNeetNcertFocus(e.target.checked)}
                        className="rounded border-slate-300 accent-violet-600"
                      />
                      <span>Prioritize NCERT Biology & Chemistry line-by-line mastery</span>
                    </label>
                  )}
                </div>
              )}

              {/* Honest Syllabus Availability Status */}
              {draftSyllabusPreview.isAvailable ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Verified syllabus loaded:{' '}
                      <strong>{draftSyllabusPreview.activeSubjects.length} subjects</strong> ·{' '}
                      <strong>
                        {draftSyllabusPreview.activeSubjects.reduce(
                          (a, s) => a + s.chapters.length,
                          0
                        )}{' '}
                        chapters
                      </strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Syllabus Data Unavailable for This Selection</span>
                  </div>
                  <p className="leading-relaxed">{draftSyllabusPreview.unavailableReason}</p>
                  {draftSyllabusPreview.availableClassesForBoard.length > 0 && (
                    <p className="text-[11px]">
                      Available in repository for {board}:{' '}
                      {draftSyllabusPreview.availableClassesForBoard.join(', ')}. You can still
                      use AI Study Generator & PDF Analysis in Custom mode.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-[#1e2a47]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSameAsActive}
                  onClick={() =>
                    setPendingConfirm({
                      config: draftGoalConfig,
                      isExistingSaved: Boolean(savedGoals[draftGoalConfig.id]),
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
                >
                  {isSameAsActive ? 'Currently Active' : `Switch to ${draftGoalConfig.label}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
