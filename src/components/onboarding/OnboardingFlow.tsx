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
} from 'lucide-react';
import {
  UserProfile,
  GradeLevel,
  SubjectCategory,
  ExplanationStyle,
  EducationCategory,
  LearningGoal,
} from '../../types';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { IMAGES } from '../../assets/images';

interface OnboardingFlowProps {
  onComplete: (completedProfile: UserProfile) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('oryqen_theme') === 'dark';
  });

  // Auth state
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);

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
      if (!isSupabaseConfigured || !supabase) {
        setAuthError(
          'Supabase credentials are not configured in .env. Password reset email service requires active VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        );
        return;
      }
      setAuthLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim());
      setAuthLoading(false);
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccessMsg('Password reset instructions have been sent to your email.');
      }
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);
      try {
        if (authMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: authEmail.trim(),
            password: authPassword,
          });
          if (error) throw error;
          if (data.session) {
            setStep(3);
          } else {
            setAuthSuccessMsg('Sign up successful! Please check your email to verify your account.');
            setTimeout(() => setStep(3), 1500);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail.trim(),
            password: authPassword,
          });
          if (error) throw error;
          if (data.session) {
            setStep(3);
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        setAuthError(msg);
      } finally {
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        setStep(3);
      }, 500);
    }
  };

  const handleSkipAuthToLocal = () => {
    setAuthError(null);
    setStep(3);
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
      authProvider: isSupabaseConfigured ? 'supabase' : 'local',
    };

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
        <div className="w-full max-w-xl mx-auto">
          {/* SCREEN 1: WELCOME */}
          {step === 1 && (
            <div className="clay-card p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-xl">
              {/* 3D Clay Mascot Hero Display */}
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
                  Your personal AI learning companion. Understand more, prepare smarter, and learn at your own pace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setStep(2);
                  }}
                  className="w-full sm:w-auto min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 clay-btn-primary font-bold text-sm shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setStep(2);
                  }}
                  className="w-full sm:w-auto min-w-[130px] px-6 py-3 clay-btn-secondary font-bold text-sm"
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

          {/* SCREEN 2: AUTHENTICATION */}
          {step === 2 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {isForgotMode
                      ? 'Reset Your Password'
                      : authMode === 'signup'
                      ? 'Create Your Account'
                      : 'Welcome Back'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isForgotMode
                      ? 'Enter your registered email address to receive reset instructions.'
                      : authMode === 'signup'
                      ? 'Sign up to synchronize your notes, flashcards, and study progress.'
                      : 'Sign in to access your saved study materials.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
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

              {!isSupabaseConfigured && (
                <div className="rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-3.5 space-y-1 text-xs text-indigo-700 dark:text-indigo-300">
                  <div className="flex items-center gap-2 font-bold">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>Local Student Session Mode Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cloud Supabase Auth is optional. To enable multi-device sync, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env. You can proceed directly with full local browser isolation.
                  </p>
                </div>
              )}

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

              {!isSupabaseConfigured && (
                <div className="pt-2 text-center border-t border-slate-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={handleSkipAuthToLocal}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Continue with Local Student Profile →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: NAME */}
          {step === 3 && (
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
                  onClick={() => setStep(2)}
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
                        if (e.key === 'Enter' && name.trim()) setStep(4);
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    Used to personalize your AI tutor greetings and study dashboard.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!name.trim()}
                  className="w-full py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: CLASS & LEVEL */}
          {step === 4 && (
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
                  onClick={() => setStep(3)}
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
                        className={`rounded-2xl p-3 text-xs font-bold transition-all text-center ${
                          selectedClass === cls
                            ? 'clay-btn-primary shadow-sm'
                            : 'clay-card-flat text-slate-700 dark:text-slate-300 hover:text-indigo-600'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* College Course Input */}
              {(educationCategory === 'college' || educationCategory === 'university') && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Field of Study or Degree Program
                  </label>
                  <input
                    type="text"
                    value={collegeCourse}
                    onChange={e => setCollegeCourse(e.target.value)}
                    placeholder="e.g. Computer Science, Mechanical Engg, Pre-Med, Economics"
                    className="w-full clay-input px-3.5 py-2.5 text-xs outline-none text-slate-800 dark:text-slate-100"
                  />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The tutor will calibrate university-level proofs, academic rigor, and advanced terminology.
                  </p>
                </div>
              )}

              {/* Competitive Exam Categories */}
              {educationCategory === 'competitive' && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Exam Category:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Engineering (JEE / BITSAT / GATE)',
                      'Medical (NEET UG / MCAT)',
                      'Government & Civil Services (UPSC)',
                      'Graduate & International (SAT / GRE / GMAT)',
                      'Law & Management (CLAT / CAT)',
                      'Other Entrance Tests',
                    ].map(exam => (
                      <button
                        key={exam}
                        type="button"
                        onClick={() => setCompetitiveExamCategory(exam)}
                        className={`rounded-2xl p-3 text-xs font-semibold text-left transition-all ${
                          competitiveExamCategory === exam
                            ? 'clay-btn-primary shadow-xs'
                            : 'clay-card-flat text-slate-700 dark:text-slate-300 hover:text-indigo-600'
                        }`}
                      >
                        {exam}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Learning */}
              {educationCategory === 'other' && (
                <div className="rounded-2xl p-4 clay-card-flat text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Independent / Lifelong Learner</p>
                  <p className="text-slate-500 leading-relaxed">
                    We will customize your learning experience with first-principles conceptual explanations, real-world analogies, and flexible pacing.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-full py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* SCREEN 5: LEARNING GOAL */}
          {step === 5 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    What brings you here?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose how you'd like ORYQEN to help you.
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

              <div className="space-y-4">
                {/* OPTION A: EXAM PREPARATION */}
                <div
                  onClick={() => setPrimaryGoal('exam_prep')}
                  className={`clay-card p-5 rounded-3xl cursor-pointer transition-all border-2 ${
                    primaryGoal === 'exam_prep'
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                          OPTION A — EXAM PREPARATION
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Prepare smarter, practise questions, and walk into exams with confidence.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        primaryGoal === 'exam_prep'
                          ? 'bg-indigo-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {primaryGoal === 'exam_prep' && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                </div>

                {/* OPTION B: LEARN ANYTHING */}
                <div
                  onClick={() => setPrimaryGoal('learn_anything')}
                  className={`clay-card p-5 rounded-3xl cursor-pointer transition-all border-2 ${
                    primaryGoal === 'learn_anything'
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                          OPTION B — LEARN ANYTHING
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Understand concepts deeply, explore new topics, and learn at your own pace.
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        primaryGoal === 'learn_anything'
                          ? 'bg-indigo-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {primaryGoal === 'learn_anything' && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={enableBothGoals}
                  onChange={e => setEnableBothGoals(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Enable both goals (show full suite of exam simulators and concept tools)</span>
              </label>

              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full py-3.5 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>Customize Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* SCREEN 6: PERSONALIZATION & FINISH */}
          {step === 6 && (
            <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Fine-tune Your Workspace
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize your explanation style and favorite subjects.
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

              {/* Subjects */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Key Subjects:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.map(subj => {
                    const isSelected = favoriteSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleSubject(subj)}
                        className={`rounded-2xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? 'clay-btn-primary shadow-xs'
                            : 'clay-card-flat text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation Style */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Default Explanation Depth:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'step_by_step', label: 'Step-by-Step', desc: 'Detailed proof with formulas' },
                    { id: 'exam_ready', label: 'Exam-Ready', desc: 'Key points & scoring structure' },
                    { id: 'basics', label: 'Basics & Intuition', desc: 'First principles & analogies' },
                    { id: 'quick', label: 'Quick Answer', desc: 'Direct, concise results' },
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setExplanationStyle(st.id as any)}
                      className={`clay-card-flat p-3 rounded-2xl text-left text-xs transition-all border ${
                        explanationStyle === st.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                          : 'border-transparent'
                      }`}
                    >
                      <p className="font-bold text-slate-900 dark:text-white">{st.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{st.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Target */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Daily Study Goal:
                </label>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyTarget(mins)}
                      className={`rounded-2xl py-2 font-bold transition-all ${
                        dailyTarget === mins
                          ? 'clay-btn-primary'
                          : 'clay-card-flat text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="px-4 py-3 clay-btn-secondary text-xs font-semibold"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="flex-1 py-3 clay-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Launch Study Space</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-slate-200/60 dark:border-white/10">
        ORYQEN STUDY AI · Designed for academic excellence and conceptual mastery
      </footer>
    </div>
  );
};
