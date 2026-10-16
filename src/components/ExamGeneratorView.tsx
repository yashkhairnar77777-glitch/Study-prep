import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Printer,
  Play,
  Clock,
  HelpCircle,
  BookOpen,
  Layers,
  ChevronDown,
  CheckCircle2,
  FileCheck,
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
      setErrorMessage('Please provide at least one topic or chapter.');
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
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
            <Award className="h-4 w-4" />
            <span>Assessment & Test Engine</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Exam & Mock Test Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build rigorous examination papers aligned to your syllabus.
            Print for offline practice or launch directly in interactive timed test simulation.
          </p>
        </div>

        {/* Configuration Groups */}
        <div className="clay-card p-6 rounded-3xl space-y-6">
          {/* Group 1: Academic Level & Syllabus */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-white/5 pb-2">
              <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>1. Academic Level & Syllabus</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Grade Level
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value as GradeLevel)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Class 1-5 (Primary)">Class 1-5 (Primary)</option>
                  <option value="Class 6-8 (Middle School)">Class 6-8 (Middle School)</option>
                  <option value="Class 9-10 (Secondary)">Class 9-10 (Secondary)</option>
                  <option value="Class 11-12 (Higher Secondary)">Class 11-12 (Higher Secondary)</option>
                  <option value="College / Undergraduate">College / Undergraduate</option>
                  <option value="Competitive Exams (JEE / NEET / SAT / AP / GRE)">
                    Competitive Exams (JEE / NEET / SAT / AP / GRE)
                  </option>
                  <option value="Independent Learner">Independent Learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value as SubjectCategory)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chapters or Topics to Cover
              </label>
              <input
                type="text"
                value={topicsInput}
                onChange={e => setTopicsInput(e.target.value)}
                placeholder="Comma separated topics (e.g. Chemical Equilibrium, Le Chatelier, pH Calculations)"
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Group 2: Assessment Blueprint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-white/5 pb-2">
              <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>2. Assessment Blueprint</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Competitive">Competitive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Questions
                </label>
                <select
                  value={numQuestions}
                  onChange={e => setNumQuestions(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={8}>8 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={totalMarks}
                  onChange={e => setTotalMarks(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Mins)
                </label>
                <select
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins</option>
                  <option value={90}>90 mins</option>
                </select>
              </div>
            </div>

            {/* Question Types checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Question Formats Included:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'mcq' as const, label: 'Multiple Choice (MCQ)' },
                  { id: 'short' as const, label: 'Short Answer' },
                  { id: 'long' as const, label: 'Long / Essay' },
                  { id: 'true_false' as const, label: 'True / False' },
                  { id: 'fill_in_the_blank' as const, label: 'Fill in the Blank' },
                ].map(type => {
                  const isChecked = questionTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleType(type.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isChecked
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-violet-400'
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Group 3: Optional Criteria */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Special Board / Examination Criteria (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Include negative marking (-1 for MCQ), align to CBSE Class 10 term exam"
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 clay-btn-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-40"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Exam Paper & Scoring Rubrics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Exam Paper</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Exam Paper Preview */}
        {generatedPaper && (
          <div className="clay-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in fade-in">
            {/* Header / Meta */}
            <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Examination Paper
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {generatedPaper.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>{generatedPaper.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>{generatedPaper.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{generatedPaper.durationMinutes} Minutes</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Max Marks: {generatedPaper.totalMarks}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-1.5"
                  title="Print paper"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span>Print Paper</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartMockTest(generatedPaper)}
                  className="px-4 py-2 rounded-xl clay-btn-primary font-bold text-xs flex items-center gap-2 text-white shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Mock Test</span>
                </button>
              </div>
            </div>

            {/* General Instructions */}
            {generatedPaper.instructions && generatedPaper.instructions.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Instructions:
                </div>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {generatedPaper.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Question Sections */}
            <div className="space-y-6">
              {generatedPaper.sections.map((section, sIndex) => (
                <div key={sIndex} className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-white/10 pb-2">
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {section.sectionName}
                    </h3>
                    {section.description && (
                      <p className="text-xs text-slate-500">{section.description}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="p-4.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <span className="font-bold text-violet-600 dark:text-violet-400">
                            Q{qIndex + 1}.
                          </span>
                          <div className="flex-1 font-semibold text-slate-800 dark:text-slate-100 text-sm">
                            <MarkdownRenderer content={q.question} />
                          </div>
                          <span className="font-bold text-slate-500 text-xs shrink-0">
                            [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </span>
                        </div>

                        {/* Options if MCQ */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                            {q.options.map((opt, oIndex) => (
                              <div
                                key={oIndex}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 font-medium"
                              >
                                <span className="font-bold mr-1.5">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Answer Key & Rubric Preview Toggle */}
                        {showAnswerKey && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-1.5 animate-in fade-in">
                            <div className="font-bold text-emerald-800 dark:text-emerald-300">
                              Answer: {q.correctAnswer}
                            </div>
                            <div className="text-slate-600 dark:text-slate-300">
                              <MarkdownRenderer content={q.stepByStepSolution} />
                            </div>
                            {q.rubricOrCriteria && (
                              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                Rubric: {q.rubricOrCriteria}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: Toggle Answer Key */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>{showAnswerKey ? 'Hide Answer Key & Solutions' : 'Reveal Answer Key & Solutions'}</span>
              </button>

              <button
                type="button"
                onClick={() => onStartMockTest(generatedPaper)}
                className="clay-btn-primary px-5 py-2 text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Timed Mock Exam</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
