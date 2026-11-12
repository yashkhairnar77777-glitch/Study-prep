import { SyllabusClassInfo } from './types';

export const cbseClass9: SyllabusClassInfo = {
  id: 'cbse-class-9',
  name: 'Class 9 (Secondary)',
  gradeEquivalent: 'Class 9-10 (Secondary)',
  subjects: [
    {
      id: 'cbse-9-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 9', 'NCERT Exemplar Class 9'],
      chapters: [
        {
          id: 'ch-9-m-1',
          name: 'Number Systems',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 1',
          syllabusTopics: ['Real numbers: rational and irrational numbers on the real line', 'Decimal expansions: terminating, non-terminating recurring (rational $p/q$) vs non-terminating non-recurring (irrational)', 'Representing $\\sqrt{x}$ geometrically on number line using spiral of Theodorus', 'Rationalisation of surds with binomial denominators', 'Laws of real exponents with positive real bases'],
          learningObjectives: ['Classify decimal numbers as rational or irrational', 'Rationalise complex denominators and simplify radical expressions'],
          coreFormulas: ['\\frac{1}{\\sqrt{a} \\pm \\sqrt{b}} = \\frac{\\sqrt{a} \\mp \\sqrt{b}}{a - b}', 'a^{p/q} = \\sqrt[q]{a^p}']
        },
        {
          id: 'ch-9-m-2',
          name: 'Polynomials',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 2',
          syllabusTopics: ['Definition of polynomial in one variable, coefficients, degree (linear, quadratic, cubic)', 'Zeroes of a polynomial', 'Remainder Theorem and Factor Theorem: $(x - a)$ is a factor of $P(x)$ if $P(a) = 0$', 'Factorisation of quadratic trinomials and cubic polynomials using rational root theorem', 'Algebraic identities: $(x+y+z)^2, (x \\pm y)^3, x^3 + y^3 + z^3 - 3xyz$'],
          learningObjectives: ['Apply Factor Theorem to factorize cubic polynomials completely', 'Utilize polynomial algebraic identities for expansion and factoring'],
          coreFormulas: [
            '(x+y+z)^2 = x^2+y^2+z^2+2xy+2yz+2zx',
            'x^3+y^3+z^3 - 3xyz = (x+y+z)(x^2+y^2+z^2-xy-yz-zx)'
          ]
        },
        {
          id: 'ch-9-m-3',
          name: 'Coordinate Geometry',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 3',
          syllabusTopics: ['Cartesian plane, coordinate axes (x-axis, y-axis), origin $(0, 0)$', 'Abscissa (x-coordinate) and Ordinate (y-coordinate)', 'Signs of coordinates in the four quadrants', 'Plotting ordered pairs $(x, y)$ on Cartesian grid'],
          learningObjectives: ['Identify coordinates and quadrants for given geometric points', 'Plot given data points on Cartesian coordinate plane with correct scale'],
          coreFormulas: ['\\text{Origin} = (0, 0)', 'Q_1: (+,+), \\quad Q_2: (-,+), \\quad Q_3: (-,-), \\quad Q_4: (+,-)']
        },
        {
          id: 'ch-9-m-4',
          name: 'Linear Equations in Two Variables',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 4',
          syllabusTopics: ['Standard form of linear equation: $ax + by + c = 0$ ($a, b \\ne 0$)', 'Infinitely many solutions of a linear equation in two variables', 'Graph of a linear equation in two variables as a straight line', 'Equations of lines parallel to coordinate axes ($x = a, y = b$)'],
          learningObjectives: ['Find ordered pair solutions satisfying linear equations', 'Graph straight lines from linear equations on Cartesian plane'],
          coreFormulas: ['ax + by + c = 0']
        },
        {
          id: 'ch-9-m-5',
          name: 'Introduction to Euclid’s Geometry',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 5',
          syllabusTopics: ['Euclid’s definitions of point, line, surface', 'Axioms and Postulates (self-evident mathematical truths)', 'Euclid’s five postulates, focus on the Fifth Postulate (parallel postulate)', 'Equivalent versions of Euclid’s Fifth Postulate (Playfair’s Axiom)'],
          learningObjectives: ['Distinguish between mathematical axioms, postulates, and theorems', 'Explain Playfair’s equivalent axiom for parallel lines']
        },
        {
          id: 'ch-9-m-6',
          name: 'Lines and Angles',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 6',
          syllabusTopics: ['Linear pair axiom and vertically opposite angles theorem', 'Parallel lines and transversal theorems: alternate interior angles, corresponding angles, interior angles on same side sum to 180°', 'Lines parallel to the same line are parallel to each other', 'Angle sum property of a triangle: $\\angle A + \\angle B + \\angle C = 180^\\circ$ and exterior angle theorem'],
          learningObjectives: ['Construct formal deductive proofs using parallel transversal theorems', 'Solve multi-angle computational problems in complex intersecting figures']
        },
        {
          id: 'ch-9-m-7',
          name: 'Triangles',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 7',
          syllabusTopics: ['Congruence criteria of triangles: SAS, ASA, AAS, SSS, and RHS', 'Isosceles triangle theorems: angles opposite to equal sides are equal, and converse', 'Inequalities in a triangle: side opposite to larger angle is longer, sum of two sides > third side'],
          learningObjectives: ['Formulate rigorous two-column geometric proofs of triangle congruence', 'Apply triangle inequality constraints in spatial deduction']
        },
        {
          id: 'ch-9-m-8',
          name: 'Quadrilaterals',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 8',
          syllabusTopics: ['Properties of a parallelogram: opposite sides equal, opposite angles equal, diagonals bisect each other', 'Sufficient conditions for a quadrilateral to be a parallelogram', 'The Mid-Point Theorem: segment joining midpoints of two sides of a triangle is parallel to third side and half its length', 'Converse of Mid-Point Theorem'],
          learningObjectives: ['Prove and apply Mid-Point Theorem in geometric configurations', 'Distinguish necessary and sufficient criteria for parallelograms, rhombuses, and rectangles'],
          coreFormulas: ['DE \\parallel BC \\quad \\text{and} \\quad DE = \\frac{1}{2} BC \\text{ (Mid-point Theorem)}']
        },
        {
          id: 'ch-9-m-9',
          name: 'Circles',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 9',
          syllabusTopics: ['Equal chords of a circle subtend equal angles at the center and are equidistant from center', 'Perpendicular from center of a circle to a chord bisects the chord', 'Angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining part of circle', 'Angles in the same segment of a circle are equal; angle in a semicircle is a right angle (90°)', 'Cyclic quadrilaterals: opposite angles sum to 180°'],
          learningObjectives: ['Prove circle theorems relating central angles, chords, and cyclic quadrilaterals', 'Solve cyclic quadrilateral angle computational challenges'],
          coreFormulas: ['\\angle AOB = 2\\angle APB', '\\angle A + \\angle C = 180^\\circ \\text{ (Cyclic Quadrilateral)}']
        },
        {
          id: 'ch-9-m-10',
          name: 'Heron’s Formula',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 10',
          syllabusTopics: ['Semi-perimeter formula: $s = (a + b + c) / 2$', 'Area of a triangle using Heron’s formula: $\\sqrt{s(s-a)(s-b)(s-c)}$', 'Applications of Heron’s formula in finding areas of quadrilaterals, triangular parks, and tiles'],
          learningObjectives: ['Compute area of scalene triangles when altitudes are not given', 'Decompose irregular polygons into triangles to find total land area'],
          coreFormulas: ['s = \\frac{a+b+c}{2}', '\\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)}']
        },
        {
          id: 'ch-9-m-11',
          name: 'Surface Areas and Volumes',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 11',
          syllabusTopics: ['Surface area and volume of right circular cones: slant height $l = \\sqrt{r^2+h^2}$, $CSA = \\pi rl$, $TSA = \\pi r(l+r)$, $V = \\frac{1}{3}\\pi r^2 h$', 'Surface area and volume of spheres ($4\\pi r^2$, $\\frac{4}{3}\\pi r^3$) and hemispheres ($CSA = 2\\pi r^2, TSA = 3\\pi r^2, V = \\frac{2}{3}\\pi r^3$)', 'Real-world problems on conical tents, canvas requirements, metal domes, and liquid storage'],
          learningObjectives: ['Compute lateral and total surface area of cones, spheres, and hemispheres', 'Solve practical engineering problems involving volumetric capacities of storage silos'],
          coreFormulas: [
            'l = \\sqrt{r^2 + h^2}',
            'CSA_{\\text{cone}} = \\pi rl',
            'V_{\\text{cone}} = \\frac{1}{3}\\pi r^2 h',
            'A_{\\text{sphere}} = 4\\pi r^2',
            'V_{\\text{sphere}} = \\frac{4}{3}\\pi r^3'
          ]
        },
        {
          id: 'ch-9-m-12',
          name: 'Statistics',
          textbookRef: 'NCERT Mathematics Class 9 — Chapter 12',
          syllabusTopics: ['Graphical representation of continuous data: Bar graphs and Histograms of uniform and varying interval widths', 'Frequency polygons drawn with and without histograms', 'Calculating and using class marks: $\\frac{\\text{Upper Limit} + \\text{Lower Limit}}{2}$'],
          learningObjectives: ['Construct histograms with adjusted frequency densities for varying class widths', 'Plot frequency polygons accurately on graph paper'],
          coreFormulas: ['\\text{Class Mark} = \\frac{\\text{Upper limit} + \\text{Lower limit}}{2}']
        }
      ]
    },
    {
      id: 'cbse-9-science',
      name: 'Science',
      category: 'General Science',
      curricula: ['NCERT Science Class 9', 'NCERT Exemplar Class 9'],
      chapters: [
        {
          id: 'ch-9-s-1',
          name: 'Matter in Our Surroundings',
          textbookRef: 'NCERT Science Class 9 — Chapter 1',
          syllabusTopics: ['Particulate nature of matter, Brownian motion and diffusion', 'Characteristics of states of matter: Solid, Liquid, Gas', 'Change of state: melting point, boiling point, latent heat of fusion and vaporisation', 'Sublimation (camphor, $NH_4Cl$) and deposition', 'Evaporation factors and evaporative cooling phenomena'],
          learningObjectives: ['Explain phase transitions at the molecular kinetic level', 'Calculate temperature conversions between Celsius and Kelvin'],
          coreFormulas: ['K = ^\\circ\\text{C} + 273.15']
        },
        {
          id: 'ch-9-s-2',
          name: 'Is Matter Around Us Pure',
          textbookRef: 'NCERT Science Class 9 — Chapter 2',
          syllabusTopics: ['Mixtures: Homogeneous (solutions) vs Heterogeneous (suspensions, colloids)', 'Concentration of solution: Mass % and Volume %', 'Colloidal properties: Tyndall effect, Brownian movement, dispersed phase and medium', 'Physical vs Chemical changes; Elements and Compounds'],
          learningObjectives: ['Calculate mass percentage concentration of chemical solutions', 'Distinguish true solutions, colloids, and suspensions by optical and filtration criteria'],
          coreFormulas: ['\\text{Mass \\%} = \\frac{\\text{Mass of Solute}}{\\text{Mass of Solution}} \\times 100']
        },
        {
          id: 'ch-9-s-3',
          name: 'Atoms and Molecules',
          textbookRef: 'NCERT Science Class 9 — Chapter 3',
          syllabusTopics: ['Laws of chemical combination: Law of Conservation of Mass (Lavoisier) and Law of Definite Proportions (Proust)', 'Dalton’s atomic theory postulates', 'Atomic mass unit (unified mass u, 1/12th of C-12 atom)', 'Molecules, polyatomic ions, and writing chemical formulas using criss-cross valency method', 'Molecular mass and formula unit mass calculations'],
          learningObjectives: ['Derive correct chemical formulas for ionic and covalent compounds', 'Calculate molecular mass from constituent relative atomic masses'],
          coreFormulas: ['\\text{Molecular Mass of } \\text{H}_2\\text{O} = 2(1) + 16 = 18\\text{ u}']
        },
        {
          id: 'ch-9-s-4',
          name: 'Structure of the Atom',
          textbookRef: 'NCERT Science Class 9 — Chapter 4',
          syllabusTopics: ['Subatomic particles: Electron ($e^-$), Proton ($p^+$), Neutron ($n$)', 'Thomson’s Plum Pudding model and Rutherford’s $\\alpha$-particle scattering nuclear model', 'Bohr’s Model of the Atom: discrete stable orbits (K, L, M, N shells)', 'Electronic configuration ($2n^2$ rule, octet rule)', 'Atomic number ($Z$), Mass number ($A$), Valence electrons and Valency', 'Isotopes ($^{12}_6\\text{C}, ^{14}_6\\text{C}$) and Isobars ($^{40}_{20}\\text{Ca}, ^{40}_{18}\\text{Ar}$)'],
          learningObjectives: ['Determine electron distributions in K, L, M shells for elements $Z=1$ to $20$', 'Explain fractional atomic masses from natural isotopic abundance percentages'],
          coreFormulas: ['\\text{Max Electrons in Shell: } 2n^2', 'A = Z + n']
        },
        {
          id: 'ch-9-s-5',
          name: 'The Fundamental Unit of Life',
          textbookRef: 'NCERT Science Class 9 — Chapter 5',
          syllabusTopics: ['Discovery of cell: Hooke, Leeuwenhoek, Schleiden & Schwann (Cell Theory), Virchow', 'Plasma membrane: Fluid mosaic lipid bilayer, diffusion, osmosis (hypertonic, hypotonic, isotonic tonicities)', 'Cell wall (cellulose, plasmolysis in plant cells)', 'Nucleus: Nuclear membrane, chromatin, chromosomes with DNA and histone proteins; Prokaryotes vs Eukaryotes', 'Organelles: ER (RER/SER), Golgi apparatus, Lysosomes (suicide bags), Mitochondria (ATP synthesis), Plastids (chloroplasts), Vacuoles'],
          learningObjectives: ['Predict cellular osmotic behavior in varied solution concentrations', 'Correlate organelle ultrastructure with biochemical metabolic functions']
        },
        {
          id: 'ch-9-s-6',
          name: 'Tissues',
          textbookRef: 'NCERT Science Class 9 — Chapter 6',
          syllabusTopics: ['Plant tissues: Meristematic (apical, intercalary, lateral/cambium) vs Permanent tissues', 'Simple permanent tissues: Parenchyma (chlorenchyma, aerenchyma), Collenchyma (flexibility), Sclerenchyma (lignin, coconut husk)', 'Complex permanent vascular tissues: Xylem (tracheids, vessels, xylem parenchyma/fibres) and Phloem (sieve tubes, companion cells, phloem fibres/parenchyma)', 'Animal tissues: Epithelial, Connective (blood, bone, ligament, tendon, cartilage, areolar, adipose), Muscular (striated, smooth, cardiac), Nervous tissue (neuron structure)'],
          learningObjectives: ['Compare xylem and phloem transport conduits in plant physiology', 'Differentiate striated, smooth, and cardiac muscles based on striations and voluntary control']
        },
        {
          id: 'ch-9-s-7',
          name: 'Motion',
          textbookRef: 'NCERT Science Class 9 — Chapter 7',
          syllabusTopics: ['Distance vs Displacement (scalar vs vector)', 'Uniform vs non-uniform motion, speed vs velocity, acceleration ($a = (v-u)/t$)', 'Distance-time and velocity-time graphs (slope of s-t graph = speed; slope of v-t graph = acceleration; area under v-t graph = displacement)', 'Graphical derivation of three equations of motion: $v = u + at$, $s = ut + \\frac{1}{2}at^2$, $v^2 - u^2 = 2as$', 'Uniform circular motion: centripetal acceleration and speed $v = 2\\pi r / t$'],
          learningObjectives: ['Derive all 3 kinematic equations of motion graphically', 'Solve multi-step acceleration and braking numericals'],
          coreFormulas: [
            'v = u + at',
            's = ut + \\frac{1}{2}at^2',
            'v^2 - u^2 = 2as',
            'v_{\\text{circular}} = \\frac{2\\pi r}{t}'
          ]
        },
        {
          id: 'ch-9-s-8',
          name: 'Force and Laws of Motion',
          textbookRef: 'NCERT Science Class 9 — Chapter 8',
          syllabusTopics: ['Balanced and unbalanced forces, Galileo’s inclined plane experiment', 'Newton’s First Law of Motion: Inertia and mass (inertia of rest, motion, direction)', 'Linear momentum ($p = mv$) and Newton’s Second Law: $F = ma$ derivation', 'Newton’s Third Law of Motion: Action-Reaction equal and opposite pairs acting on different bodies', 'Law of Conservation of Linear Momentum: $m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$; Gun recoil velocity and rocket propulsion'],
          learningObjectives: ['Derive force $F = ma$ from rate of change of momentum', 'Apply momentum conservation to solve collision and ballistics problems'],
          coreFormulas: [
            'p = mv',
            'F = ma = \\frac{m(v - u)}{t}',
            'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2'
          ]
        },
        {
          id: 'ch-9-s-9',
          name: 'Gravitation',
          textbookRef: 'NCERT Science Class 9 — Chapter 9',
          syllabusTopics: ['Universal Law of Gravitation: $F = G \\frac{m_1 m_2}{r^2}$, $G = 6.673 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$', 'Acceleration due to gravity: $g = GM/R^2 \\approx 9.8\\text{ m/s}^2$, variation of g at poles vs equator', 'Free fall kinematics equations under gravity', 'Mass vs Weight ($W = mg$), weight of an object on the Moon ($W_{\\text{moon}} = \\frac{1}{6} W_{\\text{earth}}$)', 'Thrust and Pressure, Buoyancy, Archimedes’ Principle and Relative Density'],
          learningObjectives: ['Calculate gravitational force between planetary bodies', 'Apply Archimedes’ principle to floating ships, submarines, and hydrometers'],
          coreFormulas: [
            'F = G\\frac{M m}{d^2}',
            'g = \\frac{GM}{R^2} \\approx 9.8\\text{ m/s}^2',
            'W = mg',
            '\\text{RD} = \\frac{\\rho_{\\text{substance}}}{\\rho_{\\text{water}}}'
          ]
        },
        {
          id: 'ch-9-s-10',
          name: 'Work and Energy',
          textbookRef: 'NCERT Science Class 9 — Chapter 10',
          syllabusTopics: ['Work done: $W = F \\cdot s \\cos\\theta$, Joule as SI unit of work', 'Kinetic energy derivation: $E_k = \\frac{1}{2}mv^2$', 'Gravitational potential energy derivation: $E_p = mgh$', 'Law of Conservation of Mechanical Energy: $E_k + E_p = \\text{constant}$ in free fall', 'Power as rate of work done ($P = W / t$, Watt), commercial unit of energy: $1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}$'],
          learningObjectives: ['Derive kinetic and potential energy formulas from first principles', 'Compute electrical energy consumption in kilowatt-hours (units) for home billing'],
          coreFormulas: [
            'W = F \\times s',
            'E_k = \\frac{1}{2}mv^2',
            'E_p = mgh',
            'P = \\frac{W}{t}',
            '1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}'
          ]
        },
        {
          id: 'ch-9-s-11',
          name: 'Sound',
          textbookRef: 'NCERT Science Class 9 — Chapter 11',
          syllabusTopics: ['Mechanical wave propagation: Compressions and Rarefactions in medium', 'Longitudinal waves vs Transverse waves', 'Wave parameters: Wavelength ($\\lambda$), Frequency ($\\nu$), Time period ($T$), Amplitude, Wave speed ($v = \\nu \\lambda$)', 'Speed of sound in solids > liquids > gases ($344\\text{ m/s}$ in air at 20°C)', 'Reflection of sound: Echo (minimum distance $17.2\\text{ m}$ in air), Reverberation', 'Ultrasound applications: SONAR ($2d = v \\times t$), echocardiography, flaw detection in metal forgings'],
          learningObjectives: ['Solve wave equations relating velocity, frequency, and wavelength', 'Calculate underwater depths and obstacle distances using SONAR principles'],
          coreFormulas: ['v = \\lambda \\nu = \\frac{\\lambda}{T}', '2d = v \\times t \\text{ (Echo / SONAR)}']
        },
        {
          id: 'ch-9-s-12',
          name: 'Improvement in Food Resources',
          textbookRef: 'NCERT Science Class 9 — Chapter 12',
          syllabusTopics: ['Crop variety improvement: hybridization, genetic modification for higher yield, biotic/abiotic resistance', 'Nutrient management: 16 essential plant nutrients, organic manure (compost/vermicompost) vs chemical fertilizers', 'Irrigation methods and cropping patterns: Mixed cropping, Intercropping, Crop rotation', 'Crop protection: Weeds (Xanthium, Parthenium), insect pests, fungal pathogens, storage grain losses', 'Animal husbandry: Cattle farming, Poultry farming, Fish production (capture vs culture; composite fish culture), Beekeeping (Apis mellifera Italian bee)'],
          learningObjectives: ['Design sustainable crop rotation and intercropping schemes', 'Evaluate composite fish culture combinations in aquaculture ponds']
        }
      ]
    },
    {
      id: 'cbse-9-japanese',
      name: 'Japanese (CBSE Subject Code 094 / NCERT Japanese Class 9)',
      category: 'Japanese',
      curricula: ['CBSE Class 9 Japanese Curriculum (Code 094)', 'NCERT / Japan Foundation Nihongo 9'],
      chapters: [
        {
          id: 'ch-9-jp-1',
          name: 'Chapter 1: じしょけい (Plain / Dictionary Form of Verbs)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 1',
          syllabusTopics: ['Formal vs casual speech in Japanese society', 'Conjugation of Group 1, Group 2, and Group 3 verbs into Dictionary Form (Jisho-kei)', 'Nominalization using koto: [Verb-Dictionary Form] koto (e.g. Taberu koto)', 'Stating capabilities: [Verb-Dictionary Form] koto ga dekimasu (I can do...)'],
          learningObjectives: ['Conjugate all verb groups into Plain Dictionary forms', 'Express skills, spoken languages, and capabilities using koto ga dekimasu'],
          coreFormulas: ['[\\text{Verb-Dictionary}] \\text{ koto ga dekimasu (Can do...)}']
        },
        {
          id: 'ch-9-jp-2',
          name: 'Chapter 2: ないけい (~ないでください - Negative Requests & Plain Negative)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 2',
          syllabusTopics: ['Conjugation of verbs into Nai-form (Group 1: -u -> -anai; Group 2: -ru -> -nai; Group 3: shinai, konai)', 'Polite negative requests: [Verb-nai] de kudasai (Please do not...)', 'Must do obligation: [Verb-nakereba narimasen] (Must...)', 'Need not do: [Verb-nakutemo ii desu] (Need not...)'],
          learningObjectives: ['Formulate polite negative instructions and regulations in Japanese', 'Express obligations and optionality accurately'],
          coreFormulas: ['[\\text{Verb-nai}] \\text{ de kudasai (Please do not...)}', '[\\text{Verb-nakereba}] \\text{ narimasen (Must do...)}']
        },
        {
          id: 'ch-9-jp-3',
          name: 'Chapter 3: のうりょく と しゅみ (Expressing Ability & Free Time Hobbies)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 3',
          syllabusTopics: ['Potential skills: Kanji o yomu koto ga dekimasu, Piano o hiku koto ga dekimasu', 'Elaborating on hobbies: Watashi no shumi wa e o kaku koto desu', 'Temporal marker mae ni: [Verb-Dictionary Form] mae ni, [Action] (Before doing X, Y)'],
          learningObjectives: ['Describe personal talents and artistic capabilities in detail', 'Express chronological action sequences using mae ni'],
          coreFormulas: ['[\\text{Verb-Dictionary}] \\text{ mae ni, } [\\text{Action}]']
        },
        {
          id: 'ch-9-jp-4',
          name: 'Chapter 4: ひかく (~より・~のほうが・いちばん - Comparisons & Superlatives)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 4',
          syllabusTopics: ['Comparing two items: [A] wa [B] yori [Adjective] desu', 'Asking preference between two: [A] to [B] to dochira ga [Adjective] desu ka? [A] no hou ga [Adjective] desu', 'Superlatives among a group: [Category] no naka de [Item] ga ichiban [Adjective] desu', 'Comparing cities, transport modes, and school subjects'],
          learningObjectives: ['Evaluate and compare relative attributes in speech and essays', 'Formulate superlative judgements across multi-item categories'],
          coreFormulas: [
            '[A] \\text{ wa } [B] \\text{ yori } [\\text{Adj}] \\text{ desu}',
            '[\\text{Group}] \\text{ no naka de } [\\text{Item}] \\text{ ga ichiban } [\\text{Adj}] \\text{ desu}'
          ]
        },
        {
          id: 'ch-9-jp-5',
          name: 'Chapter 5: たけい と けいけん (~たことがあります - Past Experiences)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 5',
          syllabusTopics: ['Conjugation of verbs into Ta-form (same phonetic shifts as Te-form)', 'Expressing past life experiences: [Verb-ta] koto ga arimasu (Have ever done...)', 'Asking about experiences: Fuji-san ni nobotta koto ga arimasu ka?', 'Listing representative actions using tari: [Verb 1-tari], [Verb 2-tari] shimasu'],
          learningObjectives: ['Narrate travel memories, accomplishments, and unique experiences', 'List non-exhaustive representative activities using ~tari ~tari shimasu'],
          coreFormulas: [
            '[\\text{Verb-ta}] \\text{ koto ga arimasu (Have experienced...)}',
            '[\\text{V1-tari}], [\\text{V2-tari}] \\text{ shimasu}'
          ]
        },
        {
          id: 'ch-9-jp-6',
          name: 'Chapter 6: きぼう と よてい (~たいです / ~つもりです - Desires & Intentions)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 6',
          syllabusTopics: ['Expressing personal desire: [Verb-stem] tai desu (I want to do...)', 'Negative desire: [Verb-stem] takunai desu', 'Expressing intentions and future plans: [Verb-Dictionary Form] tsumori desu', 'Purpose of movement: [Place] e [Verb-stem] ni ikimasu (Go to [place] to do [action])'],
          learningObjectives: ['State future career ambitions and travel goals in Japanese', 'Formulate sentences explaining purpose of movement using particle ni'],
          coreFormulas: [
            '[\\text{Verb-stem}]\\text{-tai desu (Want to...)}',
            '[\\text{Verb-Dictionary}] \\text{ tsumori desu (Plan to...)}'
          ]
        },
        {
          id: 'ch-9-jp-7',
          name: 'Chapter 7: かんじ (CBSE Class 9 Official Kanji List)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 7',
          syllabusTopics: ['Official CBSE Class 9 prescribed Kanji (50 characters)', 'School and time Kanji: 校 (Kou), 先 (Sen), 生 (Sei), 学 (Gaku), 友 (Tomo), 達 (Dachi)', 'Time Kanji: 時 (Ji), 分 (Fun), 半 (Han), 今 (Ima), 毎 (Mai)', 'Compound words reading and sentence writing in Kanji without furigana'],
          learningObjectives: ['Read and write 50 CBSE Class 9 prescribed Kanji characters accurately', 'Deconstruct Kanji compounds and identify stroke radical components']
        },
        {
          id: 'ch-9-jp-8',
          name: 'Chapter 8: どっかい と かいわ (Reading Comprehension & Dialogue Practice)',
          textbookRef: 'CBSE Japanese Class 9 — Chapter 8',
          syllabusTopics: ['Reading passages on school exchange programs and homestays in Japan', 'Informal conversation dialogues between high school students', 'Writing short essays (Sakubun): My Summer Vacation, My Dream Career', 'CBSE examination unseen passage question answering format'],
          learningObjectives: ['Extract key factual information from intermediate Japanese reading passages', 'Write structured 200-character Japanese essays on personal themes']
        }
      ]
    },
    {
      id: 'cbse-9-social-science',
      name: 'Social Science (History, Civics, Geography, Economics)',
      category: 'History & Social Studies',
      curricula: ['NCERT India and the Contemporary World I', 'NCERT Contemporary India I', 'NCERT Democratic Politics I', 'NCERT Economics'],
      chapters: [
        {
          id: 'ch-9-soc-1',
          name: 'History: The French Revolution',
          textbookRef: 'NCERT India and the Contemporary World I — Chapter 1',
          syllabusTopics: ['French society in late 18th century: Three Estates, feudal privileges, tax burden on Third Estate', 'Subsistence crisis and rise of the middle class influenced by philosophers (Locke, Rousseau, Montesquieu)', 'Outbreak of Revolution: Storming of Bastille (14 July 1789), Tennis Court Oath, National Assembly', 'Declaration of the Rights of Man and of the Citizen; Reign of Terror under Robespierre and Jacobins', 'Abolition of slavery in French colonies, rise of Napoleon Bonaparte'],
          learningObjectives: ['Analyze the ideological, fiscal, and social causes of the 1789 French Revolution', 'Evaluate the enduring global legacy of liberty, equality, and fraternity']
        },
        {
          id: 'ch-9-soc-2',
          name: 'History: Socialism in Europe and the Russian Revolution',
          textbookRef: 'NCERT India and the Contemporary World I — Chapter 2',
          syllabusTopics: ['Liberals, Radicals, and Conservatives; Karl Marx and Friedrich Engels socialist critique of industrial capitalism', 'Autocratic Tsarist Russia under Nicholas II, 1905 Revolution and Bloody Sunday', 'First World War impact, February Revolution 1917 and fall of Tsarism', 'October Revolution 1917 led by Lenin and the Bolsheviks, April Theses', 'Civil War, Stalin’s collectivization of agriculture and Five-Year Plans'],
          learningObjectives: ['Trace the transition from Tsarist autocracy to Bolshevik socialist state', 'Critique the humanitarian and economic outcomes of Stalinist collectivization']
        },
        {
          id: 'ch-9-soc-3',
          name: 'History: Nazism and the Rise of Hitler',
          textbookRef: 'NCERT India and the Contemporary World I — Chapter 3',
          syllabusTopics: ['Birth of Weimar Republic and humiliating Treaty of Versailles (1919)', 'Hyperinflation (1923) and the Great Economic Depression of 1929', 'Hitler’s rise to power, Enabling Act (1933) dismantling democracy', 'Nazi racial ideology, anti-Semitism, Nuremberg Laws', 'The Holocaust, concentration camps, and Hitler’s totalitarian propaganda machine'],
          learningObjectives: ['Analyze political and economic fragility that enabled Nazi totalitarianism', 'Understand the historical lessons of the Holocaust and democratic vigilance']
        },
        {
          id: 'ch-9-soc-4',
          name: 'Geography: India — Size, Location & Physical Features',
          textbookRef: 'NCERT Contemporary India I — Chapters 1 & 2',
          syllabusTopics: [
            'Latitudinal (8° 4′ N to 37° 6′ N) and Longitudinal (68° 7′ E to 97° 25′ E) extent',
            'Standard Meridian of India (82° 30′ E passing through Mirzapur)',
            'Six physiographic divisions: The Himalayan Mountains (Himadri, Himachal, Shiwaliks), The Northern Plains (Bhabar, Terai, Bhangar, Khadar), The Peninsular Plateau (Malwa, Deccan), The Indian Desert, The Coastal Plains (Western/Eastern), The Islands (Lakshadweep, Andaman & Nicobar)'
          ],
          learningObjectives: ['Map the geographic coordinates and neighboring border states of India', 'Explain the plate tectonic collision formation of the Himalayas and Northern Plains']
        },
        {
          id: 'ch-9-soc-5',
          name: 'Geography: Drainage & River Systems',
          textbookRef: 'NCERT Contemporary India I — Chapter 3',
          syllabusTopics: ['Drainage basins and water divides', 'Himalayan River Systems: Indus, Ganga, Brahmaputra (perennial, gorges, meanders, deltas)', 'Peninsular River Systems: Narmada, Tapi (rift valleys, west-flowing into Arabian Sea); Godavari, Mahanadi, Krishna, Kaveri (east-flowing into Bay of Bengal)', 'Lakes of India (Wular freshwater, Sambhar salt lake, Chilika lagoon)', 'Economic role of rivers and river pollution abatement (National River Conservation Plan)'],
          learningObjectives: ['Compare Himalayan perennial drainage with Peninsular seasonal flow', 'Analyze environmental threats to riverine freshwater ecosystems']
        },
        {
          id: 'ch-9-soc-6',
          name: 'Geography: Climate & The Monsoon Mechanism',
          textbookRef: 'NCERT Contemporary India I — Chapter 4',
          syllabusTopics: ['Weather vs Climate; Six major climatic controls (Latitude, Altitude, Pressure/Winds, Distance from sea, Ocean currents, Relief)', 'Mechanism of Indian Monsoon: Differential heating of land and water, shift of ITCZ, Tibetan plateau heating, Jet streams, El Niño-Southern Oscillation (ENSO)', 'Four seasons: Cold weather season, Hot weather season, Advancing Monsoon (South-West monsoon), Retreating Monsoon (North-East monsoon)', 'Monsoon as a unifying cultural and agricultural bond in India'],
          learningObjectives: ['Explain the meteorology of the South-West Monsoon and ITCZ displacement', 'Evaluate the agricultural and economic impacts of El Niño anomalies on Indian farming']
        },
        {
          id: 'ch-9-soc-7',
          name: 'Civics: What is Democracy? Why Democracy?',
          textbookRef: 'NCERT Democratic Politics I — Chapter 1',
          syllabusTopics: ['Definition: Democracy as a form of government where rulers are elected by the people', 'Key features: Major decisions by elected leaders, Free and fair electoral contest, One person one vote one value, Rule of law and respect for rights', 'Arguments against democracy (instability, slow decision making, corruption) vs Arguments for democracy (accountable government, consultation, resolving conflicts, dignity of citizens)', 'Broader meaning of participatory democracy in daily life'],
          learningObjectives: ['Evaluate whether given regimes qualify as genuine democracies using core criteria', 'Defend democratic decision-making as superior to autocratic efficiency']
        },
        {
          id: 'ch-9-soc-8',
          name: 'Civics: Constitutional Design & Electoral Politics',
          textbookRef: 'NCERT Democratic Politics I — Chapters 2 & 3',
          syllabusTopics: ['Democratic constitution in South Africa: struggle against Apartheid led by Nelson Mandela', 'Why we need a Constitution; Making of the Indian Constitution by the Constituent Assembly', 'Guiding values in the Preamble: Sovereign, Socialist, Secular, Democratic, Republic, Justice, Liberty, Equality, Fraternity', 'Electoral competition: Voter list, election campaign, Model Code of Conduct, Electronic Voting Machines (EVMs), Independent Election Commission of India'],
          learningObjectives: ['Analyze the philosophical ideals articulated in the Preamble of India', 'Assess the structural independence of the Election Commission in ensuring free elections']
        },
        {
          id: 'ch-9-soc-9',
          name: 'Economics: People as Resource & Poverty as a Challenge',
          textbookRef: 'NCERT Economics — Chapters 2 & 3',
          syllabusTopics: ['Human capital formation through Education, Healthcare, and Skill Training', 'Economic activities: Primary, Secondary, Tertiary sectors; Market vs Non-market activities', 'Unemployment in India: Seasonal and Disguised unemployment in agriculture; Educated youth unemployment', 'Poverty Line estimation: Minimum consumption expenditure and calorie requirements (2400 rural, 2100 urban)', 'Anti-poverty programs: MGNREGA 2005 (100 days guaranteed wage employment), PDS, PMRY'],
          learningObjectives: ['Explain how investment in education and healthcare transforms population into productive capital', 'Evaluate government anti-poverty employment guarantee programs']
        }
      ]
    },
    {
      id: 'cbse-9-foundation',
      name: 'Foundation & Olympiads (Class 9 IIT-JEE / NEET Foundation)',
      category: 'Foundation & Olympiads',
      curricula: ['Class 9 IIT-JEE & NEET STEM Foundation', 'NTSE Stage 1 & KVPY Early Foundation'],
      chapters: [
        {
          id: 'ch-9-fd-1',
          name: 'Foundation Physics: 1D & 2D Kinematics, Projectile Motion & Vectors',
          textbookRef: 'Class 9 JEE/NEET STEM Foundation — Chapter 1',
          syllabusTopics: ['Vector algebra: unit vectors, dot product, cross product, resolving vectors in Cartesian components', 'Differential calculus fundamentals: $v = dx/dt$ and $a = dv/dt$', '2D Projectile motion: trajectory equation, maximum height ($H = \\frac{u^2 \\sin^2\\theta}{2g}$), horizontal range ($R = \\frac{u^2 \\sin 2\\theta}{g}$)', 'Relative velocity in 2D (swimmer-river problems and rain-man problems)'],
          learningObjectives: ['Derive projectile motion trajectories using 2D kinematic calculus', 'Solve vector relative velocity collision and interception challenges'],
          coreFormulas: ['R = \\frac{u^2 \\sin 2\\theta}{g}', 'H_{\\text{max}} = \\frac{u^2 \\sin^2\\theta}{2g}', '\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B']
        },
        {
          id: 'ch-9-fd-2',
          name: 'Foundation Physics: Newton’s Laws with Friction & Work-Energy Theorem',
          textbookRef: 'Class 9 JEE/NEET STEM Foundation — Chapter 2',
          syllabusTopics: ['Free Body Diagrams (FBD) for multi-block pulley systems', 'Static and kinetic friction: angle of repose and angle of friction ($f_k = \\mu_k N$)', 'Work-Energy Theorem: $W_{\\text{net}} = \\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$', 'Conservative vs non-conservative forces, potential energy functions ($F = -dU/dx$)'],
          learningObjectives: ['Set up and solve constraint equations for Atwood machines and incline pulleys', 'Apply the Work-Energy Theorem to systems with dissipative friction forces'],
          coreFormulas: ['W_{\\text{net}} = \\Delta K', 'f_{\\text{max}} = \\mu_s N']
        },
        {
          id: 'ch-9-fd-3',
          name: 'Foundation Chemistry: Advanced Mole Concept & Gas Laws',
          textbookRef: 'Class 9 JEE/NEET STEM Foundation — Chapter 3',
          syllabusTopics: ['Molar volume of ideal gases at STP ($22.4\\text{ L}$)', 'Concentration terms: Molarity ($M$), Molality ($m$), Mole fraction ($X$), Mass % ($w/w$)', 'Limiting reagent identification and stoichiometric yield calculations in balanced chemical equations', 'Ideal Gas Equation: $PV = nRT$ and Dalton’s Law of Partial Pressures'],
          learningObjectives: ['Calculate molarity and molality conversions in aqueous solutions', 'Identify limiting reagents in industrial stoichiometric yield reactions'],
          coreFormulas: ['n = \\frac{\\text{Mass}}{\\text{Molar Mass}} = \\frac{V_{\\text{STP}}}{22.4}', 'PV = nRT']
        },
        {
          id: 'ch-9-fd-4',
          name: 'Foundation Chemistry: Bohr Model, Quantum Numbers & Electronic Orbitals',
          textbookRef: 'Class 9 JEE/NEET STEM Foundation — Chapter 4',
          syllabusTopics: ['Planck’s quantum theory: photon energy $E = h\\nu$', 'Bohr’s postulates for hydrogenic atoms: quantized angular momentum $mvr = nh/2\\pi$', 'Four quantum numbers: Principal ($n$), Azimuthal ($l$), Magnetic ($m_l$), Spin ($m_s$)', 'Aufbau principle, Pauli exclusion principle, and Hund’s rule of maximum multiplicity'],
          learningObjectives: ['Write spectroscopic electronic configurations ($1s^2 2s^2 2p^6...$) for transition elements', 'Calculate photon energies and spectral line wavelengths using Rydberg formula'],
          coreFormulas: ['E = h\\nu = \\frac{hc}{\\lambda}', 'mvr = \\frac{nh}{2\\pi}']
        },
        {
          id: 'ch-9-fd-5',
          name: 'Foundation Math: Vieta’s Formulas, Remainder Theorem & Polynomials',
          textbookRef: 'Class 9 Math Olympiad & JEE Foundation — Chapter 5',
          syllabusTopics: ['Polynomial remainder theorem and synthetic division', 'Vieta’s relationships between roots and coefficients for quadratic and cubic equations', 'Discriminant analysis ($D = b^2 - 4ac$) and root location theorems', 'AM-GM Inequality: $\\frac{a+b}{2} \\ge \\sqrt{ab}$ and Cauchy-Schwarz inequality basics'],
          learningObjectives: ['Evaluate symmetric root polynomial expressions using Vieta’s relations without solving equations', 'Apply AM-GM inequality to find extrema in Olympiad algebraic problems'],
          coreFormulas: ['\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha\\beta = \\frac{c}{a}', '\\frac{a+b}{2} \\ge \\sqrt{ab}']
        },
        {
          id: 'ch-9-fd-6',
          name: 'Foundation Math: Advanced Circle Geometry & Power of a Point',
          textbookRef: 'Class 9 Math Olympiad & JEE Foundation — Chapter 6',
          syllabusTopics: ['Ptolemy’s Theorem for cyclic quadrilaterals: $AC \\cdot BD = AB \\cdot CD + BC \\cdot AD$', 'Power of a Point Theorem: Secant-Secant and Tangent-Secant theorem ($PT^2 = PA \\cdot PB$)', 'Euler line, Incenter, Circumcenter, Orthocenter, Centroid properties of triangles'],
          learningObjectives: ['Prove complex geometric concurrency theorems in Olympiad circles', 'Calculate segment lengths using Power of a Point relations'],
          coreFormulas: ['PT^2 = PA \\cdot PB \\text{ (Power of a Point)}']
        }
      ]
    },
    {
      id: 'cbse-9-hindi',
      name: 'Hindi (क्षितिज भाग 1 एवं स्पर्श)',
      category: 'Hindi',
      curricula: ['NCERT Kshitij & Sparsh Class 9', 'CBSE Hindi Course A & B'],
      chapters: [
        {
          id: 'ch-9-h-1',
          name: 'दो बैलों की कथा',
          textbookRef: 'NCERT क्षितिज भाग 1 — पाठ 1',
          syllabusTopics: ['मुंशी प्रेमचंद की कालजयी कहानी', 'हीरा और मोती की अटूट मित्रता और स्वाभिमान', 'गया के घर से भागना, कांजीहौस में पशुओं को मुक्त कराना', 'पशुओं में मूक भाषा और स्वतंत्रता के लिए संघर्ष'],
          learningObjectives: ['स्वाधीनता के मूल्य और मूक पशुओं के संवेगात्मक लगाव को समझना', 'प्रेमचंद की आदर्शोन्मुख यथार्थवादी शैली का अध्ययन'],
        },
        {
          id: 'ch-9-h-2',
          name: 'ल्हासा की ओर',
          textbookRef: 'NCERT क्षितिज भाग 1 — पाठ 2',
          syllabusTopics: ['राहुल सांकृत्यायन का यात्रा वृत्तांत', 'तिब्बत की राजधानी ल्हासा की दुर्गम व रोमांचक यात्रा (1929-30)', 'डाँडा थोङ्ला, भिक्षु के छद्मवेश में यात्रा, सुमति का साथ', 'तिब्बती समाज, जागीरदारी प्रथा और बौद्ध धर्म'],
          learningObjectives: ['यात्रा साहित्य की विशेषताओं और तिब्बती भौगोलिक परिवेश की जानकारी पाना'],
        },
        {
          id: 'ch-9-h-3',
          name: 'उपभोक्तावाद की संस्कृति',
          textbookRef: 'NCERT क्षितिज भाग 1 — पाठ 3',
          syllabusTopics: ['श्यामाचरण दुबे का समाजशास्त्रीय निबंध', 'दिखावे की संस्कृति, विज्ञापनों का अंधानुकरण', 'उपभोग को ही चरम सुख मान बैठना और सामाजिक मर्यादाओं का क्षरण'],
          learningObjectives: ['उपभोक्तावादी संस्कृति के दुष्प्रभावों के प्रति तार्किक व सतर्क दृष्टि अपनाना'],
        },
        {
          id: 'ch-9-h-4',
          name: 'साँवले सपनों की याद',
          textbookRef: 'NCERT क्षितिज भाग 1 — पाठ 4',
          syllabusTopics: ['जाबिर हुसैन का संस्मरण', 'प्रसिद्ध पक्षी विज्ञानी सालिम अली की स्मृति', 'साइलेंट वैली को रेगिस्तानी हवाओं से बचाने की मुहिम, बर्ड वॉचिंग'],
          learningObjectives: ['पर्यावरण संरक्षण और पक्षियों के प्रति गहन संवेदना का विकास'],
        },
        {
          id: 'ch-9-h-5',
          name: 'प्रेमचंद के फटे जूते',
          textbookRef: 'NCERT क्षितिज भाग 1 — पाठ 5',
          syllabusTopics: ['हरिशंकर परसाई का व्यंग्य निबंध', 'प्रेमचंद के फटे जूते से झाँकती उँगली और उनकी सादगी', 'दिखावे की झूठी शान पर करारा कटाक्ष, सामाजिक विसंगतियों से टकराने का प्रतीक'],
          learningObjectives: ['सच्चे साहित्यकार की अंतर्दृष्टि और पाखंड-विरोधी व्यंग्य का अध्ययन'],
        },
        {
          id: 'ch-9-h-6',
          name: 'साखियाँ एवं सबद',
          textbookRef: 'NCERT क्षितिज भाग 1 — काव्य खंड',
          syllabusTopics: ['कबीरदास की साखियाँ व पद', 'मानसरोवर सुभर जल, मानुष प्रेम की कसौटी', 'मोको कहाँ ढूँढे रे बंदे मैं तो तेरे पास में', 'निर्गुण भक्ति और पाखंड-खंडन'],
          learningObjectives: ['मध्यकालीन निर्गुण भक्ति काव्य की दार्शनिक गहराई को समझना'],
        },
        {
          id: 'ch-9-h-7',
          name: 'सवैये',
          textbookRef: 'NCERT क्षितिज भाग 1 — काव्य खंड',
          syllabusTopics: ['रसखान के ब्रजभाषा सवैये', 'मानुष हौं तो वही रसखानि बसौं ब्रज गोकुल गाँव के ग्वारन', 'कृष्ण की लाठी, कामरिया और मोरपंख के प्रति अनन्य समर्पण'],
          learningObjectives: ['सगुण कृष्ण भक्ति की माधुर्यमयी अनुभूति और ब्रजभाषा सौंदर्य'],
        },
        {
          id: 'ch-9-h-8',
          name: 'कैदी और कोकिला',
          textbookRef: 'NCERT क्षितिज भाग 1 — काव्य खंड',
          syllabusTopics: ['माखनलाल चतुर्वेदी की राष्ट्रीय भावना से ओतप्रोत कविता', 'ब्रिटिश जेल में स्वतंत्रता सेनानियों पर होने वाले अमानवीय अत्याचार', 'कोयल की आधी रात की हूक और स्वाधीनता संग्राम की दावानल'],
          learningObjectives: ['स्वाधीनता सेनानियों के अदम्य बलिदान और देशप्रेम की भावना को आत्मसात करना'],
        },
        {
          id: 'ch-9-h-9',
          name: 'बच्चे काम पर जा रहे हैं',
          textbookRef: 'NCERT क्षितिज भाग 1 — काव्य खंड',
          syllabusTopics: ['राजेश जोशी की संवेदनशील कविता', 'कोहरे से ढकी सड़क पर बच्चों का मजदूरी के लिए जाना', 'बाल श्रम की त्रासदी और समाज के प्रति तीखा सवालिया निशान'],
          learningObjectives: ['बाल अधिकारों के हनन और बाल श्रम उन्मूलन के प्रति सामाजिक चेतना जाग्रत करना'],
        }
      ]
    },
    {
      id: 'cbse-9-marathi',
      name: 'Marathi (कुमारभारती / अक्षरभारती इयत्ता ९ वी)',
      category: 'Marathi',
      curricula: ['Maharashtra State / NCERT Marathi Class 9', 'कुमारभारती इयत्ता नववी'],
      chapters: [
        {
          id: 'ch-9-mr-1',
          name: 'संतवाणी (भेटीलागी जीवा / धरिला जीव्हाळा)',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ १',
          syllabusTopics: ['संत तुकाराम महाराज व संत चोखामेळा यांचे विठ्ठलभक्तीपर अभंग', 'विठ्ठलदर्शनाची आर्त ओढ, चकोर पक्षी आणि पौर्णिमेच्या चंद्राचा दृष्टांत'],
          learningObjectives: ['वारकरी संतांची भक्तीपरंपरा, रूपके व अभंग रचनेचे सौंदर्य समजणे'],
        },
        {
          id: 'ch-9-mr-2',
          name: 'कीर्तीचा कठिया',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ २',
          syllabusTopics: ['म्हाइंभट विरचित "लीळाचरित्र" (मराठीतील पहिला गद्य ग्रंथ)', 'सर्वज्ञ श्री चक्रधर स्वामींची लीळा', 'कीर्तीच्या हव्यासाने मानवाचे होणारे पतन'],
          learningObjectives: ['प्राचीन मराठी गद्य भाषा आणि निस्पृहतेचे मूल्य समजणे'],
        },
        {
          id: 'ch-9-mr-3',
          name: 'व्यायामाचे महत्त्व',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ३',
          syllabusTopics: ['राष्ट्रसंत तुकडोजी महाराज यांची विचाररचना', 'आरोग्य हीच खरी संपत्ती, व्यायामाने रक्तभिसरण व प्रतिकारशक्ती वाढणे', 'आळसाचा नाश'],
          learningObjectives: ['नियमित व्यायाम व निरोगी जीवनशैलीचा अंगीकार करणे'],
        },
        {
          id: 'ch-9-mr-4',
          name: 'ऑलिंपिक वर्तुळांचा गोफ',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ४',
          syllabusTopics: ['बाळ ज. पंडित यांचा माहितीपर पाठ', 'ऑलिंपिक सामन्यांचा इतिहास, पाच खंडांची एकात्मता दर्शवणारी पाच वर्तुळे', 'विश्वबंधुत्व, निकोप स्पर्धा व क्रीडा भावना'],
          learningObjectives: ['आंतरराष्ट्रीय क्रीडा स्पर्धांचे महत्त्व व क्रीडासंस्कृतीची ओळख करून घेणे'],
        },
        {
          id: 'ch-9-mr-5',
          name: 'दिव्याच्या शोधामागचे दिव्य',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ५',
          syllabusTopics: ['महान संशोधक थॉमस अल्वा एडिसन यांच्या विजेच्या दिव्याच्या शोधाचा संघर्ष', 'हजारो अयशस्वी प्रयोगांनंतरही न खचता घेतलेले अथक परिश्रम'],
          learningObjectives: ['चिकाटी, वैज्ञानिक कुतूहल आणि ध्येयनिष्ठेचा आदर्श घेणे'],
        },
        {
          id: 'ch-9-mr-6',
          name: 'सखू आजी',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ६',
          syllabusTopics: ['राजन गवस यांचा व्यक्तिचित्रणात्मक पाठ', 'गावातील सखू आजीची बोलकी भाषा, निसर्गाशी नातं आणि तिच्या मृत्यूनंतर निर्माण झालेली पोकळी'],
          learningObjectives: ['ग्रामीण संस्कृतीतील वडीलधाऱ्या माणसांचे महत्त्व व व्यक्तिचित्रण शैली'],
        },
        {
          id: 'ch-9-mr-7',
          name: 'हास्यचित्रांतली मुलं',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ७',
          syllabusTopics: ['मधुकर धर्मापुरीकर यांचा कलाविषयक पाठ', 'व्यंग्यचित्र आणि हास्यचित्र यांतील भेद', 'चिंटू, मारिओ, लँगडन यांच्या चित्रांमधील मुलांची निरागसता'],
          learningObjectives: ['चित्रकलेतील आणि व्यंग्यचित्रातील सूक्ष्म बारकावे व विनोद समजून घेणे'],
        },
        {
          id: 'ch-9-mr-8',
          name: 'तिफन (कविता)',
          textbookRef: 'कुमारभारती इयत्ता ९ वी — पाठ ८',
          syllabusTopics: ['विठ्ठल वाघ यांची प्रसिद्ध शेतकरी कविता', 'मृग नक्षत्राचा पाऊस, काळ्या मातीत तिफन चालवणे, बियाणे पेरणे आणि शेतकऱ्यांची हिरवी स्वप्ने'],
          learningObjectives: ['ग्रामीण कृषीजीवन, मातीचा गंध आणि लयबद्ध बोलीभाषेचा आस्वाद घेणे'],
        }
      ]
    },
    {
      id: 'cbse-9-english',
      name: 'English (Beehive & Moments)',
      category: 'English & Languages',
      curricula: ['NCERT Beehive Class 9', 'NCERT Moments Supplementary'],
      textbookName: 'Beehive & Moments (NCERT Class 9)',
      edition: '2025–2026 NEP Edition',
      chapters: [
        {
          id: 'ch-9-en-1',
          name: 'The Fun They Had',
          textbookRef: 'NCERT Beehive Class 9 — Unit 1',
          syllabusTopics: ['Isaac Asimov’s classic science-fiction story set in year 2157', 'Margie and Tommy discovering an ancient printed paper book', 'Mechanical teacher with screen and punch-code tests vs human teacher and school building with classmates'],
          learningObjectives: ['Critique technological isolation versus social collaborative schooling']
        },
        {
          id: 'ch-9-en-2',
          name: 'The Sound of Music (Parts I & II)',
          textbookRef: 'NCERT Beehive Class 9 — Unit 2',
          syllabusTopics: ['Deborah Cowley’s account of Evelyn Glennie sensing sound through her body vibrations without hearing', 'Ustad Bismillah Khan bringing the Shehnai from royal naubatkhana to international classical stage', 'Secular syncretism at Varanasi Ganga ghats and Dumraon'],
          learningObjectives: ['Draw inspiration from overcoming sensory disability and study Indian musical traditions']
        },
        {
          id: 'ch-9-en-3',
          name: 'The Little Girl',
          textbookRef: 'NCERT Beehive Class 9 — Unit 3',
          syllabusTopics: ['Katherine Mansfield’s psychological narrative of Kezia and her strict, imposing father', 'Accidental tearing of father’s speech papers for birthday pincushion gift leading to punishment', 'Mother taken ill, nightmare, and discovering father’s tender protective heart under stern exterior'],
          learningObjectives: ['Analyze child-parent dynamics, fear, and empathetic emotional reconciliation']
        },
        {
          id: 'ch-9-en-4',
          name: 'A Truly Beautiful Mind',
          textbookRef: 'NCERT Beehive Class 9 — Unit 4',
          syllabusTopics: ['Biographical sketch of Albert Einstein: rebellious Munich school years, patent office in Bern, 1905 Annus Mirabilis papers on relativity', 'Letter to Roosevelt warning about atomic bomb, Hiroshima tragedy, and lifelong crusade for world government and peace'],
          learningObjectives: ['Evaluate the moral responsibility of scientists and Einstein’s pacifist world vision']
        },
        {
          id: 'ch-9-en-5',
          name: 'My Childhood',
          textbookRef: 'NCERT Beehive Class 9 — Unit 5',
          syllabusTopics: ['Dr. A.P.J. Abdul Kalam’s memoir excerpted from "Wings of Fire"', 'Growing up in Rameshwaram with parents Jainulabdeen and Ashiamma', 'Communal harmony among Hindu and Muslim friends (Ramanadha Sastry), confrontation with orthodox teacher, and science teacher Sivasubramania Iyer breaking social barriers'],
          learningObjectives: ['Appreciate interfaith tolerance, humility, and family values shaping scientific destiny']
        },
        {
          id: 'ch-9-en-6',
          name: 'Reach for the Top (Parts I & II)',
          textbookRef: 'NCERT Beehive Class 9 — Unit 6',
          syllabusTopics: ['Santosh Yadav: conquering Mount Everest twice and environmental cleanup of 500 kg trash from Himalayas', 'Maria Sharapova: enduring grueling tennis sacrifice in Florida, mental toughness, and reaching World No. 1 ranking at age 18'],
          learningObjectives: ['Examine women empowerment, grit, discipline, and perseverance under adversity']
        },
        {
          id: 'ch-9-en-7',
          name: 'The Road Not Taken & Wind (Poems)',
          textbookRef: 'NCERT Beehive Class 9 — Poetry',
          syllabusTopics: ['Robert Frost’s "The Road Not Taken": decision making, divergence in yellow wood, choices that make all the difference', 'Subramania Bharati’s "Wind": destructive force of wind blowing away weaklings, building inner resilience to make adversity our friend'],
          learningObjectives: ['Analyze universal metaphors of life choices and mental toughness in modern poetry']
        },
        {
          id: 'ch-9-en-8',
          name: 'The Lost Child (Moments)',
          textbookRef: 'NCERT Moments Class 9 — Chapter 1',
          syllabusTopics: ['Mulk Raj Anand’s masterpiece of childhood desire and primal security', 'Spring fair: toys, dragonflies, burfi, gulmohar garland, rainbow balloons, roundabout', 'Separation from parents: the sudden realization that all materialistic attractions are utterly worthless without parents'],
          learningObjectives: ['Evaluate emotional hierarchies, parental bonds, and psychological panic of loss']
        }
      ]
    },
    {
      id: 'cbse-9-sanskrit',
      name: 'Sanskrit (शेमुषी प्रथमो भागः)',
      category: 'Sanskrit',
      curricula: ['NCERT Shemushi Class 9', 'CBSE Class 9 Sanskrit Board Course'],
      textbookName: 'शेमुषी प्रथमो भागः (NCERT Class 9)',
      edition: '2025–2026 NEP Edition',
      chapters: [
        {
          id: 'ch-9-sk-1',
          name: 'भारतीवसन्तगीतिः',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ १',
          syllabusTopics: ['पं. जानकीवल्लभ शास्त्रिणः "काकली" गीतसङ्ग्रहात् उद्धृतम्', 'निनादय नवीनामये वाणि वीणाम्', 'मृदुं गाय गीतिं ललितनीतिलीनाम्, वसन्ते लसन्तीह सरसा रसालाः'],
          learningObjectives: ['राष्ट्रचेतनायाः वीणावादनस्य च काव्यानुभूतिः']
        },
        {
          id: 'ch-9-sk-2',
          name: 'स्वर्णकाकः',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ २',
          syllabusTopics: ['श्रीपद्मशास्त्रिणः "विश्वकथाशतकम्" (बर्मी लोककथा)', 'विनम्रायाः निर्धनायाः बालिकायाः स्वर्णकाकेन सह व्यवहारः', 'लुब्धायाः बालिकायाः लोभस्य दुष्परिणामः, तण्डुलानां मूल्यम्'],
          learningObjectives: ['लोभस्य हानिकरत्वं सन्तोषस्य च श्रेष्ठता']
        },
        {
          id: 'ch-9-sk-3',
          name: 'गोदोहनम्',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ३',
          syllabusTopics: ['चतुर्व्यूहम् इति पुस्तकात् सङ्क्षिप्तम् (नाट्यांशः)', 'चन्दनस्य मल्लिकायाश्च मासपर्यन्तं धेनोः अदोहनम्', 'मासान्ते दुग्धदोहने धेनोः पादप्रहारः, "कार्यमद्यतनीयं यत्तदद्यैव विधीयताम्"'],
          learningObjectives: ['समयपालनेन कार्यसमापनस्य महत्त्वम्, हास्यनाट्याभिनयः']
        },
        {
          id: 'ch-9-sk-4',
          name: 'कल्पतरुः',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ४',
          syllabusTopics: ['वेतालपञ्चविंशतिः कथाग्रन्थात्', 'जीमूतवाहनस्य परोपकाराय कल्पवृक्षस्य याचना', 'स्वार्थत्यागः, सर्वभूतानुकम्पा, परोपकाराय फलं सस्यं च'],
          learningObjectives: ['परोपकारस्य अमरत्वम् त्यागभावस्य च जागरणम्']
        },
        {
          id: 'ch-9-sk-5',
          name: 'सूक्तिमौक्तिकम्',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ५',
          syllabusTopics: ['मनुस्मृति-विदुरनीति-हितोपदेशेभ्यः सुभाषितानि', 'वृत्तं यत्नेन संरक्षेद् वित्तमेति च याति च', 'यथा ह्येकेन चक्रेण न रथस्य गतिर्भवेत् (कर्मणः महत्त्वम्)'],
          learningObjectives: ['सदाचारस्य नैतिकमूल्यानां च कण्ठस्थीकरणम्']
        },
        {
          id: 'ch-9-sk-6',
          name: 'भ्रान्तो बालः',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ६',
          syllabusTopics: ['क्रीडासक्तस्य अलसस्य बालकस्य कथा', 'मधुकरः, श्वानः, चटकश्च सर्वैः स्वकार्यव्यापृतत्वं दर्शितम्', 'बालकस्य ज्ञानोदयः विद्याभ्यासे प्रवृत्तिश्च'],
          learningObjectives: ['आलस्यत्यागः स्वकर्तव्यपालनस्य च प्रेरणा']
        },
        {
          id: 'ch-9-sk-7',
          name: 'सिकतासेतुः',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ७',
          syllabusTopics: ['सोमदेवस्य "कथासरित्सागरः" सप्तमांशः', 'तपोदत्तस्य विद्याभ्यासं विना केवलं तपसा विद्याप्राप्तये यत्नः', 'इन्द्रेण वालुकाभिः (सिकताभिः) नद्यां सेतुनिर्माणस्य दृष्टान्तेन प्रबोधनम्'],
          learningObjectives: ['परिश्रमेण अभ्यासेन च एव विद्या सिध्यति इति बोधः']
        },
        {
          id: 'ch-9-sk-8',
          name: 'जटायोः शौर्यम्',
          textbookRef: 'NCERT शेमुषी भाग १ — पाठ ८',
          syllabusTopics: ['वाल्मीकिरामायणस्य अरण्यकाण्डात् पद्यानि', 'रावणेन सीतायाः अपहरणे वृद्धस्य जटायुषः अदम्यं शौर्यम्', 'धर्मरक्षायै प्राणत्यागः, अन्यायस्य प्रतिरोधः'],
          learningObjectives: ['वृद्धावस्थायामपि अन्यायरोधे वीरतायाः आदर्शः']
        }
      ]
    }
  ]
};
