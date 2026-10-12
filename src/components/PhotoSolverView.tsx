import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  BookmarkPlus,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { GradeLevel, SubjectCategory, UserProfile, ProviderStatus } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { api, ChatResponseData } from '../lib/api';

interface PhotoSolverViewProps {
  profile: UserProfile;
  providerStatus: ProviderStatus | null;
  onSaveAsNote: (title: string, content: string, subject: SubjectCategory) => void;
  onCreateFlashcard: (front: string, back: string, subject: SubjectCategory) => void;
}

export const PhotoSolverView: React.FC<PhotoSolverViewProps> = ({
  profile,
  providerStatus,
  onSaveAsNote,
  onCreateFlashcard,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [studentPrompt, setStudentPrompt] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(profile.grade);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>(profile.primarySubject);
  const [isLoading, setIsLoading] = useState(false);
  const [solutionResult, setSolutionResult] = useState<ChatResponseData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic'].includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please compress or crop the photo.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      setBase64Data(dataUrl);
      setSolutionResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Data(null);
    setSolutionResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!base64Data || !selectedFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await api.solvePhotoQuestion({
        imageBase64: base64Data,
        mimeType: selectedFile.type,
        questionPrompt: studentPrompt.trim() || undefined,
        grade: selectedGrade,
        subject: selectedSubject,
      });

      setSolutionResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo solution failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!solutionResult) return;
    navigator.clipboard.writeText(solutionResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto bg-transparent text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header Title */}
        <div className="border-b border-slate-200/60 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Camera className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Multimodal Vision Solver
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Photo Question Solver
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Snap or upload a photo of textbook problems, handwritten formulas, or diagram questions.
            The AI transcribes readable text, verifies the method, and writes a step-by-step solution.
          </p>
        </div>

        {/* Floating Notification */}
        {notice && (
          <div className="fixed top-16 right-4 z-50 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            {notice}
          </div>
        )}

        {/* Grid Setup: Left image upload, Right parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Upload Area */}
          <div className="space-y-4">
            <div className="clay-card p-6 rounded-3xl">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Upload Textbook or Handwritten Problem
              </label>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 clay-card-flat p-8 text-center cursor-pointer hover:scale-101 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to select photo or drag & drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, or WebP up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={previewUrl}
                    alt="Problem to solve"
                    className="max-h-80 w-full object-contain mx-auto"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="rounded-lg bg-rose-900/80 backdrop-blur-xs p-1 text-white hover:bg-rose-800"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-2 bg-slate-900/90 text-center text-xs text-slate-400 border-t border-slate-800">
                    {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Configuration & Action Card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                2. Academic Context
              </label>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Education Level</label>
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value as GradeLevel)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Class 1-5 (Primary)">Class 1-5 (Primary)</option>
                  <option value="Class 6-8 (Middle School)">Class 6-8 (Middle School)</option>
                  <option value="Class 9-10 (Secondary)">Class 9-10 (Secondary)</option>
                  <option value="Class 11-12 (Higher Secondary)">Class 11-12 (Higher Secondary)</option>
                  <option value="College / Undergraduate">College / Undergraduate</option>
                  <option value="Competitive Exams (JEE / NEET / SAT / AP / GRE)">
                    Competitive Exams
                  </option>
                  <option value="Independent Learner">Independent Learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject Domain</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value as SubjectCategory)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General Science">General Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Optional Question or Specific Sub-part
                </label>
                <input
                  type="text"
                  value={studentPrompt}
                  onChange={e => setStudentPrompt(e.target.value)}
                  placeholder="e.g. Solve part (b) only, or explain step 3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!base64Data || isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing & Transcribing Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze & Solve Question</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/60 p-4 text-xs text-rose-200 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-100">Solver Encountered an Issue:</p>
              <p className="mt-1 whitespace-pre-wrap">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Solution Output Card */}
        {solutionResult && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-6 space-y-4 shadow-sm animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="font-display font-bold text-base text-white">
                  Step-by-Step Verified Solution
                </span>
                <span className="text-xs text-slate-400">
                  via {solutionResult.providerUsed} ({solutionResult.modelUsed})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSaveAsNote(
                      `Photo Solution: ${selectedSubject} (${new Date().toLocaleDateString()})`,
                      solutionResult.content,
                      selectedSubject
                    );
                    showNotification('Saved to Notes!');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  <span>Save Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onCreateFlashcard(
                      `Question from Photo (${selectedSubject})`,
                      solutionResult.content.slice(0, 300),
                      selectedSubject
                    );
                    showNotification('Added to Flashcard review queue!');
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Flashcard</span>
                </button>
              </div>
            </div>

            {/* Rendered Math and Solution Markdown */}
            <div className="prose-slate text-sm leading-relaxed text-slate-200">
              <MarkdownRenderer content={solutionResult.content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
