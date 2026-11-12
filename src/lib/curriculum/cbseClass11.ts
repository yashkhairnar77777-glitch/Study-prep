import { SyllabusClassInfo } from './types';

export const cbseClass11: SyllabusClassInfo = {
  id: 'cbse-class-11',
  name: 'Class 11 (Higher Secondary)',
  gradeEquivalent: 'Class 11-12 (Higher Secondary)',
  subjects: [
    {
      id: 'cbse-11-physics',
      name: 'Physics',
      category: 'Physics',
      curricula: ['NCERT Physics Class 11 Part 1 & 2', 'CBSE Class 11 Senior Secondary Curriculum', 'IIT-JEE / NEET Foundation'],
      chapters: [
        {
          id: 'ch-11-p-1',
          name: 'Units and Measurements',
          textbookRef: 'NCERT Class 11 Physics — Chapter 1',
          syllabusTopics: ['SI base units, supplementary units, and derived physical quantities', 'Dimensional analysis: homogeneity principle, deriving physical equations', 'Significant figures, rounding off rules, and combination of propagation of errors'],
          learningObjectives: ['Check dimensional consistency of complex physical equations', 'Calculate absolute, relative, and percentage error in experimental measurements'],
          coreFormulas: ['\\frac{\\Delta X}{X} = n \\frac{\\Delta A}{A} + m \\frac{\\Delta B}{B}']
        },
        {
          id: 'ch-11-p-2',
          name: 'Motion in a Straight Line',
          textbookRef: 'NCERT Class 11 Physics — Chapter 2',
          syllabusTopics: ['Position-time and velocity-time graphs for uniform and non-uniform motion', 'Calculus-based kinematic definitions ($v = dx/dt$, $a = dv/dt$)', 'Equations of motion for constant acceleration derived via calculus', 'Motion under gravity and stopping distance of vehicles'],
          learningObjectives: ['Derive kinematic equations using definite integration', 'Solve vertical projectile and collision word problems under constant gravitational acceleration'],
          coreFormulas: ['v = u + at', 's = ut + \\frac{1}{2}at^2', 'v^2 = u^2 + 2as']
        },
        {
          id: 'ch-11-p-3',
          name: 'Motion in a Plane',
          textbookRef: 'NCERT Class 11 Physics — Chapter 3',
          syllabusTopics: ['Scalars and vectors: unit vectors, dot product, cross product, resolution in 2D and 3D', 'Relative velocity in two dimensions (swimmer-river & rain-umbrella)', '2D Projectile motion: trajectory equation, maximum height ($H$), time of flight ($T$), range ($R$)', 'Uniform circular motion: centripetal acceleration ($a_c = v^2/r = \\omega^2 r$)'],
          learningObjectives: ['Resolve vector equations in component forms', 'Calculate projectile trajectories and angle of launch for maximum horizontal range'],
          coreFormulas: ['T = \\frac{2u\\sin\\theta}{g}', 'R = \\frac{u^2\\sin 2\\theta}{g}', 'a_c = \\frac{v^2}{r} = \\omega^2 r']
        },
        {
          id: 'ch-11-p-4',
          name: 'Laws of Motion',
          textbookRef: 'NCERT Class 11 Physics — Chapter 4',
          syllabusTopics: ['Newton’s First, Second, and Third laws of motion; inertial frames of reference', 'Momentum, impulse-momentum theorem, and conservation of linear momentum', 'Static, limiting, and kinetic friction; laws of friction, angle of repose', 'Circular banking of roads: optimum speed without friction and with friction'],
          learningObjectives: ['Draw accurate Free Body Diagrams (FBD) for coupled pulley systems', 'Calculate maximum safe turning speed on banked rough roads'],
          coreFormulas: ['\\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}', 'f_s \\le \\mu_s N', 'v_{\\text{max}} = \\sqrt{rg\\left(\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s\\tan\\theta}\\right)}']
        },
        {
          id: 'ch-11-p-5',
          name: 'Work, Energy and Power',
          textbookRef: 'NCERT Class 11 Physics — Chapter 5',
          syllabusTopics: ['Work done by constant and variable forces: $W = \\int \\vec{F} \\cdot d\\vec{r}$', 'Work-Energy Theorem: $W_{\\text{net}} = \\Delta K$', 'Conservative vs non-conservative forces; potential energy of a spring ($U = \\frac{1}{2}kx^2$)', 'Elastic and inelastic collisions in one and two dimensions; coefficient of restitution ($e$)'],
          learningObjectives: ['Apply conservation of mechanical energy to vertical loops and spring systems', 'Calculate velocities after 1D elastic collisions using coefficient of restitution'],
          coreFormulas: ['W = \\Delta K', 'U = \\frac{1}{2}kx^2', 'P = \\vec{F} \\cdot \\vec{v}', 'e = \\frac{v_2 - v_1}{u_1 - u_2}']
        },
        {
          id: 'ch-11-p-6',
          name: 'System of Particles and Rotational Motion',
          textbookRef: 'NCERT Class 11 Physics — Chapter 6',
          syllabusTopics: ['Centre of mass of discrete and continuous mass distributions', 'Torque, angular momentum, and conservation of angular momentum', 'Moment of Inertia ($I$), radius of gyration, parallel and perpendicular axes theorems', 'Kinematics and dynamics of pure rolling motion on flat and inclined planes'],
          learningObjectives: ['Calculate moments of inertia of rings, discs, cylinders, and spheres', 'Apply torque equations ($\\tau = I\\alpha$) and rolling kinetic energy'],
          coreFormulas: ['\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}', 'L = I\\omega', 'K_{\\text{total}} = \\frac{1}{2}mv_{\\text{cm}}^2 + \\frac{1}{2}I_{\\text{cm}}\\omega^2']
        },
        {
          id: 'ch-11-p-7',
          name: 'Gravitation',
          textbookRef: 'NCERT Class 11 Physics — Chapter 7',
          syllabusTopics: ['Kepler’s three laws of planetary motion', 'Universal Law of Gravitation, gravitational field, and gravitational potential energy ($U = -GMm/r$)', 'Variation of acceleration due to gravity ($g$) with altitude and depth', 'Orbital velocity and escape velocity ($v_e = \\sqrt{2gR}$); geostationary satellites'],
          learningObjectives: ['Calculate escape velocity from celestial bodies', 'Analyze geostationary orbits and planetary time period relations ($T^2 \\propto r^3$)'],
          coreFormulas: ['g(h) \\approx g\\left(1 - \\frac{2h}{R}\\right)', 'g(d) = g\\left(1 - \\frac{d}{R}\\right)', 'v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}']
        },
        {
          id: 'ch-11-p-8',
          name: 'Mechanical Properties of Solids',
          textbookRef: 'NCERT Class 11 Physics — Chapter 8',
          syllabusTopics: ['Elastic behavior of matter: stress and strain types (tensile, shearing, bulk)', 'Hooke’s Law, stress-strain curve, yield point, and breaking stress', 'Moduli of elasticity: Young’s modulus ($Y$), Shear modulus ($G$), Bulk modulus ($B$)', 'Elastic potential energy stored in a stretched wire'],
          learningObjectives: ['Analyze stress-strain diagrams to classify ductile vs brittle materials', 'Calculate elongation of loaded suspension cables'],
          coreFormulas: ['Y = \\frac{\\text{Stress}}{\\text{Strain}} = \\frac{F/A}{\\Delta L/L}', 'U = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} \\times \\text{Volume}']
        },
        {
          id: 'ch-11-p-9',
          name: 'Mechanical Properties of Fluids',
          textbookRef: 'NCERT Class 11 Physics — Chapter 9',
          syllabusTopics: ['Fluid pressure, Pascal’s law, hydraulic lift; variation of pressure with depth ($P = P_0 + \\rho gh$)', 'Viscosity, Stokes’ law ($F = 6\\pi\\eta r v$), terminal velocity', 'Streamline and turbulent flow, equation of continuity ($A_1 v_1 = A_2 v_2$)', 'Bernoulli’s principle and applications (Venturimeter, dynamic lift of aircraft)', 'Surface tension, angle of contact, excess pressure inside a drop and bubble, capillary rise'],
          learningObjectives: ['Solve fluid flow rates using Bernoulli’s theorem and continuity equation', 'Calculate terminal velocity of spheres falling through viscous liquids'],
          coreFormulas: ['P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}', 'v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}', 'h = \\frac{2T\\cos\\theta}{\\rho g r}']
        },
        {
          id: 'ch-11-p-10',
          name: 'Thermal Properties of Matter',
          textbookRef: 'NCERT Class 11 Physics — Chapter 10',
          syllabusTopics: ['Temperature scales, thermal expansion (linear $\\alpha$, superficial $\\beta$, volumetric $\\gamma$)', 'Heat capacity, specific heat capacity ($Q = mc\\Delta T$), calorimetry principle', 'Latent heat of fusion and vaporization; phase diagram and triple point', 'Heat transfer mechanisms: Conduction (Fourier’s law), Convection, Radiation', 'Newton’s law of cooling and Stefan-Boltzmann law ($E = \\sigma T^4$)'],
          learningObjectives: ['Solve thermal equilibrium mixtures using calorimetry principle', 'Apply Stefan-Boltzmann and Newton’s law of cooling to temperature decline problems'],
          coreFormulas: ['\\frac{dQ}{dt} = -kA \\frac{dT}{dx}', 'E = \\sigma e A T^4', '\\frac{dT}{dt} = -k(T - T_0)']
        },
        {
          id: 'ch-11-p-11',
          name: 'Thermodynamics',
          textbookRef: 'NCERT Class 11 Physics — Chapter 11',
          syllabusTopics: ['Zeroth law of thermodynamics and temperature concept', 'First Law of Thermodynamics: $\\Delta Q = \\Delta U + \\Delta W$', 'Thermodynamic processes: Isothermal ($PV = c$), Adiabatic ($PV^\\gamma = c$), Isochoric, Isobaric', 'Molar heat capacities: Mayer’s relation ($C_p - C_v = R$)', 'Second Law of Thermodynamics: reversible and irreversible processes, Carnot engine efficiency'],
          learningObjectives: ['Calculate work done in isothermal and adiabatic expansions', 'Determine maximum theoretical Carnot engine efficiencies ($\\eta = 1 - T_2/T_1$)'],
          coreFormulas: ['\\Delta Q = \\Delta U + \\Delta W', 'W_{\\text{isothermal}} = nRT\\ln\\frac{V_2}{V_1}', 'W_{\\text{adiabatic}} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}', '\\eta = 1 - \\frac{T_C}{T_H}']
        },
        {
          id: 'ch-11-p-12',
          name: 'Kinetic Theory of Gases',
          textbookRef: 'NCERT Class 11 Physics — Chapter 12',
          syllabusTopics: ['Microscopic model of ideal gas: derivation of pressure equation $P = \\frac{1}{3}\\rho v_{\\text{rms}}^2$', 'Kinetic interpretation of temperature ($K_{\\text{avg}} = \\frac{3}{2}k_B T$)', 'Degrees of freedom ($f$) and law of equipartition of energy', 'Specific heats of monoatomic ($3/2 R$), diatomic ($5/2 R$), and polyatomic gases', 'Mean free path equation ($\\lambda = \\frac{1}{\\sqrt{2}\\pi n d^2}$)'],
          learningObjectives: ['Calculate root-mean-square, average, and most probable molecular speeds', 'Evaluate internal energy and specific heat ratio ($\\gamma = C_p/C_v$) based on molecular degrees of freedom'],
          coreFormulas: ['P = \\frac{1}{3}\\rho v_{\\text{rms}}^2', 'v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}', '\\gamma = 1 + \\frac{2}{f}']
        },
        {
          id: 'ch-11-p-13',
          name: 'Oscillations',
          textbookRef: 'NCERT Class 11 Physics — Chapter 13',
          syllabusTopics: ['Periodic and oscillatory motion; Simple Harmonic Motion (SHM) equation: $x(t) = A\\cos(\\omega t + \\phi)$', 'Velocity, acceleration, and phase diagrams in SHM', 'Energy in SHM: kinetic, potential, and constant total energy ($E = \\frac{1}{2}kA^2$)', 'Oscillations of loaded spring system and simple pendulum ($T = 2\\pi\\sqrt{L/g}$)', 'Free, damped, and forced oscillations; resonance phenomena'],
          learningObjectives: ['Set up second order differential equations for harmonic oscillators ($d^2x/dt^2 + \\omega^2 x = 0$)', 'Calculate oscillation periods of horizontal and vertical spring-mass systems'],
          coreFormulas: ['x = A\\sin(\\omega t + \\phi)', 'T_{\\text{pendulum}} = 2\\pi\\sqrt{\\frac{L}{g}}', 'T_{\\text{spring}} = 2\\pi\\sqrt{\\frac{m}{k}}', 'E_{\\text{total}} = \\frac{1}{2}m\\omega^2 A^2']
        },
        {
          id: 'ch-11-p-14',
          name: 'Waves',
          textbookRef: 'NCERT Class 11 Physics — Chapter 14',
          syllabusTopics: ['Transverse and longitudinal mechanical waves; speed of wave in stretched string ($v = \\sqrt{T/\\mu}$)', 'Laplace’s correction for Newton’s formula of speed of sound in air ($v = \\sqrt{\\gamma P/\\rho}$)', 'Principle of superposition of waves, reflection of waves at rigid and open boundaries', 'Standing waves in stretched strings and organ pipes (open and closed pipes)', 'Beats frequency ($f_b = |f_1 - f_2|$) and qualitative Doppler effect'],
          learningObjectives: ['Determine fundamental and harmonic frequencies in open vs closed organ pipes', 'Calculate beat frequencies and string tension tuning'],
          coreFormulas: ['v = \\sqrt{\\frac{T}{\\mu}}', 'v_{\\text{sound}} = \\sqrt{\\frac{\\gamma RT}{M}}', 'f_{\\text{closed}} = \\frac{(2n-1)v}{4L}', 'f_{\\text{open}} = \\frac{nv}{2L}']
        }
      ]
    },
    {
      id: 'cbse-11-chemistry',
      name: 'Chemistry',
      category: 'Chemistry',
      curricula: ['NCERT Chemistry Class 11 Part 1 & 2', 'CBSE Class 11 Chemistry Board Syllabus', 'IIT-JEE / NEET Inorganic, Organic & Physical Chemistry'],
      chapters: [
        {
          id: 'ch-11-c-1',
          name: 'Some Basic Concepts of Chemistry',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 1',
          syllabusTopics: ['Laws of chemical combinations: Conservation of mass, Definite proportions, Multiple proportions, Gay-Lussac’s law', 'Atomic mass, average isotopic mass, molecular mass, and formula mass', 'Mole concept and molar mass; Avogadro constant ($6.022 \\times 10^{23}$)', 'Empirical and molecular formula determinations', 'Stoichiometry, stoichiometric calculations, and limiting reagent in chemical equations', 'Concentration terms: Mass percentage ($w/w$), Mole fraction ($X$), Molarity ($M$), Molality ($m$)'],
          learningObjectives: ['Calculate empirical and molecular formulas from percentage composition', 'Determine limiting reagents and product yields in stoichiometric reactions'],
          coreFormulas: ['n = \\frac{w}{M}', 'M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}}', 'm = \\frac{n_{\\text{solute}}}{w_{\\text{solvent (kg)}}}']
        },
        {
          id: 'ch-11-c-2',
          name: 'Structure of Atom',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 2',
          syllabusTopics: ['Discovery of subatomic particles; Thomson, Rutherford models and limitations', 'Dual nature of electromagnetic radiation: Planck’s quantum theory and photoelectric effect', 'Bohr model of hydrogen atom: line spectrum of hydrogen, Rydberg formula', 'de Broglie dual nature of matter ($\\lambda = h/p$) and Heisenberg’s uncertainty principle ($\\Delta x \\Delta p \\ge h/4\\pi$)', 'Quantum mechanical model: atomic orbitals, four quantum numbers ($n, l, m_l, m_s$)', 'Aufbau principle, Pauli exclusion principle, Hund’s rule, and electronic configurations of elements (up to $Z = 30$, including Cr, Cu exceptions)'],
          learningObjectives: ['Write spectroscopic electronic configurations showing half-filled and fully-filled orbital stability', 'Calculate photon frequencies and orbital transitions in hydrogen spectrum'],
          coreFormulas: ['E = h\\nu = \\frac{hc}{\\lambda}', '\\bar{\\nu} = R_H \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)', '\\lambda = \\frac{h}{mv}', '\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi}']
        },
        {
          id: 'ch-11-c-3',
          name: 'Classification of Elements and Periodicity in Properties',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 3',
          syllabusTopics: ['Modern Periodic Law and present form of the periodic table ($s, p, d, f$ blocks)', 'Periodic trends in physical properties: Atomic and ionic radii, lanthanoid contraction', 'Ionization Enthalpy (IE), Electron Gain Enthalpy ($\\Delta_{eg}H$), Electronegativity (Pauling scale)', 'Periodic trends in chemical reactivity, valency, and anomalous properties of second period elements'],
          learningObjectives: ['Predict and justify periodic trends across periods and down groups', 'Explain ionization enthalpy anomalies (B vs Be, N vs O) using electronic subshell configurations']
        },
        {
          id: 'ch-11-c-4',
          name: 'Chemical Bonding and Molecular Structure',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 4',
          syllabusTopics: ['Octet rule, Lewis dot symbols, formal charge on atoms', 'Ionic bonding: lattice enthalpy and Born-Haber cycle; Fajan’s rules for covalent character', 'Valence Shell Electron Pair Repulsion (VSEPR) theory and molecular geometries', 'Valence Bond Theory (VBT): orbital overlap, sigma ($\\sigma$) and pi ($\\pi$) bonds', 'Hybridization ($sp, sp^2, sp^3, sp^3d, sp^3d^2$) and shapes of simple molecules ($CH_4, NH_3, H_2O, PCl_5, SF_6$)', 'Molecular Orbital Theory (MOT): bonding and antibonding MOs, bond order ($BO = \\frac{N_b - N_a}{2}$), magnetic behavior of $O_2, N_2, CO$', 'Hydrogen bonding: intermolecular vs intramolecular hydrogen bonds'],
          learningObjectives: ['Predict molecular geometry and bond angles using VSEPR theory and hybridization', 'Draw molecular orbital energy diagrams and calculate bond order and paramagnetism'],
          coreFormulas: ['\\text{Bond Order} = \\frac{N_b - N_a}{2}', '\\mu = q \\times d']
        },
        {
          id: 'ch-11-c-5',
          name: 'Chemical Thermodynamics',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 5',
          syllabusTopics: ['System and surroundings: open, closed, isolated systems; state functions and path functions', 'First Law of Thermodynamics: Internal energy ($U$), heat ($q$), work ($w$), $\\Delta U = q + w$', 'Enthalpy ($H$): exothermic and endothermic reactions, relation between $\\Delta H$ and $\\Delta U$ ($\\Delta H = \\Delta U + \\Delta n_g RT$)', 'Hess’s law of constant heat summation and standard enthalpy of formation, combustion, neutralization', 'Spontaneity, entropy ($S$), and Second Law of Thermodynamics ($\\Delta S_{\\text{total}} > 0$)', 'Gibbs free energy change ($\\Delta G = \\Delta H - T\\Delta S$) and spontaneity criterion ($\\Delta G < 0$); relation with equilibrium constant ($\\Delta G^\\circ = -RT\\ln K$)'],
          learningObjectives: ['Calculate reaction enthalpies using Hess’s law and bond enthalpy data', 'Evaluate spontaneity of chemical processes using Gibbs-Helmholtz equation'],
          coreFormulas: ['\\Delta H = \\Delta U + \\Delta n_g RT', '\\Delta G = \\Delta H - T\\Delta S', '\\Delta G^\\circ = -2.303 RT \\log K']
        },
        {
          id: 'ch-11-c-6',
          name: 'Equilibrium',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 6',
          syllabusTopics: ['Dynamic chemical equilibrium: Law of mass action and equilibrium constant ($K_c, K_p = K_c(RT)^{\\Delta n_g}$)', 'Le Chatelier’s Principle: concentration, pressure, temperature, catalyst, and inert gas effects', 'Ionic equilibrium: Arrhenius, Brønsted-Lowry, and Lewis concepts of acids and bases', 'Ionization of weak acids and bases, ionic product of water ($K_w = 1.0 \\times 10^{-14}$), pH scale', 'Common ion effect, buffer solutions, Henderson-Hasselbalch equation', 'Solubility product constant ($K_{sp}$) and precipitation reactions'],
          learningObjectives: ['Calculate equilibrium concentrations and $K_p/K_c$ conversions', 'Determine buffer pH and predict precipitate formation using ionic product ($Q_{sp} > K_{sp}$)'],
          coreFormulas: ['K_p = K_c(RT)^{\\Delta n_g}', '\\text{pH} = -\\log[H^+]', '\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}', 'K_{sp} = [A^{y+}]^x [B^{x-}]^y']
        },
        {
          id: 'ch-11-c-7',
          name: 'Redox Reactions',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 7',
          syllabusTopics: ['Classical and electronic concepts of oxidation and reduction', 'Oxidation number rules, assigning oxidation states to atoms in complex ions ($Cr_2O_7^{2-}, MnO_4^-$)', 'Types of redox reactions: combination, decomposition, displacement, disproportionation', 'Balancing redox equations: Oxidation number method and Ion-electron (half-reaction) method in acidic and basic media', 'Redox reactions as the basis for electrochemical cells'],
          learningObjectives: ['Assign correct oxidation numbers and balance complex multi-electron redox reactions', 'Identify oxidizing and reducing agents in disproportionation mechanisms']
        },
        {
          id: 'ch-11-c-8',
          name: 'Organic Chemistry: Some Basic Principles and Techniques',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 8',
          syllabusTopics: ['Tetravalency of carbon, hybridization ($sp^3, sp^2, sp$), and shapes of organic molecules', 'Structural representations: complete, condensed, and bond-line structural formulas', 'IUPAC nomenclature of branched alkanes, alkenes, alkynes, and multi-functional group compounds', 'Isomerism: Structural isomerism (chain, position, functional, metamerism) and Stereoisomerism (geometrical cis-trans)', 'Reaction intermediates: carbocations, carbanions, free radicals (structure, hybridization, stability order)', 'Electronic displacement effects: Inductive effect ($+I, -I$), Electromeric effect, Resonance/Mesomeric effect ($+M, -M$), Hyperconjugation', 'Purification methods: distillation, fractional distillation, vacuum distillation, chromatography'],
          learningObjectives: ['Name complex multi-functional organic compounds following IUPAC priority rules', 'Predict relative stability of carbocations and free radicals using hyperconjugation and resonance']
        },
        {
          id: 'ch-11-c-9',
          name: 'Hydrocarbons',
          textbookRef: 'NCERT Class 11 Chemistry — Chapter 9',
          syllabusTopics: ['Alkanes: preparation (Wurtz reaction, decarboxylation, Kolbe’s electrolysis), free radical halogenation mechanism, conformations of ethane (Newman & Sawhorse projections)', 'Alkenes: preparation (dehydrohalogenation, dehydration of alcohols), electrophilic addition of halogens, hydrogen halides (Markovnikov’s rule and Anti-Markovnikov peroxide effect), ozonolysis of alkenes', 'Alkynes: acidity of terminal alkynes, addition reactions with water (Kucharov reaction to ketones/aldehydes), polymerization', 'Aromatic Hydrocarbons: Benzene structure, Huckel’s rule of aromaticity ($4n+2$ pi electrons), electrophilic aromatic substitution (nitration, halogenation, sulphonation, Friedel-Crafts alkylation and acylation), directive influence of functional groups'],
          learningObjectives: ['Synthesize substituted alkenes and aromatic compounds', 'Apply Markovnikov’s rule and Huckel’s aromaticity rule to unknown ring systems']
        }
      ]
    },
    {
      id: 'cbse-11-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 11', 'CBSE Class 11 Senior Secondary Mathematics', 'IIT-JEE Main & Advanced Mathematics'],
      chapters: [
        {
          id: 'ch-11-m-1',
          name: 'Sets',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 1',
          syllabusTopics: ['Sets and their representations: roster and set-builder form', 'Empty, finite, infinite, and equal sets; subsets, power set, universal set', 'Venn diagrams, operations on sets: union, intersection, difference, complement', 'Laws of algebra of sets (De Morgan’s laws) and practical cardinality word problems'],
          learningObjectives: ['Solve 2-set and 3-set inclusion-exclusion cardinality problems', 'Prove set identity theorems using formal element membership logic'],
          coreFormulas: ['n(A \\cup B) = n(A) + n(B) - n(A \\cap B)', '(A \\cup B)\' = A\' \\cap B\'']
        },
        {
          id: 'ch-11-m-2',
          name: 'Relations and Functions',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 2',
          syllabusTopics: ['Cartesian product of sets ($A \\times B$); total number of relations ($2^{mn}$)', 'Definition of a function as a special relation; domain, co-domain, range', 'Real-valued functions: constant, identity, polynomial, rational, modulus, signum, greatest integer function ([x])', 'Sum, difference, product, and quotient of real functions'],
          learningObjectives: ['Determine exact domain and range for square root, modulus, and rational algebraic functions', 'Sketch graphs of piecewise real functions'],
          coreFormulas: ['n(A \\times B) = n(A) \\cdot n(B)']
        },
        {
          id: 'ch-11-m-3',
          name: 'Trigonometric Functions',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 3',
          syllabusTopics: ['Radian measure and degree measure conversions ($l = r\\theta$)', 'Trigonometric functions in all 4 quadrants using unit circle (ASTC rule)', 'Compound angle formulas: $\\sin(x \\pm y), \\cos(x \\pm y), \\tan(x \\pm y)$', 'Multiple and submultiple angles: $\\sin 2x, \\cos 2x, \\tan 2x, \\sin 3x, \\cos 3x$', 'Sum-to-product and product-to-sum transformation formulas', 'Trigonometric equations general solutions'],
          learningObjectives: ['Prove complex multi-angle trigonometric identities', 'Solve trigonometric equations in specified principal and general domains'],
          coreFormulas: [
            '\\cos(x+y) = \\cos x\\cos y - \\sin x\\sin y',
            '\\sin 2x = 2\\sin x\\cos x = \\frac{2\\tan x}{1 + \\tan^2 x}',
            '\\cos 2x = \\cos^2 x - \\sin^2 x = 1 - 2\\sin^2 x = 2\\cos^2 x - 1'
          ]
        },
        {
          id: 'ch-11-m-4',
          name: 'Complex Numbers and Quadratic Equations',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 4',
          syllabusTopics: ['Algebra of complex numbers: addition, multiplication, conjugate ($z^*$), modulus ($|z|$)', 'Argand plane and polar representation ($z = r(\\cos\\theta + i\\sin\\theta)$)', 'Fundamental theorem of algebra; quadratic equations with complex roots', 'Square root of a complex number and geometry in complex plane'],
          learningObjectives: ['Convert algebraic complex numbers into trigonometric polar form ($r e^{i\\theta}$)', 'Solve quadratic equations with negative discriminants in complex number domain'],
          coreFormulas: ['|z| = \\sqrt{a^2 + b^2}', 'z^{-1} = \\frac{\\bar{z}}{|z|^2}', 'z = r(\\cos\\theta + i\\sin\\theta)']
        },
        {
          id: 'ch-11-m-5',
          name: 'Linear Inequalities',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 5',
          syllabusTopics: ['Linear inequalities in one variable: algebraic solutions and representation on real number line', 'Inequalities involving absolute values ($|x| < a \\iff -a < x < a$)', 'Graphical solution of linear inequalities in two variables; feasible solution region for systems of linear inequalities'],
          learningObjectives: ['Determine intersection solution intervals for systems of inequalities', 'Graph feasible solution half-planes in coordinate systems'],
          coreFormulas: ['|x| \\le a \\iff -a \\le x \\le a', '|x| \\ge a \\iff x \\le -a \\text{ or } x \\ge a']
        },
        {
          id: 'ch-11-m-6',
          name: 'Permutations and Combinations',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 6',
          syllabusTopics: ['Fundamental Principle of Counting (Multiplication & Addition rules)', 'Factorial notation ($n!$); permutations as arrangements ($^nP_r = \\frac{n!}{(n-r)!}$)', 'Permutations when objects are not all distinct; circular permutations', 'Combinations as selections ($^nC_r = \\frac{n!}{r!(n-r)!}$); properties of $^nC_r$ ($^nC_r + ^nC_{r-1} = ^{n+1}C_r$)', 'Division into groups and practical restricted arrangement problems'],
          learningObjectives: ['Solve complex arrangement and selection word problems with constraints', 'Apply combinatorial identities to solve competitive math puzzles'],
          coreFormulas: ['^nP_r = \\frac{n!}{(n-r)!}', '^nC_r = \\frac{n!}{r!(n-r)!}', '^nC_r + ^nC_{r-1} = ^{n+1}C_r']
        },
        {
          id: 'ch-11-m-7',
          name: 'Binomial Theorem',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 7',
          syllabusTopics: ['Binomial theorem for positive integral indices: $(a+b)^n = \\sum_{r=0}^n \\ ^nC_r a^{n-r} b^r$', 'Pascal’s triangle and symmetry of binomial coefficients', 'General term ($T_{r+1} = \\ ^nC_r a^{n-r} b^r$) and middle term(s) of expansion', 'Term independent of $x$ and greatest coefficient in expansion'],
          learningObjectives: ['Find general, middle, and independent terms in algebraic binomial expansions', 'Prove combinatorial identities using $(1+x)^n$ series expansions'],
          coreFormulas: ['(a+b)^n = \\sum_{r=0}^n \\binom{n}{r} a^{n-r} b^r', 'T_{r+1} = \\binom{n}{r} a^{n-r} b^r']
        },
        {
          id: 'ch-11-m-8',
          name: 'Sequences and Series',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 8',
          syllabusTopics: ['Sequence and series concepts; Arithmetic Progression (AP) general term and sum ($S_n$)', 'Arithmetic Mean (AM) between two numbers and insertion of $n$ arithmetic means', 'Geometric Progression (GP): general term ($a_n = ar^{n-1}$), sum of first $n$ terms ($S_n = \\frac{a(r^n - 1)}{r - 1}$)', 'Sum of infinite GP ($S_\\infty = \\frac{a}{1 - r}$ for $|r| < 1$); Geometric Mean (GM)', 'Relationship between AM and GM ($AM \\ge GM$)', 'Special series: sum of first $n$ natural numbers, sum of squares, and sum of cubes'],
          learningObjectives: ['Compute sums of finite and infinite geometric progressions', 'Apply $AM \\ge GM$ inequality to determine minima and maxima in algebraic expressions'],
          coreFormulas: ['S_n = \\frac{n}{2}[2a + (n-1)d]', 'S_n = \\frac{a(1 - r^n)}{1 - r}', 'S_\\infty = \\frac{a}{1 - r} \\ (|r| < 1)', '\\text{AM} \\ge \\text{GM} \\iff \\frac{a+b}{2} \\ge \\sqrt{ab}']
        },
        {
          id: 'ch-11-m-9',
          name: 'Straight Lines',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 9',
          syllabusTopics: ['Slope of a line ($m = \\tan\\theta = \\frac{y_2 - y_1}{x_2 - x_1}$); parallel and perpendicular line conditions', 'Various forms of equations of a line: point-slope, two-point, slope-intercept, intercept, and normal form', 'General equation of a line ($Ax + By + C = 0$)', 'Distance of a point from a line ($d = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}$) and distance between parallel lines', 'Angle between two lines: $\\tan\\theta = |\\frac{m_2 - m_1}{1 + m_1 m_2}|$'],
          learningObjectives: ['Convert equations of lines between various standard coordinate representations', 'Calculate perpendicular distances and intersection angles between linear trajectories'],
          coreFormulas: ['y - y_1 = m(x - x_1)', 'd = \\frac{|Ax_1 + By_1 + C|}{\\sqrt{A^2 + B^2}}', 'd_{\\parallel} = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}']
        },
        {
          id: 'ch-11-m-10',
          name: 'Conic Sections',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 10',
          syllabusTopics: ['Conic sections as intersections of a cone with planes: circle, parabola, ellipse, hyperbola', 'Circle: standard equation $(x-h)^2 + (y-k)^2 = r^2$ and general quadratic equation', 'Parabola: focus, directrix, vertex, axis, latus rectum ($y^2 = 4ax, x^2 = 4ay$)', 'Ellipse: standard equation $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$, eccentricity ($e = \\sqrt{1 - b^2/a^2}$), foci, major and minor axes', 'Hyperbola: standard equation $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$, eccentricity ($e = \\sqrt{1 + b^2/a^2}$), foci, asymptotes'],
          learningObjectives: ['Determine foci, vertices, directrices, and latus rectum lengths for all four conics', 'Derive conic equations from given geometric focus-directrix conditions'],
          coreFormulas: [
            '(x-h)^2 + (y-k)^2 = r^2',
            'y^2 = 4ax \\implies \\text{Latus Rectum} = 4a',
            '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\implies e = \\sqrt{1 - \\frac{b^2}{a^2}}',
            '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\implies e = \\sqrt{1 + \\frac{b^2}{a^2}}'
          ]
        },
        {
          id: 'ch-11-m-11',
          name: 'Introduction to Three-Dimensional Geometry',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 11',
          syllabusTopics: ['Coordinate axes and coordinate planes in 3-dimensional space', 'Coordinates of a point in space (8 octants)', 'Distance formula between two points in 3D: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$', 'Section formula for internal and external division in 3D, coordinates of centroid of a triangle'],
          learningObjectives: ['Plot and locate spatial points across all 8 3D octants', 'Calculate spatial distances and collinearity of 3D coordinate points'],
          coreFormulas: ['d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}', 'P = \\left(\\frac{mx_2 + nx_1}{m+n}, \\frac{my_2 + ny_1}{m+n}, \\frac{mz_2 + nz_1}{m+n}\\right)']
        },
        {
          id: 'ch-11-m-12',
          name: 'Limits and Derivatives',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 12',
          syllabusTopics: ['Intuitive idea of limit; left-hand and right-hand limits; indeterminate forms', 'Standard limits: $\\lim_{x \\to a} \\frac{x^n - a^n}{x - a} = n a^{n-1}$, $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$, $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$', 'Derivative of a function at a point: first principles definition ($f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$)', 'Algebra of derivatives: Sum, difference, Product rule ($(uv)\' = u\'v + uv\'$), Quotient rule'],
          learningObjectives: ['Evaluate indeterminate limits using standard theorems and factorization', 'Compute first derivatives from fundamental first principles and product/quotient rules'],
          coreFormulas: [
            'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
            '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
            '(uv)\' = u\'v + uv\'',
            '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}'
          ]
        },
        {
          id: 'ch-11-m-13',
          name: 'Statistics',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 13',
          syllabusTopics: ['Measures of dispersion: range, quartile deviation, mean deviation about mean and median', 'Variance and standard deviation ($\\sigma$) for ungrouped and grouped frequency distributions', 'Short-cut step-deviation method for calculating variance and standard deviation', 'Analysis of frequency distributions with equal means but different variances (Coefficient of Variation $CV = \\frac{\\sigma}{\\bar{x}} \\times 100$)'],
          learningObjectives: ['Calculate mean deviation, variance, and standard deviation for grouped data tables', 'Compare consistency and variability of data sets using Coefficient of Variation'],
          coreFormulas: ['\\sigma^2 = \\frac{1}{N}\\sum f_i(x_i - \\bar{x})^2', '\\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100']
        },
        {
          id: 'ch-11-m-14',
          name: 'Probability',
          textbookRef: 'NCERT Class 11 Mathematics — Chapter 14',
          syllabusTopics: ['Random experiments, outcomes, and sample space ($S$)', 'Events: occurrence of events, types of events (impossible, sure, mutually exclusive, exhaustive events)', 'Axiomatic approach to probability: probability of an event $P(E) = n(E)/n(S)$', 'Addition theorem of probability: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$', 'Probability of event "not A" ($P(A\') = 1 - P(A)$)'],
          learningObjectives: ['Construct formal sample spaces for multi-stage random experiments', 'Calculate probabilities of combined events using addition and complement theorems'],
          coreFormulas: ['P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', 'P(A\') = 1 - P(A)']
        }
      ]
    },
    {
      id: 'cbse-11-biology',
      name: 'Biology',
      category: 'Biology',
      curricula: ['NCERT Biology Class 11', 'CBSE Class 11 Biology Board Syllabus', 'NEET-UG Foundation & Target'],
      chapters: [
        {
          id: 'ch-11-b-1',
          name: 'The Living World',
          textbookRef: 'NCERT Class 11 Biology — Chapter 1',
          syllabusTopics: ['What is living? Biodiversity and necessity of classification', 'Binomial nomenclature (Linnaeus rules: Latinized, italics, generic and specific epithets)', 'Taxonomic hierarchy: Species, Genus, Family, Order, Class, Phylum/Division, Kingdom'],
          learningObjectives: ['Apply binomial nomenclature formatting rules to biological specimens', 'Arrange organisms systematically within taxonomic categories']
        },
        {
          id: 'ch-11-b-2',
          name: 'Biological Classification',
          textbookRef: 'NCERT Class 11 Biology — Chapter 2',
          syllabusTopics: ['Five kingdom classification by R.H. Whittaker (Monera, Protista, Fungi, Plantae, Animalia)', 'Kingdom Monera: Archaebacteria (extremophiles) and Eubacteria; cyanobacteria, mycoplasma', 'Kingdom Protista: Chrysophytes (diatoms), Dinoflagellates, Euglenoids, Slime moulds, Protozoans', 'Kingdom Fungi: Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes; lichens, mycorrhiza', 'Viruses, Viroids, Prions, and Lichens'],
          learningObjectives: ['Differentiate Whittaker’s five kingdoms based on cell structure, body organisation, and nutrition', 'Contrast viral structure with viroids and prions']
        },
        {
          id: 'ch-11-b-3',
          name: 'Plant Kingdom',
          textbookRef: 'NCERT Class 11 Biology — Chapter 3',
          syllabusTopics: ['Classification of plants: Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms', 'Algae: Chlorophyceae, Phaeophyceae, Rhodophyceae (pigments, stored food, cell wall)', 'Bryophytes: Liverworts and Mosses; amphibians of the plant kingdom; gametophyte vs sporophyte', 'Pteridophytes: vascular cryptogams, homospory and heterospory, evolution of seed habit', 'Gymnosperms: naked seeds, mycorrhiza, coralloid roots; life cycles and alternation of generations'],
          learningObjectives: ['Identify life cycle patterns (haplontic, diplontic, haplodiplontic) across plant divisions', 'Analyze evolutionary significance of heterospory in seed development']
        },
        {
          id: 'ch-11-b-4',
          name: 'Animal Kingdom',
          textbookRef: 'NCERT Class 11 Biology — Chapter 4',
          syllabusTopics: ['Basis of classification: levels of organisation, symmetry (radial vs bilateral), coelom, segmentation, notochord', 'Non-chordata phyla: Porifera, Cnidaria, Ctenophora, Platyhelminthes, Aschelminthes, Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata', 'Chordata phylum: Urochordata, Cephalochordata, Vertebrata', 'Vertebrata classes: Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia'],
          learningObjectives: ['Classify animal specimens using diagnostic anatomical characteristics', 'Distinguish cartilaginous (Chondrichthyes) from bony fishes (Osteichthyes)']
        },
        {
          id: 'ch-11-b-5',
          name: 'Morphology of Flowering Plants',
          textbookRef: 'NCERT Class 11 Biology — Chapter 5',
          syllabusTopics: ['Root system: tap root, fibrous root, adventitious roots; root modifications for storage and support', 'Stem: characteristics, buds, and modifications (rhizome, tuber, tendrils, thorns)', 'Leaf: parts, venation (reticulate vs parallel), types (simple and compound), phyllotaxy', 'Inflorescence: racemose and cymose', 'Flower: parts (calyx, corolla, androecium, gynoecium), symmetry (actinomorphic, zygomorphic), aestivation, placentation types (marginal, axile, parietal, free central, basal)', 'Fruit and seed morphology; description of family Solanaceae / Fabaceae'],
          learningObjectives: ['Interpret floral formulas and draw floral diagrams accurately', 'Identify types of placentation and leaf venation']
        },
        {
          id: 'ch-11-b-6',
          name: 'Anatomy of Flowering Plants',
          textbookRef: 'NCERT Class 11 Biology — Chapter 6',
          syllabusTopics: ['Plant tissues: Meristematic tissues (apical, intercalary, lateral) and Permanent tissues (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem, phloem)', 'Tissue systems: epidermal, ground, vascular (conjoint, open, closed, radial)', 'Anatomy of dicotyledonous and monocotyledonous root, stem, and leaf', 'Secondary growth in dicot stem and root: vascular cambium, cork cambium (phellogen), annual rings, heartwood and sapwood'],
          learningObjectives: ['Distinguish transverse sections of dicot vs monocot stem under microscope', 'Explain secondary thickening mediated by vascular and cork cambium']
        },
        {
          id: 'ch-11-b-7',
          name: 'Structural Organisation in Animals',
          textbookRef: 'NCERT Class 11 Biology — Chapter 7',
          syllabusTopics: ['Animal tissues: Epithelial tissue (squamous, cuboidal, columnar, ciliated; glandular epithelium)', 'Connective tissue: loose (areolar, adipose), dense (tendon, ligament), specialized (cartilage, bone, blood)', 'Muscle tissue: skeletal, smooth, and cardiac muscle fibers', 'Neural tissue: neurons, neuroglia', 'Morphology, anatomy, and digestive/circulatory/nervous system of Frog (*Rana tigrina*)'],
          learningObjectives: ['Differentiate voluntary skeletal from involuntary smooth and cardiac muscle fibers', 'Describe organ systems of frog and adaptations to amphibian life']
        },
        {
          id: 'ch-11-b-8',
          name: 'Cell: The Unit of Life',
          textbookRef: 'NCERT Class 11 Biology — Chapter 8',
          syllabusTopics: ['Cell theory (Schleiden, Schwann, Virchow: *Omnis cellula-e-cellula*)', 'Prokaryotic vs Eukaryotic cells: bacterial cell envelope, plasmids, mesosomes, ribosomes (70S)', 'Eukaryotic cell structure: Plasma membrane (Fluid Mosaic Model of Singer & Nicolson)', 'Endomembrane system: Endoplasmic Reticulum (RER & SER), Golgi apparatus, Lysosomes, Vacuoles', 'Mitochondria (cristae, ATP synthesis) and Chloroplasts (thylakoids, stroma, endosymbiotic theory)', 'Ribosomes (80S), Cytoskeleton (microtubules, microfilaments), Cilia, Flagella, Centrosome, Nucleus (nuclear membrane, chromatin, nucleolus)'],
          learningObjectives: ['Explain membrane transport (passive, active, facilitated) via fluid mosaic model', 'Compare structural and functional autonomy of mitochondria and chloroplasts']
        },
        {
          id: 'ch-11-b-9',
          name: 'Biomolecules',
          textbookRef: 'NCERT Class 11 Biology — Chapter 9',
          syllabusTopics: ['Chemical constituents of living cells: analysis of elemental composition, acid-soluble and insoluble fractions', 'Primary and secondary metabolites (alkaloids, flavonoids, terpenoids, essential oils)', 'Biomacromolecules: Proteins (amino acids, peptide bonds, primary, secondary, tertiary, quaternary structures)', 'Carbohydrates (monosaccharides, disaccharides, polysaccharides: cellulose, starch, glycogen)', 'Lipids (fatty acids, glycerol, triglycerides, phospholipids in cell membranes)', 'Nucleic acids: nucleotides, DNA double helix structure, RNA types', 'Enzymes: chemical nature, activation energy diagram, enzyme kinetics ($V_{\\text{max}}, K_m$), factors affecting enzyme action, competitive inhibition'],
          learningObjectives: ['Explain enzyme kinetics and competitive inhibition with substrate concentration curves', 'Describe protein structural hierarchy from linear polypeptide to tertiary active fold']
        },
        {
          id: 'ch-11-b-10',
          name: 'Cell Cycle and Cell Division',
          textbookRef: 'NCERT Class 11 Biology — Chapter 10',
          syllabusTopics: ['Cell cycle phases: Interphase ($G_1, S, G_2$ phases) and $G_0$ quiescent stage', 'Mitosis (Equational division): Prophase, Metaphase, Anaphase, Telophase; Cytokinesis in plant vs animal cells', 'Significance of mitosis in growth, repair, and regeneration', 'Meiosis (Reductional division): Meiosis I (Prophase I: Leptotene, Zygotene, Pachytene crossing over, Diplotene chiasmata, Diakinesis), Metaphase I, Anaphase I, Telophase I; Meiosis II', 'Significance of meiosis in generating genetic variability and chromosome conservation across generations'],
          learningObjectives: ['Identify chromosomal behavior at each substage of Prophase I', 'Explain crossing over mediated by recombinase enzyme and its role in genetic variation']
        },
        {
          id: 'ch-11-b-11',
          name: 'Photosynthesis in Higher Plants',
          textbookRef: 'NCERT Class 11 Biology — Chapter 11',
          syllabusTopics: ['Site of photosynthesis: chloroplasts, photosynthetic pigments (Chlorophyll a, b, carotenoids, xanthophylls)', 'Light reaction: photosystems I and II (PS I - $P_{700}$, PS II - $P_{680}$), photolysis of water ($2H_2O \\to 4H^+ + 4e^- + O_2$)', 'Photophosphorylation: cyclic vs non-cyclic electron transport (Z-scheme)', 'Chemiosmotic hypothesis for ATP generation by ATP synthase ($F_0-F_1$)', 'Dark reaction (Biosynthetic phase): Calvin cycle ($C_3$ pathway: carboxylation, reduction, regeneration of RuBP)', 'Hatch and Slack pathway ($C_4$ pathway): Kranz anatomy, PEP carboxylase, photorespiration ($C_2$ cycle)', 'Factors affecting photosynthesis: Blackman’s law of limiting factors'],
          learningObjectives: ['Contrast $C_3$ and $C_4$ photosynthetic pathways and explain why $C_4$ plants lack photorespiration', 'Explain chemiosmotic proton gradient generation across thylakoid membrane']
        },
        {
          id: 'ch-11-b-12',
          name: 'Respiration in Plants',
          textbookRef: 'NCERT Class 11 Biology — Chapter 12',
          syllabusTopics: ['Cellular respiration: aerobic vs anaerobic respiration; respiratory substrates', 'Glycolysis (EMP pathway): 10 steps, substrate-level phosphorylation, net yield (2 ATP + 2 NADH)', 'Fermentation: alcoholic and lactic acid fermentation', 'Aerobic respiration: Link reaction (oxidative decarboxylation of pyruvate to Acetyl CoA)', 'Tricarboxylic Acid (TCA) / Krebs cycle in mitochondrial matrix', 'Electron Transport System (ETS) and Oxidative Phosphorylation in inner mitochondrial membrane (Complexes I-V)', 'Respiratory balance sheet, amphibolic pathway, Respiratory Quotient ($RQ = \\text{Volume of } CO_2 \\text{ evolved} / \\text{Volume of } O_2 \\text{ consumed}$)'],
          learningObjectives: ['Calculate net theoretical ATP yield per glucose molecule during aerobic oxidation', 'Determine Respiratory Quotient ($RQ$) for carbohydrates, fats, and proteins'],
          coreFormulas: ['RQ = \\frac{\\text{Volume of } CO_2 \\text{ evolved}}{\\text{Volume of } O_2 \\text{ consumed}}']
        },
        {
          id: 'ch-11-b-13',
          name: 'Plant Growth and Development',
          textbookRef: 'NCERT Class 11 Biology — Chapter 13',
          syllabusTopics: ['Plant growth: phases of growth (meristematic, elongation, maturation), growth rate (arithmetic vs geometric)', 'Differentiation, dedifferentiation, redifferentiation; plasticity in plants', 'Plant Growth Regulators (PGRs): Auxins (apical dominance, rooting), Gibberellins (bolting, internode elongation), Cytokinins (cell division, delay of senescence), Ethylene (fruit ripening, abscission), Abscisic acid (stress hormone, stomatal closure)', 'Photoperiodism (short day, long day, day neutral plants) and Vernalization'],
          learningObjectives: ['Identify physiological roles and commercial agricultural applications of each major plant hormone', 'Explain photoperiodic floral induction mediated by florigen']
        },
        {
          id: 'ch-11-b-14',
          name: 'Breathing and Exchange of Gases',
          textbookRef: 'NCERT Class 11 Biology — Chapter 14',
          syllabusTopics: ['Respiratory organs in animals; human respiratory system: nasal cavity, pharynx, larynx, trachea, bronchi, alveoli', 'Mechanism of breathing: inspiration and expiration, role of diaphragm and intercostal muscles', 'Respiratory volumes and capacities: Tidal Volume (TV), Inspiratory Reserve Volume (IRV), Expiratory Reserve Volume (ERV), Residual Volume (RV), Vital Capacity (VC), Total Lung Capacity (TLC)', 'Exchange of gases at alveoli and tissues; partial pressures ($pO_2, pCO_2$)', 'Transport of gases: Oxygen transport by hemoglobin, oxygen-hemoglobin dissociation curve, Bohr effect; Carbon dioxide transport (as bicarbonate $70\\%$, carbamino-hemoglobin $20-25\\%$, dissolved $7\\%$)', 'Regulation of respiration: respiratory rhythm center in medulla, pneumotaxic center in pons', 'Disorders of respiratory system: asthma, emphysema, occupational respiratory disorders'],
          learningObjectives: ['Interpret the sigmoid oxygen-hemoglobin dissociation curve and factors shifting it right/left', 'Calculate vital capacity and alveolar ventilation from spirometry data']
        },
        {
          id: 'ch-11-b-15',
          name: 'Body Fluids and Circulation',
          textbookRef: 'NCERT Class 11 Biology — Chapter 15',
          syllabusTopics: ['Composition of blood: plasma, formed elements (erythrocytes, leukocytes: granulocytes & agranulocytes, platelets)', 'Blood grouping: ABO system and Rh factor; erythroblastosis foetalis', 'Coagulation of blood: cascade mechanism, thrombokinase, prothrombin, fibrinogen to fibrin', 'Lymph (tissue fluid) composition and function', 'Circulatory pathways: open vs closed; human circulatory system: structure of heart, cardiac muscle, conducting system (SA node, AV node, bundle of His, Purkinje fibers)', 'Cardiac cycle: phases, heart sounds (lub, dub), stroke volume, cardiac output ($CO = SV \\times HR = 5\\text{ L/min}$)', 'Electrocardiogram (ECG): P wave, QRS complex, T wave interpretation', 'Double circulation: pulmonary and systemic circuits, hepatic portal system', 'Disorders: hypertension, coronary artery disease (atherosclerosis), angina pectoris, heart failure'],
          learningObjectives: ['Trace electrical conduction path of the heartbeat from SA node through myocardium', 'Analyze standard ECG wave intervals and diagnose cardiac arrhythmias']
        },
        {
          id: 'ch-11-b-16',
          name: 'Excretory Products and their Elimination',
          textbookRef: 'NCERT Class 11 Biology — Chapter 16',
          syllabusTopics: ['Modes of excretion: ammonotelism, ureotelism, uricotelism with animal examples', 'Human excretory system: kidneys, ureters, urinary bladder, urethra; internal structure of kidney', 'Nephron as structural and functional unit: cortical vs juxtamedullary nephrons; Malpighian body (Bowman’s capsule + glomerulus)', 'Urine formation: Glomerular filtration (GFR = $125\\text{ mL/min}$), tubular reabsorption, tubular secretion', 'Mechanism of concentration of filtrate: Counter-current mechanism in Henle’s loop and vasa recta', 'Regulation of kidney function: Renin-Angiotensin-Aldosterone System (RAAS), Antidiuretic Hormone (ADH / Vasopressin), Atrial Natriuretic Factor (ANF)', 'Micturition, role of lungs, liver, and skin in excretion', 'Disorders: uremia, renal failure, renal calculi, nephritis; hemodialysis and kidney transplantation'],
          learningObjectives: ['Explain the counter-current multiplier mechanism maintaining hyperosmotic medullary gradient', 'Detail hormonal regulation of GFR via RAAS and feedback loop']
        },
        {
          id: 'ch-11-b-17',
          name: 'Locomotion and Movement',
          textbookRef: 'NCERT Class 11 Biology — Chapter 17',
          syllabusTopics: ['Types of movement: amoeboid, ciliary, muscular; muscle tissue types', 'Skeletal muscle structure: fascicles, muscle fiber, myofibrils, sarcomere as functional unit', 'Contractile proteins: Actin (F-actin, tropomyosin, troponin) and Myosin (heavy and light meromyosin)', 'Mechanism of muscle contraction: Sliding Filament Theory, neuromuscular junction, role of calcium ions and ATP', 'Human skeletal system: Axial skeleton (skull, vertebral column, ribs, sternum - 80 bones) and Appendicular skeleton (pectoral girdle, pelvic girdle, limbs - 126 bones)', 'Joints: fibrous, cartilaginous, synovial joints (ball and socket, hinge, pivot, gliding, saddle)', 'Disorders: myasthenia gravis, tetany, muscular dystrophy, arthritis, osteoporosis, gout'],
          learningObjectives: ['Describe molecular events of cross-bridge cycling during sarcomere shortening', 'Classify human skeletal joints based on degree of mobility and structural articulations']
        },
        {
          id: 'ch-11-b-18',
          name: 'Neural Control and Coordination',
          textbookRef: 'NCERT Class 11 Biology — Chapter 18',
          syllabusTopics: ['Human nervous system: Central Nervous System (CNS) and Peripheral Nervous System (PNS: somatic & autonomic)', 'Neuron structure: dendrites, cell body (cyton), axon, myelin sheath, nodes of Ranvier', 'Generation and conduction of nerve impulse: resting membrane potential ($-70\\text{ mV}$), depolarization, action potential, repolarization ($Na^+-K^+$ ATPase pump)', 'Synaptic transmission: electrical vs chemical synapses, neurotransmitters (acetylcholine)', 'Central nervous system: Forebrain (cerebrum, thalamus, hypothalamus), Midbrain, Hindbrain (pons, cerebellum, medulla oblongata)', 'Limbic system and reflex action: reflex arc pathway', 'Sensory reception and processing: elementary structure of human eye and ear'],
          learningObjectives: ['Diagram the ionic basis of action potential generation along axon membrane', 'Explain synaptic transmission across synaptic cleft via neurotransmitter release']
        },
        {
          id: 'ch-11-b-19',
          name: 'Chemical Coordination and Integration',
          textbookRef: 'NCERT Class 11 Biology — Chapter 19',
          syllabusTopics: ['Endocrine glands and hormones: nature and classification of hormones (peptide, steroid, iodothyronine, amino acid derivatives)', 'Human endocrine system: Hypothalamus (releasing and inhibiting hormones), Pituitary gland (adenohypophysis & neurohypophysis: GH, PRL, TSH, ACTH, LH, FSH, oxytocin, vasopressin)', 'Pineal gland (melatonin, circadian rhythm), Thyroid gland ($T_3, T_4$, calcitonin; goitre, cretinism), Parathyroid gland (PTH, calcium homeostasis)', 'Thymus gland (thymosins, cell-mediated immunity), Adrenal gland (adrenal cortex: mineralocorticoids, glucocorticoids; adrenal medulla: adrenaline, noradrenaline)', 'Pancreas as composite gland (Islets of Langerhans: insulin, glucagon; diabetes mellitus), Gonads (Testes: testosterone; Ovaries: estrogen, progesterone)', 'Hormones of heart (ANF), kidney (erythropoietin), gastrointestinal tract (gastrin, secretin, CCK, GIP)', 'Mechanism of hormone action: protein hormones via second messengers ($cAMP, IP_3, Ca^{2+}$) vs lipid-soluble steroid hormones via gene expression'],
          learningObjectives: ['Contrast signal transduction of membrane-bound vs intracellular steroid hormone receptors', 'Explain antagonistic regulation of blood glucose (insulin vs glucagon) and blood calcium (calcitonin vs PTH)']
        }
      ]
    },
    {
      id: 'cbse-11-english',
      name: 'English Core (Hornbill & Snapshots)',
      category: 'English & Languages',
      curricula: ['NCERT Hornbill & Snapshots Class 11', 'CBSE Class 11 English Core Curriculum'],
      chapters: [
        {
          id: 'ch-11-e-1',
          name: 'The Portrait of a Lady (Hornbill)',
          textbookRef: 'NCERT Hornbill Class 11 — Chapter 1',
          syllabusTopics: ['Khushwant Singh’s autobiographical tribute to his grandmother', 'Three phases of relationship: village life, city school, university and going abroad', 'The grandmother’s religious devotion, feeding sparrows, and silent death'],
          learningObjectives: ['Analyze intergenerational bonds and character portrayal of the grandmother', 'Explore emotional restraint and autobiographical prose techniques']
        },
        {
          id: 'ch-11-e-2',
          name: 'We’re Not Afraid to Die... If We Can All Be Together',
          textbookRef: 'NCERT Hornbill Class 11 — Chapter 2',
          syllabusTopics: ['Gordon Cook and Alan East’s seafaring survival narrative', 'The Wavewalker voyage across the stormy southern Indian Ocean', 'Courage, technical navigation, teamwork, and children’s bravery'],
          learningObjectives: ['Examine themes of human resilience and optimism in the face of natural disaster']
        },
        {
          id: 'ch-11-e-3',
          name: 'Discovering Tut: The Saga Continues',
          textbookRef: 'NCERT Hornbill Class 11 — Chapter 3',
          syllabusTopics: ['A.R. Williams’ journalistic account of King Tutankhamun’s mummy', 'Howard Carter’s 1922 archaeological discovery vs modern CT-scan forensic technology', 'Ancient Egyptian history, funerary treasures, and the mysteries surrounding Tut’s death'],
          learningObjectives: ['Understand the role of modern scientific technology in historical and archaeological discovery']
        },
        {
          id: 'ch-11-e-4',
          name: 'The Laburnum Top & The Voice of the Rain (Poems)',
          textbookRef: 'NCERT Hornbill Class 11 — Poetry',
          syllabusTopics: ['Ted Hughes’ "The Laburnum Top": silence transformed into vitality by the goldfinch', 'Walt Whitman’s "The Voice of the Rain": cyclic eternal journey of rain and poetry', 'Personification, metaphor, and visual imagery in modern poetry'],
          learningObjectives: ['Compare poetic techniques and symbolic representations of nature’s regenerative cycle']
        },
        {
          id: 'ch-11-e-5',
          name: 'Childhood & Father to Son (Poems)',
          textbookRef: 'NCERT Hornbill Class 11 — Poetry',
          syllabusTopics: ['Markus Natten’s "Childhood": loss of innocence, rationalism, and emergence of individuality', 'Elizabeth Jennings’ "Father to Son": communication breakdown, generation gap, and longing for reconciliation'],
          learningObjectives: ['Analyze universal themes of psychological development and parental alienation']
        },
        {
          id: 'ch-11-e-6',
          name: 'The Summer of the Beautiful White Horse (Snapshots)',
          textbookRef: 'NCERT Snapshots Class 11 — Chapter 1',
          syllabusTopics: ['William Saroyan’s story of Aram and Mourad of the Garoghlanian tribe', 'Poverty, love for horses, and the tribe’s legendary hallmark of honesty and integrity', 'Returning John Byro’s stolen horse out of moral conscience'],
          learningObjectives: ['Evaluate moral dilemmas, tribal honor codes, and childhood innocence']
        },
        {
          id: 'ch-11-e-7',
          name: 'The Address (Snapshots)',
          textbookRef: 'NCERT Snapshots Class 11 — Chapter 2',
          syllabusTopics: ['Marga Minco’s poignant post-World War II short story', 'Daughter visiting 46 Marconi Street to reclaim mother’s pre-war possessions', 'Greed of Mrs. Dorling and the painful realization that physical objects cannot restore lost lives'],
          learningObjectives: ['Analyze war trauma, displacement, and the psychological choice of letting go']
        },
        {
          id: 'ch-11-e-8',
          name: 'Mother’s Day & Birth (Snapshots)',
          textbookRef: 'NCERT Snapshots Class 11 — Drama & Story',
          syllabusTopics: ['J.B. Priestley’s "Mother’s Day": satirical drama on domestic exploitation of housewives and Mrs. Pearson’s personality swap with Mrs. Fitzgerald', 'A.J. Cronin’s "Birth": Dr. Andrew Manson’s desperate battle to revive a stillborn baby in a Welsh mining town'],
          learningObjectives: ['Appreciate dramatic satire on gender roles and medical dedication in life-and-death crises']
        }
      ]
    }
  ]
};
