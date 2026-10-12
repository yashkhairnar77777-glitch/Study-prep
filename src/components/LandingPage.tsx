import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Camera,
  FileText,
  Award,
  Check,
  Star,
  Zap,
  ShieldCheck,
  Moon,
  Sun,
  GraduationCap,
  ChevronRight,
  HelpCircle,
  Brain,
} from 'lucide-react';
import { IMAGES } from '../assets/images';

interface LandingPageProps {
  onStartLearning: () => void;
  onLogin: () => void;
  onExploreFeature: (feature: 'chat' | 'photo' | 'doc' | 'exam') => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onLogin,
  onExploreFeature,
  isDark,
  onToggleTheme,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#0a0e1a] text-slate-100' : 'bg-[#f4f2fb] text-slate-800'} transition-colors duration-200 selection:bg-indigo-500/20`}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-[#0a0e1a]/80 border-b border-slate-200/60 dark:border-white/10 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 p-0.5 shadow-md shadow-indigo-500/30 flex items-center justify-center overflow-hidden">
              <img
                src={IMAGES.CLAY_MASCOT}
                alt="ORYQEN Mascot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ORYQEN <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/40">STUDY AI</span>
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              About
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl clay-btn-secondary text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={onLogin}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Log In
            </button>

            <button
              onClick={onStartLearning}
              className="px-4 sm:px-5 py-2.5 clay-btn-primary font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8">
        {/* Soft background pastel blobs for clay ambiance */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-sm text-xs font-semibold text-indigo-600 dark:text-indigo-400 clay-badge">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Next-Gen Claymorphic AI Study Companion</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Learn Smarter, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Not Harder.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Meet your personal 3D AI tutor. Ask tough questions with step-by-step reasoning, snap photos of textbook math problems, extract instant insights from research PDFs, and practice with automated exam generators tailored to your syllabus.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 clay-btn-primary font-bold text-base flex items-center justify-center gap-2.5 shadow-lg group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto px-6 py-3.5 clay-btn-secondary font-semibold text-base flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Explore Features</span>
              </button>
            </div>

            {/* Stats / Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl clay-card-flat text-center">
                <div className="font-display font-extrabold text-xl text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curriculum Aligned</div>
              </div>
              <div className="p-3 rounded-2xl clay-card-flat text-center">
                <div className="font-display font-extrabold text-xl text-indigo-600 dark:text-indigo-400">&lt; 1 sec</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant AI Answers</div>
              </div>
              <div className="p-3 rounded-2xl clay-card-flat text-center">
                <div className="font-display font-extrabold text-xl text-emerald-600 dark:text-emerald-400">Class 1-12</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">+ College & Exams</div>
              </div>
            </div>
          </div>

          {/* Right Mascot & Floating 3D Elements Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main 3D Mascot Clay Card */}
            <div className="relative w-full max-w-md aspect-square rounded-3xl clay-card p-6 flex flex-col items-center justify-center overflow-visible">
              {/* Floating Clay Mascot */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 relative animate-clay-float">
                <img
                  src={IMAGES.CLAY_MASCOT}
                  alt="3D Clay AI Study Mascot"
                  className="w-full h-full object-contain filter drop-shadow-2xl rounded-2xl"
                />
              </div>

              {/* Floating Badge 1: Graduation Cap */}
              <div className="absolute -top-4 -left-3 sm:-left-6 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-2 animate-clay-float-slow clay-card-flat">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Adaptive Level</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Calibrated to your class</div>
                </div>
              </div>

              {/* Floating Badge 2: Formula & Step-by-Step */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-2 animate-clay-float clay-card-flat">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Step-by-Step</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">First-principles logic</div>
                </div>
              </div>

              {/* Floating Star Badge */}
              <div className="absolute top-1/2 -right-5 sm:-right-8 p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-lg text-amber-500 animate-clay-float-slow">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-8 border-t border-slate-200/60 dark:border-white/10 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200/60 dark:border-indigo-800/40">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Study Suite</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Ace Your Exams
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Four specialized academic tools powered by state-of-the-art AI reasoning, designed specifically for students and serious learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: AI Chat Tutor */}
            <div
              onClick={() => onExploreFeature('chat')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Conversational Tutor
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Chat with an AI companion calibrated to your exact grade. Choose explanation styles from Quick Definitions to Exam-Ready bullet points and LaTeX proofs.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Try AI Chat</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2: Photo Solver */}
            <div
              onClick={() => onExploreFeature('photo')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/80 border border-violet-200/80 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  Photo Question Solver
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Stuck on textbook math or science diagrams? Take a photo or upload an image. The AI transcribes the text, breaks down the formula, and verifies every calculation.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400">
                <span>Snap Question</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3: PDF Analysis */}
            <div
              onClick={() => onExploreFeature('doc')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  PDF & Doc Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Upload research papers, lecture notes, or textbook chapters. Ask questions grounded strictly in your document text, generate chapter summaries, or extract key formulas.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Analyze PDF</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4: Exam Generator */}
            <div
              onClick={() => onExploreFeature('exam')}
              className="clay-card clay-card-hover p-6 rounded-3xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Exam Generator & Mocks
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generate full practice test papers with MCQs, short answers, and rubrics. Take timed mock tests in exam simulation mode with automatic scoring and verified answers.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Generate Test</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 border-t border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-[#0c1222]/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How ORYQEN Accelerates Your Learning
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Three simple steps from feeling stuck to mastering any topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="clay-card p-7 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg clay-btn-primary">
                1
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Tell Us What You're Studying
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pick your grade (Class 1–12, College, or Entrance Exams like JEE/NEET/SAT) and your learning target. The AI adjusts its vocabulary and rigor automatically.
              </p>
            </div>

            <div className="clay-card p-7 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white font-bold flex items-center justify-center text-lg clay-btn-primary">
                2
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Ask Questions, Snap Photos, or Upload Notes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Interact with multimodal AI. Ask concept questions, paste homework problems, photograph chalkboard equations, or drop your syllabus chapters.
              </p>
            </div>

            <div className="clay-card p-7 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center text-lg clay-btn-primary">
                3
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Retain with Smart Spaced Revision
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Save key points into Leitner spaced-repetition flashcards and generate mock exam papers before test day to build undeniable exam confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-8 border-t border-slate-200/60 dark:border-white/10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-200/60 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent & Student-Friendly</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Simple, Predictable Plans
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Start completely free with essential learning tools. Upgrade to Pro for high-throughput reasoning and unlimited practice tests.
            </p>

            {/* Billing Toggle */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(c => (c === 'monthly' ? 'yearly' : 'monthly'))}
                className="w-13 h-7 bg-indigo-600 rounded-full p-1 transition-colors relative cursor-pointer"
                aria-label="Toggle billing cycle"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'} flex items-center gap-1.5`}>
                Annual <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">Save 25%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="clay-card p-8 rounded-3xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Starter Learner
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">/ forever</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Ideal for homework help, daily questions, and core school syllabus study.
                </p>

                <div className="pt-4 space-y-3">
                  {[
                    'Standard AI Tutor reasoning (Groq / Gemini free tier)',
                    'Photo Question Solver (up to 15 images/day)',
                    'Interactive Leitner Flashcard system',
                    'Notes manager and local session backup',
                    '3 Mock tests per month',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onStartLearning}
                className="w-full py-3.5 clay-btn-secondary font-bold text-sm cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="clay-card p-8 rounded-3xl flex flex-col justify-between space-y-6 border-2 border-indigo-500/40 relative shadow-xl">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs shadow-md">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Scholar Pro
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
                    {billingCycle === 'monthly' ? '$8' : '$6'}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">/ month</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  For competitive exam candidates, university students, and comprehensive mastery.
                </p>

                <div className="pt-4 space-y-3">
                  {[
                    'Priority high-capacity multi-provider routing',
                    'Unlimited Photo Solver with high-res diagram analysis',
                    'Full-length PDF textbook analysis & document search',
                    'Unlimited practice exam generation with custom rubrics',
                    'Personalized study streak & weak-topic diagnostics',
                    'Export formatted PDF practice exam sheets',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onStartLearning}
                className="w-full py-3.5 clay-btn-primary font-bold text-sm cursor-pointer shadow-lg"
              >
                Upgrade to Scholar Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="py-12 px-4 sm:px-8 border-t border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-[#070b14]/80 text-sm text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                ORYQEN STUDY AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              An intelligent, claymorphism-crafted educational learning companion. Built to empower school students, college undergraduates, and competitive exam aspirants worldwide.
            </p>
          </div>

          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
              Study Tools
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><button onClick={() => onExploreFeature('chat')} className="hover:text-indigo-600 dark:hover:text-indigo-400">AI Chat Tutor</button></li>
              <li><button onClick={() => onExploreFeature('photo')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Photo Question Solver</button></li>
              <li><button onClick={() => onExploreFeature('doc')} className="hover:text-indigo-600 dark:hover:text-indigo-400">PDF Document Analysis</button></li>
              <li><button onClick={() => onExploreFeature('exam')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Exam Generator & Mocks</button></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
              Platform & Legal
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><span className="text-slate-400">Privacy First Architecture</span></li>
              <li><span className="text-slate-400">No telemetry tracking</span></li>
              <li><span className="text-slate-400">Local-first data backup</span></li>
              <li className="pt-2 text-[11px] text-slate-400">© 2026 ORYQEN STUDY AI. All rights reserved.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
