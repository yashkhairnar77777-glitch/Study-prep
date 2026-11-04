import {
  SubscriptionTier,
  BillingDuration,
  PlanConfig,
  StudentSubscription,
  PaymentRequest,
  Coupon,
  CouponRedemption,
  AdminAuditLog,
  MerchantPaymentConfig,
} from '../types';

export type FeatureKey =
  | 'basic_ai'
  | 'photo_solver'
  | 'basic_notes'
  | 'ncert_visual_sheets'
  | 'oral_viva'
  | 'mock_tests'
  | 'formula_sheets'
  | 'flashcards_unlimited'
  | 'high_capacity_ai'
  | 'full_pdf_textbooks'
  | 'custom_marking_rubrics';

export const FEATURE_REQUIREMENTS: Record<
  FeatureKey,
  {
    name: string;
    description: string;
    requiredTier: SubscriptionTier;
  }
> = {
  basic_ai: {
    name: 'Basic AI Tutor',
    description: 'Everyday conceptual answers and homework help (10 queries/day).',
    requiredTier: 'free',
  },
  photo_solver: {
    name: 'Photo Question Solver',
    description: 'Instant image snap-to-solution OCR & step-by-step breakdown.',
    requiredTier: 'free',
  },
  basic_notes: {
    name: 'NCERT Chapter Notes',
    description: 'Core chapter summaries, key definitions, and quick revision.',
    requiredTier: 'free',
  },
  ncert_visual_sheets: {
    name: 'NCERT Visual Graphic Notes',
    description: 'Graphic colored high-impact summary sheets with mindmaps, NCERT callouts, and formulas.',
    requiredTier: 'plus',
  },
  oral_viva: {
    name: 'AI Oral Viva Examination',
    description: 'Interactive spoken viva examiner with keyword matching and speech assessment.',
    requiredTier: 'plus',
  },
  mock_tests: {
    name: 'Full Mock Practice Tests',
    description: 'Up to 20 full-length practice tests per month with step-by-step solutions.',
    requiredTier: 'plus',
  },
  formula_sheets: {
    name: 'Formula & Equation Reference Sheets',
    description: 'Auto-compiled math, physics, and chemistry formula sheets.',
    requiredTier: 'plus',
  },
  flashcards_unlimited: {
    name: 'Expanded Spaced-Repetition Decks',
    description: 'Build decks up to 200 Leitner flashcards per subject.',
    requiredTier: 'plus',
  },
  high_capacity_ai: {
    name: 'High-Capacity AI Models',
    description: 'Priority access to high-capacity reasoning models (Gemini Pro, Claude 3.5, Llama 3.3 70B).',
    requiredTier: 'pro',
  },
  full_pdf_textbooks: {
    name: 'Full-Length PDF Textbook Processing',
    description: 'Upload full chapter PDFs up to 200 pages for deep Q&A and notes extraction.',
    requiredTier: 'pro',
  },
  custom_marking_rubrics: {
    name: 'Custom Board Marking Rubrics',
    description: 'Subjective evaluation with CBSE/ICSE board examiner step-wise grading rubrics.',
    requiredTier: 'pro',
  },
};

const TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  plus: 1,
  pro: 2,
};

export const hasTierAccess = (currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean => {
  return TIER_LEVELS[currentTier] >= TIER_LEVELS[requiredTier];
};

export const hasFeatureAccess = (currentTier: SubscriptionTier, feature: FeatureKey): boolean => {
  const req = FEATURE_REQUIREMENTS[feature];
  if (!req) return true;
  return hasTierAccess(currentTier, req.requiredTier);
};

export const subscriptionService = {
  async getPlans(): Promise<{ plans: PlanConfig[]; merchantConfig: Partial<MerchantPaymentConfig> }> {
    const res = await fetch('/api/subscription/plans');
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to fetch subscription plans');
    }
    return {
      plans: json.plans,
      merchantConfig: json.merchantConfig,
    };
  },

  async getStatus(studentEmail?: string): Promise<{
    subscription: StudentSubscription;
    planConfig: PlanConfig;
    isAdmin: boolean;
    merchantConfig: MerchantPaymentConfig;
  }> {
    const headers: Record<string, string> = {};
    if (studentEmail) {
      headers['x-student-email'] = studentEmail;
    }
    const res = await fetch('/api/subscription/status', { headers });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to fetch subscription status');
    }
    return {
      subscription: json.subscription,
      planConfig: json.planConfig,
      isAdmin: json.isAdmin,
      merchantConfig: json.merchantConfig,
    };
  },

  async submitUpiPayment(payload: {
    studentEmail: string;
    studentName: string;
    payerUpiId: string;
    utrNumber: string;
    plan: SubscriptionTier;
    duration: BillingDuration;
    amount: number;
    couponCodeApplied?: string;
    discountAmount?: number;
    screenshotBase64?: string;
  }): Promise<{ message: string; paymentRequest: PaymentRequest }> {
    const res = await fetch('/api/payments/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-email': payload.studentEmail,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to submit payment request');
    }
    return {
      message: json.message,
      paymentRequest: json.paymentRequest,
    };
  },

  async getMyRequests(studentEmail: string): Promise<{
    requests: PaymentRequest[];
    redemptions: CouponRedemption[];
  }> {
    const res = await fetch('/api/payments/my-requests', {
      headers: {
        'x-student-email': studentEmail,
      },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to fetch payment history');
    }
    return {
      requests: json.requests || [],
      redemptions: json.redemptions || [],
    };
  },

  async validateCoupon(code: string, studentEmail: string, targetPlan?: SubscriptionTier) {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, studentEmail, targetPlan }),
    });
    const json = await res.json();
    return json.validation;
  },

  async redeemCoupon(
    code: string,
    studentEmail: string,
    studentName?: string,
    targetPlan?: SubscriptionTier
  ): Promise<{
    message: string;
    planGranted?: SubscriptionTier;
    durationDaysGranted?: number;
    expiresAt?: number;
    subscription?: StudentSubscription;
    discountApplied?: number;
  }> {
    const res = await fetch('/api/coupons/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, studentEmail, studentName, targetPlan }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Coupon redemption failed');
    }
    return json;
  },

  // Admin APIs
  async getAdminPayments(
    adminEmail: string,
    filter?: { status?: string; search?: string }
  ): Promise<PaymentRequest[]> {
    const query = new URLSearchParams();
    if (filter?.status && filter.status !== 'all') query.set('status', filter.status);
    if (filter?.search) query.set('search', filter.search);

    const res = await fetch(`/api/admin/payments?${query.toString()}`, {
      headers: { 'x-admin-email': adminEmail },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load payments for admin');
    }
    return json.requests;
  },

  async reviewPayment(
    adminEmail: string,
    requestId: string,
    data: {
      action: 'approve' | 'reject';
      approvedPlan?: SubscriptionTier;
      approvedDuration?: BillingDuration;
      adminNotes?: string;
      rejectionReason?: string;
    }
  ): Promise<{ message: string; paymentRequest: PaymentRequest; subscription?: StudentSubscription }> {
    const res = await fetch(`/api/admin/payments/${requestId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to review payment request');
    }
    return json;
  },

  async getAdminCoupons(adminEmail: string): Promise<{ coupons: Coupon[]; redemptions: CouponRedemption[] }> {
    const res = await fetch('/api/admin/coupons', {
      headers: { 'x-admin-email': adminEmail },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load admin coupons');
    }
    return {
      coupons: json.coupons,
      redemptions: json.redemptions,
    };
  },

  async createCoupon(adminEmail: string, payload: Partial<Coupon>): Promise<Coupon> {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create coupon');
    }
    return json.coupon;
  },

  async toggleCouponActive(adminEmail: string, couponId: string): Promise<Coupon> {
    const res = await fetch(`/api/admin/coupons/${couponId}/toggle`, {
      method: 'PATCH',
      headers: { 'x-admin-email': adminEmail },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to toggle coupon status');
    }
    return json.coupon;
  },

  async updatePlanPrice(
    adminEmail: string,
    planId: SubscriptionTier,
    monthlyPrice: number,
    yearlyPrice: number
  ): Promise<PlanConfig[]> {
    const res = await fetch('/api/admin/plans/price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify({ planId, monthlyPrice, yearlyPrice }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update plan price');
    }
    return json.plans;
  },

  async getAdminAuditLogs(adminEmail: string): Promise<AdminAuditLog[]> {
    const res = await fetch('/api/admin/audit-logs', {
      headers: { 'x-admin-email': adminEmail },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to retrieve audit logs');
    }
    return json.logs;
  },

  async updateMerchantConfig(
    adminEmail: string,
    config: Partial<MerchantPaymentConfig>
  ): Promise<MerchantPaymentConfig> {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail,
      },
      body: JSON.stringify(config),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update merchant configuration');
    }
    return json.merchantConfig;
  },
};
