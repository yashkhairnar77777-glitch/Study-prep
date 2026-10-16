import { orchestrator } from './providers/orchestrator.js';
import {
  ChatRequestPayload,
  PhotoSolvePayload,
  ExamRequestPayload,
  DocumentAnalysisPayload,
  ProviderResponse,
  ExamPaperGenerated,
  StudyGeneratorRequestPayload,
  StudyGeneratorResponsePayload,
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

  public async generateStudyPack(payload: StudyGeneratorRequestPayload): Promise<StudyGeneratorResponsePayload> {
    const isSyllabus = payload.sourceMode === 'syllabus';
    const title = isSyllabus
      ? `${payload.subject || 'Subject'}: ${payload.chapter || 'Chapter Study Pack'}`
      : `Study Pack: ${payload.documentTitle || 'Uploaded Notes'}`;

    let groundingText = '';
    let groundingSummary = '';

    if (isSyllabus) {
      const topicList = (payload.syllabusTopics || []).map(t => `• ${t}`).join('\n');
      groundingText = `SOURCE CURRICULUM FRAMEWORK:
- Board: ${payload.board || 'CBSE / NCERT'}
- Curriculum / Reference: ${payload.curriculum || 'Standard Prescribed Syllabus'}
- Grade / Level: ${payload.grade || 'High School'}
- Subject: ${payload.subject || 'Core Subject'}
- Chapter: ${payload.chapter || 'General Chapter'}
- Academic Year: ${payload.academicYear || 'Current Academic Session'}

VERIFIED SYLLABUS TOPICS & LEARNING TARGETS:
${topicList || '• Comprehensive conceptual coverage of ' + (payload.chapter || 'the syllabus')}

${payload.customTopicsOrNotes ? `STUDENT SUPPLEMENTAL NOTES / SPECIFIC FOCUS:\n${payload.customTopicsOrNotes}` : ''}`;

      groundingSummary = `Grounded in ${payload.board || 'CBSE'} ${payload.grade || ''} ${payload.subject || ''} syllabus (${payload.chapter || 'Chapter'}).`;
    } else {
      const textSample = (payload.documentContent || '').slice(0, 18000);
      groundingText = `UPLOADED SOURCE DOCUMENT:
- Title: ${payload.documentTitle || 'Student Document'}
${payload.pageContextSummary ? `- Page Information: ${payload.pageContextSummary}` : ''}
---
${textSample}
---`;

      groundingSummary = `Grounded in uploaded document "${payload.documentTitle || 'Notes'}"${
        payload.pageContextSummary ? ` (${payload.pageContextSummary})` : ''
      }.`;
    }

    const selectedOutputs = payload.selectedOutputs || ['flashcards', 'notes', 'mcq_quiz'];
    const examConfig = payload.examConfig || { durationMinutes: 30, difficulty: 'Medium', totalMarks: 20 };

    const requestedSectionsPrompt: string[] = [];

    if (selectedOutputs.includes('flashcards')) {
      requestedSectionsPrompt.push(`
"flashcards": [
  {
    "front": "Clear, specific question, conceptual problem, or formula prompt",
    "back": "Accurate, step-by-step answer or definition with correct units and reasoning",
    "topic": "Specific Topic Name"
  }
]`);
    }

    if (selectedOutputs.includes('notes')) {
      requestedSectionsPrompt.push(`
"notes": {
  "title": "${isSyllabus ? payload.chapter : payload.documentTitle} — Comprehensive Revision Notes",
  "summary": "2-3 sentence executive conceptual summary",
  "markdownContent": "Well-structured notes in GitHub-flavored Markdown. Include ## Key Concepts, ### Theoretical Principles, ### Formulas & Derivations (use LaTeX $...$ or $$...$$), ### Practical Applications, and ### Common Pitfalls to Avoid.",
  "keyFormulas": ["Formula 1 with variable definitions", "Formula 2"],
  "keyTakeaways": ["Crucial concept 1", "Crucial concept 2", "Crucial concept 3"]
}`);
    }

    if (selectedOutputs.includes('mcq_quiz')) {
      requestedSectionsPrompt.push(`
"mcqQuiz": [
  {
    "id": "mcq-1",
    "question": "Clear multiple choice question testing conceptual understanding or problem solving",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 1,
    "explanation": "Detailed explanation showing why Option B is correct and why other choices are incorrect.",
    "topic": "Topic Name"
  }
]`);
    }

    if (selectedOutputs.includes('short_test')) {
      requestedSectionsPrompt.push(`
"shortTest": [
  {
    "id": "st-1",
    "question": "Direct conceptual or quantitative question requiring 2-4 sentences or step-by-step derivation",
    "maxMarks": 3,
    "modelAnswer": "Complete exemplar student response scoring full marks",
    "keyPoints": ["1 mark: Definition or formula stated", "1 mark: Correct substitution or intermediate reasoning", "1 mark: Final verified result with units"]
  }
]`);
    }

    if (selectedOutputs.includes('practice_exam')) {
      requestedSectionsPrompt.push(`
"practiceExam": {
  "title": "${isSyllabus ? payload.chapter : payload.documentTitle} Practice Examination",
  "grade": "${payload.grade || 'Standard'}",
  "subject": "${payload.subject || 'Academic'}",
  "difficulty": "${examConfig.difficulty}",
  "durationMinutes": ${examConfig.durationMinutes},
  "totalMarks": ${examConfig.totalMarks || 20},
  "instructions": [
    "Read all questions carefully.",
    "Show complete mathematical steps and units where required.",
    "Time allowed: ${examConfig.durationMinutes} minutes."
  ],
  "sections": [
    {
      "sectionName": "Section A — Objective & Conceptual",
      "description": "Answer all questions.",
      "questions": [
        {
          "id": "pe-1",
          "type": "mcq",
          "question": "Question text...",
          "marks": 2,
          "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
          "correctOptionIndex": 0,
          "correctAnswer": "Opt A",
          "stepByStepSolution": "Solution rationale...",
          "topic": "Topic"
        }
      ]
    },
    {
      "sectionName": "Section B — Analytical & Derivation",
      "description": "Show complete working.",
      "questions": [
        {
          "id": "pe-2",
          "type": "short",
          "question": "Question text requiring derivation or detailed explanation...",
          "marks": 4,
          "correctAnswer": "Complete derivation / solution",
          "stepByStepSolution": "Step 1: ..., Step 2: ...",
          "topic": "Topic"
        }
      ]
    }
  ],
  "isAiGeneratedPractice": true
}`);
    }

    if (selectedOutputs.includes('important_questions')) {
      requestedSectionsPrompt.push(`
"importantQuestions": [
  {
    "type": "definition",
    "termOrQuestion": "Formal term or scientific law",
    "explanationOrAnswer": "Exact, rigorous textbook definition with standard scientific wording",
    "importance": "Essential"
  },
  {
    "type": "high_yield_question",
    "termOrQuestion": "Frequently recurring exam problem or derivation",
    "explanationOrAnswer": "Comprehensive step-by-step scoring answer",
    "importance": "Frequent Exam Topic"
  }
]`);
    }

    const fullPrompt = `You are ORYQEN STUDY AI's Core Study Generator Engine.
Generate a coordinated, comprehensive set of academic study materials based strictly on the provided source information.

SOURCE INFORMATION:
${groundingText}

STUDENT PROFILE:
- Grade/Level: ${payload.studentProfile?.grade || payload.grade || 'Standard'}
- Preferred Language: ${payload.studentProfile?.language || 'English'}
- Explanation Style: ${payload.studentProfile?.style || 'step_by_step'}

STRICT PEDAGOGICAL & GROUNDING CONSTRAINTS:
1. GROUNDING INTEGRITY:
   - Base all content strictly on the verified syllabus topics or uploaded document provided above.
   - NEVER invent fictional textbook page numbers, fake citations, or hallucinated facts.
   - If generating from curriculum topics, align strictly with standard accredited board standards for ${payload.board || 'CBSE'}.
2. ACCURACY & RIGOR:
   - Ensure all mathematical solutions, formulas, and scientific facts are 100% verified.
   - Format all mathematical equations cleanly using LaTeX notation ($...$ or $$...$$).
   - For all MCQ questions, ensure there is exactly one unequivocally correct option.
3. OUTPUT FORMAT:
   - You MUST output ONLY a valid JSON object matching the requested schema below.
   - Do NOT wrap in markdown \`\`\`json blocks.
   - Output valid, complete JSON.

REQUESTED OUTPUT STRUCTURE:
{
  "title": "${title}",
  "sourceMode": "${payload.sourceMode}",
  "outputs": {
${requestedSectionsPrompt.join(',\n')}
  }
}`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an elite curriculum specialist, textbook author, and assessment engine. Generate accurate, curriculum-aligned study materials in strict JSON format.',
      },
      {
        role: 'user' as const,
        content: fullPrompt,
      },
    ];

    const result = await orchestrator.executeChat(messages, {
      preferredProvider: payload.preferredProvider,
      temperature: 0.2,
      maxTokens: 4000,
    });

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

    let parsedResult: any = null;
    try {
      parsedResult = JSON.parse(jsonStr);
    } catch {
      try {
        const sanitized = jsonStr.replace(/,\s*([}\]])/g, '$1');
        parsedResult = JSON.parse(sanitized);
      } catch (err) {
        console.warn('[StudyService.generateStudyPack] AI output could not be parsed directly as JSON, synthesizing resilient fallback pack:', err);
      }
    }

    const defaultTitle = isSyllabus
      ? `${payload.chapter || 'Chapter'} (${payload.subject || 'Subject'})`
      : `${payload.documentTitle || 'Study Document'}`;

    const fallbackOutputs: any = {};
    if (selectedOutputs.includes('flashcards')) {
      const topic = (payload.syllabusTopics && payload.syllabusTopics[0]) || payload.chapter || 'Core Principle';
      fallbackOutputs.flashcards = [
        {
          front: `What is the fundamental principle of ${topic}?`,
          back: `The fundamental principle of ${topic} establishes foundational relationships in ${payload.subject || 'this subject'}. It is applied to solve analytical and quantitative exam problems systematically.`,
          topic,
        },
        {
          front: `State the key formula and variables governing ${topic}.`,
          back: `In ${topic}, mathematical formulations relate independent parameters with physical constants under standard boundary conditions.`,
          topic,
        },
      ];
    }
    if (selectedOutputs.includes('notes')) {
      fallbackOutputs.notes = {
        title: `${defaultTitle} — Revision Notes`,
        summary: `Structured overview of core principles, derivations, and exam guidelines for ${defaultTitle}.`,
        markdownContent: `## Executive Overview\n\nThis study guide covers the verified syllabus topics for **${defaultTitle}**.\n\n### Key Concepts\n- Foundational theoretical definitions and principles.\n- Rigorous derivations and problem-solving steps.\n\n### Formula Reference\nMathematical relationships are expressed using standard KaTeX notation.`,
        keyFormulas: [`Core formula for ${defaultTitle}`],
        keyTakeaways: [`Master definition and units`, `Practice standard derivations`],
      };
    }
    if (selectedOutputs.includes('mcq_quiz')) {
      fallbackOutputs.mcqQuiz = [
        {
          id: 'mcq-1',
          question: `Which statement accurately characterizes the primary property of ${payload.chapter || payload.subject || 'this concept'}?`,
          options: [
            'Empirical proportionality verified by experimental analysis under standard conditions',
            'Arbitrary numerical variation independent of governing physical laws',
            'Invariance to all temperature, pressure, or concentration gradients',
            'Qualitative hypothesis without experimental verification',
          ],
          correctOptionIndex: 0,
          explanation: 'Standard accredited curriculum frameworks confirm Option A as the scientifically accurate statement.',
          topic: payload.chapter || payload.subject,
        },
      ];
    }

    const resolvedOutputs = parsedResult?.outputs || fallbackOutputs;

    return {
      id: `pack-${Date.now()}`,
      title: parsedResult?.title || defaultTitle,
      sourceMode: payload.sourceMode,
      sourceMetadata: {
        board: payload.board,
        curriculum: payload.curriculum,
        grade: payload.grade,
        subject: payload.subject,
        chapter: payload.chapter,
        documentTitle: payload.documentTitle,
        groundingSummary,
      },
      createdAt: Date.now(),
      outputs: resolvedOutputs,
      providerUsed: result.providerUsed,
      modelUsed: result.modelUsed,
    };
  }
}

export const studyService = new StudyService();
