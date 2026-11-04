import React from 'react';
import { Lock, Sparkles, Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { SubscriptionTier } from '../types';
import { FEATURE_REQUIREMENTS, FeatureKey } from '../lib/subscriptionService';

interface SubscriptionLockBadgeProps {
  requiredTier: SubscriptionTier;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const SubscriptionLockBadge: React.FC<SubscriptionLockBadgeProps> = ({
  requiredTier,
  label,
  className = '',
  onClick,
}) => {
  const isPro = requiredTier === 'pro';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-transform active:scale-95 ${
        isPro
          ? 'bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-xs'
          : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
      } ${onClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'} ${className}`}
    >
      <Lock className="w-3 h-3 shrink-0" />
      <span>{label || (isPro ? 'Pro Feature' : 'Plus Feature')}</span>
    </button>
  );
};

interface FeatureLockCardProps {
  featureKey: FeatureKey;
  currentTier: SubscriptionTier;
  onUpgradeClick: (targetPlan?: SubscriptionTier) => void;
  className?: string;
}

export const FeatureLockCard: React.FC<FeatureLockCardProps> = ({
  featureKey,
  onUpgradeClick,
  className = '',
}) => {
  const info = FEATURE_REQUIREMENTS[featureKey] || {
    name: 'Premium Feature',
    description: 'This high-performance study tool is reserved for upgraded members.',
    requiredTier: 'plus' as SubscriptionTier,
  };

  const isPro = info.requiredTier === 'pro';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        isPro
          ? 'border-amber-300/80 dark:border-amber-600/40 bg-gradient-to-br from-amber-50/90 via-rose-50/40 to-indigo-50/40 dark:from-amber-950/30 dark:via-purple-950/20 dark:to-slate-900'
          : 'border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950'
      } p-6 shadow-md transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isPro
                ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-amber-500/25'
                : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-indigo-500/25'
            }`}
          >
            {isPro ? <Crown className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isPro
                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                    : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200'
                }`}
              >
                <Lock className="w-2.5 h-2.5" />
                Requires {isPro ? 'Mastery Pro' : 'Scholar Plus'}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {info.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              {info.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => onUpgradeClick(info.requiredTier)}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-95 cursor-pointer ${
            isPro
              ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 shadow-amber-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
          }`}
        >
          <span>Upgrade to {isPro ? 'Pro' : 'Plus'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Zero software lock-in • Student-friendly pricing • Instant friend coupons
        </span>
        <button
          onClick={() => onUpgradeClick(info.requiredTier)}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
        >
          Compare all plans →
        </button>
      </div>
    </div>
  );
};
