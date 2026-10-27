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
    }
  ]
};
