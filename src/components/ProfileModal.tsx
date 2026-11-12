import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Save,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Mail,
  Lock,
  Cloud,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  UserPlus,
  LogIn,
} from 'lucide-react';
import {
  UserProfile,
  GradeLevel,
  SubjectCategory,
  ExplanationStyle,
  EducationCategory,
  LearningGoal,
  ProviderStatus,
} from '../types';
import { storage } from '../lib/storage';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  sendResetPasswordEmail,
  signOutUser,
  syncToFirestore,
  loadFromFirestore,
} from '../lib/firebaseAuth';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.15-6.72-4.98H1.25v3.15C3.27 21.41 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.58H1.25C.45 8.21 0 10.05 0 12c0 1.95.45 3.79 1.25 5.42l4.03-3.2z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

interface ProfileModalProps {
  profile: UserProfile;
  providerStatus: ProviderStatus | null;
  onSaveProfile: (updated: UserProfile) => void;
  onClose: () => void;
  onDataImported: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  providerStatus,
  onSaveProfile,
  onClose,
  onDataImported,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name);
  const [educationCategory, setEducationCategory] = useState<EducationCategory>(profile.educationCategory);
  const [selectedClass, setSelectedClass] = useState(profile.selectedClass || 'Class 10');
  const [collegeCourse, setCollegeCourse] = useState(profile.collegeCourse || '');
  const [competitiveExamCategory, setCompetitiveExamCategory] = useState(
    profile.competitiveExamCategory || 'Engineering (JEE / BITSAT)'
  );
  const [primaryGoal, setPrimaryGoal] = useState<LearningGoal>(profile.primaryGoal);
  const [primarySubject, setPrimarySubject] = useState<SubjectCategory>(profile.primarySubject);
  const [preferredLanguage, setPreferredLanguage] = useState(profile.preferredLanguage);
  const [defaultStyle, setDefaultStyle] = useState<ExplanationStyle>(profile.defaultStyle);
  const [dailyTarget, setDailyTarget] = useState<number>(profile.dailyStudyTargetMinutes || 30);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Authentication State
  const [authLoading, setAuthLoading] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Load existing cloud data if available
        const cloudData = await loadFromFirestore(user.uid);

        const updated: UserProfile = {
          ...profile,
          userId: user.uid,
          name: user.displayName || profile.name || 'Scholar',
          email: user.email || undefined,
          avatarUrl: user.photoURL || undefined,
          authProvider: 'google',
          ...(cloudData?.profile || {}),
        };

        setName(updated.name);
        storage.saveProfile(updated);
        onSaveProfile(updated);

        // Sync local study state to Firestore
        await syncToFirestore(user.uid, {
          profile: updated,
          notes: storage.getNotes(),
          flashcards: storage.getFlashcards(),
          mockTests: storage.getMockTests(),
          tasks: storage.getTasks(),
          conversations: storage.getConversations(),
        });

        setStatusMessage(`Signed in with Google as ${user.displayName || user.email}!`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setErrorMessage(null);

    try {
      let user;
      if (authMode === 'signup') {
        user = await signUpWithEmail(emailInput.trim(), passwordInput, name.trim() || 'Scholar');
      } else {
        user = await signInWithEmail(emailInput.trim(), passwordInput);
      }

      const cloudData = await loadFromFirestore(user.uid);

      const updated: UserProfile = {
        ...profile,
        userId: user.uid,
        name: user.displayName || name.trim() || 'Scholar',
        email: user.email || emailInput.trim(),
        avatarUrl: user.photoURL || undefined,
        authProvider: 'local',
        ...(cloudData?.profile || {}),
      };

      setName(updated.name);
      storage.saveProfile(updated);
      onSaveProfile(updated);

      // Sync state to Firestore
      await syncToFirestore(user.uid, {
        profile: updated,
        notes: storage.getNotes(),
        flashcards: storage.getFlashcards(),
        mockTests: storage.getMockTests(),
        tasks: storage.getTasks(),
        conversations: storage.getConversations(),
      });

      setStatusMessage(
        authMode === 'signup'
          ? `Account created successfully for ${user.email}!`
          : `Welcome back, ${user.displayName || user.email}!`
      );
      setShowPasswordForm(false);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Email auth error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailInput.trim()) {
      setErrorMessage('Please enter your email above to receive a password reset link.');
      return;
    }
    setAuthLoading(true);
    setErrorMessage(null);
    try {
      await sendResetPasswordEmail(emailInput.trim());
      setResetSent(true);
      setStatusMessage(`Password reset link sent to ${emailInput.trim()}! Check your inbox.`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleManualCloudSync = async () => {
    if (!profile.userId) return;
    setSyncingCloud(true);
    setErrorMessage(null);
    try {
      await syncToFirestore(profile.userId, {
        profile,
        notes: storage.getNotes(),
        flashcards: storage.getFlashcards(),
        mockTests: storage.getMockTests(),
        tasks: storage.getTasks(),
        conversations: storage.getConversations(),
      });
      setStatusMessage('All study notes, flashcards & progress synced to Google Firestore!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Cloud sync failed.');
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    onLogout();
  };

  const computeGradeLevel = (): GradeLevel => {
    if (educationCategory === 'school') {
      const classNum = parseInt(selectedClass.replace('Class ', ''), 10);
      if (classNum <= 5) return 'Class 1-5 (Primary)';
      if (classNum <= 8) return 'Class 6-8 (Middle School)';
      if (classNum <= 10) return 'Class 9-10 (Secondary)';
      return 'Class 11-12 (Higher Secondary)';
    }
    if (educationCategory === 'college' || educationCategory === 'university') {
      return 'College / Undergraduate';
    }
    if (educationCategory === 'competitive') {
      return 'Competitive Exams (JEE / NEET / SAT / AP / GRE)';
    }
    return 'Independent Learner';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGrade = computeGradeLevel();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Scholar',
      educationCategory,
      grade: finalGrade,
      selectedClass: educationCategory === 'school' ? selectedClass : undefined,
      collegeCourse:
        educationCategory === 'college' || educationCategory === 'university'
          ? collegeCourse.trim() || undefined
          : undefined,
      competitiveExamCategory:
        educationCategory === 'competitive' ? competitiveExamCategory : undefined,
      primaryGoal,
      primarySubject,
      preferredLanguage: preferredLanguage.trim() || 'English',
      defaultStyle,
      dailyStudyTargetMinutes: dailyTarget,
    };
    storage.saveProfile(updated);
    onSaveProfile(updated);

    if (profile.userId) {
      syncToFirestore(profile.userId, { profile: updated }).catch(console.warn);
    }

    setStatusMessage('Profile preferences saved!');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };

  const handleExport = () => {
    const dataStr = storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oryqen-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Study data exported successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const success = storage.importAllData(text);
      if (success) {
        setStatusMessage('Study data imported successfully!');
        onDataImported();
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 1500);
      } else {
        setErrorMessage('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const isAuthenticated = Boolean(profile.userId || profile.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Student Profile & Cloud Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.email ? profile.email : 'Local Study Workspace'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="rounded-xl bg-emerald-600 p-2.5 text-center text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Real Authentication & Firestore Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-500" /> Real Authentication & Cloud Sync
            </span>
            {isAuthenticated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {profile.authProvider === 'google' ? 'Google Account' : 'Verified Student'}
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={name}
                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/20 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleManualCloudSync}
                    disabled={syncingCloud}
                    title="Synchronize study notes & flashcards with Firestore"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-900/40 hover:bg-violet-100 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
                    <span>{syncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30">
                <Cloud className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Real Cloud Storage active: Your notes, mock tests, and flashcards sync automatically to Google Firestore.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Google 1-Click Sign In */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs hover:shadow text-xs font-bold text-slate-800 dark:text-slate-100 transition-all disabled:opacity-50"
              >
                {authLoading ? (
                  <div className="h-4 w-4 border-2 border-slate-400 border-t-violet-600 rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>Sign in with Google Account</span>
              </button>

              {/* Email & Password Toggle */}
              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full text-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline pt-1"
                >
                  Or sign in / create account with Email & Password
                </button>
              ) : (
                <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-lg text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          authMode === 'signin'
                            ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          authMode === 'signup'
                            ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Hide
                    </button>
                  </div>

                  <form onSubmit={handleEmailAuthSubmit} className="space-y-2.5">
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your student name"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Password
                        </label>
                        {authMode === 'signin' && (
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[10px] text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {authLoading ? (
                        <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : authMode === 'signup' ? (
                        <UserPlus className="w-3.5 h-3.5" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5" />
                      )}
                      <span>{authMode === 'signup' ? 'Create Account' : 'Sign In with Password'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Academic Preferences Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Education Track
              </label>
              <select
                value={educationCategory}
                onChange={e => setEducationCategory(e.target.value as EducationCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="school">School (Classes 1 - 12 / NCERT / CBSE / ICSE)</option>
                <option value="college">College / University Degree</option>
                <option value="competitive">Competitive Exams (JEE / NEET / UPSC / etc.)</option>
                <option value="independent">Independent Learner / Professional</option>
              </select>
            </div>
          </div>

          {educationCategory === 'school' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Grade Level
              </label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1} (NCERT / CBSE)
                  </option>
                ))}
              </select>
            </div>
          )}

          {educationCategory === 'college' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course / Major
              </label>
              <input
                type="text"
                value={collegeCourse}
                onChange={e => setCollegeCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science, MBBS, B.Com"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          )}

          {educationCategory === 'competitive' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Competitive Exam
              </label>
              <select
                value={competitiveExamCategory}
                onChange={e => setCompetitiveExamCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="Engineering (JEE / BITSAT)">JEE Main & Advanced / BITSAT</option>
                <option value="Medical (NEET / AIIMS)">NEET UG / Medical</option>
                <option value="Civil Services (UPSC / State PSC)">UPSC / State PCS</option>
                <option value="Banking & SSC">Banking / SSC CGL</option>
                <option value="International (SAT / AP / GRE)">SAT / AP Exams / GRE</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Subject
              </label>
              <select
                value={primarySubject}
                onChange={e => setPrimarySubject(e.target.value as SubjectCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="General Science">General Science</option>
                <option value="History & Social Studies">History & Social Studies (SST)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="English & Languages">English & Languages</option>
                <option value="Computer Science">Computer Science / Coding</option>
                <option value="Foundation & Olympiads">Foundation & Olympiads (IIT-JEE / NEET)</option>
                <option value="UPSC General Studies">UPSC General Studies</option>
                <option value="Economics & Commerce">Economics & Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Learning Goal
              </label>
              <select
                value={primaryGoal}
                onChange={e => setPrimaryGoal(e.target.value as LearningGoal)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="exam_prep">Exam Preparation & High Scores</option>
                <option value="learn_anything">Deep Conceptual Understanding</option>
                <option value="both">Both (Holistic Mastery)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Language
              </label>
              <input
                type="text"
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value)}
                placeholder="e.g. English, Hindi, Hinglish, Marathi"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Explanation Depth
              </label>
              <select
                value={defaultStyle}
                onChange={e => setDefaultStyle(e.target.value as ExplanationStyle)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="intuitive">Intuitive (Analogies & Simple terms)</option>
                <option value="rigorous">Rigorous (Formal proofs & Definitions)</option>
                <option value="bullet_points">High-Yield Bullet Points</option>
                <option value="formula_first">Formula & Derivation First</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Study Target (Minutes): <span className="font-bold text-violet-600 dark:text-violet-400">{dailyTarget} mins</span>
            </label>
            <input
              type="range"
              min="15"
              max="240"
              step="15"
              value={dailyTarget}
              onChange={e => setDailyTarget(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Backup all notes, flashcards, and tests as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Restore study data from JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-500/20 transition-all hover:scale-[1.02]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
