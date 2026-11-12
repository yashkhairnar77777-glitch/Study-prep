import { SyllabusClassInfo } from './types';

export const cbseClass5: SyllabusClassInfo = {
  id: 'cbse-class-5',
  name: 'Class 5 (Primary)',
  gradeEquivalent: 'Class 1-5 (Primary)',
  subjects: [
    {
      id: 'cbse-5-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Math-Magic Class 5', 'NCERT Exemplar Class 5'],
      chapters: [
        {
          id: 'ch-5-m-1',
          name: 'The Fish Tale',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 1',
          syllabusTopics: ['Large numbers up to Lakhs and Crores', 'Place value chart and expansion', 'Speed, distance, time word problems', 'Loans and interest calculations'],
          learningObjectives: ['Read and write 7-8 digit numbers', 'Solve multi-step speed and boat journey problems', 'Calculate earnings and interest'],
          coreFormulas: ['\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}', '\\text{Profit} = \\text{SP} - \\text{CP}']
        },
        {
          id: 'ch-5-m-2',
          name: 'Shapes and Angles',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 2',
          syllabusTopics: ['Right angles, acute and obtuse angles', 'Angle testers and degree clock', 'Angles made by clock hands at different hours', 'Polygon rigidity and triangles'],
          learningObjectives: ['Classify angles in daily objects', 'Measure angles using degree estimations', 'Understand why triangles give architectural rigidity'],
          coreFormulas: ['\\text{Right Angle} = 90^\\circ', '\\text{Straight Angle} = 180^\\circ']
        },
        {
          id: 'ch-5-m-3',
          name: 'How Many Squares?',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 3',
          syllabusTopics: ['Perimeter of rectangular shapes', 'Area estimation on 1 cm grid paper', 'Halving rectangles into triangles to find triangle area', 'Comparing areas of stamps and footprints'],
          learningObjectives: ['Calculate area by counting grid squares', 'Find area of right triangles as half of rectangles'],
          coreFormulas: ['\\text{Area of Rectangle} = l \\times b', '\\text{Area of Triangle} = \\frac{1}{2} \\times \\text{Base} \\times \\text{Height}']
        },
        {
          id: 'ch-5-m-4',
          name: 'Parts and Wholes',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 4',
          syllabusTopics: ['Fractional parts of a whole (halves, quarters, tenths)', 'Fraction of a collection or set', 'Equivalent fractions and patterns', 'Adding and subtracting like fractions'],
          learningObjectives: ['Represent fractions pictorially', 'Solve word problems on sharing and fractional money parts'],
          coreFormulas: ['\\frac{a}{b} = \\frac{a \\times k}{b \\times k}']
        },
        {
          id: 'ch-5-m-5',
          name: 'Does It Look the Same?',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 5',
          syllabusTopics: ['Mirror symmetry and lines of symmetry', 'Quarter turn (90°) and half turn (180°) of shapes', 'Rotational symmetry of letters and geometric figures'],
          learningObjectives: ['Identify line of symmetry with mirror line', 'Determine how shapes appear after 1/4 and 1/2 turns']
        },
        {
          id: 'ch-5-m-6',
          name: 'Be My Multiple, I’ll be Your Factor',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 6',
          syllabusTopics: ['Multiples and Common Multiples', 'Factors, Factor Trees and Common Factors', 'Lowest Common Multiple (LCM) intuition', 'Highest Common Factor (HCF) intuition'],
          learningObjectives: ['Find common factors and common multiples of two or three numbers', 'Construct factor trees of composite numbers']
        },
        {
          id: 'ch-5-m-7',
          name: 'Can You See the Pattern?',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 7',
          syllabusTopics: ['Rotational pattern rules (quarter turn, half turn, 45° turn)', 'Magic squares (3x3 grid summing to 15 or 30)', 'Magic hexagons and number towers', 'Calendar magic patterns'],
          learningObjectives: ['Recognize arithmetic and geometric rules in patterns', 'Solve magic squares and missing cell challenges']
        },
        {
          id: 'ch-5-m-8',
          name: 'Mapping Your Way',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 8',
          syllabusTopics: ['Reading route maps and landmarks (India Gate, Rajpath, Rashtrapati Bhavan)', 'Map scale interpretation (e.g., 2 cm on map = 1 km on ground)', 'Enlarging and reducing grids'],
          learningObjectives: ['Determine real-world distances using map scales', 'Trace routes and navigate directional turns using maps']
        },
        {
          id: 'ch-5-m-9',
          name: 'Boxes and Sketches',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 9',
          syllabusTopics: ['2D nets of 3D solids (cube, cuboid, cylinder, cone)', 'Floor maps and deep drawings of houses', 'Isometric sketches and perspective drawings'],
          learningObjectives: ['Fold 2D nets into 3D open and closed boxes', 'Correlate floor plan layouts with 3D perspective sketches']
        },
        {
          id: 'ch-5-m-10',
          name: 'Tenths and Hundredths',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 10',
          syllabusTopics: ['Tenths ($0.1 = 1/10$) and Hundredths ($0.01 = 1/100$)', 'Measuring lengths in mm and cm using decimals', 'Money conversions (Rupees and Paise in decimals)', 'Comparing temperatures in weather charts'],
          learningObjectives: ['Convert between fractions and decimals', 'Use decimal notation for lengths, weights, and currency'],
          coreFormulas: ['1\\text{ cm} = 10\\text{ mm}', '1\\text{ Rupee} = 100\\text{ Paise}']
        },
        {
          id: 'ch-5-m-11',
          name: 'Area and Its Boundary',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 11',
          syllabusTopics: ['Perimeter of irregular polygons', 'Area of squares ($s^2$) and rectangles ($l \\times b$)', 'Fixed perimeter with varying area', 'Fencing costs and tiling cost calculations'],
          learningObjectives: ['Calculate perimeter and area of rectangular fields', 'Solve real-world word problems on carpeting and fencing'],
          coreFormulas: ['\\text{Perimeter of Rect} = 2(l + b)', '\\text{Area} = l \\times b']
        },
        {
          id: 'ch-5-m-12',
          name: 'Smart Charts',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 12',
          syllabusTopics: ['Tally marks (bundles of 5)', 'Bar charts and pictographs', 'Pie charts (chapati charts) reading halves, quarters', 'Family tree and growth chart tracking'],
          learningObjectives: ['Record data systematically using tally marks', 'Interpret bar graphs and circular fractions (pie charts)']
        },
        {
          id: 'ch-5-m-13',
          name: 'Ways to Multiply and Divide',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 13',
          syllabusTopics: ['Box multiplication method (Bela’s method)', 'Column multiplication with 2-digit and 3-digit numbers', 'Division algorithms (quotient, remainder, dividend = divisor x quotient + remainder)', 'Word problems on wages, rations, and farming'],
          learningObjectives: ['Master multi-digit multiplication and long division', 'Verify division using the remainder relation'],
          coreFormulas: ['\\text{Dividend} = \\text{Divisor} \\times \\text{Quotient} + \\text{Remainder}']
        },
        {
          id: 'ch-5-m-14',
          name: 'How Big? How Heavy?',
          textbookRef: 'NCERT Math-Magic Class 5 — Chapter 14',
          syllabusTopics: ['Volume by counting unit centimetre cubes', 'Liquid volume (litres and millilitres)', 'Weight measurement (grams and kilograms)', 'Water displacement method to measure volume of irregular objects'],
          learningObjectives: ['Understand 3D space and volume of cuboids', 'Measure liquid capacity and mass conversions'],
          coreFormulas: ['\\text{Volume of Cuboid} = l \\times b \\times h', '1\\text{ kg} = 1000\\text{ g}', '1\\text{ L} = 1000\\text{ mL}']
        }
      ]
    },
    {
      id: 'cbse-5-evs',
      name: 'Environmental Studies (EVS)',
      category: 'General Science',
      curricula: ['NCERT Looking Around Class 5', 'CBSE Elementary Science Curriculum'],
      chapters: [
        {
          id: 'ch-5-e-1',
          name: 'Super Senses',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 1',
          syllabusTopics: ['Exceptional sensory adaptations in animals (ant pheromones, eagle keen vision, silkworm scent detection)', 'Bat echolocation and dog olfactory sensitivity', 'Sleep patterns of animals (sloth 17 hours)', 'Endangered wildlife and poaching protection'],
          learningObjectives: ['Understand how animals use specialized senses to navigate, hunt, and communicate', 'Appreciate wildlife conservation in National Parks (Jim Corbett, Kaziranga)']
        },
        {
          id: 'ch-5-e-2',
          name: 'A Snake Charmer’s Story',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 2',
          syllabusTopics: ['Kalbeliya nomadic community traditions', 'Anatomy of snakes: fangs, venom glands, lack of external ears', 'Four poisonous snakes of India (Cobra, Common Krait, Russell’s Viper, Saw-scaled Viper)', 'Snakebite first aid and antivenom production'],
          learningObjectives: ['Identify venomous snakes of India', 'Explain the ecological role of snakes in agriculture']
        },
        {
          id: 'ch-5-e-3',
          name: 'From Tasting to Digesting',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 3',
          syllabusTopics: ['Taste zones on the tongue (sweet, salty, sour, bitter)', 'Action of saliva breaking down starch into simple sugars', 'Alimentary canal organs (stomach, small and large intestine)', 'Dr. Beaumont’s stomach window experiments', 'ORS preparation and glucose drip'],
          learningObjectives: ['Explain how digestion begins in the mouth', 'Prepare emergency Oral Rehydration Solution'],
          coreFormulas: ['\\text{ORS} = 1\\text{ L water} + 6\\text{ tsp sugar} + 1/2\\text{ tsp salt}']
        },
        {
          id: 'ch-5-e-4',
          name: 'Mangoes Round the Year',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 4',
          syllabusTopics: ['Causes of food spoilage (bacteria, fungi/mould)', 'Traditional preservation: sun drying, pickling, sugar syrups, salting', 'Making Mamidi Tandra (Aam Papad) in Andhra Pradesh', 'Reading food labels (expiry date, ingredients, MRP)'],
          learningObjectives: ['Identify signs of spoiled food', 'Explain physical and chemical methods of food preservation']
        },
        {
          id: 'ch-5-e-5',
          name: 'Seeds and Seeds',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 5',
          syllabusTopics: ['Conditions required for seed germination (air, water, warmth)', 'Dispersal mechanisms: wind, water, animal fur (Velcro invention by George de Mestral)', 'Pitcher plant (Nepenthes) insectivorous feeding', 'Global origins of common vegetables (chilli from South America)'],
          learningObjectives: ['Demonstrate seed germination requirements experimentally', 'Categorize seed dispersal adaptations']
        },
        {
          id: 'ch-5-e-6',
          name: 'Every Drop Counts',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 6',
          syllabusTopics: ['Historical water architecture: Ghadsisar lake of Jaisalmer, Baolis (stepwells)', 'Traditional rainwater harvesting and Johads', 'Tarun Bharat Sangh and water conservation movements', 'Groundwater recharge and current urban water crisis'],
          learningObjectives: ['Value community water management heritage', 'Propose rooftop rainwater conservation measures']
        },
        {
          id: 'ch-5-e-7',
          name: 'Experiments with Water',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 7',
          syllabusTopics: ['Floating and sinking of objects based on density and shape', 'Salt water density and the Dead Sea (floating without swimming)', 'Evaporation and condensation cycle', 'Dandi March of 1930 and salt extraction from seawater'],
          learningObjectives: ['Predict whether materials will sink or float in water', 'Understand historical civil rights and coastal salt pans']
        },
        {
          id: 'ch-5-e-8',
          name: 'A Treat for Mosquitoes',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 8',
          syllabusTopics: ['Mosquito-borne diseases: Malaria (Anopheles), Dengue, Chikungunya', 'Life cycle of mosquitoes (eggs, larvae, pupae, adults in stagnant water)', 'Ronald Ross discovery of malaria parasite in mosquito stomach', 'Anaemia, hemoglobin, and iron-rich foods (amla, jaggery, green leafy vegetables)'],
          learningObjectives: ['Prevent mosquito breeding around homes and schools', 'Identify symptoms and dietary remedies for anaemia']
        },
        {
          id: 'ch-5-e-9',
          name: 'Up You Go!',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 9',
          syllabusTopics: ['Mountaineering camp leadership and responsibilities', 'Equipment: pitons, ropes, sling, crampons, oxygen cylinders', 'Bachendri Pal’s historic summit of Mount Everest (Sagarmatha)', 'High altitude challenges: low oxygen, frostbite, blisters'],
          learningObjectives: ['Understand leadership traits and group coordination', 'Trace the historical achievement of Bachendri Pal']
        },
        {
          id: 'ch-5-e-10',
          name: 'Walls Tell Stories',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 10',
          syllabusTopics: ['Golconda Fort architecture and defence mechanisms (bastions, thick walls, iron spikes on gates)', 'Acoustic design: echo transmission from Fateh Darwaza to palace', 'Water lifting systems using bullock wheels and pipes', 'Museum artifacts and historical preservation'],
          learningObjectives: ['Analyze medieval fort engineering and defence strategies', 'Appreciate the role of museums in preserving cultural heritage']
        },
        {
          id: 'ch-5-e-11',
          name: 'Sunita in Space',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 11',
          syllabusTopics: ['Astronaut Sunita Williams and life in the International Space Station', 'Microgravity effects: floating food, floating hair, zero weight sensation', 'Earth viewed from space: no national borders, oceans and land', 'Gravitational pull of Earth holding atmosphere and water'],
          learningObjectives: ['Contrast life in zero gravity with life on Earth', 'Understand that gravity keeps everything anchored to Earth']
        },
        {
          id: 'ch-5-e-12',
          name: 'What If It Finishes...?',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 12',
          syllabusTopics: ['Fossil fuels: extraction and refining of petroleum (petrol, diesel, kerosene, LPG, wax)', 'Non-renewable resources taking millions of years to form under pressure', 'Air pollution from vehicular exhausts and traffic congestion', 'Renewable alternatives: solar power, wind turbines, electric vehicles, cycling'],
          learningObjectives: ['Analyze the exhaustibility of petroleum reserves', 'Promote energy conservation and public transport usage']
        },
        {
          id: 'ch-5-e-13',
          name: 'A Shelter So High!',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 13',
          syllabusTopics: ['Gaurav Jani’s motorcycle journey to Ladakh (Cold Desert of Changthang)', 'Changpa nomadic tribe and their Changra goats producing Pashmina wool', 'Rebo tents and Dabha stone houses designed for -40°C winters', 'Houseboats (Shikaras) and Donga boats in Dal Lake, Srinagar'],
          learningObjectives: ['Contrast hot desert (Thar) with cold desert (Ladakh)', 'Appreciate nomadic culture and the craft of Pashmina shawls']
        },
        {
          id: 'ch-5-e-14',
          name: 'When the Earth Shook!',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 14',
          syllabusTopics: ['Earthquake causes and the 26 January 2001 Gujarat earthquake in Bhuj', 'Earthquake safety drill: Drop, Cover, Hold on; open fields', 'Community rescue efforts, NDRF, fire service, medical aid', 'Earthquake-resilient bamboo and mud architecture'],
          learningObjectives: ['Execute earthquake survival drills calmly', 'Understand community solidarity and rehabilitation after disasters']
        },
        {
          id: 'ch-5-e-15',
          name: 'Blow Hot, Blow Cold',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 15',
          syllabusTopics: ['Thermal properties of breath: cooling hot food vs warming cold hands', 'Dr. Zakir Hussain’s story of the woodcutter and Mian Balishtiye', 'Evaporative cooling and condensation of breath on spectacles', 'Stethoscope mechanism and musical wind instruments (flute, shehnai)'],
          learningObjectives: ['Explain how breath interacts thermally with objects', 'Construct simple model stethoscope and explain pulse rate']
        },
        {
          id: 'ch-5-e-16',
          name: 'Who Will Do This Work?',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 16',
          syllabusTopics: ['Dignity of labour and manual scavenging eradication', 'Mahatma Gandhi’s philosophy of cleanliness and equality at Sabarmati Ashram', 'Dr. B. R. Ambedkar’s constitutional fight against caste untouchability', 'Modern mechanized sanitation equipment'],
          learningObjectives: ['Uphold dignity of all forms of work and sanitation workers', 'Reject caste discrimination and promote civic cleanliness']
        },
        {
          id: 'ch-5-e-17',
          name: 'Across the Wall',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 17',
          syllabusTopics: ['Gender equality in sports: story of Afsana Mansuri and Nagpada Basketball Association', 'Overcoming social prejudice and gender barriers in athletics', 'Team spirit, mutual encouragement, and sportsmanship over individual glory', 'Physical fitness and emotional resilience'],
          learningObjectives: ['Break gender stereotypes in sports and career choices', 'Value team synergy and collaboration']
        },
        {
          id: 'ch-5-e-18',
          name: 'No Place for Us?',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 18',
          syllabusTopics: ['Displacement of villagers due to large dam construction (Khedi village)', 'Loss of ancestral culture, communal bonds, and nature connection', 'Urban migration struggles: expensive living, slums, pollution, informal work', 'Benefits and human costs of major development projects'],
          learningObjectives: ['Critique the socio-economic impacts of involuntary displacement', 'Develop empathy for displaced families adapting to city life']
        },
        {
          id: 'ch-5-e-19',
          name: 'A Seed Tells a Farmer’s Story',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 19',
          syllabusTopics: ['Traditional organic agriculture in Vankan village (Bajra seeds stored with neem leaves)', 'Shift to modern agriculture: hybrid seeds, chemical fertilizers, pesticides, tube wells', 'Loss of indigenous seed biodiversity and rising farm debt', 'Vermicomposting and organic farming revitalisation'],
          learningObjectives: ['Compare sustainable traditional farming with intensive chemical farming', 'Explain the vital importance of seed preservation banks']
        },
        {
          id: 'ch-5-e-20',
          name: 'Whose Forests?',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 20',
          syllabusTopics: ['Adivasi forest dwellers (Kuduk community of Jharkhand) and Suryamani', 'Torang center: preserving tribal language, music, crafts, and medicinal herbs', 'Right to Forest Act 2007: rights of forest communities living for 25+ years', 'Deforestation due to mining, dams, and industrial exploitation'],
          learningObjectives: ['Explain the ecological stewardship of indigenous tribal communities', 'Analyze the provisions of the Forest Rights Act']
        },
        {
          id: 'ch-5-e-21',
          name: 'Like Father, Like Daughter',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 21',
          syllabusTopics: ['Inherited physical traits (eye color, hair texture, dimples, height, sneezing habits)', 'Gregor Mendel’s experiments on pea plants (dominant vs recessive traits)', 'Acquired traits (polio from viral infection, not hereditary; pulse polio drops)', 'Identical twins vs fraternal twins'],
          learningObjectives: ['Distinguish hereditary traits from environmental and acquired traits', 'Understand Gregor Mendel’s foundational genetics discovery']
        },
        {
          id: 'ch-5-e-22',
          name: 'On the Move Again',
          textbookRef: 'NCERT Looking Around Class 5 — Chapter 22',
          syllabusTopics: ['Seasonal migration of sugarcane cutting farm labourers (Dhanu’s family)', 'Mukkadam (loan agent) and cycle of seasonal debt', 'Disruption of children’s continuous schooling during migration', 'Alternative educational models for migratory agricultural children'],
          learningObjectives: ['Understand the socio-economic challenges of seasonal migrant workers', 'Advocate for educational continuity for all children']
        }
      ]
    },
    {
      id: 'cbse-5-japanese',
      name: 'Japanese (NCERT Ume / 初級日本語)',
      category: 'Japanese',
      curricula: ['NCERT Japanese Ume Class 5', 'The Japan Foundation Junior Japanese Curriculum'],
      chapters: [
        {
          id: 'ch-5-jp-1',
          name: 'Lesson 1: あいさつ (Aisatsu - Daily Greetings & Etiquette)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 1',
          syllabusTopics: ['Ohayou gozaimasu, Konnichiwa, Konbanwa, Sayounara, Oyasuminasai', 'Arigatou gozaimasu, Sumimasen, Douitashimashite', 'Bowing etiquette (Ojigi) and classroom politeness'],
          learningObjectives: ['Greet teachers and friends using correct time-appropriate Japanese greetings', 'Express thanks and polite apologies with proper bowing posture']
        },
        {
          id: 'ch-5-jp-2',
          name: 'Lesson 2: じこしょうかい (Jikoshoukai - Self-Introduction)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 2',
          syllabusTopics: ['Hajimemashite formula', 'Watashi wa [Name] desu', 'Douzo yoroshiku onegaishimasu', 'Country and nationality: Indo-jin, Nihon-jin'],
          learningObjectives: ['Deliver a complete and polite self-introduction in Japanese', 'State your name, nationality, and grade level'],
          coreFormulas: ['\\text{Watashi wa } [\\text{Name}] \\text{ desu}', '\\text{Douzo yoroshiku onegaishimasu}']
        },
        {
          id: 'ch-5-jp-3',
          name: 'Lesson 3: すうじ と とし (Suuji to Toshi - Numbers 1–100 & Age)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 3',
          syllabusTopics: ['Numbers 1 to 10: Ichi, Ni, San, Shi/Yon, Go, Roku, Nana/Shichi, Hachi, Kyuu/Ku, Juu', 'Counting up to 100: Ni-juu, San-juu, Hyaku (100)', 'Asking and answering age: Nan-sai desu ka? Juu-sai desu', 'Telephone numbers and room numbers using particle no'],
          learningObjectives: ['Count fluently from 1 to 100 in Japanese', 'State your age and phone number accurately'],
          coreFormulas: ['[\\text{Number}]\\text{-sai desu (Age)}', '[\\text{No.}] \\text{ no } [\\text{No.}] \\text{ desu (Phone)}']
        },
        {
          id: 'ch-5-jp-4',
          name: 'Lesson 4: きょうしつの もの (Classroom Objects & Demonstratives)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 4',
          syllabusTopics: ['Demonstratives: Kore (this), Sore (that), Are (that over there)', 'Hon, Enpitsu, Keshigomu, Nooto, Tsukue, Isu, Fudebako', 'Question word: Nan (What) — Kore wa nan desu ka?', 'Particle wa and copula desu'],
          learningObjectives: ['Identify classroom supplies using spatial demonstratives', 'Ask and answer questions about objects around you'],
          coreFormulas: ['\\text{Kore / Sore / Are wa } [\\text{Noun}] \\text{ desu}', '\\text{Kore wa nan desu ka?}']
        },
        {
          id: 'ch-5-jp-5',
          name: 'Lesson 5: いろ と かたち (Iro to Katachi - Colors and Shapes)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 5',
          syllabusTopics: ['Aka (red), Ao (blue), Kiiro (yellow), Shiro (white), Kuro (black), Midori (green)', 'Shapes: Maru (circle), Shikaku (square), Sankaku (triangle)', 'Describing objects with color adjectives: Akai enpitsu, Aoi nooto', 'Question: Kore wa nan-iro desu ka?'],
          learningObjectives: ['Name primary and secondary colors in Japanese', 'Form basic noun phrases with Japanese color adjectives']
        },
        {
          id: 'ch-5-jp-6',
          name: 'Lesson 6: からだ (Karada - Parts of the Body)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 6',
          syllabusTopics: ['Atama (head), Me (eyes), Mimi (ears), Hana (nose), Kuchi (mouth), Te (hand), Ashi (leg/foot)', 'Simple songs: Atama, Kata, Hiza, Ashi (Head, Shoulders, Knees, and Toes)', 'Descriptive adjectives: Ookii (big), Chiisai (small)'],
          learningObjectives: ['Point to and name facial features and body parts in Japanese', 'Use simple size adjectives to describe anatomy']
        },
        {
          id: 'ch-5-jp-7',
          name: 'Lesson 7: わたしの かぞく (Watashi no Kazoku - My Family & Possessive の)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 7',
          syllabusTopics: ['Chichi (father), Haha (mother), Ani (older brother), Ane (older sister), Otouto (younger brother), Imouto (younger sister)', 'Polite forms: Otousan, Okaasan, Oniisan, Oneesan', 'Particle no for possession: Watashi no kazoku, Watashi no otoosan', 'Counting people: Hitori (1), Futari (2), San-nin (3), Yon-nin (4)'],
          learningObjectives: ['Introduce family members using humble and polite Japanese terms', 'State how many people are in your family'],
          coreFormulas: ['\\text{Watashi no kazoku wa } [\\text{Number}]\\text{-nin desu}']
        },
        {
          id: 'ch-5-jp-8',
          name: 'Lesson 8: どうぶつ と しぜん (Doubutsu to Shizen - Animals & Nature)',
          textbookRef: 'NCERT Japanese (Ume Class 5) — Lesson 8',
          syllabusTopics: ['Inu (dog), Neko (cat), Tori (bird), Sakana (fish), Uma (horse), Zou (elephant), Panda', 'Nature: Ki (tree), Hana (flower), Yama (mountain), Kawa (river), Sora (sky)', 'Animal sounds (Giseigo): Wan-wan, Nyaa-nyaa', 'Expressing love for pets: Neko ga daisuki desu'],
          learningObjectives: ['Name common pets and wildlife in Japanese', 'Express simple preferences and descriptions of animals']
        }
      ]
    },
    {
      id: 'cbse-5-english',
      name: 'English (NCERT Marigold)',
      category: 'English & Languages',
      curricula: ['NCERT Marigold Class 5', 'CBSE Elementary English Curriculum'],
      chapters: [
        {
          id: 'ch-5-eng-1',
          name: 'Unit 1: Ice-Cream Man & Wonderful Waste!',
          textbookRef: 'NCERT Marigold Class 5 — Unit 1',
          syllabusTopics: ['Sensory imagery in Rachel Field’s poem "Ice-Cream Man"', 'Folklore of Kerala: The invention of Avial from vegetable scraps', 'Zero waste and creative sustainability', 'Countable vs uncountable nouns, rhyming words'],
          learningObjectives: ['Identify rhyming words and summer sensory language', 'Appreciate traditional waste-reduction culinary techniques']
        },
        {
          id: 'ch-5-eng-2',
          name: 'Unit 2: Teamwork & Flying Together',
          textbookRef: 'NCERT Marigold Class 5 — Unit 2',
          syllabusTopics: ['Teamwork poem: Synergy and passing the baton in relay races', 'Panchatantra tale: The flock of geese and the hunter’s net', 'Contraction words (don’t, won’t, we’ll)', 'Past tense verbs and prepositions'],
          learningObjectives: ['Understand the power of collective effort in sports and life', 'Use contractions and regular past tense verbs correctly']
        },
        {
          id: 'ch-5-eng-3',
          name: 'Unit 3: My Shadow & Robinson Crusoe',
          textbookRef: 'NCERT Marigold Class 5 — Unit 3',
          syllabusTopics: ['Robert Louis Stevenson’s poem "My Shadow" (fun with light and shadows)', 'Robinson Crusoe discovers a human footprint on the desert island', 'Describing feelings of fear, curiosity, and loneliness', 'Opposite words and adverbs of manner'],
          learningObjectives: ['Analyze poetic personification of shadows', 'Write descriptive paragraphs expressing suspense and surprise']
        },
        {
          id: 'ch-5-eng-4',
          name: 'Unit 4: Crying & My Elder Brother',
          textbookRef: 'NCERT Marigold Class 5 — Unit 4',
          syllabusTopics: ['Galway Kinnell’s poem "Crying" (shedding tears until joy emerges)', 'Munshi Premchand’s classic "Bade Bhai Sahab" (Bhaiya and younger brother)', 'Experience vs bookish knowledge, sibling dynamics', 'Prefixes (un-, dis-, im-) and idioms'],
          learningObjectives: ['Appreciate emotional honesty and empathy', 'Understand Premchand’s moral about the wisdom of life experience']
        },
        {
          id: 'ch-5-eng-5',
          name: 'Unit 5: The Lazy Frog & Rip Van Winkle',
          textbookRef: 'NCERT Marigold Class 5 — Unit 5',
          syllabusTopics: ['Humorous poem "The Lazy Frog" (Fred refusing to help his mother)', 'Washington Irving’s story of Rip Van Winkle sleeping for 20 years in Kaatskill Mountains', 'Character sketches and dialogue writing', 'Adjectives of quality and degrees of comparison'],
          learningObjectives: ['Reflect on the consequences of procrastination', 'Use positive, comparative, and superlative adjectives']
        },
        {
          id: 'ch-5-eng-6',
          name: 'Unit 6: Class Discussion & The Talkative Barber',
          textbookRef: 'NCERT Marigold Class 5 — Unit 6',
          syllabusTopics: ['Gervase Phinn’s poem "Class Discussion" (quiet Jane speaking up)', 'Arabian Nights tale "The Talkative Barber" of Cashgar', 'Patience, active listening, and social communication styles', 'Direct and indirect speech introduction'],
          learningObjectives: ['Respect diverse personalities and quiet thinkers in classrooms', 'Summarize humorous folk narratives effectively']
        },
        {
          id: 'ch-5-eng-7',
          name: 'Unit 7: Topsy-Turvy Land & Gulliver’s Travels',
          textbookRef: 'NCERT Marigold Class 5 — Unit 7',
          syllabusTopics: ['H. E. Wilkinson’s nonsense poem "Topsy-Turvy Land" (walking on heads, buses on sea)', 'Jonathan Swift’s "Gulliver’s Travels" (encounter with the giants of Brobdingnag)', 'Fantasy, exaggeration, and perspective shift', 'Similes and descriptive vocabulary'],
          learningObjectives: ['Identify hyperbole and imaginative absurdity in literature', 'Write imaginative narratives using creative similes']
        },
        {
          id: 'ch-5-eng-8',
          name: 'Unit 8: Nobody’s Friend & The Little Bully',
          textbookRef: 'NCERT Marigold Class 5 — Unit 8',
          syllabusTopics: ['Enid Blyton’s poem "Nobody’s Friend" (selfishness vs sharing toys and sweets)', 'Story "The Little Bully" (Hari pinching classmates and lesson taught by sea crabs)', 'Anti-bullying awareness and empathy in school', 'Compound words and collective nouns'],
          learningObjectives: ['Demonstrate prosocial sharing and empathy towards peers', 'Recognize bullying behavior and its social harm']
        },
        {
          id: 'ch-5-eng-9',
          name: 'Unit 9: Sing a Song of People & Around the World',
          textbookRef: 'NCERT Marigold Class 5 — Unit 9',
          syllabusTopics: ['Lois Lenski’s poem on bustling city crowds and hurried urban life', 'Jules Verne’s classic "Around the World in Eighty Days" (Phileas Fogg and Passepartout)', 'Modes of global transportation: steam trains, steamers, elephants', 'Prepositions of motion and place'],
          learningObjectives: ['Contrast fast-paced city existence with leisurely travel', 'Trace geographic routes and time zones in literature']
        },
        {
          id: 'ch-5-eng-10',
          name: 'Unit 10: Malu Bhalu & Who Will Be Ningthou?',
          textbookRef: 'NCERT Marigold Class 5 — Unit 10',
          syllabusTopics: ['Kamla Bhasin’s poem "Malu Bhalu" (brave polar bear cub learning to swim)', 'Manipuri folktale "Who Will Be Ningthou?" (qualities of a just ruler who protects people, birds, and trees)', 'Democratic leadership vs brute force, environmental conservation', 'Gender equality and courage'],
          learningObjectives: ['Appreciate northeastern Indian folklore and tribal democracy', 'Evaluate the ethical qualities of compassionate leaders']
        }
      ]
    },
    {
      id: 'cbse-5-foundation',
      name: 'Foundation & Olympiads (Class 5 STEM & MAT)',
      category: 'Foundation & Olympiads',
      curricula: ['Junior Olympiad Foundation (IMO / NSO / NSTSE)', 'Primary Mental Ability (MAT)'],
      chapters: [
        {
          id: 'ch-5-fd-1',
          name: 'Number Sense, Divisibility & Rapid Mental Arithmetic',
          textbookRef: 'Class 5 STEM Olympiad — Chapter 1',
          syllabusTopics: ['Vedic math techniques for 2-digit and 3-digit cross-multiplication', 'Divisibility shortcuts for 3, 4, 6, 8, 9, 11', 'BODMAS order of operations with nested brackets', 'Roman numerals and place value manipulation'],
          learningObjectives: ['Execute rapid mental arithmetic with zero calculation errors', 'Solve competitive Olympiad numerical puzzles in under 45 seconds']
        },
        {
          id: 'ch-5-fd-2',
          name: 'Visual Fractions, Decimals & Percentages',
          textbookRef: 'Class 5 STEM Olympiad — Chapter 2',
          syllabusTopics: ['Equivalence of fractions, mixed numerals, and visual area grids', 'Converting between fractions, terminating decimals, and percentages (25%, 50%, 75%)', 'Word problems on sharing, rate of work, and liquid capacity ratios'],
          learningObjectives: ['Convert instantly between fractions, decimals, and percentage equivalents', 'Solve multi-step competitive word problems involving fractions']
        },
        {
          id: 'ch-5-fd-3',
          name: 'Perimeter, Area & Grid Geometry',
          textbookRef: 'Class 5 STEM Olympiad — Chapter 3',
          syllabusTopics: ['Perimeter of irregular stepped polygons on grid paper', 'Area of composite shapes by decomposition into squares and right triangles', 'Missing side length calculation given total boundary length'],
          learningObjectives: ['Decompose complex composite shapes to compute total area', 'Apply perimeter formulas to solve fence and path tiling word problems']
        },
        {
          id: 'ch-5-fd-4',
          name: 'Mental Ability (MAT): Number & Letter Series',
          textbookRef: 'Class 5 Olympiad Reasoning & MAT — Chapter 4',
          syllabusTopics: ['Arithmetic progression patterns (constant differences, doubling, alternating series)', 'Alphabet position values (A=1, Z=26; reverse positions; EJOTY rule)', 'Missing number in geometric matrices and circular number wheels', 'Odd one out and classification based on prime and square numbers'],
          learningObjectives: ['Detect hidden arithmetic and geometric rules in competitive sequence problems', 'Solve NTSE/Olympiad MAT pattern grids rapidly']
        },
        {
          id: 'ch-5-fd-5',
          name: 'Mental Ability (MAT): Spatial, Mirror & Direction Reasoning',
          textbookRef: 'Class 5 Olympiad Reasoning & MAT — Chapter 5',
          syllabusTopics: ['Cardinal directions: North, South, East, West and intermediate directions (NE, NW, SE, SW)', 'Step-by-step turns (90° clockwise, 180° turns) and finding final orientation', 'Mirror images of capital letters and digital clock times', 'Paper folding, punching, and symmetry completion'],
          learningObjectives: ['Trace multi-step directional path problems accurately', 'Visualize mirror reflection and paper-folding transformations mentally']
        }
      ]
    },
    {
      id: 'cbse-5-hindi',
      name: 'Hindi (रिमझिम भाग 5)',
      category: 'Hindi',
      curricula: ['NCERT Rimjhim Class 5', 'CBSE Hindi Course'],
      chapters: [
        {
          id: 'ch-5-h-1',
          name: 'राख की रस्सी',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 1',
          syllabusTopics: ['तिब्बती लोककथा', 'लोनपो गार की सूझबूझ और बेटे की भोलापन', 'लड़की की बुद्धिमत्ता और राख की रस्सी बनाना', 'संज्ञा, विशेषण और पर्यायवाची शब्द'],
          learningObjectives: ['लोककथाओं के सांस्कृतिक परिवेश को समझना', 'चतुरता एवं सूझबूझ से कठिन परिस्थितियों का हल निकालना'],
        },
        {
          id: 'ch-5-h-2',
          name: 'फ़सलों के त्यौहार',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 2',
          syllabusTopics: ['भारत के विभिन्न राज्यों में मकर संक्रांति, पोंगल, बीहू, लोहड़ी', 'कृषि चक्र और ऋतु परिवर्तन का संबंध', 'पारंपरिक पकवान (खिचड़ी, तिलकुट, गुड़)'],
          learningObjectives: ['भारत की भाषाई व सांस्कृतिक विविधता का आदर करना', 'ऋतुओं और कृषि आधारित पर्वों का महत्व समझना'],
        },
        {
          id: 'ch-5-h-3',
          name: 'खिलौनेवाला',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 3',
          syllabusTopics: ['सुभद्रा कुमारी चौहान द्वारा रचित कविता', 'बाल मनोभाव और खिलौने खरीदने की इच्छा', 'राम, ताड़का और वनवास का पौराणिक प्रसंग', 'तुकबंदी और काव्यानंद'],
          learningObjectives: ['मातृ-प्रेम और बाल सुलभ कल्पना की अभिव्यक्ति', 'कविता वाचन और लयबद्ध उच्चारण कौशल का विकास'],
        },
        {
          id: 'ch-5-h-4',
          name: 'नन्हा फनकार',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 4',
          syllabusTopics: ['पत्थर पर नक्काशी करने वाला दस वर्षीय बालक केशव', 'बादशाह अकबर से केशव की अचानक भेंट', 'शिल्पकला, मेहनत और लगन का सम्मान', 'मुहावरे और शिल्प संबंधी शब्दावली'],
          learningObjectives: ['हस्तकला और श्रम की गरिमा को पहचानना', 'कथानक के आधार पर चरित्र-चित्रण करना'],
        },
        {
          id: 'ch-5-h-5',
          name: 'जहाँ चाह वहाँ राह',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 5',
          syllabusTopics: ['हाथों से अक्षम इला सचानी की सच्ची प्रेरक गाथा', 'पैरों के अँगूठे से कशीदाकारी (कांथा, कसूती, चिकनकारी)', 'दृढ़ संकल्प, आत्मबल और स्वावलंबन', 'विशेषण और क्रिया के व्यावहारिक रूप'],
          learningObjectives: ['दिव्यांगता को मात देकर आत्मनिर्भर बनने की प्रेरणा लेना', 'पारंपरिक भारतीय कढ़ाई कलाओं की जानकारी प्राप्त करना'],
        },
        {
          id: 'ch-5-h-6',
          name: 'चिट्ठी का सफर',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 6',
          syllabusTopics: ['कबूतरों से लेकर आधुनिक पोस्टकार्ड व पिन कोड का इतिहास', 'पिन कोड (PIN Code) का अर्थ और छह अंकों की संरचना', 'डाकिया (हरकारा) की भूमिका और संदेश संचार क्रांति'],
          learningObjectives: ['पत्र लेखन के आवश्यक अंग (पता, पिन कोड, विषय)', 'संचार माध्यमों के ऐतिहासिक विकास की समझ विकसित करना'],
        },
        {
          id: 'ch-5-h-7',
          name: 'वे दिन भी क्या दिन थे',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 7',
          syllabusTopics: ['आइज़क असीमोव की भविष्योन्मुखी विज्ञान कथा (वर्ष 2155)', 'कागज़ की मुद्रित पुस्तकें बनाम टेलीबुक', 'मशीनी शिक्षक (कंप्यूटर) बनाम मानव शिक्षक और सामूहिक विद्यालयीय जीवन'],
          learningObjectives: ['विज्ञान कथाओं के माध्यम से भविष्य की कल्पना करना', 'विद्यालयी सहपाठियों और शिक्षकों के सामाजिक महत्व को आंकना'],
        },
        {
          id: 'ch-5-h-8',
          name: 'एक माँ की बेबसी',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 8',
          syllabusTopics: ['कवि कुंवर नारायण द्वारा रचित मर्मस्पर्शी कविता', 'मूक बालक रतन की बेबसी और माँ की ममतामयी आँखें', 'संवेदना, सहानुभूति और समावेशी दृष्टिकोण'],
          learningObjectives: ['विशेष आवश्यकता वाले बच्चों के प्रति संवेदनशील दृष्टिकोण अपनाना'],
        },
        {
          id: 'ch-5-h-9',
          name: 'चावल की रोटियाँ',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 9',
          syllabusTopics: ['आठ वर्ष के बर्मी बालक कोको का एकांकी नाटक', 'रोटियों को अकेले खाने के लिए बार-बार झूठ बोलना', 'मित्रों (तिंसू, मीमी, उबातुन) से रोटियाँ छिपाने की हास्यास्पद स्थिति', 'झूठ के दुष्परिणाम'],
          learningObjectives: ['नाट्याभिनय और संवाद अदायगी का अभ्यास', 'बाँटकर खाने और सच्चाई के महत्व को आत्मसात करना'],
        },
        {
          id: 'ch-5-h-10',
          name: 'बिशन की दिलेरी',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 10',
          syllabusTopics: ['शिकारियों से घायल तीतर को बचाने की रोमांचक कहानी', 'पहाड़ी सीढ़ीनुमा खेत और कर्नल दत्ता का फार्म', 'जीव-जंतुओं के प्रति करुणा और निडरता'],
          learningObjectives: ['वन्यजीव संरक्षण और पर्यावरण संवेदनशीलता को बढ़ावा देना'],
        },
        {
          id: 'ch-5-h-11',
          name: 'पानी रे पानी',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 11',
          syllabusTopics: ['अनुपम मिश्र का निबंध', 'धरती के जल चक्र और भूजल की गुल्लक', 'सूखा और बाढ़ की मानवीय समस्याएँ', 'वर्षा जल संचयन (Rainwater Harvesting)'],
          learningObjectives: ['जल संरक्षण के व्यावहारिक उपायों को दैनिक जीवन में अपनाना'],
        },
        {
          id: 'ch-5-h-12',
          name: 'चुनौती हिमालय की',
          textbookRef: 'NCERT रिमझिम भाग 5 — अध्याय 12',
          syllabusTopics: ['सुरेखा पण्डीकर की यात्रा वृत्तांत', 'जवाहरलाल नेहरू की जोजिला दर्रे से अमरनाथ की दुर्गम चढ़ाई', 'बर्फीली दरारें (क्रेवास), ऑक्सिजन की कमी और साहसिक पर्वतारोहण'],
          learningObjectives: ['पर्वतीय भूगोल और साहसिक यात्राओं के अनुभवों का वर्णन करना'],
        }
      ]
    },
    {
      id: 'cbse-5-marathi',
      name: 'Marathi (सुलभभारती इयत्ता ५ वी)',
      category: 'Marathi',
      curricula: ['Maharashtra State / NCERT Marathi Class 5', 'सुलभभारती इयत्ता पाचवी'],
      chapters: [
        {
          id: 'ch-5-mr-1',
          name: 'माय (कविता)',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ १',
          syllabusTopics: ['कवी स. ग. पाचपोळ यांची भावस्पर्शी कविता', 'आईची कष्टमय दिनचर्या व लेकरावरील अपार माया', 'काव्यवाचन व यमक जुळणारे शब्द'],
          learningObjectives: ['आईच्या त्यागाचे व प्रेमाचे मोल जाणणे', 'भावपूर्ण कविता गायनाचा सराव करणे'],
        },
        {
          id: 'ch-5-mr-2',
          name: 'बंडूची इजार',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ २',
          syllabusTopics: ['विनोदी चित्रकथा', 'बंडूची चार बोटे लांब झालेली नवी इजार', 'घरातील चौघांनी (बायको, बहीण, आई, स्वतः) इजार कापल्याने झालेला विनोद', 'वाक्यप्रचार व नाम-सर्वनाम ओळख'],
          learningObjectives: ['विनोदी प्रसंगाचे आस्वादपूर्वक वाचन करणे', 'संवादातून घडणाऱ्या गमतीजमती समजणे'],
        },
        {
          id: 'ch-5-mr-3',
          name: 'वलवा रे वलवा',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ३',
          syllabusTopics: ['वसंत बापट यांचे प्रेरणादायी बालगीत', 'होडी चालवताना कोळी बांधवांची एकजूट आणि उत्साह', 'लयबद्ध शब्द व निसर्गसौंदर्य'],
          learningObjectives: ['सांघिक कार्य व जिद्दीची भावना अंगी बाणवणे'],
        },
        {
          id: 'ch-5-mr-4',
          name: 'मुंग्यांच्या जगात',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ४',
          syllabusTopics: ['प्रकाश किणीकर यांचा माहितीपर पाठ', 'मुंग्यांची शिस्त, रासायनिक संवाद (फेरोमोन्स)', 'कामकरी, सैनिक व राणी मुंग्यांची श्रमविभागणी'],
          learningObjectives: ['कीटकांच्या विस्मयकारक जीवनशैलीची माहिती घेणे', 'शिस्त व सहकार्याची वृत्ती शिकणे'],
        },
        {
          id: 'ch-5-mr-5',
          name: 'अरण्यलिपी',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ५',
          syllabusTopics: ['सुरेशचंद्र वारघडे यांचा पाठ', 'जंगलातील प्राण्यांच्या पाऊलखुणा (Pugmarks), झाडांवरील नखांचे ओरखडे', 'वन्यजीव निरीक्षण व निसर्गप्रेम'],
          learningObjectives: ['निसर्गाचे सूक्ष्म निरीक्षण करण्याची क्षमता वाढवणे'],
        },
        {
          id: 'ch-5-mr-6',
          name: 'बैलपोळा',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ६',
          syllabusTopics: ['धोंडो मन्मथ भट यांची कविता', 'शेतकऱ्यांचा सखा — बैलांचा कृतज्ञता सण पोळा', 'झुला, बाशिंग, शिंगांना रंग लावणे', 'ग्रामीण संस्कृती व शेतीजीवन'],
          learningObjectives: ['मुक्या प्राण्यांप्रती कृतज्ञतेची भावना रुजवणे'],
        },
        {
          id: 'ch-5-mr-7',
          name: 'इंधनबचत',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ७',
          syllabusTopics: ['दिनू आणि फातिमा यांचा स्वयंपाकघरातील संवाद', 'गॅस, वीज, पाणी व इंधनाची बचत कशी करावी?', 'पर्यावरण संवर्धन व राष्ट्रीय संपत्तीचे जतन'],
          learningObjectives: ['दैनंदिन जीवनात इंधनबचतीचे उपाय प्रत्यक्ष अमलात आणणे'],
        },
        {
          id: 'ch-5-mr-8',
          name: 'मला शिकायचंय!',
          textbookRef: 'सुलभभारती इयत्ता ५ वी — पाठ ८',
          syllabusTopics: ['आबा आणि स्नेहाची सत्यस्पर्शी कथा', 'मुलींचे उच्च शिक्षण आणि शिक्षणाची तळमळ', 'सरपंचांचे आणि मुख्याध्यापकांचे समुपदेशन'],
          learningObjectives: ['शिक्षणाचे मूलभूत महत्त्व व मुलगी शिकली प्रगती झाली हा विचार दृढ करणे'],
        }
      ]
    }
  ]
};
