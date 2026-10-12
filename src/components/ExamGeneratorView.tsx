import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Printer,
  Play,
  FileCheck,
  ChevronDown,
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import {
  GradeLevel,
  SubjectCategory,
  ExamPaper,
  UserProfile,
} from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { api } from '../lib/api';

interface ExamGeneratorViewProps {
  profile: UserProfile;
  onStartMockTest: (paper: ExamPaper) => void;
}

export const ExamGeneratorView: React.FC<ExamGeneratorViewProps> = ({
  profile,
  onStartMockTest,
}) => {
  const [grade, setGrade] = useState<GradeLevel>(profile.grade);
  const [subject, setSubject] = useState<SubjectCategory>(profile.primarySubject);
  const [topicsInput, setTopicsInput] = useState('Newtonian Mechanics, Kinematics, Energy');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Competitive'>('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [totalMarks, setTotalMarks] = useState(25);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questionTypes, setQuestionTypes] = useState<
    ('mcq' | 'short' | 'long' | 'true_false' | 'fill_in_the_blank')[]
  >(['mcq', 'short']);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<ExamPaper | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleType = (t: 'mcq' | 'short' | 'long' | 'true_false' | 'fill_in_the_blank') => {
    if (questionTypes.includes(t)) {
      if (questionTypes.length > 1) {
        setQuestionTypes(questionTypes.filter(item => item !== t));
      }
    } else {
      setQuestionTypes([...questionTypes, t]);
    }
  };

  const handleGenerate = async () => {
    const parsedTopics = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (parsedTopics.length === 0) {
      setErrorMessage('Please provide at least one topic.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setShowAnswerKey(false);

    try {
      const paper = await api.generateExam({
        grade,
        subject,
        topics: parsedTopics,
        difficulty,
        numQuestions,
        questionTypes,
        totalMarks,
        durationMinutes,
        specialInstructions: specialInstructions.trim() || undefined,
      });

      setGeneratedPaper(paper);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Exam generation failed';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Award className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Assessment Engine
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Custom Exam Paper Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build rigorous, curriculum-aligned exam papers for your grade and syllabus.
            Print as a practice test or launch immediately in timed Mock Test mode with instant scoring.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-5 space-y-5">
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Exam Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Education Level</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as GradeLevel)}
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
              <label className="block text-xs text-slate-400 mb-1">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as SubjectCategory)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
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
              <label className="block text-xs text-slate-400 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy (Foundational)</option>
                <option value="Medium">Medium (Standard Board)</option>
                <option value="Hard">Hard (Advanced Rigor)</option>
                <option value="Competitive">Competitive / Olympiad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Syllabus Topics (comma-separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={e => setTopicsInput(e.target.value)}
              placeholder="e.g. Thermodynamics, Heat Transfer, Carnot Cycle"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Question Types Toggle */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Question Formats</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mcq', label: 'Multiple Choice (MCQ)' },
                { id: 'short', label: 'Short Answer' },
                { id: 'long', label: 'Long Answer / Proofs' },
                { id: 'true_false', label: 'True / False' },
                { id: 'fill_in_the_blank', label: 'Fill in the Blanks' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleType(t.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    questionTypes.includes(t.id as any)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Number of Questions</label>
              <input
                type="number"
                min={2}
                max={25}
                value={numQuestions}
                onChange={e => setNumQuestions(Math.max(2, Math.min(25, Number(e.target.value))))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Total Marks</label>
              <input
                type="number"
                min={5}
                max={100}
                value={totalMarks}
                onChange={e => setTotalMarks(Math.max(5, Math.min(100, Number(e.target.value))))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Math.max(5, Math.min(180, Number(e.target.value))))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40 transition-all active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Curriculum Practice Paper...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Practice Paper</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/60 p-4 text-xs text-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Generated Exam Display */}
        {generatedPaper && (
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-6 space-y-6 shadow-sm print:bg-white print:text-black print:border-none">
            {/* Disclaimer & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 print:hidden">
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <span className="font-semibold">AI Generated Practice Paper:</span>
                <span>Unofficial mock material tailored for preparation.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white"
                >
                  {showAnswerKey ? 'Hide Answer Key' : 'Reveal Answer Key'}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Paper</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartMockTest(generatedPaper)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Start Mock Test</span>
                </button>
              </div>
            </div>

            {/* Paper Header Layout */}
            <div className="text-center space-y-1.5 border-b border-slate-700 pb-4">
              <h2 className="font-display text-xl font-bold text-white print:text-black">
                {generatedPaper.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 print:text-gray-700">
                <span>Subject: {generatedPaper.subject}</span>
                <span>·</span>
                <span>Time: {generatedPaper.durationMinutes} Minutes</span>
                <span>·</span>
                <span>Maximum Marks: {generatedPaper.totalMarks}</span>
                <span>·</span>
                <span>Level: {generatedPaper.difficulty}</span>
              </div>
            </div>

            {/* General Instructions */}
            {generatedPaper.instructions && (
              <div className="rounded-xl bg-slate-900/60 p-3.5 text-xs text-slate-300 print:bg-gray-100 print:text-black">
                <p className="font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  General Instructions:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {generatedPaper.instructions.map((inst, idx) => (
                    <li key={idx}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions by Sections */}
            <div className="space-y-6">
              {generatedPaper.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-4">
                  <div className="border-b border-slate-700/80 pb-1">
                    <h3 className="font-display font-semibold text-sm text-indigo-400 uppercase tracking-wider print:text-indigo-900">
                      {section.sectionName} — {section.description}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="rounded-xl border border-slate-700/60 bg-slate-850 p-4 space-y-2.5 print:bg-white print:border-gray-300"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-bold text-sm text-slate-200 print:text-black">
                            Q{qIdx + 1}. {q.question}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-indigo-300 border border-indigo-500/30 rounded px-1.5 py-0.5 print:text-black">
                            [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </span>
                        </div>

                        {/* MCQ Options if available */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-2 text-slate-300 print:bg-gray-50 print:text-black"
                              >
                                <span className="font-semibold mr-1.5">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Answer Key & Explanation if toggled */}
                        {showAnswerKey && (
                          <div className="mt-3 rounded-lg border border-emerald-800/60 bg-emerald-950/40 p-3 text-xs text-emerald-200 space-y-1 print:bg-green-50 print:text-green-950">
                            <p className="font-bold text-emerald-300">
                              Answer: {q.correctAnswer}
                            </p>
                            <div className="prose-emerald text-xs pt-1 leading-relaxed">
                              <MarkdownRenderer content={q.stepByStepSolution} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
