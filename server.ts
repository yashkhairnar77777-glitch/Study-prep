import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { studyService } from './server/studyService.js';
import { orchestrator } from './server/providers/orchestrator.js';

dotenv.config();

const app = express();
// Runtime Environment requires dev server to run strictly on port 3000
const PORT = 3000;

// Request body parser with 25MB limit for high-res photo uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// API ROUTES
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    name: 'ORYQEN STUDY AI Engine',
  });
});

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
