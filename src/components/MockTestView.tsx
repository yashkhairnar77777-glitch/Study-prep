import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Award,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { ExamPaper, ExamQuestion, MockTestAttempt, UserProfile } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { storage } from '../lib/storage';
import { api } from '../lib/api';

interface MockTestViewProps {
  paper: ExamPaper;
  profile: UserProfile;
  onExitTest: () => void;
  onSavedAttempt: (attempt: MockTestAttempt) => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({
  paper,
  profile,
  onExitTest,
  onSavedAttempt,
}) => {
  // Flatten all questions across sections
  const allQuestions: ExamQuestion[] = useMemo(() => {
    return paper.sections.flatMap(s => s.questions);
  }, [paper]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'full'>('single');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(paper.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
  const [evaluatingSubjectives, setEvaluatingSubjectives] = useState(false);
  const [testResult, setTestResult] = useState<MockTestAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest(); // auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, timeLeftSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = allQuestions[currentIndex];

  const handleSelectOption = (qId: string, optionText: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  const handleTextAnswerChange = (qId: string, text: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview(prev => {
      const updated = new Set(prev);
      if (updated.has(qId)) updated.delete(qId);
      else updated.add(qId);
      return updated;
    });
  };

  const handleSubmitTest = async () => {
    setIsConfirmingSubmit(false);
    setIsSubmitted(true);
    setEvaluatingSubjectives(true);

    let obtainedTotal = 0;
    const evaluatedResults: MockTestAttempt['questionResults'] = [];

    // 1. Deterministic scoring for objective questions
    for (const q of allQuestions) {
      const userAns = (answers[q.id] || '').trim();
      let marksAwarded = 0;
      let isCorrect = false;

      if (q.type === 'mcq' || q.type === 'true_false') {
        // Deterministic check
        if (q.options && typeof q.correctOptionIndex === 'number') {
          const correctText = q.options[q.correctOptionIndex];
          if (userAns === correctText) {
            marksAwarded = q.marks;
            isCorrect = true;
          }
        } else if (userAns.toLowerCase() === q.correctAnswer.toLowerCase()) {
          marksAwarded = q.marks;
          isCorrect = true;
        }
      } else {
        // Subjective question - evaluate via API if answered, otherwise 0
        if (userAns.length > 5) {
          try {
            const evalRes = await api.evaluateSubjectiveAnswer({
              question: q.question,
              studentAnswer: userAns,
              modelSolution: q.stepByStepSolution || q.correctAnswer,
              maxMarks: q.marks,
              grade: profile.grade,
            });
            marksAwarded = evalRes.awardedMarks;
            isCorrect = marksAwarded >= q.marks * 0.5;
          } catch {
            marksAwarded = Math.round(q.marks * 0.6); // sensible fallback
            isCorrect = true;
          }
        } else {
          marksAwarded = 0;
          isCorrect = false;
        }
      }

      obtainedTotal += marksAwarded;
      evaluatedResults.push({
        questionId: q.id,
        question: q.question,
        userAnswer: userAns || '(Unanswered)',
        correctAnswer: q.correctAnswer,
        marksAwarded,
        maxMarks: q.marks,
        isCorrect,
        explanation: q.stepByStepSolution,
      });
    }

    setEvaluatingSubjectives(false);

    const accuracy =
      paper.totalMarks > 0 ? Math.round((obtainedTotal / paper.totalMarks) * 100) : 0;

    const attempt: MockTestAttempt = {
      id: `attempt-${Date.now()}`,
      examTitle: paper.title,
      grade: paper.grade,
      subject: paper.subject,
      totalMarks: paper.totalMarks,
      obtainedMarks: obtainedTotal,
      accuracyPercentage: accuracy,
      completedAt: Date.now(),
      timeSpentSeconds: paper.durationMinutes * 60 - timeLeftSeconds,
      questionResults: evaluatedResults,
    };

    setTestResult(attempt);
    storage.saveMockTest(attempt);
    onSavedAttempt(attempt);

    // Trigger celebratory confetti if passed (>50%)
    if (accuracy >= 50) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Sticky Test Bar */}
        <div className="sticky top-0 z-20 rounded-2xl border border-slate-700/80 bg-slate-850/95 backdrop-blur-md p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitTest}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div>
              <h2 className="font-display text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {paper.title}
              </h2>
              <p className="text-[11px] text-slate-400">
                {paper.subject} · {paper.grade}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Clock */}
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold ${
                  timeLeftSeconds < 300
                    ? 'bg-rose-950/80 border border-rose-800 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border border-slate-700 text-indigo-300'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="hidden sm:flex rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`rounded px-2.5 py-1 ${
                  viewMode === 'single' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
                }`}
              >
                1-by-1
              </button>
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`rounded px-2.5 py-1 ${
                  viewMode === 'full' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Full Paper
              </button>
            </div>

            {/* Submit Button */}
            {!isSubmitted && (
              <button
                type="button"
                onClick={() => setIsConfirmingSubmit(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
              >
                Submit Paper
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {isConfirmingSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-850 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-display text-lg font-bold text-white">
                  Confirm Paper Submission
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You have answered <span className="font-bold text-white">{answeredCount}</span> of{' '}
                <span className="font-bold text-white">{allQuestions.length}</span> questions.
                {markedForReview.size > 0 && (
                  <span className="block mt-1 text-amber-300">
                    You still have {markedForReview.size} questions marked for review.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingSubmit(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Submit & Score Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post-Test Score Card */}
        {isSubmitted && testResult && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-850 p-6 space-y-5 shadow-lg animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Test Completed!
                  </h3>
                  <p className="text-xs text-slate-400">
                    Time Taken: {Math.floor(testResult.timeSpentSeconds / 60)}m{' '}
                    {testResult.timeSpentSeconds % 60}s
                  </p>
                </div>
              </div>

              {/* Big Score Indicator */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Score</p>
                  <p className="text-2xl font-bold font-mono text-white">
                    {testResult.obtainedMarks} / {testResult.totalMarks}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Accuracy</p>
                  <p
                    className={`text-2xl font-bold font-mono ${
                      testResult.accuracyPercentage >= 75
                        ? 'text-emerald-400'
                        : testResult.accuracyPercentage >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {testResult.accuracyPercentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Review Section */}
            <h4 className="font-display font-semibold text-sm text-slate-200">
              Detailed Question Analysis & Step-by-Step Solutions:
            </h4>

            <div className="space-y-4">
              {testResult.questionResults.map((qr, idx) => (
                <div
                  key={qr.questionId || idx}
                  className={`rounded-xl border p-4 space-y-2.5 ${
                    qr.isCorrect
                      ? 'border-emerald-800/60 bg-emerald-950/20'
                      : 'border-rose-800/60 bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-sm text-slate-200">
                      Q{idx + 1}. {qr.question}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        qr.isCorrect
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : 'bg-rose-900/60 text-rose-300'
                      }`}
                    >
                      {qr.marksAwarded} / {qr.maxMarks} Marks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-900/60 p-2 text-slate-300">
                      <span className="font-semibold text-slate-400 block mb-0.5">
                        Your Answer:
                      </span>
                      <span>{qr.userAnswer}</span>
                    </div>

                    <div className="rounded-lg bg-slate-900/60 p-2 text-emerald-300">
                      <span className="font-semibold text-emerald-400 block mb-0.5">
                        Correct Answer / Standard Key:
                      </span>
                      <span>{qr.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                    <span className="font-semibold text-indigo-300 block mb-1">
                      Step-by-Step Explanation:
                    </span>
                    <MarkdownRenderer content={qr.explanation} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Palette / Navigator */}
        {!isSubmitted && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                Question Palette
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" /> Unanswered
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allQuestions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]?.trim());
                const isFlagged = markedForReview.has(q.id);
                const isCurrent = idx === currentIndex && viewMode === 'single';

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      if (viewMode === 'full') setViewMode('single');
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold font-mono transition-all ${
                      isCurrent ? 'ring-2 ring-indigo-400 scale-105' : ''
                    } ${
                      isFlagged
                        ? 'bg-amber-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Question View Mode */}
        {!isSubmitted && viewMode === 'single' && currentQ && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Question {currentIndex + 1} of {allQuestions.length}
                </span>
                {currentQ.topic && (
                  <span className="text-xs text-slate-500">· {currentQ.topic}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    markedForReview.has(currentQ.id)
                      ? 'bg-amber-600 text-white'
                      : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>
                    {markedForReview.has(currentQ.id) ? 'Flagged' : 'Mark for Review'}
                  </span>
                </button>
                <span className="text-xs font-semibold text-slate-300">
                  [{currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}]
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="font-display font-semibold text-base sm:text-lg text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* MCQ Options */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-xs sm:text-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-xs'
                          : 'border-slate-700 bg-slate-850 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-600 bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Subjective Written Answer */
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">
                  Type your written answer / formula below:
                </label>
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={e => handleTextAnswerChange(currentQ.id, e.target.value)}
                  placeholder="Enter your detailed step-by-step answer..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-700 bg-slate-850 p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between border-t border-slate-700/60 pt-4">
              <button
                type="button"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex(Math.min(allQuestions.length - 1, currentIndex + 1))}
                disabled={currentIndex === allQuestions.length - 1}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-30"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Full Paper View Mode */}
        {!isSubmitted && viewMode === 'full' && (
          <div className="space-y-6">
            {allQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-2">
                  <span className="font-bold text-sm text-white">
                    Q{idx + 1}. {q.question}
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold shrink-0">
                    [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>

                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-600/20 text-white font-medium'
                              : 'border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={e => handleTextAnswerChange(q.id, e.target.value)}
                    placeholder="Enter your written answer..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-700 bg-slate-850 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
