export type SubscriptionTier = 'free' | 'plus' | 'pro';
export type BillingDuration = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'pending_verification' | 'cancelled';

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  tagline: string;
  monthlyPrice: number; // in INR
  yearlyPrice: number;  // in INR
  badge?: string;
  popular?: boolean;
  features: string[];
  limits: {
    aiQuestionsPerDay: number;
    mockTestsPerMonth: number;
    flashcardsLimit: number;
    pdfAnalysisPageLimit: number;
    customStudyPacksPerWeek: number;
    oralExamAccess: boolean;
    subjectiveGrading: boolean;
    highCapacityModels: boolean;
  };
}

export interface StudentSubscription {
  studentEmail: string;
  studentName?: string;
  plan: SubscriptionTier;
  status: SubscriptionStatus;
  billingDuration: BillingDuration;
  activatedAt: number; // timestamp
  expiresAt: number;   // timestamp (0 for lifetime free)
  source: 'free_tier' | 'upi_payment' | 'coupon' | 'admin_grant';
  referenceId?: string; // payment request ID or coupon code
  autoRenew?: boolean;
}

export type PaymentRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface PaymentRequest {
  id: string; // e.g. REQ-20261101-ABCD
  studentEmail: string;
  studentName: string;
  payerUpiId: string;
  utrNumber: string; // 12-digit UPI reference number
  plan: SubscriptionTier; // requested plan
  duration: BillingDuration;
  amount: number; // in INR
  couponCodeApplied?: string;
  discountAmount?: number;
  screenshotBase64?: string;
  status: PaymentRequestStatus;
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  approvedPlan?: SubscriptionTier; // can differ from requested plan
  approvedDuration?: BillingDuration;
  adminNotes?: string;
  rejectionReason?: string;
}

export type CouponType = 'free_plus' | 'free_pro' | 'percent_discount' | 'fixed_discount' | 'custom_duration';
export type CouponCategory = 'FRIEND' | 'PROMOTIONAL' | 'PARTNER' | 'STUDENT';

export interface Coupon {
  id: string;
  code: string; // uppercase, e.g. 'ORYQENFRIEND'
  type: CouponType;
  category: CouponCategory;
  discountValue: number; // percentage (e.g. 20 for 20%) or fixed INR (e.g. 50)
  durationDays: number; // e.g. 30, 7, 365
  targetPlan?: SubscriptionTier; // 'plus' | 'pro'
  maxRedemptions: number; // e.g. 100
  redemptionCount: number;
  perStudentLimit: number; // default 1
  startDate: number;
  expiryDate: number;
  isActive: boolean;
  description: string;
  createdAt: number;
  createdBy?: string;
}

export interface CouponRedemption {
  id: string;
  couponCode: string;
  studentEmail: string;
  studentName?: string;
  planGranted?: SubscriptionTier;
  discountGranted?: number;
  durationDaysGranted?: number;
  redeemedAt: number;
}

export interface AdminAuditLog {
  id: string;
  timestamp: number;
  adminEmail: string;
  action:
    | 'approve_payment'
    | 'reject_payment'
    | 'create_coupon'
    | 'toggle_coupon'
    | 'update_plan_price'
    | 'manual_subscription_grant'
    | 'update_merchant_config'
    | 'admin_password_login';
  targetUserEmail?: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface MerchantPaymentConfig {
  merchantUpiId: string;     // e.g. '9922321046@mbk'
  merchantName: string;      // e.g. 'Archana Prakash Khairnar'
  merchantBank?: string;     // e.g. 'MobiKwik Pocket UPI / MobiKwik Payments'
  accountNumber?: string;    // e.g. '9922321046'
  ifscCode?: string;         // e.g. 'PYTM0123456'
  accountType?: string;      // e.g. 'UPI Wallet & Linked Bank VPA'
  branchName?: string;
  qrImageUrl?: string;       // path to verified QR code image asset
  adminEmails: string[];     // authorized admin emails
  instructions: string[];
}
