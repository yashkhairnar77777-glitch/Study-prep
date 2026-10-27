import { SyllabusClassInfo } from './types';

export const cbseClass7: SyllabusClassInfo = {
  id: 'cbse-class-7',
  name: 'Class 7 (Middle School)',
  gradeEquivalent: 'Class 6-8 (Middle School)',
  subjects: [
    {
      id: 'cbse-7-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 7', 'NCERT Exemplar Class 7'],
      chapters: [
        {
          id: 'ch-7-m-1',
          name: 'Integers',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 1',
          syllabusTopics: ['Properties of addition and subtraction of integers (closure, commutative, associative, additive identity)', 'Multiplication of integers and sign rules', 'Properties of multiplication: distributive property over addition', 'Division of integers and properties of division'],
          learningObjectives: ['Apply integer multiplication and division sign laws accurately', 'Utilize distributive property $a \\times (b + c) = ab + ac$ in mental evaluation'],
          coreFormulas: ['(-a) \\times (-b) = a \\times b', 'a \\times (b + c) = ab + ac']
        },
        {
          id: 'ch-7-m-2',
          name: 'Fractions and Decimals',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 2',
          syllabusTopics: ['Multiplication of a fraction by a whole number and by another fraction', 'Fraction as an operator "of"', 'Reciprocal of a fraction and division of fractions', 'Multiplication and division of decimal numbers by 10, 100, 1000 and decimals by decimals'],
          learningObjectives: ['Multiply and divide proper, improper, and mixed fractions', 'Compute multi-step decimal divisions with precision'],
          coreFormulas: ['\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}']
        },
        {
          id: 'ch-7-m-3',
          name: 'Data Handling',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 3',
          syllabusTopics: ['Representative values: Arithmetic Mean ($x = \\sum x / n$), Range', 'Mode of a dataset (most frequent observation)', 'Median (middle value after arranging data in ascending order)', 'Double bar graphs to compare two sets of observations simultaneously', 'Probability as chance of an event ($0 \\le P \\le 1$)'],
          learningObjectives: ['Calculate Mean, Median, and Mode for discrete distributions', 'Construct and interpret comparative double bar graphs'],
          coreFormulas: ['\\text{Arithmetic Mean} = \\frac{\\text{Sum of Observations}}{\\text{Total Number of Observations}}', '\\text{Range} = \\text{Max} - \\text{Min}']
        },
        {
          id: 'ch-7-m-4',
          name: 'Simple Equations',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 4',
          syllabusTopics: ['Setting up an equation from verbal word problems', 'Solving equations by systematic transposition of terms', 'Applications of simple equations to practical life problems'],
          learningObjectives: ['Transpose terms from LHS to RHS with appropriate sign inversion', 'Translate age, perimeter, and coin word problems into algebraic equations'],
          coreFormulas: ['ax + b = c \\implies x = \\frac{c - b}{a}']
        },
        {
          id: 'ch-7-m-5',
          name: 'Lines and Angles',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 5',
          syllabusTopics: ['Complementary angles (sum = 90°) and Supplementary angles (sum = 180°)', 'Adjacent angles, Linear pair axiom, Vertically opposite angles', 'Pairs of lines: Intersecting lines, Transversal of parallel lines', 'Angles made by a transversal: Corresponding angles, Alternate interior/exterior angles, Interior angles on same side sum to 180°'],
          learningObjectives: ['Identify complementary and supplementary angle relationships', 'Determine missing angle measurements in parallel transversal configurations'],
          coreFormulas: ['\\angle 1 + \\angle 2 = 90^\\circ \\text{ (Complementary)}', '\\angle 1 + \\angle 2 = 180^\\circ \\text{ (Supplementary)}']
        },
        {
          id: 'ch-7-m-6',
          name: 'The Triangle and Its Properties',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 6',
          syllabusTopics: ['Medians and Altitudes of a triangle', 'Exterior angle property of a triangle: Exterior angle = Sum of two opposite interior angles', 'Angle sum property: Sum of all 3 interior angles = 180°', 'Triangle inequality property: Sum of lengths of any two sides > third side', 'Right-angled triangles and Pythagoras Property ($a^2 + b^2 = c^2$)'],
          learningObjectives: ['Prove and apply the exterior angle theorem and angle sum property', 'Verify whether side lengths can form a valid triangle using triangle inequality', 'Apply Pythagoras theorem to find hypotenuse or perpendicular sides'],
          coreFormulas: ['\\angle \\text{Ext} = \\angle 1 + \\angle 2', '\\text{Hypotenuse}^2 = \\text{Base}^2 + \\text{Perpendicular}^2']
        },
        {
          id: 'ch-7-m-7',
          name: 'Comparing Quantities',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 7',
          syllabusTopics: ['Equivalent ratios and Unitary method', 'Percentage: meaning and conversion to/from fractions and decimals', 'Percentage increase and decrease', 'Cost Price (CP), Selling Price (SP), Profit/Loss percentage', 'Simple Interest ($SI = PRT/100$) and Total Amount ($A = P + SI$)'],
          learningObjectives: ['Calculate percentage increase or decrease in quantities', 'Compute profit/loss percentage and simple interest on loans'],
          coreFormulas: ['\\text{Profit \\%} = \\frac{\\text{Profit}}{\\text{CP}} \\times 100', 'SI = \\frac{P \\times R \\times T}{100}', 'A = P + SI']
        },
        {
          id: 'ch-7-m-8',
          name: 'Rational Numbers',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 8',
          syllabusTopics: ['Definition of rational numbers as $p/q$ ($q \\ne 0$)', 'Positive and negative rational numbers on number line', 'Equivalent rational numbers and standard form (HCF of p, q = 1)', 'Comparing rational numbers and finding rational numbers between two given numbers', 'Operations (+, -, x, /) on rational numbers'],
          learningObjectives: ['Represent positive and negative rational numbers on number line', 'Find infinite rational numbers between any two rational endpoints'],
          coreFormulas: ['\\frac{p}{q} + \\frac{r}{s} = \\frac{ps + qr}{qs}']
        },
        {
          id: 'ch-7-m-9',
          name: 'Perimeter and Area',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 9',
          syllabusTopics: ['Area of Parallelogram: $\\text{Base} \\times \\text{Height}$', 'Area of Triangle: $\\frac{1}{2} \\times \\text{Base} \\times \\text{Height}$', 'Circumference of Circle: $2\\pi r = \\pi d$', 'Area of Circle: $\\pi r^2$ ($ \\pi \\approx 22/7 $)', 'Area of paths, verandas, and borders around rectangular fields'],
          learningObjectives: ['Derive and apply area formulas for parallelograms and triangles', 'Calculate circumference and circular area accurately', 'Solve path area problems by finding difference of outer and inner rectangles'],
          coreFormulas: ['\\text{Area of } \\triangle = \\frac{1}{2} b h', '\\text{Area of Parallelogram} = b h', 'C = 2\\pi r', 'A = \\pi r^2']
        },
        {
          id: 'ch-7-m-10',
          name: 'Algebraic Expressions',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 10',
          syllabusTopics: ['Terms, factors, and numerical coefficients of expressions', 'Monomials, Binomials, Trinomials, and Polynomials', 'Like terms (same algebraic factors) vs Unlike terms', 'Addition and subtraction of algebraic expressions', 'Finding the value of an expression for given variable values'],
          learningObjectives: ['Combine like terms to simplify complex multi-variable expressions', 'Evaluate algebraic polynomials for given numerical values']
        },
        {
          id: 'ch-7-m-11',
          name: 'Exponents and Powers',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 11',
          syllabusTopics: ['Exponential notation: base and exponent', 'Laws of Exponents: $a^m \\times a^n = a^{m+n}$, $a^m / a^n = a^{m-n}$, $(a^m)^n = a^{mn}$, $a^m \\times b^m = (ab)^m$', 'Zero exponent ($a^0 = 1$)', 'Expressing large numbers in scientific standard notation ($k \\times 10^n$)'],
          learningObjectives: ['Simplify exponential expressions using index laws', 'Write astronomical and microscopic measurements in scientific notation'],
          coreFormulas: ['a^m \\times a^n = a^{m+n}', '\\frac{a^m}{a^n} = a^{m-n}', '(a^m)^n = a^{mn}', 'a^0 = 1']
        },
        {
          id: 'ch-7-m-12',
          name: 'Symmetry',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 12',
          syllabusTopics: ['Lines of symmetry for regular polygons', 'Rotational symmetry: Center of rotation, Angle of rotation, Order of rotational symmetry', 'Figures having both line symmetry and rotational symmetry (square, equilateral triangle, circle)'],
          learningObjectives: ['Calculate the order and angle of rotational symmetry for plane figures', 'Identify figures possessing order of rotational symmetry greater than 1']
        },
        {
          id: 'ch-7-m-13',
          name: 'Visualising Solid Shapes',
          textbookRef: 'NCERT Mathematics Class 7 — Chapter 13',
          syllabusTopics: ['2D representations of 3D solids: Faces, Edges, and Vertices', 'Euler’s formula for polyhedra: $F + V - E = 2$', 'Nets for building 3D solids (cubes, cylinders, cones, pyramids)', 'Oblique sketches vs Isometric sketches on dot paper', 'Viewing sections of solids: cutting/slicing and shadow casting'],
          learningObjectives: ['Verify Euler’s formula for standard polyhedral shapes', 'Draw isometric sketches of multi-cube solid configurations'],
          coreFormulas: ['F + V - E = 2 \\text{ (Euler’s Formula)}']
        }
      ]
    },
    {
      id: 'cbse-7-science',
      name: 'Science',
      category: 'General Science',
      curricula: ['NCERT Science Class 7', 'NCERT Exemplar Class 7'],
      chapters: [
        {
          id: 'ch-7-s-1',
          name: 'Nutrition in Plants',
          textbookRef: 'NCERT Science Class 7 — Chapter 1',
          syllabusTopics: ['Autotrophic nutrition: Photosynthesis biochemical equation', 'Chloroplasts, chlorophyll, stomata and guard cell function', 'Heterotrophic plants: Parasites (Cuscuta), Saprotrophs (Fungi), Insectivorous (Pitcher plant), Symbiosis (Lichens, Rhizobium in legumes)', 'Replenishment of nutrients in soil'],
          learningObjectives: ['Write and explain the balanced photosynthesis equation', 'Differentiate parasitic, saprophytic, and symbiotic nutritional modes'],
          coreFormulas: ['6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light, Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2']
        },
        {
          id: 'ch-7-s-2',
          name: 'Nutrition in Animals',
          textbookRef: 'NCERT Science Class 7 — Chapter 2',
          syllabusTopics: ['Five stages of holozoic nutrition: Ingestion, Digestion, Absorption, Assimilation, Egestion', 'Human alimentary canal: Mouth (salivary amylase), Oesophagus (peristalsis), Stomach (HCl, pepsin), Small intestine (villi, bile from liver, pancreatic juice), Large intestine', 'Dental formula and tooth decay', 'Digestion in ruminants (rumen, cud chewing, cellulose fermentation)', 'Feeding in Amoeba (pseudopodia, food vacuole)'],
          learningObjectives: ['Trace enzymatic digestion across human gastrointestinal tract', 'Explain cellulose digestion in grass-eating ruminants']
        },
        {
          id: 'ch-7-s-3',
          name: 'Heat',
          textbookRef: 'NCERT Science Class 7 — Chapter 3',
          syllabusTopics: ['Heat vs Temperature; Clinical thermometer (35°C to 42°C, kink prevents mercury backflow) vs Laboratory thermometer (-10°C to 110°C)', 'Conduction in solids: conductors vs insulators', 'Convection in fluids: Sea breeze and Land breeze circulation', 'Radiation: emission and absorption of infrared thermal radiation, dark vs light clothes in summer and winter'],
          learningObjectives: ['Read clinical and laboratory thermometers with correct calibration', 'Explain coastal sea and land breezes using convective air currents']
        },
        {
          id: 'ch-7-s-4',
          name: 'Acids, Bases and Salts',
          textbookRef: 'NCERT Science Class 7 — Chapter 4',
          syllabusTopics: ['Natural organic acids (acetic, citric, lactic, tartaric, oxalic) vs mineral acids', 'Bases and alkalis: soapy touch and bitter taste', 'Natural indicators: Litmus paper (lichen extract), Turmeric, China rose indicator; Phenolphthalein synthetic indicator', 'Neutralization reaction: Acid + Base -> Salt + Water + Heat', 'Real-life neutralization: Antacids for acidity, calamine for ant bites, agricultural liming, industrial effluent treatment'],
          learningObjectives: ['Identify solutions as acidic, basic, or neutral using indicators', 'Write chemical word equations for neutralization reactions'],
          coreFormulas: ['\\text{Acid} + \\text{Base} \\to \\text{Salt} + \\text{Water} + \\text{Heat}']
        },
        {
          id: 'ch-7-s-5',
          name: 'Physical and Chemical Changes',
          textbookRef: 'NCERT Science Class 7 — Chapter 5',
          syllabusTopics: ['Physical changes (reversible, no new substance, change in state/shape/size)', 'Chemical changes (irreversible, new substance formed, heat/gas/color change)', 'Rusting of iron ($4\\text{Fe} + 3\\text{O}_2 + 2x\\text{H}_2\\text{O} \\to 2\\text{Fe}_2\\text{O}_3\\cdot x\\text{H}_2\\text{O}$) and prevention: painting, greasing, galvanization with zinc', 'Burning of magnesium ribbon, reaction of copper sulphate with iron, crystallization of copper sulphate'],
          learningObjectives: ['Distinguish physical from chemical transformations', 'Explain rusting prevention via galvanization']
        },
        {
          id: 'ch-7-s-6',
          name: 'Respiration in Organisms',
          textbookRef: 'NCERT Science Class 7 — Chapter 6',
          syllabusTopics: ['Aerobic respiration ($C_6H_{12}O_6 + 6O_2 \\to 6CO_2 + 6H_2O + 38\\text{ ATP}$) vs Anaerobic respiration in yeast (alcohol fermentation) and in human muscle cells (lactic acid causing cramps)', 'Breathing mechanism in humans: diaphragm and ribcage movement, inhalation and exhalation', 'Respiration in other organisms: Earthworm (moist skin), Fish (gills), Cockroach (spiracles and tracheae), Plants (stomata and root hairs)'],
          learningObjectives: ['Compare aerobic respiration with anaerobic fermentation', 'Explain the physical mechanics of breathing via diaphragm movement'],
          coreFormulas: ['\\text{Lactic Acid Equation: Glucose} \\to \\text{Lactic Acid} + \\text{Energy (in muscles)}']
        },
        {
          id: 'ch-7-s-7',
          name: 'Transportation in Animals and Plants',
          textbookRef: 'NCERT Science Class 7 — Chapter 7',
          syllabusTopics: ['Human circulatory system: Blood (plasma, RBCs with hemoglobin, WBCs, platelets)', 'Blood vessels: Arteries (thick walls, high pressure, oxygenated except pulmonary artery) vs Veins (valves, deoxygenated except pulmonary vein), Capillaries', 'Human heart anatomy: 4 chambers (right/left atria and ventricles), double circulation, pulse rate (72-80 bpm), stethoscope', 'Human excretory system: Kidneys (nephrons), ureters, urinary bladder, urethra; dialysis', 'Vascular transport in plants: Xylem (water and minerals, suction pull by transpiration) and Phloem (translocation of food)'],
          learningObjectives: ['Trace blood flow path through the 4 heart chambers', 'Explain how transpiration generates suction pull in tall trees']
        },
        {
          id: 'ch-7-s-8',
          name: 'Reproduction in Plants',
          textbookRef: 'NCERT Science Class 7 — Chapter 8',
          syllabusTopics: ['Asexual reproduction: Vegetative propagation (stem cuttings in rose, potato eyes, Bryophyllum leaf buds), Budding in yeast, Fragmentation in Spirogyra, Spore formation in bread mould and ferns', 'Sexual reproduction: Flower as reproductive organ, Unisexual vs Bisexual flowers', 'Pollination: Self-pollination vs Cross-pollination (wind, water, insect vectors)', 'Fertilization: Pollen tube growth, zygote formation, embryo', 'Fruit and seed development, seed dispersal adaptations'],
          learningObjectives: ['Compare sexual and asexual reproductive modes in flora', 'Describe fertilization and seed dispersal mechanisms']
        },
        {
          id: 'ch-7-s-9',
          name: 'Motion and Time',
          textbookRef: 'NCERT Science Class 7 — Chapter 9',
          syllabusTopics: ['Speed calculation: Speed = Total Distance / Total Time', 'Units: m/s and km/h conversions ($1\\text{ m/s} = 3.6\\text{ km/h}$)', 'Measurement of time: Periodic events, Sundials, Water clocks, Quartz clocks', 'Simple Pendulum: Length, oscillation, amplitude, Time period ($T = 2\\pi\\sqrt{l/g}$)', 'Distance-time graphs for uniform and stationary motion'],
          learningObjectives: ['Calculate time period of simple pendulum experimentally', 'Plot and interpret distance-time graphs from tabular motion data'],
          coreFormulas: ['\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}', 'T = 2\\pi\\sqrt{\\frac{l}{g}}']
        },
        {
          id: 'ch-7-s-10',
          name: 'Electric Current and Its Effects',
          textbookRef: 'NCERT Science Class 7 — Chapter 10',
          syllabusTopics: ['Circuit symbols for cell, battery, bulb, switch, wire', 'Heating effect of electric current: Joule heating ($H = I^2Rt$)', 'Applications: Electric iron, heater, toaster; Electric fuse (low melting point wire), MCBs (Miniature Circuit Breakers)', 'Magnetic effect of electric current: Oersted’s deflection experiment', 'Electromagnets (solenoid with soft iron core) and Electric Bell working mechanism'],
          learningObjectives: ['Explain how electric fuses and MCBs protect appliances from short-circuits', 'Construct an electromagnet and explain electric bell operation'],
          coreFormulas: ['H = I^2 R t \\text{ (Joule’s Law of Heating)}']
        },
        {
          id: 'ch-7-s-11',
          name: 'Light',
          textbookRef: 'NCERT Science Class 7 — Chapter 11',
          syllabusTopics: ['Reflection from plane mirror: Virtual, erect, same size, laterally inverted, equal distance behind mirror', 'Spherical mirrors: Concave (converging, real/inverted images, used in headlamps, dentist mirrors) and Convex (diverging, virtual/erect/diminished, used as rear-view mirrors)', 'Lenses: Convex lens (converging, magnifying glass) vs Concave lens (diverging)', 'Dispersion of light: Sunlight split into 7 spectrum colors (VIBGYOR) through triangular glass prism, Newton’s disc'],
          learningObjectives: ['Distinguish real images from virtual images', 'Select concave or convex mirrors for specific optical applications', 'Demonstrate light dispersion using prism and Newton’s color disc']
        },
        {
          id: 'ch-7-s-12',
          name: 'Forests: Our Lifeline',
          textbookRef: 'NCERT Science Class 7 — Chapter 12',
          syllabusTopics: ['Forest as a dynamic living ecosystem and green lungs', 'Canopy, understorey, and forest floor tiers', 'Food chains and food webs in forest ecology', 'Decomposers and humus formation: recycling nutrients to plant roots', 'Forests preventing soil erosion, regulating water cycle, and checking floods'],
          learningObjectives: ['Describe structural stratification of a forest ecosystem', 'Explain how forests prevent catastrophic flooding and recharge aquifers']
        },
        {
          id: 'ch-7-s-13',
          name: 'Wastewater Story',
          textbookRef: 'NCERT Science Class 7 — Chapter 13',
          syllabusTopics: ['Sewage composition: organic impurities (human waste, oil), inorganic impurities (nitrates, phosphates), bacteria causing cholera and typhoid', 'Wastewater Treatment Plant (WWTP) stages: Bar screens, grit removal chamber, clarifier (sludge sedimentation and skimmer for oils), aeration tank (aerobic bacteria digestion), chlorination/ozonization disinfection', 'Alternative sewage disposal: Septic tanks, biogas plants, vermi-processing toilets'],
          learningObjectives: ['Diagram the operational stages of a municipal wastewater treatment plant', 'Promote sanitation practices to protect water bodies from contamination']
        }
      ]
    },
    {
      id: 'cbse-7-japanese',
      name: 'Japanese (NCERT Momo 2 / もも 2)',
      category: 'Japanese',
      curricula: ['NCERT Japanese Momo 2 Class 7', 'The Japan Foundation Japanese Curriculum'],
      chapters: [
        {
          id: 'ch-7-jp-1',
          name: 'Lesson 1: カタカナ (Complete Katakana Script & Foreign Loanwords)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 1',
          syllabusTopics: ['All 46 Katakana characters with stroke direction rules', 'Katakana Dakuten, Handakuten, and Yoon combinations (Fa, Ti, Di, She)', 'The prolonged sound mark (Chouon dash ー): Koohii, Terebi, Pasokon', 'Transcribing names and countries into Katakana'],
          learningObjectives: ['Read and write Katakana loanwords without confusing similar characters (Shi vs Tsu, So vs N)', 'Spell Indian and international city and personal names in Katakana']
        },
        {
          id: 'ch-7-jp-2',
          name: 'Lesson 2: かいもの (Shopping, Prices in Yen: いくらですか)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 2',
          syllabusTopics: ['Demonstratives: Kono, Sono, Ano, Dono + Noun', 'Japanese currency: Yen (円 / En) and numbers up to 10,000 (Ichi-man)', 'Asking prices: Kore wa ikura desu ka? Kono hon wa 1200-en desu', 'Requesting items: [Item] o kudasai (Please give me [item])'],
          learningObjectives: ['Conduct complete retail transactions in Japanese', 'Count and calculate prices up to 10,000 Yen'],
          coreFormulas: ['\\text{Kono } [\\text{Noun}] \\text{ wa ikura desu ka?}', '[\\text{Item}] \\text{ o kudasai}']
        },
        {
          id: 'ch-7-jp-3',
          name: 'Lesson 3: のりもの と いどう (Transport Modes, Movement Particles で, に, へ)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 3',
          syllabusTopics: ['Densha, Chikatetsu, Basu, Jitensha, Hikouki, Shinkansen, Aruite', 'Particle で for means of travel: Basu de gakkou e ikimasu', 'Particle へ / に for destination direction', 'Movement verbs: Ikimasu (go), Kimasu (come), Kaerimasu (return home)'],
          learningObjectives: ['Explain daily commutes and inter-city travel routes', 'Use particles で and へ accurately in travel sentences'],
          coreFormulas: ['[\\text{Vehicle}] \\text{ de } [\\text{Destination}] \text{ e ikimasu}']
        },
        {
          id: 'ch-7-jp-4',
          name: 'Lesson 4: こよみ と たんじょうび (Calendar, Months, Irregular Days, Birthdays)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 4',
          syllabusTopics: ['Months 1 to 12 (1-gatsu to 12-gatsu)', 'Irregular calendar days: Tsuitachi (1st), Futsuka (2nd), Mikka (3rd), Yokka (4th), Itsuka (5th), Muika (6th), Nanoka (7th), Youka (8th), Kokonoka (9th), Tooka (10th), Hatsuka (20th)', 'Asking birthday: Tanjoubi wa itsu desu ka?', 'Relative dates: Ototoi, Kinou, Kyou, Ashita, Asatte'],
          learningObjectives: ['Read and write Japanese calendar dates fluently', 'Schedule events and recite birthdays with correct day readings']
        },
        {
          id: 'ch-7-jp-5',
          name: 'Lesson 5: しゅみ と さそい (Hobbies, Invitations: ~ませんか, ~ましょう)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 5',
          syllabusTopics: ['Supootsu, Dokusho, Ongaku, Eiga, Ryouri, Anime, Ryokou', 'Stating hobbies: Watashi no shumi wa [Noun] desu', 'Inviting peers: Isshoni [Verb-stem] masen ka? (Won’t you [verb] together?)', 'Enthusiastic acceptance: [Verb-stem] mashou! / Ii desu ne'],
          learningObjectives: ['Discuss recreational hobbies and leisure activities', 'Propose weekend plans and respond politely to invitations'],
          coreFormulas: ['\\text{Isshoni } [\\text{Verb-stem}]\\text{-masen ka?}', '[\\text{Verb-stem}]\\text{-mashou!}']
        },
        {
          id: 'ch-7-jp-6',
          name: 'Lesson 6: きせつ と てんき (The Four Seasons, Weather & Temperatures)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 6',
          syllabusTopics: ['Haru (Spring), Natsu (Summer), Aki (Autumn), Fuyu (Winter)', 'Weather adjectives: Samui (cold), Atsui (hot), Atatakai (warm), Suzushii (cool), Ame (rain), Yuki (snow)', 'Comparing seasons: Haru to fuyu to dochira ga suki desu ka?', 'Weather forecasts and asking about current weather'],
          learningObjectives: ['Describe climate and seasonal weather changes in Japanese', 'Express comparative preferences between different seasons']
        },
        {
          id: 'ch-7-jp-7',
          name: 'Lesson 7: いちねんの ぎょうじ (Annual Events: Matsuri, Tanabata, Oshougatsu)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 7',
          syllabusTopics: ['Oshougatsu (New Year traditions, Osechi ryouri, Otoshidama)', 'Setsubun (bean-throwing ritual), Hinamatsuri (Doll Festival), Kodomo no Hi (Children’s Day)', 'Tanabata (Star festival wishes on Tanzaku bamboo)', 'Obon (ancestral summer remembrance and Bon Odori dance)'],
          learningObjectives: ['Describe traditional Japanese cultural holidays and seasonal festivities', 'Compare Indian and Japanese annual celebratory traditions']
        },
        {
          id: 'ch-7-jp-8',
          name: 'Lesson 8: にほんの ぶんか (Japanese Culture: Origami, Tea Ceremony & Calligraphy)',
          textbookRef: 'NCERT Japanese (Momo 2 Class 7) — Lesson 8',
          syllabusTopics: ['Origami paper folding (Orizuru crane symbolism)', 'Sadou (traditional Japanese tea ceremony principles: Wa, Kei, Sei, Jaku)', 'Shodou (Japanese brush calligraphy and ink stone)', 'Chopstick etiquette (Hashi rules: no sticking vertically into rice, no passing food chopstick-to-chopstick)'],
          learningObjectives: ['Appreciate core artistic and social traditions of Japan', 'Demonstrate understanding of essential dining etiquette norms']
        }
      ]
    },
    {
      id: 'cbse-7-social-science',
      name: 'Social Science (History, Civics, Geography)',
      category: 'History & Social Studies',
      curricula: ['NCERT Our Pasts II', 'NCERT Our Environment', 'NCERT Social and Political Life II'],
      chapters: [
        {
          id: 'ch-7-soc-1',
          name: 'History: The Delhi Sultans',
          textbookRef: 'NCERT Our Pasts II — Chapter 3',
          syllabusTopics: ['Tarikh / Tawarikh written by court scribes in Persian', 'Raziyya Sultan: First female ruler of Delhi Sultanate (1236)', 'Garrison towns to expansion under Alauddin Khalji and Muhammad Tughluq', 'Iqta system (Iqtadars / Muqtis collecting revenue and maintaining cavalry)', 'Mongol invasions under Genghis Khan and administrative responses'],
          learningObjectives: ['Analyze administrative centralization and military mobilization in Delhi Sultanate', 'Critique gender barriers in medieval monarchical politics']
        },
        {
          id: 'ch-7-soc-2',
          name: 'History: The Mughal Empire',
          textbookRef: 'NCERT Our Pasts II — Chapter 4',
          syllabusTopics: ['Babur (Battle of Panipat 1526) to Aurangzeb timeline', 'Akbar’s administration: Subas, Subadars, Diwan, Bakshi, Faujdars', 'Mansabdari system: Zat (rank/salary) and Sawar (military cavalry quota)', 'Zabt and Zamindars land revenue assessment (Todar Mal’s 10-year survey)', 'Sulh-i kul (universal peace) and religious discussions at Ibadat Khana'],
          learningObjectives: ['Explain the bureaucratic structure of the Mansabdari military administration', 'Evaluate Akbar’s inclusive religious policy of Sulh-i kul']
        },
        {
          id: 'ch-7-soc-3',
          name: 'Geography: Inside Our Earth & Rocks',
          textbookRef: 'NCERT Our Environment — Chapter 2',
          syllabusTopics: ['Concentric layers: Crust (Continental SIAL: silica/alumina, Oceanic SIMA: silica/magnesium), Mantle, Core (NIFE: nickel/iron)', 'Rock cycle: Igneous (primary: intrusive granite, extrusive basalt), Sedimentary (stratified, fossils), Metamorphic (marble from limestone, slate from clay)', 'Economic importance of minerals and geological resources'],
          learningObjectives: ['Diagram the structural interior layers of planet Earth', 'Trace cyclical transformation of rocks in the rock cycle']
        },
        {
          id: 'ch-7-soc-4',
          name: 'Geography: Air & Atmospheric Composition',
          textbookRef: 'NCERT Our Environment — Chapter 4',
          syllabusTopics: ['Atmospheric layers: Troposphere (weather), Stratosphere (ozone layer, aeroplanes), Mesosphere (meteorites burn), Thermosphere (ionosphere, radio waves), Exosphere', 'Greenhouse effect: Carbon dioxide trapping outgoing terrestrial radiation', 'Weather vs Climate; Temperature, Insolation, Atmospheric Pressure, Wind belts (Trade winds, Westerlies, Polar easterlies)', 'Moisture, humidity, and rainfall types: Convectional, Orographic, Cyclonic'],
          learningObjectives: ['Analyze temperature gradients across thermal atmospheric layers', 'Explain global planetary wind circulation and rainfall mechanisms']
        },
        {
          id: 'ch-7-soc-5',
          name: 'Civics: On Equality & Government in Health',
          textbookRef: 'NCERT Social and Political Life II — Chapters 1 & 2',
          syllabusTopics: ['Universal Adult Franchise establishing political equality in Indian democracy', 'Article 15 of Indian Constitution prohibiting discrimination on grounds of religion, race, caste, sex', 'Mid-Day Meal Scheme (introduced in Tamil Nadu 2001) boosting school enrollment and social equality', 'Public vs Private healthcare disparity, OPD vs IPD, cost burden on families, Costa Rican healthcare model'],
          learningObjectives: ['Evaluate constitutional guarantees of equality against everyday social realities', 'Compare public welfare healthcare with private commercialized medicine']
        }
      ]
    },
    {
      id: 'cbse-7-foundation',
      name: 'Foundation & Olympiads (Class 7 STEM & MAT)',
      category: 'Foundation & Olympiads',
      curricula: ['Class 7 IIT-JEE & NEET STEM Foundation', 'NSTSE & National Science Olympiad'],
      chapters: [
        {
          id: 'ch-7-fd-1',
          name: 'Foundation Physics: Heat Transfer, Calorimetry & Thermometry',
          textbookRef: 'Class 7 STEM Foundation — Chapter 1',
          syllabusTopics: ['Kinetic molecular theory of heat and thermal expansion', 'Calorimetry principle: Heat lost by hot body = Heat gained by cold body ($Q = mc\\Delta T$)', 'Latent heat of fusion and vaporization', 'Temperature scale derivations: Celsius, Fahrenheit, Kelvin absolute scale'],
          learningObjectives: ['Solve equilibrium temperature problems for mixed liquids in calorimeters', 'Convert thermal quantities between all three international temperature scales'],
          coreFormulas: ['Q = mc\\Delta T', '\\frac{C}{5} = \\frac{F - 32}{9} = \\frac{K - 273.15}{5}']
        },
        {
          id: 'ch-7-fd-2',
          name: 'Foundation Chemistry: Acids, Bases & Neutralization Titrations',
          textbookRef: 'Class 7 STEM Foundation — Chapter 2',
          syllabusTopics: ['Arrhenius definition of acids ($H^+$ donors) and bases ($OH^-$ donors)', 'pH concept and indicator color transition ranges (litmus, methyl orange, phenolphthalein)', 'Writing and balancing neutralization ionic equations', 'Salts classification: normal, acid, and basic salts; water of crystallization'],
          learningObjectives: ['Predict pH ranges and indicator reactions for unknown aqueous solutions', 'Calculate theoretical yield in acid-base neutralization reactions']
        },
        {
          id: 'ch-7-fd-3',
          name: 'Foundation Math: Exponents, Radicals & Algebraic Identities',
          textbookRef: 'Class 7 Math Olympiad Foundation — Chapter 3',
          syllabusTopics: ['Laws of integral exponents, negative exponents, fractional indices', 'Olympiad algebraic expansions: $(a+b)^2, (a-b)^2, a^2 - b^2, (a+b+c)^2, (a+b)^3$', 'Linear equations in one variable with parameter coefficients', 'Linear inequation solutions on real number lines ($x > a, x \\le b$)'],
          learningObjectives: ['Simplify complex radical and exponential Olympiad expressions', 'Apply algebraic identities to factorize multi-variable polynomials'],
          coreFormulas: ['(a+b+c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)', 'a^{-n} = \\frac{1}{a^n}']
        },
        {
          id: 'ch-7-fd-4',
          name: 'Mental Ability (MAT): Venn Diagrams, Syllogisms & Coding',
          textbookRef: 'Class 7 NTSE & MAT Guide — Chapter 4',
          syllabusTopics: ['Logical Venn diagrams: 3-set intersections and exclusive categories', 'Categorical syllogisms: premises, Venn test of validity, conclusion testing', 'Advanced alpha-numeric coding with symbol substitutions and mathematical operators'],
          learningObjectives: ['Test formal logical syllogisms using Venn intersection circles', 'Decode substitution cipher problems under competitive time constraints']
        }
      ]
    }
  ]
};
