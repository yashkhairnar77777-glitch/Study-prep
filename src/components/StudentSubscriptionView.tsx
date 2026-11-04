import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Sparkles,
  Crown,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  RefreshCw,
  Lock,
  ChevronRight,
  FileText,
  History,
} from 'lucide-react';
import {
  UserProfile,
  StudentSubscription,
  PaymentRequest,
  CouponRedemption,
  PlanConfig,
  MerchantPaymentConfig,
  SubscriptionTier,
} from '../types';
import { subscriptionService, FEATURE_REQUIREMENTS } from '../lib/subscriptionService';
import { UpiPaymentModal } from './UpiPaymentModal';

interface StudentSubscriptionViewProps {
  userProfile: UserProfile;
  onNavigateToPricing: () => void;
}

export const StudentSubscriptionView: React.FC<StudentSubscriptionViewProps> = ({
  userProfile,
  onNavigateToPricing,
}) => {
  const [subscription, setSubscription] = useState<StudentSubscription | null>(null);
  const [planConfig, setPlanConfig] = useState<PlanConfig | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemption[]>([]);
  const [allPlans, setAllPlans] = useState<PlanConfig[]>([]);
  const [merchantConfig, setMerchantConfig] = useState<MerchantPaymentConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Upgrade modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<SubscriptionTier>('plus');

  const studentEmail = userProfile.email || 'student@oryqen.ai';

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, requestsRes, plansRes] = await Promise.all([
        subscriptionService.getStatus(studentEmail),
        subscriptionService.getMyRequests(studentEmail),
        subscriptionService.getPlans(),
      ]);

      setSubscription(statusRes.subscription);
      setPlanConfig(statusRes.planConfig);
      setMerchantConfig(statusRes.merchantConfig);
      setRequests(requestsRes.requests);
      setRedemptions(requestsRes.redemptions);
      if (plansRes.plans) setAllPlans(plansRes.plans);
    } catch (err) {
      console.warn('Failed to load subscription dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentEmail]);

  const currentPlan = subscription?.plan || 'free';
  const isFree = currentPlan === 'free';
  const isPlus = currentPlan === 'plus';
  const isPro = currentPlan === 'pro';

  // Format expiry
  const formatExpiry = (expiresAt?: number) => {
    if (!expiresAt || expiresAt === 0) return 'Lifetime (Free Forever)';
    const date = new Date(expiresAt);
    const now = Date.now();
    const diffDays = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expired';
    return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${diffDays} days remaining)`;
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Subscription & Billing Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              My Subscription
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Manage your active tier, view verified payment history, and unlock advanced study features.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onNavigateToPricing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Compare All Plans</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Plan Card */}
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg ${
            isPro
              ? 'border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-slate-900 dark:from-amber-950/40 dark:via-purple-950/30 dark:to-slate-950'
              : isPlus
              ? 'border-indigo-300 dark:border-indigo-700/60 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-slate-900 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-slate-950'
              : 'border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                    isPro
                      ? 'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-amber-500/30'
                      : isPlus
                      ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-500/30'
                      : 'bg-slate-700 shadow-slate-500/20'
                  }`}
                >
                  {isPro ? (
                    <Crown className="w-6 h-6" />
                  ) : isPlus ? (
                    <Sparkles className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white capitalize">
                      {planConfig?.name || `${currentPlan} Learner`}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        subscription?.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : subscription?.status === 'expired'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}
                    >
                      {subscription?.status || 'active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Account: <strong className="text-slate-700 dark:text-slate-300">{studentEmail}</strong>
                  </p>
                </div>
              </div>

              {/* Activation & Expiry Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Activated: <strong>{subscription?.activatedAt ? new Date(subscription.activatedAt).toLocaleDateString() : 'Active'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Expiry: <strong className="text-indigo-600 dark:text-indigo-400">{formatExpiry(subscription?.expiresAt)}</strong>
                  </span>
                </div>

                {subscription?.source && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Granted via: <strong className="capitalize">{subscription.source.replace('_', ' ')}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Upgrade CTA button */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {!isPro && (
                <button
                  onClick={() => {
                    setTargetPlan(isPlus ? 'pro' : 'plus');
                    setCheckoutModalOpen(true);
                  }}
                  className={`py-3 px-5 rounded-2xl font-bold text-xs text-white shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                    isPlus
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-amber-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upgrade to {isPlus ? 'Mastery Pro' : 'Scholar Plus'}</span>
                </button>
              )}

              {isPro && (
                <button
                  onClick={() => {
                    setTargetPlan('pro');
                    setCheckoutModalOpen(true);
                  }}
                  className="py-3 px-5 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Extend Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feature Access Grid: Available vs Locked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unlocked Features */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Unlocked on Your Plan</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Active
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(FEATURE_REQUIREMENTS)
                .filter(([_, info]) => {
                  if (currentPlan === 'pro') return true;
                  if (currentPlan === 'plus') return info.requiredTier !== 'pro';
                  return info.requiredTier === 'free';
                })
                .map(([key, info]) => (
                  <div key={key} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {info.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {info.description}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Locked Features (Rule 2: Don't hide locked features, explain what they do & show upgrade button) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <span>Locked Features</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Upgrade Required
              </span>
            </div>

            {currentPlan === 'pro' ? (
              <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <Crown className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  You Have Full Mastery Pro Access!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Every feature and high-capacity tool is unlocked for your account.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(FEATURE_REQUIREMENTS)
                  .filter(([_, info]) => {
                    if (currentPlan === 'free') return info.requiredTier !== 'free';
                    if (currentPlan === 'plus') return info.requiredTier === 'pro';
                    return false;
                  })
                  .map(([key, info]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-start gap-2.5">
                        <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span>{info.name}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                              info.requiredTier === 'pro'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}>
                              Requires {info.requiredTier}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {info.description}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setTargetPlan(info.requiredTier);
                          setCheckoutModalOpen(true);
                        }}
                        className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Unlock →
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment History Table (Rule 5 & 10) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>UPI Payment Requests & History</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent bank verification tracking with 12-digit UTR references.
              </p>
            </div>

            <button
              onClick={() => {
                setTargetPlan('plus');
                setCheckoutModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              New Payment Request
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                No payment requests submitted yet.
              </p>
              <p className="text-[11px] text-slate-400">
                When you submit a UPI payment, its real-time verification progress will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Request ID</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Plan & Duration</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Amount</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">UTR / Ref</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Submitted At</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {req.id}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {req.approvedPlan || req.plan}
                        </span>{' '}
                        <span className="text-slate-400 capitalize">({req.duration})</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        ₹{req.amount}
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        {req.utrNumber}
                      </td>
                      <td className="p-3 text-slate-500">
                        {formatTimestamp(req.submittedAt)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          }`}
                        >
                          {req.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {req.status === 'pending' && <Clock className="w-3 h-3" />}
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Redeemed Coupons History */}
        {redemptions.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Redeemed Coupons</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {redemptions.map(red => (
                <div
                  key={red.id}
                  className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {red.couponCode}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Granted {red.planGranted?.toUpperCase()} ({red.durationDaysGranted || 30} days)
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatTimestamp(red.redeemedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* UPI Checkout Modal */}
      <UpiPaymentModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        userProfile={userProfile}
        initialPlan={targetPlan}
        plans={allPlans}
        merchantConfig={merchantConfig}
        onSuccess={() => {
          loadData();
        }}
        onNavigateToMySubscription={loadData}
      />
    </div>
  );
};
