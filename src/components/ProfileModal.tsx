import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Save,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  Award,
  Compass,
  Clock,
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    </div>
  );
};
