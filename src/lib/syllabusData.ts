import { EducationBoard, SubjectCategory } from '../types';

export interface SyllabusChapter {
  id: string;
  name: string;
  textbookRef: string;
  syllabusTopics: string[];
  learningObjectives: string[];
  coreFormulas?: string[];
}

export interface SyllabusSubjectInfo {
  id: string;
  name: SubjectCategory | string;
  category: SubjectCategory;
  curricula: string[];
  chapters: SyllabusChapter[];
}

export interface SyllabusClassInfo {
  id: string;
  name: string;
  gradeEquivalent: string;
  subjects: SyllabusSubjectInfo[];
}

export interface SyllabusBoardInfo {
  id: EducationBoard;
  name: string;
  shortName: string;
  jurisdiction: string;
  academicYears: string[];
  classes: SyllabusClassInfo[];
}

export const SYLLABUS_REGISTRY: SyllabusBoardInfo[] = [
  // 1. CBSE / NCERT
  {
    id: 'CBSE',
    name: 'Central Board of Secondary Education (CBSE / NCERT)',
    shortName: 'CBSE / NCERT',
    jurisdiction: 'National (India & International Affiliated Schools)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'cbse-class-10',
        name: 'Class 10 (Secondary)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'cbse-10-math',
            name: 'Mathematics',
            category: 'Mathematics',
            curricula: ['NCERT Standard Textbook', 'NCERT Exemplar & Advanced Problems'],
            chapters: [
              {
                id: 'ch-real-numbers',
                name: 'Real Numbers',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 1',
                syllabusTopics: [
                  'Fundamental Theorem of Arithmetic (Unique Prime Factorization)',
                  'Proofs of irrationality of √2, √3, √5',
                  'HCF and LCM relationships: HCF(a,b) × LCM(a,b) = a × b',
                  'Applications of prime factorization in composite numbers',
                ],
                learningObjectives: [
                  'State and apply the Fundamental Theorem of Arithmetic',
                  'Prove irrationality using contradiction proof',
                  'Calculate HCF and LCM and verify the product property',
                ],
                coreFormulas: ['HCF(a,b) \\times LCM(a,b) = a \\times b', 'p \\mid a^2 \\implies p \\mid a'],
              },
              {
                id: 'ch-polynomials',
                name: 'Polynomials',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 2',
                syllabusTopics: [
                  'Geometrical meaning of zeroes of a polynomial',
                  'Relationship between zeroes and coefficients of quadratic polynomials',
                  'Sum of zeroes: α + β = -b/a',
                  'Product of zeroes: α · β = c/a',
                  'Forming quadratic polynomial: k[x² - (α+β)x + αβ]',
                ],
                learningObjectives: [
                  'Interpret zeroes as x-intercepts of parabolic graphs',
                  'Derive coefficients from given roots and vice versa',
                  'Solve symmetrical expressions in roots (α² + β², 1/α + 1/β)',
                ],
                coreFormulas: ['\\alpha + \\beta = -\\frac{b}{a}', '\\alpha\\beta = \\frac{c}{a}', 'p(x) = k[x^2 - (\\alpha+\\beta)x + \\alpha\\beta]'],
              },
              {
                id: 'ch-linear-equations',
                name: 'Pair of Linear Equations in Two Variables',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 3',
                syllabusTopics: [
                  'Graphical method of solution and consistency conditions',
                  'Condition for unique solution: a₁/a₂ ≠ b₁/b₂',
                  'Condition for infinitely many solutions: a₁/a₂ = b₁/b₂ = c₁/c₂',
                  'Condition for no solution (parallel lines): a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
                  'Algebraic methods: Substitution Method and Elimination Method',
                  'Word problems on speed-distance, work-time, fractions, and age',
                ],
                learningObjectives: [
                  'Determine consistency without plotting graphs',
                  'Solve pairs of equations using algebraic elimination and substitution',
                  'Formulate linear models from real-world word problems',
                ],
                coreFormulas: ['\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2} \\text{ (Unique)}', '\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2} \\text{ (No solution)}'],
              },
              {
                id: 'ch-quadratic-equations',
                name: 'Quadratic Equations',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 4',
                syllabusTopics: [
                  'Standard form: ax² + bx + c = 0 (a ≠ 0)',
                  'Solution by factorization (splitting the middle term)',
                  'Solution by Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
                  'Nature of roots and Discriminant: Δ = b² - 4ac',
                  'Real and distinct roots (Δ > 0), Real and equal roots (Δ = 0), No real roots (Δ < 0)',
                  'Applied word problems involving speed, areas, and consecutive numbers',
                ],
                learningObjectives: [
                  'Calculate the discriminant and predict the nature of roots',
                  'Apply the quadratic formula to solve non-factorable equations',
                  'Reject extraneous or non-physical negative roots in geometry problems',
                ],
                coreFormulas: ['x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', '\\Delta = b^2 - 4ac'],
              },
              {
                id: 'ch-arithmetic-progressions',
                name: 'Arithmetic Progressions (AP)',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 5',
                syllabusTopics: [
                  'Definition of AP, first term a, common difference d',
                  'nth term of an AP: aₙ = a + (n - 1)d',
                  'Sum of first n terms: Sₙ = (n/2)[2a + (n - 1)d] = (n/2)[a + l]',
                  'Arithmetic mean and practical daily life application problems',
                ],
                learningObjectives: [
                  'Find unknown parameters among a, d, n, aₙ, and Sₙ',
                  'Model installment savings and structural sequence problems',
                ],
                coreFormulas: ['a_n = a + (n - 1)d', 'S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}[a + l]'],
              },
              {
                id: 'ch-triangles',
                name: 'Triangles & Similarity',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 6',
                syllabusTopics: [
                  'Basic Proportionality Theorem (Thales Theorem) and its converse',
                  'Criteria for similarity of triangles: AAA/AA, SAS, SSS',
                  'Properties of similar triangles applied to height and shadow problems',
                ],
                learningObjectives: [
                  'State and prove the Basic Proportionality Theorem',
                  'Establish triangle similarity using rigorous correspondence notation',
                ],
                coreFormulas: ['\\frac{AD}{DB} = \\frac{AE}{EC} \\text{ (BPT)}'],
              },
              {
                id: 'ch-coordinate-geometry',
                name: 'Coordinate Geometry',
                textbookRef: 'NCERT Class 10 Mathematics — Chapter 7',
                syllabusTopics: [
                  'Distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
                  'Section formula for internal division: ((m₁x₂ + m₂x₁)/(m₁+m₂), (m₁y₂ + m₂y₁)/(m₁+m₂))',
                  'Midpoint formula and collinearity checks',
                ],
                learningObjectives: [
                  'Calculate distance between points and classify polygons (equilateral, isosceles, rhombus)',
                  'Divide line segments in given ratios internally',
                ],
                coreFormulas: ['d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', 'P(x,y) = \\left(\\frac{m_1x_2 + m_2x_1}{m_1+m_2}, \\frac{m_1y_2 + m_2y_1}{m_1+m_2}\\right)'],
              },
              {
                id: 'ch-trigonometry',
                name: 'Introduction to Trigonometry & Applications',
                textbookRef: 'NCERT Class 10 Mathematics — Chapters 8 & 9',
                syllabusTopics: [
                  'Trigonometric ratios of acute angles (sin, cos, tan, cosec, sec, cot)',
                  'Values of trigonometric ratios at 0°, 30°, 45°, 60°, and 90°',
                  'Fundamental identity: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ',
                  'Heights and distances: Angle of elevation, Angle of depression',
                ],
                learningObjectives: [
                  'Prove complex trigonometric identities using algebraic factorization',
                  'Solve multi-step height and distance word problems with two observation angles',
                ],
                coreFormulas: ['\\sin^2\\theta + \\cos^2\\theta = 1', '1 + \\tan^2\\theta = \\sec^2\\theta', '\\tan\\theta = \\frac{\\text{opposite}}{\\text{adjacent}}'],
              },
            ],
          },
          {
            id: 'cbse-10-science',
            name: 'Science (Physics, Chemistry, Biology)',
            category: 'General Science',
            curricula: ['NCERT Science Class 10', 'NCERT Exemplar Science'],
            chapters: [
              {
                id: 'ch-chemical-reactions',
                name: 'Chemical Reactions and Equations',
                textbookRef: 'NCERT Class 10 Science — Chapter 1',
                syllabusTopics: [
                  'Chemical equation balancing using atom conservation',
                  'Types of chemical reactions: Combination, Decomposition (Thermal, Electrolytic, Photolytic)',
                  'Displacement and Double displacement (Precipitation) reactions',
                  'Oxidation and Reduction (Redox reactions) in terms of oxygen/hydrogen gain/loss and electrons',
                  'Corrosion and Rancidity prevention',
                ],
                learningObjectives: [
                  'Balance complex chemical equations with state symbols',
                  'Identify oxidizing and reducing agents in redox processes',
                ],
                coreFormulas: ['\\text{Reactants} \\longrightarrow \\text{Products} + \\Delta H'],
              },
              {
                id: 'ch-acids-bases-salts',
                name: 'Acids, Bases and Salts',
                textbookRef: 'NCERT Class 10 Science — Chapter 2',
                syllabusTopics: [
                  'Definition in terms of H⁺(aq) and OH⁻(aq) ions',
                  'Chemical properties: Reaction with metals, metal carbonates, metal oxides',
                  'pH scale concept (0 to 14) and importance of pH in everyday life',
                  'Preparation and uses: Sodium hydroxide (Chlor-alkali process), Bleaching powder, Baking soda, Washing soda, Plaster of Paris',
                ],
                learningObjectives: [
                  'Correlate hydronium ion concentration with pH',
                  'Write balanced equations for the synthesis of commercial salts',
                ],
                coreFormulas: ['\\text{pH} = -\\log_{10}[H^+]', 'CaSO_4 \\cdot \\frac{1}{2}H_2O + 1\\frac{1}{2}H_2O \\rightarrow CaSO_4 \\cdot 2H_2O'],
              },
              {
                id: 'ch-life-processes',
                name: 'Life Processes',
                textbookRef: 'NCERT Class 10 Science — Chapter 5',
                syllabusTopics: [
                  'Autotrophic nutrition: Photosynthesis site, light/dark reactions, stomatal mechanism',
                  'Heterotrophic nutrition: Human digestive system, enzymes (pepsin, trypsin, amylase, lipase)',
                  'Respiration: Aerobic vs Anaerobic pathway of glucose breakdown (pyruvate, ethanol, lactic acid)',
                  'Human circulatory system: Heart structure, double circulation, blood vs lymph',
                  'Excretion: Structure and functioning of a nephron, urine formation (filtration, reabsorption)',
                ],
                learningObjectives: [
                  'Trace the complete journey of nutrients, oxygen, and metabolic wastes',
                  'Contrast aerobic respiration in mitochondria with lactic acid fermentation in muscle cells',
                ],
              },
              {
                id: 'ch-light-reflection-refraction',
                name: 'Light — Reflection and Refraction',
                textbookRef: 'NCERT Class 10 Science — Chapter 9',
                syllabusTopics: [
                  'Reflection by spherical mirrors: Concave and Convex mirror ray diagrams',
                  'Mirror formula: 1/f = 1/v + 1/u and Magnification m = -v/u',
                  'Laws of refraction, Snell’s Law: sin i / sin r = n₂/n₁',
                  'Refraction through spherical lenses: Concave and Convex lenses',
                  'Lens formula: 1/f = 1/v - 1/u and Magnification m = v/u',
                  'Power of a lens: P = 1/f(in meters) in Dioptres (D)',
                ],
                learningObjectives: [
                  'Apply the Cartesian sign convention strictly to optical calculations',
                  'Calculate image distance, magnification, and nature for optical instruments',
                ],
                coreFormulas: ['\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}', '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}', 'n = \\frac{\\sin i}{\\sin r} = \\frac{c}{v}', 'P = \\frac{1}{f\\text{ (m)}}'],
              },
              {
                id: 'ch-electricity',
                name: 'Electricity',
                textbookRef: 'NCERT Class 10 Science — Chapter 11',
                syllabusTopics: [
                  'Electric current (I = Q/t) and Electric potential difference (V = W/Q)',
                  'Ohm’s law: V = I·R, resistance and factors affecting resistance (R = ρ·l/A)',
                  'Resistors in series (R_s = R₁ + R₂) and parallel (1/R_p = 1/R₁ + 1/R₂)',
                  'Joule’s law of heating: H = I²Rt',
                  'Electric power: P = VI = I²R = V²/R, Commercial unit of electrical energy (1 kWh = 3.6 × 10⁶ J)',
                ],
                learningObjectives: [
                  'Analyze series and parallel combinations in complex circuit diagrams',
                  'Calculate electrical power dissipation and monthly household electricity bills',
                ],
                coreFormulas: ['V = IR', 'R = \\rho\\frac{l}{A}', 'R_s = R_1 + R_2', '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}', 'H = I^2Rt', 'P = VI'],
              },
            ],
          },
        ],
      },
      {
        id: 'cbse-class-12',
        name: 'Class 12 (Higher Secondary)',
        gradeEquivalent: 'Class 11-12 (Higher Secondary)',
        subjects: [
          {
            id: 'cbse-12-physics',
            name: 'Physics',
            category: 'Physics',
            curricula: ['NCERT Class 12 Physics Part 1 & 2', 'CBSE Board Curriculum'],
            chapters: [
              {
                id: 'ch-electrostatics',
                name: 'Electric Charges and Fields',
                textbookRef: 'NCERT Class 12 Physics — Chapter 1',
                syllabusTopics: [
                  'Coulomb’s Law in vector form and principle of superposition',
                  'Electric field due to a point charge and electric dipole',
                  'Electric dipole in a uniform external electric field (torque & potential energy)',
                  'Electric flux and Gauss’s Theorem',
                  'Applications of Gauss’s Law: infinitely long straight wire, uniformly charged infinite plane sheet, thin spherical shell',
                ],
                learningObjectives: [
                  'Derive electric field intensity on axial and equatorial lines of a dipole',
                  'Prove Gauss’s law and apply symmetry to solve charge distributions',
                ],
                coreFormulas: ['F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}', '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0}', 'E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}'],
              },
              {
                id: 'ch-current-electricity',
                name: 'Current Electricity',
                textbookRef: 'NCERT Class 12 Physics — Chapter 3',
                syllabusTopics: [
                  'Drift velocity (v_d = eEτ/m) and its relation to current (I = n·A·e·v_d)',
                  'Ohm’s law microscopic form: J = σE',
                  'Temperature dependence of resistivity',
                  'EMF and internal resistance of a cell, cells in series and parallel',
                  'Kirchhoff’s laws (Junction rule & Loop rule) and Wheatstone Bridge condition',
                ],
                learningObjectives: [
                  'Apply Kirchhoff’s laws to multi-loop electrical networks',
                  'Derive the balanced Wheatstone bridge condition (P/Q = R/S)',
                ],
                coreFormulas: ['I = nAe v_d', 'v_d = \\frac{eE\\tau}{m}', '\\sum I = 0', '\\sum \\Delta V = 0', '\\frac{P}{Q} = \\frac{R}{S}'],
              },
              {
                id: 'ch-wave-optics',
                name: 'Wave Optics',
                textbookRef: 'NCERT Class 12 Physics — Chapter 10',
                syllabusTopics: [
                  'Huygens’ principle and construction of spherical & plane wave fronts',
                  'Proof of laws of reflection and refraction using Huygens’ wave theory',
                  'Coherent sources and Interference of light waves',
                  'Young’s Double Slit Experiment (YDSE): fringe width β = λD/d',
                  'Diffraction due to a single slit: central maximum width = 2λD/a',
                ],
                learningObjectives: [
                  'Derive the fringe width expression in Young’s double slit experiment',
                  'Distinguish interference fringes from diffraction patterns',
                ],
                coreFormulas: ['\\beta = \\frac{\\lambda D}{d}', 'y_n = \\frac{n\\lambda D}{d}', 'a\\sin\\theta = \\lambda'],
              },
            ],
          },
          {
            id: 'cbse-12-math',
            name: 'Mathematics',
            category: 'Mathematics',
            curricula: ['NCERT Class 12 Mathematics Part 1 & 2', 'CBSE Advanced Calculus'],
            chapters: [
              {
                id: 'ch-calculus-derivatives',
                name: 'Continuity and Differentiability',
                textbookRef: 'NCERT Class 12 Mathematics — Chapter 5',
                syllabusTopics: [
                  'Continuity of functions at a point and in an interval',
                  'Derivative of composite functions (Chain Rule)',
                  'Derivative of implicit functions and inverse trigonometric functions',
                  'Logarithmic differentiation and derivative of functions in parametric form',
                  'Second order derivatives',
                ],
                learningObjectives: [
                  'Differentiate complex multi-variable parametric relationships',
                  'Apply logarithmic differentiation to variable-base functions like x^x',
                ],
                coreFormulas: ['\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}', '\\frac{d}{dx}[\\ln y] = \\frac{1}{y}\\frac{dy}{dx}'],
              },
              {
                id: 'ch-calculus-integrals',
                name: 'Integrals & Applications',
                textbookRef: 'NCERT Class 12 Mathematics — Chapters 7 & 8',
                syllabusTopics: [
                  'Integration as inverse process of differentiation',
                  'Integration by substitution, partial fractions, and by parts',
                  'Fundamental Theorem of Calculus and properties of definite integrals',
                  'Evaluation of definite integrals using symmetrical properties',
                  'Area under simple curves (parabolas, circles, ellipses)',
                ],
                learningObjectives: [
                  'Apply integration by parts: ∫ u·v dx = u∫v dx - ∫(u\'∫v dx)dx',
                  'Compute bounded areas between intersecting curves',
                ],
                coreFormulas: ['\\int u v\\,dx = u\\int v\\,dx - \\int (u\' \\int v\\,dx)\\,dx', '\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx'],
              },
            ],
          },
        ],
      },
    ],
  },

  // 2. ICSE / CISCE
  {
    id: 'ICSE',
    name: 'Indian Certificate of Secondary Education (ICSE / CISCE)',
    shortName: 'ICSE / CISCE',
    jurisdiction: 'National (CISCE Council India)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'icse-class-10',
        name: 'Class 10 (ICSE)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'icse-10-physics',
            name: 'Physics',
            category: 'Physics',
            curricula: ['Selina Concise Physics Class 10', 'CISCE Prescribed Syllabus'],
            chapters: [
              {
                id: 'icse-force-work',
                name: 'Force, Work, Power and Energy',
                textbookRef: 'Selina Concise Physics Class 10 — Chapter 1 & 2',
                syllabusTopics: [
                  'Moment of a force and torque, principle of moments in equilibrium',
                  'Center of gravity of regular and irregular lamina',
                  'Work done by a force (W = F·s·cosθ), Power (P = W/t = F·v), Units (Horsepower, kWh)',
                  'Kinetic energy (E_k = 1/2 m v² = p²/2m) and Potential energy (U = mgh)',
                  'Law of conservation of mechanical energy in a freely falling body',
                ],
                learningObjectives: [
                  'Apply principle of moments: sum of anticlockwise moments = sum of clockwise moments',
                  'Prove total mechanical energy conservation at top, middle, and ground states',
                ],
                coreFormulas: ['\\tau = F \\times d', 'W = F s \\cos\\theta', 'P = F v', 'E_k = \\frac{p^2}{2m}'],
              },
              {
                id: 'icse-machines',
                name: 'Machines & Simple Mechanical Devices',
                textbookRef: 'Selina Concise Physics Class 10 — Chapter 3',
                syllabusTopics: [
                  'Mechanical Advantage (MA = Load / Effort)',
                  'Velocity Ratio (VR = d_E / d_L) and Efficiency (η = MA / VR)',
                  'Levers of Class I, II, and III with fulcrum, load, and effort positions',
                  'Single fixed pulley, single movable pulley, block and tackle system of pulleys',
                ],
                learningObjectives: [
                  'Calculate efficiency and mechanical advantage for multi-pulley systems with string weight',
                ],
                coreFormulas: ['MA = \\frac{\\text{Load}}{\\text{Effort}}', 'VR = \\frac{d_E}{d_L}', '\\eta = \\frac{MA}{VR} \\times 100\\%'],
              },
              {
                id: 'icse-calorimetry',
                name: 'Calorimetry',
                textbookRef: 'Selina Concise Physics Class 10 — Chapter 11',
                syllabusTopics: [
                  'Specific heat capacity c = Q / (m · ΔT) in J kg⁻¹ K⁻¹',
                  'Heat capacity C\' = Q / ΔT = m · c',
                  'Principle of Method of Mixtures: Heat lost by hot body = Heat gained by cold body',
                  'Specific latent heat of fusion (L_f = 336 J/g) and vaporization',
                  'Consequences of high specific heat capacity of water (climate regulation, coolant)',
                ],
                learningObjectives: [
                  'Set up calorimetry thermal balance equations including container water equivalent',
                ],
                coreFormulas: ['Q = mc\\Delta T', 'Q = mL', '\\text{Heat Lost} = \\text{Heat Gained}'],
              },
            ],
          },
          {
            id: 'icse-10-chem',
            name: 'Chemistry',
            category: 'Chemistry',
            curricula: ['Selina Concise Chemistry Class 10', 'Viraf J. Dalal Simplified Chemistry'],
            chapters: [
              {
                id: 'icse-periodic-properties',
                name: 'Periodic Properties and Variations',
                textbookRef: 'Concise Chemistry Class 10 — Chapter 1',
                syllabusTopics: [
                  'Periodic trends across periods and down groups',
                  'Atomic radius and ionic radius variation',
                  'Ionization potential (IP), Electron Affinity (EA), Electronegativity (EN)',
                  'Metallic and non-metallic character trends',
                ],
                learningObjectives: [
                  'Explain periodicity in terms of effective nuclear charge and screening effect',
                ],
              },
              {
                id: 'icse-mole-concept',
                name: 'Mole Concept and Stoichiometry',
                textbookRef: 'Concise Chemistry Class 10 — Chapter 5',
                syllabusTopics: [
                  'Gay-Lussac’s Law of Combining Volumes',
                  'Avogadro’s Law and molar volume (22.4 L at STP)',
                  'Relative molecular mass, percentage composition, Empirical and Molecular formula',
                  'Stoichiometric calculations based on chemical equations',
                ],
                learningObjectives: [
                  'Determine empirical and molecular formulas from percentage mass analysis',
                  'Calculate gas volume and product mass from limiting reagents',
                ],
                coreFormulas: ['n = \\frac{\\text{Mass}}{\\text{Molar Mass}} = \\frac{V\\text{ (STP)}}{22.4\\text{ L}} = \\frac{N}{6.022 \\times 10^{23}}'],
              },
            ],
          },
        ],
      },
    ],
  },

  // 3. Maharashtra State Board (MSBSHSE)
  {
    id: 'MSBSHSE',
    name: 'Maharashtra State Board of Secondary and Higher Secondary Education (Balbharati)',
    shortName: 'Maharashtra State Board',
    jurisdiction: 'Maharashtra State (India)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'msb-class-10',
        name: 'Class 10 (SSC)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'msb-10-sci-1',
            name: 'Science and Technology Part 1',
            category: 'Physics',
            curricula: ['Balbharati SSC Science Part 1 Textbook', 'Maharashtra State Board Syllabus'],
            chapters: [
              {
                id: 'msb-gravitation',
                name: 'Gravitation',
                textbookRef: 'Balbharati Class 10 Science 1 — Chapter 1',
                syllabusTopics: [
                  'Kepler’s Three Laws of Planetary Motion',
                  'Newton’s Universal Law of Gravitation (F = G·M·m/r²)',
                  'Acceleration due to gravity g = GM/R² and its variation (altitude, depth, latitude)',
                  'Free fall, escape velocity v_esc = √(2GM/R) = √(2gR)',
                  'Mass vs Weight and gravitational potential energy',
                ],
                learningObjectives: [
                  'State and mathematically formulate Kepler’s third law (T² ∝ r³)',
                  'Calculate variation of g at Earth’s equator and poles',
                ],
                coreFormulas: ['F = G\\frac{M m}{r^2}', 'g = \\frac{GM}{R^2}', 'v_{\\text{esc}} = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}'],
              },
              {
                id: 'msb-heat',
                name: 'Heat & Anomalous Behavior',
                textbookRef: 'Balbharati Class 10 Science 1 — Chapter 5',
                syllabusTopics: [
                  'Latent heat of fusion and vaporization, Regolation and Hope’s apparatus',
                  'Anomalous expansion of water between 0°C and 4°C',
                  'Dew point and relative humidity (RH %)',
                  'Specific heat capacity measurement using calorimeter',
                ],
                learningObjectives: [
                  'Explain aquatic life survival during winter via anomalous water density',
                ],
              },
            ],
          },
          {
            id: 'msb-10-math-1',
            name: 'Mathematics Part 1 (Algebra)',
            category: 'Mathematics',
            curricula: ['Balbharati SSC Mathematics Part 1 Textbook'],
            chapters: [
              {
                id: 'msb-cramers-rule',
                name: 'Linear Equations in Two Variables (Cramer’s Rule)',
                textbookRef: 'Balbharati Class 10 Algebra — Chapter 1',
                syllabusTopics: [
                  'Simultaneous linear equations in two variables',
                  'Determinants of order 2 × 2: |a b; c d| = ad - bc',
                  'Cramer’s Rule for solving simultaneous equations (x = D_x / D, y = D_y / D)',
                  'Equations reducible to pair of linear equations',
                ],
                learningObjectives: [
                  'Compute determinants and apply Cramer’s determinant method systematically',
                ],
                coreFormulas: ['D = a_1 b_2 - a_2 b_1', 'x = \\frac{D_x}{D}', 'y = \\frac{D_y}{D}'],
              },
            ],
          },
        ],
      },
    ],
  },

  // 4. Cambridge International (CAIE - IGCSE & A-Levels)
  {
    id: 'Cambridge',
    name: 'Cambridge Assessment International Education (CAIE — IGCSE & A-Level)',
    shortName: 'Cambridge (CAIE)',
    jurisdiction: 'International (UK Curriculum)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'cambridge-igcse',
        name: 'Cambridge IGCSE (Years 10–11)',
        gradeEquivalent: 'Class 9-10 (Secondary)',
        subjects: [
          {
            id: 'caie-0625-physics',
            name: 'Physics (Syllabus 0625)',
            category: 'Physics',
            curricula: ['Cambridge IGCSE Physics Coursebook (Hodder / CUP)', 'CAIE 0625 Syllabus'],
            chapters: [
              {
                id: 'caie-motion-forces',
                name: 'Motion, Forces and Energy',
                textbookRef: 'Cambridge IGCSE Physics 0625 — Section 1',
                syllabusTopics: [
                  'Speed, velocity, acceleration and distance-time / velocity-time graphs',
                  'Gradient of distance-time graph (speed), area under velocity-time graph (distance)',
                  'Newton’s laws of motion, resultant force F = ma, impulse FΔt = Δp',
                  'Hooke’s Law F = kx and limit of proportionality',
                  'Pressure p = F/A and liquid pressure p = ρgh',
                ],
                learningObjectives: [
                  'Interpret graphical kinematics with non-uniform acceleration gradients',
                  'Apply conservation of momentum in elastic and inelastic collisions',
                ],
                coreFormulas: ['v = u + at', 's = ut + \\frac{1}{2}at^2', 'F = ma', '\\Delta p = F\\Delta t', 'p = \\rho g h'],
              },
              {
                id: 'caie-thermal-physics',
                name: 'Thermal Physics & Kinetic Particle Theory',
                textbookRef: 'Cambridge IGCSE Physics 0625 — Section 2',
                syllabusTopics: [
                  'Kinetic particle model of matter (solids, liquids, gases, Brownian motion)',
                  'Thermal expansion, measurement of temperature and thermocouple',
                  'Specific heat capacity and specific latent heat',
                  'Conduction, convection, and radiation (black body absorption/emission)',
                ],
                learningObjectives: [
                  'Explain gas pressure changes using molecular kinetic momentum changes on container walls',
                ],
                coreFormulas: ['p_1 V_1 = p_2 V_2 \\text{ (Boyle\'s Law)}', '\\Delta E = m c \\Delta T'],
              },
            ],
          },
          {
            id: 'caie-0580-math',
            name: 'Mathematics (Syllabus 0580 Extended)',
            category: 'Mathematics',
            curricula: ['Cambridge IGCSE Mathematics Extended (CUP / Oxford)'],
            chapters: [
              {
                id: 'caie-algebra-functions',
                name: 'Algebra, Equations and Functions',
                textbookRef: 'Cambridge IGCSE 0580 — Section 2',
                syllabusTopics: [
                  'Algebraic manipulation, expansion, and factorization of quadratics',
                  'Simultaneous linear and non-linear equations',
                  'Function notation f(x), composite functions fg(x), inverse functions f⁻¹(x)',
                  'Indices and laws of indices with fractional powers',
                ],
                learningObjectives: [
                  'Determine domain, range, composite functions, and algebraic inverse functions',
                ],
                coreFormulas: ['fg(x) = f(g(x))', 'y = f(x) \\implies x = f^{-1}(y)'],
              },
            ],
          },
        ],
      },
    ],
  },

  // 5. International Baccalaureate (IB)
  {
    id: 'IB',
    name: 'International Baccalaureate (IB — MYP & DP)',
    shortName: 'IB (MYP / DP)',
    jurisdiction: 'Global (IB World Schools)',
    academicYears: ['2025–2026', '2026–2027'],
    classes: [
      {
        id: 'ib-dp',
        name: 'IB Diploma Programme (DP 1 & 2)',
        gradeEquivalent: 'Class 11-12 (Higher Secondary)',
        subjects: [
          {
            id: 'ib-dp-math-aa',
            name: 'Mathematics: Analysis and Approaches (SL/HL)',
            category: 'Mathematics',
            curricula: ['Oxford IB Diploma Mathematics AA', 'Pearson Baccalaureate AA'],
            chapters: [
              {
                id: 'ib-calculus-sl-hl',
                name: 'Calculus: Derivatives, Integrals & Optimization',
                textbookRef: 'IB DP Mathematics AA — Topic 5',
                syllabusTopics: [
                  'Limits, continuity, and formal differentiation from first principles',
                  'Product rule, quotient rule, chain rule, and second derivative test',
                  'Optimization and curve sketching: points of inflection (f\'\'(x) = 0)',
                  'Definite integrals and volume of revolution about the x-axis',
                  'Kinematics in calculus: displacement, velocity, acceleration',
                ],
                learningObjectives: [
                  'Apply second derivative tests to solve real-world constraint optimization problems',
                  'Calculate volumes of revolution: V = π ∫ y² dx',
                ],
                coreFormulas: ['(uv)\' = u\'v + uv\'', '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}', 'V = \\pi \\int_a^b [f(x)]^2\\,dx'],
              },
            ],
          },
          {
            id: 'ib-dp-physics',
            name: 'Physics (SL/HL)',
            category: 'Physics',
            curricula: ['Oxford IB Physics Course Companion', 'Tsokos Cambridge IB Physics'],
            chapters: [
              {
                id: 'ib-fields-potentials',
                name: 'Fields and Gravitation (Topic 10 HL)',
                textbookRef: 'IB DP Physics — Topic 10',
                syllabusTopics: [
                  'Describing fields: gravitational and electrostatic field lines and equipotential surfaces',
                  'Gravitational potential V_g = -GM/r and Electric potential V_e = kq/r',
                  'Potential gradient and field strength: E = -dV/dr, g = -dV_g/dr',
                  'Orbital motion, orbital speed v = √(GM/r), and escape speed',
                ],
                learningObjectives: [
                  'Relate conservative force fields to potential gradients',
                  'Analyze energy conservation in satellite orbits (E_total = -GMm/2r)',
                ],
                coreFormulas: ['V_g = -\\frac{GM}{r}', 'g = -\\frac{dV_g}{dr}', 'E_{\\text{total}} = -\\frac{GMm}{2r}'],
              },
            ],
          },
        ],
      },
    ],
  },

  // 6. Custom Syllabus
  {
    id: 'Custom',
    name: 'Custom Syllabus / University / Competitive Exam',
    shortName: 'Custom Syllabus',
    jurisdiction: 'Custom / Independent Study',
    academicYears: ['Current Academic Session'],
    classes: [
      {
        id: 'custom-general',
        name: 'Custom Academic Level',
        gradeEquivalent: 'Independent Learner',
        subjects: [
          {
            id: 'custom-general-subject',
            name: 'Custom Academic Subject',
            category: 'General Science',
            curricula: ['Student Prescribed Curriculum / Teacher Syllabus'],
            chapters: [
              {
                id: 'custom-ch-1',
                name: 'Custom Specified Chapter',
                textbookRef: 'Custom Provided Syllabus Outline',
                syllabusTopics: ['Core Conceptual Framework', 'Problem Solving and Mathematical Formulations', 'Practical and Laboratory Applications'],
                learningObjectives: ['Master fundamental principles and key analytical relationships'],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function getSyllabusBoard(boardId: EducationBoard): SyllabusBoardInfo | undefined {
  return SYLLABUS_REGISTRY.find(b => b.id === boardId) || SYLLABUS_REGISTRY[0];
}

export function getAllBoards(): { id: EducationBoard; name: string; shortName: string }[] {
  return SYLLABUS_REGISTRY.map(b => ({
    id: b.id,
    name: b.name,
    shortName: b.shortName,
  }));
}
