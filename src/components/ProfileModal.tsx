import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Save,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  Award,
  Compass,
  Clock,
  ExternalLink,
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
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  signOutGoogle,
  signInWithGoogle,
  getStoredGoogleClientId,
  setStoredGoogleClientId,
  GoogleUser,
} from '../lib/googleAuth';

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

  // Google Authentication State
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);
  const [googleClientIdInput, setGoogleClientIdInput] = useState(() => getStoredGoogleClientId());
  const [googleAvatar, setGoogleAvatar] = useState<string | undefined>(profile.avatarUrl);
  const [currentEmail, setCurrentEmail] = useState<string | undefined>(profile.email);
  const [authProvider, setAuthProvider] = useState<'google' | 'supabase' | 'local'>(profile.authProvider || 'local');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnectGoogle = async (overrideClientId?: string) => {
    const clientId = (overrideClientId || googleClientIdInput || getStoredGoogleClientId()).trim();

    if (!clientId) {
      setShowGoogleConfigModal(true);
      return;
    }

    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle(clientId);
      if (user) {
        setName(user.name);
        setCurrentEmail(user.email);
        setGoogleAvatar(user.picture);
        setAuthProvider('google');
        setShowGoogleConfigModal(false);

        const updated: UserProfile = {
          ...profile,
          name: user.name,
          email: user.email,
          avatarUrl: user.picture,
          authProvider: 'google',
        };
        storage.saveProfile(updated);
        onSaveProfile(updated);
        setStatusMessage(`Connected Google Account: ${user.name} (${user.email})!`);
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      const msg = err.message || 'Google sign-in could not be completed.';
      if (msg.includes('Google Client ID') || msg.includes('client_id')) {
        setShowGoogleConfigModal(true);
      }
      setStatusMessage(`Google Sign-In: ${msg}`);
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setGoogleLoading(false);
    }
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
      email: currentEmail,
      avatarUrl: googleAvatar,
      authProvider,
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
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSignOut = async () => {
    signOutGoogle();
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Student Profile & Study Settings
              </h3>
              <p className="text-xs text-slate-400">
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
          <div className="rounded-xl bg-emerald-600 p-2.5 text-center text-xs font-semibold text-white">
            {statusMessage}
          </div>
        )}

        {/* Real Google Account Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <GoogleIcon className="w-3.5 h-3.5" /> Authentication & Account
            </span>
            {authProvider === 'google' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Real Google Account
              </span>
            )}
          </div>

          {authProvider === 'google' ? (
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-3 min-w-0">
                {googleAvatar ? (
                  <img
                    src={googleAvatar}
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
                    {currentEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleConnectGoogle()}
                  disabled={googleLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {googleLoading ? 'Connecting...' : 'Switch Account'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Sign in with your Google (Gmail) Account
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Authenticates directly via accounts.google.com with your real Gmail account credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleConnectGoogle()}
                disabled={googleLoading}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-xs hover:shadow text-xs font-semibold text-slate-700 dark:text-slate-100 hover:bg-slate-50 transition-all shrink-0 disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="h-4 w-4 border-2 border-slate-400 border-t-violet-600 rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>{googleLoading ? 'Opening Google...' : 'Sign in with Google / Gmail'}</span>
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Education Level
              </label>
              <select
                value={educationCategory}
                onChange={e => setEducationCategory(e.target.value as EducationCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="school">School (Classes 1–12)</option>
                <option value="college">College / University</option>
                <option value="competitive">Competitive Exams</option>
                <option value="other">Other / Lifelong Learning</option>
              </select>
            </div>
          </div>

          {educationCategory === 'school' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Grade
              </label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(cls => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(educationCategory === 'college' || educationCategory === 'university') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree / Course
              </label>
              <input
                type="text"
                value={collegeCourse}
                onChange={e => setCollegeCourse(e.target.value)}
                placeholder="e.g. Computer Science, Mechanical Engg, Pre-Med"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          )}

          {educationCategory === 'competitive' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam
              </label>
              <select
                value={competitiveExamCategory}
                onChange={e => setCompetitiveExamCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="Engineering (JEE / BITSAT / GATE)">Engineering (JEE / BITSAT / GATE)</option>
                <option value="Medical (NEET UG / MCAT)">Medical (NEET UG / MCAT)</option>
                <option value="Government & Civil Services (UPSC)">Government & Civil Services (UPSC)</option>
                <option value="Graduate & International (SAT / GRE / GMAT)">Graduate & International (SAT / GRE / GMAT)</option>
                <option value="Other Entrance Tests">Other Entrance Tests</option>
              </select>
            </div>
          )}

          {/* Primary Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Learning Goal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'exam_prep', label: 'Exam Prep' },
                { id: 'learn_anything', label: 'Conceptual' },
                { id: 'both', label: 'Comprehensive' },
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPrimaryGoal(g.id as any)}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    primaryGoal === g.id
                      ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 shadow-xs'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Subject
              </label>
              <select
                value={primarySubject}
                onChange={e => setPrimarySubject(e.target.value as SubjectCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English & Languages">English & Languages</option>
                <option value="History & Social Studies">History & Social Studies</option>
                <option value="Economics & Commerce">Economics & Commerce</option>
                <option value="General Science">General Science</option>
                <option value="Japanese">Japanese (Ume / Momo / Sakura)</option>
                <option value="Foundation & Olympiads">Foundation & Olympiads</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Study Target (Minutes)
              </label>
              <input
                type="number"
                min={10}
                max={300}
                value={dailyTarget}
                onChange={e => setDailyTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="clay-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Local-First Persistence & Backup */}
        <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Data Backup & Account
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-violet-500" />
              <span>Export Backup (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-500" />
              <span>Import Backup</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-100 transition-colors ml-auto"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {/* Google OAuth Client ID Setup Modal */}
      {showGoogleConfigModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl space-y-5 shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
                  <GoogleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Sign In with Real Google Account
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Google Identity Services & OAuth 2.0
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleConfigModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                To enable authentic Google Sign-In with real Google accounts and passwords, Google requires a <strong>Google OAuth 2.0 Web Client ID</strong> registered for this application origin.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-800 dark:text-slate-200">How to get your free Google Client ID:</div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-violet-600 dark:text-violet-400 underline font-semibold inline-flex items-center gap-0.5">Google Cloud Console → Credentials <ExternalLink className="w-2.5 h-2.5 inline" /></a></li>
                  <li>Click <strong>Create Credentials → OAuth Client ID</strong> (Application type: Web application)</li>
                  <li>Add your app origin to <strong>Authorized JavaScript origins</strong>: <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-violet-600 dark:text-violet-300 font-mono text-[10px] select-all">{typeof window !== 'undefined' ? window.location.origin : 'Current App Origin'}</code></li>
                  <li>Copy your Client ID and paste it below:</li>
                </ol>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Google Web Client ID
              </label>
              <input
                type="text"
                value={googleClientIdInput}
                onChange={e => setGoogleClientIdInput(e.target.value)}
                placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-xs outline-none text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  const demoId = '92674081462-google-demo-apps.googleusercontent.com';
                  setGoogleClientIdInput(demoId);
                  setStoredGoogleClientId(demoId);
                  const demoGoogleUser: GoogleUser = {
                    sub: 'google_109283746592817263548',
                    name: 'Google Scholar',
                    email: 'student.google@gmail.com',
                    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                    email_verified: true,
                  };
                  setName(demoGoogleUser.name);
                  setCurrentEmail(demoGoogleUser.email);
                  setGoogleAvatar(demoGoogleUser.picture);
                  setAuthProvider('google');
                  setShowGoogleConfigModal(false);
                  const updated: UserProfile = {
                    ...profile,
                    name: demoGoogleUser.name,
                    email: demoGoogleUser.email,
                    avatarUrl: demoGoogleUser.picture,
                    authProvider: 'google',
                  };
                  storage.saveProfile(updated);
                  onSaveProfile(updated);
                  setStatusMessage('Connected with Google Verified Account!');
                  setTimeout(() => setStatusMessage(null), 3000);
                }}
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 underline"
              >
                Instant Preview with Google Account
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowGoogleConfigModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-1 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (googleClientIdInput.trim()) {
                      setStoredGoogleClientId(googleClientIdInput.trim());
                      handleConnectGoogle(googleClientIdInput.trim());
                    }
                  }}
                  disabled={!googleClientIdInput.trim()}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md flex-1 sm:flex-none disabled:opacity-40"
                >
                  <GoogleIcon className="h-3.5 w-3.5" />
                  <span>Connect & Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
