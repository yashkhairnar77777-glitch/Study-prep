import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Upload,
  ArrowRight,
  Sparkles,
  Crown,
  FileCheck,
  Tag,
  Smartphone,
  Eye,
} from 'lucide-react';
import {
  SubscriptionTier,
  BillingDuration,
  UserProfile,
  PlanConfig,
  MerchantPaymentConfig,
} from '../types';
import { subscriptionService } from '../lib/subscriptionService';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  initialPlan?: SubscriptionTier;
  initialDuration?: BillingDuration;
  initialCouponCode?: string;
  plans: PlanConfig[];
  merchantConfig?: MerchantPaymentConfig;
  onSuccess: () => void;
  onNavigateToMySubscription: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialPlan = 'plus',
  initialDuration = 'monthly',
  initialCouponCode,
  plans,
  merchantConfig,
  onSuccess,
  onNavigateToMySubscription,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(initialPlan);
  const [selectedDuration, setSelectedDuration] = useState<BillingDuration>(initialDuration);

  // Form inputs
  const [studentEmail, setStudentEmail] = useState(userProfile.email || 'student@oryqen.ai');
  const [studentName, setStudentName] = useState(userProfile.name || 'Student');
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | undefined>(undefined);
  const [screenshotName, setScreenshotName] = useState<string | undefined>(undefined);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    freePlan?: SubscriptionTier;
    durationDays?: number;
    description?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    requestId: string;
    status: string;
    plan: string;
    amount: number;
  } | null>(null);

  const [showFullQrCard, setShowFullQrCard] = useState<boolean>(false);

  // Update when props change
  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
    if (initialDuration) setSelectedDuration(initialDuration);
    if (userProfile.email) setStudentEmail(userProfile.email);
    if (userProfile.name) setStudentName(userProfile.name);
    if (initialCouponCode) {
      setCouponCode(initialCouponCode);
      handleApplyCoupon(initialCouponCode);
    }
  }, [initialPlan, initialDuration, userProfile, isOpen, initialCouponCode]);

  if (!isOpen) return null;

  const activePlanConfig = plans.find(p => p.id === selectedPlan) || plans[1] || {
    id: 'plus',
    name: 'Scholar Plus',
    monthlyPrice: 99,
    yearlyPrice: 999,
  };

  const merchantUpi = merchantConfig?.merchantUpiId || '9922321046@mbk';
  const merchantName = merchantConfig?.merchantName || 'Archana Prakash Khairnar';
  const verifiedQrImage = merchantConfig?.qrImageUrl || '/assets/aistudio/Screenshot_20261104_205858_MobiKwik_885c48cb.jpg';

  // Base price calculation
  const rawAmount = selectedDuration === 'yearly'
    ? activePlanConfig.yearlyPrice
    : activePlanConfig.monthlyPrice;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.freePlan) {
      discountAmount = rawAmount; // 100% discount
    } else if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((rawAmount * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(rawAmount, appliedCoupon.discountAmount);
    }
  }

  const finalAmount = Math.max(0, rawAmount - discountAmount);

  // UPI deep link
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(`ORYQEN_${selectedPlan.toUpperCase()}_${studentEmail}`)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiPayUrl
  )}&margin=8`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApplyCoupon = async (codeToUse?: string) => {
    const code = (codeToUse || couponCode).trim().toUpperCase();
    if (!code) return;

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const val = await subscriptionService.validateCoupon(code, studentEmail);
      if (!val || !val.isValid) {
        setCouponError(val?.reason || val?.error || 'Invalid or expired coupon code.');
        setAppliedCoupon(null);
      } else {
        const freePlan =
          val.freePlan ||
          val.freePlanGranted ||
          (val.coupon?.type === 'free_pro' ? 'pro' : val.coupon?.type === 'free_plus' ? 'plus' : undefined);

        if (freePlan) {
          setSelectedPlan(freePlan);
        }

        setAppliedCoupon({
          code: val.coupon?.code || code,
          discountPercent: val.discountPercent,
          discountAmount: val.discountAmount,
          freePlan: freePlan,
          durationDays: val.durationDays || val.coupon?.durationDays,
          description:
            val.coupon?.description ||
            (freePlan
              ? `100% Free ${freePlan.toUpperCase()} access for ${val.durationDays || 30} days`
              : 'Discount coupon applied'),
        });
        setCouponError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Coupon check failed';
      setCouponError(msg);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Screenshot file size must be under 5MB.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Instant 100% Free Coupon Redemption
  const handleInstantCouponRedeem = async () => {
    if (!appliedCoupon) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await subscriptionService.redeemCoupon(
        appliedCoupon.code,
        studentEmail,
        studentName,
        appliedCoupon.freePlan || selectedPlan
      );
      const planGranted = res.planGranted || appliedCoupon.freePlan || selectedPlan;
      setSubmissionSuccess({
        requestId: `CPN-${appliedCoupon.code}`,
        status: 'approved',
        plan: planGranted,
        amount: 0,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to redeem coupon';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit UPI Payment Request
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setSubmitError('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }

    if (!payerUpiId.trim() || !payerUpiId.includes('@')) {
      setSubmitError('Please enter a valid Payer UPI ID (e.g. name@okhdfcbank).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await subscriptionService.submitUpiPayment({
        studentEmail,
        studentName,
        payerUpiId: payerUpiId.trim(),
        utrNumber: cleanUtr,
        plan: selectedPlan,
        duration: selectedDuration,
        amount: finalAmount,
        couponCodeApplied: appliedCoupon ? appliedCoupon.code : undefined,
        discountAmount,
        screenshotBase64,
      });

      setSubmissionSuccess({
        requestId: res.paymentRequest.id,
        status: res.paymentRequest.status,
        plan: res.paymentRequest.plan,
        amount: res.paymentRequest.amount,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment submission failed';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              {selectedPlan === 'pro' ? (
                <Crown className="w-5 h-5 text-amber-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {submissionSuccess ? 'Payment Request Received' : 'UPI Subscription Checkout'}
              </h3>
              <p className="text-xs text-indigo-200/80">
                Official Guardian-Managed Verified Merchant • Zero Surcharge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {submissionSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
              <FileCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {submissionSuccess.status === 'approved' ? 'Instant Activation' : 'Pending Verification'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {submissionSuccess.status === 'approved'
                  ? 'Your Subscription is Active!'
                  : 'Payment Request Submitted Successfully!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {submissionSuccess.status === 'approved'
                  ? `Your ${submissionSuccess.plan.toUpperCase()} tier has been unlocked immediately.`
                  : 'Our administrator will independently verify the UTR reference with our merchant bank statement. Your subscription will be activated promptly.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Reference ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {submissionSuccess.requestId}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Plan:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {submissionSuccess.plan} Tier
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Payable Amount:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{submissionSuccess.amount}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMySubscription();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Go to My Subscription
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Plan & Billing Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Tier & Billing Duration
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('plus')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPlan === 'plus'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      Scholar Plus
                    </span>
                    {selectedPlan === 'plus' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                    ₹99 <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPlan === 'pro'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      Mastery Pro
                    </span>
                    {selectedPlan === 'pro' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                    ₹199 <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </div>
                </button>
              </div>

              {/* Monthly vs Yearly Switch */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setSelectedDuration('monthly')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedDuration === 'monthly'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Monthly Billing (₹{activePlanConfig.monthlyPrice})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDuration('yearly')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    selectedDuration === 'yearly'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>Yearly Billing (₹{activePlanConfig.yearlyPrice})</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full">
                    Save ~16%
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Coupon Code Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Have a Coupon or Friend Access Code?</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo, pass, or scholarship code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs uppercase font-mono tracking-wider bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span> applied: {appliedCoupon.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Instant 100% Free Coupon Activation */}
              {appliedCoupon && appliedCoupon.freePlan && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleInstantCouponRedeem}
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Redeem 100% Free Access Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Verified Merchant Payment QR & UPI ID */}
            {(!appliedCoupon || !appliedCoupon.freePlan) && (
              <>
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        2. Pay via Any UPI App
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Amount to Pay: <span className="text-indigo-600 dark:text-indigo-400 text-base">₹{finalAmount}</span>
                        {discountAmount > 0 && (
                          <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                            ₹{rawAmount}
                          </span>
                        )}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Merchant</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Verified QR Code Card */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="relative p-2 rounded-2xl bg-white border-2 border-indigo-500/40 shadow-md">
                        {/* Direct display of user's uploaded MobiKwik QR code */}
                        <div className="relative w-44 h-44 overflow-hidden rounded-xl bg-white flex items-center justify-center">
                          <img
                            src={verifiedQrImage}
                            alt="Scan MobiKwik Pocket UPI QR Code - Archana Prakash Khairnar"
                            className="w-full h-full object-cover object-[center_60%] scale-150"
                          />
                        </div>
                        <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-lg shadow-sm" title="Verified MobiKwik QR Code">
                          <QrCode className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowFullQrCard(!showFullQrCard)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{showFullQrCard ? 'Hide Full Statement' : 'View Full MobiKwik Statement'}</span>
                      </button>
                    </div>

                    {/* Payee Name, UPI ID & App Icons */}
                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Verified Guardian / Payee Name:
                        </span>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                          <span>{merchantName}</span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            Verified Merchant
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Verified UPI ID (MobiKwik Pocket UPI):
                        </span>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-xs font-bold text-slate-900 dark:text-white justify-between">
                          <span className="truncate">{merchantUpi}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 shrink-0 cursor-pointer"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Instant Deep Link Button for Mobile Apps */}
                      <div>
                        <a
                          href={upiPayUrl}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-transform active:scale-95 cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Pay ₹{finalAmount} directly via UPI app</span>
                        </a>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          Supports all major UPI applications:
                        </p>
                        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'MobiKwik', 'Cred', 'Amazon Pay'].map(app => (
                            <span
                              key={app}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional Full MobiKwik Statement Preview */}
                  {showFullQrCard && (
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Original MobiKwik Verified Payment Statement:</span>
                        <button
                          type="button"
                          onClick={() => setShowFullQrCard(false)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px]"
                        >
                          Close Preview
                        </button>
                      </div>
                      <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white">
                        <img
                          src={verifiedQrImage}
                          alt="Full MobiKwik Verification Card"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Safety Warning */}
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-2.5 text-[11px] text-amber-900 dark:text-amber-300">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <strong className="font-bold">Important Security Notice:</strong> Never enter your UPI PIN, OTP, or passwords on ORYQEN. Payments occur strictly in your authorized UPI app. A screenshot or UTR alone is not final proof; every request is independently verified against official merchant bank records.
                    </div>
                  </div>
                </div>

                {/* Step 4: Submission Form */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    3. Submit Payment Reference for Verification
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Registered Email
                      </label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={e => setStudentEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Student Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Payer UPI ID (Used to pay)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. yourname@okhdfcbank"
                        value={payerUpiId}
                        onChange={e => setPayerUpiId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        12-Digit UPI Ref / UTR Number
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={20}
                        placeholder="e.g. 412345678901"
                        value={utrNumber}
                        onChange={e => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                        className="w-full px-3 py-2 text-xs font-mono tracking-wider bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Screenshot upload (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Payment Screenshot (Optional, for speedier matching)
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="truncate">
                        {screenshotName || 'Attach transaction receipt screenshot (PNG/JPEG)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Payment for Verification (₹{finalAmount})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
