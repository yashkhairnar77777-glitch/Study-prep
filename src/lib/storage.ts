import {
  Conversation,
  Flashcard,
  SavedNote,
  MockTestAttempt,
  UserProfile,
  StudyTask,
  PomodoroSession,
  StudyActivity,
  StudyStreak,
  GeneratedStudyPack,
} from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'oryqen_conversations_v1',
  FLASHCARDS: 'oryqen_flashcards_v1',
  NOTES: 'oryqen_notes_v1',
  MOCK_TESTS: 'oryqen_mock_tests_v1',
  PROFILE: 'oryqen_profile_v1',
  ACTIVE_CONVO_ID: 'oryqen_active_convo_id',
  AUTH_SESSION: 'oryqen_auth_session_v1',
  STUDY_TASKS: 'oryqen_study_tasks_v1',
  FOCUS_SESSIONS: 'oryqen_focus_sessions_v1',
  STUDY_ACTIVITIES: 'oryqen_study_activities_v1',
  STUDY_STREAK: 'oryqen_study_streak_v1',
  GENERATED_PACKS: 'oryqen_generated_packs_v1',
  CURRICULUM_PROGRESS: 'oryqen_curriculum_progress_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  educationCategory: 'school',
  grade: 'Class 9-10 (Secondary)',
  selectedClass: 'Class 10',
  primaryGoal: 'exam_prep',
  favoriteSubjects: ['Mathematics', 'Physics', 'Chemistry'],
  primarySubject: 'Mathematics',
  preferredLanguage: 'English',
  defaultStyle: 'step_by_step',
  dailyStudyTargetMinutes: 30,
  theme: 'dark',
  isOnboarded: false,
  authProvider: 'local',
};

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'What is Newton’s Second Law of Motion?',
    back: 'F = dp/dt (Force equals rate of change of momentum). For constant mass m, F = m·a, where force is in Newtons (N), mass in kg, and acceleration in m/s².',
    subject: 'Physics',
    topic: 'Classical Mechanics',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-2',
    front: 'State the Quadratic Formula and the condition for real distinct roots.',
    back: 'For ax² + bx + c = 0, x = (-b ± √(b² - 4ac)) / (2a). Real distinct roots exist if and only if the Discriminant Δ = b² - 4ac > 0.',
    subject: 'Mathematics',
    topic: 'Algebra',
    box: 2,
    nextReviewDate: Date.now() + 86400000,
    reviewCount: 1,
    easeScore: 'medium',
  },
  {
    id: 'fc-3',
    front: 'What is Le Chatelier’s Principle in chemical equilibrium?',
    back: 'If a chemical system at equilibrium experiences a change in concentration, temperature, or pressure, the equilibrium will shift in a direction that counteracts that change.',
    subject: 'Chemistry',
    topic: 'Chemical Equilibrium',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-4',
    front: 'What are the main stages of Cellular Respiration in aerobic organisms?',
    back: '1. Glycolysis (cytoplasm)\n2. Pyruvate Oxidation / Link Reaction (mitochondrial matrix)\n3. Krebs / Citric Acid Cycle (mitochondrial matrix)\n4. Oxidative Phosphorylation & Electron Transport Chain (inner mitochondrial membrane)',
    subject: 'Biology',
    topic: 'Cellular Energetics',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-5',
    front: 'What is the Prime Meridian and how do latitudes and longitudes help locate places? (Exploring Society Ch 1)',
    back: '• Latitudes are horizontal parallel circles running East-West; the Equator is at 0°.\n• Longitudes are vertical semi-circles running North-South; the Prime Meridian (0° longitude) passes through Greenwich (UK).\n• Together, they form a geographic grid allowing precise coordinate location of any spot on Earth.\n• India\'s Standard Meridian is 82°30\' E, located at Mirzapur (IST is UTC +5:30).',
    subject: 'History & Social Studies',
    topic: 'Exploring Society: Locating Places on the Earth',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-6',
    front: 'What were the defining features of the Harappan Civilisation? (Exploring Society Ch 6)',
    back: '• City Layout: Divided into a raised Citadel (public/administrative) and Lower Town (residential).\n• Drainage: Precision covered drains along straight grid streets with inspection holes.\n• Great Bath at Mohenjo-daro: Watertight public tank lined with baked bricks and bitumen plaster.\n• Craft & Trade: Steatite seals with unicorn/bull motifs, weights, copper/bronze metallurgy, dockyard at Lothal.',
    subject: 'History & Social Studies',
    topic: 'Exploring Society: Beginnings of Indian Civilisation',
    box: 2,
    nextReviewDate: Date.now() + 86400000,
    reviewCount: 1,
    easeScore: 'medium',
  },
  {
    id: 'fc-7',
    front: 'How does Grassroots Democracy function in rural India? (Exploring Society Ch 10 & 11)',
    back: '• Gram Sabha: The general assembly of all adult voters (18+) registered in the village panchayat area. It oversees decisions and holds leaders accountable.\n• Gram Panchayat: The elected executive governing body of Ward Members (Panchs) and Sarpanch (President), serving a 5-year term.\n• Secretary: Appointed by the state government (non-elected) to keep records and call meetings.\n• 3-Tier Structure: Gram Panchayat (village) → Panchayat Samiti / Janpad (block) → Zilla Parishad (district).',
    subject: 'History & Social Studies',
    topic: 'Exploring Society: Grassroots Democracy',
    box: 1,
    nextReviewDate: Date.now(),
    reviewCount: 0,
    easeScore: 'unreviewed',
  },
  {
    id: 'fc-8',
    front: 'What are the three main sectors of economic activities? (Exploring Society Ch 14)',
    back: '• Primary Sector: Activities directly using natural resources (agriculture, fishing, forestry, dairy, mining).\n• Secondary Sector: Transforming raw materials into finished manufactured goods (textiles, automobile assembly, construction, factories).\n• Tertiary Sector: Providing supporting services rather than goods (transport, banking, healthcare, education, trade, IT).\n• Interdependence: Each sector relies on the other two for supply and distribution.',
    subject: 'History & Social Studies',
    topic: 'Exploring Society: Economic Activities Around Us',
    box: 2,
    nextReviewDate: Date.now() + 86400000,
    reviewCount: 1,
    easeScore: 'medium',
  },
];

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review Physics: Newton’s Laws & Momentum derivation',
    subject: 'Physics',
    dueDate: 'Today',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Solve 10 Calculus integration problems with step-by-step checks',
    subject: 'Mathematics',
    dueDate: 'Tomorrow',
    completed: true,
    priority: 'medium',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'task-3',
    title: 'Generate Mock Test on Chemical Equilibrium & Le Chatelier',
    subject: 'Chemistry',
    dueDate: 'This Week',
    completed: false,
    priority: 'high',
    createdAt: Date.now() - 14400000,
  },
];

export const getTodayDateStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getYesterdayDateStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const DEFAULT_ACTIVITIES: StudyActivity[] = [
  {
    id: 'act-1',
    type: 'focus_session',
    title: 'Completed 25m Focus Session in Mathematics: Calculus Problem Solving',
    subject: 'Mathematics',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'act-2',
    type: 'flashcard_review',
    title: 'Reviewed 4 Flashcards in Physics',
    subject: 'Physics',
    durationMinutes: 10,
    timestamp: Date.now() - 18000000,
  },
  {
    id: 'act-3',
    type: 'chat_question',
    title: 'Solved concept inquiry with AI Tutor: Fractions & Prime Factors',
    subject: 'Mathematics',
    durationMinutes: 5,
    timestamp: Date.now() - 86400000,
  },
];

const DEFAULT_FOCUS_SESSIONS: PomodoroSession[] = [
  {
    id: 'session-default-1',
    durationMinutes: 25,
    mode: 'focus',
    subject: 'Mathematics',
    topic: 'Calculus Derivatives & Problem Solving',
    completedAt: Date.now() - 3600000,
    completed: true,
  },
];

export const DEFAULT_NOTES: SavedNote[] = [
  {
    id: 'note-es-ch1',
    title: 'NCERT Exploring Society Ch 1: Locating Places on the Earth',
    subject: 'History & Social Studies',
    createdAt: Date.now() - 3600000,
    tags: ['Exploring Society', 'NCERT', 'Geography', 'Latitudes & Longitudes'],
    content: `## NCERT Class 6 Exploring Society: India and Beyond
### Chapter 1: Locating Places on the Earth — Comprehensive Study & Revision Guide

---

### 1. Earth's Shape & The Globe
- **Geoid Shape**: The Earth is flattened at the poles and slightly bulges at the Equator. This shape is called a **geoid** ("earth-like shape").
- **Globe**: A miniature, true 3-dimensional model of the Earth. It shows continents, oceans, and countries in their accurate relative proportions.
- **Axis & Poles**: The imaginary line on which the globe rotates has two endpoints: the **North Pole** and the **South Pole**.

---

### 2. Parallels of Latitude
- Latitudes are imaginary circular lines drawn parallel to the Equator running **East-West**.
- **Equator**: $0^\\circ$ latitude, dividing the Earth into the Northern Hemisphere and Southern Hemisphere.
- **Key Reference Latitudes**:
  1. **Tropic of Cancer**: $23\\frac{1}{2}^\\circ\\text{ N}$
  2. **Tropic of Capricorn**: $23\\frac{1}{2}^\\circ\\text{ S}$
  3. **Arctic Circle**: $66\\frac{1}{2}^\\circ\\text{ N}$
  4. **Antarctic Circle**: $66\\frac{1}{2}^\\circ\\text{ S}$

#### Earth's Heat Zones:
- **Torrid Zone**: Between the Tropic of Cancer and Tropic of Capricorn. Receives direct, vertical sunlight all year round $\\rightarrow$ warmest zone.
- **Temperate Zones**: Between Tropics and Polar Circles. Moderate angles of sunlight $\\rightarrow$ mild climate.
- **Frigid Zones**: North of Arctic Circle and South of Antarctic Circle. Sun never rises far above the horizon $\\rightarrow$ extremely cold.

---

### 3. Meridians of Longitude & Geographic Grid
- Longitudes are semi-circles running from the North Pole to the South Pole (**North-South**).
- Unlike latitudes, all meridians are equal in length and converge at the poles.
- **Prime Meridian**: $0^\\circ$ longitude, passing through the Royal Observatory at **Greenwich, London**.
- **180° Meridian**: Opposite the Prime Meridian, dividing the globe into Eastern and Western Hemispheres.
- **The Grid System**: The intersection of latitudes and longitudes creates an exact coordinate reference. Any point on the planet can be pinned down using $(Latitude, Longitude)$.

---

### 4. Longitude, Local Time & Indian Standard Time (IST)
- The Earth rotates $360^\\circ$ in approximately 24 hours:
  $$\\frac{360^\\circ}{24\\text{ hours}} = 15^\\circ\\text{ per hour} = 1^\\circ\\text{ every 4 minutes}$$
- Places east of Greenwich see sunrise earlier (time is ahead); places west are behind.
- **Indian Standard Time (IST)**:
  - India stretches from $68^\\circ 7'\\text{ E}$ (Gujarat) to $97^\\circ 25'\\text{ E}$ (Arunachal Pradesh) — a time difference of almost 1 hour and 45 minutes!
  - To prevent confusion with train and flight schedules, the **Standard Meridian of India** is fixed at **$82^\\circ 30'\\text{ E}$** (passing through Mirzapur, Uttar Pradesh).
  - Indian Standard Time is exactly **5 hours 30 minutes ahead of Greenwich Mean Time (UTC/GMT +5:30)**.`,
  },
  {
    id: 'note-es-ch6',
    title: 'NCERT Exploring Society Ch 6: The Beginnings of Indian Civilisation',
    subject: 'History & Social Studies',
    createdAt: Date.now() - 7200000,
    tags: ['Exploring Society', 'NCERT', 'History', 'Harappa', 'Indus Valley'],
    content: `## NCERT Class 6 Exploring Society: India and Beyond
### Chapter 6: The Beginnings of Indian Civilisation (Harappan Civilisation)

---

### 1. Discovery and Significance
- Flourished around **2600 BCE to 1900 BCE** along the Indus and Saraswati river basins.
- Major excavation sites: **Harappa** (Punjab, Pakistan), **Mohenjo-daro** (Sindh), **Kalibangan** (Rajasthan), **Rakhigarhi** & **Banawali** (Haryana), **Dholavira** & **Lothal** (Gujarat).
- It marked the dawn of first urbanisation in the Indian subcontinent.

---

### 2. Town Planning & Architecture
- **Dual City Layout**:
  - **Citadel (Upper Town)**: Built on a high mud-brick platform in the western portion. Housed monumental public buildings, storehouses (granaries), and administrative halls.
  - **Lower Town**: Located to the east, occupied by residential brick quarters of common citizens, artisans, and traders.
- **Baked Bricks**: Walls were made of kiln-baked bricks laid in an interlocking pattern, making them withstand earthquakes and floods for thousands of years.
- **Grid Layout**: Streets intersected cleanly at right angles ($90^\\circ$), forming rectangular blocks.

---

### 3. Engineering Feats: Water Supply & Sanitation
- **The Great Bath at Mohenjo-daro**:
  - A special public rectangular bathing tank lined with bricks, coated with plaster, and sealed with a layer of natural tar (**bitumen**) to make it completely waterproof.
  - Steps led down into it from the north and south; changing rooms bordered the sides. Likely used for ritual/ceremonial bathing.
- **Covered Drainage System**:
  - Waste water from each house flowed through bathroom chutes into street drains covered with flat stone slabs or bricks.
  - Regular inspection holes were installed at intervals for maintenance and desilting.

---

### 4. Crafts, Trade & Seals
- **Metallurgy**: Skilled in making bronze (alloy of copper and tin), copper tools, and gold/silver ornaments.
- **Steatite Seals**: Square stone stamps carved with animal motifs (one-horned bull/unicorn, elephant, tiger) and an undeciphered pictographic script. Used to stamp clay seals on trade sacks.
- **Weights & Measures**: Cubical chert stone weights graded systematically.
- **Lothal Dockyard**: A massive brick basin on the Gulf of Khambhat where boats and ships arrived from the sea and river channels, trading with Mesopotamia.`,
  },
  {
    id: 'note-es-ch10',
    title: 'NCERT Exploring Society Ch 10 & 11: Grassroots Democracy — Governance & Rural Administration',
    subject: 'History & Social Studies',
    createdAt: Date.now() - 10800000,
    tags: ['Exploring Society', 'NCERT', 'Civics', 'Grassroots Democracy', 'Panchayat'],
    content: `## NCERT Class 6 Exploring Society: India and Beyond
### Chapters 10 & 11: Grassroots Democracy — Governance & Local Government in Rural Areas

---

### 1. What is Governance?
- **Governance** refers to the system and processes by which rules, policies, and decisions are made, implemented, and monitored for the common welfare of society.
- **Levels of Government in India**:
  1. **Local Level**: Village Panchayats and Urban Municipalities (addresses immediate civic needs: sanitation, drinking water, local roads).
  2. **State Level**: State Legislative Assemblies and Chief Minister (law and order, state highways, agriculture).
  3. **National / Union Level**: Parliament and Prime Minister (defense, foreign affairs, currency, railways).

---

### 2. The Gram Sabha — Pure Direct Democracy
- **Definition**: The general assembly of all adults (aged 18 and above) who live in the area of a Gram Panchayat and whose names are registered in the electoral roll.
- **Key Functions**:
  - Scrutinises and approves development plans proposed by the Panchayat.
  - Prevents the Panchayat from misusing funds or favouring specific people.
  - Verifies the list of Below Poverty Line (BPL) families to ensure true beneficiaries receive benefits.

---

### 3. The Gram Panchayat — Elected Executive Body
- Divided into small **Wards**. Each ward elects a representative called a **Ward Member (Panch)**.
- All voters directly elect the **Sarpanch** (Panchayat President).
- **Panchayat Secretary**:
  - Not an elected person; appointed by the State Government.
  - Responsible for convening the Gram Sabha meetings, recording minutes, and financial record compliance.
- **Sources of Funds**:
  - Collection of taxes on houses, market places, and fairs.
  - Government scheme funds received through Janpad/Zilla Parishads.
  - Donations for community works.

---

### 4. Three-Tier Structure of Panchayati Raj
1. **Gram Panchayat** (Village Level): Direct local administration.
2. **Panchayat Samiti / Block Samiti** (Block Level): Coordinates multiple Gram Panchayats.
3. **Zilla Parishad** (District Level): Formulates district development plans and distributes state funds.`,
  },
  {
    id: 'note-es-ch14',
    title: 'NCERT Exploring Society Ch 14: Economic Activities Around Us',
    subject: 'History & Social Studies',
    createdAt: Date.now() - 14400000,
    tags: ['Exploring Society', 'NCERT', 'Economics', 'Sectors of Economy'],
    content: `## NCERT Class 6 Exploring Society: India and Beyond
### Chapter 14: Economic Activities Around Us — Sector Classification & Interdependence

---

### 1. Economic vs Non-Economic Activities
- **Economic Activity**: Any human action performed to earn a livelihood, generate income, or produce goods and services (e.g., farming, factory work, running a grocery store, driving a bus).
- **Non-Economic Activity**: Actions done out of care, affection, social obligation, or personal hobby without financial compensation (e.g., helping a neighbour, volunteering, household care).
- **Recognition of Work (Ch 13)**: Emphasises the immense dignity and economic value of domestic work, caregiving, and manual craftsmanship.

---

### 2. Three Sectors of Economic Activities
1. **Primary Sector (Nature-Based)**:
   - Activities that rely directly on the extraction or harvesting of Earth's natural resources.
   - Examples: Farming / Agriculture, Animal Husbandry & Dairy, Fishing, Mining & Quarrying, Forestry.
2. **Secondary Sector (Manufacturing & Processing)**:
   - Activities where natural products are transformed into manufactured goods through machinery, craft skills, or factory production.
   - Examples: Spinning cotton into yarn and weaving cloth, turning iron ore into steel, bakeries turning flour into bread.
3. **Tertiary Sector (Services & Support)**:
   - Does not produce physical goods directly, but provides essential services that support both production and daily life.
   - Examples: Transport (trucks, trains), Banking and credit, Communications, Healthcare, Education, Tourism.

---

### 3. Economic Interdependence (The Supply Chain)
No sector functions in isolation!
- **Example — The Cotton Shirt**:
  1. *Primary*: A farmer cultivates cotton bolls using soil and water.
  2. *Secondary*: A ginning and textile mill weaves and stitches the fabric into shirts.
  3. *Tertiary*: Trucks transport the shirts to retail stores, banks finance the business, and shopkeepers sell to consumers.`,
  },
];

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return DEFAULT_PROFILE;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_PROFILE, ...parsed };
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage saveProfile failed', e);
    }
  },

  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveConversations(convos: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convos));
    } catch (e) {
      console.warn('Storage saveConversations failed', e);
    }
  },

  getActiveConvoId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
    } catch {
      return null;
    }
  },

  setActiveConvoId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVO_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVO_ID);
      }
    } catch (e) {
      console.warn('Storage setActiveConvoId failed', e);
    }
  },

  getFlashcards(): Flashcard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(DEFAULT_FLASHCARDS));
      return DEFAULT_FLASHCARDS;
    } catch {
      return DEFAULT_FLASHCARDS;
    }
  },

  saveFlashcards(cards: Flashcard[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
    } catch (e) {
      console.warn('Storage saveFlashcards failed', e);
    }
  },

  getNotes(): SavedNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
      return DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  },

  saveNotes(notes: SavedNote[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage saveNotes failed', e);
    }
  },

  getMockTests(): MockTestAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_TESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMockTest(test: MockTestAttempt): void {
    try {
      const tests = this.getMockTests();
      tests.unshift(test);
      localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(tests));
    } catch (e) {
      console.warn('Storage saveMockTest failed', e);
    }
  },

  reviewCard(cardId: string, rating: 'easy' | 'medium' | 'hard'): Flashcard[] {
    const cards = this.getFlashcards();
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const intervals: Record<number, number> = {
      1: 1 * DAY_MS,
      2: 3 * DAY_MS,
      3: 7 * DAY_MS,
      4: 14 * DAY_MS,
      5: 30 * DAY_MS,
    };

    const updated = cards.map(c => {
      if (c.id !== cardId) return c;
      let newBox = c.box;
      if (rating === 'hard') {
        newBox = 1;
      } else if (rating === 'medium') {
        newBox = Math.min(5, Math.max(1, c.box));
      } else if (rating === 'easy') {
        newBox = Math.min(5, c.box + 1);
      }

      const nextInterval = intervals[newBox] || DAY_MS;
      return {
        ...c,
        box: newBox,
        reviewCount: c.reviewCount + 1,
        easeScore: rating,
        nextReviewDate: now + nextInterval,
      };
    });

    this.saveFlashcards(updated);
    return updated;
  },

  getTasks(): StudyTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_TASKS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: StudyTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage saveTasks failed', e);
    }
  },

  getFocusSessions(): PomodoroSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(DEFAULT_FOCUS_SESSIONS));
      return DEFAULT_FOCUS_SESSIONS;
    } catch {
      return DEFAULT_FOCUS_SESSIONS;
    }
  },

  saveFocusSession(session: PomodoroSession): void {
    try {
      const sessions = this.getFocusSessions();
      const updated = [session, ...sessions];
      localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(updated.slice(0, 100)));

      // Automatically log as study activity if session has duration
      if (session.durationMinutes > 0 && session.mode === 'focus') {
        this.addStudyActivity({
          type: 'focus_session',
          title: `Completed ${session.durationMinutes}m Focus Session in ${session.subject}${session.topic ? `: ${session.topic}` : ''}`,
          subject: session.subject,
          durationMinutes: session.durationMinutes,
          meta: { sessionId: session.id, mode: session.mode },
        });
        this.recordStudyEngagement(session.durationMinutes);
      }
    } catch (e) {
      console.warn('Storage saveFocusSession failed', e);
    }
  },

  getStudyActivities(): StudyActivity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_ACTIVITIES);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.STUDY_ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  },

  addStudyActivity(activity: Omit<StudyActivity, 'id' | 'timestamp'> & { timestamp?: number }): StudyActivity {
    try {
      const activities = this.getStudyActivities();
      const newAct: StudyActivity = {
        ...activity,
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: activity.timestamp || Date.now(),
      };
      const updated = [newAct, ...activities].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.STUDY_ACTIVITIES, JSON.stringify(updated));
      return newAct;
    } catch (e) {
      console.warn('Storage addStudyActivity failed', e);
      return {
        ...activity,
        id: `act-${Date.now()}`,
        timestamp: Date.now(),
      };
    }
  },

  getStudyStreak(): StudyStreak {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();
    const defaultStreak: StudyStreak = {
      currentStreak: 3,
      longestStreak: 5,
      lastActiveDate: today,
      todayMinutes: 25,
      todayGoalMinutes: 30,
      history: {
        [today]: 25,
        [yesterday]: 45,
      },
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_STREAK);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STUDY_STREAK, JSON.stringify(defaultStreak));
        return defaultStreak;
      }
      const streak: StudyStreak = JSON.parse(data);
      if (!streak.history) streak.history = {};
      
      // Verify if streak is broken (last active date earlier than yesterday)
      if (streak.lastActiveDate && streak.lastActiveDate !== today && streak.lastActiveDate !== yesterday) {
        streak.currentStreak = 0;
        streak.todayMinutes = 0;
      } else if (streak.lastActiveDate !== today) {
        streak.todayMinutes = 0;
      }
      return streak;
    } catch {
      return defaultStreak;
    }
  },

  recordStudyEngagement(minutes: number = 0): StudyStreak {
    const today = getTodayDateStr();
    const yesterday = getYesterdayDateStr();
    const streak = this.getStudyStreak();

    if (streak.lastActiveDate === today) {
      streak.todayMinutes = (streak.todayMinutes || 0) + minutes;
      streak.history[today] = (streak.history[today] || 0) + minutes;
    } else if (streak.lastActiveDate === yesterday) {
      streak.currentStreak = (streak.currentStreak || 0) + 1;
      streak.longestStreak = Math.max(streak.longestStreak || 1, streak.currentStreak);
      streak.lastActiveDate = today;
      streak.todayMinutes = minutes;
      streak.history[today] = minutes;
    } else {
      streak.currentStreak = 1;
      streak.longestStreak = Math.max(streak.longestStreak || 1, 1);
      streak.lastActiveDate = today;
      streak.todayMinutes = minutes;
      streak.history[today] = minutes;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_STREAK, JSON.stringify(streak));
    } catch (e) {
      console.warn('Storage recordStudyEngagement failed', e);
    }
    return streak;
  },

  exportAllData(): string {
    const backup = {
      profile: this.getProfile(),
      conversations: this.getConversations(),
      flashcards: this.getFlashcards(),
      notes: this.getNotes(),
      mockTests: this.getMockTests(),
      tasks: this.getTasks(),
      focusSessions: this.getFocusSessions(),
      studyActivities: this.getStudyActivities(),
      streak: this.getStudyStreak(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (Array.isArray(parsed.conversations)) this.saveConversations(parsed.conversations);
      if (Array.isArray(parsed.flashcards)) this.saveFlashcards(parsed.flashcards);
      if (Array.isArray(parsed.notes)) this.saveNotes(parsed.notes);
      if (Array.isArray(parsed.tasks)) this.saveTasks(parsed.tasks);
      if (Array.isArray(parsed.focusSessions)) {
        localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(parsed.focusSessions));
      }
      if (Array.isArray(parsed.studyActivities)) {
        localStorage.setItem(STORAGE_KEYS.STUDY_ACTIVITIES, JSON.stringify(parsed.studyActivities));
      }
      if (parsed.streak) {
        localStorage.setItem(STORAGE_KEYS.STUDY_STREAK, JSON.stringify(parsed.streak));
      }
      if (Array.isArray(parsed.mockTests)) {
        localStorage.setItem(STORAGE_KEYS.MOCK_TESTS, JSON.stringify(parsed.mockTests));
      }
      return true;
    } catch (e) {
      console.error('Failed to parse import data', e);
      return false;
    }
  },

  logoutUser(): void {
    const profile = this.getProfile();
    profile.isOnboarded = false;
    this.saveProfile(profile);
  },

  getGeneratedStudyPacks(): GeneratedStudyPack[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GENERATED_PACKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveGeneratedStudyPack(pack: GeneratedStudyPack): void {
    try {
      const packs = this.getGeneratedStudyPacks();
      const existingIdx = packs.findIndex(p => p.id === pack.id);
      if (existingIdx !== -1) {
        packs[existingIdx] = pack;
      } else {
        packs.unshift(pack);
      }
      localStorage.setItem(STORAGE_KEYS.GENERATED_PACKS, JSON.stringify(packs));
    } catch (e) {
      console.warn('Storage saveGeneratedStudyPack failed', e);
    }
  },

  deleteGeneratedStudyPack(id: string): void {
    try {
      const packs = this.getGeneratedStudyPacks().filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.GENERATED_PACKS, JSON.stringify(packs));
    } catch (e) {
      console.warn('Storage deleteGeneratedStudyPack failed', e);
    }
  },

  appendFlashcards(newCards: Flashcard[]): void {
    try {
      const current = this.getFlashcards();
      const updated = [...newCards, ...current];
      this.saveFlashcards(updated);
    } catch (e) {
      console.warn('Storage appendFlashcards failed', e);
    }
  },

  appendNote(newNote: SavedNote): void {
    try {
      const current = this.getNotes();
      const updated = [newNote, ...current];
      this.saveNotes(updated);
    } catch (e) {
      console.warn('Storage appendNote failed', e);
    }
  },

  getCurriculumProgress(): Record<string, 'mastered' | 'in_progress' | 'not_started'> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRICULUM_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveCurriculumProgress(progress: Record<string, 'mastered' | 'in_progress' | 'not_started'>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRICULUM_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.warn('Storage saveCurriculumProgress failed', e);
    }
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  },
};
