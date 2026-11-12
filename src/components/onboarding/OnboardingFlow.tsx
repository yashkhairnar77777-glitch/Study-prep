import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  Compass,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sun,
  Moon,
  Crown,
  QrCode,
  Copy,
  Tag,
  CreditCard,
  Zap,
} from 'lucide-react';
import {
  UserProfile,
  GradeLevel,
  SubjectCategory,
  ExplanationStyle,
  EducationCategory,
  LearningGoal,
  SubscriptionTier,
  BillingDuration,
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
import { IMAGES } from '../../assets/images';

interface OnboardingFlowProps {
  onComplete: (completedProfile: UserProfile) => void;
}

// Official Google multi-color SVG icon
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
  // Steps: 1: Welcome, 2: Plan Selection & Payment, 3: Auth, 4: Name, 5: Education Track, 6: Subjects & Style
  const [step, setStep] = useState<number>(1);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('oryqen_theme') === 'dark';
  });

  // Subscription Plan Selection State (Directly after Get Started)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free');
  const [billingCycle, setBillingCycle] = useState<BillingDuration>('monthly');
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentSubmittedMsg, setPaymentSubmittedMsg] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponStatus, setCouponStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Auth state
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Google & Auth State
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAvatar, setGoogleAvatar] = useState<string | undefined>(undefined);
  const [authUserId, setAuthUserId] = useState<string | undefined>(undefined);
  const [authProviderType, setAuthProviderType] = useState<'google' | 'supabase' | 'local'>('local');

  // User Profile Draft State
  const [name, setName] = useState('');
  const [educationCategory, setEducationCategory] = useState<EducationCategory>('school');
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [collegeCourse, setCollegeCourse] = useState('');
  const [competitiveExamCategory, setCompetitiveExamCategory] = useState('Engineering (JEE / BITSAT)');
  const [primaryGoal, setPrimaryGoal] = useState<LearningGoal>('exam_prep');
  const [enableBothGoals, setEnableBothGoals] = useState(false);
  const [favoriteSubjects, setFavoriteSubjects] = useState<SubjectCategory[]>([
    'Mathematics',
    'Physics',
    'Chemistry',
  ]);
  const [explanationStyle, setExplanationStyle] = useState<ExplanationStyle>('step_by_step');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [dailyTarget, setDailyTarget] = useState<number>(30);

  const merchantUpi = 'yashkhairnar77777@okaxis';
  const merchantName = 'Yash Khairnar (Guardian Merchant)';

  const planAmount = selectedTier === 'pro'
    ? (billingCycle === 'yearly' ? 1999 : 199)
    : selectedTier === 'plus'
    ? (billingCycle === 'yearly' ? 999 : 99)
    : 0;

  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${planAmount}&cu=INR&tn=${encodeURIComponent(`ORYQEN_${selectedTier.toUpperCase()}_PLAN`)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiPayUrl
  )}&margin=8`;

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
        setCouponStatus({ success: false, message: val?.reason || val?.error || 'Invalid or expired coupon code.' });
      } else {
        const freePlan =
          val.freePlan ||
          val.freePlanGranted ||
          (val.coupon?.type === 'free_pro' ? 'pro' : val.coupon?.type === 'free_plus' ? 'plus' : undefined);

        if (freePlan) {
          const res = await subscriptionService.redeemCoupon(code, emailForCoupon, name.trim() || 'Student', freePlan);
          setSelectedTier(freePlan);
          setCouponStatus({
            success: true,
            message: `🎉 Coupon activated! You received free ${freePlan.toUpperCase()} access for ${res.durationDaysGranted || val.durationDays || 30} days!`,
          });
        } else {
          setCouponStatus({
            success: true,
            message: `🎉 Discount code verified (${val.discountPercent ? `${val.discountPercent}% OFF` : `₹${val.discountAmount} OFF`})!`,
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Coupon verification failed';
      setCouponStatus({ success: false, message: msg });
    } finally {
      setCouponValidating(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setPaymentSubmittedMsg('⚠️ Please enter your 12-digit UPI Transaction Reference (UTR) number.');
      return;
    }
    setPaymentSubmitting(true);
    try {
      const email = authEmail.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '') || 'student'}@gmail.com`;
      await subscriptionService.submitUpiPayment({
        studentEmail: email,
        studentName: name.trim() || 'Student Scholar',
        payerUpiId: payerUpiId.trim() || 'student@upi',
        utrNumber: utrNumber.trim(),
        plan: selectedTier,
        duration: billingCycle,
        amount: planAmount,
        couponCodeApplied: couponInput.trim() || undefined,
      });

      setPaymentSubmittedMsg(
        '✅ Payment request submitted successfully! Reference logged for guardian admin verification.'
      );
      setTimeout(() => {
        setStep(3); // Proceed to Account Credentials
      }, 1500);
    } catch (err: any) {
      console.warn('Payment submit error:', err);
      // Even if offline/local, allow student to proceed
      setPaymentSubmittedMsg('Payment details recorded. Advancing to account setup...');
      setTimeout(() => {
        setStep(3);
      }, 1200);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  // Real Google Sign-In via Firebase Auth
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const user = await firebaseGoogleSignIn();
      if (user) {
        const studentName = user.displayName || user.email?.split('@')[0] || 'Student';
        setName(studentName);
        setAuthEmail(user.email || '');
        setAuthUserId(user.uid);
        setGoogleAvatar(user.photoURL || undefined);
        setAuthProviderType('google');
        setAuthSuccessMsg(`Signed in with Google: ${studentName} (${user.email})!`);

        // Check if existing student profile exists in Firestore (Real Cloud Sync)
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
          onComplete(restoredProfile);
          return;
        }

        // If newly signing in, show plan selection right away!
        setTimeout(() => {
          setStep(2);
        }, 500);
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('oryqen_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Auth submission handler
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
        setAuthSuccessMsg(`Password reset instructions sent to ${authEmail.trim()}. Please check your email inbox.`);
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
        const user = await signUpWithEmail(authEmail, authPassword, name || 'Student');
        setAuthUserId(user.uid);
        setAuthProviderType('local');
        setAuthSuccessMsg(`Account created for ${user.email}! Continuing to curriculum setup...`);
        setTimeout(() => setStep(4), 600);
      } else {
        const user = await signInWithEmail(authEmail, authPassword);
        setAuthUserId(user.uid);
        setAuthProviderType('local');
        setAuthSuccessMsg(`Welcome back, ${user.displayName || user.email}!`);

        const cloudData = await loadFromFirestore(user.uid);
        if (cloudData && cloudData.profile && cloudData.profile.isOnboarded) {
          const restoredProfile: UserProfile = {
            ...(cloudData.profile as UserProfile),
            userId: user.uid,
            email: user.email || undefined,
            name: user.displayName || cloudData.profile.name || 'Student',
            authProvider: 'local',
            isOnboarded: true,
            subscriptionTier: selectedTier,
          };
          onComplete(restoredProfile);
          return;
        }

        setTimeout(() => setStep(4), 600);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    let resolvedGrade: GradeLevel = 'Class 9-10 (Secondary)';

    if (educationCategory === 'school') {
      const classNum = parseInt(selectedClass.replace('Class ', ''), 10) || 10;
      if (classNum <= 5) resolvedGrade = 'Class 1-5 (Primary)';
      else if (classNum <= 8) resolvedGrade = 'Class 6-8 (Middle School)';
      else if (classNum <= 10) resolvedGrade = 'Class 9-10 (Secondary)';
      else resolvedGrade = 'Class 11-12 (Higher Secondary)';
    } else if (educationCategory === 'college' || educationCategory === 'university') {
      resolvedGrade = 'College / Undergraduate';
    } else if (educationCategory === 'competitive') {
      resolvedGrade = 'Competitive Exams (JEE / NEET / SAT / AP / GRE)';
    } else {
      resolvedGrade = 'Independent Learner';
    }

    const finalGoal: LearningGoal = enableBothGoals ? 'both' : primaryGoal;

    const completedProfile: UserProfile = {
      userId: authUserId,
      email: authEmail || undefined,
      name: name.trim() || 'Student',
      educationCategory,
      grade: resolvedGrade,
      selectedClass: educationCategory === 'school' ? selectedClass : undefined,
      collegeCourse: (educationCategory === 'college' || educationCategory === 'university') ? collegeCourse.trim() : undefined,
      competitiveExamCategory: educationCategory === 'competitive' ? competitiveExamCategory : undefined,
      primaryGoal: finalGoal,
      favoriteSubjects,
      primarySubject: favoriteSubjects[0] || 'Mathematics',
      preferredLanguage,
      defaultStyle: explanationStyle,
      dailyStudyTargetMinutes: dailyTarget,
      theme: isDark ? 'dark' : 'light',
      isOnboarded: true,
      avatarUrl: googleAvatar,
      authProvider: authProviderType,
      subscriptionTier: selectedTier,
    };

    if (authUserId) {
      syncToFirestore(authUserId, { profile: completedProfile });
    }

    onComplete(completedProfile);
  };

  const toggleSubject = (subj: SubjectCategory) => {
    if (favoriteSubjects.includes(subj)) {
      if (favoriteSubjects.length > 1) {
        setFavoriteSubjects(favoriteSubjects.filter(s => s !== subj));
      }
    } else {
      setFavoriteSubjects([...favoriteSubjects, subj]);
    }
  };

  const allSubjects: SubjectCategory[] = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English & Languages',
    'History & Social Studies',
    'Economics & Commerce',
    'General Science',
    'Japanese',
    'Hindi',
    'Marathi',
    'Sanskrit',
    'Foundation & Olympiads',
    'UPSC General Studies',
  ];

  return (
    <div className={`relative min-h-screen w-full ${isDark ? 'dark bg-[#0a0e1a] text-slate-100' : 'bg-[#f4f2fb] text-slate-800'} flex flex-col justify-between overflow-x-hidden transition-colors selection:bg-indigo-500/20`}>
      {/* Background Pastel Blobs */}
      <div className="pointer-events-none absolute top-10 left-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />

      {/* Top Header Strip */}
      <header className="relative z-10 flex h-16 items-center justify-between px-6 sm:px-12 border-b border-slate-200/60 dark:border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={IMAGES.CLAY_MASCOT} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            ORYQEN STUDY AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl clay-btn-secondary text-slate-600 dark:text-slate-300 transition-colors"
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {step > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Step {step - 1} of 5</span>
              <div className="flex gap-1 ml-2">
                {[2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-6 bg-indigo-600'
                        : i < step
                        ? 'w-2 bg-indigo-400/50'
                        : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* SCREEN 1: WELCOME */}
          {step === 1 && (
            <div className="clay-card p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-xl">
              <div className="w-36 h-36 mx-auto relative animate-clay-float">
                <img
                  src={IMAGES.CLAY_MASCOT}
                  alt="3D Clay Mascot"
                  className="w-full h-full object-contain filter drop-shadow-lg rounded-2xl"
                />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation AI Learning Companion</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Your potential. <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Without limits.
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your personal AI learning companion. Understand deeper, prepare smarter, and learn at your own pace.
                </p>
              </div>

              {/* Direct Google Sign-In */}
              <div className="pt-2 max-w-sm mx-auto space-y-3">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={googleLoading}
                  className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div className="h-4 w-4 border-2 border-slate-400 border-t-violet-600 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon className="h-5 w-5 shrink-0" />
                  )}
                  <span>{googleLoading ? 'Connecting to Google Accounts...' : 'Sign in with Google / Gmail'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    or choose your plan to start
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                </div>
              </div>

              {/* Get Started Button -> Leads to Plan Selection (Step 2) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2); // Directly to Plan Selection & Payment!
                  }}
                  className="w-full sm:w-auto min-w-[170px] flex items-center justify-center gap-2 px-6 py-3.5 clay-btn-primary font-bold text-sm shadow-lg hover:scale-105 transition-transform"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setStep(3); // Direct to Login
                  }}
                  className="w-full sm:w-auto min-w-[130px] px-6 py-3.5 clay-btn-secondary font-bold text-sm"
                >
                  Log In
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Classes 1–12</span>
                <span>·</span>
                <span>College & University</span>
                <span>·</span>
                <span>Competitive Exams</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: SUBSCRIPTION PLAN & PAYMENT (Directly after Get Started) */}
          {step === 2 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl max-h-[88vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Step 1: Choose Your Learning Plan</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Select Your Study Plan
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Start free with essential tools or unlock NCERT Graphic Sheets, Viva Exams & Full Mocks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-2 rounded-xl clay-btn-secondary text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex rounded-2xl p-1 text-xs clay-card-flat border border-slate-200/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'clay-btn-primary shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'yearly'
                        ? 'clay-btn-primary shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Yearly Billing</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold">
                      Save 16%
                    </span>
                  </button>
                </div>
              </div>

              {/* 3 Subscription Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* FREE CARD */}
                <div
                  onClick={() => {
                    setSelectedTier('free');
                    setShowPaymentDrawer(false);
                  }}
                  className={`rounded-2xl p-4.5 border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                    selectedTier === 'free'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Foundational
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free Forever</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">₹0</span>
                      <span className="text-xs text-slate-400">/ forever</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Basic AI tutor (10 questions/day)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Basic chapter revision notes</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>20 Spaced-repetition flashcards</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>3 Practice mock quizzes/mo</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTier('free');
                      setStep(3); // Advance to Auth
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTier === 'free'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Continue Free →
                  </button>
                </div>

                {/* PLUS CARD */}
                <div
                  onClick={() => {
                    setSelectedTier('plus');
                    setShowPaymentDrawer(true);
                  }}
                  className={`rounded-2xl p-4.5 border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                    selectedTier === 'plus'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-lg ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-extrabold text-white shadow-xs">
                    MOST POPULAR
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Accelerated
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scholar Plus</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {billingCycle === 'yearly' ? '₹999' : '₹99'}
                      </span>
                      <span className="text-xs text-slate-400">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <li className="flex items-start gap-1.5 font-medium text-slate-900 dark:text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>NCERT Visual Graphic Notes</span>
                      </li>
                      <li className="flex items-start gap-1.5 font-medium text-slate-900 dark:text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>AI Oral Viva Voice Exam Mode</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>20 Full practice mock tests/mo</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>200 Spaced-repetition flashcards</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTier('plus');
                      setShowPaymentDrawer(true);
                    }}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay via UPI ({billingCycle === 'yearly' ? '₹999' : '₹99'})</span>
                  </button>
                </div>

                {/* PRO CARD */}
                <div
                  onClick={() => {
                    setSelectedTier('pro');
                    setShowPaymentDrawer(true);
                  }}
                  className={`rounded-2xl p-4.5 border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                    selectedTier === 'pro'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 shadow-lg ring-2 ring-amber-500/30'
                      : 'border-slate-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[10px] font-extrabold text-white shadow-xs">
                    EXAM MASTERY
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Uncapped Power
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mastery Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        {billingCycle === 'yearly' ? '₹1,999' : '₹199'}
                      </span>
                      <span className="text-xs text-slate-400">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <li className="flex items-start gap-1.5 font-medium text-slate-900 dark:text-white">
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>High-Capacity Reasoning AI (Claude/Gemini/Llama)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Full 200-page textbook PDF analysis</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Board examiner marking rubrics</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>All Plus & Pro premium features</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedTier('pro');
                      setShowPaymentDrawer(true);
                    }}
                    className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Pay via UPI ({billingCycle === 'yearly' ? '₹1,999' : '₹199'})</span>
                  </button>
                </div>
              </div>

              {/* UPI PAYMENT ACCORDION & QR CODE SECTION */}
              {showPaymentDrawer && selectedTier !== 'free' && (
                <div className="rounded-2xl border-2 border-indigo-500/40 bg-white dark:bg-slate-900/90 p-5 space-y-4 shadow-lg animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Instant UPI Payment for {selectedTier === 'pro' ? 'Mastery Pro' : 'Scholar Plus'} ({billingCycle === 'yearly' ? '₹' + planAmount + '/yr' : '₹' + planAmount + '/mo'})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      ₹0 Software Fee Gateway
                    </span>
                  </div>

                  {paymentSubmittedMsg && (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{paymentSubmittedMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* QR Code Column */}
                    <div className="md:col-span-5 flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center">
                      <img
                        src={qrImageUrl}
                        alt="UPI Payment QR Code"
                        className="w-44 h-44 rounded-xl border border-white shadow-xs mb-2"
                      />
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Scan with GPay, PhonePe, Paytm or BHIM
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          readOnly
                          value={merchantUpi}
                          className="w-full text-center text-[10px] font-mono font-bold bg-white dark:bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 select-all"
                        />
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold shrink-0 border border-indigo-200 dark:border-indigo-800"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Form & Coupon Column */}
                    <div className="md:col-span-7 space-y-3">
                      {/* Coupon input */}
                      <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Have a Coupon Code?</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value.toUpperCase())}
                            placeholder="Enter promo or access code (optional)"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-mono uppercase outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponValidating || !couponInput.trim()}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-50"
                          >
                            {couponValidating ? 'Checking...' : 'Apply'}
                          </button>
                        </div>
                        {couponStatus && (
                          <p className={`text-[11px] font-bold ${couponStatus.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                            {couponStatus.message}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Tip: Scholarship passes and study ambassador codes grant instant premium tier access.
                        </p>
                      </div>

                      {/* Payment Verification Form */}
                      <form onSubmit={handleSubmitPayment} className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Payer UPI ID
                            </label>
                            <input
                              type="text"
                              value={payerUpiId}
                              onChange={e => setPayerUpiId(e.target.value)}
                              placeholder="e.g. yourname@upi"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              12-digit UTR Number *
                            </label>
                            <input
                              type="text"
                              required
                              value={utrNumber}
                              onChange={e => setUtrNumber(e.target.value)}
                              placeholder="e.g. 429381029384"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={paymentSubmitting}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {paymentSubmitting ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Submit UTR & Continue to Account Setup</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTier('free');
                    setStep(3); // Continue to Auth
                  }}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
                >
                  I'll continue with the Free tier for now →
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl clay-btn-primary font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Continue ({selectedTier.toUpperCase()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: AUTHENTICATION */}
          {step === 3 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {isForgotMode
                      ? 'Reset Your Password'
                      : authMode === 'signup'
                      ? 'Create Your Student Account'
                      : 'Welcome Back'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isForgotMode
                      ? 'Enter your registered email address to receive reset instructions.'
                      : authMode === 'signup'
                      ? 'Sign up to synchronize your notes, flashcards, and study progress with Google Firestore.'
                      : 'Sign in to access your saved study materials.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="p-2 rounded-xl clay-btn-secondary text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              {!isForgotMode && (
                <div className="flex rounded-2xl p-1 text-xs clay-card-flat">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                    }}
                    className={`flex-1 rounded-xl py-2 font-bold transition-all ${
                      authMode === 'signup'
                        ? 'clay-btn-primary shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className={`flex-1 rounded-xl py-2 font-bold transition-all ${
                      authMode === 'login'
                        ? 'clay-btn-primary shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Log In
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-3.5 space-y-1 text-xs text-indigo-700 dark:text-indigo-300">
                <div className="flex items-center gap-2 font-bold">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Real Cloud Authentication & Firestore Sync Active</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sign in with your Google account or email & password. Your study notes, flashcards, and plans sync automatically.
                </p>
              </div>

              {authError && (
                <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 p-3 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 p-3 text-xs text-emerald-700 dark:text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* Real Google Account Sign-In Button */}
              {!isForgotMode && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn()}
                    disabled={googleLoading || authLoading}
                    className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all disabled:opacity-50"
                  >
                    {googleLoading ? (
                      <div className="h-4 w-4 border-2 border-slate-400 border-t-violet-600 rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon className="h-4 w-4 shrink-0" />
                    )}
                    <span>
                      {googleLoading ? 'Connecting to Google Accounts...' : 'Sign in with Google (Gmail Account)'}
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      or use email & password
                    </span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                  </div>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full clay-input pl-10 pr-3.5 py-2.5 text-xs outline-none text-slate-800 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                {!isForgotMode && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setIsForgotMode(true)}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full clay-input pl-10 pr-10 py-2.5 text-xs outline-none text-slate-800 dark:text-slate-100"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  {authLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isForgotMode ? (
                    <span>Send Reset Email</span>
                  ) : authMode === 'signup' ? (
                    <span>Create Account & Continue</span>
                  ) : (
                    <span>Sign In & Continue</span>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center border-t border-slate-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
                >
                  Continue without account (Local Profile) →
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: NAME */}
          {step === 4 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Let's get to know you.
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    What should we call you?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="p-2 rounded-xl clay-btn-secondary text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name or Preferred Handle
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alex, Priya, Liam, Sarah"
                      className="w-full clay-input pl-10 pr-3.5 py-3 text-sm outline-none text-slate-800 dark:text-slate-100"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter' && name.trim()) setStep(5);
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Used to personalize your AI tutor greetings and study dashboard.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  disabled={!name.trim()}
                  className="w-full py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: CLASS & LEVEL */}
          {step === 5 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    What are you studying?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select your current school class or learning level.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="p-2 rounded-xl clay-btn-secondary text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Segment Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'school', label: 'School' },
                  { id: 'college', label: 'College' },
                  { id: 'competitive', label: 'Competitive' },
                  { id: 'other', label: 'Other' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setEducationCategory(cat.id as any)}
                    className={`rounded-2xl p-2.5 text-xs font-bold transition-all ${
                      educationCategory === cat.id
                        ? 'clay-btn-primary shadow-xs'
                        : 'clay-card-flat text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* School Classes Grid */}
              {educationCategory === 'school' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Select Class (1 to 12):
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(cls => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setSelectedClass(cls)}
                        className={`rounded-2xl p-3 text-xs font-bold transition-all ${
                          selectedClass === cls
                            ? 'clay-btn-primary shadow-xs'
                            : 'clay-card-flat text-slate-700 dark:text-slate-300 hover:text-indigo-600'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {educationCategory === 'college' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Major / Degree Program
                  </label>
                  <input
                    type="text"
                    value={collegeCourse}
                    onChange={e => setCollegeCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science, MBBS, B.Com, B.Sc Physics"
                    className="w-full clay-input px-3.5 py-3 text-xs outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              )}

              {educationCategory === 'competitive' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Competitive Exam
                  </label>
                  <select
                    value={competitiveExamCategory}
                    onChange={e => setCompetitiveExamCategory(e.target.value)}
                    className="w-full clay-input px-3.5 py-3 text-xs outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="Engineering (JEE / BITSAT)">Engineering (JEE Main & Advanced / BITSAT)</option>
                    <option value="Medical (NEET / AIIMS)">Medical (NEET UG / AIIMS)</option>
                    <option value="Civil Services (UPSC / State PSC)">Civil Services (UPSC CSE / State PSC)</option>
                    <option value="Banking & SSC">Banking & Staff Selection (IBPS / SSC CGL)</option>
                    <option value="International (SAT / AP / GRE)">International (SAT / AP Exams / GRE / GMAT)</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* SCREEN 6: SUBJECTS, GOALS & FINISH */}
          {step === 6 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Personalize Your Workspace
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pick your priority subjects and explanation style.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="p-2 rounded-xl clay-btn-secondary text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Subject Badges */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Favorite Subjects:
                </span>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.map(sub => {
                    const isSelected = favoriteSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'clay-btn-primary shadow-xs'
                            : 'clay-card-flat text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Learning Goal */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Primary Study Goal:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryGoal('exam_prep');
                      setEnableBothGoals(false);
                    }}
                    className={`rounded-2xl p-3 text-xs font-bold text-left transition-all ${
                      primaryGoal === 'exam_prep' && !enableBothGoals
                        ? 'clay-btn-primary shadow-xs'
                        : 'clay-card-flat text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Exam Preparation</span>
                    </div>
                    <p className="text-[10px] opacity-80 font-normal">
                      High-scoring answers, mock test timers, and formulas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrimaryGoal('learn_anything');
                      setEnableBothGoals(false);
                    }}
                    className={`rounded-2xl p-3 text-xs font-bold text-left transition-all ${
                      primaryGoal === 'learn_anything' && !enableBothGoals
                        ? 'clay-btn-primary shadow-xs'
                        : 'clay-card-flat text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span>Conceptual Learning</span>
                    </div>
                    <p className="text-[10px] opacity-80 font-normal">
                      Intuitive first principles, analogies, and proofs.
                    </p>
                  </button>
                </div>
              </div>

              {/* Explanation Style & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Explanation Depth
                  </label>
                  <select
                    value={explanationStyle}
                    onChange={e => setExplanationStyle(e.target.value as any)}
                    className="w-full clay-input px-3 py-2 text-xs outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="step_by_step">Step-by-step with reasoning</option>
                    <option value="quick">Quick and concise</option>
                    <option value="exam_ready">Exam-ready scoring answers</option>
                    <option value="basics">Explain from fundamental basics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Language
                  </label>
                  <input
                    type="text"
                    value={preferredLanguage}
                    onChange={e => setPreferredLanguage(e.target.value)}
                    placeholder="e.g. English, Hindi, Hinglish"
                    className="w-full clay-input px-3 py-2 text-xs outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Finish Button */}
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-3.5 clay-btn-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Complete Setup & Enter Study AI</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 flex h-14 items-center justify-between px-6 sm:px-12 border-t border-slate-200/60 dark:border-white/10 text-xs text-slate-400 backdrop-blur-md">
        <span>© {new Date().getFullYear()} ORYQEN STUDY AI</span>
        <span>Secure UPI & Guardian-Verified Manual Payments</span>
      </footer>
    </div>
  );
};
