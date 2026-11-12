import { SyllabusClassInfo } from './types';

export const cbseClass10: SyllabusClassInfo = {
  id: 'cbse-class-10',
  name: 'Class 10 (Secondary)',
  gradeEquivalent: 'Class 9-10 (Secondary)',
  subjects: [
    {
      id: 'cbse-10-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 10', 'NCERT Exemplar Class 10', 'CBSE Board Curriculum'],
      chapters: [
        {
          id: 'ch-10-m-1',
          name: 'Real Numbers',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 1',
          syllabusTopics: ['Fundamental Theorem of Arithmetic (unique prime factorization)', 'Proof of irrationality of $\\sqrt{2}, \\sqrt{3}, \\sqrt{5}$ using contradiction', 'Revisiting decimal expansions of rational numbers ($p/q$ terminates iff $q = 2^n 5^m$)'],
          learningObjectives: ['Prove irrationality of numbers using algebraic contradiction', 'Find HCF and LCM of integers using prime factorization theorem'],
          coreFormulas: ['\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b']
        },
        {
          id: 'ch-10-m-2',
          name: 'Polynomials',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 2',
          syllabusTopics: ['Geometrical meaning of zeroes of a polynomial (x-intercepts on Cartesian plane)', 'Relationship between zeroes and coefficients of quadratic polynomials ($S = -b/a, P = c/a$)', 'Relationship between zeroes and coefficients of cubic polynomials ($S = -b/a, \\sum \\alpha\\beta = c/a, P = -d/a$)'],
          learningObjectives: ['Determine number of zeroes by inspecting graph x-intercepts', 'Form quadratic polynomials given the sum and product of their roots'],
          coreFormulas: ['\\alpha + \\beta = -\\frac{b}{a}', '\\alpha\\beta = \\frac{c}{a}', 'P(x) = k[x^2 - (\\alpha + \\beta)x + \\alpha\\beta]']
        },
        {
          id: 'ch-10-m-3',
          name: 'Pair of Linear Equations in Two Variables',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 3',
          syllabusTopics: ['Graphical method of solution: Intersecting (unique), Parallel (inconsistent/no solution), Coincident (infinitely many)', 'Algebraic consistency conditions: $a_1/a_2 \\ne b_1/b_2$ vs $a_1/a_2 = b_1/b_2 = c_1/c_2$', 'Substitution Method and Elimination Method', 'Word problems on boat upstream/downstream, age, two-digit numbers, fixed-and-variable taxi fares'],
          learningObjectives: ['Solve simultaneous linear systems using elimination and substitution', 'Formulate algebraic systems from real-world rate and upstream-downstream problems'],
          coreFormulas: [
            '\\text{Unique: } \\frac{a_1}{a_2} \\ne \\frac{b_1}{b_2}',
            '\\text{Infinitely Many: } \\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}',
            '\\text{No Solution: } \\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\ne \\frac{c_1}{c_2}'
          ]
        },
        {
          id: 'ch-10-m-4',
          name: 'Quadratic Equations',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 4',
          syllabusTopics: ['Standard form: $ax^2 + bx + c = 0$ ($a \\ne 0$)', 'Solving quadratic equations by factorisation (splitting middle term)', 'Quadratic Formula derivation using completing the square: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$', 'Nature of roots using discriminant $D = b^2 - 4ac$: $D > 0$ (two distinct real roots), $D = 0$ (two equal real roots), $D < 0$ (no real roots)'],
          learningObjectives: ['Solve any quadratic equation using quadratic formula', 'Determine value of unknown parameter k for equal real roots'],
          coreFormulas: ['D = b^2 - 4ac', 'x = \\frac{-b \\pm \\sqrt{D}}{2a}']
        },
        {
          id: 'ch-10-m-5',
          name: 'Arithmetic Progressions',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 5',
          syllabusTopics: ['Definition of Arithmetic Progression (AP), first term $a$, common difference $d$', 'General nth term formula: $a_n = a + (n - 1)d$', 'Sum of first n terms formula: $S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(a + l)$', 'Practical applications in daily life savings, installment repayments, ladder rungs'],
          learningObjectives: ['Calculate any designated term and determine number of terms in an AP', 'Find total sum of series in arithmetic progressions'],
          coreFormulas: ['a_n = a + (n - 1)d', 'S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)']
        },
        {
          id: 'ch-10-m-6',
          name: 'Triangles',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 6',
          syllabusTopics: ['Similarity of figures vs Congruence', 'Basic Proportionality Theorem (Thales Theorem): line parallel to one side of triangle divides other two sides in the same ratio, and converse', 'Criteria for similarity of triangles: AAA (or AA), SSS, SAS similarity', 'Applications of similarity in finding heights of trees, towers, shadows'],
          learningObjectives: ['Prove the Basic Proportionality Theorem (Thales Theorem) with formal geometric steps', 'Apply AA and SAS similarity criteria to prove proportional geometric relationships'],
          coreFormulas: ['\\frac{AD}{DB} = \\frac{AE}{EC} \\text{ (BPT / Thales Theorem)}']
        },
        {
          id: 'ch-10-m-7',
          name: 'Coordinate Geometry',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 7',
          syllabusTopics: ['Distance formula derivation: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$', 'Collinearity of three points and classifying quadrilateral vertices (rhombus, rectangle, square)', 'Section formula: Internal division coordinates $P(x, y) = \\left(\\frac{m_1x_2 + m_2x_1}{m_1+m_2}, \\frac{m_1y_2 + m_2y_1}{m_1+m_2}\\right)$', 'Midpoint formula: $M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)$ and trisection points'],
          learningObjectives: ['Calculate distance between points in coordinate space', 'Apply section formula to determine division ratios ($k:1$) and midpoint coordinates'],
          coreFormulas: [
            'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
            'P(x, y) = \\left(\\frac{m_1x_2 + m_2x_1}{m_1+m_2}, \\frac{m_1y_2 + m_2y_1}{m_1+m_2}\\right)',
            'M(x, y) = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)'
          ]
        },
        {
          id: 'ch-10-m-8',
          name: 'Introduction to Trigonometry',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 8',
          syllabusTopics: ['Trigonometric ratios of an acute angle in a right-angled triangle: $\\sin, \\cos, \\tan, \\csc, \\sec, \\cot$', 'Trigonometric ratios of specific angles: 0°, 30°, 45°, 60°, 90° table', 'Fundamental trigonometric identities: $\\sin^2\\theta + \\cos^2\\theta = 1$, $1 + \\tan^2\\theta = \\sec^2\\theta$, $1 + \\cot^2\\theta = \\csc^2\\theta$'],
          learningObjectives: ['Evaluate exact values of trigonometric expressions for standard angles', 'Prove algebraic trigonometric identities using fundamental Pythagorean relations'],
          coreFormulas: [
            '\\sin^2\\theta + \\cos^2\\theta = 1',
            '1 + \\tan^2\\theta = \\sec^2\\theta',
            '1 + \\cot^2\\theta = \\csc^2\\theta',
            '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}'
          ]
        },
        {
          id: 'ch-10-m-9',
          name: 'Some Applications of Trigonometry',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 9',
          syllabusTopics: ['Line of sight, Angle of elevation (observer looking up), Angle of depression (observer looking down)', 'Solving simple 2D right triangle problems with one or two observers', 'Heights and distances of towers, buildings, ships at sea, balloons, lighthouses (angles restricted to 30°, 45°, 60°)'],
          learningObjectives: ['Translate real-world surveying and navigation word problems into right-angled trigonometric sketches', 'Compute heights and horizontal separation distances using tan, sin, cos ratios'],
          coreFormulas: ['\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{\\text{Height}}{\\text{Distance}}']
        },
        {
          id: 'ch-10-m-10',
          name: 'Circles',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 10',
          syllabusTopics: ['Tangent to a circle and point of contact', 'Theorem: Tangent at any point of a circle is perpendicular to the radius through the point of contact ($OP \\perp PT$)', 'Theorem: Lengths of tangents drawn from an external point to a circle are equal ($PA = PB$)', 'Quadrilaterals circumscribing a circle ($AB + CD = AD + BC$)'],
          learningObjectives: ['Prove that radius is perpendicular to tangent at point of contact', 'Prove that tangents from an external point are equal in length and apply in polygon proofs'],
          coreFormulas: ['PA = PB \\text{ (Tangents from external point)}', 'AB + CD = AD + BC \\text{ (Circumscribed Quadrilateral)}']
        },
        {
          id: 'ch-10-m-11',
          name: 'Areas Related to Circles',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 11',
          syllabusTopics: ['Sector of a circle: Minor sector and Major sector', 'Area of sector with angle $\\theta$: $\\frac{\\theta}{360^\\circ} \\times \\pi r^2$', 'Length of an arc of a sector: $\\frac{\\theta}{360^\\circ} \\times 2\\pi r$', 'Segment of a circle: Minor segment and Major segment', 'Area of segment = Area of sector - Area of corresponding triangle'],
          learningObjectives: ['Compute area of circular sectors and perimeter of sectors', 'Calculate area of shaded segment designs in circular table covers, brooches, and clock sectors'],
          coreFormulas: [
            '\\text{Area of Sector} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2',
            '\\text{Length of Arc} = \\frac{\\theta}{360^\\circ} \\times 2\\pi r',
            '\\text{Area of Segment} = \\frac{\\theta}{360^\\circ}\\pi r^2 - \\frac{1}{2}r^2\\sin\\theta'
          ]
        },
        {
          id: 'ch-10-m-12',
          name: 'Surface Areas and Volumes',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 12',
          syllabusTopics: ['Surface area of combination of solids: cylinder with hemispherical ends (capsule), cone mounted on hemisphere (toy), tent (cylinder surmounted by cone)', 'Volume of combination of solids: solid hemisphere, cone, cylinder combinations', 'Conversion of solid from one shape to another (melting metallic spheres to recasting into cylinder)'],
          learningObjectives: ['Compute total surface area of composite solids without adding internal contact interfaces', 'Calculate dimensions when solids are recast or liquid is transferred between containers'],
          coreFormulas: [
            'TSA_{\\text{Toy}} = CSA_{\\text{cone}} + CSA_{\\text{hemisphere}} = \\pi rl + 2\\pi r^2',
            'V_{\\text{Toy}} = \\frac{1}{3}\\pi r^2 h + \\frac{2}{3}\\pi r^3'
          ]
        },
        {
          id: 'ch-10-m-13',
          name: 'Statistics',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 13',
          syllabusTopics: ['Mean of grouped data: Direct method ($\\bar{x} = \\sum f_i x_i / \\sum f_i$), Assumed Mean method ($\\bar{x} = a + \\sum f_i d_i / \\sum f_i$), Step-deviation method', 'Mode of grouped data formula: $\\text{Mode} = l + \\left(\\frac{f_1 - f_0}{2f_1 - f_0 - f_2}\\right)h$', 'Median of grouped data formula: $\\text{Median} = l + \\left(\\frac{n/2 - cf}{f}\\right)h$', 'Empirical relationship between three central tendencies: $3\\text{ Median} = \\text{Mode} + 2\\text{ Mean}$'],
          learningObjectives: ['Compute mean, median, and mode for continuous grouped frequency distributions', 'Apply the empirical formula relating mean, median, and mode'],
          coreFormulas: [
            '\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}',
            '\\text{Mode} = l + \\left(\\frac{f_1 - f_0}{2f_1 - f_0 - f_2}\\right)h',
            '\\text{Median} = l + \\left(\\frac{n/2 - cf}{f}\\right)h',
            '3\\text{ Median} = \\text{Mode} + 2\\text{ Mean}'
          ]
        },
        {
          id: 'ch-10-m-14',
          name: 'Probability',
          textbookRef: 'NCERT Mathematics Class 10 — Chapter 14',
          syllabusTopics: ['Classical definition of probability: $P(E) = \\frac{\\text{Number of outcomes favorable to } E}{\\text{Total number of possible outcomes}}$', 'Elementary events and sum of probabilities of all elementary events = 1', 'Complementary events: $P(E) + P(\\bar{E}) = 1$', 'Impossible event ($P = 0$) and Sure/Certain event ($P = 1$); $0 \\le P(E) \\le 1$', 'Probability problems on coins (1, 2, 3 coins), standard dice (1 or 2 dice), well-shuffled pack of 52 playing cards, and colored marbles in bags'],
          learningObjectives: ['Calculate theoretical probability of compound outcomes in cards, dice, and coins', 'Verify that probability values remain bounded between 0 and 1'],
          coreFormulas: ['P(E) = \\frac{n(E)}{n(S)}', 'P(E) + P(\\bar{E}) = 1', '0 \\le P(E) \\le 1']
        }
      ]
    },
    {
      id: 'cbse-10-science',
      name: 'Science (Physics, Chemistry, Biology)',
      category: 'General Science',
      curricula: ['NCERT Science Class 10', 'NCERT Exemplar Class 10', 'CBSE Board Science Curriculum'],
      chapters: [
        {
          id: 'ch-10-s-1',
          name: 'Chemical Reactions and Equations',
          textbookRef: 'NCERT Science Class 10 — Chapter 1',
          syllabusTopics: ['Chemical equation balancing using law of conservation of mass', 'Types of chemical reactions: Combination (slaking of lime), Decomposition (thermal, electrolytic, photolytic: silver chloride in sunlight), Displacement, Double displacement (precipitation of barium sulphate)', 'Oxidation and Reduction (Redox reactions, oxidizing and reducing agents)', 'Corrosion of metals and Rancidity of fats/oils with antioxidant prevention'],
          learningObjectives: ['Balance complex chemical equations with state symbols', 'Identify oxidized, reduced, oxidizing, and reducing agents in redox reactions'],
          coreFormulas: ['\\text{CaO} + \\text{H}_2\\text{O} \\to \\text{Ca(OH)}_2 + \\text{Heat}', '2\\text{AgCl(s)} \\xrightarrow{\\text{Sunlight}} 2\\text{Ag(s)} + \\text{Cl}_2\\text{(g)}']
        },
        {
          id: 'ch-10-s-2',
          name: 'Acids, Bases and Salts',
          textbookRef: 'NCERT Science Class 10 — Chapter 2',
          syllabusTopics: ['Chemical properties: Acid + Metal -> Salt + Hydrogen gas ($H_2$ burns with pop sound), Acid + Metal carbonate -> Salt + $CO_2$ + $H_2O$ (turns lime water milky)', 'Neutralization reaction producing salt and water', 'pH scale ($0 \\le \\text{pH} \\le 14$): acidic (<7), neutral (7), basic (>7); universal indicator', 'Importance of pH: plant soil, digestive acid reflux, tooth decay below pH 5.5', 'Salts chemistry: Bleaching powder ($CaOCl_2$), Baking soda ($NaHCO_3$), Washing soda ($Na_2CO_3\\cdot 10H_2O$), Plaster of Paris ($CaSO_4\\cdot \\frac{1}{2}H_2O$)'],
          learningObjectives: ['Explain chemical preparation and industrial applications of chlor-alkali salts', 'Analyze biological and agricultural consequences of pH changes'],
          coreFormulas: ['\\text{pH} = -\\log[\\text{H}^+]', '\\text{CaSO}_4\\cdot 2\\text{H}_2\\text{O} \\xrightarrow{373\\text{ K}} \\text{CaSO}_4\\cdot \\frac{1}{2}\\text{H}_2\\text{O} + 1\\frac{1}{2}\\text{H}_2\\text{O}']
        },
        {
          id: 'ch-10-s-3',
          name: 'Metals and Non-metals',
          textbookRef: 'NCERT Science Class 10 — Chapter 3',
          syllabusTopics: ['Physical properties (malleability, ductility, sonority, conductivity); Exceptions: Mercury liquid, Iodine lustrous, Sodium soft', 'Reactivity series of metals ($K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au$)', 'Ionic compounds: electron transfer, ionic bonding, crystal lattice, high melting/boiling points, electrical conduction in molten/aqueous state', 'Metallurgy: Mineral vs Ore; Concentration, Roasting of sulphide ores, Calcination of carbonate ores, Thermite reaction ($Fe_2O_3 + 2Al$ for railway tracks), Electrolytic refining of copper', 'Corrosion prevention and Alloying (Steel, Brass, Bronze, Solder, Amalgam)'],
          learningObjectives: ['Draw electron dot structures for ionic compounds ($NaCl, MgCl_2$)', 'Outline metallurgical extraction stages based on metal reactivity positions']
        },
        {
          id: 'ch-10-s-4',
          name: 'Carbon and Its Compounds',
          textbookRef: 'NCERT Science Class 10 — Chapter 4',
          syllabusTopics: ['Covalent bonding: sharing of electrons ($CH_4, H_2O, CO_2$); Versatile nature of carbon: Catenation and Tetravalency', 'Allotropes of carbon: Diamond (3D network), Graphite (hexagonal layers, conductor), Buckminsterfullerene ($C_{60}$)', 'Saturated hydrocarbons (Alkanes $C_nH_{2n+2}$) vs Unsaturated hydrocarbons (Alkenes $C_nH_{2n}$, Alkynes $C_nH_{2n-2}$)', 'Functional groups: Alcohol (-OH), Aldehyde (-CHO), Ketone (-CO-), Carboxylic acid (-COOH), Halogens (-Cl, -Br)', 'Homologous series and IUPAC nomenclature', 'Chemical properties: Combustion, Oxidation (alkaline $KMnO_4$), Addition reaction (hydrogenation of vegetable oils), Substitution reaction with chlorine', 'Ethanol ($CH_3CH_2OH$) and Ethanoic acid ($CH_3COOH$, vinegar, esterification reaction, saponification)'],
          learningObjectives: ['Name carbon compounds using systematic IUPAC rules', 'Explain esterification and the cleansing action of soap micelles'],
          coreFormulas: [
            '\\text{Alkane: } C_n H_{2n+2}',
            '\\text{Alkene: } C_n H_{2n}',
            '\\text{Alkyne: } C_n H_{2n-2}',
            '\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\xrightarrow{\\text{H}^+} \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}'
          ]
        },
        {
          id: 'ch-10-s-5',
          name: 'Life Processes',
          textbookRef: 'NCERT Science Class 10 — Chapter 5',
          syllabusTopics: ['Nutrition: Autotrophic photosynthesis biochemical steps, stomata function; Heterotrophic nutrition (holozoic in humans and Amoeba)', 'Human alimentary canal: digestion in mouth, stomach, duodenum, ileum; role of bile, pancreatic enzymes, intestinal villi', 'Respiration: Breakdown of glucose by various pathways (aerobic mitochondria, anaerobic yeast, lactic acid in human muscles); Human respiratory system with alveoli gas exchange', 'Transportation: Human circulatory system, heart structure (double circulation), blood pressure (systolic 120 / diastolic 80 mmHg), lymph, transport in plants (xylem transpiration pull and phloem translocation)', 'Excretion: Human nephron structure (glomerular filtration, tubular reabsorption, secretion), artificial kidney (hemodialysis), plant excretion'],
          learningObjectives: ['Diagram the structural anatomy of the human heart and nephron', 'Explain the three biochemical fates of pyruvate in cellular respiration'],
          coreFormulas: ['\\text{Glucose (6C)} \\xrightarrow{\\text{Cytoplasm}} \\text{Pyruvate (3C)}']
        },
        {
          id: 'ch-10-s-6',
          name: 'Control and Coordination',
          textbookRef: 'NCERT Science Class 10 — Chapter 6',
          syllabusTopics: ['Neuron structure: Dendrite, Cell body (cyton), Axon, Synapse (chemical neurotransmitters)', 'Reflex arc: Receptor -> Sensory neuron -> Spinal cord relay -> Motor neuron -> Effector muscle', 'Human brain: Forebrain (cerebrum: thinking, memory, sensory interpretation), Midbrain, Hindbrain (cerebellum: balance/posture; medulla: involuntary blood pressure/salivation; pons: respiration)', 'Plant hormones (Phytohormones): Auxin (phototropism), Gibberellin (stem elongation), Cytokinin (cell division), Abscisic acid (wilting/growth inhibitor)', 'Plant tropic movements: Phototropism, Geotropism, Hydrotropism, Chemotropism, Nastic movements (Mimosa pudica touch-me-not)', 'Human endocrine system: Pituitary (growth hormone), Thyroid (thyroxine, iodine importance), Pancreas (insulin), Adrenals (adrenaline), Testes and Ovaries; Feedback mechanisms'],
          learningObjectives: ['Trace electrical and chemical transmission across neural synapses', 'Describe hormonal feedback loops regulating blood glucose levels']
        },
        {
          id: 'ch-10-s-7',
          name: 'How do Organisms Reproduce?',
          textbookRef: 'NCERT Science Class 10 — Chapter 7',
          syllabusTopics: ['DNA replication importance and creation of variations', 'Asexual reproduction modes: Binary fission (Amoeba, Leishmania), Multiple fission (Plasmodium), Fragmentation (Spirogyra), Regeneration (Planaria), Budding (Hydra, Yeast), Vegetative propagation, Spore formation (Rhizopus)', 'Sexual reproduction in flowering plants: Stamen (anther/pollen), Carpel/Pistil (stigma, style, ovary), Double fertilization and triple fusion forming endosperm ($3n$)', 'Human male reproductive system: Testes (scrotum, testosterone, spermatogenesis), vas deferens, prostate and seminal vesicles, urethra', 'Human female reproductive system: Ovaries, fallopian tubes (fertilization site), uterus, 28-day menstrual cycle', 'Reproductive health: Barrier, chemical, surgical contraceptive methods (vasectomy, tubectomy), sexually transmitted infections (STIs: Gonorrhea, Syphilis, HIV-AIDS)'],
          learningObjectives: ['Explain double fertilization in angiosperm flowers', 'Differentiate modern contraceptive methods and advocate for reproductive health']
        },
        {
          id: 'ch-10-s-8',
          name: 'Heredity and Evolution',
          textbookRef: 'NCERT Science Class 10 — Chapter 8',
          syllabusTopics: ['Heredity: Transmission of genetically based characteristics from parents to offspring', 'Gregor Johann Mendel’s experiments on garden pea (Pisum sativum)', 'Monohybrid cross: Law of Dominance and Law of Segregation, phenotypic ratio $3:1$, genotypic ratio $1:2:1$', 'Dihybrid cross: Law of Independent Assortment, phenotypic ratio $9:3:3:1$', 'Sex determination in humans: XX (female) vs XY (male; sperm determines offspring sex)'],
          learningObjectives: ['Construct Punnett squares for monohybrid and dihybrid genetic crosses', 'Explain why human sex determination is genetically determined by the father’s gamete'],
          coreFormulas: [
            '\\text{Monohybrid Phenotypic Ratio} = 3 : 1',
            '\\text{Monohybrid Genotypic Ratio} = 1 : 2 : 1',
            '\\text{Dihybrid Phenotypic Ratio} = 9 : 3 : 3 : 1'
          ]
        },
        {
          id: 'ch-10-s-9',
          name: 'Light — Reflection and Refraction',
          textbookRef: 'NCERT Science Class 10 — Chapter 9',
          syllabusTopics: [
            'Spherical mirrors: Concave and Convex mirror ray diagrams for all object positions',
            'Mirror Formula: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$ and Linear Magnification: $m = -\\frac{v}{u} = \\frac{h_i}{h_o}$',
            'Refraction of light: Snell’s Law ($\\frac{\\sin i}{\\sin r} = n_{21}$), absolute refractive index $n = c/v$',
            'Refraction through a rectangular glass slab and lateral displacement',
            'Spherical lenses: Convex lens (converging) and Concave lens (diverging) ray diagrams',
            'Lens Formula: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$ and Magnification: $m = \\frac{v}{u} = \\frac{h_i}{h_o}$',
            'Power of a lens ($P = 1/f$ in metres, Dioptre D) and combination of thin lenses: $P = P_1 + P_2$'
          ],
          learningObjectives: ['Apply Cartesian sign convention to solve mirror and lens numericals', 'Calculate lens power requirements for corrective spectacle prescriptions'],
          coreFormulas: [
            '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\text{ (Mirror Formula)}',
            'm = -\\frac{v}{u} = \\frac{h_i}{h_o}',
            '\\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} \\text{ (Snell’s Law)}',
            '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\text{ (Lens Formula)}',
            'P = \\frac{1}{f \\text{ (m)}}'
          ]
        },
        {
          id: 'ch-10-s-10',
          name: 'The Human Eye and the Colourful World',
          textbookRef: 'NCERT Science Class 10 — Chapter 10',
          syllabusTopics: ['Human eye optical anatomy and power of accommodation of ciliary muscles (least distance of distinct vision $D = 25\\text{ cm}$)', 'Refractive vision defects: Myopia (short-sightedness, corrected by concave lens), Hypermetropia (far-sightedness, corrected by convex lens), Presbyopia (bifocal lenses)', 'Refraction of light through a triangular glass prism: angle of deviation ($D$)', 'Dispersion of white light by a prism (VIBGYOR) and recombination by inverted prism (Newton’s experiment)', 'Atmospheric refraction: Twinkling of stars, advance sunrise (2 min) and delayed sunset (2 min), flattening of solar disc', 'Scattering of light: Tyndall effect, Rayleigh scattering ($I \\propto 1/\\lambda^4$), blue color of clear sky, reddish sky at sunrise and sunset'],
          learningObjectives: ['Calculate required focal length and power of spectacle lenses to correct myopia and hypermetropia', 'Explain atmospheric refraction and light scattering phenomena in nature'],
          coreFormulas: ['\\text{Rayleigh Scattering: } I \\propto \\frac{1}{\\lambda^4}']
        },
        {
          id: 'ch-10-s-11',
          name: 'Electricity',
          textbookRef: 'NCERT Science Class 10 — Chapter 11',
          syllabusTopics: ['Electric current: $I = Q/t$ (Ampere), potential difference: $V = W/Q$ (Volt)', 'Ohm’s Law: $V = IR$ at constant temperature; V-I characteristic graph', 'Resistance factors: length ($l$), area of cross-section ($A$), and material resistivity ($\\rho$): $R = \\rho l / A$', 'Resistors in Series ($R_s = R_1 + R_2 + R_3$) vs Resistors in Parallel ($\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$)', 'Joule’s Law of Heating: $H = I^2Rt = VIt = \\frac{V^2}{R}t$', 'Electric Power: $P = VI = I^2R = V^2/R$ (Watt), commercial unit of electrical energy ($1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}$)'],
          learningObjectives: ['Solve equivalent resistance and branch currents in complex circuit networks', 'Calculate electrical power consumption and commercial domestic electricity bill costs'],
          coreFormulas: [
            'V = IR',
            'R = \\rho \\frac{l}{A}',
            'R_s = R_1 + R_2 + R_3',
            '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}',
            'H = I^2 R t',
            'P = VI = \\frac{V^2}{R} = I^2 R'
          ]
        },
        {
          id: 'ch-10-s-12',
          name: 'Magnetic Effects of Electric Current',
          textbookRef: 'NCERT Science Class 10 — Chapter 12',
          syllabusTopics: ['Magnetic field and field lines around a bar magnet (closed continuous curves, tangent gives direction, lines never intersect)', 'Magnetic field due to a current-carrying straight conductor (Right-Hand Thumb Rule)', 'Magnetic field due to a circular loop and solenoid (uniform magnetic field inside)', 'Force on a current-carrying conductor in a magnetic field: Fleming’s Left-Hand Rule ($F = B I l \\sin\\theta$)', 'Electromagnetic Induction (Michael Faraday): induced potential difference, Fleming’s Right-Hand Rule', 'Domestic electric circuits: Live wire (red/brown 220 V), Neutral wire (black/blue 0 V), Earth wire (green/yellow), Electric fuse safety and Earthing'],
          learningObjectives: ['Apply Right-Hand Thumb Rule and Fleming’s Left-Hand Rule to determine magnetic vector directions', 'Explain earthing protection against electric shocks in metallic home appliances'],
          coreFormulas: ['F = B I l \\sin\\theta']
        },
        {
          id: 'ch-10-s-13',
          name: 'Our Environment',
          textbookRef: 'NCERT Science Class 10 — Chapter 13',
          syllabusTopics: ['Ecosystem: Biotic and abiotic components, Producers, Consumers (herbivores, carnivores, omnivores), Decomposers', 'Food chains and Food webs; Trophic levels and Lindeman’s 10% Law of energy transfer between trophic levels', 'Biological Magnification (Biomagnification): concentration of non-biodegradable pesticides (e.g. DDT) increasing at successive trophic levels', 'Environmental challenges: Ozone layer depletion by Chlorofluorocarbons (CFCs), Montreal Protocol 1987', 'Solid waste management: biodegradable vs non-biodegradable waste, incineration, landfill composting'],
          learningObjectives: ['Calculate energy available at successive trophic levels using the 10% law', 'Explain the toxic mechanism of biomagnification in aquatic and terrestrial food webs'],
          coreFormulas: ['\\text{Energy at Next Trophic Level} = 10\\% \\times \\text{Energy at Previous Level}']
        }
      ]
    },
    {
      id: 'cbse-10-japanese',
      name: 'Japanese (CBSE Subject Code 094 / NCERT Japanese Class 10)',
      category: 'Japanese',
      curricula: ['CBSE Class 10 Board Japanese Curriculum (Code 094)', 'NCERT / Japan Foundation Nihongo 10'],
      chapters: [
        {
          id: 'ch-10-jp-1',
          name: 'Chapter 1: かのうけい (Potential Form: 日本語が話せます)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 1',
          syllabusTopics: ['Conjugation rules for Potential Form (Group 1: -u -> -eru; Group 2: -ru -> -rareru; Group 3: dekiru, korareru)', 'Particle case shift: direct object を changes to が with potential verbs (Nihongo ga hanasemasu)', 'Describing capabilities, physical faculties, and circumstantial possibilities', 'Negative potential: Kanji ga kakkemasen (Cannot write kanji)'],
          learningObjectives: ['Conjugate Japanese verbs into potential forms with 100% accuracy', 'Apply the particle ga shift with potential verb constructions'],
          coreFormulas: ['[\\text{Noun}] \\text{ ga } [\\text{Verb-Potential}]']
        },
        {
          id: 'ch-10-jp-2',
          name: 'Chapter 2: じょうけんけい (~たら / ~ば - Conditionals & Hypotheses)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 2',
          syllabusTopics: ['Conjugation of ~tara conditional (past plain form + ra)', 'Conjugation of ~ba conditional (Group 1: -e -> -eba; Group 2: -reba; i-adj: -kereba)', 'Expressing chronological conditions (when/after): Nihon e ittara, camera o kaimasu', 'Hypothetical conditions: Ame ga fureba, dekakemasen', 'Uncertainty expressions: ~kamo shiremasen (might / possibly)'],
          learningObjectives: ['Distinguish contextual nuances between ~tara and ~ba conditional clauses', 'Express hypothetical scenarios and causal correlations accurately'],
          coreFormulas: ['[\\text{Condition-tara}], [\\text{Action}]', '[\\text{Condition-ba}], [\\text{Result}]']
        },
        {
          id: 'ch-10-jp-3',
          name: 'Chapter 3: じゅじゅひょうげん (あげる・もらう・くれる - Giving & Receiving)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 3',
          syllabusTopics: ['The triad of giving/receiving verbs: Ageru (I give to someone / someone gives to others)', 'Morau (receive from someone)', 'Kureru (someone gives to me or my in-group)', 'Benefactive constructions: [Verb-te] ageru (do a favor for someone), [Verb-te] morau (have someone do a favor), [Verb-te] kureru (someone kindly does a favor for me)'],
          learningObjectives: ['Select correct giving/receiving verbs based on psychological in-group/out-group vantage points', 'Express gratitude for received favors using benefactive te-form constructions'],
          coreFormulas: [
            '[A] \\text{ wa } [B] \\text{ ni } [\\text{Item}] \\text{ o agemasu}',
            '[A] \\text{ wa } [B] \\text{ ni/kara } [\\text{Item}] \\text{ o moraimasu}',
            '[A] \\text{ wa watashi ni } [\\text{Item}] \\text{ o kuremasu}'
          ]
        },
        {
          id: 'ch-10-jp-4',
          name: 'Chapter 4: じょげん と いけん (~ほうがいいです / ~とおもいます - Advice & Opinions)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 4',
          syllabusTopics: ['Giving advice: [Verb-ta] hou ga ii desu (You had better do...) / [Verb-nai] hou ga ii desu (You had better not do...)', 'Stating opinions: [Plain Form] to omoimasu (I think that...)', 'Quoting speech directly and indirectly: [Plain Form] to iimashita (Said that...)', 'Expressing expectations and assumptions: ~hazu desu'],
          learningObjectives: ['Give practical health and study advice politely in Japanese', 'Articulate nuanced personal opinions and quote statements from others'],
          coreFormulas: [
            '[\\text{Verb-ta}] \\text{ hou ga ii desu (Had better...)}',
            '[\\text{Plain Form}] \\text{ to omoimasu (I think that...)}'
          ]
        },
        {
          id: 'ch-10-jp-5',
          name: 'Chapter 5: けいご (Keigo: Sonkeigo, Kenjougo & Teineigo - Honorifics)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 5',
          syllabusTopics: ['Three tiers of Keigo: Teineigo (polite), Sonkeigo (respectful to superiors), Kenjougo (humble for self)', 'Special Sonkeigo verbs: Ossharu (say), Irassharu (go/come/be), Meshiagaru (eat/drink), Goran ni naru (look)', 'Special Kenjougo verbs: Mousu (say), Mairu (go/come), Itadaku (eat/receive), Haiken suru (look)', 'Prefixes o- and go- for polite nouns (O-denwa, Go-kazoku)'],
          learningObjectives: ['Differentiate respectful and humble registers in Japanese etiquette', 'Read and interpret formal polite announcements in CBSE examination materials']
        },
        {
          id: 'ch-10-jp-6',
          name: 'Chapter 6: かんじ (CBSE Class 10 Board Exam Kanji 100)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 6',
          syllabusTopics: ['Complete 100 prescribed CBSE Class 10 Board Kanji characters', 'Advanced radicals: 言 (say), 氵 (water), 扌 (hand), 亻 (person), 辶 (road)', 'Reading and writing compounds without furigana in board exam pattern', 'Kanji stroke orders, Kun-yomi and On-yomi evaluations'],
          learningObjectives: ['Master all 100 CBSE Class 10 Kanji characters with accurate stroke orders', 'Identify contextual readings of homophonic and multi-meaning Kanji glyphs']
        },
        {
          id: 'ch-10-jp-7',
          name: 'Chapter 7: ちょうかい (CBSE Board Listening Comprehension)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 7',
          syllabusTopics: ['Auditory identification of conversation gist and specific details', 'Train station announcements, weather bulletins, and voice messages in Japanese', 'Audio questions answering strategies: note taking and option elimination'],
          learningObjectives: ['Comprehend natural-speed Japanese spoken dialogues and announcements', 'Extract accurate numbers, times, and destinations from audio prompts']
        },
        {
          id: 'ch-10-jp-8',
          name: 'Chapter 8: どっかい と さくぶん (Reading Passages & Essay Writing)',
          textbookRef: 'CBSE Japanese Class 10 — Chapter 8',
          syllabusTopics: ['Long reading passages on Japanese cultural traditions, technological innovations, and environmental initiatives', 'Writing formal and informal correspondence: letters, emails, and greeting cards (Nengajou)', 'Structured 300-word Japanese essays: Environmental Protection, Cultural Exchange between India and Japan'],
          learningObjectives: ['Attain high scores in CBSE Class 10 Board reading comprehension sections', 'Compose clear, cohesive Japanese essays using varied syntactic structures']
        }
      ]
    },
    {
      id: 'cbse-10-social-science',
      name: 'Social Science (History, Civics, Geography, Economics)',
      category: 'History & Social Studies',
      curricula: ['NCERT India and the Contemporary World II', 'NCERT Contemporary India II', 'NCERT Democratic Politics II', 'NCERT Understanding Economic Development'],
      chapters: [
        {
          id: 'ch-10-soc-1',
          name: 'History: The Rise of Nationalism in Europe',
          textbookRef: 'NCERT India and the Contemporary World II — Chapter 1',
          syllabusTopics: ['Frédéric Sorrieu’s utopian vision of democratic republics', 'French Revolution and the idea of the nation; Napoleonic Civil Code of 1804', 'The Making of Nationalism in Europe: Aristocracy, New Middle Class, Liberal Nationalism (Zollverein customs union 1834)', 'Treaty of Vienna 1815 and Conservative order; Giuseppe Mazzini (Young Italy)', 'Unification of Germany (Otto von Bismarck, blood and iron) and Unification of Italy (Cavour, Garibaldi, Victor Emmanuel II)', 'Visualising the Nation: Allegories (Marianne in France, Germania in Germany); Balkan nationalism triggering World War I'],
          learningObjectives: ['Analyze the ideological evolution of modern nation-states in 19th-century Europe', 'Compare the unification processes of Germany and Italy']
        },
        {
          id: 'ch-10-soc-2',
          name: 'History: Nationalism in India',
          textbookRef: 'NCERT India and the Contemporary World II — Chapter 2',
          syllabusTopics: ['Impact of World War I, Rowlatt Act 1919 and Jallianwala Bagh Massacre (General Dyer)', 'Mahatma Gandhi’s philosophy of Satyagraha (Champaran, Kheda, Ahmedabad)', 'Non-Cooperation-Khilafat Movement: surrender of titles, boycott of foreign cloth and liquor; Differing strands within movement (towns, countryside: Baba Ramchandra in Awadh, tribal rebellion of Alluri Sitarama Raju, plantation workers in Assam)', 'Chauri Chaura incident (1922) and withdrawal', 'Civil Disobedience Movement: Simon Commission, Lahore Congress 1929 (Purna Swaraj resolution), Dandi Salt March (12 March to 6 April 1930)', 'Gandhi-Irwin Pact 1931, Round Table Conferences, Poona Pact 1932 (Dr. B. R. Ambedkar and reserved seats)', 'The sense of collective belonging: Bharat Mata icon (Abanindranath Tagore), tricolor flag, revival of folklore'],
          learningObjectives: ['Trace the progression of mass civil disobedience from Non-Cooperation to the Salt Satyagraha', 'Analyze social participation and differing economic aspirations of peasants, business classes, and dalits']
        },
        {
          id: 'ch-10-soc-3',
          name: 'Geography: Resources and Development & Agriculture',
          textbookRef: 'NCERT Contemporary India II — Chapters 1 & 4',
          syllabusTopics: ['Classification of resources; Rio de Janeiro Earth Summit 1992 and Agenda 21 for sustainable development', 'Land use pattern in India, land degradation (over-irrigation, over-grazing, mining) and conservation', 'Major soil types: Alluvial, Black (Regur/cotton), Red & Yellow, Laterite, Arid, Forest soils', 'Types of farming: Primitive subsistence, Intensive subsistence, Commercial farming', 'Cropping seasons: Kharif, Rabi, Zaid; Major food crops (Rice, Wheat, Millets, Pulses), Cash crops (Tea, Coffee, Sugarcane, Cotton, Jute)', 'Technological and institutional reforms in Indian agriculture (Green Revolution, White Revolution, Kisan Credit Card)'],
          learningObjectives: ['Map the geographic distribution of major Indian soil types', 'Analyze climatic and soil requirements for major food and commercial crops']
        },
        {
          id: 'ch-10-soc-4',
          name: 'Geography: Minerals, Energy Resources & Manufacturing',
          textbookRef: 'NCERT Contemporary India II — Chapters 5 & 6',
          syllabusTopics: ['Mode of occurrence of minerals: veins, lodes, beds, layers, placer deposits, ocean waters', 'Ferrous minerals (Iron ore: Magnetite, Hematite; Manganese) vs Non-ferrous (Bauxite/aluminium, Copper)', 'Non-metallic minerals (Mica, Limestone)', 'Conventional energy (Coal, Petroleum, Natural Gas, Electricity) vs Non-conventional energy (Solar, Wind, Biogas, Tidal, Nuclear/Atomic energy)', 'Manufacturing industries: Classification by raw materials (Agro-based: Textile, Sugar vs Mineral-based: Iron and steel, Aluminium smelting, Chemical, Fertilizers, Cement)', 'Industrial pollution (air, water, thermal, noise) and environmental degradation abatement'],
          learningObjectives: ['Evaluate the spatial distribution of mineral belts and industrial clusters across India', 'Propose industrial water recycling and zero-emission environmental technologies']
        },
        {
          id: 'ch-10-soc-5',
          name: 'Civics: Power-Sharing & Federalism',
          textbookRef: 'NCERT Democratic Politics II — Chapters 1 & 2',
          syllabusTopics: ['Case studies: Belgium (prudent ethnic accommodation between Dutch, French, German speakers) vs Sri Lanka (Majoritarianism favoring Sinhala over Tamils leading to civil war)', 'Why power-sharing is desirable: Prudential reasons (reduces conflict) and Moral reasons (spirit of democracy)', 'Forms of power-sharing: Horizontal (Legislature, Executive, Judiciary), Vertical (Federal/Union, State, Local), Social groups (reservations), Political parties and coalitions', 'Federalism: Key features of federal system; Coming together federations (USA) vs Holding together federations (India)', 'Threefold legislative distribution: Union List (defence, banking), State List (police, agriculture), Concurrent List (education, marriage), Residuary powers', 'Decentralisation in India: 73rd and 74th Constitutional Amendments 1992 strengthening Panchayati Raj and Municipalities'],
          learningObjectives: ['Compare the democratic outcomes of Belgian accommodation with Sri Lankan majoritarianism', 'Explain constitutional power division between Union and State tiers in Indian federalism']
        },
        {
          id: 'ch-10-soc-6',
          name: 'Civics: Political Parties & Outcomes of Democracy',
          textbookRef: 'NCERT Democratic Politics II — Chapters 4 & 5',
          syllabusTopics: ['Why do we need political parties? Functions: contesting elections, formulating policies, making laws, forming government, role of opposition, shaping public opinion', 'Party systems: One-party (China), Two-party (USA, UK), Multi-party system (India)', 'National Parties (criteria: 6% votes in Lok Sabha or 4 states + 4 seats) vs State/Regional Parties', 'Challenges facing political parties: Lack of internal democracy, Dynastic succession, Money and muscle power, Lack of meaningful choice', 'Reforming political parties: Anti-Defection Law, affidavit of assets and criminal cases, Election Commission financial audits', 'Outcomes of democracy: Accountable, responsive, and legitimate government; Economic growth and reduction of inequality; Dignity and freedom of citizens'],
          learningObjectives: ['Assess the essential functions and structural challenges of democratic political parties', 'Evaluate democracy’s record on economic growth, social diversity, and human dignity']
        },
        {
          id: 'ch-10-soc-7',
          name: 'Economics: Development, Sectors of Economy & Money/Credit',
          textbookRef: 'NCERT Understanding Economic Development — Chapters 1, 2 & 3',
          syllabusTopics: ['What development promises: Different people, different goals; Conflicting goals', 'National development: Per Capita Income (World Bank criterion), Human Development Index (HDI published by UNDP: education, life expectancy, per capita income)', 'Sectors of Indian economy: Primary, Secondary, Tertiary sectors; Historical shift from primary to tertiary as largest contributing sector to GDP', 'Organised vs Unorganised sectors; Public vs Private sector enterprises', 'Money as a medium of exchange; Eliminating double coincidence of wants; Modern forms: currency notes, coins, bank demand deposits', 'Formal credit (Banks, Cooperatives supervised by Reserve Bank of India) vs Informal credit (moneylenders, traders charging exorbitant interest rates)', 'Self-Help Groups (SHGs) for rural poor: collateral-free microfinance and women empowerment'],
          learningObjectives: ['Compare World Bank income metrics with UNDP multi-dimensional Human Development Index', 'Analyze the vital developmental role of RBI-regulated formal bank credit and rural SHGs']
        },
        {
          id: 'ch-10-soc-8',
          name: 'Economics: Globalisation and the Indian Economy',
          textbookRef: 'NCERT Understanding Economic Development — Chapter 4',
          syllabusTopics: ['Multinational Corporations (MNCs): setting up production globally where costs are low and markets are close', 'Integration of production across countries: foreign direct investment (FDI), partnerships, joint ventures, outsourcing', 'Foreign trade and market integration across national borders', 'Factors enabling globalisation: Telecommunication, Internet, Container shipping, Trade liberalisation (removal of trade barriers and import tariffs)', 'World Trade Organization (WTO): aims and debate over subsidies in developed vs developing nations', 'Impact of globalisation in India: Benefits for affluent urban consumers and skilled IT professionals; Challenges for small manufacturing workers; Struggle for fair globalisation'],
          learningObjectives: ['Analyze the enabling role of technology and trade liberalization in MNC globalization', 'Critique the uneven distribution of globalization gains across different socio-economic strata']
        }
      ]
    },
    {
      id: 'cbse-10-foundation',
      name: 'Foundation & Olympiads (Class 10 IIT-JEE / NEET Foundation)',
      category: 'Foundation & Olympiads',
      curricula: ['Class 10 IIT-JEE & NEET STEM Foundation', 'NTSE Stage 2 & Olympiad Finalist Program'],
      chapters: [
        {
          id: 'ch-10-fd-1',
          name: 'Foundation Physics: Current Electricity & Kirchhoff’s Laws',
          textbookRef: 'Class 10 JEE/NEET STEM Foundation — Chapter 1',
          syllabusTopics: ['Microscopic model of current: drift velocity ($v_d$), relaxation time ($\tau$), current density ($J = ne v_d$)', 'Kirchhoff’s Current Law (KCL - junction conservation of charge) and Kirchhoff’s Voltage Law (KVL - loop conservation of energy)', 'Wheatstone Bridge balance condition: $R_1 / R_2 = R_3 / R_4$', 'Internal resistance ($r$) of a cell, terminal potential difference, and maximum power transfer theorem ($R = r$)'],
          learningObjectives: ['Analyze multi-loop complex DC circuits using Kirchhoff’s Laws', 'Calculate equivalent resistance of symmetrical infinite ladder and bridge networks'],
          coreFormulas: ['I = n e A v_d', '\\sum I_{\\text{junction}} = 0', '\\sum V_{\\text{loop}} = 0', '\\frac{R_1}{R_2} = \\frac{R_3}{R_4}']
        },
        {
          id: 'ch-10-fd-2',
          name: 'Foundation Physics: Geometric Optics, Lenses & Curved Refraction',
          textbookRef: 'Class 10 JEE/NEET STEM Foundation — Chapter 2',
          syllabusTopics: ['Refraction at spherical surfaces: $\\frac{n_2}{v} - \\frac{n_1}{u} = \\frac{n_2 - n_1}{R}$', 'Lens Maker’s Formula: $\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$', 'Total Internal Reflection (TIR), critical angle ($\\sin C = 1/n$), optical fibers, and prism minimum deviation ($\delta_m$)', 'Chromatic and spherical aberrations in optical instruments'],
          learningObjectives: ['Derive and apply the Lens Maker’s Formula for asymmetric biconvex and concavo-convex lenses', 'Solve complex curved surface refraction problems in fluid media'],
          coreFormulas: [
            '\\frac{n_2}{v} - \\frac{n_1}{u} = \\frac{n_2 - n_1}{R}',
            '\\frac{1}{f} = (n - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
            '\\sin C = \\frac{1}{n}'
          ]
        },
        {
          id: 'ch-10-fd-3',
          name: 'Foundation Chemistry: Organic Hybridization & Reaction Mechanisms',
          textbookRef: 'Class 10 JEE/NEET STEM Foundation — Chapter 3',
          syllabusTopics: ['Orbital hybridization in carbon: $sp^3$ (tetrahedral 109.5°), $sp^2$ (trigonal planar 120°), $sp$ (linear 180°)', 'Electronic displacement effects: Inductive effect ($+I, -I$), Resonance effect, Hyperconjugation', 'Carbocation and carbanion intermediate stability order ($3^\\circ > 2^\\circ > 1^\\circ$)', 'Electrophilic addition to alkenes: Markovnikov’s Rule vs Anti-Markovnikov peroxide effect'],
          learningObjectives: ['Predict major reaction products using carbocation stability and Markovnikov’s rule', 'Determine carbon hybridization states and geometry in conjugated polyenes'],
          coreFormulas: ['\\text{Carbocation Stability: } 3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+']
        },
        {
          id: 'ch-10-fd-4',
          name: 'Foundation Chemistry: Chemical Equilibrium & Ionic Solutions',
          textbookRef: 'Class 10 JEE/NEET STEM Foundation — Chapter 4',
          syllabusTopics: ['Law of mass action and equilibrium constant expression ($K_c, K_p = K_c(RT)^{\\Delta n}$)', 'Le Chatelier’s Principle: effects of concentration, pressure, temperature, and inert gas additions on dynamic equilibrium', 'Ostwald’s dilution law for weak electrolytes and ionization constants ($K_a, K_b$)', 'Buffer solutions: Henderson-Hasselbalch equation and common ion effect'],
          learningObjectives: ['Predict equilibrium shifts using Le Chatelier’s principle for industrial Haber and Contact processes', 'Calculate pH of acidic and basic buffer solutions'],
          coreFormulas: ['K_p = K_c(RT)^{\\Delta n}', '\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]}']
        },
        {
          id: 'ch-10-fd-5',
          name: 'Foundation Math: Advanced Trigonometry & Coordinate Conics',
          textbookRef: 'Class 10 Math Olympiad & JEE Foundation — Chapter 5',
          syllabusTopics: ['Compound angle trigonometric formulas: $\\sin(A \\pm B), \\cos(A \\pm B), \\tan(A \\pm B)$', 'Multiple and sub-multiple angle formulas: $\\sin 2A, \\cos 2A, \\tan 2A, \\sin 3A, \\cos 3A$', 'Coordinate geometry: Angle between two straight lines ($\\tan\\theta = |(m_2-m_1)/(1+m_1m_2)|$)', 'Standard equation of circles: $(x - h)^2 + (y - k)^2 = r^2$ and general quadratic form $x^2 + y^2 + 2gx + 2fy + c = 0$'],
          learningObjectives: ['Prove complex multi-angle trigonometric identities and solve trigonometric equations', 'Determine centers, radii, and intersection conditions for circles and tangent lines'],
          coreFormulas: [
            '\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B',
            '\\cos 2A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A',
            '\\tan\\theta = \\left|\\frac{m_2 - m_1}{1 + m_1 m_2}\\right|',
            '(x - h)^2 + (y - k)^2 = r^2'
          ]
        },
        {
          id: 'ch-10-fd-6',
          name: 'Mental Ability (NTSE MAT Stage 1 & 2): Data Sufficiency & Puzzles',
          textbookRef: 'NTSE Stage 2 MAT Mastery Guide — Chapter 6',
          syllabusTopics: ['Data sufficiency questions with two or three statements', 'Complex multi-variable floor puzzles, day-month-color scheduling', 'Direction sense with vector displacement and Pythagorean distances', 'Cryptarithmetic puzzles (letters standing for unique decimal digits)'],
          learningObjectives: ['Determine whether given data sets are sufficient to answer logical queries without superfluous calculation', 'Solve NTSE National Stage 2 puzzle matrices under strict time limits']
        }
      ]
    },
    {
      id: 'cbse-10-hindi',
      name: 'Hindi (क्षितिज भाग 2 एवं स्पर्श)',
      category: 'Hindi',
      curricula: ['NCERT Kshitij & Sparsh Class 10', 'CBSE Class 10 Hindi Board Exam (Course A & B)'],
      chapters: [
        {
          id: 'ch-10-h-1',
          name: 'सूरदास के पद',
          textbookRef: 'NCERT क्षितिज भाग 2 — काव्य खंड पाठ 1',
          syllabusTopics: ['सूरसागर के भ्रमरगीत से संकलित चार पद', 'उद्धव-गोपी संवाद: निर्गुण ज्ञान योग पर सगुण प्रेम की विजय', 'गोपियों का उपालंभ, विरह वेदना और राजधर्म (प्रजा न जाहिं सताए)'],
          learningObjectives: ['भ्रमरगीत की व्यंग्यात्मक व वाग्विदग्धता शैली का अध्ययन', 'सूरदास की ब्रजभाषा माधुर्य और वात्सल्य-श्रृंगार रस की व्याख्या'],
        },
        {
          id: 'ch-10-h-2',
          name: 'राम-लक्ष्मण-परशुराम संवाद',
          textbookRef: 'NCERT क्षितिज भाग 2 — काव्य खंड पाठ 2',
          syllabusTopics: ['तुलसीदास विरचित रामचरितमानस (बालकांड) से उद्धृत प्रसंग', 'शिवधनुष टूटने पर परशुराम का क्रोध और लक्ष्मण का तीखा हास्य-व्यंग्य', 'राम की विनयशीलता, लक्ष्मण के वीर रस युक्त वचन और परशुराम का फरसा', 'चौपाई और दोहा छंद विधान'],
          learningObjectives: ['अवधी भाषा के साहित्यिक सौंदर्य और तुलसीदास की संवाद योजना का विश्लेषण', 'क्रोध बनाम विवेक के नैतिक द्वंद्व को समझना'],
        },
        {
          id: 'ch-10-h-3',
          name: 'उत्साह और अट नहीं रही है',
          textbookRef: 'NCERT क्षितिज भाग 2 — काव्य खंड पाठ 3',
          syllabusTopics: ['सूर्यकांत त्रिपाठी "निराला" के दो छायावादी गीत', '"उत्साह" — बादलों को क्रांति और नूतन चेतना के प्रतीक के रूप में आह्वान', '"अट नहीं रही है" — फागुन मास के असीम प्राकृतिक सौंदर्य का उल्लास'],
          learningObjectives: ['छायावादी काव्य शैली, लाक्षणिकता और बिंब-विधान का मूल्यांकन'],
        },
        {
          id: 'ch-10-h-4',
          name: 'यह दंतुरित मुस्कान और फसल',
          textbookRef: 'NCERT क्षितिज भाग 2 — काव्य खंड पाठ 4',
          syllabusTopics: ['नागार्जुन की दो प्रसिद्ध कविताएं', 'शिशु की नन्हीं दाँतदार मुस्कान का पाषाण-हृदय पिघलाने वाला प्रभाव', 'फसल: नदियों के पानी का जादू, हाथों के स्पर्श की गरिमा और धरती का रूप-रूपांतरण'],
          learningObjectives: ['श्रम की महत्ता, प्रकृति और मानव सह-अस्तित्व का काव्यात्मक बोध'],
        },
        {
          id: 'ch-10-h-5',
          name: 'संगतकार',
          textbookRef: 'NCERT क्षितिज भाग 2 — काव्य खंड पाठ 5',
          syllabusTopics: ['मंगेश डबराल की कविता', 'मुख्य गायक के साथ सुर साधने वाले सहयोगी कलाकार (संगतकार) का मौन समर्पण', 'संगतकार की मनुष्यता: अपनी आवाज को मुख्य गायक से नीचा रखना कमजोरी नहीं समर्पण है'],
          learningObjectives: ['पर्दे के पीछे कार्य करने वाले सहयोगियों के योगदान और मानवीय संवेदना का सम्मान'],
        },
        {
          id: 'ch-10-h-6',
          name: 'नेताजी का चश्मा',
          textbookRef: 'NCERT क्षितिज भाग 2 — गद्य खंड पाठ 1',
          syllabusTopics: ['स्वयं प्रकाश की प्रसिद्ध कहानी', 'हालदार साहब की कस्बे से नियमित यात्रा और चौराहे पर सुभाषचंद्र बोस की मूर्ति', 'कैप्टन चश्मेवाले का मूर्ति पर बार-बार नया चश्मा लगाना', 'सच्ची देशभक्ति: सीमाओं पर लड़ने तक सीमित न होकर कर्म में प्रकट होना'],
          learningObjectives: ['देशभक्ति के व्यावहारिक व रचनात्मक स्वरूप को समझना', 'चरित्र-चित्रण और कथानक का विवेचन'],
        },
        {
          id: 'ch-10-h-7',
          name: 'बालगोबिन भगत',
          textbookRef: 'NCERT क्षितिज भाग 2 — गद्य खंड पाठ 2',
          syllabusTopics: ['रामवृक्ष बेनीपुरी का सजीव रेखाचित्र', 'कबीरपंथी साधु बालगोबिन भगत का गृहस्थ होकर भी सन्यासियों जैसा निष्काम जीवन', 'बेटे की मृत्यु पर उत्सव और बहू का पुनर्विवाह कराने का क्रांतिकारी कदम', 'रूढ़ियों का विरोध'],
          learningObjectives: ['कबीर दर्शन और बाह्य आडंबरों से परे आंतरिक शुचिता के आदर्श को पहचानना'],
        },
        {
          id: 'ch-10-h-8',
          name: 'लखनवी अंदाज़',
          textbookRef: 'NCERT क्षितिज भाग 2 — गद्य खंड पाठ 3',
          syllabusTopics: ['यशपाल का व्यंग्य प्रधान निबंध', 'ट्रेन के सेकंड क्लास में नवाब साहब का खीरा काटने, सूंघने और खिड़की से बाहर फेंकने का ढोंग', 'सामंती दिखावे की बनावटी संस्कृति पर करारा प्रहार'],
          learningObjectives: ['व्यंग्य विधा की सूक्ष्म अंतर्दृष्टि और पाखंड-विरोधी तार्किक दृष्टिकोण अपनाना'],
        },
        {
          id: 'ch-10-h-9',
          name: 'एक कहानी यह भी',
          textbookRef: 'NCERT क्षितिज भाग 2 — गद्य खंड पाठ 4',
          syllabusTopics: ['मन्नू भंडारी की आत्मकथ्य शैली', 'पिता के क्रोधी व शक्की स्वभाव से टकराहट और स्वाधीनता संग्राम में कॉलेज के दिनों की भागीदारी', 'प्राध्यापिका शीला अग्रवाल का प्रभाव और साहित्यिक व्यक्तित्व का निर्माण'],
          learningObjectives: ['आत्मकथात्मक गद्य का अध्ययन और स्वतंत्रता आंदोलन में स्त्रियों की सक्रियता'],
        },
        {
          id: 'ch-10-h-10',
          name: 'नौबतखाने में इबादत',
          textbookRef: 'NCERT क्षितिज भाग 2 — गद्य खंड पाठ 5',
          syllabusTopics: ['यतीन्द्र मिश्र का व्यक्तिचित्र', 'भारतरत्न उस्ताद बिस्मिल्ला खाँ की शहनाई साधना, काशी की मिली-जुली गंगा-जमुनी संस्कृति', 'बालाजी मंदिर पर रियाज़ और संगीत को खुदा की इबादत मानना'],
          learningObjectives: ['भारतीय शास्त्रीय संगीत परंपरा और सांप्रदायिक सद्भाव की पहचान'],
        }
      ]
    },
    {
      id: 'cbse-10-marathi',
      name: 'Marathi (कुमारभारती / अक्षरभारती इयत्ता १० वी)',
      category: 'Marathi',
      curricula: ['Maharashtra State / NCERT Marathi Class 10', 'कुमारभारती इयत्ता दहावी Board Exam'],
      chapters: [
        {
          id: 'ch-10-mr-1',
          name: 'जय जय हे भारत देशा (गीत)',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ १',
          syllabusTopics: ['मंगेश पाडगावकर यांचे राष्ट्रीय एकात्मतेचे स्फूर्तिगीत', 'विविधतेत एकता, संतांची भूमी आणि स्वतंत्र भारताचा उज्ज्वल भविष्यकाळ'],
          learningObjectives: ['मातृभूमीबद्दल निष्ठा, कृतज्ञता व राष्ट्रीय गौरव अंगी बाणवणे'],
        },
        {
          id: 'ch-10-mr-2',
          name: 'संतवाणी (अंकिला मी दास तुझा / योगी सर्वकाळ सुखदाता)',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ २',
          syllabusTopics: ['संत नामदेव महाराज — आई, पाडस, पिल्लू यांच्या दृष्टांतातून परमेश्वराकडे मांडलेली शरणागती', 'संत एकनाथ महाराज — पाण्याचे जलसुख आणि योग्याचे आंतरिक ज्ञानसुख यांतील श्रेष्ठता'],
          learningObjectives: ['मध्ययुगीन संतकविता, दृष्टांत अलंकार व भक्तीरसाचे आकलन'],
        },
        {
          id: 'ch-10-mr-3',
          name: 'शाल',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ३',
          syllabusTopics: ['रा. ग. जाधव यांचा संस्मरणपर पाठ', 'पु. ल. देशपांडे यांनी दिलेली शाल आणि सन्मानाचे खरे मूल्य', 'मासे पकडणाऱ्या गरीब महिलेच्या थंडीने कुडकुडणाऱ्या बाळाला शाल दान करणे', 'शालीनता आणि दानत'],
          learningObjectives: ['सन्मानापेक्षा संवेदनशीलता व गरिबांप्रती भूतदया अधिक मोलाची असते हे शिकणे'],
        },
        {
          id: 'ch-10-mr-4',
          name: 'उपास',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ४',
          syllabusTopics: ['पु. ल. देशपांडे यांची अजरामर विनोदी कथा', 'पंत यांचा चाळीत जाहीर केलेला वजन कमी करण्याचा निश्चय', 'आहारतज्ज्ञांचे सल्ले, दोरीच्या उड्या, साखर सोडणे आणि चाळकरी लोकांची चेष्टा-मस्करी'],
          learningObjectives: ['उत्कृष्ट मराठी विनोदी साहित्यातील भाषिक सौंदर्य व जीवनदृष्टी अनुभवणे'],
        },
        {
          id: 'ch-10-mr-5',
          name: 'दोन दिवस (कविता)',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ५',
          syllabusTopics: ['नारायण सुर्वे यांची वास्तववादी कामगार कविता', '"दोन दिवस वाट पाहण्यात गेले, दोन दुःखात गेले"', 'भाकरीचा चंद्र शोधण्यातच जिणे बरबाद झालेले श्रमिकांचे दारुण वास्तव'],
          learningObjectives: ['श्रमिकांचे दुःख आणि जगण्याच्या धगधगत्या वास्तवाचे भान ठेवणे'],
        },
        {
          id: 'ch-10-mr-6',
          name: 'चुडीवाला',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ६',
          syllabusTopics: ['जयश्री रुईकर यांचा हृदयस्पर्शी पाठ', 'अब्दुल चुडीवाला — दापोलीतील कुष्ठरोग्यांच्या आश्रमात जाऊन संक्रांतीला व ज्येष्ठ पौर्णिमेला मोफत बांगड्या भरणे', 'समाजाने बहिष्कृत केलेल्या कुष्ठरोग्यांच्या चेहऱ्यावर आनंद फुलवण्याचे समाधान'],
          learningObjectives: ['जात-धर्मापलीकडे जाऊन दीनदुबळ्यांची केलेली निस्वार्थ सेवा आत्मसात करणे'],
        },
        {
          id: 'ch-10-mr-7',
          name: 'फूटप्रिंट्स',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ७',
          syllabusTopics: ['डॉ. प्रदीप आवटे यांची पर्यावरणवादी विज्ञानकथा', 'सुमितचे ॲप — अभिषेक आणि रेखा मावशींच्या पावलांची तपासणी', 'कार्बन फूटप्रिंट्स (Carbon Footprints) आणि वृक्षलागवडीचे वैश्विक महत्त्व'],
          learningObjectives: ['पर्यावरण प्रदूषण रोखणे आणि स्वतःचा कार्बन फूटप्रिंट कमी करण्याची जाणीव'],
        },
        {
          id: 'ch-10-mr-8',
          name: 'ऊर्जाशक्तीचा जागर',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ८',
          syllabusTopics: ['डॉ. रघुनाथ माशेलकर यांचा आत्मकथात्मक पाठ', 'मुंबईतील गिरगावच्या फुटपाथवरील वाचन, आईने घेतलेले अपार कष्ट आणि गरिबीवर मात करून जागतिक कीर्तीचे वैज्ञानिक होणे'],
          learningObjectives: ['प्रतिकूल परिस्थितीवर मात करण्याची जिद्द आणि आईच्या संस्कारांचे मोल जाणणे'],
        },
        {
          id: 'ch-10-mr-9',
          name: 'खरे नागरिक',
          textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ९',
          syllabusTopics: ['सुहास बारटक्के यांची कथा', 'निरंजनने नागरिकशास्त्राच्या परीक्षेला जाताना रेल्वे रुळाला पडलेले भगदाड (घातपात) पाहणे', 'स्वतःच्या परीक्षेचा विचार न करता स्टेशन मास्तरांना कळवून शेकडो प्रवाशांचे प्राण वाचवणे'],
          learningObjectives: ['पुस्तकी ज्ञानापेक्षा प्रत्यक्ष संकटात दाखवलेले कर्तव्यपरायण नागरिकत्व श्रेष्ठ असते'],
        }
      ]
    },
    {
      id: 'cbse-10-english',
      name: 'English (First Flight & Footprints Without Feet)',
      category: 'English & Languages',
      curricula: ['NCERT First Flight Class 10', 'NCERT Footprints Without Feet Class 10', 'CBSE Class 10 English Language & Literature'],
      textbookName: 'NCERT First Flight & Footprints Without Feet',
      edition: '2025–2026 Academic Edition',
      subjectCode: '184',
      sourceAvailable: true,
      chapters: [
        {
          id: 'ch-10-eng-1',
          name: 'A Letter to God & Dust of Snow, Fire and Ice',
          textbookRef: 'NCERT First Flight — Chapter 1 & Poems',
          syllabusTopics: [
            'Lencho’s absolute faith in God destroyed by hailstorm',
            'Postmaster’s benevolence and 70 pesos collection',
            'Irony: Calling post office employees "a bunch of crooks"',
            'Robert Frost poems: Dust of Snow (nature’s healing power) & Fire and Ice (desire and hatred)'
          ],
          learningObjectives: [
            'Analyze dramatic irony and thematic contrast between faith and suspicion',
            'Interpret Frost’s symbolic use of hemlock tree, crow, fire, and ice'
          ],
          overviewSummary: 'Lencho is a hardworking farmer whose cornfield is ruined by a sudden hailstorm. With unwavering faith, he writes to God requesting 100 pesos. The kind postmaster pools 70 pesos, but Lencho suspects the postal workers stole the rest.',
          importantDefinitions: [
            'Irony: A situation where the outcome is opposite of what is expected.',
            'Metaphor: Comparing two unrelated things (e.g., hailstones as new silver coins).'
          ],
          keyConcepts: [
            'Unconditional faith vs human suspicion',
            'Subtle kindness in unsung civil servants',
            'Frostian symbolism of transformation through small moments'
          ],
          competencyQuestions: [
            'How does Lencho’s reaction upon counting the money reveal the limits of his understanding of human nature?',
            'Compare the destructive potential of "Fire" (passion) and "Ice" (cold hatred) in human civilizations.'
          ],
          caseBasedQuestions: [
            'Read the excerpt: "God," he wrote, "if you don\'t help me, my family and I will go hungry this year." Explain how the postmaster exemplifies true empathy.'
          ]
        },
        {
          id: 'ch-10-eng-2',
          name: 'Nelson Mandela: Long Walk to Freedom & A Tiger in the Zoo',
          textbookRef: 'NCERT First Flight — Chapter 2 & Poem',
          syllabusTopics: [
            'Inauguration ceremony at Union Buildings amphitheatre, Pretoria (10 May 1994)',
            'Extraordinary human disaster of Apartheid and victory of human dignity',
            'Twin obligations: To family and to country/community',
            'Mandela’s definition of courage: Not the absence of fear, but triumph over it',
            'Poem: Leslie Norris - A Tiger in the Zoo (vivid contrast of captivity vs natural wilderness)'
          ],
          learningObjectives: [
            'Comprehend the historical struggle against racial segregation and Apartheid in South Africa',
            'Examine Norris’s critique of human cruelty confining wild animals in concrete cages'
          ],
          overviewSummary: 'Nelson Mandela reflects on the historic oath-taking ceremony marking the end of Apartheid. He honors freedom fighters, elucidates that the oppressor is as much a prisoner as the oppressed, and redefines courage.',
          importantDefinitions: [
            'Apartheid: A political and social system of institutionalised racial discrimination.',
            'Emancipation: The fact or process of being set free from legal, social, or political restrictions.'
          ],
          keyConcepts: [
            'Freedom is indivisible; oppressor and oppressed both lack freedom',
            'True courage is triumph over fear, not lack of fear',
            'Captivity stifles majesty and instinct (Tiger in the Zoo)'
          ],
          competencyQuestions: [
            'What "twin obligations" does Mandela describe, and why could a Black South African not fulfill them under Apartheid?',
            'How does Leslie Norris employ sensory imagery to depict the tiger’s quiet rage?'
          ]
        },
        {
          id: 'ch-10-eng-3',
          name: 'Two Stories about Flying & How to Tell Wild Animals',
          textbookRef: 'NCERT First Flight — Chapter 3 & Poem',
          syllabusTopics: [
            'Part I: His First Flight (Liam O’Flaherty) - Young seagull overcoming fear of flight compelled by hunger',
            'Part II: Black Aeroplane (Frederick Forsyth) - Dakota pilot guided through black storm clouds by mysterious pilot',
            'Poem: Carolyn Wells - How to Tell Wild Animals (humorous guide to identifying jungle beasts)'
          ],
          learningObjectives: [
            'Understand psychological barriers of fear and necessity prompting courage',
            'Analyze mystery and open-ended narrative techniques in Forsyth’s story'
          ],
          overviewSummary: 'Two distinct perspectives on flight: a young seagull that takes its plunge out of extreme hunger, and a pilot lost inside monstrous storm clouds rescued by an enigmatic unmarked black aeroplane.',
          importantDefinitions: [
            'Parental motivation: Harsh love designed to force self-reliance.',
            'Open ending: A conclusion leaving interpretation to the reader.'
          ],
          competencyQuestions: [
            'Was the mysterious black aeroplane a supernatural intervention or a projection of the pilot’s own subconscious survival instinct?',
            'How does the young seagull’s mother use food as a strategic catalyst for his maiden flight?'
          ]
        },
        {
          id: 'ch-10-eng-4',
          name: 'From the Diary of Anne Frank & The Ball Poem',
          textbookRef: 'NCERT First Flight — Chapter 4 & Poem',
          syllabusTopics: [
            'Anne Frank’s need for a true friend; naming her diary "Kitty"',
            'Her bond with grandmother and affection for Montessori teachers',
            'Mr. Keesing’s math essays: "A Chatterbox", "An Incorrigible Chatterbox", "Quack, Quack, Quack"',
            'Poem: John Berryman - The Ball Poem (epistemology of loss and first lesson in growing up)'
          ],
          learningObjectives: [
            'Examine Anne Frank’s wit, perceptiveness, and emotional maturity under Nazi persecution',
            'Understand Berryman’s exploration of grief, material impermanence, and resilience'
          ],
          overviewSummary: 'Thirteen-year-old Anne Frank chronicles her school life and relationship with teachers in occupied Amsterdam, cleverly turning punishment essays into sparkling poetry. The Ball Poem reflects on a boy losing his beloved ball, confronting the harsh reality of loss.',
          importantDefinitions: [
            'Epistemology of Loss: Understanding what it means to lose something cherished and continuing to live.',
            'Chatterbox: A person who talks continuously.'
          ],
          competencyQuestions: [
            'Why did Anne Frank say "Paper has more patience than people"?',
            'In The Ball Poem, why does the poet refuse to offer money or a new ball to the boy?'
          ]
        },
        {
          id: 'ch-10-eng-5',
          name: 'Glimpses of India & The Trees',
          textbookRef: 'NCERT First Flight — Chapter 5 & Poem',
          syllabusTopics: [
            'Part I: A Baker from Goa (Lucio Rodrigues) - Pader tradition, bol, kabai, and nostalgic village life',
            'Part II: Coorg (Lokesh Abrol) - Coffee country, Kodavus, martial traditions, General Cariappa, Kaveri river',
            'Part III: Tea from Assam (Arup Kumar Datta) - Rajvir and Pranjol, legend of Bodhidharma, tea bushes of Dhekiabari',
            'Poem: Adrienne Rich - The Trees (feminist allegory of trees breaking free from interior confines into the forest)'
          ],
          learningObjectives: [
            'Appreciate the cultural, historical, and geographical diversity of Indian regions',
            'Deconstruct Adrienne Rich’s ecological and feminist metaphors of liberation'
          ],
          overviewSummary: 'A vivid travelogue across Portuguese-influenced Goa with its morning bread bakers, the misty rolling hills and valor of Coorg, and the emerald green tea gardens of Assam, paired with Adrienne Rich’s symbolic liberation of nature.',
          keyConcepts: [
            'Goan cultural heritage preserved in the culinary art of baking',
            'Kodava independence and brave heritage in Indian Army',
            'Assam’s economic lifelines and origins of tea culture',
            'Rich’s poem as an ode to women breaking societal barriers'
          ]
        },
        {
          id: 'ch-10-eng-6',
          name: 'Madam Rides the Bus & The Tale of Custard the Dragon',
          textbookRef: 'NCERT First Flight — Chapter 7 & Poem',
          syllabusTopics: [
            'Valli’s meticulous planning: saving 60 paise, calculating timings (1:00 PM to 2:45 PM)',
            'Her self-respect: refusing conductor’s free drink or patronizing help',
            'The tragic reality: Running cow earlier vibrant, now dead by roadside',
            'Poem: Ogden Nash - The Tale of Custard the Dragon (humorous ballad on real vs boastful bravery)'
          ],
          learningObjectives: [
            'Explore childhood innocence meeting the mature realities of life and mortality',
            'Analyze Ogden Nash’s whimsical rhyme scheme and satire on empty bragging'
          ],
          overviewSummary: 'Eight-year-old Valliammai (Valli) orchestrates her maiden bus journey to the nearby town with remarkable independence. The journey turns profound when she witnesses a dead cow, introducing her to mortality.',
          competencyQuestions: [
            'How did Valli demonstrate adult-like financial discipline and determination in planning her bus journey?',
            'What makes Custard the Dragon the true hero during the pirate attack despite being mocked as a coward?'
          ]
        },
        {
          id: 'ch-10-eng-7',
          name: 'The Sermon at Benares & The Proposal',
          textbookRef: 'NCERT First Flight — Chapters 8 & 9',
          syllabusTopics: [
            'Gautama Buddha’s enlightenment under Bodhi tree at Gaya; first sermon at Benares',
            'Kisa Gotami’s dead son and search for a handful of mustard seeds from a death-free house',
            'Universal truth: Death is common to all mortals like ripe fruit falling early',
            'The Proposal (Anton Chekhov): Farce set in 19th-century Russia; Lomov, Chubukov, and Natalya arguing over Oxen Meadows and dogs (Guess vs Squeezer)'
          ],
          learningObjectives: [
            'Internalize Buddhist philosophical teachings on overcoming grief and attachment',
            'Evaluate Chekhov’s satire of marriage of convenience among wealthy Russian gentry'
          ],
          overviewSummary: 'Gautama Buddha guides the grief-stricken Kisa Gotami to understand that life is fleeting and suffering is universal. In stark theatrical contrast, Chekhov’s one-act play humorously lampoons matrimonial negotiations dominated by pride and petty property feuds.',
          keyConcepts: [
            'Mortality as an inescapable cosmic law; inner peace comes through acceptance',
            'Chekhovian satire of economic marriages masquerading as romance'
          ]
        },
        {
          id: 'ch-10-eng-8',
          name: 'Footprints: A Triumph of Surgery & The Thief’s Story',
          textbookRef: 'NCERT Footprints Without Feet — Chapters 1 & 2',
          syllabusTopics: [
            'A Triumph of Surgery (James Herriot): Tricki the overfed pampered dog of Mrs. Pumphrey, cured by natural fasting and exercise',
            'The Thief’s Story (Ruskin Bond): Hari Singh (15-year-old thief) and Anil (generous struggling writer)',
            'Transformation through unconditional trust and literacy; return of the stolen 600 rupees'
          ],
          learningObjectives: [
            'Contrast well-meaning indulgent pampering with practical medical common sense',
            'Appreciate the power of trust and education in reforming a criminal heart'
          ],
          overviewSummary: 'Herriot treats Tricki not with surgical tools but with disciplined diet and canine socialization. In Bond’s masterclass, Hari Singh steals Anil’s money but chooses to return it because the prospect of becoming educated and respected outweighs instant illicit wealth.',
          competencyQuestions: [
            'Why does Hari Singh state that stealing from an unsuspecting, careless person like Anil takes all the pleasure out of the job?',
            'Critique Mrs. Pumphrey’s lifestyle choices for Tricki in terms of animal welfare.'
          ]
        },
        {
          id: 'ch-10-eng-9',
          name: 'Footprints: Footprints Without Feet & The Necklace',
          textbookRef: 'NCERT Footprints Without Feet — Chapters 5 & 7',
          syllabusTopics: [
            'Footprints Without Feet (H.G. Wells): Griffin the brilliant but lawless scientist discovering invisibility, Drury Lane burglary, and Iping village chaos',
            'The Necklace (Guy de Maupassant): Mathilde Loisel’s vanity, the borrowed diamond necklace from Mme Forestier, losing it at the ball, ten years of crushing debt, and the climactic reveal that it was fake paste worth 500 francs'
          ],
          learningObjectives: [
            'Analyze science divorced from ethics through Griffin’s lawless descent',
            'Examine how vanity, false pride, and silence led the Loisels into ruinous poverty'
          ],
          overviewSummary: 'Wells cautions against scientific breakthroughs weaponized without moral conscience. Maupassant tells the tragic twist-in-the-tail story of Mathilde Loisel whose yearning to seem rich costs her ten years of grueling poverty.',
          competencyQuestions: [
            'Griffin was a brilliant scientist but not a true gentleman or good citizen. Justify with textual evidence.',
            'Could Mathilde Loisel have saved herself and her husband ten years of suffering if she had spoken honestly to Mme Forestier?'
          ]
        },
        {
          id: 'ch-10-eng-10',
          name: 'Footprints: Bholi & The Book That Saved the Earth',
          textbookRef: 'NCERT Footprints Without Feet — Chapters 9 & 10',
          syllabusTopics: [
            'Bholi (K.A. Abbas): Sulekha’s neglect after childhood smallpox and brain injury; teacher’s transformative encouragement',
            'Bishamber Nath’s dowry demand of 5,000 rupees; Bholi’s courageous refusal and decision to teach in school',
            'The Book That Saved the Earth (Claire Boiko): 25th century Martian invasion led by Think-Tank thwarted by Mother Goose nursery rhymes interpreted literally'
          ],
          learningObjectives: [
            'Celebrate the empowerment of girl children through education against archaic dowry customs',
            'Enjoy science fiction satire highlighting the absurdity of pompous conquerors'
          ],
          overviewSummary: 'Bholi transforms from a neglected, stammering girl into an articulate, dignified woman who rejects a greedy groom to serve her parents and teach in her village school. Claire Boiko’s play shows how a silly book of nursery rhymes saved Earth from Martian invasion.',
          competencyQuestions: [
            'How did Bholi’s teacher play a pivotal role in rewriting her destiny and self-worth?',
            'What comical misunderstandings arose from Think-Tank’s literal reading of "Humpty Dumpty"?'
          ]
        }
      ]
    },
    {
      id: 'cbse-10-sanskrit',
      name: 'Sanskrit (शेमुषी द्वितीयो भागः)',
      category: 'Sanskrit',
      curricula: ['NCERT शेमुषी द्वितीयो भागः कक्षा १०', 'CBSE Class 10 Sanskrit Code 122', 'CBSE Board Curriculum'],
      textbookName: 'NCERT शेमुषी द्वितीयो भागः',
      edition: '2025–2026 Academic Edition',
      subjectCode: '122',
      sourceAvailable: true,
      chapters: [
        {
          id: 'ch-10-sk-1',
          name: 'प्रथमः पाठः — शुचिपर्यावरणम्',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ १ (हरिदत्त शर्मणः लसल्लतिकातः)',
          syllabusTopics: [
            'महानगरेषु अयन-जालं, धूमं मुञ्चति शतशकटीयानम्',
            'वायुमण्डलं भृशं दूषितं, कुत्सितवस्तुमिश्रितं भक्ष्यम्',
            'हरिततरूणां ललितलतानां माला रमणीया — प्रकृतिरेव शरणम्',
            'अन्वयः, सन्धि-विच्छेदः (प्रकृतिरेव = प्रकृतिः + एव, संचरणम् = सम् + चरणम्)'
          ],
          learningObjectives: [
            'महानगरीय-प्रदूषणस्य दुष्परिणामान् ज्ञात्वा पर्यावरणसंरक्षणस्य सङ्कल्पः',
            'श्लोकानां सस्वरवाचनम्, अन्वयलेखनं च'
          ],
          overviewSummary: 'अयम् पाठः आधुनिक-संस्कृत-कवेः प्रो. हरिदत्त-शर्मणः "लसल्लतिका" इति रचनासङ्ग्रहात् सङ्कलितोऽस्ति। अत्र महानगराणां यन्त्रबाहुल्येन प्रवर्धित-प्रदूषणस्योपरि चिन्ता व्यक्तास्ति। कविः शुद्धपर्यावरणाय प्रकृतेः शरणं गन्तुम् इच्छति।',
          importantDefinitions: [
            'कालायसचक्रम: लोहे का पहिया (Iron wheel / machinery)',
            'अनन्ताः: जिसका कोई अंत न हो (Endless)'
          ],
          keyConcepts: [
            'महानगरेषु जीवनं संचरणं च दुर्भरं जातम्',
            'शुद्धं पर्यावरणमेव अस्माकं जीवनस्य आधारः अस्ति'
          ]
        },
        {
          id: 'ch-10-sk-2',
          name: 'द्वितीयः पाठः — बुद्धिर्बलवती सदा',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ २ (शुकसप्तति ग्रन्थतः)',
          syllabusTopics: [
            'बुद्धिमती स्वपुत्रद्वयेन सह पितुर्गृहं प्रति चलिता',
            'व्याघ्रं दृष्ट्वा धार्ष्ट्यात् पुत्रौ चपेटया प्रहृत्य व्याघ्रभक्षणाय कलहप्रदर्शनम्',
            'व्याघ्रस्य भयम — "इयं व्याघ्रमारी काचिदिति मत्वा पलायितः"',
            'जम्बुक-व्याघ्रयोः संवादः, गले बद्ध्वा पुनरागमनं, बुद्धिमत्याः प्रत्युत्पन्नमतित्वात् रक्षा'
          ],
          learningObjectives: [
            'सङ्कटकाले बुद्धेः धैर्यस्य च प्राधान्यम् अवबोधनम्',
            'कथायाः माध्यमेन प्रत्युत्पन्नमतित्वस्य विकासः'
          ],
          overviewSummary: 'प्रस्तुतोऽयं पाठः "शुकसप्ततिः" इति कथाग्रन्थात् सम्पादितः। अत्र दर्शितं यत् सङ्कटकाले धैर्यं बुद्धिं च अवलम्ब्य मनुष्यः महतः महासङ्कटात् अपि मुक्तो भवति। बुद्धिमती नाम स्त्री स्वबुद्ध्या व्याघ्रं पलायितुं विवशं करोति।',
          keyConcepts: [
            'बुद्धिर्यस्य बलं तस्य',
            'प्रत्युत्पन्नमतित्वेन विषमपरिस्थितावपि विजयः सम्भवः'
          ]
        },
        {
          id: 'ch-10-sk-3',
          name: 'तृतीयः पाठः — शिशुलालनम्',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ३ (कुन्दमाला नाटकात्)',
          syllabusTopics: [
            'रामस्य राजसभायां लव-कुशयोः आगमनम्',
            'रामेण कुश-लवयोः सिंहासने उपवेशनाय आग्रहः',
            'लवकुशयोः विनम्रोक्तिः: "अतिसौजन्यम्"',
            'बालभावात् हिमकरोऽपि पशुपतिमस्तककेतकीच्छदत्वम्'
          ],
          learningObjectives: [
            'संस्कृतनाटकानां सम्भाषणशैलीम् अवगच्छेयुः',
            'पितृपुत्रयोः वात्सल्यभावस्य च आदरस्य च दर्शनम्'
          ],
          overviewSummary: 'अयम् पाठः दिङ्नाग-रचितस्य "कुन्दमाला" इति नाटकस्य पञ्चमाङ्कात् सम्पादितः। अत्र श्रीरामः स्वपुत्रौ लवं कुशं च सिंहासने उपवेशयितुं इच्छति, परं तौ विनयेन अस्वीकुरुतः। श्रीरामेण तयोः सौन्दर्यं दृष्ट्वा वात्सल्यं प्रकटीक्रियते।'
        },
        {
          id: 'ch-10-sk-4',
          name: 'चतुर्थः पाठः — जननी तुल्यवत्सला',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ४ (महाभारतस्य वनपर्वणः)',
          syllabusTopics: [
            'कश्चित् कृषकः बलीवर्दाभ्यां क्षेत्रकर्षणं कुर्वन्नासीत्',
            'एकः बलीवर्दः दुर्बलः भूमौ पपात; सुरभेः (कामधेनोः) नेत्राभ्याम् अश्रूणि आविर्भूतानि',
            'इन्द्रेण पृष्टे सति सुरभेः उत्तरम्: दुर्बले सुते मातुः अभ्यधिका कृपा भवति',
            'सर्वेष्वपत्येषु जननी तुल्यवत्सला, किन्तु दीने पुत्रे विशेषकृपा'
          ],
          learningObjectives: [
            'मातृस्नेहस्य सार्वभौमिकतां दुर्बलानां प्रति सहानुभूतिभावं च ज्ञास्यन्ति',
            'महाभारतस्य आदर्शकथायाः नैतिकमूल्यग्रहणम्'
          ],
          overviewSummary: 'महाभारतस्य वनपर्वणः इयं कथा। अत्र सुरभी-इन्द्रयोः संवादमाध्यमेन प्रतिपादितं यत् मातुः स्नेहाः सर्वेष्वपत्येषु समानो भवति, तथापि दुर्बले दीने च पुत्रे मातुः सहजैव अधिकः स्नेहः जायते।'
        },
        {
          id: 'ch-10-sk-5',
          name: 'पञ्चमः पाठः — सुभाषितानि',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ५ (नीतिग्रन्थेभ्यः सङ्ग्रहः)',
          syllabusTopics: [
            'आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः',
            'गुणी गुणं वेत्ति न वेत्ति निर्गुणः, बली बलं वेत्ति न वेत्ति निर्बलः',
            'निमित्तमुद्दिश्य हि यः प्रकुप्यति ध्रुवं स तस्यापगमे प्रसीदति',
            'उदीरितोऽर्थः पशुनापि गृह्यते; हयाश्च नागाश्च वहन्ति बोधिताः',
            'विचित्रे खलु संसारे नास्ति किञ्चिन् निरर्थकम्; अश्वश्चेद् धावने वीरः भारस्य वहने खरः'
          ],
          learningObjectives: [
            'नीतिश्लोकानां सार्थकतां जीवनव्यवहारे प्रयोक्तुं शिक्षेरन्',
            'परिश्रमस्य विवेकस्य च महत्त्वं जानीयुः'
          ],
          overviewSummary: 'सुभाषितानि इति पद्यपाठे संस्कृतस्य विविधग्रन्थेभ्यः सुभाषितरत्नानि सङ्कलितानि सन्ति। एते श्लोकाः आलस्यत्यागस्य, गुणग्राहकतायाः, क्रोधत्यागस्य, बुद्धिचातुर्यस्य च शिक्षां प्रयच्छन्ति।'
        },
        {
          id: 'ch-10-sk-6',
          name: 'षष्ठः पाठः — सौहार्दं प्रकृतेः शोभा',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ६',
          syllabusTopics: [
            'वनस्य दृश्यम्: सिंहः विश्राम्यति, वानराः तस्य पुच्छं धुनन्ति',
            'पशुपक्षिणां मध्ये राजपदप्राप्तये कलहः: काकः, पिकः, मयूरः, बकः, वानरः',
            'प्रकृतिमातुः साक्षात् आगमनम्: सर्वेषां परस्परं महत्त्वमस्ति',
            'एकतायाः सन्देशः: "परस्परं विवदमानाः आत्मविनाशं कुर्वन्ति"'
          ],
          learningObjectives: [
            'सर्वेषां प्राणिनां परस्परनिर्भरतां जैवविविधतायाः महत्त्वं च अवगच्छेयुः',
            'अहङ्कारत्यागस्य पर्यावरणसौहार्दस्य च प्रेरणा'
          ],
          overviewSummary: 'अस्मिन् नाटकांशे दर्शितं यत् वने सर्वे पशुपक्षिणः आत्मानं श्रेष्ठं मत्वा परस्परं विवदन्ते। अन्ते प्रकृतिमाता आगम्य शिक्षयति यत् सर्वेषां समयानुकूलं महत्त्वमस्ति, सर्वे प्राणिनां परस्परस्नेह एव प्रकृतेः वास्तविकं सौन्दर्यम्।'
        },
        {
          id: 'ch-10-sk-7',
          name: 'सप्तमः पाठः — विचित्रः साक्षी',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ७ (न्यायाधीशबंकिमचन्द्रचटर्जीकथा)',
          syllabusTopics: [
            'निर्धनजनस्य स्वपुत्रं द्रष्टुं पदातिरेव गमनम्',
            'रात्रौ कस्मिंश्चित् गृहे आश्रयः, चौरस्य गृहाभ्यन्तरप्रवेशः, मञ्जूषाहरणम्',
            'ग्रामारक्षिणा एव निर्दोषस्य अतिथेः चौर इति कृत्वा कारागारे प्रक्षेपः',
            'न्यायाधीशेन बंकिमचन्द्रेण शवं साक्षिणं कृत्वा सत्योद्घाटनम्'
          ],
          learningObjectives: [
            'न्यायाधीशस्य विवेकचातुर्येण सत्यस्य विजयः कथमभूत् इति ज्ञातव्यम्',
            'न्यायिकप्रक्रियायां युक्तेः महत्त्वम्'
          ],
          overviewSummary: 'अयम् पाठः प्रसिद्ध-वङ्गसाहित्यकारस्य बंकिमचन्द्र-चटर्जी-महोदयस्य न्यायप्रणालीविषयक-कथायाः अनुवादोऽस्ति। अत्र न्यायाधीशेन् एकेन शवेन सह नाटकमिव रचयित्वा वास्तविकं चौरम् आरक्षिणं दण्डितं कृतम्।'
        },
        {
          id: 'ch-10-sk-8',
          name: 'अष्टमः पाठः — सूक्तयः',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ८ (तिरुक्कुरल् ग्रन्थात्)',
          syllabusTopics: [
            'पिता यच्छति पुत्राय बाल्ये विद्याधनं महत्; पितास्य किं तपस्तेपे इत्युक्तिस्तत्कृतज्ञता',
            'अवक्रता यथा चित्ते तथा वाचि भवेद् यदि',
            'त्यक्त्वा धर्मप्रदां वाचं परुषां योऽभ्युदीरयेत्; परित्यज्य फलं पक्वं भुङ्क्तेऽपक्वं विमूढधीः',
            'विद्वांस एव लोकेऽस्मिन् चक्षुष्मन्तः प्रकीर्तिताः; अन्येषां वदने ये तु ते चक्षुर्नामनी मते'
          ],
          learningObjectives: [
            'तमिलभाषायाः प्रसिद्धनीतिग्रन्थस्य "तिरुक्कुरल्" इत्यस्य सूक्तीनां संस्कृतरूपम् अवगच्छेयुः',
            'विद्या, सत्यवाणि, कृतज्ञतादिगुणानाम् अभ्यासः'
          ],
          overviewSummary: 'प्रस्तुतोऽयं पाठः तमिलभाषायाः नीतिग्रन्थात् "तिरुक्कुरल्" इत्यस्मात् उद्धृतः। अत्र पितुः कृतज्ञता, सरलता, मधुरवाणी, विद्वत्ता च इत्यादिगुणानां वर्णनं वर्तते।'
        },
        {
          id: 'ch-10-sk-9',
          name: 'नवमः पाठः — भूकम्पविभीषिका & दशमः पाठः — प्राणेभ्योऽपि प्रियः सुहृद्',
          textbookRef: 'NCERT शेमुषी भाग २ — पाठ ९ व १०',
          syllabusTopics: [
            '२००१ ख्रिस्ताब्दे गुजरातराज्यस्य कच्छमण्डले जातस्य भीषणभूकम्पस्य विदारकचित्राणि',
            'प्रकृतेः प्रकोपात् त्राणाय भवननिर्माणनियमानां पालनम्, वृक्षारोपणम्',
            'विशाखदत्तस्य मुद्राराक्षसनाटकात् चन्दनदासस्य चाणक्येन सह संवादः',
            'सुहृदर्थे स्वप्राणानामपि समर्पणम्: प्राणेभ्योऽपि प्रियः सुहृद्'
          ],
          learningObjectives: [
            'आपत्प्रबन्धने भूकम्पसम्बद्धसावधानतान् जानीयुः',
            'मित्रतायाः निष्ठां चन्दनदासस्य उदाहरणेन आचरेयुः'
          ],
          overviewSummary: 'भूकम्पविभीषिका पाठे २००१ तमे वर्षे कच्छभूकम्पस्य विनाशलीलां वर्णिता तथा च भूकम्पात् रक्षायाः उपायाः दर्शिताः। दशमे पाठे मित्रस्य अमात्यराक्षसस्य रक्षार्थं स्वप्राणान् अपि तृणाय मन्वानस्य चन्दनदासस्य आदर्शमैत्री निरूपिता।'
        }
      ]
    }
  ]
};

