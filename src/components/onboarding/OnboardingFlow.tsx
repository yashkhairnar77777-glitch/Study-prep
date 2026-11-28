import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Compass,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Copy,
  Tag,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import {
  UserProfile,
  EducationBoard,
  LearningPathType,
  CompetitiveExamType,
  PreparationLevel,
  SubscriptionTier,
  BillingDuration,
  PlanConfig,
  MerchantPaymentConfig,
  GoalConfig,
  SubjectCategory,
} from '../../types';
import {
  signInWithGoogle as firebaseGoogleSignIn,
  signInWithEmail,
  signUpWithEmail,
  sendResetPasswordEmail,
  loadFromFirestore,
  syncToFirestore,
} from '../../lib/firebaseAuth';
import { subscriptionService } from '../../lib/subscriptionService';
import {
  SCHOOL_CLASSES,
  SCHOOL_BOARDS,
  COMPETITIVE_EXAMS,
  UPSC_OPTIONAL_SUBJECTS,
  deriveGoalId,
  resolveSyllabusForGoal,
  applyGoalConfigToProfile,
} from '../../lib/goalManager';
import { OryqenLogo } from '../OryqenLogo';

interface OnboardingFlowProps {
  onComplete: (completedProfile: UserProfile, goalConfig: GoalConfig) => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  // Step 1: Select Learning Path (+ quick Sign In)
  // Step 2: Configure Path & Load Syllabus
  // Step 3: Profile, Account & Optional Study Plan
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('oryqen_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('oryqen_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Path & Goal Configuration State
  const [pathType, setPathType] = useState<LearningPathType>('school');

  // School Config
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [selectedBoard, setSelectedBoard] = useState<EducationBoard>('CBSE');
  const [academicYear, setAcademicYear] = useState<string>('2026–2027');
  const [medium, setMedium] = useState<string>('English');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Competitive Config
  const [competitiveExam, setCompetitiveExam] = useState<CompetitiveExamType>('UPSC');
  const [targetExamYear, setTargetExamYear] = useState<string>('2026');
  const [preparationLevel, setPreparationLevel] = useState<PreparationLevel>('intermediate');
  const [upscOptionalSubject, setUpscOptionalSubject] = useState<string>(UPSC_OPTIONAL_SUBJECTS[0]);
  const [upscFocusStage, setUpscFocusStage] = useState<'Prelims + Mains' | 'Prelims Focus' | 'Mains & Essay'>('Prelims + Mains');
  const [jeeStream, setJeeStream] = useState<'JEE Main & Advanced' | 'JEE Main Only'>('JEE Main & Advanced');
  const [neetNcertFocus, setNeetNcertFocus] = useState<boolean>(true);

  const [dailyTarget, setDailyTarget] = useState<number>(60);
  const [name, setName] = useState<string>('');

  // Auth State (Preserved Firebase Google & Email/Password Auth)
  const [showEmailLoginDrawer, setShowEmailLoginDrawer] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState<string | undefined>(undefined);
  const [authUserId, setAuthUserId] = useState<string | undefined>(undefined);
  const [authProviderType, setAuthProviderType] = useState<'google' | 'supabase' | 'local'>('local');

  // Preserved Subscription & UPI Payment Drawer (Optional on Step 3)
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free');
  const [billingCycle, setBillingCycle] = useState<BillingDuration>('monthly');
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [merchantConfig, setMerchantConfig] = useState<Partial<MerchantPaymentConfig> | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSubmittedMsg, setPaymentSubmittedMsg] = useState<string | null>(null);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponStatus, setCouponStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  useEffect(() => {
    subscriptionService
      .getPlans()
      .then(res => {
        if (res.plans) setPlans(res.plans);
        if (res.merchantConfig) setMerchantConfig(res.merchantConfig);
      })
      .catch(() => {});
  }, []);

  // Build draft GoalConfig to preview real syllabus availability in real time
  const draftGoalConfig: GoalConfig = useMemo(() => {
    const board: EducationBoard = pathType === 'competitive' ? competitiveExam : selectedBoard;
    const kind =
      pathType === 'competitive'
        ? competitiveExam === 'UPSC'
          ? 'upsc'
          : competitiveExam === 'NEET'
          ? 'neet'
          : 'jee'
        : 'school';

    const label =
      pathType === 'competitive'
        ? `${competitiveExam === 'UPSC' ? 'UPSC CSE' : competitiveExam === 'JEE' ? 'IIT-JEE' : 'NEET-UG'} · ${targetExamYear}`
        : `${selectedClass} · ${selectedBoard}`;

    const primarySubject: SubjectCategory =
      pathType === 'competitive'
        ? competitiveExam === 'UPSC'
          ? 'UPSC General Studies'
          : competitiveExam === 'NEET'
          ? 'Biology'
          : 'Physics'
        : 'Mathematics';

    return {
      id: deriveGoalId({
        pathType,
        board,
        selectedClass: pathType === 'school' ? selectedClass : undefined,
        academicYear,
        competitiveExam: pathType === 'competitive' ? competitiveExam : undefined,
        targetExamYear: pathType === 'competitive' ? targetExamYear : undefined,
      }),
      pathType,
      kind,
      label,
      board,
      selectedClass: pathType === 'school' ? selectedClass : undefined,
      academicYear,
      medium,
      selectedSubjects: selectedSubjectIds,
      primarySubject,
      competitiveExam: pathType === 'competitive' ? competitiveExam : undefined,
      targetExamYear: pathType === 'competitive' ? targetExamYear : undefined,
      preparationLevel: pathType === 'competitive' ? preparationLevel : undefined,
      upscOptionalSubject: pathType === 'competitive' && competitiveExam === 'UPSC' ? upscOptionalSubject : undefined,
      upscFocusStage: pathType === 'competitive' && competitiveExam === 'UPSC' ? upscFocusStage : undefined,
      jeeStream: pathType === 'competitive' && competitiveExam === 'JEE' ? jeeStream : undefined,
      neetNcertFocus: pathType === 'competitive' && competitiveExam === 'NEET' ? neetNcertFocus : undefined,
      dailyStudyTargetMinutes: dailyTarget,
    };
  }, [
    pathType,
    selectedClass,
    selectedBoard,
    academicYear,
    medium,
    selectedSubjectIds,
    competitiveExam,
    targetExamYear,
    preparationLevel,
    upscOptionalSubject,
    upscFocusStage,
    jeeStream,
    neetNcertFocus,
    dailyTarget,
  ]);

  const syllabusPreview = useMemo(() => resolveSyllabusForGoal(draftGoalConfig), [draftGoalConfig]);

  // Reset selected subjects when board/class/exam changes so all available subjects start selected by default
  useEffect(() => {
    if (syllabusPreview.allSubjectsInClass.length > 0) {
      setSelectedSubjectIds(syllabusPreview.allSubjectsInClass.map(s => s.id));
    } else {
      setSelectedSubjectIds([]);
    }
  }, [pathType, selectedClass, selectedBoard, competitiveExam]);

  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjectIds(prev => {
      if (prev.includes(subjectId)) {
        if (prev.length <= 1) return prev; // keep at least 1 selected when available
        return prev.filter(id => id !== subjectId);
      }
      return [...prev, subjectId];
    });
  };

  const totalChaptersLoaded = syllabusPreview.activeSubjects.reduce(
    (sum, s) => sum + (s.chapters?.length || 0),
    0
  );
  const totalTopicsLoaded = syllabusPreview.activeSubjects.reduce(
    (sum, s) =>
      sum + s.chapters.reduce((cSum, ch) => cSum + Math.max(1, ch.syllabusTopics?.length || 0), 0),
    0
  );

  // Real Google Sign-In via Firebase Auth
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const user = await firebaseGoogleSignIn();
      if (user) {
        const studentName = user.displayName || user.email?.split('@')[0] || 'Scholar';
        setName(studentName);
        setAuthEmail(user.email || '');
        setAuthUserId(user.uid);
        setGoogleAvatar(user.photoURL || undefined);
        setAuthProviderType('google');
        setAuthSuccessMsg(`Connected Google account: ${user.email}`);

        // Restore existing onboarded profile from Firestore if present
        const cloudData = await loadFromFirestore(user.uid);
        if (cloudData && cloudData.profile && cloudData.profile.isOnboarded) {
          const restoredProfile: UserProfile = {
            ...(cloudData.profile as UserProfile),
            userId: user.uid,
            email: user.email || undefined,
            name: studentName,
            avatarUrl: user.photoURL || cloudData.profile.avatarUrl,
            authProvider: 'google',
            isOnboarded: true,
          };
          const { buildGoalConfigFromProfile } = await import('../../lib/goalManager');
          onComplete(restoredProfile, buildGoalConfigFromProfile(restoredProfile));
          return;
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (isForgotMode) {
      setAuthLoading(true);
      try {
        await sendResetPasswordEmail(authEmail);
        setAuthSuccessMsg(`Password reset instructions sent to ${authEmail.trim()}.`);
      } catch (err: any) {
        setAuthError(err.message || 'Failed to send reset email.');
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const user = await signUpWithEmail(authEmail, authPassword, name || 'Scholar');
        setAuthUserId(user.uid);
        setAuthProviderType('local');
        setAuthSuccessMsg(`Account created for ${user.email}.`);
        setShowEmailLoginDrawer(false);
      } else {
        const user = await signInWithEmail(authEmail, authPassword);
        setAuthUserId(user.uid);
        setAuthProviderType('local');

        const cloudData = await loadFromFirestore(user.uid);
        if (cloudData && cloudData.profile && cloudData.profile.isOnboarded) {
          const restoredProfile: UserProfile = {
            ...(cloudData.profile as UserProfile),
            userId: user.uid,
            email: user.email || undefined,
            name: user.displayName || cloudData.profile.name || 'Scholar',
            authProvider: 'local',
            isOnboarded: true,
          };
          const { buildGoalConfigFromProfile } = await import('../../lib/goalManager');
          onComplete(restoredProfile, buildGoalConfigFromProfile(restoredProfile));
          return;
        }
        setAuthSuccessMsg(`Signed in as ${user.email}.`);
        setShowEmailLoginDrawer(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Payment / Coupon helpers
  const merchantUpi = merchantConfig?.merchantUpiId || '9922321046@mbk';
  const merchantName = merchantConfig?.merchantName || 'Archana Prakash Khairnar';
  const verifiedQrImage =
    merchantConfig?.qrImageUrl || '/assets/aistudio/Screenshot_20261104_205858_MobiKwik_885c48cb.jpg';

  const plusPlan = plans.find(p => p.id === 'plus');
  const proPlan = plans.find(p => p.id === 'pro');
  const planAmount =
    selectedTier === 'pro'
      ? billingCycle === 'yearly'
        ? proPlan?.yearlyPrice ?? 1999
        : proPlan?.monthlyPrice ?? 199
      : selectedTier === 'plus'
      ? billingCycle === 'yearly'
        ? plusPlan?.yearlyPrice ?? 999
        : plusPlan?.monthlyPrice ?? 99
      : 0;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponValidating(true);
    setCouponStatus(null);
    try {
      const emailForCoupon = authEmail.trim() || 'student@oryqen.ai';
      const val = await subscriptionService.validateCoupon(code, emailForCoupon);
      if (!val || !val.isValid) {
        setCouponStatus({
          success: false,
          message: val?.reason || val?.error || 'Invalid or expired coupon code.',
        });
      } else {
        const freePlan =
          val.freePlan ||
          val.freePlanGranted ||
          (val.coupon?.type === 'free_pro'
            ? 'pro'
            : val.coupon?.type === 'free_plus'
            ? 'plus'
            : undefined);

        if (freePlan) {
          const res = await subscriptionService.redeemCoupon(
            code,
            emailForCoupon,
            name.trim() || 'Student',
            freePlan
          );
          setSelectedTier(freePlan);
          setCouponStatus({
            success: true,
            message: `Coupon activated: ${freePlan.toUpperCase()} access for ${res.durationDaysGranted || val.durationDays || 30} days.`,
          });
        } else {
          setCouponStatus({
            success: true,
            message: `Discount code verified (${val.discountPercent ? `${val.discountPercent}% off` : `₹${val.discountAmount} off`}).`,
          });
        }
      }
    } catch (err: unknown) {
      setCouponStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Coupon verification failed',
      });
    } finally {
      setCouponValidating(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentErrorMsg(null);
    setPaymentSubmittedMsg(null);
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setPaymentErrorMsg('Please enter your UPI Transaction Reference (UTR) number (at least 8 characters).');
      return;
    }
    setPaymentSubmitting(true);
    try {
      const email =
        authEmail.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '') || 'student'}@gmail.com`;
      await subscriptionService.submitUpiPayment({
        studentEmail: email,
        studentName: name.trim() || 'Scholar',
        payerUpiId: payerUpiId.trim() || 'student@upi',
        utrNumber: cleanUtr,
        plan: selectedTier,
        duration: billingCycle,
        amount: planAmount,
        couponCodeApplied: couponInput.trim() || undefined,
      });
      setPaymentSubmittedMsg('Payment reference submitted for verification.');
    } catch (err: unknown) {
      setPaymentErrorMsg(err instanceof Error ? err.message : 'Failed to submit payment request.');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleFinish = () => {
    const firstSubjectCategory =
      syllabusPreview.activeSubjects[0]?.category || draftGoalConfig.primarySubject;

    const finalConfig: GoalConfig = {
      ...draftGoalConfig,
      primarySubject: firstSubjectCategory,
    };

    const baseProfile: UserProfile = {
      userId: authUserId,
      email: authEmail.trim() || undefined,
      name: name.trim() || 'Scholar',
      educationCategory: pathType === 'competitive' ? 'competitive' : 'school',
      grade: 'Class 9-10 (Secondary)',
      primaryGoal: pathType === 'competitive' ? 'exam_prep' : 'both',
      favoriteSubjects: [firstSubjectCategory],
      primarySubject: firstSubjectCategory,
      preferredLanguage: medium,
      defaultStyle: 'step_by_step',
      dailyStudyTargetMinutes: dailyTarget,
      theme: isDark ? 'dark' : 'light',
      isOnboarded: true,
      avatarUrl: googleAvatar,
      authProvider: authProviderType,
      subscriptionTier: selectedTier,
    };

    const finalProfile = applyGoalConfigToProfile(baseProfile, finalConfig);

    if (authUserId) {
      syncToFirestore(authUserId, { profile: finalProfile }).catch(() => {});
    }

    onComplete(finalProfile, finalConfig);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b101f]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          <OryqenLogo size="md" showWordmark={true} />

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums hidden sm:inline">
              Step {step} of 3
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2.5 min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Status / Auth alerts */}
          {authError && (
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccessMsg && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* STEP 1: SELECT YOUR LEARNING PATH */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2.5 max-w-2xl">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  One platform · One active goal · Saved progress
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Select your learning path
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose your primary study focus. Your dashboard, syllabus tracker, and AI study tools adapt directly to your selected path, and you can switch goals anytime without losing saved progress.
                </p>
              </div>

              {/* Option A & Option B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Option A: School Learning */}
                <button
                  type="button"
                  onClick={() => {
                    setPathType('school');
                    setDailyTarget(45);
                    setStep(2);
                  }}
                  className={`text-left surface-card p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all hover:border-indigo-500 dark:hover:border-indigo-400 ${
                    pathType === 'school' ? 'ring-2 ring-indigo-500/20 border-indigo-500 dark:border-indigo-400' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Option A
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        School Learning
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Structured chapter mastery, concept notes, flashcards, MCQ practice, and syllabus tracking.
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p>Classes 5, 6, 7, 8, 9 & 10</p>
                      <p>CBSE / NCERT · ICSE / CISCE · State Boards · Cambridge & Custom</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Configure School Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Option B: Competitive Exams */}
                <button
                  type="button"
                  onClick={() => {
                    setPathType('competitive');
                    setDailyTarget(120);
                    setStep(2);
                  }}
                  className={`text-left surface-card p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all hover:border-indigo-500 dark:hover:border-indigo-400 ${
                    pathType === 'competitive' ? 'ring-2 ring-indigo-500/20 border-indigo-500 dark:border-indigo-400' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Option B
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        Competitive Exams
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Focused exam preparation with dedicated syllabus tracking, topic practice, answer writing, and timed mocks.
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p>UPSC Civil Services (Prelims & Mains)</p>
                      <p>IIT-JEE (Main & Advanced) · NEET-UG (Medical)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Configure Exam Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Returning Student Sign-In Strip */}
              <div className="surface-card p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Already have an ORYQEN account?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sign in to restore your saved goals, syllabus progress, notes, and mock test history.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span>{googleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setShowEmailLoginDrawer(prev => !prev);
                    }}
                    className="px-4 py-2.5 min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Email Sign In
                  </button>
                </div>
              </div>

              {/* Optional Email Login Drawer on Step 1 */}
              {showEmailLoginDrawer && (
                <form
                  onSubmit={handleAuthSubmit}
                  className="surface-card p-5 space-y-4 max-w-md ml-auto"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isForgotMode ? 'Reset Password' : 'Sign in with Email'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(!isForgotMode)}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isForgotMode ? 'Back to sign in' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                    />
                    {!isForgotMode && (
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 min-h-[42px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {authLoading
                      ? 'Verifying...'
                      : isForgotMode
                      ? 'Send Reset Link'
                      : 'Sign In & Restore Workspace'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: CONFIGURE LEARNING GOAL & LOAD SYLLABUS */}
          {step === 2 && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {pathType === 'school' ? 'Option A · School Learning' : 'Option B · Competitive Exams'}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {pathType === 'school' ? 'Configure your school curriculum' : 'Configure your target exam'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer self-start"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Path</span>
                </button>
              </div>

              {pathType === 'school' ? (
                <div className="space-y-6">
                  {/* Class Selection (5 to 10) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Class
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {SCHOOL_CLASSES.map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setSelectedClass(cls)}
                          className={`py-2.5 px-3 min-h-[44px] rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                            selectedClass === cls
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Education Board Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Education Board
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {SCHOOL_BOARDS.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBoard(b.id)}
                          className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                            selectedBoard === b.id
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{b.label}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {b.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Academic Year & Medium */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Academic Year
                      </label>
                      <select
                        value={academicYear}
                        onChange={e => setAcademicYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="2025–2026">2025–2026</option>
                        <option value="2026–2027">2026–2027</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Language / Medium
                      </label>
                      <select
                        value={medium}
                        onChange={e => setMedium(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Bilingual (English + Hindi)">Bilingual (English + Hindi)</option>
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Exam Selection: UPSC, JEE, NEET */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Select Examination
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {COMPETITIVE_EXAMS.map(exam => (
                        <button
                          key={exam.id}
                          type="button"
                          onClick={() => setCompetitiveExam(exam.id)}
                          className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                            competitiveExam === exam.id
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{exam.label}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {exam.subtitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Year & Preparation Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Target Examination Year
                      </label>
                      <select
                        value={targetExamYear}
                        onChange={e => setTargetExamYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="2026">2026 Attempt</option>
                        <option value="2027">2027 Attempt</option>
                        <option value="2028">2028 Attempt</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Preparation Level
                      </label>
                      <select
                        value={preparationLevel}
                        onChange={e => setPreparationLevel(e.target.value as PreparationLevel)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="beginner">Beginner / Foundation</option>
                        <option value="intermediate">Intermediate (Syllabus in Progress)</option>
                        <option value="advanced">Advanced (Revision & Test Series)</option>
                      </select>
                    </div>
                  </div>

                  {/* Exam-specific preferences */}
                  {competitiveExam === 'UPSC' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Stage Focus
                        </label>
                        <select
                          value={upscFocusStage}
                          onChange={e => setUpscFocusStage(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                        >
                          <option value="Prelims + Mains">Integrated Prelims + Mains</option>
                          <option value="Prelims Focus">Prelims GS & CSAT Focus</option>
                          <option value="Mains & Essay">Mains Answer Writing & Essay</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Optional Subject
                        </label>
                        <select
                          value={upscOptionalSubject}
                          onChange={e => setUpscOptionalSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
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
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        JEE Target Stream
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(['JEE Main & Advanced', 'JEE Main Only'] as const).map(stream => (
                          <button
                            key={stream}
                            type="button"
                            onClick={() => setJeeStream(stream)}
                            className={`py-2.5 px-4 min-h-[44px] rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                              jeeStream === stream
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {stream}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {competitiveExam === 'NEET' && (
                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          Prioritize NCERT Line-by-Line Revision
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Align Biology and Inorganic Chemistry drills closely to NCERT textbooks.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={neetNcertFocus}
                        onChange={e => setNeetNcertFocus(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Dynamic Syllabus Subjects & Verification Status */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {pathType === 'school' ? 'Select Subjects & Loaded Syllabus' : 'Syllabus Subjects Loaded'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {syllabusPreview.isAvailable
                        ? `${syllabusPreview.activeSubjects.length} subjects · ${totalChaptersLoaded} chapters · ${totalTopicsLoaded} verified topics`
                        : 'Verified curriculum check'}
                    </p>
                  </div>
                </div>

                {syllabusPreview.isAvailable ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {syllabusPreview.allSubjectsInClass.map(sub => {
                      const isSelected = selectedSubjectIds.includes(sub.id);
                      const topicCount = sub.chapters.reduce(
                        (s, c) => s + Math.max(1, c.syllabusTopics?.length || 0),
                        0
                      );
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleSubjectSelection(sub.id)}
                          className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-colors cursor-pointer min-h-[54px] ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {sub.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                              {sub.chapters.length} chapters · {topicCount} topics
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 p-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{syllabusPreview.unavailableReason}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      You can continue with this selection using AI-assisted notes, document PDF analysis, and custom study packs, or switch to an available board/class ({syllabusPreview.availableClassesForBoard.join(', ') || 'CBSE / NCERT Classes 5–10'}).
                    </p>
                  </div>
                )}

                {/* Daily Study Target */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Daily Study Commitment
                    </label>
                    <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {dailyTarget} min / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={360}
                    step={15}
                    value={dailyTarget}
                    onChange={e => setDailyTarget(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: STUDENT PROFILE, ACCOUNT SYNC & OPTIONAL PLAN */}
          {step === 3 && (
            <div className="surface-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Final Step · {draftGoalConfig.label}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    Personalize your workspace
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Name & Goal Summary */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2 text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Active Learning Goal Summary
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 space-y-1">
                      <div>Path: {pathType === 'school' ? 'School Learning' : 'Competitive Exam Preparation'}</div>
                      <div>Target: {draftGoalConfig.label}</div>
                      <div>Daily Schedule: {dailyTarget} min/day</div>
                      <div>
                        Syllabus Status:{' '}
                        {syllabusPreview.isAvailable
                          ? `${totalTopicsLoaded} topics ready to track`
                          : 'Unavailable in static catalog (AI-assisted mode)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account & Cloud Backup (Google / Email) */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Cloud Sync & Authentication (Recommended)
                  </div>

                  {authUserId ? (
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 p-4 space-y-1 text-xs">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Account connected</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{authEmail}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full py-2.5 px-4 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>{googleLoading ? 'Connecting Google...' : 'Continue with Google'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setShowEmailLoginDrawer(prev => !prev);
                        }}
                        className="w-full text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer py-1"
                      >
                        {showEmailLoginDrawer ? 'Hide email registration' : 'Or create an account with email & password'}
                      </button>

                      {showEmailLoginDrawer && (
                        <form onSubmit={handleAuthSubmit} className="space-y-2.5 pt-1">
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={e => setAuthEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-indigo-500"
                          />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={authPassword}
                            onChange={e => setAuthPassword(e.target.value)}
                            placeholder="Password (min 6 chars)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-indigo-500"
                          />
                          <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            {authLoading ? 'Creating...' : 'Create Account'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Upgrade & Coupon Drawer (Preserved functionality without blocking entry) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpgradeOptions(prev => !prev)}
                  className="flex items-center justify-between w-full text-left py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      Plan: {selectedTier === 'free' ? 'Free Forever' : selectedTier === 'plus' ? 'Scholar Plus' : 'Mastery Pro'} (Optional upgrade or promo code)
                    </span>
                  </span>
                  {showUpgradeOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showUpgradeOptions && (
                  <div className="mt-3 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-3 py-1 rounded-md cursor-pointer ${
                            billingCycle === 'yearly' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500'
                          }`}
                        >
                          Yearly (Save 16%)
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {(['free', 'plus', 'pro'] as const).map(tier => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setSelectedTier(tier)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                              selectedTier === tier
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {tier === 'free' ? 'Free (₹0)' : tier === 'plus' ? `Plus (₹${billingCycle === 'yearly' ? (plusPlan?.yearlyPrice ?? 999) : (plusPlan?.monthlyPrice ?? 99)})` : `Pro (₹${billingCycle === 'yearly' ? (proPlan?.yearlyPrice ?? 1999) : (proPlan?.monthlyPrice ?? 199)})`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedTier !== 'free' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <img
                            src={verifiedQrImage}
                            alt="UPI QR Code"
                            className="w-36 h-36 object-contain rounded-lg bg-white p-1 border border-slate-200"
                          />
                          <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            {merchantName} · {merchantUpi}
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUpi ? 'Copied UPI ID' : 'Copy UPI ID'}</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={e => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="Coupon code (optional)"
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono uppercase"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={couponValidating || !couponInput.trim()}
                              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                            >
                              {couponValidating ? '...' : 'Apply'}
                            </button>
                          </div>
                          {couponStatus && (
                            <p className={`text-xs ${couponStatus.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {couponStatus.message}
                            </p>
                          )}

                          <form onSubmit={handleSubmitPayment} className="space-y-2">
                            <input
                              type="text"
                              value={payerUpiId}
                              onChange={e => setPayerUpiId(e.target.value)}
                              placeholder="Your UPI ID (e.g. name@upi)"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                            />
                            <input
                              type="text"
                              value={utrNumber}
                              onChange={e => setUtrNumber(e.target.value)}
                              placeholder="12-digit UTR transaction number"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono"
                            />
                            {paymentErrorMsg && <p className="text-xs text-rose-500">{paymentErrorMsg}</p>}
                            {paymentSubmittedMsg && <p className="text-xs text-emerald-600">{paymentSubmittedMsg}</p>}
                            <button
                              type="submit"
                              disabled={paymentSubmitting}
                              className="w-full py-2 rounded-lg bg-slate-900 dark:bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
                            >
                              {paymentSubmitting ? 'Submitting...' : `Submit ₹${planAmount} UTR Verification`}
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {authUserId ? 'Cloud sync enabled' : 'You can sign in anytime from Settings'}
                </span>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-3 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
        ORYQEN Study AI · Unified School & Competitive Learning Platform
      </footer>
    </div>
  );
};
