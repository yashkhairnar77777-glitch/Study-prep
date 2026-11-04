/**
 * Abstract Payment Gateway Interface
 * Enables future plug-and-play integration with production payment gateways
 * (Razorpay, Cashfree, Stripe, Lemon Squeezy) without altering business logic.
 *
 * Current implementation: ManualUpiGateway (₹0 software cost, manual admin verification).
 */

export interface PaymentOrderParams {
  amount: number; // in INR
  currency: string;
  studentEmail: string;
  studentName?: string;
  planId: string;
  duration: 'monthly' | 'yearly';
  referenceId: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  merchantUpiId?: string;
  upiPaymentUrl?: string;
  qrPayload?: string;
  instructions: string[];
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId?: string;
  transactionReference?: string;
  amount?: number;
  status?: 'success' | 'failed' | 'pending';
  rawPayload?: any;
}

export interface PaymentGateway {
  readonly id: string;
  readonly name: string;
  readonly isManual: boolean;

  createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResult>;
  verifyWebhook(headers: Record<string, string>, body: any): Promise<WebhookVerificationResult>;
}

export class ManualUpiGateway implements PaymentGateway {
  public readonly id = 'manual_upi';
  public readonly name = 'UPI Direct Transfer (Manual Verification)';
  public readonly isManual = true;

  constructor(
    private merchantUpiId: string = 'oryqen.study@okhdfcbank',
    private merchantName: string = 'ORYQEN STUDY AI'
  ) {}

  public async createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
    const cleanNote = encodeURIComponent(`ORYQEN ${params.planId.toUpperCase()} Subscription`);
    const upiUrl = `upi://pay?pa=${this.merchantUpiId}&pn=${encodeURIComponent(this.merchantName)}&am=${params.amount}&cu=INR&tn=${cleanNote}`;

    return {
      orderId: params.referenceId,
      amount: params.amount,
      currency: params.currency || 'INR',
      merchantUpiId: this.merchantUpiId,
      upiPaymentUrl: upiUrl,
      qrPayload: upiUrl,
      instructions: [
        'Open any UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred).',
        `Scan the QR code or send payment directly to verified UPI ID: ${this.merchantUpiId}`,
        `Verify the exact payable amount: ₹${params.amount}`,
        'After payment, locate the 12-digit UTR / UPI Transaction ID in your banking/UPI app.',
        'Submit the 12-digit UTR in the form below for fast admin verification and subscription activation.',
      ],
    };
  }

  public async verifyWebhook(_headers: Record<string, string>, _body: any): Promise<WebhookVerificationResult> {
    // In manual mode, webhooks are not used; independent verification is performed by authorized admin.
    return {
      isValid: false,
      status: 'pending',
    };
  }
}
