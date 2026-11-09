import fs from 'fs';
import path from 'path';
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
} from './payments/types.js';

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'subscriptions.json');

const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Free Learner',
    tagline: 'Essential everyday homework help and foundational study tools.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Basic AI Tutor with 10 conceptual questions/day',
      'Photo Question Solver (up to 5 questions/day)',
      'Basic NCERT chapter revision notes',
      'Up to 20 Leitner spaced-repetition flashcards',
      '3 Mock practice quizzes per month',
      'Standard AI model access',
      'Study checklist & planner',
      'Full data backup & export',
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
    badge: 'POPULAR',
    popular: true,
    features: [
      'Higher AI Tutor limit (50 questions/day)',
      'Photo Question Solver (up to 25 questions/day)',
      'Detailed NCERT Visual Graphic Study Sheets',
      'Advanced flashcard decks (up to 200 cards)',
      '20 Full practice tests & quizzes per month',
      'AI Oral Viva test mode with keyword scoring',
      'Formula reference sheet generation',
      'PDF Document analysis up to 25 pages',
      'Multi-provider auto-failover routing',
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
    tagline: 'High-capacity AI reasoning, unlimited PDF processing, and custom board exams.',
    monthlyPrice: 199,
    yearlyPrice: 1999,
    badge: 'MAX POWER',
    features: [
      'Highest fair usage AI limits (200 questions/day)',
      'High-capacity reasoning models (Gemini Pro, Claude 3.5, Llama 3.3 70B)',
      'Unlimited Photo Solver with step-by-step diagram analysis',
      'Full-length PDF textbook analysis & semantic search',
      'Unlimited practice exam papers with custom marking rubrics',
      'Deep subjective evaluation with mark breakdowns',
      'Unlimited AI Oral Viva examiner sessions',
      'Priority fast-lane processing',
      'All upcoming premium study tools',
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

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cpn-friend-1',
    code: 'ORYQENFRIEND',
    type: 'free_plus',
    category: 'FRIEND',
    discountValue: 100,
    durationDays: 30,
    targetPlan: 'plus',
    maxRedemptions: 1000,
    redemptionCount: 0,
    perStudentLimit: 1,
    startDate: Date.now() - 86400000,
    expiryDate: Date.now() + 365 * 86400000,
    isActive: true,
    description: '30 Days of Free Scholar Plus access for friends & early scholars.',
    createdAt: Date.now(),
    createdBy: 'system',
  },
  {
    id: 'cpn-welcome-20',
    code: 'WELCOME20',
    type: 'percent_discount',
    category: 'PROMOTIONAL',
    discountValue: 20,
    durationDays: 30,
    maxRedemptions: 500,
    redemptionCount: 0,
    perStudentLimit: 1,
    startDate: Date.now() - 86400000,
    expiryDate: Date.now() + 180 * 86400000,
    isActive: true,
    description: '20% discount on all Plus and Pro subscriptions.',
    createdAt: Date.now(),
    createdBy: 'system',
  },
  {
    id: 'cpn-pro-7',
    code: 'ORYQENPRO',
    type: 'free_pro',
    category: 'PROMOTIONAL',
    discountValue: 100,
    durationDays: 7,
    targetPlan: 'pro',
    maxRedemptions: 1000,
    redemptionCount: 0,
    perStudentLimit: 1,
    startDate: Date.now() - 86400000,
    expiryDate: Date.now() + 180 * 86400000,
    isActive: true,
    description: '7 Days of Free Mastery Pro tier access.',
    createdAt: Date.now(),
    createdBy: 'system',
  },
];

const DEFAULT_MERCHANT_CONFIG: MerchantPaymentConfig = {
  merchantUpiId: '9922321046@mbk',
  merchantName: 'Archana Prakash Khairnar',
  merchantBank: 'MobiKwik Pocket UPI / MobiKwik Payments',
  accountNumber: '9922321046',
  ifscCode: 'PYTM0123456',
  accountType: 'UPI Wallet & Linked Bank VPA',
  branchName: 'Online / MobiKwik UPI Network',
  qrImageUrl: '/assets/aistudio/Screenshot_20261104_205858_MobiKwik_885c48cb.jpg',
  adminEmails: ['yashkhairnar77777@gmail.com'],
  instructions: [
    'Open any UPI app on your phone (Google Pay, PhonePe, Paytm, BHIM, Cred, MobiKwik).',
    'Scan the verified MobiKwik Pocket QR code or pay to UPI ID: 9922321046@mbk.',
    'Verify receiver name displays as "Archana Prakash Khairnar".',
    'Enter the exact payable plan amount.',
    'After successful payment, copy the 12-digit UTR / UPI Transaction Reference.',
    'Submit the UTR number in the form below for fast manual verification.',
  ],
};

interface DatabaseSchema {
  subscriptions: Record<string, StudentSubscription>;
  paymentRequests: PaymentRequest[];
  coupons: Coupon[];
  couponRedemptions: CouponRedemption[];
  adminAuditLogs: AdminAuditLog[];
  plans: PlanConfig[];
  merchantConfig: MerchantPaymentConfig;
}

export class SubscriptionStore {
  private db: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.db = {
      subscriptions: {},
      paymentRequests: [],
      coupons: DEFAULT_COUPONS,
      couponRedemptions: [],
      adminAuditLogs: [],
      plans: DEFAULT_PLANS,
      merchantConfig: DEFAULT_MERCHANT_CONFIG,
    };
    this.initDatabase();
  }

  private initDatabase(): void {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.db = {
          subscriptions: parsed.subscriptions || {},
          paymentRequests: parsed.paymentRequests || [],
          coupons: parsed.coupons && parsed.coupons.length > 0 ? parsed.coupons : DEFAULT_COUPONS,
          couponRedemptions: parsed.couponRedemptions || [],
          adminAuditLogs: parsed.adminAuditLogs || [],
          plans: parsed.plans && parsed.plans.length > 0 ? parsed.plans : DEFAULT_PLANS,
          merchantConfig: parsed.merchantConfig || DEFAULT_MERCHANT_CONFIG,
        };
      } else {
        this.saveDatabase();
      }
      this.isLoaded = true;
    } catch (err) {
      console.warn('[SubscriptionStore] Could not load DB file, using in-memory state:', err);
      this.isLoaded = true;
    }
  }

  private saveDatabase(): void {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[SubscriptionStore] Failed to write database file:', err);
    }
  }

  public normalizeEmail(email?: string): string {
    return (email || 'student@oryqen.ai').toLowerCase().trim();
  }

  public static readonly ADMIN_MASTER_PASSWORD = 'y@ash2013';
  private adminSessions: Map<string, { email: string; expiresAt: number }> = new Map();

  public verifyAdminPassword(password?: string): boolean {
    if (!password) return false;
    return password.trim() === SubscriptionStore.ADMIN_MASTER_PASSWORD;
  }

  public createAdminSession(email?: string): { token: string; expiresAt: number } {
    const token = `adm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
    const expiresAt = Date.now() + 12 * 3600 * 1000;
    const adminEmail = email || 'yashkhairnar77777@gmail.com';
    this.adminSessions.set(token, { email: adminEmail, expiresAt });
    this.logAdminAction('admin_password_login', adminEmail, 'Administrator authenticated with master password');
    return { token, expiresAt };
  }

  public isValidAdminSession(token?: string): boolean {
    if (!token) return false;
    const session = this.adminSessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.adminSessions.delete(token);
      return false;
    }
    return true;
  }

  public isAuthorizedAdmin(email?: string): boolean {
    if (!email) return false;
    const clean = this.normalizeEmail(email);
    const configuredAdmins = this.db.merchantConfig.adminEmails.map(e => this.normalizeEmail(e));
    return (
      clean === 'yashkhairnar77777@gmail.com' ||
      configuredAdmins.includes(clean) ||
      clean.includes('admin@oryqen')
    );
  }

  // --- PLANS & PRICING ---
  public getPlans(): PlanConfig[] {
    return this.db.plans;
  }

  public getPlan(planId: SubscriptionTier): PlanConfig {
    return this.db.plans.find(p => p.id === planId) || this.db.plans[0];
  }

  public updatePlanPrice(planId: SubscriptionTier, monthlyPrice: number, yearlyPrice: number, adminEmail: string): boolean {
    const plan = this.db.plans.find(p => p.id === planId);
    if (!plan) return false;

    const oldM = plan.monthlyPrice;
    const oldY = plan.yearlyPrice;
    plan.monthlyPrice = Math.max(0, monthlyPrice);
    plan.yearlyPrice = Math.max(0, yearlyPrice);

    this.logAdminAction(
      'update_plan_price',
      adminEmail,
      `Updated ${plan.name} pricing from ₹${oldM}/mo (₹${oldY}/yr) to ₹${plan.monthlyPrice}/mo (₹${plan.yearlyPrice}/yr)`
    );

    this.saveDatabase();
    return true;
  }

  // --- STUDENT SUBSCRIPTIONS ---
  public getSubscription(studentEmail?: string): StudentSubscription {
    const email = this.normalizeEmail(studentEmail);
    const sub = this.db.subscriptions[email];

    const now = Date.now();

    // If subscription exists but is expired
    if (sub) {
      if (sub.expiresAt > 0 && now > sub.expiresAt) {
        // Return Free tier view while preserving previous record reference
        return {
          studentEmail: email,
          studentName: sub.studentName,
          plan: 'free',
          status: 'expired',
          billingDuration: sub.billingDuration,
          activatedAt: sub.activatedAt,
          expiresAt: sub.expiresAt,
          source: sub.source,
          referenceId: sub.referenceId,
        };
      }
      return sub;
    }

    // Default Free Tier
    return {
      studentEmail: email,
      plan: 'free',
      status: 'active',
      billingDuration: 'monthly',
      activatedAt: now,
      expiresAt: 0, // 0 = never expires (free forever)
      source: 'free_tier',
    };
  }

  public setSubscription(sub: StudentSubscription, adminEmail?: string): void {
    const email = this.normalizeEmail(sub.studentEmail);
    this.db.subscriptions[email] = {
      ...sub,
      studentEmail: email,
    };

    if (adminEmail) {
      this.logAdminAction(
        'manual_subscription_grant',
        adminEmail,
        `Set subscription for ${email} to ${sub.plan.toUpperCase()} (${sub.billingDuration}), expires: ${
          sub.expiresAt > 0 ? new Date(sub.expiresAt).toISOString() : 'Never (Free)'
        }`,
        { email, plan: sub.plan }
      );
    }

    this.saveDatabase();
  }

  // Check if a student has access to a specific required plan
  public hasPlanAccess(studentEmail: string | undefined, requiredTier: SubscriptionTier): boolean {
    if (requiredTier === 'free') return true;
    const current = this.getSubscription(studentEmail);
    if (current.status !== 'active') return false;

    if (requiredTier === 'plus') {
      return current.plan === 'plus' || current.plan === 'pro';
    }
    if (requiredTier === 'pro') {
      return current.plan === 'pro';
    }
    return false;
  }

  // --- PAYMENT REQUESTS ---
  public getPaymentRequests(filter?: { status?: string; studentEmail?: string; search?: string }): PaymentRequest[] {
    let list = [...this.db.paymentRequests];

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(r => r.status === filter.status);
    }

    if (filter?.studentEmail) {
      const email = this.normalizeEmail(filter.studentEmail);
      list = list.filter(r => this.normalizeEmail(r.studentEmail) === email);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        r =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentEmail.toLowerCase().includes(q) ||
          r.utrNumber.toLowerCase().includes(q) ||
          r.payerUpiId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return list.sort((a, b) => b.submittedAt - a.submittedAt);
  }

  public getPaymentRequestById(id: string): PaymentRequest | undefined {
    return this.db.paymentRequests.find(r => r.id === id);
  }

  public createPaymentRequest(data: {
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
  }): { success: boolean; request?: PaymentRequest; error?: string } {
    const cleanUtr = data.utrNumber.trim();
    const cleanEmail = this.normalizeEmail(data.studentEmail);

    if (!cleanUtr || cleanUtr.length < 6) {
      return { success: false, error: 'A valid UPI Transaction Reference / UTR number (at least 6 characters) is required.' };
    }

    // Check for duplicate UTR
    const existingUtr = this.db.paymentRequests.find(
      r => r.utrNumber.toLowerCase() === cleanUtr.toLowerCase() && r.status !== 'rejected' && r.status !== 'cancelled'
    );
    if (existingUtr) {
      return {
        success: false,
        error: `This UTR transaction reference (${cleanUtr}) has already been submitted under reference ${existingUtr.id}. Duplicate submissions are prevented.`,
      };
    }

    // Check for existing pending request for this student
    const existingPending = this.db.paymentRequests.find(
      r => this.normalizeEmail(r.studentEmail) === cleanEmail && r.status === 'pending'
    );
    if (existingPending) {
      return {
        success: false,
        error: `You already have a pending verification request (${existingPending.id}) for plan ${existingPending.plan.toUpperCase()}. Please wait for admin verification.`,
      };
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const id = `REQ-${dateStr}-${randomHex}`;

    const newReq: PaymentRequest = {
      id,
      studentEmail: cleanEmail,
      studentName: data.studentName.trim() || 'Student Scholar',
      payerUpiId: data.payerUpiId.trim(),
      utrNumber: cleanUtr,
      plan: data.plan,
      duration: data.duration,
      amount: data.amount,
      couponCodeApplied: data.couponCodeApplied?.trim().toUpperCase(),
      discountAmount: data.discountAmount || 0,
      screenshotBase64: data.screenshotBase64,
      status: 'pending',
      submittedAt: Date.now(),
    };

    this.db.paymentRequests.unshift(newReq);
    this.saveDatabase();

    return { success: true, request: newReq };
  }

  public reviewPaymentRequest(
    id: string,
    action: 'approve' | 'reject',
    adminEmail: string,
    options?: {
      approvedPlan?: SubscriptionTier;
      approvedDuration?: BillingDuration;
      customDurationDays?: number;
      adminNotes?: string;
      rejectionReason?: string;
    }
  ): { success: boolean; request?: PaymentRequest; error?: string } {
    const req = this.db.paymentRequests.find(r => r.id === id);
    if (!req) {
      return { success: false, error: 'Payment request not found.' };
    }

    if (req.status !== 'pending') {
      return { success: false, error: `This payment request has already been ${req.status}.` };
    }

    const now = Date.now();
    req.reviewedAt = now;
    req.reviewedBy = adminEmail;
    req.adminNotes = options?.adminNotes;

    if (action === 'reject') {
      req.status = 'rejected';
      req.rejectionReason = options?.rejectionReason || 'Payment could not be verified in merchant records.';

      this.logAdminAction(
        'reject_payment',
        adminEmail,
        `Rejected payment request ${id} for ${req.studentEmail}. Reason: ${req.rejectionReason}`,
        { requestId: id, studentEmail: req.studentEmail }
      );

      this.saveDatabase();
      return { success: true, request: req };
    }

    // APPROVAL PATH
    req.status = 'approved';
    const planToGrant: SubscriptionTier = options?.approvedPlan || req.plan;
    const durationToGrant: BillingDuration = options?.approvedDuration || req.duration;
    req.approvedPlan = planToGrant;
    req.approvedDuration = durationToGrant;

    // Calculate expiry date:
    // monthly = 30 days, yearly = 365 days, custom days if specified
    const days = options?.customDurationDays
      ? options.customDurationDays
      : durationToGrant === 'yearly'
      ? 365
      : 30;
    const expiresAt = now + days * 86400000;

    // Activate the subscription on the backend
    this.setSubscription(
      {
        studentEmail: req.studentEmail,
        studentName: req.studentName,
        plan: planToGrant,
        status: 'active',
        billingDuration: durationToGrant,
        activatedAt: now,
        expiresAt,
        source: 'upi_payment',
        referenceId: req.id,
      },
      adminEmail
    );

    this.logAdminAction(
      'approve_payment',
      adminEmail,
      `Approved payment request ${id} (UTR: ${req.utrNumber}) for ${req.studentEmail}. Activated ${planToGrant.toUpperCase()} for ${days} days until ${new Date(
        expiresAt
      ).toISOString()}`,
      { requestId: id, studentEmail: req.studentEmail, plan: planToGrant, expiresAt }
    );

    this.saveDatabase();
    return { success: true, request: req };
  }

  // --- COUPON SYSTEM ---
  public getCoupons(): Coupon[] {
    return this.db.coupons;
  }

  public getCouponByCode(code: string): Coupon | undefined {
    const clean = code.trim().toUpperCase();
    return this.db.coupons.find(c => c.code.toUpperCase() === clean);
  }

  public createCoupon(data: {
    code: string;
    type: Coupon['type'];
    category: Coupon['category'];
    discountValue: number;
    durationDays: number;
    targetPlan?: SubscriptionTier;
    maxRedemptions?: number;
    perStudentLimit?: number;
    startDate?: number;
    expiryDate?: number;
    description?: string;
    adminEmail: string;
  }): { success: boolean; coupon?: Coupon; error?: string } {
    const cleanCode = data.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode || cleanCode.length < 3) {
      return { success: false, error: 'Coupon code must be at least 3 characters alphanumeric.' };
    }

    if (this.getCouponByCode(cleanCode)) {
      return { success: false, error: `Coupon code '${cleanCode}' already exists.` };
    }

    const now = Date.now();
    const newCoupon: Coupon = {
      id: `cpn-${now}-${Math.random().toString(36).slice(2, 6)}`,
      code: cleanCode,
      type: data.type,
      category: data.category || 'PROMOTIONAL',
      discountValue: Math.max(0, data.discountValue),
      durationDays: Math.max(1, data.durationDays || 30),
      targetPlan: data.targetPlan,
      maxRedemptions: data.maxRedemptions || 1000,
      redemptionCount: 0,
      perStudentLimit: data.perStudentLimit || 1,
      startDate: data.startDate || now,
      expiryDate: data.expiryDate || now + 180 * 86400000,
      isActive: true,
      description: data.description?.trim() || `${data.type.replace('_', ' ')} coupon`,
      createdAt: now,
      createdBy: data.adminEmail,
    };

    this.db.coupons.push(newCoupon);
    this.logAdminAction(
      'create_coupon',
      data.adminEmail,
      `Created coupon ${cleanCode} (${newCoupon.type}, category: ${newCoupon.category}, discount/duration: ${newCoupon.discountValue})`
    );

    this.saveDatabase();
    return { success: true, coupon: newCoupon };
  }

  public toggleCouponStatus(id: string, adminEmail: string): { success: boolean; coupon?: Coupon; error?: string } {
    const coupon = this.db.coupons.find(c => c.id === id);
    if (!coupon) return { success: false, error: 'Coupon not found.' };

    coupon.isActive = !coupon.isActive;
    this.logAdminAction(
      'toggle_coupon',
      adminEmail,
      `${coupon.isActive ? 'Reactivated' : 'Deactivated'} coupon ${coupon.code}`
    );

    this.saveDatabase();
    return { success: true, coupon };
  }

  public validateCoupon(
    code: string,
    studentEmail?: string,
    targetPlan?: SubscriptionTier
  ): {
    isValid: boolean;
    coupon?: Coupon;
    discountPercent?: number;
    discountAmount?: number;
    isFreeAccess?: boolean;
    freePlanGranted?: SubscriptionTier;
    freePlan?: SubscriptionTier;
    durationDays?: number;
    error?: string;
  } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.getCouponByCode(cleanCode);

    if (!coupon) {
      return { isValid: false, error: 'Invalid coupon code. Please verify the code and try again.' };
    }

    if (!coupon.isActive) {
      return { isValid: false, error: 'This coupon is currently deactivated.' };
    }

    const now = Date.now();
    if (coupon.startDate && now < coupon.startDate) {
      return { isValid: false, error: 'This coupon promotion has not started yet.' };
    }

    if (coupon.expiryDate && now > coupon.expiryDate) {
      return { isValid: false, error: 'This coupon has expired.' };
    }

    if (coupon.maxRedemptions > 0 && coupon.redemptionCount >= coupon.maxRedemptions) {
      return { isValid: false, error: 'This coupon has reached its maximum total redemptions.' };
    }

    // Check per-student redemption limit
    if (studentEmail) {
      const email = this.normalizeEmail(studentEmail);
      const studentRedemptions = this.db.couponRedemptions.filter(
        r => r.couponCode === cleanCode && this.normalizeEmail(r.studentEmail) === email
      );
      if (studentRedemptions.length >= coupon.perStudentLimit) {
        return {
          isValid: false,
          error: `You have already redeemed this coupon the maximum allowed number of times (${coupon.perStudentLimit}).`,
        };
      }
    }

    // Check target plan suitability
    if (coupon.targetPlan && targetPlan && coupon.targetPlan !== targetPlan) {
      return {
        isValid: false,
        error: `This coupon is exclusively valid for ${coupon.targetPlan.toUpperCase()} plans.`,
      };
    }

    // Calculate benefits
    if (coupon.type === 'free_plus') {
      return {
        isValid: true,
        coupon,
        isFreeAccess: true,
        freePlanGranted: 'plus',
        freePlan: 'plus',
        durationDays: coupon.durationDays,
      };
    }

    if (coupon.type === 'free_pro') {
      return {
        isValid: true,
        coupon,
        isFreeAccess: true,
        freePlanGranted: 'pro',
        freePlan: 'pro',
        durationDays: coupon.durationDays,
      };
    }

    if (coupon.type === 'percent_discount') {
      return {
        isValid: true,
        coupon,
        discountPercent: coupon.discountValue,
      };
    }

    if (coupon.type === 'fixed_discount') {
      return {
        isValid: true,
        coupon,
        discountAmount: coupon.discountValue,
      };
    }

    return {
      isValid: true,
      coupon,
      durationDays: coupon.durationDays,
    };
  }

  public redeemCoupon(
    code: string,
    studentEmail: string,
    studentName?: string,
    targetPlan?: SubscriptionTier
  ): {
    success: boolean;
    coupon?: Coupon;
    planGranted?: SubscriptionTier;
    expiresAt?: number;
    discountApplied?: number;
    subscription?: StudentSubscription;
    error?: string;
  } {
    const email = this.normalizeEmail(studentEmail);
    const validation = this.validateCoupon(code, email, targetPlan);

    if (!validation.isValid || !validation.coupon) {
      return { success: false, error: validation.error || 'Coupon validation failed.' };
    }

    const coupon = validation.coupon;

    // Check policy: Do not overwrite an existing higher tier active subscription
    const currentSub = this.getSubscription(email);
    if (currentSub.status === 'active' && currentSub.plan === 'pro' && coupon.type === 'free_plus') {
      return {
        success: false,
        error: 'You currently have an active PRO subscription. A PLUS coupon cannot downgrade your active Pro tier.',
      };
    }

    // Record the atomic redemption
    const redemption: CouponRedemption = {
      id: `red-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      couponCode: coupon.code,
      studentEmail: email,
      studentName: studentName || 'Student Scholar',
      planGranted: validation.freePlanGranted,
      discountGranted: validation.discountPercent || validation.discountAmount,
      durationDaysGranted: coupon.durationDays,
      redeemedAt: Date.now(),
    };

    coupon.redemptionCount += 1;
    this.db.couponRedemptions.push(redemption);

    // If 100% free plan coupon, activate immediately on backend
    if (validation.isFreeAccess && validation.freePlanGranted) {
      const now = Date.now();
      const expiresAt = now + coupon.durationDays * 86400000;
      const newSub: StudentSubscription = {
        studentEmail: email,
        studentName,
        plan: validation.freePlanGranted,
        status: 'active',
        billingDuration: coupon.durationDays > 30 ? 'yearly' : 'monthly',
        activatedAt: now,
        expiresAt,
        source: 'coupon',
        referenceId: coupon.code,
      };

      this.setSubscription(newSub);
      this.saveDatabase();

      return {
        success: true,
        coupon,
        planGranted: validation.freePlanGranted,
        expiresAt,
        subscription: newSub,
      };
    }

    this.saveDatabase();
    return {
      success: true,
      coupon,
      discountApplied: validation.discountPercent || validation.discountAmount,
    };
  }

  public getRedemptions(filter?: { couponCode?: string; studentEmail?: string }): CouponRedemption[] {
    let list = [...this.db.couponRedemptions];
    if (filter?.couponCode) {
      const code = filter.couponCode.toUpperCase().trim();
      list = list.filter(r => r.couponCode.toUpperCase() === code);
    }
    if (filter?.studentEmail) {
      const email = this.normalizeEmail(filter.studentEmail);
      list = list.filter(r => this.normalizeEmail(r.studentEmail) === email);
    }
    return list.sort((a, b) => b.redeemedAt - a.redeemedAt);
  }

  // --- MERCHANT CONFIG & AUDIT ---
  public getMerchantConfig(): MerchantPaymentConfig {
    return this.db.merchantConfig;
  }

  public updateMerchantConfig(config: Partial<MerchantPaymentConfig>, adminEmail: string): MerchantPaymentConfig {
    this.db.merchantConfig = {
      ...this.db.merchantConfig,
      ...config,
    };

    this.logAdminAction(
      'update_merchant_config',
      adminEmail,
      `Updated merchant payment configuration (UPI ID: ${this.db.merchantConfig.merchantUpiId})`
    );

    this.saveDatabase();
    return this.db.merchantConfig;
  }

  public getAdminAuditLogs(): AdminAuditLog[] {
    return [...this.db.adminAuditLogs].sort((a, b) => b.timestamp - a.timestamp);
  }

  public logAdminAction(
    action: AdminAuditLog['action'],
    adminEmail: string,
    details: string,
    metadata?: Record<string, any>
  ): void {
    const log: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      adminEmail: this.normalizeEmail(adminEmail),
      action,
      details,
      metadata,
    };
    this.db.adminAuditLogs.unshift(log);
    // Keep last 500 audit logs
    if (this.db.adminAuditLogs.length > 500) {
      this.db.adminAuditLogs = this.db.adminAuditLogs.slice(0, 500);
    }
  }
}

export const subscriptionStore = new SubscriptionStore();
