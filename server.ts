import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { studyService } from './server/studyService.js';
import { orchestrator } from './server/providers/orchestrator.js';
import { subscriptionStore } from './server/subscriptionStore.js';
import { ManualUpiGateway } from './server/payments/gatewayInterface.js';

dotenv.config();

const app = express();
// Runtime Environment requires dev server to run strictly on port 3000
const PORT = 3000;

// Request body parser with 25MB limit for high-res photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to extract student and admin email from headers or body
const getRequestStudentEmail = (req: Request): string => {
  return (
    (req.headers['x-student-email'] as string) ||
    (req.query.studentEmail as string) ||
    req.body?.studentEmail ||
    'student@oryqen.ai'
  );
};

const getRequestAdminEmail = (req: Request): string => {
  return (
    (req.headers['x-admin-email'] as string) ||
    (req.headers['x-student-email'] as string) ||
    req.body?.adminEmail ||
    (req.query.adminEmail as string) ||
    ''
  );
};

// API ROUTES
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    name: 'ORYQEN STUDY AI Engine',
  });
});

// --- SUBSCRIPTION & PAYMENT ROUTES ---
app.get('/api/subscription/plans', (_req: Request, res: Response) => {
  try {
    const plans = subscriptionStore.getPlans();
    const merchantConfig = subscriptionStore.getMerchantConfig();
    res.json({
      success: true,
      plans,
      merchantConfig: {
        merchantUpiId: merchantConfig.merchantUpiId,
        merchantName: merchantConfig.merchantName,
        merchantBank: merchantConfig.merchantBank,
        instructions: merchantConfig.instructions,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch plans';
    res.status(500).json({ success: false, error: message });
  }
});

app.get('/api/subscription/status', (req: Request, res: Response) => {
  try {
    const email = getRequestStudentEmail(req);
    const subscription = subscriptionStore.getSubscription(email);
    const planConfig = subscriptionStore.getPlan(subscription.plan);
    const isAdmin = subscriptionStore.isAuthorizedAdmin(email);
    const merchantConfig = subscriptionStore.getMerchantConfig();

    res.json({
      success: true,
      subscription,
      planConfig,
      isAdmin,
      merchantConfig: {
        merchantUpiId: merchantConfig.merchantUpiId,
        merchantName: merchantConfig.merchantName,
        merchantBank: merchantConfig.merchantBank,
        instructions: merchantConfig.instructions,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get subscription status';
    res.status(500).json({ success: false, error: message });
  }
});

// Submit manual UPI payment request
app.post('/api/payments/request', async (req: Request, res: Response) => {
  try {
    const {
      studentEmail,
      studentName,
      payerUpiId,
      utrNumber,
      plan,
      duration,
      amount,
      couponCodeApplied,
      discountAmount,
      screenshotBase64,
    } = req.body;

    const email = studentEmail || getRequestStudentEmail(req);

    const result = subscriptionStore.createPaymentRequest({
      studentEmail: email,
      studentName: studentName || 'Student',
      payerUpiId,
      utrNumber,
      plan: plan || 'plus',
      duration: duration || 'monthly',
      amount: Number(amount) || 0,
      couponCodeApplied,
      discountAmount: Number(discountAmount) || 0,
      screenshotBase64,
    });

    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({
      success: true,
      message: 'Payment request submitted successfully for manual verification.',
      paymentRequest: result.request,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit payment request';
    res.status(500).json({ success: false, error: message });
  }
});

// Student's own payment history
app.get('/api/payments/my-requests', (req: Request, res: Response) => {
  try {
    const email = getRequestStudentEmail(req);
    const requests = subscriptionStore.getPaymentRequests({ studentEmail: email });
    const redemptions = subscriptionStore.getRedemptions({ studentEmail: email });
    res.json({ success: true, requests, redemptions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch payment history';
    res.status(500).json({ success: false, error: message });
  }
});

// Validate Coupon
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, studentEmail, targetPlan } = req.body;
    const email = studentEmail || getRequestStudentEmail(req);

    if (!code) {
      res.status(400).json({ success: false, error: 'Coupon code is required.' });
      return;
    }

    const validation = subscriptionStore.validateCoupon(code, email, targetPlan);
    res.json({ success: validation.isValid, validation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to validate coupon';
    res.status(500).json({ success: false, error: message });
  }
});

// Redeem Coupon
app.post('/api/coupons/redeem', (req: Request, res: Response) => {
  try {
    const { code, studentEmail, studentName, targetPlan } = req.body;
    const email = studentEmail || getRequestStudentEmail(req);

    if (!code) {
      res.status(400).json({ success: false, error: 'Coupon code is required.' });
      return;
    }

    const result = subscriptionStore.redeemCoupon(code, email, studentName, targetPlan);
    if (!result.success) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({
      success: true,
      message: 'Coupon redeemed successfully!',
      planGranted: result.planGranted,
      durationDaysGranted: result.coupon?.durationDays || 30,
      expiresAt: result.expiresAt,
      subscription: result.subscription,
      discountApplied: result.discountApplied,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Coupon redemption failed';
    res.status(500).json({ success: false, error: message });
  }
});

// --- ADMIN CONTROL ROUTES (Role-based Backend Protected) ---
const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const adminEmail = getRequestAdminEmail(req);
  if (!subscriptionStore.isAuthorizedAdmin(adminEmail)) {
    res.status(403).json({
      success: false,
      error: 'Access denied: Authorised administrator permissions required.',
    });
    return;
  }
  next();
};

// Admin: Get all payment requests
app.get('/api/admin/payments', requireAdmin, (req: Request, res: Response) => {
  try {
    const status = req.query.status as any;
    const search = req.query.search as string;
    const requests = subscriptionStore.getPaymentRequests({ status, search });
    res.json({ success: true, requests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve payment requests';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Review payment request (approve/reject)
app.post('/api/admin/payments/:id/review', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, approvedPlan, approvedDuration, adminNotes, rejectionReason } = req.body;
    const adminEmail = getRequestAdminEmail(req);

    if (!action || !['approve', 'reject'].includes(action)) {
      res.status(400).json({ success: false, error: 'Action must be approve or reject.' });
      return;
    }

    const result = subscriptionStore.reviewPaymentRequest(id, action, adminEmail, {
      approvedPlan,
      approvedDuration,
      adminNotes,
      rejectionReason,
    });

    if (!result.success || !result.request) {
      res.status(400).json({ success: false, error: result.error || 'Failed to review request.' });
      return;
    }

    const updatedSub = subscriptionStore.getSubscription(result.request.studentEmail);

    res.json({
      success: true,
      message: `Payment request ${action}d successfully.`,
      paymentRequest: result.request,
      subscription: updatedSub,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to review payment request';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Get coupons & redemptions
app.get('/api/admin/coupons', requireAdmin, (_req: Request, res: Response) => {
  try {
    const coupons = subscriptionStore.getCoupons();
    const redemptions = subscriptionStore.getRedemptions();
    res.json({ success: true, coupons, redemptions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch coupons';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Create new coupon
app.post('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
  try {
    const adminEmail = getRequestAdminEmail(req);
    const couponPayload = req.body;

    const result = subscriptionStore.createCoupon({
      ...couponPayload,
      adminEmail,
    });

    if (!result.success || !result.coupon) {
      res.status(400).json({ success: false, error: result.error || 'Failed to create coupon.' });
      return;
    }

    res.json({ success: true, coupon: result.coupon });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create coupon';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Toggle coupon active/inactive
app.patch('/api/admin/coupons/:id/toggle', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminEmail = getRequestAdminEmail(req);
    const result = subscriptionStore.toggleCouponStatus(id, adminEmail);

    if (!result.success || !result.coupon) {
      res.status(404).json({ success: false, error: result.error || 'Coupon not found.' });
      return;
    }

    res.json({ success: true, coupon: result.coupon });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle coupon';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Update plan pricing
app.post('/api/admin/plans/price', requireAdmin, (req: Request, res: Response) => {
  try {
    const { planId, monthlyPrice, yearlyPrice } = req.body;
    const adminEmail = getRequestAdminEmail(req);

    if (!planId || monthlyPrice === undefined || yearlyPrice === undefined) {
      res.status(400).json({ success: false, error: 'planId, monthlyPrice and yearlyPrice are required.' });
      return;
    }

    const success = subscriptionStore.updatePlanPrice(planId, Number(monthlyPrice), Number(yearlyPrice), adminEmail);
    if (!success) {
      res.status(404).json({ success: false, error: 'Plan not found.' });
      return;
    }

    res.json({ success: true, plans: subscriptionStore.getPlans() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update plan price';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: View Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
  try {
    const logs = subscriptionStore.getAdminAuditLogs();
    res.json({ success: true, logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch audit logs';
    res.status(500).json({ success: false, error: message });
  }
});

// Admin: Update Merchant Config
app.post('/api/admin/config', requireAdmin, (req: Request, res: Response) => {
  try {
    const adminEmail = getRequestAdminEmail(req);
    const updated = subscriptionStore.updateMerchantConfig(req.body, adminEmail);
    res.json({ success: true, merchantConfig: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update merchant config';
    res.status(500).json({ success: false, error: message });
  }
});

// --- EXISTING STUDY AI ROUTES ---
app.get('/api/providers/status', (_req: Request, res: Response) => {
  try {
    const status = orchestrator.getStatus();
    res.json({ success: true, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve provider status';
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages,
      grade,
      selectedClass,
      collegeCourse,
      competitiveExamCategory,
      studentName,
      primaryGoal,
      subject,
      language,
      explanationDepth,
      preferredProvider,
    } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: 'Valid messages array is required.' });
      return;
    }

    const response = await studyService.chat({
      messages,
      grade,
      selectedClass,
      collegeCourse,
      competitiveExamCategory,
      studentName,
      primaryGoal,
      subject,
      language,
      explanationDepth,
      preferredProvider,
    });

    res.json({ success: true, data: response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Chat processing failed';
    console.error('[API /api/chat error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/solve-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, questionPrompt, grade, subject, preferredProvider } = req.body;
    if (!imageBase64) {
      res.status(400).json({ success: false, error: 'Image data is required.' });
      return;
    }

    const response = await studyService.solvePhoto({
      imageBase64,
      mimeType: mimeType || 'image/jpeg',
      questionPrompt,
      grade,
      subject,
      preferredProvider,
    });

    res.json({ success: true, data: response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Photo solving failed';
    console.error('[API /api/solve-photo error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/generate-exam', async (req: Request, res: Response) => {
  try {
    const {
      grade,
      subject,
      topics,
      difficulty,
      numQuestions,
      questionTypes,
      totalMarks,
      durationMinutes,
      specialInstructions,
    } = req.body;

    if (!grade || !subject || !topics || !numQuestions) {
      res.status(400).json({ success: false, error: 'Missing required exam parameters.' });
      return;
    }

    const examPaper = await studyService.generateExamPaper({
      grade,
      subject,
      topics: Array.isArray(topics) ? topics : [String(topics)],
      difficulty: difficulty || 'Medium',
      numQuestions: Number(numQuestions) || 5,
      questionTypes: questionTypes || ['mcq', 'short'],
      totalMarks: Number(totalMarks) || 20,
      durationMinutes: Number(durationMinutes) || 30,
      specialInstructions,
    });

    res.json({ success: true, data: examPaper });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Exam generation failed';
    console.error('[API /api/generate-exam error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, modelSolution, maxMarks, grade } = req.body;
    if (!question || !studentAnswer) {
      res.status(400).json({ success: false, error: 'Question and student answer are required.' });
      return;
    }

    const evaluation = await studyService.evaluateSubjectiveAnswer({
      question,
      studentAnswer,
      modelSolution: modelSolution || '',
      maxMarks: Number(maxMarks) || 5,
      grade,
    });

    res.json({ success: true, data: evaluation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Answer evaluation failed';
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/evaluate-oral-answer', async (req: Request, res: Response) => {
  try {
    const studentEmail = getRequestStudentEmail(req);
    const sub = subscriptionStore.getSubscription(studentEmail);
    if (sub.plan === 'free') {
      res.status(403).json({
        success: false,
        error: 'AI Oral Viva Examination requires a Scholar Plus or Mastery Pro subscription. Please upgrade your plan to unlock interactive voice assessment.',
        code: 'FEATURE_LOCKED',
        requiredPlan: 'plus',
      });
      return;
    }

    const { question, studentSpeech, modelAnswer, expectedKeywords, grade, subject } = req.body;
    if (!question || !studentSpeech) {
      res.status(400).json({ success: false, error: 'Question and spoken/transcribed answer are required.' });
      return;
    }

    const evaluation = await studyService.evaluateOralAnswer({
      question,
      studentSpeech,
      modelAnswer: modelAnswer || '',
      expectedKeywords: Array.isArray(expectedKeywords) ? expectedKeywords : [],
      grade,
      subject,
    });

    res.json({ success: true, data: evaluation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Oral evaluation failed';
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/analyze-doc', async (req: Request, res: Response) => {
  try {
    const { documentTitle, documentContent, question, grade, subject } = req.body;
    if (!documentContent || !question) {
      res.status(400).json({ success: false, error: 'Document content and question are required.' });
      return;
    }

    const response = await studyService.analyzeDocument({
      documentTitle: documentTitle || 'Uploaded Document',
      documentContent,
      question,
      grade,
      subject,
    });

    res.json({ success: true, data: response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Document analysis failed';
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/study-generator/generate', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload || !payload.sourceMode) {
      res.status(400).json({ success: false, error: 'Valid study generator payload is required.' });
      return;
    }

    const studyPack = await studyService.generateStudyPack(payload);
    res.json({ success: true, data: studyPack });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Study Pack generation failed';
    console.error('[API /api/study-generator/generate error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

app.post('/api/study-generator/ocr', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, pageNumber } = req.body;
    if (!imageBase64) {
      res.status(400).json({ success: false, error: 'Image data is required for OCR.' });
      return;
    }

    const prompt = `You are ORYQEN STUDY AI's High-Precision Document OCR Engine.
Transcribe all readable text, formulas, headings, bullet points, and diagram labels from this study document or handwritten notes page.
${pageNumber ? `Target: Page ${pageNumber}` : ''}

RULES:
1. Output the exact transcribed text cleanly formatted in Markdown.
2. For mathematical or chemical formulas, transcribe into LaTeX notation (e.g. $E=mc^2$).
3. Maintain structure: preserve headings, lists, tables, and notes.
4. Do not include commentary, meta-chatter, or preambles. Output only the transcribed content.`;

    const ocrResponse = await orchestrator.executeVision(
      prompt,
      imageBase64,
      mimeType || 'image/jpeg'
    );

    res.json({ success: true, text: ocrResponse.content, providerUsed: ocrResponse.providerUsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Document OCR extraction failed';
    console.error('[API /api/study-generator/ocr error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

// AI Study Timer & Adaptive Schedule Generator
app.post('/api/generate-study-schedule', async (req: Request, res: Response) => {
  try {
    const { subject, topic, totalDurationMinutes, energyLevel, goalType, customContext, grade } = req.body;
    if (!subject || !topic || !totalDurationMinutes) {
      res.status(400).json({
        success: false,
        error: 'subject, topic, and totalDurationMinutes are required to generate an AI study schedule.',
      });
      return;
    }

    const schedule = await studyService.generateStudySchedule({
      subject,
      topic,
      totalDurationMinutes: Number(totalDurationMinutes) || 60,
      energyLevel: energyLevel || 'moderate',
      goalType: goalType || 'deep_learning',
      customContext,
      grade,
    });

    res.json({ success: true, data: schedule });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate study schedule';
    console.error('[API /api/generate-study-schedule error]:', message);
    res.status(500).json({ success: false, error: message });
  }
});

// START SERVER / VITE MIDDLEWARE
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ORYQEN STUDY AI] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Fatal Error starting server]:', err);
  process.exit(1);
});
