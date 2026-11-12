import { SyllabusClassInfo } from './types';

export const cbseClass12: SyllabusClassInfo = {
  id: 'cbse-class-12',
  name: 'Class 12 (Higher Secondary)',
  gradeEquivalent: 'Class 11-12 (Higher Secondary)',
  subjects: [
    {
      id: 'cbse-12-physics',
      name: 'Physics',
      category: 'Physics',
      curricula: ['NCERT Physics Class 12', 'NCERT Exemplar Class 12', 'CBSE Board Physics Curriculum'],
      chapters: [
        {
          id: 'ch-12-phy-1',
          name: 'Electric Charges and Fields',
          textbookRef: 'NCERT Physics Class 12 — Chapter 1',
          syllabusTopics: ['Coulomb’s Law in vector form', 'Electric field due to system of charges', 'Electric dipole and dipole moment; Torque on dipole in uniform field; Axial and Equatorial fields', 'Electric flux and Gauss’s Theorem with applications (infinite line charge, infinite plane sheet, thin spherical shell)'],
          learningObjectives: ['Calculate electrostatic field intensities using Gauss’s Law', 'Derive electric dipole axial and equatorial field vectors'],
          coreFormulas: ['F = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1q_2}{r^2}', '\\oint \\vec{E}\\cdot d\\vec{A} = \\frac{q_{\\text{in}}}{\\varepsilon_0}']
        },
        {
          id: 'ch-12-phy-2',
          name: 'Electrostatic Potential and Capacitance',
          textbookRef: 'NCERT Physics Class 12 — Chapter 2',
          syllabusTopics: ['Electrostatic potential and work done ($V = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r}$)', 'Equipotential surfaces and relation with electric field ($E = -dV/dr$)', 'Potential energy of a system of charges and of an electric dipole in an electrostatic field', 'Parallel plate capacitor with dielectric medium ($C = \\frac{\\varepsilon_0 A}{d}$, $C = \\frac{K\\varepsilon_0 A}{d}$)', 'Capacitors in series and parallel; Energy stored in a capacitor ($U = \\frac{1}{2}CV^2$)'],
          learningObjectives: ['Calculate potential energy and capacitance with partial and complete dielectric slabs', 'Analyze energy density in electrostatic fields'],
          coreFormulas: ['C = \\frac{\\varepsilon_0 A}{d}', 'U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}']
        },
        {
          id: 'ch-12-phy-3',
          name: 'Current Electricity',
          textbookRef: 'NCERT Physics Class 12 — Chapter 3',
          syllabusTopics: ['Ohm’s law, drift velocity, mobility ($v_d = -eE\\tau/m$), current density ($j = \\sigma E$)', 'Temperature dependence of resistance ($R_T = R_0(1 + \\alpha\\Delta T$))', 'EMF, internal resistance of a cell, cells in series and in parallel', 'Kirchhoff’s rules (Junction and Loop laws) and Wheatstone Bridge balance condition'],
          learningObjectives: ['Solve multi-loop electrical circuits using Kirchhoff’s laws', 'Derive microscopic Ohm’s law from electron drift kinetics'],
          coreFormulas: ['I = n e A v_d', 'v_d = \\frac{e E \\tau}{m}', '\\frac{R_1}{R_2} = \\frac{R_3}{R_4}']
        },
        {
          id: 'ch-12-phy-4',
          name: 'Moving Charges and Magnetism',
          textbookRef: 'NCERT Physics Class 12 — Chapter 4',
          syllabusTopics: ['Biot-Savart Law and its application to circular current loop', 'Ampere’s Circuital Law and its application to infinitely long straight wire and solenoid', 'Lorentz force on moving charge ($\\vec{F} = q(\\vec{v} \\times \\vec{B})$) and on current-carrying conductor ($\\vec{F} = I(\\vec{L} \\times \\vec{B})$)', 'Force between two parallel current-carrying conductors and definition of one Ampere', 'Moving Coil Galvanometer: current sensitivity, conversion to ammeter and voltmeter'],
          learningObjectives: ['Calculate magnetic field strengths using Biot-Savart and Ampere laws', 'Convert a galvanometer into an ammeter using shunt resistor and voltmeter using series resistor'],
          coreFormulas: ['dB = \\frac{\\mu_0}{4\\pi}\\frac{I dl \\sin\\theta}{r^2}', '\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{\\text{encl}}', '\\vec{F} = q(\\vec{v} \\times \\vec{B})']
        },
        {
          id: 'ch-12-phy-5',
          name: 'Magnetism and Matter',
          textbookRef: 'NCERT Physics Class 12 — Chapter 5',
          syllabusTopics: ['Current loop as a magnetic dipole and its magnetic dipole moment ($M = NIA$)', 'Magnetic field lines and Gauss’s law in magnetism ($\\oint \\vec{B}\\cdot d\\vec{A} = 0$)', 'Magnetic properties of materials: Diamagnetic, Paramagnetic, and Ferromagnetic substances', 'Curie’s Law and domain theory of ferromagnetism'],
          learningObjectives: ['Classify materials magnetically using magnetic susceptibility ($\\chi_m$)', 'Explain why magnetic monopoles do not exist according to Gauss’s Law for magnetism'],
          coreFormulas: ['\\oint \\vec{B}\\cdot d\\vec{A} = 0', '\\chi = \\frac{C}{T} \\text{ (Curie’s Law)}']
        },
        {
          id: 'ch-12-phy-6',
          name: 'Electromagnetic Induction',
          textbookRef: 'NCERT Physics Class 12 — Chapter 6',
          syllabusTopics: ['Magnetic flux ($\\Phi = \\vec{B}\\cdot\\vec{A}$) and Faraday’s experiments', 'Faraday’s Law of Electromagnetic Induction (induced EMF $\\mathcal{E} = -d\\Phi/dt$)', 'Lenz’s Law and conservation of energy', 'Motional EMF in a moving conducting rod ($\\mathcal{E} = Bvl$)', 'Self-induction ($L$) and Mutual induction ($M$); AC Generator working principle'],
          learningObjectives: ['Apply Faraday’s and Lenz’s laws to determine magnitude and polarity of induced EMF', 'Calculate self-inductance of solenoids and mutual inductance of coaxial coils'],
          coreFormulas: ['\\mathcal{E} = -\\frac{d\\Phi}{dt}', '\\mathcal{E} = Bvl', '\\Phi = LI \\implies \\mathcal{E} = -L\\frac{dI}{dt}']
        },
        {
          id: 'ch-12-phy-7',
          name: 'Alternating Current',
          textbookRef: 'NCERT Physics Class 12 — Chapter 7',
          syllabusTopics: ['Peak, RMS, and mean values of alternating current ($I_{\\text{rms}} = I_0 / \\sqrt{2}$)', 'AC voltage applied to resistor, inductor, and capacitor; Phasor diagrams', 'Series LCR circuit: Impedance ($Z = \\sqrt{R^2 + (X_L - X_C)^2}$), resonance frequency ($\\omega_0 = 1/\\sqrt{LC}$), Q-factor', 'Power in AC circuits: Power factor ($\\cos\\phi = R/Z$); Wattless current', 'Transformer: Step-up and step-down transformer principle, turns ratio, and energy losses'],
          learningObjectives: ['Solve series LCR circuit resonance and impedance numericals', 'Explain transformer efficiency and minimize eddy current core losses'],
          coreFormulas: ['I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}}', 'Z = \\sqrt{R^2 + (X_L - X_C)^2}', '\\omega_0 = \\frac{1}{\\sqrt{LC}}', '\\frac{V_s}{V_p} = \\frac{N_s}{N_p}']
        },
        {
          id: 'ch-12-phy-8',
          name: 'Electromagnetic Waves',
          textbookRef: 'NCERT Physics Class 12 — Chapter 8',
          syllabusTopics: ['Displacement current and Maxwell’s modification of Ampere’s Law', 'Electromagnetic wave characteristics: transverse nature, speed in vacuum ($c = 1/\\sqrt{\\mu_0 \\varepsilon_0}$)', 'Electromagnetic spectrum: Radio waves, Microwaves, Infrared, Visible, Ultraviolet, X-rays, Gamma rays', 'Production and detection of electromagnetic waves across the spectrum'],
          learningObjectives: ['Explain Maxwell’s displacement current concept', 'Rank electromagnetic spectrum regions by frequency, wavelength, and energetic applications'],
          coreFormulas: ['I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}', 'c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0}']
        },
        {
          id: 'ch-12-phy-9',
          name: 'Ray Optics and Optical Instruments',
          textbookRef: 'NCERT Physics Class 12 — Chapter 9',
          syllabusTopics: ['Refraction at spherical surfaces and Lens Maker’s Formula', 'Refraction through a prism: angle of deviation and refractive index formula', 'Total internal reflection, critical angle, and optical fibers', 'Microscopes: Simple and Compound microscope magnifying power derivation', 'Astronomical Telescope (refracting and reflecting Newtonian/Cassegrain) magnifying power'],
          learningObjectives: ['Derive Lens Maker’s formula and prism minimum deviation equation', 'Construct ray diagrams and compute angular magnification of compound microscopes and telescopes'],
          coreFormulas: [
            '\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
            'n = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin(A/2)}',
            'm_{\\text{microscope}} = -\\frac{L}{f_o}\\left(1 + \\frac{D}{f_e}\\right)'
          ]
        },
        {
          id: 'ch-12-phy-10',
          name: 'Wave Optics',
          textbookRef: 'NCERT Physics Class 12 — Chapter 10',
          syllabusTopics: ['Huygens’ Principle: wave fronts, secondary wavelets, proof of laws of reflection and refraction', 'Interference of light: Coherent sources, Young’s Double Slit Experiment (YDSE)', 'Fringe width expression derivation: $\\beta = \\lambda D / d$', 'Diffraction at a single slit: central maximum, secondary maxima, angular width ($\\theta = 2\\lambda / a$)'],
          learningObjectives: ['Prove Snell’s law using Huygens’ wave front construction', 'Calculate fringe width and intensity distribution in YDSE and single slit diffraction'],
          coreFormulas: ['\\beta = \\frac{\\lambda D}{d}', '\\text{Constructive: } \\Delta x = n\\lambda', '\\text{Destructive: } \\Delta x = (2n-1)\\frac{\\lambda}{2}']
        },
        {
          id: 'ch-12-phy-11',
          name: 'Dual Nature of Radiation and Matter',
          textbookRef: 'NCERT Physics Class 12 — Chapter 11',
          syllabusTopics: ['Photoelectric effect: Hertz, Hallwachs, and Lenard’s observations', 'Einstein’s photoelectric equation: $h\\nu = \\Phi_0 + K_{\\text{max}} = \\Phi_0 + eV_0$', 'Cut-off threshold frequency and stopping potential', 'Matter waves: de Broglie hypothesis, de Broglie wavelength of electron ($\\lambda = h/p = h/\\sqrt{2mqV}$)'],
          learningObjectives: ['Plot photoelectric current vs potential and stopping potential vs frequency graphs', 'Calculate de Broglie wavelengths of subatomic particles accelerated through potentials'],
          coreFormulas: ['K_{\\text{max}} = h\\nu - \\Phi_0 = e V_0', '\\lambda = \\frac{h}{p} = \\frac{1.227}{\\sqrt{V}}\\text{ nm}']
        },
        {
          id: 'ch-12-phy-12',
          name: 'Atoms',
          textbookRef: 'NCERT Physics Class 12 — Chapter 12',
          syllabusTopics: ['Alpha-particle scattering experiment and Rutherford’s nuclear atom model', 'Bohr’s model of hydrogen atom: postulates, radius of nth orbit ($r_n \\propto n^2$)', 'Energy levels of hydrogen atom ($E_n = -13.6/n^2\\text{ eV}$)', 'Hydrogen emission spectral lines: Lyman, Balmer, Paschen, Brackett, Pfund series and Rydberg formula'],
          learningObjectives: ['Derive orbital radii and quantized energy expressions for hydrogenic atoms', 'Calculate spectral line wavelengths across Balmer and Lyman series using Rydberg formula'],
          coreFormulas: ['E_n = -\\frac{13.6}{n^2}\\text{ eV}', '\\frac{1}{\\lambda} = R\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)']
        },
        {
          id: 'ch-12-phy-13',
          name: 'Nuclei',
          textbookRef: 'NCERT Physics Class 12 — Chapter 13',
          syllabusTopics: ['Composition and size of nucleus: nuclear radius $R = R_0 A^{1/3}$; Nuclear density independence of mass number', 'Mass-energy equivalence ($E = mc^2$) and mass defect ($\\Delta m$)', 'Binding energy per nucleon curve and nuclear stability analysis', 'Nuclear fission (uranium splitting) and Nuclear fusion (stellar hydrogen fusion in Sun)'],
          learningObjectives: ['Calculate mass defects and binding energies in nuclear reactions', 'Interpret the binding energy per nucleon curve to explain energy release in fission and fusion'],
          coreFormulas: ['R = R_0 A^{1/3}', 'E = \\Delta m \\cdot c^2']
        },
        {
          id: 'ch-12-phy-14',
          name: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
          textbookRef: 'NCERT Physics Class 12 — Chapter 14',
          syllabusTopics: ['Energy bands in conductors, semiconductors, and insulators', 'Intrinsic semiconductors (pure Si, Ge) and Extrinsic semiconductors (n-type doped with pentavalent, p-type doped with trivalent)', 'p-n junction formation: depletion region and barrier potential', 'Semiconductor diode under forward and reverse bias; I-V characteristics', 'Diode as a rectifier: Half-wave and Full-wave center-tapped bridge rectifiers'],
          learningObjectives: ['Explain hole-electron conduction mechanisms in extrinsic semiconductors', 'Diagram and explain half-wave and full-wave rectification circuits with smoothing filter capacitors']
        }
      ]
    },
    {
      id: 'cbse-12-chemistry',
      name: 'Chemistry',
      category: 'Chemistry',
      curricula: ['NCERT Chemistry Class 12', 'NCERT Exemplar Class 12', 'CBSE Board Chemistry Curriculum'],
      chapters: [
        {
          id: 'ch-12-chem-1',
          name: 'Solutions',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 1',
          syllabusTopics: ['Types of solutions, concentration expressions: Molarity, Molality, Mole fraction, ppm', 'Henry’s Law of gas solubility in liquids ($p = K_H x$)', 'Raoult’s Law for volatile liquids and Ideal vs Non-ideal solutions (positive/negative deviations, azeotropes)', 'Colligative properties: Relative lowering of vapor pressure, Elevation of boiling point ($\\Delta T_b = K_b m$), Depression of freezing point ($\\Delta T_f = K_f m$), Osmotic pressure ($\\Pi = CRT$)', 'Van ’t Hoff factor ($i$) and degree of association and dissociation'],
          learningObjectives: ['Calculate molecular weights using colligative property formulas', 'Determine Van ’t Hoff factors for dissociating electrolytes'],
          coreFormulas: ['p_A = p_A^0 x_A', '\\Delta T_b = i K_b m', '\\Delta T_f = i K_f m', '\\Pi = iCRT']
        },
        {
          id: 'ch-12-chem-2',
          name: 'Electrochemistry',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 2',
          syllabusTopics: ['Electrochemical cells (Galvanic/Daniell cell) and cell representation', 'Nernst Equation: $E_{\\text{cell}} = E_{\\text{cell}}^0 - \\frac{0.0591}{n}\\log Q$ at 298 K; Relation with $\\Delta G^0$ and equilibrium constant $K_c$', 'Conductance in electrolytic solutions: specific conductivity ($\\kappa$), molar conductivity ($\\Lambda_m = \\kappa \\times 1000 / M$)', 'Kohlrausch’s Law of independent migration of ions and degree of dissociation ($\\alpha = \\Lambda_m / \\Lambda_m^0$)', 'Faraday’s laws of electrolysis; Primary batteries (Dry cell), Secondary batteries (Lead storage battery), Fuel cells ($H_2-O_2$), Corrosion as electrochemical process'],
          learningObjectives: ['Apply Nernst equation to calculate EMF of non-standard galvanic cells', 'Calculate limiting molar conductivities using Kohlrausch’s Law'],
          coreFormulas: ['E_{\\text{cell}} = E_{\\text{cell}}^0 - \\frac{0.0591}{n}\\log \\frac{[\\text{Anode}]}{[\\text{Cathode}]}', '\\Delta G^0 = -nFE_{\\text{cell}}^0', '\\Lambda_m^0 = \\nu_+ \\lambda_+^0 + \\nu_- \\lambda_-^0']
        },
        {
          id: 'ch-12-chem-3',
          name: 'Chemical Kinetics',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 3',
          syllabusTopics: ['Rate of reaction (average and instantaneous), factors affecting reaction rate', 'Rate law expression, order of reaction (0th, 1st, 2nd) and molecularity', 'Integrated rate equations for Zero-order and First-order reactions; Half-life ($t_{1/2} = 0.693/k$ for 1st order)', 'Arrhenius equation: effect of temperature ($k = Ae^{-E_a/RT}$), activation energy ($E_a$)', 'Collision theory of chemical reactions and catalyst mechanism'],
          learningObjectives: ['Determine reaction orders and rate constants from initial rate datasets', 'Calculate activation energy using logarithmic Arrhenius plots'],
          coreFormulas: ['k = \\frac{2.303}{t}\\log\\frac{[A]_0}{[A]} \\text{ (1st Order)}', 't_{1/2} = \\frac{0.693}{k}', '\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)']
        },
        {
          id: 'ch-12-chem-4',
          name: 'The d- and f-Block Elements',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 4',
          syllabusTopics: ['Electronic configurations of transition elements (d-block, $3d^{1-10} 4s^{1-2}$)', 'General characteristics: metallic character, atomic/ionic radii, ionization enthalpies, variable oxidation states, magnetic moments (spin-only $\\mu = \\sqrt{n(n+2)}$ BM), colored ion formation, catalytic properties, interstitial compounds', 'Preparation and oxidizing properties of Potassium Dichromate ($K_2Cr_2O_7$) and Potassium Permanganate ($KMnO_4$)', 'Lanthanoids: electronic configuration, oxidation states (+3), Lanthanoid Contraction causes and consequences; Actinoids comparison'],
          learningObjectives: ['Explain Lanthanoid contraction consequences on post-lanthanoid transition radii', 'Balance redox reactions of $KMnO_4$ and $K_2Cr_2O_7$ in acidic and basic media'],
          coreFormulas: ['\\mu_{\\text{spin}} = \\sqrt{n(n+2)}\\text{ BM}']
        },
        {
          id: 'ch-12-chem-5',
          name: 'Coordination Compounds',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 5',
          syllabusTopics: ['Werner’s Coordination Theory: Primary (ionisable) and Secondary (non-ionisable) valencies', 'Coordination sphere, central atom, ligands (unidentate, didentate, polydentate, ambidentate: $NO_2^-/ONO^-$), coordination number', 'IUPAC nomenclature of coordination entities', 'Isomerism: Structural (ionisation, linkage, coordination, hydrate) and Stereoisomerism (geometrical cis/trans, optical)', 'Valence Bond Theory (VBT): hybridisation ($sp^3, dsp^2, sp^3d^2, d^2sp^3$), magnetic properties', 'Crystal Field Theory (CFT): crystal field splitting in octahedral ($\\Delta_o$) and tetrahedral ($\\Delta_t$) complexes, spectrochemical series, strong vs weak field ligands'],
          learningObjectives: ['Name complex coordination complexes using IUPAC rules', 'Predict hybridisation, magnetic moment, and color of coordination complexes using CFT'],
          coreFormulas: ['\\Delta_t = \\frac{4}{9}\\Delta_o']
        },
        {
          id: 'ch-12-chem-6',
          name: 'Haloalkanes and Haloarenes',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 6',
          syllabusTopics: ['Classification, IUPAC nomenclature, nature of C-X bond', 'Methods of preparation from alcohols, hydrocarbons (free radical halogenation, electrophilic addition)', 'Nucleophilic substitution mechanisms: $S_N1$ (two-step, carbocation, racemisation) vs $S_N2$ (one-step, backside attack, Walden inversion)', 'Elimination reactions: Saytzeff’s rule', 'Reactivity of haloarenes towards nucleophilic substitution (resonance stabilization, sp2 hybridisation of carbon) and electrophilic substitutions', 'Polyhalogen compounds: Chloroform ($CHCl_3$), Iodoform ($CHI_3$), Freons, DDT environmental hazards'],
          learningObjectives: ['Differentiate $S_N1$ and $S_N2$ mechanisms based on substrate, solvent, and stereochemistry', 'Predict major elimination and substitution products using Saytzeff’s rule']
        },
        {
          id: 'ch-12-chem-7',
          name: 'Alcohols, Phenols and Ethers',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 7',
          syllabusTopics: ['Classification of alcohols ($1^\\circ, 2^\\circ, 3^\\circ$) and IUPAC naming', 'Methods of preparation: hydration of alkenes, hydroboration-oxidation, reduction of carbonyls, Grignard reagents', 'Reactions of alcohols: dehydration to alkenes, oxidation (PCC, Jones reagent), Lucas test for alcohol distinction', 'Phenols preparation from cumene and chlorobenzene (Dow’s process); Acidity of phenols vs alcohols', 'Reactions of phenols: Kolbe’s reaction (salicylic acid), Reimer-Tiemann reaction (salicylaldehyde), oxidation to benzoquinone', 'Ethers: Williamson’s Ether Synthesis, cleavage of C-O bond by $HI$ (mechanism for asymmetric ethers)'],
          learningObjectives: ['Distinguish primary, secondary, and tertiary alcohols using Lucas reagent', 'Write mechanisms for Reimer-Tiemann and Williamson ether synthesis reactions']
        },
        {
          id: 'ch-12-chem-8',
          name: 'Aldehydes, Ketones and Carboxylic Acids',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 8',
          syllabusTopics: ['Nomenclature and structure of carbonyl group ($>C=O$)', 'Preparation of aldehydes: Rosenmund reduction, Stephen reaction, Etard reaction, Gatterman-Koch reaction; Preparation of ketones', 'Nucleophilic addition reactions: HCN, $NaHSO_3$, Grignard reagents, alcohols (acetals/ketals), ammonia derivatives', 'Reactivity order: Aldehydes > Ketones towards nucleophiles', 'Aldol condensation and Cross-aldol condensation; Cannizzaro reaction of aldehydes lacking $\\alpha$-hydrogens', 'Tests to distinguish aldehydes: Tollens’ silver mirror test, Fehling’s test; Iodoform test for methyl ketones', 'Carboxylic acids: acidity factors (electron withdrawing vs donating groups), Hell-Volhard-Zelinsky (HVZ) reaction, decarboxylation'],
          learningObjectives: ['Differentiate aldehydes from ketones using Tollens’ and Fehling’s chemical tests', 'Write step-by-step mechanism for Aldol condensation and Cannizzaro reactions']
        },
        {
          id: 'ch-12-chem-9',
          name: 'Amines',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 9',
          syllabusTopics: ['Classification of amines ($1^\\circ, 2^\\circ, 3^\\circ$), nomenclature and pyramidal structure', 'Preparation: reduction of nitro compounds, ammonolysis of alkyl halides (Hoffmann’s), reduction of nitriles, Gabriel Phthalimide synthesis (pure $1^\\circ$ aliphatic amines), Hoffmann Bromamide degradation', 'Physical properties and basic character of amines: comparison in gas phase vs aqueous solution ($2^\\circ > 1^\\circ > 3^\\circ$ in aqueous for methyl)', 'Chemical reactions: Carbylamine test for primary amines, reaction with nitrous acid ($HNO_2$), Hinsberg’s test to distinguish $1^\\circ, 2^\\circ, 3^\\circ$ amines', 'Diazonium salts: preparation by diazotization ($0-5^\\circ\\text{C}$), Sandmeyer reaction, Gattermann reaction, coupling reactions with phenols/anilines forming azo dyes'],
          learningObjectives: ['Distinguish primary, secondary, and tertiary amines using Hinsberg’s reagent', 'Synthesize aromatic derivatives via benzene diazonium chloride intermediates']
        },
        {
          id: 'ch-12-chem-10',
          name: 'Biomolecules',
          textbookRef: 'NCERT Chemistry Class 12 — Chapter 10',
          syllabusTopics: ['Carbohydrates: classification (monosaccharides, disaccharides, polysaccharides)', 'Structure of Glucose: open-chain vs cyclic $\\alpha$-D and $\\beta$-D pyranose Haworth projections; Fructose structure; Glycosidic linkage in Sucrose (non-reducing sugar, invert sugar), Maltose, Lactose, Starch, Cellulose', 'Proteins: Amino acids (essential vs non-essential), Zwitterion form, Peptide linkage', 'Protein structures: Primary, Secondary ($\\alpha$-helix, $\\beta$-pleated sheets), Tertiary, Quaternary; Denaturation of proteins', 'Nucleic acids: chemical composition (nitrogenous bases: purines A/G, pyrimidines C/T/U, pentose sugars, phosphate group), nucleosides vs nucleotides, DNA double helix (Watson-Crick model), RNA types, Genetic code', 'Vitamins: classification into water-soluble (B, C) and fat-soluble (A, D, E, K), deficiency diseases'],
          learningObjectives: ['Draw Haworth structures of $\\alpha$-D-glucopyranose and sucrose', 'Explain denaturation of proteins and Watson-Crick double helix DNA base pairing ($A=T, G\\equiv C$)']
        }
      ]
    },
    {
      id: 'cbse-12-math',
      name: 'Mathematics',
      category: 'Mathematics',
      curricula: ['NCERT Mathematics Class 12', 'NCERT Exemplar Class 12', 'CBSE Board Mathematics Curriculum'],
      chapters: [
        {
          id: 'ch-12-m-1',
          name: 'Relations and Functions',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 1',
          syllabusTopics: ['Types of relations: Reflexive, Symmetric, Transitive, Equivalence relations, Equivalence classes', 'Types of functions: One-to-one (Injective), Onto (Surjective), Bijective functions', 'Composition of functions ($f \\circ g$) and Invertible functions ($f^{-1}$)'],
          learningObjectives: ['Prove equivalence relations on discrete and continuous sets', 'Determine injectivity, surjectivity, and inverses of functions'],
          coreFormulas: ['f(x_1) = f(x_2) \\implies x_1 = x_2 \\text{ (Injective)}', '(f \\circ g)(x) = f(g(x))']
        },
        {
          id: 'ch-12-m-2',
          name: 'Inverse Trigonometric Functions',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 2',
          syllabusTopics: ['Definition, range, domain, and principal value branches of $\\sin^{-1}x, \\cos^{-1}x, \\tan^{-1}x, \\csc^{-1}x, \\sec^{-1}x, \\cot^{-1}x$', 'Graphs of inverse trigonometric functions', 'Properties of inverse trigonometric functions: $\\sin^{-1}(1/x) = \\csc^{-1}x$, $\\sin^{-1}(-x) = -\\sin^{-1}x$, $\\cos^{-1}(-x) = \\pi - \\cos^{-1}x$, $\\sin^{-1}x + \\cos^{-1}x = \\pi/2$'],
          learningObjectives: ['Evaluate principal values of inverse trigonometric expressions without falling outside valid ranges', 'Simplify algebraic inverse trigonometric composite functions'],
          coreFormulas: ['\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2}', '\\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2}']
        },
        {
          id: 'ch-12-m-3',
          name: 'Matrices',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 3',
          syllabusTopics: ['Concept, notation, order, equality of matrices, types (column, row, zero, diagonal, scalar, identity)', 'Matrix operations: Addition, scalar multiplication, matrix multiplication properties (non-commutativity)', 'Transpose of a matrix ($A^T$), Symmetric matrices ($A = A^T$) and Skew-symmetric matrices ($A = -A^T$)', 'Invertible matrices and uniqueness of inverse'],
          learningObjectives: ['Perform matrix multiplication and verify transpose properties ($(AB)^T = B^T A^T$)', 'Express any square matrix as sum of symmetric and skew-symmetric components'],
          coreFormulas: ['(AB)^T = B^T A^T', 'A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)']
        },
        {
          id: 'ch-12-m-4',
          name: 'Determinants',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 4',
          syllabusTopics: ['Determinant of a square matrix (up to 3x3)', 'Minors, cofactors, and expansion along rows and columns', 'Adjoint and Inverse of a matrix: $A^{-1} = \\frac{1}{|A|}\\text{adj}(A)$ ($|A| \\ne 0$)', 'Solving systems of linear equations using Matrix Method: $X = A^{-1}B$ and consistency criteria'],
          learningObjectives: ['Compute matrix inverses using adjoint method', 'Solve 3-variable linear algebraic systems using matrix inversion'],
          coreFormulas: ['A^{-1} = \\frac{1}{|A|}\\text{adj}(A)', 'X = A^{-1} B']
        },
        {
          id: 'ch-12-m-5',
          name: 'Continuity and Differentiability',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 5',
          syllabusTopics: ['Continuity of a function at a point and in an interval ($\\lim_{x \\to c} f(x) = f(c)$)', 'Differentiability, derivative of composite functions (Chain Rule)', 'Derivatives of implicit functions and inverse trigonometric functions', 'Exponential and logarithmic functions; Logarithmic differentiation ($y = u(x)^{v(x)}$)', 'Parametric differentiation and second order derivatives ($d^2y/dx^2$)'],
          learningObjectives: ['Prove continuity and differentiability of piecewise defined functions', 'Compute higher-order derivatives for parametric curves'],
          coreFormulas: ['\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}', '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}']
        },
        {
          id: 'ch-12-m-6',
          name: 'Application of Derivatives',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 6',
          syllabusTopics: [
            'Rate of change of quantities (dy/dt)',
            'Increasing and Decreasing functions: strictly increasing if f\'(x) > 0',
            'Maxima and Minima: First Derivative Test and Second Derivative Test (f\'(c) = 0, f\'\'(c) < 0 for maximum)',
            'Practical optimization problems in geometry, manufacturing, and revenue maximization'
          ],
          learningObjectives: ['Determine intervals where functions are strictly increasing or decreasing', 'Solve applied multi-variable optimization word problems using second derivative test'],
          coreFormulas: ['f\'(x) > 0 \\implies \\text{Strictly Increasing}', 'f\'(c) = 0 \\text{ and } f\'\'(c) < 0 \\implies \\text{Local Maxima}']
        },
        {
          id: 'ch-12-m-7',
          name: 'Integrals',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 7',
          syllabusTopics: [
            'Integration as inverse process of differentiation (anti-derivatives)',
            'Integration by substitution, integration using trigonometric identities',
            'Integration by partial fractions for rational functions',
            'Integration by parts: $\\int u v dx = u \\int v dx - \\int (u\' \\int v dx) dx$',
            'Special standard integrals ($\\int \\frac{dx}{x^2+a^2}, \\int \\frac{dx}{\\sqrt{a^2-x^2}}$)',
            'Fundamental Theorem of Calculus and properties of definite integrals ($\\int_0^a f(x)dx = \\int_0^a f(a-x)dx$)'
          ],
          learningObjectives: ['Integrate algebraic and transcendental functions using substitution, partial fractions, and parts', 'Apply definite integral symmetry properties to evaluate difficult integrals'],
          coreFormulas: [
            '\\int u v dx = u \\int v dx - \\int \\left(u\' \\int v dx\\right) dx',
            '\\int_0^a f(x)dx = \\int_0^a f(a-x)dx'
          ]
        },
        {
          id: 'ch-12-m-8',
          name: 'Application of Integrals',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 8',
          syllabusTopics: ['Area under simple curves (lines, circles, parabolas, ellipses in standard form)', 'Area bounded between curve and coordinate axes ($A = \\int_a^b y dx$ or $A = \\int_c^d x dy$)', 'Area of region enclosed between a line and a parabola, circle, or ellipse'],
          learningObjectives: ['Sketch Cartesian curves and identify intersection boundary limits', 'Calculate enclosed planar areas using single definite integration'],
          coreFormulas: ['A = \\int_a^b y dx']
        },
        {
          id: 'ch-12-m-9',
          name: 'Differential Equations',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 9',
          syllabusTopics: ['Order and degree of differential equations', 'General and particular solutions of differential equations', 'Methods of solving first order, first degree differential equations: Variable Separable method, Homogeneous differential equations ($y = vx$), Linear differential equations: $\\frac{dy}{dx} + Py = Q$ with integrating factor $IF = e^{\\int P dx}$'],
          learningObjectives: ['Determine order and degree of differential equations', 'Solve first order linear differential equations using integrating factor method'],
          coreFormulas: ['IF = e^{\\int P dx}', 'y \\cdot (IF) = \\int Q \\cdot (IF) dx + C']
        },
        {
          id: 'ch-12-m-10',
          name: 'Vector Algebra',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 10',
          syllabusTopics: ['Vectors and scalars, magnitude and direction cosines of a vector', 'Unit vector, position vector of a point, components of a vector in 3D', 'Dot (Scalar) product of two vectors: $\\vec{a}\\cdot\\vec{b} = |a||b|\\cos\\theta$; Projection of a vector', 'Cross (Vector) product of two vectors: $\\vec{a}\\times\\vec{b} = |a||b|\\sin\\theta\\,\\hat{n}$; Area of parallelogram and triangle'],
          learningObjectives: ['Compute scalar and vector cross products using component determinant expansion', 'Calculate projection vectors and enclosed geometric areas'],
          coreFormulas: [
            '\\vec{a}\\cdot\\vec{b} = a_1b_1 + a_2b_2 + a_3b_3',
            '\\vec{a}\\times\\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}',
            '\\text{Area of } \\triangle = \\frac{1}{2}|\\vec{a}\\times\\vec{b}|'
          ]
        },
        {
          id: 'ch-12-m-11',
          name: 'Three Dimensional Geometry',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 11',
          syllabusTopics: ['Direction cosines and direction ratios of a line ($l^2 + m^2 + n^2 = 1$)', 'Vector and Cartesian equations of a line passing through a point and parallel to vector, or through two points', 'Angle between two lines ($\\cos\\theta = \\frac{\\vec{b}_1\\cdot\\vec{b}_2}{|b_1||b_2|}$)', 'Shortest distance between two skew lines: $d = \\frac{|(\\vec{a}_2 - \\vec{a}_1)\\cdot(\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}$'],
          learningObjectives: ['Determine equations of spatial lines in 3D vector and Cartesian formats', 'Compute shortest perpendicular distance between non-parallel skew lines'],
          coreFormulas: [
            '\\vec{r} = \\vec{a} + \\lambda \\vec{b}',
            'd = \\frac{|(\\vec{a}_2 - \\vec{a}_1)\\cdot(\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}'
          ]
        },
        {
          id: 'ch-12-m-12',
          name: 'Linear Programming',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 12',
          syllabusTopics: ['Introduction, terminology: Objective function ($Z = ax + by$), constraints, decision variables', 'Mathematical formulation of Linear Programming Problems (LPP: diet, manufacturing, transportation)', 'Graphical method of solving LPP: Feasible region, Bounded and unbounded regions, Corner Point Method for optimal value'],
          learningObjectives: ['Formulate real-world industrial optimization constraints mathematically', 'Find maximum and minimum values using corner point evaluation'],
          coreFormulas: ['Z = ax + by \\text{ (Objective Function)}']
        },
        {
          id: 'ch-12-m-13',
          name: 'Probability',
          textbookRef: 'NCERT Mathematics Class 12 — Chapter 13',
          syllabusTopics: ['Conditional probability: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$ ($P(B) \\ne 0$)', 'Multiplication theorem on probability and Independent events ($P(A \\cap B) = P(A)P(B)$)', 'Theorem of Total Probability and Bayes’ Theorem: $P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\sum P(E_j)P(A|E_j)}$', 'Random variables and its probability distribution, Mean of random variable'],
          learningObjectives: ['Calculate conditional probability and test event independence', 'Apply Bayes’ Theorem to compute posterior probabilities in medical diagnosis and production quality testing'],
          coreFormulas: [
            'P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
            'P(E_i|A) = \\frac{P(E_i)P(A|E_i)}{\\sum_{j=1}^n P(E_j)P(A|E_j)}'
          ]
        }
      ]
    },
    {
      id: 'cbse-12-biology',
      name: 'Biology',
      category: 'Biology',
      curricula: ['NCERT Biology Class 12', 'CBSE Class 12 Senior Secondary Biology', 'NEET-UG Target'],
      chapters: [
        {
          id: 'ch-12-b-1',
          name: 'Sexual Reproduction in Flowering Plants',
          textbookRef: 'NCERT Class 12 Biology — Chapter 1',
          syllabusTopics: ['Flower structure: stamen, microsporangium, pollen grain development (microsporogenesis)', 'Pistil, megasporangium (ovule), embryo sac development (megasporogenesis: 7-celled, 8-nucleate structure)', 'Pollination types (autogamy, geitonogamy, xenogamy); wind, water, animal pollinators; outbreeding devices', 'Pollen-pistil interaction, double fertilization (syngamy + triple fusion $\\to$ 3n primary endosperm nucleus)', 'Post-fertilization: endosperm development (free nuclear vs cellular), embryo development, seed and fruit formation; apomixis and polyembryony'],
          learningObjectives: ['Describe microsporogenesis and megasporogenesis with labeled diagrammatic sequences', 'Explain significance of double fertilization unique to angiosperms']
        },
        {
          id: 'ch-12-b-2',
          name: 'Human Reproduction',
          textbookRef: 'NCERT Class 12 Biology — Chapter 2',
          syllabusTopics: ['Male reproductive system: testes, seminiferous tubules, Leydig cells, accessory ducts and glands (seminal vesicles, prostate, bulbourethral)', 'Female reproductive system: ovaries, fallopian tubes, uterus, cervix, vagina, mammary glands', 'Gametogenesis: Spermatogenesis (spermatogonia, primary/secondary spermatocytes, spermatids, spermatozoa; hormonal control by GnRH, LH, FSH) and Oogenesis', 'Menstrual cycle: follicular phase, ovulatory surge (LH surge), luteal phase (corpus luteum, progesterone), menstruation', 'Fertilization and implantation: acrosome reaction, cortical reaction preventing polyspermy, blastocyst formation and trophoblast attachment', 'Pregnancy and embryonic development: placenta functions (hCG, hPL, relaxin), germ layers; parturition (foetal ejection reflex, oxytocin) and lactation (prolactin, colostrum)'],
          learningObjectives: ['Trace hormonal regulation of spermatogenesis and ovarian/uterine phases of the menstrual cycle', 'Describe the steps from fertilization in ampulla to blastocyst implantation in endometrium']
        },
        {
          id: 'ch-12-b-3',
          name: 'Reproductive Health',
          textbookRef: 'NCERT Class 12 Biology — Chapter 3',
          syllabusTopics: ['Reproductive health: problems and strategies; population stabilization and birth control', 'Contraceptive methods: natural/traditional, barrier methods (condoms, diaphragms), IUDs (Copper-T, LNG-20), oral contraceptives (Saheli - non-steroidal), injectables, surgical sterilization (vasectomy, tubectomy)', 'Medical Termination of Pregnancy (MTP Act 2021 amendments)', 'Sexually Transmitted Infections (STIs: syphilis, gonorrhea, genital herpes, chlamydiasis, Hepatitis B, HIV)', 'Infertility and Assisted Reproductive Technologies (ART): IVF-ET (test tube baby), ZIFT, GIFT, ICSI, AI, surrogacy'],
          learningObjectives: ['Evaluate mechanisms and efficacy of various modern contraceptive methods', 'Explain indications and methodologies of assisted reproductive techniques (IVF, ICSI, GIFT)']
        },
        {
          id: 'ch-12-b-4',
          name: 'Principles of Inheritance and Variation',
          textbookRef: 'NCERT Class 12 Biology — Chapter 4',
          syllabusTopics: ['Mendel’s laws of inheritance: Law of Segregation (monohybrid cross 3:1 / 1:2:1), Law of Independent Assortment (dihybrid cross 9:3:3:1)', 'Deviations from Mendelism: Incomplete dominance (*Antirrhinum* 1:2:1), Codominance (ABO blood groups - multiple alleles), Pleiotropy, Polygenic inheritance (human skin color)', 'Chromosomal Theory of Inheritance (Sutton & Boveri); Morgan’s linkage and recombination experiments in *Drosophila*', 'Sex determination: XX-XY (humans), XX-XO (grasshoppers), ZZ-ZW (birds), haplo-diploidy (honeybees)', 'Mutation and pedigree analysis (autosomal dominant, autosomal recessive, X-linked recessive)', 'Genetic disorders: Mendelian disorders (Hemophilia, Sickle-cell anemia - point mutation $GAG \\to GUG$, Phenylketonuria, Thalassemia) and Chromosomal disorders (Down syndrome, Klinefelter syndrome, Turner syndrome)'],
          learningObjectives: ['Construct and interpret multi-generation human genetic pedigree charts', 'Analyze molecular pathology of sickle-cell anemia and chromosomal aneuploidies']
        },
        {
          id: 'ch-12-b-5',
          name: 'Molecular Basis of Inheritance',
          textbookRef: 'NCERT Class 12 Biology — Chapter 5',
          syllabusTopics: ['Structure of DNA double helix (Watson & Crick model, Chargaff’s rules); packaging of DNA helix (histone octamer, nucleosome, euchromatin, heterochromatin)', 'Search for genetic material: Griffith’s transformation experiment, Avery-MacLeod-McCarty, Hershey-Chase bacteriophage experiment', 'DNA replication: semi-conservative proof by Meselson & Stahl, replication fork, DNA polymerases, Okazaki fragments, continuous and discontinuous synthesis', 'Transcription in prokaryotes and eukaryotes: promoter, structural gene, terminator, RNA polymerases I, II, III; post-transcriptional modifications (capping, tailing, splicing - introns & exons)', 'Genetic Code: properties (triplet, universal, degenerate, non-overlapping, start codon AUG, stop codons UAA, UAG, UGA)', 'Translation: tRNA adapter molecule (cloverleaf model), aminoacylation of tRNA, ribosomal initiation, elongation, peptide bond formation, termination', 'Regulation of gene expression: Lac Operon model of Jacob & Monod (promoter, operator, regulator $i$ gene, $z, y, a$ structural genes, role of allolactose as inducer)', 'Human Genome Project (goals, methodologies ESTs & sequence annotation, salient features) and DNA Fingerprinting (VNTRs, Southern blot)'],
          learningObjectives: ['Detail the enzymatic machinery of semi-conservative DNA replication and eukaryotic transcription', 'Explain the on/off switching mechanism of the Lac Operon under glucose vs lactose availability']
        },
        {
          id: 'ch-12-b-6',
          name: 'Evolution',
          textbookRef: 'NCERT Class 12 Biology — Chapter 6',
          syllabusTopics: ['Origin of life: Big Bang theory, Oparin-Haldane chemical evolution hypothesis, Miller-Urey experimental simulation ($CH_4, NH_3, H_2, H_2O$ producing amino acids)', 'Evidences of evolution: Paleontological (fossils), Comparative anatomy (homologous organs - divergent evolution vs analogous organs - convergent evolution), Embryological, Biochemical evidence', 'Adaptive radiation (Darwin’s finches in Galapagos, Australian marsupials)', 'Theories of evolution: Lamarckism, Darwinian natural selection (survival of the fittest), Hugo de Vries Mutation Theory (saltation)', 'Hardy-Weinberg Principle: genetic equilibrium ($p^2 + 2pq + q^2 = 1$), factors affecting equilibrium (gene migration, genetic drift - Founder effect & bottleneck, mutation, recombination, natural selection: stabilizing, directional, disruptive)', 'Brief account of evolution: geological time scale; Origin and evolution of man (*Dryopithecus, Ramapithecus, Australopithecus, Homo habilis, Homo erectus, Neanderthal, Homo sapiens*)'],
          learningObjectives: ['Apply the Hardy-Weinberg equation to calculate allele and genotype frequencies in populations', 'Distinguish homologous structures (divergent evolution) from analogous structures (convergent evolution)']
        },
        {
          id: 'ch-12-b-7',
          name: 'Human Health and Disease',
          textbookRef: 'NCERT Class 12 Biology — Chapter 7',
          syllabusTopics: ['Common infectious diseases in humans: Typhoid (*Salmonella typhi*, Widal test), Pneumonia, Common cold, Malaria (*Plasmodium vivax* life cycle in human and mosquito), Amoebiasis, Ascariasis, Ringworm', 'Immunity: Innate immunity (physical, physiological, cellular, cytokine barriers) and Acquired immunity (active vs passive, humoral B-cells vs cell-mediated T-cells)', 'Antibody structure: $H_2L_2$ immunoglobulins (IgG, IgA in colostrum, IgM, IgE in allergies, IgD)', 'Vaccination and immunization; Autoimmune disorders (Rheumatoid arthritis)', 'Acquired Immuno Deficiency Syndrome (AIDS): Human Immunodeficiency Virus (HIV) structure, reverse transcription in macrophages and $T_H$ helper cell destruction, ELISA diagnostic test, ART therapy', 'Cancer: characteristics of cancer cells (loss of contact inhibition, metastasis), oncogenes, carcinogens, diagnosis and treatment (surgery, radiotherapy, chemotherapy, immunotherapy - alpha-interferon)', 'Drugs and alcohol abuse: Opioids (morphine, heroin), Cannabinoids, Cocaine, hallucinogens; addiction, withdrawal symptoms, adolescent prevention'],
          learningObjectives: ['Diagram the complex multi-host life cycle of *Plasmodium* falciparum', 'Explain the cellular mechanism of HIV entry and helper T-cell destruction leading to AIDS']
        },
        {
          id: 'ch-12-b-8',
          name: 'Microbes in Human Welfare',
          textbookRef: 'NCERT Class 12 Biology — Chapter 8',
          syllabusTopics: ['Microbes in household products: *Lactobacillus* in curd, dough fermentation by baker’s yeast (*Saccharomyces cerevisiae*), cheese making (*Propionibacterium sharmanii* for Swiss cheese, *Penicillium roqueforti*)', 'Microbes in industrial products: Fermented beverages, Antibiotics (*Penicillium notatum* by Fleming, Florey, Chain), Chemicals, Enzymes, Bioactive molecules (Citric acid - *Aspergillus niger*, Lactic acid, Butyric acid; Cyclosporin A - *Trichoderma polysporum*, Statins - *Monascus purpureus*)', 'Microbes in sewage treatment: Primary settling vs Secondary biological treatment (aerobic activated sludge, Biochemical Oxygen Demand - BOD), anaerobic sludge digesters producing biogas', 'Microbes in production of biogas (Methanogens: *Methanobacterium* in cattle rumen, Gobar gas plant structure)', 'Microbes as biocontrol agents (*Bacillus thuringiensis* Bt, *Trichoderma*, Baculoviruses / *Nucleopolyhedrovirus*)', 'Microbes as biofertilizers: Rhizobium, Azotobacter, Azospirillum, Mycorrhiza (*Glomus*), Cyanobacteria (*Anabaena, Nostoc*)'],
          learningObjectives: ['Explain sewage treatment steps and the inverse relationship between BOD and water purity', 'Identify bioactive molecules (Statins, Cyclosporin A, Streptokinase) and their clinical uses']
        },
        {
          id: 'ch-12-b-9',
          name: 'Biotechnology: Principles and Processes',
          textbookRef: 'NCERT Class 12 Biology — Chapter 9',
          syllabusTopics: ['Principles of biotechnology: Genetic engineering (recombinant DNA technology) and chemical engineering bioprocesses', 'Tools of recombinant DNA technology: Restriction enzymes (molecular scissors - EcoRI sticky ends, palindromic recognition sequences)', 'Cloning vectors: characteristics of ideal plasmid vector (pBR322: origin of replication *ori*, selectable markers $amp^R, tet^R$, insertional inactivation of $\\beta$-galactosidase)', 'Competent host transformation: heat shock, microinjection, gene gun (biolistics), *Agrobacterium tumefaciens* disarmed Ti plasmid vector', 'Processes of r-DNA technology: Isolation of genetic material (DNA), restriction digestion, agarose gel electrophoresis, PCR (Polymerase Chain Reaction: Denaturation, Annealing, Extension using *Taq* polymerase), ligation, insertion, bioreactors (stirred-tank & sparged), downstream processing'],
          learningObjectives: ['Illustrate the three cycles of PCR and describe the utility of thermostable *Taq* polymerase', 'Explain insertional inactivation for screening recombinant from non-recombinant colonies']
        },
        {
          id: 'ch-12-b-10',
          name: 'Biotechnology and its Applications',
          textbookRef: 'NCERT Class 12 Biology — Chapter 10',
          syllabusTopics: ['Biotechnological applications in agriculture: Genetically Modified Organisms (GMOs), Bt crops (Bt cotton, *cryIAc*, *cryIIAb* against bollworms, *cryIAb* against corn borer), RNA interference (RNAi) silencing in tobacco roots against nematode *Meloidogyne incognita*', 'Biotechnological applications in medicine: Genetically engineered insulin (Humulin - Eli Lilly company, chains A and B linked by disulphide bonds), Gene therapy (ADA adenosine deaminase deficiency in SCID girl), Molecular diagnosis (ELISA, PCR detection of pathogens)', 'Transgenic animals: production of alpha-1-antitrypsin for emphysema, transgenic cow Rosie producing human protein-enriched milk (alpha-lactalbumin), safety testing of vaccines and chemical toxicity', 'Ethical issues, biopiracy (Basmati rice, neem, turmeric exploitation), GEAC (Genetic Engineering Appraisal Committee)'],
          learningObjectives: ['Describe recombinant human insulin synthesis without C-peptide pro-hormone', 'Detail the RNA interference (RNAi) gene silencing pathway in nematode control']
        },
        {
          id: 'ch-12-b-11',
          name: 'Organisms and Populations',
          textbookRef: 'NCERT Class 12 Biology — Chapter 11',
          syllabusTopics: ['Organism and its environment: abiotic factors (temperature, water, light, soil), responses to abiotic factors (regulators, conformers, partial regulators, migration, suspension/hibernation/diapause)', 'Adaptations: morphological, physiological, and behavioral adaptations (Kangaroo rat water conservation, desert xerophytic adaptations, Allen’s rule, altitude sickness acclimatization)', 'Populations: population attributes (birth rate, death rate, sex ratio, age pyramids: expanding, stable, declining)', 'Population growth models: Exponential growth ($dN/dt = rN$) and Logistic growth ($dN/dt = rN(1 - N/K)$ - carrying capacity)', 'Population interactions: Mutualism, Competition (Gause’s Competitive Exclusion Principle, resource partitioning), Predation, Parasitism (brood parasitism in cuckoo), Commensalism, Amensalism'],
          learningObjectives: ['Differentiate exponential J-shaped from logistic sigmoid growth curves mathematically', 'Explain population interaction matrices (+, -, 0) with ecological biological examples'],
          coreFormulas: ['\\frac{dN}{dt} = rN \\left(\\frac{K - N}{K}\\right)', 'N_t = N_0 e^{rt}']
        },
        {
          id: 'ch-12-b-12',
          name: 'Ecosystem',
          textbookRef: 'NCERT Class 12 Biology — Chapter 12',
          syllabusTopics: ['Ecosystem structure and function: productivity (Gross Primary Productivity GPP, Net Primary Productivity $NPP = GPP - R$), decomposition processes (fragmentation, leaching, catabolism, humification, mineralization)', 'Energy flow in ecosystems: Lindeman’s 10% law of trophic efficiency, food chains (grazing vs detritus), food web', 'Ecological pyramids: pyramid of numbers, pyramid of biomass (inverted in sea), pyramid of energy (always upright)', 'Ecological succession: primary vs secondary succession, hydrarch and xerarch succession stages leading to stable climax community'],
          learningObjectives: ['Apply Lindeman’s 10% law to multi-trophic energy transfers', 'Explain why the pyramid of energy is always strictly upright in terrestrial and aquatic ecosystems']
        },
        {
          id: 'ch-12-b-13',
          name: 'Biodiversity and Conservation',
          textbookRef: 'NCERT Class 12 Biology — Chapter 13',
          syllabusTopics: ['Levels of biodiversity: genetic, species, and ecological diversity; global species diversity estimates (Robert May’s estimate $\\approx 7$ million species)', 'Patterns of biodiversity: latitudinal gradients (tropics have highest diversity), Species-Area relationship by Alexander von Humboldt ($\\log S = \\log C + Z \\log A$)', 'Importance of species diversity to ecosystem stability: David Tilman’s experiments, Paul Ehrlich’s "Rivet Popper hypothesis"', 'Loss of biodiversity: The Evil Quartet (Habitat loss and fragmentation, Over-exploitation, Alien species invasions - Nile perch, Parthenium, Water hyacinth, Co-extinctions)', 'Biodiversity conservation: in-situ conservation (National Parks, Sanctuaries, Biosphere Reserves, Sacred Groves) vs ex-situ conservation (Zoological parks, Botanical gardens, Cryopreservation, Seed banks, In-vitro fertilization); International conventions (Earth Summit Rio 1992, World Summit Johannesburg 2002)'],
          learningObjectives: ['Interpret Alexander von Humboldt’s species-area log equation and significance of $Z$ slope value', 'Evaluate in-situ vs ex-situ conservation strategies with specific Indian nature reserves'],
          coreFormulas: ['\\log S = \\log C + Z\\log A']
        }
      ]
    },
    {
      id: 'cbse-12-english',
      name: 'English Core (Flamingo & Vistas)',
      category: 'English & Languages',
      curricula: ['NCERT Flamingo & Vistas Class 12', 'CBSE Class 12 English Core Board Exam'],
      chapters: [
        {
          id: 'ch-12-e-1',
          name: 'The Last Lesson (Flamingo)',
          textbookRef: 'NCERT Flamingo Class 12 — Prose Chapter 1',
          syllabusTopics: ['Alphonse Daudet’s story set in Franco-Prussian War (1870-71)', 'Prussian order enforcing German instruction in Alsace and Lorraine schools', 'M. Hamel’s final French class, linguistic chauvinism, and love for mother tongue ("Vive La France!")'],
          learningObjectives: ['Analyze themes of cultural identity, patriotism, and linguistic imperialism']
        },
        {
          id: 'ch-12-e-2',
          name: 'Lost Spring: Stories of Stolen Childhood',
          textbookRef: 'NCERT Flamingo Class 12 — Prose Chapter 2',
          syllabusTopics: ['Anees Jung’s poignant investigative report', 'Saheb-e-Alam: ragpickers of Seemapuri living in desperate squalor', 'Mukesh of Firozabad: child labor in hazardous bangle-making glass furnaces', 'Vicious circle of sahukars, middlemen, policemen, and politicians'],
          learningObjectives: ['Examine socio-economic deprivation, child labor, and entrenched systemic poverty']
        },
        {
          id: 'ch-12-e-3',
          name: 'Deep Water (Flamingo)',
          textbookRef: 'NCERT Flamingo Class 12 — Prose Chapter 3',
          syllabusTopics: ['William Douglas’ autobiographical narrative of overcoming hydrophobia', 'Near-drowning experience at the YMCA swimming pool in Yakima', 'Rigorous step-by-step swimming training and psychological conquer of terror ("All we have to fear is fear itself")'],
          learningObjectives: ['Analyze psychological trauma, self-determination, and the process of overcoming deep-seated fear']
        },
        {
          id: 'ch-12-e-4',
          name: 'The Rattrap (Flamingo)',
          textbookRef: 'NCERT Flamingo Class 12 — Prose Chapter 4',
          syllabusTopics: ['Selma Lagerlöf’s philosophical fairy tale', 'The world as a giant rattrap with riches and pleasures as cheese bait', 'The peddler’s betrayal of the old crofter, refuge at Ramsjö ironworks, and redemption through Edla Willmansson’s compassionate unconditional kindness'],
          learningObjectives: ['Evaluate themes of human empathy, moral redemption, and the transforming power of unconditional trust']
        },
        {
          id: 'ch-12-e-5',
          name: 'Indigo (Flamingo)',
          textbookRef: 'NCERT Flamingo Class 12 — Prose Chapter 5',
          syllabusTopics: ['Louis Fischer’s biographical chronicle of Mahatma Gandhi at Champaran (1917)', 'Sharecropping crisis: British landlords forcing farmers to grow indigo on 15% land and demanding synthetic indigo compensation', 'Civil disobedience, legal advocacy, peasant mobilization, and Gandhi’s first major national victory'],
          learningObjectives: ['Understand Gandhi’s non-violent civil disobedience methodology and grassroots leadership']
        },
        {
          id: 'ch-12-e-6',
          name: 'My Mother at Sixty-Six & Keeping Quiet (Poems)',
          textbookRef: 'NCERT Flamingo Class 12 — Poetry',
          syllabusTopics: ['Kamala Das’ "My Mother at Sixty-Six": aging, fear of maternal loss, juxtaposed against merry children and sprinting trees', 'Pablo Neruda’s "Keeping Quiet": call for 12 seconds of global silence, introspection, cessation of war and destruction, and mutual peace'],
          learningObjectives: ['Analyze poetic imagery, enjambment, and universal themes of mortality and universal tranquility']
        },
        {
          id: 'ch-12-e-7',
          name: 'A Thing of Beauty & Aunt Jennifer’s Tigers (Poems)',
          textbookRef: 'NCERT Flamingo Class 12 — Poetry',
          syllabusTopics: ['John Keats’ "A Thing of Beauty": eternal joy of art and nature relieving human despondence', 'Adrienne Rich’s "Aunt Jennifer’s Tigers": feminist critique of patriarchal oppression in marriage vs embroidered proud, fearless tigers'],
          learningObjectives: ['Critique romantic aesthetic philosophy and feminist poetic symbolism of immortal artistic expression']
        },
        {
          id: 'ch-12-e-8',
          name: 'The Third Level & The Tiger King (Vistas)',
          textbookRef: 'NCERT Vistas Class 12 — Chapters 1 & 2',
          syllabusTopics: ['Jack Finney’s "The Third Level": Grand Central Station time-slip to Galesburg 1894 as psychological escapism from modern war anxiety', 'Kalki’s "The Tiger King": satirical parody of the Maharaja of Pratibandhapuram trying to outwit astrological death prophecy by hunting 100 tigers, only to perish from a wooden toy tiger splinter'],
          learningObjectives: ['Analyze science-fiction escapism and dramatic irony satirizing tyrannical monarchical hubris']
        },
        {
          id: 'ch-12-e-9',
          name: 'Journey to the End of the Earth & The Enemy (Vistas)',
          textbookRef: 'NCERT Vistas Class 12 — Chapters 3 & 4',
          syllabusTopics: ['Tishani Doshi’s Antarctica expedition: climate change, ozone depletion, and planetary geological past and future', 'Pearl S. Buck’s "The Enemy": Dr. Sadao Hoki treating a wounded American prisoner of war in wartime Japan, balancing medical ethics and humanitarian compassion against nationalistic duty'],
          learningObjectives: ['Evaluate ecological urgency in polar regions and ethical conflicts between professional oath and patriotism']
        },
        {
          id: 'ch-12-e-10',
          name: 'On the Face of It & Memories of Childhood (Vistas)',
          textbookRef: 'NCERT Vistas Class 12 — Chapters 5 & 6',
          syllabusTopics: ['Susan Hill’s play "On the Face of It": Derry’s acid-burned face and bitter isolation healed by Mr. Lamb’s open-minded wisdom and tin leg', 'Zitkala-Sa’s "The Cutting of My Long Hair" (Native American cultural assimilation) and Bama’s "We Too are Human Beings" (caste discrimination and Dalit empowerment through education)'],
          learningObjectives: ['Analyze disability psychology, physical alienation, and autobiographical narratives of racial and caste resistance']
        }
      ]
    }
  ]
};
