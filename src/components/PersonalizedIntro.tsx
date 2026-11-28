import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Compass, Stethoscope, Atom } from 'lucide-react';
import { GoalConfig } from '../types';
import { OryqenLogo } from './OryqenLogo';

interface PersonalizedIntroProps {
  goalConfig: GoalConfig;
  studentName?: string;
  onComplete: () => void;
}

export const PersonalizedIntro: React.FC<PersonalizedIntroProps> = ({
  goalConfig,
  studentName,
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  const copyByKind = {
    upsc: {
      eyebrow: `UPSC Civil Services · Target ${goalConfig.targetExamYear || '2026'}`,
      headline: 'Welcome, Future IAS.',
      subtitle: 'Your journey towards civil services begins here.',
      detail: `${goalConfig.upscFocusStage || 'Prelims + Mains'} · ${goalConfig.upscOptionalSubject || 'General Studies Core'}`,
      accentText: 'text-amber-600 dark:text-amber-400',
      accentBg: 'bg-amber-600 hover:bg-amber-700',
      Icon: Compass,
    },
    jee: {
      eyebrow: `${goalConfig.jeeStream || 'IIT-JEE'} · Target ${goalConfig.targetExamYear || '2026'}`,
      headline: 'Welcome, Future Engineer.',
      subtitle: 'Build the knowledge that shapes tomorrow.',
      detail: 'Physics · Chemistry · Mathematics',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      accentBg: 'bg-indigo-600 hover:bg-indigo-700',
      Icon: Atom,
    },
    neet: {
      eyebrow: `NEET-UG Medical · Target ${goalConfig.targetExamYear || '2026'}`,
      headline: 'Welcome, Future Doctor.',
      subtitle: 'Your journey towards medicine starts here.',
      detail: 'Biology · Chemistry · Physics',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-600 hover:bg-emerald-700',
      Icon: Stethoscope,
    },
    school: {
      eyebrow: `${goalConfig.selectedClass || 'School'} · ${goalConfig.board} · ${goalConfig.academicYear}`,
      headline: 'Welcome, Future Achiever.',
      subtitle: 'Your potential has no limits.',
      detail: `${goalConfig.medium} Medium · ${goalConfig.dailyStudyTargetMinutes} min daily goal`,
      accentText: 'text-indigo-600 dark:text-indigo-400',
      accentBg: 'bg-indigo-600 hover:bg-indigo-700',
      Icon: BookOpen,
    },
  };

  const content = copyByKind[goalConfig.kind];
  const Icon = content.Icon;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 px-6 py-6 sm:px-12 sm:py-8 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Personalized Learning Introduction"
    >
      {/* Top Bar: Brand & Skip Option */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <OryqenLogo size="md" showWordmark={true} />
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 min-h-[40px] rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/70 transition-colors cursor-pointer whitespace-nowrap"
        >
          Skip intro
        </button>
      </div>

      {/* Center Editorial Reveal */}
      <div className="max-w-3xl w-full mx-auto my-auto py-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <Icon className={`w-4 h-4 ${content.accentText} shrink-0`} />
            <span>{content.eyebrow}</span>
          </div>

          <div className="space-y-3">
            {studentName && (
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.35 }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                {studentName}
              </motion.p>
            )}

            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.14, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
            >
              {content.headline}
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.24, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
            >
              {content.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.34, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>{content.detail}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>One active goal · Saved progress</span>
            </div>

            <button
              type="button"
              onClick={onComplete}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl text-sm font-semibold text-white ${content.accentBg} transition-colors cursor-pointer whitespace-nowrap shrink-0`}
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Quiet Footer Note */}
      <div className="max-w-5xl w-full mx-auto text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Your active syllabus and study tools are ready.</span>
        <span className="hidden sm:inline">Press Enter or Escape to continue</span>
      </div>
    </div>
  );
};
