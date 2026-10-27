import { SyllabusClassInfo } from './types';

export const cbseClass6: SyllabusClassInfo = {
  id: 'cbse-class-6',
  name: 'Class 6 (Middle School)',
  gradeEquivalent: 'Class 6-8 (Middle School)',
  subjects: [
    {
      id: 'cbse-6-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 6', 'NCERT Exemplar Class 6'],
      chapters: [
        {
          id: 'ch-6-m-1',
          name: 'Knowing Our Numbers',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 1',
          syllabusTopics: ['Comparing numbers and place value (Indian and International systems)', 'Estimation and rounding off to nearest tens, hundreds, thousands', 'Roman numerals and large number arithmetic'],
          learningObjectives: ['Read and write 8-digit numbers in both notation systems', 'Estimate sums, differences, and products accurately'],
          coreFormulas: ['1\\text{ Million} = 10\\text{ Lakhs}', '10\\text{ Millions} = 1\\text{ Crore}']
        },
        {
          id: 'ch-6-m-2',
          name: 'Whole Numbers',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 2',
          syllabusTopics: ['Natural numbers vs Whole numbers, predecessor and successor', 'Number line operations (addition, subtraction, multiplication)', 'Properties of whole numbers: closure, commutativity, associativity, distributivity'],
          learningObjectives: ['Apply distributive property $a(b+c) = ab + ac$ for mental math', 'Represent operations on a continuous number line'],
          coreFormulas: ['a \\times (b + c) = a \\times b + a \\times c']
        },
        {
          id: 'ch-6-m-3',
          name: 'Playing with Numbers',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 3',
          syllabusTopics: ['Factors and multiples, prime and composite numbers, Sieve of Eratosthenes', 'Tests for divisibility by 2, 3, 4, 5, 6, 8, 9, 10, 11', 'Prime factorization, HCF and LCM'],
          learningObjectives: ['Determine divisibility without actual division', 'Calculate HCF and LCM using prime factorization and division method'],
          coreFormulas: ['\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b']
        },
        {
          id: 'ch-6-m-4',
          name: 'Basic Geometrical Ideas',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 4',
          syllabusTopics: ['Points, line segments, rays, intersecting and parallel lines', 'Curves: open and closed curves, interior and exterior of simple closed curves', 'Polygons, angles, triangles, quadrilaterals, circles (radius, diameter, chord, sector, segment)'],
          learningObjectives: ['Distinguish between rays, lines, and line segments', 'Identify vertices, adjacent sides, and diagonals in polygons']
        },
        {
          id: 'ch-6-m-5',
          name: 'Understanding Elementary Shapes',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 5',
          syllabusTopics: ['Measuring line segments with divider', 'Angles: right, straight, complete, acute, obtuse, and reflex angles', 'Classifying triangles by sides (scalene, isosceles, equilateral) and by angles', 'Quadrilaterals (parallelogram, rectangle, rhombus, square, trapezium) and 3D shapes (prisms, pyramids)'],
          learningObjectives: ['Measure angles in degrees using protractor', 'Classify polyhedra by counting faces, edges, and vertices']
        },
        {
          id: 'ch-6-m-6',
          name: 'Integers',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 6',
          syllabusTopics: ['Concept of negative numbers, integers on number line', 'Ordering and absolute values of integers', 'Addition and subtraction of integers with sign rules'],
          learningObjectives: ['Represent gain/loss and elevation using signed integers', 'Perform integer addition and subtraction without number line relying on sign rules'],
          coreFormulas: ['(+a) + (-b) = a - b', '(-a) - (-b) = -a + b']
        },
        {
          id: 'ch-6-m-7',
          name: 'Fractions',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 7',
          syllabusTopics: ['Proper, improper, and mixed fractions on number line', 'Equivalent fractions, simplest form of a fraction', 'Like and unlike fractions, comparing and operations (+, -)'],
          learningObjectives: ['Convert improper fractions to mixed fractions and vice versa', 'Add and subtract unlike fractions by finding common denominator LCM'],
          coreFormulas: ['\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}']
        },
        {
          id: 'ch-6-m-8',
          name: 'Decimals',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 8',
          syllabusTopics: ['Tenths, hundredths, thousandths place values', 'Converting fractions to decimals and decimals to fractions', 'Comparing decimals, addition and subtraction of decimals in money, lengths, weights'],
          learningObjectives: ['Apply decimals accurately to monetary currency and metric measurements', 'Perform multi-column decimal addition and subtraction'],
          coreFormulas: ['0.1 = \\frac{1}{10}, \\quad 0.01 = \\frac{1}{100}']
        },
        {
          id: 'ch-6-m-9',
          name: 'Data Handling',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 9',
          syllabusTopics: ['Recording data using tally marks', 'Pictographs: choosing appropriate key scale', 'Bar graphs: uniform width and equal spacing on vertical and horizontal axes'],
          learningObjectives: ['Construct frequency tables from raw datasets', 'Interpret bar graphs and derive comparative conclusions']
        },
        {
          id: 'ch-6-m-10',
          name: 'Mensuration',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 10',
          syllabusTopics: ['Perimeter of rectangle, square, and regular polygons ($P = n \\times s$)', 'Area of rectangle ($l \\times b$) and square ($s^2$)', 'Practical word problems on fencing fields and paving rectangular courtyards'],
          learningObjectives: ['Calculate perimeter and area of rectilinear figures', 'Differentiate between linear boundary units (m) and area units ($m^2$)'],
          coreFormulas: ['\\text{Perimeter of Rect} = 2(l + b)', '\\text{Area of Rect} = l \\times b', '\\text{Perimeter of Equilateral } \\triangle = 3s']
        },
        {
          id: 'ch-6-m-11',
          name: 'Algebra',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 11',
          syllabusTopics: ['Introduction to variables using matchstick patterns', 'Algebraic expressions involving addition, subtraction, multiplication, division', 'Forming simple linear equations from word problems and solving by trial and error'],
          learningObjectives: ['Translate verbal statements into algebraic expressions', 'Solve elementary linear equations for unknown variable x'],
          coreFormulas: ['\\text{Matchsticks for } n \\text{ squares} = 3n + 1']
        },
        {
          id: 'ch-6-m-12',
          name: 'Ratio and Proportion',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 12',
          syllabusTopics: ['Concept of ratio ($a : b$) in simplest form', 'Proportion ($a : b :: c : d$) and product of extremes = product of means', 'Unitary method: finding unit cost to find value of required quantity'],
          learningObjectives: ['Compare quantities using division ratios', 'Solve rate, time, and purchase problems using unitary method'],
          coreFormulas: ['\\frac{a}{b} = \\frac{c}{d} \\implies a \\times d = b \\times c']
        },
        {
          id: 'ch-6-m-13',
          name: 'Symmetry',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 13',
          syllabusTopics: ['Line of symmetry (mirror line) for 2D regular polygons', 'Figures with multiple lines of symmetry (equilateral triangle, square, circle)', 'Kaleidoscopic reflections and Rangoli patterns'],
          learningObjectives: ['Draw all lines of symmetry for standard geometric figures', 'Identify asymmetrical shapes with zero lines of symmetry']
        },
        {
          id: 'ch-6-m-14',
          name: 'Practical Geometry',
          textbookRef: 'NCERT Mathematics Class 6 — Chapter 14',
          syllabusTopics: ['Drawing circles of given radius using compass', 'Constructing line segment of given length using ruler and compass', 'Perpendicular bisector of a line segment', 'Constructing angles of 60°, 90°, 120°, and angle bisectors'],
          learningObjectives: ['Execute compass and straightedge geometric constructions', 'Bisect given angles accurately']
        }
      ]
    },
    {
      id: 'cbse-6-science',
      name: 'Science',
      category: 'General Science',
      curricula: ['NCERT Science Class 6', 'NCERT Exemplar Class 6'],
      chapters: [
        {
          id: 'ch-6-s-1',
          name: 'Components of Food',
          textbookRef: 'NCERT Science Class 6 — Chapter 1',
          syllabusTopics: ['Major nutrients: Carbohydrates (starch/sugar), Fats, Proteins, Vitamins, Minerals', 'Tests for starch (iodine), protein (copper sulphate + caustic soda), fats (paper translucent spot)', 'Balanced diet and dietary deficiency diseases (Scurvy, Beri-beri, Rickets, Anaemia, Goitre)'],
          learningObjectives: ['Conduct biochemical nutrient identification tests', 'Identify nutritional deficiency diseases and their preventive diets']
        },
        {
          id: 'ch-6-s-2',
          name: 'Sorting Materials into Groups',
          textbookRef: 'NCERT Science Class 6 — Chapter 2',
          syllabusTopics: ['Properties of materials: Lustre, Hardness, Solubility (miscible/immiscible)', 'Floatation in water based on density', 'Transparency, Translucency, and Opacity'],
          learningObjectives: ['Classify materials according to physical and optical attributes', 'Select appropriate engineering materials based on required properties']
        },
        {
          id: 'ch-6-s-3',
          name: 'Separation of Substances',
          textbookRef: 'NCERT Science Class 6 — Chapter 3',
          syllabusTopics: ['Methods of separation: Handpicking, Threshing, Winnowing, Sieving', 'Sedimentation, Decantation, and Filtration', 'Evaporation and Condensation', 'Saturated solution and solubility variation with heating'],
          learningObjectives: ['Design step-by-step separation schemes for multi-phase mixtures', 'Explain water purification stages in municipal waterworks']
        },
        {
          id: 'ch-6-s-4',
          name: 'Getting to Know Plants',
          textbookRef: 'NCERT Science Class 6 — Chapter 4',
          syllabusTopics: ['Classification: Herbs, Shrubs, Trees, Creepers, Climbers', 'Root systems: Taproot vs Fibrous roots and correlation with leaf venation', 'Leaf anatomy: Petiole, lamina, reticulate vs parallel venation, stomata and transpiration', 'Flower anatomy: Sepals, petals, stamens (anther/filament), pistil (stigma/style/ovary)'],
          learningObjectives: ['Correlate leaf venation with root architecture without uprooting plants', 'Identify reproductive organs of angiosperm flowers']
        },
        {
          id: 'ch-6-s-5',
          name: 'Body Movements',
          textbookRef: 'NCERT Science Class 6 — Chapter 5',
          syllabusTopics: ['Human skeletal framework, cartilage vs bone', 'Movable joints: Ball and socket (shoulder/hip), Pivotal (neck), Hinge (elbow/knee), Fixed joints (cranium)', 'Locomotion in other animals: Earthworm (setae/circular muscles), Snail (muscular foot), Cockroach (exoskeleton), Birds (pneumatic bones), Fish (streamlined body), Snake (loops)'],
          learningObjectives: ['Classify synovial joints by range of movement', 'Explain biomechanics of animal propulsion']
        },
        {
          id: 'ch-6-s-6',
          name: 'The Living Organisms — Characteristics and Habitats',
          textbookRef: 'NCERT Science Class 6 — Chapter 6',
          syllabusTopics: ['Terrestrial habitats (deserts, mountains, grasslands) and Aquatic habitats (ponds, oceans)', 'Adaptations of camel, cactus, mountain yak, pine trees, deep-sea organisms', 'Characteristics of life: Cellular respiration, stimulus response, excretion, reproduction, growth'],
          learningObjectives: ['Correlate morpho-physiological adaptations with habitat stresses', 'Distinguish abiotic environmental factors from biotic communities']
        },
        {
          id: 'ch-6-s-7',
          name: 'Motion and Measurement of Distances',
          textbookRef: 'NCERT Science Class 6 — Chapter 7',
          syllabusTopics: ['Historical evolution of transport', 'Standard units of measurement: SI metric system (metre, centimetre, millimetre)', 'Measuring straight vs curved lines using thread', 'Types of motion: Rectilinear, Circular, Periodic motion'],
          learningObjectives: ['Measure lengths accurately avoiding parallax errors', 'Differentiate rotational, circular, and periodic oscillations']
        },
        {
          id: 'ch-6-s-8',
          name: 'Light, Shadows and Reflections',
          textbookRef: 'NCERT Science Class 6 — Chapter 8',
          syllabusTopics: ['Luminous vs non-luminous objects', 'Rectilinear propagation of light in straight lines', 'Shadow formation: requirement of light source, opaque obstacle, and screen', 'Pinhole camera image formation (inverted image)', 'Plane mirror reflection and regular reflection'],
          learningObjectives: ['Explain ray model of light and shadow characteristics', 'Construct and demonstrate a functioning pinhole camera']
        },
        {
          id: 'ch-6-s-9',
          name: 'Electricity and Circuits',
          textbookRef: 'NCERT Science Class 6 — Chapter 9',
          syllabusTopics: ['Electric cell structure (positive terminal, negative metal disc, electrolyte)', 'Torch bulb filament and circuit terminals', 'Closed vs open circuits, current direction from positive to negative terminal', 'Electric switches and Conductors vs Insulators'],
          learningObjectives: ['Assemble functional series circuits with switch and cell', 'Identify electrical conductors and safety insulators']
        },
        {
          id: 'ch-6-s-10',
          name: 'Fun with Magnets',
          textbookRef: 'NCERT Science Class 6 — Chapter 10',
          syllabusTopics: ['Discovery of natural magnet (Magnetite/lodestone)', 'Magnetic vs non-magnetic materials', 'Poles of a magnet (North and South) and maximum attraction at poles', 'Freely suspended magnet pointing in North-South geographic direction', 'Magnetic compass and law of magnetic attraction/repulsion'],
          learningObjectives: ['Locate poles of bar and horseshoe magnets', 'Apply magnetic laws: like poles repel, unlike poles attract']
        },
        {
          id: 'ch-6-s-11',
          name: 'Air Around Us',
          textbookRef: 'NCERT Science Class 6 — Chapter 11',
          syllabusTopics: ['Atmosphere composition: Nitrogen (78%), Oxygen (21%), Carbon dioxide, water vapour, dust and smoke', 'Demonstrating air occupies space and is dissolved in water/soil', 'Oxygen cycle, respiration in aquatic and terrestrial animals', 'Role of wind in windmill power and seed dispersal'],
          learningObjectives: ['Explain atmospheric gas composition and support of aerobic life', 'Demonstrate presence of dissolved air in water experimentally']
        },
        {
          id: 'ch-6-s-12',
          name: 'Garbage In, Garbage Out',
          textbookRef: 'NCERT Science Class 6 — Chapter 12',
          syllabusTopics: ['Biodegradable vs Non-biodegradable waste', 'Vermicomposting using redworms (Eisenia fetida) and conditions needed', 'Landfills and segregation at source (blue bin dry waste vs green bin wet waste)', 'Hazards of plastics and the 3Rs: Reduce, Reuse, Recycle'],
          learningObjectives: ['Implement household vermicomposting techniques', 'Practice municipal waste segregation and plastic minimization']
        }
      ]
    },
    {
      id: 'cbse-6-japanese',
      name: 'Japanese (NCERT Momo 1 / もも 1)',
      category: 'Japanese',
      curricula: ['NCERT Japanese Momo 1 Class 6', 'The Japan Foundation Japanese Curriculum'],
      chapters: [
        {
          id: 'ch-6-jp-1',
          name: 'Lesson 1: ひらがな (Complete Hiragana, Dakuten, Handakuten & Yoon)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 1',
          syllabusTopics: ['Complete 46 Hiragana glyphs review', 'Voiced consonants (Tenten/Dakuten: Ga, Za, Da, Ba)', 'Semi-voiced consonants (Maru/Handakuten: Pa)', 'Contracted sounds (Yoon: Kya, Sha, Cha) and small Tsu (Sokuon)'],
          learningObjectives: ['Read and write all 71 Hiragana sound combinations with accurate stroke orders', 'Transcribe double consonants and contracted syllables correctly']
        },
        {
          id: 'ch-6-jp-2',
          name: 'Lesson 2: がっこう (School Life, Classroom Commands & Aisatsu)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 2',
          syllabusTopics: ['Kiritsu, Rei, Chakuseki commands', 'Asking permission: Sumimasen, toire ni ittemo ii desu ka?', 'School subjects: Nihongo, Suugaku, Rika, Eigo, Taiiku', 'Polite requests: Mou ichido onegaishimasu'],
          learningObjectives: ['Navigate classroom interactions completely in Japanese', 'Request repetition and permissions respectfully']
        },
        {
          id: 'ch-6-jp-3',
          name: 'Lesson 3: じかん (Telling Time, Daily Schedule & ~ji, ~fun)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 3',
          syllabusTopics: ['Hours counter (~ji) with irregulars (Yo-ji, Shichi-ji, Ku-ji)', 'Minutes counter (~fun/~pun) and half past (Han)', 'Ima nan-ji desu ka? (What time is it now?)', 'Time particles: Kara (from) and Made (until)'],
          learningObjectives: ['Tell precise time in Japanese', 'Describe school and study timetable schedules']
        },
        {
          id: 'ch-6-jp-4',
          name: 'Lesson 4: まいにちの せいかつ (Daily Routine Verbs, Particles を and に)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 4',
          syllabusTopics: ['Okimasu (wake up), Nemasu (sleep), Tabemasu (eat), Nomimasu (drink), Ikimasu (go)', 'Direct object particle を (pronounced o)', 'Time particle に (at specific hour)', 'Negative polite form (~masen, ~masen deshita)'],
          learningObjectives: ['Narrate a complete daily morning-to-night routine in Japanese', 'Apply particles を and に accurately with verbs']
        },
        {
          id: 'ch-6-jp-5',
          name: 'Lesson 5: たべもの・のみもの (Food & Drinks: ~ga suki/kirai)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 5',
          syllabusTopics: ['Gohan, Pan, Tamago, Niku, Sakana, Yasai, Kudamono', 'Mizu, Ocha, Koohii, Juusu', 'Likes and dislikes: [Noun] ga suki desu / kirai desu', 'Mealtime phrases: Itadakimasu, Gochisousama deshita'],
          learningObjectives: ['Order food and beverages politely in Japanese', 'Express dietary likes, dislikes, and meal appreciation']
        },
        {
          id: 'ch-6-jp-6',
          name: 'Lesson 6: わたしのかぞく (Family Members & Describing People)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 6',
          syllabusTopics: ['Chichi, Haha, Ani, Ane, Otouto, Imouto', 'Polite family terms: Otousan, Okaasan, Oniisan, Oneesan', 'Describing personality and appearances: Yasashii (kind), Akarui (cheerful), Segatakai (tall)'],
          learningObjectives: ['Introduce family members with appropriate humble/polite honorifics', 'Describe personalities using basic Japanese adjectives']
        },
        {
          id: 'ch-6-jp-7',
          name: 'Lesson 7: わたしのまち (My Town, Facilities: あります & います)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 7',
          syllabusTopics: ['Gakkou, Byouin, Kouen, Eki, Mise, Toshokan', 'Inanimate existence: [Place] ni [Object] ga arimasu', 'Animate existence: [Place] ni [Person/Animal] ga imasu', 'Asking locations: Doko desu ka? Koko, Soko, Asoko'],
          learningObjectives: ['Differentiate between existence verbs arimasu and imasu', 'Ask for and give directions in a town or campus']
        },
        {
          id: 'ch-6-jp-8',
          name: 'Lesson 8: 1しゅうかん (Days of the Week & Weekly Calendar)',
          textbookRef: 'NCERT Japanese (Momo 1 Class 6) — Lesson 8',
          syllabusTopics: ['Getsuyoubi (Mon), Kayoubi (Tue), Suiyoubi (Wed), Mokuyoubi (Thu), Kinyoubi (Fri), Doyoubi (Sat), Nichiyoubi (Sun)', 'Time adverbs: Kyou (today), Ashita (tomorrow), Kinou (yesterday), Mainichi (every day)', 'Asking day of the week: Kyou wa nan-youbi desu ka?'],
          learningObjectives: ['Recite and use all days of the week in conversations', 'Schedule weekly club and study activities in Japanese']
        }
      ]
    },
    {
      id: 'cbse-6-social-science',
      name: 'Social Science (Exploring Society: India and Beyond)',
      category: 'History & Social Studies',
      curricula: [
        'NCERT Exploring Society: India and Beyond (New NEP Syllabus)',
        'NCERT Our Pasts I (Classic History)',
        'NCERT The Earth Our Habitat (Classic Geography)',
        'NCERT Social and Political Life I (Classic Civics)',
      ],
      chapters: [
        // --- NEW NCERT (NEP 2024–25): EXPLORING SOCIETY: INDIA AND BEYOND ---
        // THEME A: India and the World: Land and the People (Geography Focus)
        {
          id: 'ch-6-soc-es-1',
          name: 'Chapter 1: Locating Places on the Earth',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 1',
          syllabusTopics: [
            'The Globe as a three-dimensional model of the Earth; Axis of rotation, North and South Poles',
            'Latitudes (Parallels): Equator (0°), Tropic of Cancer (23.5° N), Tropic of Capricorn (23.5° S), Arctic Circle (66.5° N), Antarctic Circle (66.5° S)',
            'Heat Zones of the Earth: Torrid Zone, North/South Temperate Zones, North/South Frigid Zones',
            'Longitudes (Meridians): Prime Meridian (0° at Greenwich, London), International Date Line (180°)',
            'Geographic Grid coordinates for precise location mapping on Earth',
            'Longitude and Time calculation: 1° of longitude = 4 minutes of time difference (15° = 1 hour)',
            'Indian Standard Time (IST): 82°30′ E standard meridian passing through Mirzapur (UP), GMT + 5:30',
          ],
          learningObjectives: [
            'Plot and locate geographic coordinates accurately on maps and globes',
            'Calculate local solar time and standard time differences across global meridians',
            'Explain how axial inclination and solar angle create the three climatic heat zones',
          ],
          coreFormulas: [
            '1^\\circ \\text{ Longitude} = 4\\text{ minutes of time}',
            '15^\\circ \\text{ Longitude} = 1\\text{ hour}',
            '\\text{IST} = \\text{GMT} + 5\\text{ h } 30\\text{ min}',
          ],
        },
        {
          id: 'ch-6-soc-es-2',
          name: 'Chapter 2: Oceans and Continents',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 2',
          syllabusTopics: [
            'The Blue Planet: Distribution of land (29%) and water bodies (71%) on the Earth surface',
            'The Seven Continents in order of landmass: Asia, Africa, North America, South America, Antarctica, Europe, Australia (Oceania)',
            'Unique geographical features of continents: Isthmus of Panama, Isthmus of Suez, Ural Mountains divider, Sahara desert, Amazon basin',
            'The Five Major Oceans: Pacific Ocean (largest & deepest, Mariana Trench), Atlantic Ocean (indented coastline, \'S\' shaped), Indian Ocean (named after India), Southern Ocean (surrounding Antarctica), Arctic Ocean (around North Pole)',
            'Straits and channels: The Palk Strait connecting the Bay of Bengal and Gulf of Mannar',
            'Significance of oceans in planetary temperature regulation, rainfall, marine ecology, and global trade',
          ],
          learningObjectives: [
            'Identify and label all 7 continents and 5 oceans on world outline maps',
            'Differentiate between an isthmus (narrow land strip) and a strait (narrow water channel)',
            'Evaluate the strategic and economic significance of maritime oceanic passages',
          ],
        },
        {
          id: 'ch-6-soc-es-3',
          name: 'Chapter 3: Landforms and Life',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 3',
          syllabusTopics: [
            'Internal (Endogenic) vs External (Exogenic) processes shaping the Earth’s surface (upliftment, erosion, and deposition)',
            'Mountains and Mountain Types: Fold mountains (Himalayas, Alps, ancient Aravalli range), Block mountains (faulting, horsts, and graben/rift valleys), Volcanic mountains (Mt. Kilimanjaro, Mt. Fujiyama)',
            'Plateaus: Elevated flat-topped tablelands; Deccan Plateau, Chhota Nagpur Plateau (mineral wealth), Tibetan Plateau (highest in the world)',
            'Plains: Low-lying fertile flatlands formed by river sediment deposition (Indo-Gangetic plain, Yangtze basin)',
            'How physical landforms directly shape human livelihoods, transportation networks, agriculture, architecture, and settlements',
          ],
          learningObjectives: [
            'Distinguish fold, block, and volcanic mountains based on geological forces',
            'Explain why river plains are the most densely populated regions on Earth',
            'Relate mineral availability in plateaus to human mining and industrial centers',
          ],
        },

        // THEME B: Tapestry of the Past (History Focus)
        {
          id: 'ch-6-soc-es-4',
          name: 'Chapter 4: Timeline and Sources of History',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 4',
          syllabusTopics: [
            'Measuring historical time: BCE (Before Common Era), CE (Common Era), Circa (c.), and Millennia',
            'Why study history: Understanding human evolution, cultural heritage, technological innovations, and societal transformations',
            'Archaeological sources: Material remains, pottery (Ochre Coloured Pottery, Painted Grey Ware), tools, ornaments, terracotta seals, and numismatics (study of coins)',
            'Epigraphical sources: Inscriptions engraved on stones, copper plates, pillar edicts (Epigraphy and Palaeography)',
            'Literary sources: Handwritten manuscripts on birch bark (bhurjapatra) and palm leaves; sacred literature (Vedas, Upanishads, Epics), secular literature (Kautilya’s Arthashastra, Kalidasa’s plays), and foreign travelogues (Megasthenes, Xuanzang)',
            'Methods of archaeological dating: Stratigraphy and Radiocarbon (14C) dating',
          ],
          learningObjectives: [
            'Construct and interpret multi-century chronological timelines using BCE and CE dating',
            'Classify historical evidence into primary archaeological and secondary literary records',
            'Explain how historians and archaeologists cross-examine artifacts to reconstruct ancient life',
          ],
        },
        {
          id: 'ch-6-soc-es-5',
          name: 'Chapter 5: India, That Is Bharat',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 5',
          syllabusTopics: [
            'Historical names of the country: Origins of "Bharat" and "Bharatvarsha" from the Rigvedic Bharata community; celebrated in the Vishnu Purana as the sacred land south of the Himalayas and north of the sea',
            'Origins of "India" and "Hind" from the great river Sindhu (Indus); Old Persian (Hindu) and Greek (Indos) linguistic shifts',
            'Cosmological reference: "Jambudvipa" (the continent of the Jambu tree) in ancient texts and Ashokan inscriptions',
            'Subcontinental geography: Natural frontiers formed by the Himalayan mountain wall, Hindukush passes (Khyber and Bolan), desert expanses, and the Indian Ocean coastline',
            'Cultural continuity and synthesis: How internal rivers (Ganga, Yamuna, Godavari, Kaveri, Narmada) facilitated cultural pilgrimage, migration, and trade networks',
          ],
          learningObjectives: [
            'Trace the etymology and historical contexts of Bharat, India, and Hindustan',
            'Analyze how physical geography both protected and connected the Indian subcontinent to world civilizations',
            'Appreciate the foundational civilizational continuity binding diverse Indian communities',
          ],
        },
        {
          id: 'ch-6-soc-es-6',
          name: 'Chapter 6: The Beginnings of Indian Civilisation',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 6',
          syllabusTopics: [
            'Prehistoric foundations: Paleolithic hunters-gatherers (Bhimbetka rock paintings), Mesolithic microliths, Neolithic farming villages (Mehrgarh, early agriculture 7000 BCE)',
            'Indus-Saraswati (Harappan) Civilisation (c. 2600–1900 BCE): Geographical extent across northwestern India and Pakistan',
            'Urban town planning and architecture: The Citadel (administrative/ritual platform) and Lower Town (residential sectors), standardized baked bricks in 1:2:4 ratio, gridiron street layout',
            'Hydraulic and sanitation engineering: Covered street drains with soak pits, domestic bathing platforms, The Great Bath at Mohenjo-Daro, and water harvesting reservoirs at Dholavira',
            'Economy, craftsmanship, and trade: Steatite seals featuring unicorn and bull emblems, bronze dancing girl, bead manufacturing at Lothal dockyard, standardized chert weights',
            'Writing system (undeciphered script) and historical hypotheses for urban de-urbanization (monsoon shift, drying of the Saraswati river system)',
          ],
          learningObjectives: [
            'Assess the pioneering sanitation and municipal town planning of the Bronze Age Harappan civilization',
            'Analyze archaeological artifacts to deduce ancient crafts, trade networks, and social organization',
            'Evaluate environmental factors influencing the rise and transformation of early riverine cities',
          ],
        },

        // THEME C: Our Cultural Heritage and Knowledge Traditions (Culture & History Focus)
        {
          id: 'ch-6-soc-es-7',
          name: 'Chapter 7: India\'s Cultural Roots',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 7',
          syllabusTopics: [
            'The Vedic heritage: Rigveda, Samaveda, Yajurveda, Atharvaveda; hymns (suktas), sages (rishis), and the oral tradition of preservation (Shruti and Smriti)',
            'Upanishadic philosophy: Dialogue-based inquiries into the soul (Atman), ultimate reality (Brahman), ethical living, and truth (Satya)',
            'Epics and cultural narratives: The Ramayana and Mahabharata, ethical dilemmas (Dharma), Panchatantra fables, and Buddhist Jataka tales',
            'Sramana and ascetic traditions: Vardhamana Mahavira and Jainism (Ahimsa, Satya, Aparigraha, Anekantavada); Gautama Buddha and Buddhism (Four Noble Truths, Eightfold Path, compassion, universal fraternity)',
            'Ancient Indian contributions to global knowledge traditions: Aryabhata, decimal system, concept of zero (Shunya); Ayurveda (Charaka Samhita, Sushruta Samhita); metallic metallurgy (iron pillar of Delhi, zinc smelting)',
          ],
          learningObjectives: [
            'Articulate core philosophical tenets of Vedic, Upanishadic, Buddhist, and Jain traditions',
            'Recognize the vital contributions of ancient Indian thinkers to global mathematics, medicine, and metallurgy',
            'Evaluate the timeless ethical principles of Ahimsa, Dharma, and non-possessiveness in daily conduct',
          ],
        },
        {
          id: 'ch-6-soc-es-8',
          name: 'Chapter 8: Unity in Diversity, or \'Many in the One\'',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 8',
          syllabusTopics: [
            'Understanding diversity: Plurality in languages (22 Scheduled Languages, hundreds of dialects), dietary cultures, costumes, folk dances, musical traditions, and festivals',
            'Geographical and historical determinants of regional cultures: Comparative case study of high-altitude desert Ladakh (pashmina wool, Tibetan Buddhism, caravan trade) versus tropical coastal Kerala (spice trade, multi-religious cohabitation: Jewish, Christian, Muslim, Hindu communities)',
            'Cultural synthesis: How internal pilgrimages, trade routes, and syncretic festivals blended traditions over millennia',
            'Coining of "Unity in Diversity": Jawaharlal Nehru in "The Discovery of India" explaining how unity is an inner emotional synthesis rather than an imposed uniformity',
            'National symbols fostering constitutional unity: The National Flag (Tiranga), National Anthem (Jana Gana Mana), Ashokan Lion Capital, and Constitution Day (Samvidhan Diwas)',
          ],
          learningObjectives: [
            'Explain how geographic setting and historic trade shape regional dietary, occupational, and cultural patterns',
            'Articulate why diversity is an enriching national asset rather than a source of division',
            'Identify shared national symbols that embody India’s collective constitutional identity',
          ],
        },

        // THEME D: Governance and Democracy (Political Science / Civics Focus)
        {
          id: 'ch-6-soc-es-9',
          name: 'Chapter 9: Family and Community',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 9',
          syllabusTopics: [
            'Family as the fundamental primary unit of society: Nuclear and joint families, lineage, and kinship ties',
            'Interdependence and mutual care: Nurturing children, respecting and supporting elderly members, emotional security, and transmission of core human values',
            'Community life and social cohesion: Neighborhoods, villages, schools, cooperative societies, and self-help groups (SHGs)',
            'Collective labor and mutual aid: Community volunteering (Shramadaan), cooperative harvesting, festival arrangements, and crisis management during floods or droughts',
            'Constructive conflict resolution: Solving neighborhood disputes through open dialogue, compromise, fairness, and empathy',
          ],
          learningObjectives: [
            'Recognize the vital role of family interdependence in personal well-being and social harmony',
            'Demonstrate civic responsibility, mutual respect, and collaborative problem-solving within community settings',
          ],
        },
        {
          id: 'ch-6-soc-es-10',
          name: 'Chapter 10: Grassroots Democracy — Part 1: Governance',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 10',
          syllabusTopics: [
            'What is Governance: Why human societies need collective rules, laws, and public administration to prevent anarchy and protect welfare',
            'Core responsibilities of government: Public utilities (safe drinking water, sanitation, electricity, roads), national security, public health, primary education, disaster relief, and law enforcement',
            'The Three Tiers of Government in India: Local Level (Gram Panchayat / Municipality), State Level (State Legislative Assemblies), National / Central Level (Parliament of India in New Delhi)',
            'Forms of Government: Democracy (rule by the people through elected representatives), Monarchy (hereditary king/queen), Authoritarianism / Dictatorship',
            'Hallmarks of Democratic Governance: Universal Adult Franchise (voting rights for all citizens aged 18+), free and fair periodic elections, rule of law, equality before the law, and freedom of expression',
          ],
          learningObjectives: [
            'Differentiate the jurisdictions and functions of local, state, and central governments in India',
            'Explain how Universal Adult Franchise empowers every citizen equally regardless of wealth or gender',
            'Identify key democratic processes that ensure government accountability to the public',
          ],
        },
        {
          id: 'ch-6-soc-es-11',
          name: 'Chapter 11: Grassroots Democracy — Part 2: Local Government in Rural Areas',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 11',
          syllabusTopics: [
            'The Panchayati Raj System (73rd Constitutional Amendment Act spirit): Direct democracy at village level',
            'The Gram Sabha: Sovereign assembly of all adult registered voters in a village; reviews development plans, audits panchayat expenses, and monitors poverty-alleviation beneficiaries',
            'The Gram Panchayat: Elected executive committee divided into wards; headed by the Sarpanch (Panchayat President) and Ward Panchs (elected for 5-year terms)',
            'Panchayat Secretary: Government-appointed administrative officer responsible for convening meetings, recording proceedings, and maintaining official accounts',
            'The Three Tiers of Rural Local Self-Government: Gram Panchayat (Village), Panchayat Samiti / Janpad Panchayat (Block), Zila Parishad (District)',
            'Rural administrative machinery: The Patwari (village land record keeper, maintaining field maps and Khasra registers); the local Police Station headed by Station House Officer (SHO), jurisdiction and First Information Report (FIR)',
          ],
          learningObjectives: [
            'Explain how the Gram Sabha exercises democratic vigilance over the Gram Panchayat',
            'Differentiate between elected representatives (Sarpanch, Panch) and government-appointed civil servants (Panchayat Secretary, Patwari)',
            'Understand the procedure for filing an FIR and seeking grievance redressal in rural administration',
          ],
        },
        {
          id: 'ch-6-soc-es-12',
          name: 'Chapter 12: Grassroots Democracy — Part 3: Local Government in Urban Areas',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 12',
          syllabusTopics: [
            'Urban Local Governance institutions (74th Constitutional Amendment Act): Nagar Panchayats (transitional areas), Municipal Councils (smaller cities), Municipal Corporations (metropolitan cities like Mumbai, Delhi, Kolkata, Chennai, Bengaluru)',
            'Structure of a Municipal Corporation: Ward Councillors (elected by citizens from city wards), The Mayor (political head of the corporation), The Municipal Commissioner (administrative head, senior IAS officer)',
            'Core civic services: Potable water supply, solid waste collection and recycling, sewage treatment, street lighting, public parks, birth and death registration, public health clinics, and fire safety',
            'Citizen participation and collective petitions: Resident Welfare Associations (RWAs), community petitions, ward committees, and municipal grievance portals',
            'Municipal revenue and fiscal resources: Property tax on houses and land, water and drainage tax, trade license fees, market octroi, and developmental grants from state governments',
          ],
          learningObjectives: [
            'Describe the structural difference between Municipal Corporations, Municipal Councils, and Nagar Panchayats',
            'Trace how civic taxes fund public infrastructure, cleanliness, and public health in urban areas',
            'Understand citizen mechanisms for raising civic grievances and participating in municipal decision-making',
          ],
        },

        // THEME E: Economic Life Around Us (Economics Focus)
        {
          id: 'ch-6-soc-es-13',
          name: 'Chapter 13: The Value of Work',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 13',
          syllabusTopics: [
            'Defining Work and Labor: Physical manual labor vs intellectual and creative work; occupational diversity in society',
            'Paid Market Work vs Unpaid Domestic Work: Recognizing the indispensable economic, emotional, and social contribution of unpaid household work (cooking, cleaning, childcare, eldercare) disproportionately borne by women',
            'The Dignity of Labor (Shramadaan): Mahatma Gandhi’s moral philosophy emphasizing that every honest occupation deserves equal respect and honor, rejecting social hierarchies based on work',
            'Specialization and interdependence: How farmers, factory workers, doctors, teachers, truck drivers, and sanitation workers form a cooperative web essential for civilizational functioning',
            'Eradicating workplace prejudice: Promoting gender equality in employment and eliminating discriminatory social stigmas associated with sanitation and manual labor',
          ],
          learningObjectives: [
            'Appreciate the dignity of all forms of honest labor and reject social prejudices based on occupations',
            'Evaluate the critical economic and social value of unpaid domestic care work',
            'Understand Mahatma Gandhi’s philosophy of manual work and personal responsibility for cleanliness',
          ],
        },
        {
          id: 'ch-6-soc-es-14',
          name: 'Chapter 14: Economic Activities Around Us',
          textbookRef: 'NCERT Exploring Society: India and Beyond — Chapter 14',
          syllabusTopics: [
            'The Three Sectors of Economic Activities:',
            '  1. Primary Sector: Direct extraction and utilization of natural resources (agriculture, fishing, mining, dairy farming, forestry)',
            '  2. Secondary Sector: Transforming raw materials into finished consumer goods through manufacturing and processing (textile mills, steel plants, food processing, construction)',
            '  3. Tertiary Sector: Providing essential services supporting production and daily living (transportation, banking, healthcare, schooling, IT, telecommunications, retail)',
            'The Journey of Goods: How agricultural and manufactured goods move through supply chains from farm/factory to wholesale mandis, weekly village haats, neighborhood retail stores, and online e-commerce platforms',
            'Money as a Medium of Exchange: Limitations of the ancient Barter System (double coincidence of wants), evolution of metallic coinage, paper currency notes, bank cheques, and modern Unified Payments Interface (UPI) digital transactions',
            'Livelihood security, self-employment, micro-enterprises, and financial literacy (savings, bank accounts, self-help groups)',
          ],
          learningObjectives: [
            'Categorize local occupations into Primary, Secondary, and Tertiary sectors of the economy',
            'Trace the complete supply chain and value addition journey of a product from raw material to consumer purchase',
            'Explain how money and digital payment systems overcome the challenges of the barter system',
          ],
        },

        // --- CLASSIC NCERT REFERENCE CHAPTERS (Our Pasts I, The Earth: Our Habitat, Social & Political Life I) ---
        {
          id: 'ch-6-soc-1',
          name: 'Classic History: What, Where, How and When?',
          textbookRef: 'NCERT Our Pasts I — Chapter 1',
          syllabusTopics: ['Hunting-gathering along Narmada river valley', 'Early farming in Sulaiman and Kirthar hills (wheat and barley 8000 years ago)', 'Garo hills and Indus-Ganga plains development', 'Manuscripts (palm leaf/birch bark), Inscriptions, and Archaeology dating'],
          learningObjectives: ['Analyze sources of historical evidence and carbon-14 dating', 'Understand geographic factors in early human settlements'],
        },
        {
          id: 'ch-6-soc-2',
          name: 'Classic History: In the Earliest Cities (Harappan Civilisation)',
          textbookRef: 'NCERT Our Pasts I — Chapter 3',
          syllabusTopics: ['Town planning: Citadel and Lower Town with interlocking baked bricks', 'The Great Bath at Mohenjo-Daro and covered drainage system', 'Crafts: bronze smiths, steatite seals, terracotta toys, bead making in Lothal', 'Trade routes and causes of Harappan decline'],
          learningObjectives: ['Evaluate municipal and architectural feats of Bronze Age India', 'Understand archaeological evidence for ancient urban trade'],
        },
        {
          id: 'ch-6-soc-3',
          name: 'Classic History: Ashoka, The Emperor Who Gave Up War',
          textbookRef: 'NCERT Our Pasts I — Chapter 7',
          syllabusTopics: ['Mauryan Empire: Chandragupta, Chanakya (Arthashastra), Pataliputra administration', 'The Kalinga War and Ashoka’s remorse leading to Dhamma', 'Ashoka’s edicts engraved in Prakrit and Brahmi script', 'Dhamma Mahamattas, peace missions to Sri Lanka and Greece, Ashokan Lion Capital'],
          learningObjectives: ['Analyze Ashoka’s ethical transformation from conquest to Dhamma', 'Appreciate the origin of India’s national emblem'],
        },
        {
          id: 'ch-6-soc-4',
          name: 'Classic Geography: The Earth in the Solar System',
          textbookRef: 'NCERT The Earth Our Habitat — Chapter 1',
          syllabusTopics: ['Celestial bodies, constellations (Ursa Major/Saptarishi), Pole Star', 'Sun, eight planets, dwarf planets (Pluto), asteroids and meteoroids', 'Earth as a unique planet: Goldilocks zone, water and atmosphere', 'Moon phases, orbital period (27 days), Neil Armstrong 1969'],
          learningObjectives: ['Explain planetary arrangements and conditions supporting terrestrial life', 'Distinguish meteoroids, asteroids, and comets'],
        },
        {
          id: 'ch-6-soc-5',
          name: 'Classic Geography: Globe — Latitudes and Longitudes',
          textbookRef: 'NCERT The Earth Our Habitat — Chapter 2',
          syllabusTopics: ['Axis of rotation, Equator (0°), Tropics of Cancer and Capricorn (23.5°)', 'Heat zones: Torrid, Temperate, and Frigid Zones', 'Prime Meridian (Greenwich 0°), Indian Standard Time (82.5° E)', 'Calculating local time differences ($1^\\circ = 4\\text{ minutes}$)'],
          learningObjectives: ['Locate coordinates on the global geographic grid', 'Calculate standard time offsets relative to GMT and IST'],
          coreFormulas: ['1^\\circ \\text{ Longitude} = 4 \\text{ minutes}', '\\text{IST} = \\text{GMT} + 5\\text{ h } 30\\text{ min}'],
        },
        {
          id: 'ch-6-soc-6',
          name: 'Classic Geography: Major Domains of the Earth',
          textbookRef: 'NCERT The Earth Our Habitat — Chapter 5',
          syllabusTopics: ['Lithosphere: Continents (Asia, Africa, North America, South America, Antarctica, Europe, Australia)', 'Hydrosphere: Oceans (Pacific, Atlantic, Indian, Southern, Arctic)', 'Atmosphere: Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere', 'Biosphere: The narrow zone of interaction supporting life'],
          learningObjectives: ['Map the 7 continents and 5 ocean basins', 'Explain the interconnectedness of lithosphere, hydrosphere, and atmosphere'],
        },
        {
          id: 'ch-6-soc-7',
          name: 'Classic Civics: Understanding Diversity & What is Government?',
          textbookRef: 'NCERT Social and Political Life I — Chapters 1 & 3',
          syllabusTopics: ['Cultural, religious, and linguistic diversity in India (comparing Ladakh and Kerala)', 'Unity in Diversity coined by Jawaharlal Nehru in "Discovery of India"', 'Levels of government: Local, State, National', 'Democratic governments: Universal Adult Franchise and representative democracy'],
          learningObjectives: ['Appreciate Indian pluralism and national unity', 'Understand the functions and constitutional legitimacy of democratic government'],
        },
        {
          id: 'ch-6-soc-8',
          name: 'Classic Civics: Panchayati Raj & Rural Administration',
          textbookRef: 'NCERT Social and Political Life I — Chapters 5 & 6',
          syllabusTopics: ['Gram Sabha (all adults of village) and Gram Panchayat (Sarpanch and Ward Panchs)', 'Three tiers: Gram Panchayat, Panchayat Samiti (Block), Zila Parishad (District)', 'Patwari (village record keeper, land maps/Khasra)', 'Police station jurisdiction and filing an FIR (First Information Report)'],
          learningObjectives: ['Explain grass-roots local self-governance in rural India', 'Understand the roles of the Sarpanch and the Patwari in village administration'],
        },
      ],
    },
    {
      id: 'cbse-6-foundation',
      name: 'Foundation & Olympiads (Class 6 STEM & MAT)',
      category: 'Foundation & Olympiads',
      curricula: ['Class 6 IIT-JEE & NEET STEM Foundation', 'NSTSE & National Science Olympiad'],
      chapters: [
        {
          id: 'ch-6-fd-1',
          name: 'Foundation Physics: Motion, Speed & Measurement Units',
          textbookRef: 'Class 6 STEM Foundation — Chapter 1',
          syllabusTopics: ['SI units, metric prefixes (kilo, mega, micro, nano)', 'Rectilinear, circular, periodic, and compound motion', 'Average speed formulas for equal distance vs equal time intervals', 'Interpreting distance-time slopes and velocity vectors'],
          learningObjectives: ['Calculate harmonic and arithmetic average speeds in travel problems', 'Analyze kinematic graphs for stationary, uniform, and accelerating bodies'],
          coreFormulas: ['v_{\\text{avg (equal dist)}} = \\frac{2v_1v_2}{v_1 + v_2}', 'v_{\\text{avg (equal time)}} = \\frac{v_1 + v_2}{2}']
        },
        {
          id: 'ch-6-fd-2',
          name: 'Foundation Chemistry: States of Matter & Separation Techniques',
          textbookRef: 'Class 6 STEM Foundation — Chapter 2',
          syllabusTopics: ['Kinetic molecular theory of particles: packing, spacing, and intermolecular forces', 'Pure elements and compounds vs homogeneous and heterogeneous mixtures', 'Fractional crystallization, centrifugation, paper chromatography, distillation', 'Solubility curves and crystallization'],
          learningObjectives: ['Formulate multi-step industrial separation protocols', 'Explain phase transitions in terms of latent heat and particle kinetics']
        },
        {
          id: 'ch-6-fd-3',
          name: 'Foundation Math: Olympiad Number Theory & Prime Factorization',
          textbookRef: 'Class 6 Math Olympiad Foundation — Chapter 3',
          syllabusTopics: ['Fundamental Theorem of Arithmetic', 'Advanced HCF and LCM word problems with remainders', 'Divisibility proofs using digital roots (mod 9, 11)', 'Unit digit cycles of powers ($2^n, 3^n, 7^n, 8^n$ cyclicity of 4)'],
          learningObjectives: ['Determine the unit digit of large exponential expressions', 'Find total number of divisors of composite numbers using prime exponents'],
          coreFormulas: ['N = p_1^a p_2^b \\implies \\text{Divisors} = (a+1)(b+1)']
        },
        {
          id: 'ch-6-fd-4',
          name: 'Foundation Math: Early Algebra & Geometric Theorems',
          textbookRef: 'Class 6 Math Olympiad Foundation — Chapter 4',
          syllabusTopics: ['Algebraic identities: $(a+b)^2, (a-b)^2, a^2 - b^2$', 'Linear equations in one variable with fractional terms', 'Angle sum property of polygons: $(n - 2) \\times 180^\\circ$', 'Exterior angle sum of any convex polygon ($360^\\circ$)'],
          learningObjectives: ['Calculate interior and exterior angles of regular polygons', 'Solve multi-step linear word problems using algebraic equations'],
          coreFormulas: ['\\text{Sum of Interior Angles} = (n - 2) \\times 180^\\circ']
        },
        {
          id: 'ch-6-fd-5',
          name: 'Mental Ability (MAT): Verbal & Non-Verbal Olympiad Reasoning',
          textbookRef: 'Class 6 NTSE & MAT Guide — Chapter 5',
          syllabusTopics: ['Verbal analogies, coding-decoding, and family tree blood relations', 'Alphabet skipping patterns and grid matrices', 'Non-verbal reasoning: paper folding, punch holes, mirror reflections, and figure matrices'],
          learningObjectives: ['Solve coded genealogical relations systematically', 'Visualize spatial rotations and mirror reflections mentally']
        }
      ]
    }
  ]
};
