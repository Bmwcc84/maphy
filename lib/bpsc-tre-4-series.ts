export type BpscTre4Question = {
  id: string;
  question: [english: string, hindi: string];
  options: Array<[english: string, hindi: string]>;
  correctOption: number;
  explanation: [english: string, hindi: string];
};

export type BpscQuestionFigureCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceWidth?: number;
  sourceHeight?: number;
  alt: [english: string, hindi: string];
  masks?: Array<{ x: number; y: number; width: number; height: number }>;
};

export type BpscTre4Test = {
  id: string;
  number: number;
  title: [english: string, hindi: string];
  sourceImage: string;
  downloadPath: string;
  questions: BpscTre4Question[];
};

type SourceEnglishQuestion = {
  question: string;
  options: [string, string, string, string];
};

// English wording and choices are transcribed from the scanned source pages.
const sourceEnglishQuestions: Record<string, SourceEnglishQuestion> = {
  "1-1": {
    question: "A parallel plate condenser is filled with two dielectrics as shown. Area of each plate is A metre² and the separation is t metre. The dielectric constants are k₁ and k₂ respectively. Its capacitance in farad will be",
    options: ["(ε₀A/t)(k₁ + k₂)", "(ε₀A/t) · ((k₁ + k₂)/2)", "(2ε₀A/t)(k₁ + k₂)", "(ε₀A/t) · ((k₁ - k₂)/2)"],
  },
  "1-2": {
    question: "Three condensers each of capacitance 2F are put in series. The resultant capacitance is",
    options: ["6F", "3/2 F", "2/3 F", "5F"],
  },
  "1-3": {
    question: "A slab of material of dielectric constant K has the same area as the plates of a parallel plate capacitor but has a thickness (3/4)d, where d is the separation of the plates. The ratio of the capacitance C (in the presence of the dielectric) to the capacitance C₀ (in the absence of the dielectric) is",
    options: ["3K/(K + 4)", "3K/4", "4K/(K + 3)", "4K/3"],
  },
  "2-1": {
    question: "If on the concentric hollow spheres of radii r and R (> r) the charge Q is distributed such that their surface densities are same then the potential at their common centre is",
    options: ["Q(R² + r²)/[4πε₀(R + r)]", "QR/(R + r)", "Zero", "Q(R + r)/[4πε₀(R² + r²)]"],
  },
  "2-2": {
    question: "Two equal charges q of opposite sign separated by a distance 2a constitute an electric dipole of dipole moment p. If P is a point at a distance r from the centre of the dipole and the line joining the centre of the dipole to this point makes an angle θ with the axis of the dipole, then the potential at P is given by (r >> 2a) (Where p = 2qa)",
    options: ["V = p cos θ/(4πε₀r²)", "V = p cos θ/(4πε₀r)", "V = p sin θ/(4πε₀r)", "V = p cos θ/(2πε₀r²)"],
  },
  "3-1": {
    question: "Equipotential surfaces are shown in figure. Then the electric field strength will be",
    options: ["100 Vm⁻¹ along X-axis", "100 Vm⁻¹ along Y-axis", "200 Vm⁻¹ at an angle 120° with X-axis", "50 Vm⁻¹ at an angle 120° with X-axis"],
  },
  "3-2": {
    question: "In a uniformly charged sphere of total charge Q and radius R, the electric field E is plotted as function of distance from the centre. The graph which would correspond to the above will be",
    options: ["Graph (a)", "Graph (b)", "Graph (c)", "Graph (d)"],
  },
  "4-1": {
    question: "A ray of light is incident at the glass-water interface at an angle i, it emerges finally parallel to the surface of water, then the value of μg would be",
    options: ["(4/3) sin i", "1/sin i", "4/3", "1"],
  },
  "5-1": {
    question: "One side of a glass slab is silvered as shown. A ray of light is incident on the other side at angle of incidence i = 45°. Refractive index of glass is given as 1.5. The deviation of the ray of light from its initial path when it comes out of the slab is",
    options: ["90°", "180°", "120°", "45°"],
  },
  "5-2": {
    question: "Consider the situation shown in figure. Water (μw = 4/3) is filled in a beaker upto a height of 10 cm. A plane mirror fixed at a height of 5 cm from the surface of water. Distance of image from the mirror after reflection from it of an object O at the bottom of the beaker is",
    options: ["15 cm", "12.5 cm", "7.5 cm", "10 cm"],
  },
  "6-1": {
    question: "The ratio of intensities of two waves is 9 : 1. They are producing interference. The ratio of maximum and minimum intensities will be",
    options: ["10 : 8", "9 : 1", "4 : 1", "2 : 1"],
  },
  "6-2": {
    question: "Two coherent point sources S₁ and S₂ are separated by a small distance 'd' as shown. The fringes obtained on the screen will be",
    options: ["Points", "Straight lines", "Semi-circles", "Concentric circles"],
  },
  "7-1": {
    question: "In two separate set-ups of the Young's double slit experiment, fringes of equal width are observed when lights of wavelengths in the ratio 1 : 2 are used. If the ratio of the slit separation in the two cases is 2 : 1, the ratio of the distances between the plane of the slits and the screen in the two set-ups is",
    options: ["4 : 1", "1 : 1", "1 : 4", "2 : 1"],
  },
  "7-2": {
    question: "In an interference experiment, the spacing between successive maxima or minima is (Where the symbols have their usual meanings)",
    options: ["λd/D", "λD/d", "dD/λ", "λd/(4D)"],
  },
  "8-1": {
    question: "The angle of incidence at which reflected light is totally polarized for reflection from air to glass (refractive index n) is",
    options: ["sin⁻¹(n)", "sin⁻¹(1/n)", "tan⁻¹(1/n)", "tan⁻¹(n)"],
  },
  "9-1": {
    question: "The figure indicates the energy level diagram of an atom and the origin of six spectral lines in emission (e.g. line no. 5 arises from the transition from level B to A). Which of the following spectral lines will also occur in the absorption spectra",
    options: ["1, 4, 6", "4, 5, 6", "1, 2, 3", "1, 2, 3, 4, 5, 6"],
  },
  "10-1": {
    question: "The half life period of radium is 1600 years. The fraction of a sample of radium that would remain after 6400 years is",
    options: ["1/4", "1/2", "1/8", "1/16"],
  },
  "10-2": {
    question: "During a negative beta decay",
    options: ["An atomic electron is ejected", "An electron which is already present within the nucleus is ejected", "A neutron in the nucleus decays emitting an electron", "A part of the binding energy is converted into electron"],
  },
  "10-3": {
    question: "Some radioactive nucleus may emit",
    options: ["Only one α, β or γ at a time", "All the three α, β and γ one after another", "All the three α, β and γ simultaneously", "Only α and β simultaneously"],
  },
  "11-1": {
    question: "In the energy band diagram of a material shown below, the open circles and filled circles denote holes and electrons respectively. The material is",
    options: ["A p-type semiconductor", "An insulator", "A metal", "An n-type semiconductor"],
  },
  "11-2": {
    question: "In P-type semiconductor the majority and minority charge carriers are respectively",
    options: ["Protons and electrons", "Electrons and protons", "Electrons and holes", "Holes and electrons"],
  },
  "12-1": {
    question: "A zener diode, having breakdown voltage equal to 15 V, is used in a voltage regulator circuit shown in figure. The current through the diode is",
    options: ["20 mA", "5 mA", "10 mA", "15 mA"],
  },
  "12-2": {
    question: "Two ideal diodes are connected to a battery as shown in the circuit. The current supplied by the battery is",
    options: ["0.75 A", "Zero", "0.25 A", "0.5 A"],
  },
  "13-1": {
    question: "To get an output 1 from the circuit shown in the figure, the input must be",
    options: ["A = 0, B = 1, C = 0", "A = 1, B = 0, C = 0", "A = 1, B = 0, C = 1", "A = 1, B = 1, C = 0"],
  },
  "13-2": {
    question: "The following figure shows a logic gate circuit with two inputs A and B and the output Y. The voltage waveforms of A, B and the output Y are as given. The logic gate is",
    options: ["NOR gate", "OR gate", "AND gate", "NAND gate"],
  },
  "14-1": {
    question: "What is the velocity of the bob of a simple pendulum at its mean position, if it is able to rise to vertical height of 10cm (g = 9.8 m/s²)",
    options: ["2.2 m/s", "1.8 m/s", "1.4 m/s", "0.6 m/s"],
  },
  "14-2": {
    question: "A simple pendulum with a bob of mass 'm' oscillates from A to C and back to A such that PB is H. If the acceleration due to gravity is 'g', then the velocity of the bob as it passes through B is",
    options: ["mgH", "√(2gH)", "2gH", "Zero"],
  },
  "15-1": {
    question: "The plots of intensity versus wavelength for three black bodies at temperatures T₁, T₂ and T₃ respectively are as shown. Their temperature are such that",
    options: ["T₁ > T₂ > T₃", "T₁ > T₃ > T₂", "T₂ > T₃ > T₁", "T₃ > T₂ > T₁"],
  },
  "16-1": {
    question: "A thermodynamic system undergoes cyclic process ABCDA as shown in figure. The work done by the system is",
    options: ["P₀V₀", "2P₀V₀", "P₀V₀/2", "Zero"],
  },
  "16-2": {
    question: "The P-V graph of an ideal gas cycle is shown here as below. The adiabatic process is described by",
    options: ["AB and BC", "AB and CD", "BC and DA", "BC and CD"],
  },
  "16-3": {
    question: "An ideal monoatomic gas is taken round the cycle ABCDA as shown in following P-V diagram. The work done during the cycle is",
    options: ["PV", "2PV", "4PV", "Zero"],
  },
  "16-4": {
    question: "The above p-v diagram represents the thermodynamic cycle of an engine, operating with an ideal monoatomic gas. The amount of heat, extracted from the source in a single cycle is",
    options: ["p₀v₀", "(13/2)p₀v₀", "(11/2)p₀v₀", "4p₀v₀"],
  },
  "17-1": {
    question: "What will be the force constant of the spring system shown in the figure",
    options: ["K₁/2 + K₂", "[1/(2K₁) + 1/K₂]⁻¹", "1/(2K₁) + 1/K₂", "[2/K₁ + 1/K₁]⁻¹"],
  },
  "17-2": {
    question: "Two springs have spring constants Kₐ and Kᵦ and Kₐ > Kᵦ. The work required to stretch them by same extension will be",
    options: ["More in spring A", "More in spring B", "Equal in both", "Nothing can be said"],
  },
  "17-3": {
    question: "The effective spring constant of two spring system as shown in figure will be",
    options: ["K₁ + K₂", "K₁K₂/(K₁ + K₂)", "K₁ - K₂", "K₁K₂/(K₁ - K₂)"],
  },
  "18-1": {
    question: "An incompressible liquid flows through a horizontal tube as shown in the following fig. Then the velocity v of the fluid is",
    options: ["3.0 m/s", "1.5 m/s", "1.0 m/s", "2.25 m/s"],
  },
  "18-2": {
    question: "Horizontal tube of non-uniform cross-section has radii of 0.1 m and 0.05 m respectively at M and N for a streamline flow of liquid the rate of liquid flow is",
    options: ["Continuously changes with time", "Greater at M than at N", "Greater at N than at M", "Same at M and N"],
  },
  "19-1": {
    question: "Two planets have the same average density but their radii are R₁ and R₂. If acceleration due to gravity on these planets be g₁ and g₂ respectively, then",
    options: ["g₁/g₂ = R₁/R₂", "g₁/g₂ = R₂/R₁", "g₁/g₂ = R₁²/R₂²", "g₁/g₂ = R₁³/R₂³"],
  },
  "19-2": {
    question: "An iron ball and a wooden ball of the same radius are released from a height 'h' in vacuum. The time taken by both of them to reach the ground is",
    options: ["Unequal", "Exactly equal", "Roughly equal", "Zero"],
  },
  "19-3": {
    question: "If g is the acceleration due to gravity on the surface of earth, its value at a height equal to double the radius of earth is",
    options: ["g", "g/2", "g/3", "g/9"],
  },
  "20-1": {
    question: "The mass of diameter of a planet are twice those of earth. The period of oscillation of pendulum on this planet will be (if it is a second's pendulum on earth)",
    options: ["1/√2 s", "2√2 s", "2 s", "1/2 s"],
  },
  "20-2": {
    question: "The height at which the weight of a body becomes 1/16th, its weight on the surface of earth (radius R), is",
    options: ["5R", "15R", "3R", "4R"],
  },
  "20-3": {
    question: "A spherical planet has a mass Mₚ and diameter Dₚ. A particle of mass m falling freely near the surface of this planet will experience an acceleration due to gravity, equal to",
    options: ["4GMₚ/Dₚ²", "GMₚm/Dₚ²", "GMₚ/Dₚ²", "4GMₚm/Dₚ²"],
  },
};

// Literal Hindi translations mirror the source-locked English questions and choices.
const sourceHindiQuestions: Record<string, SourceEnglishQuestion> = {
  "1-1": {
    question: "चित्रानुसार एक समांतर-पट्टिका संधारित्र में दो परावैद्युत पदार्थ भरे गए हैं। प्रत्येक पट्टिका का क्षेत्रफल A मीटर² है और उनके बीच की दूरी t मीटर है। परावैद्युतांक क्रमशः k₁ और k₂ हैं। इसकी धारिता फैराड में होगी",
    options: ["(ε₀A/t)(k₁ + k₂)", "(ε₀A/t) · ((k₁ + k₂)/2)", "(2ε₀A/t)(k₁ + k₂)", "(ε₀A/t) · ((k₁ - k₂)/2)"],
  },
  "1-2": {
    question: "2 F धारिता वाले तीन संधारित्रों को श्रेणीक्रम में जोड़ा गया है। परिणामी धारिता है",
    options: ["6F", "3/2 F", "2/3 F", "5F"],
  },
  "1-3": {
    question: "परावैद्युतांक K वाले पदार्थ की एक पट्टी का क्षेत्रफल समांतर-पट्टिका संधारित्र की पट्टिकाओं के समान है, परंतु इसकी मोटाई (3/4)d है, जहाँ d पट्टिकाओं के बीच की दूरी है। धारिता C (परावैद्युत की उपस्थिति में) और धारिता C₀ (परावैद्युत की अनुपस्थिति में) का अनुपात है",
    options: ["3K/(K + 4)", "3K/4", "4K/(K + 3)", "4K/3"],
  },
  "2-1": {
    question: "यदि r और R (> r) त्रिज्याओं वाले संकेंद्रित खोखले गोलों पर आवेश Q इस प्रकार वितरित है कि उनके पृष्ठीय आवेश घनत्व समान हैं, तो उनके उभयनिष्ठ केंद्र पर विभव है",
    options: ["Q(R² + r²)/[4πε₀(R + r)]", "QR/(R + r)", "शून्य", "Q(R + r)/[4πε₀(R² + r²)]"],
  },
  "2-2": {
    question: "विपरीत चिह्न वाले दो समान आवेश q, जो 2a दूरी से पृथक हैं, द्विध्रुव आघूर्ण p वाला एक विद्युत द्विध्रुव बनाते हैं। यदि P द्विध्रुव के केंद्र से r दूरी पर एक बिंदु है और द्विध्रुव के केंद्र को इस बिंदु से मिलाने वाली रेखा द्विध्रुव के अक्ष के साथ θ कोण बनाती है, तो P पर विभव दिया जाता है (r >> 2a) (जहाँ p = 2qa)",
    options: ["V = p cos θ/(4πε₀r²)", "V = p cos θ/(4πε₀r)", "V = p sin θ/(4πε₀r)", "V = p cos θ/(2πε₀r²)"],
  },
  "3-1": {
    question: "चित्र में समविभव पृष्ठ दिखाए गए हैं। तब विद्युत क्षेत्र की तीव्रता होगी",
    options: ["X-अक्ष के अनुदिश 100 V m⁻¹", "Y-अक्ष के अनुदिश 100 V m⁻¹", "X-अक्ष के साथ 120° का कोण बनाते हुए 200 V m⁻¹", "X-अक्ष के साथ 120° का कोण बनाते हुए 50 V m⁻¹"],
  },
  "3-2": {
    question: "कुल आवेश Q और त्रिज्या R वाले एकसमान रूप से आवेशित गोले में विद्युत क्षेत्र E को केंद्र से दूरी के फलन के रूप में आलेखित किया गया है। उपर्युक्त के अनुरूप आलेख होगा",
    options: ["आलेख (a)", "आलेख (b)", "आलेख (c)", "आलेख (d)"],
  },
  "4-1": {
    question: "प्रकाश की एक किरण काँच-जल अंतरापृष्ठ पर i कोण से आपतित होती है। यह अंततः जल की सतह के समानांतर निर्गत होती है, तब μg का मान होगा",
    options: ["(4/3) sin i", "1/sin i", "4/3", "1"],
  },
  "5-1": {
    question: "चित्रानुसार काँच की एक पट्टी का एक पार्श्व रजतित है। प्रकाश की एक किरण दूसरे पार्श्व पर आपतन कोण i = 45° से आपतित होती है। काँच का अपवर्तनांक 1.5 दिया गया है। पट्टी से बाहर निकलने पर प्रकाश किरण का अपने प्रारंभिक पथ से विचलन है",
    options: ["90°", "180°", "120°", "45°"],
  },
  "5-2": {
    question: "चित्र में दिखाई गई स्थिति पर विचार कीजिए। एक बीकर में 10 cm की ऊँचाई तक जल (μw = 4/3) भरा है। जल की सतह से 5 cm की ऊँचाई पर एक समतल दर्पण लगा है। बीकर के तल पर स्थित वस्तु O का दर्पण से परावर्तन होने के बाद, प्रतिबिंब की दर्पण से दूरी है",
    options: ["15 cm", "12.5 cm", "7.5 cm", "10 cm"],
  },
  "6-1": {
    question: "दो तरंगों की तीव्रताओं का अनुपात 9 : 1 है। वे व्यतिकरण उत्पन्न कर रही हैं। अधिकतम और न्यूनतम तीव्रताओं का अनुपात होगा",
    options: ["10 : 8", "9 : 1", "4 : 1", "2 : 1"],
  },
  "6-2": {
    question: "दो कला-संबद्ध बिंदु स्रोत S₁ और S₂ चित्रानुसार एक छोटी दूरी 'd' से पृथक हैं। पर्दे पर प्राप्त धारियाँ होंगी",
    options: ["बिंदु", "सरल रेखाएँ", "अर्धवृत्त", "संकेंद्रित वृत्त"],
  },
  "7-1": {
    question: "यंग के द्वि-झिरी प्रयोग की दो अलग-अलग व्यवस्थाओं में, जब 1 : 2 अनुपात की तरंगदैर्घ्य वाले प्रकाशों का उपयोग किया जाता है, तो समान चौड़ाई की धारियाँ देखी जाती हैं। यदि दोनों स्थितियों में झिरियों के बीच की दूरी का अनुपात 2 : 1 है, तो दोनों व्यवस्थाओं में झिरियों के तल और पर्दे के बीच की दूरियों का अनुपात है",
    options: ["4 : 1", "1 : 1", "1 : 4", "2 : 1"],
  },
  "7-2": {
    question: "एक व्यतिकरण प्रयोग में, क्रमागत उच्चिष्ठों अथवा निम्निष्ठों के बीच की दूरी है (जहाँ प्रतीकों के सामान्य अर्थ हैं)",
    options: ["λd/D", "λD/d", "dD/λ", "λd/(4D)"],
  },
  "8-1": {
    question: "वायु से काँच (अपवर्तनांक n) पर परावर्तन के लिए जिस आपतन कोण पर परावर्तित प्रकाश पूर्णतः ध्रुवित हो जाता है, वह है",
    options: ["sin⁻¹(n)", "sin⁻¹(1/n)", "tan⁻¹(1/n)", "tan⁻¹(n)"],
  },
  "9-1": {
    question: "चित्र एक परमाणु के ऊर्जा-स्तर आरेख तथा उत्सर्जन में छह वर्णक्रमीय रेखाओं की उत्पत्ति को दर्शाता है (उदाहरणार्थ रेखा सं. 5 स्तर B से A में संक्रमण से उत्पन्न होती है)। निम्नलिखित में से कौन-सी वर्णक्रमीय रेखाएँ अवशोषण वर्णक्रम में भी उपस्थित होंगी",
    options: ["1, 4, 6", "4, 5, 6", "1, 2, 3", "1, 2, 3, 4, 5, 6"],
  },
  "10-1": {
    question: "रेडियम की अर्ध-आयु 1600 वर्ष है। 6400 वर्ष बाद रेडियम के किसी नमूने का शेष रहने वाला अंश है",
    options: ["1/4", "1/2", "1/8", "1/16"],
  },
  "10-2": {
    question: "ऋणात्मक बीटा क्षय के दौरान",
    options: ["परमाणु का एक इलेक्ट्रॉन उत्सर्जित होता है", "नाभिक के भीतर पहले से उपस्थित एक इलेक्ट्रॉन उत्सर्जित होता है", "नाभिक का एक न्यूट्रॉन क्षय होकर एक इलेक्ट्रॉन उत्सर्जित करता है", "बंधन ऊर्जा का एक भाग इलेक्ट्रॉन में परिवर्तित हो जाता है"],
  },
  "10-3": {
    question: "कुछ रेडियोधर्मी नाभिक उत्सर्जित कर सकते हैं",
    options: ["एक समय में केवल एक α, β या γ", "तीनों α, β और γ को एक के बाद एक", "तीनों α, β और γ को एक साथ", "केवल α और β को एक साथ"],
  },
  "11-1": {
    question: "नीचे दिखाए गए किसी पदार्थ के ऊर्जा-बैंड आरेख में, खाली वृत्त और भरे वृत्त क्रमशः होल और इलेक्ट्रॉन को दर्शाते हैं। पदार्थ है",
    options: ["एक p-प्रकार अर्धचालक", "एक कुचालक", "एक धातु", "एक n-प्रकार अर्धचालक"],
  },
  "11-2": {
    question: "P-प्रकार अर्धचालक में बहुसंख्यक और अल्पसंख्यक आवेश वाहक क्रमशः हैं",
    options: ["प्रोटॉन और इलेक्ट्रॉन", "इलेक्ट्रॉन और प्रोटॉन", "इलेक्ट्रॉन और होल", "होल और इलेक्ट्रॉन"],
  },
  "12-1": {
    question: "15 V के बराबर भंजन वोल्टेज वाला एक जेनर डायोड चित्र में दिखाए गए वोल्टेज नियामक परिपथ में उपयोग किया गया है। डायोड से प्रवाहित धारा है",
    options: ["20 mA", "5 mA", "10 mA", "15 mA"],
  },
  "12-2": {
    question: "दो आदर्श डायोड चित्र में दिखाए गए परिपथ के अनुसार एक बैटरी से जुड़े हैं। बैटरी द्वारा आपूर्ति की गई धारा है",
    options: ["0.75 A", "शून्य", "0.25 A", "0.5 A"],
  },
  "13-1": {
    question: "चित्र में दिखाए गए परिपथ से निर्गत 1 प्राप्त करने के लिए, निवेश होना चाहिए",
    options: ["A = 0, B = 1, C = 0", "A = 1, B = 0, C = 0", "A = 1, B = 0, C = 1", "A = 1, B = 1, C = 0"],
  },
  "13-2": {
    question: "निम्न चित्र दो निवेशों A और B तथा निर्गत Y वाला एक लॉजिक गेट परिपथ दिखाता है। A, B और निर्गत Y के वोल्टेज तरंगरूप दिए गए हैं। लॉजिक गेट है",
    options: ["NOR गेट", "OR गेट", "AND गेट", "NAND गेट"],
  },
  "14-1": {
    question: "यदि साधारण लोलक का गोलक 10 cm की ऊर्ध्वाधर ऊँचाई तक ऊपर उठने में सक्षम है, तो माध्य स्थिति पर गोलक का वेग क्या है (g = 9.8 m/s²)",
    options: ["2.2 m/s", "1.8 m/s", "1.4 m/s", "0.6 m/s"],
  },
  "14-2": {
    question: "द्रव्यमान 'm' के गोलक वाला एक साधारण लोलक A से C और वापस A तक इस प्रकार दोलन करता है कि PB का मान H है। यदि गुरुत्वीय त्वरण 'g' है, तो B से गुजरते समय गोलक का वेग है",
    options: ["mgH", "√(2gH)", "2gH", "शून्य"],
  },
  "15-1": {
    question: "क्रमशः T₁, T₂ और T₃ तापमान वाली तीन कृष्णिकाओं के लिए तीव्रता बनाम तरंगदैर्घ्य के आलेख चित्रानुसार हैं। उनके तापमान ऐसे हैं कि",
    options: ["T₁ > T₂ > T₃", "T₁ > T₃ > T₂", "T₂ > T₃ > T₁", "T₃ > T₂ > T₁"],
  },
  "16-1": {
    question: "एक ऊष्मागतिक निकाय चित्र में दिखाए अनुसार चक्रीय प्रक्रम ABCDA से गुजरता है। निकाय द्वारा किया गया कार्य है",
    options: ["P₀V₀", "2P₀V₀", "P₀V₀/2", "शून्य"],
  },
  "16-2": {
    question: "एक आदर्श गैस चक्र का P-V आलेख नीचे चित्रानुसार दिखाया गया है। रुद्धोष्म प्रक्रम को दर्शाया गया है",
    options: ["AB और BC", "AB और CD", "BC और DA", "BC और CD"],
  },
  "16-3": {
    question: "एक आदर्श एकपरमाणुक गैस को निम्न P-V आरेख में दिखाए अनुसार चक्र ABCDA पर ले जाया जाता है। चक्र के दौरान किया गया कार्य है",
    options: ["PV", "2PV", "4PV", "शून्य"],
  },
  "16-4": {
    question: "उपर्युक्त p-v आरेख एक आदर्श एकपरमाणुक गैस से चलने वाले इंजन के ऊष्मागतिक चक्र को दर्शाता है। एक चक्र में स्रोत से ली गई ऊष्मा की मात्रा है",
    options: ["p₀v₀", "(13/2)p₀v₀", "(11/2)p₀v₀", "4p₀v₀"],
  },
  "17-1": {
    question: "चित्र में दिखाए गए स्प्रिंग निकाय का बल नियतांक क्या होगा",
    options: ["K₁/2 + K₂", "[1/(2K₁) + 1/K₂]⁻¹", "1/(2K₁) + 1/K₂", "[2/K₁ + 1/K₁]⁻¹"],
  },
  "17-2": {
    question: "दो स्प्रिंगों के स्प्रिंग नियतांक Kₐ और Kᵦ हैं तथा Kₐ > Kᵦ है। उन्हें समान विस्तार तक खींचने के लिए आवश्यक कार्य होगा",
    options: ["स्प्रिंग A में अधिक", "स्प्रिंग B में अधिक", "दोनों में समान", "कुछ नहीं कहा जा सकता"],
  },
  "17-3": {
    question: "चित्र में दिखाए गए दो-स्प्रिंग निकाय का प्रभावी स्प्रिंग नियतांक होगा",
    options: ["K₁ + K₂", "K₁K₂/(K₁ + K₂)", "K₁ - K₂", "K₁K₂/(K₁ - K₂)"],
  },
  "18-1": {
    question: "निम्न चित्र में दिखाए अनुसार एक असंपीड्य द्रव क्षैतिज नली से बहता है। तब द्रव का वेग v है",
    options: ["3.0 m/s", "1.5 m/s", "1.0 m/s", "2.25 m/s"],
  },
  "18-2": {
    question: "असमान अनुप्रस्थ काट वाली क्षैतिज नली की M और N पर त्रिज्याएँ क्रमशः 0.1 m और 0.05 m हैं। द्रव के धारारेखी प्रवाह के लिए द्रव प्रवाह की दर है",
    options: ["समय के साथ निरंतर बदलती है", "M पर N की तुलना में अधिक", "N पर M की तुलना में अधिक", "M और N पर समान"],
  },
  "19-1": {
    question: "दो ग्रहों का औसत घनत्व समान है, परंतु उनकी त्रिज्याएँ R₁ और R₂ हैं। यदि इन ग्रहों पर गुरुत्वीय त्वरण क्रमशः g₁ और g₂ हों, तो",
    options: ["g₁/g₂ = R₁/R₂", "g₁/g₂ = R₂/R₁", "g₁/g₂ = R₁²/R₂²", "g₁/g₂ = R₁³/R₂³"],
  },
  "19-2": {
    question: "समान त्रिज्या वाली लोहे की एक गेंद और लकड़ी की एक गेंद को निर्वात में 'h' ऊँचाई से छोड़ा जाता है। दोनों द्वारा भूमि तक पहुँचने में लिया गया समय है",
    options: ["असमान", "बिल्कुल समान", "लगभग समान", "शून्य"],
  },
  "19-3": {
    question: "यदि पृथ्वी के पृष्ठ पर गुरुत्वीय त्वरण g है, तो पृथ्वी की त्रिज्या की दोगुनी ऊँचाई पर इसका मान है",
    options: ["g", "g/2", "g/3", "g/9"],
  },
  "20-1": {
    question: "एक ग्रह का द्रव्यमान और व्यास पृथ्वी के द्रव्यमान और व्यास के दोगुने हैं। इस ग्रह पर लोलक का दोलन काल होगा (यदि पृथ्वी पर वह सेकंड लोलक है)",
    options: ["1/√2 s", "2√2 s", "2 s", "1/2 s"],
  },
  "20-2": {
    question: "जिस ऊँचाई पर किसी पिंड का भार पृथ्वी के पृष्ठ पर उसके भार का 1/16 हो जाता है (पृथ्वी की त्रिज्या R), वह है",
    options: ["5R", "15R", "3R", "4R"],
  },
  "20-3": {
    question: "एक गोलाकार ग्रह का द्रव्यमान Mₚ और व्यास Dₚ है। इस ग्रह के पृष्ठ के निकट मुक्त रूप से गिरता हुआ द्रव्यमान m का कण जिस गुरुत्वीय त्वरण का अनुभव करेगा, वह बराबर है",
    options: ["4GMₚ/Dₚ²", "GMₚm/Dₚ²", "GMₚ/Dₚ²", "4GMₚm/Dₚ²"],
  },
};

const test = (
  number: number,
  title: [string, string],
  questions: BpscTre4Question[],
): BpscTre4Test => ({
  id: `test-${String(number).padStart(2, "0")}`,
  number,
  title,
  sourceImage: `/bpsc-tre-4/source-pages/test-${String(number).padStart(2, "0")}.jpg`,
  downloadPath: `/downloads/bpsc-tre-4-test-${String(number).padStart(2, "0")}.pdf`,
  questions: questions.map((question) => {
    const sourceEnglish = sourceEnglishQuestions[question.id];
    const sourceHindi = sourceHindiQuestions[question.id];
    if (!sourceEnglish || !sourceHindi) return question;

    return {
      ...question,
      question: [sourceEnglish.question, sourceHindi.question],
      options: question.options.map(
        (_option, index) => [sourceEnglish.options[index], sourceHindi.options[index]] as [string, string],
      ),
    };
  }),
});

export const bpscTre4Tests: BpscTre4Test[] = [
  test(1, ["Capacitance and Dielectrics", "धारिता और परावैद्युत"], [
    {
      id: "1-1",
      question: [
        "A parallel-plate capacitor of plate area A and separation t is filled side-by-side with dielectrics of constants k₁ and k₂, each covering half the area. Its capacitance is:",
        "प्लेट क्षेत्रफल A और दूरी t वाले समांतर-प्लेट संधारित्र में k₁ और k₂ परावैद्युतांक वाले पदार्थ आधे-आधे क्षेत्रफल में भरे हैं। इसकी धारिता है:",
      ],
      options: [
        ["ε₀A(k₁ + k₂)/t", "ε₀A(k₁ + k₂)/t"],
        ["ε₀A(k₁ + k₂)/(2t)", "ε₀A(k₁ + k₂)/(2t)"],
        ["2ε₀A(k₁ + k₂)/t", "2ε₀A(k₁ + k₂)/t"],
        ["ε₀A(k₁ − k₂)/(2t)", "ε₀A(k₁ − k₂)/(2t)"],
      ],
      correctOption: 1,
      explanation: [
        "The two half-area capacitors are in parallel, so C = ε₀k₁(A/2)/t + ε₀k₂(A/2)/t.",
        "आधे क्षेत्रफल वाले दोनों संधारित्र समांतर क्रम में हैं, इसलिए उनकी धारिताएँ जुड़ती हैं।",
      ],
    },
    {
      id: "1-2",
      question: [
        "Three capacitors, each of capacitance 2 F, are connected in series. The resultant capacitance is:",
        "2 F धारिता वाले तीन समान संधारित्र श्रेणीक्रम में जुड़े हैं। परिणामी धारिता है:",
      ],
      options: [["6 F", "6 F"], ["3/2 F", "3/2 F"], ["2/3 F", "2/3 F"], ["5 F", "5 F"]],
      correctOption: 2,
      explanation: ["For three equal capacitors in series, Cₑq = C/3 = 2/3 F.", "तीन समान संधारित्रों के श्रेणीक्रम में Cₑq = C/3 = 2/3 F होता है।"],
    },
    {
      id: "1-3",
      question: [
        "A dielectric slab of constant K and thickness 3d/4 is inserted between capacitor plates separated by d. Find C/C₀.",
        "d दूरी वाली संधारित्र प्लेटों के बीच K परावैद्युतांक तथा 3d/4 मोटाई की पट्टी रखी जाती है। C/C₀ ज्ञात करें।",
      ],
      options: [["3K/(K + 4)", "3K/(K + 4)"], ["3K/4", "3K/4"], ["4K/(K + 3)", "4K/(K + 3)"], ["4K/3", "4K/3"]],
      correctOption: 2,
      explanation: ["The effective gap is d/4 + 3d/(4K), giving C/C₀ = 4K/(K + 3).", "प्रभावी दूरी d/4 + 3d/(4K) है, अतः C/C₀ = 4K/(K + 3)।"],
    },
  ]),
  test(2, ["Electric Potential and Dipole", "विद्युत विभव और द्विध्रुव"], [
    {
      id: "2-1",
      question: [
        "Two concentric hollow spheres of radii r and R carry total charge Q such that their surface charge densities are equal. The potential at the common centre is:",
        "r और R त्रिज्या के दो समकेन्द्रीय खोखले गोलों पर कुल आवेश Q इस प्रकार है कि दोनों का पृष्ठीय आवेश घनत्व समान है। उभयनिष्ठ केंद्र पर विभव है:",
      ],
      options: [
        ["Q(R² + r²)/[4πε₀(R + r)]", "Q(R² + r²)/[4πε₀(R + r)]"],
        ["QR/(R + r)", "QR/(R + r)"],
        ["Zero", "शून्य"],
        ["Q(R + r)/[4πε₀(R² + r²)]", "Q(R + r)/[4πε₀(R² + r²)]"],
      ],
      correctOption: 3,
      explanation: ["Equal surface density makes the charges proportional to r² and R². Adding both shell potentials gives option D.", "समान पृष्ठीय घनत्व के कारण आवेश r² और R² के अनुपात में बँटते हैं। दोनों गोलों के विभव जोड़ने पर विकल्प D मिलता है।"],
    },
    {
      id: "2-2",
      question: [
        "For a dipole of moment p, the potential at a distant point r making angle θ with the dipole axis is:",
        "द्विध्रुव आघूर्ण p के लिए, द्विध्रुव अक्ष से θ कोण पर स्थित दूरस्थ बिंदु r का विभव है:",
      ],
      options: [
        ["p cos θ/(4πε₀r²)", "p cos θ/(4πε₀r²)"],
        ["p cos θ/(4πε₀r)", "p cos θ/(4πε₀r)"],
        ["p sin θ/(4πε₀r)", "p sin θ/(4πε₀r)"],
        ["p cos θ/(2πε₀r²)", "p cos θ/(2πε₀r²)"],
      ],
      correctOption: 0,
      explanation: ["The far-field dipole potential is V = p cos θ/(4πε₀r²).", "दूरस्थ बिंदु पर द्विध्रुव का विभव V = p cos θ/(4πε₀r²) होता है।"],
    },
  ]),
  test(3, ["Electric Field and Gauss Law", "विद्युत क्षेत्र और गाउस नियम"], [
    {
      id: "3-1",
      question: [
        "In the equipotential-line diagram on the source page, adjacent lines differ by 10 V and meet the x-axis 10 cm apart at 30°. The electric field is:",
        "स्रोत पृष्ठ के समविभव-रेखा चित्र में पास-पास की रेखाओं में 10 V का अंतर है और वे x-अक्ष को 10 cm दूरी पर 30° कोण से काटती हैं। विद्युत क्षेत्र है:",
      ],
      options: [
        ["100 V m⁻¹ along +x", "+x दिशा में 100 V m⁻¹"],
        ["100 V m⁻¹ along +y", "+y दिशा में 100 V m⁻¹"],
        ["200 V m⁻¹ at 120° to +x", "+x से 120° पर 200 V m⁻¹"],
        ["50 V m⁻¹ at 120° to +x", "+x से 120° पर 50 V m⁻¹"],
      ],
      correctOption: 2,
      explanation: ["The normal spacing is 10 cm × sin 30° = 5 cm, so E = 10/0.05 = 200 V m⁻¹ toward lower potential.", "अभिलंब दूरी 10 cm × sin 30° = 5 cm है, इसलिए E = 10/0.05 = 200 V m⁻¹ और दिशा कम विभव की ओर है।"],
    },
    {
      id: "3-2",
      question: [
        "Which graph on the source page correctly shows electric field E versus distance r for a uniformly charged solid sphere?",
        "समान रूप से आवेशित ठोस गोले के लिए विद्युत क्षेत्र E और दूरी r का सही ग्राफ स्रोत पृष्ठ पर कौन-सा है?",
      ],
      options: [
        ["Graph A", "ग्राफ A"], ["Graph B", "ग्राफ B"], ["Graph C", "ग्राफ C"], ["Graph D", "ग्राफ D"],
      ],
      correctOption: 2,
      explanation: ["Inside the sphere E ∝ r; outside it E ∝ 1/r², with a continuous maximum at the surface. This is graph C.", "गोले के भीतर E ∝ r तथा बाहर E ∝ 1/r² होता है और पृष्ठ पर क्षेत्र सतत अधिकतम होता है। यह ग्राफ C है।"],
    },
  ]),
  test(4, ["Refraction and Critical Angle", "अपवर्तन और क्रांतिक कोण"], [
    {
      id: "4-1",
      question: [
        "A ray travels from glass into water (μw = 4/3) and then emerges parallel to the water surface. If its incidence angle in glass is i, the refractive index of glass is:",
        "एक किरण काँच से जल (μw = 4/3) में जाती है और फिर जल की सतह के समांतर निकलती है। काँच में आपतन कोण i हो तो काँच का अपवर्तनांक है:",
      ],
      options: [["(4/3) sin i", "(4/3) sin i"], ["1/sin i", "1/sin i"], ["4/3", "4/3"], ["1", "1"]],
      correctOption: 1,
      explanation: ["At the water-air boundary the emerging angle is 90°, so μw sin r = 1. Snell's law at glass-water then gives μg sin i = 1.", "जल-वायु सीमा पर निर्गमन कोण 90° है, इसलिए μw sin r = 1। काँच-जल सीमा पर स्नेल नियम से μg sin i = 1 मिलता है।"],
    },
  ]),
  test(5, ["Refraction and Apparent Depth", "अपवर्तन और आभासी गहराई"], [
    {
      id: "5-1",
      question: [
        "A ray is incident at 45° on a glass slab (μ = 1.5) whose lower face is silvered. What is the deviation between the incident and final emergent directions?",
        "45° पर एक किरण काँच की पट्टी (μ = 1.5) पर गिरती है जिसकी निचली सतह रजतित है। आपतित और अंतिम निर्गत दिशा के बीच विचलन कितना है?",
      ],
      options: [["90°", "90°"], ["180°", "180°"], ["120°", "120°"], ["45°", "45°"]],
      correctOption: 0,
      explanation: ["For reflection at a plane silvered surface, the deviation is 180° - 2i. With i = 45°, the deviation is 180° - 90° = 90°.", "समतल रजतित सतह से परावर्तन के लिए विचलन 180° - 2i होता है। i = 45° रखने पर विचलन 180° - 90° = 90° होता है।"],
    },
    {
      id: "5-2",
      question: [
        "A plane mirror is 5 cm above water of depth 10 cm (μ = 4/3). An object is at the bottom. The image distance behind the mirror is:",
        "10 cm गहरे जल (μ = 4/3) की सतह से 5 cm ऊपर समतल दर्पण है। वस्तु तली पर है। दर्पण के पीछे प्रतिबिंब की दूरी है:",
      ],
      options: [["15 cm", "15 cm"], ["12.5 cm", "12.5 cm"], ["7.5 cm", "7.5 cm"], ["10 cm", "10 cm"]],
      correctOption: 1,
      explanation: ["The apparent water depth is 10/(4/3) = 7.5 cm; its optical distance from the mirror is 5 + 7.5 = 12.5 cm.", "जल की आभासी गहराई 10/(4/3) = 7.5 cm है; दर्पण से आभासी वस्तु की दूरी 5 + 7.5 = 12.5 cm है।"],
    },
  ]),
  test(6, ["Interference of Light", "प्रकाश का व्यतिकरण"], [
    {
      id: "6-1",
      question: ["Two coherent waves have intensity ratio 9:1. The ratio of maximum to minimum intensity is:", "दो कला-संबद्ध तरंगों की तीव्रताओं का अनुपात 9:1 है। अधिकतम और न्यूनतम तीव्रता का अनुपात है:"],
      options: [["10:8", "10:8"], ["9:1", "9:1"], ["4:1", "4:1"], ["2:1", "2:1"]],
      correctOption: 2,
      explanation: ["Amplitude ratio is 3:1, so Imax:Imin = (3 + 1)²:(3 − 1)² = 4:1.", "आयाम अनुपात 3:1 है, अतः Imax:Imin = (3 + 1)²:(3 − 1)² = 4:1।"],
    },
    {
      id: "6-2",
      question: ["Two coherent point sources lie on a line perpendicular to a screen. The interference fringes on the screen are:", "दो कला-संबद्ध बिंदु स्रोत पर्दे पर खींचे गए अभिलंब की एक ही रेखा पर हैं। पर्दे पर व्यतिकरण फ्रिंज होंगे:"],
      options: [["Points", "बिंदु"], ["Straight lines", "सीधी रेखाएँ"], ["Semicircles", "अर्धवृत्त"], ["Concentric circles", "समकेन्द्रीय वृत्त"]],
      correctOption: 3,
      explanation: ["Constant path-difference loci on the screen are circles centred on the common axis.", "पर्दे पर समान पथांतर वाले बिंदुओं के स्थान समकेन्द्रीय वृत्त बनाते हैं।"],
    },
  ]),
  test(7, ["Young's Double-Slit Experiment", "यंग का द्वि-झिरी प्रयोग"], [
    {
      id: "7-1",
      question: ["Two YDSE arrangements have equal fringe width. If λ₁:λ₂ = 1:2 and d₁:d₂ = 2:1, find D₁:D₂.", "दो YDSE व्यवस्थाओं में फ्रिंज चौड़ाई समान है। यदि λ₁:λ₂ = 1:2 तथा d₁:d₂ = 2:1 हो, तो D₁:D₂ ज्ञात करें।"],
      options: [["4:1", "4:1"], ["1:1", "1:1"], ["1:4", "1:4"], ["2:1", "2:1"]],
      correctOption: 0,
      explanation: ["Since β = λD/d is equal, D₁/D₂ = (d₁/λ₁)/(d₂/λ₂) = 4.", "β = λD/d समान है, इसलिए D₁/D₂ = (d₁/λ₁)/(d₂/λ₂) = 4।"],
    },
    {
      id: "7-2",
      question: ["In YDSE, the separation between successive maxima or successive minima is:", "YDSE में क्रमागत अधिकतम अथवा क्रमागत न्यूनतम के बीच की दूरी है:"],
      options: [["λd/D", "λd/D"], ["λD/d", "λD/d"], ["dD/λ", "dD/λ"], ["λd/(4D)", "λd/(4D)"]],
      correctOption: 1,
      explanation: ["The separation is the fringe width β = λD/d.", "यह दूरी फ्रिंज चौड़ाई β = λD/d के बराबर होती है।"],
    },
  ]),
  test(8, ["Polarisation and Brewster Law", "ध्रुवण और ब्रूस्टर नियम"], [
    {
      id: "8-1",
      question: ["For light incident from air on glass of refractive index n, the polarising angle is:", "वायु से n अपवर्तनांक वाले काँच पर आपतित प्रकाश के लिए ध्रुवण कोण है:"],
      options: [["sin⁻¹ n", "sin⁻¹ n"], ["sin⁻¹(1/n)", "sin⁻¹(1/n)"], ["tan⁻¹(1/n)", "tan⁻¹(1/n)"], ["tan⁻¹ n", "tan⁻¹ n"]],
      correctOption: 3,
      explanation: ["Brewster's law gives tan iₚ = n, hence iₚ = tan⁻¹ n.", "ब्रूस्टर नियम के अनुसार tan iₚ = n, अतः iₚ = tan⁻¹ n।"],
    },
  ]),
  test(9, ["Atomic Spectra", "परमाणु वर्णक्रम"], [
    {
      id: "9-1",
      question: ["For the energy-level diagram on the source page, which numbered emission lines also correspond to absorption lines when atoms start in the ground state X?", "स्रोत पृष्ठ के ऊर्जा-स्तर चित्र में, जब परमाणु मूल अवस्था X में हों तो कौन-सी क्रमांकित उत्सर्जन रेखाएँ अवशोषण रेखाओं के अनुरूप भी होंगी?"],
      options: [["1, 4 and 6", "1, 4 और 6"], ["4, 5 and 6", "4, 5 और 6"], ["1, 2 and 3", "1, 2 और 3"], ["All six", "सभी छह"]],
      correctOption: 2,
      explanation: ["Absorption from the ground state X can reach A, B or C, corresponding to the reverse of transitions 1, 2 and 3.", "मूल अवस्था X से अवशोषण द्वारा A, B या C पर जाया जा सकता है, जो संक्रमण 1, 2 और 3 के उलटे हैं।"],
    },
  ]),
  test(10, ["Radioactivity and Nuclear Physics", "रेडियोधर्मिता और नाभिकीय भौतिकी"], [
    {
      id: "10-1",
      question: ["The half-life of radium is 1600 years. The fraction remaining after 6400 years is:", "रेडियम की अर्ध-आयु 1600 वर्ष है। 6400 वर्ष बाद बचा अंश होगा:"],
      options: [["1/2", "1/2"], ["1/4", "1/4"], ["1/8", "1/8"], ["1/16", "1/16"]],
      correctOption: 3,
      explanation: ["6400 years equals four half-lives, so the remaining fraction is (1/2)⁴ = 1/16.", "6400 वर्ष चार अर्ध-आयु के बराबर है, इसलिए बचा अंश (1/2)⁴ = 1/16 है।"],
    },
    {
      id: "10-2",
      question: ["In negative beta decay:", "ऋणात्मक बीटा क्षय में:"],
      options: [
        ["An atomic electron is ejected", "परमाणु का एक इलेक्ट्रॉन बाहर निकलता है"],
        ["A pre-existing nuclear electron is ejected", "नाभिक में पहले से उपस्थित इलेक्ट्रॉन बाहर निकलता है"],
        ["A neutron decays and emits an electron", "एक न्यूट्रॉन क्षय होकर इलेक्ट्रॉन उत्सर्जित करता है"],
        ["Binding energy becomes an electron", "बंधन ऊर्जा इलेक्ट्रॉन में बदल जाती है"],
      ],
      correctOption: 2,
      explanation: ["In β⁻ decay a neutron converts into a proton while emitting an electron and an antineutrino.", "β⁻ क्षय में न्यूट्रॉन प्रोटॉन में बदलता है तथा इलेक्ट्रॉन और प्रतिन्यूट्रिनो उत्सर्जित होते हैं।"],
    },
    {
      id: "10-3",
      question: ["A radioactive nucleus may emit:", "एक रेडियोधर्मी नाभिक उत्सर्जित कर सकता है:"],
      options: [
        ["Only one of α, β or γ in its entire decay chain", "पूरी क्षय शृंखला में केवल α, β या γ में से एक"],
        ["α, β and γ one after another", "α, β और γ को क्रमशः"],
        ["α, β and γ simultaneously in one event", "एक ही घटना में α, β और γ को एक साथ"],
        ["Only α and β simultaneously", "केवल α और β को एक साथ"],
      ],
      correctOption: 1,
      explanation: ["A decay chain can include alpha and beta transitions followed by gamma de-excitation, so all three may occur successively.", "क्षय शृंखला में अल्फा और बीटा संक्रमणों के बाद गामा विसर्जन हो सकता है, इसलिए तीनों क्रमशः हो सकते हैं।"],
    },
  ]),
  test(11, ["Semiconductors", "अर्धचालक"], [
    {
      id: "11-1",
      question: ["The energy-band diagram on the source page has holes as the majority carriers. The material is:", "स्रोत पृष्ठ के ऊर्जा-बैंड चित्र में होल बहुसंख्यक वाहक हैं। पदार्थ है:"],
      options: [["p-type semiconductor", "p-प्रकार अर्धचालक"], ["Insulator", "कुचालक"], ["Metal", "धातु"], ["n-type semiconductor", "n-प्रकार अर्धचालक"]],
      correctOption: 0,
      explanation: ["A semiconductor with holes as majority carriers is p-type.", "जिस अर्धचालक में होल बहुसंख्यक वाहक होते हैं, वह p-प्रकार का होता है।"],
    },
    {
      id: "11-2",
      question: ["The majority and minority charge carriers in a p-type semiconductor are respectively:", "p-प्रकार अर्धचालक में क्रमशः बहुसंख्यक और अल्पसंख्यक आवेश वाहक हैं:"],
      options: [["Protons and electrons", "प्रोटॉन और इलेक्ट्रॉन"], ["Electrons and protons", "इलेक्ट्रॉन और प्रोटॉन"], ["Electrons and holes", "इलेक्ट्रॉन और होल"], ["Holes and electrons", "होल और इलेक्ट्रॉन"]],
      correctOption: 3,
      explanation: ["Holes are majority carriers and electrons are minority carriers in p-type material.", "p-प्रकार पदार्थ में होल बहुसंख्यक और इलेक्ट्रॉन अल्पसंख्यक वाहक होते हैं।"],
    },
  ]),
  test(12, ["Zener Diode and Rectifier Circuits", "जेनर डायोड और डायोड परिपथ"], [
    {
      id: "12-1",
      question: ["In the 15 V Zener regulator shown on the source page, a 20 V supply feeds a 250 Ω series resistor and a 1 kΩ load. The Zener current is:", "स्रोत पृष्ठ के 15 V जेनर नियामक में 20 V स्रोत, 250 Ω श्रेणी प्रतिरोध और 1 kΩ लोड है। जेनर धारा है:"],
      options: [["20 mA", "20 mA"], ["5 mA", "5 mA"], ["10 mA", "10 mA"], ["15 mA", "15 mA"]],
      correctOption: 1,
      explanation: ["Series current is (20 − 15)/250 = 20 mA and load current is 15/1000 = 15 mA, leaving 5 mA in the Zener.", "श्रेणी धारा (20 − 15)/250 = 20 mA और लोड धारा 15/1000 = 15 mA है, अतः जेनर धारा 5 mA है।"],
    },
    {
      id: "12-2",
      question: ["For the ideal-diode circuit on the source page, the current drawn from the 5 V battery is:", "स्रोत पृष्ठ के आदर्श-डायोड परिपथ में 5 V बैटरी से ली गई धारा है:"],
      options: [["0.75 A", "0.75 A"], ["Zero", "शून्य"], ["0.25 A", "0.25 A"], ["0.5 A", "0.5 A"]],
      correctOption: 3,
      explanation: ["D₁ is forward biased and D₂ is reverse biased, so the battery drives 5/10 = 0.5 A.", "D₁ अग्र अभिनत और D₂ पश्च अभिनत है, इसलिए बैटरी धारा 5/10 = 0.5 A है।"],
    },
  ]),
  test(13, ["Logic Gates", "लॉजिक गेट"], [
    {
      id: "13-1",
      question: ["In the logic circuit on the source page, an OR output of A and B is ANDed with C. Which input gives output 1?", "स्रोत पृष्ठ के लॉजिक परिपथ में A और B का OR आउटपुट, C के साथ AND किया गया है। कौन-सा इनपुट आउटपुट 1 देगा?"],
      options: [["A=0, B=1, C=0", "A=0, B=1, C=0"], ["A=1, B=0, C=0", "A=1, B=0, C=0"], ["A=1, B=0, C=1", "A=1, B=0, C=1"], ["A=1, B=1, C=0", "A=1, B=1, C=0"]],
      correctOption: 2,
      explanation: ["Y = (A OR B) AND C. Only option C makes both inputs of the AND gate equal to 1.", "Y = (A OR B) AND C है। केवल विकल्प C में AND गेट के दोनों इनपुट 1 हैं।"],
    },
    {
      id: "13-2",
      question: ["The input-output waveforms shown on the source page represent which gate?", "स्रोत पृष्ठ पर दिखाए गए इनपुट-आउटपुट तरंगरूप किस गेट को दर्शाते हैं?"],
      options: [["NOR", "NOR"], ["OR", "OR"], ["AND", "AND"], ["NAND", "NAND"]],
      correctOption: 3,
      explanation: ["The output is 0 only when both inputs are 1, which is the NAND truth table.", "आउटपुट केवल तब 0 है जब दोनों इनपुट 1 हैं; यह NAND गेट की सत्यता सारणी है।"],
    },
  ]),
  test(14, ["Mechanical Energy and Pendulum", "यांत्रिक ऊर्जा और लोलक"], [
    {
      id: "14-1",
      question: ["A pendulum bob rises 10 cm above its mean position. Taking g = 9.8 m s⁻², its speed at the mean position is:", "लोलक का गोलक अपनी माध्य स्थिति से 10 cm ऊपर उठता है। g = 9.8 m s⁻² लेने पर माध्य स्थिति में उसकी चाल है:"],
      options: [["0.7 m s⁻¹", "0.7 m s⁻¹"], ["0.98 m s⁻¹", "0.98 m s⁻¹"], ["1.4 m s⁻¹", "1.4 m s⁻¹"], ["1.96 m s⁻¹", "1.96 m s⁻¹"]],
      correctOption: 2,
      explanation: ["By energy conservation, v = √(2gh) = √(2 × 9.8 × 0.1) = 1.4 m s⁻¹.", "ऊर्जा संरक्षण से v = √(2gh) = √(2 × 9.8 × 0.1) = 1.4 m s⁻¹।"],
    },
    {
      id: "14-2",
      question: ["A pendulum of length H is released from the horizontal position. Its speed at the lowest point is:", "H लंबाई के लोलक को क्षैतिज स्थिति से छोड़ा जाता है। निम्नतम बिंदु पर उसकी चाल है:"],
      options: [["mgH", "mgH"], ["√(2gH)", "√(2gH)"], ["2gH", "2gH"], ["Zero", "शून्य"]],
      correctOption: 1,
      explanation: ["The bob falls through height H, so mgH = ½mv² and v = √(2gH).", "गोलक H ऊँचाई गिरता है, इसलिए mgH = ½mv² तथा v = √(2gH)।"],
    },
  ]),
  test(15, ["Blackbody Radiation", "कृष्णिका विकिरण"], [
    {
      id: "15-1",
      question: ["The blackbody curves on the source page peak at successively longer wavelengths for T₁, T₃ and T₂. The correct temperature order is:", "स्रोत पृष्ठ के कृष्णिका वक्रों में T₁, T₃ और T₂ के लिए शिखर क्रमशः अधिक तरंगदैर्ध्य पर हैं। तापमान का सही क्रम है:"],
      options: [["T₁ > T₂ > T₃", "T₁ > T₂ > T₃"], ["T₁ > T₃ > T₂", "T₁ > T₃ > T₂"], ["T₂ > T₃ > T₁", "T₂ > T₃ > T₁"], ["T₃ > T₂ > T₁", "T₃ > T₂ > T₁"]],
      correctOption: 1,
      explanation: ["Wien's law gives T ∝ 1/λmax, so the shortest-wavelength peak has the highest temperature.", "वीन नियम के अनुसार T ∝ 1/λmax, इसलिए सबसे कम शिखर तरंगदैर्ध्य का तापमान सबसे अधिक है।"],
    },
  ]),
  test(16, ["Thermodynamic Processes", "ऊष्मागतिक प्रक्रियाएँ"], [
    {
      id: "16-1",
      question: ["For the bow-tie cyclic P-V path ABCDA shown on the source page, the net work done is:", "स्रोत पृष्ठ पर दिखाए गए बो-टाई चक्रीय P-V पथ ABCDA में कुल किया गया कार्य है:"],
      options: [["P₀V₀", "P₀V₀"], ["2P₀V₀", "2P₀V₀"], ["P₀V₀/2", "P₀V₀/2"], ["Zero", "शून्य"]],
      correctOption: 3,
      explanation: ["The two equal triangular loops have opposite orientation, so their signed areas and net work cancel.", "दोनों समान त्रिभुजीय चक्रों की दिशाएँ विपरीत हैं, इसलिए उनके क्षेत्रफल-आधारित कार्य परस्पर कट जाते हैं।"],
    },
    {
      id: "16-2",
      question: ["In the P-V cycle shown on the source page, which pair represents adiabatic processes?", "स्रोत पृष्ठ के P-V चक्र में कौन-सा युग्म रुद्धोष्म प्रक्रियाओं को दर्शाता है?"],
      options: [["AB and BC", "AB और BC"], ["AB and CD", "AB और CD"], ["BC and DA", "BC और DA"], ["BC and CD", "BC और CD"]],
      correctOption: 2,
      explanation: ["Adiabatic curves are steeper than isothermal curves on a P-V diagram; here they are BC and DA.", "P-V आरेख में रुद्धोष्म वक्र समतापी वक्रों से अधिक तीव्र होते हैं; यहाँ वे BC और DA हैं।"],
    },
    {
      id: "16-3",
      question: ["For the rectangular P-V cycle with pressures P and 3P and volumes V and 3V, the net work is:", "P और 3P दाब तथा V और 3V आयतन वाले आयताकार P-V चक्र में कुल कार्य है:"],
      options: [["PV", "PV"], ["2PV", "2PV"], ["4PV", "4PV"], ["6PV", "6PV"]],
      correctOption: 2,
      explanation: ["Net work equals the enclosed area: (3P − P)(3V − V) = 4PV.", "कुल कार्य घिरे क्षेत्रफल के बराबर है: (3P − P)(3V − V) = 4PV।"],
    },
    {
      id: "16-4",
      question: ["For the monatomic ideal-gas rectangular cycle shown on the source page, the heat absorbed from the source is:", "स्रोत पृष्ठ पर एकपरमाणुक आदर्श गैस के आयताकार चक्र में स्रोत से ली गई ऊष्मा है:"],
      options: [["p₀v₀", "p₀v₀"], ["13p₀v₀/2", "13p₀v₀/2"], ["11p₀v₀/2", "11p₀v₀/2"], ["4p₀v₀", "4p₀v₀"]],
      correctOption: 1,
      explanation: ["Heat enters during isochoric heating (3p₀v₀/2) and isobaric expansion (5p₀v₀), totaling 13p₀v₀/2.", "ऊष्मा समआयतन तापन (3p₀v₀/2) और समदाबी प्रसार (5p₀v₀) में ली जाती है; कुल 13p₀v₀/2 है।"],
    },
  ]),
  test(17, ["Spring Combinations", "स्प्रिंग संयोजन"], [
    {
      id: "17-1",
      question: ["In the source-page arrangement, two springs K₁ are in parallel and this pair is in series with K₂. The equivalent spring constant is:", "स्रोत पृष्ठ की व्यवस्था में K₁ के दो स्प्रिंग समांतर हैं और यह युग्म K₂ के साथ श्रेणीक्रम में है। तुल्य स्प्रिंग नियतांक है:"],
      options: [["[1/K₁ + 1/K₂]⁻¹", "[1/K₁ + 1/K₂]⁻¹"], ["[1/(2K₁) + 1/K₂]⁻¹", "[1/(2K₁) + 1/K₂]⁻¹"], ["2K₁ + K₂", "2K₁ + K₂"], ["[2/K₁ + 1/K₂]⁻¹", "[2/K₁ + 1/K₂]⁻¹"]],
      correctOption: 1,
      explanation: ["The parallel pair has constant 2K₁; combining it in series with K₂ gives option B.", "समांतर युग्म का नियतांक 2K₁ है; इसे K₂ के साथ श्रेणीक्रम में जोड़ने पर विकल्प B मिलता है।"],
    },
    {
      id: "17-2",
      question: ["Two springs have Kₐ > Kᵦ and are stretched by the same distance x. Which spring stores more work/energy?", "दो स्प्रिंगों के लिए Kₐ > Kᵦ है और दोनों को समान दूरी x तक खींचा जाता है। किस स्प्रिंग में अधिक कार्य/ऊर्जा संचित होगी?"],
      options: [["Spring A", "स्प्रिंग A"], ["Spring B", "स्प्रिंग B"], ["Equal in both", "दोनों में समान"], ["Cannot be determined", "निर्धारित नहीं किया जा सकता"]],
      correctOption: 0,
      explanation: ["Stored energy is ½Kx², so the larger spring constant Kₐ stores more energy.", "संचित ऊर्जा ½Kx² है, इसलिए अधिक नियतांक Kₐ वाला स्प्रिंग अधिक ऊर्जा रखता है।"],
    },
    {
      id: "17-3",
      question: ["Two springs K₁ and K₂ are connected in series as shown on the source page. Their equivalent spring constant is:", "स्रोत पृष्ठ पर K₁ और K₂ स्प्रिंग श्रेणीक्रम में जुड़े हैं। उनका तुल्य स्प्रिंग नियतांक है:"],
      options: [["K₁ + K₂", "K₁ + K₂"], ["K₁K₂/(K₁ + K₂)", "K₁K₂/(K₁ + K₂)"], ["K₁ − K₂", "K₁ − K₂"], ["K₁K₂/(K₁ − K₂)", "K₁K₂/(K₁ − K₂)"]],
      correctOption: 1,
      explanation: ["For springs in series, 1/Kₑq = 1/K₁ + 1/K₂.", "श्रेणीक्रम में 1/Kₑq = 1/K₁ + 1/K₂ होता है।"],
    },
  ]),
  test(18, ["Fluid Continuity", "द्रव की सातत्य समीकरण"], [
    {
      id: "18-1",
      question: ["In the branching pipe shown on the source page, inlet area is A with speed 3 m s⁻¹. The two outlet areas are A and 1.5A; the first outlet speed is 1.5 m s⁻¹. The second outlet speed is:", "स्रोत पृष्ठ की शाखित नली में प्रवेश क्षेत्रफल A और चाल 3 m s⁻¹ है। निकास क्षेत्रफल A तथा 1.5A हैं; पहले निकास की चाल 1.5 m s⁻¹ है। दूसरे निकास की चाल है:"],
      options: [["3 m s⁻¹", "3 m s⁻¹"], ["2 m s⁻¹", "2 m s⁻¹"], ["1 m s⁻¹", "1 m s⁻¹"], ["0.5 m s⁻¹", "0.5 m s⁻¹"]],
      correctOption: 2,
      explanation: ["Continuity gives 3A = 1.5A + 1.5Av, hence v = 1 m s⁻¹.", "सातत्य समीकरण से 3A = 1.5A + 1.5Av, अतः v = 1 m s⁻¹।"],
    },
    {
      id: "18-2",
      question: ["For steady incompressible flow through the non-uniform tube shown, the volume flow rate at sections M and N is:", "दिखाई गई असमान नली में स्थिर असंपीड्य प्रवाह के लिए M और N अनुप्रस्थ काटों पर आयतन प्रवाह दर है:"],
      options: [["Changing with time", "समय के साथ बदलती"], ["Greater at M", "M पर अधिक"], ["Greater at N", "N पर अधिक"], ["The same at M and N", "M और N पर समान"]],
      correctOption: 3,
      explanation: ["For steady incompressible flow, Av is constant at every cross-section.", "स्थिर असंपीड्य प्रवाह में प्रत्येक अनुप्रस्थ काट पर Av नियत रहता है।"],
    },
  ]),
  test(19, ["Gravitation", "गुरुत्वाकर्षण"], [
    {
      id: "19-1",
      question: ["Two planets have the same average density and radii R₁ and R₂. The ratio of surface gravities g₁/g₂ is:", "दो ग्रहों का औसत घनत्व समान है तथा उनकी त्रिज्याएँ R₁ और R₂ हैं। पृष्ठीय गुरुत्वीय त्वरण का अनुपात g₁/g₂ है:"],
      options: [["R₁/R₂", "R₁/R₂"], ["R₂/R₁", "R₂/R₁"], ["R₁²/R₂²", "R₁²/R₂²"], ["1", "1"]],
      correctOption: 0,
      explanation: ["For equal density, M ∝ R³ and g = GM/R² ∝ R.", "समान घनत्व पर M ∝ R³ तथा g = GM/R² ∝ R होता है।"],
    },
    {
      id: "19-2",
      question: ["An iron ball and a wooden ball of the same radius are released from the same height in vacuum. Their fall times are:", "समान त्रिज्या की लोहे और लकड़ी की गेंद को निर्वात में समान ऊँचाई से छोड़ा जाता है। उनके गिरने के समय होंगे:"],
      options: [["Smaller for iron", "लोहे के लिए कम"], ["Exactly equal", "बिल्कुल समान"], ["Smaller for wood", "लकड़ी के लिए कम"], ["Dependent on density", "घनत्व पर निर्भर"]],
      correctOption: 1,
      explanation: ["In vacuum all bodies have the same gravitational acceleration, independent of mass or material.", "निर्वात में सभी पिंडों का गुरुत्वीय त्वरण समान होता है और द्रव्यमान या पदार्थ पर निर्भर नहीं करता।"],
    },
    {
      id: "19-3",
      question: ["At a height equal to twice Earth's radius above the surface, acceleration due to gravity is:", "पृथ्वी के पृष्ठ से पृथ्वी की त्रिज्या के दोगुने ऊँचाई पर गुरुत्वीय त्वरण है:"],
      options: [["g/3", "g/3"], ["g/4", "g/4"], ["g/6", "g/6"], ["g/9", "g/9"]],
      correctOption: 3,
      explanation: ["The distance from Earth's centre is 3R, so g′ = g(R/3R)² = g/9.", "पृथ्वी के केंद्र से दूरी 3R है, इसलिए g′ = g(R/3R)² = g/9।"],
    },
  ]),
  test(20, ["Gravitation and Satellites", "गुरुत्वाकर्षण और ग्रह"], [
    {
      id: "20-1",
      question: ["A planet has twice Earth's mass and twice Earth's diameter. The period of a seconds pendulum of the same length on that planet is:", "एक ग्रह का द्रव्यमान और व्यास पृथ्वी के दोगुने हैं। उसी लंबाई के सेकंड लोलक का उस ग्रह पर आवर्तकाल होगा:"],
      options: [["√2 s", "√2 s"], ["2√2 s", "2√2 s"], ["4 s", "4 s"], ["1 s", "1 s"]],
      correctOption: 1,
      explanation: ["Its surface gravity is g/2, so T′ = T√(g/g′) = 2√2 s.", "उस ग्रह का पृष्ठीय गुरुत्व g/2 है, अतः T′ = T√(g/g′) = 2√2 s।"],
    },
    {
      id: "20-2",
      question: ["At what height above Earth's surface does an object's weight become 1/16 of its surface value?", "पृथ्वी के पृष्ठ से कितनी ऊँचाई पर किसी वस्तु का भार पृष्ठीय मान का 1/16 हो जाता है?"],
      options: [["R", "R"], ["2R", "2R"], ["3R", "3R"], ["4R", "4R"]],
      correctOption: 2,
      explanation: ["(R/(R+h))² = 1/16 gives R + h = 4R, hence h = 3R.", "(R/(R+h))² = 1/16 से R + h = 4R, अतः h = 3R।"],
    },
    {
      id: "20-3",
      question: ["For a spherical planet of mass Mₚ and diameter Dₚ, the acceleration due to gravity at its surface is:", "Mₚ द्रव्यमान और Dₚ व्यास वाले गोलाकार ग्रह के पृष्ठ पर गुरुत्वीय त्वरण है:"],
      options: [["4GMₚ/Dₚ²", "4GMₚ/Dₚ²"], ["GMₚm/Dₚ²", "GMₚm/Dₚ²"], ["GMₚ/Dₚ²", "GMₚ/Dₚ²"], ["4GMₚm/Dₚ²", "4GMₚm/Dₚ²"]],
      correctOption: 0,
      explanation: ["The radius is Dₚ/2, so g = GMₚ/(Dₚ/2)² = 4GMₚ/Dₚ².", "त्रिज्या Dₚ/2 है, इसलिए g = GMₚ/(Dₚ/2)² = 4GMₚ/Dₚ²।"],
    },
  ]),
];

export const bpscTre4QuestionCount = bpscTre4Tests.reduce(
  (total, currentTest) => total + currentTest.questions.length,
  0,
);

const questionFigureCrops: Partial<Record<string, BpscQuestionFigureCrop>> = {
  "1-1": { x: 400, y: 245, width: 390, height: 300, alt: ["Parallel-plate capacitor filled with two dielectrics", "दो परावैद्युत पदार्थों से भरे समांतर-प्लेट संधारित्र का चित्र"] },
  "3-1": { x: 185, y: 205, width: 680, height: 235, alt: ["Equipotential lines crossing the coordinate axes", "निर्देशांक अक्षों को काटती समविभव रेखाओं का चित्र"] },
  "3-2": { x: 85, y: 865, width: 800, height: 440, alt: ["Four electric-field versus distance graph options", "विद्युत क्षेत्र और दूरी के चार आलेख विकल्प"] },
  "4-1": { x: 495, y: 580, width: 400, height: 350, alt: ["Ray passing through glass and water", "काँच और पानी से गुजरती प्रकाश किरण का चित्र"] },
  "5-1": { x: 485, y: 435, width: 365, height: 240, alt: ["Ray incident on a silvered glass slab", "रजतित काँच की पट्टी पर आपतित किरण का चित्र"] },
  "5-2": { x: 380, y: 915, width: 520, height: 265, alt: ["Object in water with a plane mirror above it", "पानी में वस्तु और उसके ऊपर समतल दर्पण का चित्र"] },
  "6-2": { x: 190, y: 750, width: 510, height: 255, alt: ["Two coherent sources and a screen", "दो कला-संबद्ध स्रोत और पर्दे का चित्र"] },
  "9-1": { x: 175, y: 640, width: 540, height: 240, alt: ["Atomic energy levels and spectral transitions", "परमाणु ऊर्जा स्तर और स्पेक्ट्रमी संक्रमण का चित्र"] },
  "11-1": { x: 535, y: 415, width: 370, height: 355, alt: ["Semiconductor energy-band diagram", "अर्धचालक ऊर्जा-बैंड का चित्र"] },
  "12-1": { x: 270, y: 270, width: 460, height: 310, alt: ["Zener-diode voltage regulator circuit", "जेनर डायोड वोल्टेज नियामक परिपथ"] },
  "12-2": { x: 245, y: 870, width: 470, height: 280, alt: ["Circuit containing two ideal diodes", "दो आदर्श डायोड वाला परिपथ"] },
  "13-1": { x: 300, y: 195, width: 440, height: 190, alt: ["Combined OR and AND logic-gate circuit", "OR और AND लॉजिक गेट का संयुक्त परिपथ"] },
  "13-2": { x: 220, y: 640, width: 600, height: 615, alt: ["Logic-gate input and output waveforms", "लॉजिक गेट के इनपुट और आउटपुट तरंगरूप"] },
  "14-1": { x: 475, y: 345, width: 280, height: 265, alt: ["Pendulum moving between its extreme positions", "चरम स्थितियों के बीच चलता लोलक"] },
  "14-2": { x: 210, y: 820, width: 445, height: 205, alt: ["Pendulum path from A to C through B", "A से C तक B से होकर जाने वाला लोलक पथ"] },
  "15-1": { x: 280, y: 610, width: 370, height: 240, alt: ["Blackbody intensity versus wavelength curves", "कृष्णिका तीव्रता और तरंगदैर्घ्य के आलेख"] },
  "16-1": { x: 420, y: 100, width: 370, height: 235, alt: ["Bow-tie cyclic process on a pressure-volume graph", "दाब-आयतन आलेख पर बो-टाई चक्रीय प्रक्रम"] },
  "16-2": { x: 445, y: 430, width: 395, height: 200, alt: ["Ideal-gas cycle on a pressure-volume graph", "दाब-आयतन आलेख पर आदर्श गैस चक्र"] },
  "16-3": { x: 450, y: 745, width: 340, height: 260, alt: ["Rectangular pressure-volume cycle ABCD", "आयताकार दाब-आयतन चक्र ABCD"] },
  "16-4": {
    x: 500,
    y: 1135,
    width: 410,
    height: 250,
    alt: ["Rectangular engine cycle on a pressure-volume graph", "दाब-आयतन आलेख पर आयताकार इंजन चक्र"],
    masks: [{ x: 660, y: 1135, width: 250, height: 50 }],
  },
  "17-1": { x: 535, y: 195, width: 275, height: 450, alt: ["Parallel springs connected in series with another spring", "एक अन्य स्प्रिंग के साथ श्रेणीक्रम में जुड़े समांतर स्प्रिंग"] },
  "17-3": { x: 260, y: 990, width: 500, height: 220, alt: ["Two springs connected in series", "श्रेणीक्रम में जुड़े दो स्प्रिंग"] },
  "18-1": { x: 120, y: 300, width: 780, height: 270, alt: ["Fluid flow through a branching horizontal tube", "शाखाओं वाली क्षैतिज नली में द्रव प्रवाह"] },
  "18-2": { x: 250, y: 805, width: 520, height: 195, alt: ["Fluid flow through a non-uniform tube", "असमान नली में द्रव प्रवाह"] },
};

export const bpscTre4AllQuestions = bpscTre4Tests.flatMap((sourceTest) =>
  sourceTest.questions.map((question) => ({
    ...question,
    sourceImage: sourceTest.sourceImage,
    sourcePage: sourceTest.number,
    figure: questionFigureCrops[question.id],
  })),
);
