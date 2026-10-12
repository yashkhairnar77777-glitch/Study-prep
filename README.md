# ORYQEN STUDY AI

> **An intelligent, instruction-following AI study companion for school students (Classes 1–12), college students, and competitive exam candidates.**

---

## 🌟 Key Capabilities

1. **AI Tutor Chat with Pedagogical Rigor**
   - Grade-aware instruction (Classes 1–12, College, Competitive Exams).
   - Subject-specific methodologies: step-by-step mathematical problem checking with units, scientific conceptual grounding, and grammatical precision.
   - Answer styles: **Quick Answer**, **Step-by-Step Explanation**, **Exam-Ready Answer**, and **Teach Me from the Basics**.
   - LaTeX mathematical formula rendering with KaTeX (`$...$` and `$$...$$`), syntax-highlighted code blocks, and copy affordances.

2. **Photo Question Solver**
   - Transcribes readable textbook or handwritten questions from photos.
   - Genuine multimodal vision processing via Groq Vision (`llama-3.2-11b-vision-preview`), OpenRouter vision models, or Google Gemini (`gemini-2.5-flash`).
   - Validates file size (up to 10MB) and formats (JPEG, PNG, WebP).
   - Generates step-by-step solutions with sanity checks and exam tips.

3. **PDF & Document Analysis**
   - Digital text extraction from PDFs, Markdown (`.md`), and plain text (`.txt`).
   - Real page counts, character analysis, and section segmentation.
   - Questions are grounded strictly in the uploaded document with page references.
   - Explicit notices for scanned PDFs without digital text streams.

4. **Exam Paper Generator & Mock Tests**
   - Generates structured practice exams tailored to grade, subject, topics, difficulty, duration, and question formats (MCQ, Short Answer, Long Answer, True/False, Fill in the blanks).
   - Verifies total marks match the allocated sum.
   - Interactive timed mock test mode with countdown timer, question palette, flag for review, and instant submission.
   - Deterministic objective scoring in application code, with subjective rubric evaluation.

5. **Smart Revision (Leitner Spaced Repetition)**
   - Topic-based flashcards with 3D flip card interaction.
   - Deterministic Leitner interval progression (Boxes 1–5: 1 day, 3 days, 7 days, 14 days, 30 days).
   - Rated as **Easy**, **Medium**, or **Hard** to adjust review intervals.
   - Integrated notebook for saving key explanations directly from tutor sessions.

6. **Student Dashboard & Local-First Persistence**
   - Academic KPI tracking: real question counts, mock test accuracy %, flashcards due today, and recent sessions.
   - Completely local-first data model with zero risk of private data leakage.
   - One-click JSON backup export and import for student data transfer across devices.

---

## 🛠️ Multi-Provider AI Architecture

ORYQEN STUDY AI features a server-side provider abstraction layer:

- **Primary Provider**: **Groq** (`GROQ_API_KEY`, `GROQ_MODEL`)
  - Default text model: `llama-3.3-70b-versatile`
  - Default vision model: `llama-3.2-11b-vision-preview`
- **Secondary Provider**: **OpenRouter** (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`)
  - Default model: `meta-llama/llama-3.3-70b-instruct:free`
- **Built-in / Fallback**: **Google Gemini** (`GEMINI_API_KEY`, `GEMINI_MODEL`)
  - Default model: `gemini-2.5-flash`

### Fallback Logic:
1. Attempts primary provider (**Groq**).
2. If Groq encounters rate limits, timeouts, or availability errors, attempts secondary provider (**OpenRouter**).
3. If OpenRouter is not configured or fails, falls back to **Gemini**.
4. If all fail, displays a transparent error report detailing the exact provider issues and offering a retry option.
5. Zero API keys or secrets are ever exposed in frontend JavaScript, HTML, or browser storage.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env (see .env.example)
cp .env.example .env

# 3. Start development server (runs Express with Vite middleware on port 3000)
npm run dev
```

---

## ☁️ Deployment

### Netlify Deployment
The repository includes a ready-to-deploy `netlify.toml` and serverless functions in `netlify/functions/api.ts`:

1. Connect the Git repository to Netlify.
2. In Netlify Site Settings > **Environment variables**, configure:
   - `GROQ_API_KEY` (and optionally `GROQ_MODEL`)
   - `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`)
   - `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`)
3. Deploy! Netlify automatically executes `npm run build` and mounts the serverless functions under `/.netlify/functions/api`.
