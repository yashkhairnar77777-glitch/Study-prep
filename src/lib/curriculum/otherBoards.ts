import { SyllabusBoardInfo } from './types';

export const otherBoards: SyllabusBoardInfo[] = [
  {
    id: 'ICSE',
    name: 'Indian Certificate of Secondary Education (ICSE / ISC)',
    shortName: 'ICSE / CISCE',
    jurisdiction: 'National & International',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'icse-class-10',
        name: 'Class 10 (ICSE)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'icse-10-math',
            name: 'Mathematics',
            category: 'Mathematics',
            curricula: ['ICSE Mathematics Syllabus', 'Selina Concise Mathematics Class 10'],
            chapters: [
              {
                id: 'ch-icse-gst',
                name: 'Goods and Services Tax (GST)',
                textbookRef: 'Selina Concise Mathematics Class 10 — Chapter 1',
                syllabusTopics: ['Intra-state sales: CGST + SGST', 'Inter-state sales: IGST', 'Input Tax Credit (ITC) calculations'],
                learningObjectives: ['Calculate GST at each stage of supply chain'],
                coreFormulas: ['\\text{CGST} = \\text{SGST} = \\frac{1}{2} \\text{GST}', '\\text{Net GST} = \\text{Output GST} - \\text{Input Tax Credit}']
              },
              {
                id: 'ch-icse-banking',
                name: 'Banking (Recurring Deposit Accounts)',
                textbookRef: 'Selina Concise Mathematics Class 10 — Chapter 2',
                syllabusTopics: ['Recurring deposit (RD) interest calculation: $I = \\frac{P \\times n(n+1)}{2 \\times 12} \\times \\frac{r}{100}$', 'Maturity value $MV = (P \\times n) + I$'],
                learningObjectives: ['Calculate interest and maturity payout on recurring deposits'],
                coreFormulas: ['I = \\frac{P \\cdot n(n + 1)}{24} \\times \\frac{r}{100}', 'MV = nP + I']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Cambridge',
    name: 'Cambridge Assessment International Education (CAIE)',
    shortName: 'Cambridge / IGCSE',
    jurisdiction: 'International (160+ Countries)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'igcse-grade-10',
        name: 'Cambridge IGCSE (Grade 10)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'igcse-10-math',
            name: 'Mathematics (0580 Extended)',
            category: 'Mathematics',
            curricula: ['Cambridge IGCSE Mathematics 0580'],
            chapters: [
              {
                id: 'ch-igcse-indices',
                name: 'Number, Indices and Standard Form',
                textbookRef: 'Cambridge IGCSE 0580 — Topic 1',
                syllabusTopics: ['Fractional and negative indices', 'Upper and lower bounds for rounded values', 'Standard scientific form ($A \\times 10^n$)'],
                learningObjectives: ['Calculate error bounds for compound calculations'],
                coreFormulas: ['a^{-n} = \\frac{1}{a^n}', 'a^{1/n} = \\sqrt[n]{a}']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'IB',
    name: 'International Baccalaureate (IB)',
    shortName: 'IB Diploma Programme',
    jurisdiction: 'International Global Curriculum',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'ib-dp-2',
        name: 'IB Diploma Programme (DP Year 2)',
        gradeEquivalent: 'Class 11-12 (Higher Secondary)',
        subjects: [
          {
            id: 'ib-math-aa',
            name: 'Mathematics: Analysis and Approaches (HL/SL)',
            category: 'Mathematics',
            curricula: ['IB DP Mathematics: Analysis and Approaches Guide'],
            chapters: [
              {
                id: 'ch-ib-calculus',
                name: 'Calculus: Derivatives, Integrals & Kinematics',
                textbookRef: 'IB DP Mathematics AA HL — Topic 5',
                syllabusTopics: ['Derivatives from first principles', 'Chain, product, quotient rules', 'Integration by substitution and by parts', 'Differential equations with integrating factor'],
                learningObjectives: ['Solve real-world kinematic and growth models using differential equations'],
                coreFormulas: ['\\frac{d}{dx}[u \\cdot v] = u\\frac{dv}{dx} + v\\frac{du}{dx}']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Custom',
    name: 'Custom / College / University & Independent Syllabus',
    shortName: 'Custom Course',
    jurisdiction: 'Institutional & Self-Paced Learning',
    academicYears: ['Ongoing / Flexible'],
    classes: [
      {
        id: 'custom-university',
        name: 'Undergraduate / Competitive Level',
        gradeEquivalent: 'College / Undergraduate',
        subjects: [
          {
            id: 'custom-cs-ds',
            name: 'Data Structures and Algorithms',
            category: 'Computer Science',
            curricula: ['Standard University CS Curriculum'],
            chapters: [
              {
                id: 'ch-custom-sorting',
                name: 'Sorting, Searching & Asymptotic Complexity',
                textbookRef: 'Introduction to Algorithms (CLRS)',
                syllabusTopics: ['Big-O, Big-Omega, Big-Theta notation', 'Merge Sort ($O(n \\log n)$) and Quick Sort', 'Binary Search and recursive recurrence relations'],
                learningObjectives: ['Prove asymptotic time and space bounds using Master Theorem'],
                coreFormulas: ['T(n) = aT(n/b) + f(n) \\text{ (Master Theorem)}']
              }
            ]
          }
        ]
      }
    ]
  }
];
