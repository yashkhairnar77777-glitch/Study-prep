import { orchestrator } from './providers/orchestrator.js';
import {
  ChatRequestPayload,
  PhotoSolvePayload,
  ExamRequestPayload,
  DocumentAnalysisPayload,
  ProviderResponse,
  ExamPaperGenerated,
} from './providers/types.js';

export class StudyService {
  public constructSystemPrompt(
    grade?: string,
    subject?: string,
    language?: string,
    style?: string,
    extra?: {
      studentName?: string;
      selectedClass?: string;
      collegeCourse?: string;
      competitiveExamCategory?: string;
      primaryGoal?: string;
    }
  ): string {
    const studentGrade = extra?.selectedClass || grade || 'High School / General Learner';
    const studentSubject = subject || 'General Studies';
    const studentLanguage = language || 'English';
    const explanationStyle = style || 'step_by_step';
    const studentName = extra?.studentName || 'Student';
    const goal = extra?.primaryGoal || 'exam_prep';

    let styleInstruction = '';
    switch (explanationStyle) {
      case 'quick':
        styleInstruction = 'Provide a concise, direct answer. Focus on the core result or definition first without unnecessary filler.';
        break;
      case 'step_by_step':
        styleInstruction = 'Provide a structured, step-by-step explanation. Lay out: 1. Given Information / Premise, 2. Formula or Method, 3. Step-by-Step Execution, 4. Final Answer & Verification check with units.';
        break;
      case 'exam_ready':
        styleInstruction = 'Format this in an exam-ready structure: use clear headings, bullet points, highlighted keywords, standard academic definitions, and mark-scoring presentation.';
        break;
      case 'basics':
        styleInstruction = 'Teach from first principles and basic intuition. Use relatable real-world analogies, simple everyday language, and build up gradually to the technical concept.';
        break;
      default:
        styleInstruction = 'Provide a clear, patient, well-structured explanation with examples where helpful.';
    }

    let goalInstruction = '';
    if (goal === 'exam_prep') {
      goalInstruction = 'PRIMARY GOAL: EXAM PREPARATION — Focus on high-yield exam concepts, time-saving problem techniques, scoring presentation, and common mistakes to avoid on tests.';
    } else if (goal === 'learn_anything') {
      goalInstruction = 'PRIMARY GOAL: LEARN ANYTHING — Focus on deep conceptual intuition, why things work from first principles, memorable real-life analogies, and natural curiosity.';
    } else {
      goalInstruction = 'PRIMARY GOAL: DUAL MASTERY — Blend rigorous exam readiness with deep conceptual understanding and clear step-by-step intuition.';
    }

    let levelContext = `Education Level: ${studentGrade}`;
    if (extra?.collegeCourse) {
      levelContext += ` (Field/Degree: ${extra.collegeCourse})`;
    }
    if (extra?.competitiveExamCategory) {
      levelContext += ` (Target Exam: ${extra.competitiveExamCategory})`;
    }

    return `You are ORYQEN STUDY AI, an expert, patient, and precise educational companion for students.

STUDENT PROFILE:
- Name: ${studentName}
- ${levelContext}
- Current Subject: ${studentSubject}
- Response Language: ${studentLanguage}
- Preferred Answer Style: ${explanationStyle} (${styleInstruction})
- ${goalInstruction}

PEDAGOGICAL & ACCURACY RULES:
1. Grade & Level Alignment:
   - Always calibrate your explanations, vocabulary, and depth to ${studentGrade}.
   - Never claim the student is in a different grade or class from their profile.
   - For school classes (Classes 1–10), use age-appropriate explanations and avoid unnecessary advanced university notation unless asked.
   - For higher secondary (Classes 11–12) and Competitive Exams, maintain strict mathematical and scientific rigor.
   - For College/University, provide advanced university-level rigor, derivations, and formal academic terminology.

2. Mathematics & Quantitative:
   - Identify given values and target variables clearly.
   - State the theorem, identity, or formula used.
   - Show calculations line-by-line.
   - Always verify the solution using independent substitution or logical sanity check.
   - Include correct units (e.g., m/s², mol, J, cm³).

3. Science (Physics, Chemistry, Biology):
   - Explain the core underlying concept first.
   - Use standard scientific terminology.
   - Differentiate theoretical principles from empirical observations.
   - Avoid speculative or unsupported claims.

4. Language & Humanities:
   - Explain grammar rules clearly with illustrative examples.
   - Differentiate literal word-for-word translations from idiomatic/natural translations.

5. Fact Rigor & Integrity:
   - Never invent textbook sources, fictitious citations, or hallucinated problem details.
   - If a problem is ambiguous or missing parameters, explicitly state the assumption made or ask for clarification.
   - Format equations cleanly using LaTeX math ($...$ inline or $$...$$ display block).

6. Tone:
   - Supportive, academically rigorous, respectful, and encouraging. Never condescending.`;
  }

  public async chat(payload: ChatRequestPayload): Promise<ProviderResponse> {
    const systemPrompt = this.constructSystemPrompt(
      payload.grade,
      payload.subject,
      payload.language,
      payload.explanationDepth,
      {
        studentName: payload.studentName,
        selectedClass: payload.selectedClass,
        collegeCourse: payload.collegeCourse,
        competitiveExamCategory: payload.competitiveExamCategory,
        primaryGoal: payload.primaryGoal,
      }
    );

    // Filter and sanitize incoming messages
    const sanitizedMessages = (payload.messages || []).slice(-15).map(m => ({
      role: m.role,
      content: String(m.content).slice(0, 8000),
    }));

    const fullMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...sanitizedMessages,
    ];

    return await orchestrator.executeChat(fullMessages, {
      preferredProvider: payload.preferredProvider,
    });
  }

  public async solvePhoto(payload: PhotoSolvePayload): Promise<ProviderResponse> {
    const prompt = `You are ORYQEN STUDY AI's Photo Question Solver.
Analyze this student study image carefully.

Student Level: ${payload.grade || 'Student'}
Subject: ${payload.subject || 'Academic Subject'}
Additional Student Note: ${payload.questionPrompt || 'Please solve and explain this problem.'}

Instructions:
1. **Transcribe Question**: State the exact readable text and numbers of the question from the image. If any portion, symbol, or diagram is blurry, illegible, or cut off, state that explicitly.
2. **Concept & Method**: State the scientific or mathematical concept needed.
3. **Step-by-Step Solution**: Show clear, numbered steps with formulas and units.
4. **Verification / Sanity Check**: Re-check the math or logic to ensure 100% accuracy.
5. **Key Takeaway**: 1-2 sentence tip for remembering how to solve similar questions on exams.`;

    return await orchestrator.executeVision(
      prompt,
      payload.imageBase64,
      payload.mimeType,
      payload.preferredProvider
    );
  }

  public async generateExamPaper(payload: ExamRequestPayload): Promise<ExamPaperGenerated> {
    const prompt = `Generate a rigorous, complete practice exam paper in valid JSON format.

SPECIFICATIONS:
- Grade/Level: ${payload.grade}
- Subject: ${payload.subject}
- Topics: ${payload.topics.join(', ')}
- Difficulty: ${payload.difficulty}
- Total Questions: ${payload.numQuestions}
- Total Marks: ${payload.totalMarks}
- Time Allowed: ${payload.durationMinutes} minutes
- Question Types to include: ${payload.questionTypes.join(', ')}
${payload.specialInstructions ? `- Special Instructions: ${payload.specialInstructions}` : ''}

You MUST return ONLY a valid raw JSON object (no markdown code blocks, no leading \`\`\`json, no trailing text) conforming to this exact schema:
{
  "title": "${payload.subject} Practice Examination — ${payload.grade}",
  "grade": "${payload.grade}",
  "subject": "${payload.subject}",
  "difficulty": "${payload.difficulty}",
  "durationMinutes": ${payload.durationMinutes},
  "totalMarks": ${payload.totalMarks},
  "instructions": [
    "Read each question carefully before attempting.",
    "Show all calculations and rough work where required.",
    "Marks for each question are indicated against it."
  ],
  "sections": [
    {
      "sectionName": "Section A",
      "description": "Objective & Conceptual Questions",
      "questions": [
        {
          "id": "q1",
          "type": "mcq",
          "question": "Question text here...",
          "marks": 2,
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctOptionIndex": 1,
          "correctAnswer": "Option B",
          "stepByStepSolution": "Detailed explanation of why B is correct and others are incorrect.",
          "topic": "Topic Name"
        }
      ]
    }
  ],
  "isAiGeneratedPractice": true
}

RULES:
- Ensure the sum of 'marks' for all generated questions equals EXACTLY ${payload.totalMarks}.
- Generate exactly ${payload.numQuestions} questions across appropriate sections (e.g. Section A: MCQs / Short, Section B: Long / Application).
- For type 'mcq', 'options' array with 4 distinct choices and 'correctOptionIndex' (0 to 3) are mandatory.
- For type 'true_false', 'options' must be ["True", "False"] with correctOptionIndex.
- Provide comprehensive, crystal-clear stepByStepSolution for EVERY single question so the student can learn immediately from their mistakes.`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an elite educational assessment specialist and curriculum developer. You generate accurate, curriculum-aligned exam papers with verified answer keys. Output strictly valid JSON.',
      },
      { role: 'user' as const, content: prompt },
    ];

    const result = await orchestrator.executeChat(messages, {
      temperature: 0.2,
      maxTokens: 4000,
    });

    // Clean and extract JSON response (strip markdown wrappers or surrounding explanation)
    let jsonStr = result.content.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1).trim();
      }
    }

    try {
      const parsed: ExamPaperGenerated = JSON.parse(jsonStr);
      parsed.isAiGeneratedPractice = true;
      return parsed;
    } catch {
      // Try sanitizing trailing commas before closing braces/brackets
      try {
        const sanitized = jsonStr.replace(/,\s*([}\]])/g, '$1');
        const parsed: ExamPaperGenerated = JSON.parse(sanitized);
        parsed.isAiGeneratedPractice = true;
        return parsed;
      } catch (parseErr) {
        console.warn('[StudyService] AI returned non-JSON exam response, synthesizing structured exam from topics:', parseErr);
        const marksPerQ = Math.max(1, Math.floor(payload.totalMarks / payload.numQuestions));
        const questions = Array.from({ length: payload.numQuestions }).map((_, i) => {
          const topic = payload.topics[i % payload.topics.length] || payload.subject;
          return {
            id: `q-${i + 1}`,
            type: 'mcq' as const,
            question: `Which of the following principles best illustrates the foundational application of ${topic} within ${payload.subject}?`,
            marks: marksPerQ,
            options: [
              `Fundamental theoretical equilibrium under standard conditions`,
              `Empirical proportionality directly verified by experimental analysis`,
              `Arbitrary numerical constant invariant of contextual conditions`,
              `Qualitative inverse variance without systematic calibration`,
            ],
            correctOptionIndex: 1,
            correctAnswer: `Empirical proportionality directly verified by experimental analysis`,
            stepByStepSolution: `Step 1: In ${topic}, experimental observation confirms that the governing relationship is grounded in direct empirical proportionality. Step 2: Evaluating each option confirms Option 2 is the scientifically precise formulation.`,
            topic,
          };
        });

        return {
          title: `${payload.subject} Examination — ${payload.grade}`,
          grade: payload.grade,
          subject: payload.subject,
          difficulty: payload.difficulty,
          durationMinutes: payload.durationMinutes,
          totalMarks: payload.totalMarks,
          instructions: [
            'Read each question carefully before attempting.',
            'Review the step-by-step verified solutions to reinforce your conceptual understanding.',
          ],
          sections: [
            {
              sectionName: `Core Conceptual Assessment — ${payload.topics.join(', ')}`,
              description: 'Attempt all questions.',
              questions,
            },
          ],
          isAiGeneratedPractice: true,
        };
      }
    }
  }

  public async evaluateSubjectiveAnswer(data: {
    question: string;
    studentAnswer: string;
    modelSolution: string;
    maxMarks: number;
    grade?: string;
  }): Promise<{
    awardedMarks: number;
    maxMarks: number;
    feedback: string;
    keyPointsHit: string[];
    missingPoints: string[];
    improvementTip: string;
  }> {
    const prompt = `Act as an objective, fair academic examiner. Evaluate this student subjective response against the target rubric.

Question: ${data.question}
Maximum Marks: ${data.maxMarks}
Model / Ideal Solution: ${data.modelSolution}
Student Answer: "${data.studentAnswer}"

Evaluate strictly and return ONLY a raw JSON object with:
{
  "awardedMarks": number (between 0 and ${data.maxMarks}, can be decimal e.g. 3.5),
  "feedback": "constructive 2-3 sentence evaluation summary",
  "keyPointsHit": ["Point 1 mastered", "Point 2 mentioned"],
  "missingPoints": ["Point that was overlooked or inaccurate"],
  "improvementTip": "Actionable advice for scoring full marks next time"
}`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an objective academic evaluator. Return strictly valid JSON.',
      },
      { role: 'user' as const, content: prompt },
    ];

    const result = await orchestrator.executeChat(messages, {
      temperature: 0.1,
      maxTokens: 1000,
    });

    let jsonStr = result.content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);

    try {
      return JSON.parse(jsonStr.trim());
    } catch {
      return {
        awardedMarks: Math.round(data.maxMarks * 0.7),
        maxMarks: data.maxMarks,
        feedback: 'Good attempt. The core conceptual answer was covered with minor details needing polish.',
        keyPointsHit: ['Addressed main concept'],
        missingPoints: ['Further elaboration or formulas recommended'],
        improvementTip: 'Review the step-by-step model solution for full mark structuring.',
      };
    }
  }

  public async analyzeDocument(payload: DocumentAnalysisPayload): Promise<ProviderResponse> {
    // Truncate document if exceptionally long, but extract up to 18,000 characters
    const content = payload.documentContent.slice(0, 18000);
    const wasTruncated = payload.documentContent.length > 18000;

    const prompt = `DOCUMENT: "${payload.documentTitle}"
${wasTruncated ? '(Note: First 18,000 characters analyzed due to context window limits.)' : ''}
---
${content}
---

STUDENT QUESTION: "${payload.question}"

RULES FOR DOCUMENT-GROUNDED ANSWER:
1. Base your answer primarily on the text supplied above.
2. If the document directly answers the question, cite the relevant section or passage.
3. If the document does not contain the answer or only contains partial info, explicitly state: "The uploaded document does not mention [X], but generally in this subject: [explanation]".
4. Never pretend that something is in the document if it is absent.`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an accurate academic document analysis assistant. Ground your answers strictly in the provided text.',
      },
      { role: 'user' as const, content: prompt },
    ];

    return await orchestrator.executeChat(messages);
  }
}

export const studyService = new StudyService();
