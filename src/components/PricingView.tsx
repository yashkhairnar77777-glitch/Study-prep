import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  ExternalLink,
  Info,
  ArrowRight,
} from 'lucide-react';

interface PricingViewProps {
  onBackToDashboard: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBackToDashboard }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showIntegrationInfo, setShowIntegrationInfo] = useState(false);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/60 dark:border-indigo-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest & Transparent Student Pricing</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Choose Your Study Plan
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            Start completely free with essential study tools. Upgrade to Pro for high-capacity reasoning, unlimited PDF processing, and custom mock exam papers.
          </p>

          {/* Billing Switch */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold ${
                billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(c => (c === 'monthly' ? 'yearly' : 'monthly'))}
              className="w-12 h-6 bg-indigo-600 rounded-full p-0.5 transition-colors relative cursor-pointer"
              aria-label="Toggle billing"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold ${
                billingCycle === 'yearly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              } flex items-center gap-1`}
            >
              Annual <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full">Save 25%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="clay-card p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Starter Learner
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-sm text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Essential tools for everyday homework help, concept definitions, and flashcard revision.
              </p>

              <div className="pt-4 space-y-3">
                {[
                  'Standard AI Tutor reasoning (Groq / Gemini free tier)',
                  'Photo Question Solver (up to 15 questions/day)',
                  'Leitner 5-box spaced repetition flashcards',
                  'Study planner task management',
                  '3 Practice mock exams per month',
                  'Full local-first data backup and export',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onBackToDashboard}
              className="w-full py-3 clay-btn-secondary font-bold text-xs"
            >
              Current Active Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="clay-card p-8 rounded-3xl flex flex-col justify-between space-y-6 border-2 border-indigo-500/50 relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-[11px] shadow-sm">
              SCHOLAR PRO
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Scholar Pro
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'monthly' ? '$8' : '$6'}
                </span>
                <span className="text-sm text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                High-capacity AI reasoning for college students and competitive exam aspirants.
              </p>

              <div className="pt-4 space-y-3">
                {[
                  'Priority multi-provider routing (Groq, OpenRouter, Gemini)',
                  'Unlimited Photo Question Solver with diagram analysis',
                  'Full-length PDF textbook analysis & semantic search',
                  'Unlimited exam paper generation with custom marking rubrics',
                  'Deep subjective answer evaluation with mark breakdowns',
                  'Export formatted printable exam papers',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowIntegrationInfo(true)}
              className="w-full py-3 clay-btn-primary font-bold text-xs shadow-md"
            >
              Upgrade to Scholar Pro
            </button>
          </div>
        </div>

        {/* Payment Integration Notice (Rule 12 Compliance) */}
        {showIntegrationInfo && (
          <div className="clay-card p-6 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Info className="w-5 h-5 shrink-0" />
              <span>Production Payment Gateways</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              In accordance with security rules, live payments require connecting your merchant account (e.g. Stripe, Lemon Squeezy, or Razorpay webhook). ORYQEN STUDY AI never simulates fake credit-card checkouts or client-side bypass flags. Your current session continues with standard multi-provider AI access.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowIntegrationInfo(false)}
                className="px-4 py-1.5 clay-btn-secondary text-xs font-semibold"
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
