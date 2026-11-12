import { SyllabusClassInfo } from './types';

export const cbseClass8: SyllabusClassInfo = {
  id: 'cbse-class-8',
  name: 'Class 8 (Middle School)',
  gradeEquivalent: 'Class 6-8 (Middle School)',
  subjects: [
    {
      id: 'cbse-8-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 8', 'NCERT Exemplar Class 8'],
      chapters: [
        {
          id: 'ch-8-m-1',
          name: 'Rational Numbers',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 1',
          syllabusTopics: ['Properties of rational numbers: Closure, Commutativity, Associativity', 'Role of zero (additive identity) and 1 (multiplicative identity)', 'Additive inverse (negative of a number) and Multiplicative inverse (reciprocal)', 'Distributivity of multiplication over addition: $a(b+c) = ab + ac$', 'Rational numbers between two rational numbers using mean method'],
          learningObjectives: ['Verify algebraic closure and associativity for rational numbers', 'Insert multiple rational numbers between fractions with unequal denominators'],
          coreFormulas: ['\\text{Additive Inverse of } \\frac{a}{b} = -\\frac{a}{b}', '\\text{Multiplicative Inverse of } \\frac{a}{b} = \\frac{b}{a}']
        },
        {
          id: 'ch-8-m-2',
          name: 'Linear Equations in One Variable',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 2',
          syllabusTopics: ['Solving linear equations having expressions on one side and numbers on the other', 'Solving equations having variables on both sides', 'Equations reducible to simpler linear form by clearing fractions and brackets', 'Equations reducible to linear form by cross-multiplication: $\\frac{ax+b}{cx+d} = \\frac{m}{n}$', 'Word problems on digits of 2-digit numbers, age, perimeter, and currency denominations'],
          learningObjectives: ['Solve complex multi-bracket linear fractional equations', 'Model real-world reverse-digit and rate problems algebraically'],
          coreFormulas: ['\\frac{ax+b}{cx+d} = \\frac{m}{n} \\implies n(ax+b) = m(cx+d)']
        },
        {
          id: 'ch-8-m-3',
          name: 'Understanding Quadrilaterals',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 3',
          syllabusTopics: ['Polygons: Convex and concave polygons, Regular and irregular polygons', 'Angle sum property of a polygon: $(n - 2) \\times 180^\\circ$', 'Sum of the measures of the exterior angles of any polygon = 360°', 'Kinds of quadrilaterals: Trapezium, Kite, Parallelogram', 'Properties of a parallelogram: Opposite sides equal, opposite angles equal, adjacent angles supplementary, diagonals bisect each other', 'Special parallelograms: Rhombus (perpendicular diagonals), Rectangle (equal diagonals), Square (equal perpendicular diagonals)'],
          learningObjectives: ['Compute interior and exterior angles of regular n-gons', 'Deduce geometric properties of parallelograms, rhombuses, and kites in proofs'],
          coreFormulas: ['\\text{Sum of Interior Angles} = (n - 2) \\times 180^\\circ', '\\text{Each Interior Angle of Regular } n\\text{-gon} = \\frac{(n-2) \\times 180^\\circ}{n}']
        },
        {
          id: 'ch-8-m-4',
          name: 'Data Handling',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 4',
          syllabusTopics: ['Organising raw data into grouped frequency distribution tables', 'Constructing histograms for continuous class intervals', 'Pie charts (circle graphs): calculating central sector angles ($\\theta = \\frac{\\text{Value}}{\\text{Total}} \\times 360^\\circ$)', 'Probability: Random experiments, Outcomes, Events, Probability formula $P(E) = n(E) / n(S)$'],
          learningObjectives: ['Construct and interpret continuous histograms', 'Draw pie charts with accurate protractor sector angles', 'Calculate empirical probabilities of single events'],
          coreFormulas: ['\\text{Central Angle } \\theta = \\frac{\\text{Component Value}}{\\text{Total Value}} \\times 360^\\circ', 'P(E) = \\frac{n(E)}{n(S)}']
        },
        {
          id: 'ch-8-m-5',
          name: 'Squares and Square Roots',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 5',
          syllabusTopics: ['Properties of square numbers (units digits ending in 0, 1, 4, 5, 6, 9)', 'Pythagorean triplets: For any integer $m > 1$, $2m, m^2 - 1, m^2 + 1$', 'Finding square roots by prime factorization', 'Finding square roots by long division method for whole numbers and decimals', 'Estimating square roots of non-perfect squares'],
          learningObjectives: ['Generate Pythagorean triplets algebraically', 'Compute square roots of multi-digit integers and decimals using long division'],
          coreFormulas: ['(2m)^2 + (m^2 - 1)^2 = (m^2 + 1)^2']
        },
        {
          id: 'ch-8-m-6',
          name: 'Cubes and Cube Roots',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 6',
          syllabusTopics: ['Properties of perfect cubes and unit digit patterns', 'Hardy-Ramanujan number 1729 (smallest number expressible as sum of two cubes in two different ways)', 'Finding cube root through prime factorization (grouping triplets)', 'Estimating cube root of large perfect cubes by grouping from right into sets of three'],
          learningObjectives: ['Identify perfect cubes using canonical prime factorization', 'Extract cube roots of integers and fractions systematically'],
          coreFormulas: ['1729 = 1^3 + 12^3 = 9^3 + 10^3 \\text{ (Hardy-Ramanujan Number)}']
        },
        {
          id: 'ch-8-m-7',
          name: 'Comparing Quantities',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 7',
          syllabusTopics: ['Recalling ratios and percentages', 'Discount = Marked Price (MP) - Selling Price (SP); Discount %', 'Sales Tax, Value Added Tax (VAT), Goods and Services Tax (GST)', 'Compound Interest (CI) concept vs Simple Interest (SI)', 'Formula for Amount compounded annually: $A = P(1 + R/100)^n$', 'Compounded half-yearly: $A = P(1 + R/200)^{2n}$', 'Applications of compound interest formula to population growth and asset depreciation'],
          learningObjectives: ['Compute commercial discounts, marked prices, and GST on purchases', 'Derive and apply compound interest formulas for annual and semi-annual intervals'],
          coreFormulas: [
            'A = P \\left(1 + \\frac{R}{100}\\right)^n',
            'CI = A - P',
            'A_{\\text{half-yearly}} = P \\left(1 + \\frac{R}{200}\\right)^{2n}',
            'V_{\\text{depreciation}} = P \\left(1 - \\frac{R}{100}\\right)^n'
          ]
        },
        {
          id: 'ch-8-m-8',
          name: 'Algebraic Expressions and Identities',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 8',
          syllabusTopics: ['Multiplication of algebraic expressions: Monomial by Monomial, Monomial by Polynomial, Binomial by Binomial', 'Standard algebraic identities: $(a+b)^2 = a^2 + 2ab + b^2$, $(a-b)^2 = a^2 - 2ab + b^2$, $(a+b)(a-b) = a^2 - b^2$, $(x+a)(x+b) = x^2 + (a+b)x + ab$', 'Applications of algebraic identities to rapid mental numerical multiplication'],
          learningObjectives: ['Multiply polynomials systematically', 'Apply the four standard identities for quick numerical evaluation without direct long multiplication'],
          coreFormulas: [
            '(a+b)^2 = a^2 + 2ab + b^2',
            '(a-b)^2 = a^2 - 2ab + b^2',
            '(a+b)(a-b) = a^2 - b^2',
            '(x+a)(x+b) = x^2 + (a+b)x + ab'
          ]
        },
        {
          id: 'ch-8-m-9',
          name: 'Mensuration',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 9',
          syllabusTopics: ['Area of Trapezium: $\\frac{1}{2} \\times (a + b) \\times h$', 'Area of a general quadrilateral by dividing into two triangles using diagonal', 'Area of Rhombus: $\\frac{1}{2} \\times d_1 \\times d_2$', 'Surface area and volume of Cube ($6s^2$, $s^3$), Cuboid ($2(lb+bh+hl)$, $lbh$), and Cylinder ($CSA = 2\\pi rh$, $TSA = 2\\pi r(r+h)$, $V = \\pi r^2 h$)', 'Volume and capacity conversions: $1\\text{ L} = 1000\\text{ cm}^3$, $1\\text{ m}^3 = 1000\\text{ L}$'],
          learningObjectives: ['Calculate area of non-standard polygonal fields and rhombuses', 'Compute lateral/total surface area and liquid volumetric capacity of cylinders and prisms'],
          coreFormulas: [
            '\\text{Area of Trapezium} = \\frac{1}{2}(a + b)h',
            '\\text{Area of Rhombus} = \\frac{1}{2} d_1 d_2',
            'CSA_{\\text{cylinder}} = 2\\pi rh, \\quad TSA = 2\\pi r(r + h)',
            'V_{\\text{cylinder}} = \\pi r^2 h'
          ]
        },
        {
          id: 'ch-8-m-10',
          name: 'Exponents and Powers',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 10',
          syllabusTopics: ['Powers with negative integral exponents ($a^{-m} = 1/a^m$)', 'Laws of exponents for negative and positive powers: $a^m \\times a^n = a^{m+n}$, $a^m / a^n = a^{m-n}$, $(a^m)^n = a^{mn}$, $a^m \\times b^m = (ab)^m$, $a^m / b^m = (a/b)^m$, $a^0 = 1$', 'Use of exponents to express small numbers in standard form (e.g. electron mass, cell size $0.000007\\text{ m} = 7 \\times 10^{-6}\\text{ m}$)'],
          learningObjectives: ['Evaluate expressions with negative integral powers', 'Convert microscopic measurements into scientific standard form and compare orders of magnitude'],
          coreFormulas: ['a^{-m} = \\frac{1}{a^m}', '\\left(\\frac{a}{b}\\right)^{-m} = \\left(\\frac{b}{a}\\right)^m']
        },
        {
          id: 'ch-8-m-11',
          name: 'Direct and Inverse Proportions',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 11',
          syllabusTopics: ['Direct proportion: $x / y = k$ (constant) or $x_1/y_1 = x_2/y_2$', 'Applications of direct variation: speed-distance, scale drawing, wages', 'Inverse proportion: $x \\times y = k$ (constant) or $x_1 y_1 = x_2 y_2$', 'Applications of inverse variation: workers and time, speed and time for constant distance'],
          learningObjectives: ['Identify whether two varying quantities are in direct or inverse relation', 'Set up and solve proportion equations for real-world work and time scenarios'],
          coreFormulas: ['\\frac{x_1}{y_1} = \\frac{x_2}{y_2} \\text{ (Direct)}', 'x_1 y_1 = x_2 y_2 \\text{ (Inverse)}']
        },
        {
          id: 'ch-8-m-12',
          name: 'Factorisation',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 12',
          syllabusTopics: ['Method of common factors in algebraic terms', 'Factorisation by grouping terms', 'Factorisation using standard identities: $a^2 + 2ab + b^2 = (a+b)^2$, $a^2 - 2ab + b^2 = (a-b)^2$, $a^2 - b^2 = (a-b)(a+b)$', 'Factors of the form $(x + a)(x + b) = x^2 + (a+b)x + ab$ (splitting middle term)', 'Division of polynomials: Monomial by Monomial, Polynomial by Monomial, Polynomial by Polynomial'],
          learningObjectives: ['Factorize quadratic trinomials by splitting the middle term', 'Divide algebraic polynomials by cancelling common binomial factors'],
          coreFormulas: ['a^2 - b^2 = (a - b)(a + b)', 'x^2 + (p+q)x + pq = (x+p)(x+q)']
        },
        {
          id: 'ch-8-m-13',
          name: 'Introduction to Graphs',
          textbookRef: 'NCERT Mathematics Class 8 — Chapter 13',
          syllabusTopics: ['Bar graphs, Pie graphs, Histograms, Line graphs, and Linear graphs', 'Cartesian coordinate system: x-axis (horizontal), y-axis (vertical), Origin $(0, 0)$', 'Plotting ordered pairs of coordinates $(x, y)$', 'Distance-time, Interest-Deposit, and Cost-Quantity linear graphs and finding values from graphs'],
          learningObjectives: ['Plot coordinate points on Cartesian grids accurately', 'Interpolate and extrapolate dependent variable values from linear trendlines']
        }
      ]
    },
    {
      id: 'cbse-8-science',
      name: 'Science',
      category: 'General Science',
      curricula: ['NCERT Science Class 8', 'NCERT Exemplar Class 8'],
      chapters: [
        {
          id: 'ch-8-s-1',
          name: 'Crop Production and Management',
          textbookRef: 'NCERT Science Class 8 — Chapter 1',
          syllabusTopics: ['Kharif crops (monsoon: paddy, maize, cotton) vs Rabi crops (winter: wheat, gram, mustard)', 'Seven agricultural practices: Soil preparation, Sowing (seed drill), Adding Manure and Fertilizers (NPK), Irrigation (Drip and Sprinkler modern systems), Weeding, Harvesting, Storage', 'Nitrogen-fixing bacteria: Rhizobium in root nodules of leguminous plants'],
          learningObjectives: ['Differentiate organic manure from chemical fertilizers', 'Explain water-saving modern irrigation methods (drip and sprinkler)']
        },
        {
          id: 'ch-8-s-2',
          name: 'Microorganisms: Friend and Foe',
          textbookRef: 'NCERT Science Class 8 — Chapter 2',
          syllabusTopics: ['Four major groups: Bacteria, Fungi, Protozoa, Algae; Viruses as borderline entities requiring host cell', 'Beneficial microbes: Lactobacillus in curd, yeast in bread/alcohol fermentation (Pasteur 1857), Antibiotics (Alexander Fleming 1929 penicillin), Vaccines (Edward Jenner 1798 smallpox)', 'Harmful microbes: Pathogens causing Tuberculosis, Cholera, Malaria (Plasmodium), Typhoid, Citrus canker, Rust of wheat', 'Food preservation: Pasteurization (70°C for 15-30 s), salting, sugar, chemical preservatives (Sodium benzoate)', 'Nitrogen Cycle: Nitrogen fixation, nitrification, assimilation, denitrification'],
          learningObjectives: ['Diagram and explain all steps of the biogeochemical Nitrogen Cycle', 'Evaluate biological mechanisms of antibiotics and immunizing vaccines']
        },
        {
          id: 'ch-8-s-3',
          name: 'Coal and Petroleum',
          textbookRef: 'NCERT Science Class 8 — Chapter 3',
          syllabusTopics: ['Exhaustible vs Inexhaustible natural resources', 'Coal formation: Carbonisation of buried dense forests under high temperature and pressure over millions of years', 'Destructive distillation products: Coke (almost pure carbon), Coal Tar (dyes, perfumes, naphthalene), Coal Gas', 'Petroleum formation, refining in fractionating columns (fractional distillation)', 'Products: LPG, Petrol, Kerosene, Diesel, Lubricating oil, Paraffin wax, Bitumen (surfacing roads)', 'Petrochemicals and PCRA guidelines for saving fuel'],
          learningObjectives: ['Describe geological carbonisation leading to fossil fuels', 'List fractions of petroleum and their domestic and industrial applications']
        },
        {
          id: 'ch-8-s-4',
          name: 'Combustion and Flame',
          textbookRef: 'NCERT Science Class 8 — Chapter 4',
          syllabusTopics: ['Conditions necessary for combustion: Combustible substance, supporter of combustion (oxygen), Ignition temperature', 'Inflammable substances with low ignition temperature (petrol, alcohol, LPG)', 'Types of combustion: Rapid, Spontaneous (white phosphorus), Explosion (fireworks)', 'Fire extinguisher principles: $CO_2$ cut off oxygen and cool fuel; Soda-acid extinguisher', 'Structure of a flame: Non-luminous outer zone (blue, hottest, complete combustion), Middle luminous zone (yellow, moderate, incomplete combustion), Dark inner zone (unburnt carbon)', 'Calorific value of fuels (kJ/kg) and harmful combustion products ($CO, CO_2$, unburnt carbon causing asthma, acid rain from $SO_2, NO_2$)'],
          learningObjectives: ['Diagram the three zones of a candle flame with temperature profiles', 'Calculate calorific value of fuels and evaluate environmental impacts']
        },
        {
          id: 'ch-8-s-5',
          name: 'Conservation of Plants and Animals',
          textbookRef: 'NCERT Science Class 8 — Chapter 5',
          syllabusTopics: ['Deforestation causes and severe consequences: Desertification, drought, global warming, loss of biodiversity', 'Biosphere Reserves (Pachmarhi Biosphere Reserve: Satpura National Park, Bori and Pachmarhi Wildlife Sanctuaries)', 'Flora and Fauna; Endemic species (Bison, Indian giant squirrel)', 'Red Data Book compiled by IUCN for endangered species', 'Migration of migratory birds (Siberian cranes travelling 1000s of km) and Reforestation'],
          learningObjectives: ['Distinguish National Parks, Wildlife Sanctuaries, and Biosphere Reserves', 'Analyze conservation importance of Red Data Book and wildlife corridors']
        },
        {
          id: 'ch-8-s-6',
          name: 'Reproduction in Animals',
          textbookRef: 'NCERT Science Class 8 — Chapter 6',
          syllabusTopics: ['Sexual reproduction: Male reproductive system (testes, sperm ducts, penis; sperm anatomy: head, middle piece, tail) and Female reproductive system (ovaries, oviducts/fallopian tubes, uterus; ovum)', 'Fertilization: Internal (humans, cows, birds) vs External fertilization (frogs, fish in water)', 'IVF (In Vitro Fertilization) and test-tube babies', 'Embryo development and implantation in uterine wall', 'Viviparous (giving birth to young) vs Oviparous (egg-laying) animals', 'Metamorphosis in silk moth and frog (Tadpole to adult regulated by thyroxine hormone and iodine)', 'Asexual reproduction: Binary fission in Amoeba, Budding in Hydra, Cloning (Dolly the sheep by Ian Wilmut 1996)'],
          learningObjectives: ['Compare internal vs external fertilization mechanisms', 'Trace developmental stages of frog metamorphosis and mammalian zygotes']
        },
        {
          id: 'ch-8-s-7',
          name: 'Reaching the Age of Adolescence',
          textbookRef: 'NCERT Science Class 8 — Chapter 7',
          syllabusTopics: ['Adolescence and Puberty; Physical changes: Sudden increase in height, change in body shape, voice change (Adam’s apple in boys), increased sweat and sebaceous gland activity', 'Development of sex organs, mental and emotional maturation', 'Secondary sexual characteristics controlled by hormones: Testosterone (testes) and Estrogen (ovaries)', 'Endocrine glands: Pituitary (master gland), Thyroid (thyroxine, goitre), Pancreas (insulin, diabetes), Adrenals (adrenaline for stress/fight-or-flight)', 'Reproductive phase in females: Menarche (first menstruation), Menopause, 28-day menstrual cycle', 'Sex determination in human infant: XX chromosomes (female) vs XY chromosomes (male; father’s sperm determines sex)'],
          learningObjectives: ['Diagram the chromosomal sex determination genetic mechanism in humans', 'Explain endocrine hormonal regulation of physical and emotional changes during puberty']
        },
        {
          id: 'ch-8-s-8',
          name: 'Force and Pressure',
          textbookRef: 'NCERT Science Class 8 — Chapter 8',
          syllabusTopics: ['Force as a push or pull; Magnitude and direction of force', 'Effects of force: change in state of motion, speed, direction, shape', 'Contact forces: Muscular force, Friction', 'Non-contact forces: Magnetic force, Electrostatic force (charged comb attracting paper), Gravitational force', 'Pressure: Force per unit area ($P = F / A$, Pascal/$\\text{N}/\\text{m}^2$)', 'Liquid pressure increasing with depth and equal in all directions at same depth', 'Atmospheric pressure: Otto von Guericke’s Magdeburg hemispheres demonstration'],
          learningObjectives: ['Calculate pressure exerted by solids and liquids', 'Explain why sharp knives cut better than blunt edges using the $P = F/A$ relation'],
          coreFormulas: ['P = \\frac{F}{A}']
        },
        {
          id: 'ch-8-s-9',
          name: 'Friction',
          textbookRef: 'NCERT Science Class 8 — Chapter 9',
          syllabusTopics: ['Friction opposing relative motion between two contact surfaces; Microscopic interlocking of irregularities', 'Factors affecting friction: nature of surfaces (smooth vs rough), weight pressing surfaces together', 'Types of friction: Static friction (maximum value = limiting friction) > Sliding friction > Rolling friction', 'Friction as a necessary evil: enabling walking, writing, braking, but causing wear and tear and heat', 'Methods of increasing friction (treaded tyres, grooved shoe soles) and decreasing friction (lubricants, grease, ball bearings in wheels)', 'Fluid friction (Drag) and streamlining adaptations in birds, fish, aeroplanes'],
          learningObjectives: ['Rank static, sliding, and rolling friction by magnitude', 'Explain fluid aerodynamic streamlining in engineering and biology'],
          coreFormulas: ['\\text{Static Friction} > \\text{Sliding Friction} > \\text{Rolling Friction}']
        },
        {
          id: 'ch-8-s-10',
          name: 'Sound',
          textbookRef: 'NCERT Science Class 8 — Chapter 10',
          syllabusTopics: ['Sound produced by vibrating objects (tuning fork, stretched rubber band, musical strings/membranes)', 'Human voice production: Vocal cords in larynx (voice box)', 'Sound requires a material medium to propagate (Bell jar vacuum experiment proving sound cannot travel in vacuum)', 'Human ear anatomy: Outer ear pinna, ear canal, eardrum (tympanic membrane), middle ear bones, cochlea, auditory nerve', 'Amplitude (loudness $\\propto \\text{Amplitude}^2$, decibels dB) and Frequency (pitch/shrillness, Hertz Hz)', 'Audible range for human ear: 20 Hz to 20,000 Hz; Infrasonic (<20 Hz) vs Ultrasonic (>20,000 Hz)', 'Noise pollution hazards and control measures (silencers, roadside trees)'],
          learningObjectives: ['Explain how human auditory structures transduce acoustic waves into nerve impulses', 'Differentiate between loudness (amplitude) and pitch (frequency)'],
          coreFormulas: ['\\text{Frequency } \\nu = \\frac{\\text{Oscillations}}{\\text{Time (s)}}', '\\text{Loudness} \\propto \\text{Amplitude}^2']
        },
        {
          id: 'ch-8-s-11',
          name: 'Chemical Effects of Electric Current',
          textbookRef: 'NCERT Science Class 8 — Chapter 11',
          syllabusTopics: ['Liquid conductors: solutions of acids, bases, and salts conducting electricity via ions; distilled water as non-conductor', 'Testing conductivity with LED and magnetic compass tester', 'Chemical effects of current: evolution of gas bubbles (William Nicholson 1800 electrolysis of water producing $H_2$ at cathode and $O_2$ at anode), deposit of metals, change of color', 'Electroplating: coating a desired metal onto another using electricity (Copper electroplating on cathode)', 'Applications: Chromium plating on car bumpers/taps for shine and scratch resistance, Gold/Silver plating on jewellery, Zinc galvanization on iron, Tin plating on food cans'],
          learningObjectives: ['Assemble an electrolytic cell to demonstrate water splitting', 'Explain the industrial cathode-anode process of electroplating']
        },
        {
          id: 'ch-8-s-12',
          name: 'Some Natural Phenomena',
          textbookRef: 'NCERT Science Class 8 — Chapter 12',
          syllabusTopics: ['Electric charges: charging by friction (amber, glass rod rubbed with silk gets positive charge; ebonite gets negative charge)', 'Types of charges: Like charges repel, unlike charges attract', 'Gold-leaf electroscope to detect electric charge', 'Lightning: transfer of electric charges between clouds and ground, Benjamin Franklin kite experiment 1752', 'Lightning conductor protection on tall buildings', 'Earthquakes: Tectonic plate boundaries (fault zones/seismic zones), Richter Scale logarithmic magnitude, Seismograph recording, Safety protocols during earthquakes'],
          learningObjectives: ['Explain lightning discharge as massive atmospheric static electricity', 'Interpret Richter scale and implement seismic safety drills']
        },
        {
          id: 'ch-8-s-13',
          name: 'Light',
          textbookRef: 'NCERT Science Class 8 — Chapter 13',
          syllabusTopics: ['Laws of Reflection: Angle of incidence = Angle of reflection ($\\angle i = \\angle r$), Incident ray, reflected ray, and normal lie in the same plane', 'Regular reflection (smooth surface, sharp image) vs Diffuse/Irregular reflection (rough surface, scattered light)', 'Multiple images formed by plane mirrors placed at angle $\\theta$: $n = (360/\\theta) - 1$; Kaleidoscope and Periscope', 'Human Eye anatomy: Cornea, Iris (controls pupil size), Pupil, Crystalline lens, Retina (Rods for dim light, Cones for color vision), Blind spot, Optic nerve', 'Persistence of vision (1/16th of a second enabling motion pictures)', 'Vision defects: Myopia and Hypermetropia; Braille system for visually impaired (Louis Braille 1821, 63 dot patterns)'],
          learningObjectives: ['Prove and apply the laws of reflection in ray diagrams', 'Calculate number of multiple images formed by two inclined mirrors', 'Diagram the optical structure of the human eye and explain rod/cone photoreception'],
          coreFormulas: ['\\angle i = \\angle r', 'n = \\frac{360^\\circ}{\\theta} - 1']
        }
      ]
    },
    {
      id: 'cbse-8-japanese',
      name: 'Japanese (NCERT Sakura / さくら)',
      category: 'Japanese',
      curricula: ['NCERT Japanese Sakura Class 8', 'The Japan Foundation Japanese Curriculum'],
      chapters: [
        {
          id: 'ch-8-jp-1',
          name: 'Lesson 1: かんじ にゅうもん (Kanji Introduction: Numbers, Days, Elements)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 1',
          syllabusTopics: ['Origin of Kanji from pictographs and ideographs', 'On-yomi (Chinese reading) vs Kun-yomi (Japanese reading)', 'Number Kanji: 一 (1) to 十 (10), 百 (100), 千 (1000)', 'Nature Kanji: 日 (Sun/Day), 月 (Moon/Month), 木 (Tree), 水 (Water), 火 (Fire), 土 (Earth), 金 (Gold/Money)', 'Human Kanji: 人 (Person), 年 (Year), 本 (Book/Origin)'],
          learningObjectives: ['Write and read 25 foundational Kanji with correct stroke order and radical structure', 'Differentiate On-yomi and Kun-yomi contexts in compound words']
        },
        {
          id: 'ch-8-jp-2',
          name: 'Lesson 2: てけい (Te-Form of Verbs: Groups 1, 2, 3 Conjugation)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 2',
          syllabusTopics: ['Classification of verbs: Group 1 (Godan), Group 2 (Ichidan), Group 3 (Irregular: Suru, Kuru)', 'Te-form sound change rules for Group 1 (-u, -tsu, -ru -> -tte; -mu, -bu, -nu -> -nde; -ku -> -ite; -gu -> -ide; -su -> -shite)', 'Group 2 te-form (-ru -> -te: Taberu -> Tabete)', 'Group 3 te-form (Suru -> Shite; Kuru -> Kite)', 'Sequence of actions: [Verb 1-te], [Verb 2-te], [Verb 3]'],
          learningObjectives: ['Conjugate any regular Japanese verb into its Te-form without error', 'Connect multiple sequential actions into a fluid compound sentence']
        },
        {
          id: 'ch-8-jp-3',
          name: 'Lesson 3: げんざい しんこうけい (~ています - Present Continuous)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 3',
          syllabusTopics: ['Action in progress: [Verb-te] imasu (e.g. Ima benkyou-shite imasu)', 'Ongoing states: Kekkon-shite imasu (married), Sunde imasu (living in Tokyo), Shitte imasu (know)', 'Asking what someone is doing: Ima nani o shite imasu ka?'],
          learningObjectives: ['Express ongoing continuous activities in speech and writing', 'Distinguish progressive actions from resulting state conditions']
        },
        {
          id: 'ch-8-jp-4',
          name: 'Lesson 4: きょか と きんし (~てもいいです / ~てはいけません - Permission & Rules)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 4',
          syllabusTopics: ['Asking permission politely: Shashin o totte mo ii desu ka? (May I take a photo?)', 'Granting permission: Hai, ii desu yo / Douzo', 'Refusing / Prohibition: Iie, ikemasen / Koko de tabete wa ikemasen (You must not eat here)', 'Understanding public signs and museum rules'],
          learningObjectives: ['Request and grant permission in everyday social scenarios', 'Understand formal prohibitions and negative constraints in Japan']
        },
        {
          id: 'ch-8-jp-5',
          name: 'Lesson 5: けいようしの せつぞく (~くて / ~で - Connecting Adjectives)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 5',
          syllabusTopics: ['Connecting i-adjectives: Drop -i and add -kute (e.g. Kono heya wa hirokute akarui desu)', 'Connecting na-adjectives: Add -de (e.g. Kono machi wa shizuka de kirei desu)', 'Contrasting adjectives using ga: Kono kamera wa takai desu ga, benri desu'],
          learningObjectives: ['Combine multiple descriptive attributes into single sentences', 'Form nuanced comparative descriptions of cities, rooms, and devices']
        },
        {
          id: 'ch-8-jp-6',
          name: 'Lesson 6: みちあんない (Giving Directions: Migi, Hidari, Mae, Ushiro, Tonari)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 6',
          syllabusTopics: ['Spatial directional words: Migi (right), Hidari (left), Mae (front), Ushiro (behind), Tonari (next to), Chikaku (near)', 'Giving turn instructions: Kousaten o migi e magatte kudasai (Please turn right at intersection)', 'Landmark directions: Eki no mae ni honya ga arimasu'],
          learningObjectives: ['Give and follow step-by-step navigational directions in Japanese', 'Describe relative spatial positions of buildings and landmarks']
        },
        {
          id: 'ch-8-jp-7',
          name: 'Lesson 7: にほんの がっこう (School Life in Japan, Bukatsu Clubs, Cleaning)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 7',
          syllabusTopics: ['School year starting in April (Sakura season)', 'Bukatsu (extracurricular sports and cultural club activities after school)', 'Souji (students cleaning their own classrooms and hallways as character building)', 'Kyuushoku (healthy school lunches served and eaten together)'],
          learningObjectives: ['Analyze differences between Japanese and Indian educational traditions', 'Describe club participation and classroom cleaning routines']
        },
        {
          id: 'ch-8-jp-8',
          name: 'Lesson 8: かんじ 2 (Nature, Body & Common Action Kanji)',
          textbookRef: 'NCERT Japanese (Sakura Class 8) — Lesson 8',
          syllabusTopics: ['Body Kanji: 目 (Me - eye), 口 (Kuchi - mouth), 手 (Te - hand), 耳 (Mimi - ear)', 'Movement Kanji: 行 (Iku/Kou - go), 来 (Kuru/Rai - come), 帰 (Kaeru - return)', 'Common adjectives Kanji: 大 (Dai/Oo - big), 小 (Shou/Chii - small), 中 (Chuu/Naka - middle), 上 (Ue - up), 下 (Shita - down)'],
          learningObjectives: ['Write and read 20 intermediate Kanji characters with correct radicals', 'Recognize compound signs such as Chikatetsu (地下鉄), Chuugakkou (中学校), Iriguchi (入り口)']
        }
      ]
    },
    {
      id: 'cbse-8-social-science',
      name: 'Social Science (History, Civics, Geography)',
      category: 'History & Social Studies',
      curricula: ['NCERT Our Pasts III', 'NCERT Resources and Development', 'NCERT Social and Political Life III'],
      chapters: [
        {
          id: 'ch-8-soc-1',
          name: 'History: From Trade to Territory (The Company Establishes Power)',
          textbookRef: 'NCERT Our Pasts III — Chapter 2',
          syllabusTopics: ['East India Company royal charter from Queen Elizabeth I (1600)', 'Battle of Plassey 1757 (Robert Clive defeats Sirajuddaulah)', 'Battle of Buxar 1764 and grant of Diwani rights in Bengal', 'Doctrine of Lapse introduced by Lord Dalhousie (annexing Satara, Sambalpur, Jhansi)', 'Subsidiary Alliance system under Richard Wellesley'],
          learningObjectives: ['Explain how a mercantile trading firm transformed into a sovereign territorial colonial power', 'Analyze the aggressive military and diplomatic annexation strategies of the British']
        },
        {
          id: 'ch-8-soc-2',
          name: 'History: When People Rebel 1857 and After',
          textbookRef: 'NCERT Our Pasts III — Chapter 5',
          syllabusTopics: ['Causes of 1857 Revolt: political, economic exploitation, greased cartridge religious grievance', 'Mangal Pandey in Barrackpore and outbreak in Meerut (May 1857)', 'Leaders of the rebellion: Bahadur Shah Zafar, Rani Lakshmibai of Jhansi, Nana Saheb in Kanpur, Begum Hazrat Mahal in Lucknow, Kunwar Singh in Bihar', 'British suppression and Government of India Act 1858 transferring power from Company to British Crown'],
          learningObjectives: ['Analyze the multidimensional causes and regional spread of the 1857 Great Uprising', 'Evaluate the constitutional transformation from Company rule to the British Raj']
        },
        {
          id: 'ch-8-soc-3',
          name: 'Geography: Resources & Land, Soil, Water',
          textbookRef: 'NCERT Resources and Development — Chapters 1 & 2',
          syllabusTopics: ['Types of resources: Natural, Human-made, and Human resources', 'Sustainable development: conserving resources for future generations', 'Soil profile: Topsoil, subsoil, weathered rock, parent rock; Soil conservation methods (mulching, contour barriers, terrace farming, shelter belts)', 'Global water scarcity and watershed management'],
          learningObjectives: ['Explain principles of sustainable development and resource conservation', 'Formulate soil conservation strategies for hilly and arid terrains']
        },
        {
          id: 'ch-8-soc-4',
          name: 'Geography: Agriculture & Industries',
          textbookRef: 'NCERT Resources and Development — Chapters 4 & 5',
          syllabusTopics: ['Types of farming: Subsistence (shifting cultivation, nomadic herding) vs Commercial (grain farming, mixed farming, plantations: tea, coffee, rubber)', 'Major crops: Rice, Wheat, Millets, Maize, Cotton, Jute', 'Secondary activities: Industrial system (Inputs, Processes, Outputs)', 'Industrial regions (Iron and steel in Jamshedpur and Pittsburgh; Information Technology in Silicon Valley and Bangalore)'],
          learningObjectives: ['Compare labor-intensive subsistence farming with capital-intensive commercial plantations', 'Analyze geographical and infrastructure factors determining industrial location']
        },
        {
          id: 'ch-8-soc-5',
          name: 'Civics: The Indian Constitution & Secularism',
          textbookRef: 'NCERT Social and Political Life III — Chapters 1 & 2',
          syllabusTopics: ['Constituent Assembly (Dr. B. R. Ambedkar as drafting chairman)', 'Key features of Indian Constitution: Federalism, Parliamentary form of government, Separation of powers (Legislature, Executive, Judiciary), Fundamental Rights, Directive Principles', 'Indian Secularism: Principled distance between State and Religion, non-interference and equal protection under Article 25'],
          learningObjectives: ['Articulate the essential democratic pillars of the Indian Constitution', 'Explain the unique positive model of Indian secularism']
        },
        {
          id: 'ch-8-soc-6',
          name: 'Civics: Judiciary & Criminal Justice System',
          textbookRef: 'NCERT Social and Political Life III — Chapters 5 & 6',
          syllabusTopics: ['Independent judiciary as guardian of Fundamental Rights', 'Hierarchy of courts: Supreme Court of India, High Courts, Subordinate/District Courts', 'Public Interest Litigation (PIL) introduced in 1980s by Supreme Court to guarantee access to justice', 'Four key players in Criminal Justice System: Police (investigation and FIR), Public Prosecutor, Defence Lawyer, Judge'],
          learningObjectives: ['Explain the constitutional independence of the judiciary and judicial review', 'Describe the stages of a fair criminal trial under Article 21']
        }
      ]
    },
    {
      id: 'cbse-8-foundation',
      name: 'Foundation & Olympiads (Class 8 STEM & MAT)',
      category: 'Foundation & Olympiads',
      curricula: ['Class 8 IIT-JEE & NEET STEM Foundation', 'NSTSE & National Science Olympiad'],
      chapters: [
        {
          id: 'ch-8-fd-1',
          name: 'Foundation Physics: Forces, Hydrostatics & Viscosity',
          textbookRef: 'Class 8 STEM Foundation — Chapter 1',
          syllabusTopics: ['Vector representation of forces, resolving 2D concurrent forces', 'Fluid pressure: Hydrostatic equation $P = h\\rho g$', 'Pascal’s Principle in hydraulic jacks and brakes: $F_1/A_1 = F_2/A_2$', 'Atmospheric pressure variations with altitude, Torricelli barometer formula', 'Terminal velocity and Stokes Law fluid drag basics'],
          learningObjectives: ['Calculate fluid pressure at various depths in multi-liquid systems', 'Apply Pascal’s principle to hydraulic mechanical advantage problems'],
          coreFormulas: ['P = h \\rho g', '\\frac{F_1}{A_1} = \\frac{F_2}{A_2}']
        },
        {
          id: 'ch-8-fd-2',
          name: 'Foundation Chemistry: Reactivity Series, Extraction & Synthetic Polymers',
          textbookRef: 'Class 8 STEM Foundation — Chapter 2',
          syllabusTopics: ['Activity series of metals ($K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au$)', 'Metal displacement reactions and standard redox potentials', 'Extraction of metals: Reduction with carbon vs electrolytic reduction', 'Thermosetting plastics (Bakelite, Melamine) vs Thermoplastics (PVC, Polythene)'],
          learningObjectives: ['Predict single displacement reaction feasibility using activity series', 'Distinguish polymerization structures of cross-linked vs linear polymers']
        },
        {
          id: 'ch-8-fd-3',
          name: 'Foundation Math: Polynomial Factorisation & Geometry of Circles',
          textbookRef: 'Class 8 Math Olympiad Foundation — Chapter 3',
          syllabusTopics: ['Splitting middle term and grouping method for quadratic expressions $ax^2 + bx + c$', 'Geometry of cyclic quadrilaterals and angle subtended by an arc at center ($2\\theta$)', 'Mensuration 3D: Volume and Total Surface Area of cylinders, cones, and composite solids', 'Olympiad Diophantine equations and integer solutions'],
          learningObjectives: ['Factorize advanced algebraic expressions using substitution and synthetic grouping', 'Prove circle theorem corollaries and calculate composite 3D geometric surfaces'],
          coreFormulas: ['V_{\\text{cylinder}} = \\pi r^2 h', '\\text{TSA}_{\\text{cylinder}} = 2\\pi r(r + h)']
        },
        {
          id: 'ch-8-fd-4',
          name: 'Mental Ability (MAT): Seating Arrangements, Cubes & Clocks',
          textbookRef: 'Class 8 NTSE & MAT Guide — Chapter 4',
          syllabusTopics: ['Linear and circular seating arrangements with multi-variable constraints', 'Cube painted faces analysis: $N = n^3$, 3-faces painted = 8, 2-faces = $12(n-2)$, 1-face = $6(n-2)^2$', 'Clock hand angle formula: $\\theta = |30H - 5.5M|$ and calendar day determination algorithms'],
          learningObjectives: ['Solve complex multi-clue circular seating arrangement logic puzzles', 'Calculate exact angles between hour and minute hands at any specified time'],
          coreFormulas: ['\\theta = |30H - 5.5M|']
        }
      ]
    },
    {
      id: 'cbse-8-hindi',
      name: 'Hindi (वसंत भाग 3)',
      category: 'Hindi',
      curricula: ['NCERT Vasant Class 8', 'CBSE Hindi Course A & B'],
      chapters: [
        {
          id: 'ch-8-h-1',
          name: 'ध्वनि',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 1',
          syllabusTopics: ['सूर्यकांत त्रिपाठी "निराला" की आशावादी कविता', 'अभी न होगा मेरा अंत, मृदुल वसंत का आगमन', 'युवा पीढ़ी में नव-उत्साह और आलस्य का त्याग', 'प्रतीकात्मकता'],
          learningObjectives: ['निराला के आशावादी जीवन-दर्शन को समझना', 'काव्य में प्रकृति प्रतीकों की व्याख्या करना'],
        },
        {
          id: 'ch-8-h-2',
          name: 'लाख की चूड़ियाँ',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 2',
          syllabusTopics: ['कामतानाथ की प्रसिद्ध कहानी', 'बदलू मनिहार और पारंपरिक हस्तशिल्प', 'मशीनी युग के कारण कुटीर उद्योगों का उजड़ना और कारीगरों की लाचारी'],
          learningObjectives: ['मशीनीकरण के सामाजिक व आर्थिक प्रभावों का विश्लेषण करना', 'हस्तशिल्पियों के प्रति सम्मानजनक दृष्टिकोण विकसित करना'],
        },
        {
          id: 'ch-8-h-3',
          name: 'बस की यात्रा',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 3',
          syllabusTopics: ['हरिशंकर परसाई का प्रसिद्ध व्यंग्य निबंध', 'खटारा बस में यात्रा और प्रांतीय परिवहन तंत्र की बदहाली पर कटाक्ष', 'गांधी जी के असहयोग व सविनय अवज्ञा आंदोलन के रूपक'],
          learningObjectives: ['व्यंग्य विधा के माध्यम से सामाजिक व प्रशासनिक विसंगतियों की पहचान करना'],
        },
        {
          id: 'ch-8-h-4',
          name: 'दीवानों की हस्ती',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 4',
          syllabusTopics: ['भगवतीचरण वर्मा की कविता', 'मस्तमौला, बेपरवाह और बलिदानी देशभक्तों का स्वभाव', 'सुख-दुख को समान भाव से स्वीकार करना, प्यार लुटाना'],
          learningObjectives: ['सच्चे देशभक्तों के निःस्वार्थ समर्पण और उल्लासपूर्ण मनोवृत्ति को समझना'],
        },
        {
          id: 'ch-8-h-5',
          name: 'चिट्ठियों की अनूठी दुनिया',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 5',
          syllabusTopics: ['अरविंद कुमार सिंह का निबंध', 'पत्रों का ऐतिहासिक, सांस्कृतिक और साहित्यिक महत्व', 'एसएमएस, ईमेल बनाम हस्तलिखित पत्रों की आत्मीयता व धरोहर'],
          learningObjectives: ['पत्र संस्कृति के ऐतिहासिक विकास व पत्रों की कालजयी महत्ता को समझना'],
        },
        {
          id: 'ch-8-h-6',
          name: 'भगवान के डाकिए',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 6',
          syllabusTopics: ['रामधारी सिंह "दिनकर" की विश्वबंधुत्वपरक कविता', 'पक्षी और बादल — भगवान के डाकिए', 'एक देश से दूसरे देश बिना सीमाओं की परवाह किए सुगंध और वर्षा का संदेश ले जाना'],
          learningObjectives: ['वसुधैव कुटुंबकम् और भौगोलिक सीमाओं से परे वैश्विक शांति की भावना अपनाना'],
        },
        {
          id: 'ch-8-h-7',
          name: 'क्या निराश हुआ जाए',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 7',
          syllabusTopics: ['आचार्य हजारीप्रसाद द्विवेदी का निबंध', 'समाचार पत्रों में चोरी, भ्रष्टाचार और निराशा का माहौल', 'सच्चाई, ईमानदारी और मानवीय मूल्यों की शाश्वत शक्ति'],
          learningObjectives: ['निराशावादी माहौल में भी नैतिक मूल्यों में अडिग विश्वास बनाए रखना'],
        },
        {
          id: 'ch-8-h-8',
          name: 'कबीर की साखियाँ',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 8',
          syllabusTopics: ['कबीरदास की सधुक्कड़ी भाषा की साखियाँ', 'जाति न पूछो साध की पूछ लीजिए ज्ञान', 'माला तो कर में फिरै, जीभि फिरै मुख माँहि (ढोंग का खंडन)'],
          learningObjectives: ['बाह्याडंबरों का त्याग कर अंतर्मन की शुद्धि और ज्ञान को प्राथमिकता देना'],
        },
        {
          id: 'ch-8-h-9',
          name: 'जहाँ पहिया है',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 9',
          syllabusTopics: ['पी. साईनाथ की रिपोर्ताज', 'तमिलनाडु के पुडुकोट्टई जिले में महिलाओं द्वारा साइकिल चलाना आंदोलन बनना', 'महिला सशक्तिकरण, गतिशीलता, आर्थिक आत्मनिर्भरता और स्वाभिमान'],
          learningObjectives: ['रूढ़िवादी बंधनों को तोड़कर महिला सशक्तिकरण की प्रेरक वास्तविक गाथा का अध्ययन'],
        },
        {
          id: 'ch-8-h-10',
          name: 'बाज और साँप',
          textbookRef: 'NCERT वसंत भाग 3 — पाठ 10',
          syllabusTopics: ['निर्मल वर्मा की बोधकथा', 'गुफा के अंधेरे और सड़ांध में सुरक्षित रहने वाला कायर साँप', 'खून से लथपथ होने पर भी खुले आकाश में उड़ने को आतुर वीर बाज', 'साहस और संघर्ष'],
          learningObjectives: ['कायरतापूर्ण सुरक्षित जीवन की तुलना में साहसी व संघर्षपूर्ण जीवन की श्रेष्ठता समझना'],
        }
      ]
    },
    {
      id: 'cbse-8-marathi',
      name: 'Marathi (सुलभभारती / अक्षरभारती इयत्ता ८ वी)',
      category: 'Marathi',
      curricula: ['Maharashtra State / NCERT Marathi Class 8', 'सुलभभारती इयत्ता आठवी'],
      chapters: [
        {
          id: 'ch-8-mr-1',
          name: 'भारत देश महान (गीत)',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ १',
          syllabusTopics: ['माधव विचारे यांचे ओजस्वी राष्ट्रगीत', 'हिमालयाची शिखरे, गंगा-यमुनेचे पावन प्रवाह आणि भारताची अखंड एकात्मता'],
          learningObjectives: ['राष्ट्रीय एकात्मता आणि मातृभूमीचा गौरव समजणे'],
        },
        {
          id: 'ch-8-mr-2',
          name: 'मी चित्रकार कसा झालो!',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ २',
          syllabusTopics: ['ल. म. कडू यांचे आत्मचरित्रात्मक रेखाचित्र', 'साधने नसताना निसर्गातील दगड, माती, झाडांचे डिंक व वनस्पतींच्या रंगांतून चित्रकला शिकणे', 'प्रतिकूल परिस्थितीतही कलेची जोपासना'],
          learningObjectives: ['निसर्गातून शिकण्याची व सर्जनशीलता फुलवण्याची दृष्टी मिळवणे'],
        },
        {
          id: 'ch-8-mr-3',
          name: 'प्रभात (कविता)',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ३',
          syllabusTopics: ['किशोर पाठक यांची कविता', 'विज्ञानाचे नवे युग आणि तंत्रज्ञानाची नवी क्षितिजे', 'ज्ञानाची नवीन पहाट, भेदाभेद मिटवून प्रगतीकडे वाटचाल'],
          learningObjectives: ['वैज्ञानिक दृष्टिकोन व नवयुगातील बदलांचे स्वागत करणे'],
        },
        {
          id: 'ch-8-mr-4',
          name: 'आपण सारे एक!',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ४',
          syllabusTopics: ['मनीषा रेगे यांची एकांकिका', 'शरीराच्या अवयवांचा (हात, पाय, कान, डोळे, जीभ) पोटाविरुद्ध संप', 'पोटाला काम न करता खाणारा समजून अन्न न देणे आणि नंतर सर्वांचे दुर्बल होणे', 'सहकार्य व श्रमविभागणी'],
          learningObjectives: ['शरीराप्रमाणे समाजातही सर्वांच्या एकजुटीचे व परस्परपूरकतेचे महत्त्व जाणणे'],
        },
        {
          id: 'ch-8-mr-5',
          name: 'चोच आणि चारा',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ५',
          syllabusTopics: ['मकरंद जोशी यांचा पर्यावरणपर पाठ', 'पक्षीजगतातील वैविध्य, चोचींची विविध कार्ये (शिकार, घरटे बांधणे, अन्न तोडणे)', 'उत्क्रांती व निसर्गाचे संतुलन'],
          learningObjectives: ['जैवविविधता व पक्षी निरीक्षणाचे कौशल्य संपादन करणे'],
        },
        {
          id: 'ch-8-mr-6',
          name: 'आभाळाची आम्ही लेकरे',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ६',
          syllabusTopics: ['वसंत बापट यांचे समतावादी गीत', 'शेतकरी, कष्टकरी लोकांची समता आणि बंधुभाव', 'जात, धर्म न मानणारे श्रमिकांचे विशाल मन'],
          learningObjectives: ['श्रमप्रतिष्ठा व सामाजिक समतेची मूल्ये अंगीकारणे'],
        },
        {
          id: 'ch-8-mr-7',
          name: 'नातवंडांस पत्र',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ७',
          syllabusTopics: ['नंदा खरे यांचे मार्गदर्शनपर पत्र', 'निसर्गाच्या सान्निध्यात राहणे, पुस्तके वाचणे, मैदानी खेळ खेळणे आणि मोबाईल-टीव्हीच्या आहारी न जाणे'],
          learningObjectives: ['शारीरिक सुदृढता, वाचनसंस्कृती आणि संतुलित जीवनशैली आत्मसात करणे'],
        },
        {
          id: 'ch-8-mr-8',
          name: 'आम्ही हवे आहोत का?',
          textbookRef: 'सुलभभारती इयत्ता ८ वी — पाठ ८',
          syllabusTopics: ['शांता शेळके यांचा ललित पाठ', 'प्राण्यांच्या इस्पितळाची (Animal Hospital) भेट', 'आजारी, मुके कुत्रे-मांजरे यांची माणसाकडे असणारी प्रेमाची व काळजीची भुकेली नजर'],
          learningObjectives: ['प्राणिमात्र आणि मुक्या जीवांप्रती भूतदया व संवेदनशीलता बाळगणे'],
        }
      ]
    },
    {
      id: 'cbse-8-english',
      name: 'English (Honeydew & It So Happened)',
      category: 'English & Languages',
      curricula: ['NCERT Honeydew Class 8', 'NCERT It So Happened Supplementary'],
      textbookName: 'Honeydew & It So Happened (NCERT Class 8)',
      edition: '2025–2026 NEP Edition',
      chapters: [
        {
          id: 'ch-8-en-1',
          name: 'The Best Christmas Present in the World',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 1',
          syllabusTopics: ['Michael Morpurgo’s story of Christmas truce (1914 World War I)', 'Letter from Jim Macpherson to Connie found in roll-top desk', 'No Man’s Land: British and German soldiers playing football and sharing schnapps'],
          learningObjectives: ['Analyze themes of brotherhood and the futility of war against human compassion']
        },
        {
          id: 'ch-8-en-2',
          name: 'The Tsunami',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 2',
          syllabusTopics: ['Real survival accounts from 26 December 2004 Indian Ocean Tsunami', 'Ignesious in Andaman, Sanjeev the brave policeman, 10-year-old Tilly Smith saving tourists in Thailand', 'Animal sixth sense before natural calamities'],
          learningObjectives: ['Understand natural disasters, alertness, presence of mind, and animal behavior']
        },
        {
          id: 'ch-8-en-3',
          name: 'Glimpses of the Past',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 3',
          syllabusTopics: ['S.D. Sawant’s pictorial historical narrative (1757 to 1857)', 'East India Company trade expansion, social evils, Raja Ram Mohan Roy, British oppression (Regulation III)', 'Discontent among farmers and sepoys leading to the 1857 War of Independence'],
          learningObjectives: ['Interpret historical events presented through visual and graphic narrative media']
        },
        {
          id: 'ch-8-en-4',
          name: 'Bepin Choudhury’s Lapse of Memory',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 4',
          syllabusTopics: ['Satyajit Ray’s psychological suspense tale', 'Bepin Babu being tricked into believing he visited Ranchi in 1958', 'Chunilal’s clever, harmless revenge for being denied financial help in adversity'],
          learningObjectives: ['Appreciate subtle irony, character psychology, and comedic narrative structure']
        },
        {
          id: 'ch-8-en-5',
          name: 'The Summit Within',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 5',
          syllabusTopics: ['Major H.P.S. Ahluwalia’s expedition to Mount Everest (1965)', 'Climbing physical peaks vs scaling the internal mental summit within the human soul', 'Endurance, persistence, and willpower as spiritual forces'],
          learningObjectives: ['Reflect on self-conquest, humility, and philosophical dimensions of human adventure']
        },
        {
          id: 'ch-8-en-6',
          name: 'This is Jody’s Fawn',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 6',
          syllabusTopics: ['Marjorie Kinnan Rawlings’ emotional story', 'Jody’s father Penny bitten by rattlesnake; doe killed to use liver to draw poison', 'Jody’s moral responsibility to find, rescue, and nurse the motherless baby fawn'],
          learningObjectives: ['Evaluate ethical responsibility, debt of gratitude, and empathy for wildlife']
        },
        {
          id: 'ch-8-en-7',
          name: 'A Short Monsoon Diary',
          textbookRef: 'NCERT Honeydew Class 8 — Unit 7',
          syllabusTopics: ['Ruskin Bond’s lyrical nature journal from Mussoorie', 'Silent white mist, singing whistling thrush, blooming wild balsams and dahlias', 'Seasonal transformation and intimacy with the Himalayan monsoon ecology'],
          learningObjectives: ['Analyze descriptive personal nature diary writing and evocative sensory imagery']
        },
        {
          id: 'ch-8-en-8',
          name: 'The Ant and the Cricket & Geography Lesson (Poems)',
          textbookRef: 'NCERT Honeydew Class 8 — Poetry',
          syllabusTopics: ['Aesop’s fable: industrious ant versus carefree singing cricket ("folks call this a fable, I’ll warrant it true")', 'Zulfikar Ghose’s "Geography Lesson": jet aircraft climbing to 10,000 feet showing why cities developed by rivers and why humans hate each other across borders'],
          learningObjectives: ['Appreciate didactic allegorical poetry and geographical perspective on human unity']
        }
      ]
    },
    {
      id: 'cbse-8-sanskrit',
      name: 'Sanskrit (रुचिरा तृतीयो भागः)',
      category: 'Sanskrit',
      curricula: ['NCERT Ruchira Class 8', 'CBSE Sanskrit Course'],
      textbookName: 'रुचिरा तृतीयो भागः (NCERT Class 8)',
      edition: '2025–2026 NEP Edition',
      chapters: [
        {
          id: 'ch-8-sk-1',
          name: 'सुभाषितानि',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ १',
          syllabusTopics: ['गुणा गुणज्ञेषु गुणा भवन्ति', 'साहित्यसङ्गीतकलाविहीनः साक्षात्पशुः पुच्छविषाणहीनः', 'लुब्धस्य नश्यति यशः पिशुनस्य मैत्री'],
          learningObjectives: ['संस्कृत सूक्तीनां कण्ठस्थीकरणम् चरित्रनिर्माणं च']
        },
        {
          id: 'ch-8-sk-2',
          name: 'बिलस्य वाणी न कदापि मे श्रुता',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ २',
          syllabusTopics: ['पञ्चतन्त्रस्य कथा — खरनखरः सिंहः दधिपुच्छः शृगालश्च', 'गुहायाः पुरतः सिंहपदपद्धतिं दृष्ट्वा शृगालस्य समयसूचकता', 'अनागतं यः कुरुते स शोभते'],
          learningObjectives: ['आपत्काले बुद्धेः प्रयोगः कथाकौशलं च']
        },
        {
          id: 'ch-8-sk-3',
          name: 'डिजीभारतम् (Digital India)',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ३',
          syllabusTopics: ['डिजिटल इण्डिया इत्याख्यायाः चर्चा', 'कागदस्य उद्योगे वृक्षाणां कर्तनं न्यूनीभवति', 'चलदूरभाषयन्त्रेण (Mobile) सर्वकार्याणां सिद्धिः'],
          learningObjectives: ['आधुनिक प्रविधेः संवादे संस्कृतस्य समर्थताज्ञानम्']
        },
        {
          id: 'ch-8-sk-4',
          name: 'सदैव पुरतो निधेहि चरणम्',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ४',
          syllabusTopics: ['श्रीधर भास्कर वर्णेकरस्य प्रेरणागीतम्', 'चल चल पुरतो निधेहि चरणम् सदैव पुरतो निधेहि चरणम्', 'गिरिशिखरे ननु निजनिकेतनम्, बलं स्वकीयं भवति साधनम्'],
          learningObjectives: ['राष्ट्रभक्तेः आत्मबलस्य च विकासः']
        },
        {
          id: 'ch-8-sk-5',
          name: 'कण्टकेनैव कण्टकम्',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ५',
          syllabusTopics: ['मध्यप्रदेशस्य डिण्डोरी-मण्डले लोककथा', 'चञ्चलो नाम व्याधः व्याघ्रश्च, लोमशिकायाः चतुराई', 'धूर्तेन सह धूर्तता एव फलवती भवति'],
          learningObjectives: ['लोककथामाध्यमेन व्यवहारकुशलतायाः बोधः']
        },
        {
          id: 'ch-8-sk-6',
          name: 'गृहं शून्यं सुतां विना',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ६',
          syllabusTopics: ['कन्या भ्रूणहत्या निवारणम्, "बेटी बचाओ बेटी पढ़ाओ"', 'राकेशस्य मालायाश्च संवादः, भगिन्याः शालिन्याः प्रबोधनम्', 'यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः'],
          learningObjectives: ['लैङ्गिकसमानतायाः सामाजिकचेतनायाः च संवर्धनम्']
        },
        {
          id: 'ch-8-sk-7',
          name: 'सावित्री बाई फुले',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ७',
          syllabusTopics: ['भारते महिलाशिक्षायाः प्रथमा शिक्षिका सावित्री बाई फुले', 'पुणे नगरे १८४८ तमे वर्षे कन्यानां कृते प्रथमविद्यालयः', 'सामाजिक कुरीतीनां प्रहाराणां च सहनम् दृढनिश्चयश्च'],
          learningObjectives: ['ऐतिहासिक समाजसुधारकानां त्यागात् प्रेरणा ग्रहणम्']
        },
        {
          id: 'ch-8-sk-8',
          name: 'आर्यभटः',
          textbookRef: 'NCERT रुचिरा भाग ३ — पाठ ८',
          syllabusTopics: ['प्राचीन भारतस्य महान् गणितज्ञः खगोलशास्त्री च आर्यभटः', 'पृथ्वी स्थिरा नास्ति स्वकीये अक्षे घूर्णति इति प्रतिपादनम्', 'शून्यस्य आविष्कारः, सूर्यग्रहण-चन्द्रग्रहणयोः वैज्ञानिकं कारणम्'],
          learningObjectives: ['प्राचीनभारतीय वैज्ञानिकपरम्परायाः गौरवबोधः']
        }
      ]
    }
  ]
};
