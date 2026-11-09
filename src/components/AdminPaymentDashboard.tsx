import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileCheck,
  Tag,
  Plus,
  Percent,
  Sliders,
  DollarSign,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Lock,
  ArrowRight,
  ExternalLink,
  Crown,
  Sparkles,
  LogOut,
  Building2,
  Copy,
  Check,
  Edit3,
  Smartphone,
  CreditCard,
  QrCode,
  X,
} from 'lucide-react';
import {
  PaymentRequest,
  Coupon,
  CouponRedemption,
  AdminAuditLog,
  PlanConfig,
  MerchantPaymentConfig,
  SubscriptionTier,
  BillingDuration,
  CouponType,
  CouponCategory,
} from '../types';
import { subscriptionService } from '../lib/subscriptionService';
import { AdminPasswordOverlay } from './AdminPasswordOverlay';

interface AdminPaymentDashboardProps {
  adminEmail: string;
  onBackToDashboard: () => void;
}

export const AdminPaymentDashboard: React.FC<AdminPaymentDashboardProps> = ({
  adminEmail,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'coupons' | 'pricing' | 'audit'>('payments');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(subscriptionService.getAdminAuthToken());
  });

  // Payments State
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(null);

  // Review Modal State
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [approvedPlan, setApprovedPlan] = useState<SubscriptionTier>('plus');
  const [approvedDuration, setApprovedDuration] = useState<BillingDuration>('monthly');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemption[]>([]);
  const [createCouponModalOpen, setCreateCouponModalOpen] = useState(false);

  // New Coupon Form
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<CouponType>('free_plus');
  const [newCategory, setNewCategory] = useState<CouponCategory>('FRIEND');
  const [newDiscountValue, setNewDiscountValue] = useState(100);
  const [newDurationDays, setNewDurationDays] = useState(30);
  const [newTargetPlan, setNewTargetPlan] = useState<SubscriptionTier>('plus');
  const [newMaxRedemptions, setNewMaxRedemptions] = useState(100);
  const [newDescription, setNewDescription] = useState('');
  const [submittingCoupon, setSubmittingCoupon] = useState(false);

  // Pricing State
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [merchantConfig, setMerchantConfig] = useState<MerchantPaymentConfig | undefined>(undefined);
  const [pricingEdit, setPricingEdit] = useState<{
    plusMonthly: number;
    plusYearly: number;
    proMonthly: number;
    proYearly: number;
  }>({ plusMonthly: 99, plusYearly: 999, proMonthly: 199, proYearly: 1999 });

  // Merchant & Bank Configuration State
  const [merchantEdit, setMerchantEdit] = useState({
    merchantUpiId: '9922321046@mbk',
    merchantName: 'Archana Prakash Khairnar',
    merchantBank: 'MobiKwik Pocket UPI / MobiKwik Payments',
    accountNumber: '9922321046',
    ifscCode: 'PYTM0123456',
    accountType: 'UPI Wallet & Linked Bank VPA',
    branchName: 'Online / MobiKwik UPI Network',
  });
  const [isEditingMerchant, setIsEditingMerchant] = useState(false);
  const [savingMerchant, setSavingMerchant] = useState(false);
  const [merchantSuccessMsg, setMerchantSuccessMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [adminEmail, activeTab, isAuthenticated]);

  const handleLockAdmin = () => {
    subscriptionService.clearAdminAuthToken();
    setIsAuthenticated(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'payments') {
        const reqs = await subscriptionService.getAdminPayments(adminEmail, {
          status: paymentFilter,
          search: searchQuery,
        });
        setPayments(reqs);
      } else if (activeTab === 'coupons') {
        const res = await subscriptionService.getAdminCoupons(adminEmail);
        setCoupons(res.coupons);
        setRedemptions(res.redemptions);
      } else if (activeTab === 'pricing') {
        const plansRes = await subscriptionService.getPlans();
        if (plansRes.plans) {
          setPlans(plansRes.plans);
          const plusP = plansRes.plans.find(p => p.id === 'plus');
          const proP = plansRes.plans.find(p => p.id === 'pro');
          setPricingEdit({
            plusMonthly: plusP?.monthlyPrice ?? 99,
            plusYearly: plusP?.yearlyPrice ?? 999,
            proMonthly: proP?.monthlyPrice ?? 199,
            proYearly: proP?.yearlyPrice ?? 1999,
          });
        }
        if (plansRes.merchantConfig) {
          const mc = plansRes.merchantConfig;
          setMerchantConfig(mc as MerchantPaymentConfig);
          setMerchantEdit({
            merchantUpiId: mc.merchantUpiId || '9922321046@mbk',
            merchantName: mc.merchantName || 'Archana Prakash Khairnar',
            merchantBank: mc.merchantBank || 'MobiKwik Pocket UPI / MobiKwik Payments',
            accountNumber: mc.accountNumber || '9922321046',
            ifscCode: mc.ifscCode || 'PYTM0123456',
            accountType: mc.accountType || 'UPI Wallet & Linked Bank VPA',
            branchName: mc.branchName || 'Online / MobiKwik UPI Network',
          });
        }
      } else if (activeTab === 'audit') {
        const logs = await subscriptionService.getAdminAuditLogs(adminEmail);
        setAuditLogs(logs);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data';
      if (msg.includes('Access denied') || msg.includes('password') || msg.includes('session')) {
        subscriptionService.clearAdminAuthToken();
        setIsAuthenticated(false);
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (req: PaymentRequest, action: 'approve' | 'reject') => {
    setSelectedPayment(req);
    setReviewAction(action);
    setApprovedPlan(req.plan);
    setApprovedDuration(req.duration);
    setAdminNotes(req.adminNotes || '');
    setRejectionReason(req.rejectionReason || '');
  };

  const handleExecuteReview = async () => {
    if (!selectedPayment) return;
    setSubmittingReview(true);
    try {
      await subscriptionService.reviewPayment(adminEmail, selectedPayment.id, {
        action: reviewAction,
        approvedPlan,
        approvedDuration,
        adminNotes,
        rejectionReason,
      });

      setSelectedPayment(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Review action failed';
      alert(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleGenerateRandomCouponCode = () => {
    const prefix = newCategory === 'FRIEND' ? 'ORYQEN-FRIEND-' : 'ORYQEN-';
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    setNewCode(`${prefix}${rand}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setSubmittingCoupon(true);
    try {
      await subscriptionService.createCoupon(adminEmail, {
        code: newCode.trim().toUpperCase(),
        type: newType,
        category: newCategory,
        discountValue: Number(newDiscountValue),
        durationDays: Number(newDurationDays),
        targetPlan: newTargetPlan,
        maxRedemptions: Number(newMaxRedemptions),
        description: newDescription || `${newType} coupon created by admin`,
      });

      setCreateCouponModalOpen(false);
      setNewCode('');
      setNewDescription('');
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create coupon';
      setErrorMessage(msg);
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const [pricingSuccessMsg, setPricingSuccessMsg] = useState<string | null>(null);

  const handleToggleCoupon = async (couponId: string) => {
    try {
      await subscriptionService.toggleCouponActive(adminEmail, couponId);
      loadAllData();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Toggle failed');
    }
  };

  const handleSavePlanPrices = async () => {
    try {
      await Promise.all([
        subscriptionService.updatePlanPrice(adminEmail, 'plus', pricingEdit.plusMonthly, pricingEdit.plusYearly),
        subscriptionService.updatePlanPrice(adminEmail, 'pro', pricingEdit.proMonthly, pricingEdit.proYearly),
      ]);
      setPricingSuccessMsg('Plan pricing successfully updated on the server!');
      setTimeout(() => setPricingSuccessMsg(null), 4000);
      loadAllData();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update pricing');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveMerchantConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingMerchant(true);
    setErrorMessage(null);
    try {
      const updated = await subscriptionService.updateMerchantConfig(adminEmail, {
        merchantUpiId: merchantEdit.merchantUpiId.trim(),
        merchantName: merchantEdit.merchantName.trim(),
        merchantBank: merchantEdit.merchantBank.trim(),
        accountNumber: merchantEdit.accountNumber.trim(),
        ifscCode: merchantEdit.ifscCode.trim(),
        accountType: merchantEdit.accountType.trim(),
        branchName: merchantEdit.branchName.trim(),
      });
      setMerchantConfig(updated);
      setIsEditingMerchant(false);
      setMerchantSuccessMsg('Real merchant bank & UPI details updated and verified successfully!');
      setTimeout(() => setMerchantSuccessMsg(null), 4000);
      loadAllData();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update merchant bank configuration');
    } finally {
      setSavingMerchant(false);
    }
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <AdminPasswordOverlay
        adminEmail={adminEmail}
        onAuthenticated={() => {
          setIsAuthenticated(true);
        }}
        onCancel={onBackToDashboard}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Authorised Administrator Portal</span>
            </div>
            <h1 className="text-2xl font-black">
              Payment & Subscription Management
            </h1>
            <p className="text-xs text-slate-300">
              Authenticated Admin: <strong className="text-white">{adminEmail}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLockAdmin}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Lock Admin and require password on next entry"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              Return to App
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          {[
            { id: 'payments', label: 'Payment Requests', icon: FileCheck },
            { id: 'coupons', label: 'Coupon & Friends Manager', icon: Tag },
            { id: 'pricing', label: 'Plan Pricing & UPI Settings', icon: Sliders },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <strong>Action Notice:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* TAB 1: PAYMENTS VERIFICATION QUEUE */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student, email, or UTR..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loadAllData()}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setPaymentFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      paymentFilter === f
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Request ID</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Student & Email</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Requested Plan</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Payable Amount</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Payer UPI & 12-Digit UTR</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Submitted At</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Status</th>
                      <th className="p-3 font-bold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No payment requests found for the selected filter.
                        </td>
                      </tr>
                    ) : (
                      payments.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {req.id}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {req.studentName}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {req.studentEmail}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">
                              {req.approvedPlan || req.plan}
                            </span>
                            <span className="text-slate-400 ml-1 capitalize">({req.approvedDuration || req.duration})</span>
                            {req.couponCodeApplied && (
                              <div className="text-[10px] text-emerald-600 font-mono">
                                Coupon: {req.couponCodeApplied} (-₹{req.discountAmount})
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            ₹{req.amount}
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-slate-700 dark:text-slate-300">
                              {req.payerUpiId}
                            </div>
                            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 select-all">
                              UTR: {req.utrNumber}
                            </div>
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
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {req.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                              {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                              {req.status === 'pending' && <Clock className="w-3 h-3" />}
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenReview(req, 'approve')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleOpenReview(req, 'reject')}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenReview(req, req.status === 'approved' ? 'reject' : 'approve')}
                                className="px-2 py-1 rounded-lg text-[11px] text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                Modify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COUPONS & FRIENDS MANAGER */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Active Coupons & Special Friend Access Codes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure free tier activations, promotional discounts, and per-student friend codes.
                </p>
              </div>

              <button
                onClick={() => {
                  handleGenerateRandomCouponCode();
                  setCreateCouponModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(cpn => (
                <div
                  key={cpn.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    cpn.isActive
                      ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      {cpn.code}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        cpn.category === 'FRIEND'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {cpn.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-3">
                    {cpn.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <strong className="text-slate-700 dark:text-slate-300 capitalize">{cpn.type.replace('_', ' ')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Benefit:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {cpn.type.startsWith('free') ? `100% Free (${cpn.durationDays} days)` : `${cpn.discountValue}% Off`}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Redemptions:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400">
                        {cpn.redemptionCount} / {cpn.maxRedemptions}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${cpn.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {cpn.isActive ? 'Active' : 'Disabled'}
                    </span>

                    <button
                      onClick={() => handleToggleCoupon(cpn.id)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                    >
                      {cpn.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Redemptions Log */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Coupon Redemptions ({redemptions.length})
              </h4>

              {redemptions.length === 0 ? (
                <p className="text-xs text-slate-400">No students have redeemed coupons yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <th className="p-2.5 font-bold text-slate-600">Student Email</th>
                        <th className="p-2.5 font-bold text-slate-600">Coupon Code</th>
                        <th className="p-2.5 font-bold text-slate-600">Plan Granted</th>
                        <th className="p-2.5 font-bold text-slate-600">Duration</th>
                        <th className="p-2.5 font-bold text-slate-600">Redeemed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {redemptions.slice(0, 15).map(r => (
                        <tr key={r.id}>
                          <td className="p-2.5 font-medium text-slate-900 dark:text-white">{r.studentEmail}</td>
                          <td className="p-2.5 font-mono text-indigo-600 font-bold">{r.couponCode}</td>
                          <td className="p-2.5 uppercase font-bold text-emerald-600">{r.planGranted || 'Discount'}</td>
                          <td className="p-2.5">{r.durationDaysGranted || 30} days</td>
                          <td className="p-2.5 text-slate-500">{formatTimestamp(r.redeemedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING & MERCHANT UPI SETTINGS */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Editor */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <span>Configure Subscription Plan Prices</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Prices must remain student-friendly and affordable. Changes take effect immediately.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="font-bold text-xs text-indigo-600 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scholar Plus Tier</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Monthly Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pricingEdit.plusMonthly}
                        onChange={e => setPricingEdit({ ...pricingEdit, plusMonthly: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Yearly Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pricingEdit.plusYearly}
                        onChange={e => setPricingEdit({ ...pricingEdit, plusYearly: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="font-bold text-xs text-amber-600 uppercase flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Mastery Pro Tier</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Monthly Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pricingEdit.proMonthly}
                        onChange={e => setPricingEdit({ ...pricingEdit, proMonthly: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Yearly Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={pricingEdit.proYearly}
                        onChange={e => setPricingEdit({ ...pricingEdit, proYearly: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {pricingSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{pricingSuccessMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleSavePlanPrices}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
                >
                  Save New Prices
                </button>
              </div>
            </div>

            {/* Real Verified Merchant & Bank Configuration */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Verified Bank & UPI Account Details</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real payment recipient account and UPI VPA used for student subscription checkouts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Live QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingMerchant(!isEditingMerchant)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingMerchant ? 'Cancel Edit' : 'Edit Bank Details'}</span>
                  </button>
                </div>
              </div>

              {merchantSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{merchantSuccessMsg}</span>
                </div>
              )}

              {!isEditingMerchant ? (
                /* READ-ONLY VERIFIED BANK DETAILS VIEW */
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Account Holder / Recipient:</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {merchantEdit.merchantName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Merchant UPI ID (VPA):</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 select-all">
                          {merchantEdit.merchantUpiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(merchantEdit.merchantUpiId, 'upi')}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedField === 'upi' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Bank / Payment Provider:</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {merchantEdit.merchantBank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Account / Registered Mobile:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {merchantEdit.accountNumber || '9922321046'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(merchantEdit.accountNumber || '9922321046', 'acc')}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Copy Account / Mobile"
                        >
                          {copiedField === 'acc' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">IFSC / Routing Code:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {merchantEdit.ifscCode || 'PYTM0123456'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Account Type:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {merchantEdit.accountType || 'UPI Wallet & Linked Bank VPA'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Branch / Network:</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {merchantEdit.branchName || 'Online / MobiKwik UPI Network'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500">Gateway Status:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Live Merchant (₹0 software fee)</span>
                      </span>
                    </div>
                  </div>

                  {/* QR Preview Mini Bar */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/aistudio/Screenshot_20261104_205858_MobiKwik_885c48cb.jpg"
                        alt="QR Code Preview"
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
                        onClick={() => setShowQrModal(true)}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Live MobiKwik Pocket QR Code</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Verified
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Shown automatically to scholars during checkout
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Enlarge
                    </button>
                  </div>
                </div>
              ) : (
                /* EDITABLE REAL BANK DETAILS FORM */
                <form onSubmit={handleSaveMerchantConfig} className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Update Bank & UPI Details
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Account Holder / Merchant Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={merchantEdit.merchantName}
                          onChange={e => setMerchantEdit({ ...merchantEdit, merchantName: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Merchant UPI ID (VPA) *
                        </label>
                        <input
                          type="text"
                          required
                          value={merchantEdit.merchantUpiId}
                          onChange={e => setMerchantEdit({ ...merchantEdit, merchantUpiId: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Bank / Payment Service Provider *
                        </label>
                        <input
                          type="text"
                          required
                          value={merchantEdit.merchantBank}
                          onChange={e => setMerchantEdit({ ...merchantEdit, merchantBank: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Account Number / Registered Mobile
                        </label>
                        <input
                          type="text"
                          value={merchantEdit.accountNumber}
                          onChange={e => setMerchantEdit({ ...merchantEdit, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          IFSC / Routing Code
                        </label>
                        <input
                          type="text"
                          value={merchantEdit.ifscCode}
                          onChange={e => setMerchantEdit({ ...merchantEdit, ifscCode: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-mono uppercase bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Account Type
                        </label>
                        <input
                          type="text"
                          value={merchantEdit.accountType}
                          onChange={e => setMerchantEdit({ ...merchantEdit, accountType: e.target.value })}
                          placeholder="e.g. UPI Wallet & Linked Bank VPA"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Branch / Network Name
                        </label>
                        <input
                          type="text"
                          value={merchantEdit.branchName}
                          onChange={e => setMerchantEdit({ ...merchantEdit, branchName: e.target.value })}
                          placeholder="e.g. Online / MobiKwik UPI Network"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingMerchant(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingMerchant}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{savingMerchant ? 'Saving Details...' : 'Save Bank & UPI Details'}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1">
                <strong className="block font-bold">100% Zero-Software-Cost Direct Transfer:</strong>
                <p>
                  Funds land directly in the recipient&apos;s verified bank account via MobiKwik Pocket UPI ({merchantEdit.merchantUpiId}) without 2-3% payment gateway intermediary deduction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Administrative Action Audit Trail</span>
            </h3>

            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No administrative logs recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 flex items-start justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span>{log.details}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Admin: {log.adminEmail} {log.targetUserEmail && `• Target: ${log.targetUserEmail}`}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-4">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEW PAYMENT MODAL */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Review Payment Request ({selectedPayment.id})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify against bank statement before approving.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Payment Details */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedPayment.studentName} ({selectedPayment.studentEmail})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payer UPI ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedPayment.payerUpiId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">12-Digit UTR:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 select-all">{selectedPayment.utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payable Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{selectedPayment.amount}</span>
                </div>
              </div>

              {/* Action selection */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewAction('approve')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      reviewAction === 'approve'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Approve Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction('reject')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      reviewAction === 'reject'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    Reject Payment
                  </button>
                </div>

                {reviewAction === 'approve' ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Plan to Grant
                      </label>
                      <select
                        value={approvedPlan}
                        onChange={e => setApprovedPlan(e.target.value as SubscriptionTier)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                      >
                        <option value="plus">Scholar Plus</option>
                        <option value="pro">Mastery Pro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Duration
                      </label>
                      <select
                        value={approvedDuration}
                        onChange={e => setApprovedDuration(e.target.value as BillingDuration)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                      >
                        <option value="monthly">Monthly (30 Days)</option>
                        <option value="yearly">Yearly (365 Days)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Rejection Reason (Visible to Student)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTR not found on bank statement, payment refunded..."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Internal Admin Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional notes for record..."
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReview}
                  disabled={submittingReview}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer ${
                    reviewAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {submittingReview ? 'Saving...' : `Confirm ${reviewAction === 'approve' ? 'Approval' : 'Rejection'}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE COUPON MODAL */}
        {createCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create New Coupon or Friend Code
                </h3>
                <button
                  onClick={() => setCreateCouponModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FRIEND2026"
                      value={newCode}
                      onChange={e => setNewCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCouponCode}
                    className="self-end px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Random
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Coupon Type
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as CouponType)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    >
                      <option value="free_plus">Free Scholar Plus</option>
                      <option value="free_pro">Free Mastery Pro</option>
                      <option value="percent_discount">Percentage Discount</option>
                      <option value="fixed_discount">Fixed Amount Discount</option>
                      <option value="custom_duration">Custom Duration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as CouponCategory)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    >
                      <option value="FRIEND">FRIEND (Personal)</option>
                      <option value="PROMOTIONAL">PROMOTIONAL</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="PARTNER">PARTNER</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {newType.startsWith('free') ? 'Granted Plan' : 'Discount Value'}
                    </label>
                    {newType.startsWith('free') ? (
                      <select
                        value={newTargetPlan}
                        onChange={e => setNewTargetPlan(e.target.value as SubscriptionTier)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                      >
                        <option value="plus">Plus Tier</option>
                        <option value="pro">Pro Tier</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={newDiscountValue}
                        onChange={e => setNewDiscountValue(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newDurationDays}
                      onChange={e => setNewDurationDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Max Total Redemptions
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newMaxRedemptions}
                      onChange={e => setNewMaxRedemptions(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Description / Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30 Days Scholar Plus for friend"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateCouponModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCoupon}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer"
                  >
                    {submittingCoupon ? 'Creating...' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Preview Modal */}
        {showQrModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          >
            <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center relative">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Merchant QR</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {merchantEdit.merchantName}
                </h4>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {merchantEdit.merchantUpiId}
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner flex items-center justify-center">
                <img
                  src="/assets/aistudio/Screenshot_20261104_205858_MobiKwik_885c48cb.jpg"
                  alt="Verified MobiKwik Pocket QR"
                  className="w-full max-h-72 object-contain rounded-xl"
                />
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                This exact MobiKwik Pocket QR code is presented to all students on the checkout modal.
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
