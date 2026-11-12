import { SyllabusBoardInfo } from './types';

export const boardJEE: SyllabusBoardInfo = {
  id: 'JEE',
  name: 'IIT-JEE (Joint Entrance Examination — Main & Advanced)',
  shortName: 'IIT-JEE (Main / Adv)',
  jurisdiction: 'National Premier Engineering Entrance (NTA / IITs)',
  academicYears: ['2025–2026', '2026–2027'],
  classes: [
    {
      id: 'jee-complete',
      name: 'IIT-JEE Target (Main & Advanced)',
      gradeEquivalent: 'Competitive Exams (JEE / NEET / SAT / AP / GRE)',
      subjects: [
        {
          id: 'jee-physics',
          name: 'Physics for JEE',
          category: 'Physics',
          curricula: ['JEE Main & Advanced Physics Syllabus', 'Concepts of Physics (H.C. Verma)', 'I.E. Irodov Problems in General Physics'],
          chapters: [
            {
              id: 'ch-jee-p-1',
              name: 'Kinematics, Relative Motion & Projectiles in 2D/3D',
              textbookRef: 'JEE Physics — Mechanics Volume 1',
              syllabusTopics: ['Calculus-based kinematics ($v = dx/dt, a = v dv/dx$)', '2D Projectile motion on inclined planes (uphill and downhill)', 'Relative velocity in 2D (swimmer-river, wind-airplane, rain-man)', 'Constrained motion and virtual work method for pulley networks'],
              learningObjectives: ['Calculate projectile range and angle of maximum reach on inclined terrain', 'Solve multi-body pulley constraint acceleration problems using virtual work method'],
              coreFormulas: ['R_{\\text{incline}} = \\frac{u^2}{g\\cos^2\\beta}[\\sin(2\\alpha - \\beta) - \\sin\\beta]', 'a = v \\frac{dv}{dx}']
            },
            {
              id: 'ch-jee-p-2',
              name: 'Newton’s Laws, Friction Dynamics & Circular Motion',
              textbookRef: 'JEE Physics — Mechanics Volume 1',
              syllabusTopics: ['Two-block and three-block friction systems ($f_s \\le \\mu_s N$)', 'Centripetal and tangential acceleration, circular motion in vertical circles ($v_{\\text{bottom}} \\ge \\sqrt{5gR}$)', 'Inertial and non-inertial reference frames; pseudo-forces (centrifugal force, Coriolis force)'],
              learningObjectives: ['Determine minimum coefficient of friction to prevent relative slipping between stacked blocks', 'Analyze vertical circular loops for non-slack condition at zenith'],
              coreFormulas: ['v_{\\text{min, top}} = \\sqrt{gR}', 'v_{\\text{min, bottom}} = \\sqrt{5gR}', 'T_{\\text{bottom}} - T_{\\text{top}} = 6mg']
            },
            {
              id: 'ch-jee-p-3',
              name: 'Work-Power-Energy & Conservative Systems',
              textbookRef: 'JEE Physics — Mechanics Volume 1',
              syllabusTopics: ['Work-Energy Theorem for variable forces and non-inertial frames', 'Potential energy curves $U(x)$: stable, unstable, and neutral equilibrium conditions ($dU/dx = 0, d^2U/dx^2 > 0$)', 'Power delivery to accelerating bodies under constant and variable resistance forces'],
              learningObjectives: ['Identify equilibrium stability from potential energy curves', 'Apply energy conservation to non-linear spring and mass systems'],
              coreFormulas: ['F = -\\frac{dU}{dx}', '\\text{Stable: } \\frac{d^2U}{dx^2} > 0', 'W_{\\text{net}} = \\Delta K']
            },
            {
              id: 'ch-jee-p-4',
              name: 'Center of Mass, Momentum Conservation & Collisions',
              textbookRef: 'JEE Physics — Mechanics Volume 2',
              syllabusTopics: ['Continuous mass distributions: semicircular ring ($y = 2R/\\pi$), semicircular disc ($4R/3\\pi$), hemisphere ($3R/8$)', 'Variable mass systems: rocket propulsion equation ($v = v_0 + u_{\\text{rel}}\\ln(m_0/m)$)', '1D and 2D oblique collisions with coefficient of restitution ($e$)'],
              learningObjectives: ['Calculate rocket thrust and instantaneous velocity with mass ejection', 'Solve 2D oblique elastic and inelastic collision trajectories'],
              coreFormulas: ['v = v_0 + u_{\\text{rel}}\\ln\\frac{m_0}{m}', 'v_2 - v_1 = e(u_1 - u_2)']
            },
            {
              id: 'ch-jee-p-5',
              name: 'Rotational Dynamics, Moment of Inertia & Pure Rolling',
              textbookRef: 'JEE Physics — Mechanics Volume 2',
              syllabusTopics: ['Parallel and perpendicular axes theorems for compound planar and 3D bodies', 'Torque and angular momentum vector cross products: $\\vec{\\tau} = d\\vec{L}/dt$', 'Instantaneous Center of Zero Velocity (ICOR) in planar rigid body kinematics', 'Pure rolling on horizontal and inclined rough planes; friction direction and magnitude ($a_{\\text{cm}} = \\frac{g\\sin\\theta}{1 + I_{\\text{cm}}/mR^2}$)', 'Toppling vs sliding conditions of rectangular blocks and cylinders'],
              learningObjectives: ['Calculate linear acceleration of bodies rolling down rough inclines without slipping', 'Determine toppling threshold conditions on inclined planes'],
              coreFormulas: ['a_{\\text{cm}} = \\frac{g\\sin\\theta}{1 + \\frac{I_{\\text{cm}}}{mR^2}}', 'L = I_{\\text{cm}}\\omega + \\vec{r}_{\\text{cm}} \\times m\\vec{v}_{\\text{cm}}']
            },
            {
              id: 'ch-jee-p-6',
              name: 'Fluid Mechanics, Surface Tension & Viscosity',
              textbookRef: 'JEE Physics — Properties of Matter',
              syllabusTopics: ['Fluids in accelerated frames: surface inclination ($\tan\\theta = a/g$)', 'Bernoulli’s equation with fluid friction losses; Torricelli’s efflux law and emptying time of tanks', 'Excess pressure inside cylindrical and spherical liquid surfaces ($\\Delta P = 2T/R, 4T/R$ for soap bubble)', 'Capillary rise (Jurin’s law: $h = 2T\\cos\\theta/\\rho gr$)', 'Stokes’ law and terminal velocity ($v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}$)'],
              learningObjectives: ['Calculate drainage time of conical and cylindrical vessels using variable head integration', 'Determine capillary rise height in tubes with varying contact angles'],
              coreFormulas: ['v = \\sqrt{2gh}', 't_{\\text{empty}} = \\int \\frac{A(y)}{a\\sqrt{2gy}} dy', '\\Delta P_{\\text{bubble}} = \\frac{4T}{R}']
            },
            {
              id: 'ch-jee-p-7',
              name: 'Electrostatics, Gauss’s Law & Capacitance Networks',
              textbookRef: 'JEE Physics — Electromagnetism',
              syllabusTopics: ['Coulomb’s law in vector form; electric field of charged line, ring, disc, and spherical shell', 'Gauss’s Law: flux calculations for symmetrical charge distributions', 'Electrostatic potential energy ($U = \\frac{1}{2}\\epsilon_0 E^2$ energy density) and self-energy of charged conducting sphere ($U = \\frac{Q^2}{8\\pi\\epsilon_0 R}$)', 'Capacitance: parallel plate with dielectric slabs, spherical and cylindrical capacitors', 'Dielectric boundary conditions, force between capacitor plates ($F = \\frac{Q^2}{2A\\epsilon_0}$), and LC oscillations'],
              learningObjectives: ['Calculate electric fields for non-uniform volume charge densities using Gauss’s Law', 'Analyze circuit charge transfers in switched RC and capacitor networks'],
              coreFormulas: ['E_{\\text{ring, axis}} = \\frac{1}{4\\pi\\epsilon_0}\\frac{Qx}{(x^2 + R^2)^{3/2}}', 'U_{\\text{self}} = \\frac{Q^2}{8\\pi\\epsilon_0 R}', 'F = \\frac{Q^2}{2A\\epsilon_0}']
            },
            {
              id: 'ch-jee-p-8',
              name: 'Current Electricity, RC Circuits & Magnetic Effects',
              textbookRef: 'JEE Physics — Electromagnetism',
              syllabusTopics: ['Kirchhoff’s laws, symmetric cube networks, and delta-star transformations', 'Charging and discharging of RC circuits ($q(t) = Q_0(1 - e^{-t/RC})$ and time constant $\\tau = RC$)', 'Biot-Savart Law: magnetic field of circular coils, finite straight wires, and solenoids', 'Ampere’s Circuital Law and magnetic force on moving charges: Lorentz force ($\\vec{F} = q(\\vec{E} + \\vec{v}\\times\\vec{B})$)', 'Cyclotron motion, helical path in non-parallel fields, and magnetic dipole moments'],
              learningObjectives: ['Evaluate transient current equations in multi-loop RC and LR circuits', 'Compute magnetic fields using Biot-Savart integration along customized wire geometries'],
              coreFormulas: ['q(t) = Q_{\\text{max}}(1 - e^{-t/RC})', 'B = \\frac{\\mu_0 I}{4\\pi d}(\\sin\\alpha + \\sin\\beta)', 'r = \\frac{mv}{qB}']
            },
            {
              id: 'ch-jee-p-9',
              name: 'Electromagnetic Induction (EMI) & Alternating Current',
              textbookRef: 'JEE Physics — Electromagnetism',
              syllabusTopics: ['Faraday’s Law of induction and Lenz’s Law; motional EMF ($e = Bvl$ and $e = \\frac{1}{2}B\\omega l^2$ for rotating rods)', 'Self and mutual inductance ($L, M$), energy stored in magnetic field ($U = \\frac{1}{2}LI^2$)', 'Series and parallel LCR circuits: phasor diagrams, impedance ($Z$), resonance ($f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$), Q-factor ($Q = \\frac{\\omega_0 L}{R}$)', 'Power in AC circuits: power factor ($\\cos\\phi = R/Z$) and wattless current'],
              learningObjectives: ['Derive induced EMF in rotating conductor loops and conducting rods', 'Analyze resonance sharpness and bandwidth in high-Q RLC radio circuits'],
              coreFormulas: ['e = -\\frac{d\\Phi_B}{dt}', 'Z = \\sqrt{R^2 + (X_L - X_C)^2}', 'f_0 = \\frac{1}{2\\pi\\sqrt{LC}}', 'Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}']
            },
            {
              id: 'ch-jee-p-10',
              name: 'Wave Optics & Modern Physics (Photoelectric, Bohr & Nuclear)',
              textbookRef: 'JEE Physics — Optics & Modern Physics',
              syllabusTopics: ['Huygens’ principle, Young’s Double Slit Experiment (YDSE) with thin mica sheets, path difference ($\\Delta x = \\frac{yd}{D} + (\\mu - 1)t$)', 'Photoelectric effect: Einstein’s photoelectric equation ($h\\nu = \\phi_0 + K_{\\text{max}}$), stopping potential ($V_0$)', 'de Broglie wavelength ($\\lambda = \\frac{h}{\\sqrt{2mqV}}$) and Bohr model of hydrogenic ions ($r_n \\propto n^2/Z, E_n = -13.6 \\frac{Z^2}{n^2}\\text{ eV}$)', 'Nuclear binding energy curve, radioactive decay law ($N(t) = N_0 e^{-\\lambda t}$), and half-life ($T_{1/2} = \\frac{\\ln 2}{\\lambda}$)'],
              learningObjectives: ['Calculate fringe shifts in YDSE due to insertion of dielectric slabs', 'Compute Q-value and threshold energy in nuclear transmutation reactions'],
              coreFormulas: ['\\Delta y = \\frac{(\\mu - 1)t D}{d}', 'K_{\\text{max}} = eV_0 = h\\nu - \\phi_0', 'E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}', 'N = N_0 e^{-\\lambda t}']
            }
          ]
        },
        {
          id: 'jee-chemistry',
          name: 'Chemistry for JEE',
          category: 'Chemistry',
          curricula: ['JEE Main & Advanced Chemistry Syllabus', 'Physical Chemistry (O.P. Tandon / P. Bahadur)', 'Organic Chemistry (Morrison & Boyd / M.S. Chouhan)', 'Inorganic Chemistry (J.D. Lee)'],
          chapters: [
            {
              id: 'ch-jee-c-1',
              name: 'Physical Chemistry: Thermodynamics, Thermochemistry & Spontaneity',
              textbookRef: 'Physical Chemistry for JEE Advanced',
              syllabusTopics: ['First Law of Thermodynamics for reversible vs irreversible expansions ($w_{\\text{rev}} = -nRT\\ln(V_2/V_1)$ vs $w_{\\text{irr}} = -P_{\\text{ext}}\\Delta V$)', 'Second Law of Thermodynamics: entropy change for phase changes, ideal gases, and chemical reactions', 'Gibbs Free Energy ($\\Delta G = \\Delta H - T\\Delta S$), criteria for spontaneity and chemical equilibrium ($\\Delta G^\\circ = -RT\\ln K$)', 'Thermochemistry: Hess’s Law, Born-Haber cycle, Kirchhoff’s equation for temperature dependence of reaction enthalpy'],
              learningObjectives: ['Compare work done in reversible vs irreversible isothermal expansions', 'Calculate standard Gibbs free energy and equilibrium constants at various temperatures'],
              coreFormulas: ['\\Delta G = \\Delta H - T\\Delta S', '\\Delta G^\\circ = -RT\\ln K', 'w_{\\text{rev}} = -nRT\\ln\\frac{V_2}{V_1}']
            },
            {
              id: 'ch-jee-c-2',
              name: 'Physical Chemistry: Chemical & Ionic Equilibrium',
              textbookRef: 'Physical Chemistry for JEE Advanced',
              syllabusTopics: ['Equilibrium constants: $K_p, K_c, K_x$ and relation with reaction quotient ($Q$)', 'Le Chatelier’s principle for gaseous and heterogeneous equilibria', 'Ionization of polyprotic acids ($H_3PO_4$), amphiprotic salts ($NaHCO_3$), and common ion effect', 'Buffer solutions: acidic and basic buffers, buffer capacity and range', 'Hydrolysis of salts: strong acid-weak base, weak acid-strong base, weak acid-weak base ($pH = 7 + \\frac{1}{2}pK_a - \\frac{1}{2}pK_b$)', 'Solubility product ($K_{sp}$) and selective precipitation in qualitative analysis'],
              learningObjectives: ['Derive exact pH formulas for hydrolyzed salts and polyprotic amphiprotic salts', 'Determine precipitation thresholds for selective cation separation'],
              coreFormulas: ['\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]}', '\\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)', 'K_{sp} = [A^{y+}]^x [B^{x-}]^y']
            },
            {
              id: 'ch-jee-c-3',
              name: 'Physical Chemistry: Electrochemistry & Chemical Kinetics',
              textbookRef: 'Physical Chemistry for JEE Advanced',
              syllabusTopics: ['Galvanic cells, standard electrode potentials ($E^\\circ$), and Nernst equation ($E = E^\\circ - \\frac{0.0591}{n}\\log Q$)', 'Concentration cells and calculation of equilibrium constants ($E^\\circ = \\frac{0.0591}{n}\\log K$)', 'Kohlrausch’s law of independent migration of ions and molar conductivity ($\\Lambda_m = \\frac{\\kappa \\times 1000}{M}$)', 'Faraday’s laws of electrolysis and electrochemical equivalent ($m = ZIt$)', 'Integrated rate equations for zero, first, and second order reactions; half-life expressions', 'Arrhenius equation: activation energy ($k = A e^{-E_a/RT}$) and collision theory'],
              learningObjectives: ['Calculate cell EMF under non-standard concentrations using Nernst equation', 'Determine order of reaction and rate constants from initial rate concentration tables'],
              coreFormulas: ['E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log_{10} Q', '\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)', 't_{1/2} = \\frac{0.693}{k} \\text{ (First Order)}']
            },
            {
              id: 'ch-jee-c-4',
              name: 'Organic Chemistry: GOC, Reaction Intermediates & Isomerism',
              textbookRef: 'Organic Chemistry for JEE Advanced',
              syllabusTopics: ['Electronic displacement effects: Inductive ($+I, -I$), Resonance ($+M, -M$), Hyperconjugation, Aromaticity (Hückel’s $4n+2$ rule, anti-aromatic $4n$)', 'Relative acidities of phenols, carboxylic acids, and alcohols; basicity of aliphatic and aromatic amines in gas vs aqueous phases', 'Carbocations, carbanions, carbon free radicals, carbenes, and nitrenes (structures, stability, and rearrangements via hydride/alkyl shifts)', 'Stereoisomerism: Enantiomers, diastereomers, meso compounds, optical activity, R/S Cahn-Ingold-Prelog configuration, conformers of cyclohexane (chair, boat, twist-boat)'],
              learningObjectives: ['Rank acidities and basicities of substituted organic compounds based on electronic effects', 'Assign absolute R/S configurations to multi-chiral center stereoisomers']
            },
            {
              id: 'ch-jee-c-5',
              name: 'Organic Chemistry: Reaction Mechanisms (SN1, SN2, E1, E2 & Electrophilic Additions)',
              textbookRef: 'Organic Chemistry for JEE Advanced',
              syllabusTopics: ['Nucleophilic substitution: $S_N1$ (two-step, carbocation intermediate, racemization) vs $S_N2$ (one-step, backside attack, Walden inversion)', 'Elimination reactions: $E1$ vs $E2$ vs $E1cB$; Saytzeff vs Hofmann elimination products', 'Electrophilic addition to alkenes and alkynes: halogenation (bromonium ion intermediate), hydrohalogenation (Markovnikov vs anti-Markovnikov peroxide effect), oxymercuration-demercuration, hydroboration-oxidation', 'Electrophilic aromatic substitution (EAS): nitration, sulphonation, halogenation, Friedel-Crafts alkylation and acylation of benzene; activating vs deactivating ortho/para/meta directors'],
              learningObjectives: ['Predict stereochemical outcome (retention, inversion, or racemization) in substitution reactions', 'Synthesize substituted aromatic rings taking ortho/para directing effects into account']
            },
            {
              id: 'ch-jee-c-6',
              name: 'Organic Chemistry: Carbonyls, Carboxylic Acids & Nitrogen Compounds',
              textbookRef: 'Organic Chemistry for JEE Advanced',
              syllabusTopics: ['Nucleophilic addition to carbonyls: cyanohydrin, acetal/ketal formation, reaction with Grignard reagents ($RMgX$)', 'Aldol condensation (self, crossed, intramolecular), Cannizzaro reaction, Haloform reaction (iodoform test for $CH_3C=O$ and $CH_3CH(OH)$ groups)', 'Named reactions: Clemmensen reduction, Wolff-Kishner reduction, Perkin reaction, Reformatsky reaction', 'Carboxylic acid derivatives: acyl chlorides, anhydrides, esters, amides (relative reactivity towards nucleophilic acyl substitution)', 'Amines: Gabriel phthalimide synthesis, Hoffmann bromamide degradation, Hinsberg test for distinguishing $1^\\circ, 2^\\circ, 3^\\circ$ amines, Diazonium salt coupling reactions'],
              learningObjectives: ['Design multi-step synthetic routes to complex ketones and aldehydes using aldol and Grignard reagents', 'Predict products of Hoffmann bromamide degradation and diazonium dye coupling']
            },
            {
              id: 'ch-jee-c-7',
              name: 'Inorganic Chemistry: Chemical Bonding, MOT & Coordination Compounds',
              textbookRef: 'Inorganic Chemistry for JEE Advanced',
              syllabusTopics: ['VSEPR theory and hybridization ($sp, sp^2, sp^3, sp^3d, sp^3d^2, sp^3d^3$); Bent’s rule and Drago’s rule', 'Molecular Orbital Theory for homonuclear and heteronuclear diatomics ($O_2, B_2, N_2, CO, NO^+$); bond order and magnetic behavior', 'Coordination compounds: Werner’s theory, IUPAC naming of coordination complexes, isomerism (structural, geometrical cis-trans, optical)', 'Crystal Field Theory (CFT): crystal field splitting in octahedral ($\\Delta_o$) and tetrahedral ($\\Delta_t$) complexes, high-spin vs low-spin, pairing energy ($P$), CFSE calculations, Jahn-Teller distortion', 'Spectrochemical series and magnetic moments (spin-only formula: $\\mu = \\sqrt{n(n+2)}\\text{ BM}$)'],
              learningObjectives: ['Calculate Crystal Field Stabilization Energy (CFSE) and predict magnetic moments of transition metal complexes', 'Determine optical isomerism in bidentate coordination complexes (e.g. $[Co(en)_3]^{3+}$)'],
              coreFormulas: ['\\text{CFSE}_{\\text{oct}} = (-0.4 n_{t_{2g}} + 0.6 n_{e_g})\\Delta_o', '\\Delta_t = \\frac{4}{9}\\Delta_o', '\\mu = \\sqrt{n(n+2)} \\text{ BM}']
            },
            {
              id: 'ch-jee-c-8',
              name: 'Inorganic Chemistry: p-Block, d & f-Block Elements & Salt Analysis',
              textbookRef: 'Inorganic Chemistry for JEE Advanced',
              syllabusTopics: ['p-Block elements: anomalies of boron (diborane structure, 3c-2e banana bonds), carbon allotropes (diamond, graphite, fullerenes), nitrogen hydrides, oxides, oxoacids of phosphorus ($H_3PO_2, H_3PO_3, H_3PO_4$), oxoacids of sulfur and halogens, interhalogen compounds, noble gas compounds ($XeF_2, XeF_4, XeF_6, XeO_3$)', 'd-Block elements: variable oxidation states, catalytic properties, interstitial compounds, preparation and properties of $K_2Cr_2O_7$ and $KMnO_4$', 'Lanthanoid contraction and actinoid chemistry', 'Qualitative inorganic analysis: systematic identification of cations (Group 0 to VI) and anions ($CO_3^{2-}, SO_4^{2-}, NO_3^-, Cl^-, Br^-, I^-$)'],
              learningObjectives: ['Describe preparation and redox titration mechanisms of $KMnO_4$ and $K_2Cr_2O_7$', 'Perform step-by-step cation group reagent separation in qualitative salt analysis']
            }
          ]
        },
        {
          id: 'jee-math',
          name: 'Mathematics for JEE',
          category: 'Mathematics',
          curricula: ['JEE Main & Advanced Mathematics Syllabus', 'Cengage Mathematics Series (G. Tewani)', 'Problems in Calculus of One Variable (I.A. Maron)'],
          chapters: [
            {
              id: 'ch-jee-m-1',
              name: 'Functions, Limits, Continuity & Differentiability',
              textbookRef: 'JEE Calculus Mastery',
              syllabusTopics: ['Classification of functions: injective, surjective, bijective, composite ($f(g(x))$), and inverse functions ($f^{-1}(x)$)', 'Limits: evaluation of indeterminate forms ($0/0, \\infty/\\infty, 0 \\times \\infty, 1^\\infty$) using L’Hôpital’s rule and Taylor series expansions', 'Continuity: removable, jump, and essential discontinuities; Intermediate Value Theorem', 'Differentiability: left-hand and right-hand derivatives, differentiability implies continuity theorem'],
              learningObjectives: ['Evaluate advanced indeterminate limits using standard Taylor series expansions', 'Test continuity and differentiability of piecewise functions containing greatest integer functions'],
              coreFormulas: ['\\lim_{x \\to a} [f(x)]^{g(x)} = e^{\\lim_{x \\to a} g(x)[f(x) - 1]} \\text{ for } 1^\\infty']
            },
            {
              id: 'ch-jee-m-2',
              name: 'Application of Derivatives (Tangents, Monotonicity, Extrema)',
              textbookRef: 'JEE Calculus Mastery',
              syllabusTopics: ['Geometrical meaning of derivative; equation of tangent and normal to curves', 'Rolle’s Theorem and Lagrange’s Mean Value Theorem (LMVT)', 'Monotonicity: increasing and decreasing functions, test using $f\'(x)$', 'Maxima and Minima: First and Second derivative tests, global extrema on closed intervals, applied optimization problems'],
              learningObjectives: ['Apply LMVT to prove real polynomial root existence within specified intervals', 'Solve geometric optimization problems maximizing volume or minimizing cost'],
              coreFormulas: ['f\'(c) = \\frac{f(b) - f(a)}{b - a} \\text{ (LMVT)}', 'f\'(x_0) = 0 \\text{ and } f\'\'(x_0) < 0 \\implies \\text{Local Maximum}']
            },
            {
              id: 'ch-jee-m-3',
              name: 'Definite Integrals, Properties & Area Under Curves',
              textbookRef: 'JEE Calculus Mastery',
              syllabusTopics: ['Definite integral as limit of a Riemann sum: $\\lim_{n \\to \\infty} \\frac{1}{n} \\sum f(r/n) = \\int_0^1 f(x)dx$', 'Fundamental Theorem of Calculus and Leibniz rule for differentiation under integral sign', 'King’s property: $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$ and Queen’s property for symmetric intervals', 'Area bounded between intersecting curves using vertical and horizontal strip integration'],
              learningObjectives: ['Evaluate definite integrals using King’s property and reduction formulas', 'Differentiate definite integrals with variable limits using Leibniz rule'],
              coreFormulas: [
                '\\frac{d}{dx}\\int_{u(x)}^{v(x)} f(t)dt = f(v(x))v\'(x) - f(u(x))u\'(x) \\text{ (Leibniz Rule)}',
                '\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx'
              ]
            },
            {
              id: 'ch-jee-m-4',
              name: 'Differential Equations',
              textbookRef: 'JEE Calculus Mastery',
              syllabusTopics: ['Formation of differential equations representing families of curves', 'Variable separable method and reducible to variable separable ($dy/dx = f(ax+by+c)$)', 'Homogeneous differential equations ($dy/dx = f(y/x)$ with $y = vx$)', 'First order Linear Differential Equations: $dy/dx + Py = Q$ with integrating factor $IF = e^{\\int P dx}$', 'Bernoulli’s differential equation reducible to linear form'],
              learningObjectives: ['Solve first order linear differential equations with integrating factor', 'Formulate physical rate problems (decay, cooling, growth) as differential equations'],
              coreFormulas: ['IF = e^{\\int P dx}', 'y \\cdot (IF) = \\int Q \\cdot (IF) dx + C']
            },
            {
              id: 'ch-jee-m-5',
              name: 'Coordinate Geometry: Straight Lines, Circles & Conics',
              textbookRef: 'JEE Coordinate Geometry Mastery',
              syllabusTopics: ['Pair of straight lines through origin ($ax^2 + 2hxy + by^2 = 0$), angle between lines ($\\tan\\theta = \\frac{2\\sqrt{h^2 - ab}}{a+b}$)', 'Circles: equation of tangent ($T = 0$), chord of contact, director circle, common tangents to two circles', 'Parabola ($y^2 = 4ax$): parametric coordinates ($at^2, 2at$), focal chord properties, normal equation in slope and parameter form', 'Ellipse ($\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$) and Hyperbola ($\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$): director circles, conjugate diameters, asymptotes, and rectangular hyperbola ($xy = c^2$)'],
              learningObjectives: ['Determine conditions of tangency ($c = a/m$ for parabola, $c^2 = a^2 m^2 + b^2$ for ellipse)', 'Find equations of common tangents to intersecting circles and parabolas'],
              coreFormulas: ['y = mx + \\frac{a}{m} \\text{ (Parabola Tangent)}', 'y = mx \\pm \\sqrt{a^2 m^2 + b^2} \\text{ (Ellipse Tangent)}', 'y = mx \\pm \\sqrt{a^2 m^2 - b^2} \\text{ (Hyperbola Tangent)}']
            },
            {
              id: 'ch-jee-m-6',
              name: 'Vectors, 3D Geometry & Spatial Planes',
              textbookRef: 'JEE Vectors & 3D Geometry',
              syllabusTopics: ['Scalar Triple Product $[\\vec{a}\\,\\vec{b}\\,\\vec{c}]$ and coplanarity condition', 'Vector Triple Product: $\\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (\\vec{a}\\cdot\\vec{c})\\vec{b} - (\\vec{a}\\cdot\\vec{b})\\vec{c}$', 'Straight lines in 3D: shortest distance between skew lines ($d = \\frac{|(\\vec{a}_2 - \\vec{a}_1)\\cdot(\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}$)', 'Planes in 3D: intercept form, normal form, line of intersection of two planes, angle between line and plane'],
              learningObjectives: ['Compute shortest distance between skew lines using vector cross products', 'Solve intersection coordinates between spatial lines and planes in 3D space'],
              coreFormulas: [
                '\\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (\\vec{a}\\cdot\\vec{c})\\vec{b} - (\\vec{a}\\cdot\\vec{b})\\vec{c}',
                'd = \\frac{|(\\vec{a}_2 - \\vec{a}_1)\\cdot(\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}'
              ]
            },
            {
              id: 'ch-jee-m-7',
              name: 'Complex Numbers, Quadratic Equations & Theory of Equations',
              textbookRef: 'JEE Algebra Mastery',
              syllabusTopics: ['Geometric interpretation of complex numbers: modulus-argument, rotation theorem ($z_2 - z_1 = |z_2 - z_1|e^{i\\theta}$)', 'Cube roots of unity ($1, \\omega, \\omega^2$ with $1+\\omega+\\omega^2 = 0$) and De Moivre’s Theorem ($(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$)', 'Loci in complex plane: circles ($|\\frac{z-z_1}{z-z_2}| = k$), perpendicular bisectors', 'Quadratic equations: location of roots with respect to real constants ($k, k_1, k_2$)', 'Descartes’ Rule of Signs and symmetric functions of roots for cubic and quartic polynomials'],
              learningObjectives: ['Apply cube roots of unity and De Moivre’s theorem to factorize complex polynomials', 'Determine parameter ranges ensuring quadratic roots lie within specified intervals'],
              coreFormulas: ['1 + \\omega + \\omega^2 = 0, \\quad \\omega^3 = 1', '(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta']
            },
            {
              id: 'ch-jee-m-8',
              name: 'Permutations, Combinations & Probability Distributions',
              textbookRef: 'JEE Algebra Mastery',
              syllabusTopics: ['Combinations with repetition (distributing $n$ identical objects among $r$ distinct persons: $^{n+r-1}C_{r-1}$)', 'Derangements formula: $D_n = n!\\left(1 - \\frac{1}{1!} + \\frac{1}{2!} - \\dots + \\frac{(-1)^n}{n!}\\right)$', 'Bayes’ Theorem for posterior probability, Total Probability Theorem', 'Binomial probability distribution ($P(X = r) = \\ ^nC_r p^r q^{n-r}$), Mean ($np$) and Variance ($npq$)'],
              learningObjectives: ['Solve identical object distribution problems using stars and bars combinatorial technique', 'Compute posterior probabilities in multi-stage diagnostic and production tests using Bayes’ Theorem'],
              coreFormulas: ['N = \\binom{n+r-1}{r-1}', 'D_n = n!\\sum_{k=0}^n \\frac{(-1)^k}{k!}', 'P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\sum P(E_j)P(A|E_j)}']
            }
          ]
        }
      ]
    }
  ]
};

export const boardNEET: SyllabusBoardInfo = {
  id: 'NEET',
  name: 'NEET-UG (National Eligibility cum Entrance Test — Medical)',
  shortName: 'NEET-UG (Medical)',
  jurisdiction: 'National Medical Commission (NMC / NTA India)',
  academicYears: ['2025–2026', '2026–2027'],
  classes: [
    {
      id: 'neet-target',
      name: 'NEET-UG Target (Medical Entrance)',
      gradeEquivalent: 'Competitive Exams (JEE / NEET / SAT / AP / GRE)',
      subjects: [
        {
          id: 'neet-biology',
          name: 'Biology (Botany & Zoology)',
          category: 'Biology',
          curricula: ['NMC NEET-UG Biology Complete Syllabus', 'NCERT Biology Classes 11 & 12 (100% Core Focus)', 'Trueman’s Elementary Biology'],
          chapters: [
            {
              id: 'ch-neet-b-1',
              name: 'Human Physiology: Digestion, Circulation, Excretion & Neural Coordination',
              textbookRef: 'NEET Biology — Human Physiology High-Yield',
              syllabusTopics: ['Cardiac cycle, stroke volume, ECG waves (P, QRS, T), double circulation, cardiac output regulation', 'Nephron structure, urine formation (glomerular filtration, reabsorption, secretion), counter-current multiplier, RAAS system and ADH', 'Nerve impulse generation (resting potential $-70\\text{ mV}$, depolarization $Na^+$ influx, action potential), synaptic transmission, brain anatomy', 'Sliding filament theory of muscle contraction, sarcomere anatomy, human skeletal bones (axial 80, appendicular 126)', 'Endocrine hormones: pituitary, thyroid, adrenal, pancreas; feedback loops and hormone mechanism of action'],
              learningObjectives: ['Correlate ECG waveforms with specific mechanical events of the cardiac cycle', 'Explain the counter-current multiplier in Henle’s loop and hormonal feedback via RAAS']
            },
            {
              id: 'ch-neet-b-2',
              name: 'Genetics, Molecular Biology & Human Genome',
              textbookRef: 'NEET Biology — Genetics & Molecular Biology',
              syllabusTopics: ['Mendelian genetics, dihybrid crosses (9:3:3:1), incomplete dominance, codominance (ABO blood), chromosomal linkage', 'DNA double helix, nucleosome packaging, Meselson & Stahl experiment, DNA polymerase III and replication fork', 'Transcription in eukaryotes (promoters, RNA polymerases, splicing, capping, tailing), Genetic Code properties', 'Translation machinery (tRNA aminoacylation, ribosome active sites), Lac Operon model (Jacob & Monod)', 'Human Genome Project (HGP) and DNA fingerprinting methodology (VNTRs, gel electrophoresis)'],
              learningObjectives: ['Analyze dihybrid and linked genetic crosses to determine recombination frequencies', 'Detail Lac Operon repression and derepression in the presence of lactose']
            },
            {
              id: 'ch-neet-b-3',
              name: 'Reproduction & Reproductive Health in Plants and Humans',
              textbookRef: 'NEET Biology — Reproduction & Development',
              syllabusTopics: ['Angiosperm embryology: microsporogenesis, megasporogenesis (7-celled, 8-nucleate), double fertilization, endosperm development', 'Human male and female reproductive systems; spermatogenesis vs oogenesis hormonal control', 'Menstrual cycle phases, LH surge, ovulation, blastocyst formation and implantation', 'Contraceptive methods (barriers, IUDs, oral pills), MTP regulations, STIs, Assisted Reproductive Technologies (IVF, ICSI, ZIFT, GIFT)'],
              learningObjectives: ['Trace the hormonal cascade triggering ovulation and luteal maintenance in the menstrual cycle', 'Describe the steps from pollination to double fertilization and zygotic embryogenesis in angiosperms']
            },
            {
              id: 'ch-neet-b-4',
              name: 'Plant Physiology: Photosynthesis, Respiration & Plant Hormones',
              textbookRef: 'NEET Biology — Plant Physiology',
              syllabusTopics: ['Light reaction (Z-scheme, PS I $P_{700}$, PS II $P_{680}$, photolysis of water), chemiosmotic ATP synthesis', 'Dark reaction: Calvin cycle ($C_3$ pathway) vs Hatch-Slack ($C_4$ pathway with Kranz anatomy); photorespiration ($C_2$ cycle)', 'Cellular respiration: Glycolysis (10 steps), Krebs cycle, Electron Transport System (Complexes I-V), respiratory quotient ($RQ$)', 'Plant growth regulators: Auxins (apical dominance), Gibberellins (bolting), Cytokinins, Ethylene, Abscisic acid'],
              learningObjectives: ['Contrast $C_3$ and $C_4$ photosynthesis and explain why $C_4$ plants have higher photosynthetic efficiency', 'Calculate net ATP production and proton gradient mechanics in mitochondrial oxidative phosphorylation']
            },
            {
              id: 'ch-neet-b-5',
              name: 'Cell Biology, Biomolecules & Cell Division',
              textbookRef: 'NEET Biology — Cell Structure & Biochemistry',
              syllabusTopics: ['Prokaryotic vs Eukaryotic cells, Fluid Mosaic Model of plasma membrane, endomembrane system, mitochondria, chloroplasts', 'Biomolecules: amino acids, protein structure levels, carbohydrates, lipids, nucleic acids', 'Enzymes: activation energy, Michaelis-Menten kinetics, competitive vs non-competitive inhibition', 'Cell cycle: Mitosis stages, Meiosis I (Prophase I substages: leptotene, zygotene, pachytene crossing over, diplotene, diakinesis) and Meiosis II'],
              learningObjectives: ['Describe chromosomal behaviors at every substage of meiotic prophase I', 'Explain competitive enzyme inhibition with substrate concentration curves']
            },
            {
              id: 'ch-neet-b-6',
              name: 'Biotechnology: Principles, Tools & Agricultural/Medical Applications',
              textbookRef: 'NEET Biology — Biotechnology',
              syllabusTopics: ['Restriction enzymes (palindromic recognition sequences, sticky ends), DNA ligase, cloning vectors (pBR322 selectable markers)', 'Polymerase Chain Reaction (PCR: denaturation, annealing, extension by *Taq* polymerase)', 'Bt cotton (*cry* genes against bollworms), RNA interference (RNAi) against nematode *Meloidogyne incognita*', 'Recombinant human insulin (Humulin), gene therapy for ADA deficiency, transgenic animals, ethical guidelines (GEAC)'],
              learningObjectives: ['Illustrate the 3 cycles of PCR and describe thermostable *Taq* polymerase function', 'Explain RNA interference mechanism silencing specific mRNA transcripts in pest resistance']
            },
            {
              id: 'ch-neet-b-7',
              name: 'Ecology, Environment, Biodiversity & Population Dynamics',
              textbookRef: 'NEET Biology — Ecology & Environment',
              syllabusTopics: ['Organism adaptations (xerophytes, Allen’s rule, altitude sickness), population growth models (exponential vs logistic)', 'Species interactions: mutualism, competition (Gause’s exclusion principle), predation, parasitism, commensalism', 'Ecosystem: productivity ($NPP = GPP - R$), decomposition, energy flow 10% law, ecological pyramids', 'Biodiversity: latitudinal gradients, Humboldt’s species-area relationship, "Evil Quartet" causes of extinction, in-situ vs ex-situ conservation'],
              learningObjectives: ['Apply logistic growth equations and calculate carrying capacity limits', 'Evaluate in-situ vs ex-situ conservation measures across Indian national parks and biosphere reserves']
            }
          ]
        },
        {
          id: 'neet-physics',
          name: 'Physics for NEET',
          category: 'Physics',
          curricula: ['NEET Physics High-Yield Question Bank', 'NCERT Physics for Medical Aspirants'],
          chapters: [
            {
              id: 'ch-neet-p-1',
              name: 'Mechanics & Gravitation for NEET',
              textbookRef: 'NEET Physics — High-Yield Mechanics',
              syllabusTopics: ['1D/2D Kinematics and projectile motion formulas', 'Newton’s Laws of Motion, friction on inclines, and banking of tracks', 'Work-Energy Theorem, kinetic and potential energy conservation, power ($P = \\vec{F} \\cdot \\vec{v}$)', 'Kepler’s laws, gravitational potential, orbital and escape velocity ($v_e = \\sqrt{2gR}$)'],
              learningObjectives: ['Solve standard numerical problems in under 60 seconds with rapid formula shortcuts'],
              coreFormulas: ['R = \\frac{u^2 \\sin 2\\theta}{g}', 'W = \\Delta K', 'v_e = \\sqrt{2gR}']
            },
            {
              id: 'ch-neet-p-2',
              name: 'Thermal Physics, Thermodynamics & Waves',
              textbookRef: 'NEET Physics — Thermal & Wave Physics',
              syllabusTopics: ['Calorimetry ($Q = mc\\Delta T$), latent heat, and thermal conduction ($dQ/dt = kA\\Delta T/L$)', 'First Law of Thermodynamics ($\\Delta Q = \\Delta U + W$), isothermal and adiabatic processes ($PV^\\gamma = c$)', 'Carnot engine efficiency ($\\eta = 1 - T_2/T_1$)', 'SHM equations, simple pendulum ($T = 2\\pi\\sqrt{L/g}$), sound waves and organ pipe frequencies'],
              learningObjectives: ['Calculate Carnot cycle efficiencies and work outputs in thermodynamic gas cycles'],
              coreFormulas: ['\\Delta Q = \\Delta U + W', '\\eta = 1 - \\frac{T_2}{T_1}', 'T = 2\\pi\\sqrt{\\frac{L}{g}}']
            },
            {
              id: 'ch-neet-p-3',
              name: 'Electrostatics, Current Electricity & Magnetism',
              textbookRef: 'NEET Physics — Electromagnetism',
              syllabusTopics: ['Coulomb’s law, electric field, potential due to point charges and dipoles', 'Parallel plate capacitors with dielectrics ($C = \\frac{\\epsilon_0 A}{d - t + t/K}$), series/parallel combinations', 'Ohm’s law, resistivity, temperature dependence, Kirchhoff’s laws, Wheatstone bridge, potentiometer', 'Magnetic field around straight wires, loops, and solenoids; magnetic force on moving charge ($F = qvB\\sin\\theta$)'],
              learningObjectives: ['Solve equivalent resistance and capacitor network circuits rapidly'],
              coreFormulas: ['C = \\frac{\\epsilon_0 A}{d}', 'I = \\frac{V}{R}', 'F = qvB\\sin\\theta']
            },
            {
              id: 'ch-neet-p-4',
              name: 'Optics & Modern Physics for NEET',
              textbookRef: 'NEET Physics — Optics & Modern Physics',
              syllabusTopics: ['Ray optics: Snell’s law, total internal reflection, lens maker’s formula, compound microscope and telescope magnification', 'Wave optics: Young’s double slit experiment fringe width ($\\beta = \\frac{\\lambda D}{d}$)', 'Photoelectric effect ($h\\nu = \\phi_0 + eV_0$), de Broglie wavelength ($\\lambda = \\frac{h}{p}$)', 'Bohr model ($E_n = -13.6/n^2\\text{ eV}$), nuclear radius ($R = R_0 A^{1/3}$), radioactive half-life ($N = N_0(1/2)^{t/T_{1/2}}$), semiconductor diodes'],
              learningObjectives: ['Calculate optical magnifications and solve Bohr orbital transition spectral problems'],
              coreFormulas: ['\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)', '\\beta = \\frac{\\lambda D}{d}', 'eV_0 = h\\nu - \\phi_0']
            }
          ]
        },
        {
          id: 'neet-chemistry',
          name: 'Chemistry for NEET',
          category: 'Chemistry',
          curricula: ['NEET Chemistry Complete High-Yield Program', 'NCERT Chemistry Textbooks (Core)'],
          chapters: [
            {
              id: 'ch-neet-c-1',
              name: 'Physical Chemistry High-Yield Formulas & Numericals',
              textbookRef: 'NEET Physical Chemistry Guide',
              syllabusTopics: ['Mole concept, molarity, molality, stoichiometry, limiting reagent', 'Chemical equilibrium ($K_p, K_c$) and Le Chatelier’s principle', 'Ionic equilibrium: pH calculations, buffer solutions (Henderson equation), solubility product ($K_{sp}$)', 'Electrochemistry: Nernst equation ($E = E^\\circ - \\frac{0.0591}{n}\\log Q$), Faraday’s laws', 'Chemical kinetics: zero and first order rate equations, half-life, Arrhenius equation'],
              learningObjectives: ['Solve stoichiometric and solution equilibrium questions under strict 45-second exam timing'],
              coreFormulas: ['\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Salt}]}{[\\text{Acid}]}', 'E = E^\\circ - \\frac{0.0591}{n}\\log Q', 't_{1/2} = \\frac{0.693}{k}']
            },
            {
              id: 'ch-neet-c-2',
              name: 'Inorganic Chemistry: Periodic Trends, Bonding & Coordination Complexes',
              textbookRef: 'NEET Inorganic Chemistry NCERT Line-by-Line',
              syllabusTopics: ['Periodic table trends: atomic radii, ionization enthalpy, electron gain enthalpy, electronegativity', 'Chemical bonding: Lewis structures, VSEPR shapes, hybridization, hydrogen bonding', 'Coordination compounds: Werner’s theory, IUPAC nomenclature, CFT splitting in octahedral and tetrahedral fields, magnetic moments', 'p-block and d-block elements: oxoacids of phosphorus and sulfur, $KMnO_4$ and $K_2Cr_2O_7$ reactions'],
              learningObjectives: ['Identify molecular geometry and magnetic behavior of coordination complexes directly from electron configurations']
            },
            {
              id: 'ch-neet-c-3',
              name: 'Organic Chemistry: Reaction Mechanisms & Functional Groups',
              textbookRef: 'NEET Organic Chemistry NCERT Line-by-Line',
              syllabusTopics: ['GOC: inductive, resonance, hyperconjugation effects; carbocation stability', 'Hydrocarbons: free radical halogenation, Markovnikov and anti-Markovnikov addition, ozonolysis', 'Alkyl and Aryl Halides: $S_N1$ and $S_N2$ mechanisms', 'Alcohols, Phenols and Ethers: preparation, acidity of phenols, Reimer-Tiemann reaction, Kolbe reaction', 'Aldehydes, Ketones and Carboxylic Acids: nucleophilic addition, Aldol condensation, Cannizzaro reaction, Tollens’ and Fehling’s tests', 'Amines: basicity order, Hoffmann bromamide degradation, carbylamine test, diazonium salt reactions', 'Biomolecules: glucose structures, amino acids, peptide bonds, DNA vs RNA'],
              learningObjectives: ['Predict organic products and identify distinguishing tests for functional groups (iodoform, Tollens, Hinsberg)']
            }
          ]
        }
      ]
    }
  ]
};

export const boardUPSC: SyllabusBoardInfo = {
  id: 'UPSC',
  name: 'UPSC Civil Services Examination (IAS / IPS / IFS / Central Services)',
  shortName: 'UPSC Civil Services (CSE)',
  jurisdiction: 'Union Public Service Commission (Government of India)',
  academicYears: ['2025–2026', '2026–2027'],
  classes: [
    {
      id: 'upsc-prelims-mains',
      name: 'UPSC Civil Services (Prelims & Mains GS)',
      gradeEquivalent: 'Competitive Exams (JEE / NEET / SAT / AP / GRE)',
      subjects: [
        {
          id: 'upsc-gs-1',
          name: 'GS Paper I: Heritage, History, Geography & Society',
          category: 'UPSC General Studies',
          curricula: ['UPSC CSE Syllabus — General Studies Paper I (Mains & Prelims)', 'NCERTs Class 6-12 History & Geography', 'India’s Struggle for Independence (Bipan Chandra)'],
          chapters: [
            {
              id: 'ch-upsc-1-1',
              name: 'Modern Indian History & Indian National Movement (1757–1947)',
              textbookRef: 'A Brief History of Modern India (Spectrum) / Bipan Chandra',
              syllabusTopics: ['British conquest of India: Plassey, Buxar, subsidiary alliance, doctrine of lapse', 'Revolt of 1857: causes, administrative consequences, Crown rule proclamation 1858', 'Socio-religious reform movements: Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotirao Phule, Swami Vivekananda', 'Indian National Congress foundation, Moderate phase (1885-1905) vs Extremist phase (Swadeshi movement 1905)', 'Gandhian era: Non-Cooperation Movement (1920-22), Civil Disobedience Movement (1930), Quit India Movement (1942)', 'Revolutionary nationalist movements: Bhagat Singh, Chandrashekhar Azad, Subhash Chandra Bose and INA', 'Constitutional developments: Morley-Minto 1909, Montagu-Chelmsford 1919, Government of India Act 1935, Cabinet Mission and Partition of India (1947)'],
              learningObjectives: ['Critically evaluate British colonial economic policies and drain of wealth theory', 'Analyze the socio-political dynamics of the Indian independence struggle across phases']
            },
            {
              id: 'ch-upsc-1-2',
              name: 'Indian Art, Architecture, Sculpture & Cultural Heritage',
              textbookRef: 'An Introduction to Indian Art (NCERT Class 11) / Nitin Singhania',
              syllabusTopics: ['Indus Valley civilization art: town planning, bronze dancing girl, steatite bearded priest, terracotta figurines', 'Mauryan art and architecture: Ashokan pillars, rock-cut caves (Barabar), Stupas (Sanchi)', 'Post-Mauryan art: Gandhara, Mathura, and Amaravati schools of Buddhist sculpture', 'Temple architecture styles: Nagara (North), Dravida (South), and Vesara (Deccan) traditions with landmark examples (Khajuraho, Brihadisvara, Konark)', 'Indo-Islamic and Mughal architecture: arches, domes, minarets, pietradura (Humayun’s Tomb, Taj Mahal, Fatehpur Sikri)', 'Classical Indian dance forms (Bharatanatyam, Kathakali, Kathak, Odissi) and Hindustani vs Carnatic music systems', 'UNESCO World Heritage Sites in India, traditional handicrafts, and intangible cultural heritage'],
              learningObjectives: ['Distinguish architectural nuances between Nagara and Dravidian temple styles', 'Trace the historical evolution of Indian sculpture from Harappan to Chola bronze traditions']
            },
            {
              id: 'ch-upsc-1-3',
              name: 'Physical Geography of India and the World',
              textbookRef: 'Fundamentals of Physical Geography (NCERT Class 11) / G.C. Leong',
              syllabusTopics: ['Geomorphology: Earth’s interior structure, plate tectonics, continental drift theory, earthquakes, volcanoes, rock cycles, weathering and erosion', 'Climatology: Atmosphere structure, heat budget, planetary wind systems, jet streams, cyclones (tropical vs extra-tropical), Indian Monsoon mechanism (ITCZ, El Niño, La Niña, Indian Ocean Dipole)', 'Oceanography: Bottom topography of ocean basins, salinity distribution, ocean currents (warm and cold currents), tides and coral reefs (coral bleaching)', 'Indian physical geography: Himalayan mountain ranges, Indo-Gangetic plains, Peninsular plateau, drainage river systems (Himalayan rivers vs Peninsular rivers)'],
              learningObjectives: ['Explain the meteorological mechanisms driving the onset, break, and withdrawal of the Indian summer monsoon', 'Analyze tectonic plate boundaries responsible for global seismic and volcanic distribution']
            },
            {
              id: 'ch-upsc-1-4',
              name: 'Human & Economic Geography: Resources, Agriculture & Urbanization',
              textbookRef: 'India: People and Economy (NCERT Class 12)',
              syllabusTopics: ['Distribution of key natural resources across the world and India (iron ore, bauxite, coal, petroleum, lithium, rare earth minerals)', 'Factors responsible for the location of primary, secondary, and tertiary sector industries (iron and steel, cotton textiles, IT hardware and software)', 'Indian agriculture: cropping patterns, major food crops and cash crops, irrigation challenges, Green Revolution impacts and sustainable agriculture', 'Population and urbanization: demographic dividend, migration patterns, slums, smart cities, and sustainable urban transport solutions'],
              learningObjectives: ['Analyze locational factors governing heavy manufacturing vs footloose industries in India', 'Formulate policy interventions to address groundwater depletion and agrarian distress']
            },
            {
              id: 'ch-upsc-1-5',
              name: 'Indian Society, Diversity, Women Empowerment & Social Issues',
              textbookRef: 'Indian Society (NCERT Class 12) / Ram Ahuja',
              syllabusTopics: ['Salient features of Indian society: unity in diversity, pluralism, caste system dynamics and modern transformations', 'Role of women and women’s organizations: gender equality, unpaid care work, female labor force participation (FLFPR), crimes against women and legal protections (Pocso, Posh Act)', 'Poverty, hunger, and developmental issues: multidimensional poverty, inequality, social safety nets', 'Urbanization problems and remedies; Globalization effects on Indian culture, youth, elderly, and family structures', 'Secularism, communalism, regionalism, and linguistic pluralism in contemporary India'],
              learningObjectives: ['Critique the impact of globalization on traditional Indian social institutions', 'Analyze intersectional barriers hindering female workforce participation in India']
            }
          ]
        },
        {
          id: 'upsc-gs-2',
          name: 'GS Paper II: Governance, Constitution, Polity, Social Justice & IR',
          category: 'UPSC General Studies',
          curricula: ['UPSC CSE Syllabus — General Studies Paper II', 'Indian Polity (M. Laxmikanth)', 'Introduction to the Constitution of India (D.D. Basu)'],
          chapters: [
            {
              id: 'ch-upsc-2-1',
              name: 'Indian Constitution: Preamble, Fundamental Rights & Basic Structure',
              textbookRef: 'Indian Polity by M. Laxmikanth',
              syllabusTopics: ['Historical underpinnings, evolution, features, and making of the Indian Constitution', 'Preamble: sovereign, socialist, secular, democratic, republic, justice, liberty, equality, fraternity', 'Fundamental Rights (Articles 12 to 35): Right to Equality, Freedom of Speech, Right to Life and Personal Liberty (Article 21 expansion), Right to Constitutional Remedies (Writs)', 'Directive Principles of State Policy (Part IV) and Fundamental Duties (Article 51A - Swaran Singh Committee)', 'Doctrine of Basic Structure: Kesavananda Bharati case (1973), Minerva Mills, and judicial review scope'],
              learningObjectives: ['Examine the judicial expansion of Article 21 to include privacy, clean environment, and dignity', 'Differentiate enforceable Fundamental Rights from Directive Principles and evaluate their harmonious balance']
            },
            {
              id: 'ch-upsc-2-2',
              name: 'Union & State Executives, Parliament & Federalism',
              textbookRef: 'Indian Polity by M. Laxmikanth',
              syllabusTopics: ['Union Executive: President (election, powers, ordinance-making Article 123, pardoning power Article 72), Vice-President, Prime Minister and Council of Ministers (collective responsibility Article 75)', 'State Executive: Governor (constitutional position, discretionary powers, Article 356 controversies), Chief Minister', 'Parliament and State Legislatures: composition, parliamentary privileges, law-making procedure, parliamentary committees (Public Accounts Committee, Estimates Committee), anti-defection law (10th Schedule)', 'Federal structure: asymmetric federalism, Center-State relations (legislative, administrative, financial), Inter-State Council, Finance Commission (Article 280), GST Council'],
              learningObjectives: ['Evaluate the discretionary role of the Governor in hung assemblies and imposition of President’s rule', 'Critically analyze the effectiveness of Parliamentary Standing Committees in legislative scrutiny']
            },
            {
              id: 'ch-upsc-2-3',
              name: 'Judiciary, Judicial Review, Judicial Activism & PIL',
              textbookRef: 'Indian Polity by M. Laxmikanth',
              syllabusTopics: ['Structure and organization of the Supreme Court and High Courts; appointment of judges (Collegium system vs NJAC debate)', 'Jurisdiction of Supreme Court: original, appellate, advisory (Article 143), and writ jurisdiction (Article 32)', 'Judicial Review and Judicial Activism vs Judicial Overreach', 'Public Interest Litigation (PIL) evolution, benefits, and misuse', 'Alternative Dispute Resolution (ADR): Lok Adalats, Gram Nyayalayas, mediation, and judicial pendency reforms'],
              learningObjectives: ['Debate the merits and demerits of the judicial Collegium system versus proposed executive commission models', 'Analyze landmark PIL judgments transforming environmental protection and civil liberties']
            },
            {
              id: 'ch-upsc-2-4',
              name: 'Statutory, Regulatory & Constitutional Bodies',
              textbookRef: 'Indian Polity by M. Laxmikanth',
              syllabusTopics: ['Constitutional Bodies: Election Commission of India (Article 324, electoral reforms), Union Public Service Commission (UPSC), Comptroller and Auditor General of India (CAG Article 148 - guardian of public purse), National Commissions for SCs, STs, and BCs', 'Statutory Bodies: National Human Rights Commission (NHRC), National Commission for Women (NCW), Central Information Commission (CIC), Central Vigilance Commission (CVC), Competition Commission of India (CCI)', 'Quasi-judicial bodies: National Green Tribunal (NGT), Central Administrative Tribunal (CAT), Telecom Disputes Settlement and Appellate Tribunal (TDSAT)'],
              learningObjectives: ['Assess the institutional autonomy and accountability mechanisms of the Election Commission and CAG', 'Examine the quasi-judicial enforcement powers of the National Green Tribunal in environmental governance']
            },
            {
              id: 'ch-upsc-2-5',
              name: 'Governance, Social Justice, RTI & Civil Services in a Democracy',
              textbookRef: 'Governance in India (Laxmikanth) / 2nd ARC Reports',
              syllabusTopics: ['Government policies and interventions for development in various sectors and issues arising out of their design and implementation', 'Welfare schemes for vulnerable sections of population (MGNREGA, PM-KISAN, Ayushman Bharat, Poshan Abhiyaan)', 'Issues relating to development and management of Social Sector/Services: Health, Education, Human Resources', 'Important aspects of governance: transparency and accountability, e-governance (applications, models, successes, limitations), Citizen’s Charters, Right to Information (RTI Act 2005), Social Audit', 'Role of civil services in a democracy: bureaucratic neutrality, administrative reforms (Mission Karmayogi)'],
              learningObjectives: ['Propose governance reforms to enhance transparency and citizen feedback mechanisms in public delivery', 'Evaluate the impact of the RTI Act on curbing administrative corruption']
            },
            {
              id: 'ch-upsc-2-6',
              name: 'International Relations: India’s Foreign Policy, Neighbors & Global Groups',
              textbookRef: 'Challenge and Strategy: Rethinking India’s Foreign Policy (Rajiv Sikri)',
              syllabusTopics: ['India’s foreign policy foundations: Non-Alignment (NAM) to Strategic Autonomy and Multi-Alignment', 'India and its neighborhood: "Neighborhood First" policy, relations with Pakistan, China (border disputes, LAC, Belt and Road Initiative), Bangladesh, Nepal, Sri Lanka, Bhutan, Maldives', 'Bilateral groupings and agreements involving India: India-US Comprehensive Global Strategic Partnership, India-Russia traditional ties, India-EU trade negotiations', 'Regional and global groupings: QUAD, BRICS, SCO, ASEAN, G20, I2U2, BIMSTEC', 'Important international institutions: United Nations (UNSC reform demands), WTO, IMF, World Bank, International Court of Justice'],
              learningObjectives: ['Analyze India’s balancing act between the Western QUAD alliance and Eurasian groupings (BRICS, SCO)', 'Evaluate diplomatic strategies to counter China’s "String of Pearls" encirclement in the Indian Ocean']
            }
          ]
        },
        {
          id: 'upsc-gs-3',
          name: 'GS Paper III: Economy, Science & Tech, Environment & Security',
          category: 'UPSC General Studies',
          curricula: ['UPSC CSE Syllabus — General Studies Paper III', 'Indian Economy (Ramesh Singh / Sanjeev Sanyal)', 'Environment (Shankar IAS)', 'Challenges to Internal Security (Ashok Kumar)'],
          chapters: [
            {
              id: 'ch-upsc-3-1',
              name: 'Indian Economy: Planning, Mobilization of Resources, Growth & Employment',
              textbookRef: 'Indian Economy by Ramesh Singh / Economic Survey',
              syllabusTopics: ['Indian Economy and issues relating to planning, mobilization of resources, growth, development, and employment', 'Gross Domestic Product (GDP) calculations, sectoral composition (Agriculture, Industry, Services), inclusive growth', 'Government Budgeting: Revenue deficit, Fiscal deficit, Primary deficit, FRBM Act 2003 targets', 'Monetary Policy: Reserve Bank of India (RBI), Monetary Policy Committee (MPC), repo rate, reverse repo, inflation targeting (CPI 4% +/- 2%)', 'Banking sector reforms: Non-Performing Assets (NPAs), Insolvency and Bankruptcy Code (IBC 2016), Digital Rupee (CBDC)'],
              learningObjectives: ['Examine fiscal consolidation measures versus capital expenditure requirements in economic development', 'Analyze structural challenges behind jobless growth and formal sector job creation in India']
            },
            {
              id: 'ch-upsc-3-2',
              name: 'Indian Agriculture: Cropping Patterns, Irrigation, MSP & PDS',
              textbookRef: 'Economic Survey / Ashok Gulati Reports',
              syllabusTopics: ['Major crops and cropping patterns in various parts of the country; different types of irrigation systems and storage', 'Issues related to direct and indirect farm subsidies and Minimum Support Prices (MSP mechanism, Swaminathan Committee recommendations)', 'Public Distribution System (PDS): objectives, functioning, limitations, revamping, buffer stocks, and food security (National Food Security Act 2013)', 'Economics of animal-rearing; Food processing and related industries in India (scope, upstream and downstream requirements, supply chain management)', 'Land reforms in India: abolition of zamindari, tenancy reforms, land ceilings'],
              learningObjectives: ['Propose reforms to make MSP legally binding and financially sustainable without market distortions', 'Evaluate supply chain bottlenecks in Indian horticulture and cold-chain infrastructure']
            },
            {
              id: 'ch-upsc-3-3',
              name: 'Science and Technology: Indigenous Developments, Space, AI & Biotech',
              textbookRef: 'Science and Technology for Civil Services (Ravi P. Agrahari)',
              syllabusTopics: ['Achievements of Indians in science & technology; indigenization of technology and developing new technology', 'Space technology: ISRO landmark missions (Chandrayaan-3, Aditya-L1, Gaganyaan human spaceflight, NISAR), reusable launch vehicles', 'Information technology and computers: Artificial Intelligence (AI), Machine Learning, Quantum Computing, Supercomputing (National Supercomputing Mission), 5G/6G telecom networks, Semiconductor mission', 'Biotechnology: Genetic engineering, CRISPR-Cas9 gene editing, mRNA vaccines, stem cell therapy', 'Intellectual Property Rights (IPR): patents, trademarks, GI tags, compulsory licensing'],
              learningObjectives: ['Analyze national security and economic implications of India’s National Quantum Mission and AI adoption', 'Evaluate ISRO’s cost-effective space exploration model and commercial satellite launch industry']
            },
            {
              id: 'ch-upsc-3-4',
              name: 'Environment, Climate Change, Biodiversity & Disaster Management',
              textbookRef: 'Environment by Shankar IAS Academy / NDMA Guidelines',
              syllabusTopics: ['Conservation, environmental pollution and degradation, Environmental Impact Assessment (EIA)', 'Climate change diplomacy: UNFCCC, Paris Agreement (COP21), India’s Nationally Determined Contributions (Panchamrit targets: 500 GW non-fossil, Net Zero by 2070), International Solar Alliance (ISA), Mission LiFE', 'Biodiversity loss, Wildlife Protection Act 1972 amendments, Project Tiger (50 years), Project Elephant, Biosphere Reserves, Ramsar wetland sites', 'Disaster Management: Sendai Framework for Disaster Risk Reduction (2015-2030), National Disaster Management Authority (NDMA) guidelines, flood mitigation, urban heat islands, cyclone early warning systems (IMD)'],
              learningObjectives: ['Critique India’s pathway to Net Zero 2070 balancing industrialization with renewable expansion', 'Formulate community-based disaster risk reduction strategies for climate-vulnerable coastal regions']
            },
            {
              id: 'ch-upsc-3-5',
              name: 'Internal Security Challenges, Cyber Security & Border Management',
              textbookRef: 'Challenges to Internal Security of India by Ashok Kumar IPS',
              syllabusTopics: ['Linkages between development and spread of extremism: Left-Wing Extremism (Naxalism), root causes, security and development paradigm', 'Role of external state and non-state actors in creating challenges to internal security (cross-border terrorism, proxy warfare)', 'Challenges to internal security through communication networks: role of media and social networking sites, cyber security threats, dark web, crypto-financing of terror', 'Money laundering and its prevention: Prevention of Money Laundering Act (PMLA), Financial Action Task Force (FATF)', 'Security challenges in border areas: India-Pakistan and India-China borders, Northeast insurgency, coastal security architecture post-26/11, Central Armed Police Forces (CAPF) mandate'],
              learningObjectives: ['Analyze the role of critical information infrastructure protection (CERT-In, NCIIPC) against cyber warfare', 'Examine integrated border management systems (smart fencing, drones) along international frontiers']
            }
          ]
        },
        {
          id: 'upsc-gs-4',
          name: 'GS Paper IV: Ethics, Integrity & Aptitude',
          category: 'UPSC General Studies',
          curricula: ['UPSC CSE Syllabus — General Studies Paper IV (Ethics)', 'Ethics, Integrity and Aptitude (Subba Rao & P.N. Roy Chowdhury / Lexicon)'],
          chapters: [
            {
              id: 'ch-upsc-4-1',
              name: 'Ethics and Human Interface: Essence, Determinants & Consequences',
              textbookRef: 'Ethics, Integrity and Aptitude (Lexicon / Subba Rao)',
              syllabusTopics: ['Essence, determinants, and consequences of ethics in human actions; dimensions of ethics (deontological Kantian ethics, utilitarianism Bentham & Mill, virtue ethics Aristotle)', 'Ethics in private and public relationships', 'Human values: lessons from the lives and teachings of great leaders, reformers, and administrators (Mahatma Gandhi, Nelson Mandela, Dr. B.R. Ambedkar, Swami Vivekananda)', 'Role of family, society, and educational institutions in inculcating moral values'],
              learningObjectives: ['Differentiate deontological duty-based ethics from teleological utilitarian outcomes in governance', 'Apply Gandhian talisman and ethical principles to modern social welfare dilemmas']
            },
            {
              id: 'ch-upsc-4-2',
              name: 'Attitude, Emotional Intelligence & Foundational Values of Civil Services',
              textbookRef: 'Ethics, Integrity and Aptitude (Lexicon)',
              syllabusTopics: ['Attitude: content, structure, function; its influence and relation with thought and behavior; moral and political attitudes; social influence and persuasion techniques', 'Aptitude and foundational values for Civil Service: integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance, and compassion towards weaker sections (Nolan Committee Seven Principles of Public Life)', 'Emotional Intelligence (EI): concepts, utilities, and application in administration and conflict resolution (Daniel Goleman’s model: self-awareness, self-regulation, empathy, social skills)'],
              learningObjectives: ['Demonstrate how Emotional Intelligence defuses communal and agrarian mob unrest without force', 'Apply the Nolan Committee principles of public life to bureaucratic decisions']
            },
            {
              id: 'ch-upsc-4-3',
              name: 'Probity in Governance, Citizen’s Charters & Ethical Case Studies',
              textbookRef: 'Ethics, Integrity and Aptitude (Lexicon)',
              syllabusTopics: ['Concept of public service; philosophical basis of governance and probity; information sharing and transparency in government, Right to Information (RTI)', 'Codes of Ethics, Codes of Conduct, Citizen’s Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption', 'Ethical dilemmas in public administration: conflict of interest, whistleblowing, corporate governance', 'Case Studies on administrative dilemmas, corruption traps, emergency crisis response, and balancing political pressure with legal integrity'],
              learningObjectives: ['Structure rigorous, multi-stakeholder ethical case study answers evaluating all available courses of action', 'Resolve conflicts between personal moral conscience and official administrative duty']
            }
          ]
        },
        {
          id: 'upsc-csat',
          name: 'UPSC CSAT (Prelims Paper II)',
          category: 'UPSC General Studies',
          curricula: ['UPSC CSE Prelims Paper II (CSAT) Syllabus', 'CSAT Manual (Tata McGraw Hill)'],
          chapters: [
            {
              id: 'ch-upsc-csat-1',
              name: 'Reading Comprehension, Crux & Inference Identification',
              textbookRef: 'UPSC CSAT Comprehensive Manual — Topic 1',
              syllabusTopics: ['Extracting central theme, primary crux, and author’s core assumption from complex philosophical, economic, and environmental passages', 'Differentiating between valid logical inferences, logical corollaries, and unsubstantiated conclusions', 'Tackling critical reasoning questions under strict qualifying benchmark conditions (33% qualifying score)'],
              learningObjectives: ['Identify the exact central message and critical assumptions in dense scholarly passages in under 90 seconds']
            },
            {
              id: 'ch-upsc-csat-2',
              name: 'Logical Reasoning, Analytical Ability & General Mental Puzzles',
              textbookRef: 'UPSC CSAT Comprehensive Manual — Topic 2',
              syllabusTopics: ['Syllogisms and categorical deductive logic (Venn diagram technique)', 'Seating arrangements (linear, circular, facing center vs facing outward)', 'Blood relations, family trees, and coded genealogical relationships', 'Direction sense tests, clock angles, calendar problems, and cube cutting patterns'],
              learningObjectives: ['Solve intricate multi-variable seating and ranking puzzle arrangements systematically']
            },
            {
              id: 'ch-upsc-csat-3',
              name: 'Basic Numeracy, Permutations & Data Interpretation (Class X Level)',
              textbookRef: 'UPSC CSAT Comprehensive Manual — Topic 3',
              syllabusTopics: ['Number systems: divisibility rules, remainders, unit digits, LCM and HCF word problems', 'Percentages, Profit and Loss, Simple and Compound Interest, Ratio and Proportion, Mixtures and Alligation', 'Time, Speed, Distance (trains, boats and streams) and Time and Work (pipes and cisterns)', 'Combinatorics: basic permutations and combinations ($^nP_r, ^nC_r$) and probability', 'Data Interpretation: charts, graphs, tables, and data sufficiency questions'],
              learningObjectives: ['Master rapid arithmetic calculations and solve data interpretation tables with precision']
            }
          ]
        }
      ]
    }
  ]
};

export const boardMSBSHSE: SyllabusBoardInfo = {
  id: 'MSBSHSE',
  name: 'Maharashtra State Board of Secondary and Higher Secondary Education (Balbharati)',
  shortName: 'Maharashtra State Board',
  jurisdiction: 'Maharashtra (SSC / HSC Curriculum)',
  academicYears: ['2025–2026', '2026–2027'],
  classes: [
    {
      id: 'msbshse-class-10',
      name: 'Class 10 (SSC Board Maharashtra)',
      gradeEquivalent: 'Class 9-10 (Secondary)',
      subjects: [
        {
          id: 'msbshse-10-math-1',
          name: 'Mathematics Part 1 (Algebra)',
          category: 'Mathematics',
          curricula: ['Balbharati Mathematics Part 1 Class 10'],
          chapters: [
            {
              id: 'ch-mh-m1-1',
              name: 'Linear Equations in Two Variables',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 1',
              syllabusTopics: ['Methods of solving linear equations: elimination method, substitution method', 'Graphical method of solving simultaneous equations', 'Determinants and Cramer’s Rule ($D, D_x, D_y, x = D_x/D, y = D_y/D$)', 'Equations reducible to a pair of linear equations in two variables'],
              learningObjectives: ['Solve simultaneous linear equations using Cramer’s determinant rule', 'Formulate and solve real-world word problems using linear equations'],
              coreFormulas: ['D = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix}', 'x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}']
            },
            {
              id: 'ch-mh-m1-2',
              name: 'Quadratic Equations',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 2',
              syllabusTopics: ['Standard form of quadratic equation ($ax^2 + bx + c = 0$)', 'Solutions by factorisation method and formula method ($x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$)', 'Nature of roots using discriminant ($\\Delta = b^2 - 4ac$)', 'Relation between roots and coefficients ($\\alpha + \\beta = -b/a, \\alpha\\beta = c/a$)'],
              learningObjectives: ['Determine nature of roots using discriminant $\\Delta$', 'Construct quadratic equations given roots $\\alpha$ and $\\beta$'],
              coreFormulas: ['x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', '\\Delta = b^2 - 4ac']
            },
            {
              id: 'ch-mh-m1-3',
              name: 'Arithmetic Progression (A.P.)',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 3',
              syllabusTopics: ['Sequence and Arithmetic Progression; common difference ($d$)', '$n^{\\text{th}}$ term of an A.P. ($t_n = a + (n-1)d$)', 'Sum of the first $n$ terms of an A.P. ($S_n = \\frac{n}{2}[2a + (n-1)d]$)', 'Real-life applications of Arithmetic Progression in saving and installment plans'],
              learningObjectives: ['Find specific terms and cumulative sums in Arithmetic Progressions'],
              coreFormulas: ['t_n = a + (n-1)d', 'S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(t_1 + t_n)']
            },
            {
              id: 'ch-mh-m1-4',
              name: 'Financial Planning',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 4',
              syllabusTopics: ['Goods and Services Tax (GST): Tax invoice, CGST and SGST', 'Input Tax Credit (ITC) and GST payable calculation', 'Shares, Face Value (FV), Market Value (MV), Dividend, Brokerage and GST on brokerage'],
              learningObjectives: ['Calculate CGST and SGST on retail invoices and trading transactions', 'Evaluate dividend yields on investment portfolios'],
              coreFormulas: ['\\text{GST} = \\text{CGST} + \\text{SGST}', '\\text{GST Payable} = \\text{Output Tax} - \\text{ITC}']
            },
            {
              id: 'ch-mh-m1-5',
              name: 'Probability',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 5',
              syllabusTopics: ['Random experiment, outcomes, sample space ($S$) and number of sample points ($n(S)$)', 'Events and types of events', 'Probability of an event: $P(A) = \\frac{n(A)}{n(S)}$ with $0 \\le P(A) \\le 1$'],
              learningObjectives: ['Write accurate sample spaces for tossing coins, rolling dice, and playing cards', 'Compute event probabilities in single and multi-stage experiments'],
              coreFormulas: ['P(A) = \\frac{n(A)}{n(S)}']
            },
            {
              id: 'ch-mh-m1-6',
              name: 'Statistics',
              textbookRef: 'Balbharati Algebra Class 10 — Chapter 6',
              syllabusTopics: ['Measures of central tendency: Mean (Direct method, Assumed mean method, Step-deviation method)', 'Median of grouped frequency distribution: $L + \\left(\\frac{N/2 - c.f.}{f}\\right) \\times h$', 'Mode of grouped frequency distribution: $L + \\left(\\frac{f_1 - f_0}{2f_1 - f_0 - f_2}\\right) \\times h$', 'Pictorial representation of statistical data: Histograms and Pie charts'],
              learningObjectives: ['Calculate mean, median, and mode for continuous grouped data sets', 'Construct accurate pie charts using central angle formula $\\theta = \\frac{\\text{Component Value}}{\\text{Total Value}} \\times 360^\\circ$'],
              coreFormulas: [
                '\\text{Median} = L + \\left(\\frac{\\frac{N}{2} - c.f.}{f}\\right)h',
                '\\text{Mode} = L + \\left(\\frac{f_1 - f_0}{2f_1 - f_0 - f_2}\\right)h'
              ]
            }
          ]
        },
        {
          id: 'msbshse-10-marathi',
          name: 'Marathi Kumarbharati (अक्षरभारती / कुमारभारती)',
          category: 'Marathi',
          curricula: ['Balbharati Marathi Kumarbharati Class 10 SSC'],
          chapters: [
            {
              id: 'ch-mh-mr-1',
              name: 'जय जय हे भारत देशा',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ १',
              syllabusTopics: ['मंगेश पाडगावकर यांचे राष्ट्रीय एकात्मतेचे स्फूर्तिगीत', 'विविधतेत एकता, संतांची भूमी आणि स्वतंत्र भारताचा उज्ज्वल भविष्यकाळ'],
              learningObjectives: ['मातृभूमीबद्दल निष्ठा, कृतज्ञता व राष्ट्रीय गौरव अंगी बाणवणे']
            },
            {
              id: 'ch-mh-mr-2',
              name: 'संतवाणी (अंकिला मी दास तुझा / योगी सर्वकाळ सुखदाता)',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ २',
              syllabusTopics: ['संत नामदेव महाराज — आई, पाडस, पिल्लू यांच्या दृष्टांतातून परमेश्वराकडे मांडलेली शरणागती', 'संत एकनाथ महाराज — पाण्याचे जलसुख आणि योग्याचे आंतरिक ज्ञानसुख यांतील श्रेष्ठता'],
              learningObjectives: ['मध्ययुगीन संतकविता, दृष्टांत अलंकार व भक्तीरसाचे आकलन']
            },
            {
              id: 'ch-mh-mr-3',
              name: 'शाल',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ३',
              syllabusTopics: ['रा. ग. जाधव यांचा संस्मरणपर पाठ', 'पु. ल. देशपांडे यांनी दिलेली शाल आणि सन्मानाचे खरे मूल्य', 'मासे पकडणाऱ्या गरीब महिलेच्या थंडीने कुडकुडणाऱ्या बाळाला शाल दान करणे', 'शालीनता आणि दानत'],
              learningObjectives: ['सन्मानापेक्षा संवेदनशीलता व गरिबांप्रती भूतदया अधिक मोलाची असते हे शिकणे']
            },
            {
              id: 'ch-mh-mr-4',
              name: 'उपास',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ४',
              syllabusTopics: ['पु. ल. देशपांडे यांची अजरामर विनोदी कथा', 'पंत यांचा चाळीत जाहीर केलेला वजन कमी करण्याचा निश्चय', 'आहारतज्ज्ञांचे सल्ले, दोरीच्या उड्या, साखर सोडणे आणि चाळकरी लोकांची चेष्टा-मस्करी'],
              learningObjectives: ['उत्कृष्ट मराठी विनोदी साहित्यातील भाषिक सौंदर्य व जीवनदृष्टी अनुभवणे']
            },
            {
              id: 'ch-mh-mr-5',
              name: 'दोन दिवस (कविता)',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ५',
              syllabusTopics: ['नारायण सुर्वे यांची वास्तववादी कामगार कविता', '"दोन दिवस वाट पाहण्यात गेले, दोन दुःखात गेले"', 'भाकरीचा चंद्र शोधण्यातच जिणे बरबाद झालेले श्रमिकांचे दारुण वास्तव'],
              learningObjectives: ['श्रमिकांचे दुःख आणि जगण्याच्या धगधगत्या वास्तवाचे भान ठेवणे']
            },
            {
              id: 'ch-mh-mr-6',
              name: 'ऊर्जाशक्तीचा जागर',
              textbookRef: 'कुमारभारती इयत्ता १० वी — पाठ ६',
              syllabusTopics: ['डॉ. रघुनाथ माशेलकर यांचा आत्मकथात्मक पाठ', 'मुंबईतील गिरगावच्या फुटपाथवरील वाचन, आईने घेतलेले अपार कष्ट आणि गरिबीवर मात करून जागतिक कीर्तीचे वैज्ञानिक होणे'],
              learningObjectives: ['प्रतिकूल परिस्थितीवर मात करण्याची जिद्द आणि आईच्या संस्कारांचे मोल जाणणे']
            }
          ]
        }
      ]
    }
  ]
};
