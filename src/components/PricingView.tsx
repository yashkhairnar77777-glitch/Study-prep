import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  ArrowRight,
  Crown,
  Lock,
  Tag,
  Gift,
  QrCode,
  Info,
  Clock,
} from 'lucide-react';
import {
  SubscriptionTier,
  BillingDuration,
  PlanConfig,
  StudentSubscription,
  UserProfile,
  MerchantPaymentConfig,
} from '../types';
import { subscriptionService } from '../lib/subscriptionService';
import { storage } from '../lib/storage';
import { UpiPaymentModal } from './UpiPaymentModal';

interface PricingViewProps {
  onBackToDashboard: () => void;
  userProfile: UserProfile;
  onNavigateToMySubscription: () => void;
  onProfileUpdated?: (updatedProfile: UserProfile) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onBackToDashboard,
  userProfile,
  onNavigateToMySubscription,
  onProfileUpdated,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingDuration>('monthly');
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [currentSub, setCurrentSub] = useState<StudentSubscription | null>(null);
  const [merchantConfig, setMerchantConfig] = useState<MerchantPaymentConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Modal checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<SubscriptionTier>('plus');
  const [checkoutInitialCoupon, setCheckoutInitialCoupon] = useState<string>('');

  // Coupon inline input
  const [quickCoupon, setQuickCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, [userProfile.email]);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      const statusRes = await subscriptionService.getStatus(userProfile.email);
      setCurrentSub(statusRes.subscription);
      setMerchantConfig(statusRes.merchantConfig);

      const plansRes = await subscriptionService.getPlans();
      if (plansRes.plans && plansRes.plans.length > 0) {
        setPlans(plansRes.plans);
      }
    } catch (err) {
      console.warn('Failed to load subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCheckout = (planId: SubscriptionTier) => {
    setCheckoutTargetPlan(planId);
    setCheckoutInitialCoupon('');
    setCheckoutModalOpen(true);
  };

  const handleApplyQuickCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = quickCoupon.trim().toUpperCase();
    if (!code) return;

    try {
      const val = await subscriptionService.validateCoupon(code, userProfile.email || 'student@oryqen.ai');
      if (!val || !val.isValid) {
        setCouponStatus({ success: false, message: val?.reason || val?.error || 'Invalid or expired coupon code.' });
      } else {
        // If it's a 100% free plan coupon, activate immediately
        if (val.isFreeAccess || val.freePlan) {
          const res = await subscriptionService.redeemCoupon(code, userProfile.email || 'student@oryqen.ai', userProfile.name);
          const grantedPlan = res.planGranted || val.freePlan || 'plus';
          setCouponStatus({
            success: true,
            message: `🎉 Success! Activated ${grantedPlan.toUpperCase()} plan for ${res.durationDaysGranted || val.durationDays || 30} days!`,
          });
          setQuickCoupon('');
          await loadSubscriptionData();
          if (onProfileUpdated) {
            onProfileUpdated({ ...userProfile, subscriptionTier: grantedPlan });
          }
        } else {
          // If it's a discount coupon, open checkout with it
          setCheckoutInitialCoupon(code);
          setCouponStatus({
            success: true,
            message: `🎉 Discount coupon ${code} verified (${val.discountPercent ? `${val.discountPercent}% OFF` : `₹${val.discountAmount} OFF`})! Opening checkout...`,
          });
          setTimeout(() => {
            setCheckoutTargetPlan('plus');
            setCheckoutModalOpen(true);
          }, 600);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Coupon check failed';
      setCouponStatus({ success: false, message: msg });
    }
  };

  const currentPlanId = currentSub?.plan || 'free';

  // Fallback plans if loading or offline
  const displayPlans: PlanConfig[] = plans.length > 0 ? plans : [
    {
      id: 'free',
      name: 'Free Forever',
      tagline: 'Basic AI tutor and core homework study tools.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Basic AI tutor (10 questions/day fair usage)',
        'Basic NCERT chapter revision notes',
        '20 Spaced repetition flashcards',
        '3 Practice mock quizzes per month',
        'Photo question solver (up to 5/day)',
        'Local study planner & checklist',
      ],
      limits: {
        aiQuestionsPerDay: 10,
        mockTestsPerMonth: 3,
        flashcardsLimit: 20,
        pdfAnalysisPageLimit: 3,
        customStudyPacksPerWeek: 3,
        oralExamAccess: false,
        subjectiveGrading: false,
        highCapacityModels: false,
      },
    },
    {
      id: 'plus',
      name: 'Scholar Plus',
      tagline: 'Accelerated revision, visual NCERT sheets, and higher AI capacity.',
      monthlyPrice: 99,
      yearlyPrice: 999,
      badge: 'RECOMMENDED',
      popular: true,
      features: [
        'Higher AI tutor limit (50 questions/day)',
        'Detailed NCERT Visual Graphic Study Sheets',
        'Up to 200 Leitner spaced-repetition flashcards',
        '20 Full practice tests & quizzes per month',
        'AI Oral Viva test mode with keyword scoring',
        'Formula reference sheets generation',
        'Document analysis up to 25 pages',
        'Fast-lane multi-provider model routing',
      ],
      limits: {
        aiQuestionsPerDay: 50,
        mockTestsPerMonth: 20,
        flashcardsLimit: 200,
        pdfAnalysisPageLimit: 25,
        customStudyPacksPerWeek: 20,
        oralExamAccess: true,
        subjectiveGrading: true,
        highCapacityModels: false,
      },
    },
    {
      id: 'pro',
      name: 'Mastery Pro',
      tagline: 'High-capacity AI reasoning, full PDF processing, and custom board exams.',
      monthlyPrice: 199,
      yearlyPrice: 1999,
      badge: 'MAX POWER',
      features: [
        'Highest fair-usage AI limits (200 questions/day)',
        'High-capacity reasoning models (Gemini Pro, Claude 3.5, Llama 3.3 70B)',
        'Unlimited Photo Solver with step-by-step diagram analysis',
        'Full-length PDF textbook analysis (up to 200 pages)',
        'Unlimited practice exams with custom marking rubrics',
        'Deep subjective evaluation with mark breakdowns',
        'Unlimited AI Oral Viva examiner sessions',
        'All upcoming premium tools unlocked',
      ],
      limits: {
        aiQuestionsPerDay: 200,
        mockTestsPerMonth: 999,
        flashcardsLimit: 9999,
        pdfAnalysisPageLimit: 200,
        customStudyPacksPerWeek: 999,
        oralExamAccess: true,
        subjectiveGrading: true,
        highCapacityModels: true,
      },
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Student Pricing • Zero Surcharge UPI • No Forced Subscriptions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Study Plans for Every Learner
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Start completely free forever. Upgrade to <strong className="text-indigo-600 dark:text-indigo-400">Scholar Plus</strong> or <strong className="text-amber-600 dark:text-amber-400">Mastery Pro</strong> for interactive voice vivas, visual NCERT sheets, and deep board-level exam preparation.
          </p>

          {/* Billing Switch */}
          <div className="pt-3 flex items-center justify-center gap-4">
            <span
              className={`text-xs font-bold transition-colors ${
                billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </span>

            <button
              onClick={() => setBillingCycle(c => (c === 'monthly' ? 'yearly' : 'monthly'))}
              className="w-13 h-7 bg-indigo-600 rounded-full p-1 transition-colors relative cursor-pointer shadow-inner"
              aria-label="Toggle billing frequency"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-xs font-bold transition-colors ${
                billingCycle === 'yearly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
              } flex items-center gap-1.5`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Save ~16%
              </span>
            </span>
          </div>

          {/* Current Status Pill if logged in */}
          {currentSub && (
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Your Current Plan:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                currentPlanId === 'pro'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : currentPlanId === 'plus'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}>
                {currentPlanId === 'pro' && <Crown className="w-3 h-3 text-amber-500" />}
                {currentPlanId === 'plus' && <Sparkles className="w-3 h-3 text-indigo-500" />}
                {currentPlanId} Tier
              </span>
              <button
                onClick={onNavigateToMySubscription}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-1"
              >
                View Details →
              </button>
            </div>
          )}
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayPlans.map(plan => {
            const isCurrent = currentPlanId === plan.id;
            const isPlus = plan.id === 'plus';
            const isPro = plan.id === 'pro';
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const periodLabel = plan.id === 'free' ? 'forever' : billingCycle === 'yearly' ? 'per year' : 'per month';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  isPro
                    ? 'border-2 border-amber-400 dark:border-amber-500/60 bg-gradient-to-b from-amber-50/60 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xl shadow-amber-500/10'
                    : isPlus
                    ? 'border-2 border-indigo-500 dark:border-indigo-500/80 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 dark:from-indigo-950/25 dark:via-slate-900 dark:to-slate-900 shadow-xl shadow-indigo-500/10'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm'
                }`}
              >
                {/* Badge if present */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                      isPro ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-indigo-600'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {plan.name}
                        {isPro && <Crown className="w-4 h-4 text-amber-500" />}
                        {isPlus && <Sparkles className="w-4 h-4 text-indigo-500" />}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {plan.tagline}
                      </p>
                    </div>

                    {isCurrent && (
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                        ₹{price}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        / {periodLabel}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.id !== 'free' && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        ≈ ₹{Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      What's Included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPro
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : isPlus
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call to action button */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  {isCurrent ? (
                    <button
                      onClick={onNavigateToMySubscription}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Manage Active Plan
                    </button>
                  ) : plan.id === 'free' ? (
                    <button
                      onClick={onBackToDashboard}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Continue with Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                        isPro
                          ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 shadow-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                      }`}
                    >
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Coupon Redemption Bar (Rule 8) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Have an Access Voucher, Scholarship Pass, or Referral Code?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Enter your promotional voucher, institutional scholarship code, or friend study pass for immediate free access or checkout discounts.
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyQuickCoupon} className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <input
                type="text"
                placeholder="Enter Promo or Voucher Code"
                value={quickCoupon}
                onChange={e => setQuickCoupon(e.target.value.toUpperCase())}
                className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors cursor-pointer shrink-0"
              >
                Redeem Code
              </button>
            </form>
          </div>

          {couponStatus && (
            <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              couponStatus.success
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
            }`}>
              {couponStatus.success ? <Check className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-rose-600" />}
              <span>{couponStatus.message}</span>
            </div>
          )}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="space-y-4 pt-4">
          <div className="text-center space-y-1">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Detailed Feature Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Honest limits and clear breakdown across tiers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Feature / Limit</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-center">Free Learner</th>
                  <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400 text-center">Scholar Plus</th>
                  <th className="p-4 font-bold text-amber-600 dark:text-amber-400 text-center">Mastery Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">Daily AI Tutor Inquiries</td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">10 questions/day</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">50 questions/day</td>
                  <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">200 questions/day</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">NCERT Visual Graphic Notes</td>
                  <td className="p-4 text-center text-slate-400">Standard Text Only</td>
                  <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">Graphic Sheets Included</td>
                  <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">Graphic Sheets Included</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">Interactive AI Oral Viva</td>
                  <td className="p-4 text-center text-slate-400">Locked</td>
                  <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">Full Access</td>
                  <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">Unlimited Sessions</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">Practice Mock Tests</td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">3 tests / month</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">20 tests / month</td>
                  <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">Leitner Flashcard Capacity</td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">20 cards</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">200 cards</td>
                  <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">Unlimited (9,999)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">PDF Document Analysis Limit</td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">3 pages</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">25 pages</td>
                  <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">200 pages (Full Book)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">High-Capacity Reasoning Models</td>
                  <td className="p-4 text-center text-slate-400">Standard</td>
                  <td className="p-4 text-center text-slate-600 dark:text-slate-400">Standard + Multi-failover</td>
                  <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">Gemini Pro & 70B Priority</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">CBSE/ICSE Custom Marking Rubrics</td>
                  <td className="p-4 text-center text-slate-400">No</td>
                  <td className="p-4 text-center text-slate-400">Basic Criteria</td>
                  <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">Deep Step-wise Breakdown</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Honest Guarantees & Safety Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Data Loss Policy</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              When a paid plan expires, your notes, flashcards, chats, and mock test scores are NEVER deleted. You seamlessly return to Free tier.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <QrCode className="w-4 h-4" />
              <span>Direct Bank UPI Verification</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pay via any certified UPI app using standard 12-digit UTR references. No credit card required and no automatic sneaky renewals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>Fast Human Review</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Payments are verified against merchant statements by authorized administrators promptly. Track status anytime in My Subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout UPI Modal */}
      <UpiPaymentModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        userProfile={userProfile}
        initialPlan={checkoutTargetPlan}
        initialDuration={billingCycle}
        initialCouponCode={checkoutInitialCoupon}
        plans={displayPlans}
        merchantConfig={merchantConfig}
        onSuccess={() => {
          loadSubscriptionData();
          const updated = storage.getProfile();
          if (onProfileUpdated) onProfileUpdated(updated);
        }}
        onNavigateToMySubscription={onNavigateToMySubscription}
      />
    </div>
  );
};
